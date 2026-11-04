# Brief for content agents (derive-steps branch)

You are converting course content in `/home/glitch/GIT/math-tutor` (a static course web app; content
is plain JS data files). Several agents work **in the same working tree at the same time**, each on
its own files.

## Why this work exists

The learner struggles to follow math when formulas are restructured: substitution, moving terms
across `=`, expanding, cancelling. The new `derive` block shows one change per step, colour-tracks
every term, draws arrows from each moving term to where it lands, strikes out cancelled terms, and
says *why* each step is allowed. Every derivation of a formula with parameters is followed by the
same thing **with real numbers** (substitute → solve → check). Your job is to make the content use
this everywhere it applies. Clarity for a struggling student beats brevity: never skip a step,
never write "move across" without the operation that makes it true.

## Read first (in this order)

1. `CONTENT.md` — whole file; especially "Derivations: the `derive` block", "Solutions as blocks",
   "Practice blocks and power-electronics widgets", and the string/LaTeX rules near the top.
2. `docs/superpowers/derive-demo.js` — a complete symbolic + numbers pair and one of every new block.
3. `docs/superpowers/specs/2026-11-04-derivation-steps-design.md` — the design (intent, anti-goals).
4. One already-written module of the same course to match tone and structure.

## Rules

- Edit **only the files assigned to you**. Never edit `js/*.js`, `css/`, `tests/`, `CONTENT.md`,
  `js/content/index.js` or other agents' files. If you find a renderer/validator bug or need a
  feature, stop working around it and describe it in your final report.
- **Do not commit and do not run `git` commands that change state** (no add/commit/stash/checkout).
  The coordinator commits after reviewing.
- Do not use the browser or start servers. Validate with Node only:
  `node tests/validate-content.mjs <module-id>` must print `Content OK.` for each of your modules.
  (The full `npm test` may fail while other agents are mid-edit; only your modules must be clean.)
- `String.raw` for every LaTeX/HTML string. Never `$` immediately followed by `{` in a template literal.
  Use `$...$` / `$$...$$` in prose (not `\(...\)`).
- `\T{id}{...}` tags only work inside `derive` lines (`from`, `to`, `given`), not in prose. Prose math
  stays uncoloured.
- Keep every existing fact, number, answer key and exercise intact unless it is wrong; you are
  restructuring presentation, not rewriting the course. Answer keys must still pass the validator.
- Tag ids: `prefix-n`, letters for the prefix (`Vs-1`, `omd-2`, `x-1`, `u-1`). Same prefix = same
  colour across the block; use `colors` to pin important quantities to stable slots.
- `arrows` only for terms that visibly change place (across `=`, into/out of a fraction, fan-out
  when expanding, substitution from `given`). Not for terms that just shift a little.
- Each `why` is 1–3 short sentences in plain English: what operation, and why it is allowed.
- Numbers companions: clean values, units in `given`, last step `kind: 'check'`.

## What "converted" means

- Every `steps` block whose steps restructure formulas → a `derive` block (a procedural walkthrough
  such as "1. choose u, 2. compute du" may stay `steps` if it does not restructure a formula; move any
  algebra inside it into a `derive`).
- Formula derivations written inside `text` blocks (chains of `$$...$$` with "so", "hence") → `derive`.
- Every assignment part `solution` (and `answer`-block part solution) that restructures a formula over
  two or more lines → `solution: [ { type: 'text', html: '<p>What we will do.</p>' }, { type: 'derive', steps: [...] } ]`.
  One-line or purely verbal solutions stay strings.
- `symbolic: true` + numbers companion for formulas with parameters; none for results only in the
  independent variable (antiderivatives in x, ODE solutions with C, closed-form sums) or examples that
  already use numbers.

## Final report (your last message)

For each module: number of `derive` blocks added, `steps` blocks converted / kept (and why kept),
solutions converted / kept as strings, numbers companions added, and the `validate-content` result.
Then: any renderer/validator problems you hit, and anything you were unsure about. Keep it short.

## Addendum (round 2, after merging the hand-holding rewrite)

`main` gained a **hand-holding standard** (read "The hand-holding standard" in CONTENT.md; it is
enforced by the validator): I do (worked example) → we do (`guided` exercise) → you do (assignment
with `examples`, a `hints` ladder of ≥2 levels and a `walkthrough`). Worked steps in the `steps`
block are now `{ do, why }` objects. The calculus modules on `main` were rewritten to this standard.

- **Keep everything the hand-holding rewrite added**: guided exercises, refreshers, hint ladders,
  example links, the I do → we do → you do order. Do not remove or weaken any of it.
- **Calculus conversion**: a `steps` block whose `{do, why}` lines restructure formulas becomes a
  `derive` block (each `do` → one step's `to`, each `why` → that step's `why`; split any `do` that
  makes two moves). Keep the block's title/problem as a `text` block or the derive `title`. A
  `walkthrough` whose steps restructure formulas becomes the block form
  `[{ type: 'text', html }, { type: 'derive', steps: [...] }]`. Refresher steps and guided exercises
  stay as they are. Add `symbolic: true` + a numbers companion where a formula with parameters is
  derived (same rule as before).
- Part `solution` strings are hidden when a walkthrough exists; leave them unchanged.
- A module that has assignments needs ≥ 2 `guided` exercises in its lessons, and every assignment
  needs `examples` naming lessons that contain a worked example (`steps` or `derive`) and a `guided`.
- The scratchpad is shared between agents: name any helper script uniquely (include your module ids).
