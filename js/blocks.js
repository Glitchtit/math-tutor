// Renders lesson content blocks and assignments.

import { h, renderMath, tex, texError, markdown } from './util.js';
import { mountWidget } from './widgets.js';
import { texMatchesAny } from './latex.js';
import { checkPart } from './check.js';
import { runMatlabChecks } from './matlab/checks.js';
import { LiveScript, renderLiveDoc } from './livescript.js';
import { progress } from './progress.js';
import { MODULES } from './content/index.js';

export function askTutor(prompt, context = '') {
  window.dispatchEvent(new CustomEvent('tutor:ask', { detail: { prompt, context } }));
}

function html(el, s) { el.innerHTML = s || ''; renderMath(el); return el; }

const RENDER = {};

RENDER.text = (b) => html(h('div', { class: 'blk-text prose' }), b.html);
RENDER.md = (b) => html(h('div', { class: 'blk-text prose' }), markdown(b.md));

RENDER.callout = (b) => {
  const icons = { note: 'Note', key: 'Key idea', warn: 'Watch out', matlab: 'MATLAB', exam: 'Exam tip', def: 'Definition', thm: 'Theorem' };
  const el = h('div', { class: `callout ${b.kind || 'note'}` }, h('div', { class: 'callout-title' }, b.title || icons[b.kind] || 'Note'));
  el.appendChild(html(h('div', { class: 'prose' }), b.html));
  return el;
};

RENDER.widget = (b) => {
  const el = h('div', { class: 'blk-widget' });
  requestAnimationFrame(() => mountWidget(el, b.name, b.config));
  return el;
};

RENDER.table = (b) => {
  const t = h('table', { class: 'blk-table' });
  if (b.head) t.appendChild(h('thead', {}, h('tr', {}, ...b.head.map((c) => html(h('th'), c)))));
  t.appendChild(h('tbody', {}, ...b.rows.map((r) => h('tr', {}, ...r.map((c) => html(h('td'), c))))));
  return h('div', { class: 'table-wrap' }, t);
};

// A worked step is either an HTML string or { do: html, why: html }.
// `do` is the line of mathematics, `why` says in plain words what was done and why it is allowed.
function stepItem(step, i, steps, context) {
  const st = typeof step === 'string' ? { do: step } : step;
  const li = h('li', { class: 'step-in' });
  li.appendChild(html(h('div', { class: 'step-do' }), st.do));
  if (st.why) li.appendChild(html(h('div', { class: 'step-why' }), st.why));
  const prev = i > 0 ? (typeof steps[i - 1] === 'string' ? steps[i - 1] : steps[i - 1].do) : '';
  li.appendChild(h('button', { class: 'step-help', type: 'button', title: 'Ask the tutor to explain this step in smaller pieces', onclick: () => askTutor(
    'I do not follow this step of a worked example. Explain how we get from the previous line to this line in the smallest possible steps: write every intermediate line of algebra, say which rule is used at each line (and remind me of that rule with a tiny numeric example), and do not skip anything. Then ask me one short question to check I understood.',
    `${context ? `Worked example: ${stripHtml(context)}\n` : ''}Previous line: ${stripHtml(prev) || '(this is the first step)'}\nThis step: ${stripHtml(st.do)}${st.why ? `\nGiven reason: ${stripHtml(st.why)}` : ''}`) }, "I don't follow this step"));
  return li;
}

export function renderStepList(container, steps, { title = '', context = '', oneAtATime = true, label = 'Next step →' } = {}) {
  const list = h('ol', { class: 'steps-list' });
  container.appendChild(list);
  let shown = 0;
  const btn = h('button', { class: 'btn btn-small' }, label);
  const all = h('button', { class: 'btn btn-small btn-ghost' }, 'Show all steps');
  const counter = h('span', { class: 'muted small' });
  const next = () => {
    if (shown >= steps.length) return;
    list.appendChild(stepItem(steps[shown], shown, steps, context || title));
    shown++;
    counter.textContent = `step ${shown} of ${steps.length}`;
    if (shown >= steps.length) { btn.remove(); all.remove(); }
  };
  btn.onclick = next;
  all.onclick = () => { while (shown < steps.length) next(); };
  container.appendChild(h('div', { class: 'steps-controls' }, btn, all, counter));
  if (oneAtATime) next(); else all.onclick();
  return list;
}

RENDER.steps = (b) => {
  const el = h('div', { class: 'blk-steps' });
  el.appendChild(h('div', { class: 'steps-kicker' }, b.kicker || 'Worked example'));
  if (b.title) el.appendChild(html(h('div', { class: 'steps-title' }), b.title));
  if (b.problem) el.appendChild(html(h('div', { class: 'steps-problem prose' }), b.problem));
  renderStepList(el, b.steps, { title: `${b.title || ''} ${b.problem || ''}` });
  return el;
};

// Collapsible refresher of a prerequisite skill (algebra, trig identities, ...)
RENDER.refresher = (b) => {
  const det = h('details', { class: 'refresher' }, h('summary', {}, `Refresher: ${b.title}`));
  det.appendChild(html(h('div', { class: 'prose' }), b.html));
  if (b.steps) renderStepList(det, b.steps, { title: b.title, oneAtATime: false });
  return det;
};

// "Your turn, with support": the same kind of problem as the worked example, solved one step at a time.
// steps: [{ prompt, show? } | { prompt, ask: {kind, answer, ...}, hint, reveal }]
RENDER.guided = (b, ctx) => {
  const el = h('div', { class: 'blk-guided' });
  el.appendChild(h('div', { class: 'steps-kicker guided' }, b.kicker || 'Your turn — step by step'));
  if (b.title) el.appendChild(html(h('div', { class: 'steps-title' }), b.title));
  el.appendChild(html(h('div', { class: 'steps-problem prose' }), b.problem));
  const list = h('ol', { class: 'steps-list guided-list' });
  el.appendChild(list);
  const key = ctx?.key ? `${ctx.key}/guided/${ctx.index}` : null;
  let i = 0;
  const finish = () => {
    if (b.finale) list.after(html(h('div', { class: 'callout key guided-finale' }), b.finale));
    if (key) progress.attempt(key, true, { module: ctx.module, kind: 'guided', label: stripHtml(b.title || b.problem).slice(0, 80) });
  };
  const nextStep = () => {
    if (i >= b.steps.length) { finish(); return; }
    const st = b.steps[i];
    const idx = i++;
    const li = h('li', { class: 'step-in' });
    li.appendChild(html(h('div', { class: 'step-prompt' }), st.prompt));
    list.appendChild(li);
    if (!st.ask) {
      if (st.show) li.appendChild(html(h('div', { class: 'step-do' }), st.show));
      if (st.why) li.appendChild(html(h('div', { class: 'step-why' }), st.why));
      const cont = h('button', { class: 'btn btn-small', onclick: () => { cont.remove(); nextStep(); } }, idx === b.steps.length - 1 ? 'Finish' : 'Continue →');
      li.appendChild(h('div', { class: 'row' }, cont));
      return;
    }
    const part = st.ask;
    const fb = h('div', { class: 'feedback' });
    const reveal = () => {
      row.remove();
      if (st.reveal) li.appendChild(html(h('div', { class: 'step-do' }), st.reveal));
      if (st.why) li.appendChild(html(h('div', { class: 'step-why' }), st.why));
      const cont = h('button', { class: 'btn btn-small', onclick: () => { cont.remove(); nextStep(); } }, idx === b.steps.length - 1 ? 'Finish' : 'Next step →');
      li.appendChild(h('div', { class: 'row' }, cont));
    };
    let getInput;
    if (part.kind === 'choice') {
      const name = 'g' + Math.random().toString(36).slice(2);
      const opts = part.choices.map((c, k) => { const inp = h('input', { type: 'radio', name, value: k }); return { inp, lab: h('label', { class: 'quiz-opt' }, inp, html(h('span'), c)) }; });
      li.appendChild(h('div', { class: 'quiz-opts' }, ...opts.map((o) => o.lab)));
      getInput = () => { const o = opts.findIndex((x) => x.inp.checked); return o < 0 ? '' : String(o); };
    } else {
      const inp = h('input', { class: 'answer-input mono', type: 'text', placeholder: inputHelp(part), autocomplete: 'off', spellcheck: 'false', 'aria-label': 'Your answer for this step' });
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); check(); } });
      li.appendChild(h('div', { class: 'answer-row' }, part.label ? h('span', { class: 'mono muted' }, part.label) : null, inp));
      getInput = () => inp.value;
      setTimeout(() => inp.focus({ preventScroll: true }), 30);
    }
    let tries = 0;
    const check = () => {
      const input = getInput();
      if (input === '') { fb.className = 'feedback'; fb.textContent = 'Type your answer for this step first.'; return; }
      let r;
      try { r = checkPart(part, input); } catch (e) { r = { ok: false, error: e.message }; }
      tries++;
      fb.className = `feedback ${r.ok ? 'ok' : 'bad'}`;
      if (r.ok) { fb.innerHTML = '<b>Right.</b>'; reveal(); return; }
      html(fb, r.error ? r.error : `<b>Not yet.</b> ${tries === 1 && st.hint ? `Hint: ${st.hint}` : tries >= 2 ? 'You can look at this step — that is fine, it is how you learn the pattern.' : ''}`);
      if (tries >= 2) showBtn.classList.add('btn-primary');
    };
    const showBtn = h('button', { class: 'btn btn-small btn-ghost', onclick: () => { fb.className = 'feedback'; fb.textContent = ''; reveal(); } }, 'Show me this step');
    const row = h('div', { class: 'row' },
      h('button', { class: 'btn btn-small btn-primary', onclick: check }, 'Check step'),
      st.hint ? h('button', { class: 'btn btn-small btn-ghost', onclick: (e) => e.target.replaceWith(html(h('div', { class: 'hint' }), 'Hint: ' + st.hint)) }, 'Hint') : null,
      showBtn,
      h('button', { class: 'btn btn-small btn-ghost', onclick: () => askTutor('I am stuck on this step of a guided exercise. Explain only this step, in the smallest pieces, without solving the rest of the problem.', `Problem: ${stripHtml(b.problem)}\nThis step: ${stripHtml(st.prompt)}\nMy answer: ${getInput() || '(none yet)'}`) }, 'Ask tutor'));
    li.append(row, fb);
  };
  nextStep();
  return el;
};

RENDER.quiz = (b, ctx) => {
  const el = h('div', { class: 'blk-quiz' });
  el.appendChild(html(h('div', { class: 'quiz-q' }), b.question));
  const multiple = Array.isArray(b.answer);
  const name = 'q' + Math.random().toString(36).slice(2);
  const opts = b.choices.map((c, i) => {
    const inp = h('input', { type: multiple ? 'checkbox' : 'radio', name, value: i });
    const lab = h('label', { class: 'quiz-opt' }, inp, html(h('span'), c));
    return { inp, lab };
  });
  el.appendChild(h('div', { class: 'quiz-opts' }, ...opts.map((o) => o.lab)));
  const fb = h('div', { class: 'feedback' });
  const key = ctx?.key ? `${ctx.key}/quiz/${ctx.index}` : null;
  const check = h('button', { class: 'btn btn-small btn-primary', onclick: () => {
    const chosen = opts.map((o, i) => (o.inp.checked ? i : -1)).filter((i) => i >= 0);
    if (!chosen.length) { fb.className = 'feedback'; fb.textContent = 'Choose an answer first.'; return; }
    const correct = multiple ? b.answer : [b.answer];
    const ok = chosen.length === correct.length && chosen.every((c) => correct.includes(c));
    opts.forEach((o, i) => { o.lab.classList.toggle('right', correct.includes(i)); o.lab.classList.toggle('wrong', o.inp.checked && !correct.includes(i)); });
    fb.className = `feedback ${ok ? 'ok' : 'bad'}`;
    html(fb, `${ok ? '<b>Correct.</b> ' : '<b>Not quite.</b> '}${b.explain || ''}`);
    if (key) progress.attempt(key, ok, { module: ctx.module, kind: 'quiz', label: stripHtml(b.question).slice(0, 80), input: chosen.join(',') });
  } }, 'Check');
  el.append(h('div', { class: 'row' }, check), fb);
  return el;
};

function stripHtml(s) { return String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); }

// LaTeX typing exercise: reproduce the target formula as you would in Ctrl+Shift+L
RENDER.latex = (b, ctx) => {
  const el = h('div', { class: 'blk-latex' });
  el.appendChild(html(h('div', { class: 'latex-prompt' }), b.prompt || 'Write this formula in LaTeX:'));
  const target = h('div', { class: 'latex-target' });
  target.innerHTML = tex(b.target, true);
  el.appendChild(target);
  const ta = h('textarea', { class: 'mono latex-input', rows: 2, spellcheck: 'false', placeholder: 'Type LaTeX here, e.g. \\frac{1}{2}', 'aria-label': 'LaTeX input' });
  const prev = h('div', { class: 'latex-preview' });
  const fb = h('div', { class: 'feedback' });
  const upd = () => {
    const e = texError(ta.value);
    prev.innerHTML = !ta.value.trim() ? '<span class="muted">Your preview appears here</span>' : e ? `<span class="eq-error">${e}</span>` : tex(ta.value, true);
  };
  ta.addEventListener('input', upd);
  const key = ctx?.key ? `${ctx.key}/latex/${ctx.index}` : null;
  const check = () => {
    const ok = texMatchesAny(ta.value, [b.target, ...(b.accept || [])]);
    fb.className = `feedback ${ok ? 'ok' : 'bad'}`;
    if (ok) fb.innerHTML = '<b>Matches.</b> This is exactly what you would type in the MATLAB LaTeX editor.';
    else html(fb, `<b>Not the same yet.</b> Compare your preview with the target. ${b.hint ? 'Hint: ' + b.hint : ''}`);
    if (key) progress.attempt(key, ok, { module: ctx.module, kind: 'latex', label: `LaTeX: ${b.target}`, input: ta.value });
  };
  ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); check(); } });
  el.append(ta, prev, h('div', { class: 'row' },
    h('button', { class: 'btn btn-small btn-primary', onclick: check }, 'Check'),
    h('button', { class: 'btn btn-small btn-ghost', onclick: () => { ta.value = b.target; upd(); } }, 'Show code')), fb);
  upd();
  return el;
};

// Runnable MATLAB example
RENDER.code = (b) => {
  const el = h('div', { class: 'blk-code' });
  if (b.caption) el.appendChild(html(h('div', { class: 'code-caption' }), b.caption));
  const ls = new LiveScript(el, { blocks: [{ type: 'code', content: b.code }], compact: true, readOnly: !b.editable });
  if (b.run !== false) {
    el.insertBefore(h('div', { class: 'ls-ro-bar' }, h('button', { class: 'btn btn-small', onclick: () => ls.runAll() }, '▶ Run')), ls.root);
    if (b.autorun) requestAnimationFrame(() => ls.runAll());
  }
  return el;
};

// MATLAB coding exercise with automatic checks
RENDER.matlab = (b, ctx) => {
  const el = h('div', { class: 'blk-matlab' });
  el.appendChild(html(h('div', { class: 'matlab-prompt' }), b.prompt));
  const holder = h('div');
  el.appendChild(holder);
  const storageKey = ctx?.key ? `code:${ctx.key}/${ctx.index}` : null;
  const ls = new LiveScript(holder, { blocks: [{ type: 'code', content: b.starter || '' }], compact: true, storageKey });
  const fb = h('div', { class: 'feedback' });
  const key = ctx?.key ? `${ctx.key}/matlab/${ctx.index}` : null;
  const check = () => {
    const code = ls.doc.blocks.filter((x) => x.type === 'code').map((x) => x.content).join('\n');
    const { problems } = runMatlabChecks(code, b.checks);
    ls.runAll();
    const ok = problems.length === 0;
    fb.className = `feedback ${ok ? 'ok' : 'bad'}`;
    html(fb, ok ? `<b>All checks passed.</b> ${b.success || ''}` : `<b>Not yet:</b><ul>${problems.map((p) => `<li>${p.replace(/`([^`]+)`/g, '<code>$1</code>')}</li>`).join('')}</ul>`);
    if (key) progress.attempt(key, ok, { module: ctx.module, kind: 'matlab', label: stripHtml(b.prompt).slice(0, 80), input: code.slice(0, 300) });
  };
  const sol = h('div', { class: 'reveal hidden' });
  el.append(h('div', { class: 'row' },
    h('button', { class: 'btn btn-small btn-primary', onclick: check }, 'Check my code'),
    b.hint ? h('button', { class: 'btn btn-small btn-ghost', onclick: (e) => { e.target.replaceWith(html(h('div', { class: 'hint' }), 'Hint: ' + b.hint)); } }, 'Hint') : null,
    b.solution ? h('button', { class: 'btn btn-small btn-ghost', onclick: () => { sol.classList.toggle('hidden'); if (!sol.childNodes.length) renderLiveDoc(sol, [{ type: 'code', content: b.solution }]); } }, 'Show solution') : null,
    h('button', { class: 'btn btn-small btn-ghost', onclick: () => askTutor('Help me with this MATLAB exercise. Do not just give me the full answer; point out what is wrong in my code and why.', `Exercise: ${stripHtml(b.prompt)}\n\nMy code:\n${ls.doc.blocks.map((x) => x.content).join('\n')}\n\nChecker feedback: ${stripHtml(fb.innerHTML)}`) }, 'Ask tutor')),
  fb, sol);
  return el;
};

RENDER.livescript = (b, ctx) => {
  const el = h('div', { class: 'blk-livescript' });
  if (b.caption) el.appendChild(html(h('div', { class: 'code-caption' }), b.caption));
  if (b.editable) new LiveScript(el, { blocks: b.blocks, storageKey: b.storageKey || (ctx?.key ? `ls:${ctx.key}/${ctx.index}` : null), title: b.title });
  else renderLiveDoc(el, b.blocks);
  return el;
};

RENDER.answer = (b, ctx) => renderPart(b.part, ctx?.key ? `${ctx.key}/answer/${ctx.index}` : null, ctx);

export function renderBlocks(container, blocks, ctx = {}) {
  blocks.forEach((b, index) => {
    const r = RENDER[b.type];
    if (!r) { container.appendChild(h('div', { class: 'callout warn' }, `Unknown block type: ${b.type}`)); return; }
    try {
      container.appendChild(r(b, { ...ctx, index }));
    } catch (e) {
      console.error(e);
      container.appendChild(h('div', { class: 'callout warn' }, `Could not render block (${b.type}): ${e.message}`));
    }
  });
}

// ------------------------------------------------------------------ assignments

function inputHelp(part) {
  if (part.kind === 'numeric') return 'Number or MATLAB expression, e.g. 24*sqrt(3)/5 or pi/4';
  if (part.kind === 'expression') return `MATLAB expression in ${part.variable || 'x'}, e.g. -exp(-${part.variable || 'x'}^2)/2${part.upToConstant ? ' (constant C may be omitted)' : ''}`;
  return '';
}

export function renderPart(part, key, ctx = {}) {
  const el = h('div', { class: 'part' });
  const head = h('div', { class: 'part-head' });
  if (part.label) head.appendChild(h('span', { class: 'part-label' }, part.label));
  head.appendChild(html(h('div', { class: 'part-prompt prose' }), part.prompt || ''));
  el.appendChild(head);
  const fb = h('div', { class: 'feedback' });
  let getInput;
  if (part.kind === 'choice') {
    const name = 'c' + Math.random().toString(36).slice(2);
    const opts = part.choices.map((c, i) => { const inp = h('input', { type: 'radio', name, value: i }); return { inp, lab: h('label', { class: 'quiz-opt' }, inp, html(h('span'), c)) }; });
    el.appendChild(h('div', { class: 'quiz-opts' }, ...opts.map((o) => o.lab)));
    getInput = () => { const o = opts.findIndex((x) => x.inp.checked); return o < 0 ? '' : String(o); };
  } else if (part.kind === 'numeric' || part.kind === 'expression') {
    const inp = h('input', { class: 'answer-input mono', type: 'text', placeholder: inputHelp(part), 'aria-label': `Answer ${part.label || ''}`, autocomplete: 'off', spellcheck: 'false' });
    const prev = h('span', { class: 'answer-preview muted' });
    inp.addEventListener('input', () => { prev.textContent = ''; });
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); doCheck(); } });
    el.appendChild(h('div', { class: 'answer-row' }, part.kind === 'expression' && (part.fname || part.upToConstant) ? h('span', { class: 'mono muted' }, `${part.fname || 'F'}(${part.variable || 'x'}) =`) : null, inp, prev));
    getInput = () => inp.value;
  } else {
    getInput = () => '';
  }
  const sol = h('div', { class: 'reveal hidden prose' });
  const doCheck = () => {
    const input = getInput();
    if (part.kind === 'writeup') return;
    if (input === '') { fb.className = 'feedback'; fb.textContent = 'Enter an answer first.'; return; }
    let r;
    try { r = checkPart(part, input); } catch (e) { r = { ok: false, error: e.message }; }
    fb.className = `feedback ${r.ok ? 'ok' : 'bad'}`;
    if (r.error) fb.textContent = r.error;
    else if (r.ok) html(fb, `<b>Correct.</b>${part.kind === 'numeric' && r.value !== undefined ? ` (${+r.value.toPrecision(8)})` : ''}${r.constant && Math.abs(r.constant) > 1e-9 ? ` Your antiderivative differs from mine by the constant ${(+r.constant.toPrecision(4))} — that is fine.` : ''}`);
    else html(fb, `<b>Not correct yet.</b>${part.kind === 'numeric' && r.value !== undefined ? ` Your value: ${+r.value.toPrecision(8)}.` : ''} ${part.feedback || ''}`);
    if (key) {
      const a = progress.attempt(key, !!r.ok, { module: ctx.module, kind: part.kind, label: `${ctx.title || ''} ${part.label || ''}`.trim(), input });
      if (!r.ok && a.tries >= 2 && part.solution && !part.walkthrough) solBtn.classList.remove('hidden');
      if (!r.ok && a.tries >= 2 && part.walkthrough) walkBtn.classList.add('btn-primary');
    }
    ctx.onResult?.();
  };
  // Help ladder: hint 1 (nudge) -> hint 2 (method) -> hint 3 (first step) -> full step-by-step walkthrough
  const hints = part.hints || (part.hint ? [part.hint] : []);
  const helpBox = h('div', { class: 'help-box' });
  let hintLevel = 0;
  const hintBtn = h('button', { class: 'btn btn-small btn-ghost' }, hints.length ? `Hint 1 of ${hints.length}` : '');
  hintBtn.onclick = () => {
    helpBox.appendChild(html(h('div', { class: 'hint' }), `<b>Hint ${hintLevel + 1}.</b> ${hints[hintLevel]}`));
    hintLevel++;
    if (hintLevel >= hints.length) hintBtn.remove(); else hintBtn.textContent = `Hint ${hintLevel + 1} of ${hints.length}`;
  };
  const walkBtn = h('button', { class: 'btn btn-small btn-ghost' }, 'Walk me through it');
  walkBtn.onclick = () => {
    walkBtn.remove();
    const box = h('div', { class: 'walkthrough' }, h('div', { class: 'steps-kicker' }, 'Step-by-step solution'));
    helpBox.appendChild(box);
    renderStepList(box, part.walkthrough, { context: `${stripHtml(ctx.statement || '')} ${stripHtml(part.prompt || '')}` });
  };
  const solBtn = h('button', { class: 'btn btn-small btn-ghost' + (part.solution && !part.walkthrough ? '' : ' hidden'), onclick: () => { sol.classList.toggle('hidden'); if (!sol.innerHTML) html(sol, part.solution); } }, 'Show solution');
  const row = h('div', { class: 'row' });
  if (part.kind !== 'writeup') row.appendChild(h('button', { class: 'btn btn-small btn-primary', onclick: doCheck }, 'Check'));
  if (hints.length) row.appendChild(hintBtn);
  if (part.walkthrough) row.appendChild(walkBtn);
  row.appendChild(solBtn);
  row.appendChild(h('button', { class: 'btn btn-small btn-ghost', onclick: () => askTutor('I am stuck on this problem. Coach me through it one small step at a time: tell me only the next step and why, ask me to do it, and wait for my answer before going on. Never skip algebra.', `Problem: ${stripHtml(ctx.statement || '')}\nPart ${part.label || ''}: ${stripHtml(part.prompt || '')}\nMy answer so far: ${getInput() || '(none yet)'}\nChecker: ${stripHtml(fb.innerHTML) || 'not checked'}`) }, "I'm stuck — coach me"));
  el.append(row, helpBox, fb, sol);
  if (key && progress.getAttempt(key)?.ok) { fb.className = 'feedback ok'; fb.innerHTML = '<b>Solved earlier.</b>'; }
  return el;
}

// "Seen this before?" links to the worked example and guided exercise of the same problem type
function exampleLinks(examples, moduleId) {
  const box = h('div', { class: 'example-links' }, h('span', { class: 'muted small' }, 'Same type, fully worked: '));
  examples.forEach((ref, i) => {
    const [modId, lessonId] = ref.includes('/') ? ref.split('/') : [moduleId, ref];
    const m = MODULES.find((x) => x.id === modId);
    const l = m && [...(m.lessons || []), ...(m.matlab || [])].find((x) => x.id === lessonId);
    if (!l) return;
    const kind = (m.lessons || []).includes(l) ? 'learn' : 'matlab';
    if (i) box.appendChild(h('span', { class: 'muted small' }, ' · '));
    box.appendChild(h('a', { href: `#/module/${m.id}/${kind}/${l.id}` }, l.title));
  });
  return box;
}

export function renderAssignment(container, a, ctx = {}) {
  const key = ctx.key;
  const card = h('div', { class: 'assignment' });
  const head = h('div', { class: 'assignment-head' }, h('h3', {}, a.title));
  if (a.difficulty) head.appendChild(h('span', { class: `tag tag-${a.difficulty}` }, a.difficulty));
  if (a.hw) head.appendChild(h('span', { class: 'tag' }, a.hw));
  card.appendChild(head);
  if (a.examples && a.examples.length) card.appendChild(exampleLinks(a.examples, ctx.module));
  if (a.preBlocks) renderBlocks(card, a.preBlocks, { key, module: ctx.module });
  card.appendChild(html(h('div', { class: 'prose statement' }), a.statement));
  if (a.blocks) renderBlocks(card, a.blocks, { key, module: ctx.module });
  const parts = a.parts || [];
  const status = h('div', { class: 'assignment-status' });
  const refresh = () => {
    const auto = parts.map((p, i) => ({ p, i })).filter(({ p }) => p.kind !== 'writeup');
    const solved = auto.filter(({ i }) => progress.getAttempt(`${key}/p${i}`)?.ok).length;
    if (auto.length) status.textContent = `${solved}/${auto.length} auto-checked parts solved`;
    if (auto.length && solved === auto.length && !a.writeup) progress.markDone(key);
    ctx.onChange?.();
  };
  parts.forEach((p, i) => card.appendChild(renderPart(p, `${key}/p${i}`, { ...ctx, statement: a.statement, title: a.title, onResult: refresh })));
  if (a.writeup) {
    const wrap = h('details', { class: 'writeup' }, h('summary', {}, 'Write the full solution in Live Script format'));
    const intro = h('div', { class: 'prose small' });
    html(intro, 'Write it as you would in the MATLAB Live Editor for the homework: explain in English what you are about to do, then the mathematics (Ctrl+Shift+L), and use code blocks only to plot or check numerically — never <code>syms</code>. Export to .mlx when done.');
    wrap.appendChild(intro);
    const tpl = a.writeupTemplate || [
      { type: 'heading', content: `${a.title} (Attempted)` },
      { type: 'text', content: 'Explain what technique you will use and why.' },
      { type: 'equation', content: '' },
      { type: 'code', content: '% optional: numerical check, e.g. integral(@(x) ..., a, b)' },
    ];
    let ls = null;
    wrap.addEventListener('toggle', () => {
      if (wrap.open && !ls) {
        ls = new LiveScript(wrap, { blocks: tpl, storageKey: `writeup:${key}`, title: a.title, toolbarExtras: () => [
          h('button', { class: 'btn btn-small', onclick: () => askTutor('Review my written solution like a course grader would: is every step explained in English before the math, is the method correct, is the final answer right, and is the LaTeX clean? List concrete fixes.', `Problem: ${stripHtml(a.statement)}\n\nMy Live Script solution:\n${ls.toPlainText()}`) }, 'Ask tutor to review'),
        ] });
      }
    });
    card.appendChild(wrap);
  }
  if (a.solution) {
    const det = h('details', { class: 'model-solution' }, h('summary', {}, 'Model solution (Live Script)'));
    let shown = false;
    det.addEventListener('toggle', () => { if (det.open && !shown) { shown = true; renderLiveDoc(det, a.solution); } });
    card.appendChild(det);
  }
  if (a.writeup || !parts.some((p) => p.kind !== 'writeup')) {
    const btn = h('button', { class: 'btn btn-small', onclick: () => { const d = !progress.isDone(key); progress.markDone(key, d); btn.textContent = d ? '✓ Marked done' : 'Mark as done'; ctx.onChange?.(); } }, progress.isDone(key) ? '✓ Marked done' : 'Mark as done');
    card.appendChild(h('div', { class: 'row' }, btn));
  }
  card.appendChild(status);
  container.appendChild(card);
  refresh();
  return card;
}
