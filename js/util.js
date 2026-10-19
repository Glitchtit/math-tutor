// Shared DOM, math rendering, markdown and storage helpers.

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'text') el.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    el.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
  }
  return el;
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const DELIMS = [
  { left: '$$', right: '$$', display: true },
  { left: '\\[', right: '\\]', display: true },
  { left: '\\(', right: '\\)', display: false },
  { left: '$', right: '$', display: false },
];

// Render $...$ / $$...$$ inside an element (or set text first if `text` given).
export function renderMath(el, text) {
  if (text !== undefined) el.textContent = text;
  if (window.renderMathInElement) {
    try {
      window.renderMathInElement(el, { delimiters: DELIMS, throwOnError: false, ignoredClasses: ['no-math'], ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option'] });
    } catch (e) { console.warn(e); }
  }
  return el;
}

export function tex(src, display = false) {
  if (!window.katex) return escapeHtml(src);
  try {
    return window.katex.renderToString(src, { displayMode: display, throwOnError: false, strict: 'ignore' });
  } catch (e) {
    return `<span class="tex-error">${escapeHtml(src)}</span>`;
  }
}

export function texToElement(src, display = false) {
  const span = document.createElement(display ? 'div' : 'span');
  span.innerHTML = tex(src, display);
  return span;
}

// Check whether a LaTeX string compiles under KaTeX; returns error message or null.
export function texError(src) {
  if (!window.katex) return null;
  try { window.katex.renderToString(src, { throwOnError: true, strict: 'ignore' }); return null; } catch (e) { return e.message.replace(/^KaTeX parse error: /, ''); }
}

// Minimal markdown for AI responses: headings, lists, code, bold/italic, links, tables-lite. Math is preserved for KaTeX.
export function markdown(src) {
  const blocks = [];
  const stash = (html) => { blocks.push(html); return `\u0000${blocks.length - 1}\u0000`; };
  let s = String(src);
  s = s.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => stash(`<pre class="code ${lang ? 'lang-' + lang : ''}"><code>${escapeHtml(code.replace(/\n$/, ''))}</code></pre>`));
  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (m) => stash(escapeHtml(m)));
  s = s.replace(/\\\[([\s\S]+?)\\\]/g, (m) => stash(escapeHtml(m)));
  s = s.replace(/\\\(([\s\S]+?)\\\)/g, (m) => stash(escapeHtml(m)));
  s = s.replace(/\$([^$\n]+?)\$/g, (m) => stash(escapeHtml(m)));
  s = s.replace(/`([^`\n]+)`/g, (_, c) => stash(`<code>${escapeHtml(c)}</code>`));
  s = escapeHtml(s);
  const inline = (t) => t
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\[([^\]]+)\]\((#\/[\w\-/?=&]+)\)/g, '<a href="$2">$1</a>');
  const lines = s.split('\n');
  const out = [];
  let list = null, para = [];
  const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } };
  const flushList = () => { if (list) { out.push(`<${list.type}>${list.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${list.type}>`); list = null; } };
  for (const raw of lines) {
    const line = raw.trimEnd();
    let m;
    if (/^\u0000\d+\u0000$/.test(line.trim()) && blocks[+line.trim().slice(1, -1)].startsWith('<pre')) { flushPara(); flushList(); out.push(line.trim()); continue; }
    if (!line.trim()) { flushPara(); flushList(); continue; }
    if ((m = /^(#{1,4})\s+(.*)$/.exec(line))) { flushPara(); flushList(); const lv = Math.min(4, m[1].length + 2); out.push(`<h${lv}>${inline(m[2])}</h${lv}>`); continue; }
    if ((m = /^\s*[-*]\s+(.*)$/.exec(line))) { flushPara(); if (!list || list.type !== 'ul') { flushList(); list = { type: 'ul', items: [] }; } list.items.push(m[1]); continue; }
    if ((m = /^\s*\d+[.)]\s+(.*)$/.exec(line))) { flushPara(); if (!list || list.type !== 'ol') { flushList(); list = { type: 'ol', items: [] }; } list.items.push(m[1]); continue; }
    if (/^---+$/.test(line)) { flushPara(); flushList(); out.push('<hr>'); continue; }
    if (list && /^\s{2,}\S/.test(raw)) { list.items[list.items.length - 1] += ' ' + line.trim(); continue; }
    flushList();
    para.push(line);
  }
  flushPara(); flushList();
  let html = out.join('\n');
  html = html.replace(/\u0000(\d+)\u0000/g, (_, k) => blocks[+k]);
  return html;
}

// ------------------------------------------------------------- storage

export const store = {
  get(key, def = null) {
    try { const v = localStorage.getItem('mt:' + key); return v === null ? def : JSON.parse(v); } catch { return def; }
  },
  set(key, val) {
    try { localStorage.setItem('mt:' + key, JSON.stringify(val)); } catch { /* storage unavailable */ }
  },
  remove(key) { try { localStorage.removeItem('mt:' + key); } catch { /* ignore */ } },
};

export function debounce(fn, ms = 200) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

export function uid() { return Math.random().toString(36).slice(2, 10); }

export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: name });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
