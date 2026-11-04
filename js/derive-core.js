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
  const targets = (id) => (map[id] || [id]).filter((t) => have.has(t));
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
  const free = [1, 2, 3, 4, 5, 6, 7, 8].filter((n) => !used.has(n));
  return free[seen.indexOf(p) % free.length];
}

const bez = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return [0, 1].map((i) => u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i]);
};
const r1 = (v) => Math.round(v * 10) / 10;

// Choose an arrow from src (old line) to dst (new line) that crosses the fewest obstacle boxes.
// line: box of the new line, used for the "go around underneath / around the ends" candidates.
export function route(src, dst, obstacles, line) {
  const p0 = [src.x + src.w / 2, src.y + src.h + 1];
  const zc = dst.x + dst.w / 2, zm = dst.y + dst.h / 2;
  const below = line.y + line.h + 26;
  const laneL = line.x - 30, laneR = line.x + line.w + 30;
  const down = (y) => [p0[0], p0[1] + (y - p0[1]) * 0.55];
  const cands = [
    { side: 'top', end: [zc, dst.y - 2], c: (q) => [down(q[1]), [q[0], q[1] - (q[1] - p0[1]) * 0.55]], pen: 0 },
    { side: 'left', end: [dst.x - 2, zm], c: (q) => [down(q[1]), [q[0] - 40, q[1]]], pen: 10 },
    { side: 'right', end: [dst.x + dst.w + 2, zm], c: (q) => [down(q[1]), [q[0] + 40, q[1]]], pen: 10 },
    { side: 'bottom', end: [zc, dst.y + dst.h + 2], c: (q) => [[p0[0], below], [q[0], below]], pen: 60 },
    { side: 'bottom', end: [zc, dst.y + dst.h + 2], c: (q) => [[laneL, below], [q[0], below + 6]], pen: 110 },
    { side: 'bottom', end: [zc, dst.y + dst.h + 2], c: (q) => [[laneR, below], [q[0], below + 6]], pen: 110 },
    { side: 'left', end: [dst.x - 2, zm], c: (q) => [[laneL, p0[1] + 25], [laneL, q[1]]], pen: 110 },
    { side: 'right', end: [dst.x + dst.w + 2, zm], c: (q) => [[laneR, p0[1] + 25], [laneR, q[1]]], pen: 110 },
  ];
  let best = null;
  const scores = [];
  for (const cd of cands) {
    const [p1, p2] = cd.c(cd.end);
    let hits = 0, len = 0, prev = p0;
    for (let i = 1; i <= 80; i++) {
      const pt = bez(p0, p1, p2, cd.end, i / 80);
      len += Math.hypot(pt[0] - prev[0], pt[1] - prev[1]);
      prev = pt;
      const [x, y] = pt;
      if (i >= 3 && i <= 77 && obstacles.some((b) => x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h)) hits++;
    }
    // drawn curve length, not chord length: a wide loop must lose to a short detour
    const score = hits * 1000 + len + cd.pen;
    scores.push([cd.side, hits, Math.round(score)]);
    if (!best || score < best.score) best = { score, hits, p1, p2, end: cd.end, side: cd.side };
  }
  // pull the drawn end back so the arrowhead tip lands on the target edge
  const { p1, p2, end } = best;
  const dx = end[0] - p2[0], dy = end[1] - p2[1], L = Math.hypot(dx, dy) || 1;
  const tip = [end[0] - (dx / L) * 6, end[1] - (dy / L) * 6];
  const d = `M${r1(p0[0])},${r1(p0[1])} C${r1(p1[0])},${r1(p1[1])} ${r1(p2[0])},${r1(p2[1])} ${r1(tip[0])},${r1(tip[1])}`;
  return { d, start: p0, end, side: best.side, hits: best.hits, scores };
}
