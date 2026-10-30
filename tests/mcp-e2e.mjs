// End-to-end proof with the official MCP TypeScript SDK client (v2), over stdio and Streamable
// HTTP, plus the CLI on the same project. Writes evidence to docs/evidence-cli-mcp/.
//   Run: node tests/mcp-e2e.mjs      (needs Chromium; TMPDIR may point to a writable dir)
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { spawn, execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, mkdtempSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { request } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const EV = join(ROOT, 'docs/evidence-cli-mcp');
const project = JSON.parse(readFileSync(join(ROOT, 'examples/bibliothek-tannwil.project.json'), 'utf8'));
const overflow = JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/overflow.project.json'), 'utf8'));
const ARTIFACTS = mkdtempSync(join(tmpdir(), 'mtp-mcp-art-'));
const env = { ...process.env, MTP_ARTIFACT_DIR: ARTIFACTS };
const sha = b => createHash('sha256').update(b).digest('hex');
const sleep = ms => new Promise(r => setTimeout(r, ms));

let pass = 0, failN = 0; const log = [];
function check(name, ok, detail = '') { (ok ? pass++ : failN++); const line = `${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`; console.log(line); log.push(line); }
const browsers = () => { try { return execFileSync('pgrep', ['-af', 'user-data-dir=.*mtp-cdp-'], { encoding: 'utf8' }).trim().split('\n').filter(l => l && /chrom/.test(l.split(' ')[1] || '')); } catch { return []; } };
const profiles = () => readdirSync(tmpdir()).filter(n => n.startsWith('mtp-cdp-') || n.startsWith('org.chromium.')).length;

rmSync(EV, { recursive: true, force: true });
mkdirSync(join(EV, 'mcp-stdio'), { recursive: true }); mkdirSync(join(EV, 'mcp-http'), { recursive: true });
const profilesBefore = profiles();

async function flow(client, label, outDir) {
  const tools = (await client.listTools()).tools.map(t => t.name).sort();
  check(`${label}: tools discovered`, ['get_capabilities', 'get_example', 'render_project', 'retrieve_artifact', 'validate_project'].every(t => tools.includes(t)), tools.join(', '));
  const caps = (await client.callTool({ name: 'get_capabilities', arguments: {} })).structuredContent;
  check(`${label}: capabilities`, caps.projectVersion === 1 && Object.keys(caps.profiles).join() === 'teams-posts,planner,prinzip-tasks' && caps.stateIds.join() === 'before,after');
  const ex = (await client.callTool({ name: 'get_example', arguments: {} })).structuredContent;
  check(`${label}: example project`, ex.format === 'msteams-personas/project' && ex.slides.length === 3);

  const v = (await client.callTool({ name: 'validate_project', arguments: { project } })).structuredContent;
  check(`${label}: new project validates`, v.ok === true && v.errors.length === 0, `${v.warnings.length} warnings`);

  const bad = structuredClone(project); bad.people.push(null); bad.meta.organisation = 42; bad.states[1].id = 'spaeter';
  const bv = (await client.callTool({ name: 'validate_project', arguments: { project: bad } })).structuredContent;
  const codes = bv.errors.map(e => e.code);
  check(`${label}: malformed project → located diagnostics`, !bv.ok && codes.includes('bad-entry') && codes.includes('type') && codes.includes('state-ids') && bv.errors.every(e => e.path !== undefined && e.message), codes.join(','));
  const br = await client.callTool({ name: 'render_project', arguments: { project: bad } });
  check(`${label}: malformed project → render refused`, br.isError === true && br.structuredContent.stage === 'validate');

  const r = await client.callTool({ name: 'render_project', arguments: { project } });
  const m = r.structuredContent;
  check(`${label}: render ok`, !r.isError && m.ok && m.slides.length === 3, `${m.durationMs} ms`);
  check(`${label}: slide order and ids`, m.slides.map(s => s.id).join() === 's-kanal,s-plan,s-prinzip' && m.slides.map(s => s.profile).join() === 'teams-posts,planner,prinzip-tasks');
  check(`${label}: manifest fields`, m.rendererVersion === 'v3' && m.slides.every(s => s.width === 1920 && s.height === 1080 && /^[0-9a-f]{64}$/.test(s.sha256)) && Array.isArray(m.diagnostics));
  const links = r.content.filter(c => c.type === 'resource_link');
  check(`${label}: resource links, no inline base64`, links.length === 4 && !r.content.some(c => c.type === 'image') && JSON.stringify(r).length < 20000, `${JSON.stringify(r).length} bytes`);

  const res = (await client.listResources()).resources.map(x => x.uri);
  check(`${label}: resources listed`, links.every(l => res.includes(l.uri)));
  const hashes = [];
  for (const s of m.slides) {
    const { contents } = await client.readResource({ uri: s.uri });
    const buf = Buffer.from(contents[0].blob, 'base64');
    writeFileSync(join(outDir, s.file), buf); hashes.push(sha(buf));
    check(`${label}: read ${s.file}`, contents[0].mimeType === 'image/png' && buf.subarray(1, 4).toString() === 'PNG' && buf.readUInt32BE(16) === 1920 && buf.readUInt32BE(20) === 1080 && sha(buf) === s.sha256);
  }
  const img = await client.callTool({ name: 'retrieve_artifact', arguments: { renderId: m.renderId, file: m.slides[2].file } });
  check(`${label}: retrieve_artifact returns one image`, img.content[0].type === 'image' && sha(Buffer.from(img.content[0].data, 'base64')) === m.slides[2].sha256);
  const manifest = JSON.parse((await client.readResource({ uri: m.manifestUri })).contents[0].text);
  writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  /* traversal and guessing: only names in the render's manifest resolve */
  const t1 = await client.callTool({ name: 'retrieve_artifact', arguments: { renderId: m.renderId, file: '../../../../etc/passwd' } });
  const t2 = await client.callTool({ name: 'retrieve_artifact', arguments: { renderId: '../' + m.renderId, file: 'manifest.json' } });
  let t3 = false; try { await client.readResource({ uri: `mtp://renders/${m.renderId}/..%2F..%2Fetc%2Fpasswd` }); } catch { t3 = true; }
  let t4 = false; try { await client.readResource({ uri: `mtp://renders/r-0000000000000000/manifest.json` }); } catch { t4 = true; }
  check(`${label}: traversal and unknown ids refused`, t1.isError === true && t2.isError === true && t3 && t4);

  const of = await client.callTool({ name: 'render_project', arguments: { project: overflow } });
  const fitErr = of.structuredContent.diagnostics.find(d => d.code === 'fit');
  check(`${label}: render failure reported (fit)`, of.isError === true && of.structuredContent.stage === 'render' && !!fitErr && fitErr.slide === 's-kanal', fitErr && fitErr.message);
  const renderDirs = readdirSync(ARTIFACTS).filter(n => n.startsWith('r-'));
  check(`${label}: failed renders leave no artifact dir`, renderDirs.every(d => existsSync(join(ARTIFACTS, d, 'manifest.json'))));

  const tooBig = await client.callTool({ name: 'validate_project', arguments: { project: { ...project, meta: { ...project.meta, notes: 'x'.repeat(210 * 1024) } } } });
  check(`${label}: input size limit`, tooBig.structuredContent.ok === false && tooBig.structuredContent.errors[0].code === 'too-large');
  return { manifest: m, hashes };
}

/* ---------- 1. stdio ---------- */
const stdioClient = new Client({ name: 'mtp-e2e', version: '1.0.0' });
await stdioClient.connect(new StdioClientTransport({ command: process.execPath, args: [join(ROOT, 'tools/mcp-server.mjs')], env, stderr: 'ignore' }));
check('stdio: initialize', stdioClient.getServerVersion()?.name === 'msteams-personas', `${JSON.stringify(stdioClient.getServerVersion())} protocol ${stdioClient.getNegotiatedProtocolVersion()} era ${stdioClient.getDiscoverResult() ? 'modern' : 'legacy'}`);
const viaStdio = await flow(stdioClient, 'stdio', join(EV, 'mcp-stdio'));
await stdioClient.close();

/* ---------- 2. Streamable HTTP on localhost ---------- */
const port = 18787 + Math.floor(Math.random() * 1000);
const srv = spawn(process.execPath, [join(ROOT, 'tools/mcp-server.mjs'), '--http', '--port', String(port)], { env, stdio: ['ignore', 'ignore', 'pipe'] });
let banner = ''; srv.stderr.on('data', d => { banner += d; });
for (let i = 0; i < 50 && !banner.includes('/mcp'); i++) await sleep(100);
check('http: bound to 127.0.0.1', banner.includes(`http://127.0.0.1:${port}/mcp`), banner.trim());
/* DNS-rebinding guard: a request naming a foreign Host must be refused before the MCP handler */
const rebinding = await new Promise(r => request({ host: '127.0.0.1', port, path: '/mcp', method: 'POST', headers: { host: 'evil.example', 'content-type': 'application/json' } }, res => { res.resume(); r(res.statusCode); }).end('{}'));
check('http: foreign Host header rejected', rebinding === 403, String(rebinding));
const httpClient = new Client({ name: 'mtp-e2e', version: '1.0.0' });
const httpTransport = new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${port}/mcp`));
await httpClient.connect(httpTransport);
check('http: initialize', httpClient.getServerVersion()?.name === 'msteams-personas', `protocol ${httpClient.getNegotiatedProtocolVersion()} era ${httpClient.getDiscoverResult() ? 'modern' : 'legacy'}`);
const viaHttp = await flow(httpClient, 'http', join(EV, 'mcp-http'));
await httpTransport.terminateSession().catch(() => {}); await httpClient.close();
srv.kill('SIGTERM'); await new Promise(r => srv.once('exit', r));

/* ---------- 3. CLI on the same project ---------- */
const cliOut = join(EV, 'cli');
let cliStdout = '', cliCode = 0;
try { cliStdout = execFileSync(process.execPath, [join(ROOT, 'tools/cli.mjs'), 'render', join(ROOT, 'examples/bibliothek-tannwil.project.json'), '--out', cliOut], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) { cliCode = e.status; cliStdout = e.stdout; }
const cliM = JSON.parse(cliStdout);
check('cli: render exit 0 and JSON-only stdout', cliCode === 0 && cliM.ok);
const cliHashes = cliM.slides.map(s => sha(readFileSync(join(cliOut, s.file))));
check('all routes: same files in the same order', [viaStdio.manifest, viaHttp.manifest].every(m => m.slides.map(s => s.file).join() === cliM.slides.map(s => s.file).join()));
check('all routes: byte-identical PNGs (stdio = http = cli)', viaStdio.hashes.join() === cliHashes.join() && viaHttp.hashes.join() === cliHashes.join());
let failCode = 0; try { execFileSync(process.execPath, [join(ROOT, 'tools/cli.mjs'), 'render', join(ROOT, 'tests/fixtures/overflow.project.json'), '--out', join(ARTIFACTS, 'cli-fail')], { stdio: 'ignore' }); } catch (e) { failCode = e.status; }
check('cli: render failure exit 3, nothing written', failCode === 3 && !existsSync(join(ARTIFACTS, 'cli-fail')));

/* ---------- 4. timeout and cleanup ---------- */
const { renderProject } = await import('../tools/render.mjs');
const to = await renderProject(project, { outDir: join(ARTIFACTS, 'timeout'), timeoutMs: 300 });
check('timeout: reported, nothing written', !to.ok && to.diagnostics[0].code === 'timeout' && !existsSync(join(ARTIFACTS, 'timeout')));
await sleep(300);
const left = browsers();
check('cleanup: no browser process left', left.length === 0, left.map(l => l.slice(0, 80)).join(' | '));
check('cleanup: no browser profile dirs left', profiles() === profilesBefore, `${profiles()} vs ${profilesBefore}`);

rmSync(ARTIFACTS, { recursive: true, force: true });
writeFileSync(join(EV, 'mcp-e2e-result.txt'), `MCP client: @modelcontextprotocol/client ${JSON.parse(readFileSync(join(ROOT, 'node_modules/@modelcontextprotocol/client/package.json'))).version} (Client, StdioClientTransport, StreamableHTTPClientTransport)\nServer SDK: @modelcontextprotocol/server ${JSON.parse(readFileSync(join(ROOT, 'node_modules/@modelcontextprotocol/server/package.json'))).version}\nNode ${process.version} · ${new Date().toISOString()}\n\n${log.join('\n')}\n\n${pass} passed, ${failN} failed\n`);
console.log(`\n${pass} passed, ${failN} failed`);
process.exit(failN ? 1 : 0);
