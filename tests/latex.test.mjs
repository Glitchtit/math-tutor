import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTex, texEquivalent } from '../js/latex.js';

test('equivalent spellings match', () => {
  assert.ok(texEquivalent('\\int_a^b f(x)\\,\\mathrm d x', '\\int^{b}_{a} f(x) dx'));
  assert.ok(texEquivalent('\\frac{1}{2}', '\\dfrac12'));
  assert.ok(texEquivalent('\\left( x^{2} \\right)', '(x^2)'));
  assert.ok(texEquivalent('\\mathrm{Si}(x)', '\\operatorname{Si}(x)'));
  assert.ok(texEquivalent('\\lim_{x \\rightarrow 0}', '\\lim_{x\\to0}'));
});

test('different expressions differ', () => {
  assert.ok(!texEquivalent('\\frac{1}{2}', '\\frac{2}{1}'));
  assert.ok(!texEquivalent('x^2', 'x_2'));
  assert.ok(!texEquivalent('\\sin x', '\\cos x'));
});

test('normal form is stable', () => {
  assert.equal(normalizeTex('x^{2}'), normalizeTex('x^2'));
});
