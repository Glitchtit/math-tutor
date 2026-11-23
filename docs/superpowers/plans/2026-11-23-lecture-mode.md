# Lecture Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Learn lessons play as narrated lectures (Google TTS, voice `en-GB-Chirp3-HD-Algenib`) with a building board and in-lecture exercises; all 39 calculus Foundations lessons get lectures; deployed to Tower.

**Architecture:** Lessons gain a `lecture: [beat]` array (content data). Pure helpers in `js/lecture-core.js` are shared by the browser player (`js/lecture.js`), the server (`server.mjs`, which allow-lists every `say` line for TTS and caches MP3s on disk) and the validator.

**Tech Stack:** Vanilla ES modules, Node 22 `http`, `node:test`, no npm dependencies.

**Spec:** `docs/superpowers/specs/2026-11-23-lecture-mode-design.md`

## Global Constraints

- No npm dependencies; Google is called with plain `fetch`.
- Voice default `en-GB-Chirp3-HD-Algenib`, language `en-GB`, encoding `MP3`.
- Only `say` strings found in lecture content may be synthesized; anything else → 404.
- Env: `GOOGLE_TTS_API_KEY` **or** `GOOGLE_TTS_CREDENTIALS` (path to a service-account JSON), `TTS_CACHE_DIR` (default `./tts-cache`), `TTS_VOICE`, `TTS_UPSTREAM` (default `https://texttospeech.googleapis.com`, for tests).
- Spoken lines: no `$`, `\`, `{`, `}`. Board text in lectures (`board.html`, inline `text.html`) ≤ 200 chars after stripping tags.
- Read mode unchanged; lesson `blocks` not edited by lecture authors (except splitting multi-change derive steps).
- `npm test` must pass before every commit.

## Review Focus

1. TTS failure mid-lecture (no key, Google 5xx, offline): the beat falls back to timed captions and playback continues. → Task 3 manual check + `readingMs` test in Task 1.
2. Navigating away mid-lecture: audio stops, no timers keep firing on the next page. → Task 3 (player `destroy()` on `hashchange`).
3. Two browsers requesting the same uncached line at once: one Google call, both get audio, no half-written file served. → Task 2 test `concurrent requests share one upstream call`.
4. Pressing Previous/Next during an exercise or derive animation: the board is rebuilt consistently, no doubled blocks. → Task 3 (rebuild from beat 0, guarded by a run token).
5. Lesson with a lecture opened on a phone: controls reachable, board not overflowing. → Task 3 CSS check at 390 px.

---

### Task 1: lecture-core helpers

**Files:** Create `js/lecture-core.js`; Test `tests/lecture.test.mjs`

**Interfaces — Produces:**
- `ttsId(voice: string, text: string): Promise<string>` — hex sha256 of `voice + '\n' + text` via `globalThis.crypto.subtle` (works in browser and Node 22).
- `lectureLines(modules: object[]): string[]` — every `say` of every lesson lecture, de-duplicated.
- `readingMs(text: string): number` — `max(2000, words * 350)`.
- `boardBlock(lesson, beat): object|null` — the block a beat shows (`lesson.blocks[i]` for a number, the object itself otherwise).

- [ ] Test: `ttsId('v','a')` equals node `createHash('sha256').update('v\na').digest('hex')`; `lectureLines` on a fixture with a repeated line returns it once; `readingMs('one two')===2000`, `readingMs` of 10 words `===3500`; `boardBlock({blocks:[{type:'x'}]},{show:0}).type==='x'`.
- [ ] Run `node --test tests/lecture.test.mjs` → FAIL; implement; → PASS. Commit.

### Task 2: Server TTS route

**Files:** Modify `server.mjs`; Test `tests/tts.test.mjs`

**Interfaces — Consumes:** `ttsId`, `lectureLines` (Task 1), `MODULES` from `js/content/index.js`. **Produces:** `GET /api/tts/<64-hex>` → `audio/mpeg` (cache-control `public, max-age=31536000, immutable`), 404 unknown id, 503 no credentials, 502 upstream failure. `/api/health` adds `tts: boolean, ttsVoice: string`.

- Startup: build `Map(id → text)` from `lectureLines(MODULES)` with `TTS_VOICE`.
- Auth: API key → `?key=`; else service account → RS256 JWT (`node:crypto` `createSign('RSA-SHA256')`, scope `https://www.googleapis.com/auth/cloud-platform`, aud `https://oauth2.googleapis.com/token`), exchange for an access token, cache it until 60 s before expiry; `Authorization: Bearer`.
- Body: `{ input: { text }, voice: { languageCode: 'en-GB', name: VOICE }, audioConfig: { audioEncoding: 'MP3' } }`; response `audioContent` base64.
- Cache: write `<id>.mp3.tmp` then `rename`; in-flight `Map(id → Promise)` dedupes.

- [ ] Test (spawns `server.mjs` on a free port with `TTS_UPSTREAM` pointing at a fake HTTP server counting calls, `GOOGLE_TTS_API_KEY=k`, temp `TTS_CACHE_DIR`; uses a real line from `lectureLines(MODULES)` — needs ≥1 lecture, so the test uses the Task 5 reference lecture; until then it skips if `lectureLines` is empty):
  - `unknown id → 404`; `known id → 200 audio/mpeg, body equals fake bytes`; second request served from disk (upstream count stays 1); `concurrent requests share one upstream call`; without credentials → 503.
- [ ] FAIL → implement → PASS. Commit.

### Task 3: Player, block hooks, page integration

**Files:** Create `js/lecture.js`; Modify `js/blocks.js` (export `renderBlock(b, ctx)`; guided `finish()` and quiz Check dispatch `new CustomEvent('block:done', { bubbles: true })`), `js/derive.js` (attach `root.lecture = { next: () => Promise, shown: () => number }` wrapping the existing Next-step logic), `js/widgets.js` (plot sliders: `sliders[k].el.dataset.param = k`), `js/app.js` (`lessonPage`: if `l.lecture`, mount player above a Read/Lecture toggle; remember choice in `store` key `learn:mode`), `css/*.css` (player styles).

**Interfaces — Produces:** `mountLecture(container, lesson, ctx): { destroy() }`.

Behaviour (spec §Player): beats stack on a board, newest scrolled into view with a fade-in; caption bar; controls ⏮ ⏯ ⏭, speed 1/1.25/1.5, sound toggle; space/←/→ keys; `step` advances derive via `root.lecture.next()` until `shown() > step` (steps blocks: click their Next button); `set` tweens `[data-param=k] input[type=range]` over 1.2 s dispatching `input`; guided/quiz beats wait for `block:done`; audio via `new Audio('/api/tts/'+id)`, prefetch next; on audio error or sound off → `readingMs`; Previous/Next rebuild the board from beat 0 silently (no audio, derive steps revealed without animation via repeated `next()` not awaited is acceptable — use derive's "Show all"-style reveal: add `root.lecture.revealTo(n)`), guarded by a run token so stale async work stops; resume beat stored in `store` key `lecture:<lesson key>`; `destroy()` on `hashchange`. Inline exercise blocks get `ctx.key = <lesson key>/lecture`, `index = beat index`.

- [ ] Write a temporary 6-beat lecture on `functions/graphs-transformations` (replaced in Task 5) and check in the browser (Playwright, `node server.mjs`): plays with captions (no TTS key → timed), derive steps advance per beat, guided blocks pause, Previous/Next rebuild correctly, Read toggle shows the old page, 390 px layout OK, no console errors.
- [ ] `npm test` passes. Commit.

### Task 4: Validator rules + CONTENT.md

**Files:** Modify `tests/validate-content.mjs` (export `validateLecture(lesson, where, issues)`, called for learn lessons), `CONTENT.md` (Lectures section + style guide), `tests/lecture.test.mjs` (cases).

Rules: `say` non-empty string without `$ \ { }`; `show` number in range or object passing `validateBlocks`; `board` block needs `tex` or `html`, `tex` renders; board/inline text ≤ 200 chars; `step` integer, target is the latest shown derive/steps block, in range, non-decreasing per block; `set` keys are params of the latest shown `plot` widget and values within min/max; every lesson `guided`/`quiz` index appears in some `show` → issue (error, not warning, so authors cannot forget).

- [ ] Tests: a valid fixture → no issues; each broken variant (`say` with `$`, `show` out of range, `step` decreasing, `set` unknown param, long board html, missing guided) → exactly one matching issue.
- [ ] FAIL → implement → PASS; `npm test`. Commit.

### Task 5: Reference lecture

**Files:** Modify `js/content/calculus/01-functions.js` (lecture for `graphs-transformations`, replacing the Task 3 temp one).

- [ ] Write it per the CONTENT.md style guide; validator passes; play through in browser. Commit. This is the example the content agents copy.

### Task 6: Foundations lectures (parallel agents)

**Files:** `js/content/calculus/01-functions.js` (remaining 3), `02-limits.js` (12), `03-derivatives.js` (13), `04-derivative-apps.js` (10).

- [ ] One agent per file, each told: read spec, CONTENT.md Lectures section, the reference lecture; write a `lecture` for every lesson; run `node tests/validate-content.mjs <module id>` until clean; do not commit.
- [ ] Review a sample from each module myself (spoken maths, board brevity, every derive step narrated); `npm test`; commit per module.

### Task 7: Deploy

- [ ] Get credentials (ask the user: their own API key, or copy HA's existing Google Cloud service-account key to `/mnt/user/appdata/math-tutor/google-tts.json`).
- [ ] Tower template `my-math-tutor.xml`: add `GOOGLE_TTS_API_KEY` or `GOOGLE_TTS_CREDENTIALS=/data/google-tts.json`, `TTS_CACHE_DIR=/data/tts-cache`, path `/mnt/user/appdata/math-tutor → /data`. Back up the template first.
- [ ] `git fetch`, push main, wait for CI, `update_container math-tutor`; check `/api/health` shows `tts: true`; fetch one `/api/tts/<id>` → audio; play a lecture at https://math.wredlund.com.
