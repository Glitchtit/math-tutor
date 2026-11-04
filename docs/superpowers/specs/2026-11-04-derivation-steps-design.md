# Animated derivations, Power Electronics course, and module rework

Date: 2026-11-04 · Status: approved in conversation; builder check done, answers folded in

## Why

The user is a student who loses the thread when a formula is restructured: substitution, moving
terms across the `=`, expanding, cancelling. A claude.ai study page they made for *Power Electronics 1,
Mini Exam 1* (artifact `E462L682QqYbrTuz5tquth`, local copy at
`scratchpad/art/index.html`, chat at claude.ai/share/64ca448a-…) showed what helps: one change per
step, a label for the kind of move, colours that follow each term from line to line, crossed-out
cancellations, and a plain-language "why" line under each step. The user wants that teaching style
to be the core of math-tutor, extended with **arrows that show where each term moves**, and with
every symbolic derivation followed by a **worked example with real numbers**.

Approved prototypes (in `.superpowers/brainstorm/274638-1793792285/content/`):
`arrows-boost-v2.html` (symbolic, 6 steps) and `numbers-v6.html` (numeric, 7 steps). The user picked
the combination of "before → after map with curved arrows" (static) and "terms slide along the arrows
on Play" (animated).

## Goals

1. A new lesson block, `derive`, that renders a derivation as a list of steps. Each step shows the
   old line, the new line, colour-coded curved arrows from every moving term to where it lands
   (labelled with the operation, e.g. "÷ U"), crossed-out cancelled terms, a step-kind chip and a
   "why" line. A Play button per step slides the terms along the arrows, leaving a faint copy; a
   "Play all" plays the steps in order.
2. Pairing rule: every derivation of a symbolic result is followed by a `derive` block that applies
   it with real numbers (substitute givens → solve → check). Numbers keep the colour of the symbol
   they replace.
3. A new course, **Power Electronics** (`pe`), that ports the whole artifact into native modules
   (lectures 1–4 plus exam practice), including the bridge-circuit exam question from the chat.
4. Rework of all existing modules (22 calculus, 1 EE) so their algebraic worked examples use
   `derive`, with numeric companions where the derivation is symbolic.
5. New widgets/blocks the port needs (listed below).
6. Ship: tests green, pushed to `main`, CI publishes the image, Tower's `math-tutor` container
   (port 8098) runs the new image.

## Non-goals

- No authoring UI; content stays hand-written JS data files.
- No change to the AI tutor, MATLAB interpreter, progress model, or theme beyond what new blocks need.
- No pixel-perfect copy of the artifact's look; it is re-expressed in the app's design system.
- The artifact itself is not modified.

## Anti-goals (failure even if it "works")

- Arrows that cross other symbols or labels sitting on top of formulas. Readability is the point.
- Hidden steps: skipping "divide both sides" by writing "move across" without showing why.
- Colour that changes meaning between lines (a term must keep its colour throughout a block).
- Content that silently fails to render: every new block must be covered by `tests/validate-content.mjs`.

## The `derive` block (decided)

### Authoring format

```js
{ type: 'derive',
  title: 'Boost converter: output voltage',              // optional
  given: String.raw`V_s = 12\text{ V},\ V_o = 30\text{ V}`, // optional, shown above step 1
  colors: { Vs: 1, Vo: 2, D: 3, omd: 4 },                 // optional: tag prefix -> palette slot
  steps: [
    { kind: 'both', label: String.raw`Both sides $\div T_s$`,
      from: String.raw`\T{Vs-1}{V_s}\,\T{D-1}{D}\,\T{Ts-1}{T_s} + \dots = 0`,   // optional after step 1
      to:   String.raw`\T{Vs-1}{V_s}\,\T{D-1}{D} + \dots = 0`,
      map:    { 'omd-1': ['omd-1', 'omd-2'] },   // optional fan-out: old tag -> new tags
      arrows: { 'omd-1': '× each term' },          // which moved tags get a drawn arrow, and its label ('' = no label)
      why: String.raw`<p>Every term has a factor $T_s$ …</p>` },
    …
  ] }
```

- `\T{id}{tex}` tags a term (KaTeX macro → `\htmlData{t=id}{…}`; rendering needs `trust` for
  `htmlData` only). Ids are `prefix-n`; the prefix picks the colour, so `Vs-1` and `Vs-2` share a colour.
- `from` defaults to the previous step's `to`, so most steps only write `to`. A step may override
  `from` to re-tag the same expression (e.g. tag the inside of a bracket before expanding it).
- Matching: an old tag moves to every new tag with the same id (or the ids listed in `map`).
  Old tags with no destination, and no tagged descendant with one, are drawn crossed out.
  Untagged parts (operators, `=`, constants) simply fade between lines.
- `kind` is one of `start | sub | both | expand | factor | cancel | calc | calculus | check | result`;
  it sets the chip colour and is shown with `label`. `result` and `check` steps get the highlighted style.

### Rendering (decided)

- Both lines rendered with KaTeX (vendored), old above new, a gap between them for the arrows,
  an SVG overlay for the arrows.
- **Arrow routing**: for every arrow, try a fixed set of candidate Bézier paths (enter the target from
  above, from the left, from the right, from below, and swing-out lanes around the ends of the new
  line), sample each against the boxes of all visible glyphs and fraction bars in both lines, and
  keep the one with the fewest hits, then the shortest. This is the algorithm in `numbers-v6.html`;
  the builder should tighten the swing-out loops, which are still too wide there.
- Labels sit near the start of their arrow on the outer side, staggered so they do not overlap each other.
- Colours come from theme CSS variables (`--viz-1…4` plus new slots added to both the dark and
  light themes), so light mode works.
- Redraw on resize and theme change, and when a hidden lesson tab becomes visible (layout boxes are
  zero while hidden) — use a ResizeObserver on the block.
- Narrow screens: each line scrolls horizontally inside its step. Arrows are computed in the
  scrolled container's coordinates.
- **Reveal behaviour (user's choice):** steps appear one at a time. "Next step" reveals the next
  step *and* plays its slide animation, so the student can try the move first. "Show all" reveals
  the rest without animating. Every revealed step keeps its own ▶ Play to replay. Arrows are drawn
  when a step becomes visible.
- `prefers-reduced-motion`: Play cross-fades instead of sliding.
- Accessibility: the SVG is `aria-hidden`; the chip, label and why line carry the meaning in text.
  Play buttons are real buttons with labels.

### Pairing convention (decided)

A `derive` block that derives a **formula with parameters** (letters standing for quantities, e.g.
$V_o/V_s = 1/(1-D)$, $\tau = RC$, $v_C(t) = V(1-e^{-t/RC})$, $I = P/U$) is marked `symbolic: true`
and must be immediately followed by a numbers `derive` block whose first step is `sub` from a `given`
line and whose last step is `check` (substitute the answer back into the original formula). Results
that only involve the independent variable (antiderivatives in $x$, general ODE solutions with $C$,
closed-form sums) and examples that already use concrete numbers need no companion (builder's
call, recorded here). The validator fails when a `symbolic: true` block is not followed by a `derive`
block with `given`.

## Power Electronics course (decided structure, content from the artifact)

Course `pe`, title "Power Electronics", one part per lecture block. Modules map to artifact sections:

| Module | Artifact sections |
|---|---|
| `pe-exam` Exam format & math toolkit | 00 Exam format, negative marking, formula sheet use, "How to read the math", formula sheet, Math toolkit M1–M9 |
| `pe-l1` Fundamentals | Lecture 1 |
| `pe-l2-components` Laws and components | Lecture 2 part 1 |
| `pe-l2-transients` RC and RL charging | Lecture 2 part 2 |
| `pe-l2-kirchhoff` KCL/KVL and bridge circuits | Lecture 2 part 3, including the bridge exam question (a)+(b) |
| `pe-l3` Power semiconductors | Lecture 3 |
| `pe-l4` DC-DC converters | Lecture 4 + converter explorer |
| `pe-practice` Mini exam 1 practice | Worked problems P1–P11, fill-in-the-blanks, drawing practice, theory questions, quiz |

Every derivation in the artifact becomes a `derive` block (plus numbers companion). Figures (circuit
and waveform SVGs) are ported. Facts, numbers and the three flagged lecture date conflicts
(SCR, MOSFET, IGBT years) are kept exactly as the artifact states them. "BEYOND SLIDES" markers stay.

## New blocks / widgets (decided)

| Name | Kind | Purpose |
|---|---|---|
| `derive` | block | Above. |
| `figure` | block | Static inline SVG + caption (circuits, device symbols). SVG uses theme colour classes so it follows the term colours. |
| `converter` | widget | Buck/boost explorer: topology toggle, D and V_s sliders, switch / v_L / i_L waveforms with shaded volt-second areas, readout of V_o and the two areas summing to 0. |
| `waveform` | widget | Draws the reference waveforms used in drawing practice (switch signals, v_L, i_L, i_C for buck/boost, RC/RL curves, diode IV, half-wave rectifier, half-bridge inverter). |
| `examquiz` | block | A set of multiple-choice questions with a negative-marking setting (0 to −1), Skip, and a running right/wrong/skipped/net score. |
| `blanks` | block | Fill-in-the-blank sentences checked as you type: numbers with tolerance, words matched loosely (case, spacing, small typos, listed alternatives). |
| `reveal` | block | Drawing/theory practice: prompt, "draw it on paper first", then a toggle that reveals a reference (figure or widget) and a marking checklist. |

Existing `quiz`, `answer` (incl. `writeup` parts), `steps`, `callout`, `table` remain and are used where they fit.

**PE module pages (builder's call):** lessons, no MATLAB pages. Worked problems P1–P11 become
assignments with auto-checked `numeric`/`choice` parts whose solutions are `derive` blocks; theory
questions become `writeup` parts with the model answer. The module page hides the "MATLAB Live
Editor" column and leaves it out of completion counting when a module has no MATLAB pages.

## Rework of existing modules (decided)

For each of the 22 calculus modules and the EE intro: convert every `steps` block (116 in total) or worked
solution that manipulates formulas into `derive`, and add a numbers companion after symbolic
derivations. Procedural walkthroughs that don't restructure a formula (e.g. "1. pick u, 2. find du")
may stay `steps`, but their algebra lines should become `derive`.

**Assignment part solutions (user's choice: convert them too).** `part.solution` accepts either the
current HTML string or an array of lesson blocks (typically `text` + `derive`). The assignment
renderer, validator and CONTENT.md support both. Every existing part solution (411 in calculus) whose
body restructures a formula over two or more lines is converted to blocks with a `derive`; one-line
or purely verbal solutions stay strings. Live Script model solutions (`solution: [liveScriptBlocks]`
on the assignment and `writeupTemplate`) stay in the homework's Live Script format.

## Constraints

- No new runtime dependencies; KaTeX is already vendored. The app is static files + `server.mjs`.
- Content files must not touch the DOM (they are imported by the Node validator).
- `npm test` must pass; the validator must cover every new block (KaTeX renders every `from`/`to`,
  every `arrows`/`map` id exists in its lines, widget configs valid, `examquiz`/`blanks` answer keys
  self-consistent).
- UI language English. Git: no AI co-author trailers; identity Glitchtit.
- Deployment: push to `main` → GitHub Actions runs `npm test`, publishes
  `ghcr.io/glitchtit/math-tutor:latest` → on Tower (`ssh tower`) pull the image and recreate the
  `math-tutor` container with its existing settings (port 8098→8080).

## Left to the builder

- Internal code structure (e.g. a `js/derive.js` module), CSS details, exact palette values.
- Exact candidate set and scoring weights for arrow routing, as long as the anti-goals hold.
- Animation timing, Play-all pacing.
- How to split the rework into batches and in what order.
- Wording of new numeric examples (values should give clean numbers).
