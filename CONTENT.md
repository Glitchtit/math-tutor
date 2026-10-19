# Writing course content

Courses, parts and modules are registered in `js/content/index.js`. Each module is one file,
for example `js/content/calculus/07-ftc.js`, that default-exports a plain data object. Content files
must not touch the DOM; they are imported by the app and by the Node validator.

Validate after every edit:

```bash
node tests/validate-content.mjs ftc     # only modules whose id contains "ftc"
npm test                                 # interpreter, LaTeX and full content validation
```

The validator renders every formula with KaTeX, compiles every widget expression, runs every MATLAB
snippet in the sandbox interpreter, runs every coding exercise's model solution against its own checks,
and verifies every answer key against itself.

## Module object

```js
export default {
  id: 'ftc',                 // unique across all courses, lowercase-kebab
  number: 7,                 // display number within the course
  part: 'integration',       // a part id from PARTS in js/content/index.js
  hw: 'HW0',                 // optional: homework this module prepares for
  title: 'The Fundamental Theorem of Calculus',
  summary: 'One or two sentences shown on the course map and given to the AI tutor.',
  intro: String.raw`<p>HTML shown on the module page.</p>`,
  lessons: [ { id: 'accumulation', title: '...', blocks: [ ... ] } ],    // 1 · Learn (visual first)
  matlab:  [ { id: 'live-editor', title: '...', blocks: [ ... ] } ],     // 2 · MATLAB Live Editor
  assignments: [ { ... } ],                                              // 3 · Assignments
};
```

## Strings, HTML and math

* Write HTML-with-LaTeX in `String.raw` template literals so backslashes need no escaping:
  ``String.raw`<p>The integral $\int_a^b f(x)\,\mathrm d x$ ...</p>` ``.
* Never write the two characters `$` followed by `{` inside a template literal (that starts JS
  interpolation). Write `$ {` or restructure, e.g. `$\left\{ ... \right\}$` is fine, `${x}$` is not.
* Inline math `$...$`, display math `$$...$$`. Every `$` must be paired.
* LaTeX targets for exercises (`target`, `accept`, `equation` blocks) are plain strings; use
  `String.raw` there too.
* In plain (non-raw) JS strings, every backslash must be doubled.

## Block types (lessons and MATLAB pages)

| type | fields | purpose |
|---|---|---|
| `text` | `html` | Explanation. Short paragraphs. |
| `callout` | `kind` (`note`, `key`, `warn`, `matlab`, `exam`, `def`, `thm`), `title?`, `html` | Definitions, theorems, warnings, exam tips. |
| `widget` | `name`, `config` | Interactive graph or animation (see below). |
| `steps` | `title?`, `steps: [html]` | Worked example revealed one step at a time. |
| `quiz` | `question`, `choices: [html]`, `answer` (index or array of indices), `explain` | Concept check. |
| `table` | `head: [html]`, `rows: [[html]]` | Reference tables (LaTeX command ↔ result, etc.). |
| `latex` | `prompt`, `target`, `accept?: []`, `hint?` | Student retypes a formula in LaTeX; compared up to spacing, optional braces, `\left/\right`, `\mathrm d` vs `d`. |
| `code` | `code`, `caption?`, `editable?`, `autorun?`, `run?` | Runnable MATLAB example in a mini Live Editor. |
| `matlab` | `prompt`, `starter`, `solution`, `checks`, `hint?`, `success?` | Coding exercise with automatic checks. |
| `livescript` | `blocks`, `caption?`, `editable?` | A Live Script (text/equation/code) — model write-ups or an editable practice sheet. |
| `answer` | `part` | A single auto-checked answer box (same format as an assignment part). |

`matlab` checks: `{ var: 'I', value: 1.8, tol?: 1e-6 }` (value may be a MATLAB expression string),
`{ var: 'f', isFunction: true }`, `{ var: 'v', size: 10 }`, `{ figure: true }`, `{ uses: 'integral' }`,
`{ notUses: 'syms' }`, `{ output: 'text' }`, `{ noWarning: true }`; each may carry a `message`.

Live Script blocks (`livescript.blocks`, assignment `solution`, `writeupTemplate`):
`{ type: 'title'|'heading'|'heading2'|'text'|'equation'|'code', content }`. Text blocks support
`$...$`, `**bold**`, `` `mono` `` and `- ` bullet lines. Equation blocks hold display LaTeX only.

## Widgets

All function expressions are MATLAB expression strings (element-wise operators recommended), in `x`
unless stated. Parameters declared in `params` can be used in expressions and become sliders.

| name | config |
|---|---|
| `plot` | `functions: [{expr, label?, color?, dash?}]`, `params: {a: {min, max, value, step?, label?}}`, `xlim`, `ylim`, `shade?: {expr, lower?, from, to, signed?}` (from/to may be param expressions), `points?: [{x, y, label?, hollow?}]`, `vlines?`, `hlines?`, `slopeField?` (expr in x,y), `animate?: {param, from, to, duration}`, `readout?` (`{{expr}}` placeholders), `caption?` |
| `unitcircle` | `{}` |
| `limit` | `f`, `a`, `L?`, `Ltex?`, `valueAt?`, `xlim`, `ylim` |
| `secant` | `f`, `a`, `xlim`, `ylim`, `showTangent?` |
| `derivative` | `f`, `df?`, `x0?`, `xlim`, `ylim`, `dylim?` |
| `extrema` | `f`, `df?`, `d2f?`, `xlim`, `ylim` |
| `antiderivative` | `f`, `F`, `xlim`, `ylim` |
| `riemann` | `f`, `a`, `b`, `n`, `method` (`left/right/mid/trap/simpson`), `nmax?`, `exact?`, `exactTex?`, `xlim`, `ylim` |
| `convergence` | `f`, `a`, `b`, `exact?`, `methods?` |
| `accumulate` | `f`, `a`, `xlim`, `ylim`, `x0?`, `Alim?` |
| `substitution` | `f` (in x), `u` (in x), `fu` (in u), `a`, `b`, `uTex?`, `fLabel?`, `fuLabel?`, `xlim?`, `ulim?`, `ylim?` |
| `areaBetween` | `f`, `g`, `a`, `b`, `xlim`, `ylim`, `areaTex?` |
| `solid` | `f` (outer radius), `g?` (inner), `a`, `b`, `method` (`disk/washer/shell`), `volumeTex?` |
| `arclength` | `f`, `a`, `b`, `xlim`, `ylim`, `exactTex?` |
| `parts` | `u`, `v` (in t), `t0`, `t1`, `ulim?`, `vlim?` |
| `trigsub` | `a`, `kind` (`sin/tan/sec`) |
| `partialFractions` | `f`, `terms: [{expr, label}]`, `asymptotes?`, `xlim`, `ylim`, `readout?` |
| `improper` | `f`, `a`, `b?`, `singular` (`infinite/lower/upper`), `value?`, `valueTex?`, `diverges?`, `tmax?`, `xlim`, `ylim` |
| `slopefield` | `F` (in x,y), `params?`, `initial?: [[x0,y0]]`, `hlines?`, `xlim`, `ylim`, `hint?` |
| `euler` | `F` (in x,y), `x0`, `y0`, `xEnd`, `exact?` (in x), `xlim`, `ylim` |
| `ode` | `F` (in t,y) or `F2` (y'' in t,y,v), `params?`, `y0`, `v0?`, `tspan`, `ylim`, `exact?` (in t), `hlines?`, `slopeField?`, `readout?` (`{{yEnd}}`, `{{yMax}}`, `{{expr}}`) |
| `spring` | `m`, `c`, `k`, `x0`, `v0`, `force?` (in t), `forceTex?`, `T` |
| `sequence` | `a` (in n) or `recursive: {a1, next (in a,n)}`, `nmax`, `L?`, `Ltex?`, `ylim?` |
| `series` | `term` (in n), `n0`, `nmax`, `N?`, `sum?`, `sumTex?`, `integralTest?` (in x), `alternating?`, `view?` |
| `taylor` | `f`, `coef` (Taylor coefficient c_k, in k), `a`, `nmax`, `n?`, `R?`, `Rtex?`, `at?`, `xlim`, `ylim` |
| `phasor` | `phasors: [{amp, phase (deg), label, color?}]`, `omega?`, `showSum?`, `T?` |

## Assignments

```js
{
  id: 'a1', title: 'Problem 1 — ...', difficulty: 'core' | 'challenge' | 'exam', hw?: 'HW0-style',
  statement: String.raw`<p>...</p>`,
  parts: [
    { label: '(a)', prompt: String.raw`...`, kind: 'numeric', answer: '9/5', tol?: 1e-4, hint, solution },
    { label: '(b)', kind: 'expression', variable: 'x', answer: '-exp(-x.^2)/2', upToConstant: true, domain?: [a, b] },
    { label: '(c)', kind: 'choice', choices: [html], answer: 1 },
    { label: '(d)', kind: 'writeup', prompt: '...' },   // free-form, self-assessed against the model solution
  ],
  writeup?: true,                  // offer a Live Script editor for the full solution
  writeupTemplate?: [liveScriptBlocks],
  solution?: [liveScriptBlocks],   // model solution in Live Script style
}
```

Numeric answers may be MATLAB expressions (`'24*sqrt(3)/5'`); students may type expressions too.
Expression answers are compared at sample points in `domain` (default `[0.3, 2.7]`) — pick a domain
where the function is defined. Antiderivatives use `upToConstant: true`.

## Pedagogy and house style

* Lessons are visual first: open with a widget or a picture-like example, then the definition, then a
  worked example (`steps`), then a `quiz`. Keep paragraphs short. Engineering-level precision.
* MATLAB pages teach the homework format gradually: Live Editor layout, LaTeX in the equation editor
  (Ctrl+Shift+L), anonymous functions and element-wise operators, then numerical checks
  (`integral`, `fzero`, `roots`, `trapz`, `ode45`, `quiver`) — never `syms`.
* Every written solution follows the course rule: an English sentence saying what is about to be done,
  then the mathematics.
* Assignments: 3–5 per module, prefer auto-checkable parts, include at least one `writeup` problem with a
  model `solution` from module 5 on. The last module of each part ends with an exam/homework-style
  capstone. Do not copy graded homework problems; write analogous problems with different data.
