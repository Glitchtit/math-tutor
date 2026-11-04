// Train: turns derive-block lines into typing drills. TeX -> plain text the student types,
// split into chunks (one coloured term or one relation at a time). Pure: runs in Node for tests.

import { tokenizeTex, parseGroup } from './latex.js';
import { resolveSteps } from './derive-core.js';
import { compile } from './matlab/compile.js';

const UNSUPPORTED = new Set(['\\underbrace', '\\begin', '\\end', '\\binom', '\\overset', '\\xrightarrow', '\\lceil', '\\rceil', '\\overline', '\\not', '\\bar', '\\hline', '\\\\', '&']);
const DROP = new Set(['\\,', '\\;', '\\:', '\\!', '\\ ', '~', '\\enspace', '\\thinspace', '\\displaystyle', '\\textstyle', '\\checkmark', '\\left', '\\right', '\\big', '\\Big', '\\bigg', '\\Bigg', '\\bigl', '\\bigr', '\\Bigl', '\\Bigr', '\\biggl', '\\biggr']);
const SEP = new Set(['\\quad', '\\qquad']);
const SYM = {
  '\\cdot': '*', '\\times': '*', '\\div': '/', '\\le': '<=', '\\leq': '<=', '\\ge': '>=', '\\geq': '>=', '\\ne': '!=', '\\neq': '!=',
  '\\approx': '~', '\\to': '->', '\\rightarrow': '->', '\\Rightarrow': '=>', '\\implies': '=>', '\\iff': '<=>', '\\Longleftrightarrow': '<=>',
  '\\pm': '+-', '\\infty': 'inf', '\\cdots': '...', '\\ldots': '...', '\\dots': '...', '\\cup': 'U', '\\in': ' in ', '\\circ': ' o ',
  '\\{': '{', '\\}': '}', '\\%': '%', '\\int': 'int', '\\lim': 'lim', '\\sum': 'sum', '\\max': 'max', '\\min': 'min',
};
const NAMED = new Set(['pi', 'tau', 'theta', 'rho', 'mu', 'xi', 'alpha', 'beta', 'omega', 'Omega', 'Delta', 'Phi', 'varepsilon', 'varphi', 'phi', 'epsilon', 'lambda', 'sigma', 'gamma', 'delta', 'eta', 'zeta', 'kappa', 'nu', 'psi', 'chi', 'Gamma', 'Lambda', 'Sigma', 'Theta', 'Psi',
  'ln', 'log', 'exp', 'sin', 'cos', 'tan', 'sec', 'csc', 'cot', 'arctan', 'arcsin', 'arccos', 'sinh', 'cosh', 'tanh']);
const WRAP = new Set(['\\text', '\\mathrm', '\\textrm', '\\textbf', '\\mathbf', '\\operatorname', '\\mathit']);
const REL = new Set(['=', '<', '>', '\\le', '\\leq', '\\ge', '\\geq', '\\ne', '\\neq', '\\approx', '\\to', '\\rightarrow', '\\Rightarrow', '\\implies', '\\iff', '\\Longleftrightarrow']);
const OP = new Set(['+', '-', '\\pm', '\\cdot', '\\times']);

class Unsupported extends Error {}

const parse = (tex) => parseGroup(tokenizeTex(String(tex)), { i: 0 }, null);
const argAt = (items, k) => { const a = items[k]; if (a === undefined) throw new Unsupported('missing argument'); return typeof a === 'string' ? [a] : a.g; };
const raw = (items) => items.map((t) => (typeof t === 'string' ? t.replace(/^\\/, '') : raw(t.g))).join('');
const ATOM = String.raw`(\d+(\.\d+)?|[A-Za-z]+\d*)`;
const atomic = (s) => new RegExp(`^${ATOM}(_[A-Za-z0-9]+)?(\\^${ATOM})?$`).test(s) || /^-?\d+(\.\d+)?$/.test(s) || balancedParens(s);
function balancedParens(s) {
  if (s[0] !== '(' || s.at(-1) !== ')') return false;
  let d = 0;
  for (let i = 0; i < s.length; i++) { d += s[i] === '(' ? 1 : s[i] === ')' ? -1 : 0; if (d === 0 && i < s.length - 1) return false; }
  return true;
}
const paren = (s) => (atomic(s) ? s : `(${s})`);
// spaces only for readability (checking ignores them): between words ("ln x", "pi r") and after a script ("int_0^1 x")
function join(parts) {
  let acc = '', last = '';
  for (const p of parts) {
    if (!p) continue;
    const word = /([A-Za-z]+)$/.exec(acc)?.[1] || '', next = /^[A-Za-z]+/.exec(p)?.[0] || '';
    if ((word && next && (word.length > 1 || next.length > 1)) || (/^[\^_]/.test(last) && /^[A-Za-z0-9]/.test(p))) acc += ' ';
    acc += p; last = p;
  }
  return acc;
}

// items -> plain string; throws Unsupported
function plainOf(items) {
  const out = [];
  for (let k = 0; k < items.length; k++) {
    const t = items[k];
    if (typeof t !== 'string') { out.push(plainOf(t.g)); continue; }
    if (UNSUPPORTED.has(t)) throw new Unsupported(t);
    if (t === '\\T') { out.push(plainOf(argAt(items, k + 2))); k += 2; continue; }
    if (DROP.has(t) || SEP.has(t)) { if ((t === '\\left' || t === '\\right') && items[k + 1] === '.') k++; continue; }
    if (t === '\\frac' || t === '\\dfrac' || t === '\\tfrac') { out.push(`${paren(plainOf(argAt(items, k + 1)))}/${paren(plainOf(argAt(items, k + 2)))}`); k += 2; continue; }
    if (t === '\\sqrt') { if (items[k + 1] === '[') throw new Unsupported('nth root'); out.push(`sqrt(${plainOf(argAt(items, k + 1))})`); k++; continue; }
    if (t === '^' || t === '_') { out.push(t + paren(plainOf(argAt(items, k + 1)))); k++; continue; }
    if (WRAP.has(t)) { out.push(raw(argAt(items, k + 1))); k++; continue; }
    if (SYM[t] !== undefined) { out.push(SYM[t]); continue; }
    if (t[0] === '\\') { const n = t.slice(1); if (NAMED.has(n)) { out.push(n); continue; } throw new Unsupported(t); }
    out.push(t);
  }
  return join(out);
}

export function texToPlain(tex) {
  try { return plainOf(parse(tex)).trim(); } catch (e) { if (e instanceof Unsupported) return null; throw e; }
}

// minimal TeX re-serialisation of parsed items (keeps \T ids intact)
function texOf(items) {
  let s = '';
  for (const t of items) {
    const piece = typeof t === 'string' ? t : `{${texOf(t.g)}}`;
    if (/\\[A-Za-z]+$/.test(s) && /^[A-Za-z0-9]/.test(piece)) s += ' ';
    s += piece;
  }
  return s;
}

const ARITY = { '\\T': 2, '\\frac': 2, '\\dfrac': 2, '\\tfrac': 2, '\\sqrt': 1 };
for (const w of WRAP) ARITY[w] = 1;

// split a line's top-level items into syntactic units: { items, kind: sep|rel|op|tag|other, tag? }
function unitsOf(items) {
  const units = [];
  for (let k = 0; k < items.length; k++) {
    const t = items[k];
    if (typeof t === 'string' && SEP.has(t)) { units.push({ items: [], kind: 'sep' }); continue; }
    if ((t === '^' || t === '_') && units.length && units.at(-1).kind !== 'sep') { units.at(-1).items.push(t, items[k + 1]); k++; continue; }
    const sizing = /^\\(left|right|[bB]igg?[lr]?)$/.test(t);
    if (DROP.has(t) && !sizing) { if (units.length) units.at(-1).items.push(t); continue; } // spacing, \checkmark: keep for display only
    const n = sizing ? 1 : typeof t === 'string' ? ARITY[t] || 0 : 0;
    let slice = items.slice(k, k + 1 + n);
    // \left/\right may end up in different chunks; unpaired \bigl/\bigr render on their own
    if (t === '\\left' || t === '\\right') slice = slice[1] === '.' ? [] : [t === '\\left' ? '\\bigl' : '\\bigr', slice[1]];
    k += n;
    const kind = t === '\\T' ? 'tag' : REL.has(t) ? 'rel' : OP.has(t) ? 'op' : 'other';
    units.push({ items: slice, kind, tag: kind === 'tag' ? raw(slice[1].g) : undefined });
  }
  return units;
}

const MAX_RUN = 14;

export function chunkLine(tex) {
  try {
  const units = unitsOf(parse(tex));
  const groups = [];
  let cur = [], has = false, hasTag = false, pend = [];
  const flush = () => { cur.push(...pend); if (cur.length) groups.push(cur); cur = []; pend = []; has = hasTag = false; };
  for (const u of units) {
    if (u.kind === 'sep') { flush(); continue; }
    if (u.kind === 'rel') { flush(); cur = [u]; continue; }
    if (u.kind === 'op') { pend.push(u); continue; }
    // a tagged term starts its own chunk (taking the operator in front of it); so does anything after a tag
    if (has && (u.kind === 'tag' || (hasTag && pend.length))) { groups.push(cur); cur = []; hasTag = false; }
    cur.push(...pend, u); pend = [];
    has = true; if (u.kind === 'tag') hasTag = true;
  }
  flush();
  // long untagged runs: split before + / - so each piece stays short
  const split = groups.flatMap((g) => {
    if (g.some((u) => u.kind === 'tag')) return [g];
    const pieces = [[]];
    for (const u of g) {
      const p = pieces.at(-1);
      if (u.kind === 'op' && p.length && plainUnits(p).length >= 4 && plainUnits(g).length > MAX_RUN) pieces.push([u]);
      else p.push(u);
    }
    return pieces;
  });
    const chunks = split.map((g) => ({ tex: texOf(g.flatMap((u) => u.items)), plain: plainUnits(g), tag: g.find((u) => u.tag)?.tag, lead: g[0].kind }))
      .filter((c) => c.plain !== '');
    return chunks.length ? chunks : null;
  } catch (e) { if (e instanceof Unsupported) return null; throw e; }
}
const plainUnits = (g) => plainOf(g.flatMap((u) => u.items)).trim();

// ------------------------------------------------------------------ checking

const UNI = { '·': '*', '×': '*', '∗': '*', '⋅': '*', '−': '-', '–': '-', '≤': '<=', '≥': '>=', '≠': '!=', '≈': '~', '→': '->', '⇒': '=>', 'π': 'pi', '∞': 'inf', '±': '+-' };

export function normPlain(s) {
  let t = String(s).replace(/[·×∗⋅−–≤≥≠≈→⇒π∞±]/g, (c) => UNI[c]).replace(/\s+/g, '');
  return t.replace(/\*/g, (m, i) => (/\d/.test(t[i - 1] || '') && /\d/.test(t[i + 1] || '') ? '*' : ''));
}

const FUNCS = new Set(['sqrt', 'ln', 'log', 'exp', 'sin', 'cos', 'tan', 'pi', 'e', 'abs']);
const toMatlab = (s) => s.replace(/\bln\b/g, 'log').replace(/\binf\b/g, 'Inf');

// same value at a few random points (forgives redundant brackets, a*b vs b*a, …)
function sameValue(a, b) {
  if (/[<>=!~|]|int|lim|sum|\.\.\./.test(a + b)) return false;
  const ids = [...new Set(`${a} ${b}`.match(/[A-Za-z_]\w*/g) || [])].filter((v) => !FUNCS.has(v));
  try {
    const fa = compile(toMatlab(a), ids), fb = compile(toMatlab(b), ids);
    for (let k = 0; k < 3; k++) {
      const xs = ids.map((_, i) => 0.3 + ((k * 7 + i * 3) % 11) / 7);
      const va = fa(...xs), vb = fb(...xs);
      if (typeof va !== 'number' || typeof vb !== 'number' || !Number.isFinite(va) || Math.abs(va - vb) > 1e-9 * Math.max(1, Math.abs(vb))) return false;
    }
    return true;
  } catch { return false; }
}

// leading operator / relation of the expected chunk must be typed literally; the rest may be any equal-valued form
export function checkChunk(input, expected) {
  const a = normPlain(input), b = normPlain(expected);
  if (a === b) return { ok: true };
  const lead = /^(<=>|<=|>=|!=|->|=>|\+-|[=<>~+\-])/.exec(b)?.[0] || '';
  if (a.startsWith(lead) && a.length > lead.length && sameValue(a.slice(lead.length), b.slice(lead.length))) return { ok: true, alt: true };
  return { ok: false, at: [...a].findIndex((c, i) => c !== b[i]) };
}

// ------------------------------------------------------------------ drills

function derivesIn(o, out = []) {
  if (Array.isArray(o)) o.forEach((x) => derivesIn(x, out));
  else if (o && typeof o === 'object') { if (o.type === 'derive') out.push(o); else Object.values(o).forEach((x) => derivesIn(x, out)); }
  return out;
}

function linesOf(b) {
  let steps;
  try { steps = resolveSteps(b); } catch { return []; }
  const lines = [];
  let prev = null;
  const add = (tex, st) => {
    if (tex === prev) return;
    prev = tex;
    const chunks = chunkLine(tex);
    if (chunks) lines.push({ tex, chunks, label: st.label || '', why: st.why || '' });
  };
  for (const st of steps) { add(st.from, st); add(st.to, st); }
  return lines;
}

export function drillsOf(m) {
  const drills = [];
  for (const l of m.lessons || []) {
    derivesIn(l.blocks).forEach((b, n) => {
      const lines = linesOf(b);
      if (lines.length) drills.push({ key: `${m.id}/train/${l.id}/${n}`, lessonId: l.id, lessonTitle: l.title, title: b.title || l.title, colors: b.colors || {}, lines });
    });
  }
  return drills;
}

const HAS = new WeakMap();
export function hasDrills(m) { if (!HAS.has(m)) HAS.set(m, (m.lessons || []).some((l) => derivesIn(l.blocks).length)); return HAS.get(m); }
