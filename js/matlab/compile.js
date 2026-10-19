// Compile a scalar MATLAB expression (e.g. "a*sin(x).^2 + exp(-x)") into a fast JS function.
// Used by the interactive widgets and the answer checker. Falls back to the interpreter for
// anything outside the scalar subset.

import { parseExpression } from './parser.js';
import { Matlab } from './interp.js';
import { gammaFn, erf, integrate } from './numeric.js';

const FN = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan, sec: (x) => 1 / Math.cos(x), csc: (x) => 1 / Math.sin(x), cot: (x) => 1 / Math.tan(x),
  asin: Math.asin, acos: Math.acos, atan: Math.atan, sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
  asinh: Math.asinh, acosh: Math.acosh, atanh: Math.atanh, exp: Math.exp, log: Math.log, log10: Math.log10, log2: Math.log2,
  sqrt: Math.sqrt, abs: Math.abs, sign: Math.sign, floor: Math.floor, ceil: Math.ceil, round: (x) => Math.sign(x) * Math.round(Math.abs(x)), fix: Math.trunc,
  gamma: gammaFn, erf, erfc: (x) => 1 - erf(x), factorial: (x) => gammaFn(x + 1), real: (x) => x,
  mod: (a, b) => (b === 0 ? a : a - Math.floor(a / b) * b), rem: (a, b) => (b === 0 ? a : a - Math.trunc(a / b) * b),
  atan2: Math.atan2, hypot: Math.hypot, max: Math.max, min: Math.min, nthroot: (x, n) => (x < 0 && n % 2 === 1 ? -Math.pow(-x, 1 / n) : Math.pow(x, 1 / n)),
  nchoosek: (n, k) => { let r = 1; for (let t = 1; t <= k; t++) r = r * (n - k + t) / t; return Math.round(r); },
  sinint: (x) => integrate((ts) => ts.map((t) => (t === 0 ? 1 : Math.sin(t) / t)), 0, x).value,
  heaviside: (x) => (x > 0 ? 1 : x < 0 ? 0 : 0.5),
};
const CONST = { pi: Math.PI, Inf: Infinity, inf: Infinity, NaN: NaN, eps: Number.EPSILON, true: 1, false: 0 };

function gen(e, params) {
  switch (e.type) {
    case 'num': if (e.imag) throw new Error('complex'); return `(${e.value})`;
    case 'id':
      if (params.includes(e.name)) return `p_${e.name}`;
      if (e.name in CONST) return `(${CONST[e.name]})`;
      throw new Error(`Unknown name ${e.name}`);
    case 'paren': return `(${gen(e.expr, params)})`;
    case 'unary':
      if (e.op === '-') return `(-${gen(e.operand, params)})`;
      if (e.op === '+') return gen(e.operand, params);
      return `(+(${gen(e.operand, params)}===0))`;
    case 'bin': {
      const l = gen(e.l, params), r = gen(e.r, params);
      switch (e.op) {
        case '+': case '-': return `(${l}${e.op}${r})`;
        case '*': case '.*': return `(${l}*${r})`;
        case '/': case './': return `(${l}/${r})`;
        case '^': case '.^': return `Math.pow(${l},${r})`;
        case '==': return `(+(${l}===${r}))`;
        case '~=': return `(+(${l}!==${r}))`;
        case '<': case '<=': case '>': case '>=': return `(+(${l}${e.op}${r}))`;
        case '&': case '&&': return `(+((${l})!==0&&(${r})!==0))`;
        case '|': case '||': return `(+((${l})!==0||(${r})!==0))`;
        default: throw new Error('op');
      }
    }
    case 'index': {
      if (e.obj.type !== 'id' || params.includes(e.obj.name)) throw new Error('indexing');
      const f = FN[e.obj.name];
      if (!f) throw new Error(`fn ${e.obj.name}`);
      return `F.${e.obj.name}(${e.args.map((a) => gen(a, params)).join(',')})`;
    }
    case 'transpose': return gen(e.operand, params);
    default: throw new Error(e.type);
  }
}

const cache = new Map();
let sharedInterp = null;

export function compile(expr, params = ['x']) {
  const key = params.join(',') + '|' + expr;
  if (cache.has(key)) return cache.get(key);
  let fn;
  try {
    const ast = parseExpression(String(expr));
    const body = gen(ast, params);
    // eslint-disable-next-line no-new-func
    const raw = new Function('F', ...params.map((p) => `p_${p}`), `return ${body};`);
    fn = (...args) => raw(FN, ...args);
  } catch {
    // general fallback through the interpreter (vectors, sum(), etc.)
    sharedInterp = sharedInterp || new Matlab();
    const f = sharedInterp.makeFunction(String(expr), params);
    fn = (...args) => { try { return f(...args); } catch { return NaN; } };
  }
  cache.set(key, fn);
  return fn;
}

// Validate that an expression parses and evaluates to a finite number at a sample point.
export function checkExpression(expr, params = ['x'], sample = null) {
  try {
    parseExpression(String(expr));
  } catch (e) {
    return e.message;
  }
  try {
    const f = compile(expr, params);
    const args = sample || params.map(() => 0.37);
    const v = f(...args);
    if (typeof v !== 'number') return 'Expression did not evaluate to a number.';
  } catch (e) {
    return e.message;
  }
  return null;
}
