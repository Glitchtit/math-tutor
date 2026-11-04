# Animated derivations, Power Electronics course, module rework — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the `derive` block (colour-tracked terms, routed arrows, slide animation, reveal-one-step), the blocks/widgets needed to port the PE1 study page into a native Power Electronics course, rework every existing module to use `derive`, and deploy.

**Architecture:** Pure, DOM-free logic (tag parsing, step resolution, move/cancel matching, arrow routing) lives in `js/derive-core.js` and is unit-tested in Node. `js/derive.js` renders it in the browser (KaTeX + SVG overlay + clone animation). Content stays plain data files validated by `tests/validate-content.mjs`; content tasks run in parallel per module group after the infrastructure tasks land.

**Tech Stack:** Vanilla ES modules, vendored KaTeX (`vendor/katex`), `node:test`, Docker image on GHCR, Unraid host "Tower".

**Spec:** `docs/superpowers/specs/2026-11-04-derivation-steps-design.md`. Prototypes: `.superpowers/brainstorm/274638-1793792285/content/numbers-v6.html` (routing, animation — port its algorithms), `arrows-boost-v2.html`. Artifact source for PE content: `/tmp/claude-1000/-home-glitch-GIT-math-tutor/ec56b3c4-a58f-4a06-b289-fb914fc3340d/scratchpad/art/index.html` (copy it to `docs/superpowers/pe1-artifact.html` in Task 1 so it survives).

## Global Constraints

- No new runtime dependencies; no CDN loads. KaTeX from `vendor/katex`.
- Content files never touch the DOM; `String.raw` for all LaTeX/HTML; never `$` followed by `{` in template literals.
- `\T{id}{tex}` is the only tagging syntax; ids are `prefix-n` (`[A-Za-z]+(-[A-Za-z0-9]+)?`); the prefix selects the colour.
- KaTeX `trust` is enabled only for `\htmlData` (trust callback `(ctx) => ctx.command === '\\htmlData'`).
- Step kinds: `start | sub | both | expand | factor | cancel | calc | calculus | check | result`.
- UI copy in English. Commits: identity Glitchtit, no AI co-author trailers. Work on branch `derive-steps`; merge to `main` only in Task 12.
- `npm test` green after every task.

## Review Focus

1. Derivation inside a lesson tab that was hidden at render time → arrows drawn when it becomes visible, not at (0,0). Test: Task 3 Step 4.
2. Narrow screen (360 px) with a line wider than the step → line scrolls horizontally, arrows stay attached to the terms. Test: Task 3 Step 4.
3. Theme switched light↔dark after render → term and arrow colours follow. Test: Task 3 Step 4.
4. Same tag id twice in one line (author error) or an `arrows` key that is not in `from` → validator fails with the step named. Test: Task 2 Step 1.
5. Rapid double-click on Play / Next step → no duplicated clones, no stuck half-faded line. Test: Task 3 Step 4.

---

### Task 1: Pure derivation core

**Files:**
- Create: `js/derive-core.js`, `tests/derive.test.mjs`, `docs/superpowers/pe1-artifact.html` (copy of artifact)
- Modify: `.gitignore` (add `.superpowers/`, `.playwright-mcp/`)

**Interfaces:**
- Produces:
  - `TAG_MACROS: { '\\T': '\\htmlData{t=#1}{#2}' }`
  - `tagIds(tex: string) -> string[]` — ids in source order (handles nesting).
  - `resolveSteps(block) -> Array<{...step, from: string, to: string}>` — fills `from` from the previous `to`; throws `Error('step 1 has no from')` if the first lacks it.
  - `plan(oldIds: string[], newIds: string[], map?: Record<string,string[]>, parentOf?: Record<string,string|null>) -> { moves: Array<{id, targets: string[]}>, cancelled: string[] }` — a tag moves to every new id equal to it or listed in `map[id]`; a tag is cancelled when neither it nor any descendant has a target; a tag whose ancestor moves is not listed in `moves`.
  - `colourSlot(id: string, colors?: Record<string,number>, seen: string[]) -> number` — slot 1..8, explicit `colors[prefix]` wins, else order of first appearance.
  - `route(src: Box, dst: Box, obstacles: Box[], line: Box) -> { d: string, end: [x,y], side: 'top'|'left'|'right'|'bottom' }`, `Box = {x,y,w,h}`. Candidates and scoring as in `numbers-v6.html`; swing-out lanes 30 px beyond the line (tighter than the prototype's 45).

- [ ] **Step 1: Write failing tests** in `tests/derive.test.mjs`:
  - `tagIds(String.raw`\T{a-1}{x}+\T{b-1}{(\T{c-1}{1}-y)}`)` → `['a-1','b-1','c-1']`.
  - `resolveSteps({steps:[{from:'A',to:'B'},{to:'C'}]})[1].from === 'B'`; missing first `from` throws.
  - `plan(['Vs-1','Ts-1'],['Vs-1'])` → moves `[{id:'Vs-1',targets:['Vs-1']}]`, cancelled `['Ts-1']`.
  - `plan(['omd-1'],['omd-1','omd-2'],{'omd-1':['omd-1','omd-2']})` → targets both.
  - nested: parent `omd-2` with no target but child `D-2` with target → `omd-2` not cancelled, `D-2` moves.
  - `route`: target directly under an obstacle box (numerator) with source above → `side !== 'top'` and no sampled point of `d` inside the obstacle; target with clear sky → `side === 'top'`.
- [ ] **Step 2:** `node --test tests/derive.test.mjs` → FAIL (module missing).
- [ ] **Step 3:** Implement `js/derive-core.js` (export the functions above; `route` samples the cubic at 80 points, score = hits·1000 + chord length + candidate penalty).
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Commit `Add pure derivation core: tags, step resolution, move plan, arrow routing`.

### Task 2: Validator support for `derive` and block-array solutions

**Files:** Modify `tests/validate-content.mjs`; extend `tests/derive.test.mjs`.

**Interfaces:** Consumes `tagIds`, `resolveSteps`, `TAG_MACROS`. Produces `validateDerive(b, where, issues)` used for `case 'derive'`; `validatePart` accepts `solution` as string **or** block array (`validateBlocks`).

- [ ] **Step 1: Failing tests** (call `validateBlocks` on fixtures): duplicate id in one line → issue containing `duplicate tag`; `arrows` key absent from `from` → `arrows key "x-1" not in step 2`; `map` target absent from `to` → issue; bad LaTeX in `to` → `LaTeX error`; unknown `kind` → issue; `symbolic: true` block not followed by a `derive` with `given` → `needs a numbers companion`; part with `solution: [{type:'text', html:'$x$'}]` → no issues.
- [ ] **Step 2:** run → FAIL. **Step 3:** implement (render with `{trust: (c) => c.command === '\\htmlData', macros: {...TAG_MACROS}}`; also `mathIn` on `label`, `why`, `given`, `title`). **Step 4:** `npm test` PASS. **Step 5:** commit.

### Task 3: `derive` renderer

**Files:** Create `js/derive.js`; modify `js/blocks.js` (register `RENDER.derive`, solution arrays), `css/style.css` (`--term-1…8` in dark and light themes, `.blk-derive` styles, chip colours per kind), `js/util.js` (export `texDerive(src)` rendering with the trust callback + macros).

**Interfaces:** Consumes Task 1. Produces `renderDerive(block, ctx) -> HTMLElement`; `RENDER.derive = renderDerive`. Solution arrays render via `renderBlocks(sol, part.solution, ctx)`.

Behaviour (spec §Rendering): `given` line; steps revealed one at a time — "Next step" reveals + plays, "Show all" reveals without animation; each step has ▶ Play; block-level "Play all"; chip = kind + `label`; `why` below; cancelled tags get `.gone` (diagonal strike); arrows via `route()` drawn after `document.fonts.ready` and on ResizeObserver/theme change (`data-theme` MutationObserver); lines in `overflow-x:auto` wrapper, coordinates taken relative to the scrolled `.lines` box; `prefers-reduced-motion` → cross-fade; Play is ignored while a play is running (guard flag).

- [ ] **Step 1:** Temporarily add a `derive` demo (the boost symbolic + numbers blocks from the prototypes, translated to the block format) as the first lesson of `js/content/ee/01-ee-intro.js`.
- [ ] **Step 2:** `npm test` → PASS (validator accepts the demo).
- [ ] **Step 3:** Implement `js/derive.js` + CSS.
- [ ] **Step 4: Browser verification** (Playwright MCP against `node server.mjs`, `http://localhost:8080/#/module/ee-intro/learn/<id>`): screenshot after Show all — no arrow crosses glyphs; click Next step ×3 fast → exactly one clone set at a time and no element left with `.ghosted`; resize to 360 px wide → arrows still start/end on their terms; toggle theme → arrow stroke colours change; open a lesson tab while the block was rendered hidden → arrows present. Console: no errors.
- [ ] **Step 5:** commit `Add derive block renderer`.

### Task 4: Practice blocks `figure`, `reveal`, `blanks`, `examquiz`

**Files:** Create `js/practice.js` (renderers); modify `js/blocks.js` (register), `js/check.js` (add `checkText(part, input)` for `kind: 'text'`), `css/style.css`, `tests/validate-content.mjs`, `tests/derive.test.mjs` (or new `tests/practice.test.mjs`).

**Interfaces:**
- `figure`: `{ svg: string, caption?: html }` — SVG may use classes `t1…t8` (stroke/fill = `--term-n`).
- `reveal`: `{ prompt: html, blocks: Block[], checklist?: html[] }` — "Draw it on paper first", toggle shows blocks + checklist.
- `blanks`: `{ items: [{ html /* contains one or more [[…]] gaps */, answers: Array<string|number|{num, tol}> }] }`; gaps rendered as inputs checked on input.
- `checkText({answers: string[]}, input) -> {ok}` — case/space/punctuation-insensitive, Levenshtein ≤ 1 for words ≥ 5 chars, any listed alternative.
- `examquiz`: `{ penaltyDefault?: number, questions: [{ q: html, choices: html[], answer: number, explain: html }] }` — penalty select 0, −0.25, −0.33, −0.5, −1; Skip; score bar right/wrong/skipped/net.
- [ ] **Step 1: Failing tests:** `checkText({answers:['balanced']}, ' Balanced ')` ok; `'balnced'` ok; `'unbalanced'` not ok; numeric gap `{num:3,tol:0.01}` with `'3.00'` ok; validator: `examquiz` answer index out of range → issue; `blanks` item whose gap count ≠ answers length → issue.
- [ ] **Step 2–4:** run FAIL → implement → `npm test` PASS. Browser check one of each in the demo lesson.
- [ ] **Step 5:** commit.

### Task 5: Widgets `converter` and `waveform`

**Files:** Modify `js/widgets.js` (register both, add to `WIDGET_NAMES`), `tests/validate-content.mjs` (config checks).

**Interfaces:**
- `converter`: `{ topology?: 'buck'|'boost', D?: 0.4, Vs?: 24, Dlim?: [0.05, 0.9], Vslim?: [5, 48] }` — port the artifact's explorer (`#wave`, readout Vo, v_L·D, v_L·(1−D), sum).
- `waveform`: `{ kind: 'buck'|'boost'|'rc'|'rl'|'diode'|'halfwave'|'inverter', show?: string[] }` — port the artifact's drawing-practice reference drawers.
- [ ] **Step 1:** validator test: unknown `kind` → issue. **Step 2–4** as usual; browser check both in demo lesson. **Step 5:** commit.

### Task 6: App changes, PE course registration, docs

**Files:** Modify `js/app.js` (hide MATLAB column and exclude it from completion when `!(m.matlab||[]).length`), `js/content/index.js` (course `pe`, parts, imports of 8 stub modules), create 8 stub files under `js/content/pe/` (`00-exam.js`, `01-fundamentals.js`, `02-components.js`, `03-transients.js`, `04-kirchhoff.js`, `05-semiconductors.js`, `06-converters.js`, `07-practice.js`, ids `pe-exam, pe-l1, pe-l2-components, pe-l2-transients, pe-l2-kirchhoff, pe-l3, pe-l4, pe-practice`), `CONTENT.md` (derive format, tagging, kinds, pairing rule, colour slots, new blocks/widgets, solution arrays, an annotated example), remove the Task 3 demo from the EE intro.

- PE course: `{ id:'pe', title:'Power Electronics', subtitle:'PE1 Mini Exam 1: lectures 1–4', tutorScope:'introductory power electronics: conversion types, components, RC/RL transients, KCL/KVL incl. bridge circuits, power semiconductors (diode, BJT, SCR, MOSFET, IGBT, SiC/GaN), buck and boost DC-DC converters with volt-second and amp-second balance' }`; parts `pe-prep` (Exam prep), `pe-basics` (Lectures 1–2), `pe-devices` (Lectures 3–4), `pe-practice` (Practice).
- [ ] Steps: implement → `npm test` PASS → browser: PE course map shows 8 modules, a stub module page has no MATLAB column → commit.

### Tasks 7–9: PE content (parallel, one implementer each)

Each implementer ports artifact sections into native blocks per spec table; every derivation → `derive` (+ numbers companion when `symbolic`); figures → `figure`; facts verbatim; "BEYOND SLIDES" kept as a `callout` tag; date conflicts kept with the L3 recommendation.

- **Task 7:** `pe-exam`, `pe-l1`, `pe-l2-components`.
- **Task 8:** `pe-l2-transients`, `pe-l2-kirchhoff` (bridge question (a)+(b), divider check, balance condition, P11 as an assignment), `pe-l3`.
- **Task 9:** `pe-l4` (incl. `converter` widget), `pe-practice` (P1–P10 as assignments with numeric/choice parts and `derive` solutions; 40 fill-ins → `blanks`; 9 drawing tasks → `reveal` + `waveform`/`figure`; 10 theory → `writeup` parts; 34 questions → one `examquiz`).
- Each: `node tests/validate-content.mjs pe-` clean → `npm test` → screenshot each module's lessons once → commit per module.

### Tasks 10–11: Rework existing modules (parallel, one implementer per group)

Groups: A `01–04`, B `05–08`, C `09–12`, D `13–16`, E `17–19` + `ee-intro`, F `20–22`.
Per module: every `steps` block that restructures formulas → `derive` (procedural walkthroughs may stay `steps` with their algebra lines moved into `derive`); add numbers companions for `symbolic` derivations; every assignment part `solution` that restructures a formula over ≥ 2 lines → `[{type:'text',…},{type:'derive',…}]`; `validate-content.mjs <id>` clean; commit per module.

### Task 12: Review, merge, deploy

- [ ] Whole-branch review (fresh reviewer, most capable model) against spec; fix findings.
- [ ] `npm test` PASS; browser spot-check 3 calculus modules + 2 PE modules light and dark.
- [ ] Merge `derive-steps` → `main` (fast-forward or merge commit), `git push origin main`.
- [ ] Watch CI: `gh run watch` → both jobs green; image `ghcr.io/glitchtit/math-tutor:<sha>` exists.
- [ ] Tower: inspect current container (`docker inspect math-tutor`) to capture run settings; `docker pull ghcr.io/glitchtit/math-tutor:latest`; recreate with identical settings (Unraid template if it exists, else same `docker run` args).
- [ ] Verify `http://192.168.50.111:8098/api/health` OK and `#/course/pe` renders a derive block (Playwright screenshot).
