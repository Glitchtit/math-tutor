// Interactive, animated visualisations used in the lessons.
// Every widget is created with: WIDGETS[name](container, config) and reads expressions written
// in MATLAB syntax (e.g. "x.^2 .* exp(-x)") so content authors and the AI tutor can configure them.

import { Plot } from './plot.js';
import { compile } from './matlab/compile.js';
import { integrate, fzero } from './matlab/numeric.js';
import { h, renderMath } from './util.js';

const C = {
  accent: 'var(--accent)',
};
const PALETTE = ['#2563eb', '#e8590c', '#2f9e44', '#9c36b5', '#c2255c', '#0c8599', '#5c940d'];
function css(name, fb) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fb; }
const col = {
  get a() { return css('--viz-1', PALETTE[0]); },
  get b() { return css('--viz-2', PALETTE[1]); },
  get c() { return css('--viz-3', PALETTE[2]); },
  get d() { return css('--viz-4', PALETTE[3]); },
  get neg() { return css('--viz-neg', '#e03131'); },
  get muted() { return css('--text-muted', '#777'); },
};
void C;

// ------------------------------------------------------------------ UI helpers

function frame(container, cfg) {
  const root = h('div', { class: 'widget' });
  if (cfg.title) root.appendChild(h('div', { class: 'widget-title' }, cfg.title));
  const stage = h('div', { class: 'widget-stage' });
  const controls = h('div', { class: 'widget-controls' });
  const readout = h('div', { class: 'widget-readout' });
  root.append(stage, controls, readout);
  if (cfg.caption) { const cap = h('div', { class: 'widget-caption' }); cap.innerHTML = cfg.caption; renderMath(cap); root.appendChild(cap); }
  container.appendChild(root);
  return { root, stage, controls, readout };
}

function slider(parent, label, { min = 0, max = 1, step = 0.01, value = 0 }, onInput, fmt = (v) => fmtNum(v)) {
  const lab = h('span', { class: 'ctl-label' });
  lab.innerHTML = label;
  renderMath(lab);
  const val = h('span', { class: 'ctl-value' }, fmt(value));
  const input = h('input', { type: 'range', min, max, step, value, 'aria-label': label.replace(/\$/g, '') });
  input.addEventListener('input', () => { val.textContent = fmt(+input.value); onInput(+input.value); });
  const row = h('label', { class: 'ctl ctl-slider' }, lab, input, val);
  parent.appendChild(row);
  return {
    get: () => +input.value,
    set: (v, fire = true) => { input.value = v; val.textContent = fmt(+input.value); if (fire) onInput(+input.value); },
    el: row,
  };
}

function select(parent, label, options, value, onChange) {
  const sel = h('select', { 'aria-label': label }, ...options.map(([v, t]) => h('option', { value: v, selected: v === value }, t)));
  sel.addEventListener('change', () => onChange(sel.value));
  const row = h('label', { class: 'ctl' }, h('span', { class: 'ctl-label' }, label), sel);
  parent.appendChild(row);
  return { get: () => sel.value, el: row };
}

function button(parent, label, onClick, cls = '') {
  const b = h('button', { class: `btn btn-small ${cls}`, type: 'button', onclick: onClick }, label);
  parent.appendChild(b);
  return b;
}

function toggle(parent, label, value, onChange) {
  const cb = h('input', { type: 'checkbox', checked: value });
  cb.addEventListener('change', () => onChange(cb.checked));
  const lab = h('span', { class: 'ctl-label' });
  lab.innerHTML = label;
  renderMath(lab);
  const row = h('label', { class: 'ctl ctl-toggle' }, cb, lab);
  parent.appendChild(row);
  return { get: () => cb.checked, el: row };
}

export function fmtNum(v, d = 4) {
  if (!Number.isFinite(v)) return v > 0 ? '∞' : v < 0 ? '−∞' : 'undefined';
  if (Math.abs(v) >= 1e5 || (Math.abs(v) < 1e-4 && v !== 0)) return v.toExponential(3);
  return (+v.toFixed(d)).toString();
}

function setReadout(el, html) {
  el.innerHTML = html;
  renderMath(el);
}

// play / pause animation of a parameter between from..to
function animator(parent, { from, to, duration = 4000, loop = false, onFrame, label = 'Animate' }) {
  let raf = null, t0 = 0;
  const btn = button(parent, '▶ ' + label, () => {
    if (raf) { stop(); return; }
    t0 = performance.now();
    btn.textContent = '❚❚ Pause';
    const tick = (now) => {
      if (!btn.isConnected) { stop(); return; }
      let s = (now - t0) / duration;
      if (s >= 1) { if (loop) { t0 = now; s = 0; } else { onFrame(to); stop(); return; } }
      const eased = s < 0.5 ? 2 * s * s : 1 - (-2 * s + 2) ** 2 / 2;
      onFrame(from + (to - from) * eased);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  });
  function stop() { if (raf) cancelAnimationFrame(raf); raf = null; btn.textContent = '▶ ' + label; }
  return { stop };
}

function numDeriv(f, x, hh = 1e-5) { return (f(x + hh) - f(x - hh)) / (2 * hh); }
function numDeriv2(f, x, hh = 1e-4) { return (f(x + hh) - 2 * f(x) + f(x - hh)) / (hh * hh); }
function quad(f, a, b) { return integrate((xs) => xs.map(f), a, b).value; }

function viewFrom(cfg, defX = [-5, 5], defY = [-3, 3]) {
  const xl = cfg.xlim || defX, yl = cfg.ylim || defY;
  return { xl, yl };
}

function makePlot(stage, cfg, height) {
  const { xl, yl } = viewFrom(cfg);
  const p = new Plot(stage, { height: height || cfg.height || 320, xlim: xl, ylim: yl, axisEqual: cfg.axisEqual, xlabel: cfg.xlabel, ylabel: cfg.ylabel });
  p.setView(xl[0], xl[1], yl[0], yl[1]);
  return p;
}

// ------------------------------------------------------------------ widgets

export const WIDGETS = {};

// Generic function plot with parameter sliders.
// cfg: { functions:[{expr,label,color,dash}], params:{a:{min,max,step,value,label}}, points:[{x,y,label}],
//        shade:{expr,from,to,signed}, slopeField:'expr in x,y', animate:{param,from,to,duration} }
WIDGETS.plot = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const params = cfg.params || {};
  const names = Object.keys(params);
  const vals = Object.fromEntries(names.map((k) => [k, params[k].value ?? params[k].min ?? 0]));
  const fns = (cfg.functions || []).map((f, i) => ({ ...f, color: f.color || PALETTE[i % PALETTE.length], fn: compile(f.expr, ['x', ...names]) }));
  const shadeFn = cfg.shade ? compile(cfg.shade.expr, ['x', ...names]) : null;
  const shadeLo = cfg.shade?.lower ? compile(cfg.shade.lower, ['x', ...names]) : null;
  const sf = cfg.slopeField ? compile(cfg.slopeField, ['x', 'y', ...names]) : null;
  const p = makePlot(stage, cfg);
  const arg = () => names.map((k) => vals[k]);
  const evalNum = (v) => (typeof v === 'string' ? compile(v, names)(...arg()) : v);
  p.onDraw((pl) => {
    if (sf) pl.slopeField((x, y) => sf(x, y, ...arg()));
    if (shadeFn) {
      const a = evalNum(cfg.shade.from), b = evalNum(cfg.shade.to);
      pl.fillBetween((x) => shadeFn(x, ...arg()), shadeLo ? (x) => shadeLo(x, ...arg()) : null, a, b, { signed: cfg.shade.signed, color: col.a, alpha: 0.25 });
    }
    fns.forEach((f) => pl.fn((x) => f.fn(x, ...arg()), { color: f.color, width: f.width || 2.5, dash: f.dash ? [7, 5] : [] }));
    (cfg.points || []).forEach((pt) => pl.point(evalNum(pt.x), evalNum(pt.y), { label: pt.label, color: pt.color || col.b, hollow: pt.hollow }));
    (cfg.vlines || []).forEach((x) => pl.vline(evalNum(x)));
    (cfg.hlines || []).forEach((y) => pl.hline(evalNum(y)));
  });
  const legend = fns.filter((f) => f.label);
  if (legend.length) {
    const lg = h('div', { class: 'widget-legend' }, ...legend.map((f) => { const s = h('span', {}, h('i', { style: { background: f.color } }), ' '); const l = h('span'); l.innerHTML = f.label; renderMath(l); s.appendChild(l); return s; }));
    stage.appendChild(lg);
  }
  const sliders = {};
  names.forEach((k) => {
    const pr = params[k];
    sliders[k] = slider(controls, pr.label || `$${k}$`, { min: pr.min, max: pr.max, step: pr.step || (pr.max - pr.min) / 200, value: vals[k] }, (v) => { vals[k] = v; p.redraw(); update(); });
  });
  if (cfg.animate && sliders[cfg.animate.param]) {
    animator(controls, { ...cfg.animate, onFrame: (v) => sliders[cfg.animate.param].set(v) });
  }
  function update() {
    if (cfg.readout) setReadout(readout, cfg.readout.replace(/\{\{([^}]+)\}\}/g, (_, ex) => fmtNum(compile(ex, names)(...arg()))));
  }
  update();
  return p;
};

// Limits: watch x -> a from both sides.
WIDGETS.limit = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const f = compile(cfg.f);
  const a = cfg.a ?? 0;
  const L = cfg.L;
  const p = makePlot(stage, { xlim: [a - 3, a + 3], ylim: [-2, 3], ...cfg });
  let d = 1.5;
  p.onDraw((pl) => {
    pl.fn(f, { color: col.a, width: 2.5 });
    pl.vline(a);
    if (L !== undefined && Number.isFinite(L)) {
      pl.hline(L, { color: col.c });
      pl.point(a, L, { hollow: true, color: col.a, r: 5 });
    }
    if (cfg.valueAt !== undefined) pl.point(a, cfg.valueAt, { color: col.b });
    const xl = a - d, xr = a + d;
    pl.point(xl, f(xl), { color: col.b, r: 5 });
    pl.point(xr, f(xr), { color: col.d, r: 5 });
    pl.segment(xl, 0, xl, f(xl), { color: col.b, width: 1, dash: [3, 3] });
    pl.segment(xr, 0, xr, f(xr), { color: col.d, width: 1, dash: [3, 3] });
  });
  const table = h('table', { class: 'value-table' });
  stage.appendChild(table);
  const update = () => {
    const rows = [1, 0.1, 0.01, 0.001].map((s) => [a - s, f(a - s), a + s, f(a + s)]);
    table.innerHTML = '<tr><th>x → a⁻</th><th>f(x)</th><th>x → a⁺</th><th>f(x)</th></tr>' + rows.map((r) => `<tr>${r.map((v) => `<td>${fmtNum(v, 6)}</td>`).join('')}</tr>`).join('');
    setReadout(readout, `$x = ${fmtNum(a)} \\pm ${fmtNum(d)}$: left value $${fmtNum(f(a - d), 6)}$, right value $${fmtNum(f(a + d), 6)}$${L !== undefined ? `, limit $L = ${cfg.Ltex || fmtNum(L)}$` : ''}`);
  };
  const s = slider(controls, 'distance $|x-a|$', { min: 0.001, max: 2.5, step: 0.001, value: d }, (v) => { d = v; p.redraw(); update(); });
  animator(controls, { from: 2.5, to: 0.001, duration: 5000, onFrame: (v) => s.set(v), label: 'Approach a' });
  update();
};

// Secant -> tangent.
WIDGETS.secant = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const f = compile(cfg.f);
  let a = cfg.a ?? 1, hh = 1.5;
  const p = makePlot(stage, cfg);
  p.onDraw((pl) => {
    pl.fn(f, { color: col.a, width: 2.5 });
    const m = (f(a + hh) - f(a)) / hh;
    pl.fn((x) => f(a) + m * (x - a), { color: col.b, width: 1.8 });
    if (cfg.showTangent !== false) pl.fn((x) => f(a) + numDeriv(f, a) * (x - a), { color: col.c, width: 1.2, dash: [6, 4] });
    pl.point(a, f(a), { color: col.a, label: 'P' });
    pl.point(a + hh, f(a + hh), { color: col.b, label: 'Q' });
    pl.segment(a, f(a), a + hh, f(a), { color: col.muted, width: 1, dash: [3, 3] });
    pl.segment(a + hh, f(a), a + hh, f(a + hh), { color: col.muted, width: 1, dash: [3, 3] });
  });
  const update = () => {
    const m = (f(a + hh) - f(a)) / hh;
    setReadout(readout, `Secant slope $\\dfrac{f(a+h)-f(a)}{h} = ${fmtNum(m, 6)}$ with $h = ${fmtNum(hh)}$. &nbsp; Tangent slope $f'(a) \\approx ${fmtNum(numDeriv(f, a), 6)}$`);
  };
  slider(controls, '$a$', { min: cfg.xlim?.[0] ?? -3, max: cfg.xlim?.[1] ?? 3, step: 0.01, value: a }, (v) => { a = v; p.redraw(); update(); });
  const hs = slider(controls, '$h$', { min: -2, max: 2, step: 0.001, value: hh }, (v) => { hh = Math.abs(v) < 1e-4 ? 1e-4 : v; p.redraw(); update(); });
  animator(controls, { from: 2, to: 0.0001, duration: 5000, onFrame: (v) => hs.set(v), label: 'Let h → 0' });
  update();
};

// f and f' linked by a draggable point.
WIDGETS.derivative = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const f = compile(cfg.f);
  const df = cfg.df ? compile(cfg.df) : (x) => numDeriv(f, x);
  let x0 = cfg.x0 ?? 0;
  const traced = [];
  const top = makePlot(stage, cfg, 260);
  const bot = makePlot(stage, { ...cfg, ylim: cfg.dylim || cfg.ylim }, 200);
  top.onDraw((pl) => {
    pl.fn(f, { color: col.a, width: 2.5 });
    const m = df(x0);
    pl.fn((x) => f(x0) + m * (x - x0), { color: col.b, width: 1.6, from: x0 - 1.5, to: x0 + 1.5 });
    pl.point(x0, f(x0), { color: col.b });
  });
  bot.onDraw((pl) => {
    if (cfg.showDerivative !== false) pl.fn(df, { color: col.c, width: 1.5, dash: [5, 4] });
    pl.polyline(traced.map((t) => t[0]), traced.map((t) => t[1]), { color: col.b, width: 3 });
    pl.point(x0, df(x0), { color: col.b, label: "f'(x)" });
  });
  const update = () => {
    traced.push([x0, df(x0)]);
    traced.sort((u, v) => u[0] - v[0]);
    top.redraw(); bot.redraw();
    setReadout(readout, `$x = ${fmtNum(x0)}$, &nbsp; $f(x) = ${fmtNum(f(x0))}$, &nbsp; slope $f'(x) = ${fmtNum(df(x0))}$ — the lower graph records the slope.`);
  };
  const xl = cfg.xlim || [-5, 5];
  const s = slider(controls, '$x$', { min: xl[0], max: xl[1], step: (xl[1] - xl[0]) / 500, value: x0 }, (v) => { x0 = v; update(); });
  animator(controls, { from: xl[0], to: xl[1], duration: 7000, onFrame: (v) => s.set(v), label: 'Sweep' });
  top.onPointer((ev) => { if (ev.dragging) s.set(Math.min(xl[1], Math.max(xl[0], ev.x))); });
  update();
};

// Critical points, monotonicity, concavity.
WIDGETS.extrema = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const f = compile(cfg.f);
  const df = cfg.df ? compile(cfg.df) : (x) => numDeriv(f, x);
  const d2 = cfg.d2f ? compile(cfg.d2f) : (x) => numDeriv2(f, x);
  const xl = cfg.xlim || [-5, 5];
  // locate zeros of f' and f'' on a grid
  const zeros = (g) => {
    const out = [];
    const N = 800;
    let px = xl[0], pv = g(px);
    for (let k = 1; k <= N; k++) {
      const x = xl[0] + (xl[1] - xl[0]) * k / N;
      const v = g(x);
      if (Number.isFinite(v) && Number.isFinite(pv) && Math.sign(v) !== Math.sign(pv) && Math.abs(v - pv) < 10) {
        try { out.push(fzero(g, [px, x])); } catch { /* skip */ }
      }
      px = x; pv = v;
    }
    return out;
  };
  const crit = zeros(df), infl = zeros(d2);
  let showConc = true, showMono = true;
  const p = makePlot(stage, cfg);
  p.onDraw((pl) => {
    // colour curve by concavity
    const N = 400;
    let seg = [[], []], cur = null;
    const flush = () => { if (seg[0].length > 1) pl.polyline(seg[0], seg[1], { color: !showConc ? col.a : cur > 0 ? col.c : col.b, width: 3 }); };
    for (let k = 0; k <= N; k++) {
      const x = xl[0] + (xl[1] - xl[0]) * k / N;
      const s = Math.sign(d2(x)) || cur;
      if (cur !== null && s !== cur) { seg[0].push(x); seg[1].push(f(x)); flush(); seg = [[x], [f(x)]]; }
      cur = s;
      seg[0].push(x); seg[1].push(f(x));
    }
    flush();
    if (showMono) {
      const pts = [xl[0], ...crit, xl[1]];
      for (let k = 0; k + 1 < pts.length; k++) {
        const m = (pts[k] + pts[k + 1]) / 2;
        const up = df(m) > 0;
        pl.text(m, pl.view.y0 + (pl.view.y1 - pl.view.y0) * 0.05, up ? '↗ increasing' : '↘ decreasing', { align: 'center', color: up ? col.c : col.neg, font: '12px sans-serif' });
      }
    }
    crit.forEach((x) => {
      const t = d2(x);
      pl.point(x, f(x), { color: t < 0 ? col.neg : t > 0 ? col.c : col.d, label: t < 0 ? 'max' : t > 0 ? 'min' : '?' });
    });
    infl.forEach((x) => pl.point(x, f(x), { color: col.d, hollow: true, r: 4 }));
  });
  toggle(controls, 'colour by concavity (green: $f\'\'>0$, orange: $f\'\'<0$)', true, (v) => { showConc = v; p.redraw(); });
  toggle(controls, 'show increasing / decreasing', true, (v) => { showMono = v; p.redraw(); });
  setReadout(readout, `Critical points ($f'(x)=0$): ${crit.map((x) => `$x\\approx${fmtNum(x, 3)}$ (${d2(x) < 0 ? 'local max' : d2(x) > 0 ? 'local min' : 'test inconclusive'})`).join(', ') || 'none in view'}. Inflection points (hollow): ${infl.map((x) => `$${fmtNum(x, 3)}$`).join(', ') || 'none'}.`);
};

// Family of antiderivatives F + C with slope field of f.
WIDGETS.antiderivative = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const f = compile(cfg.f), F = compile(cfg.F);
  let Cc = 0, family = true;
  const p = makePlot(stage, cfg);
  p.onDraw((pl) => {
    pl.slopeField((x) => f(x));
    if (family) for (let k = -4; k <= 4; k++) pl.fn((x) => F(x) + k, { color: col.muted, width: 1, alpha: 0.5 });
    pl.fn((x) => F(x) + Cc, { color: col.a, width: 3 });
    if (cfg.f2) pl.fn(compile(cfg.F2), { color: col.b, width: 2, dash: [6, 4] });
  });
  slider(controls, '$C$', { min: -4, max: 4, step: 0.01, value: 0 }, (v) => { Cc = v; p.redraw(); setReadout(readout, `$F(x) + C$ with $C = ${fmtNum(v)}$ — every member has the same slope $f(x)$ at each $x$.`); });
  toggle(controls, 'show the whole family', true, (v) => { family = v; p.redraw(); });
  setReadout(readout, 'Drag $C$: shifting the graph up or down does not change any slope, so every $F+C$ is an antiderivative.');
};

// Riemann sums and numerical integration rules.
WIDGETS.riemann = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const f = compile(cfg.f);
  const a = cfg.a ?? 0, b = cfg.b ?? 1;
  let n = cfg.n ?? 4, method = cfg.method ?? 'left';
  const exact = cfg.exact ?? quad(f, a, b);
  const p = makePlot(stage, { xlim: [a - (b - a) * 0.1, b + (b - a) * 0.1], ...cfg });
  const sum = () => {
    const dx = (b - a) / n;
    let s = 0;
    if (method === 'simpson') {
      const m = n % 2 ? n + 1 : n; const d = (b - a) / m;
      for (let k = 0; k <= m; k++) s += (k === 0 || k === m ? 1 : k % 2 ? 4 : 2) * f(a + k * d);
      return s * d / 3;
    }
    for (let k = 0; k < n; k++) {
      const x0 = a + k * dx;
      if (method === 'left') s += f(x0);
      else if (method === 'right') s += f(x0 + dx);
      else if (method === 'mid') s += f(x0 + dx / 2);
      else if (method === 'trap') s += (f(x0) + f(x0 + dx)) / 2;
    }
    return s * dx;
  };
  p.onDraw((pl) => {
    const dx = (b - a) / n;
    for (let k = 0; k < n; k++) {
      const x0 = a + k * dx, x1 = x0 + dx;
      const color = (v) => (v >= 0 ? col.a : col.neg);
      if (method === 'trap') pl.fillPoly([[x0, 0], [x0, f(x0)], [x1, f(x1)], [x1, 0]], { color: color(f(x0) + f(x1)), alpha: 0.3, stroke: color(f(x0) + f(x1)) });
      else if (method === 'simpson') {
        if (k % 2 === 0 && k + 1 < n + 1) {
          const xm = x1, x2 = Math.min(b, x0 + 2 * dx);
          const y0 = f(x0), ym = f(xm), y2 = f(x2);
          const q = (x) => y0 * ((x - xm) * (x - x2)) / ((x0 - xm) * (x0 - x2)) + ym * ((x - x0) * (x - x2)) / ((xm - x0) * (xm - x2)) + y2 * ((x - x0) * (x - xm)) / ((x2 - x0) * (x2 - xm));
          pl.fillBetween(q, null, x0, x2, { color: col.c, alpha: 0.3 });
          pl.fn(q, { from: x0, to: x2, color: col.c, width: 1.5 });
        }
      } else {
        const xs = method === 'left' ? x0 : method === 'right' ? x1 : (x0 + x1) / 2;
        const y = f(xs);
        pl.rect(x0, 0, x1, y, { color: color(y), alpha: 0.28 });
        pl.point(xs, y, { r: 3, color: color(y) });
      }
    }
    pl.fn(f, { color: col.a, width: 2.5 });
  });
  const update = () => {
    const s = sum();
    const names = { left: 'Left sum $L_n$', right: 'Right sum $R_n$', mid: 'Midpoint sum $M_n$', trap: 'Trapezoid rule $T_n$', simpson: 'Simpson\'s rule $S_n$' };
    setReadout(readout, `${names[method]} with $n = ${method === 'simpson' && n % 2 ? n + 1 : n}$: $\\;${fmtNum(s, 6)}$ &nbsp;|&nbsp; exact $\\int_{${fmtNum(a)}}^{${fmtNum(b)}} f\\,dx = ${cfg.exactTex || fmtNum(exact, 6)}$ &nbsp;|&nbsp; error $${fmtNum(exact - s, 6)}$`);
  };
  select(controls, 'Rule', [['left', 'Left'], ['right', 'Right'], ['mid', 'Midpoint'], ['trap', 'Trapezoid'], ['simpson', 'Simpson']], method, (v) => { method = v; p.redraw(); update(); });
  const s = slider(controls, '$n$ (subintervals)', { min: 1, max: cfg.nmax || 64, step: 1, value: n }, (v) => { n = v; p.redraw(); update(); }, (v) => String(v));
  animator(controls, { from: 1, to: cfg.nmax || 64, duration: 6000, onFrame: (v) => s.set(Math.round(v)), label: 'Increase n' });
  update();
};

// Error of numerical rules vs n (log-log).
WIDGETS.convergence = (container, cfg) => {
  const { stage, readout } = frame(container, cfg);
  const f = compile(cfg.f);
  const a = cfg.a ?? 0, b = cfg.b ?? 1;
  const exact = cfg.exact ?? quad(f, a, b);
  const rules = {
    trap: (n) => { const d = (b - a) / n; let s = (f(a) + f(b)) / 2; for (let k = 1; k < n; k++) s += f(a + k * d); return s * d; },
    mid: (n) => { const d = (b - a) / n; let s = 0; for (let k = 0; k < n; k++) s += f(a + (k + 0.5) * d); return s * d; },
    simpson: (n) => { const m = n % 2 ? n + 1 : n; const d = (b - a) / m; let s = f(a) + f(b); for (let k = 1; k < m; k++) s += (k % 2 ? 4 : 2) * f(a + k * d); return s * d / 3; },
    left: (n) => { const d = (b - a) / n; let s = 0; for (let k = 0; k < n; k++) s += f(a + k * d); return s * d; },
  };
  const ns = [2, 4, 8, 16, 32, 64, 128, 256, 512];
  const series = (cfg.methods || ['left', 'trap', 'mid', 'simpson']).map((m, i) => ({ m, color: PALETTE[i], pts: ns.map((n) => [Math.log10(n), Math.log10(Math.abs(rules[m](n) - exact) || 1e-16)]) }));
  const ys = series.flatMap((s) => s.pts.map((q) => q[1]));
  const p = new Plot(stage, { height: 300, xlabel: 'log₁₀ n', ylabel: 'log₁₀ |error|' });
  p.setView(0, 3, Math.max(-16, Math.min(...ys)) - 0.5, Math.max(...ys) + 0.5);
  p.onDraw((pl) => series.forEach((s) => { pl.polyline(s.pts.map((q) => q[0]), s.pts.map((q) => q[1]), { color: s.color, width: 2 }); s.pts.forEach((q) => pl.point(q[0], q[1], { r: 3, color: s.color })); }));
  const slope = (s) => (s.pts[5][1] - s.pts[2][1]) / (s.pts[5][0] - s.pts[2][0]);
  stage.appendChild(h('div', { class: 'widget-legend' }, ...series.map((s) => h('span', {}, h('i', { style: { background: s.color } }), ` ${s.m} (slope ≈ ${slope(s).toFixed(2)})`))));
  setReadout(readout, 'Each doubling of $n$ moves one step right. A slope of $-2$ means the error drops by a factor $4$ per doubling ($E \\propto 1/n^2$); slope $-4$ means $E\\propto 1/n^4$.');
};

// Accumulation function A(x) = ∫_a^x f(t) dt (Fundamental theorem).
WIDGETS.accumulate = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const f = compile(cfg.f);
  const a = cfg.a ?? 0;
  const xl = cfg.xlim || [a - 1, a + 8];
  let x = cfg.x0 ?? a + 2;
  // precompute A on a grid
  const N = 400;
  const grid = [], Avals = [];
  for (let k = 0; k <= N; k++) grid.push(xl[0] + (xl[1] - xl[0]) * k / N);
  const ia = grid.reduce((best, g, k) => (Math.abs(g - a) < Math.abs(grid[best] - a) ? k : best), 0);
  Avals[ia] = quad(f, a, grid[ia]);
  for (let k = ia + 1; k <= N; k++) Avals[k] = Avals[k - 1] + quad(f, grid[k - 1], grid[k]);
  for (let k = ia - 1; k >= 0; k--) Avals[k] = Avals[k + 1] - quad(f, grid[k], grid[k + 1]);
  const A = (t) => Avals[Math.min(N, Math.max(0, Math.round((t - xl[0]) / (xl[1] - xl[0]) * N)))] + quad(f, grid[Math.min(N, Math.max(0, Math.round((t - xl[0]) / (xl[1] - xl[0]) * N)))], t);
  const top = makePlot(stage, { ...cfg, xlim: xl }, 240);
  const ayl = cfg.Alim || [Math.min(...Avals) - 0.5, Math.max(...Avals) + 0.5];
  const bot = makePlot(stage, { xlim: xl, ylim: ayl }, 200);
  top.onDraw((pl) => {
    pl.fillBetween(f, null, Math.min(a, x), Math.max(a, x), { signed: true, color: col.a, alpha: 0.3 });
    pl.fn(f, { color: col.a, width: 2.5 });
    pl.vline(a); pl.vline(x, { color: col.b });
    pl.point(x, f(x), { color: col.b, label: 'f(x)' });
  });
  bot.onDraw((pl) => {
    const k1 = Math.round((x - xl[0]) / (xl[1] - xl[0]) * N);
    const xs = [], ys = [];
    for (let k = Math.min(ia, k1); k <= Math.max(ia, k1); k++) { xs.push(grid[k]); ys.push(Avals[k]); }
    pl.polyline(grid, Avals, { color: col.muted, width: 1, dash: [4, 4] });
    pl.polyline(xs, ys, { color: col.c, width: 3 });
    const Ax = A(x), m = f(x);
    pl.fn((t) => Ax + m * (t - x), { from: x - 1, to: x + 1, color: col.b, width: 1.5 });
    pl.point(x, Ax, { color: col.c, label: 'A(x)' });
  });
  const update = () => {
    top.redraw(); bot.redraw();
    setReadout(readout, `$A(x) = \\int_{${fmtNum(a)}}^{x} f(t)\\,dt = ${fmtNum(A(x))}$ at $x = ${fmtNum(x)}$. &nbsp; Slope of $A$ at $x$ equals $f(x) = ${fmtNum(f(x))}$ (orange tangent): $A'(x) = f(x)$. Area below the axis counts negative (red).`);
  };
  const s = slider(controls, '$x$', { min: xl[0], max: xl[1], step: (xl[1] - xl[0]) / 400, value: x }, (v) => { x = v; update(); });
  animator(controls, { from: a, to: xl[1], duration: 7000, onFrame: (v) => s.set(v), label: 'Accumulate' });
  update();
};

// Substitution: same area in x-world and u-world.
WIDGETS.substitution = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const f = compile(cfg.f), g = compile(cfg.u), fu = compile(cfg.fu, ['u']);
  const a = cfg.a, b = cfg.b;
  const ua = g(a), ub = g(b);
  let t = 1;
  const row = h('div', { class: 'widget-row' });
  stage.appendChild(row);
  const left = h('div'), right = h('div');
  row.append(left, right);
  left.appendChild(h('div', { class: 'widget-sub' }, 'x-world: ', h('span', { class: 'mono' }, cfg.fLabel || cfg.f)));
  right.appendChild(h('div', { class: 'widget-sub' }, 'u-world: ', h('span', { class: 'mono' }, cfg.fuLabel || cfg.fu)));
  const P1 = makePlot(left, { xlim: cfg.xlim || [a - 0.5, b + 0.5], ylim: cfg.ylim }, 240);
  const P2 = makePlot(right, { xlim: cfg.ulim || [Math.min(ua, ub) - 0.5, Math.max(ua, ub) + 0.5], ylim: cfg.uylim || cfg.ylim }, 240);
  P1.onDraw((pl) => { const xe = a + (b - a) * t; pl.fillBetween(f, null, a, xe, { signed: true, color: col.a }); pl.fn(f, { color: col.a, width: 2.5 }); pl.vline(a); pl.vline(b); });
  P2.onDraw((pl) => { const ue = g(a + (b - a) * t); pl.fillBetween(fu, null, Math.min(ua, ue), Math.max(ua, ue), { signed: true, color: col.c }); pl.fn(fu, { color: col.c, width: 2.5 }); pl.vline(ua); pl.vline(ub); });
  const update = () => {
    const xe = a + (b - a) * t;
    const I1 = quad(f, a, xe), I2 = quad(fu, ua, g(xe));
    P1.redraw(); P2.redraw();
    setReadout(readout, `$\\int_{${fmtNum(a)}}^{${fmtNum(xe, 3)}} f(x)\\,dx = ${fmtNum(I1, 6)}$ &nbsp; and &nbsp; $\\int_{u(${fmtNum(a)})}^{u(${fmtNum(xe, 3)})} g(u)\\,du = ${fmtNum(I2, 6)}$ — the limits move with $u = ${cfg.uTex || cfg.u}$.`);
  };
  const s = slider(controls, 'sweep', { min: 0.001, max: 1, step: 0.001, value: 1 }, (v) => { t = v; update(); });
  animator(controls, { from: 0.001, to: 1, duration: 5000, onFrame: (v) => s.set(v), label: 'Sweep both' });
  update();
};

// Area between curves with moving representative strip.
WIDGETS.areaBetween = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const f = compile(cfg.f), g = compile(cfg.g || '0');
  const a = cfg.a, b = cfg.b;
  let xs = (a + b) / 2;
  const total = quad((x) => Math.abs(f(x) - g(x)), a, b);
  const p = makePlot(stage, cfg);
  p.onDraw((pl) => {
    pl.fillBetween(f, g, a, b, { color: col.a, alpha: 0.2 });
    pl.fn(f, { color: col.a, width: 2.5 });
    pl.fn(g, { color: col.b, width: 2.5 });
    const dx = (b - a) / 40;
    pl.rect(xs - dx / 2, g(xs), xs + dx / 2, f(xs), { color: col.c, alpha: 0.6 });
  });
  const update = () => { p.redraw(); setReadout(readout, `Strip at $x=${fmtNum(xs)}$: height $f(x)-g(x) = ${fmtNum(f(xs) - g(xs))}$, area $\\approx (f-g)\\,dx$. Total area $= ${cfg.areaTex || fmtNum(total, 6)}$.`); };
  const s = slider(controls, 'strip position $x$', { min: a, max: b, step: (b - a) / 400, value: xs }, (v) => { xs = v; update(); });
  animator(controls, { from: a, to: b, duration: 5000, onFrame: (v) => s.set(v), label: 'Sweep strip' });
  update();
};

// Solids of revolution (pseudo-3D). method: 'disk' | 'washer' | 'shell'
WIDGETS.solid = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const R = compile(cfg.f), r = cfg.g ? compile(cfg.g) : () => 0;
  const a = cfg.a, b = cfg.b;
  const method = cfg.method || 'disk';
  let slice = (a + b) / 2, tilt = 0.35, nSlices = 0;
  const canvasWrap = h('div');
  stage.appendChild(canvasWrap);
  const cv = h('canvas', { class: 'plot-canvas' });
  canvasWrap.appendChild(cv);
  const ctx = cv.getContext('2d');
  const draw = () => {
    const w = Math.max(300, canvasWrap.clientWidth || 600), H = 320, dpr = window.devicePixelRatio || 1;
    cv.width = w * dpr; cv.height = H * dpr; cv.style.width = w + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = css('--plot-bg', '#fff'); ctx.fillRect(0, 0, w, H);
    let rmax = 0;
    for (let k = 0; k <= 100; k++) { const x = a + (b - a) * k / 100; rmax = Math.max(rmax, Math.abs(R(x)), Math.abs(r(x))); }
    const pad = 40;
    if (method === 'shell') {
      // revolve about the y-axis: radius = x, height = f(x)-g(x)
      const xmax = Math.max(Math.abs(a), Math.abs(b));
      let hmax = 0; for (let k = 0; k <= 100; k++) { const x = a + (b - a) * k / 100; hmax = Math.max(hmax, R(x) - r(x)); }
      const sx = Math.min((w / 2 - pad) / xmax, 0.4 * H / (2 * xmax * tilt));
      const ry = xmax * sx * tilt;
      const cx = w / 2, base = H - 8 - ry;
      const sy = (base - 8 - ry) / (hmax || 1);
      const ell = (rad, y, color, fill = false, alpha = 1) => { ctx.beginPath(); ctx.ellipse(cx, base - y * sy, rad * sx, rad * sx * tilt, 0, 0, Math.PI * 2); ctx.globalAlpha = alpha; if (fill) { ctx.fillStyle = color; ctx.fill(); } ctx.strokeStyle = color; ctx.stroke(); ctx.globalAlpha = 1; };
      // outline of the solid
      for (let k = 0; k <= 12; k++) { const x = a + (b - a) * k / 12; ell(x, R(x), col.muted, false, 0.5); }
      // representative shell
      const x = slice, hgt = R(x) - r(x);
      ctx.fillStyle = col.c; ctx.globalAlpha = 0.25;
      ctx.fillRect(cx - x * sx, base - R(x) * sy, 2 * x * sx, hgt * sy); ctx.globalAlpha = 1;
      ell(x, R(x), col.c); ell(x, r(x), col.c);
      ctx.strokeStyle = col.c; ctx.beginPath(); ctx.moveTo(cx - x * sx, base - r(x) * sy); ctx.lineTo(cx - x * sx, base - R(x) * sy); ctx.moveTo(cx + x * sx, base - r(x) * sy); ctx.lineTo(cx + x * sx, base - R(x) * sy); ctx.stroke();
      // generating region (right half)
      ctx.beginPath();
      for (let k = 0; k <= 100; k++) { const xx = a + (b - a) * k / 100; const px = cx + xx * sx, py = base - R(xx) * sy; if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
      for (let k = 100; k >= 0; k--) { const xx = a + (b - a) * k / 100; ctx.lineTo(cx + xx * sx, base - r(xx) * sy); }
      ctx.closePath(); ctx.fillStyle = col.a; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.a; ctx.stroke();
      ctx.strokeStyle = col.muted; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(cx, pad / 2); ctx.lineTo(cx, H - 5); ctx.stroke(); ctx.setLineDash([]);
      return;
    }
    const sx = (w - 2 * pad) / (b - a), sy = (H / 2 - 20) / (rmax || 1);
    const X = (x) => pad + (x - a) * sx, Ymid = H / 2;
    // body: many translucent cross-sections
    const N = nSlices || 60;
    for (let k = 0; k <= N; k++) {
      const x = a + (b - a) * k / N;
      ctx.beginPath(); ctx.ellipse(X(x), Ymid, Math.abs(R(x)) * sy * tilt, Math.abs(R(x)) * sy, 0, 0, Math.PI * 2);
      ctx.strokeStyle = col.a; ctx.globalAlpha = nSlices ? 0.7 : 0.18; ctx.stroke(); ctx.globalAlpha = 1;
      if (method === 'washer') { ctx.beginPath(); ctx.ellipse(X(x), Ymid, Math.abs(r(x)) * sy * tilt, Math.abs(r(x)) * sy, 0, 0, Math.PI * 2); ctx.strokeStyle = col.b; ctx.globalAlpha = 0.25; ctx.stroke(); ctx.globalAlpha = 1; }
    }
    // profile curves
    ctx.lineWidth = 2;
    for (const sign of [1, -1]) {
      ctx.beginPath();
      for (let k = 0; k <= 200; k++) { const x = a + (b - a) * k / 200; const px = X(x), py = Ymid - sign * R(x) * sy; if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
      ctx.strokeStyle = col.a; ctx.stroke();
      if (method === 'washer') { ctx.beginPath(); for (let k = 0; k <= 200; k++) { const x = a + (b - a) * k / 200; const px = X(x), py = Ymid - sign * r(x) * sy; if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py); } ctx.strokeStyle = col.b; ctx.stroke(); }
    }
    ctx.lineWidth = 1;
    // axis
    ctx.strokeStyle = col.muted; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(10, Ymid); ctx.lineTo(w - 10, Ymid); ctx.stroke(); ctx.setLineDash([]);
    // highlighted slice
    const Rs = Math.abs(R(slice)), rs = Math.abs(r(slice));
    ctx.beginPath(); ctx.ellipse(X(slice), Ymid, Rs * sy * tilt, Rs * sy, 0, 0, Math.PI * 2);
    ctx.fillStyle = col.c; ctx.globalAlpha = 0.45; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.c; ctx.lineWidth = 2; ctx.stroke(); ctx.lineWidth = 1;
    if (method === 'washer') { ctx.beginPath(); ctx.ellipse(X(slice), Ymid, rs * sy * tilt, rs * sy, 0, 0, Math.PI * 2); ctx.fillStyle = css('--plot-bg', '#fff'); ctx.fill(); ctx.strokeStyle = col.c; ctx.stroke(); }
  };
  const update = () => {
    draw();
    const V = method === 'shell' ? quad((x) => 2 * Math.PI * x * (R(x) - r(x)), a, b) : quad((x) => Math.PI * (R(x) ** 2 - r(x) ** 2), a, b);
    const A = method === 'shell' ? `2\\pi x\\,h(x) = ${fmtNum(2 * Math.PI * slice * (R(slice) - r(slice)))}` : method === 'washer' ? `\\pi(R^2 - r^2) = ${fmtNum(Math.PI * (R(slice) ** 2 - r(slice) ** 2))}` : `\\pi R(x)^2 = ${fmtNum(Math.PI * R(slice) ** 2)}`;
    setReadout(readout, `Slice at $x = ${fmtNum(slice)}$: ${method === 'shell' ? 'shell area' : 'cross-section area'} $${A}$. &nbsp; Volume $V = ${cfg.volumeTex || fmtNum(V, 6)}$.`);
  };
  const s = slider(controls, 'slice $x$', { min: a, max: b, step: (b - a) / 300, value: slice }, (v) => { slice = v; update(); });
  if (method !== 'shell') slider(controls, 'view tilt', { min: 0.05, max: 0.8, step: 0.01, value: tilt }, (v) => { tilt = v; update(); });
  else slider(controls, 'view tilt', { min: 0.05, max: 0.6, step: 0.01, value: tilt }, (v) => { tilt = v; update(); });
  if (method !== 'shell') slider(controls, 'number of slabs', { min: 0, max: 40, step: 1, value: 0 }, (v) => { nSlices = v; update(); }, (v) => (v ? String(v) : 'smooth'));
  animator(controls, { from: a, to: b, duration: 5000, onFrame: (v) => s.set(v), label: 'Sweep slice' });
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => draw()).observe(canvasWrap);
  update();
};

// Arc length as limit of polygon lengths.
WIDGETS.arclength = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const f = compile(cfg.f);
  const a = cfg.a, b = cfg.b;
  let n = 2;
  const exact = quad((x) => Math.sqrt(1 + numDeriv(f, x) ** 2), a, b);
  const p = makePlot(stage, cfg);
  p.onDraw((pl) => {
    pl.fn(f, { color: col.a, width: 2, alpha: 0.6 });
    const xs = [], ys = [];
    for (let k = 0; k <= n; k++) { const x = a + (b - a) * k / n; xs.push(x); ys.push(f(x)); }
    pl.polyline(xs, ys, { color: col.b, width: 2.5 });
    xs.forEach((x, k) => pl.point(x, ys[k], { r: 3, color: col.b }));
  });
  const update = () => {
    let L = 0; for (let k = 0; k < n; k++) { const x0 = a + (b - a) * k / n, x1 = a + (b - a) * (k + 1) / n; L += Math.hypot(x1 - x0, f(x1) - f(x0)); }
    p.redraw();
    setReadout(readout, `Polygon with $n=${n}$ segments: length $${fmtNum(L, 6)}$. &nbsp; Arc length $\\int_a^b\\sqrt{1+f'(x)^2}\\,dx = ${cfg.exactTex || fmtNum(exact, 6)}$.`);
  };
  const s = slider(controls, '$n$', { min: 1, max: 64, step: 1, value: n }, (v) => { n = v; update(); }, String);
  animator(controls, { from: 1, to: 64, duration: 5000, onFrame: (v) => s.set(Math.round(v)), label: 'Refine' });
  update();
};

// Integration by parts as areas: ∫u dv + ∫v du = [uv].
WIDGETS.parts = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const U = compile(cfg.u, ['t']), V = compile(cfg.v, ['t']);
  const t0 = cfg.t0 ?? 0, t1 = cfg.t1 ?? 1;
  let t = t1;
  const p = makePlot(stage, { xlim: cfg.ulim || [0, U(t1) * 1.2], ylim: cfg.vlim || [0, V(t1) * 1.2], xlabel: 'u', ylabel: 'v', ...cfg });
  p.onDraw((pl) => {
    const N = 200, pts = [];
    for (let k = 0; k <= N; k++) { const s = t0 + (t - t0) * k / N; pts.push([U(s), V(s)]); }
    // ∫ v du : region between curve and u-axis
    pl.fillPoly(pts.concat([[pts[pts.length - 1][0], 0], [pts[0][0], 0]]), { color: col.a, alpha: 0.3 });
    // ∫ u dv : region between curve and v-axis
    pl.fillPoly(pts.concat([[0, pts[pts.length - 1][1]], [0, pts[0][1]]]), { color: col.b, alpha: 0.3 });
    const all = []; for (let k = 0; k <= N; k++) { const s = t0 + (t1 - t0) * k / N; all.push([U(s), V(s)]); }
    pl.polyline(all.map((q) => q[0]), all.map((q) => q[1]), { color: col.muted, width: 1, dash: [4, 4] });
    pl.polyline(pts.map((q) => q[0]), pts.map((q) => q[1]), { color: col.c, width: 3 });
    pl.point(U(t), V(t), { color: col.c });
  });
  const update = () => {
    const vdu = quad((s) => V(s) * numDeriv(U, s), t0, t), udv = quad((s) => U(s) * numDeriv(V, s), t0, t);
    const uv = U(t) * V(t) - U(t0) * V(t0);
    p.redraw();
    setReadout(readout, `Blue $\\int v\\,du = ${fmtNum(vdu)}$, orange $\\int u\\,dv = ${fmtNum(udv)}$, sum $= ${fmtNum(vdu + udv)}$ and $[uv] = ${fmtNum(uv)}$. So $\\int u\\,dv = [uv] - \\int v\\,du$.`);
  };
  const s = slider(controls, 'parameter $t$', { min: t0 + 1e-3, max: t1, step: (t1 - t0) / 300, value: t }, (v) => { t = v; update(); });
  animator(controls, { from: t0 + 1e-3, to: t1, duration: 5000, onFrame: (v) => s.set(v), label: 'Grow' });
  update();
};

// Trig substitution triangle: x = a sinθ (or tanθ / secθ).
WIDGETS.trigsub = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const a = cfg.a ?? 1;
  const kind = cfg.kind || 'sin';
  let th = 0.6;
  const p = new Plot(stage, { height: 320, axisEqual: true, grid: false });
  p.setView(-0.3 * a, 2.2 * a, -0.3 * a, 1.6 * a);
  p.onDraw((pl) => {
    let A, B, Cpt, labels;
    if (kind === 'sin') { // hyp a, opposite x, adjacent sqrt(a^2-x^2)
      const x = a * Math.sin(th), adj = a * Math.cos(th);
      A = [0, 0]; B = [adj, 0]; Cpt = [adj, x];
      labels = [`${fmtNum(a, 2)} (hyp)`, `x = ${fmtNum(x, 3)}`, `√(a²−x²) = ${fmtNum(adj, 3)}`];
    } else if (kind === 'tan') { // adjacent a, opposite x, hyp sqrt(a^2+x^2)
      const x = a * Math.tan(th);
      A = [0, 0]; B = [a, 0]; Cpt = [a, x];
      labels = [`√(a²+x²) = ${fmtNum(Math.hypot(a, x), 3)}`, `x = ${fmtNum(x, 3)}`, `a = ${fmtNum(a, 2)}`];
    } else { // sec: hyp x, adjacent a, opposite sqrt(x^2-a^2)
      const x = a / Math.cos(th);
      A = [0, 0]; B = [a, 0]; Cpt = [a, Math.sqrt(x * x - a * a)];
      labels = [`x = ${fmtNum(x, 3)} (hyp)`, `√(x²−a²) = ${fmtNum(Cpt[1], 3)}`, `a = ${fmtNum(a, 2)}`];
    }
    pl.fillPoly([A, B, Cpt], { color: col.a, alpha: 0.15, stroke: col.a, strokeWidth: 2 });
    pl.text((A[0] + Cpt[0]) / 2 - 0.1 * a, (A[1] + Cpt[1]) / 2 + 0.06 * a, labels[0], { align: 'right', color: col.a });
    pl.text(B[0] + 0.05 * a, (B[1] + Cpt[1]) / 2, labels[1], { color: col.b });
    pl.text((A[0] + B[0]) / 2, -0.12 * a, labels[2], { align: 'center', color: col.c });
    pl.text(0.18 * a, 0.05 * a, 'θ', { color: col.d, font: '16px serif' });
  });
  const update = () => {
    p.redraw();
    const f = { sin: `x = a\\sin\\theta,\\; dx = a\\cos\\theta\\,d\\theta,\\; \\sqrt{a^2-x^2} = a\\cos\\theta`, tan: `x = a\\tan\\theta,\\; dx = a\\sec^2\\theta\\,d\\theta,\\; \\sqrt{a^2+x^2} = a\\sec\\theta`, sec: `x = a\\sec\\theta,\\; dx = a\\sec\\theta\\tan\\theta\\,d\\theta,\\; \\sqrt{x^2-a^2} = a\\tan\\theta` }[kind];
    setReadout(readout, `$\\theta = ${fmtNum(th, 3)}$ rad. &nbsp; $${f}$. Read every trig ratio straight off the triangle when you substitute back.`);
  };
  slider(controls, '$\\theta$', { min: 0.05, max: 1.4, step: 0.005, value: th }, (v) => { th = v; update(); });
  update();
};

// Partial fractions: individual terms add up to the rational function.
WIDGETS.partialFractions = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const terms = cfg.terms.map((t, i) => ({ ...t, fn: compile(t.expr), color: PALETTE[(i + 1) % PALETTE.length], on: true }));
  const total = compile(cfg.f);
  const p = makePlot(stage, cfg);
  let showSum = true;
  p.onDraw((pl) => {
    terms.forEach((t) => { if (t.on) pl.fn(t.fn, { color: t.color, width: 1.6, dash: [6, 4] }); });
    if (showSum) pl.fn((x) => terms.reduce((s, t) => s + t.fn(x), 0), { color: col.c, width: 4, alpha: 0.5 });
    pl.fn(total, { color: col.a, width: 2 });
    (cfg.asymptotes || []).forEach((x) => pl.vline(x));
  });
  terms.forEach((t) => toggle(controls, t.label || t.expr, true, (v) => { t.on = v; p.redraw(); }));
  toggle(controls, 'sum of terms (thick)', true, (v) => { showSum = v; p.redraw(); });
  setReadout(readout, cfg.readout || 'The thick curve (sum of the dashed terms) lies exactly on the original rational function: the decomposition is an identity.');
};

// Improper integrals: push the limit to infinity (or to the singularity).
WIDGETS.improper = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const f = compile(cfg.f);
  const a = cfg.a;
  const singular = cfg.singular || 'infinite'; // 'infinite' | 'lower' | 'upper'
  const b = cfg.b;
  const tMin = singular === 'infinite' ? a + 0.1 : singular === 'lower' ? a + 1e-6 : a + 0.1;
  const tMax = singular === 'infinite' ? (cfg.tmax || 50) : singular === 'lower' ? b - 0.01 : b - 1e-6;
  let t = singular === 'lower' ? (a + b) / 2 : singular === 'upper' ? (a + b) / 2 : 3;
  const I = (tt) => (singular === 'lower' ? quad(f, tt, b) : quad(f, a, tt));
  const top = makePlot(stage, cfg, 240);
  const hist = [];
  const tparam = (s) => (singular === 'infinite' ? tMin * (tMax / tMin) ** s : singular === 'lower' ? b - (b - a) * (1e-6 / (b - a)) ** (1 - s) * 0 - (b - a) * Math.pow(10, -6 * s) + (b - a) * 0 : a + (b - a) * (1 - Math.pow(10, -6 * s)));
  const bot = new Plot(stage, { height: 180, xlabel: singular === 'infinite' ? 't' : 'ε (log scale)', ylabel: 'integral' });
  top.onDraw((pl) => {
    if (singular === 'lower') pl.fillBetween(f, null, t, b, { signed: true, color: col.a });
    else pl.fillBetween(f, null, a, t, { signed: true, color: col.a });
    pl.fn(f, { color: col.a, width: 2.5 });
    pl.vline(t, { color: col.b });
  });
  const update = () => {
    const v = I(t);
    hist.push([singular === 'infinite' ? t : Math.log10(Math.abs(singular === 'lower' ? t - a : b - t)), v]);
    hist.sort((p1, p2) => p1[0] - p2[0]);
    const ys = hist.map((q) => q[1]);
    const xs = hist.map((q) => q[0]);
    bot.setView(Math.min(...xs, singular === 'infinite' ? 0 : -6), Math.max(...xs, singular === 'infinite' ? 10 : 0), Math.min(0, ...ys) - 0.5, Math.max(0, ...ys) + 0.5);
    bot.onDraw((pl) => { pl.polyline(xs, ys, { color: col.c, width: 2.5 }); if (cfg.value !== undefined) pl.hline(cfg.value, { color: col.c }); });
    top.redraw();
    const lab = singular === 'lower' ? `\\int_{${fmtNum(t, 6)}}^{${fmtNum(b)}}` : `\\int_{${fmtNum(a)}}^{${fmtNum(t, 6)}}`;
    setReadout(readout, `$${lab} f(x)\\,dx = ${fmtNum(v, 6)}$${cfg.value !== undefined ? ` &nbsp;→&nbsp; limit $${cfg.valueTex || fmtNum(cfg.value, 6)}$` : cfg.diverges ? ' &nbsp; (keeps growing: diverges)' : ''}`);
  };
  void tparam;
  const s = slider(controls, singular === 'infinite' ? 'upper limit $t$' : 'cut-off $t$', { min: 0, max: 1, step: 0.001, value: 0.3 }, (v) => {
    t = singular === 'infinite' ? tMin * (tMax / tMin) ** v : singular === 'lower' ? a + (b - a) * Math.pow(10, -6 * v) : b - (b - a) * Math.pow(10, -6 * v);
    update();
  }, () => fmtNum(t, 6));
  animator(controls, { from: 0, to: 1, duration: 6000, onFrame: (v) => s.set(v), label: singular === 'infinite' ? 't → ∞' : 't → singularity' });
  s.set(0.3);
};

// Slope field with click-to-draw solution curves (RK4).
WIDGETS.slopefield = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const params = cfg.params || {};
  const names = Object.keys(params);
  const vals = Object.fromEntries(names.map((k) => [k, params[k].value]));
  const F = compile(cfg.F, ['x', 'y', ...names]);
  const sol = cfg.solution ? compile(cfg.solution, ['x', 'C', ...names]) : null;
  const curves = (cfg.initial || []).map((q) => ({ x0: q[0], y0: q[1] }));
  const p = makePlot(stage, cfg);
  const arg = () => names.map((k) => vals[k]);
  const integrateCurve = (x0, y0) => {
    const out = [[], []];
    const v = p.view;
    const hstep = (v.x1 - v.x0) / 600;
    for (const dir of [-1, 1]) {
      let x = x0, y = y0;
      const xs = [x], ys = [y];
      for (let k = 0; k < 1200; k++) {
        const g = (xx, yy) => F(xx, yy, ...arg());
        const hh = dir * hstep;
        const k1 = g(x, y), k2 = g(x + hh / 2, y + hh / 2 * k1), k3 = g(x + hh / 2, y + hh / 2 * k2), k4 = g(x + hh, y + hh * k3);
        y += hh / 6 * (k1 + 2 * k2 + 2 * k3 + k4); x += hh;
        if (!Number.isFinite(y) || x < v.x0 || x > v.x1 || y < v.y0 - (v.y1 - v.y0) || y > v.y1 + (v.y1 - v.y0)) break;
        xs.push(x); ys.push(y);
      }
      if (dir < 0) { out[0].push(...xs.reverse()); out[1].push(...ys.reverse()); } else { out[0].push(...xs.slice(1)); out[1].push(...ys.slice(1)); }
    }
    return out;
  };
  p.onDraw((pl) => {
    pl.slopeField((x, y) => F(x, y, ...arg()), { nx: cfg.nx || 24, ny: cfg.ny || 18 });
    (cfg.hlines || []).forEach((y) => pl.hline(typeof y === 'string' ? compile(y, names)(...arg()) : y, { color: col.d, dash: [6, 4], width: 1.5 }));
    curves.forEach((c, i) => {
      const [xs, ys] = integrateCurve(c.x0, c.y0);
      pl.polyline(xs, ys, { color: PALETTE[i % PALETTE.length], width: 2.5 });
      pl.point(c.x0, c.y0, { r: 4, color: PALETTE[i % PALETTE.length] });
    });
    if (sol && cfg.showFamily) for (let Cc = -3; Cc <= 3; Cc += 1) pl.fn((x) => sol(x, Cc, ...arg()), { color: col.muted, width: 1, dash: [3, 3] });
  });
  p.onPointer((ev) => {
    if (ev.type !== 'down') return;
    curves.push({ x0: ev.x, y0: ev.y });
    if (curves.length > 7) curves.shift();
    p.redraw();
    setReadout(readout, `Solution through $(${fmtNum(ev.x, 3)}, ${fmtNum(ev.y, 3)})$ drawn by following the arrows (RK4). Click elsewhere to add more initial points.`);
  });
  names.forEach((k) => {
    const pr = params[k];
    slider(controls, pr.label || `$${k}$`, { min: pr.min, max: pr.max, step: pr.step || (pr.max - pr.min) / 200, value: vals[k] }, (v) => { vals[k] = v; p.redraw(); });
  });
  button(controls, 'Clear curves', () => { curves.length = 0; p.redraw(); });
  setReadout(readout, cfg.hint || 'Click anywhere in the plot to start a solution curve at that initial point. The curve is tangent to every short segment it passes.');
};

// Euler's method vs exact solution.
WIDGETS.euler = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const F = compile(cfg.F, ['x', 'y']);
  const exact = cfg.exact ? compile(cfg.exact) : null;
  const x0 = cfg.x0 ?? 0, y0 = cfg.y0 ?? 1, xe = cfg.xEnd ?? 2;
  let n = 4;
  const p = makePlot(stage, cfg);
  const run = () => { const hh = (xe - x0) / n; const xs = [x0], ys = [y0]; for (let k = 0; k < n; k++) { ys.push(ys[k] + hh * F(xs[k], ys[k])); xs.push(xs[k] + hh); } return [xs, ys]; };
  p.onDraw((pl) => {
    pl.slopeField(F, { nx: 18, ny: 12 });
    if (exact) pl.fn(exact, { color: col.c, width: 2.5, from: x0, to: xe });
    const [xs, ys] = run();
    pl.polyline(xs, ys, { color: col.b, width: 2 });
    xs.forEach((x, k) => pl.point(x, ys[k], { r: 3, color: col.b }));
  });
  const update = () => { const [, ys] = run(); p.redraw(); setReadout(readout, `Euler with $h = ${fmtNum((xe - x0) / n)}$ gives $y(${fmtNum(xe)}) \\approx ${fmtNum(ys[n], 6)}$${exact ? `; exact $${fmtNum(exact(xe), 6)}$, error $${fmtNum(exact(xe) - ys[n], 6)}$ (halving $h$ roughly halves the error)` : ''}.`); };
  const s = slider(controls, 'steps $n$', { min: 1, max: 100, step: 1, value: n }, (v) => { n = v; update(); }, String);
  animator(controls, { from: 1, to: 100, duration: 6000, onFrame: (v) => s.set(Math.round(v)), label: 'More steps' });
  update();
};

// Generic ODE solution with parameter sliders (first order or second order).
// cfg: { F:'expr in t,y' (first order) or F2:'expr in t,y,v' (y''), params, y0, v0, tspan, ylim, exact, hlines, slopeField }
WIDGETS.ode = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const params = cfg.params || {};
  const names = Object.keys(params);
  const vals = Object.fromEntries(names.map((k) => [k, params[k].value]));
  const second = !!cfg.F2;
  const F = compile(second ? cfg.F2 : cfg.F, second ? ['t', 'y', 'v', ...names] : ['t', 'y', ...names]);
  const exact = cfg.exact ? compile(cfg.exact, ['t', ...names]) : null;
  const [t0, t1] = cfg.tspan || [0, 10];
  const p = makePlot(stage, { xlim: [t0, t1], ...cfg });
  const arg = () => names.map((k) => vals[k]);
  const ev = (v) => (typeof v === 'string' ? compile(v, names)(...arg()) : v);
  const solve = () => {
    const N = 800, hh = (t1 - t0) / N;
    let t = t0, y = ev(cfg.y0 ?? 0), v = ev(cfg.v0 ?? 0);
    const ts = [t], ys = [y];
    for (let k = 0; k < N; k++) {
      if (second) {
        const f = (tt, yy, vv) => [vv, F(tt, yy, vv, ...arg())];
        const k1 = f(t, y, v), k2 = f(t + hh / 2, y + hh / 2 * k1[0], v + hh / 2 * k1[1]), k3 = f(t + hh / 2, y + hh / 2 * k2[0], v + hh / 2 * k2[1]), k4 = f(t + hh, y + hh * k3[0], v + hh * k3[1]);
        y += hh / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); v += hh / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
      } else {
        const g = (tt, yy) => F(tt, yy, ...arg());
        const k1 = g(t, y), k2 = g(t + hh / 2, y + hh / 2 * k1), k3 = g(t + hh / 2, y + hh / 2 * k2), k4 = g(t + hh, y + hh * k3);
        y += hh / 6 * (k1 + 2 * k2 + 2 * k3 + k4);
      }
      t += hh;
      ts.push(t); ys.push(y);
    }
    return [ts, ys];
  };
  let cache = solve();
  p.onDraw((pl) => {
    if (cfg.slopeField && !second) pl.slopeField((t, y) => F(t, y, ...arg()), { nx: 22, ny: 14 });
    (cfg.hlines || []).forEach((y) => pl.hline(ev(y), { color: col.d, dash: [6, 4], width: 1.5 }));
    if (exact) pl.fn((t) => exact(t, ...arg()), { color: col.c, width: 5, alpha: 0.35 });
    pl.polyline(cache[0], cache[1], { color: col.a, width: 2.5 });
  });
  const update = () => {
    cache = solve();
    p.redraw();
    if (cfg.readout) setReadout(readout, cfg.readout.replace(/\{\{([^}]+)\}\}/g, (_, ex) => {
      if (ex.trim() === 'yEnd') return fmtNum(cache[1][cache[1].length - 1]);
      if (ex.trim() === 'yMax') return fmtNum(Math.max(...cache[1]));
      if (ex.trim() === 'yMin') return fmtNum(Math.min(...cache[1]));
      return fmtNum(compile(ex, names)(...arg()));
    }));
  };
  names.forEach((k) => {
    const pr = params[k];
    slider(controls, pr.label || `$${k}$`, { min: pr.min, max: pr.max, step: pr.step || (pr.max - pr.min) / 200, value: vals[k] }, (v) => { vals[k] = v; update(); });
  });
  update();
};

// Mass-spring-damper animation with x(t).
WIDGETS.spring = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  let m = cfg.m ?? 1, c = cfg.c ?? 0.5, k = cfg.k ?? 4;
  const x0 = cfg.x0 ?? 1, v0 = cfg.v0 ?? 0;
  const forcing = cfg.force ? compile(cfg.force, ['t']) : () => 0;
  const T = cfg.T ?? 20;
  const row = h('div', { class: 'widget-row spring-row' });
  stage.appendChild(row);
  const cv = h('canvas', { class: 'spring-canvas', width: 120, height: 300 });
  const right = h('div');
  row.append(cv, right);
  const p = new Plot(right, { height: 300, xlabel: 't', ylabel: 'x' });
  let sol = null, tNow = 0, raf = null;
  const solve = () => {
    const N = 2000, hh = T / N;
    let x = x0, v = v0, t = 0;
    const ts = [0], xs = [x];
    const f = (tt, xx, vv) => [vv, (forcing(tt) - c * vv - k * xx) / m];
    for (let i = 0; i < N; i++) {
      const k1 = f(t, x, v), k2 = f(t + hh / 2, x + hh / 2 * k1[0], v + hh / 2 * k1[1]), k3 = f(t + hh / 2, x + hh / 2 * k2[0], v + hh / 2 * k2[1]), k4 = f(t + hh, x + hh * k3[0], v + hh * k3[1]);
      x += hh / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); v += hh / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]); t += hh;
      ts.push(t); xs.push(x);
    }
    return [ts, xs];
  };
  const xAt = (t) => { const i = Math.min(sol[0].length - 1, Math.round(t / T * (sol[0].length - 1))); return sol[1][i]; };
  const drawSpring = () => {
    const ctx = cv.getContext('2d');
    const W = 120, H = 300, dpr = window.devicePixelRatio || 1;
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = css('--plot-bg', '#fff'); ctx.fillRect(0, 0, W, H);
    const amp = Math.max(...sol[1].map(Math.abs)) || 1;
    const x = xAt(tNow);
    const eq = 170, y = eq + x / amp * 80;
    ctx.fillStyle = col.muted; ctx.fillRect(20, 8, 80, 6);
    ctx.strokeStyle = col.a; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(60, 14);
    const coils = 12;
    for (let i = 1; i <= coils; i++) ctx.lineTo(60 + (i % 2 ? 14 : -14), 14 + (y - 34) * i / coils);
    ctx.lineTo(60, y - 20); ctx.stroke();
    ctx.fillStyle = col.b; ctx.fillRect(35, y - 20, 50, 40);
    ctx.setLineDash([4, 4]); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(5, eq); ctx.lineTo(115, eq); ctx.stroke(); ctx.setLineDash([]);
  };
  const update = () => {
    sol = solve();
    const ys = sol[1];
    const lim = Math.max(...ys.map(Math.abs)) * 1.15 || 1;
    p.setView(0, T, -lim, lim);
    p.onDraw((pl) => {
      pl.polyline(sol[0], sol[1], { color: col.a, width: 2.2 });
      pl.vline(tNow, { color: col.b });
      pl.point(tNow, xAt(tNow), { color: col.b });
    });
    drawSpring();
    const disc = c * c - 4 * m * k;
    const kind = Math.abs(disc) < 1e-9 ? 'critically damped' : disc > 0 ? 'overdamped' : c === 0 ? 'undamped (simple harmonic)' : 'underdamped';
    setReadout(readout, `$m x'' + c x' + k x = ${cfg.forceTex || (cfg.force ? 'F(t)' : '0')}$: characteristic equation $m r^2 + c r + k = 0$ has discriminant $c^2-4mk = ${fmtNum(disc)}$ → <b>${kind}</b>. Max $|x| = ${fmtNum(Math.max(...ys.map(Math.abs)))}$.`);
  };
  slider(controls, 'mass $m$', { min: 0.1, max: 10, step: 0.05, value: m }, (v) => { m = v; update(); });
  slider(controls, 'damping $c$', { min: 0, max: 10, step: 0.05, value: c }, (v) => { c = v; update(); });
  slider(controls, 'stiffness $k$', { min: 0.1, max: 20, step: 0.05, value: k }, (v) => { k = v; update(); });
  const play = button(controls, '▶ Play', () => {
    if (raf) { cancelAnimationFrame(raf); raf = null; play.textContent = '▶ Play'; return; }
    const start = performance.now() - tNow / T * 8000;
    play.textContent = '❚❚ Pause';
    const tick = (now) => {
      if (!cv.isConnected) return;
      tNow = ((now - start) / 8000 % 1) * T;
      p.redraw(); drawSpring();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  });
  update();
};

// Sequences: points a_n with an epsilon band around the limit.
WIDGETS.sequence = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const nmax = cfg.nmax || 40;
  const vals = [];
  if (cfg.recursive) {
    const next = compile(cfg.recursive.next, ['a', 'n']);
    vals.push(cfg.recursive.a1);
    for (let n = 2; n <= nmax; n++) vals.push(next(vals[n - 2], n));
  } else {
    const a = compile(cfg.a, ['n']);
    for (let n = 1; n <= nmax; n++) vals.push(a(n));
  }
  const L = cfg.L;
  let eps = cfg.eps || 0.2;
  const finite = vals.filter(Number.isFinite);
  const yl = cfg.ylim || [Math.min(...finite, L ?? Infinity) - 0.3, Math.max(...finite, L ?? -Infinity) + 0.3];
  const p = new Plot(stage, { height: 300, xlabel: 'n' });
  p.setView(0, nmax + 1, yl[0], yl[1]);
  const Nfor = () => { if (L === undefined) return null; for (let n = nmax; n >= 1; n--) if (Math.abs(vals[n - 1] - L) >= eps) return n + 1; return 1; };
  p.onDraw((pl) => {
    if (L !== undefined) {
      pl.fillPoly([[0, L - eps], [nmax + 1, L - eps], [nmax + 1, L + eps], [0, L + eps]], { color: col.c, alpha: 0.15 });
      pl.hline(L, { color: col.c, dash: [] });
      const N = Nfor();
      if (N && N <= nmax) pl.vline(N, { color: col.b });
    }
    vals.forEach((v, i) => pl.point(i + 1, v, { r: 3.5, color: L !== undefined && Math.abs(v - L) < eps ? col.c : col.a }));
  });
  const update = () => {
    p.redraw();
    const N = Nfor();
    setReadout(readout, L !== undefined ? `With $\\varepsilon = ${fmtNum(eps)}$, all terms from $N = ${N}$ on stay inside the band $|a_n - L| < \\varepsilon$ (around $L = ${cfg.Ltex || fmtNum(L)}$). Shrink $\\varepsilon$: some $N$ always exists, which is exactly the definition of convergence.` : `First terms: ${vals.slice(0, 8).map((v) => fmtNum(v)).join(', ')}, …`);
  };
  if (L !== undefined) {
    const s = slider(controls, '$\\varepsilon$', { min: 0.001, max: 1, step: 0.001, value: eps }, (v) => { eps = v; update(); });
    animator(controls, { from: 1, to: 0.005, duration: 5000, onFrame: (v) => s.set(v), label: 'Shrink ε' });
  }
  update();
};

// Series: terms and partial sums; optional integral-test picture and alternating remainder band.
WIDGETS.series = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const a = compile(cfg.term, ['n']);
  const n0 = cfg.n0 ?? 1;
  const nmax = cfg.nmax || 30;
  let N = cfg.N ?? 5;
  const terms = [], partial = [];
  let s = 0;
  for (let n = n0; n <= n0 + nmax; n++) { const t = a(n); terms.push(t); s += t; partial.push(s); }
  const S = cfg.sum;
  const top = new Plot(stage, { height: 220, xlabel: 'n', ylabel: cfg.integralTest ? 'f(x), aₙ' : 'aₙ' });
  const tys = terms.filter(Number.isFinite);
  top.setView(n0 - 0.5, n0 + Math.min(nmax, cfg.view || nmax) + 0.5, Math.min(0, ...tys) - 0.05, Math.max(0, ...tys) * 1.1 + 0.05);
  const fx = cfg.integralTest ? compile(cfg.integralTest, ['x']) : null;
  top.onDraw((pl) => {
    terms.forEach((t, i) => {
      const n = n0 + i;
      if (fx) pl.rect(n, 0, n + 1, t, { color: i < N ? col.a : col.muted, alpha: i < N ? 0.35 : 0.12 });
      else pl.segment(n, 0, n, t, { color: i < N ? col.a : col.muted, width: 3 });
    });
    if (fx) pl.fn(fx, { color: col.b, width: 2.5, from: n0 - 0.5 });
  });
  const bot = new Plot(stage, { height: 220, xlabel: 'N', ylabel: 'S_N' });
  const pys = partial.filter(Number.isFinite);
  bot.setView(n0 - 0.5, n0 + nmax + 0.5, Math.min(0, ...pys, S ?? 0) - 0.1, Math.max(...pys, S ?? 0) * 1.05 + 0.1);
  bot.onDraw((pl) => {
    if (S !== undefined) pl.hline(S, { color: col.c, dash: [] });
    if (cfg.alternating && N < partial.length) {
      const sN = partial[N - 1], b = Math.abs(terms[N]);
      pl.fillPoly([[n0 - 0.5, sN - b], [n0 + nmax + 0.5, sN - b], [n0 + nmax + 0.5, sN + b], [n0 - 0.5, sN + b]], { color: col.d, alpha: 0.15 });
    }
    partial.forEach((v, i) => pl.point(n0 + i, v, { r: 3.5, color: i < N ? col.a : col.muted }));
  });
  const update = () => {
    top.redraw(); bot.redraw();
    const sN = partial[N - 1];
    let extra = '';
    if (S !== undefined) extra += ` &nbsp; Sum $S = ${cfg.sumTex || fmtNum(S, 8)}$, remainder $R_N = S - S_N = ${fmtNum(S - sN, 6)}$.`;
    if (cfg.alternating) extra += ` &nbsp; Alternating series bound: $|R_N| \\le |a_{N+1}| = ${fmtNum(Math.abs(terms[N]), 6)}$ (purple band).`;
    if (fx) extra += ` &nbsp; Integral test bounds: $\\int_{N+1}^{\\infty} f \\le R_N \\le \\int_N^{\\infty} f$.`;
    setReadout(readout, `Partial sum $S_{${N}} = \\sum_{n=${n0}}^{${n0 + N - 1}} a_n = ${fmtNum(sN, 8)}$.${extra}`);
  };
  const sl = slider(controls, 'terms $N$', { min: 1, max: nmax, step: 1, value: N }, (v) => { N = v; update(); }, String);
  animator(controls, { from: 1, to: nmax, duration: 6000, onFrame: (v) => sl.set(Math.round(v)), label: 'Add terms' });
  update();
};

// Taylor polynomials converging to f; optional radius of convergence.
// cfg: { f, coef:'expr in k' (Taylor coefficient c_k about a), a, nmax, xlim, ylim, R, at }
WIDGETS.taylor = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const f = compile(cfg.f);
  const c = compile(cfg.coef, ['k']);
  const a = cfg.a ?? 0;
  const nmax = cfg.nmax || 15;
  const coefs = Array.from({ length: nmax + 1 }, (_, k) => c(k));
  let n = cfg.n ?? 1;
  const P = (x, deg) => { let s = 0, pw = 1; for (let k = 0; k <= deg; k++) { s += coefs[k] * pw; pw *= (x - a); } return s; };
  const p = makePlot(stage, cfg);
  const at = cfg.at;
  p.onDraw((pl) => {
    if (cfg.R !== undefined && Number.isFinite(cfg.R)) {
      pl.fillPoly([[a - cfg.R, pl.view.y0], [a + cfg.R, pl.view.y0], [a + cfg.R, pl.view.y1], [a - cfg.R, pl.view.y1]], { color: col.c, alpha: 0.08 });
      pl.vline(a - cfg.R, { color: col.c }); pl.vline(a + cfg.R, { color: col.c });
    }
    pl.fn(f, { color: col.a, width: 3 });
    for (let d = 0; d < n; d++) pl.fn((x) => P(x, d), { color: col.muted, width: 1, alpha: 0.35 });
    pl.fn((x) => P(x, n), { color: col.b, width: 2.5 });
    pl.point(a, f(a), { color: col.a, r: 4 });
    if (at !== undefined) { pl.vline(at, { color: col.d }); pl.point(at, P(at, n), { color: col.b, r: 4 }); }
  });
  const update = () => {
    p.redraw();
    let msg = `Degree $n = ${n}$: $P_n(x) = \\sum_{k=0}^{n} c_k (x-${fmtNum(a)})^k$.`;
    if (at !== undefined) msg += ` &nbsp; At $x = ${fmtNum(at)}$: $P_n = ${fmtNum(P(at, n), 8)}$, $f = ${fmtNum(f(at), 8)}$, error $${fmtNum(f(at) - P(at, n), 4)}$.`;
    if (cfg.R !== undefined) msg += ` &nbsp; Radius of convergence $R = ${cfg.Rtex || fmtNum(cfg.R)}$ (green band): outside it the polynomials peel away no matter how large $n$ gets.`;
    setReadout(readout, msg);
  };
  const s = slider(controls, 'degree $n$', { min: 0, max: nmax, step: 1, value: n }, (v) => { n = v; update(); }, String);
  animator(controls, { from: 0, to: nmax, duration: 7000, onFrame: (v) => s.set(Math.round(v)), label: 'Raise degree' });
  update();
};

// Unit circle -> sin / cos graphs.
WIDGETS.unitcircle = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  let th = 0.8;
  const row = h('div', { class: 'widget-row' });
  stage.appendChild(row);
  const L = h('div'), R = h('div');
  row.append(L, R);
  const pc = new Plot(L, { height: 260, axisEqual: true });
  pc.setView(-1.4, 1.4, -1.4, 1.4);
  const pg = new Plot(R, { height: 260 });
  pg.setView(0, 2 * Math.PI, -1.4, 1.4);
  pc.onDraw((pl) => {
    pl.fn((x) => Math.sqrt(Math.max(0, 1 - x * x)), { color: col.muted, width: 1.5, from: -1, to: 1, samples: 400 });
    pl.fn((x) => -Math.sqrt(Math.max(0, 1 - x * x)), { color: col.muted, width: 1.5, from: -1, to: 1, samples: 400 });
    const cx = Math.cos(th), sy = Math.sin(th);
    pl.segment(0, 0, cx, sy, { color: col.d, width: 2 });
    pl.segment(cx, 0, cx, sy, { color: col.a, width: 3 });
    pl.segment(0, 0, cx, 0, { color: col.b, width: 3 });
    pl.point(cx, sy, { color: col.d });
  });
  pg.onDraw((pl) => {
    pl.fn(Math.sin, { color: col.a, width: 2.5, to: th });
    pl.fn(Math.cos, { color: col.b, width: 2.5, to: th });
    pl.fn(Math.sin, { color: col.a, width: 1, alpha: 0.25 });
    pl.fn(Math.cos, { color: col.b, width: 1, alpha: 0.25 });
    pl.point(th, Math.sin(th), { color: col.a }); pl.point(th, Math.cos(th), { color: col.b });
  });
  const update = () => { pc.redraw(); pg.redraw(); setReadout(readout, `$\\theta = ${fmtNum(th, 3)}$ rad $= ${fmtNum(th * 180 / Math.PI, 1)}^\\circ$: &nbsp; <span style="color:${col.a}">$\\sin\\theta = ${fmtNum(Math.sin(th))}$</span> (height), <span style="color:${col.b}">$\\cos\\theta = ${fmtNum(Math.cos(th))}$</span> (width).`); };
  const s = slider(controls, '$\\theta$', { min: 0, max: 2 * Math.PI, step: 0.005, value: th }, (v) => { th = v; update(); });
  animator(controls, { from: 0, to: 2 * Math.PI, duration: 6000, onFrame: (v) => s.set(v), label: 'Rotate' });
  update();
};

// Rotating phasors and the sinusoids they generate (electrical engineering).
// cfg: { phasors:[{amp, phase (degrees), label, color}], omega (rad/s, default 2π), showSum, T (seconds shown) }
WIDGETS.phasor = (container, cfg) => {
  const { stage, controls, readout } = frame(container, cfg);
  const ph = (cfg.phasors || [{ amp: 1, phase: 0, label: 'V' }]).map((p, i) => ({ ...p, color: p.color || PALETTE[i % PALETTE.length] }));
  const omega = cfg.omega ?? 2 * Math.PI;
  const T = cfg.T ?? 2 * (2 * Math.PI / omega);
  let t = 0, showSum = cfg.showSum ?? ph.length > 1;
  const row = h('div', { class: 'widget-row' });
  stage.appendChild(row);
  const L = h('div'), R = h('div');
  row.append(L, R);
  const amax = Math.max(...ph.map((p) => p.amp), showSum ? Math.hypot(ph.reduce((s, p) => s + p.amp * Math.cos(p.phase * Math.PI / 180), 0), ph.reduce((s, p) => s + p.amp * Math.sin(p.phase * Math.PI / 180), 0)) : 0) * 1.2 || 1;
  const pc = new Plot(L, { height: 280, axisEqual: true, xlabel: 'Re', ylabel: 'Im' });
  pc.setView(-amax, amax, -amax, amax);
  const pg = new Plot(R, { height: 280, xlabel: 't' });
  pg.setView(0, T, -amax, amax);
  const sumRe = () => ph.reduce((s, p) => s + p.amp * Math.cos(omega * t + p.phase * Math.PI / 180), 0);
  const sumIm = () => ph.reduce((s, p) => s + p.amp * Math.sin(omega * t + p.phase * Math.PI / 180), 0);
  pc.onDraw((pl) => {
    const rc = amax / 1.2;
    pl.fn((x) => Math.sqrt(Math.max(0, rc * rc - x * x)), { color: col.muted, width: 0.6, alpha: 0.4, from: -rc, to: rc, samples: 400 });
    pl.fn((x) => -Math.sqrt(Math.max(0, rc * rc - x * x)), { color: col.muted, width: 0.6, alpha: 0.4, from: -rc, to: rc, samples: 400 });
    let ox = 0, oy = 0;
    ph.forEach((p) => {
      const ang = omega * t + p.phase * Math.PI / 180;
      const x = p.amp * Math.cos(ang), y = p.amp * Math.sin(ang);
      if (showSum) { pl.arrow(ox, oy, ox + x, oy + y, { color: p.color, width: 2.5 }); ox += x; oy += y; } else pl.arrow(0, 0, x, y, { color: p.color, width: 2.5 });
      if (!showSum) pl.segment(x, y, x, 0, { color: p.color, width: 1, dash: [3, 3] });
    });
    if (showSum) { pl.arrow(0, 0, sumRe(), sumIm(), { color: col.c, width: 3 }); pl.segment(sumRe(), sumIm(), sumRe(), 0, { color: col.c, width: 1, dash: [3, 3] }); }
  });
  pg.onDraw((pl) => {
    ph.forEach((p) => pl.fn((tt) => p.amp * Math.cos(omega * tt + p.phase * Math.PI / 180), { color: p.color, width: 2, from: 0, to: T }));
    if (showSum) pl.fn((tt) => ph.reduce((s, p) => s + p.amp * Math.cos(omega * tt + p.phase * Math.PI / 180), 0), { color: col.c, width: 3, from: 0, to: T });
    pl.vline(t, { color: col.muted });
  });
  const update = () => {
    pc.redraw(); pg.redraw();
    const parts = ph.map((p) => `<span style="color:${p.color}">$${p.label || 'V'} = ${fmtNum(p.amp, 3)}\\angle ${fmtNum(p.phase, 1)}^\\circ$</span>`);
    let msg = `${parts.join(', ')}. The real part of the rotating vector $\\mathbf{V}e^{j\\omega t}$ is the signal $v(t) = |V|\\cos(\\omega t + \\varphi)$.`;
    if (showSum) {
      const re = ph.reduce((s, p) => s + p.amp * Math.cos(p.phase * Math.PI / 180), 0), im = ph.reduce((s, p) => s + p.amp * Math.sin(p.phase * Math.PI / 180), 0);
      msg += ` Sum (green): $${fmtNum(Math.hypot(re, im), 3)}\\angle ${fmtNum(Math.atan2(im, re) * 180 / Math.PI, 1)}^\\circ$ — adding sinusoids of the same frequency is adding complex numbers.`;
    }
    setReadout(readout, msg);
  };
  const s = slider(controls, 'time $t$', { min: 0, max: T, step: T / 600, value: 0 }, (v) => { t = v; update(); });
  animator(controls, { from: 0, to: T, duration: 8000, onFrame: (v) => s.set(v), label: 'Rotate' });
  if (ph.length > 1) toggle(controls, 'show the sum', showSum, (v) => { showSum = v; update(); });
  update();
};

export const WIDGET_NAMES = Object.keys(WIDGETS);

export function mountWidget(container, name, config) {
  const w = WIDGETS[name];
  if (!w) {
    container.appendChild(h('div', { class: 'callout warn' }, `Unknown widget "${name}".`));
    return;
  }
  try {
    w(container, config || {});
  } catch (e) {
    console.error(e);
    container.appendChild(h('div', { class: 'callout warn' }, `Widget "${name}" failed: ${e.message}`));
  }
}
