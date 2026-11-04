// `derive` block: a derivation shown step by step. Each step draws the old line above the new one,
// colour-tracks tagged terms, draws routed arrows from each moving term to where it lands, strikes
// out cancelled terms, and can slide the terms along the arrows (Play). See CONTENT.md.

import { h, renderMath } from './util.js';
import { TAG_MACROS, KATEX_TRUST, resolveSteps, tagParents, plan, colourSlot, route } from './derive-core.js';

const KIND_LABEL = { start: 'Start', sub: 'Substitute', both: 'Both sides', expand: 'Expand', factor: 'Factor', cancel: 'Cancel', calc: 'Calculate', calculus: 'Calculus', check: 'Check', result: 'Result' };
const SLIDE_MS = 1100;
const SVG = 'http://www.w3.org/2000/svg';
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function texDerive(src, display = true) {
  if (!window.katex) return String(src);
  return window.katex.renderToString(String(src), { displayMode: display, throwOnError: false, strict: 'ignore', trust: KATEX_TRUST, macros: { ...TAG_MACROS } });
}

function proseInto(el, s) { el.innerHTML = s || ''; renderMath(el); return el; }

export function renderDerive(b) {
  const steps = resolveSteps(b);
  const seen = [];
  const slotOf = (id) => colourSlot(id, b.colors || {}, seen);
  const colourise = (el) => el.querySelectorAll('[data-t]').forEach((t) => t.classList.add(`tc${slotOf(t.dataset.t)}`));

  const root = h('div', { class: 'blk-derive' });
  if (b.title) root.appendChild(proseInto(h('div', { class: 'derive-title' }), b.title));
  if (b.given) {
    const g = h('div', { class: 'derive-given' }, h('span', { class: 'derive-given-label' }, 'Given'));
    const m = h('span', { class: 'derive-given-math' });
    m.innerHTML = texDerive(b.given, false);
    colourise(m);
    g.appendChild(m);
    root.appendChild(g);
  }
  const list = h('ol', { class: 'derive-steps' });
  root.appendChild(list);

  const built = [];
  let busy = false;

  function buildStep(i) {
    const st = steps[i];
    const kind = st.kind || 'calc';
    const play = h('button', { class: 'btn btn-small btn-ghost derive-play', type: 'button', 'aria-label': `Play step ${i + 1}` }, '▶ Play');
    const head = h('div', { class: 'derive-head' },
      h('span', { class: 'derive-num' }, String(i + 1)),
      h('span', { class: `derive-chip k-${kind}` }, KIND_LABEL[kind] || kind),
      st.label ? proseInto(h('span', { class: 'derive-label' }), st.label) : null,
      play);
    const oldL = h('div', { class: 'derive-line old' });
    const newL = h('div', { class: 'derive-line new' });
    oldL.innerHTML = texDerive(st.from);
    newL.innerHTML = texDerive(st.to);
    colourise(oldL); colourise(newL);
    const hasArrows = Object.keys(st.arrows || {}).length > 0;
    const svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('class', 'derive-svg');
    svg.setAttribute('aria-hidden', 'true');
    const inner = h('div', { class: `derive-inner${hasArrows ? ' has-arrows' : ''}` }, oldL, h('div', { class: 'derive-gap' }), newL, svg);
    // a step that only states the starting line (from === to) shows it once
    if (st.from === st.to) { oldL.hidden = true; inner.querySelector('.derive-gap').hidden = true; }
    const li = h('li', { class: `derive-step${kind === 'result' || kind === 'check' ? ' is-result' : ''}` },
      head, h('div', { class: 'derive-scroll' }, inner));
    if (st.why) li.appendChild(proseInto(h('div', { class: 'derive-why' }), st.why));

    // which tags move where, and which are cancelled
    const oldTags = [...oldL.querySelectorAll('[data-t]')];
    const newTags = [...newL.querySelectorAll('[data-t]')];
    const p = plan(oldTags.map((t) => t.dataset.t), newTags.map((t) => t.dataset.t), st.map || {}, tagParents(st.from));
    // in substitution/evaluation steps a vanishing term was replaced or computed, not cancelled: fade it instead of striking it out
    const evaluated = ['calc', 'calculus', 'sub', 'check'].includes(kind);
    for (const id of p.cancelled) oldL.querySelector(`[data-t="${CSS.escape(id)}"]`)?.classList.add(evaluated ? 'faded' : 'gone');
    const S = { st, li, inner, oldL, newL, svg, moves: p.moves, play };
    play.onclick = () => playStep(S);
    built[i] = S;
    return S;
  }

  // box of an element and all its descendants, in the coordinates of the step's inner box
  function boxIn(inner, el) {
    const c = inner.getBoundingClientRect();
    let l = Infinity, t = Infinity, r = -Infinity, bt = -Infinity;
    for (const x of [el, ...el.querySelectorAll('*')]) {
      const q = x.getBoundingClientRect();
      if (!q.width || !q.height) continue;
      l = Math.min(l, q.left); t = Math.min(t, q.top); r = Math.max(r, q.right); bt = Math.max(bt, q.bottom);
    }
    return l === Infinity ? null : { x: l - c.left, y: t - c.top, w: r - l, h: bt - t };
  }

  function draw(S) {
    const { inner, svg, st } = S;
    svg.replaceChildren();
    if (!inner.offsetParent && !inner.getClientRects().length) return; // hidden: ResizeObserver redraws later
    const ink = [...inner.querySelectorAll('.katex-html *')]
      .filter((x) => !x.children.length && (x.classList.contains('frac-line') || x.textContent.replace(/​/g, '').trim()));
    // the new line's extent from its visible glyphs (KaTeX's display wrapper spans the full width)
    const lineInk = ink.filter((g) => S.newL.contains(g)).map((g) => boxIn(inner, g)).filter(Boolean);
    if (!lineInk.length) return;
    const lx = Math.min(...lineInk.map((r) => r.x)), ly = Math.min(...lineInk.map((r) => r.y));
    const lineBox = { x: lx, y: ly, w: Math.max(...lineInk.map((r) => r.x + r.w)) - lx, h: Math.max(...lineInk.map((r) => r.y + r.h)) - ly };
    let k = 0;
    for (const mv of S.moves) {
      if (!(mv.id in (st.arrows || {}))) continue;
      const srcEl = S.oldL.querySelector(`[data-t="${CSS.escape(mv.id)}"]`);
      const src = srcEl && boxIn(inner, srcEl);
      if (!src) continue;
      const slot = [...srcEl.classList].find((c) => /^tc\d$/.test(c)) || 'tc1';
      mv.targets.forEach((tid, j) => {
        const dstEl = S.newL.querySelector(`[data-t="${CSS.escape(tid)}"]`);
        const dst = dstEl && boxIn(inner, dstEl);
        if (!dst) return;
        const obstacles = ink.filter((g) => !srcEl.contains(g) && !dstEl.contains(g)).map((g) => {
          const r = boxIn(inner, g);
          if (!r) return null;
          const pad = Math.max(0, (8 - r.h) / 2);
          return { x: r.x - 3, y: r.y - 3 - pad, w: r.w + 6, h: r.h + 6 + 2 * pad };
        }).filter((r) => r && r.w > 6);
        const rt = route(src, dst, obstacles, lineBox);
        const path = document.createElementNS(SVG, 'path');
        path.setAttribute('d', rt.d);
        path.setAttribute('class', `derive-arrow ${slot}`);
        if (window.__deriveDebug) path.dataset.scores = JSON.stringify(rt.scores);
        svg.appendChild(path);
        // arrowhead along the final tangent
        const m = rt.d.match(/C[^ ]+ ([-\d.]+),([-\d.]+) ([-\d.]+),([-\d.]+)$/);
        const [cx, cy, ex, ey] = m ? m.slice(1).map(Number) : [rt.end[0], rt.end[1] - 1, rt.end[0], rt.end[1]];
        const tx = rt.end[0], ty = rt.end[1];
        const ang = Math.atan2(ty - cy, tx - cx) || Math.atan2(ey - cy, ex - cx);
        const head = document.createElementNS(SVG, 'path');
        const a1 = ang + Math.PI * 0.85, a2 = ang - Math.PI * 0.85;
        head.setAttribute('d', `M${tx},${ty} L${tx + 9 * Math.cos(a1)},${ty + 9 * Math.sin(a1)} L${tx + 9 * Math.cos(a2)},${ty + 9 * Math.sin(a2)} Z`);
        head.setAttribute('class', `derive-head-tip ${slot}`);
        svg.appendChild(head);
        const label = st.arrows[mv.id];
        if (label && j === 0) {
          const left = rt.end[0] < rt.start[0] - 4;
          const text = document.createElementNS(SVG, 'text');
          text.setAttribute('x', rt.start[0] + (left ? -10 : 10));
          text.setAttribute('y', rt.start[1] + 16 + 20 * k++);
          text.setAttribute('text-anchor', left ? 'end' : 'start');
          text.setAttribute('class', `derive-lbl ${slot}`);
          text.textContent = label;
          svg.appendChild(text);
        }
      });
    }
  }

  async function playStep(S) {
    if (busy) return;
    busy = true;
    try {
      const { inner, newL, oldL } = S;
      inner.classList.add('playing');
      if (reducedMotion()) {
        newL.style.opacity = 0;
        await wait(30);
        newL.style.transition = 'opacity .4s'; newL.style.opacity = 1;
        await wait(420);
        newL.style.transition = '';
        return;
      }
      const c = inner.getBoundingClientRect();
      const fs = getComputedStyle(oldL.querySelector('.katex') || oldL).fontSize;
      newL.style.transition = 'none'; newL.style.opacity = 0;
      const clones = [];
      for (const mv of S.moves) {
        const e = oldL.querySelector(`[data-t="${CSS.escape(mv.id)}"]`);
        if (!e) continue;
        const a = e.getBoundingClientRect();
        for (const tid of mv.targets) {
          const t = newL.querySelector(`[data-t="${CSS.escape(tid)}"]`);
          if (!t) continue;
          const z = t.getBoundingClientRect();
          const w = h('div', { class: 'katex derive-clone' });
          w.style.fontSize = fs;
          w.style.left = `${a.left - c.left}px`; w.style.top = `${a.top - c.top}px`;
          w.appendChild(e.cloneNode(true));
          inner.appendChild(w);
          clones.push([w, `translate(${z.left - a.left}px, ${z.top - a.top}px) scale(${a.height ? z.height / a.height : 1})`]);
        }
        e.classList.add('ghosted');
      }
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      clones.forEach(([w, tr]) => { w.style.transform = tr; });
      await wait(SLIDE_MS + 50);
      newL.style.transition = 'opacity .3s'; newL.style.opacity = 1;
      await wait(320);
      clones.forEach(([w]) => w.remove());
      oldL.querySelectorAll('.ghosted').forEach((e) => e.classList.remove('ghosted'));
      newL.style.transition = '';
    } finally {
      S.inner.classList.remove('playing');
      busy = false;
    }
  }

  let shown = 0;
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver((entries) => {
    for (const en of entries) { const S = built.find((x) => x && x.inner === en.target); if (S) draw(S); }
  }) : null;

  function reveal() {
    const S = buildStep(shown++);
    list.appendChild(S.li);
    ro?.observe(S.inner);
    (document.fonts?.ready || Promise.resolve()).then(() => draw(S));
    if (shown >= steps.length) { nextBtn.remove(); allBtn.remove(); }
    return S;
  }

  const nextBtn = h('button', { class: 'btn btn-small', type: 'button' }, 'Next step →');
  const allBtn = h('button', { class: 'btn btn-small btn-ghost', type: 'button' }, 'Show all');
  const playAll = h('button', { class: 'btn btn-small btn-ghost', type: 'button' }, '▶ Play all');
  let revealing = false; // blocks extra clicks between reveal and the start of the animation
  nextBtn.onclick = async () => {
    if (busy || revealing || shown >= steps.length) return;
    revealing = true;
    try {
      const S = reveal();
      await (document.fonts?.ready || Promise.resolve());
      await new Promise((r) => requestAnimationFrame(r));
      draw(S);
      await playStep(S);
    } finally { revealing = false; }
  };
  allBtn.onclick = () => { while (shown < steps.length) reveal(); };
  playAll.onclick = async () => {
    if (busy) return;
    while (shown < steps.length) reveal();
    await (document.fonts?.ready || Promise.resolve());
    for (const S of built) {
      S.li.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' });
      await wait(400);
      draw(S);
      await playStep(S);
      await wait(350);
    }
  };
  root.appendChild(h('div', { class: 'derive-controls' }, nextBtn, allBtn, playAll));
  reveal(); // the first step is always visible
  return root;
}
