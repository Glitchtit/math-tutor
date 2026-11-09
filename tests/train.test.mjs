import test from 'node:test';
import assert from 'node:assert/strict';
import { texToPlain, chunkLine, checkChunk, matchLine, drillsOf } from '../js/train-core.js';
import { resolveSteps } from '../js/derive-core.js';
import { MODULES } from '../js/content/index.js';

const plain = (t) => texToPlain(t).replace(/\s+/g, '');

test('texToPlain conventions', () => {
  assert.equal(plain(String.raw`\dfrac{4.7}{4.7+1.2}\cdot 24`), '4.7/(4.7+1.2)*24');
  assert.equal(plain(String.raw`\frac{x^3}{3}`), 'x^3/3');
  assert.equal(plain(String.raw`\frac{1}{3x^2}`), '1/(3x^2)');
  assert.equal(plain(String.raw`x^{n+1} + V_{\mathrm{out}}`), 'x^(n+1)+V_out');
  assert.equal(plain(String.raw`\int_0^{1} x^{2}\,\mathrm{d}x`), 'int_0^1x^2dx');
  assert.equal(plain(String.raw`\lim_{n\to\infty} \frac{2}{n}`), 'lim_(n->inf)2/n');
  assert.equal(plain(String.raw`\sum_{n=1}^{\infty} \frac{1}{n^{2}}`), 'sum_(n=1)^inf1/n^2');
  assert.equal(plain(String.raw`a \le b \ne c \approx d \Rightarrow e`), 'a<=b!=c~d=>e');
  assert.equal(plain(String.raw`\left( \sqrt{x} \right) \pm \pi`), '(sqrt(x))+-pi');
  assert.equal(texToPlain(String.raw`\binom{n}{k}`), null);
});

test('chunkLine splits at tagged terms and relations', () => {
  assert.deepEqual(chunkLine(String.raw`\T{x-1}{x} + \T{three-1}{3} \ge 0`).map((c) => c.plain), ['x', '+3', '>=0']);
  assert.deepEqual(chunkLine(String.raw`x = 1 \qquad y = 2`).map((c) => c.plain), ['x', '=1', 'y', '=2']);
  assert.equal(chunkLine(String.raw`\T{x-1}{x}`)[0].tag, 'x-1');
});

test('checkChunk: forgiving on spacing, * and redundant brackets, strict on structure', () => {
  assert.ok(checkChunk(' 4.7 / (4.7 + 1.2) ', '4.7/(4.7+1.2)').ok);
  assert.ok(checkChunk('(4.7)/(4.7+1.2)', '4.7/(4.7+1.2)').ok);
  assert.ok(checkChunk('2*x', '2x').ok);
  assert.ok(checkChunk('≥ 0', '>=0').ok);
  assert.ok(checkChunk('=I²R', '=I^2R').ok);
  assert.ok(checkChunk('x³', 'x^3').ok);
  assert.ok(checkChunk('√(x)', 'sqrt(x)').ok);
  assert.ok(checkChunk('2πµ', '2pi mu').ok);
  assert.ok(checkChunk('Ω', 'Omega').ok);
  assert.ok(!checkChunk('4.7/4.7+1.2', '4.7/(4.7+1.2)').ok);
  assert.ok(!checkChunk('<=0', '>=0').ok);
  assert.equal(checkChunk('x+4', 'x+3').at, 2);
});

test('matchLine follows the line as it is typed', () => {
  const c = chunkLine(String.raw`\T{x-1}{x} + \T{three-1}{3} \ge 0`);
  assert.deepEqual(matchLine(c, ''), { done: 0, typoAt: -1, text: '' });
  assert.equal(matchLine(c, 'x').done, 1);
  assert.equal(matchLine(c, 'x +').done, 1);
  assert.equal(matchLine(c, 'x+3').done, 2);
  assert.equal(matchLine(c, 'x+3>').typoAt, -1);
  assert.equal(matchLine(c, 'x+3>=0').done, 3);
  assert.equal(matchLine(c, 'x+4').typoAt, 2);
  assert.equal(matchLine(c, 'x+3>=0 1').typoAt, 6);
  const f = chunkLine(String.raw`V = \dfrac{4.7}{4.7+1.2}\cdot 24`), alts = {};
  assert.equal(matchLine(f, 'V=(4.7)/(4.7+1.2)', alts).done, 2); // equal-valued form
  assert.equal(matchLine(f, 'V=(4.7)/(4.7+1.2)*24', alts).done, 3);
  assert.equal(matchLine(chunkLine(String.raw`P = \T{i-1}{I^2}R`), 'P=I²R').done, 2);
  const m = chunkLine(String.raw`3\cdot 4 = 12`);
  assert.equal(matchLine(m, '3*').typoAt, -1);
  assert.equal(matchLine(m, '3*4=12').done, m.length);
});

test('every drill line completes when its chunks are typed one after another', () => {
  for (const m of MODULES) for (const d of drillsOf(m)) for (const l of d.lines) {
    let typed = '';
    l.chunks.forEach((c, i) => { typed += c.plain; const r = matchLine(l.chunks, typed); assert.equal(r.typoAt, -1, typed); assert.ok(r.done >= i + 1, typed); });
  }
});

test('coverage: nearly every lesson derive line becomes a drill line, and every chunk accepts itself', () => {
  let total = 0, converted = 0;
  const rec = (o, f) => { if (Array.isArray(o)) o.forEach((x) => rec(x, f)); else if (o && typeof o === 'object') { if (o.type === 'derive') f(o); else Object.values(o).forEach((x) => rec(x, f)); } };
  for (const m of MODULES) for (const l of m.lessons || []) rec(l.blocks, (b) => { for (const s of resolveSteps(b)) { total++; if (chunkLine(s.to)) converted++; } });
  assert.ok(converted / total >= 0.85, `${converted}/${total}`);
  for (const m of MODULES) for (const d of drillsOf(m)) {
    assert.ok(d.lines.length > 0, d.key);
    for (const l of d.lines) for (const c of l.chunks) assert.ok(checkChunk(c.plain, c.plain).ok, c.plain);
  }
});

test('a whole line given at once (AI-read handwriting) matches every drill line', () => {
  for (const m of MODULES) for (const d of drillsOf(m)) for (const L of d.lines) {
    const r = matchLine(L.chunks, L.chunks.map((c) => c.plain).join(' '));
    assert.equal(r.done, L.chunks.length, `${d.key}: ${L.tex}`);
    assert.equal(r.typoAt, -1, `${d.key}: ${L.tex}`);
  }
});
