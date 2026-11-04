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
| `steps` | `title?`, `problem?`, `kicker?`, `steps: [{do, why}]` | Worked example revealed one step at a time. `do` is one line of maths (one transformation), `why` the plain-words reason. Every step gets an "I don't follow this step" button that asks the tutor. |
| `guided` | `title?`, `problem`, `steps: [{prompt, show?, why?} \| {prompt, ask, hint, reveal, why?}]`, `finale?` | "Your turn — step by step": the same type as the worked example, with new numbers. The student does one small step at a time; `ask` is a part object (`kind`, `answer`, …) checked like an assignment part; `reveal` is the worked line shown after a correct answer or "Show me this step". |
| `refresher` | `title`, `html`, `steps?` | Collapsible reminder of a prerequisite skill (exponent rules, completing the square, …) placed right where it is needed. |
| `quiz` | `question`, `choices: [html]`, `answer` (index or array of indices), `explain` | Concept check. |
| `table` | `head: [html]`, `rows: [[html]]` | Reference tables (LaTeX command ↔ result, etc.). |
| `latex` | `prompt`, `target`, `accept?: []`, `hint?` | Student retypes a formula in LaTeX; compared up to spacing, optional braces, `\left/\right`, `\mathrm d` vs `d`. |
| `code` | `code`, `caption?`, `editable?`, `autorun?`, `run?` | Runnable MATLAB example in a mini Live Editor. |
| `matlab` | `prompt`, `starter`, `solution`, `checks`, `hint?`, `success?` | Coding exercise with automatic checks. |
| `livescript` | `blocks`, `caption?`, `editable?` | A Live Script (text/equation/code) — model write-ups or an editable practice sheet. |
| `answer` | `part` | A single auto-checked answer box (same format as an assignment part). |
| `derive` | see below | **Step-by-step derivation with traced terms.** The default for any worked algebra. |
| `figure` | `svg`, `caption?` | Static inline SVG (circuits, symbols). Use the `.pefig` classes listed below. |
| `reveal` | `prompt`, `blocks`, `checklist?: [html]` | Draw/answer on paper first, then reveal a reference and a marking checklist. |
| `blanks` | `items: [{ html, answers }]` | Fill-in-the-blank sentences; `[[]]` marks each gap. |
| `examquiz` | `questions: [{ q, choices, answer, explain }]`, `penaltyDefault?` | Multiple choice with negative marking, Skip and a net score. |

`matlab` checks: `{ var: 'I', value: 1.8, tol?: 1e-6 }` (value may be a MATLAB expression string),
`{ var: 'f', isFunction: true }`, `{ var: 'v', size: 10 }`, `{ figure: true }`, `{ uses: 'integral' }`,
`{ notUses: 'syms' }`, `{ output: 'text' }`, `{ noWarning: true }`; each may carry a `message`.
`value` checks compare the first element, so for vectors check `size` plus a scalar the student stores
(e.g. `last = a(end)`). Starter code must not use `...` as a placeholder (it is MATLAB line continuation);
write `f = @(x) 0;  % replace 0 by the formula`.

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

## Derivations: the `derive` block

Every worked derivation is a `derive` block. It shows one change per step: the old line on top,
the new line below, a coloured curved arrow from every moving term to where it lands, cancelled
terms crossed out, a chip naming the kind of move, and a plain-language "why". Steps appear one at a
time (Next step reveals and animates); Play slides the terms along the arrows.

```js
{ type: 'derive',
  symbolic: true,                        // derives a formula with parameters → must be followed by a numbers block
  title: 'Boost converter: the gain',    // optional
  colors: { Vs: 1, Vo: 2, D: 3 },        // optional: tag prefix → colour slot 1..8 (else order of appearance)
  steps: [
    { kind: 'both', label: String.raw`Both sides $\div T_s$`,
      from: String.raw`\T{Vs-1}{V_s}\,\T{D-1}{D}\,\T{Ts-1}{T_s} = 0`,   // only the first step needs from
      to:   String.raw`\T{Vs-1}{V_s}\,\T{D-1}{D} = 0`,
      why:  String.raw`Every term has a factor $T_s$; dividing both sides by it leaves $1$.` },
    { kind: 'expand', label: 'Multiply into the bracket',
      to: String.raw`…`,                                   // from = previous to
      map: { 'omd-1': ['omd-1', 'omd-2'] },                // one old term lands in two places
      arrows: { 'omd-1': '× each term' },                  // which moving terms get an arrow + its label
      why: String.raw`…` },
  ] }
```

* **Tags.** `\T{id}{tex}` marks a term. Ids are `prefix-n` (`Vs-1`, `Vs-2`, `omd-1`); the prefix
  picks the colour, so all `Vs-*` share one colour through the whole block. Tag every term that moves,
  is cancelled, or is substituted. Untagged parts (`=`, `+`, constants) simply fade between lines.
* **Moves and cancels** are computed: a tag in `from` moves to every tag with the same id in `to`
  (or to the ids listed in `map`). A tag with no destination is drawn crossed out (in `sub`, `check`, `calc` and `calculus` steps it is faded instead, because it was replaced or evaluated, not cancelled), unless a tagged
  term *inside* it moves (a bracket that dissolves). A step may set its own `from` to re-tag the same
  expression, e.g. to tag the inside of a bracket before expanding it.
* **Arrows** are drawn only for keys in `arrows` (value = label, `''` = no label). Draw them for
  terms that change place (across `=`, into/out of a fraction, fan-out on expanding, substitution);
  leave them off for terms that only shift a little. Arrow routing is automatic.
* **Kinds**: `start`, `sub` (substitute), `both` (same operation on both sides), `expand`, `factor`,
  `cancel`, `calc` (arithmetic), `calculus` (differentiate/integrate), `check`, `result`.
  `label` says the concrete operation ("Both sides $\div U$", "$30\div 12$").
* **One change per step.** Never "move across"; write the operation that makes it true
  ("Both sides $+V_o(1-D)$") and say in `why` that this is why the sign flips.
* **Pairing rule.** A block that derives a formula with parameters (letters standing for quantities,
  e.g. $V_o/V_s = 1/(1-D)$, $\tau = RC$, $I = P/U$) sets `symbolic: true` and is immediately followed
  by a numbers block: `given` (the known values, tagged with the same prefixes so numbers keep the
  colour of the symbol they replace), first step `kind: 'sub'` with arrows from the given values into
  the formula, then solve, then a final `kind: 'check'` step that substitutes the answer back.
  Results only in the independent variable (antiderivatives in $x$, general ODE solutions with $C$,
  closed-form sums) and examples that already use numbers need no companion. The validator enforces
  that every `symbolic: true` block is followed by a `derive` block with `given`.
* Pick clean numbers for numeric examples (results like 0.6, 2.5, 30 V).
* `docs/superpowers/derive-demo.js` holds a complete symbolic + numbers pair (boost converter).

### Solutions as blocks

An assignment part's `solution` may be an HTML string or an **array of lesson blocks**, typically
`[{ type: 'text', html }, { type: 'derive', steps: [...] }]`. Use the block form whenever the
solution restructures a formula over two or more lines; keep a string for one-line or purely verbal
solutions. (The assignment-level Live Script `solution` and `writeupTemplate` stay Live Script.)

## Practice blocks and power-electronics widgets

* `blanks` answers: one per `[[]]` gap, either a string with `|`-separated alternatives
  (`'mercury arc rectifier|mercury arc'`, matched ignoring case, spaces, hyphens and one typo in words
  of 5+ letters) or `{ num, tol? }` (relative tolerance, default 0.01).
* `figure` SVGs and the `pefig` widget share these classes (colours follow the theme):
  `sch` (black wire), `dim`, `hot`/`hot2` (highlighted current loops), `sch-t`/`sch-m` (labels),
  `ax`, `grid`, `svgtxt`/`svgtxt-i`, colour text `ca cb cc cg`, strokes `sa sb sc sg`, fills `fa fb fc fg`
  (a = blue, b = pink, c = amber, g = green).
* Widgets: `pefig` `{ fig, caption?, alt? }` draws a figure from the PE1 study page — `fig` is one of
  `expToolkit rcPlot rlPlot vsBuck vsBoost buckOn buckOff boostOn boostOff drBuck drBuckOn drBuckOff
  drBoost drBoostOn drBoostOff drRC drRL wfBuck wfBoost wfRect wfInv`. `converter`
  `{ topology?: 'buck'|'boost', D?, Vs? }` is the interactive buck/boost explorer.
* Modules without MATLAB pages (`matlab: []`) hide the Live Editor column.

## Assignments

```js
{
  id: 'a1', title: 'Problem 1 — ...', difficulty: 'core' | 'challenge' | 'exam', hw?: 'HW0-style',
  statement: String.raw`<p>...</p>`,
  parts: [
    { label: '(a)', prompt: String.raw`...`, kind: 'numeric', answer: '9/5', tol?: 1e-4, hint, solution },   // solution: html or [blocks]
    { label: '(b)', kind: 'expression', variable: 'x', answer: '-exp(-x.^2)/2', upToConstant: true, domain?: [a, b] },
    { label: '(c)', kind: 'choice', choices: [html], answer: 1 },
    { label: '(d)', kind: 'writeup', prompt: '...' },   // free-form, self-assessed against the model solution
  ],
  examples: ['lesson-id', ...],    // REQUIRED: lessons with the worked example + guided exercise of this exact type
  // every numeric/expression/choice part also needs:
  //   hints: [nudge, method, first step written out]       (at least 2, ideally 3)
  //   walkthrough: [{ do, why }, ...]                      (numeric/expression: the full solution in small steps)
  writeup?: true,                  // offer a Live Script editor for the full solution
  writeupTemplate?: [liveScriptBlocks],
  solution?: [liveScriptBlocks],   // model solution in Live Script style
}
```

Numeric answers may be MATLAB expressions (`'24*sqrt(3)/5'`); students may type expressions too.
Expression answers are compared at sample points in `domain` (default `[0.3, 2.7]`) — pick a domain
where the function is defined. Antiderivatives use `upToConstant: true`.

## The hand-holding standard (enforced by the validator)

Learners must never meet a problem type they have not first seen fully worked and then practised
with support. Each problem type follows **I do → we do → you do**:

1. **I do — worked example** (`steps`): every line of algebra is written out, one transformation per
   step, each with a `why` in plain words naming the rule used. Nothing is "obvious". If a step uses
   a prerequisite skill (fractions, exponent laws, trig identities, completing the square, chain rule…),
   put a `refresher` right before the example.
2. **We do — guided exercise** (`guided`): the same type with different numbers. The student answers the
   small steps (choose u, compute du, rewrite the integral, integrate, substitute back, evaluate) one at a
   time, with a hint per step and "Show me this step".
3. **You do — assignment**: the same type again, now unaided, but with `examples` linking back to 1–2,
   a hint ladder (`hints`: nudge → method → first step) and a full `walkthrough`.

Rules of thumb: introduce one new idea at a time; use concrete numbers before general formulas; define
every symbol the first time; assignments within a module go from "same as the example with new numbers"
to "small variation" to "combination" — and every variation must itself have been shown before.

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
