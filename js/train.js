// Train page: copy-to-learn typing drills built from the module's derive blocks.
// Round 1 Copy (shows what to type), 2 Cover (rendered formula only), 3 Recall (formula hidden).

import { h, renderMath } from './util.js';
import { texDerive } from './derive.js';
import { colourSlot } from './derive-core.js';
import { drillsOf, checkChunk, normPlain } from './train-core.js';
import { progress } from './progress.js';

const ROUNDS = ['Copy', 'Cover', 'Recall'];
const ROUND_HELP = [
  'Copy: type exactly what is shown, one coloured part at a time.',
  'Cover: only the formula is shown. Work out how to type each part yourself.',
  'Recall: the line is hidden. Rebuild it from the step and the line before.',
];
const CHEAT = [
  ['fraction', String.raw`\frac{x+1}{x-1}`, '(x+1)/(x-1)'], ['power / index', String.raw`x^{n+1},\ V_{\mathrm{out}}`, 'x^(n+1), V_out'],
  ['times', String.raw`2\cdot 3`, '2*3'], ['root, log, trig', String.raw`\sqrt{x},\ \ln x,\ \sin x`, 'sqrt(x), ln x, sin x'],
  ['Greek, infinity', String.raw`\pi,\ \tau,\ \Delta,\ \infty`, 'pi, tau, Delta, inf'],
  ['relations', String.raw`\le\ \ge\ \ne\ \approx\ \to\ \Rightarrow`, '<= >= != ~ -> =>'], ['plus-minus', String.raw`\pm`, '+-'],
  ['integral', String.raw`\int_a^b f\,dx`, 'int_a^b f dx'], ['limit', String.raw`\lim_{x\to 0}`, 'lim_(x->0)'], ['sum', String.raw`\sum_{n=1}^{\infty}`, 'sum_(n=1)^inf'],
];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const playedRound = (key) => Math.min(progress.trainRound(key), 2); // 0-based round to play next
const pips = (key) => h('span', { class: 'train-pips', title: `${progress.trainRound(key)} of 3 rounds done` }, ...[0, 1, 2].map((i) => h('i', { class: i < progress.trainRound(key) ? 'on' : '' })));

export function renderTrainPage(container, m, onChange = () => {}) {
  const drills = drillsOf(m);
  const listBox = h('div'), runBox = h('div', { class: 'train-run hidden' });
  container.append(listBox, runBox);
  if (!drills.length) { listBox.append(h('p', { class: 'muted' }, 'No drills for this module yet.')); return; }

  const nextDrill = () => drills.reduce((best, d) => (progress.trainRound(d.key) < progress.trainRound(best.key) ? d : best), drills[0]);
  const start = (d) => {
    listBox.classList.add('hidden'); runBox.classList.remove('hidden'); runBox.replaceChildren();
    runDrill(runBox, d, playedRound(d.key), (clean) => {
      const r = playedRound(d.key) + 1;
      if (clean && r > progress.trainRound(d.key)) progress.setTrainRound(d.key, r);
      if (drills.every((x) => progress.trainRound(x.key) >= 1)) progress.markDone(`${m.id}/train`);
      onChange();
      return { next: () => start(nextDrill()), again: () => start(d), list: showList };
    });
    window.scrollTo({ top: 0 });
  };
  const showList = () => {
    runBox.classList.add('hidden'); listBox.classList.remove('hidden'); listBox.replaceChildren();
    const mastered = drills.filter((d) => progress.trainRound(d.key) >= 3).length;
    const cheat = h('details', { class: 'train-cheat' }, h('summary', {}, 'How to type maths'),
      h('table', {}, ...CHEAT.map(([what, t, typed]) => { const c = h('td'); c.innerHTML = texDerive(t, false); return h('tr', {}, h('td', { class: 'muted' }, what), c, h('td', {}, h('code', {}, typed))); })),
      h('p', { class: 'muted small' }, 'Spaces never matter, and * may be left out (2x = 2*x). Brackets that do not change the value are accepted too.'));
    listBox.append(
      h('div', { class: 'row' }, h('button', { class: 'btn btn-primary', onclick: () => start(nextDrill()) }, 'Train next →'), h('span', { class: 'muted small' }, `${mastered} of ${drills.length} drills mastered`)),
      cheat);
    let lesson = null, ol = null;
    for (const d of drills) {
      if (d.lessonId !== lesson) { lesson = d.lessonId; listBox.append(h('h3', { class: 'train-lesson' }, d.lessonTitle)); ol = h('ul', { class: 'train-list' }); listBox.append(ol); }
      const title = h('span', { class: 'train-title' }); title.innerHTML = d.title; renderMath(title);
      ol.append(h('li', {}, pips(d.key), h('button', { class: 'btn btn-small btn-ghost', onclick: () => start(d) }, ROUNDS[playedRound(d.key)]), title, h('span', { class: 'muted small' }, ` · ${d.lines.length} lines`)));
    }
  };
  showList();
}

// one pass through a drill in round `round` (0 Copy, 1 Cover, 2 Recall); onDone(clean) returns { next, again, list }
export function runDrill(el, drill, round, onDone) {
  const seen = [];
  const colourise = (box) => box.querySelectorAll('[data-t]').forEach((t) => t.classList.add(`tc${colourSlot(t.dataset.t, drill.colors, seen)}`));
  const title = h('div', { class: 'train-drill-title' }); title.innerHTML = drill.title; renderMath(title);
  const counter = h('span', { class: 'muted small' });
  const prevBox = h('div', { class: 'train-prev' });
  const stepBox = h('div', { class: 'train-step' });
  const lineBox = h('div', { class: 'train-line' });
  const prompt = h('div', { class: 'train-prompt', 'aria-live': 'polite' });
  const inp = h('input', { class: 'answer-input mono train-input', type: 'text', autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off', 'aria-label': 'Type the highlighted part' });
  const showBtn = h('button', { class: 'btn btn-small btn-ghost' }, 'Show');
  const fb = h('div', { class: 'feedback' });
  el.append(
    h('div', { class: 'row train-head' }, h('span', { class: 'tag' }, `Round ${round + 1} · ${ROUNDS[round]}`), counter, h('button', { class: 'btn btn-small btn-ghost', onclick: () => finish(null) }, '← All drills')),
    title, h('p', { class: 'muted small' }, ROUND_HELP[round]), prevBox, stepBox, lineBox, prompt,
    h('div', { class: 'answer-row' }, inp, round ? showBtn : null), fb);

  let li = 0, ci = 0, misses = 0, revealed = false, busy = false, first = true;
  const missesPerLine = [];
  const line = () => drill.lines[li];

  function drawLine() {
    const L = line();
    const blank = round === 2;
    const src = L.chunks.map((c, i) => {
      const pad = c.lead === 'rel' ? '\\;' : c.lead === 'op' ? '\\:' : '';
      const body = blank && i >= ci ? '\\square' : c.tex;
      return `\\htmlData{c=${i}}{${pad}${body}}`;
    }).join(' ');
    lineBox.innerHTML = texDerive(src);
    colourise(lineBox);
    lineBox.querySelectorAll('[data-c]').forEach((n) => { const i = +n.dataset.c; n.classList.add(i < ci ? 'done' : i === ci ? 'cur' : 'todo'); });
  }

  function drawPrompt() {
    const c = line().chunks[ci];
    const lead = first ? 'Type this:' : ci === 0 ? 'Next line. Type this:' : 'Good, now this:';
    const show = round === 0 || revealed;
    prompt.replaceChildren(h('b', {}, lead), ' ', show ? h('code', { class: 'train-target' }, c.plain) : h('span', { class: 'muted' }, round === 2 ? 'the next part of the line (the box)' : 'the highlighted part'));
    showBtn.classList.toggle('hidden', show);
  }

  function startLine() {
    const L = line();
    ci = 0; misses = 0; revealed = false;
    counter.textContent = `Line ${li + 1} of ${drill.lines.length}`;
    const prev = drill.lines[li - 1];
    prevBox.innerHTML = prev ? texDerive(prev.tex) : '';
    if (prev) colourise(prevBox);
    stepBox.replaceChildren();
    if (L.label || (round === 2 && L.why)) {
      const s = h('div', {}); s.innerHTML = `<b>${L.label || 'Step'}</b>${round === 2 && L.why ? ` — ${L.why}` : ''}`; renderMath(s); stepBox.append(s);
    }
    drawLine(); drawPrompt();
  }

  async function submit() {
    if (busy || !inp.value.trim()) return;
    const c = line().chunks[ci];
    const r = checkChunk(inp.value, c.plain);
    if (!r.ok) {
      misses++;
      const typed = normPlain(inp.value), at = Math.max(0, r.at);
      fb.className = 'feedback bad';
      fb.replaceChildren(h('b', {}, 'Not quite. '), 'You typed ', h('code', {}, typed.slice(0, at), h('mark', {}, typed.slice(at, at + 1) || ' '), typed.slice(at + 1)), at < typed.length ? ' — check from the marked character.' : ' — something is missing at the end.');
      if (misses >= 2 && !revealed) { revealed = true; drawPrompt(); }
      inp.select();
      return;
    }
    fb.className = 'feedback ok';
    fb.replaceChildren(r.alt ? h('span', {}, 'Correct — also fine. Written here as ', h('code', {}, c.plain), '.') : 'Good.');
    inp.value = ''; first = false; ci++;
    drawLine();
    if (ci < line().chunks.length) { revealed = false; drawPrompt(); return; }
    missesPerLine.push(misses);
    if (li + 1 >= drill.lines.length) return finish(missesPerLine.every((x) => x <= 1));
    busy = true; prompt.replaceChildren(h('b', {}, 'Line complete ✓'));
    await wait(700);
    busy = false; li++; startLine();
  }

  function finish(clean) {
    const nav = onDone(clean ?? false);
    if (clean === null) return nav.list();
    const total = missesPerLine.reduce((a, b) => a + b, 0);
    const msg = clean
      ? (round === 2 ? 'Clean recall — this drill is mastered.' : `Clean round! Next time: ${ROUNDS[round + 1]}.`)
      : `${total} misses. Repeat the ${ROUNDS[round]} round with at most one miss per line to move up.`;
    const nextBtn = h('button', { class: 'btn btn-primary', onclick: nav.next }, 'Train next →');
    el.replaceChildren(h('div', { class: 'train-done' }, h('h2', {}, clean ? 'Well done' : 'Round finished'), h('p', {}, msg),
      h('div', { class: 'row' }, nextBtn, h('button', { class: 'btn', onclick: nav.again }, 'Again'), h('button', { class: 'btn btn-ghost', onclick: nav.list }, 'All drills'))));
    nextBtn.focus();
  }

  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
  showBtn.onclick = () => { revealed = true; misses = Math.max(misses, 2); drawPrompt(); inp.focus(); };
  startLine();
  inp.focus();
}
