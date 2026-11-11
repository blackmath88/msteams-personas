#!/usr/bin/env node
// Real HTTP MCP acceptance, including both house PNGs, manifest bytes, origin and SHA-256.
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
const [configFile, out, mode = 'host'] = process.argv.slice(2);
const modern = process.argv[5] === 'modern';
const config = JSON.parse(readFileSync(configFile, 'utf8'));
const url = mode === 'gateway' ? `http://127.0.0.1:${config.gatewayPort || 8790}` : `http://${config.address}:${config.privatePort || 8791}`;
const headers = { 'content-type': 'application/json', accept: 'application/json, text/event-stream', 'mcp-protocol-version': '2025-03-26',
  ...(mode === 'gateway' ? {} : { authorization: 'Bearer ' + readFileSync(config.tokenFile, 'utf8').trim() }) };
let seq = 0;
async function rpc(method, params = {}) {
  const metadata = modern ? { 'io.modelcontextprotocol/protocolVersion': '2026-07-28', 'io.modelcontextprotocol/clientCapabilities': {}, 'io.modelcontextprotocol/clientInfo': { name: 'fleet-smoke', version: '1' } } : null;
  const modernHeaders = modern ? { 'mcp-protocol-version': '2026-07-28', 'mcp-method': method, ...(params.name || params.uri ? { 'mcp-name': params.name || params.uri } : {}) } : {};
  const response = await fetch(url + '/mcp', { method: 'POST', headers: { ...headers, ...modernHeaders }, body: JSON.stringify({ jsonrpc: '2.0', id: ++seq, method, params: { ...params, ...(metadata ? { _meta: metadata } : {}) } }), signal: AbortSignal.timeout(115_000) });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('mcp-session-id'), null, 'fleet MCP must be stateless');
  const text = await response.text();
  const result = text.startsWith('event:') || text.startsWith('data:')
    ? text.split('\n').filter(l => l.startsWith('data:')).map(l => JSON.parse(l.slice(5))).find(v => v.id === seq)
    : JSON.parse(text);
  assert.ok(!result.error, JSON.stringify(result)); return result.result;
}
const call = (name, args = {}) => rpc('tools/call', { name, arguments: args });
if (!modern) await rpc('initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'fleet-smoke', version: '1' } });
const tools = (await rpc('tools/list')).tools.map(t => t.name);
for (const name of ['render_project', 'render_components', 'get_catalogue', 'retrieve_artifact']) assert.ok(tools.includes(name));
const caps = (await call('get_capabilities')).structuredContent;
assert.ok(caps.capabilityVersion >= 6 && caps.profiles['workspace-houses'] && caps.profiles['workspace-house-teams']);
const project = (await call('get_example', { kind: 'workspace-houses' })).structuredContent;
assert.equal((await call('validate_project', { project })).structuredContent.ok, true);
const result = await call('render_project', { project });
assert.ok(!result.isError, JSON.stringify(result));
const manifest = result.structuredContent;
assert.equal(manifest.slides.length, 2);
if (mode === 'host') assert.equal(manifest.deployment.host, config.id);
assert.ok(manifest.renderId.startsWith('r-' + manifest.deployment.host + '-'));
if (out) mkdirSync(out, { recursive: true });
for (const slide of manifest.slides) {
  const retrieved = await call('retrieve_artifact', { renderId: manifest.renderId, file: slide.file });
  const bytes = Buffer.from(retrieved.content.find(c => c.type === 'image').data, 'base64');
  assert.equal(bytes.readUInt32BE(16), 1920); assert.equal(bytes.readUInt32BE(20), 1080);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), slide.sha256);
  const resource = await rpc('resources/read', { uri: slide.uri });
  assert.equal(resource.contents[0].blob, bytes.toString('base64'));
  if (out) writeFileSync(join(out, slide.file), bytes);
}
const saved = await call('retrieve_artifact', { renderId: manifest.renderId, file: 'manifest.json' });
assert.equal(JSON.parse(saved.content[0].text).deployment.commit, manifest.deployment.commit);
const traversal = await call('retrieve_artifact', { renderId: manifest.renderId, file: '../../../../etc/passwd' });
assert.equal(traversal.isError, true);
const evidence = { host: manifest.deployment.host, commit: manifest.deployment.commit, renderId: manifest.renderId, tools, manifest, verifiedAt: new Date().toISOString() };
if (out) writeFileSync(join(out, 'evidence.json'), JSON.stringify(evidence, null, 2));
console.log(JSON.stringify({ ok: true, host: evidence.host, commit: evidence.commit, renderId: evidence.renderId, slides: 2, dimensions: '1920x1080', hashesAndResourcesVerified: true }));
