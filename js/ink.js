// Ink pad for handwritten Train drills: pointer-event canvas with pressure, undo and pen palm rejection.

import { h } from './util.js';

export function inkPad({ onFirstInk } = {}) {
  const canvas = h('canvas', { class: 'ink-pad', 'aria-label': 'Write here with a stylus or finger' });
  const ctx = canvas.getContext('2d');
  const strokes = [];
  let cur = null, penSeen = false;

  const draw = (s) => {
    ctx.strokeStyle = ctx.fillStyle = getComputedStyle(canvas).color;
    ctx.lineCap = ctx.lineJoin = 'round';
    for (let i = 1; i < s.length; i++) {
      ctx.lineWidth = 1 + 2.5 * s[i].p;
      ctx.beginPath(); ctx.moveTo(s[i - 1].x, s[i - 1].y); ctx.lineTo(s[i].x, s[i].y); ctx.stroke();
    }
    if (s.length === 1) { ctx.beginPath(); ctx.arc(s[0].x, s[0].y, 1.5, 0, 7); ctx.fill(); }
  };
  const redraw = () => {
    const r = devicePixelRatio || 1;
    ctx.setTransform(r, 0, 0, r, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach(draw);
  };
  new ResizeObserver(() => {
    const r = devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * r; canvas.height = canvas.clientHeight * r;
    redraw();
  }).observe(canvas);

  const pt = (e) => { const b = canvas.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top, p: e.pointerType === 'pen' ? e.pressure || 0.5 : 0.5 }; };
  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'pen') penSeen = true;
    else if (penSeen && e.pointerType === 'touch') return; // palm rejection once a stylus is in use
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    if (!strokes.length) onFirstInk?.();
    cur = [pt(e)]; strokes.push(cur); draw(cur);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!cur || !canvas.hasPointerCapture(e.pointerId)) return;
    for (const ev of e.getCoalescedEvents?.() || [e]) cur.push(pt(ev));
    draw(cur.slice(-(e.getCoalescedEvents?.().length || 1) - 1));
  });
  const end = () => { cur = null; };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  return {
    el: canvas,
    isEmpty: () => !strokes.length,
    clear() { strokes.length = 0; redraw(); },
    undo() { strokes.pop(); redraw(); },
    // base64 PNG, dark ink on white, cropped to the ink, for the AI reader
    png() {
      const xs = strokes.flat().map((p) => p.x), ys = strokes.flat().map((p) => p.y), pad = 12;
      const x0 = Math.min(...xs) - pad, y0 = Math.min(...ys) - pad;
      const out = h('canvas', { width: Math.max(...xs) + pad - x0, height: Math.max(...ys) + pad - y0 });
      const o = out.getContext('2d');
      o.fillStyle = '#fff'; o.fillRect(0, 0, out.width, out.height);
      o.strokeStyle = o.fillStyle = '#000'; o.lineCap = o.lineJoin = 'round';
      for (const s of strokes) {
        for (let i = 1; i < s.length; i++) { o.lineWidth = 1.5 + 2.5 * s[i].p; o.beginPath(); o.moveTo(s[i - 1].x - x0, s[i - 1].y - y0); o.lineTo(s[i].x - x0, s[i].y - y0); o.stroke(); }
        if (s.length === 1) { o.beginPath(); o.arc(s[0].x - x0, s[0].y - y0, 2, 0, 7); o.fill(); }
      }
      return out.toDataURL('image/png').split(',')[1];
    },
  };
}
