// Exam-practice blocks: figure (static SVG), reveal (draw first, then compare), blanks (fill in the
// blank, checked as you type) and examquiz (multiple choice with negative marking). See CONTENT.md.

import { h, renderMath } from './util.js';
import { checkText } from './check.js';

const prose = (el, s) => { el.innerHTML = s || ''; renderMath(el); return el; };
const specOf = (a) => (typeof a === 'string' ? { answers: a.split('|') } : a);
const shownAnswer = (a) => (typeof a === 'string' ? a.split('|')[0] : String(a.num));

export function renderFigure(b) {
  const fig = h('figure', { class: 'pefig blk-figure' });
  fig.innerHTML = b.svg;
  if (b.caption) fig.appendChild(prose(h('figcaption'), b.caption));
  return fig;
}

export function renderReveal(b, ctx, renderBlocks) {
  const el = h('div', { class: 'blk-reveal' });
  el.appendChild(prose(h('div', { class: 'reveal-prompt' }), b.prompt));
  el.appendChild(h('p', { class: 'muted small' }, 'Draw it on paper first, then compare with the reference and tick off the checklist.'));
  const body = h('div', { class: 'reveal-body hidden' });
  const btn = h('button', { class: 'btn btn-small', type: 'button', 'aria-expanded': 'false' }, 'Show reference');
  btn.onclick = () => {
    const open = body.classList.toggle('hidden') === false;
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Hide reference' : 'Show reference';
    if (open && !body.childNodes.length) {
      if (b.checklist?.length) {
        const ul = h('ul', { class: 'reveal-checklist' });
        b.checklist.forEach((c) => { const id = 'c' + Math.random().toString(36).slice(2); ul.appendChild(h('li', {}, h('input', { type: 'checkbox', id }), prose(h('label', { for: id }), c))); });
        body.appendChild(h('div', { class: 'reveal-check-title' }, 'Checklist: what earns the marks'));
        body.appendChild(ul);
      }
      renderBlocks(body, b.blocks || [], ctx);
    }
  };
  el.append(h('div', { class: 'row' }, btn), body);
  return el;
}

export function renderBlanks(b) {
  const el = h('div', { class: 'blk-blanks' });
  const score = h('span', { class: 'blanks-score', 'aria-live': 'polite' });
  const gaps = [];
  const update = () => {
    const right = gaps.filter((g) => g.state === 'ok').length, wrong = gaps.filter((g) => g.state === 'bad').length;
    score.textContent = `Correct ${right} · Wrong ${wrong} · of ${gaps.length}`;
  };
  const list = h('ol', { class: 'blanks-list' });
  (b.items || []).forEach((it) => {
    const li = h('li', { class: 'blanks-item' });
    const parts = String(it.html).split('[[]]');
    let html = '';
    parts.forEach((p, i) => { html += p; if (i < parts.length - 1) html += `<span class="blank-slot" data-i="${i}"></span>`; });
    prose(li, html);
    li.querySelectorAll('.blank-slot').forEach((slot) => {
      const a = it.answers[+slot.dataset.i];
      const inp = h('input', { class: 'blank-input', type: 'text', autocomplete: 'off', spellcheck: 'false', 'aria-label': 'answer' });
      const res = h('span', { class: 'blank-res' });
      const g = { state: '', inp, res, a };
      const check = () => {
        if (!inp.value.trim()) { g.state = ''; res.textContent = ''; inp.className = 'blank-input'; update(); return; }
        const ok = checkText(specOf(a), inp.value).ok;
        g.state = ok ? 'ok' : 'bad';
        inp.className = `blank-input ${g.state}`;
        res.textContent = ok ? '✓' : `Answer: ${shownAnswer(a)}`;
        res.className = `blank-res ${g.state}`;
        update();
      };
      inp.addEventListener('change', check);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); check(); } });
      slot.append(inp, res);
      gaps.push(g);
    });
    list.appendChild(li);
  });
  const reveal = h('button', { class: 'btn btn-small btn-ghost', type: 'button', onclick: () => gaps.forEach((g) => { if (g.state !== 'ok') { g.res.textContent = `Answer: ${shownAnswer(g.a)}`; g.res.className = 'blank-res'; } }) }, 'Show all answers');
  const reset = h('button', { class: 'btn btn-small btn-ghost', type: 'button', onclick: () => { gaps.forEach((g) => { g.state = ''; g.inp.value = ''; g.inp.className = 'blank-input'; g.res.textContent = ''; }); update(); } }, 'Reset');
  el.append(h('div', { class: 'blanks-bar' }, score, reveal, reset), list);
  update();
  return el;
}

export function renderExamQuiz(b) {
  const el = h('div', { class: 'blk-examquiz' });
  const pen = h('select', { 'aria-label': 'Penalty per wrong answer' },
    ...[[0, '0'], [0.25, '−0.25'], [1 / 3, '−1/3'], [0.5, '−0.5'], [1, '−1']].map(([v, t]) => h('option', { value: v }, t)));
  pen.value = String([0, 0.25, 1 / 3, 0.5, 1].find((v) => Math.abs(v - (b.penaltyDefault ?? 0.25)) < 1e-6) ?? 0.25);
  const score = h('span', { class: 'eq-score', 'aria-live': 'polite' });
  const qs = [];
  const update = () => {
    const r = qs.filter((q) => q.st === 'r').length, w = qs.filter((q) => q.st === 'w').length, s = qs.filter((q) => q.st === 's').length;
    score.innerHTML = `Right <b>${r}</b> · Wrong <b>${w}</b> · Skipped <b>${s}</b> · Net <b>${(r - w * parseFloat(pen.value)).toFixed(2)}</b> / ${qs.length}`;
  };
  pen.addEventListener('change', update);
  const list = h('ol', { class: 'eq-list' });
  (b.questions || []).forEach((q) => {
    const li = h('li', { class: 'eq-q' });
    li.appendChild(prose(h('div', { class: 'eq-text' }), q.q));
    const ex = prose(h('div', { class: 'eq-explain hidden' }), q.explain);
    const st = { st: '' };
    const btns = q.choices.map((c, i) => prose(h('button', { class: 'eq-opt', type: 'button' }), c));
    const skip = h('button', { class: 'btn btn-small btn-ghost eq-skip', type: 'button' }, 'Skip (leave blank)');
    const finish = (s, i) => {
      if (st.st) return;
      st.st = s;
      if (s === 'r') btns[i].classList.add('right');
      else { if (s === 'w') btns[i].classList.add('wrong'); btns[q.answer].classList.add('right'); }
      [...btns, skip].forEach((x) => { x.disabled = true; });
      ex.classList.remove('hidden');
      update();
    };
    btns.forEach((bt, i) => { bt.onclick = () => finish(i === q.answer ? 'r' : 'w', i); });
    skip.onclick = () => finish('s');
    li.append(h('div', { class: 'eq-opts' }, ...btns), skip, ex);
    list.appendChild(li);
    qs.push(Object.assign(st, { btns, skip, ex }));
  });
  const reset = h('button', { class: 'btn btn-small btn-ghost', type: 'button', onclick: () => {
    qs.forEach((q) => { q.st = ''; q.ex.classList.add('hidden'); [...q.btns, q.skip].forEach((x) => { x.disabled = false; x.classList.remove('right', 'wrong'); }); });
    update();
  } }, 'Reset');
  el.append(h('div', { class: 'eq-bar' }, h('label', {}, 'Penalty per wrong answer ', pen), score, reset), list);
  update();
  return el;
}
