// Numerical algorithms behind integral, fzero, fminbnd, roots and ode45.
// All functions work on plain JS numbers / arrays; interp.js adapts MATLAB values.

import { MatlabError } from './parser.js';

// ---------------------------------------------------------------- integral
// Adaptive Gauss-Kronrod (7-15). `fv` evaluates the integrand on an array of
// nodes and returns an array of values (vectorised call, like MATLAB).

const XGK = [0.991455371120812639206854697526329, 0.949107912342758524526189684047851,
  0.864864423359769072789712788640926, 0.741531185599394439863864773280788,
  0.586087235467691130294144845693013, 0.405845151377397166906606412076961,
  0.207784955007898467600689403773245, 0.0];
const WGK = [0.022935322010529224963732008058970, 0.063092092629978553290700663189204,
  0.104790010322250183839876322541518, 0.140653259715525918745189590510238,
  0.169004726639267902826583426598550, 0.190350578064785409913256402421014,
  0.204432940075298892414161999234649, 0.209482141084727828012999174891714];
const WG = [0.129484966168869693270611432679082, 0.279705391489276667901467771423780,
  0.381830050505118944950369775488975, 0.417959183673469387755102040816327];

function gk15(fv, a, b) {
  const c = (a + b) / 2, h = (b - a) / 2;
  const xs = [];
  for (let k = 0; k < 7; k++) { xs.push(c - h * XGK[k]); xs.push(c + h * XGK[k]); }
  xs.push(c);
  const ys = fv(xs);
  let K = WGK[7] * ys[14], G = WG[3] * ys[14];
  for (let k = 0; k < 7; k++) {
    const s = ys[2 * k] + ys[2 * k + 1];
    K += WGK[k] * s;
    if (k % 2 === 1) G += WG[(k - 1) / 2] * s;
  }
  return { val: K * h, err: Math.abs((K - G) * h) };
}

export function integrate(fv, a, b, { absTol = 1e-10, relTol = 1e-6, maxIntervals = 650 } = {}) {
  if (a === b) return { value: 0, warning: null };
  if (a > b) { const r = integrate(fv, b, a, { absTol, relTol, maxIntervals }); return { value: -r.value, warning: r.warning }; }
  let g = fv;
  let lo = a, hi = b;
  // map infinite ranges to finite ones
  if (!Number.isFinite(a) && !Number.isFinite(b)) {
    g = (ts) => { const xs = ts.map((t) => t / (1 - t * t)); const ys = fv(xs); return ys.map((y, i) => y * (1 + ts[i] * ts[i]) / (1 - ts[i] * ts[i]) ** 2); };
    lo = -1; hi = 1;
  } else if (!Number.isFinite(b)) {
    g = (ts) => { const xs = ts.map((t) => a + t / (1 - t)); const ys = fv(xs); return ys.map((y, i) => y / (1 - ts[i]) ** 2); };
    lo = 0; hi = 1;
  } else if (!Number.isFinite(a)) {
    g = (ts) => { const xs = ts.map((t) => b - (1 - t) / t); const ys = fv(xs); return ys.map((y, i) => y / (ts[i] * ts[i])); };
    lo = 0; hi = 1;
  }
  // start with 10 subintervals, as MATLAB does
  let intervals = [];
  const N0 = 10;
  for (let k = 0; k < N0; k++) {
    const x0 = lo + (hi - lo) * k / N0, x1 = lo + (hi - lo) * (k + 1) / N0;
    intervals.push({ a: x0, b: x1, ...gk15(g, x0, x1) });
  }
  let warned = null;
  for (let iter = 0; iter < 2000; iter++) {
    let total = 0, err = 0;
    for (const iv of intervals) { total += iv.val; err += iv.err; }
    if (!Number.isFinite(total)) {
      return { value: total, warning: 'Infinite or Not-a-Number value encountered.' };
    }
    if (err <= Math.max(absTol, relTol * Math.abs(total))) return { value: total, warning: warned };
    if (intervals.length >= maxIntervals) {
      return { value: total, warning: `Reached the limit on the maximum number of intervals in use. Approximate bound on error is ${err.toExponential(1)}. The integral may not exist, or it may be difficult to approximate numerically to the requested accuracy.` };
    }
    // split the worst interval
    let worst = 0;
    for (let k = 1; k < intervals.length; k++) if (intervals[k].err > intervals[worst].err) worst = k;
    const iv = intervals[worst];
    const m = (iv.a + iv.b) / 2;
    if (m === iv.a || m === iv.b) { warned = 'Minimum step size reached near x = ' + m.toPrecision(5) + '. There may be a singularity, or the tolerances may be too tight for this problem.'; iv.err = 0; continue; }
    intervals.splice(worst, 1, { a: iv.a, b: m, ...gk15(g, iv.a, m) }, { a: m, b: iv.b, ...gk15(g, m, iv.b) });
  }
  const total = intervals.reduce((s, iv) => s + iv.val, 0);
  return { value: total, warning: warned };
}

// ---------------------------------------------------------------- fzero
export function fzero(f, x0) {
  let a, b, fa, fb;
  if (Array.isArray(x0)) {
    [a, b] = x0;
    fa = f(a); fb = f(b);
    if (fa === 0) return a;
    if (fb === 0) return b;
    if (Math.sign(fa) === Math.sign(fb)) throw new MatlabError('The function values at the interval endpoints must differ in sign.');
  } else {
    // search outward for a sign change, like MATLAB
    a = b = x0;
    fa = fb = f(x0);
    if (fa === 0) return x0;
    let dx = x0 === 0 ? 1 / 50 : x0 / 50;
    let found = false;
    for (let k = 0; k < 120; k++) {
      dx *= Math.SQRT2;
      a = x0 - dx; b = x0 + dx;
      fa = f(a); fb = f(b);
      if (!Number.isFinite(fa) || !Number.isFinite(fb)) continue;
      if (Math.sign(fa) !== Math.sign(fb)) { found = true; break; }
    }
    if (!found) throw new MatlabError(`Exiting fzero: aborting search for an interval containing a sign change because no sign change is detected during search. Function may not have a root.`);
  }
  // Brent's method
  let c = a, fc = fa, d = b - a, e = d;
  for (let iter = 0; iter < 200; iter++) {
    if (Math.sign(fb) === Math.sign(fc)) { c = a; fc = fa; d = b - a; e = d; }
    if (Math.abs(fc) < Math.abs(fb)) { a = b; b = c; c = a; fa = fb; fb = fc; fc = fa; }
    const tol = 2 * Number.EPSILON * Math.abs(b) + 1e-15;
    const m = 0.5 * (c - b);
    if (Math.abs(m) <= tol || fb === 0) return b;
    if (Math.abs(e) >= tol && Math.abs(fa) > Math.abs(fb)) {
      let p, q, r;
      const s = fb / fa;
      if (a === c) { p = 2 * m * s; q = 1 - s; } else {
        q = fa / fc; r = fb / fc;
        p = s * (2 * m * q * (q - r) - (b - a) * (r - 1));
        q = (q - 1) * (r - 1) * (s - 1);
      }
      if (p > 0) q = -q; else p = -p;
      if (2 * p < Math.min(3 * m * q - Math.abs(tol * q), Math.abs(e * q))) { e = d; d = p / q; } else { d = m; e = m; }
    } else { d = m; e = m; }
    a = b; fa = fb;
    b += Math.abs(d) > tol ? d : (m > 0 ? tol : -tol);
    fb = f(b);
  }
  return b;
}

// ---------------------------------------------------------------- fminbnd
export function fminbnd(f, a, b) {
  const gr = (Math.sqrt(5) - 1) / 2;
  let c = b - gr * (b - a), d = a + gr * (b - a);
  let fc = f(c), fd = f(d);
  for (let k = 0; k < 200 && Math.abs(b - a) > 1e-10 * (1 + Math.abs(a) + Math.abs(b)); k++) {
    if (fc < fd) { b = d; d = c; fd = fc; c = b - gr * (b - a); fc = f(c); } else { a = c; c = d; fc = fd; d = a + gr * (b - a); fd = f(d); }
  }
  const x = (a + b) / 2;
  return [x, f(x)];
}

// ---------------------------------------------------------------- roots
// Durand-Kerner on complex numbers. Returns [{re, im}] sorted like MATLAB (by magnitude, descending).
export function polyRoots(coeffs) {
  let p = coeffs.slice();
  while (p.length && p[0] === 0) p.shift();
  let zerosAtEnd = 0;
  while (p.length > 1 && p[p.length - 1] === 0) { p.pop(); zerosAtEnd++; }
  const n = p.length - 1;
  const out = [];
  if (n >= 1) {
    const a = p.map((c) => c / p[0]);
    let z = [];
    const R = 1 + Math.max(...a.slice(1).map(Math.abs));
    for (let k = 0; k < n; k++) {
      const ang = 2 * Math.PI * k / n + 0.4;
      z.push({ re: R * 0.9 * Math.cos(ang), im: R * 0.9 * Math.sin(ang) });
    }
    const mul = (x, y) => ({ re: x.re * y.re - x.im * y.im, im: x.re * y.im + x.im * y.re });
    const div = (x, y) => { const d = y.re * y.re + y.im * y.im; return { re: (x.re * y.re + x.im * y.im) / d, im: (x.im * y.re - x.re * y.im) / d }; };
    const evalP = (x) => { let s = { re: 1, im: 0 }; for (let k = 1; k <= n; k++) s = { re: s.re * x.re - s.im * x.im + a[k], im: s.re * x.im + s.im * x.re }; return s; };
    for (let iter = 0; iter < 2000; iter++) {
      let delta = 0;
      const nz = z.map((zi, i) => {
        let den = { re: 1, im: 0 };
        z.forEach((zj, j) => { if (i !== j) den = mul(den, { re: zi.re - zj.re, im: zi.im - zj.im }); });
        const step = div(evalP(zi), den);
        delta = Math.max(delta, Math.hypot(step.re, step.im));
        return { re: zi.re - step.re, im: zi.im - step.im };
      });
      z = nz;
      if (delta < 1e-15 * R) break;
    }
    for (const r of z) {
      const scale = Math.max(1, Math.hypot(r.re, r.im));
      out.push({ re: r.re, im: Math.abs(r.im) < 1e-10 * scale ? 0 : r.im });
    }
  }
  for (let k = 0; k < zerosAtEnd; k++) out.push({ re: 0, im: 0 });
  out.sort((u, v) => Math.hypot(v.re, v.im) - Math.hypot(u.re, u.im) || v.im - u.im);
  return out;
}

// ---------------------------------------------------------------- ode45
// Dormand-Prince 5(4) with Hermite interpolation for requested output times.
export function ode45(f, tspan, y0, { relTol = 1e-3, absTol = 1e-6, refine = 4 } = {}) {
  const t0 = tspan[0], tf = tspan[tspan.length - 1];
  const dir = Math.sign(tf - t0) || 1;
  const nEq = y0.length;
  const c2 = 1 / 5, c3 = 3 / 10, c4 = 4 / 5, c5 = 8 / 9;
  const a21 = 1 / 5, a31 = 3 / 40, a32 = 9 / 40, a41 = 44 / 45, a42 = -56 / 15, a43 = 32 / 9;
  const a51 = 19372 / 6561, a52 = -25360 / 2187, a53 = 64448 / 6561, a54 = -212 / 729;
  const a61 = 9017 / 3168, a62 = -355 / 33, a63 = 46732 / 5247, a64 = 49 / 176, a65 = -5103 / 18656;
  const b1 = 35 / 384, b3 = 500 / 1113, b4 = 125 / 192, b5 = -2187 / 6784, b6 = 11 / 84;
  const e1 = 71 / 57600, e3 = -71 / 16695, e4 = 71 / 1920, e5 = -17253 / 339200, e6 = 22 / 525, e7 = -1 / 40;
  const add = (y, ...terms) => y.map((v, i) => v + terms.reduce((s, [h, k]) => s + h * k[i], 0));
  const callF = (t, y) => {
    const r = f(t, y);
    if (r.length !== nEq) throw new MatlabError(`@(T,Y) must return a column vector of length ${nEq}.`);
    return r;
  };
  let t = t0, y = y0.slice();
  let k1 = callF(t, y);
  const span = Math.abs(tf - t0);
  let h = Math.min(span / 10, 0.1 * span);
  // initial step heuristic
  const nrm = Math.max(...k1.map((v, i) => Math.abs(v) / Math.max(Math.abs(y[i]), absTol / relTol)));
  if (nrm > 0) h = Math.min(h, 0.8 * relTol ** 0.2 / nrm);
  h = Math.max(h, 16 * Number.EPSILON * Math.abs(t));
  const T = [t], Y = [y.slice()];
  const outTimes = tspan.length > 2 ? tspan.slice(1) : null;
  let outIdx = 0;
  let steps = 0;
  while (dir * (tf - t) > 0) {
    if (steps++ > 200000) throw new MatlabError('ode45: too many steps. The problem may be stiff.');
    if (dir * (t + dir * h - tf) > 0) h = Math.abs(tf - t);
    const hs = dir * h;
    const k2 = callF(t + c2 * hs, add(y, [hs * a21, k1]));
    const k3 = callF(t + c3 * hs, add(y, [hs * a31, k1], [hs * a32, k2]));
    const k4 = callF(t + c4 * hs, add(y, [hs * a41, k1], [hs * a42, k2], [hs * a43, k3]));
    const k5 = callF(t + c5 * hs, add(y, [hs * a51, k1], [hs * a52, k2], [hs * a53, k3], [hs * a54, k4]));
    const k6 = callF(t + hs, add(y, [hs * a61, k1], [hs * a62, k2], [hs * a63, k3], [hs * a64, k4], [hs * a65, k5]));
    const yn = add(y, [hs * b1, k1], [hs * b3, k3], [hs * b4, k4], [hs * b5, k5], [hs * b6, k6]);
    const k7 = callF(t + hs, yn);
    let err = 0;
    for (let i = 0; i < nEq; i++) {
      const ei = hs * (e1 * k1[i] + e3 * k3[i] + e4 * k4[i] + e5 * k5[i] + e6 * k6[i] + e7 * k7[i]);
      const sc = Math.max(absTol, relTol * Math.max(Math.abs(y[i]), Math.abs(yn[i])));
      err = Math.max(err, Math.abs(ei) / sc);
    }
    if (!Number.isFinite(err)) { h /= 4; if (h < 1e-14 * Math.max(1, Math.abs(t))) throw new MatlabError(`Failure at t=${t.toExponential(6)}. Unable to meet integration tolerances without reducing the step size below the smallest value allowed.`); continue; }
    if (err <= 1) {
      const tn = t + hs;
      const herm = (s) => {
        // cubic Hermite between (t,y,k1) and (tn,yn,k7), s in [0,1]
        const h00 = 2 * s ** 3 - 3 * s ** 2 + 1, h10 = s ** 3 - 2 * s ** 2 + s, h01 = -2 * s ** 3 + 3 * s ** 2, h11 = s ** 3 - s ** 2;
        return y.map((v, i) => h00 * v + h10 * hs * k1[i] + h01 * yn[i] + h11 * hs * k7[i]);
      };
      if (outTimes) {
        while (outIdx < outTimes.length && dir * (outTimes[outIdx] - tn) <= 1e-12 * Math.abs(tn)) {
          const to = outTimes[outIdx];
          T.push(to);
          Y.push(to === tn ? yn.slice() : herm((to - t) / hs));
          outIdx++;
        }
      } else {
        for (let r = 1; r < refine; r++) { T.push(t + hs * r / refine); Y.push(herm(r / refine)); }
        T.push(tn); Y.push(yn.slice());
      }
      t = tn; y = yn; k1 = k7;
    }
    h *= Math.min(5, Math.max(0.2, 0.9 * (err === 0 ? 5 : err ** -0.2)));
  }
  return { T, Y };
}

// ---------------------------------------------------------------- linear algebra
export function solveLinear(A, b, n, m) {
  // A: n x n (row-major array of rows), b: n x m rows. Gaussian elimination with partial pivoting.
  const M = A.map((row, i) => row.concat(b[i]));
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    if (Math.abs(M[piv][col]) < 1e-14) throw new MatlabError('Matrix is singular to working precision.');
    [M[col], M[piv]] = [M[piv], M[col]];
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const fct = M[r][col] / M[col][col];
      for (let c = col; c < n + m; c++) M[r][c] -= fct * M[col][c];
    }
  }
  return M.map((row, i) => row.slice(n).map((v) => v / M[i][i]));
}

export function gammaFn(x) {
  if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * gammaFn(1 - x));
  if (Number.isInteger(x) && x <= 171) { let r = 1; for (let k = 2; k < x; k++) r *= k; return r; }
  const g = 7;
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  x -= 1;
  let a = c[0];
  const t = x + g + 0.5;
  for (let i = 1; i < 9; i++) a += c[i] / (x + i);
  return Math.sqrt(2 * Math.PI) * t ** (x + 0.5) * Math.exp(-t) * a;
}

export function erf(x) {
  // Abramowitz-Stegun 7.1.26 is too coarse; use series / continued fraction
  const ax = Math.abs(x);
  let r;
  if (ax < 2.5) {
    let sum = 0, term = ax, k = 0;
    while (Math.abs(term) > 1e-17 * Math.abs(sum) || k < 3) {
      sum += term / (2 * k + 1);
      k++;
      term *= -ax * ax / k;
      if (k > 200) break;
    }
    r = 2 / Math.sqrt(Math.PI) * sum;
  } else {
    // continued fraction for erfc
    let f = 0;
    for (let k = 60; k >= 1; k--) f = k / 2 / (ax + f);
    r = 1 - Math.exp(-ax * ax) / Math.sqrt(Math.PI) / (ax + f);
  }
  return x < 0 ? -r : r;
}
