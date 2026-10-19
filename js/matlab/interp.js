// Tree-walking interpreter for the MATLAB subset. Entry points:
//   const m = new Matlab(); const res = m.run(code);   // res.outputs: text / figure / error / warning
//   m.evalNumber('24*sqrt(3)/5')
//   m.makeFunction('x.^2', ['x'])                       // JS function of numbers

import { parse, parseExpression, MatlabError } from './parser.js';
import { Mat, Str, Cell, Obj, Fn, toMat, toNumber, toStr, typeName, isTruthy, formatValue, formatNumberShort, setFormat, getFormat } from './value.js';
import { integrate, fzero, fminbnd, polyRoots, ode45, solveLinear, gammaFn, erf } from './numeric.js';

const COLORS = ['#0072BD', '#D95319', '#EDB120', '#7E2F8E', '#77AC30', '#4DBEEE', '#A2142F'];
const COLOR_CHARS = { r: '#FF0000', g: '#00FF00', b: '#0000FF', c: '#00FFFF', m: '#FF00FF', y: '#FFFF00', k: '#000000', w: '#FFFFFF' };
const GRAPHICS = new Set(['plot', 'scatter', 'stem', 'bar', 'area', 'fill', 'fplot', 'quiver', 'xline', 'yline', 'text', 'figure', 'gca', 'gcf']);
const SYMBOLIC = new Set(['syms', 'sym', 'int', 'solve', 'subs', 'simplify', 'vpa', 'dsolve', 'symsum', 'limit', 'taylor', 'expand', 'factor', 'pretty', 'latex', 'fplot3']);

class BreakSignal { }
class ContinueSignal { }
class ReturnSignal { }

function sizeErr() { return new MatlabError('Arrays have incompatible sizes for this operation.'); }

// ---------------------------------------------------------------- elementwise helpers

function broadcast(a, b, fr, fc) {
  const r = a.r === b.r ? a.r : a.r === 1 ? b.r : b.r === 1 ? a.r : -1;
  const c = a.c === b.c ? a.c : a.c === 1 ? b.c : b.c === 1 ? a.c : -1;
  if (r < 0 || c < 0) throw sizeErr();
  const out = new Mat(r, c);
  const complex = a.im || b.im;
  if (complex && fc) out.im = new Float64Array(r * c);
  for (let j = 0; j < c; j++) {
    for (let i = 0; i < r; i++) {
      const ia = (a.c === 1 ? 0 : j) * a.r + (a.r === 1 ? 0 : i);
      const ib = (b.c === 1 ? 0 : j) * b.r + (b.r === 1 ? 0 : i);
      const k = j * r + i;
      if (complex && fc) {
        const [x, y] = fc(a.re[ia], a.im ? a.im[ia] : 0, b.re[ib], b.im ? b.im[ib] : 0);
        out.re[k] = x; out.im[k] = y;
      } else out.re[k] = fr(a.re[ia], b.re[ib]);
    }
  }
  if (out.im) out.dropImagIfZero();
  return out;
}

function map(a, fr, fc) {
  const out = new Mat(a.r, a.c);
  if (a.im && fc) {
    out.im = new Float64Array(a.n);
    for (let k = 0; k < a.n; k++) { const [x, y] = fc(a.re[k], a.im[k]); out.re[k] = x; out.im[k] = y; }
    return out.dropImagIfZero();
  }
  for (let k = 0; k < a.n; k++) out.re[k] = fr(a.re[k]);
  return out;
}

const cmul = (a, b, c, d) => [a * c - b * d, a * d + b * c];
const cdiv = (a, b, c, d) => { const den = c * c + d * d; return [(a * c + b * d) / den, (b * c - a * d) / den]; };
function cpow(a, b, c, d) {
  if (a === 0 && b === 0) return c === 0 && d === 0 ? [1, 0] : [0, 0];
  const lr = Math.log(Math.hypot(a, b)), th = Math.atan2(b, a);
  const er = c * lr - d * th, ei = d * lr + c * th;
  const m = Math.exp(er);
  return [m * Math.cos(ei), m * Math.sin(ei)];
}
function realPow(x, y) {
  return Math.pow(x, y);
}
function powElementwise(a, b) {
  // negative base with fractional exponent gives complex result in MATLAB
  let needComplex = !!(a.im || b.im);
  if (!needComplex) {
    for (let k = 0; k < Math.max(a.n, b.n) && !needComplex; k++) {
      const x = a.re[a.n === 1 ? 0 : k], y = b.re[b.n === 1 ? 0 : k];
      if (x < 0 && !Number.isInteger(y)) needComplex = true;
    }
  }
  if (!needComplex) return broadcast(a, b, realPow);
  const A = a.clone(); if (!A.im) A.im = new Float64Array(A.n);
  return broadcast(A, b, realPow, cpow);
}

function matmul(a, b) {
  if (a.c !== b.r) {
    throw new MatlabError('Incorrect dimensions for matrix multiplication. Check that the number of columns in the first matrix matches the number of rows in the second matrix. To operate on each element of the matrix individually, use TIMES (.*) for elementwise multiplication.');
  }
  const out = new Mat(a.r, b.c);
  const complex = a.im || b.im;
  if (complex) out.im = new Float64Array(a.r * b.c);
  for (let i = 0; i < a.r; i++) {
    for (let j = 0; j < b.c; j++) {
      let sr = 0, si = 0;
      for (let k = 0; k < a.c; k++) {
        const ar = a.re[k * a.r + i], ai = a.im ? a.im[k * a.r + i] : 0;
        const br = b.re[j * b.r + k], bi = b.im ? b.im[j * b.r + k] : 0;
        sr += ar * br - ai * bi; si += ar * bi + ai * br;
      }
      out.re[j * a.r + i] = sr;
      if (complex) out.im[j * a.r + i] = si;
    }
  }
  return out.dropImagIfZero();
}

function transpose(a, conj = true) {
  const out = new Mat(a.c, a.r);
  if (a.im) out.im = new Float64Array(a.n);
  for (let i = 0; i < a.r; i++) for (let j = 0; j < a.c; j++) {
    out.re[i * a.c + j] = a.re[j * a.r + i];
    if (a.im) out.im[i * a.c + j] = conj ? -a.im[j * a.r + i] : a.im[j * a.r + i];
  }
  out.char = a.char;
  out.logical = a.logical;
  return out;
}

function rowsOf(m) { const rows = []; for (let i = 0; i < m.r; i++) { const row = []; for (let j = 0; j < m.c; j++) row.push(m.at(i, j)); rows.push(row); } return rows; }
function fromRows(rows) { const r = rows.length, c = r ? rows[0].length : 0; const m = new Mat(r, c); rows.forEach((row, i) => row.forEach((v, j) => m.set(i, j, v))); return m; }

function binaryOp(op, av, bv) {
  if ((av instanceof Str || bv instanceof Str) && op === '+') {
    return new Str(toStr(av) + toStr(bv));
  }
  if ((av instanceof Str && bv instanceof Str) && (op === '==' || op === '~=')) {
    return Mat.bool((av.v === bv.v) === (op === '=='));
  }
  if (av instanceof Fn || bv instanceof Fn) {
    throw new MatlabError(`Operator '${op}' is not supported for operands of type 'function_handle'. To evaluate a function handle, call it with an argument, e.g. f(2).`);
  }
  const a = toMat(av, 'operand'), b = toMat(bv, 'operand');
  switch (op) {
    case '+': return broadcast(a, b, (x, y) => x + y, (p, q, r, s) => [p + r, q + s]);
    case '-': return broadcast(a, b, (x, y) => x - y, (p, q, r, s) => [p - r, q - s]);
    case '.*': return broadcast(a, b, (x, y) => x * y, cmul);
    case './': return broadcast(a, b, (x, y) => x / y, cdiv);
    case '.\\': return broadcast(b, a, (x, y) => x / y, cdiv);
    case '.^': return powElementwise(a, b);
    case '*':
      if (a.isScalar() || b.isScalar()) return broadcast(a, b, (x, y) => x * y, cmul);
      return matmul(a, b);
    case '/':
      if (b.isScalar()) return broadcast(a, b, (x, y) => x / y, cdiv);
      if (a.r === 1 && b.r === 1 && a.c === b.c && !a.im && !b.im) {
        // MATLAB's mrdivide silently solves a least-squares problem here
        let num = 0, den = 0;
        for (let k = 0; k < a.c; k++) { num += a.re[k] * b.re[k]; den += b.re[k] * b.re[k]; }
        return Mat.scalar(num / den);
      }
      if (b.r === b.c && a.c === b.c) {
        // a / b = (b' \ a')'
        const sol = solveLinear(rowsOf(transpose(b)), rowsOf(transpose(a)), b.r, a.r);
        return transpose(fromRows(sol));
      }
      throw new MatlabError('Matrix dimensions must agree. To divide each element of an array individually, use RDIVIDE (./).');
    case '\\':
      if (a.isScalar()) return broadcast(b, a, (x, y) => x / y, cdiv);
      if (a.r !== a.c) throw new MatlabError('Only square systems are supported by \\ in this sandbox.');
      if (a.r !== b.r) throw new MatlabError('Matrix dimensions must agree.');
      return fromRows(solveLinear(rowsOf(a), rowsOf(b), a.r, b.c));
    case '^':
      if (a.isScalar() && b.isScalar()) return powElementwise(a, b);
      if (b.isScalar() && a.r === a.c && Number.isInteger(b.re[0]) && b.re[0] >= 0) {
        let res = new Mat(a.r, a.r); for (let i = 0; i < a.r; i++) res.set(i, i, 1);
        for (let k = 0; k < b.re[0]; k++) res = matmul(res, a);
        return res;
      }
      throw new MatlabError('Incorrect dimensions for raising a matrix to a power. Check that the matrix is square and the power is a scalar. To operate on each element of the matrix individually, use POWER (.^) for elementwise power.');
    case '==': case '~=': case '<': case '<=': case '>': case '>=': {
      const f = { '==': (x, y) => +(x === y), '~=': (x, y) => +(x !== y), '<': (x, y) => +(x < y), '<=': (x, y) => +(x <= y), '>': (x, y) => +(x > y), '>=': (x, y) => +(x >= y) }[op];
      const out = broadcast({ ...a, im: null, re: a.re, r: a.r, c: a.c }, { ...b, im: null, re: b.re, r: b.r, c: b.c }, f);
      out.logical = true;
      return out;
    }
    case '&': { const o = broadcast(a, b, (x, y) => +(x !== 0 && y !== 0)); o.logical = true; return o; }
    case '|': { const o = broadcast(a, b, (x, y) => +(x !== 0 || y !== 0)); o.logical = true; return o; }
    default: throw new MatlabError(`Unsupported operator ${op}`);
  }
}

// ---------------------------------------------------------------- indexing helpers

function indexList(arg, extent) {
  // returns array of 0-based indices
  if (arg === ':') return Array.from({ length: extent }, (_, k) => k);
  const m = arg;
  if (m.logical) {
    const out = [];
    for (let k = 0; k < m.n; k++) if (m.re[k]) out.push(k);
    if (m.n > extent && out.some((k) => k >= extent)) throw new MatlabError(`The logical indices contain a true value outside of the array bounds.`);
    return out;
  }
  const out = [];
  for (let k = 0; k < m.n; k++) {
    const v = m.re[k];
    if (!Number.isInteger(v) || v < 1) {
      throw new MatlabError(`Array indices must be positive integers or logical values.${v === 0 ? ' Index 0 is not valid — MATLAB arrays start at 1.' : ''}`);
    }
    out.push(v - 1);
  }
  return out;
}

function indexGet(v, args) {
  const m = toMat(v);
  if (args.length === 1) {
    const idx = indexList(args[0], m.n);
    for (const k of idx) if (k >= m.n) throw new MatlabError(`Index exceeds the number of array elements. Index must not exceed ${m.n}.`);
    let r, c;
    if (args[0] === ':') { r = idx.length; c = 1; } else if (m.isVector() && m.n > 0 && !(args[0].r > 1 && args[0].c > 1)) {
      if (m.r === 1) { r = 1; c = idx.length; } else { r = idx.length; c = 1; }
    } else if (args[0].logical) { r = idx.length; c = 1; if (m.r === 1) { r = 1; c = idx.length; } } else { r = args[0].r; c = args[0].c; }
    const out = new Mat(r, c);
    if (m.im) out.im = new Float64Array(r * c);
    idx.forEach((k, t) => { out.re[t] = m.re[k]; if (m.im) out.im[t] = m.im[k]; });
    out.char = m.char; out.logical = m.logical;
    return out.im ? out.dropImagIfZero() : out;
  }
  if (args.length === 2) {
    const ri = indexList(args[0], m.r), ci = indexList(args[1], m.c);
    for (const i of ri) if (i >= m.r) throw new MatlabError(`Index in position 1 exceeds array bounds. Index must not exceed ${m.r}.`);
    for (const j of ci) if (j >= m.c) throw new MatlabError(`Index in position 2 exceeds array bounds. Index must not exceed ${m.c}.`);
    const out = new Mat(ri.length, ci.length);
    if (m.im) out.im = new Float64Array(out.n);
    ci.forEach((j, cj) => ri.forEach((i, ci2) => {
      out.re[cj * ri.length + ci2] = m.re[j * m.r + i];
      if (m.im) out.im[cj * ri.length + ci2] = m.im[j * m.r + i];
    }));
    out.char = m.char; out.logical = m.logical;
    return out;
  }
  throw new MatlabError('Only 1-D and 2-D indexing is supported.');
}

function indexSet(base, args, val) {
  let m = base ? toMat(base).clone() : new Mat(0, 0);
  if (val.t === 'empty') {
    // deletion
    const idx = new Set(indexList(args[0], m.n));
    if (args.length === 1) {
      const keep = []; for (let k = 0; k < m.n; k++) if (!idx.has(k)) keep.push(m.re[k]);
      return Mat.fromArray(keep, m.c === 1 && m.r > 1);
    }
    throw new MatlabError('Deleting rows/columns is not supported in this sandbox.');
  }
  const v = toMat(val);
  if (args.length === 1) {
    const idx = indexList(args[0], m.n);
    if (v.n !== 1 && v.n !== idx.length) throw new MatlabError(`Unable to perform assignment because the left and right sides have a different number of elements.`);
    const maxK = Math.max(-1, ...idx);
    if (maxK >= m.n) {
      // grow (vectors only)
      if (m.n === 0) m = new Mat(1, maxK + 1);
      else if (m.r === 1) { const g = new Mat(1, maxK + 1); g.re.set(m.re); m = g; } else if (m.c === 1) { const g = new Mat(maxK + 1, 1); g.re.set(m.re); m = g; } else throw new MatlabError('Attempt to grow array along ambiguous dimension.');
    }
    if (v.im && !m.im) m.im = new Float64Array(m.n);
    idx.forEach((k, t) => { m.re[k] = v.re[v.n === 1 ? 0 : t]; if (m.im) m.im[k] = v.im ? v.im[v.n === 1 ? 0 : t] : 0; });
    return m;
  }
  if (args.length === 2) {
    const ri = indexList(args[0], m.r), ci = indexList(args[1], m.c);
    const R = Math.max(m.r, ...ri.map((x) => x + 1)), C = Math.max(m.c, ...ci.map((x) => x + 1));
    if (R !== m.r || C !== m.c) {
      const g = new Mat(R, C);
      for (let i = 0; i < m.r; i++) for (let j = 0; j < m.c; j++) g.set(i, j, m.at(i, j));
      m = g;
    }
    if (v.n !== 1 && v.n !== ri.length * ci.length) throw new MatlabError('Unable to perform assignment because the size of the left side and the size of the right side differ.');
    let t = 0;
    ci.forEach((j) => ri.forEach((i) => { m.set(i, j, v.re[v.n === 1 ? 0 : t]); t++; }));
    return m;
  }
  throw new MatlabError('Only 1-D and 2-D indexing is supported.');
}

function concat(rows) {
  // rows: array of arrays of values
  const allStr = rows.flat().some((v) => v instanceof Str || (v instanceof Mat && v.char));
  if (allStr && rows.length === 1) {
    const anyDq = rows[0].some((v) => v instanceof Str && v.dq);
    return new Str(rows[0].map((v) => toStr(v)).join(''), anyDq);
  }
  const rowMats = rows.map((row) => {
    const ms = row.map((v) => toMat(v)).filter((m) => !(m.r === 0 && m.c === 0) || row.length === 1);
    if (!ms.length) return new Mat(0, 0);
    const r = ms[0].r;
    for (const m of ms) if (m.r !== r) throw new MatlabError('Dimensions of arrays being concatenated are not consistent.');
    const c = ms.reduce((s, m) => s + m.c, 0);
    const out = new Mat(r, c);
    const complex = ms.some((m) => m.im);
    if (complex) out.im = new Float64Array(r * c);
    let off = 0;
    for (const m of ms) {
      out.re.set(m.re, off * r);
      if (complex && m.im) out.im.set(m.im, off * r);
      off += m.c;
    }
    out.logical = ms.every((m) => m.logical);
    return out;
  }).filter((m) => m.n > 0 || rows.length === 1);
  if (!rowMats.length) return new Mat(0, 0);
  if (rowMats.length === 1) return rowMats[0];
  const c = rowMats[0].c;
  for (const m of rowMats) if (m.c !== c) throw new MatlabError('Dimensions of arrays being concatenated are not consistent.');
  const r = rowMats.reduce((s, m) => s + m.r, 0);
  const out = new Mat(r, c);
  let ro = 0;
  for (const m of rowMats) {
    for (let i = 0; i < m.r; i++) for (let j = 0; j < c; j++) out.set(ro + i, j, m.at(i, j));
    ro += m.r;
  }
  return out;
}

// ---------------------------------------------------------------- printf

function sprintf(fmt, args) {
  const flat = [];
  for (const a of args) {
    if (a instanceof Str) flat.push(a.v);
    else if (a instanceof Mat && a.char) flat.push(toStr(a));
    else { const m = toMat(a); for (let k = 0; k < m.n; k++) flat.push(m.re[k]); }
  }
  const unescape = (s) => s.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\').replace(/%%/g, '\u0000');
  const f = unescape(fmt);
  const spec = /%([-+ 0#]*)(\d+|\*)?(?:\.(\d+))?([dicfeEgGsux])/g;
  const nSpecs = (f.match(spec) || []).length;
  let out = '';
  let ai = 0;
  const one = () => f.replace(spec, (_, flags, width, prec, conv) => {
    let v = flat[ai++];
    if (v === undefined) return '';
    let s;
    const p = prec !== undefined ? +prec : undefined;
    switch (conv) {
      case 'd': case 'i': case 'u':
        if (typeof v === 'string') s = v;
        else s = Number.isInteger(v) ? String(v) : v.toExponential(p ?? 6).replace(/e([+-])(\d)$/, 'e$10$2');
        break;
      case 'f': s = typeof v === 'string' ? v : v.toFixed(p ?? 6); break;
      case 'e': case 'E': s = typeof v === 'string' ? v : v.toExponential(p ?? 6).replace(/e([+-])(\d)$/, 'e$10$2'); if (conv === 'E') s = s.toUpperCase(); break;
      case 'g': case 'G': {
        if (typeof v === 'string') { s = v; break; }
        const P = p === 0 ? 1 : (p ?? 6);
        if (v === 0) { s = '0'; break; }
        const e = Math.floor(Math.log10(Math.abs(v)));
        if (e < -4 || e >= P) s = v.toExponential(P - 1).replace(/\.?0+e/, 'e').replace(/e([+-])(\d)$/, 'e$10$2');
        else s = v.toFixed(Math.max(0, P - 1 - e)).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
        if (!Number.isFinite(v)) s = v > 0 ? 'Inf' : v < 0 ? '-Inf' : 'NaN';
        break;
      }
      case 's': s = typeof v === 'string' ? v : formatNumberShort(v).replace(/\.?0+$/, ''); break;
      case 'c': s = typeof v === 'string' ? v : String.fromCharCode(v); break;
      case 'x': s = Math.trunc(v).toString(16); break;
      default: s = String(v);
    }
    if (typeof v === 'number' && !Number.isFinite(v) && conv !== 'g' && conv !== 'G') s = Number.isNaN(v) ? 'NaN' : v > 0 ? 'Inf' : '-Inf';
    if (flags.includes('+') && typeof v === 'number' && v >= 0) s = '+' + s;
    if (width && width !== '*') s = flags.includes('-') ? s.padEnd(+width) : s.padStart(+width, flags.includes('0') ? '0' : ' ');
    return s;
  });
  if (nSpecs === 0 || flat.length === 0) out = f.replace(spec, '');
  else { do { out += one(); } while (ai < flat.length); }
  return out.replace(/\u0000/g, '%');
}

function num2str(v, p) {
  if (v instanceof Str) return v.v;
  const m = toMat(v);
  if (m.char) return toStr(m);
  const fmt1 = (x) => {
    if (p instanceof Str) return sprintf(p.v, [Mat.scalar(x)]);
    if (Number.isInteger(x)) return String(x);
    if (!Number.isFinite(x)) return Number.isNaN(x) ? 'NaN' : x > 0 ? 'Inf' : '-Inf';
    const P = p !== undefined ? toNumber(p) : Math.max(Math.floor(Math.log10(Math.abs(x))) + 5, 5);
    return sprintf(`%.${P}g`, [Mat.scalar(x)]);
  };
  const parts = Array.from(m.re, fmt1);
  if (m.im) return parts.map((s, k) => `${s}${m.im[k] < 0 ? '-' : '+'}${fmt1(Math.abs(m.im[k]))}i`).join('  ');
  return parts.join('  ');
}

// ---------------------------------------------------------------- linespec

function parseLineSpec(s) {
  const out = {};
  let rest = s;
  const styles = ['--', '-.', '-', ':'];
  for (const st of styles) if (rest.includes(st)) { out.LineStyle = st; rest = rest.replace(st, ''); break; }
  for (const ch of rest) {
    if (COLOR_CHARS[ch]) out.Color = COLOR_CHARS[ch];
    else if ('o+*.xsd^v<>ph'.includes(ch)) out.Marker = ch;
  }
  if (out.Marker && !out.LineStyle) out.LineStyle = 'none';
  return out;
}

function colorValue(v) {
  if (v instanceof Str || (v instanceof Mat && v.char)) {
    const s = toStr(v);
    const named = { red: 'r', green: 'g', blue: 'b', cyan: 'c', magenta: 'm', yellow: 'y', black: 'k', white: 'w' };
    const c = COLOR_CHARS[named[s] || s];
    return c || s;
  }
  const m = toMat(v);
  if (m.n === 3) return `rgb(${Math.round(m.re[0] * 255)},${Math.round(m.re[1] * 255)},${Math.round(m.re[2] * 255)})`;
  return '#000';
}

// ---------------------------------------------------------------- interpreter

export class Matlab {
  constructor() {
    this.globals = new Map();
    this.functions = {};
    this.reset();
  }

  reset() {
    this.globals = new Map();
    this.functions = {};
    this.figures = [];
    this.currentFigure = null;
    setFormat('short');
  }

  // run a script; returns { outputs, error }
  run(code, { keepFigures = false } = {}) {
    this.out = [];
    this.touchedFigures = new Set();
    if (!keepFigures) { this.figures = []; this.currentFigure = null; }
    this.steps = 0;
    let ast;
    try {
      ast = parse(code);
    } catch (e) {
      this.emitError(e);
      return { outputs: this.out, ok: false };
    }
    Object.assign(this.functions, ast.functions);
    let ok = true;
    try {
      this.execBlock(ast.body, this.globals);
    } catch (e) {
      if (!(e instanceof ReturnSignal)) { this.emitError(e); ok = false; }
    }
    for (const fig of this.figures) if (this.touchedFigures.has(fig)) this.out.push({ type: 'figure', figure: this.snapshot(fig) });
    return { outputs: this.out, ok };
  }

  emitError(e) {
    if (e instanceof MatlabError) this.out.push({ type: 'error', text: e.message, line: e.line });
    else if (e instanceof RangeError) this.out.push({ type: 'error', text: 'Maximum recursion limit reached.' });
    else { this.out.push({ type: 'error', text: `Internal error: ${e.message}` }); console.error(e); }
  }

  print(text) {
    const last = this.out[this.out.length - 1];
    if (last && last.type === 'text') last.text += text;
    else this.out.push({ type: 'text', text });
  }
  warn(text) { this.out.push({ type: 'warning', text: `Warning: ${text}` }); }

  // ------- public helpers for answer checking
  evalValue(expr, vars = {}) {
    const env = new Map(this.globals);
    for (const [k, v] of Object.entries(vars)) env.set(k, typeof v === 'number' ? Mat.scalar(v) : v);
    this.out = [];
    this.steps = 0;
    return this.evalExpr(parseExpression(expr), env, 1);
  }
  evalNumber(expr, vars = {}) {
    const v = this.evalValue(expr, vars);
    const m = toMat(v);
    if (m.n !== 1) throw new MatlabError('Expected a single number.');
    return m.re[0];
  }
  makeFunction(expr, params = ['x']) {
    const ast = parseExpression(expr);
    return (...xs) => {
      const env = new Map(this.globals);
      params.forEach((p, k) => env.set(p, Mat.scalar(xs[k])));
      this.steps = 0;
      const m = toMat(this.evalExpr(ast, env, 1));
      if (m.n !== 1) throw new MatlabError('Expression did not produce a single number.');
      if (m.im && Math.abs(m.im[0]) > 1e-12) return NaN;
      return m.re[0];
    };
  }
  getVar(name) { return this.globals.get(name); }

  // ------- statements
  execBlock(stmts, env) {
    for (const s of stmts) this.exec(s, env);
  }

  exec(s, env) {
    if (++this.steps > 5e6) throw new MatlabError('Execution stopped: too many steps (infinite loop?).');
    try {
      switch (s.type) {
        case 'expr': {
          const e = s.expr;
          // bare identifier that is a variable: display it
          if (e.type === 'id' && env.has(e.name)) {
            if (s.print) this.print(formatValue(e.name, env.get(e.name)) + '\n');
            return;
          }
          const vals = this.evalMulti(e, env, 0, true);
          if (vals.length && vals[0] !== undefined) {
            env.set('ans', vals[0]);
            if (s.print && !s.command) this.print(formatValue('ans', vals[0]) + '\n');
          }
          return;
        }
        case 'assign': {
          const val = s.expr.type === 'empty' ? { t: 'empty' } : this.evalExpr(s.expr, env, 1);
          const name = this.assign(s.target, val, env);
          if (s.print && name) this.print(formatValue(name, env.get(name)) + '\n');
          return;
        }
        case 'multiassign': {
          const vals = this.evalMulti(s.expr, env, s.targets.length);
          s.targets.forEach((t, k) => {
            if (!t) return;
            if (vals[k] === undefined) throw new MatlabError('Too many output arguments.');
            const name = this.assign(t, vals[k], env);
            if (s.print && name) this.print(formatValue(name, env.get(name)) + '\n');
          });
          return;
        }
        case 'if': {
          for (const c of s.clauses) {
            if (isTruthy(this.evalExpr(c.cond, env, 1))) { this.execBlock(c.body, env); return; }
          }
          if (s.elseBody) this.execBlock(s.elseBody, env);
          return;
        }
        case 'for': {
          const rv = this.evalExpr(s.range, env, 1);
          const items = [];
          if (rv instanceof Cell) rv.items.forEach((it) => items.push(new Cell([it])));
          else {
            const m = toMat(rv);
            for (let j = 0; j < m.c; j++) items.push(m.r === 1 ? Mat.scalar(m.re[j]) : indexGet(m, [':', Mat.scalar(j + 1)]));
          }
          for (const it of items) {
            env.set(s.varName, it);
            try { this.execBlock(s.body, env); } catch (e) {
              if (e instanceof BreakSignal) break;
              if (e instanceof ContinueSignal) continue;
              throw e;
            }
          }
          return;
        }
        case 'while': {
          while (isTruthy(this.evalExpr(s.cond, env, 1))) {
            try { this.execBlock(s.body, env); } catch (e) {
              if (e instanceof BreakSignal) break;
              if (e instanceof ContinueSignal) continue;
              throw e;
            }
          }
          return;
        }
        case 'switch': {
          const v = this.evalExpr(s.subject, env, 1);
          for (const c of s.cases) {
            const cv = this.evalExpr(c.val, env, 1);
            const match = (x) => (v instanceof Str || (v instanceof Mat && v.char)) ? toStr(v) === toStr(x) : toNumber(v) === toNumber(x);
            if (cv instanceof Cell ? cv.items.some(match) : match(cv)) { this.execBlock(c.body, env); return; }
          }
          if (s.otherwise) this.execBlock(s.otherwise, env);
          return;
        }
        case 'break': throw new BreakSignal();
        case 'continue': throw new ContinueSignal();
        case 'return': throw new ReturnSignal();
        default: throw new MatlabError(`Unsupported statement ${s.type}`);
      }
    } catch (e) {
      if (e instanceof MatlabError && e.line === undefined) e.line = s.line;
      throw e;
    }
  }

  assign(target, val, env) {
    if (target.type === 'id') {
      if (val.t === 'empty') { env.set(target.name, new Mat(0, 0)); return target.name; }
      env.set(target.name, val);
      return target.name;
    }
    if (target.type === 'index') {
      const root = rootName(target);
      const base = target.obj.type === 'id' ? env.get(target.obj.name) : this.evalExpr(target.obj, env, 1);
      if (target.brace) {
        const cell = base instanceof Cell ? base : new Cell([]);
        const k = toNumber(this.evalExpr(target.args[0], env, 1)) - 1;
        const items = cell.items.slice();
        while (items.length <= k) items.push(new Mat(0, 0));
        items[k] = val;
        return this.assign(target.obj, new Cell(items), env) || root;
      }
      if (base instanceof Fn) throw new MatlabError('Unable to index into a function handle.');
      const args = this.withEnd(base, target.args.length, () => target.args.map((a, k) => this.evalIndexArg(a, env, base, k, target.args.length)));
      const nv = indexSet(base, args, val);
      return this.assign(target.obj, nv, env) || root;
    }
    if (target.type === 'field') {
      let base;
      try { base = this.evalExpr(target.obj, env, 1); } catch { base = undefined; }
      if (!(base instanceof Obj)) base = new Obj('struct', {});
      // graphics handles are mutable references; structs copy on write
      const obj = base.kind === 'struct' ? new Obj('struct', { ...base.props }) : base;
      obj.props[target.name] = val;
      if (base.kind !== 'struct') this.touchedFigures.add(obj.props._fig);
      return this.assign(target.obj, obj, env) || rootName(target);
    }
    throw new MatlabError('Invalid assignment target.');
  }

  withEnd(base, nargs, fn) {
    this.endStack = this.endStack || [];
    this.endStack.push({ base, nargs });
    try { return fn(); } finally { this.endStack.pop(); }
  }

  evalIndexArg(a, env, base, k, nargs) {
    if (a.type === 'colon') return ':';
    const ctx = this.endStack[this.endStack.length - 1];
    ctx.k = k;
    ctx.nargs = nargs;
    const v = this.evalExpr(a, env, 1);
    if (v instanceof Str) throw new MatlabError('Array indices must be positive integers or logical values.');
    return toMat(v);
  }

  // ------- expressions
  evalExpr(e, env, nargout = 1) {
    const vals = this.evalMulti(e, env, nargout);
    if (!vals.length || vals[0] === undefined) {
      throw new MatlabError('This function does not return a value, so it cannot be used in an expression or assignment.');
    }
    return vals[0];
  }

  evalMulti(e, env, nargout = 1, statement = false) {
    switch (e.type) {
      case 'num': return [e.imag ? Mat.scalar(0, e.value) : Mat.scalar(e.value)];
      case 'str': return [new Str(e.value, e.dq)];
      case 'paren': return [this.evalExpr(e.expr, env, 1)];
      case 'end': {
        const ctx = this.endStack && this.endStack[this.endStack.length - 1];
        if (!ctx) throw new MatlabError('"end" can only be used inside an index expression.');
        const b = ctx.base;
        if (b instanceof Cell) return [Mat.scalar(b.items.length)];
        const m = b instanceof Str ? toMat(b) : toMat(b);
        if (ctx.nargs === 1) return [Mat.scalar(m.n)];
        return [Mat.scalar(ctx.k === 0 ? m.r : m.c)];
      }
      case 'id': {
        if (env.has(e.name)) return [env.get(e.name)];
        return this.callNamed(e.name, [], env, nargout, statement);
      }
      case 'bin': {
        if (e.op === '&&' || e.op === '||') {
          const l = this.evalExpr(e.l, env, 1);
          const lm = toMat(l);
          if (lm.n !== 1) throw new MatlabError(`Operands to the ${e.op} operator must be convertible to logical scalar values. Use the ${e.op === '&&' ? 'AND (&)' : 'OR (|)'} operator instead.`);
          const lv = isTruthy(l);
          if (e.op === '&&' && !lv) return [Mat.bool(false)];
          if (e.op === '||' && lv) return [Mat.bool(true)];
          const r = this.evalExpr(e.r, env, 1);
          return [Mat.bool(isTruthy(r))];
        }
        const l = this.evalExpr(e.l, env, 1);
        const r = this.evalExpr(e.r, env, 1);
        return [binaryOp(e.op, l, r)];
      }
      case 'unary': {
        const v = this.evalExpr(e.operand, env, 1);
        if (e.op === '+') return [toMat(v)];
        if (e.op === '-') {
          if (v instanceof Fn) throw new MatlabError("Operator '-' is not supported for operands of type 'function_handle'.");
          return [map(toMat(v), (x) => -x, (x, y) => [-x, -y])];
        }
        const o = map(toMat(v), (x) => +(x === 0)); o.logical = true; return [o];
      }
      case 'transpose': return [transpose(toMat(this.evalExpr(e.operand, env, 1)))];
      case 'range': {
        const a = toNumber(this.evalExpr(e.start, env, 1), 'range start');
        const st = e.step ? toNumber(this.evalExpr(e.step, env, 1), 'range step') : 1;
        const b = toNumber(this.evalExpr(e.stop, env, 1), 'range end');
        if (st === 0 || (st > 0 && a > b) || (st < 0 && a < b)) return [new Mat(1, 0)];
        const n = Math.floor((b - a) / st + 1e-10) + 1;
        if (n > 5e6) throw new MatlabError('Maximum variable size allowed on the device is exceeded.');
        const m = new Mat(1, n);
        for (let k = 0; k < n; k++) m.re[k] = a + k * st;
        return [m];
      }
      case 'matrix': {
        const rows = e.rows.map((row) => row.map((x) => this.evalExpr(x, env, 1)));
        if (!rows.length) return [new Mat(0, 0)];
        return [concat(rows)];
      }
      case 'cell': {
        const items = e.rows.flat().map((x) => this.evalExpr(x, env, 1));
        return [new Cell(items, e.rows.length || 1, e.rows.length ? e.rows[0].length : 0)];
      }
      case 'lambda': {
        // capture current workspace by value (MATLAB semantics)
        const captured = new Map(env);
        return [new Fn({ params: e.params, body: e.body, env: captured, src: `@(${e.params.join(',')})${exprToSource(e.body)}` })];
      }
      case 'fhandle': {
        if (this.functions[e.name]) return [new Fn({ name: e.name, builtin: 'user' })];
        if (BUILTINS[e.name] || MATHFN[e.name]) return [new Fn({ name: e.name, builtin: 'builtin' })];
        return [new Fn({ name: e.name, builtin: 'builtin' })];
      }
      case 'field': {
        const base = this.evalExpr(e.obj, env, 1);
        if (base instanceof Obj) {
          if (!(e.name in base.props)) throw new MatlabError(`Unrecognized field name "${e.name}".`);
          const v = base.props[e.name];
          return [jsToValue(v)];
        }
        throw new MatlabError(`Dot indexing is not supported for variables of this type (${typeName(base)}).`);
      }
      case 'index': {
        // f(args): variable indexing, handle call or function call
        if (e.obj.type === 'id' && !env.has(e.obj.name)) {
          const args = e.args.map((a) => (a.type === 'colon' ? new Str(':') : this.evalExpr(a, env, 1)));
          return this.callNamed(e.obj.name, args, env, nargout, statement);
        }
        const base = this.evalExpr(e.obj, env, 1);
        if (base instanceof Fn) {
          const args = e.args.map((a) => this.evalExpr(a, env, 1));
          return this.callFn(base, args, nargout);
        }
        if (base instanceof Cell) {
          const args = this.withEnd(base, e.args.length, () => e.args.map((a, k) => this.evalIndexArg(a, env, base, k, e.args.length)));
          const idx = indexList(args[0], base.items.length);
          if (e.brace) return idx.map((k) => { if (k >= base.items.length) throw new MatlabError('Index exceeds the number of array elements.'); return base.items[k]; });
          return [new Cell(idx.map((k) => base.items[k]))];
        }
        if (base instanceof Str) {
          if (!base.dq) {
            const args = this.withEnd(base, e.args.length, () => e.args.map((a, k) => this.evalIndexArg(a, env, base, k, e.args.length)));
            const m = indexGet(toMat(base), args);
            return [new Str(String.fromCharCode(...m.re), false)];
          }
          return [base];
        }
        if (base instanceof Obj) throw new MatlabError('Indexing into objects is not supported.');
        const args = this.withEnd(base, e.args.length, () => e.args.map((a, k) => this.evalIndexArg(a, env, base, k, e.args.length)));
        return [indexGet(base, args)];
      }
      default: throw new MatlabError(`Unsupported expression ${e.type}`);
    }
  }

  callFn(fn, args, nargout = 1) {
    if (fn.builtin === 'user') return this.callUser(fn.name, args, nargout);
    if (fn.builtin === 'builtin') return this.callNamed(fn.name, args, this.globals, nargout);
    if (args.length > fn.params.length) throw new MatlabError('Too many input arguments.');
    const env = new Map(fn.env);
    fn.params.forEach((p, k) => { if (k < args.length && p !== '~') env.set(p, args[k]); });
    for (let k = args.length; k < fn.params.length; k++) env.delete(fn.params[k]);
    return this.evalMulti(fn.body, env, nargout);
  }

  callUser(name, args, nargout) {
    const f = this.functions[name];
    if (args.length > f.params.length) throw new MatlabError(`Too many input arguments when calling ${name}.`);
    const env = new Map();
    f.params.forEach((p, k) => { if (k < args.length) env.set(p, args[k]); });
    env.set('nargin', Mat.scalar(args.length));
    env.set('nargout', Mat.scalar(nargout));
    this.depth = (this.depth || 0) + 1;
    if (this.depth > 200) { this.depth = 0; throw new MatlabError('Maximum recursion limit of 200 reached.'); }
    try { this.execBlock(f.body, env); } catch (e) { if (!(e instanceof ReturnSignal)) throw e; } finally { this.depth--; }
    return f.outs.slice(0, Math.max(1, nargout)).map((o, k) => {
      if (!env.has(o)) {
        if (k === 0 && nargout === 0) return undefined;
        throw new MatlabError(`Output argument "${o}" (and possibly others) not assigned a value in the execution with "${name}" function.`);
      }
      return env.get(o);
    });
  }

  callNamed(name, args, env, nargout, statement = false) {
    if (this.functions[name]) return this.callUser(name, args, nargout);
    if (SYMBOLIC.has(name)) {
      throw new MatlabError(`"${name}" belongs to the Symbolic Math Toolbox, which is not allowed in this course's homework or exams. Do the algebra by hand, and use numeric tools (integral, fzero, ode45, roots...) only to check results.`);
    }
    const mf = MATHFN[name];
    if (mf) {
      if (args.length !== 1) throw new MatlabError(args.length ? `Too many input arguments for ${name}.` : `Not enough input arguments for ${name}.`);
      return [mf(toMat(args[0]))];
    }
    const b = BUILTINS[name];
    if (b) {
      const res = b.call(this, args, nargout, env, statement);
      if (GRAPHICS.has(name) && nargout === 0) return [];
      return Array.isArray(res) ? res : res === undefined ? [] : [res];
    }
    const near = Object.keys(env instanceof Map ? Object.fromEntries(env) : {}).find((k) => k.toLowerCase() === name.toLowerCase());
    throw new MatlabError(`Unrecognized function or variable '${name}'.${near ? ` Did you mean '${near}'? (MATLAB is case sensitive)` : ''}`);
  }

  // call a MATLAB function value from JS with numeric args (scalars or arrays)
  callNumeric(fn, args) {
    const vals = args.map((a) => (Array.isArray(a) ? Mat.fromArray(a) : a instanceof Mat ? a : Mat.scalar(a)));
    const r = this.callFn(fn, vals, 1)[0];
    if (r === undefined) throw new MatlabError('Function did not return a value.');
    return toMat(r);
  }

  // ------- graphics
  fig() {
    if (!this.currentFigure) {
      this.currentFigure = newFigure(this.figures.length + 1);
      this.figures.push(this.currentFigure);
    }
    this.touchedFigures.add(this.currentFigure);
    return this.currentFigure;
  }
  addSeries(kind, props) {
    const f = this.fig();
    if (!f.hold) { f.series = []; f.legend = null; f.xlim = null; f.ylim = null; f.colorIndex = 0; }
    if (!props.Color) props.Color = COLORS[f.colorIndex++ % COLORS.length];
    const obj = new Obj(kind, { LineWidth: 0.5, LineStyle: '-', Marker: 'none', DisplayName: '', ...props, _fig: f });
    f.series.push(obj);
    return obj;
  }

  snapshot(f) {
    const toArr = (v) => (v instanceof Mat ? Array.from(v.re) : Array.isArray(v) ? v : v === undefined ? [] : [toNumber(jsToValue(v))]);
    const str = (v) => (v === undefined || v === null ? '' : typeof v === 'string' ? v : v instanceof Str || v instanceof Mat ? toStr(v) : String(v));
    const numv = (v, d) => (v === undefined ? d : typeof v === 'number' ? v : toNumber(jsToValue(v)));
    const series = f.series.map((o) => {
      const p = o.props;
      const base = { type: o.kind, color: colorValue(jsToValue(p.Color)), width: numv(p.LineWidth, 0.5), style: str(p.LineStyle), marker: str(p.Marker), name: str(p.DisplayName), markerSize: numv(p.MarkerSize, 6) };
      if (o.kind === 'fplot') {
        const [a, b] = f.xlim || p._range;
        const xs = [], ys = [];
        const N = 600;
        for (let k = 0; k <= N; k++) xs.push(a + (b - a) * k / N);
        try { ys.push(...p._sample(xs)); } catch { /* ignore */ }
        return { ...base, type: 'line', x: xs, y: ys };
      }
      if (o.kind === 'quiver') {
        return { ...base, x: toArr(p.XData), y: toArr(p.YData), u: toArr(p.UData), v: toArr(p.VData), arrows: str(p.ShowArrowHead) !== 'off' };
      }
      if (o.kind === 'text') return { ...base, x: toArr(p.Position)[0], y: toArr(p.Position)[1], text: str(p.String) };
      if (o.kind === 'xline' || o.kind === 'yline') return { ...base, value: numv(p.Value, 0), label: str(p.Label) };
      return { ...base, x: toArr(p.XData), y: toArr(p.YData) };
    });
    return {
      series, title: f.title, xlabel: f.xlabel, ylabel: f.ylabel, xlim: f.xlim, ylim: f.ylim,
      grid: f.grid, box: f.box, axisEqual: f.axisEqual, legend: f.legend, legendLatex: f.legendLatex,
    };
  }
}

function newFigure(id) {
  return { id, series: [], hold: false, grid: false, box: true, title: '', xlabel: '', ylabel: '', xlim: null, ylim: null, legend: null, axisEqual: false, colorIndex: 0 };
}

function rootName(t) {
  while (t.type !== 'id') t = t.obj;
  return t.name;
}

function jsToValue(v) {
  if (v instanceof Mat || v instanceof Str || v instanceof Fn || v instanceof Obj || v instanceof Cell) return v;
  if (typeof v === 'number') return Mat.scalar(v);
  if (typeof v === 'string') return new Str(v, false);
  if (Array.isArray(v)) return Mat.fromArray(v);
  return new Str(String(v));
}

// Pretty-print an expression AST back to MATLAB source (for function handle display)
export function exprToSource(e) {
  const p = (x) => exprToSource(x);
  switch (e.type) {
    case 'num': return String(e.value) + (e.imag ? 'i' : '');
    case 'str': return e.dq ? `"${e.value}"` : `'${e.value}'`;
    case 'id': return e.name;
    case 'paren': return `(${p(e.expr)})`;
    case 'bin': return `${p(e.l)}${e.op}${p(e.r)}`;
    case 'unary': return `${e.op}${p(e.operand)}`;
    case 'transpose': return `${p(e.operand)}'`;
    case 'range': return e.step ? `${p(e.start)}:${p(e.step)}:${p(e.stop)}` : `${p(e.start)}:${p(e.stop)}`;
    case 'index': return `${p(e.obj)}${e.brace ? '{' : '('}${e.args.map((a) => (a.type === 'colon' ? ':' : p(a))).join(',')}${e.brace ? '}' : ')'}`;
    case 'field': return `${p(e.obj)}.${e.name}`;
    case 'matrix': return `[${e.rows.map((r) => r.map(p).join(',')).join(';')}]`;
    case 'cell': return `{${e.rows.map((r) => r.map(p).join(',')).join(';')}}`;
    case 'lambda': return `@(${e.params.join(',')})${p(e.body)}`;
    case 'fhandle': return `@${e.name}`;
    case 'end': return 'end';
    case 'colon': return ':';
    default: return '?';
  }
}

// ---------------------------------------------------------------- elementwise math functions

const real1 = (f) => (m) => { if (m.im) throw new MatlabError('Complex input is not supported for this function in the sandbox.'); return map(m, f); };

const MATHFN = {
  sin: real1(Math.sin), cos: real1(Math.cos), tan: real1(Math.tan),
  sec: real1((x) => 1 / Math.cos(x)), csc: real1((x) => 1 / Math.sin(x)), cot: real1((x) => 1 / Math.tan(x)),
  asin: real1(Math.asin), acos: real1(Math.acos), atan: real1(Math.atan),
  sinh: real1(Math.sinh), cosh: real1(Math.cosh), tanh: real1(Math.tanh),
  asinh: real1(Math.asinh), acosh: real1(Math.acosh), atanh: real1(Math.atanh),
  sind: real1((x) => Math.sin(x * Math.PI / 180)), cosd: real1((x) => Math.cos(x * Math.PI / 180)), tand: real1((x) => Math.tan(x * Math.PI / 180)),
  exp: (m) => map(m, Math.exp, (a, b) => { const r = Math.exp(a); return [r * Math.cos(b), r * Math.sin(b)]; }),
  log: (m) => {
    if (!m.im && m.re.every((x) => x >= 0 || Number.isNaN(x))) return map(m, Math.log);
    const c = m.clone(); if (!c.im) c.im = new Float64Array(c.n);
    return map(c, Math.log, (a, b) => [Math.log(Math.hypot(a, b)), Math.atan2(b, a)]);
  },
  log10: real1(Math.log10), log2: real1(Math.log2), log1p: real1(Math.log1p), expm1: real1(Math.expm1),
  sqrt: (m) => {
    if (!m.im && m.re.every((x) => x >= 0 || Number.isNaN(x))) return map(m, Math.sqrt);
    const c = m.clone(); if (!c.im) c.im = new Float64Array(c.n);
    return map(c, Math.sqrt, (a, b) => cpow(a, b, 0.5, 0));
  },
  nthroot: null,
  abs: (m) => { const o = new Mat(m.r, m.c); for (let k = 0; k < m.n; k++) o.re[k] = m.im ? Math.hypot(m.re[k], m.im[k]) : Math.abs(m.re[k]); return o; },
  sign: real1(Math.sign), floor: real1(Math.floor), ceil: real1(Math.ceil), round: real1((x) => Math.sign(x) * Math.round(Math.abs(x))), fix: real1(Math.trunc),
  real: (m) => new Mat(m.r, m.c, Float64Array.from(m.re)),
  imag: (m) => new Mat(m.r, m.c, m.im ? Float64Array.from(m.im) : new Float64Array(m.n)),
  conj: (m) => { const o = m.clone(); if (o.im) o.im = o.im.map((x) => -x); return o; },
  angle: (m) => { const o = new Mat(m.r, m.c); for (let k = 0; k < m.n; k++) o.re[k] = Math.atan2(m.im ? m.im[k] : 0, m.re[k]); return o; },
  gamma: real1(gammaFn), erf: real1(erf), erfc: real1((x) => 1 - erf(x)),
  factorial: real1((x) => { if (x < 0 || !Number.isInteger(x)) throw new MatlabError('N must be an array of real non-negative integers.'); return gammaFn(x + 1); }),
  isnan: (m) => { const o = map(m, (x) => +Number.isNaN(x)); o.logical = true; return o; },
  isinf: (m) => { const o = map(m, (x) => +(Math.abs(x) === Infinity)); o.logical = true; return o; },
  isfinite: (m) => { const o = map(m, (x) => +Number.isFinite(x)); o.logical = true; return o; },
  deg2rad: real1((x) => x * Math.PI / 180), rad2deg: real1((x) => x * 180 / Math.PI),
  sinc: null,
};
delete MATHFN.nthroot;
delete MATHFN.sinc;

// ---------------------------------------------------------------- builtins

function argNum(args, k, name, def) {
  if (args[k] === undefined) { if (def !== undefined) return def; throw new MatlabError(`Not enough input arguments for ${name}.`); }
  return toNumber(args[k], `argument ${k + 1} of ${name}`);
}

function reduceDim(m, f, init) {
  // vectors -> scalar; matrices -> row vector (column-wise)
  if (m.isVector() || m.n === 0) { let s = init; for (let k = 0; k < m.n; k++) s = f(s, m.re[k]); return Mat.scalar(s); }
  const out = new Mat(1, m.c);
  for (let j = 0; j < m.c; j++) { let s = init; for (let i = 0; i < m.r; i++) s = f(s, m.at(i, j)); out.re[j] = s; }
  return out;
}

function fnArg(interp, v, name) {
  if (v instanceof Fn) return v;
  if (v instanceof Str) return new Fn({ name: v.v, builtin: 'builtin' });
  throw new MatlabError(`${name} expects a function handle as its first argument, e.g. ${name}(@(x) x.^2, ...). Got ${typeName(v)}.`);
}

function vectorSampler(interp, fn, { strict = false, label = 'fplot' } = {}) {
  // returns xs -> ys, warning if the function is not vectorised
  let warned = false;
  return (xs) => {
    let ys = null;
    try {
      const r = interp.callNumeric(fn, [xs]);
      if (r.n === xs.length) ys = Array.from(r.re, (v, k) => (r.im && Math.abs(r.im[k]) > 1e-12 ? NaN : v));
      else if (strict) throw new MatlabError('Output of the function must be the same size as the input. If FUN is an array-valued integrand, set the \'ArrayValued\' option to true.');
    } catch (e) {
      if (strict) throw e;
    }
    if (ys) return ys;
    if (!warned && label === 'fplot') { interp.warn('Function behaves unexpectedly on array inputs. To improve performance, properly vectorize your function to return an output with the same size and shape as the input arguments.'); warned = true; }
    return xs.map((x) => { const r = interp.callNumeric(fn, [x]); return r.n ? r.re[0] : NaN; });
  };
}

function lineProps(args, start) {
  // parse LineSpec and Name,Value pairs from args[start..]
  const props = {};
  let k = start;
  if (args[k] instanceof Str || (args[k] instanceof Mat && args[k].char)) {
    const s = toStr(args[k]);
    if (/^[-:.ox+*sd^v<>phrgbcmykw]+$/.test(s) && !['LineWidth', 'Color'].includes(s)) { Object.assign(props, parseLineSpec(s)); k++; }
  }
  for (; k + 1 < args.length; k += 2) {
    const name = toStr(args[k]);
    const val = args[k + 1];
    const key = { linewidth: 'LineWidth', color: 'Color', linestyle: 'LineStyle', marker: 'Marker', markersize: 'MarkerSize', displayname: 'DisplayName', markerfacecolor: 'MarkerFaceColor', showarrowhead: 'ShowArrowHead', autoscalefactor: 'AutoScaleFactor', label: 'Label' }[name.toLowerCase()] || name;
    props[key] = val instanceof Mat && !val.char && val.isScalar() ? val.re[0] : val instanceof Str ? val.v : val instanceof Mat && val.char ? toStr(val) : val;
  }
  return props;
}

const BUILTINS = {
  // constants
  pi: () => Mat.scalar(Math.PI),
  Inf: () => Mat.scalar(Infinity), inf: () => Mat.scalar(Infinity),
  NaN: () => Mat.scalar(NaN), nan: () => Mat.scalar(NaN),
  eps: () => Mat.scalar(Number.EPSILON),
  i: () => Mat.scalar(0, 1), j: () => Mat.scalar(0, 1),
  true: () => Mat.bool(true), false: () => Mat.bool(false),
  e: () => { throw new MatlabError("Unrecognized function or variable 'e'. MATLAB has no built-in constant e — use exp(1), or exp(x) for e^x."); },

  // commands
  clc() { }, close() { this.figures = []; this.currentFigure = null; }, clf() { if (this.currentFigure) { this.currentFigure.series = []; this.touchedFigures.add(this.currentFigure); } },
  clear(args) {
    if (!args.length) { this.globals.clear(); return; }
    for (const a of args) this.globals.delete(toStr(a));
  },
  more() { }, warning() { },
  format(args) { setFormat(args.length ? toStr(args[0]).toLowerCase() : 'short'); },
  disp(args) {
    const v = args[0];
    if (v === undefined) throw new MatlabError('Not enough input arguments.');
    if (v instanceof Str) { this.print(v.v + '\n'); return; }
    if (v instanceof Mat && v.char) { this.print(toStr(v) + '\n'); return; }
    if (v instanceof Mat && v.isScalar()) { this.print(formatValue('', v).trim() + '\n'); return; }
    this.print(formatValue('', v).replace(/^ = /, '') + '\n');
  },
  display(args) { this.print(formatValue('', args[0]) + '\n'); },
  fprintf(args) {
    if (!args.length) return;
    const fmt = toStr(args[0]);
    this.print(sprintf(fmt, args.slice(1)));
  },
  sprintf(args) { return new Str(sprintf(toStr(args[0]), args.slice(1)), false); },
  num2str(args) { return new Str(num2str(args[0], args[1]), false); },
  mat2str(args) {
    const m = toMat(args[0]);
    const P = args[1] ? toNumber(args[1]) : 15;
    const f = (x) => sprintf(`%.${P}g`, [Mat.scalar(x)]);
    if (m.isScalar()) return new Str(f(m.re[0]), false);
    const rows = []; for (let i = 0; i < m.r; i++) { const row = []; for (let j = 0; j < m.c; j++) row.push(f(m.at(i, j))); rows.push(row.join(' ')); }
    return new Str(`[${rows.join(';')}]`, false);
  },
  string(args) { return new Str(args[0] instanceof Str ? args[0].v : num2str(args[0])); },
  char(args) { return new Str(toStr(args[0]), false); },
  str2double(args) { const v = parseFloat(toStr(args[0])); return Mat.scalar(Number.isNaN(v) ? NaN : v); },
  str2num(args) { return this.evalValue(toStr(args[0])); },
  strcat(args) { return new Str(args.map(toStr).join(''), args.some((a) => a instanceof Str && a.dq)); },
  upper(args) { return new Str(toStr(args[0]).toUpperCase(), args[0].dq); },
  lower(args) { return new Str(toStr(args[0]).toLowerCase(), args[0].dq); },
  strcmp(args) { return Mat.bool(toStr(args[0]) === toStr(args[1])); },
  class(args) { return new Str(typeName(args[0]) === 'function_handle' ? 'function_handle' : typeName(args[0]).replace(/^graphics object.*/, 'matlab.graphics.Graphics'), false); },
  isempty(args) { const v = args[0]; return Mat.bool(v instanceof Str ? v.v.length === 0 : v instanceof Cell ? v.items.length === 0 : toMat(v).n === 0); },
  isnumeric(args) { return Mat.bool(args[0] instanceof Mat && !args[0].char && !args[0].logical); },
  ischar(args) { return Mat.bool((args[0] instanceof Str && !args[0].dq) || (args[0] instanceof Mat && args[0].char)); },
  isreal(args) { return Mat.bool(!(args[0] instanceof Mat && args[0].im)); },
  isscalar(args) { return Mat.bool(args[0] instanceof Mat && args[0].isScalar()); },
  isvector(args) { return Mat.bool(args[0] instanceof Mat && args[0].isVector()); },
  islogical(args) { return Mat.bool(args[0] instanceof Mat && args[0].logical); },
  isa(args) { return Mat.bool(typeName(args[0]) === toStr(args[1]) || (toStr(args[1]) === 'numeric' && args[0] instanceof Mat)); },
  double(args) { const m = toMat(args[0]).clone(); m.char = false; m.logical = false; return m; },
  logical(args) { const o = map(toMat(args[0]), (x) => +(x !== 0)); o.logical = true; return o; },
  tic() { this._tic = performance.now(); }, toc(args, nargout) { const t = (performance.now() - (this._tic || 0)) / 1000; if (!nargout) { this.print(`Elapsed time is ${t.toFixed(6)} seconds.\n`); return; } return Mat.scalar(t); },
  input() { throw new MatlabError('input() is not available in this sandbox. Assign the value directly instead.'); },
  error(args) { throw new MatlabError(args.length > 1 ? sprintf(toStr(args[0]), args.slice(1)) : toStr(args[0])); },
  assert(args) { if (!isTruthy(args[0])) throw new MatlabError(args[1] ? toStr(args[1]) : 'Assertion failed.'); },
  feval(args, nargout) { return this.callFn(fnArg(this, args[0], 'feval'), args.slice(1), nargout); },
  func2str(args) { const f = args[0]; return new Str(f.builtin ? f.name : f.src, false); },
  str2func(args) { const s = toStr(args[0]); return s.startsWith('@') ? this.evalValue(s) : new Fn({ name: s, builtin: this.functions[s] ? 'user' : 'builtin' }); },
  arrayfun(args) {
    const f = fnArg(this, args[0], 'arrayfun');
    const m = toMat(args[1]);
    const out = new Mat(m.r, m.c);
    for (let k = 0; k < m.n; k++) out.re[k] = toNumber(this.callFn(f, [Mat.scalar(m.re[k]), ...args.slice(2).map((a) => Mat.scalar(toMat(a).re[k]))], 1)[0]);
    return out;
  },

  // array construction
  zeros(args) { const r = argNum(args, 0, 'zeros', 1), c = args.length > 1 ? argNum(args, 1, 'zeros') : r; return new Mat(r, c); },
  ones(args) { const r = argNum(args, 0, 'ones', 1), c = args.length > 1 ? argNum(args, 1, 'ones') : r; const m = new Mat(r, c); m.re.fill(1); return m; },
  eye(args) { const r = argNum(args, 0, 'eye', 1), c = args.length > 1 ? argNum(args, 1, 'eye') : r; const m = new Mat(r, c); for (let k = 0; k < Math.min(r, c); k++) m.set(k, k, 1); return m; },
  rand(args) { const r = argNum(args, 0, 'rand', 1), c = args.length > 1 ? argNum(args, 1, 'rand') : r; const m = new Mat(r, c); for (let k = 0; k < m.n; k++) m.re[k] = Math.random(); return m; },
  randn(args) { const r = argNum(args, 0, 'randn', 1), c = args.length > 1 ? argNum(args, 1, 'randn') : r; const m = new Mat(r, c); for (let k = 0; k < m.n; k++) m.re[k] = Math.sqrt(-2 * Math.log(Math.random() || 1e-300)) * Math.cos(2 * Math.PI * Math.random()); return m; },
  linspace(args) {
    const a = argNum(args, 0, 'linspace'), b = argNum(args, 1, 'linspace'), n = Math.floor(argNum(args, 2, 'linspace', 100));
    const m = new Mat(1, n);
    for (let k = 0; k < n; k++) m.re[k] = n === 1 ? b : a + (b - a) * k / (n - 1);
    return m;
  },
  logspace(args) { const a = argNum(args, 0, 'logspace'), b = argNum(args, 1, 'logspace'), n = argNum(args, 2, 'logspace', 50); const m = new Mat(1, n); for (let k = 0; k < n; k++) m.re[k] = 10 ** (a + (b - a) * k / (n - 1)); return m; },
  meshgrid(args, nargout) {
    const x = toMat(args[0]), y = args[1] ? toMat(args[1]) : x;
    const X = new Mat(y.n, x.n), Y = new Mat(y.n, x.n);
    for (let i = 0; i < y.n; i++) for (let j = 0; j < x.n; j++) { X.set(i, j, x.re[j]); Y.set(i, j, y.re[i]); }
    return nargout > 1 ? [X, Y] : [X];
  },
  repmat(args) {
    const m = toMat(args[0]), a = argNum(args, 1, 'repmat'), b = args[2] ? argNum(args, 2, 'repmat') : a;
    const out = new Mat(m.r * a, m.c * b);
    for (let i = 0; i < out.r; i++) for (let j = 0; j < out.c; j++) out.set(i, j, m.at(i % m.r, j % m.c));
    return out;
  },
  reshape(args) { const m = toMat(args[0]); const r = argNum(args, 1, 'reshape'), c = argNum(args, 2, 'reshape'); if (r * c !== m.n) throw new MatlabError('Number of elements must not change. Use [] as one of the size inputs to automatically calculate the appropriate size for that dimension.'); return new Mat(r, c, Float64Array.from(m.re)); },
  transpose(args) { return transpose(toMat(args[0]), false); },
  fliplr(args) { const m = toMat(args[0]); const o = new Mat(m.r, m.c); for (let i = 0; i < m.r; i++) for (let j = 0; j < m.c; j++) o.set(i, m.c - 1 - j, m.at(i, j)); return o; },
  flipud(args) { const m = toMat(args[0]); const o = new Mat(m.r, m.c); for (let i = 0; i < m.r; i++) for (let j = 0; j < m.c; j++) o.set(m.r - 1 - i, j, m.at(i, j)); return o; },
  diag(args) {
    const m = toMat(args[0]);
    if (m.isVector()) { const o = new Mat(m.n, m.n); for (let k = 0; k < m.n; k++) o.set(k, k, m.re[k]); return o; }
    const n = Math.min(m.r, m.c); const o = new Mat(n, 1); for (let k = 0; k < n; k++) o.re[k] = m.at(k, k); return o;
  },

  // size queries
  size(args, nargout) {
    const v = args[0];
    const [r, c] = v instanceof Cell ? [v.r, v.c] : v instanceof Str ? [1, 1] : [toMat(v).r, toMat(v).c];
    if (args[1]) return Mat.scalar(toNumber(args[1]) === 1 ? r : c);
    if (nargout >= 2) return [Mat.scalar(r), Mat.scalar(c)];
    return Mat.fromArray([r, c]);
  },
  length(args) { const v = args[0]; if (v instanceof Cell) return Mat.scalar(v.items.length); if (v instanceof Str) return Mat.scalar(v.dq ? 1 : v.v.length); const m = toMat(v); return Mat.scalar(m.n === 0 ? 0 : Math.max(m.r, m.c)); },
  numel(args) { const v = args[0]; if (v instanceof Cell) return Mat.scalar(v.items.length); return Mat.scalar(v instanceof Str ? 1 : toMat(v).n); },
  strlength(args) { return Mat.scalar(toStr(args[0]).length); },

  // reductions
  sum(args) { const m = toMat(args[0]); if (m.im) { let a = 0, b = 0; for (let k = 0; k < m.n; k++) { a += m.re[k]; b += m.im[k]; } return Mat.scalar(a, b); } return reduceDim(m, (s, x) => s + x, 0); },
  prod(args) { return reduceDim(toMat(args[0]), (s, x) => s * x, 1); },
  mean(args) { const m = toMat(args[0]); const s = reduceDim(m, (a, x) => a + x, 0); const n = m.isVector() ? m.n : m.r; return map(s, (x) => x / n); },
  cumsum(args) { const m = toMat(args[0]); const o = m.clone(); o.logical = false; if (m.isVector()) { for (let k = 1; k < m.n; k++) o.re[k] += o.re[k - 1]; } else for (let j = 0; j < m.c; j++) for (let i = 1; i < m.r; i++) o.set(i, j, o.at(i, j) + o.at(i - 1, j)); return o; },
  cumprod(args) { const m = toMat(args[0]); const o = m.clone(); for (let k = 1; k < m.n; k++) o.re[k] *= o.re[k - 1]; return o; },
  diff(args) {
    const m = toMat(args[0]);
    if (args[0] instanceof Fn) throw new MatlabError('diff computes differences of arrays. To differentiate a function, do it by hand (symbolic diff is not allowed in this course).');
    if (m.isVector()) { const out = []; for (let k = 1; k < m.n; k++) out.push(m.re[k] - m.re[k - 1]); return Mat.fromArray(out, m.c === 1 && m.r > 1); }
    const o = new Mat(m.r - 1, m.c); for (let i = 0; i < m.r - 1; i++) for (let j = 0; j < m.c; j++) o.set(i, j, m.at(i + 1, j) - m.at(i, j)); return o;
  },
  max(args, nargout) { return minmax(args, nargout, (a, b) => a > b, 'max'); },
  min(args, nargout) { return minmax(args, nargout, (a, b) => a < b, 'min'); },
  sort(args, nargout) {
    const m = toMat(args[0]);
    const desc = args[1] && toStr(args[1]).toLowerCase() === 'descend';
    const idx = Array.from({ length: m.n }, (_, k) => k).sort((a, b) => (desc ? m.re[b] - m.re[a] : m.re[a] - m.re[b]));
    const o = new Mat(m.r, m.c); idx.forEach((k, t) => { o.re[t] = m.re[k]; });
    const I = new Mat(m.r, m.c); idx.forEach((k, t) => { I.re[t] = k + 1; });
    return nargout > 1 ? [o, I] : [o];
  },
  find(args) { const m = toMat(args[0]); const out = []; for (let k = 0; k < m.n; k++) if (m.re[k] !== 0) out.push(k + 1); if (args[1]) out.splice(toNumber(args[1])); return Mat.fromArray(out, m.c === 1 && m.r > 1); },
  any(args) { const m = toMat(args[0]); return Mat.bool(m.re.some((x) => x !== 0)); },
  all(args) { const m = toMat(args[0]); return Mat.bool(m.re.every((x) => x !== 0)); },
  norm(args) { const m = toMat(args[0]); return Mat.scalar(Math.sqrt(m.re.reduce((s, x) => s + x * x, 0))); },
  dot(args) { const a = toMat(args[0]), b = toMat(args[1]); if (a.n !== b.n) throw sizeErr(); let s = 0; for (let k = 0; k < a.n; k++) s += a.re[k] * b.re[k]; return Mat.scalar(s); },
  cross(args) { const a = toMat(args[0]).re, b = toMat(args[1]).re; return Mat.fromArray([a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]); },
  det(args) { const m = toMat(args[0]); if (m.r !== m.c) throw new MatlabError('Matrix must be square.'); const A = rowsOf(m); let d = 1; const n = m.r; for (let c = 0; c < n; c++) { let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r; if (A[p][c] === 0) return Mat.scalar(0); if (p !== c) { [A[p], A[c]] = [A[c], A[p]]; d = -d; } d *= A[c][c]; for (let r = c + 1; r < n; r++) { const f = A[r][c] / A[c][c]; for (let k = c; k < n; k++) A[r][k] -= f * A[c][k]; } } return Mat.scalar(d); },
  inv(args) { const m = toMat(args[0]); if (m.r !== m.c) throw new MatlabError('Matrix must be square.'); const I = []; for (let i = 0; i < m.r; i++) { I.push(Array.from({ length: m.r }, (_, j) => +(i === j))); } return fromRows(solveLinear(rowsOf(m), I, m.r, m.r)); },
  mod(args) { return broadcast(toMat(args[0]), toMat(args[1]), (a, b) => (b === 0 ? a : a - Math.floor(a / b) * b)); },
  rem(args) { return broadcast(toMat(args[0]), toMat(args[1]), (a, b) => (b === 0 ? a : a - Math.trunc(a / b) * b)); },
  atan2(args) { return broadcast(toMat(args[0]), toMat(args[1]), Math.atan2); },
  hypot(args) { return broadcast(toMat(args[0]), toMat(args[1]), Math.hypot); },
  power(args) { return powElementwise(toMat(args[0]), toMat(args[1])); },
  times(args) { return binaryOp('.*', args[0], args[1]); },
  nthroot(args) { return broadcast(toMat(args[0]), toMat(args[1]), (x, n) => (x < 0 && n % 2 === 1 ? -Math.pow(-x, 1 / n) : Math.pow(x, 1 / n))); },
  nchoosek(args) { const n = argNum(args, 0, 'nchoosek'), k = argNum(args, 1, 'nchoosek'); let r = 1; for (let t = 1; t <= k; t++) r = r * (n - k + t) / t; return Mat.scalar(Math.round(r)); },
  sinc(args) { return map(toMat(args[0]), (x) => (x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x))); },
  sinint(args) { return map(toMat(args[0]), (x) => integrate((ts) => ts.map((t) => (t === 0 ? 1 : Math.sin(t) / t)), 0, x).value); },
  floor: null,

  // polynomials
  polyval(args) {
    const p = toMat(args[0]).re, x = toMat(args[1]);
    return map(x, (v) => p.reduce((s, c) => s * v + c, 0));
  },
  roots(args) {
    const p = Array.from(toMat(args[0]).re);
    const rs = polyRoots(p);
    const m = new Mat(rs.length, 1);
    if (rs.some((r) => r.im !== 0)) m.im = new Float64Array(rs.length);
    rs.forEach((r, k) => { m.re[k] = r.re; if (m.im) m.im[k] = r.im; });
    return m;
  },
  conv(args) { const a = toMat(args[0]).re, b = toMat(args[1]).re; const o = new Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => { o[i + j] += x * y; })); return Mat.fromArray(o); },
  polyfit(args) {
    const x = toMat(args[0]).re, y = toMat(args[1]).re, n = argNum(args, 2, 'polyfit');
    const A = [], b = [];
    for (let i = 0; i <= n; i++) { A.push([]); for (let j = 0; j <= n; j++) A[i].push(x.reduce((s, xv) => s + xv ** (2 * n - i - j), 0)); b.push([x.reduce((s, xv, k) => s + y[k] * xv ** (n - i), 0)]); }
    return Mat.fromArray(solveLinear(A, b, n + 1, 1).map((r) => r[0]));
  },
  polyder(args) { const p = toMat(args[0]).re; const n = p.length - 1; const o = []; for (let k = 0; k < n; k++) o.push(p[k] * (n - k)); return Mat.fromArray(o.length ? o : [0]); },
  polyint(args) { const p = toMat(args[0]).re; const n = p.length; const o = []; for (let k = 0; k < n; k++) o.push(p[k] / (n - k)); o.push(args[1] ? toNumber(args[1]) : 0); return Mat.fromArray(o); },

  // calculus / numerics
  integral(args) {
    const f = fnArg(this, args[0], 'integral');
    const a = argNum(args, 1, 'integral'), b = argNum(args, 2, 'integral');
    let arrayValued = false;
    for (let k = 3; k + 1 < args.length; k += 2) if (toStr(args[k]).toLowerCase() === 'arrayvalued') arrayValued = isTruthy(args[k + 1]);
    const fv = arrayValued ? (xs) => xs.map((x) => this.callNumeric(f, [x]).re[0]) : vectorSampler(this, f, { strict: true, label: 'integral' });
    const r = integrate(fv, a, b);
    if (r.warning) this.warn(r.warning);
    return Mat.scalar(r.value);
  },
  quad(args) {
    const f = fnArg(this, args[0], 'quad');
    const a = argNum(args, 1, 'quad'), b = argNum(args, 2, 'quad');
    const fv = vectorSampler(this, f, { strict: true, label: 'quad' });
    const r = integrate(fv, a, b, { absTol: args[3] ? toNumber(args[3]) : 1e-6, relTol: 1e-6 });
    if (r.warning) this.warn(r.warning);
    return Mat.scalar(r.value);
  },
  integral2() { throw new MatlabError('integral2 is not available in this sandbox.'); },
  trapz(args) {
    let x, y;
    if (args.length === 1) { y = toMat(args[0]).re; x = y.map((_, k) => k + 1); } else { x = toMat(args[0]).re; y = toMat(args[1]).re; }
    if (x.length !== y.length) throw new MatlabError('LENGTH(X) and the length of the first non-singleton dimension of Y must be equal.');
    let s = 0; for (let k = 1; k < x.length; k++) s += (x[k] - x[k - 1]) * (y[k] + y[k - 1]) / 2;
    return Mat.scalar(s);
  },
  cumtrapz(args) {
    let x, y;
    if (args.length === 1) { y = toMat(args[0]).re; x = Array.from(y, (_, k) => k + 1); } else { x = toMat(args[0]).re; y = toMat(args[1]).re; }
    const o = [0]; for (let k = 1; k < x.length; k++) o.push(o[k - 1] + (x[k] - x[k - 1]) * (y[k] + y[k - 1]) / 2);
    return Mat.fromArray(o, toMat(args[args.length - 1]).c === 1);
  },
  fzero(args, nargout) {
    const f = fnArg(this, args[0], 'fzero');
    const x0m = toMat(args[1]);
    const g = (x) => this.callNumeric(f, [x]).re[0];
    const x = fzero(g, x0m.n === 2 ? [x0m.re[0], x0m.re[1]] : x0m.re[0]);
    return nargout > 1 ? [Mat.scalar(x), Mat.scalar(g(x))] : [Mat.scalar(x)];
  },
  fminbnd(args, nargout) {
    const f = fnArg(this, args[0], 'fminbnd');
    const g = (x) => this.callNumeric(f, [x]).re[0];
    const [x, fx] = fminbnd(g, argNum(args, 1, 'fminbnd'), argNum(args, 2, 'fminbnd'));
    return nargout > 1 ? [Mat.scalar(x), Mat.scalar(fx)] : [Mat.scalar(x)];
  },
  fminsearch(args, nargout) {
    const f = fnArg(this, args[0], 'fminsearch');
    const x0 = toMat(args[1]).re[0];
    const g = (x) => this.callNumeric(f, [x]).re[0];
    let a = x0 - 1, b = x0 + 1;
    for (let k = 0; k < 40 && g(a) < g(x0); k++) a -= 2 ** k;
    for (let k = 0; k < 40 && g(b) < g(x0); k++) b += 2 ** k;
    const [x, fx] = fminbnd(g, a, b);
    return nargout > 1 ? [Mat.scalar(x), Mat.scalar(fx)] : [Mat.scalar(x)];
  },
  ode45(args, nargout) { return odeSolve.call(this, args, nargout, 'ode45'); },
  ode23(args, nargout) { return odeSolve.call(this, args, nargout, 'ode23'); },
  odeset(args) { const o = new Obj('struct', {}); for (let k = 0; k + 1 < args.length; k += 2) o.props[toStr(args[k])] = args[k + 1]; return o; },
  deval(args) {
    const sol = args[0], t = toMat(args[1]);
    const T = Array.from(toMat(sol.props.x).re), Y = toMat(sol.props.y);
    const out = new Mat(Y.r, t.n);
    for (let q = 0; q < t.n; q++) {
      let k = T.findIndex((v) => v >= t.re[q]); if (k <= 0) k = 1;
      const s = (t.re[q] - T[k - 1]) / (T[k] - T[k - 1]);
      for (let i = 0; i < Y.r; i++) out.set(i, q, Y.at(i, k - 1) * (1 - s) + Y.at(i, k) * s);
    }
    return out;
  },

  // graphics
  figure() { this.currentFigure = newFigure(this.figures.length + 1); this.figures.push(this.currentFigure); this.touchedFigures.add(this.currentFigure); },
  hold(args) { const f = this.fig(); const s = args.length ? toStr(args[0]) : (f.hold ? 'off' : 'on'); f.hold = s === 'on'; },
  grid(args) { const f = this.fig(); f.grid = !args.length ? !f.grid : toStr(args[0]) !== 'off'; },
  box(args) { const f = this.fig(); f.box = !args.length ? !f.box : toStr(args[0]) !== 'off'; },
  axis(args) {
    const f = this.fig();
    for (const a of args) {
      if (a instanceof Mat && !a.char) { const m = a.re; f.xlim = [m[0], m[1]]; if (m.length >= 4) f.ylim = [m[2], m[3]]; continue; }
      const s = toStr(a);
      if (s === 'equal' || s === 'image') f.axisEqual = true;
      else if (s === 'normal') f.axisEqual = false;
      else if (s === 'tight') { f.xlim = null; f.ylim = null; f.tight = true; }
    }
  },
  xlim(args) { if (!args.length) return; const m = toMat(args[0]).re; this.fig().xlim = [m[0], m[1]]; },
  ylim(args) { if (!args.length) return; const m = toMat(args[0]).re; this.fig().ylim = [m[0], m[1]]; },
  title(args) { this.fig().title = latexish(args); },
  xlabel(args) { this.fig().xlabel = latexish(args); },
  ylabel(args) { this.fig().ylabel = latexish(args); },
  subtitle() { },
  legend(args) {
    const f = this.fig();
    const names = [];
    let latex = false;
    for (let k = 0; k < args.length; k++) {
      const s = args[k] instanceof Cell ? null : toStr(args[k]);
      if (s && ['interpreter', 'location', 'fontsize', 'orientation'].includes(s.toLowerCase())) { if (s.toLowerCase() === 'interpreter') latex = toStr(args[k + 1]).toLowerCase() === 'latex'; k++; continue; }
      if (args[k] instanceof Cell) args[k].items.forEach((it) => names.push(toStr(it))); else if (s === 'show' || s === 'off') { if (s === 'off') { f.legend = null; return; } } else names.push(s);
    }
    f.legend = names.length ? names : f.series.map((s, k) => toStr(jsToValue(s.props.DisplayName || `data${k + 1}`)));
    f.legendLatex = latex;
  },
  plot(args) {
    if (!args.length) throw new MatlabError('Not enough input arguments.');
    let k = 0;
    const made = [];
    while (k < args.length) {
      let x, y;
      const a0 = toMat(args[k]);
      const a1 = args[k + 1] && !(args[k + 1] instanceof Str) && !(args[k + 1] instanceof Mat && args[k + 1].char) ? toMat(args[k + 1]) : null;
      if (a1) { x = a0; y = a1; k += 2; } else { y = a0; x = Mat.fromArray(Array.from(y.re, (_, t) => t + 1)); k += 1; }
      let spec = {};
      if (args[k] instanceof Str || (args[k] instanceof Mat && args[k].char)) {
        const s = toStr(args[k]);
        if (/^[-:.ox+*sd^v<>phrgbcmykw]+$/.test(s)) { spec = parseLineSpec(s); k++; }
      }
      // Name-Value pairs apply to all lines
      const rest = [];
      while (k < args.length && (args[k] instanceof Str || (args[k] instanceof Mat && args[k].char))) { rest.push(args[k], args[k + 1]); k += 2; }
      const nv = lineProps(rest, 0);
      // matrix columns -> multiple lines
      const yCols = y.isVector() ? [y] : Array.from({ length: y.c }, (_, j) => indexGet(y, [':', Mat.scalar(j + 1)]));
      for (const yc of yCols) {
        if (x.n !== yc.n) throw new MatlabError('Vectors must be the same length.');
        made.push(this.addSeries('line', { XData: Mat.fromArray(Array.from(x.re)), YData: Mat.fromArray(Array.from(yc.re)), ...spec, ...nv }));
        const f = this.fig(); if (!f.hold) f.hold = 'temp';
      }
    }
    const f = this.fig(); if (f.hold === 'temp') f.hold = false;
    return made.length === 1 ? made[0] : made[0];
  },
  scatter(args) {
    const x = toMat(args[0]), y = toMat(args[1]);
    return this.addSeries('line', { XData: x, YData: y, LineStyle: 'none', Marker: 'o', ...lineProps(args, 3) });
  },
  stem(args) {
    const x = toMat(args[0]), y = args[1] && !(args[1] instanceof Str) ? toMat(args[1]) : null;
    const X = y ? x : Mat.fromArray(Array.from(x.re, (_, t) => t + 1)), Y = y || x;
    return this.addSeries('stem', { XData: X, YData: Y, Marker: 'o', ...lineProps(args, y ? 2 : 1) });
  },
  bar(args) {
    const x = toMat(args[0]), y = args[1] && !(args[1] instanceof Str) ? toMat(args[1]) : null;
    const X = y ? x : Mat.fromArray(Array.from(x.re, (_, t) => t + 1)), Y = y || x;
    return this.addSeries('bar', { XData: X, YData: Y, ...lineProps(args, y ? 2 : 1) });
  },
  area(args) {
    const x = toMat(args[0]), y = toMat(args[1]);
    return this.addSeries('area', { XData: x, YData: y, ...lineProps(args, 2) });
  },
  fill(args) {
    const x = toMat(args[0]), y = toMat(args[1]);
    const color = args[2] ? colorValue(args[2]) : undefined;
    return this.addSeries('fill', { XData: x, YData: y, Color: color, ...lineProps(args, 3) });
  },
  fplot(args) {
    const f = fnArg(this, args[0], 'fplot');
    let range = [-5, 5], k = 1;
    if (args[1] instanceof Mat && !args[1].char) { const m = args[1].re; range = [m[0], m[1]]; k = 2; }
    const sampler = vectorSampler(this, f, { label: 'fplot' });
    sampler([range[0], (range[0] + range[1]) / 2, range[1]]); // validate early so errors surface at this line
    return this.addSeries('fplot', { _sample: sampler, _range: range, ...lineProps(args, k) });
  },
  quiver(args) {
    const X = toMat(args[0]), Y = toMat(args[1]), U = toMat(args[2]), V = toMat(args[3]);
    let scale = 0.9, k = 4;
    if (args[4] instanceof Mat && !args[4].char) { scale = args[4].re[0]; k = 5; }
    // MATLAB-style autoscaling: longest arrow fits one grid cell * scale
    const n = X.n;
    const U2 = broadcast(U, Mat.scalar(1), (a) => a), V2 = broadcast(V, Mat.scalar(1), (a) => a);
    const Ue = U2.n === n ? U2 : broadcast(U2, X, (a) => a);
    const Ve = V2.n === n ? V2 : broadcast(V2, X, (a) => a);
    if (scale > 0) {
      const xs = Array.from(X.re), ys = Array.from(Y.re);
      const span = (arr) => Math.max(...arr) - Math.min(...arr);
      const m = Math.sqrt(n);
      const dx = span(xs) / Math.max(1, m - 1) || 1, dy = span(ys) / Math.max(1, m - 1) || 1;
      let maxLen = 0;
      for (let t = 0; t < n; t++) maxLen = Math.max(maxLen, Math.hypot(Ue.re[t] / dx, Ve.re[t] / dy));
      const s = maxLen > 0 ? scale / maxLen : 1;
      for (let t = 0; t < n; t++) { Ue.re[t] *= s; Ve.re[t] *= s; }
    }
    return this.addSeries('quiver', { XData: X, YData: Y, UData: Ue, VData: Ve, ShowArrowHead: 'on', AutoScaleFactor: scale, ...lineProps(args, k) });
  },
  xline(args) { return this.addSeriesKeep('xline', { Value: toNumber(args[0]), LineStyle: '--', Color: '#262626', ...lineProps(args, 1) }); },
  yline(args) { return this.addSeriesKeep('yline', { Value: toNumber(args[0]), LineStyle: '--', Color: '#262626', ...lineProps(args, 1) }); },
  text(args) { return this.addSeriesKeep('text', { Position: [toNumber(args[0]), toNumber(args[1])], String: toStr(args[2]), Color: '#000' }); },
  subplot() { throw new MatlabError('subplot is not supported in this sandbox. Use separate figure calls.'); },
  plot3() { throw new MatlabError('3-D plots are not supported in this sandbox.'); },
  surf() { throw new MatlabError('3-D plots are not supported in this sandbox.'); },
  gca() { return new Obj('axes', { _fig: this.fig() }); },
  gcf() { return new Obj('figure', { _fig: this.fig() }); },
  set() { },
  exist(args) { const n = toStr(args[0]); return Mat.scalar(this.globals.has(n) ? 1 : (BUILTINS[n] || MATHFN[n]) ? 5 : this.functions[n] ? 2 : 0); },
};
delete BUILTINS.floor;

Matlab.prototype.addSeriesKeep = function (kind, props) {
  const f = this.fig();
  const obj = new Obj(kind, { LineWidth: 0.5, Marker: 'none', DisplayName: '', ...props, _fig: f });
  f.series.push(obj);
  return obj;
};

function latexish(args) {
  if (!args.length) return '';
  const a = args[0];
  if (a instanceof Cell) return a.items.map(toStr).join(' ');
  return toStr(a);
}

function minmax(args, nargout, better, name) {
  if (args.length >= 2 && toMat(args[1]).n > 0) {
    return [broadcast(toMat(args[0]), toMat(args[1]), (a, b) => (better(a, b) || Number.isNaN(b) ? a : b))];
  }
  const m = toMat(args[0]);
  if (m.n === 0) return [new Mat(0, 0), new Mat(0, 0)];
  const vecReduce = (vals) => {
    let bi = -1;
    vals.forEach((v, k) => { if (!Number.isNaN(v) && (bi < 0 || better(v, vals[bi]))) bi = k; });
    if (bi < 0) bi = 0;
    return [vals[bi], bi + 1];
  };
  if (m.isVector()) {
    const vals = m.im ? Array.from(m.re, (x, k) => Math.hypot(x, m.im[k])) : Array.from(m.re);
    const [v, i] = vecReduce(vals);
    return nargout > 1 ? [Mat.scalar(m.re[i - 1], m.im ? m.im[i - 1] : 0), Mat.scalar(i)] : [Mat.scalar(m.re[i - 1], m.im ? m.im[i - 1] : 0)];
    void v;
  }
  const V = new Mat(1, m.c), I = new Mat(1, m.c);
  for (let j = 0; j < m.c; j++) { const col = []; for (let i = 0; i < m.r; i++) col.push(m.at(i, j)); const [v, i] = vecReduce(col); V.re[j] = v; I.re[j] = i; }
  void name;
  return nargout > 1 ? [V, I] : [V];
}

function odeSolve(args, nargout, name) {
  const f = fnArg(this, args[0], name);
  const tspan = Array.from(toMat(args[1]).re);
  const y0m = toMat(args[2]);
  const y0 = Array.from(y0m.re);
  if (tspan.length < 2) throw new MatlabError('The tspan vector must have at least 2 elements.');
  const opts = args[3] instanceof Obj ? args[3].props : {};
  const relTol = opts.RelTol ? toNumber(opts.RelTol) : 1e-3;
  const absTol = opts.AbsTol ? toNumber(opts.AbsTol) : 1e-6;
  const nEq = y0.length;
  const rhs = (t, y) => {
    const yv = Mat.fromArray(y, true);
    const r = this.callFn(f, [Mat.scalar(t), yv], 1)[0];
    const m = toMat(r);
    if (m.n !== nEq) throw new MatlabError(`${name}: the function must return a column vector of length ${nEq}, it returned ${m.r}x${m.c}.`);
    if (nEq > 1 && m.r === 1) throw new MatlabError(`${name}: the function must return a column vector. Use [a; b] (semicolon) instead of [a, b].`);
    return Array.from(m.re);
  };
  const { T, Y } = ode45(rhs, tspan, y0, { relTol, absTol, refine: tspan.length > 2 ? 1 : 4 });
  const tm = Mat.fromArray(T, true);
  const ym = new Mat(T.length, nEq);
  Y.forEach((row, i) => row.forEach((v, j) => ym.set(i, j, v)));
  if (nargout === 0) {
    for (let j = 0; j < nEq; j++) {
      const col = indexGet(ym, [':', Mat.scalar(j + 1)]);
      BUILTINS.plot.call(this, [tm, col, new Str('-o', false)]);
      this.fig().hold = 'ode';
    }
    this.fig().hold = false;
    return [];
  }
  if (nargout === 1) {
    return [new Obj('struct', { solver: new Str(name, false), x: transpose(tm), y: transpose(ym) })];
  }
  return [tm, ym];
}
