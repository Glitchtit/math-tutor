// Pages built on skill generators: fading practice ladder, placement test, Foundations list,
// mixed (interleaved) practice, spaced review and "compare two methods".

import { h, renderMath } from './util.js';
import { renderPart, renderStepList } from './blocks.js';
import { SKILLS, COMPARE, skillById, topoOrder, generate, rng, newSeed } from './skills/index.js';
import { progress } from './progress.js';
import { MODULES } from './content/index.js';
import { isPlainNumber } from './check.js';

// skill answers that are plain numbers must be entered as plain numbers (no typing the calculation back)
const asked = (part) => (part.kind === 'numeric' && isPlainNumber(part.answer) ? { ...part, plain: true } : part);
import { drillsOf } from './train-core.js';
import { runDrill } from './train.js';

const modById = Object.fromEntries(MODULES.map((m) => [m.id, m]));
const STAGES = ['Worked example', 'Finish the last step', 'Finish from halfway', 'On your own'];
const STAGE_HELP = [
  'Read the worked example one step at a time. Use "I don\'t follow this step" whenever a line is not clear.',
  'New numbers. Everything is worked except the end: finish it and enter the answer.',
  'Only the first half is worked now. Finish the rest yourself.',
  'Just the problem. Solve it on paper, then enter the answer.',
];
const shownSteps = (stage, n) => (stage === 1 ? n - 1 : stage === 2 ? Math.floor(n / 2) : 0);
const dateStr = (t) => new Date(t).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
const html = (el, s) => { el.innerHTML = s; renderMath(el); return el; };

export function skillStatus(id) {
  const st = progress.skill(id), rv = progress.reviewOf(`skill:${id}`);
  if (rv && rv.due <= Date.now()) return { text: 'review due', cls: 'due' };
  if (st.mastered) return { text: 'mastered', cls: 'ok' };
  if (st.stage > 0) return { text: `step ${st.stage} of 3`, cls: 'learning' };
  return { text: 'new', cls: 'new' };
}
const chip = (id) => { const s = skillStatus(id); return h('span', { class: `skill-chip ${s.cls}` }, s.text); };
const skillLink = (s) => h('a', { class: 'skill-link', href: `#/skill/${s.id}` }, h('span', {}, s.title), chip(s.id));

// one generated problem: statement, the first `shown` steps worked, optional "why?" pick, then the answer box.
// onSolved({ firstTry, helped }) fires once, when the answer is first correct.
function problemCard(skill, prob, { shown = 0, whyPick = false, lockHelp = false, noStatement = false, onSolved }) {
  const card = h('div', { class: 'assignment skill-card' });
  if (!noStatement) card.append(html(h('div', { class: 'prose statement' }), prob.statement));
  if (shown > 0) {
    card.append(h('div', { class: 'steps-kicker' }, shown === prob.steps.length - 1 ? 'Worked up to the last step' : 'Worked so far'));
    const list = renderStepList(card, prob.steps.slice(0, shown), { oneAtATime: false, context: prob.statement });
    if (whyPick) addWhyPick(list, prob, skill);
  }
  let tries = 0, helped = false, solved = false;
  const part = { ...asked(prob.part), hints: prob.hints, walkthrough: prob.steps, prompt: shown > 0 ? 'Finish the solution, then enter the answer.' : '' };
  card.append(renderPart(part, null, {
    statement: prob.statement, title: skill.title, lockHelp,
    onHelp: () => { helped = true; },
    onResult: (r) => { if (solved || !r || r.error) return; tries++; if (r.ok) { solved = true; onSolved?.({ firstTry: tries === 1, helped }); } },
  }));
  return card;
}

// hide the reason of one worked step and ask for it: 3 choices, the others taken from different rules
function addWhyPick(list, prob, skill) {
  const items = [...list.querySelectorAll('li')];
  const r = rng(newSeed());
  const i = r.int(0, items.length - 1), real = prob.steps[i].why;
  const own = new Set(prob.steps.map((s) => s.why)); // reasons of this problem's other steps would be ambiguous
  const pool = [...SKILLS.filter((s) => s.id !== skill.id).flatMap((s) => { try { return generate(s, r.int(1, 1e6)).steps.map((x) => x.why); } catch { return []; } })]
    .filter((w, k, a) => !own.has(w) && a.indexOf(w) === k);
  const opts = r.shuffle([real, ...r.shuffle(pool).slice(0, 2)]);
  const whyEl = items[i].querySelector('.step-why');
  if (!whyEl || opts.length < 2) return;
  whyEl.classList.add('hidden');
  const fb = h('div', { class: 'feedback' });
  const box = h('div', { class: 'why-pick' }, h('div', { class: 'small' }, h('b', {}, 'Why is this step allowed?')),
    ...opts.map((w) => h('button', { class: 'btn btn-small why-opt', onclick: () => {
      box.querySelectorAll('button').forEach((b) => { b.disabled = true; });
      const ok = w === real;
      fb.className = `feedback ${ok ? 'ok' : 'bad'}`;
      html(fb, ok ? '<b>Right.</b>' : `<b>Not quite.</b> The reason: ${real}`);
      whyEl.classList.remove('hidden');
    } }, html(h('span'), w))), fb);
  items[i].append(box);
  renderMath(box);
}

// ------------------------------------------------------------------ skill page (fading ladder)

export function renderSkillPage(wrap, id) {
  const skill = skillById[id];
  const st = () => progress.skill(id);
  const head = h('div');
  const body = h('div');
  wrap.append(head, body);
  let misses = 0;

  function drawHead() {
    const s = st(), m = skill.module && modById[skill.module];
    const pips = h('div', { class: 'stage-pips' }, ...STAGES.map((t, i) => h('span', { class: `stage-pip ${i < s.stage || s.mastered ? 'on' : ''} ${i === s.stage && !s.mastered ? 'cur' : ''}`, title: t }, t)));
    const pre = (skill.prereqs || []).map((p) => skillById[p]).filter(Boolean);
    head.replaceChildren(
      h('p', { class: 'muted' }, skill.blurb),
      pips,
      pre.length ? h('div', { class: 'skill-prereqs small' }, h('span', { class: 'muted' }, 'Builds on: '), ...pre.map(skillLink)) : '',
      m ? h('div', { class: 'small' }, h('span', { class: 'muted' }, 'Taught in: '), h('a', { href: skill.lesson ? `#/module/${m.id}/learn/${skill.lesson}` : `#/module/${m.id}` }, `Module ${m.number}: ${m.title}`)) : '',
      s.mastered ? h('div', { class: 'callout key' }, h('div', { class: 'callout-title' }, 'Mastered ✓'), h('div', {}, reviewLine(`skill:${id}`))) : '');
  }

  function draw() {
    drawHead();
    const s = st(), stage = Math.min(s.stage, 3);
    const prob = generate(skill);
    body.replaceChildren(h('h2', {}, `${STAGES[stage]}`), h('p', { class: 'muted small' }, STAGE_HELP[stage]));
    if (stage === 0) {
      const ex = h('div', { class: 'blk-steps' }, h('div', { class: 'steps-kicker' }, 'Worked example'));
      ex.append(html(h('div', { class: 'steps-problem prose' }), prob.statement));
      renderStepList(ex, prob.steps, { context: prob.statement });
      body.append(ex, h('div', { class: 'row' },
        h('button', { class: 'btn btn-primary', onclick: () => { progress.setSkill(id, { stage: 1 }); draw(); } }, 'I followed it, give me one to try →'),
        h('button', { class: 'btn btn-ghost', onclick: draw }, 'Another worked example')));
      return;
    }
    const out = h('div');
    body.append(problemCard(skill, prob, { shown: shownSteps(stage, prob.steps.length), whyPick: stage < 3, onSolved: ({ firstTry, helped }) => {
      const clean = firstTry && !helped;
      let msg;
      if (clean) {
        misses = 0;
        if (stage < 3) { progress.setSkill(id, { stage: stage + 1 }); msg = `Clean! Next: ${STAGES[stage + 1].toLowerCase()}.`; }
        else if (!s.mastered) { progress.setSkill(id, { mastered: Date.now() }); progress.schedule(`skill:${id}`, true); msg = 'Solved on your own, first try. Skill mastered — it will come back for review so you keep it.'; }
        else msg = 'Clean again.';
      } else {
        misses++;
        if (misses >= 2 && stage > 1) { progress.setSkill(id, { stage: stage - 1 }); misses = 0; msg = 'Two in a row needed help, so the next one gives you more of the working again. That is how it should go.'; }
        else msg = 'Solved, with help or a retry. Do one more at this level to move up.';
      }
      out.replaceChildren(h('div', { class: `feedback ${clean ? 'ok' : ''}` }, msg), h('div', { class: 'row' },
        h('button', { class: 'btn btn-primary', onclick: draw }, 'Next problem →'),
        h('button', { class: 'btn btn-ghost', onclick: () => { progress.setSkill(id, { stage: 0 }); draw(); } }, 'Show me a worked example again')));
      drawHead();
    } }), out);
  }
  draw();
}

function reviewLine(key) {
  const rv = progress.reviewOf(key);
  if (!rv) return 'Not scheduled for review.';
  return rv.due <= Date.now() ? 'Due for review now.' : `Next review: ${dateStr(rv.due)}.`;
}

// ------------------------------------------------------------------ skills list (Foundations + calculus)

export function renderSkillsPage(wrap) {
  const found = topoOrder(SKILLS.filter((s) => s.area === 'foundations'));
  const placed = found.some((s) => progress.skill(s.id).placed !== undefined);
  wrap.append(
    h('div', { class: 'card' }, h('h3', {}, placed ? 'Placement test done' : 'Not sure where to start?'),
      h('p', { class: 'muted' }, placed ? 'You can take it again any time; skills you get right are marked mastered and scheduled for review.' : 'About 15 short questions, one per algebra skill. It finds the gaps and tells you where to begin. No hints, and "I don\'t know" is a fine answer.'),
      h('a', { class: `btn ${placed ? '' : 'btn-primary'}`, href: '#/placement' }, placed ? 'Retake the placement test' : 'Take the placement test')),
    h('h2', {}, 'Foundations: the algebra calculus uses'),
    h('p', { class: 'muted small' }, 'In order: each skill builds on the ones above it. Every skill goes worked example → finish the last step → finish from halfway → on your own.'),
    h('div', { class: 'skill-list' }, ...found.map(skillLink)));
  const byMod = MODULES.filter((m) => SKILLS.some((s) => s.module === m.id));
  if (byMod.length) {
    wrap.append(h('h2', {}, 'Calculus skills'));
    for (const m of byMod) wrap.append(h('h3', { class: 'train-lesson' }, `Module ${m.number}: ${m.title}`), h('div', { class: 'skill-list' }, ...SKILLS.filter((s) => s.module === m.id).map(skillLink)));
  }
}

// skills section for a module page: practice with new numbers + foundations it needs
export function moduleSkillsSection(m) {
  const mine = SKILLS.filter((s) => s.module === m.id);
  const needs = [...new Set(mine.flatMap((s) => s.prereqs || []))].map((p) => skillById[p]).filter((s) => s && s.area === 'foundations');
  const compares = COMPARE.filter((c) => c.module === m.id);
  if (!mine.length && !needs.length && !compares.length) return null;
  return h('section', { class: 'mod-skills' },
    mine.length ? h('div', {}, h('h3', {}, 'Practice with new numbers'), h('p', { class: 'muted small' }, 'Fresh numbers every time, with the worked solution fading away as you improve.'), h('div', { class: 'skill-list' }, ...mine.map(skillLink))) : '',
    needs.length ? h('div', {}, h('h3', {}, 'Algebra this module uses'), h('div', { class: 'skill-list' }, ...needs.map(skillLink))) : '',
    compares.length ? h('div', {}, h('h3', {}, 'Compare two methods'), h('ul', { class: 'lesson-list' }, ...compares.map((c) => h('li', {}, h('a', { href: `#/compare/${c.id}` }, c.title), progress.isDone(`compare/${c.id}`) ? h('span', { class: 'check' }, '✓') : '')))) : '');
}

// ------------------------------------------------------------------ placement test

export function renderPlacementPage(wrap) {
  const list = topoOrder(SKILLS.filter((s) => s.area === 'foundations'));
  const failed = new Set(), missed = new Set(), passed = []; // missed: answered wrong (skips only its direct follow-ups)
  let i = 0;
  const box = h('div'), counter = h('div', { class: 'muted small' });
  wrap.append(counter, box);

  function record(s, ok) {
    if (ok) { passed.push(s); progress.setSkill(s.id, { stage: 3, mastered: progress.skill(s.id).mastered || Date.now(), placed: true }); if (!progress.reviewOf(`skill:${s.id}`)) progress.schedule(`skill:${s.id}`, true); }
    else { failed.add(s.id); missed.add(s.id); progress.setSkill(s.id, { placed: false }); }
    i++; next();
  }
  function next() {
    while (i < list.length && (list[i].prereqs || []).some((p) => missed.has(p))) { failed.add(list[i].id); progress.setSkill(list[i].id, { placed: false }); i++; } // skip skills right after a missed basic; a skip does not cascade further
    if (i >= list.length) return summary();
    const s = list[i], prob = generate(s);
    counter.textContent = `Question ${i + 1} of ${list.length} · ${s.title}`;
    let answered = false;
    const card = h('div', { class: 'assignment skill-card' }, html(h('div', { class: 'prose statement' }), prob.statement));
    card.append(renderPart({ ...asked(prob.part), prompt: '' }, null, { statement: prob.statement, title: s.title, onResult: (r) => {
      if (answered || !r || r.error) return; answered = true;
      setTimeout(() => record(s, r.ok), r.ok ? 700 : 1400);
    } }));
    card.querySelectorAll('.row .btn-ghost').forEach((b) => b.remove()); // no hints, solutions or coaching in a placement test
    card.append(h('div', { class: 'row' }, h('button', { class: 'btn btn-ghost', onclick: () => { if (!answered) { answered = true; record(s, false); } } }, "I don't know")));
    box.replaceChildren(card);
    renderMath(card);
  }
  function summary() {
    const weak = list.filter((s) => failed.has(s.id));
    counter.textContent = 'Done';
    box.replaceChildren(
      h('h2', {}, weak.length ? 'Here is where to start' : 'All foundations in place'),
      h('p', {}, `${passed.length} of ${list.length} skills already solid.${weak.length ? ' Work through the rest in this order; each one builds on the previous.' : ' Go straight to the calculus modules — reviews will keep the algebra fresh.'}`),
      weak.length ? h('div', { class: 'skill-list' }, ...weak.map(skillLink)) : '',
      h('div', { class: 'row' }, weak.length ? h('a', { class: 'btn btn-primary', href: `#/skill/${weak[0].id}` }, `Start: ${weak[0].title} →`) : h('a', { class: 'btn btn-primary', href: '#/' }, 'Go to the course map'), h('a', { class: 'btn btn-ghost', href: '#/skills' }, 'All skills')));
  }
  next();
}

// ------------------------------------------------------------------ mixed practice (interleaved, "which method?")

function methodChoices(skill, r) {
  const same = [...new Set(SKILLS.filter((s) => s.family === skill.family && s.method !== skill.method).map((s) => s.method))];
  const other = [...new Set(SKILLS.filter((s) => s.family !== skill.family && s.area === skill.area).map((s) => s.method))].filter((x) => x !== skill.method);
  const wrong = [...r.shuffle(same), ...r.shuffle(other)].slice(0, 3);
  return r.shuffle([skill.method, ...wrong]);
}

export function mixedPool() { return SKILLS.filter((s) => progress.skill(s.id).stage >= 1 || progress.skill(s.id).mastered); }

export function renderMixedPage(wrap, count = 8) {
  const pool = mixedPool();
  if (pool.length < 3) {
    wrap.append(h('div', { class: 'card' }, h('h3', {}, 'Practise a few skills first'),
      h('p', {}, `Mixed practice shuffles problems from skills you have started, so you have to recognise which method each one needs. You have started ${pool.length} so far; start at least 3.`),
      h('a', { class: 'btn btn-primary', href: '#/skills' }, 'Go to skills')));
    return;
  }
  const r = rng(newSeed());
  // interleave: never the same skill twice in a row; favour skills that share a family with another pool skill
  const weight = (s) => 1 + pool.filter((x) => x.family === s.family && x.id !== s.id).length + (progress.skill(s.id).mastered ? 0 : 1);
  const seq = [];
  while (seq.length < count) {
    const cands = pool.filter((s) => s !== seq[seq.length - 1]);
    const total = cands.reduce((a, s) => a + weight(s), 0);
    let x = r.next() * total;
    seq.push(cands.find((s) => (x -= weight(s)) < 0) || cands[0]);
  }
  let i = 0, methodsRight = 0, clean = 0;
  const counter = h('div', { class: 'muted small' }), box = h('div');
  wrap.append(counter, box);

  function next() {
    if (i >= seq.length) {
      box.replaceChildren(h('h2', {}, 'Session done'), h('p', {}, `Method chosen right: ${methodsRight} of ${seq.length}. Solved first try without help: ${clean} of ${seq.length}.`),
        h('p', { class: 'muted small' }, 'Problems you missed come back in your review queue tomorrow.'),
        h('div', { class: 'row' }, h('a', { class: 'btn btn-primary', href: '#/mixed', onclick: () => setTimeout(() => window.dispatchEvent(new HashChangeEvent('hashchange')), 0) }, 'Another session'), h('a', { class: 'btn btn-ghost', href: '#/review' }, 'Review queue')));
      return;
    }
    const s = seq[i], prob = generate(s);
    counter.textContent = `Problem ${i + 1} of ${seq.length}`;
    const card = h('div', { class: 'assignment skill-card' }, html(h('div', { class: 'prose statement' }), prob.statement));
    const fb = h('div', { class: 'feedback' }), solveBox = h('div'), after = h('div');
    const choices = methodChoices(s, r);
    const q = h('div', { class: 'why-pick' }, h('div', {}, h('b', {}, 'Which method does this need?')), ...choices.map((c) => h('button', { class: 'btn btn-small why-opt', onclick: () => {
      q.querySelectorAll('button').forEach((b) => { b.disabled = true; b.classList.toggle('btn-primary', b.textContent === s.method); });
      const ok = c === s.method;
      if (ok) methodsRight++;
      fb.className = `feedback ${ok ? 'ok' : 'bad'}`;
      fb.replaceChildren(h('b', {}, ok ? 'Yes. ' : 'Not this time. '), `It is: ${s.method} (${s.title}). Now solve it.`);
      solveBox.append(problemCard(s, prob, { lockHelp: true, noStatement: true, onSolved: ({ firstTry, helped }) => {
        const good = firstTry && !helped && ok;
        if (good) clean++;
        if (!good && (progress.skill(s.id).mastered || progress.reviewOf(`skill:${s.id}`))) progress.schedule(`skill:${s.id}`, false);
        after.replaceChildren(h('div', { class: 'row' }, h('button', { class: 'btn btn-primary', onclick: () => { i++; next(); } }, i + 1 < seq.length ? 'Next problem →' : 'Finish')));
      } }));
      renderMath(solveBox);
    } }, c)), fb);
    card.append(q, solveBox, after);
    box.replaceChildren(card);
    renderMath(card);
  }
  next();
}

// ------------------------------------------------------------------ spaced review

function drillByKey(key) {
  const base = key.replace(/#w$/, ''), m = modById[base.split('/')[0]];
  return m && drillsOf(m).find((d) => d.key === base);
}

export function renderReviewPage(wrap) {
  const keys = progress.dueReviews().filter((k) => (k.startsWith('skill:') ? skillById[k.slice(6)] : drillByKey(k.slice(6))));
  if (!keys.length) {
    const upcoming = nextDue();
    wrap.append(h('div', { class: 'card' }, h('h3', {}, 'Nothing due — well done'),
      h('p', { class: 'muted' }, upcoming ? `Next review: ${dateStr(upcoming)}.` : 'Master a skill or a Train drill and it will be scheduled here: after 1, 3, 7, 21 and 60 days, so it stays in long-term memory.'),
      h('div', { class: 'row' }, h('a', { class: 'btn', href: '#/mixed' }, 'Mixed practice'), h('a', { class: 'btn btn-ghost', href: '#/skills' }, 'Skills'))));
    return;
  }
  let i = 0, kept = 0;
  const counter = h('div', { class: 'muted small' }), box = h('div');
  wrap.append(counter, box);
  function next() {
    if (i >= keys.length) {
      box.replaceChildren(h('h2', {}, 'Review done'), h('p', {}, `${kept} of ${keys.length} remembered cleanly. Missed items come back tomorrow; the rest move further out.`), h('a', { class: 'btn btn-primary', href: '#/' }, 'Back to the course map'));
      return;
    }
    const key = keys[i];
    counter.textContent = `Review ${i + 1} of ${keys.length}`;
    const advance = (ok) => { progress.schedule(key, ok); if (ok) kept++; i++; };
    if (key.startsWith('skill:')) {
      const s = skillById[key.slice(6)], after = h('div');
      box.replaceChildren(h('h3', {}, s.title), problemCard(s, generate(s), { onSolved: ({ firstTry, helped }) => {
        const ok = firstTry && !helped;
        after.replaceChildren(h('div', { class: `feedback ${ok ? 'ok' : ''}` }, ok ? `Remembered. Next time in ${[1, 3, 7, 21, 60][Math.min((progress.reviewOf(key)?.step ?? -1) + 1, 4)]} days.` : 'Needed help or a retry, so it comes back tomorrow.'),
          h('button', { class: 'btn btn-primary', onclick: () => { advance(ok); next(); } }, 'Next →'));
      } }), after);
      renderMath(box);
    } else {
      const k = key.slice(6), d = drillByKey(k), run = h('div', { class: 'train' });
      box.replaceChildren(h('h3', {}, 'Train drill (recall)'), run);
      runDrill(run, d, 2, (clean) => { if (clean === null) return { list: () => { location.hash = '#/'; } }; advance(clean); return { next, again: () => { i--; kept -= clean ? 1 : 0; next(); }, list: () => { location.hash = '#/'; } }; }, k.endsWith('#w'));
    }
  }
  next();
}

export const dueCount = () => progress.dueReviews().length;
// timestamp of the next scheduled review, or null
export function nextDue() { const all = progress.dueReviews(Infinity).map((k) => progress.reviewOf(k).due); return all.length ? Math.min(...all) : null; }

// ------------------------------------------------------------------ compare two methods

export function renderComparePage(wrap, id) {
  if (!id) {
    const mods = MODULES.filter((m) => COMPARE.some((c) => c.module === m.id));
    if (!mods.length) wrap.append(h('p', { class: 'muted' }, 'No comparisons yet.'));
    for (const m of mods) wrap.append(h('h3', { class: 'train-lesson' }, `Module ${m.number}: ${m.title}`),
      h('ul', { class: 'lesson-list' }, ...COMPARE.filter((c) => c.module === m.id).map((c) => h('li', {}, h('a', { href: `#/compare/${c.id}` }, c.title), progress.isDone(`compare/${c.id}`) ? h('span', { class: 'check' }, '✓') : ''))));
    return;
  }
  const c = COMPARE.find((x) => x.id === id);
  if (!c) { wrap.append(h('p', {}, 'Not found.')); return; }
  wrap.append(html(h('div', { class: 'prose statement' }), c.problem));
  const cols = h('div', { class: 'compare-cols' });
  c.methods.forEach((m, k) => {
    const col = h('div', { class: 'blk-steps' }, h('div', { class: 'steps-kicker' }, `Method ${k + 1}`), h('div', { class: 'steps-title' }, m.name));
    renderStepList(col, m.steps, { oneAtATime: false, context: `${c.problem} (${m.name})` });
    cols.append(col);
  });
  const fb = h('div', { class: 'feedback' });
  const q = h('div', { class: 'blk-quiz' }, html(h('div', { class: 'quiz-q' }), c.question), ...c.choices.map((ch, k) => h('button', { class: 'btn why-opt', onclick: () => {
    q.querySelectorAll('button').forEach((b, j) => { b.disabled = true; if (j === c.answer) b.classList.add('btn-primary'); });
    fb.className = `feedback ${k === c.answer ? 'ok' : 'bad'}`;
    html(fb, `<b>${k === c.answer ? 'Yes.' : 'Not quite.'}</b> ${c.explain}`);
    progress.markDone(`compare/${c.id}`);
  } }, html(h('span'), ch))), fb);
  wrap.append(cols, q);
  renderMath(wrap);
}
