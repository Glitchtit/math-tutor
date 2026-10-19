import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAll } from './validate-content.mjs';

test('course content renders, runs and has correct answer keys', () => {
  const issues = validateAll();
  assert.deepEqual(issues, []);
});
