// Skill generators: one problem type each, producing fresh numbers + a fully worked solution.
// They power the placement test, the Foundations track, fading practice, mixed practice and spaced review.
//
// A skill:
//   { id, title, area: 'foundations' | 'calculus', module?: '<calculus module id>',
//     method: 'short name of the method' (shown in "Which method?"), family: 'group of confusable methods',
//     prereqs: ['skill ids'], blurb: 'one line',
//     gen(r) → { statement: html, part: { kind: 'numeric'|'expression'|'choice', answer, variable?, domain?, upToConstant?, choices? },
//                steps: [{ do: html (one line of maths), why: 'short reason naming the rule' }], hints?: [html] } }
// gen must be deterministic for a given r (see rng below) and never produce a problem whose own
// statement typed back counts as the answer (e.g. "factor x^2+5x+6" must use choices, not an expression part).

import ALGEBRA from './algebra.js';
import CALCULUS from './calculus.js';
export { default as COMPARE } from './compare.js';

export const SKILLS = [...ALGEBRA, ...CALCULUS];
export const skillById = Object.fromEntries(SKILLS.map((s) => [s.id, s]));

// prerequisite order (prereqs before dependants), stable within the authored order
export function topoOrder(list = SKILLS) {
  const out = [], seen = new Set(), ids = new Set(list.map((s) => s.id));
  const visit = (s) => {
    if (seen.has(s.id)) return;
    seen.add(s.id);
    (s.prereqs || []).filter((p) => ids.has(p)).forEach((p) => visit(skillById[p]));
    out.push(s);
  };
  list.forEach(visit);
  return out;
}

// mulberry32: small deterministic RNG; seed is any integer
export function rng(seed = Date.now()) {
  let a = seed >>> 0;
  const next = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const int = (lo, hi) => lo + Math.floor(next() * (hi - lo + 1));
  return {
    next, int,
    nz: (lo, hi) => { let v; do v = int(lo, hi); while (v === 0); return v; },        // nonzero integer
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    shuffle: (arr) => { const b = [...arr]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; },
  };
}

export const newSeed = () => Math.floor(Math.random() * 2 ** 31);
export const generate = (skill, seed = newSeed()) => ({ seed, ...skill.gen(rng(seed)) });

// ---- formatting helpers for generators

export const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };

// reduced fraction as { n, d } with d > 0
export function frac(n, d) { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return { n: n / g, d: d / g }; }
// TeX for n/d, reduced: '3', '-\frac{3}{4}'
export function fracTex(n, d) { const f = frac(n, d); if (f.d === 1) return String(f.n); return `${f.n < 0 ? '-' : ''}\\frac{${Math.abs(f.n)}}{${f.d}}`; }
// MATLAB string for n/d, reduced: '3', '-3/4'
export function fracM(n, d) { const f = frac(n, d); return f.d === 1 ? String(f.n) : `${f.n}/${f.d}`; }

// coefficient in front of a symbol: coef(1,'x') 'x', coef(-1,'x') '-x', coef(3,'x') '3x', coef(0,'x') '0'
export function coef(c, sym = 'x') { if (c === 0) return '0'; if (c === 1) return sym; if (c === -1) return `-${sym}`; return `${c}${sym}`; }
// signed term for joining: signed(3,'x') '+ 3x', signed(-1,'x') '- x', signed(-4) '- 4'
export function signed(c, sym = '') { if (c === 0) return ''; const a = Math.abs(c); const body = sym ? (a === 1 ? sym : `${a}${sym}`) : String(a); return `${c < 0 ? '-' : '+'} ${body}`; }
// polynomial TeX from coefficients high → low degree: poly([1,-3,2]) 'x^2 - 3x + 2'
export function poly(cs, sym = 'x') {
  const n = cs.length - 1, parts = [];
  cs.forEach((c, i) => {
    if (!c) return;
    const p = n - i, s = p === 0 ? '' : p === 1 ? sym : `${sym}^{${p}}`;
    parts.push(parts.length ? signed(c, s) : (p === 0 ? String(c) : coef(c, s)));
  });
  return parts.join(' ') || '0';
}
