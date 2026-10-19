// Learner progress, stored in the browser. Also produces a compact summary for the AI tutor.

import { store } from './util.js';

const KEY = 'progress';
let state = store.get(KEY, null) || { visited: {}, done: {}, attempts: {}, log: [] };

function save() { store.set(KEY, state); }

export const progress = {
  visit(key) { state.visited[key] = Date.now(); save(); },
  markDone(key, value = true) { state.done[key] = value ? Date.now() : undefined; if (!value) delete state.done[key]; save(); },
  isDone(key) { return !!state.done[key]; },
  lastVisited() {
    let best = null, t = 0;
    for (const [k, v] of Object.entries(state.visited)) if (v > t) { t = v; best = k; }
    return best;
  },
  // record an answer attempt; meta: { module, kind, label, input, expected }
  attempt(key, ok, meta = {}) {
    const a = state.attempts[key] || { tries: 0, ok: false, wrong: [] };
    a.tries++;
    if (ok) a.ok = true;
    else if (meta.input !== undefined) { a.wrong.push(String(meta.input).slice(0, 120)); a.wrong = a.wrong.slice(-5); }
    a.module = meta.module || a.module;
    a.label = meta.label || a.label;
    a.kind = meta.kind || a.kind;
    state.attempts[key] = a;
    state.log.push({ t: Date.now(), key, ok: !!ok });
    state.log = state.log.slice(-400);
    if (ok) state.done[key] = state.done[key] || Date.now();
    save();
    return a;
  },
  getAttempt(key) { return state.attempts[key] || null; },
  reset() { state = { visited: {}, done: {}, attempts: {}, log: [] }; save(); },
  export() { return JSON.stringify(state, null, 2); },
  import(json) { state = JSON.parse(json); save(); },

  moduleStats(mod) {
    const keys = moduleKeys(mod);
    const done = keys.filter((k) => state.done[k]).length;
    return { done, total: keys.length, pct: keys.length ? Math.round(100 * done / keys.length) : 0 };
  },

  // Plain-text summary used as context for "what should I focus on?"
  summary(modules) {
    const lines = [];
    for (const m of modules) {
      const st = this.moduleStats(m);
      const struggles = Object.entries(state.attempts)
        .filter(([k, a]) => k.startsWith(m.id + '/') && (!a.ok || a.tries >= 3))
        .map(([, a]) => `${a.label || 'exercise'} (${a.ok ? `solved after ${a.tries} tries` : `not solved, ${a.tries} tries`}${a.wrong.length ? `; wrong answers: ${a.wrong.slice(-2).join(' | ')}` : ''})`);
      if (!st.done && !struggles.length && !Object.keys(state.visited).some((k) => k.startsWith(m.id))) {
        lines.push(`- ${m.id} "${m.title}": not started`);
        continue;
      }
      lines.push(`- ${m.id} "${m.title}": ${st.done}/${st.total} items complete${struggles.length ? `; struggles: ${struggles.slice(0, 4).join('; ')}` : ''}`);
    }
    return lines.join('\n');
  },
};

export function moduleKeys(mod) {
  const keys = [];
  (mod.lessons || []).forEach((l) => keys.push(`${mod.id}/learn/${l.id}`));
  (mod.matlab || []).forEach((l) => keys.push(`${mod.id}/matlab/${l.id}`));
  (mod.assignments || []).forEach((a) => keys.push(`${mod.id}/assign/${a.id}`));
  return keys;
}
