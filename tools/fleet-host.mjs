#!/usr/bin/env node
// Stable host supervisor + stateless HTTP gateway. Only this adapter binds the Tailscale IP;
// it requires the private fleet credential. MCP and tunnel admin remain loopback-only.
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readFileSync, realpathSync, existsSync, mkdirSync, openSync, closeSync } from 'node:fs';
import { join } from 'node:path';
import { timingSafeEqual } from 'node:crypto';
import { FleetRouter, isRender, protocolHeaders, failureResponse } from './fleet-routing.mjs';

const configPath = process.argv[2];
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const token = readFileSync(config.tokenFile, 'utf8').trim();
if (token.length < 32) throw new Error('Fleet token must contain at least 32 characters');
if (!/^100\.(?:6[4-9]|[789]\d|1[01]\d|12[0-7])\./.test(config.address)) throw new Error('Bind only the observed Tailscale address');
const privatePort = config.privatePort || 8791, workerPort = config.workerPort || 8792;
const workerURL = `http://127.0.0.1:${workerPort}`;
const router = new FleetRouter(config.hosts, { stabilityMs: config.stabilityMs ?? 30_000 });
let worker, readySince = 0, draining = false, forwarding = 0, update = null, stopping = false;
const pause = ms => new Promise(r => setTimeout(r, ms));
const headers = { authorization: `Bearer ${token}` };
const json = (res, status, value) => res.writeHead(status, { 'content-type': 'application/json' }).end(JSON.stringify(value));
const rpcError = (res, message, error) => json(res, 200, failureResponse(message, error));
function authorized(req) {
  const got = Buffer.from(req.headers.authorization || ''), want = Buffer.from(headers.authorization);
  return got.length === want.length && timingSafeEqual(got, want);
}
async function body(req) {
  let size = 0; const chunks = [];
  for await (const chunk of req) { size += chunk.length; if (size > 512 * 1024) throw new Error('request_too_large'); chunks.push(chunk); }
  return Buffer.concat(chunks).toString();
}
function startWorker() {
  const release = realpathSync(join(config.root, 'current'));
  const commit = readFileSync(join(release, '.release-sha'), 'utf8').trim();
  readySince = 0;
  worker = spawn(config.node, [join(release, 'tools/mcp-server.mjs'), '--http', '--port', String(workerPort)], {
    cwd: release, stdio: ['ignore', 'inherit', 'inherit'],
    env: { ...process.env, CHROMIUM: config.chromium, MTP_ARTIFACT_DIR: config.artifacts, MTP_HOST_ALIAS: config.id, MTP_RELEASE_SHA: commit }
  });
  const child = worker;
  child.on('exit', () => {
    if (worker !== child) return;
    readySince = 0;
    if (!stopping && !draining) setTimeout(() => {
      if (worker === child && !stopping && !draining) startWorker();
    }, 2000);
  });
}
async function status() {
  try {
    const response = await fetch(workerURL + '/healthz', { signal: AbortSignal.timeout(1500) });
    if (!response.ok) throw new Error('worker unhealthy');
    const health = await response.json();
    readySince ||= Date.now();
    const verified = existsSync(join(config.root, 'current', '.verified.json'));
    return { ...health, reachable: true, ready: verified && !draining && !stopping, readySince, draining, forwarding, update };
  } catch { readySince = 0; return { host: config.id, reachable: false, ready: false, draining, forwarding, update }; }
}
async function statuses() {
  return Object.fromEntries(await Promise.all(config.hosts.map(async host => {
    try {
      const response = await fetch(host.url + '/status', { headers, signal: AbortSignal.timeout(1800) });
      if (!response.ok) throw new Error('unavailable');
      return [host.id, await response.json()];
    } catch { return [host.id, { ready: false, reachable: false }]; }
  })));
}
async function proxy(req, res, target, data, authenticated = false) {
  const response = await fetch(target + '/mcp', {
    method: 'POST', body: data,
    headers: { 'content-type': 'application/json', accept: req.headers.accept || 'application/json, text/event-stream',
      ...protocolHeaders(req.headers),
      ...(authenticated ? headers : {}) }, signal: AbortSignal.timeout(110_000)
  });
  // Buffer a complete exchange: no session ID or request state is stored on a gateway.
  const bytes = Buffer.from(await response.arrayBuffer());
  res.writeHead(response.status, { 'content-type': response.headers.get('content-type') || 'application/json', ...protocolHeaders(Object.fromEntries(response.headers)) }).end(bytes);
}
async function reload() {
  if (!draining || forwarding) throw new Error('drain_required');
  const old = worker;
  if (old && old.exitCode === null) {
    old.kill('SIGTERM');
    for (let i = 0; i < 50 && old.exitCode === null && old.signalCode === null; i++) await pause(100);
    if (old.exitCode === null && old.signalCode === null) throw new Error('worker_did_not_stop');
  }
  startWorker();
}
function beginUpdate() {
  if (update?.running) throw new Error('update_already_running');
  mkdirSync(join(config.root, 'logs'), { recursive: true });
  const log = openSync(join(config.root, 'logs/update.log'), 'a', 0o600);
  const child = spawn(config.python, [join(config.root, 'control/fleet-update.py'), 'host', configPath], { stdio: ['ignore', log, log] });
  closeSync(log);
  update = { running: true, startedAt: new Date().toISOString(), pid: child.pid };
  child.on('exit', code => { update = { ...update, running: false, code, finishedAt: new Date().toISOString() }; });
  child.on('error', () => { update = { ...update, running: false, code: -1 }; });
}
const privateServer = createServer(async (req, res) => {
  if (!authorized(req) || req.headers.origin) { json(res, 401, { error: 'unauthorized' }); return; }
  const path = new URL(req.url, 'http://local').pathname;
  let message;
  try {
    if (req.method === 'GET' && path === '/status') return json(res, 200, await status());
    if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });
    if (path === '/admin/update') { beginUpdate(); return json(res, 202, update); }
    if (path === '/admin/drain') { draining = true; return json(res, 200, await status()); }
    if (path === '/admin/resume') { draining = false; return json(res, 200, await status()); }
    if (path === '/admin/reload') { await reload(); return json(res, 200, { ok: true }); }
    if (path !== '/mcp') return json(res, 404, { error: 'not_found' });
    const data = await body(req); message = JSON.parse(data);
    if (draining && isRender(message)) throw new Error('renderer_draining: render_not_started');
    forwarding++;
    try { await proxy(req, res, workerURL, data); } finally { forwarding--; }
  } catch (error) { if (!res.headersSent) rpcError(res, message, error); }
});
const gateway = createServer(async (req, res) => {
  // Local tunnel is the only intended caller; reject browser origins and DNS rebinding.
  if (req.headers.origin || !/^127\.0\.0\.1(?::\d+)?$/.test(req.headers.host || '')) return json(res, 403, { error: 'local_tunnel_only' });
  const path = new URL(req.url, 'http://local').pathname;
  if (req.method === 'GET' && path === '/healthz') return json(res, 200, { gateway: config.id, hosts: await statuses() });
  if (path !== '/mcp') return json(res, 404, { error: 'not_found' });
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });
  let message;
  try {
    const data = await body(req); message = JSON.parse(data);
    if (!message || Array.isArray(message)) throw new Error('invalid_rpc_request');
    const host = router.select(message, await statuses());
    try { await proxy(req, res, host.url, data, true); }
    catch (error) {
      router.observe(host, null);
      throw new Error(isRender(message)
        ? `render_result_uncertain: origin=${host.id}; request may have run; no retry or duplicate render was started`
        : `origin_unavailable: ${host.id}; ${error.name}`);
    }
  } catch (error) { if (!res.headersSent) rpcError(res, message, error); }
});
startWorker();
privateServer.listen(privatePort, config.address);
gateway.listen(config.gatewayPort || 8790, '127.0.0.1');
// Prime healthy-since independently of traffic, including after a host recovers.
const probe = setInterval(async () => { for (const [id, value] of Object.entries(await statuses())) router.observe({ id }, value); }, 3000);
async function stop() {
  if (stopping) return; stopping = true; draining = true; clearInterval(probe);
  gateway.close(); privateServer.close();
  while (forwarding) await pause(100);
  if (worker) worker.kill('SIGTERM');
  setTimeout(() => process.exit(0), 1000);
}
process.on('SIGTERM', stop); process.on('SIGINT', stop);
