// Content validator: renders every formula with KaTeX, compiles every widget expression,
// runs every MATLAB snippet and verifies every answer key.
//
//   node tests/validate-content.mjs            # all modules
//   node tests/validate-content.mjs 07-ftc ftc # only modules whose id matches

import katex from '../vendor/katex/katex.mjs';
import { MODULES, PARTS, COURSES } from '../js/content/index.js';
import { REFERENCE } from '../js/content/reference.js';
import { WIDGET_NAMES } from '../js/widgets.js';
import { compile } from '../js/matlab/compile.js';
import { Matlab } from '../js/matlab/interp.js';
import { runMatlabChecks } from '../js/matlab/checks.js';
import { checkPart } from '../js/check.js';
import { parse } from '../js/matlab/parser.js';

// expression-valued widget config keys and the variables they use
const EXPR_KEYS = {
  f: ['x'], F: ['x'], df: ['x'], d2f: ['x'], g: ['x'], u: ['x'], fu: ['u'], exact: ['x'], integralTest: ['x'],
  term: ['n'], coef: ['k'], force: ['t'], solution: ['x', 'C'],
};

const LOST_BACKSLASH = /(^|[^\\a-zA-Z])(d?frac|sqrt|infty|cdot|mathrm|mathbb|lim|sum|int|left|right|alpha|beta|gamma|theta|varepsilon|epsilon|omega|sin|cos|tan|exp|ln|quad|text|approx|times|pm|Big|begin|end)(?![a-zA-Z])/;

function texErrors(src, where, issues) {
  const lost = LOST_BACKSLASH.exec(src);
  if (lost) issues.push(`${where}: "${lost[2]}" without a backslash in "${src.slice(0, 80)}" — a non-raw JS string ate the backslash? Use String.raw.`);
  try { katex.renderToString(src, { throwOnError: true, strict: 'ignore', displayMode: true }); } catch (e) {
    issues.push(`${where}: LaTeX error in "${src.slice(0, 80)}": ${e.message.replace(/^KaTeX parse error: /, '')}`);
  }
}

function mathIn(html, where, issues) {
  if (html === undefined || html === null) return;
  const s = String(html);
  if (s.includes('${')) issues.push(`${where}: contains "\${" — template literal interpolation leaked into content?`);
  let rest = s;
  rest = rest.replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => { texErrors(m, where, issues); return ' '; });
  rest = rest.replace(/\\\[([\s\S]+?)\\\]/g, (_, m) => { texErrors(m, where, issues); return ' '; });
  rest = rest.replace(/\$([^$]+?)\$/g, (_, m) => { texErrors(m, where, issues); return ' '; });
  if (rest.includes('$')) issues.push(`${where}: unbalanced "$" in text`);
}

function checkExprString(expr, params, where, issues, samples) {
  if (typeof expr !== 'string') return;
  let fn;
  try { fn = compile(expr, params); } catch (e) { issues.push(`${where}: expression "${expr}" does not parse: ${e.message}`); return; }
  const pts = samples || [0.3, 0.7, 1.3, 2.1, -0.6];
  let finite = 0;
  for (const x of pts) {
    try { const v = fn(...params.map((p, i) => (i === 0 ? x : 1))); if (Number.isFinite(v)) finite++; } catch { /* ignore */ }
  }
  if (!finite) issues.push(`${where}: expression "${expr}" is not finite at any test point (check syntax / variable names ${params.join(',')})`);
}

function checkWidget(b, where, issues) {
  if (!WIDGET_NAMES.includes(b.name)) { issues.push(`${where}: unknown widget "${b.name}"`); return; }
  const cfg = b.config || {};
  const params = Object.keys(cfg.params || {});
  for (const [k, vars] of Object.entries(EXPR_KEYS)) {
    if (k in cfg && typeof cfg[k] === 'string') {
      let v = vars;
      if (b.name === 'ode' && k === 'exact') v = ['t'];
      if (b.name === 'parts') continue;
      if (k === 'F' && ['ode', 'slopefield', 'euler'].includes(b.name)) continue;
      checkExprString(cfg[k], [...v, ...params], `${where} widget ${b.name}.${k}`, issues);
    }
  }
  if (b.name === 'sequence' && typeof cfg.a === 'string') checkExprString(cfg.a, ['n'], `${where} widget sequence.a`, issues, [1, 2, 5, 10]);
  if (b.name === 'sequence' && cfg.recursive) checkExprString(cfg.recursive.next, ['a', 'n'], `${where} widget sequence.next`, issues, [1, 2]);
  if (b.name === 'parts') { checkExprString(cfg.u, ['t'], `${where} widget parts.u`, issues); checkExprString(cfg.v, ['t'], `${where} widget parts.v`, issues); }
  if (b.name === 'slopefield' || b.name === 'euler') checkExprString(cfg.F, ['x', 'y', ...params], `${where} widget ${b.name}.F`, issues);
  if (b.name === 'ode') {
    if (cfg.F) checkExprString(cfg.F, ['t', 'y', ...params], `${where} widget ode.F`, issues);
    if (cfg.F2) checkExprString(cfg.F2, ['t', 'y', 'v', ...params], `${where} widget ode.F2`, issues);
  }
  if (b.name === 'plot') {
    (cfg.functions || []).forEach((f, i) => { checkExprString(f.expr, ['x', ...params], `${where} widget plot.functions[${i}]`, issues); mathIn(f.label, `${where} label`, issues); });
    if (cfg.shade) checkExprString(cfg.shade.expr, ['x', ...params], `${where} widget plot.shade`, issues);
    if (cfg.slopeField) checkExprString(cfg.slopeField, ['x', 'y', ...params], `${where} widget plot.slopeField`, issues);
    if (cfg.animate && !params.includes(cfg.animate.param)) issues.push(`${where}: animate.param "${cfg.animate.param}" is not a param`);
  }
  if (b.name === 'partialFractions') (cfg.terms || []).forEach((t, i) => checkExprString(t.expr, ['x'], `${where} widget terms[${i}]`, issues));
  if (b.name === 'phasor') (cfg.phasors || []).forEach((p, i) => { if (typeof p.amp !== 'number' || typeof p.phase !== 'number') issues.push(`${where}: phasor[${i}] needs numeric amp and phase`); });
  for (const key of ['caption', 'readout', 'title']) if (typeof cfg[key] === 'string' && key !== 'readout') mathIn(cfg[key], `${where} widget ${key}`, issues);
}

function runCode(code, where, issues, interp) {
  const m = interp || new Matlab();
  const r = m.run(code, { keepFigures: false });
  r.outputs.filter((o) => o.type === 'error').forEach((o) => issues.push(`${where}: MATLAB error${o.line ? ` (line ${o.line})` : ''}: ${o.text}`));
  return r;
}

function checkLiveBlocks(blocks, where, issues) {
  const m = new Matlab();
  for (const b of blocks) {
    if (b.type === 'code' && /\bfunction\b/.test(b.content)) {
      try { Object.assign(m.functions, parse(b.content).functions); } catch { /* reported when run */ }
    }
  }
  blocks.forEach((b, i) => {
    const w = `${where} livescript[${i}]`;
    if (b.type === 'equation') texErrors(b.content, w, issues);
    else if (b.type === 'text') mathIn(b.content, w, issues);
    else if (b.type === 'code' && !b.expectError) runCode(b.content, w, issues, m);
  });
}

export function validateBlocks(blocks, where, issues) {
  (blocks || []).forEach((b, i) => {
    const w = `${where} block[${i}](${b.type})`;
    switch (b.type) {
      case 'text': mathIn(b.html, w, issues); break;
      case 'md': mathIn(b.md, w, issues); break;
      case 'callout': mathIn(b.html, w, issues); mathIn(b.title, w, issues); break;
      case 'widget': checkWidget(b, w, issues); break;
      case 'table': (b.head || []).forEach((c) => mathIn(c, w, issues)); (b.rows || []).flat().forEach((c) => mathIn(c, w, issues)); break;
      case 'steps': mathIn(b.title, w, issues); (b.steps || []).forEach((s) => mathIn(s, w, issues)); break;
      case 'quiz':
        mathIn(b.question, w, issues); (b.choices || []).forEach((c) => mathIn(c, w, issues)); mathIn(b.explain, w, issues);
        if (!Array.isArray(b.choices) || b.choices.length < 2) issues.push(`${w}: quiz needs at least 2 choices`);
        for (const a of [].concat(b.answer)) if (!(Number.isInteger(a) && a >= 0 && a < (b.choices || []).length)) issues.push(`${w}: quiz answer index ${a} out of range`);
        break;
      case 'latex':
        mathIn(b.prompt, w, issues); texErrors(b.target, w, issues); (b.accept || []).forEach((t) => texErrors(t, w, issues));
        break;
      case 'code': if (!b.expectError) runCode(b.code, w, issues); mathIn(b.caption, w, issues); break;
      case 'matlab': {
        mathIn(b.prompt, w, issues);
        if (!b.solution) { issues.push(`${w}: matlab exercise has no solution`); break; }
        if (/\.\.\.\s*;?\s*($|%)/m.test(b.starter || '')) issues.push(`${w}: starter uses "..." as a placeholder, but "..." is MATLAB line continuation — use e.g. "f = @(x) 0;  % replace 0 by the formula"`);
        const { problems } = runMatlabChecks(b.solution, b.checks || []);
        problems.forEach((p) => issues.push(`${w}: model solution fails its own check: ${p}`));
        break;
      }
      case 'livescript': checkLiveBlocks(b.blocks || [], w, issues); break;
      case 'answer': validatePart(b.part, w, issues); break;
      default: issues.push(`${w}: unknown block type`);
    }
  });
}

function validatePart(p, w, issues) {
  mathIn(p.prompt, w, issues); mathIn(p.hint, w, issues); mathIn(p.solution, w, issues); mathIn(p.feedback, w, issues);
  (p.choices || []).forEach((c) => mathIn(c, w, issues));
  if (p.kind === 'numeric') {
    const r = checkPart(p, typeof p.answer === 'number' ? String(p.answer) : String(p.answer));
    if (!r.ok) issues.push(`${w}: numeric answer key "${p.answer}" does not check against itself (${r.error || 'mismatch'})`);
  } else if (p.kind === 'expression') {
    const r = checkPart(p, String(p.answer));
    if (!r.ok) issues.push(`${w}: expression answer key "${p.answer}" does not check against itself (${r.error || 'mismatch'})`);
    if (p.alt) for (const alt of [].concat(p.alt)) { const r2 = checkPart(p, alt); if (!r2.ok) issues.push(`${w}: alternative form "${alt}" is not accepted (${r2.error || 'mismatch'})`); }
  } else if (p.kind === 'choice') {
    if (!(Number.isInteger(p.answer) && p.answer >= 0 && p.answer < (p.choices || []).length)) issues.push(`${w}: choice answer index invalid`);
  } else if (p.kind !== 'writeup') issues.push(`${w}: unknown part kind "${p.kind}"`);
}

export function validateModule(m) {
  const issues = [];
  const w = `[${m.id}]`;
  for (const f of ['id', 'number', 'part', 'title', 'summary']) if (m[f] === undefined) issues.push(`${w}: missing field ${f}`);
  if (!PARTS.some((p) => p.id === m.part && p.course === m.course)) issues.push(`${w}: part "${m.part}" not defined for course ${m.course}`);
  mathIn(m.intro, `${w} intro`, issues);
  const seen = new Set();
  for (const [kind, list] of [['learn', m.lessons], ['matlab', m.matlab]]) {
    for (const l of list || []) {
      if (seen.has(kind + l.id)) issues.push(`${w}: duplicate ${kind} id ${l.id}`);
      seen.add(kind + l.id);
      if (!/^[a-z0-9-]+$/.test(l.id)) issues.push(`${w}: id "${l.id}" should be lowercase-kebab`);
      validateBlocks(l.blocks, `${w} ${kind}/${l.id}`, issues);
    }
  }
  for (const a of m.assignments || []) {
    const aw = `${w} assign/${a.id}`;
    if (seen.has('a' + a.id)) issues.push(`${w}: duplicate assignment id ${a.id}`);
    seen.add('a' + a.id);
    mathIn(a.statement, aw, issues);
    if (a.blocks) validateBlocks(a.blocks, aw, issues);
    (a.parts || []).forEach((p, i) => validatePart(p, `${aw} part[${i}]`, issues));
    if (a.solution) checkLiveBlocks(a.solution, `${aw} solution`, issues);
    if (a.writeupTemplate) checkLiveBlocks(a.writeupTemplate.filter((b) => b.type !== 'code'), `${aw} template`, issues);
  }
  return issues;
}

export function validateAll(filter = []) {
  const issues = [];
  const ids = new Set();
  for (const m of MODULES) {
    if (ids.has(m.id)) issues.push(`duplicate module id ${m.id}`);
    ids.add(m.id);
    if (!COURSES.some((c) => c.id === m.course)) issues.push(`[${m.id}] unknown course ${m.course}`);
    if (filter.length && !filter.some((f) => m.id.includes(f))) continue;
    issues.push(...validateModule(m));
  }
  if (!filter.length) validateBlocks(REFERENCE, '[reference]', issues);
  return issues;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const issues = validateAll(process.argv.slice(2));
  if (issues.length) {
    console.log(issues.join('\n'));
    console.log(`\n${issues.length} issue(s).`);
    process.exit(1);
  }
  console.log('Content OK.');
}
