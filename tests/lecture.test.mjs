import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { ttsId, lectureLines, readingMs, boardBlock } from '../js/lecture-core.js';

test('ttsId matches node sha256 of voice + newline + text', async () => {
  assert.equal(await ttsId('v', 'a'), createHash('sha256').update('v\na').digest('hex'));
});

test('lectureLines collects every say once', () => {
  const mods = [{ lessons: [{ lecture: [{ say: 'a' }, { say: 'b' }] }, { blocks: [] }] }, { lessons: [{ lecture: [{ say: 'a' }] }] }];
  assert.deepEqual(lectureLines(mods), ['a', 'b']);
});

test('readingMs: 350 ms per word, at least 2 s', () => {
  assert.equal(readingMs('one two'), 2000);
  assert.equal(readingMs('a b c d e f g h i j'), 3500);
});

test('boardBlock resolves an index or an inline block', () => {
  const lesson = { blocks: [{ type: 'x' }] };
  assert.equal(boardBlock(lesson, { show: 0 }).type, 'x');
  assert.equal(boardBlock(lesson, { show: { type: 'board', tex: 'x' } }).type, 'board');
  assert.equal(boardBlock(lesson, { say: 'hi' }), null);
});
