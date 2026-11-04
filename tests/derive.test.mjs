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
  const m = d.match(/M([-\d.e]+),([-\d.e]+) C([-\d.e]+),([-\d.e]+) ([-\d.e]+),([-\d.e]+) ([-\d.e]+),([-\d.e]+)/).slice(1).map(Number);
  const [x0, y0, x1, y1, x2, y2, x3, y3] = m;
  const pts = [];
  for (let i = 1; i < n; i++) {
    const t = i / n, u = 1 - t;
    pts.push([u ** 3 * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t ** 3 * x3, u ** 3 * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3 * y3]);
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
