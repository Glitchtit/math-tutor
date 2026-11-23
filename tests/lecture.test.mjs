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

// ---- validator rules
import { validateLecture } from './validate-content.mjs';

const lesson = () => ({
  id: 'l',
  blocks: [
    { type: 'widget', name: 'plot', config: { functions: [{ expr: 'a*x' }], params: { a: { min: 0, max: 2, value: 1 } }, xlim: [-1, 1], ylim: [-1, 1] } },
    { type: 'derive', steps: [
      { kind: 'start', label: 's', from: 'x = 1', to: 'x = 1', why: 'w' },
      { kind: 'calc', label: 'c', to: 'x = 1', why: 'w' },
    ] },
    { type: 'guided', problem: 'p', steps: [] },
    { type: 'quiz', question: 'q', choices: ['a', 'b'], answer: 0 },
  ],
  lecture: [
    { say: 'Hello.', show: { type: 'board', tex: 'x^2', html: 'a few words' } },
    { say: 'A graph.', show: 0 },
    { say: 'Make a bigger.', set: { a: 2 } },
    { say: 'Start.', show: 1, step: 0 },
    { say: 'Next.', step: 1 },
    { say: 'Your turn.', show: 2 },
    { say: 'Check.', show: 3 },
  ],
});
const issuesOf = (mut) => { const l = lesson(); mut(l); const out = []; validateLecture(l, 'L', out); return out; };

test('validateLecture: a valid lecture has no issues', () => assert.deepEqual(issuesOf(() => {}), []));
test('validateLecture: say with LaTeX', () => assert.equal(issuesOf((l) => { l.lecture[0].say = 'x is $x$'; }).length, 1));
test('validateLecture: show out of range', () => assert.equal(issuesOf((l) => { l.lecture[1].show = 9; }).length, 2)); // also: widget gone → set has no widget
test('validateLecture: step going backwards', () => assert.equal(issuesOf((l) => { l.lecture[4].step = 0; l.lecture.splice(4, 0, { say: 'x', step: 1 }); }).length, 1));
test('validateLecture: step beyond the derivation', () => assert.equal(issuesOf((l) => { l.lecture[4].step = 5; }).length, 1));
test('validateLecture: set with an unknown param', () => assert.equal(issuesOf((l) => { l.lecture[2].set = { z: 1 }; }).length, 1));
test('validateLecture: set outside the slider range', () => assert.equal(issuesOf((l) => { l.lecture[2].set = { a: 5 }; }).length, 1));
test('validateLecture: long board text', () => assert.equal(issuesOf((l) => { l.lecture[0].show.html = 'word '.repeat(60); }).length, 1));
test('validateLecture: an exercise left out', () => assert.equal(issuesOf((l) => { l.lecture.splice(5, 1); }).length, 1));
test('validateLecture: bad board tex', () => assert.equal(issuesOf((l) => { l.lecture[0].show.tex = '\\frac{'; }).length, 1));

// ---- per-term narration of derive moves
test('lectureLines includes move narration', () => {
  const mods = [{ lessons: [{ lecture: [{ say: 'a', moves: { 't-1': 'b' } }] }] }];
  assert.deepEqual(lectureLines(mods), ['a', 'b']);
});

const moving = () => {
  const l = lesson();
  l.blocks[1] = { type: 'derive', steps: [
    { kind: 'start', label: 's', from: String.raw`x + \T{t-1}{3} = 5`, to: String.raw`x + \T{t-1}{3} = 5`, why: 'w' },
    { kind: 'both', label: 'b', to: String.raw`x = 5 - \T{t-1}{3}`, arrows: { 't-1': '−3 on both sides' }, why: 'w' },
  ] };
  return l;
};
const movingIssues = (mut) => { const l = moving(); mut(l); const out = []; validateLecture(l, 'L', out); return out; };

test('validateLecture: an arrowed move without narration', () => assert.equal(movingIssues(() => {}).length, 1));
test('validateLecture: narrated arrowed move passes', () => assert.deepEqual(movingIssues((l) => { l.lecture[4].moves = { 't-1': 'The 3 crosses over and becomes minus 3.' }; }), []));
test('validateLecture: moves naming a term that does not move', () => assert.equal(movingIssues((l) => { l.lecture[4].moves = { 't-1': 'ok', 'q-9': 'nope' }; }).length, 1));
test('validateLecture: moves without a step', () => assert.equal(movingIssues((l) => { l.lecture[4].moves = { 't-1': 'ok' }; l.lecture[2].moves = { 't-1': 'x' }; }).length, 1));
test('validateLecture: moves with LaTeX', () => assert.equal(movingIssues((l) => { l.lecture[4].moves = { 't-1': '$3$ crosses' }; }).length, 1));
