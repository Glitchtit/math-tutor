import test from 'node:test';
import assert from 'node:assert/strict';
import { tagIds, tagParents, resolveSteps, plan, colourSlot, route } from '../js/derive-core.js';

const R = String.raw;

test('tagIds lists tags in source order, including nested ones', () => {
  assert.deepEqual(tagIds(R`\T{a-1}{x}+\T{b-1}{(\T{c-1}{1}-y)}`), ['a-1', 'b-1', 'c-1']);
  assert.deepEqual(tagIds(R`x^2 + 1`), []);
});

test('tagParents maps each tag to its enclosing tag', () => {
  assert.deepEqual(tagParents(R`\T{a-1}{x}+\T{b-1}{(\T{c-1}{1}-y)}`), { 'a-1': null, 'b-1': null, 'c-1': 'b-1' });
});

test('resolveSteps fills from with the previous to', () => {
  const s = resolveSteps({ steps: [{ from: 'A', to: 'B' }, { to: 'C' }, { from: 'X', to: 'D' }] });
  assert.equal(s[1].from, 'B');
  assert.equal(s[2].from, 'X');
  assert.throws(() => resolveSteps({ steps: [{ to: 'B' }] }), /step 1 has no from/);
});

test('plan: moved and cancelled tags', () => {
  assert.deepEqual(plan(['Vs-1', 'Ts-1'], ['Vs-1']), { moves: [{ id: 'Vs-1', targets: ['Vs-1'] }], cancelled: ['Ts-1'] });
});

test('plan: fan-out through map', () => {
  assert.deepEqual(plan(['omd-1'], ['omd-1', 'omd-2'], { 'omd-1': ['omd-1', 'omd-2'] }).moves, [{ id: 'omd-1', targets: ['omd-1', 'omd-2'] }]);
});

test('plan: a dissolving parent with a moving child is not cancelled', () => {
  const r = plan(['omd-2', 'one', 'D-2'], ['D-2'], {}, { 'omd-2': null, one: 'omd-2', 'D-2': 'omd-2' });
  assert.deepEqual(r.moves, [{ id: 'D-2', targets: ['D-2'] }]);
  assert.deepEqual(r.cancelled, ['one']);
});

test('plan: a child of a moving parent is not listed separately', () => {
  const r = plan(['b-1', 'c-1'], ['b-1', 'c-1'], {}, { 'b-1': null, 'c-1': 'b-1' });
  assert.deepEqual(r.moves, [{ id: 'b-1', targets: ['b-1'] }]);
});

test('colourSlot: explicit colours win, otherwise order of first appearance', () => {
  const seen = [];
  assert.equal(colourSlot('Vs-1', {}, seen), 1);
  assert.equal(colourSlot('Vo-1', {}, seen), 2);
  assert.equal(colourSlot('Vs-2', {}, seen), 1);
  assert.equal(colourSlot('D-1', { D: 5 }, seen), 5);
});

function cubicPoints(d, n = 200) {
  const nums = d.match(/-?[\d.]+(e-?\d+)?/g).map(Number);
  let p = [nums[0], nums[1]];
  const pts = [];
  for (let k = 2; k + 5 < nums.length; k += 6) {
    const [x1, y1, x2, y2, x3, y3] = nums.slice(k, k + 6);
    for (let i = 1; i < n; i++) {
      const t = i / n, u = 1 - t;
      pts.push([u ** 3 * p[0] + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t ** 3 * x3, u ** 3 * p[1] + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3 * y3]);
    }
    p = [x3, y3];
  }
  return pts;
}
const inside = ([x, y], b) => x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h;

test('route: clear sky above the target enters from the top', () => {
  const r = route({ x: 100, y: 0, w: 20, h: 20 }, { x: 100, y: 120, w: 20, h: 20 }, [], { x: 80, y: 115, w: 200, h: 30 });
  assert.equal(r.side, 'top');
});

test('route: a numerator above the target forces another side and the path avoids it', () => {
  const numerator = { x: 300, y: 100, w: 20, h: 25 };
  const r = route({ x: 140, y: 0, w: 20, h: 20 }, { x: 300, y: 130, w: 20, h: 25 }, [numerator, { x: 140, y: 110, w: 120, h: 30 }], { x: 140, y: 100, w: 200, h: 60 });
  assert.notEqual(r.side, 'top');
  assert.ok(cubicPoints(r.d).every((p) => !inside(p, numerator)));
});

// ---- validator support ----
import { validateBlocks } from './validate-content.mjs';
const issuesOf = (blocks) => { const out = []; validateBlocks(blocks, 'T', out); return out; };
const D = (steps, extra = {}) => ({ type: 'derive', steps, ...extra });

test('validator: a well-formed derive block has no issues', () => {
  assert.deepEqual(issuesOf([D([{ kind: 'both', label: R`Both sides $\div U$`, from: R`\T{P-1}{P}=\T{U-1}{U}\,\T{I-1}{I}`, to: R`\T{I-1}{I}=\frac{\T{P-1}{P}}{\T{U-1}{U}}`, arrows: { 'U-1': '÷U' }, why: R`<p>Divide by $U$.</p>` }])]), []);
});

test('validator: derive authoring errors are reported with the step', () => {
  const dup = issuesOf([D([{ kind: 'calc', from: R`\T{a-1}{x}+\T{a-1}{y}`, to: 'z' }])]);
  assert.ok(dup.some((s) => /duplicate tag "a-1"/.test(s) && /step 1/.test(s)), dup.join('\n'));
  const arrow = issuesOf([D([{ kind: 'calc', from: 'x', to: 'y' }, { kind: 'calc', to: R`\T{b-1}{y}`, arrows: { 'x-1': '' } }])]);
  assert.ok(arrow.some((s) => /arrows key "x-1" not in step 2/.test(s)), arrow.join('\n'));
  const map = issuesOf([D([{ kind: 'expand', from: R`\T{a-1}{x}`, to: R`\T{a-1}{x}`, map: { 'a-1': ['a-1', 'a-2'] } }])]);
  assert.ok(map.some((s) => /map target "a-2"/.test(s)), map.join('\n'));
  const latex = issuesOf([D([{ kind: 'calc', from: 'x', to: R`\frac{1}{` }])]);
  assert.ok(latex.some((s) => /LaTeX error/.test(s)), latex.join('\n'));
  const kind = issuesOf([D([{ kind: 'magic', from: 'x', to: 'y' }])]);
  assert.ok(kind.some((s) => /unknown step kind "magic"/.test(s)), kind.join('\n'));
  const nofrom = issuesOf([D([{ kind: 'calc', to: 'y' }])]);
  assert.ok(nofrom.some((s) => /step 1 has no from/.test(s)), nofrom.join('\n'));
});

test('validator: symbolic derive blocks need a numbers companion right after', () => {
  const sym = D([{ kind: 'both', from: 'P=UI', to: R`I=\frac{P}{U}` }], { symbolic: true });
  assert.ok(issuesOf([sym]).some((s) => /needs a numbers companion/.test(s)));
  assert.deepEqual(issuesOf([sym, D([{ kind: 'sub', from: 'P=UI', to: '60=12I' }], { given: R`P=60\text{ W}` })]), []);
});

test('validator: part solutions may be block arrays', () => {
  assert.deepEqual(issuesOf([{ type: 'answer', part: { kind: 'writeup', prompt: 'x', solution: [{ type: 'text', html: '$x$' }] } }]), []);
  assert.ok(issuesOf([{ type: 'answer', part: { kind: 'writeup', prompt: 'x', solution: [{ type: 'text', html: '$x' }] } }]).length > 0);
});

// ---- practice blocks and PE widgets ----
import { checkText } from '../js/check.js';

test('checkText: loose word matching', () => {
  assert.ok(checkText({ answers: ['balanced'] }, ' Balanced ').ok);
  assert.ok(checkText({ answers: ['balanced'] }, 'balnced').ok);
  assert.ok(!checkText({ answers: ['balanced'] }, 'unbalanced').ok);
  assert.ok(checkText({ answers: ['mercury arc rectifier', 'mercury arc'] }, 'Mercury-arc').ok);
  assert.ok(!checkText({ answers: ['RC'] }, 'RL').ok);
  assert.ok(checkText({ num: 3, tol: 0.01 }, '3.00').ok);
  assert.ok(checkText({ num: 0.632 }, '0,632').ok);
  assert.ok(!checkText({ num: 3 }, '4').ok);
});

test('validator: practice blocks', () => {
  const quiz = issuesOf([{ type: 'examquiz', questions: [{ q: 'x', choices: ['a', 'b'], answer: 2, explain: '' }] }]);
  assert.ok(quiz.some((s) => /answer index 2 out of range/.test(s)), quiz.join('\n'));
  const bl = issuesOf([{ type: 'blanks', items: [{ html: 'A [[]] and a [[]].', answers: ['x'] }] }]);
  assert.ok(bl.some((s) => /2 gaps but 1 answers/.test(s)), bl.join('\n'));
  assert.deepEqual(issuesOf([{ type: 'blanks', items: [{ html: 'A $R$ is a [[]].', answers: ['resistor|resistance'] }, { html: '[[]] gaps', answers: [{ num: 3 }] }] }]), []);
  assert.ok(issuesOf([{ type: 'figure', svg: '<div></div>' }]).some((s) => /figure needs an <svg>/.test(s)));
  assert.deepEqual(issuesOf([{ type: 'reveal', prompt: 'Draw it', blocks: [{ type: 'widget', name: 'pefig', config: { fig: 'wfBuck' } }], checklist: ['$v_L$ is a rectangle'] }]), []);
  assert.ok(issuesOf([{ type: 'widget', name: 'pefig', config: { fig: 'nope' } }]).some((s) => /unknown pefig/.test(s)));
});

test('colourSlot: still returns a slot when all 8 are pinned', () => {
  const all = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 };
  const s = colourSlot('z-1', all, []);
  assert.ok(Number.isInteger(s) && s >= 1 && s <= 8, String(s));
});

test('plan: map targets may be a single string', () => {
  assert.deepEqual(plan(['L-1', 'R-1'], ['S-1'], { 'L-1': 'S-1', 'R-1': ['S-1'] }).moves, [{ id: 'L-1', targets: ['S-1'] }, { id: 'R-1', targets: ['S-1'] }]);
});

test('route: a source in a numerator leaves sideways instead of cutting through its denominator', () => {
  const denom = { x: 95, y: 26, w: 30, h: 22 };
  const r = route({ x: 100, y: 0, w: 20, h: 22 }, { x: 60, y: 130, w: 20, h: 20 }, [denom], { x: 40, y: 125, w: 200, h: 30 });
  assert.equal(r.hits, 0);
  assert.ok(cubicPoints(r.d).every((p) => !inside(p, denom)));
});
