// Start an isolated MCP process and retrieve every generated PNG.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

const temp = mkdtempSync(join(tmpdir(), 'mtp-workspace-'));
const out = process.argv[2];
const client = new Client({name: 'workspace-verification', version: '1.0.0'});
const transport = new StdioClientTransport({command: process.execPath, args: [resolve('tools/mcp-server.mjs')], env: {...process.env, MTP_ARTIFACT_DIR: temp}});
const call = (name, args = {}) => client.callTool({name, arguments: args});
try {
  await client.connect(transport);
  const caps = (await call('get_capabilities')).structuredContent;
  assert.equal(caps.capabilityVersion, 4);
  assert.ok(caps.profiles['workspace-map'] && caps.profiles['workspace-scene']);
  assert.equal((await call('get_example')).structuredContent.slides.length, 3);
  const project = (await call('get_example', {kind: 'workspace'})).structuredContent;
  assert.equal(project.workspace.nodes[0].id, 'campus');
  const variants = [
    {id: 'research', root: 'urban', selected: 'heat-paper', viewer: 'lukas', tab: 'files'},
    {id: 'personal', root: 'nora-work', selected: 'nora-paper', viewer: 'nora', tab: 'files'}
  ];
  for (const {id, ...focus} of variants) for (const profile of ['workspace-map', 'workspace-scene']) {
    const key = id + '-' + profile;
    project.scenes.push({id: key, profile, ...focus});
    project.slides.push({id: key, scene: key});
  }
  const valid = (await call('validate_project', {project})).structuredContent;
  assert.equal(valid.ok, true, JSON.stringify(valid));
  assert.deepEqual(valid.warnings, []);
  const response = await call('render_project', {project});
  assert.ok(!response.isError, JSON.stringify(response.structuredContent));
  const manifest = response.structuredContent;
  assert.equal(manifest.slides.length, 6);
  if (out) mkdirSync(out, {recursive: true});
  for (const slide of manifest.slides) {
    const retrieved = await call('retrieve_artifact', {renderId: manifest.renderId, file: slide.file});
    const bytes = Buffer.from(retrieved.content.find(c => c.type === 'image').data, 'base64');
    assert.equal(bytes.readUInt32BE(16), 1920);
    assert.equal(bytes.readUInt32BE(20), 1080);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), slide.sha256);
    if (out) writeFileSync(join(out, slide.file), bytes);
  }
  const bad = structuredClone(project);
  bad.scenes[0].selected = 'nora-paper';
  assert.ok((await call('validate_project', {project: bad})).structuredContent.errors.some(d => d.path === 'scenes[0].selected'));
  assert.equal((await call('render_project', {project: bad})).isError, true);
  if (out) writeFileSync(join(out, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('PASS: six workspace PNGs retrieved with matching dimensions and SHA-256; out-of-scope selection refused.');
} finally {
  await client.close();
  rmSync(temp, {recursive: true, force: true});
}
