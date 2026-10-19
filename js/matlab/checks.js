// Automatic checks for MATLAB coding exercises (shared by the browser and the content tests).

import { Matlab } from './interp.js';

// checks: [{ var, value, tol, size, isFunction, message } | { figure:true } | { uses:'integral' } | { notUses:'syms' }
//          | { output:'text' } | { noWarning:true }]
export function runMatlabChecks(code, checks = []) {
  const m = new Matlab();
  const res = m.run(code);
  const problems = [];
  const errors = res.outputs.filter((o) => o.type === 'error');
  if (errors.length) problems.push(`Your code stops with an error: ${errors[0].text}`);
  for (const c of checks) {
    if (c.var) {
      const v = m.getVar(c.var);
      if (!v) { problems.push(c.message || `Variable \`${c.var}\` is not defined.`); continue; }
      if (c.value !== undefined) {
        const val = v.re ? v.re[0] : NaN;
        const target = typeof c.value === 'number' ? c.value : new Matlab().evalNumber(String(c.value));
        if (!(Math.abs(val - target) <= (c.tol ?? 1e-6) * Math.max(1, Math.abs(target)))) problems.push(c.message || `\`${c.var}\` has the value ${val}, which is not right yet.`);
      }
      if (c.size !== undefined && v.re && v.r * v.c !== c.size) problems.push(c.message || `\`${c.var}\` should have ${c.size} elements.`);
      if (c.isFunction && v.t !== 'fn') problems.push(c.message || `\`${c.var}\` should be a function handle (use @(x) ...).`);
    }
    if (c.figure && !res.outputs.some((o) => o.type === 'figure')) problems.push(c.message || 'Your code should produce a figure.');
    if (c.uses && !new RegExp(`\\b${c.uses}\\s*\\(`).test(code)) problems.push(c.message || `Use the function \`${c.uses}\`.`);
    if (c.notUses && new RegExp(`\\b${c.notUses}\\b`).test(code)) problems.push(c.message || `Do not use \`${c.notUses}\`.`);
    if (c.output && !res.outputs.some((o) => o.type === 'text' && o.text.includes(c.output))) problems.push(c.message || `The output should include "${c.output}".`);
    if (c.noWarning && res.outputs.some((o) => o.type === 'warning')) problems.push(c.message || 'Your code produces a warning — fix it.');
  }
  return { problems, outputs: res.outputs };
}
