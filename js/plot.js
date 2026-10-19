// Small canvas plotting library used by the lesson widgets and the MATLAB figure renderer.

import { renderMath } from './util.js';

function niceStep(range, target = 6) {
  const raw = range / target;
  const p = 10 ** Math.floor(Math.log10(raw));
  const f = raw / p;
  const n = f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10;
  return n * p;
}

export function niceLimits(lo, hi, pad = 0) {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return [-1, 1];
  if (lo === hi) { const d = Math.abs(lo) * 0.1 || 1; return [lo - d, hi + d]; }
  const span = hi - lo;
  lo -= span * pad; hi += span * pad;
  const st = niceStep(hi - lo);
  return [Math.floor(lo / st + 1e-9) * st, Math.ceil(hi / st - 1e-9) * st];
}

function fmtTick(v, step) {
  if (Math.abs(v) < step * 1e-6) return '0';
  const d = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
  const a = Math.abs(v);
  if (a >= 1e5 || (a < 1e-3 && a > 0)) return v.toExponential(1);
  return v.toFixed(d);
}

// MATLAB's default line colours, and brighter variants for a dark figure background
const MATLAB_ORDER = ['#0072BD', '#D95319', '#EDB120', '#7E2F8E', '#77AC30', '#4DBEEE', '#A2142F'];
const MATLAB_DARK = ['#4fa8ff', '#ff8a4c', '#f5c242', '#c47ae6', '#8fd65e', '#72d8f7', '#ff5c7a'];

function isDarkFigure() {
  const c = cssVar('--fig-bg', '#ffffff').replace('#', '');
  if (c.length < 6) return false;
  const [r, g, b] = [0, 2, 4].map((k) => parseInt(c.slice(k, k + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b < 128;
}

function figColor(c) {
  if (!isDarkFigure()) return c;
  const k = MATLAB_ORDER.indexOf(String(c).toUpperCase());
  if (k >= 0) return MATLAB_DARK[k];
  if (/^#0{6}$|^#262626$|^black$/i.test(c)) return "#e7eaf0";
  return c;
}

function cssVar(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export class Plot {
  constructor(container, opts = {}) {
    this.container = container;
    this.opts = { height: 320, grid: true, axes: true, padding: { l: 44, r: 14, t: 14, b: 30 }, theme: 'auto', ...opts };
    this.wrap = document.createElement('div');
    this.wrap.className = 'plot-wrap';
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'plot-canvas';
    this.wrap.appendChild(this.canvas);
    container.appendChild(this.wrap);
    this.ctx = this.canvas.getContext('2d');
    this.view = { x0: opts.xlim?.[0] ?? -5, x1: opts.xlim?.[1] ?? 5, y0: opts.ylim?.[0] ?? -5, y1: opts.ylim?.[1] ?? 5 };
    this.drawFn = null;
    this.resize();
    if (typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(() => { this.resize(); this.redraw(); });
      this.ro.observe(this.wrap);
    }
    this.bindPointer();
    window.addEventListener('themechange', () => this.redraw());
  }

  colors() {
    if (this.opts.theme === 'figure') {
      const dark = isDarkFigure();
      return { bg: cssVar('--fig-bg', '#ffffff'), axis: dark ? '#b8c2d0' : '#262626', grid: dark ? '#262e3a' : '#e6e6e6', text: cssVar('--fig-text', '#262626'), muted: dark ? '#9aa6b8' : '#6b6b6b' };
    }
    return {
      bg: cssVar('--plot-bg', '#ffffff'),
      axis: cssVar('--plot-axis', '#333'),
      grid: cssVar('--plot-grid', '#e8e8e8'),
      text: cssVar('--plot-text', '#222'),
      muted: cssVar('--text-muted', '#777'),
    };
  }

  resize() {
    const w = Math.max(200, this.wrap.clientWidth || this.container.clientWidth || 600);
    const h = this.opts.height;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.w = w; this.h = h;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.fitEqual();
  }

  setView(x0, x1, y0, y1) {
    this.view = { x0, x1, y0, y1 };
    this.fitEqual();
  }

  fitEqual() {
    if (!this.opts.axisEqual) return;
    const { l, r, t, b } = this.opts.padding;
    const pw = this.w - l - r, ph = this.h - t - b;
    const v = this.view;
    const sx = (v.x1 - v.x0) / pw, sy = (v.y1 - v.y0) / ph;
    if (sx > sy) { const c = (v.y0 + v.y1) / 2, half = sx * ph / 2; v.y0 = c - half; v.y1 = c + half; } else { const c = (v.x0 + v.x1) / 2, half = sy * pw / 2; v.x0 = c - half; v.x1 = c + half; }
  }

  X(x) { const { l, r } = this.opts.padding; return l + (x - this.view.x0) / (this.view.x1 - this.view.x0) * (this.w - l - r); }
  Y(y) { const { t, b } = this.opts.padding; return this.h - b - (y - this.view.y0) / (this.view.y1 - this.view.y0) * (this.h - t - b); }
  invX(px) { const { l, r } = this.opts.padding; return this.view.x0 + (px - l) / (this.w - l - r) * (this.view.x1 - this.view.x0); }
  invY(py) { const { t, b } = this.opts.padding; return this.view.y0 + (this.h - b - py) / (this.h - t - b) * (this.view.y1 - this.view.y0); }

  onDraw(fn) { this.drawFn = fn; this.redraw(); return this; }
  redraw() {
    if (!this.w) return;
    this.clear();
    this.drawAxes();
    if (this.drawFn) this.drawFn(this);
  }

  clear() {
    const c = this.colors();
    this.ctx.fillStyle = c.bg;
    this.ctx.fillRect(0, 0, this.w, this.h);
  }

  clipPlot() {
    const { l, r, t, b } = this.opts.padding;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(l, t, this.w - l - r, this.h - t - b);
    this.ctx.clip();
  }

  drawAxes() {
    const ctx = this.ctx;
    const c = this.colors();
    const { l, r, t, b } = this.opts.padding;
    const v = this.view;
    const xs = niceStep(v.x1 - v.x0, Math.max(3, Math.round((this.w - l - r) / 80)));
    const ys = niceStep(v.y1 - v.y0, Math.max(3, Math.round((this.h - t - b) / 50)));
    this.tickX = xs; this.tickY = ys;
    ctx.font = '11px var(--font-mono, monospace)';
    ctx.lineWidth = 1;
    const xticks = [], yticks = [];
    for (let x = Math.ceil(v.x0 / xs) * xs; x <= v.x1 + xs * 1e-9; x += xs) xticks.push(x);
    for (let y = Math.ceil(v.y0 / ys) * ys; y <= v.y1 + ys * 1e-9; y += ys) yticks.push(y);
    if (this.opts.grid) {
      ctx.strokeStyle = c.grid;
      ctx.beginPath();
      for (const x of xticks) { const px = Math.round(this.X(x)) + 0.5; ctx.moveTo(px, t); ctx.lineTo(px, this.h - b); }
      for (const y of yticks) { const py = Math.round(this.Y(y)) + 0.5; ctx.moveTo(l, py); ctx.lineTo(this.w - r, py); }
      ctx.stroke();
    }
    if (!this.opts.axes) return;
    ctx.fillStyle = c.muted;
    // MATLAB-style box axes (figures) or centred axes (widgets)
    if (this.opts.boxAxes) {
      ctx.strokeStyle = c.axis;
      ctx.strokeRect(l + 0.5, t + 0.5, this.w - l - r, this.h - t - b);
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (const x of xticks) ctx.fillText(fmtTick(x, xs), this.X(x), this.h - b + 5);
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (const y of yticks) ctx.fillText(fmtTick(y, ys), l - 5, this.Y(y));
      return;
    }
    const x0px = Math.min(Math.max(this.X(0), l), this.w - r);
    const y0px = Math.min(Math.max(this.Y(0), t), this.h - b);
    ctx.strokeStyle = c.axis;
    ctx.beginPath();
    ctx.moveTo(l, Math.round(y0px) + 0.5); ctx.lineTo(this.w - r, Math.round(y0px) + 0.5);
    ctx.moveTo(Math.round(x0px) + 0.5, t); ctx.lineTo(Math.round(x0px) + 0.5, this.h - b);
    ctx.stroke();
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    const yLab = Math.min(y0px + 4, this.h - b + 4);
    for (const x of xticks) { if (Math.abs(x) < xs * 1e-6) continue; ctx.fillText(fmtTick(x, xs), this.X(x), yLab); }
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    const xLab = Math.max(x0px - 4, l - 4);
    for (const y of yticks) { if (Math.abs(y) < ys * 1e-6) continue; ctx.fillText(fmtTick(y, ys), xLab, this.Y(y)); }
    if (this.opts.xlabel) { ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillText(this.opts.xlabel, this.w - r - 2, y0px - 3); }
    if (this.opts.ylabel) { ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(this.opts.ylabel, x0px + 5, t + 2); }
  }

  // --------------------------------------------------------- primitives (world coords)
  stroke(style = {}) {
    const ctx = this.ctx;
    ctx.strokeStyle = style.color || cssVar('--accent', '#2563eb');
    ctx.lineWidth = style.width || 2;
    ctx.setLineDash(style.dash || []);
    ctx.globalAlpha = style.alpha ?? 1;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }

  polyline(xs, ys, style = {}) {
    const ctx = this.ctx;
    this.clipPlot();
    ctx.beginPath();
    let pen = false;
    const ymax = (this.view.y1 - this.view.y0) * 50;
    for (let k = 0; k < xs.length; k++) {
      const y = ys[k];
      if (!Number.isFinite(y) || Math.abs(y - this.view.y0) > ymax) { pen = false; continue; }
      const px = this.X(xs[k]), py = this.Y(y);
      if (!pen) { ctx.moveTo(px, py); pen = true; } else ctx.lineTo(px, py);
    }
    this.stroke(style);
    ctx.restore();
  }

  fn(f, style = {}) {
    const a = style.from ?? this.view.x0, b = style.to ?? this.view.x1;
    const n = style.samples || Math.max(200, Math.round(this.w * 1.5));
    const xs = [], ys = [];
    let prev = null;
    for (let k = 0; k <= n; k++) {
      const x = a + (b - a) * k / n;
      let y;
      try { y = f(x); } catch { y = NaN; }
      // break the line at vertical asymptotes
      if (prev !== null && Number.isFinite(y) && Number.isFinite(prev) && Math.abs(y - prev) > (this.view.y1 - this.view.y0) * 2) { xs.push(x); ys.push(NaN); }
      xs.push(x); ys.push(y);
      prev = y;
    }
    this.polyline(xs, ys, style);
  }

  fillPoly(pts, style = {}) {
    const ctx = this.ctx;
    this.clipPlot();
    ctx.beginPath();
    pts.forEach(([x, y], k) => { const px = this.X(x), py = this.Y(y); if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); });
    ctx.closePath();
    ctx.fillStyle = style.color || cssVar('--accent', '#2563eb');
    ctx.globalAlpha = style.alpha ?? 0.25;
    ctx.fill();
    ctx.globalAlpha = 1;
    if (style.stroke) { ctx.strokeStyle = style.stroke; ctx.lineWidth = style.strokeWidth || 1; ctx.stroke(); }
    ctx.restore();
  }

  // area between f and g (g defaults to 0) on [a,b]; colors split by sign if signed=true
  fillBetween(f, g, a, b, style = {}) {
    const n = style.samples || 300;
    const G = g || (() => 0);
    if (style.signed) {
      // split into positive/negative pieces
      let seg = [];
      let sgn = 0;
      const flush = () => {
        if (seg.length > 1) {
          const pts = seg.map(([x, y]) => [x, y]).concat(seg.slice().reverse().map(([x]) => [x, G(x)]));
          this.fillPoly(pts, { ...style, color: sgn >= 0 ? (style.posColor || style.color) : (style.negColor || '#dc2626') });
        }
        seg = [];
      };
      for (let k = 0; k <= n; k++) {
        const x = a + (b - a) * k / n;
        const y = f(x);
        const s = Math.sign(y - G(x));
        if (s !== 0 && sgn !== 0 && s !== sgn) { seg.push([x, G(x)]); flush(); seg.push([x, G(x)]); }
        if (s !== 0) sgn = s;
        seg.push([x, y]);
      }
      flush();
      return;
    }
    const top = [], bot = [];
    for (let k = 0; k <= n; k++) {
      const x = a + (b - a) * k / n;
      top.push([x, f(x)]);
      bot.push([x, G(x)]);
    }
    this.fillPoly(top.concat(bot.reverse()), style);
  }

  rect(x0, y0, x1, y1, style = {}) {
    this.fillPoly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], { alpha: 0.3, ...style, stroke: style.stroke ?? style.color });
  }

  segment(x0, y0, x1, y1, style = {}) { this.polyline([x0, x1], [y0, y1], style); }
  vline(x, style = {}) { this.segment(x, this.view.y0, x, this.view.y1, { width: 1, dash: [5, 4], color: this.colors().muted, ...style }); }
  hline(y, style = {}) { this.segment(this.view.x0, y, this.view.x1, y, { width: 1, dash: [5, 4], color: this.colors().muted, ...style }); }

  point(x, y, style = {}) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(this.X(x), this.Y(y), style.r || 5, 0, Math.PI * 2);
    if (style.hollow) {
      ctx.fillStyle = this.colors().bg; ctx.fill();
      ctx.strokeStyle = style.color || cssVar('--accent', '#2563eb'); ctx.lineWidth = 2; ctx.stroke();
    } else {
      ctx.fillStyle = style.color || cssVar('--accent', '#2563eb');
      ctx.fill();
    }
    if (style.label) this.text(x, y, style.label, { dx: 8, dy: -8, color: style.color, ...style.labelStyle });
  }

  text(x, y, str, style = {}) {
    const ctx = this.ctx;
    ctx.font = style.font || '13px var(--font-sans, sans-serif)';
    ctx.fillStyle = style.color || this.colors().text;
    ctx.textAlign = style.align || 'left';
    ctx.textBaseline = style.baseline || 'alphabetic';
    ctx.fillText(str, this.X(x) + (style.dx || 0), this.Y(y) + (style.dy || 0));
  }

  arrow(x0, y0, x1, y1, style = {}) {
    const ctx = this.ctx;
    const X0 = this.X(x0), Y0 = this.Y(y0), X1 = this.X(x1), Y1 = this.Y(y1);
    this.clipPlot();
    ctx.beginPath();
    ctx.moveTo(X0, Y0); ctx.lineTo(X1, Y1);
    this.stroke({ width: 1.5, ...style });
    if (style.head !== false) {
      const ang = Math.atan2(Y1 - Y0, X1 - X0);
      const hl = style.headLen || Math.min(8, Math.hypot(X1 - X0, Y1 - Y0) * 0.4);
      ctx.beginPath();
      ctx.moveTo(X1, Y1);
      ctx.lineTo(X1 - hl * Math.cos(ang - 0.45), Y1 - hl * Math.sin(ang - 0.45));
      ctx.moveTo(X1, Y1);
      ctx.lineTo(X1 - hl * Math.cos(ang + 0.45), Y1 - hl * Math.sin(ang + 0.45));
      this.stroke({ width: 1.5, ...style });
    }
    ctx.restore();
  }

  // slope field for dy/dx = F(x,y)
  slopeField(F, style = {}) {
    const nx = style.nx || 22, ny = style.ny || 16;
    const v = this.view;
    const dx = (v.x1 - v.x0) / nx, dy = (v.y1 - v.y0) / ny;
    const len = 0.38;
    for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) {
      const x = v.x0 + i * dx, y = v.y0 + j * dy;
      let s;
      try { s = F(x, y); } catch { continue; }
      if (!Number.isFinite(s)) continue;
      // direction in pixel space so segments have equal on-screen length
      const px = this.X(x), py = this.Y(y);
      const vx = 1 / (v.x1 - v.x0) * (this.w), vy = -s / (v.y1 - v.y0) * (this.h);
      const m = Math.hypot(vx, vy) || 1;
      const L = Math.min(this.w / nx, this.h / ny) * len;
      this.ctx.beginPath();
      this.ctx.moveTo(px - vx / m * L, py - vy / m * L);
      this.ctx.lineTo(px + vx / m * L, py + vy / m * L);
      this.stroke({ width: 1.2, color: style.color || this.colors().muted });
    }
  }

  // --------------------------------------------------------- interaction
  bindPointer() {
    const handler = (type) => (ev) => {
      if (!this.pointerFn) return;
      const rect = this.canvas.getBoundingClientRect();
      const px = (ev.touches ? ev.touches[0].clientX : ev.clientX) - rect.left;
      const py = (ev.touches ? ev.touches[0].clientY : ev.clientY) - rect.top;
      if (type === 'down') this.dragging = true;
      if (type === 'up') this.dragging = false;
      if (type === 'move' && !this.dragging && !this.hoverMode) return;
      this.pointerFn({ type, x: this.invX(px), y: this.invY(py), px, py, dragging: this.dragging });
      if (type !== 'up' && this.dragging) ev.preventDefault();
    };
    this.canvas.addEventListener('pointerdown', handler('down'));
    this.canvas.addEventListener('pointermove', handler('move'));
    window.addEventListener('pointerup', handler('up'));
  }
  onPointer(fn, { hover = false } = {}) { this.pointerFn = fn; this.hoverMode = hover; this.canvas.style.cursor = 'crosshair'; this.canvas.style.touchAction = 'none'; return this; }

  destroy() { this.ro?.disconnect(); this.wrap.remove(); }
}

// --------------------------------------------------------------- MATLAB figure rendering

export function renderFigure(container, fig) {
  const box = document.createElement('div');
  box.className = 'mfig';
  container.appendChild(box);
  if (fig.title) {
    const t = document.createElement('div');
    t.className = 'mfig-title';
    setLabel(t, fig.title);
    box.appendChild(t);
  }
  // data limits
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const s of fig.series) {
    if (s.type === 'text' || s.type === 'xline' || s.type === 'yline') continue;
    const xs = s.x || [], ys = s.y || [];
    xs.forEach((x, k) => {
      if (!Number.isFinite(x)) return;
      x0 = Math.min(x0, x); x1 = Math.max(x1, x);
      const yv = [ys[k]];
      if (s.type === 'quiver') { x0 = Math.min(x0, x + s.u[k]); x1 = Math.max(x1, x + s.u[k]); yv.push(ys[k] + s.v[k]); }
      for (const y of yv) if (Number.isFinite(y)) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    });
    if (s.type === 'bar' || s.type === 'area' || s.type === 'stem') { y0 = Math.min(y0, 0); y1 = Math.max(y1, 0); }
    if (s.type === 'bar' && xs.length > 1) { const w = (xs[1] - xs[0]) * 0.5; x0 = Math.min(x0, xs[0] - w); x1 = Math.max(x1, xs[xs.length - 1] + w); }
  }
  if (!Number.isFinite(x0)) { x0 = 0; x1 = 1; y0 = 0; y1 = 1; }
  const onlyFplot = fig.series.length && fig.series.every((s) => s.type === 'line' && s.x && s.x.length === 601);
  const xl = fig.xlim || (onlyFplot ? [x0, x1] : niceLimits(x0, x1));
  const yl = fig.ylim || niceLimits(y0, y1);
  const area = document.createElement('div');
  box.appendChild(area);
  const p = new Plot(area, { height: 300, grid: !!fig.grid, boxAxes: true, theme: 'figure', axisEqual: fig.axisEqual, padding: { l: 52, r: 16, t: 10, b: 28 }, xlim: xl, ylim: yl });
  p.setView(xl[0], xl[1], yl[0], yl[1]);
  p.onDraw((pl) => {
    for (const s of fig.series) drawSeries(pl, s);
  });
  if (fig.xlabel) { const d = document.createElement('div'); d.className = 'mfig-xlabel'; setLabel(d, fig.xlabel); box.appendChild(d); }
  if (fig.ylabel) { const d = document.createElement('div'); d.className = 'mfig-ylabel'; setLabel(d, fig.ylabel); box.appendChild(d); }
  if (fig.legend && fig.legend.length) {
    const lg = document.createElement('div');
    lg.className = 'mfig-legend';
    const lines = fig.series.filter((s) => s.type !== 'text' && s.type !== 'xline' && s.type !== 'yline');
    fig.legend.forEach((name, k) => {
      const s = lines[k];
      if (!s) return;
      const row = document.createElement('div');
      const sw = document.createElement('span');
      sw.className = 'mfig-swatch';
      sw.style.background = figColor(s.color);
      const lab = document.createElement('span');
      if (fig.legendLatex) setLabel(lab, name, true); else lab.textContent = name;
      row.append(sw, lab);
      lg.appendChild(row);
    });
    area.style.position = 'relative';
    area.appendChild(lg);
  }
  return p;
}

function setLabel(el, text, latex = false) {
  if (latex || /\$/.test(text)) {
    el.innerHTML = '';
    renderMath(el, text);
  } else el.textContent = text;
}

function dashFor(style) {
  return { '--': [8, 5], ':': [2, 4], '-.': [8, 4, 2, 4] }[style] || [];
}

function drawMarker(p, x, y, marker, color, size) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;
  const ctx = p.ctx;
  const px = p.X(x), py = p.Y(y);
  const r = size / 2;
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1;
  ctx.beginPath();
  switch (marker) {
    case '.': ctx.arc(px, py, Math.max(1.5, r / 2.5), 0, Math.PI * 2); ctx.fill(); return;
    case 'o': ctx.arc(px, py, r, 0, Math.PI * 2); ctx.stroke(); return;
    case 'x': ctx.moveTo(px - r, py - r); ctx.lineTo(px + r, py + r); ctx.moveTo(px + r, py - r); ctx.lineTo(px - r, py + r); ctx.stroke(); return;
    case '+': ctx.moveTo(px - r, py); ctx.lineTo(px + r, py); ctx.moveTo(px, py - r); ctx.lineTo(px, py + r); ctx.stroke(); return;
    case '*': ctx.moveTo(px - r, py); ctx.lineTo(px + r, py); ctx.moveTo(px, py - r); ctx.lineTo(px, py + r); ctx.moveTo(px - r * 0.7, py - r * 0.7); ctx.lineTo(px + r * 0.7, py + r * 0.7); ctx.moveTo(px + r * 0.7, py - r * 0.7); ctx.lineTo(px - r * 0.7, py + r * 0.7); ctx.stroke(); return;
    case 's': ctx.rect(px - r, py - r, 2 * r, 2 * r); ctx.stroke(); return;
    case 'd': ctx.moveTo(px, py - r); ctx.lineTo(px + r, py); ctx.lineTo(px, py + r); ctx.lineTo(px - r, py); ctx.closePath(); ctx.stroke(); return;
    case '^': ctx.moveTo(px, py - r); ctx.lineTo(px + r, py + r); ctx.lineTo(px - r, py + r); ctx.closePath(); ctx.stroke(); return;
    case 'v': ctx.moveTo(px, py + r); ctx.lineTo(px + r, py - r); ctx.lineTo(px - r, py - r); ctx.closePath(); ctx.stroke(); return;
    default: ctx.arc(px, py, r, 0, Math.PI * 2); ctx.stroke();
  }
}

function drawSeries(p, sIn) {
  const s = { ...sIn, color: figColor(sIn.color) };
  const style = { color: s.color, width: Math.max(0.8, s.width * 1.4), dash: dashFor(s.style) };
  const marker = s.marker && s.marker !== 'none' ? s.marker : null;
  switch (s.type) {
    case 'line':
      if (s.style !== 'none') p.polyline(s.x, s.y, style);
      if (marker) { p.clipPlot(); s.x.forEach((x, k) => drawMarker(p, x, s.y[k], marker, s.color, s.markerSize)); p.ctx.restore(); }
      break;
    case 'stem':
      s.x.forEach((x, k) => { p.segment(x, 0, x, s.y[k], style); drawMarker(p, x, s.y[k], marker || 'o', s.color, s.markerSize); });
      break;
    case 'bar': {
      const w = s.x.length > 1 ? (s.x[1] - s.x[0]) * 0.8 : 0.8;
      s.x.forEach((x, k) => p.rect(x - w / 2, 0, x + w / 2, s.y[k], { color: s.color, alpha: 0.85 }));
      break;
    }
    case 'area':
      p.fillPoly(s.x.map((x, k) => [x, s.y[k]]).concat([[s.x[s.x.length - 1], 0], [s.x[0], 0]]), { color: s.color, alpha: 0.6, stroke: s.color });
      break;
    case 'fill':
      p.fillPoly(s.x.map((x, k) => [x, s.y[k]]), { color: s.color, alpha: 0.6, stroke: p.colors().axis });
      break;
    case 'quiver':
      s.x.forEach((x, k) => {
        const y = s.y[k], u = s.u[k], v = s.v[k];
        if (!Number.isFinite(u) || !Number.isFinite(v)) return;
        if (s.arrows) p.arrow(x, y, x + u, y + v, { color: s.color, width: Math.max(1, s.width * 1.4), headLen: 5 });
        else p.segment(x, y, x + u, y + v, { color: s.color, width: Math.max(1, s.width * 1.4) });
        if (marker) drawMarker(p, x, y, marker, s.color, s.markerSize);
      });
      break;
    case 'xline': p.vline(s.value, { color: s.color, dash: dashFor(s.style), width: Math.max(1, s.width * 1.4) }); break;
    case 'yline': p.hline(s.value, { color: s.color, dash: dashFor(s.style), width: Math.max(1, s.width * 1.4) }); break;
    case 'text': p.text(s.x, s.y, s.text, { color: p.colors().text }); break;
    default: break;
  }
}
