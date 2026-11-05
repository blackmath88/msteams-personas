#!/usr/bin/env node
// MCP adapter (official TypeScript SDK v2) over the same operations as the CLI (tools/ops.mjs).
//
//   node tools/mcp-server.mjs                      stdio
//   node tools/mcp-server.mjs --http [--port 8787] Streamable HTTP on http://127.0.0.1:8787/mcp
//
// Tools: get_capabilities, get_example, validate_project, render_project, render_components,
// retrieve_artifact.
// Rendered files are also resources: mtp://renders/{renderId}/{file} (template, listable).
//
// Rendering takes project JSON only (never a path). Each render gets a server-generated id and
// directory under the artifact root; retrieval only resolves names listed in that render's
// manifest, so no request can reach a file outside it. Limits: input size (ProjectCore), slide
// count (capabilities), fixed 1920×1080 at scale 1 or 2, one render at a time, a timeout, and
// at most MAX_RENDERS kept renders (oldest removed first).
import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { McpServer, ResourceTemplate, createMcpHandler } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { toNodeHandler, localhostHostValidation, localhostOriginValidation } from '@modelcontextprotocol/node';
import * as z from 'zod/v4';
import { getCapabilities, getExample, validateProject, renderToDir, renderComponentsToDir } from './ops.mjs';

const VERSION = '0.1.0';
const ARTIFACTS = process.env.MTP_ARTIFACT_DIR || join(tmpdir(), 'msteams-personas-artifacts');
const MAX_RENDERS = 20;
const RENDER_ID = /^r-[0-9a-f]{16}$/;
const uriOf = (id, file) => `mtp://renders/${id}/${file}`;
/* Slide renders list `slides`, component renders list `components`; both carry `file`. */
const filesOf = m => m.slides || m.components || [];
const titleOf = (m, s) => m.components ? `Komponente ${s.index + 1} (${s.type}, ${s.view})` : `Folie ${s.index + 1} (${s.profile})`;

/* ---------- artifact store: generated ids, manifest-listed names only ---------- */
function manifestOf(id) {
  if (!RENDER_ID.test(id)) return null;
  const p = join(ARTIFACTS, id, 'manifest.json');
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null;
}
function artifactPath(id, file) {
  const m = manifestOf(id); if (!m) return null;
  if (file === 'manifest.json') return { path: join(ARTIFACTS, id, file), mimeType: 'application/json' };
  const s = filesOf(m).find(x => x.file === file);
  return s ? { path: join(ARTIFACTS, id, s.file), mimeType: 'image/png', slide: s } : null;
}
function renders() {
  if (!existsSync(ARTIFACTS)) return [];
  return readdirSync(ARTIFACTS).filter(n => RENDER_ID.test(n)).map(n => ({ id: n, t: statSync(join(ARTIFACTS, n)).mtimeMs })).sort((a, b) => b.t - a.t);
}
function prune() { renders().slice(MAX_RENDERS).forEach(r => rmSync(join(ARTIFACTS, r.id), { recursive: true, force: true })); }

/* One render at a time: Chromium is the expensive part. */
let queue = Promise.resolve();
function exclusive(fn) { const run = queue.then(fn, fn); queue = run.catch(() => {}); return run; }

const json = o => [{ type: 'text', text: JSON.stringify(o, null, 2) }];
const ProjectArg = z.record(z.string(), z.unknown()).describe('The project as a JSON object (format "msteams-personas/project"). Use get_example for a complete valid project and get_capabilities for profiles and limits.');

function build() {
  const server = new McpServer({ name: 'msteams-personas', version: VERSION }, {
    instructions: 'Creates fictional Microsoft 365 training visuals (task sequences, workspace maps and linked application scenes) from a JSON project. ' +
      'Typical flow: get_capabilities, get_example, adapt the example, validate_project until ok, then either render_project (finished 1920×1080 slides) ' +
      'or render_components (only the M365 screen or an excerpt, without heading or footer, to place on your own slide), then read the returned resource links (or retrieve_artifact) to inspect the PNGs. ' +
      'For components, place callouts next to the returned anchors (boxes normalised 0..1 to the picture) and keep the picture at least text.minPlacedWidthIn inches wide; show the returned attribution on the slide. ' +
      'All content must be fictional. States "before" and "after" are complete snapshots.'
  });

  server.registerTool('get_capabilities', {
    title: 'Capabilities', description: 'Supported screens (profiles), text budgets, limits, versions and output size.',
    annotations: { readOnlyHint: true }
  }, async () => { const c = getCapabilities(); return { content: json(c), structuredContent: c }; });

  server.registerTool('get_example', {
    title: 'Example project', description: 'A complete valid example project. Choose tasks (default) or workspace (fictional Uni Basel training case).',
    inputSchema: z.object({ kind: z.enum(['tasks', 'workspace']).optional() }), annotations: { readOnlyHint: true }
  }, async ({ kind }) => { const p = getExample(kind); return { content: json(p), structuredContent: p }; });

  server.registerTool('validate_project', {
    title: 'Validate project', description: 'Checks a project and returns structured errors (blocking) and warnings, each with code, path and message.',
    inputSchema: z.object({ project: ProjectArg }), annotations: { readOnlyHint: true }
  }, async ({ project }) => { const v = validateProject(project); return { content: json(v), structuredContent: v }; });

  server.registerTool('render_project', {
    title: 'Render project', description: 'Validates and renders every slide to a 1920×1080 PNG (scale 2: 3840×2160) in order. Returns the manifest and one resource link per PNG; nothing is written when any slide fails.',
    inputSchema: z.object({ project: ProjectArg, scale: z.union([z.literal(1), z.literal(2)]).optional().describe('1 (default) or 2') }),
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false }
  }, async ({ project, scale }) => exclusive(async () => {
    const id = 'r-' + randomBytes(8).toString('hex'), dir = join(ARTIFACTS, id);
    const m = await renderToDir(project, dir, { scale: scale ?? 1 });
    if (!m.ok) { rmSync(dir, { recursive: true, force: true }); return { isError: true, content: json({ ok: false, stage: m.stage, diagnostics: m.diagnostics }), structuredContent: { ok: false, stage: m.stage, diagnostics: m.diagnostics } }; }
    prune();
    const result = { ok: true, renderId: id, manifestUri: uriOf(id, 'manifest.json'), ...m, slides: m.slides.map(s => ({ ...s, uri: uriOf(id, s.file) })) };
    return {
      structuredContent: result,
      content: [
        { type: 'text', text: `${m.slides.length} slides rendered (${m.width}×${m.height}). Read the resource links to inspect them.\n` + JSON.stringify({ renderId: id, slides: result.slides.map(s => ({ index: s.index, id: s.id, profile: s.profile, uri: s.uri })), diagnostics: m.diagnostics }, null, 2) },
        ...result.slides.map(s => ({ type: 'resource_link', uri: s.uri, name: s.file, title: `Folie ${s.index + 1} (${s.profile})`, mimeType: 'image/png', size: s.bytes })),
        { type: 'resource_link', uri: result.manifestUri, name: 'manifest.json', mimeType: 'application/json' }
      ]
    };
  }));

  const ComponentArg = z.object({
    scene: z.string().describe('Scene id from the project (teams-posts, teams-chat or planner).'),
    type: z.string().optional().describe('Optional check: teams.channel, teams.chat or planner.board; follows from the scene.'),
    view: z.string().optional().describe('teams.channel: window | posts · teams.chat: window | messages · planner.board: board | bucket. Default: the first.'),
    select: z.record(z.string(), z.unknown()).optional().describe('posts: {"postIds": [...]} · messages: {"messageIds": [...]} · bucket: {"bucket": "<name>"} (required). Omit to show all.'),
    width: z.number().optional().describe('posts/messages only: list width in app px (420–1080, default 640). Narrower wraps text, so the picture stays readable at a smaller size.'),
    marks: z.boolean().optional().describe('Show the numbered hint badges from the project (default false; anchors are returned either way).')
  });
  server.registerTool('render_components', {
    title: 'Render components',
    description: 'Renders M365 screens or excerpts as PNGs without slide heading, explanation or footer, for placing on your own slides. ' +
      'Returns per component: file, size, anchors [{entity, kind, box:[x,y,w,h] 0..1}], text.minPlacedWidthIn (smallest width at which body text stays ≥ 12 pt on the slide), context label and attribution. Default scale 2. Nothing is written when any component fails.',
    inputSchema: z.object({ project: ProjectArg, components: z.array(ComponentArg).min(1).max(8), scale: z.union([z.literal(1), z.literal(2)]).optional().describe('2 (default) or 1') }),
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false }
  }, async ({ project, components, scale }) => exclusive(async () => {
    const id = 'r-' + randomBytes(8).toString('hex'), dir = join(ARTIFACTS, id);
    const m = await renderComponentsToDir(project, components, dir, { scale: scale ?? 2 });
    if (!m.ok) { rmSync(dir, { recursive: true, force: true }); return { isError: true, content: json({ ok: false, stage: m.stage, diagnostics: m.diagnostics }), structuredContent: { ok: false, stage: m.stage, diagnostics: m.diagnostics } }; }
    prune();
    const result = { ok: true, renderId: id, manifestUri: uriOf(id, 'manifest.json'), ...m, components: m.components.map(c => ({ ...c, uri: uriOf(id, c.file) })) };
    return {
      structuredContent: result,
      content: [
        { type: 'text', text: `${m.components.length} components rendered. Read the resource links to inspect them.\n` + JSON.stringify({ renderId: id, components: result.components.map(({ sha256, crop, ...c }) => c), diagnostics: m.diagnostics }, null, 2) },
        ...result.components.map(c => ({ type: 'resource_link', uri: c.uri, name: c.file, title: titleOf(m, c), mimeType: 'image/png', size: c.bytes })),
        { type: 'resource_link', uri: result.manifestUri, name: 'manifest.json', mimeType: 'application/json' }
      ]
    };
  }));

  server.registerTool('retrieve_artifact', {
    title: 'Retrieve artifact', description: 'Returns one rendered PNG as an image (or the manifest as JSON) by renderId and file name from render_project or render_components.',
    inputSchema: z.object({ renderId: z.string().regex(RENDER_ID), file: z.string().max(120) }), annotations: { readOnlyHint: true }
  }, async ({ renderId, file }) => {
    const a = artifactPath(renderId, file);
    if (!a) return { isError: true, content: [{ type: 'text', text: `No artifact "${file}" in render "${renderId}".` }] };
    const data = readFileSync(a.path);
    return a.mimeType === 'image/png'
      ? { content: [{ type: 'image', data: data.toString('base64'), mimeType: 'image/png' }, { type: 'text', text: JSON.stringify({ renderId, ...a.slide }) }] }
      : { content: [{ type: 'text', text: data.toString('utf8') }] };
  });

  server.registerResource('render-artifact', new ResourceTemplate('mtp://renders/{renderId}/{file}', {
    list: async () => ({
      resources: renders().flatMap(r => {
        const m = manifestOf(r.id); if (!m) return [];
        return [...filesOf(m).map(s => ({ uri: uriOf(r.id, s.file), name: s.file, title: `${m.project.title} · ${titleOf(m, s)}`, mimeType: 'image/png' })), { uri: uriOf(r.id, 'manifest.json'), name: 'manifest.json', mimeType: 'application/json' }];
      })
    })
  }), { title: 'Rendered slides and components', description: 'PNGs and manifests produced by render_project and render_components.' }, async (uri, { renderId, file }) => {
    const a = artifactPath(String(renderId), String(file));
    if (!a) throw new Error(`Unknown artifact ${uri.href}`);
    const data = readFileSync(a.path);
    return { contents: [a.mimeType === 'image/png' ? { uri: uri.href, mimeType: a.mimeType, blob: data.toString('base64') } : { uri: uri.href, mimeType: a.mimeType, text: data.toString('utf8') }] };
  });

  return server;
}

/* ---------- transports ---------- */
const argv = process.argv.slice(2);
const opt = k => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
mkdirSync(ARTIFACTS, { recursive: true });

if (argv.includes('--http')) {
  const port = Number(opt('--port') || process.env.PORT || 8787), host = opt('--host') || '127.0.0.1';
  const handler = toNodeHandler(createMcpHandler(() => build()));
  const validateHost = localhostHostValidation(), validateOrigin = localhostOriginValidation();
  const http = createServer((req, res) => {
    if (!validateHost(req, res) || !validateOrigin(req, res)) return;
    if (new URL(req.url, 'http://x').pathname !== '/mcp') { res.writeHead(404).end(); return; }
    void handler(req, res);
  });
  http.listen(port, host, () => console.error(`msteams-personas MCP (Streamable HTTP) on http://${host}:${http.address().port}/mcp · artifacts in ${ARTIFACTS}`));
  const stop = () => http.close(() => process.exit(0));
  process.on('SIGINT', stop); process.on('SIGTERM', stop);
} else {
  const handle = serveStdio(() => build());
  console.error(`msteams-personas MCP (stdio) ready · artifacts in ${ARTIFACTS}`);
  process.on('SIGINT', () => { void handle.close(); });
}
