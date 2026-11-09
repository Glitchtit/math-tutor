import test from 'node:test';
import assert from 'node:assert/strict';
import katex from '../vendor/katex/katex.mjs';
import { SKILLS, COMPARE, skillById, topoOrder, generate } from '../js/skills/index.js';
import { MODULES } from '../js/content/index.js';
import { checkPart, isPlainNumber } from '../js/check.js';

const SEEDS = 40;
const modIds = new Set(MODULES.map((m) => m.id));

function mathErrors(html) {
  const errs = [];
  let rest = String(html ?? '');
  if (rest.includes('${')) errs.push('template interpolation leaked: ${');
  const tex = (m) => { try { katex.renderToString(m, { throwOnError: true, strict: 'ignore', displayMode: true }); } catch (e) { errs.push(`${e.message} in "${m.slice(0, 80)}"`); } return ' '; };
  rest = rest.replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => tex(m)).replace(/\$([^$]+?)\$/g, (_, m) => tex(m));
  if (rest.includes('$')) errs.push('unbalanced $');
  if (/NaN|undefined|Infinity/.test(String(html))) errs.push(`NaN/undefined/Infinity in "${String(html).slice(0, 80)}"`);
  return errs;
}

test('skill registry: unique ids, known prereqs and modules, no cycles', () => {
  const ids = SKILLS.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate skill ids');
  for (const s of SKILLS) {
    for (const k of ['id', 'title', 'area', 'method', 'family', 'blurb']) assert.ok(s[k], `${s.id}: missing ${k}`);
    assert.ok(['foundations', 'calculus'].includes(s.area), `${s.id}: area`);
    if (s.area === 'calculus') assert.ok(modIds.has(s.module), `${s.id}: unknown module ${s.module}`);
    for (const p of s.prereqs || []) assert.ok(skillById[p], `${s.id}: unknown prereq ${p}`);
  }
  const order = topoOrder().map((s) => s.id);
  for (const s of SKILLS) for (const p of s.prereqs || []) assert.ok(order.indexOf(p) < order.indexOf(s.id), `${s.id} before prereq ${p}`);
  // a cycle would make some skill its own ancestor
  const anc = (id, seen = new Set()) => { for (const p of skillById[id].prereqs || []) { if (p === id || seen.has(p)) continue; seen.add(p); anc(p, seen); } return seen; };
  for (const s of SKILLS) assert.ok(!anc(s.id).has(s.id), `${s.id}: prerequisite cycle`);
});

test('every generator: valid math, self-consistent answers, varied numbers', () => {
  for (const s of SKILLS) {
    const statements = new Set();
    for (let seed = 1; seed <= SEEDS; seed++) {
      const p = generate(s, seed);
      const where = `${s.id} seed ${seed}`;
      assert.deepEqual(generate(s, seed).statement, p.statement, `${where}: not deterministic`);
      statements.add(p.statement);
      for (const e of mathErrors(p.statement)) assert.fail(`${where} statement: ${e}`);
      assert.ok(Array.isArray(p.steps) && p.steps.length >= 2, `${where}: needs at least 2 steps`);
      p.steps.forEach((st, i) => {
        assert.ok(st.do && st.why, `${where} step ${i}: needs do and why`);
        for (const e of [...mathErrors(st.do), ...mathErrors(st.why)]) assert.fail(`${where} step ${i}: ${e}`);
      });
      for (const hnt of p.hints || []) for (const e of mathErrors(hnt)) assert.fail(`${where} hint: ${e}`);
      const part = p.part;
      assert.ok(['numeric', 'expression', 'choice'].includes(part.kind), `${where}: part kind`);
      if (part.kind === 'choice') {
        assert.ok(part.choices.length >= 2 && Number.isInteger(part.answer) && part.answer >= 0 && part.answer < part.choices.length, `${where}: choice answer index`);
        assert.equal(new Set(part.choices).size, part.choices.length, `${where}: duplicate choices`);
        part.choices.forEach((c) => { for (const e of mathErrors(c)) assert.fail(`${where} choice: ${e}`); });
        assert.ok(checkPart(part, String(part.answer)).ok, `${where}: own choice rejected`);
      } else {
        const r = checkPart(part, String(part.answer));
        assert.ok(r.ok, `${where}: own answer "${part.answer}" rejected ${r.error || ''}`);
        if (part.kind === 'numeric' && isPlainNumber(part.answer)) assert.ok(checkPart({ ...part, plain: true }, String(part.answer)).ok, `${where}: plain answer rejected in plain mode`);
      }
    }
    assert.ok(statements.size >= Math.min(10, SEEDS / 2), `${s.id}: only ${statements.size} different problems in ${SEEDS} seeds`);
  }
});

test('which-method choices: every family with a calculus skill has at least 2 distinct methods', () => {
  const fam = {};
  for (const s of SKILLS) (fam[s.family] ||= new Set()).add(s.method);
  for (const [f, ms] of Object.entries(fam)) if (SKILLS.some((s) => s.family === f && s.area === 'calculus')) assert.ok(ms.size >= 2, `family ${f} has one method; mixed practice needs alternatives`);
});

test('compare-methods items are well formed', () => {
  for (const c of COMPARE) {
    assert.ok(modIds.has(c.module), `${c.id}: unknown module`);
    assert.equal(c.methods.length, 2, `${c.id}: needs two methods`);
    for (const m of c.methods) { assert.ok(m.name && m.steps.length >= 2, `${c.id}: method steps`); m.steps.forEach((st) => { for (const e of [...mathErrors(st.do), ...mathErrors(st.why)]) assert.fail(`${c.id}: ${e}`); }); }
    for (const e of [...mathErrors(c.problem), ...mathErrors(c.question), ...mathErrors(c.explain), ...c.choices.flatMap(mathErrors)]) assert.fail(`${c.id}: ${e}`);
    assert.ok(Number.isInteger(c.answer) && c.answer < c.choices.length, `${c.id}: answer index`);
  }
});
