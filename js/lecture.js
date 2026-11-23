// Lecture player: plays a lesson's `lecture` beats. Each beat speaks one line (Google TTS via
// /api/tts/<id>, or a timed caption without audio) while its block lands on the board; guided and
// quiz beats wait for the student. See CONTENT.md "Lectures".

import { h, store } from './util.js';
import { renderBlock } from './blocks.js';
import { ttsId, readingMs, boardBlock } from './lecture-core.js';

let healthP = null;
const health = () => (healthP ||= fetch('/api/health').then((r) => r.json()).catch(() => ({})));
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const SPEEDS = [1, 1.25, 1.5];
const EXERCISE = new Set(['guided', 'quiz']);

export function mountLecture(container, lesson, ctx) {
  const beats = lesson.lecture;
  const resumeKey = `lecture:${ctx.key}`;
  let pos = 0;          // current beat
  let applied = 0;      // beats whose board effects are on the board
  let playing = false;
  let token = 0;        // bumped on every pause/jump; stale async work checks it and stops
  let audio = null;
  let speed = store.get('lecture:speed', 1);
  let sound = store.get('lecture:sound', true);
  let lastSteps = null; // latest derive/steps element on the board
  let lastWidget = null;
  const items = [];     // board element per beat (or null)

  const board = h('div', { class: 'lec-board' });
  const caption = h('div', { class: 'lec-caption', 'aria-live': 'polite' });
  const count = h('span', { class: 'lec-count muted small' });
  const bar = h('div', { class: 'lec-progress' }, h('i'));
  const btn = (label, title, onclick) => h('button', { class: 'btn btn-small btn-ghost', type: 'button', title, 'aria-label': title, onclick }, label);
  const playBtn = h('button', { class: 'btn btn-small btn-primary lec-play', type: 'button', onclick: () => (playing ? pause() : play()) }, '▶ Start lecture');
  const speedBtn = btn(`${speed}×`, 'Playback speed', () => { speed = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length]; store.set('lecture:speed', speed); if (audio) audio.playbackRate = speed; ui(); });
  const soundBtn = btn('', 'Sound on/off', () => { sound = !sound; store.set('lecture:sound', sound); if (!sound && audio) audio.pause(); if (playing) playFrom(pos); ui(); });
  const prevBtn = btn('⏮', 'Previous beat (←)', () => go(Math.max(0, pos - 1)));
  const nextBtn = btn('⏭', 'Next beat (→)', () => { if (pos < beats.length - 1) go(pos + 1); });
  const dock = h('div', { class: 'lec-dock' }, caption, h('div', { class: 'lec-controls' }, prevBtn, playBtn, nextBtn, speedBtn, soundBtn, count), bar);
  const root = h('div', { class: 'lecture' }, board, dock);
  container.appendChild(root);

  const saved = store.get(resumeKey, 0);
  caption.textContent = saved > 0 && saved < beats.length ? `You stopped at step ${saved + 1} of ${beats.length}.` : 'Press play: the lecture talks you through this lesson step by step and stops for exercises.';
  if (saved > 0 && saved < beats.length) {
    dock.querySelector('.lec-controls').insertBefore(h('button', { class: 'btn btn-small', type: 'button', onclick: (e) => { e.target.remove(); go(saved, true); } }, `Resume from step ${saved + 1}`), playBtn);
  }

  function ui() {
    playBtn.textContent = playing ? '⏸ Pause' : applied === 0 ? '▶ Start lecture' : pos >= beats.length - 1 && applied >= beats.length && !playing ? '↺ Replay' : '▶ Play';
    speedBtn.textContent = `${speed}×`;
    soundBtn.textContent = sound ? '🔊' : '🔇';
    count.textContent = `${Math.min(pos + 1, beats.length)} / ${beats.length}`;
    bar.firstChild.style.width = `${(100 * Math.min(pos + 1, beats.length)) / beats.length}%`;
  }

  const blockCtx = (beat, i) => (typeof beat.show === 'number'
    ? { key: ctx.key, module: ctx.module, index: beat.show }
    : { key: `${ctx.key}/lecture`, module: ctx.module, index: i });

  // put beat i's effects on the board; silent = no animation (used when rebuilding)
  async function apply(i, silent) {
    const beat = beats[i];
    if (beat.clear) { board.querySelectorAll('.lec-item').forEach((el) => el.classList.add('lec-old')); board.appendChild(h('hr', { class: 'lec-break' })); }
    const block = boardBlock(lesson, beat);
    items[i] = null;
    if (block) {
      const el = h('div', { class: `lec-item${silent ? '' : ' lec-new'}` }, renderBlock(block, blockCtx(beat, i)));
      el.dataset.kind = block.type;
      board.appendChild(el);
      items[i] = el;
      if (block.type === 'derive' || block.type === 'steps') lastSteps = el;
      if (block.type === 'widget') lastWidget = el;
      if (EXERCISE.has(block.type)) el.addEventListener('block:done', () => { el.dataset.done = '1'; }, { once: true });
    }
    if (beat.step !== undefined && lastSteps) await advance(lastSteps, beat.step, silent);
    if (beat.set && lastWidget) await setSliders(lastWidget, beat.set, silent);
  }

  async function advance(el, step, silent) {
    const d = el.querySelector('.blk-derive');
    if (d?.lecture) {
      if (silent) d.lecture.revealTo(step);
      else while (d.lecture.shown() <= step) { const before = d.lecture.shown(); await d.lecture.next(); if (d.lecture.shown() === before) break; }
      return;
    }
    const list = el.querySelector('.steps-list');
    while (list && list.children.length <= step) { const b = el.querySelector('.steps-controls .btn'); if (!b) break; b.click(); }
  }

  async function setSliders(el, set, silent) {
    // widgets mount on the next animation frame, so wait for the sliders to exist
    for (let n = 0; n < 60 && !el.querySelector('[data-param]'); n++) await new Promise((r) => requestAnimationFrame(r));
    const jobs = Object.entries(set).map(([k, to]) => {
      const inp = el.querySelector(`[data-param="${k}"] input[type=range]`);
      if (!inp) return null;
      const from = +inp.value, t0 = performance.now(), dur = silent || reducedMotion() ? 0 : 1200;
      return new Promise((done) => {
        const frame = (now) => {
          const u = dur ? Math.min(1, (now - t0) / dur) : 1;
          inp.value = from + (to - from) * (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2);
          inp.dispatchEvent(new Event('input'));
          if (u < 1) requestAnimationFrame(frame); else done();
        };
        requestAnimationFrame(frame);
      });
    });
    await Promise.all(jobs);
  }

  const sleep = (ms, my) => new Promise((r) => { const t0 = Date.now(); const tick = () => (my !== token || Date.now() - t0 >= ms ? r() : setTimeout(tick, 100)); tick(); });

  function stopAudio() { if (audio) { audio.pause(); audio.src = ''; audio = null; } }

  async function speak(i, my) {
    const say = beats[i].say;
    const { tts, ttsVoice } = await health();
    if (sound && tts) {
      try {
        const url = `/api/tts/${await ttsId(ttsVoice, say)}`;
        if (my !== token) return;
        audio = new Audio(url);
        audio.playbackRate = speed;
        const a = audio;
        const ended = new Promise((r) => { a.onended = () => r(true); a.onerror = () => r(false); });
        await a.play();
        prefetch(i + 1, ttsVoice);
        const ok = await Promise.race([ended, new Promise((r) => { const t = setInterval(() => { if (my !== token) { clearInterval(t); r(true); } }, 150); ended.then(() => clearInterval(t)); })]);
        if (ok) return;
      } catch (e) { console.warn('lecture audio failed, using captions', e); }
      if (my !== token) return;
    }
    await sleep(readingMs(say) / speed, my);
  }

  async function prefetch(i, voice) {
    if (i < beats.length) fetch(`/api/tts/${await ttsId(voice, beats[i].say)}`).catch(() => {});
  }

  function waitExercise(el, my) {
    return new Promise((r) => { const tick = () => (my !== token || el.dataset.done ? r() : setTimeout(tick, 200)); tick(); });
  }

  function focusBeat(i) {
    board.querySelectorAll('.lec-current').forEach((el) => el.classList.remove('lec-current'));
    const el = items[i] || items.slice(0, i + 1).reverse().find(Boolean);
    if (!el) return;
    el.classList.add('lec-current');
    el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
  }

  async function runBeat(i, my) {
    pos = i;
    store.set(resumeKey, i);
    caption.textContent = beats[i].say;
    ui();
    const effects = applied <= i ? (applied = i + 1, apply(i, false)) : null;
    focusBeat(i);
    await Promise.all([speak(i, my), effects]);
    if (my !== token) return;
    const el = items[i];
    if (el && EXERCISE.has(el.dataset.kind) && !el.dataset.done) {
      caption.textContent = `${beats[i].say}  (Your turn: the lecture continues when you finish.)`;
      await waitExercise(el, my);
    }
  }

  async function playFrom(i) {
    const my = ++token;
    stopAudio();
    playing = true;
    ui();
    for (let k = i; k < beats.length; k++) {
      await runBeat(k, my);
      if (my !== token) return;
    }
    playing = false;
    store.set(resumeKey, 0);
    caption.textContent = 'End of the lecture. Scroll up to review the board, or mark the lesson complete below.';
    ui();
  }

  function play() {
    if (applied >= beats.length && pos >= beats.length - 1 && !playing) { go(0, true); return; }
    playFrom(pos);
  }
  function pause() { token++; playing = false; stopAudio(); ui(); }

  // jump to beat i: rebuild the board up to it without sound, then play (or show) it
  function go(i, autoplay = playing) {
    token++;
    stopAudio();
    if (i < applied) {
      board.innerHTML = ''; applied = 0; lastSteps = lastWidget = null; items.length = 0;
    }
    for (let k = applied; k < i; k++) apply(k, true);
    applied = Math.max(applied, i);
    pos = i;
    if (autoplay) { playFrom(i); return; }
    apply(i, true); applied = i + 1;
    caption.textContent = beats[i].say;
    focusBeat(i);
    ui();
  }

  const onKey = (e) => {
    if (e.target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
    if (e.key === ' ') { e.preventDefault(); playing ? pause() : play(); } else if (e.key === 'ArrowRight') nextBtn.click(); else if (e.key === 'ArrowLeft') prevBtn.click();
  };
  window.addEventListener('keydown', onKey);
  function destroy() { token++; playing = false; stopAudio(); window.removeEventListener('keydown', onKey); window.removeEventListener('hashchange', destroy); }
  window.addEventListener('hashchange', destroy);
  ui();
  return { destroy };
}
