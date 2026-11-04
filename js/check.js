// Answer checking for assignments: numbers, functions (up to a constant), choices.
// Student answers are typed in MATLAB syntax and evaluated by the sandbox interpreter.

import { Matlab } from './matlab/interp.js';
import { compile } from './matlab/compile.js';

let interp = null;
function M() { return (interp = interp || new Matlab()); }

export function evalStudentNumber(src) {
  const s = String(src).trim().replace(/,(?=\d{3}\b)/g, '').replace(/−/g, '-');
  if (!s) throw new Error('Enter an answer.');
  if (/\bsyms\b/.test(s)) throw new Error('Symbolic toolbox is not allowed.');
  return M().evalNumber(s);
}

function closeEnough(a, b, tol) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return a === b;
  const t = tol ?? 1e-3;
  return Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
}

// part: { kind:'numeric', answer: number | 'matlab expr', tol }
export function checkNumeric(part, input) {
  let v;
  try { v = evalStudentNumber(input); } catch (e) { return { ok: false, error: e.message }; }
  const target = typeof part.answer === 'number' ? part.answer : M().evalNumber(String(part.answer));
  const answers = [target, ...(part.alsoAccept || []).map((x) => (typeof x === 'number' ? x : M().evalNumber(String(x))))];
  const ok = answers.some((t) => closeEnough(v, t, part.tol));
  return { ok, value: v, target };
}

// part: { kind:'expression', answer:'matlab expr', variable:'x', domain:[a,b], upToConstant }
export function checkExpression(part, input) {
  const variable = part.variable || 'x';
  const src = String(input).trim();
  if (!src) return { ok: false, error: 'Enter an expression.' };
  if (/\bsyms\b/.test(src)) return { ok: false, error: 'Symbolic toolbox is not allowed.' };
  let fs, ft;
  try {
    fs = compile(src, [variable]);
    ft = compile(String(part.answer), [variable]);
  } catch (e) { return { ok: false, error: e.message }; }
  const [a, b] = part.domain || [0.3, 2.7];
  const pts = [];
  for (let k = 0; k < 9; k++) pts.push(a + (b - a) * (k + 0.37) / 9);
  let offset = null;
  let tested = 0;
  for (const x of pts) {
    let ys, yt;
    try { ys = fs(x); yt = ft(x); } catch (e) { return { ok: false, error: e.message }; }
    if (!Number.isFinite(yt)) continue;
    if (!Number.isFinite(ys)) return { ok: false, error: `Not correct: your expression is undefined at ${variable} = ${x.toFixed(3)}, where the answer is defined.` };
    tested++;
    const d = ys - yt;
    if (part.upToConstant) {
      if (offset === null) offset = d;
      if (!closeEnough(d - offset, 0, part.tol ?? 1e-6) && Math.abs(d - offset) > 1e-6 * Math.max(1, Math.abs(yt))) return { ok: false };
    } else if (!closeEnough(ys, yt, part.tol ?? 1e-6)) return { ok: false };
  }
  if (!tested) return { ok: false, error: 'Could not evaluate the reference answer on the test points.' };
  return { ok: true, constant: offset };
}

export function checkChoice(part, value) {
  const correct = Array.isArray(part.answer) ? part.answer : [part.answer];
  if (part.multiple) {
    const chosen = [...value].sort();
    return { ok: chosen.length === correct.length && chosen.every((c, i) => c === [...correct].sort()[i]) };
  }
  return { ok: correct.includes(+value) };
}

export function checkPart(part, input) {
  switch (part.kind) {
    case 'numeric': return checkNumeric(part, input);
    case 'expression': return checkExpression(part, input);
    case 'choice': return checkChoice(part, input);
    default: return { ok: null };
  }
}

// Fill-in-the-blank answers. spec: { answers: [alternatives] } for words, or { num, tol } for numbers.
// Words: case, spaces, hyphens and punctuation are ignored, and one typo is forgiven in words of 5+ letters.
const normWord = (s) => String(s).toLowerCase().normalize('NFKC').replace(/[−–—]/g, '-').replace(/[\s\-_.,;:!?'"()]+/g, '');
function editDistance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
export function checkText(spec, input) {
  const raw = String(input ?? '').trim();
  if (!raw) return { ok: false };
  if (typeof spec.num === 'number') {
    const x = parseFloat(raw.replace(',', '.').replace(/−/g, '-'));
    const tol = spec.tol ?? 0.01;
    return { ok: Number.isFinite(x) && Math.abs(x - spec.num) <= Math.max(Math.abs(spec.num) * tol, 1e-9) };
  }
  const v = normWord(raw);
  return { ok: (spec.answers || []).some((a) => { const t = normWord(a); return t === v || (t.length >= 5 && editDistance(t, v) <= 1); }) };
}
