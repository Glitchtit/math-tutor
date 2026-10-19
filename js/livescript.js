// A browser imitation of the MATLAB Live Editor: text with inline LaTeX, display equations,
// runnable code blocks with inline output and figures, .mlx export/import.

import { h, renderMath, tex, texError, store, uid, downloadBlob, escapeHtml } from './util.js';
import { Matlab } from './matlab/interp.js';
import { parse } from './matlab/parser.js';
import { renderFigure } from './plot.js';
import { docToMlxBlob, mlxToDoc } from './mlx.js';

const TYPE_LABEL = { title: 'Title', heading: 'Heading', heading2: 'Heading 2', text: 'Text', equation: 'Equation', code: 'Code' };

export function textToHtml(src) {
  // inline formatting for text blocks: $math$, **bold**, `code`, "- " bullets
  const lines = String(src).split('\n');
  const out = [];
  let list = [];
  const inline = (s) => {
    const parts = [];
    const re = /\$([^$]+)\$|\*\*([^*]+)\*\*|`([^`]+)`/g;
    let last = 0, m;
    while ((m = re.exec(s))) {
      parts.push(escapeHtml(s.slice(last, m.index)));
      if (m[1] !== undefined) parts.push(tex(m[1], false));
      else if (m[2] !== undefined) parts.push(`<strong>${escapeHtml(m[2])}</strong>`);
      else parts.push(`<code>${escapeHtml(m[3])}</code>`);
      last = re.lastIndex;
    }
    parts.push(escapeHtml(s.slice(last)));
    return parts.join('');
  };
  const flush = () => { if (list.length) { out.push(`<ul>${list.map((l) => `<li>${inline(l)}</li>`).join('')}</ul>`); list = []; } };
  for (const line of lines) {
    const m = /^\s*[-*]\s+(.*)$/.exec(line);
    if (m) { list.push(m[1]); continue; }
    flush();
    if (line.trim()) out.push(`<p>${inline(line)}</p>`);
  }
  flush();
  return out.join('') || '<p class="ls-placeholder">Empty text — click to write. Use $…$ or Ctrl+Shift+L for math.</p>';
}

function autosize(ta) {
  ta.style.height = 'auto';
  ta.style.height = Math.max(ta.scrollHeight, 28) + 'px';
}

// Equation editor dialog, like Ctrl+Shift+L in MATLAB
export function equationDialog(initial = '', { display = false } = {}) {
  return new Promise((resolve) => {
    const ta = h('textarea', { class: 'eq-input mono', rows: 4, spellcheck: 'false' });
    ta.value = initial;
    const prev = h('div', { class: 'eq-preview' });
    const err = h('div', { class: 'eq-error' });
    const disp = h('input', { type: 'checkbox', checked: display });
    const upd = () => {
      const e = texError(ta.value);
      err.textContent = e ? `LaTeX error: ${e}` : '';
      prev.innerHTML = ta.value.trim() ? tex(ta.value, true) : '<span class="muted">Preview</span>';
    };
    ta.addEventListener('input', upd);
    const close = (val) => { overlay.remove(); resolve(val); };
    const overlay = h('div', { class: 'modal-overlay', onclick: (e) => { if (e.target === overlay) close(null); } },
      h('div', { class: 'modal eq-modal', role: 'dialog', 'aria-label': 'LaTeX equation editor' },
        h('div', { class: 'modal-title' }, 'LaTeX Equation Editor'),
        h('div', { class: 'muted small' }, 'Type LaTeX as in MATLAB (Ctrl+Shift+L). Example: \\int_0^x \\frac{\\sin t}{t}\\,\\mathrm d t'),
        ta, err, prev,
        h('label', { class: 'ctl ctl-toggle' }, disp, h('span', {}, 'Display (own line)')),
        h('div', { class: 'modal-actions' },
          h('button', { class: 'btn', onclick: () => close(null) }, 'Cancel'),
          h('button', { class: 'btn btn-primary', onclick: () => close({ latex: ta.value.trim(), display: disp.checked }) }, 'OK'))));
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); close({ latex: ta.value.trim(), display: disp.checked }); }
      if (e.key === 'Escape') close(null);
    });
    document.body.appendChild(overlay);
    upd();
    ta.focus();
  });
}

export class LiveScript {
  // opts: { id, title, blocks, storageKey, readOnly, compact, onChange, toolbarExtras }
  constructor(container, opts = {}) {
    this.opts = opts;
    this.key = opts.storageKey || null;
    const saved = this.key ? store.get(this.key) : null;
    this.doc = saved || { title: opts.title || 'Untitled', blocks: (opts.blocks || [{ type: 'text', content: '' }]).map((b) => ({ id: uid(), ...b })) };
    this.doc.blocks.forEach((b) => { if (!b.id) b.id = uid(); });
    this.interp = new Matlab();
    this.outputs = {};
    this.root = h('div', { class: `ls ${opts.compact ? 'ls-compact' : ''} ${opts.readOnly ? 'ls-readonly' : ''}` });
    container.appendChild(this.root);
    if (!opts.readOnly && !opts.compact) this.buildToolbar();
    this.docEl = h('div', { class: 'ls-doc' });
    this.root.appendChild(this.docEl);
    this.render();
  }

  save() {
    if (this.key) store.set(this.key, { title: this.doc.title, blocks: this.doc.blocks.map(({ id, type, content }) => ({ id, type, content })) });
    this.opts.onChange?.(this.doc);
  }

  setDoc(doc) {
    this.doc = { title: doc.title, blocks: doc.blocks.map((b) => ({ id: uid(), ...b })) };
    this.outputs = {};
    this.save();
    this.render();
  }

  buildToolbar() {
    const tb = h('div', { class: 'ls-toolbar', role: 'toolbar' });
    const add = (type) => () => this.insertBlock(this.focusIndex ?? this.doc.blocks.length - 1, type);
    const group = (...els) => h('div', { class: 'ls-tbgroup' }, ...els);
    tb.append(
      group(
        h('span', { class: 'ls-tblabel' }, 'Insert'),
        h('button', { class: 'btn btn-small', onclick: add('text'), title: 'Text block' }, 'Text'),
        h('button', { class: 'btn btn-small', onclick: add('heading'), title: 'Section heading' }, 'Heading'),
        h('button', { class: 'btn btn-small', onclick: () => this.insertEquation(), title: 'Equation (Ctrl+Shift+L)' }, 'Equation'),
        h('button', { class: 'btn btn-small', onclick: add('code'), title: 'Code block (Alt+Enter toggles text/code)' }, 'Code'),
      ),
      group(
        h('span', { class: 'ls-tblabel' }, 'Run'),
        h('button', { class: 'btn btn-small btn-primary', onclick: () => this.runAll(), title: 'Run all (Ctrl+Shift+Enter)' }, '▶ Run all'),
        h('button', { class: 'btn btn-small', onclick: () => { this.outputs = {}; this.interp.reset(); this.render(); } }, 'Clear outputs'),
      ),
      group(
        h('span', { class: 'ls-tblabel' }, 'File'),
        h('button', { class: 'btn btn-small', onclick: () => this.exportMlx(), title: 'Download as MATLAB Live Script' }, 'Export .mlx'),
        h('button', { class: 'btn btn-small', onclick: () => this.importMlx() }, 'Open .mlx'),
        h('button', { class: 'btn btn-small', onclick: () => this.print(), title: 'Print or save as PDF' }, 'PDF'),
      ),
      ...(this.opts.toolbarExtras ? [group(...this.opts.toolbarExtras(this))] : []),
    );
    this.root.appendChild(tb);
    this.root.appendChild(h('div', { class: 'ls-hint' }, 'Shortcuts like MATLAB: Ctrl+Shift+L equation · Alt+Enter toggle text/code · Ctrl+Enter run block · Ctrl+Shift+Enter run all'));
  }

  render() {
    this.docEl.innerHTML = '';
    this.doc.blocks.forEach((b, i) => this.docEl.appendChild(this.renderBlock(b, i)));
    if (!this.opts.readOnly && !this.opts.compact) {
      this.docEl.appendChild(h('div', { class: 'ls-addrow' },
        h('button', { class: 'btn btn-ghost btn-small', onclick: () => this.insertBlock(this.doc.blocks.length - 1, 'text') }, '+ Text'),
        h('button', { class: 'btn btn-ghost btn-small', onclick: () => this.insertBlock(this.doc.blocks.length - 1, 'code') }, '+ Code'),
        h('button', { class: 'btn btn-ghost btn-small', onclick: () => { this.focusIndex = this.doc.blocks.length - 1; this.insertEquation(); } }, '+ Equation')));
    }
  }

  insertBlock(afterIndex, type, content = '') {
    const b = { id: uid(), type, content };
    this.doc.blocks.splice(afterIndex + 1, 0, b);
    this.save();
    this.render();
    this.focusBlock(b.id);
    return b;
  }

  focusBlock(id) {
    const el = this.docEl.querySelector(`[data-id="${id}"]`);
    if (!el) return;
    const disp = el.querySelector('.ls-display');
    if (disp) disp.click();
    const inp = el.querySelector('textarea, input');
    if (inp) { inp.focus(); }
  }

  async insertEquation() {
    const res = await equationDialog('', { display: true });
    if (!res || !res.latex) return;
    const idx = this.focusIndex ?? this.doc.blocks.length - 1;
    const cur = this.doc.blocks[idx];
    if (!res.display && cur && cur.type === 'text') {
      cur.content += (cur.content && !cur.content.endsWith(' ') ? ' ' : '') + `$${res.latex}$`;
      this.save(); this.render();
      return;
    }
    this.insertBlock(idx, 'equation', res.latex);
  }

  keyHandler(b, i, ta) {
    return async (e) => {
      if (e.altKey && e.key === 'Enter') {
        e.preventDefault();
        b.type = b.type === 'code' ? 'text' : 'code';
        this.save(); this.render(); this.focusBlock(b.id);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
        e.preventDefault();
        if (b.type === 'code') return;
        const sel = ta.value.slice(ta.selectionStart, ta.selectionEnd);
        const res = await equationDialog(sel, { display: false });
        if (!res || !res.latex) { ta.focus(); return; }
        if (res.display) { this.insertBlock(i, 'equation', res.latex); return; }
        const s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + `$${res.latex}$` + ta.value.slice(en);
        b.content = ta.value;
        this.save();
        ta.focus();
        ta.selectionStart = ta.selectionEnd = s + res.latex.length + 2;
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) this.runAll(); else if (b.type === 'code') this.runBlock(i);
      }
    };
  }

  renderBlock(b, i) {
    const wrap = h('div', { class: `ls-block ls-${b.type}`, 'data-id': b.id });
    const ro = this.opts.readOnly;
    if (!ro) {
      const sel = h('select', { class: 'ls-type', 'aria-label': 'Block type', title: 'Block type' }, ...Object.entries(TYPE_LABEL).map(([v, t]) => h('option', { value: v, selected: v === b.type }, t)));
      sel.addEventListener('change', () => { b.type = sel.value; this.save(); this.render(); });
      const tools = h('div', { class: 'ls-tools' }, sel,
        h('button', { class: 'icon-btn', title: 'Move up', onclick: () => this.move(i, -1) }, '↑'),
        h('button', { class: 'icon-btn', title: 'Move down', onclick: () => this.move(i, 1) }, '↓'),
        h('button', { class: 'icon-btn', title: 'Insert block below', onclick: () => this.insertBlock(i, b.type === 'code' ? 'code' : 'text') }, '+'),
        h('button', { class: 'icon-btn', title: 'Delete block', onclick: () => { this.doc.blocks.splice(i, 1); this.save(); this.render(); } }, '×'));
      wrap.appendChild(tools);
    }
    const onFocus = () => { this.focusIndex = i; };
    if (b.type === 'title' || b.type === 'heading' || b.type === 'heading2') {
      if (ro) { wrap.appendChild(h(b.type === 'title' ? 'h2' : b.type === 'heading' ? 'h3' : 'h4', { class: 'ls-head' }, b.content)); return wrap; }
      const inp = h('input', { class: 'ls-head-input', value: b.content, placeholder: TYPE_LABEL[b.type], 'aria-label': TYPE_LABEL[b.type] });
      inp.addEventListener('input', () => { b.content = inp.value; if (b.type === 'title') this.doc.title = inp.value; this.save(); });
      inp.addEventListener('focus', onFocus);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); this.insertBlock(i, 'text'); } });
      wrap.appendChild(inp);
      return wrap;
    }
    if (b.type === 'text' || b.type === 'equation') {
      const display = h('div', { class: 'ls-display', tabindex: ro ? undefined : 0 });
      const draw = () => {
        if (b.type === 'equation') display.innerHTML = b.content.trim() ? tex(b.content, true) : '<span class="ls-placeholder">Empty equation — click to edit LaTeX</span>';
        else display.innerHTML = textToHtml(b.content);
      };
      draw();
      wrap.appendChild(display);
      if (ro) return wrap;
      const edit = () => {
        onFocus();
        const ta = h('textarea', { class: `ls-textarea ${b.type === 'equation' ? 'mono' : ''}`, spellcheck: b.type === 'text' ? 'true' : 'false', placeholder: b.type === 'equation' ? 'LaTeX, e.g. \\int_a^b f(x)\\,\\mathrm d x = F(b) - F(a)' : 'Explain in English what you are about to do. Inline math: $...$ or Ctrl+Shift+L' });
        ta.value = b.content;
        const preview = h('div', { class: 'ls-live-preview' });
        const upd = () => {
          if (b.type === 'equation') { const e = texError(ta.value); preview.innerHTML = e ? `<span class="eq-error">${escapeHtml(e)}</span>` : tex(ta.value, true); } else preview.innerHTML = /\$/.test(ta.value) ? textToHtml(ta.value) : '';
        };
        ta.addEventListener('input', () => { b.content = ta.value; autosize(ta); upd(); this.save(); });
        ta.addEventListener('keydown', this.keyHandler(b, i, ta));
        ta.addEventListener('blur', () => {
          setTimeout(() => {
            if (document.activeElement === ta || document.querySelector('.modal-overlay')) return;
            ta.replaceWith(display); preview.remove(); draw();
          }, 120);
        });
        display.replaceWith(ta);
        ta.after(preview);
        upd();
        autosize(ta);
        ta.focus();
      };
      display.addEventListener('click', edit);
      display.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); edit(); } });
      return wrap;
    }
    // code block
    const ta = h('textarea', { class: 'ls-code mono', spellcheck: 'false', readonly: ro, 'aria-label': 'MATLAB code', placeholder: '% MATLAB code — e.g. f = @(x) x.^2;  integral(f, 0, 1)' });
    ta.value = b.content;
    ta.addEventListener('input', () => { b.content = ta.value; autosize(ta); this.save(); });
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') { e.preventDefault(); const s = ta.selectionStart; ta.value = ta.value.slice(0, s) + '    ' + ta.value.slice(ta.selectionEnd); ta.selectionStart = ta.selectionEnd = s + 4; b.content = ta.value; this.save(); return; }
      this.keyHandler(b, i, ta)(e);
    });
    ta.addEventListener('focus', onFocus);
    const runBtn = h('button', { class: 'ls-run', title: 'Run this block (Ctrl+Enter)', onclick: () => this.runBlock(i) }, '▶');
    const codeRow = h('div', { class: 'ls-coderow' }, runBtn, ta);
    wrap.appendChild(codeRow);
    const out = h('div', { class: 'ls-output' });
    wrap.appendChild(out);
    if (this.outputs[b.id]) this.showOutputs(out, this.outputs[b.id]);
    requestAnimationFrame(() => autosize(ta));
    return wrap;
  }

  move(i, d) {
    const j = i + d;
    if (j < 0 || j >= this.doc.blocks.length) return;
    const [b] = this.doc.blocks.splice(i, 1);
    this.doc.blocks.splice(j, 0, b);
    this.save(); this.render();
  }

  registerFunctions() {
    for (const b of this.doc.blocks) {
      if (b.type !== 'code' || !/\bfunction\b/.test(b.content)) continue;
      try { Object.assign(this.interp.functions, parse(b.content).functions); } catch { /* reported when run */ }
    }
  }

  runBlock(i) {
    const b = this.doc.blocks[i];
    this.registerFunctions();
    const res = this.interp.run(b.content);
    this.outputs[b.id] = res.outputs;
    const el = this.docEl.querySelector(`[data-id="${b.id}"] .ls-output`);
    if (el) this.showOutputs(el, res.outputs);
    return res.ok;
  }

  runAll() {
    this.interp.reset();
    this.outputs = {};
    this.registerFunctions();
    for (let i = 0; i < this.doc.blocks.length; i++) {
      if (this.doc.blocks[i].type !== 'code') continue;
      const ok = this.runBlock(i);
      if (!ok) break;
    }
  }

  showOutputs(el, outputs) {
    el.innerHTML = '';
    for (const o of outputs) {
      if (o.type === 'text') el.appendChild(h('pre', { class: 'ls-out-text' }, o.text.replace(/\n+$/, '')));
      else if (o.type === 'error') el.appendChild(h('pre', { class: 'ls-out-error' }, `Error${o.line ? ` (line ${o.line})` : ''}: ${o.text}`));
      else if (o.type === 'warning') el.appendChild(h('pre', { class: 'ls-out-warning' }, o.text));
      else if (o.type === 'figure') { const fd = h('div', { class: 'ls-out-figure' }); el.appendChild(fd); renderFigure(fd, o.figure); }
    }
  }

  exportMlx() {
    const name = (this.doc.title || 'live_script').replace(/[^\w-]+/g, '_').replace(/^_+|_+$/g, '') || 'live_script';
    downloadBlob(docToMlxBlob(this.doc), `${name}.mlx`);
  }

  importMlx() {
    const inp = h('input', { type: 'file', accept: '.mlx' });
    inp.addEventListener('change', async () => {
      const f = inp.files[0];
      if (!f) return;
      try {
        const doc = await mlxToDoc(await f.arrayBuffer());
        this.setDoc(doc);
      } catch (e) {
        alert(`Could not open ${f.name}: ${e.message}`);
      }
    });
    inp.click();
  }

  print() {
    document.body.classList.add('printing-ls');
    this.root.classList.add('print-target');
    const done = () => { document.body.classList.remove('printing-ls'); this.root.classList.remove('print-target'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    window.print();
  }

  toPlainText() {
    return this.doc.blocks.map((b) => {
      if (b.type === 'code') return '```matlab\n' + b.content + '\n```';
      if (b.type === 'equation') return `$$${b.content}$$`;
      if (b.type === 'title') return `# ${b.content}`;
      if (b.type === 'heading') return `## ${b.content}`;
      if (b.type === 'heading2') return `### ${b.content}`;
      return b.content;
    }).join('\n\n');
  }
}

// Render a read-only model solution / example in Live Script style
export function renderLiveDoc(container, blocks, { runnable = true } = {}) {
  const ls = new LiveScript(container, { blocks, readOnly: true, compact: true });
  if (runnable && blocks.some((b) => b.type === 'code')) {
    const bar = h('div', { class: 'ls-ro-bar' }, h('button', { class: 'btn btn-small', onclick: () => ls.runAll() }, '▶ Run code'));
    ls.root.prepend(bar);
  }
  renderMath(ls.root);
  return ls;
}
