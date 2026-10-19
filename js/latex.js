// Tolerant comparison of LaTeX snippets for the "write it in the Live Editor" exercises.
// Two snippets are considered equal when they typeset to the same thing up to spacing,
// optional braces, \left/\right sizing and a few synonyms.

const SPACING = new Set(['\\,', '\\;', '\\:', '\\!', '\\quad', '\\qquad', '\\ ', '~', '\\enspace', '\\thinspace']);
const SIZING = new Set(['\\left', '\\right', '\\big', '\\Big', '\\bigg', '\\Bigg', '\\bigl', '\\bigr', '\\Bigl', '\\Bigr', '\\biggl', '\\biggr', '\\displaystyle', '\\textstyle']);
const SYNONYM = {
  '\\dfrac': '\\frac', '\\tfrac': '\\frac', '\\rightarrow': '\\to', '\\le': '\\leq', '\\ge': '\\geq', '\\ne': '\\neq',
  '\\lbrack': '[', '\\rbrack': ']', '\\lbrace': '\\{', '\\rbrace': '\\}', '\\textrm': '\\mathrm', '\\text': '\\mathrm',
  '\\operatorname': '\\mathrm', '\\ldotp': '.', '\\cdotp': '\\cdot', '\\lvert': '|', '\\rvert': '|', '\\vert': '|',
  '\\mid': '|', '\\gets': '\\leftarrow', '\\dots': '\\ldots', '\\prime': "'", '\\infin': '\\infty', '\\to': '\\to',
};

export function tokenizeTex(src) {
  const toks = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '\\') {
      const m = /^\\([A-Za-z]+|.)/.exec(src.slice(i));
      toks.push(m[0]);
      i += m[0].length;
      continue;
    }
    if (/\s/.test(c)) { i++; continue; }
    toks.push(c);
    i++;
  }
  return toks;
}

function parseGroup(toks, pos, close) {
  const items = [];
  while (pos.i < toks.length) {
    const t = toks[pos.i++];
    if (t === close) return items;
    if (t === '{') { items.push({ g: parseGroup(toks, pos, '}') }); continue; }
    items.push(t);
  }
  return items;
}

function normItems(items) {
  let out = [];
  for (let k = 0; k < items.length; k++) {
    let t = items[k];
    if (typeof t === 'string') {
      if (SPACING.has(t) || SIZING.has(t)) continue;
      if (SYNONYM[t]) t = SYNONYM[t];
      // \mathrm d  -> d ; \mathrm{d} -> d (single letter roman is treated as plain)
      if (t === '\\mathrm') {
        const nx = items[k + 1];
        if (nx && typeof nx === 'object' && nx.g) {
          const inner = normItems(nx.g);
          if (inner.length === 1) { out.push(inner[0]); k++; continue; }
          out.push('\\mathrm', { g: inner }); k++; continue;
        }
        if (typeof nx === 'string') { out.push(nx); k++; continue; }
      }
      out.push(t);
    } else {
      const inner = normItems(t.g);
      out.push({ g: inner });
    }
  }
  // unwrap single-token groups, drop empty groups
  out = out.flatMap((t) => (typeof t === 'object' ? (t.g.length === 0 ? [] : t.g.length === 1 ? [t.g[0]] : [t]) : [t]));
  // canonical order: _ before ^ when both are attached
  for (let k = 0; k + 3 < out.length; k++) {
    if (out[k] === '^' && out[k + 2] === '_') {
      const sup = out[k + 1], sub = out[k + 3];
      out.splice(k, 4, '_', sub, '^', sup);
    }
  }
  // drop trailing punctuation
  while (out.length && (out[out.length - 1] === '.' || out[out.length - 1] === ',')) out.pop();
  return out;
}

function serialize(items) {
  return items.map((t) => (typeof t === 'string' ? t : `{${serialize(t.g)}}`)).join(' ');
}

export function normalizeTex(src) {
  const toks = tokenizeTex(String(src || '').trim());
  const tree = parseGroup(toks, { i: 0 }, null);
  return serialize(normItems(tree));
}

// MathML structural fingerprint (browser only): ignores attributes and spacing elements
function mathmlFingerprint(src) {
  if (typeof window === 'undefined' || !window.katex) return null;
  let html;
  try {
    html = window.katex.renderToString(src, { output: 'mathml', throwOnError: true, strict: 'ignore' });
  } catch { return null; }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('annotation, mspace').forEach((n) => n.remove());
  const walk = (n) => {
    if (n.nodeType === 3) return n.textContent.trim();
    if (n.nodeType !== 1) return '';
    const tag = n.tagName.toLowerCase();
    const kids = Array.from(n.childNodes).map(walk).filter(Boolean);
    if (['mrow', 'semantics', 'math', 'span', 'mstyle'].includes(tag)) return kids.join('');
    return `<${tag}>${kids.join('')}</${tag}>`;
  };
  return walk(doc.body);
}

export function texEquivalent(a, b) {
  if (normalizeTex(a) === normalizeTex(b)) return true;
  const fa = mathmlFingerprint(a), fb = mathmlFingerprint(b);
  return fa !== null && fa === fb;
}

export function texMatchesAny(input, targets) {
  return targets.some((t) => texEquivalent(input, t));
}
