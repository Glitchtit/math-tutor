// The AI tutor drawer: streaming chat with page context, quick actions, settings.

import { h, markdown, renderMath, store } from './util.js';
import { chat, connectionMode, getSettings, saveSettings, MODELS, testConnection } from './ai.js';

const HISTORY_KEY = 'ai:chat';
const MAX_CONTEXT = 3000;

export class TutorPanel {
  constructor({ getPageContext, getProgressSummary, onNavigate }) {
    this.getPageContext = getPageContext;
    this.getProgressSummary = getProgressSummary;
    this.onNavigate = onNavigate;
    this.history = store.get(HISTORY_KEY, []);
    this.busy = false;
    this.el = h('aside', { class: 'tutor', 'aria-label': 'AI tutor', 'aria-hidden': 'true' });
    document.body.appendChild(this.el);
    this.build();
    window.addEventListener('tutor:ask', (e) => { this.open(); this.ask(e.detail.prompt, e.detail.context); });
  }

  build() {
    this.el.innerHTML = '';
    const close = h('button', { class: 'icon-btn', title: 'Close tutor', 'aria-label': 'Close tutor', onclick: () => this.close() }, '×');
    this.status = h('span', { class: 'tutor-status muted small' });
    const head = h('div', { class: 'tutor-head' },
      h('div', {}, h('div', { class: 'tutor-title' }, 'AI tutor'), this.status),
      h('div', { class: 'row' },
        h('button', { class: 'btn btn-small btn-ghost', onclick: () => this.showSettings() }, 'Settings'),
        h('button', { class: 'btn btn-small btn-ghost', onclick: () => { this.history = []; store.set(HISTORY_KEY, []); this.renderMessages(); } }, 'New chat'),
        close));
    this.msgs = h('div', { class: 'tutor-msgs', 'aria-live': 'polite' });
    const quick = h('div', { class: 'tutor-quick' },
      ...[
        ['Explain this page another way', 'Explain the main idea of the page I am on in a different way than the page does, with one concrete example and one common mistake.'],
        ['What should I focus on?', '__focus__'],
        ['Quiz me', 'Ask me 3 short questions, one at a time, that test whether I understood the page I am on. Wait for my answer after each.'],
        ['How do I write this in Live Editor?', 'Show me how the key formulas of this page are written in the MATLAB Live Editor LaTeX editor (Ctrl+Shift+L), and how I would check them numerically in a code block without syms.'],
      ].map(([label, prompt]) => h('button', { class: 'chip', onclick: () => (prompt === '__focus__' ? this.focus() : this.ask(prompt)) }, label)),
      h('button', { class: 'chip chip-accent', onclick: () => this.onNavigate('#/practice') }, 'Generate practice / lesson →'));
    this.input = h('textarea', { class: 'tutor-input', rows: 3, placeholder: 'Ask anything: "why is the integral of an odd function zero?", paste your attempt, or ask for a hint…', 'aria-label': 'Message to the tutor' });
    this.input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send(); } });
    this.ctxToggle = h('input', { type: 'checkbox', checked: true });
    this.sendBtn = h('button', { class: 'btn btn-primary', onclick: () => (this.busy ? this.abort() : this.send()) }, 'Send');
    const foot = h('div', { class: 'tutor-foot' }, this.input,
      h('div', { class: 'row space' }, h('label', { class: 'ctl ctl-toggle small' }, this.ctxToggle, h('span', {}, 'include current page as context')), this.sendBtn));
    this.el.append(head, quick, this.msgs, foot);
    this.renderMessages();
    this.refreshStatus();
  }

  async refreshStatus() {
    const mode = await connectionMode();
    const s = getSettings();
    this.status.textContent = mode ? `${mode === 'proxy' ? 'via server proxy' : 'with your API key'} · ${s.model}` : 'not connected — open Settings';
    this.connected = !!mode;
    return mode;
  }

  open() {
    document.body.classList.add('tutor-open');
    this.el.setAttribute('aria-hidden', 'false');
    setTimeout(() => this.input.focus(), 50);
  }
  close() { document.body.classList.remove('tutor-open'); this.el.setAttribute('aria-hidden', 'true'); }
  toggle() { if (document.body.classList.contains('tutor-open')) this.close(); else this.open(); }

  renderMessages() {
    this.msgs.innerHTML = '';
    if (!this.history.length) {
      const intro = h('div', { class: 'tutor-empty prose' });
      intro.innerHTML = markdown('Ask about anything in the course. The tutor sees the page you are on (toggle below), knows the course rules (Live Editor write-ups, no `syms`) and can generate new theory and practice problems for you.\n\nIt answers with hints first; ask for a full solution when you want one.');
      this.msgs.appendChild(intro);
    }
    for (const m of this.history) this.msgs.appendChild(this.bubble(m.role, m.display ?? m.content));
    this.msgs.scrollTop = this.msgs.scrollHeight;
  }

  bubble(role, text) {
    const b = h('div', { class: `msg msg-${role}` });
    const body = h('div', { class: 'msg-body prose' });
    if (role === 'assistant') { body.innerHTML = markdown(text); renderMath(body); this.wireLinks(body); } else body.textContent = text;
    b.appendChild(body);
    return b;
  }

  wireLinks(el) {
    el.querySelectorAll('a[href^="#/"]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); this.onNavigate(a.getAttribute('href')); }));
  }

  async focus() {
    const summary = this.getProgressSummary();
    await this.ask('Based on my progress below, what should I focus on next? Give a prioritised list of at most 4 items with the reason for each and a link to the module, then suggest one concrete exercise to do right now.', `My progress by module:\n${summary}`, { skipPage: true, display: 'What should I focus on?' });
  }

  async send() {
    const q = this.input.value.trim();
    if (!q || this.busy) return;
    this.input.value = '';
    await this.ask(q);
  }

  abort() { this.controller?.abort(); }

  async ask(prompt, extraContext = '', { skipPage = false, display } = {}) {
    if (this.busy) return;
    const mode = await this.refreshStatus();
    if (!mode) { this.showSettings('Connect the tutor first.'); return; }
    let ctx = '';
    if (!skipPage && this.ctxToggle.checked) {
      const page = this.getPageContext();
      if (page) ctx += `<page title="${page.title.replace(/"/g, "'")}">\n${page.text.slice(0, MAX_CONTEXT)}\n</page>\n`;
    }
    if (extraContext) ctx += `<context>\n${extraContext}\n</context>\n`;
    const content = ctx ? `${ctx}\n${prompt}` : prompt;
    this.history.push({ role: 'user', content, display: display || (extraContext && !display ? `${prompt}\n\n${extraContext}` : prompt) });
    this.renderMessages();
    const out = this.bubble('assistant', '');
    out.classList.add('streaming');
    const body = out.querySelector('.msg-body');
    body.innerHTML = '<span class="typing">Thinking…</span>';
    this.msgs.appendChild(out);
    this.msgs.scrollTop = this.msgs.scrollHeight;
    this.busy = true;
    this.sendBtn.textContent = 'Stop';
    this.controller = new AbortController();
    let pending = false;
    try {
      const msgs = this.history.filter((m) => !m.error && !m.failed).slice(-30).map((m) => ({ role: m.role, content: m.content }));
      while (msgs.length && msgs[0].role !== 'user') msgs.shift();
      const text = await chat(msgs, {
        signal: this.controller.signal,
        onText: (_, full) => {
          if (pending) return;
          pending = true;
          requestAnimationFrame(() => {
            pending = false;
            body.innerHTML = markdown(full);
            renderMath(body);
            const nearBottom = this.msgs.scrollHeight - this.msgs.scrollTop - this.msgs.clientHeight < 120;
            if (nearBottom) this.msgs.scrollTop = this.msgs.scrollHeight;
          });
        },
      });
      this.history.push({ role: 'assistant', content: text || '(no answer)' });
    } catch (e) {
      const aborted = e.name === 'AbortError' || /abort/i.test(e.message);
      const msg = aborted ? '_Stopped._' : `**Error:** ${e.status ? `${e.status} — ` : ''}${e.error?.error?.message || e.message}`;
      // keep the exchange visible but out of the API history so roles keep alternating
      const lastUser = this.history[this.history.length - 1];
      if (lastUser && lastUser.role === 'user') lastUser.failed = true;
      this.history.push({ role: 'assistant', content: msg, error: true });
    } finally {
      this.busy = false;
      this.sendBtn.textContent = 'Send';
      this.history = this.history.slice(-40);
      store.set(HISTORY_KEY, this.history);
      this.renderMessages();
    }
  }

  async showSettings(note = '') {
    const s = getSettings();
    const mode = await connectionMode();
    const modeSel = h('select', {}, ...[['auto', 'Automatic (server proxy if available, else my key)'], ['proxy', 'Server proxy only'], ['direct', 'My own API key']].map(([v, t]) => h('option', { value: v, selected: s.mode === v }, t)));
    const key = h('input', { type: 'password', value: s.apiKey, placeholder: 'sk-ant-...', autocomplete: 'off', class: 'mono' });
    const model = h('select', {}, ...MODELS.map((m) => h('option', { value: m.id, selected: s.model === m.id }, m.label)));
    const effort = h('select', {}, ...['low', 'medium', 'high'].map((e) => h('option', { value: e, selected: s.effort === e }, e)));
    const result = h('div', { class: 'feedback' }, note);
    const close = () => overlay.remove();
    const save = () => { saveSettings({ mode: modeSel.value, apiKey: key.value.trim(), model: model.value, effort: effort.value }); this.refreshStatus(); };
    const overlay = h('div', { class: 'modal-overlay', onclick: (e) => { if (e.target === overlay) close(); } },
      h('div', { class: 'modal', role: 'dialog', 'aria-label': 'Tutor settings' },
        h('div', { class: 'modal-title' }, 'AI tutor settings'),
        h('div', { class: 'prose small' }, h('p', {}, `Current connection: ${mode || 'none'}. `,
          'Run ', h('code', {}, 'ANTHROPIC_API_KEY=sk-ant-... npm start'), ' to keep the key on the server, or paste your own Anthropic API key below. A pasted key is stored only in this browser (localStorage) and sent directly to api.anthropic.com.')),
        h('label', { class: 'field' }, h('span', {}, 'Connection'), modeSel),
        h('label', { class: 'field' }, h('span', {}, 'API key'), key),
        h('label', { class: 'field' }, h('span', {}, 'Model'), model),
        h('label', { class: 'field' }, h('span', {}, 'Effort (depth of reasoning)'), effort),
        result,
        h('div', { class: 'modal-actions' },
          h('button', { class: 'btn', onclick: async () => {
            save();
            result.className = 'feedback'; result.textContent = 'Testing…';
            try { const r = await testConnection(); result.className = 'feedback ok'; result.textContent = `Connected. Model replied: "${r}"`; } catch (e) { result.className = 'feedback bad'; result.textContent = `Failed: ${e.status ? e.status + ' ' : ''}${e.error?.error?.message || e.message}`; }
          } }, 'Save & test'),
          h('button', { class: 'btn btn-primary', onclick: () => { save(); close(); } }, 'Save'))));
    document.body.appendChild(overlay);
  }
}
