// Application shell: routing, course map, module/lesson pages, editor, practice, settings.

import { h, renderMath, markdown, store, downloadBlob } from './util.js';
import { MODULES, PARTS, COURSES, HOMEWORK_TEMPLATE } from './content/index.js';
import { renderBlocks, renderAssignment } from './blocks.js';
import { progress, moduleKeys } from './progress.js';
import { LiveScript } from './livescript.js';
import { TutorPanel } from './tutorpanel.js';
import { setCourseOutline, generateAssignments, generateLesson, connectionMode } from './ai.js';
import { REFERENCE } from './content/reference.js';

const main = document.getElementById('main');
const nav = document.getElementById('nav');
setCourseOutline(MODULES, COURSES);

const byId = Object.fromEntries(MODULES.map((m) => [m.id, m]));
const courseById = Object.fromEntries(COURSES.map((c) => [c.id, c]));
let currentCourse = courseById[store.get('course', 'calculus')] ? store.get('course', 'calculus') : COURSES[0].id;
function setCourse(id) {
  if (!courseById[id] || id === currentCourse) return;
  currentCourse = id;
  store.set('course', id);
  buildNav();
}
const courseModules = (id = currentCourse) => MODULES.filter((m) => m.course === id);

// ------------------------------------------------------------------ theme
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', ['light', 'dark', 'auto'].includes(t) ? t : 'dark');
  window.dispatchEvent(new Event('themechange'));
}
applyTheme(store.get('theme', 'dark'));

// ------------------------------------------------------------------ tutor
const tutor = new TutorPanel({
  getPageContext: () => ({ title: `${document.title} [course: ${courseById[currentCourse].title}]`, text: (main.innerText || '').replace(/\n{3,}/g, '\n\n') }),
  getProgressSummary: () => `Current course: ${courseById[currentCourse].title}\n` + progress.summary(courseModules()),
  onNavigate: (hash) => { location.hash = hash; if (window.innerWidth < 900) tutor.close(); },
});
document.getElementById('tutor-btn').addEventListener('click', () => tutor.toggle());
document.getElementById('menu-btn').addEventListener('click', () => document.body.classList.toggle('nav-open'));

// ------------------------------------------------------------------ navigation sidebar
function buildNav() {
  nav.innerHTML = '';
  const sel = h('select', { class: 'course-select', 'aria-label': 'Course' }, ...COURSES.map((c) => h('option', { value: c.id, selected: c.id === currentCourse }, c.title)));
  sel.addEventListener('change', () => { setCourse(sel.value); location.hash = '#/'; });
  nav.appendChild(sel);
  nav.appendChild(h('a', { href: '#/', class: 'nav-home' }, 'Course map'));
  for (const part of PARTS.filter((p) => p.course === currentCourse)) {
    const mods = MODULES.filter((m) => m.part === part.id);
    if (!mods.length) continue;
    const sec = h('div', { class: 'nav-part' }, h('div', { class: 'nav-part-title' }, part.title, part.hw ? h('span', { class: 'nav-hw' }, part.hw) : null));
    mods.forEach((m) => {
      const st = progress.moduleStats(m);
      sec.appendChild(h('a', { href: `#/module/${m.id}`, class: 'nav-mod', 'data-mod': m.id },
        h('span', { class: 'nav-num' }, String(m.number)), h('span', { class: 'nav-name' }, m.title),
        h('span', { class: 'nav-pct', title: `${st.pct}% complete` }, st.pct ? `${st.pct}%` : '')));
    });
    nav.appendChild(sec);
  }
  nav.appendChild(h('div', { class: 'nav-part' }, h('div', { class: 'nav-part-title' }, 'Tools'),
    h('a', { href: '#/editor', class: 'nav-mod' }, h('span', { class: 'nav-num' }, '✎'), h('span', { class: 'nav-name' }, 'Live Script editor')),
    h('a', { href: '#/practice', class: 'nav-mod' }, h('span', { class: 'nav-num' }, '✦'), h('span', { class: 'nav-name' }, 'AI practice & lessons')),
    h('a', { href: '#/reference', class: 'nav-mod' }, h('span', { class: 'nav-num' }, '§'), h('span', { class: 'nav-name' }, 'LaTeX & MATLAB reference')),
    h('a', { href: '#/settings', class: 'nav-mod' }, h('span', { class: 'nav-num' }, '⚙'), h('span', { class: 'nav-name' }, 'Settings & progress'))));
}

function highlightNav(modId) {
  nav.querySelectorAll('a').forEach((a) => a.classList.toggle('active', a.dataset.mod === modId || a.getAttribute('href') === location.hash));
}

// ------------------------------------------------------------------ pages

function page(title, ...children) {
  document.title = `${title} · Calculus Studio`;
  main.innerHTML = '';
  main.append(...children);
  renderMath(main);
  main.scrollTop = 0;
  window.scrollTo(0, 0);
}

function crumbs(...items) {
  return h('nav', { class: 'crumbs', 'aria-label': 'Breadcrumb' }, ...items.flatMap((it, i) => [i ? h('span', { class: 'sep' }, '/') : null, it.href ? h('a', { href: it.href }, it.label) : h('span', {}, it.label)]));
}

function progressBar(pct) {
  return h('div', { class: 'pbar', role: 'progressbar', 'aria-valuenow': pct, 'aria-valuemin': 0, 'aria-valuemax': 100 }, h('div', { class: 'pbar-fill', style: { width: pct + '%' } }));
}

function home() {
  const last = progress.lastVisited();
  const lastLink = last && byId[last.split('/')[0]] ? `#/module/${last}` : null;
  const course = courseById[currentCourse];
  const mods = courseModules();
  const tabs = h('div', { class: 'course-tabs', role: 'tablist' }, ...COURSES.map((c) => h('button', { class: `course-tab ${c.id === currentCourse ? 'active' : ''}`, role: 'tab', 'aria-selected': String(c.id === currentCourse), onclick: () => { setCourse(c.id); home(); } }, h('b', {}, c.title), h('span', {}, c.subtitle))));
  const hero = h('section', { class: 'hero' },
    tabs,
    h('h1', {}, course.title),
    h('p', { class: 'lead' }, course.description),
    h('div', { class: 'row' },
      h('a', { class: 'btn btn-primary', href: (lastLink && byId[last.split('/')[0]].course === currentCourse) ? lastLink : `#/module/${mods[0].id}` }, lastLink && byId[last.split('/')[0]].course === currentCourse ? 'Continue where you left off' : 'Start module 1'),
      h('button', { class: 'btn', onclick: () => { tutor.open(); tutor.focus(); } }, 'Ask the tutor what to focus on'),
      h('a', { class: 'btn btn-ghost', href: '#/editor' }, 'Open the Live Script editor')));
  const how = h('section', { class: 'how' },
    h('div', { class: 'how-step' }, h('b', {}, '1 · See it'), h('span', {}, 'Each idea starts with a graph or animation you can move.')),
    h('div', { class: 'how-step' }, h('b', {}, '2 · Watch it done'), h('span', {}, 'A fully worked example: every line of algebra, each with the reason for it. Stuck on a line? "I don\'t follow this step" asks the tutor to fill the gap.')),
    h('div', { class: 'how-step' }, h('b', {}, '3 · Do it with help'), h('span', {}, 'The same kind of problem with new numbers, one small step at a time, with a hint and "show me" for each step.')),
    h('div', { class: 'how-step' }, h('b', {}, '4 · Do it yourself'), h('span', {}, 'Assignments only use problem types you have already seen worked and practised — each links back to its example, with hints and a full walkthrough.')));
  const map = h('section', { class: 'course-map' });
  for (const part of PARTS.filter((p) => p.course === currentCourse)) {
    const pmods = mods.filter((m) => m.part === part.id);
    if (!pmods.length) { map.append(h('div', { class: 'map-part-head' }, h('h2', {}, part.title), h('p', { class: 'muted' }, `${part.desc} — modules coming with the course assignments.`))); continue; }
    const grid = h('div', { class: 'mod-grid' });
    pmods.forEach((m) => {
      const st = progress.moduleStats(m);
      grid.appendChild(h('a', { class: 'mod-card', href: `#/module/${m.id}` },
        h('div', { class: 'mod-card-top' }, h('span', { class: 'mod-num' }, `Module ${m.number}`), m.hw ? h('span', { class: 'tag' }, m.hw) : null),
        h('div', { class: 'mod-card-title' }, m.title),
        h('div', { class: 'mod-card-sum' }, m.summary),
        progressBar(st.pct)));
    });
    map.append(h('div', { class: 'map-part-head' }, h('h2', {}, part.title), h('p', { class: 'muted' }, part.desc)), grid);
  }
  page(course.title, hero, how, map);
}

function moduleNavList(m, kind, items) {
  return h('ol', { class: 'lesson-list' }, ...items.map((l) => {
    const key = `${m.id}/${kind}/${l.id}`;
    return h('li', { class: progress.isDone(key) ? 'done' : '' }, h('a', { href: `#/module/${m.id}/${kind}/${l.id}` }, l.title), progress.isDone(key) ? h('span', { class: 'check', 'aria-label': 'done' }, '✓') : null);
  }));
}

function modulePage(m) {
  setCourse(m.course);
  progress.visit(m.id);
  const st = progress.moduleStats(m);
  const intro = h('div', { class: 'prose' });
  intro.innerHTML = m.intro || `<p>${m.summary}</p>`;
  const cols = h('div', { class: 'mod-cols' },
    h('section', { class: 'mod-col' }, h('h3', {}, '1 · Learn'), h('p', { class: 'muted small' }, 'Graphs first, then fully worked examples and step-by-step guided practice.'), moduleNavList(m, 'learn', m.lessons || [])),
    h('section', { class: 'mod-col' }, h('h3', {}, '2 · MATLAB Live Editor'), h('p', { class: 'muted small' }, 'Write the same mathematics as in your homework.'), moduleNavList(m, 'matlab', m.matlab || [])),
    h('section', { class: 'mod-col' }, h('h3', {}, '3 · Assignments'), h('p', { class: 'muted small' }, 'Only problem types you have already practised, with hints and walkthroughs.'),
      h('ol', { class: 'lesson-list' }, ...(m.assignments || []).map((a) => h('li', { class: progress.isDone(`${m.id}/assign/${a.id}`) ? 'done' : '' }, h('a', { href: `#/module/${m.id}/assign#${a.id}` }, a.title), progress.isDone(`${m.id}/assign/${a.id}`) ? h('span', { class: 'check' }, '✓') : null))),
      h('a', { class: 'btn btn-small', href: `#/module/${m.id}/assign` }, 'Open assignments')));
  const aiRow = h('div', { class: 'row' },
    h('button', { class: 'btn btn-small', onclick: () => { location.hash = `#/practice?module=${m.id}`; } }, 'Generate extra practice for this module'),
    h('button', { class: 'btn btn-small btn-ghost', onclick: () => { tutor.open(); tutor.ask(`Give me a one-screen overview of the module "${m.title}": the key ideas, the formulas I must know by heart, and the typical exam-style task with the method in steps.`, '', { skipPage: true }); } }, 'Ask tutor for an overview'));
  const first = (m.lessons || [])[0];
  page(m.title,
    crumbs({ label: 'Course', href: '#/' }, { label: `Module ${m.number}` }),
    h('header', { class: 'mod-head' },
      h('div', { class: 'mod-num' }, `Module ${m.number}${m.hw ? ' · prepares for ' + m.hw : ''}`),
      h('h1', {}, m.title),
      progressBar(st.pct),
      h('div', { class: 'muted small' }, `${st.done} of ${st.total} items complete`)),
    intro,
    first ? h('a', { class: 'btn btn-primary', href: `#/module/${m.id}/learn/${first.id}` }, 'Start learning →') : null,
    cols, aiRow);
}

function sequenceOf(m) {
  return [
    ...(m.lessons || []).map((l) => ({ kind: 'learn', item: l })),
    ...(m.matlab || []).map((l) => ({ kind: 'matlab', item: l })),
    { kind: 'assign', item: { id: '', title: 'Assignments' } },
  ];
}

function lessonPage(m, kind, id) {
  setCourse(m.course);
  const list = kind === 'learn' ? m.lessons : m.matlab;
  const l = (list || []).find((x) => x.id === id);
  if (!l) return notFound();
  const key = `${m.id}/${kind}/${l.id}`;
  progress.visit(`${m.id}/${kind}/${l.id}`);
  const body = h('article', { class: 'lesson' });
  renderBlocks(body, l.blocks || [], { key, module: m.id });
  const seq = sequenceOf(m);
  const pos = seq.findIndex((s) => s.kind === kind && s.item.id === id);
  const prev = seq[pos - 1], next = seq[pos + 1];
  const href = (s) => (s.kind === 'assign' ? `#/module/${m.id}/assign` : `#/module/${m.id}/${s.kind}/${s.item.id}`);
  const doneBtn = h('button', { class: `btn ${progress.isDone(key) ? '' : 'btn-primary'}`, onclick: () => {
    progress.markDone(key, true);
    buildNav();
    if (next) location.hash = href(next);
  } }, progress.isDone(key) ? (next ? 'Next →' : 'Done') : (next ? 'Mark complete & continue →' : 'Mark complete'));
  page(l.title,
    crumbs({ label: 'Course', href: '#/' }, { label: `Module ${m.number}: ${m.title}`, href: `#/module/${m.id}` }, { label: kind === 'learn' ? 'Learn' : 'MATLAB' }),
    h('header', { class: 'lesson-head' }, h('div', { class: 'mod-num' }, kind === 'learn' ? 'Learn' : 'MATLAB Live Editor'), h('h1', {}, l.title)),
    body,
    h('div', { class: 'lesson-nav' },
      prev ? h('a', { class: 'btn btn-ghost', href: href(prev) }, `← ${prev.item.title}`) : h('span'),
      doneBtn));
}

function assignPage(m) {
  setCourse(m.course);
  progress.visit(`${m.id}/assign`);
  const wrap = h('div', { class: 'assignments' });
  const intro = h('div', { class: 'prose' });
  intro.innerHTML = m.assignIntro || '<p>Work these like homework: try first, check your answer, and only then open the hint or the solution. For the write-up parts, use the built-in Live Script editor exactly as you would in MATLAB.</p>';
  page(`Assignments · ${m.title}`,
    crumbs({ label: 'Course', href: '#/' }, { label: `Module ${m.number}: ${m.title}`, href: `#/module/${m.id}` }, { label: 'Assignments' }),
    h('header', { class: 'lesson-head' }, h('div', { class: 'mod-num' }, `Module ${m.number}`), h('h1', {}, 'Assignments')),
    intro, wrap);
  for (const a of m.assignments || []) {
    const anchor = h('div', { id: a.id });
    wrap.appendChild(anchor);
    renderAssignment(anchor, a, { key: `${m.id}/assign/${a.id}`, module: m.id, onChange: () => buildNav() });
  }
  renderMath(wrap);
  const nextMod = courseModules(m.course)[courseModules(m.course).indexOf(m) + 1];
  wrap.appendChild(h('div', { class: 'lesson-nav' }, h('a', { class: 'btn btn-ghost', href: `#/module/${m.id}` }, '← Module overview'), nextMod ? h('a', { class: 'btn btn-primary', href: `#/module/${nextMod.id}` }, `Next: ${nextMod.title} →`) : h('span')));
  const target = location.hash.split('#')[2];
  if (target) setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }), 50);
}

function editorPage() {
  const holder = h('div');
  const tplBtn = h('button', { class: 'btn btn-small', onclick: () => { if (confirm('Replace the editor content with the course homework template?')) ls.setDoc(HOMEWORK_TEMPLATE); } }, 'Load homework template');
  page('Live Script editor',
    h('header', { class: 'lesson-head' }, h('div', { class: 'mod-num' }, 'Tool'), h('h1', {}, 'Live Script editor')),
    h('p', { class: 'muted' }, 'A practice copy of the MATLAB Live Editor. Text, LaTeX equations and runnable MATLAB code blocks, saved in your browser. Export to .mlx to continue in MATLAB, or open an .mlx homework file here.'),
    holder);
  const ls = new LiveScript(holder, { storageKey: 'editor:main', blocks: HOMEWORK_TEMPLATE.blocks, title: HOMEWORK_TEMPLATE.title, toolbarExtras: (self) => [tplBtn,
    h('button', { class: 'btn btn-small', onclick: () => { tutor.open(); tutor.ask('Review this Live Script like a course grader: is every step explained in English before the math, are the methods correct, is the LaTeX clean, and is syms avoided? Give concrete fixes.', self.toPlainText(), { skipPage: true, display: 'Review my Live Script' }); } }, 'Ask tutor to review')] });
}

function referencePage() {
  const body = h('article', { class: 'lesson' });
  renderBlocks(body, REFERENCE, { key: 'reference' });
  page('LaTeX & MATLAB reference', h('header', { class: 'lesson-head' }, h('div', { class: 'mod-num' }, 'Reference'), h('h1', {}, 'LaTeX & MATLAB reference')), body);
}

// ------------------------------------------------------------------ AI practice

function mdToHtml(s) { return markdown(s || ''); }
function mdInline(s) { return mdToHtml(s).replace(/^<p>([\s\S]*)<\/p>$/, '$1'); }

function mdSteps(steps) { return (steps || []).map((st) => ({ do: mdInline(st.do), why: mdInline(st.why) })); }

function generatedToAssignments(set) {
  return set.problems.map((p, i) => ({
    id: `p${i}`,
    title: p.title,
    difficulty: p.difficulty,
    statement: mdToHtml(p.statement),
    preBlocks: p.workedExample && p.workedExample.steps?.length ? [{ type: 'steps', kicker: 'Worked example of the same type', problem: mdToHtml(p.workedExample.problem), steps: mdSteps(p.workedExample.steps) }] : undefined,
    parts: p.parts.map((pt) => ({
      label: pt.label, prompt: mdToHtml(pt.prompt), kind: pt.kind, answer: pt.answer, variable: pt.variable || 'x',
      upToConstant: pt.upToConstant, choices: (pt.choices || []).map(mdInline),
      hints: (pt.hints || (pt.hint ? [pt.hint] : [])).map(mdInline), walkthrough: pt.walkthrough?.length ? mdSteps(pt.walkthrough) : undefined, solution: mdToHtml(pt.solution),
    })),
    writeup: p.parts.some((pt) => pt.kind === 'writeup'),
  }));
}

function generatedLessonToBlocks(lesson) {
  const blocks = [];
  for (const s of lesson.sections) {
    blocks.push({ type: 'md', md: `## ${s.heading}\n\n${s.body}` });
    if (s.widget && s.widget !== 'none' && s.widgetConfig) blocks.push({ type: 'widget', name: s.widget, config: s.widgetConfig });
    if (s.latexDrill && s.latexDrill.trim()) blocks.push({ type: 'latex', prompt: 'Write this in the Live Editor LaTeX editor (Ctrl+Shift+L):', target: s.latexDrill });
    if (s.matlabExample && s.matlabExample.trim()) blocks.push({ type: 'code', code: s.matlabExample, editable: true });
    if (s.quiz && s.quiz.question) blocks.push({ type: 'quiz', question: mdInline(s.quiz.question), choices: s.quiz.choices.map(mdInline), answer: s.quiz.answer, explain: mdToHtml(s.quiz.explanation) });
  }
  return blocks;
}

async function practicePage(query) {
  const items = store.get('ai:generated', []);
  const modSel = h('select', { 'aria-label': 'Module' }, h('option', { value: '' }, '— any module —'), ...courseModules().map((m) => h('option', { value: m.id, selected: query.get('module') === m.id }, `${m.number}. ${m.title}`)));
  const topic = h('input', { type: 'text', placeholder: 'Topic, e.g. "integration by parts with ln x" or "radius of convergence"', class: 'grow' });
  const count = h('select', {}, ...[2, 3, 4, 5].map((n) => h('option', { value: n, selected: n === 3 }, `${n} problems`)));
  const diff = h('select', {}, ...['mixed', 'core', 'challenge', 'exam'].map((d) => h('option', { value: d }, d)));
  const useProgress = h('input', { type: 'checkbox', checked: true });
  const status = h('div', { class: 'feedback' });
  const connected = await connectionMode();
  const run = async (kind) => {
    const m = byId[modSel.value];
    const t = topic.value.trim() || (m ? `${m.title}: ${m.summary}` : '');
    if (!t) { status.className = 'feedback bad'; status.textContent = 'Pick a module or type a topic.'; return; }
    status.className = 'feedback'; status.textContent = 'Starting…';
    try {
      let item;
      if (kind === 'assign') {
        const { set, issues } = await generateAssignments({ topic: t, moduleTitle: m?.title, course: currentCourse, count: +count.value, difficulty: diff.value, progressSummary: useProgress.checked ? progress.summary(m ? [m] : courseModules()) : '' }, { onStatus: (s) => { status.textContent = s; } });
        item = { course: currentCourse, id: 'g' + Date.now(), kind: 'assign', title: set.title, focus: set.focus, created: Date.now(), module: m?.id, data: set, issues };
      } else {
        const lesson = await generateLesson({ topic: t, moduleTitle: m?.title, course: currentCourse }, { onStatus: (s) => { status.textContent = s; } });
        item = { course: currentCourse, id: 'g' + Date.now(), kind: 'lesson', title: lesson.title, focus: lesson.summary, created: Date.now(), module: m?.id, data: lesson };
      }
      const all = store.get('ai:generated', []);
      all.unshift(item);
      store.set('ai:generated', all.slice(0, 50));
      location.hash = `#/practice/${item.id}`;
    } catch (e) {
      status.className = 'feedback bad';
      status.textContent = `Failed: ${e.status ? e.status + ' ' : ''}${e.error?.error?.message || e.message}`;
    }
  };
  const form = h('div', { class: 'gen-form card' },
    h('div', { class: 'row wrap' }, modSel, topic),
    h('div', { class: 'row wrap' }, count, diff, h('label', { class: 'ctl ctl-toggle small' }, useProgress, h('span', {}, 'target my weak spots'))),
    h('div', { class: 'row wrap' },
      h('button', { class: 'btn btn-primary', disabled: !connected, onclick: () => run('assign') }, 'Generate practice problems'),
      h('button', { class: 'btn', disabled: !connected, onclick: () => run('lesson') }, 'Generate a mini-lesson')),
    connected ? null : h('div', { class: 'callout warn' }, h('div', { class: 'callout-title' }, 'Tutor not connected'), h('div', {}, 'Open the AI tutor (top right) → Settings to add an API key, or start the app with ANTHROPIC_API_KEY set.')),
    status);
  const list = h('div', { class: 'gen-list' }, ...items.map((it) => h('a', { class: 'gen-item', href: `#/practice/${it.id}` },
    h('span', { class: 'tag' }, it.kind === 'assign' ? 'practice' : 'lesson'), h('b', {}, it.title), h('span', { class: 'muted small' }, ` ${new Date(it.created).toLocaleString()}${it.module ? ' · ' + (byId[it.module]?.title || '') : ''}`))));
  page('AI practice & lessons',
    h('header', { class: 'lesson-head' }, h('div', { class: 'mod-num' }, 'AI tutor'), h('h1', {}, 'Practice & lessons on demand')),
    h('p', { class: 'muted' }, `Course: ${courseById[currentCourse].title}. `, 'The tutor writes new problems (auto-checked by the MATLAB sandbox) or a fresh mini-lesson with interactive graphs, aimed at the topic you choose — and, if you allow it, at the exercises you have struggled with.'),
    form, h('h2', {}, 'Generated so far'), items.length ? list : h('p', { class: 'muted' }, 'Nothing yet.'));
}

function practiceItemPage(id) {
  const it = store.get('ai:generated', []).find((x) => x.id === id);
  if (!it) return notFound();
  const body = h('div');
  const del = h('button', { class: 'btn btn-small btn-ghost', onclick: () => { if (!confirm('Delete this generated item?')) return; store.set('ai:generated', store.get('ai:generated', []).filter((x) => x.id !== id)); location.hash = '#/practice'; } }, 'Delete');
  page(it.title,
    crumbs({ label: 'AI practice', href: '#/practice' }, { label: it.title }),
    h('header', { class: 'lesson-head' }, h('div', { class: 'mod-num' }, it.kind === 'assign' ? 'Generated practice' : 'Generated lesson'), h('h1', {}, it.title)),
    h('p', { class: 'muted' }, it.focus || ''), body, h('div', { class: 'row' }, del));
  if (it.issues && it.issues.length) body.appendChild(h('div', { class: 'callout warn' }, h('div', { class: 'callout-title' }, 'Validation notes'), h('ul', {}, ...it.issues.map((s) => h('li', {}, s)))));
  if (it.kind === 'assign') {
    for (const a of generatedToAssignments(it.data)) renderAssignment(body, a, { key: `ai/${it.id}/${a.id}`, module: it.module || 'ai' });
  } else {
    renderBlocks(body, generatedLessonToBlocks(it.data), { key: `ai/${it.id}`, module: it.module || 'ai' });
  }
  renderMath(body);
}

function settingsPage() {
  const theme = h('select', {}, ...[['dark', 'Dark (default)'], ['light', 'Light'], ['auto', 'Follow system']].map(([v, t]) => h('option', { value: v, selected: store.get('theme', 'dark') === v }, t)));
  theme.addEventListener('change', () => { store.set('theme', theme.value); applyTheme(theme.value); });
  const imp = h('input', { type: 'file', accept: '.json' });
  imp.addEventListener('change', async () => { try { progress.import(await imp.files[0].text()); buildNav(); alert('Progress imported.'); } catch (e) { alert('Import failed: ' + e.message); } });
  page('Settings',
    h('header', { class: 'lesson-head' }, h('h1', {}, 'Settings & progress')),
    h('div', { class: 'card' }, h('h3', {}, 'Appearance'), h('label', { class: 'field' }, h('span', {}, 'Theme'), theme)),
    h('div', { class: 'card' }, h('h3', {}, 'AI tutor'), h('p', { class: 'muted' }, 'Model, effort and API connection.'), h('button', { class: 'btn', onclick: () => tutor.showSettings() }, 'Open tutor settings')),
    h('div', { class: 'card' }, h('h3', {}, 'Progress'), h('p', { class: 'muted' }, 'Progress lives in this browser. Export it to move to another device.'),
      h('div', { class: 'row wrap' },
        h('button', { class: 'btn', onclick: () => downloadBlob(new Blob([progress.export()], { type: 'application/json' }), 'calculus-studio-progress.json') }, 'Export progress'),
        h('label', { class: 'btn' }, 'Import progress', imp),
        h('button', { class: 'btn btn-danger', onclick: () => { if (confirm('Erase all progress?')) { progress.reset(); buildNav(); } } }, 'Reset progress'))),
    h('div', { class: 'card' }, h('h3', {}, 'Adding course material'), h('div', { class: 'prose', html: '<p>Modules live in <code>js/content/</code>, one file per module. See <code>CONTENT.md</code> in the repository for the format, so new homework topics can be added as new modules.</p>' })));
}

function notFound() {
  page('Not found', h('h1', {}, 'Page not found'), h('a', { href: '#/' }, 'Back to the course map'));
}

// ------------------------------------------------------------------ router

function route() {
  document.body.classList.remove('nav-open');
  const raw = location.hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart] = raw.split('?');
  const path = pathPart.split('#')[0];
  const query = new URLSearchParams(queryPart || '');
  const seg = path.split('/').filter(Boolean);
  let modId = null;
  if (seg[0] === 'module' && byId[seg[1]]) {
    const m = byId[seg[1]];
    modId = m.id;
    if (seg.length === 2) modulePage(m);
    else if (seg[2] === 'assign') assignPage(m);
    else if ((seg[2] === 'learn' || seg[2] === 'matlab') && seg[3]) lessonPage(m, seg[2], seg[3]);
    else notFound();
  } else if (seg[0] === 'editor') editorPage();
  else if (seg[0] === 'practice' && seg[1]) practiceItemPage(seg[1]);
  else if (seg[0] === 'practice') practicePage(query);
  else if (seg[0] === 'reference') referencePage();
  else if (seg[0] === 'settings') settingsPage();
  else if (!seg.length) home();
  else notFound();
  highlightNav(modId);
}

buildNav();
window.addEventListener('hashchange', route);
route();
void moduleKeys;
