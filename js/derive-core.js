// DOM-free logic behind the `derive` block: term tags, step chaining, which terms move or cancel,
// colour slots and arrow routing. Used by js/derive.js in the browser and by the Node validator.

// \T{id}{tex} tags a term; KaTeX turns it into a span with data-t="id".
export const TAG_MACROS = { '\\T': '\\htmlData{t=#1}{#2}' };
export const KATEX_TRUST = (ctx) => ctx.command === '\\htmlData';
export const KINDS = ['start', 'sub', 'both', 'expand', 'factor', 'cancel', 'calc', 'calculus', 'check', 'result'];
export const TAG_ID = /^[A-Za-z]+(-[A-Za-z0-9]+)?$/;

// Walk \T{id}{...} occurrences with brace matching; returns [{ id, parent }] in source order.
function walkTags(tex) {
  const out = [];
  const stack = []; // [{ id, depthAtOpen }]
  let depth = 0;
  const s = String(tex);
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '\\') {
      if (s[i + 1] === 'T' && s[i + 2] === '{') {
        const close = s.indexOf('}', i + 3);
        if (close < 0) break; // unclosed \T{ : stop instead of rescanning forever
        const id = s.slice(i + 3, close);
        out.push({ id, parent: stack.length ? stack[stack.length - 1].id : null });
        // the content brace opens right after the id
        i = close + 1;
        if (s[i] === '{') { depth++; stack.push({ id, depth }); }
        continue;
      }
      i++; // skip escaped char (\{ \} \\ ...)
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}') {
      if (stack.length && stack[stack.length - 1].depth === depth) stack.pop();
      depth--;
    }
  }
  return out;
}

export function tagIds(tex) { return walkTags(tex).map((t) => t.id); }
export function tagParents(tex) { return Object.fromEntries(walkTags(tex).map((t) => [t.id, t.parent])); }

export function resolveSteps(block) {
  let prev = null;
  return (block.steps || []).map((st, i) => {
    const from = st.from ?? prev;
    if (from == null) throw new Error(`step ${i + 1} has no from`);
    prev = st.to;
    return { ...st, from };
  });
}

// moves: tags that travel to one or more new tags; cancelled: tags that vanish (and have no surviving descendant).
export function plan(oldIds, newIds, map = {}, parentOf = {}) {
  const have = new Set(newIds);
  const targets = (id) => [].concat(map[id] ?? id).filter((t) => have.has(t)); // map values: id or [ids]
  const children = {};
  for (const id of oldIds) { const p = parentOf[id]; if (p) (children[p] ||= []).push(id); }
  const lives = (id) => targets(id).length > 0 || (children[id] || []).some(lives);
  const ancestorMoves = (id) => { for (let p = parentOf[id]; p; p = parentOf[p]) if (targets(p).length) return true; return false; };
  const moves = oldIds.filter((id) => targets(id).length && !ancestorMoves(id)).map((id) => ({ id, targets: targets(id) }));
  const cancelled = oldIds.filter((id) => !lives(id) && !ancestorMoves(id));
  return { moves, cancelled };
}

export const prefixOf = (id) => String(id).split('-')[0];

// Palette slot 1..8 for a tag: explicit colors[prefix] wins, otherwise order of first appearance.
export function colourSlot(id, colors = {}, seen = []) {
  const p = prefixOf(id);
  if (colors[p]) return colors[p];
  if (!seen.includes(p)) seen.push(p);
  const used = new Set(Object.values(colors));
  const all = [1, 2, 3, 4, 5, 6, 7, 8];
  const free = all.filter((n) => !used.has(n));
  if (!free.length) return all[seen.indexOf(p) % all.length]; // every slot pinned: share colours
  return free[seen.indexOf(p) % free.length];
}

const bez = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return [0, 1].map((i) => u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i]);
};
const r1 = (v) => Math.round(v * 10) / 10;

// Choose an arrow from src (old line) to dst (new line) that crosses the fewest obstacle boxes.
// line: box of the new line. Candidates are one cubic (direct entries from the top, sides or below)
// or two cubics through a waypoint beside the new line (for targets boxed in by other symbols).
export function route(src, dst, obstacles, line) {
  const zc = dst.x + dst.w / 2, zm = dst.y + dst.h / 2;
  const below = line.y + line.h + 26;
  const laneL = line.x - 30, laneR = line.x + line.w + 30;
  const entry = {
    top: [zc, dst.y - 2], left: [dst.x - 2, zm], right: [dst.x + dst.w + 2, zm], bottom: [zc, dst.y + dst.h + 2],
  };
  const starts = [
    { p0: [src.x + src.w / 2, src.y + src.h + 1], dir: [0, 1], pen: 0 },
    { p0: [src.x - 2, src.y + src.h / 2], dir: [-1, 0.2], pen: 30 },
    { p0: [src.x + src.w + 2, src.y + src.h / 2], dir: [1, 0.2], pen: 30 },
  ];
  const out = (st, k) => [st.p0[0] + st.dir[0] * k, st.p0[1] + st.dir[1] * k];
  const cands = [];
  for (const st of starts) {
    const p0 = st.p0;
    const drop = (y) => Math.max(30, (y - p0[1]) * 0.55);
    // direct
    cands.push({ side: 'top', pen: st.pen, segs: [[p0, out(st, drop(entry.top[1])), [zc, entry.top[1] - (entry.top[1] - p0[1]) * 0.55], entry.top]] });
    cands.push({ side: 'left', pen: st.pen + 10, segs: [[p0, out(st, drop(zm)), [dst.x - 42, zm], entry.left]] });
    cands.push({ side: 'right', pen: st.pen + 10, segs: [[p0, out(st, drop(zm)), [dst.x + dst.w + 42, zm], entry.right]] });
    cands.push({ side: 'bottom', pen: st.pen + 60, segs: [[p0, st.dir[1] === 1 ? [p0[0], below] : out(st, 40), [zc, below], entry.bottom]] });
    // through a waypoint beside the new line, in the gap above it
    for (const lane of [laneL, laneR]) {
      const w = [lane, line.y - 10];
      const toW = [p0, out(st, drop(w[1])), [lane, w[1] - 24], w];
      const sgn = lane < zc ? -1 : 1;
      cands.push({ side: 'bottom', pen: st.pen + 90, segs: [toW, [w, [lane, below], [zc, below + 6], entry.bottom]] });
      cands.push({ side: sgn < 0 ? 'left' : 'right', pen: st.pen + 90, segs: [toW, [w, [lane, zm], [entry[sgn < 0 ? 'left' : 'right'][0] + sgn * 30, zm], entry[sgn < 0 ? 'left' : 'right']]] });
    }
  }
  let best = null;
  const scores = [];
  for (const cd of cands) {
    let hits = 0, len = 0;
    const n = 80 * cd.segs.length;
    cd.segs.forEach((sg, k) => {
      let prev = sg[0];
      for (let i = 1; i <= 80; i++) {
        const pt = bez(sg[0], sg[1], sg[2], sg[3], i / 80);
        len += Math.hypot(pt[0] - prev[0], pt[1] - prev[1]);
        prev = pt;
        const g = k * 80 + i; // skip the very start and end, which touch source and target
        if (g >= 3 && g <= n - 3 && obstacles.some((b) => pt[0] > b.x && pt[0] < b.x + b.w && pt[1] > b.y && pt[1] < b.y + b.h)) hits++;
      }
    });
    // drawn curve length, not chord length: a wide loop must lose to a short detour
    const score = hits * 1000 + len + cd.pen;
    scores.push([cd.side, hits, Math.round(score)]);
    if (!best || score < best.score) best = { ...cd, score, hits };
  }
  // pull the drawn end back so the arrowhead tip lands on the target edge
  const segs = best.segs.map((sg) => sg.slice());
  const last = segs[segs.length - 1];
  const end = last[3], c2 = last[2];
  const dx = end[0] - c2[0], dy = end[1] - c2[1], L = Math.hypot(dx, dy) || 1;
  last[3] = [end[0] - (dx / L) * 6, end[1] - (dy / L) * 6];
  const P = (q) => `${r1(q[0])},${r1(q[1])}`;
  const d = `M${P(segs[0][0])} ` + segs.map((sg) => `C${P(sg[1])} ${P(sg[2])} ${P(sg[3])}`).join(' ');
  return { d, start: segs[0][0], end, side: best.side, hits: best.hits, scores, tangentFrom: c2 };
}
