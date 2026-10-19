// Static file server + Anthropic API proxy for Calculus Studio.
//
//   ANTHROPIC_API_KEY=sk-ant-... node server.mjs        # http://localhost:8080
//
// The browser talks to /api/anthropic/v1/messages; this server adds the API key so it never
// reaches the browser. Without a key the app still works, and learners can paste their own key.

import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)));
const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || '127.0.0.1';
const API_KEY = process.env.ANTHROPIC_API_KEY || '';
const UPSTREAM = process.env.ANTHROPIC_UPSTREAM || 'https://api.anthropic.com';
const ALLOWED = [/^\/v1\/messages$/, /^\/v1\/messages\/count_tokens$/, /^\/v1\/models(\/[\w.-]+)?$/];

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
    res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream', 'cache-control': 'no-cache' });
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
      res.end(JSON.stringify({ proxy: true, keyConfigured: !!API_KEY }));
      return;
    }
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
  console.log(`Calculus Studio on http://${HOST}:${PORT}  (AI proxy: ${API_KEY ? 'enabled' : 'disabled — set ANTHROPIC_API_KEY'})`);
});
