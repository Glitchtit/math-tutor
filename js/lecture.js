// Lecture player: plays a lesson's `lecture` beats. Each beat speaks one line (Google TTS via
// /api/tts/<id>, or a timed caption without audio) while its block lands on the board; guided and
// quiz beats wait for the student. See CONTENT.md "Lectures".

import { h, store } from './util.js';
import { renderBlock } from './blocks.js';
import { ttsId, readingMs, boardBlock } from './lecture-core.js';

let healthP = null;
const health = () => (healthP ||= fetch('/api/health').then((r) => r.json()).catch(() => { healthP = null; return {}; }));
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const EXERCISE = new Set(['guided', 'quiz']);

export function mountLecture(container, lesson, ctx) {
  const beats = lesson.lecture;
  const resumeKey = `lecture:${ctx.key}`;
  let pos = 0;          // current beat
  let applied = 0;      // beats whose board effects are on the board
  let playing = false;
  let token = 0;        // bumped on every pause/jump; stale async work checks it and stops
  const audio = new Audio(); // one element reused for every line: iOS only lets a gesture-started element play
  let audioOn = false;
  const ids = new Map(); // spoken text → tts id, filled at mount so a click can start audio synchronously
  const idOf = async (text) => { if (!ids.has(text)) { const { tts, ttsVoice } = await health(); if (tts && ttsVoice) ids.set(text, await ttsId(ttsVoice, text)); } return ids.get(text); };
  (async () => { for (const b of beats) { await idOf(b.say); for (const m of Object.values(b.moves || {})) await idOf(m); } })();
  let speed = Math.min(2, Math.max(0.75, +store.get('lecture:speed', 1) || 1));
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
  const speedVal = h('span', { class: 'lec-speed-val' });
  const speedIn = h('input', { type: 'range', min: 0.75, max: 2, step: 0.05, value: speed, 'aria-label': 'Narration speed' });
  speedIn.addEventListener('input', () => { speed = +speedIn.value; store.set('lecture:speed', speed); audio.playbackRate = speed; ui(); });
  const speedBtn = h('label', { class: 'lec-speed', title: 'Narration speed' }, h('span', { class: 'muted small' }, 'Speed'), speedIn, speedVal);
  const soundBtn = btn('', 'Sound on/off', () => { sound = !sound; store.set('lecture:sound', sound); if (!sound) audio.pause(); if (playing) playFrom(pos); ui(); });
  const prevBtn = btn('⏮', 'Previous beat (←)', () => go(Math.max(0, pos - 1)));
  const nextBtn = btn('⏭', 'Next beat (→)', () => { if (pos < beats.length - 1) go(pos + 1); });
  const dock = h('div', { class: 'lec-dock' }, caption, h('div', { class: 'lec-controls' }, prevBtn, playBtn, nextBtn, speedBtn, soundBtn, count), bar);
  const root = h('div', { class: 'lecture' }, board, dock);
  container.appendChild(root);

  const saved = store.get(resumeKey, 0);
  caption.textContent = saved > 0 && saved < beats.length ? `You stopped at step ${saved + 1} of ${beats.length}.` : 'Press play: the lecture talks you through this lesson step by step and stops for exercises.';
  if (saved > 0 && saved < beats.length) {
    dock.querySelector('.lec-controls').insertBefore(h('button', { class: 'btn btn-small lec-resume', type: 'button', onclick: (e) => { e.target.remove(); unlockAudio(saved); go(saved, true); } }, `Resume from step ${saved + 1}`), playBtn);
  }

  function ui() {
    playBtn.textContent = playing ? '⏸ Pause' : applied === 0 ? '▶ Start lecture' : pos >= beats.length - 1 && applied >= beats.length && !playing ? '↺ Replay' : '▶ Play';
    speedVal.textContent = `${+speed.toFixed(2)}×`;
    soundBtn.textContent = sound ? '🔊' : '🔇';
    count.textContent = `${Math.min(pos + 1, beats.length)} / ${beats.length}`;
    bar.firstChild.style.width = `${(100 * Math.min(pos + 1, beats.length)) / beats.length}%`;
  }

  const blockCtx = (beat, i) => (typeof beat.show === 'number'
    ? { key: ctx.key, module: ctx.module, index: beat.show }
    : { key: `${ctx.key}/lecture`, module: ctx.module, index: i });

  // put beat i's effects on the board; silent = no animation (used when rebuilding)
  async function apply(i, silent, narrate = null) {
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
      if (block.type === 'derive' && beat.step === undefined) el.firstChild.dataset.firstPlayed = '1'; // shown without narration: step 0 stays still
      if (block.type === 'widget') lastWidget = el;
      if (EXERCISE.has(block.type)) el.addEventListener('block:done', () => { el.dataset.done = '1'; }, { once: true });
    }
    if (beat.step !== undefined && lastSteps) { if (narrate) { await new Promise((r) => requestAnimationFrame(r)); focusBeat(i, !lastSteps.querySelector('.blk-derive')); const cur = lastSteps.querySelector('.derive-steps > li:last-child'); if (cur) scrollTo(cur); await narrate.beforeStep(); } await advance(lastSteps, beat.step, silent, narrate?.onMove); }
    else if (narrate) await narrate.beforeStep();
    if (beat.set && lastWidget) await setSliders(lastWidget, beat.set, silent);
    else if (!silent && block?.type === 'widget') await autoAnimate(items[i]);
  }

  async function advance(el, step, silent, onMove = null) {
    const d = el.querySelector('.blk-derive');
    if (d?.lecture) {
      // step 0 is on screen as soon as the block lands; in a live beat play its animation once too
      if (!silent && !d.dataset.firstPlayed) { d.dataset.firstPlayed = '1'; await d.lecture.playFirst(onMove, scrollTo); }
      if (silent) { d.dataset.firstPlayed = '1'; d.lecture.revealTo(step); }
      else while (d.lecture.shown() <= step) { const before = d.lecture.shown(); await d.lecture.next(onMove, scrollTo); if (d.lecture.shown() === before) break; }
      return;
    }
    const list = el.querySelector('.steps-list');
    while (list && list.children.length <= step) { const b = el.querySelector('.steps-controls .btn'); if (!b) break; b.click(); }
    if (!silent && list?.lastElementChild) scrollTo(list.lastElementChild);
  }

  // a widget's own animation ("Approach a", "Sweep", …) plays once when it lands; the beat waits for it
  async function autoAnimate(el) {
    let btn = null;
    for (let n = 0; n < 60 && !(btn = el.querySelector('.widget-anim')); n++) await new Promise((r) => requestAnimationFrame(r));
    if (!btn || btn.dataset.loop || reducedMotion()) return;
    await new Promise((r) => setTimeout(r, 600)); // let the student see the start first
    btn.click();
    const t0 = Date.now();
    while (btn.isConnected && !btn.textContent.startsWith('▶') && Date.now() - t0 < 15000) await new Promise((r) => setTimeout(r, 150));
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

  function stopAudio() { audioOn = false; audio.pause(); }
  // called synchronously from a click so the browser counts the element as user-started
  function unlockAudio(i) { const id = ids.get(beats[i]?.say); if (sound && id) { audio.src = `/api/tts/${id}`; audio.play().catch(() => {}); } }

  // speak one line (TTS, or a timed caption without audio); prefetch = lines likely needed next
  async function speakText(text, my, prefetch = []) {
    const { tts } = await health();
    if (sound && tts) {
      try {
        const id = await idOf(text);
        if (my !== token) return;
        const url = `/api/tts/${id}`;
        if (!audio.src.endsWith(url)) audio.src = url;
        audio.currentTime = 0;
        audio.playbackRate = speed;
        audioOn = true;
        const ended = new Promise((r) => { audio.onended = () => r(true); audio.onerror = () => r(false); });
        // a stalled server never blocks the lecture: give up after 20 s and use the caption timing
        const started = await Promise.race([audio.play().then(() => true), new Promise((r) => setTimeout(() => r(false), 20000))]);
        if (started) {
          prefetch.forEach(async (t) => fetch(`/api/tts/${await idOf(t)}`).catch(() => {}));
          const ok = await Promise.race([ended, new Promise((r) => { const t = setInterval(() => { if (my !== token) { clearInterval(t); r(true); } }, 150); ended.then(() => clearInterval(t)); })]);
          if (ok) return;
        }
      } catch (e) { console.warn('lecture audio failed, using captions', e); }
      if (my !== token) return;
    }
    await sleep(readingMs(text) / speed, my);
  }

  const upcoming = (i) => [...Object.values(beats[i].moves || {}), ...(beats[i + 1] ? [beats[i + 1].say] : [])];

  function waitExercise(el, my) {
    return new Promise((r) => { const tick = () => (my !== token || el.dataset.done ? r() : setTimeout(tick, 200)); tick(); });
  }

  function focusBeat(i, scroll = true) {
    board.querySelectorAll('.lec-current').forEach((el) => el.classList.remove('lec-current'));
    const el = items[i] || items.slice(0, i + 1).reverse().find(Boolean);
    if (!el) return;
    el.classList.add('lec-current');
    if (scroll) scrollTo(el);
  }

  // keep what is being talked about between the sticky top bar and the sticky dock;
  // too tall to fit → show its top (a derivation's newest step is scrolled to on its own)
  let follow = null;
  function scrollTo(el) {
    const place = () => {
      const top = 56 + 12, bottom = dock.offsetHeight + 16;
      el.style.scrollMarginTop = `${top}px`;
      el.style.scrollMarginBottom = `${bottom}px`;
      const tall = el.getBoundingClientRect().height > window.innerHeight - top - bottom;
      el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: tall ? 'start' : 'nearest' });
    };
    // graphs mount a frame later and derivation lines grow as fonts load: re-place while the element settles
    follow?.disconnect();
    if (typeof ResizeObserver === 'undefined') { place(); return; }
    follow = new ResizeObserver(place);
    follow.observe(el);
    const f = follow;
    setTimeout(() => f.disconnect(), 1500);
  }

  async function runBeat(i, my) {
    pos = i;
    store.set(resumeKey, i);
    caption.textContent = beats[i].say;
    ui();
    const beat = beats[i];
    const fresh = applied <= i;
    if (fresh) applied = i + 1;
    if (fresh && beat.step !== undefined) {
      // say what the step does, then play it: each moving term slides while its own line is spoken
      const narrate = {
        beforeStep: async () => { await speakText(beat.say, my, upcoming(i)); },
        onMove: (id) => (beat.moves?.[id] && my === token ? (caption.textContent = beat.moves[id], speakText(beat.moves[id], my)) : null),
      };
      await apply(i, false, narrate);
      if (my === token) caption.textContent = beat.say;
    } else {
      const effects = fresh ? apply(i, false) : null;
      focusBeat(i);
      await Promise.all([speakText(beat.say, my, upcoming(i)), effects]);
    }
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
    root.querySelector('.lec-resume')?.remove();
    unlockAudio(applied >= beats.length && !playing ? 0 : pos);
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
    if (e.altKey || e.ctrlKey || e.metaKey || e.target.closest?.('input, textarea, select, button, a, [role="button"], [contenteditable="true"]')) return;
    if (e.key === ' ') { e.preventDefault(); playing ? pause() : play(); } else if (e.key === 'ArrowRight') nextBtn.click(); else if (e.key === 'ArrowLeft') prevBtn.click();
  };
  window.addEventListener('keydown', onKey);
  function destroy() { follow?.disconnect(); token++; playing = false; stopAudio(); window.removeEventListener('keydown', onKey); window.removeEventListener('hashchange', destroy); }
  window.addEventListener('hashchange', destroy);
  ui();
  return { destroy };
}
