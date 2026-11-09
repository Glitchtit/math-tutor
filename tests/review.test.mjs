import test from 'node:test';
import assert from 'node:assert/strict';
import { nextReview, dueKeys, DAY } from '../js/review-core.js';

test('review intervals grow 1, 3, 7, 21, 60 days and a miss starts over', () => {
  let r, t = 0;
  const gaps = [];
  for (let i = 0; i < 6; i++) { r = nextReview(r, true, t); gaps.push((r.due - t) / DAY); t = r.due; }
  assert.deepEqual(gaps, [1, 3, 7, 21, 60, 60]);
  r = nextReview(r, false, t);
  assert.equal((r.due - t) / DAY, 1);
  assert.equal(r.step, 0);
});

test('dueKeys returns overdue items, most overdue first', () => {
  assert.deepEqual(dueKeys({ a: { due: 5 }, b: { due: 1 }, c: { due: 50 } }, 10), ['b', 'a']);
});
