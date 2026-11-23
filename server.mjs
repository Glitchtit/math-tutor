// Static file server + Anthropic API proxy for Calculus Studio.
//
//   ANTHROPIC_API_KEY=sk-ant-... node server.mjs        # http://localhost:8080
//
// The browser talks to /api/anthropic/v1/messages; this server adds the API key so it never
// reaches the browser. Without a key the app still works, and learners can paste their own key.

import http from 'node:http';
import { readFile, stat, writeFile, rename, mkdir } from 'node:fs/promises';
import { createSign } from 'node:crypto';
import { extname, join, normalize, resolve } from 'node:path';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { MODULES } from './js/content/index.js';
import { ttsId, lectureLines } from './js/lecture-core.js';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)));
const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || '127.0.0.1';
const API_KEY = process.env.ANTHROPIC_API_KEY || '';
const UPSTREAM = process.env.ANTHROPIC_UPSTREAM || 'https://api.anthropic.com';
const ALLOWED = [/^\/v1\/messages$/, /^\/v1\/messages\/count_tokens$/, /^\/v1\/models(\/[\w.-]+)?$/];

// Lecture narration: Google Cloud Text-to-Speech, called directly; MP3s cached on disk by line id.
const TTS_KEY = process.env.GOOGLE_TTS_API_KEY || '';
const TTS_CREDS = process.env.GOOGLE_TTS_CREDENTIALS || '';
const TTS_VOICE = process.env.TTS_VOICE || 'en-GB-Chirp3-HD-Algenib';
const TTS_UPSTREAM = process.env.TTS_UPSTREAM || 'https://texttospeech.googleapis.com';
const TTS_DIR = resolve(process.env.TTS_CACHE_DIR || join(ROOT, 'tts-cache'));
const TTS_ON = !!(TTS_KEY || TTS_CREDS);
// only lines that exist in lecture content can be spoken, so the open port cannot run up the bill
const TTS_LINES = new Map(await Promise.all(lectureLines(Object.values(MODULES)).map(async (t) => [await ttsId(TTS_VOICE, t), t])));
const ttsInflight = new Map();
let gToken = null; // { token, exp }

async function googleAuth() {
  if (TTS_KEY) return { query: `?key=${encodeURIComponent(TTS_KEY)}`, headers: {} };
  if (!gToken || Date.now() > gToken.exp - 60_000) {
    const sa = JSON.parse(await readFile(TTS_CREDS, 'utf8'));
    const now = Math.floor(Date.now() / 1000);
    const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
    const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/cloud-platform', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 })}`;
    const jwt = `${unsigned}.${createSign('RSA-SHA256').update(unsigned).sign(sa.private_key, 'base64url')}`;
    const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }) });
    if (!r.ok) throw new Error(`Google token exchange failed: ${r.status} ${await r.text()}`);
    const j = await r.json();
    gToken = { token: j.access_token, exp: Date.now() + j.expires_in * 1000 };
  }
  return { query: '', headers: { authorization: `Bearer ${gToken.token}` } };
}

async function synthesize(id, text) {
  const file = join(TTS_DIR, `${id}.mp3`);
  try { return await readFile(file); } catch {}
  const auth = await googleAuth();
  const r = await fetch(`${TTS_UPSTREAM}/v1/text:synthesize${auth.query}`, {
    method: 'POST', headers: { 'content-type': 'application/json', ...auth.headers },
    body: JSON.stringify({ input: { text }, voice: { languageCode: TTS_VOICE.slice(0, 5), name: TTS_VOICE }, audioConfig: { audioEncoding: 'MP3' } }),
  });
  if (!r.ok) throw new Error(`Google TTS ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const mp3 = Buffer.from((await r.json()).audioContent, 'base64');
  await mkdir(TTS_DIR, { recursive: true });
  await writeFile(`${file}.tmp`, mp3);
  await rename(`${file}.tmp`, file); // never serve a half-written file
  return mp3;
}

async function tts(res, id) {
  const text = TTS_LINES.get(id);
  if (!text) { res.writeHead(404); res.end('Unknown line'); return; }
  if (!TTS_ON) { res.writeHead(503); res.end('Text-to-speech is not configured'); return; }
  if (!ttsInflight.has(id)) ttsInflight.set(id, synthesize(id, text).finally(() => ttsInflight.delete(id)));
  try {
    const mp3 = await ttsInflight.get(id);
    res.writeHead(200, { 'content-type': 'audio/mpeg', 'content-length': mp3.length, 'cache-control': 'public, max-age=31536000, immutable' });
    res.end(mp3);
  } catch (e) {
    console.error(e.message);
    res.writeHead(502); res.end('Text-to-speech failed');
  }
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > 5 * 1024 * 1024) throw new Error('Request body too large');
    chunks.push(c);
  }
  return Buffer.concat(chunks);
}

async function proxy(req, res, path) {
  if (!API_KEY) {
    res.writeHead(503, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ type: 'error', error: { type: 'proxy_error', message: 'ANTHROPIC_API_KEY is not set on the server.' } }));
    return;
  }
  if (!ALLOWED.some((re) => re.test(path))) {
    res.writeHead(403, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ type: 'error', error: { type: 'proxy_error', message: `Path ${path} is not proxied.` } }));
    return;
  }
  const headers = {
    'x-api-key': API_KEY,
    'anthropic-version': req.headers['anthropic-version'] || '2023-06-01',
    'content-type': req.headers['content-type'] || 'application/json',
    accept: req.headers.accept || 'application/json',
  };
  if (req.headers['anthropic-beta']) headers['anthropic-beta'] = req.headers['anthropic-beta'];
  const body = req.method === 'POST' ? await readBody(req) : undefined;
  const upstream = await fetch(UPSTREAM + path + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''), { method: req.method, headers, body });
  const out = {};
  upstream.headers.forEach((v, k) => {
    if (['content-type', 'request-id', 'retry-after', 'anthropic-ratelimit-requests-remaining'].includes(k) || k.startsWith('x-')) out[k] = v;
  });
  out['cache-control'] = 'no-store';
  res.writeHead(upstream.status, out);
  if (upstream.body) Readable.fromWeb(upstream.body).pipe(res);
  else res.end();
}

async function serveStatic(req, res, path) {
  let p = decodeURIComponent(path);
  if (p.endsWith('/')) p += 'index.html';
  const file = normalize(join(ROOT, p));
  if (!file.startsWith(ROOT) || /(^|[\\/])\.(?!well-known)/.test(file.slice(ROOT.length)) || file.includes('node_modules')) {
    res.writeHead(404); res.end('Not found'); return;
  }
  try {
    const st = await stat(file);
    if (!st.isFile()) throw new Error('not a file');
    const data = await readFile(file);
    // no-store: ES modules must never mix versions after a deploy (an old cached check.js broke the app once); it is a small SPA, reloads are rare
    res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(data);
  } catch {
    res.writeHead(404); res.end('Not found');
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/api/health') {
      res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
      res.end(JSON.stringify({ proxy: true, keyConfigured: !!API_KEY, tts: TTS_ON, ttsVoice: TTS_VOICE }));
      return;
    }
    const ttsMatch = /^\/api\/tts\/([0-9a-f]{64})$/.exec(url.pathname);
    if (ttsMatch) { await tts(res, ttsMatch[1]); return; }
    if (url.pathname.startsWith('/api/anthropic/')) {
      await proxy(req, res, url.pathname.slice('/api/anthropic'.length));
      return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); res.end(); return; }
    await serveStatic(req, res, url.pathname);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) res.writeHead(500, { 'content-type': 'text/plain' });
    res.end('Server error');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Calculus Studio on http://${HOST}:${PORT}  (AI proxy: ${API_KEY ? 'enabled' : 'disabled — set ANTHROPIC_API_KEY'}; TTS: ${TTS_ON ? `${TTS_VOICE}, ${TTS_LINES.size} lines` : 'disabled — set GOOGLE_TTS_API_KEY or GOOGLE_TTS_CREDENTIALS'})`);
});
