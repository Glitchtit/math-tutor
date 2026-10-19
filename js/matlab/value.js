// Runtime values for the MATLAB interpreter.
// Numeric arrays are column-major like MATLAB. Complex arrays carry an `im` array.

import { MatlabError } from './parser.js';

export class Mat {
  constructor(r, c, re, im = null) {
    this.t = 'mat';
    this.r = r;
    this.c = c;
    this.re = re || new Float64Array(r * c);
    this.im = im;
    this.logical = false;
    this.char = false;
  }
  get n() { return this.r * this.c; }
  isScalar() { return this.r === 1 && this.c === 1; }
  isEmpty() { return this.r === 0 || this.c === 0; }
  isVector() { return this.r === 1 || this.c === 1; }
  isComplex() { return this.im !== null; }
  get(i) { return this.re[i]; }
  scalar() {
    if (this.n < 1) throw new MatlabError('Index exceeds the number of array elements. Index must not exceed 0.');
    return this.re[0];
  }
  static scalar(x, im = 0) {
    const m = new Mat(1, 1, Float64Array.of(x));
    if (im) m.im = Float64Array.of(im);
    return m;
  }
  static fromArray(arr, column = false) {
    const m = column ? new Mat(arr.length, 1) : new Mat(1, arr.length);
    for (let k = 0; k < arr.length; k++) m.re[k] = arr[k];
    return m;
  }
  static zeros(r, c) { return new Mat(r, c); }
  static bool(b) { const m = Mat.scalar(b ? 1 : 0); m.logical = true; return m; }
  toArray() { return Array.from(this.re); }
  // 2D access (0-based)
  at(i, j) { return this.re[j * this.r + i]; }
  set(i, j, v) { this.re[j * this.r + i] = v; }
  clone() {
    const m = new Mat(this.r, this.c, Float64Array.from(this.re), this.im ? Float64Array.from(this.im) : null);
    m.logical = this.logical;
    m.char = this.char;
    return m;
  }
  dropImagIfZero() {
    if (this.im && this.im.every((v) => v === 0)) this.im = null;
    return this;
  }
}

export class Str {
  constructor(v, dq = true) { this.t = 'str'; this.v = v; this.dq = dq; }
}

export class Cell {
  constructor(items, r = 1, c = items.length) { this.t = 'cell'; this.items = items; this.r = r; this.c = c; }
}

export class Obj {
  // structs and graphics handles
  constructor(kind = 'struct', props = {}) { this.t = 'obj'; this.kind = kind; this.props = props; }
}

export class Fn {
  constructor({ params = [], body = null, env = null, name = null, builtin = null, src = '' }) {
    this.t = 'fn';
    this.params = params;
    this.body = body;
    this.env = env;
    this.name = name;
    this.builtin = builtin;
    this.src = src;
  }
}

export function num(x) { return Mat.scalar(x); }

export function toMat(v, what = 'value') {
  if (v instanceof Mat) return v;
  if (v instanceof Str) {
    const m = Mat.fromArray([...v.v].map((ch) => ch.charCodeAt(0)));
    m.char = true;
    return m;
  }
  if (typeof v === 'number') return Mat.scalar(v);
  throw new MatlabError(`Expected a numeric ${what}, got ${typeName(v)}.`);
}

export function toNumber(v, what = 'argument') {
  const m = toMat(v, what);
  if (m.n !== 1) throw new MatlabError(`Expected a scalar ${what}, got a ${m.r}x${m.c} array.`);
  return m.re[0];
}

export function toStr(v) {
  if (v instanceof Str) return v.v;
  if (v instanceof Mat && v.char) return String.fromCharCode(...v.re);
  if (v instanceof Mat) return formatNumberShort(v.re[0]);
  throw new MatlabError(`Expected text, got ${typeName(v)}.`);
}

export function typeName(v) {
  if (v instanceof Mat) return v.char ? 'char' : v.logical ? 'logical' : 'double';
  if (v instanceof Str) return 'string';
  if (v instanceof Fn) return 'function_handle';
  if (v instanceof Cell) return 'cell';
  if (v instanceof Obj) return v.kind === 'struct' ? 'struct' : `graphics object (${v.kind})`;
  return typeof v;
}

export function isTruthy(v) {
  if (v instanceof Str) return v.v.length > 0;
  const m = toMat(v, 'condition');
  if (m.n === 0) return false;
  for (let k = 0; k < m.n; k++) {
    if (Number.isNaN(m.re[k])) throw new MatlabError("NaN's cannot be converted to logicals.");
    if (m.re[k] === 0 && (!m.im || m.im[k] === 0)) return false;
  }
  return true;
}

// ------------------------------------------------------------ formatting

let FORMAT = 'short';
export function setFormat(f) { FORMAT = f; }
export function getFormat() { return FORMAT; }

export function formatNumberShort(x) {
  if (Number.isNaN(x)) return 'NaN';
  if (x === Infinity) return 'Inf';
  if (x === -Infinity) return '-Inf';
  if (Number.isInteger(x) && Math.abs(x) < 1e10) return String(x);
  if (FORMAT === 'long') {
    const a = Math.abs(x);
    if (a !== 0 && (a < 1e-3 || a >= 1e5)) return x.toExponential(14).replace(/e([+-])(\d)$/, 'e$10$2');
    return x.toFixed(15 - Math.max(0, Math.floor(Math.log10(a || 1)))).replace(/^-0\.0+$/, '0');
  }
  const a = Math.abs(x);
  if (a !== 0 && (a < 1e-3 || a >= 1e5)) return x.toExponential(4).replace(/e([+-])(\d)$/, 'e$10$2');
  return x.toFixed(4);
}

function formatComplex(re, im) {
  const sign = im < 0 || Object.is(im, -0) ? '-' : '+';
  return `${formatNumberShort(re)} ${sign} ${formatNumberShort(Math.abs(im))}i`;
}

export function formatValue(name, v) {
  const head = name ? `${name} = ` : '';
  if (v instanceof Str) return v.dq ? `${head}"${v.v}"` : `${head}'${v.v}'`;
  if (v instanceof Fn) {
    const body = v.builtin ? `@${v.name}` : v.src;
    return `${head}\n  function_handle with value:\n\n    ${body}\n`;
  }
  if (v instanceof Cell) {
    const parts = v.items.map((it) => (it instanceof Str ? `{"${it.v}"}` : it instanceof Mat && it.isScalar() ? `{[${formatNumberShort(it.re[0])}]}` : `{${typeName(it)}}`));
    return `${name ? name + ' =\n\n  ' : ''}${v.r}x${v.c} cell array\n\n    ${parts.join('    ')}\n`;
  }
  if (v instanceof Obj) {
    const lines = Object.entries(v.props).filter(([k]) => !k.startsWith('_')).map(([k, val]) => {
      let s;
      if (val instanceof Mat) s = val.char ? `'${toStr(val)}'` : val.isScalar() ? formatNumberShort(val.re[0]) : `[${val.r}x${val.c} double]`;
      else if (val instanceof Str) s = `"${val.v}"`;
      else if (typeof val === 'string') s = `'${val}'`;
      else if (typeof val === 'number') s = formatNumberShort(val);
      else if (Array.isArray(val)) s = `[${val.map((x) => formatNumberShort(x)).join(' ')}]`;
      else if (val instanceof Fn) s = '[function_handle]';
      else s = typeName(val);
      return `    ${k}: ${s}`;
    });
    const label = v.kind === 'struct' ? 'struct with fields:' : `${v.kind[0].toUpperCase() + v.kind.slice(1)} with properties:`;
    return `${name ? name + ' = \n\n' : ''}  ${label}\n\n${lines.join('\n')}\n`;
  }
  const m = v;
  if (m.char) return `${head}'${toStr(m)}'`;
  if (m.n === 0) return `${head}\n     []\n`;
  if (m.isScalar()) {
    let s;
    if (m.logical) s = String(m.re[0]);
    else if (m.im) s = formatComplex(m.re[0], m.im[0]);
    else s = formatNumberShort(m.re[0]);
    return `${head}${s}`;
  }
  // matrix display
  const cells = [];
  const allInt = !m.im && m.re.every((x) => Number.isInteger(x) || !Number.isFinite(x));
  let scaleNote = '';
  let scale = 1;
  if (!allInt && !m.im && FORMAT === 'short') {
    const maxAbs = m.re.reduce((a, x) => (Number.isFinite(x) ? Math.max(a, Math.abs(x)) : a), 0);
    if (maxAbs >= 1e5 || (maxAbs > 0 && maxAbs < 1e-3)) {
      const e = Math.floor(Math.log10(maxAbs));
      scale = 10 ** e;
      scaleNote = `   1.0e${e >= 0 ? '+' : '-'}${String(Math.abs(e)).padStart(2, '0')} *\n\n`;
    }
  }
  for (let i = 0; i < m.r; i++) {
    const row = [];
    for (let j = 0; j < m.c; j++) {
      const k = j * m.r + i;
      let s;
      if (m.im) s = formatComplex(m.re[k], m.im[k]);
      else if (allInt) s = formatNumberShort(m.re[k]);
      else if (scale !== 1) s = (m.re[k] / scale).toFixed(4);
      else s = Number.isFinite(m.re[k]) ? (FORMAT === 'long' ? formatNumberShort(m.re[k]) : m.re[k].toFixed(4)) : formatNumberShort(m.re[k]);
      row.push(s);
    }
    cells.push(row);
  }
  const width = Math.max(...cells.flat().map((s) => s.length)) + (allInt ? 4 : 3);
  const body = cells.map((row) => row.map((s) => s.padStart(width)).join('')).join('\n');
  const MAXCOLS = 10;
  if (m.c > MAXCOLS && m.r <= 3) {
    // wrap wide row vectors in column blocks, MATLAB style
    let out = `${name ? name + ' =\n\n' : ''}${scaleNote}`;
    for (let start = 0; start < m.c; start += MAXCOLS) {
      const stop = Math.min(m.c, start + MAXCOLS);
      out += `  Columns ${start + 1} through ${stop}\n\n`;
      out += cells.map((row) => row.slice(start, stop).map((s) => s.padStart(width)).join('')).join('\n') + '\n\n';
    }
    return out;
  }
  return `${name ? name + ' =\n\n' : ''}${scaleNote}${body}\n`;
}
