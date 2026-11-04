// `derive` block: a derivation shown step by step. Each step draws the old line above the new one,
// colour-tracks tagged terms, draws routed arrows from each moving term to where it lands, strikes
// out cancelled terms, and can slide the terms along the arrows (Play). See CONTENT.md.

import { h, renderMath } from './util.js';
import { TAG_MACROS, KATEX_TRUST, resolveSteps, tagParents, plan, colourSlot, route } from './derive-core.js';

const KIND_LABEL = { start: 'Start', sub: 'Substitute', both: 'Both sides', expand: 'Expand', factor: 'Factor', cancel: 'Cancel', calc: 'Calculate', calculus: 'Calculus', check: 'Check', result: 'Result' };
const SLIDE_MS = 800;
const GAP_MS = 350; // pause between terms so the eye can follow one move at a time
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
      if (x.ownerSVGElement) continue; // shapes inside an svg: the svg itself is measured
      let q = x.getBoundingClientRect();
      // KaTeX draws roots and wide accents as a 400em svg clipped by its parent: measure only the visible part
      if (x.tagName.toLowerCase() === 'svg' && x.parentElement) {
        const pr = x.parentElement.getBoundingClientRect();
        q = { left: Math.max(q.left, pr.left), right: Math.min(q.right, pr.right), top: q.top, bottom: q.bottom, width: 1, height: q.height };
        if (q.right <= q.left) continue;
      }
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
    const labels = [];
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
          return { x: r.x - 3, y: r.y - 3 - pad, w: r.w + 6, h: r.h + 6 + 2 * pad, old: S.oldL.contains(g) };
        }).filter((r) => r && r.w > 6);
        const rt = route(src, dst, obstacles, lineBox);
        const path = document.createElementNS(SVG, 'path');
        path.setAttribute('d', rt.d);
        path.setAttribute('class', `derive-arrow ${slot}`);
        path.dataset.mv = mv.id;
        if (window.__deriveDebug) path.dataset.scores = JSON.stringify(rt.scores);
        svg.appendChild(path);
        // arrowhead along the final tangent
        const tx = rt.end[0], ty = rt.end[1];
        const ang = Math.atan2(ty - rt.tangentFrom[1], tx - rt.tangentFrom[0]);
        const head = document.createElementNS(SVG, 'path');
        const a1 = ang + Math.PI * 0.85, a2 = ang - Math.PI * 0.85;
        head.setAttribute('d', `M${tx},${ty} L${tx + 9 * Math.cos(a1)},${ty + 9 * Math.sin(a1)} L${tx + 9 * Math.cos(a2)},${ty + 9 * Math.sin(a2)} Z`);
        head.setAttribute('class', `derive-head-tip ${slot}`);
        head.dataset.mv = mv.id;
        svg.appendChild(head);
        const label = st.arrows[mv.id];
        if (label && j === 0) labels.push({ id: mv.id, label, slot, path });
      });
    }
    placeLabels(S, labels, ink.map((g) => boxIn(inner, g)).filter(Boolean));
  }

  // put each label beside its own arrow where it covers no glyph, no other label and as little arrow as possible
  function placeLabels(S, labels, inkBoxes) {
    const { inner, svg } = S;
    const W = inner.clientWidth;
    const paths = [...svg.querySelectorAll('.derive-arrow')].map((p) => {
      const L = p.getTotalLength(), pts = [];
      for (let s = 0; s <= L; s += 3) { const q = p.getPointAtLength(s); pts.push([q.x, q.y]); }
      return { p, pts, L };
    });
    const ov = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
    const placed = [];
    for (const l of labels) {
      const text = document.createElementNS(SVG, 'text');
      text.setAttribute('class', `derive-lbl ${l.slot}`);
      text.dataset.mv = l.id;
      text.textContent = l.label;
      svg.appendChild(text);
      const bb = text.getBBox(), w = bb.width + 4, hgt = bb.height;
      const own = paths.find((q) => q.p === l.path);
      let best = null;
      for (const t of [0.12, 0.25, 0.4, 0.55, 0.7, 0.85]) {
        const q = l.path.getPointAtLength(own.L * t);
        for (const side of [1, -1, 0]) {
          // side 0: pulled inside the step on narrow screens, even if it then sits on its own arrow
          const x = side > 0 ? q.x + 7 : side < 0 ? q.x - 7 - w : Math.min(Math.max(0, q.x - w / 2), W - w);
          const box = { x, y: q.y - hgt / 2, w, h: hgt };
          let sc = t * 30 + (side < 0 ? 4 : side === 0 ? 150 : 0);
          if (box.x < 0 || box.x + box.w > W) sc += 5000;
          for (const g of inkBoxes) sc += ov(box, { x: g.x - 2, y: g.y - 2, w: g.w + 4, h: g.h + 4 }) > 0 ? 1000 : 0;
          for (const o of placed) sc += ov(box, { x: o.x - 3, y: o.y - 2, w: o.w + 6, h: o.h + 4 }) > 0 ? 1000 : 0;
          for (const pp of paths) for (const [x, y] of pp.pts) if (x > box.x - 2 && x < box.x + box.w + 2 && y > box.y - 2 && y < box.y + box.h + 2) sc += pp === own ? 60 : 40;
          if (!best || sc < best.sc) best = { sc, box };
        }
      }
      text.setAttribute('x', best.box.x + 2);
      text.setAttribute('y', best.box.y + hgt * 0.78);
      placed.push(best.box);
    }
  }

  async function playStep(S, fromPlayAll = false) {
    if (busy || (playingAll && !fromPlayAll) || S.st.from === S.st.to) return; // nothing moves in a statement-only step
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
      const groups = []; // one group per moving term (a term copied to several targets moves as one)
      for (const mv of S.moves) {
        const e = oldL.querySelector(`[data-t="${CSS.escape(mv.id)}"]`);
        if (!e) continue;
        const a = e.getBoundingClientRect();
        const g = { id: mv.id, e, clones: [], targets: [] };
        for (const tid of mv.targets) {
          const t = newL.querySelector(`[data-t="${CSS.escape(tid)}"]`);
          if (!t) continue;
          const z = t.getBoundingClientRect();
          const w = h('div', { class: 'katex derive-clone' });
          w.style.fontSize = fs;
          w.style.left = `${a.left - c.left}px`; w.style.top = `${a.top - c.top}px`;
          w.appendChild(e.cloneNode(true));
          g.targets.push(t);
          g.clones.push([w, a, z]);
        }
        if (g.clones.length) groups.push(g);
      }
      // terms that merge into one slot move back to back (stable: otherwise keep the old line's order)
      const lead = groups.map((g) => groups.findIndex((o) => o.targets.some((t) => g.targets.includes(t))));
      groups.splice(0, groups.length, ...groups.map((g, i) => [g, lead[i], i]).sort((x, y) => x[1] - y[1] || x[2] - y[2]).map((x) => x[0]));
      // the unchanged skeleton of the new line appears first, with empty slots the terms then slide into
      const landed = new Map(); // target -> copies parked on it until the slot fills
      const waiting = new Map(); // target -> moves still to land in it (several terms can merge into one)
      groups.forEach((g) => g.targets.forEach((t) => { t.classList.add('pending'); waiting.set(t, (waiting.get(t) || 0) + 1); }));
      // tagged terms that come from nowhere (results of the step) appear after the moves, not with the skeleton
      const slots = [...waiting.keys()];
      const fresh = [...newL.querySelectorAll('[data-t]')].filter((x) => !slots.some((t) => t === x || t.contains(x) || x.contains(t)));
      fresh.forEach((x) => x.classList.add('pending'));
      newL.style.transition = 'opacity .3s'; newL.style.opacity = 1;
      await wait(450);
      for (const g of groups) {
        S.svg.querySelectorAll('.active').forEach((x) => x.classList.remove('active'));
        S.svg.querySelectorAll(`[data-mv="${CSS.escape(g.id)}"]`).forEach((x) => x.classList.add('active'));
        for (const [w, a, z] of g.clones) {
          inner.appendChild(w);
          // the copied term can sit offset inside its wrapper (KaTeX vertical alignment), so pin the term itself, not the wrapper
          const o = w.firstChild.getBoundingClientRect(), ox = o.left - a.left, oy = o.top - a.top;
          w.style.left = `${a.left - c.left - ox}px`; w.style.top = `${a.top - c.top - oy}px`;
          const k = a.height ? z.height / a.height : 1;
          w.dataset.tr = `translate(${z.left - a.left + ox - k * ox}px, ${z.top - a.top + oy - k * oy}px) scale(${k})`;
        }
        g.e.classList.add('ghosted');
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        g.clones.forEach(([w]) => { w.style.transform = w.dataset.tr; });
        await wait(SLIDE_MS + 50);
        g.clones.forEach(([w], j) => {
          const t = g.targets[j];
          landed.set(t, [...(landed.get(t) || []), w]);
          waiting.set(t, waiting.get(t) - 1);
          if (!waiting.get(t)) { t.classList.remove('pending'); landed.get(t).forEach((x) => x.remove()); }
        });
        await wait(GAP_MS);
      }
      S.svg.querySelectorAll('.active').forEach((x) => x.classList.remove('active'));
      if (fresh.length) {
        fresh.forEach((x) => { x.style.transition = 'opacity .4s'; x.classList.remove('pending'); });
        await wait(450);
        fresh.forEach((x) => { x.style.transition = ''; });
      }
      oldL.querySelectorAll('.ghosted').forEach((e) => e.classList.remove('ghosted'));
      newL.style.transition = '';
    } finally {
      S.inner.querySelectorAll('.derive-clone').forEach((x) => x.remove());
      S.newL.querySelectorAll('.pending').forEach((x) => x.classList.remove('pending'));
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
  let playingAll = false;
  playAll.onclick = async () => {
    if (busy || playingAll) return;
    playingAll = true;
    try {
    while (shown < steps.length) reveal();
    await (document.fonts?.ready || Promise.resolve());
    for (const S of built) {
      S.li.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' });
      await wait(400);
      draw(S);
      await playStep(S, true);
      await wait(350);
    }
    } finally { playingAll = false; }
  };
  root.appendChild(h('div', { class: 'derive-controls' }, nextBtn, allBtn, playAll));
  reveal(); // the first step is always visible
  return root;
}
