import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { MODULES } from '../js/content/index.js';
import { ttsId, lectureLines } from '../js/lecture-core.js';

const VOICE = 'en-GB-Chirp3-HD-Algenib';
const MP3 = Buffer.from('fake-mp3-bytes');

function listen(server) { return new Promise((r) => server.listen(0, '127.0.0.1', () => r(server.address().port))); }

async function startUpstream() {
  const state = { calls: 0, bodies: [] };
  const srv = http.createServer(async (req, res) => {
    let body = ''; for await (const c of req) body += c;
    state.calls++; state.bodies.push({ url: req.url, body: JSON.parse(body) });
    await new Promise((r) => setTimeout(r, 150)); // slow enough for requests to overlap
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ audioContent: MP3.toString('base64') }));
  });
  state.port = await listen(srv);
  state.close = () => srv.close();
  return state;
}

async function startApp(env) {
  const probe = http.createServer();
  const port = await listen(probe); // grab a free port number, then release it for the app
  await new Promise((r) => probe.close(r));
  const child = spawn(process.execPath, ['server.mjs'], { env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', ...env }, stdio: ['ignore', 'pipe', 'inherit'] });
  await new Promise((r) => child.stdout.once('data', r));
  return { base: `http://127.0.0.1:${port}`, stop: () => child.kill() };
}

const line = lectureLines(Object.values(MODULES))[0];

test('TTS route: allow-list, upstream call, disk cache, dedupe', { skip: !line && 'no lecture lines yet' }, async (t) => {
  const up = await startUpstream();
  const dir = mkdtempSync(join(tmpdir(), 'tts-'));
  const app = await startApp({ GOOGLE_TTS_API_KEY: 'k', TTS_UPSTREAM: `http://127.0.0.1:${up.port}`, TTS_CACHE_DIR: dir, GOOGLE_TTS_CREDENTIALS: '' });
  t.after(() => { app.stop(); up.close(); rmSync(dir, { recursive: true, force: true }); });
  const id = await ttsId(VOICE, line);

  await t.test('unknown id → 404', async () => {
    assert.equal((await fetch(`${app.base}/api/tts/${'0'.repeat(64)}`)).status, 404);
  });
  await t.test('concurrent requests share one upstream call', async () => {
    const [a, b] = await Promise.all([fetch(`${app.base}/api/tts/${id}`), fetch(`${app.base}/api/tts/${id}`)]);
    assert.equal(a.status, 200); assert.equal(b.status, 200);
    assert.equal(a.headers.get('content-type'), 'audio/mpeg');
    assert.deepEqual(Buffer.from(await a.arrayBuffer()), MP3);
    assert.deepEqual(Buffer.from(await b.arrayBuffer()), MP3);
    assert.equal(up.calls, 1);
    assert.equal(up.bodies[0].body.voice.name, VOICE);
    assert.equal(up.bodies[0].body.input.text, line);
    assert.match(up.bodies[0].url, /key=k/);
  });
  await t.test('second request is served from disk', async () => {
    const r = await fetch(`${app.base}/api/tts/${id}`);
    assert.equal(r.status, 200); await r.arrayBuffer();
    assert.equal(up.calls, 1);
  });
  await t.test('health reports tts', async () => {
    const h = await (await fetch(`${app.base}/api/health`)).json();
    assert.equal(h.tts, true); assert.equal(h.ttsVoice, VOICE);
  });
});

test('TTS route without credentials → 503', { skip: !line && 'no lecture lines yet' }, async (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'tts-'));
  const app = await startApp({ GOOGLE_TTS_API_KEY: '', GOOGLE_TTS_CREDENTIALS: '', TTS_CACHE_DIR: dir });
  t.after(() => { app.stop(); rmSync(dir, { recursive: true, force: true }); });
  assert.equal((await fetch(`${app.base}/api/tts/${await ttsId(VOICE, line)}`)).status, 503);
});
