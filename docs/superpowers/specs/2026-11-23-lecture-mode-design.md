# Lecture mode for Learn lessons

Date: 2026-11-23 · Status: approved 2026-11-23 (builder check done)

## Why

Learn lessons today are long scrolling pages: text, then a derivation, then guided practice, then a
quiz. The user (a student; see the derive-preferences memory: needs one change per step, moving-term
arrows, numbers examples) finds "pages and pages of text" hard to work through. They want a
**lecture simulator**: a narrator explains the topic step by step out loud, the board builds up as it
speaks (formulas, animated derivations, graphs), and the lecture stops for exercises (step-by-step
problem solving and multiple choice) before it carries on.

The goal is to have lectures **now**; token cost is not a constraint. Start with the calculus
**Foundations** part (modules `functions`, `limits`, `derivatives`, `derivative-apps`, 39 lessons); the user checks
quality on that before more courses get lectures.

## Goals

1. A lesson may carry a `lecture`: an ordered list of **beats**. Each beat has one spoken line and
   optionally something that happens on the board while it is spoken.
2. A **lecture player** on the Learn lesson page: board area, caption bar, controls. Lessons with a
   lecture open in lecture mode; a toggle switches to the existing page ("Read"). Lessons without a
   lecture are unchanged.
3. Narration voiced by **Google Cloud Text-to-Speech, voice `en-GB-Chirp3-HD-Algenib`** (the voice
   the user's Jarvis assistant uses), called **directly by the app's server**, not through Home
   Assistant.
4. Exercises inside the lecture: `guided` (step-by-step solution, student does each step) and
   `quiz` (multiple choice) pause the lecture until answered (or revealed), then it continues.
5. Lectures for all 39 Foundations lessons, written now by Claude agents, committed as content and
   checked by the content validator like everything else.

## Non-goals

* No live AI generation of lectures (option B was rejected; may come later as a fallback for
  lessons without a lecture).
* No new courses beyond Foundations in this round.
* No change to MATLAB pages, Train, Assignments.
* No speech recognition / talking back to the lecturer (the existing "I don't follow" → tutor
  buttons stay available inside blocks).

## Anti-goals (a failure even if it works)

* The lecture is the old page read aloud. Board content must be short: formulas, a few words, graphs,
  derivations. Paragraphs belong in the spoken line, not on the board.
* Narration that reads LaTeX ("backslash frac") or skips steps. Spoken lines say maths the way a
  lecturer would ("x squared minus one, over x plus two").
* A lecture that cannot be followed without sound: captions always show the spoken line.
* The derivation style regresses: derive blocks keep arrows, colours, one change per step and the
  numbers example (CONTENT.md rules still apply).

## Approaches considered

* **A. Authored lecture scripts in the content files (chosen).** Written now by Claude agents,
  committed, validated. Fixed text the user can review, broken maths caught by tests, no waiting.
* **B. Claude writes the lecture on first play, server caches it.** Every lesson at once, but
  unvalidated, uneven quality, 30–60 s first-play wait. Rejected for now.
* **C. A plus B as fallback.** Deferred until A's quality is proven.

Voice: the user rejected routing TTS through Home Assistant; the server calls Google directly.

## Design

### Content format

A lesson gets an optional `lecture` array next to `blocks`:

```js
{ id: 'graphs-transformations', title: '...', blocks: [ ... ],
  lecture: [
    { say: 'A function is a rule: you give it a number x, and it gives back exactly one number, f of x.',
      show: { type: 'board', tex: String.raw`x \;\longmapsto\; f(x)` } },
    { say: 'Watch what each number does to the sine curve.', show: 1 },          // lesson block #1 (a widget)
    { say: 'First, the square-root condition.', show: 5, step: 0 },             // derive block #5, its step 0
    { say: 'Subtract three from both sides.', step: 1 },                        // advance the same derive
    { say: 'Your turn. Same recipe, new numbers.', show: 6 },                   // guided → lecture waits
    ...
  ] }
```

Beat fields:

* `say` (required): one or two spoken sentences, plain text, no `$`/LaTeX. Shown as the caption.
* `show` (optional): what appears on the board with this beat. Either an **index into the lesson's
  own `blocks`** (reuse: derive, steps, guided, quiz, widget, table, callout already exist and are
  validated) or an **inline block object** (any existing block type, plus the new `board` type).
* `step` (optional): for a `derive` or `steps` block currently on the board, reveal up to this step
  (0-based) and, for derive, play its arrow animation, while `say` is spoken. Lets each derive
  step get its own spoken explanation.
* `set` (optional): `{ param: value }` for the most recent widget with sliders: animate the slider(s)
  to these values while speaking ("now make a bigger").
* `clear` (optional, `true`): wipe the board before showing this beat's content (new section).

New block type `board` (lecture-only, also allowed in lessons): `tex` (one display formula) and/or
`html` (a few words), optional `title`. Validator rejects `board.html` / inline `text` blocks over
~200 characters inside lectures, to enforce the anti-goal.

Agents write the `lecture` array and leave the lesson's `blocks` alone, so Read mode stays as it is
(my call). A lecture may add its own inline `guided`/`quiz` blocks where the lesson has no exercise
to stop on; their progress is stored under a separate key (`<lesson key>/lecture/<beat index>`) so it
cannot collide with the lesson's index-keyed blocks. The one exception: a derive step that makes more
than one change already breaks the CONTENT.md rules, and may be split in the lesson itself.

A lecture does not have to show every lesson block, and may show blocks in a different order. Every
`guided` and `quiz` in the lesson should appear in its lecture (validator warns if not), so exercises
are never lost.

### Player behaviour

* Board: beats' content stacks vertically, newest scrolled into view and briefly highlighted
  (fade/slide in). `clear` starts a fresh board. The full board stays scrollable.
* Caption bar under the board shows the current `say` line.
* Controls: play/pause, previous beat, next beat, speed (1×, 1.25×, 1.5× via `playbackRate`),
  sound on/off. Keyboard: space = play/pause, ←/→ = previous/next beat.
* A beat ends when its audio ends (and any derive step animation has finished); then the next beat
  starts automatically.
* A beat that shows a `guided` or `quiz` waits after speaking until the exercise is done (guided:
  all steps answered or revealed; quiz: an answer submitted), then continues. A beat whose content is
  a widget does not wait.
* Without audio (sound off, server has no key, TTS failed): the caption stays up for a reading time
  of about 0.35 s per word, min 2 s, then advances. Playback never breaks on a TTS failure.
* Previous beat: rebuilds the board up to that beat (simple and correct beats replay).
* End of lecture: the lesson's existing "Mark complete & continue" button. Progress: remember the
  last beat reached per lesson (`progress` store) so a reopened lecture offers "Resume".
* Read toggle shows the existing lesson page unchanged; choice remembered.
* Phone width: board full width, controls in a fixed bottom bar.

### Speech: server-side Google TTS with a disk cache

* New route `GET /api/tts/<sha>` in `server.mjs`. At startup the server imports the content
  (`js/content/index.js`, as the validator does) and builds a map `sha256(voice + say) → say` from
  every lecture beat. **Only these lines can be synthesized**: arbitrary text is refused, so the open
  LAN port cannot be used to run up the Google bill.
* The client computes the same sha (Web Crypto) for each beat and requests `/api/tts/<sha>`.
* Server: if `<TTS_CACHE_DIR>/<sha>.mp3` exists, serve it (this one may be cached by the browser:
  the URL is content-addressed). Otherwise POST to
  `https://texttospeech.googleapis.com/v1/text:synthesize?key=$GOOGLE_TTS_API_KEY` with voice
  `en-GB-Chirp3-HD-Algenib`, language `en-GB`, `MP3`; write the file, serve it.
* Config: `GOOGLE_TTS_API_KEY` (an API key restricted to the Text-to-Speech API, in the same GCP
  project Jarvis uses), `TTS_CACHE_DIR` (default `./tts-cache`; on Tower a mapped appdata folder so
  audio survives container updates), `TTS_VOICE` (default above). `/api/health` reports
  `ttsConfigured`.
* The browser prefetches the next beat's audio while the current one plays, so there is no gap.
* No Google SDK, no new npm dependency (the project has none): plain `fetch`.

### Validation (`tests/validate-content.mjs`)

For each lecture: every beat has a non-empty `say` without `$`, `\`, or `{`; `show` indices exist;
inline blocks pass the same checks as lesson blocks; `step` refers to a derive/steps block on the
board and is in range and non-decreasing for the same block; `set` follows a widget with those
params; board-text length limit; warning when a lesson's guided/quiz blocks are missing from its
lecture.

### Writing the Foundations lectures

* CONTENT.md gets a "Lectures" section: the format above plus a style guide (spoken maths,
  1–2 sentences per beat, one idea per beat, board shows only the formula/words being talked about,
  every derive step narrated, every exercise introduced and debriefed, about 3–8 minutes per lesson).
* Claude agents write the lectures one module at a time and run the validator: Functions (4),
  Limits (12), Derivatives (13), Applications of derivatives (10). The user asked for the work to
  continue straight through to deployment; they check quality on the deployed result.

### Deployment

* Tower container template `my-math-tutor.xml`: add `GOOGLE_TTS_API_KEY` and a path mapping
  `/mnt/user/appdata/math-tutor/tts-cache → /data/tts-cache` with `TTS_CACHE_DIR=/data/tts-cache`.
  The user creates the API key in Google Cloud Console (Credentials → API key, restrict to Cloud
  Text-to-Speech API).
* Deploy as usual: push main → CI → GHCR → `update_container math-tutor`.

## Left to the builder

* Player internals: how the player drives existing blocks (e.g. calling the derive block's existing
  next/play logic or exposing a small API from `renderDerive`, dispatching slider input events for
  `set`), file layout (a new `js/lecture.js` is the expected home), CSS and animation details within
  the app's existing look.
* Exact reading-time constants, highlight animation, how "Resume" is offered.
* Whether Previous rebuilds the board or rewinds in place, as long as it is correct.
