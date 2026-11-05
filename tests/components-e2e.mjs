// End-to-end proof for components (deck components plan, slice D1): MCP over stdio with the
// official SDK client, the CLI on the same specs, and anchor behaviour when content changes.
// Writes evidence to docs/evidence-components/.
//   Run: node tests/components-e2e.mjs      (needs Chromium; TMPDIR may point to a writable dir)
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, rmSync, mkdtempSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PC = createRequire(import.meta.url)(join(ROOT, 'src/project-core.js'));
const EV = join(ROOT, 'docs/evidence-components');
const project = JSON.parse(readFileSync(join(ROOT, 'examples/lichtblick-kulissenwechsel.project.json'), 'utf8'));
const ARTIFACTS = mkdtempSync(join(tmpdir(), 'mtp-cmp-art-'));
const env = { ...process.env, MTP_ARTIFACT_DIR: ARTIFACTS };
const sha = b => createHash('sha256').update(b).digest('hex');
const png = b => ({ ok: b.subarray(1, 4).toString() === 'PNG', w: b.readUInt32BE(16), h: b.readUInt32BE(20) });
const specs = [
  { scene: 'sc-kanal', view: 'posts' },
  { scene: 'sc-kanal', view: 'posts', select: { postIds: ['q2'] } },
  { scene: 'sc-chat', view: 'messages', select: { messageIds: ['m1', 'm2'] } },
  { scene: 'sc-plan', view: 'bucket', select: { bucket: PC.planTasks(project, project.scenes.find(x => x.id === 'sc-plan').state)[0].bucket || 'Aufgaben' } },
  { scene: 'sc-kanal', view: 'window' }
];

let pass = 0, failN = 0; const log = [];
function check(name, ok, detail = '') { (ok ? pass++ : failN++); const line = `${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`; console.log(line); log.push(line); }
const inUnit = b => b.every(v => v >= -0.001 && v <= 1.001) && b[0] + b[2] <= 1.001 && b[1] + b[3] <= 1.001;

rmSync(EV, { recursive: true, force: true });
mkdirSync(join(EV, 'mcp-stdio'), { recursive: true });

/* ---------- 1. MCP over stdio ---------- */
const client = new Client({ name: 'mtp-components-e2e', version: '1.0.0' });
await client.connect(new StdioClientTransport({ command: process.execPath, args: [join(ROOT, 'tools/mcp-server.mjs')], env, stderr: 'ignore' }));
const tools = (await client.listTools()).tools.map(t => t.name);
check('mcp: render_components discovered', tools.includes('render_components'), tools.join(', '));
const caps = (await client.callTool({ name: 'get_capabilities', arguments: {} })).structuredContent;
check('mcp: capabilities list component types', Object.keys(caps.components.types).join() === 'teams.channel,teams.chat,planner.board' && caps.components.readability.minTextPt === 12);

const r = await client.callTool({ name: 'render_components', arguments: { project, components: specs } });
const m = r.structuredContent;
check('mcp: render ok', !r.isError && m.ok && m.components.length === specs.length, JSON.stringify(m.diagnostics));
const hashes = [];
for (const c of m.components) {
  const { contents } = await client.readResource({ uri: c.uri });
  const buf = Buffer.from(contents[0].blob, 'base64'), info = png(buf);
  writeFileSync(join(EV, 'mcp-stdio', c.file), buf); hashes.push(sha(buf));
  check(`mcp: ${c.file} is the listed PNG`, info.ok && info.w === c.width && info.h === c.height && sha(buf) === c.sha256, `${info.w}×${info.h}`);
  check(`mcp: ${c.file} anchors inside the picture`, c.anchors.length > 0 && c.anchors.every(a => inUnit(a.box)), c.anchors.map(a => a.entity).join(','));
}
const [all, one, chat, bucket, win] = m.components;
check('posts: every post anchored by id', all.anchors.filter(a => a.kind === 'post').map(a => a.entity).join() === 'q1,q2');
check('posts: selection shows only q2', one.anchors.map(a => a.entity).join() === 'q2' && one.height < all.height);
check('chat: selection shows only m1, m2', chat.anchors.map(a => a.entity).join() === 'm1,m2');
check('bucket: tasks and the bucket itself anchored', bucket.anchors.some(a => a.kind === 'task') && bucket.anchors.some(a => a.kind === 'bucket'));
check('window: full app size at scale 2', win.width === 2880 && win.height === 1620 && win.excerpt === false);
check('readability: excerpt needs less width than the window', all.text.minPlacedWidthIn < win.text.minPlacedWidthIn, `${all.text.minPlacedWidthIn} in vs ${win.text.minPlacedWidthIn} in`);
check('provenance: context and attribution', all.context.includes(project.scenes[0].team) && /Fiktives Beispiel/.test(all.attribution));
const img = await client.callTool({ name: 'retrieve_artifact', arguments: { renderId: m.renderId, file: one.file } });
check('mcp: retrieve_artifact returns the component', img.content[0].type === 'image' && sha(Buffer.from(img.content[0].data, 'base64')) === one.sha256);
const manifest = JSON.parse((await client.readResource({ uri: m.manifestUri })).contents[0].text);
writeFileSync(join(EV, 'mcp-stdio', 'manifest.json'), JSON.stringify(manifest, null, 2));

const bad = await client.callTool({ name: 'render_components', arguments: { project, components: [{ scene: 'sc-kanal', view: 'posts', select: { postIds: ['q9'] } }, { scene: 'sc-prinzip' }, { scene: 'sc-plan', view: 'bucket' }] } });
const codes = bad.structuredContent.diagnostics.map(d => d.code + '@' + d.path);
check('mcp: located errors for unknown id, unsupported scene, missing bucket', bad.isError && codes.includes('unknown-entity@components[0].select.postIds[0]') && codes.includes('no-component@components[1].scene') && codes.includes('select-bucket@components[2].select.bucket'), codes.join(' '));
await client.close();

/* ---------- 2. CLI, same specs ---------- */
const cliOut = join(ARTIFACTS, 'cli'), specFile = join(ARTIFACTS, 'specs.json');
writeFileSync(specFile, JSON.stringify(specs));
const cliM = JSON.parse(execFileSync(process.execPath, [join(ROOT, 'tools/cli.mjs'), 'component', join(ROOT, 'examples/lichtblick-kulissenwechsel.project.json'), '--spec', specFile, '--out', cliOut], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
const cliHashes = cliM.components.map(c => sha(readFileSync(join(cliOut, c.file))));
check('cli: same files, byte-identical to MCP', cliM.ok && cliHashes.join() === hashes.join());
let code = 0; try { execFileSync(process.execPath, [join(ROOT, 'tools/cli.mjs'), 'component', join(ROOT, 'examples/lichtblick-kulissenwechsel.project.json'), '--scene', 'sc-kanal', '--view', 'posts', '--select', 'nope', '--out', join(ARTIFACTS, 'cli-bad')], { stdio: 'ignore' }); } catch (e) { code = e.status; }
check('cli: invalid selection exits 1, nothing written', code === 1 && !existsSync(join(ARTIFACTS, 'cli-bad')));

/* ---------- 3. anchors follow content ---------- */
const { renderComponents } = await import('../tools/render.mjs');
const longer = JSON.parse(JSON.stringify(project));
const q1 = longer.scenes[0].posts.find(q => q.id === 'q1');
q1.text = q1.text + ' ' + q1.text;
const lm = await renderComponents(longer, [specs[0]], {});
const a1 = all.anchors.find(a => a.entity === 'q2').box, a2 = lm.components[0].anchors.find(a => a.entity === 'q2').box;
const top = (c, b) => b[1] * c.height;
check('anchors: longer post q1 moves q2 down', lm.ok && top(lm.components[0], a2) > top(all, a1) + 10, `${Math.round(top(all, a1))} px → ${Math.round(top(lm.components[0], a2))} px`);

rmSync(ARTIFACTS, { recursive: true, force: true });
writeFileSync(join(EV, 'components-e2e-result.txt'), `Node ${process.version} · ${new Date().toISOString()}\nProject: examples/lichtblick-kulissenwechsel.project.json\nSpecs: ${JSON.stringify(specs)}\n\n${log.join('\n')}\n\n${pass} passed, ${failN} failed\n`);
console.log(`\n${pass} passed, ${failN} failed`);
process.exit(failN ? 1 : 0);
