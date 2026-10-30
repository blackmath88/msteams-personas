// Local render operation shared by the CLI and the MCP server.
//
//   renderProject(project, { outDir }) → manifest
//
// 1. validates with the same ProjectCore the website uses (no browser for invalid input);
// 2. serves a controlled internal page on 127.0.0.1 (random port): index.html's styles, icon
//    sprite and renderer scripts, without the authoring UI;
// 3. opens it in headless Chromium at a fixed 1920×1080 viewport via tools/cdp.mjs;
// 4. calls window.ProjectRender.renderAll(): the website's own compile → compose →
//    densify/tighten → fit check → PNG path, after fonts are ready;
// 5. writes ordered PNGs and manifest.json only when every slide succeeded;
// 6. always closes the page server, browser and browser profile (success, error, timeout).
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { dirname, join, resolve, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch } from './cdp.mjs';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const PC = createRequire(import.meta.url)(join(ROOT, 'src/project-core.js'));
export const MANIFEST_FORMAT = 'msteams-personas/render-manifest';
export const LIMITS = { timeoutMs: 90_000, maxTimeoutMs: 180_000, scales: [1, 2] };

const TYPES = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
/* The page only needs the renderer scripts; the authoring UI and router are left out. */
const SKIP_SCRIPTS = ['src/project-ui.js', 'src/app.js'];

export function renderPage() {
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  const head = html.slice(0, html.indexOf('</head>'));
  const sprite = html.match(/<svg width="0" height="0"[\s\S]*?<\/svg>/)[0];
  const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]).filter(s => !SKIP_SCRIPTS.includes(s));
  return `${head}\n<meta name="robots" content="noindex"></head>\n<body class="render-page">\n${sprite}\n` +
    scripts.map(s => `<script src="${s}"></script>`).join('\n') + '\n</body></html>';
}

/* Static server for the internal page: GET only, files under the repo's src/ and assets/ plus worlds.js. */
function servePage() {
  const page = renderPage();
  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    if (req.method !== 'GET') { res.writeHead(405).end(); return; }
    if (url.pathname === '/' || url.pathname === '/render.html') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(page); return; }
    const file = resolve(ROOT, '.' + decodeURIComponent(url.pathname));
    const allowed = file === join(ROOT, 'worlds.js') || file.startsWith(join(ROOT, 'src') + sep) || file.startsWith(join(ROOT, 'assets') + sep);
    if (!allowed || !existsSync(file)) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' }).end(readFileSync(file));
  });
  return new Promise(r => server.listen(0, '127.0.0.1', () => r({ server, url: `http://127.0.0.1:${server.address().port}/render.html` })));
}

function baseManifest(project, extra) {
  const meta = project && typeof project === 'object' && project.meta && typeof project.meta === 'object' ? project.meta : {};
  return {
    format: MANIFEST_FORMAT, manifestVersion: 1,
    rendererVersion: PC.RENDERER_VERSION, projectVersion: PC.PROJECT_VERSION, capabilityVersion: PC.CAPABILITY_VERSION,
    project: { id: typeof meta.id === 'string' ? meta.id : null, title: typeof meta.title === 'string' ? meta.title : null },
    ...extra
  };
}

/*
 * project: parsed JSON object. opts.outDir: directory for PNGs and manifest.json (created).
 * Returns the manifest; ok:false results write no files.
 */
export async function renderProject(project, opts = {}) {
  const scale = opts.scale ?? 1, timeoutMs = Math.min(opts.timeoutMs ?? LIMITS.timeoutMs, LIMITS.maxTimeoutMs);
  if (!LIMITS.scales.includes(scale)) return baseManifest(project, { ok: false, stage: 'options', slides: [], diagnostics: [{ code: 'scale', path: 'scale', severity: 'error', message: `Scale ${scale} is not supported (1 or 2).` }] });
  const v = PC.validate(project);
  if (!v.ok) return baseManifest(project, { ok: false, stage: 'validate', slides: [], diagnostics: [...v.errors, ...v.warnings] });

  let page = null, launching = null, srv = null, timer = null;
  const started = Date.now();
  try {
    srv = await servePage();
    const work = (async () => {
      launching = launch({ port: 0, width: 1920, height: 1080 });
      page = await launching;
      await page.size(1920, 1080, 1);
      await page.goto(srv.url);
      for (let i = 0; i < 50 && !(await page.eval('!!(window.ProjectRender && document.readyState === "complete")')); i++) await page.sleep(100);
      return page.eval(`ProjectRender.renderAll(${JSON.stringify(project)}, { dataUrl: true, scale: ${scale} })`);
    })();
    const timeout = new Promise((_, rej) => { timer = setTimeout(() => rej(Object.assign(new Error(`Rendering took longer than ${timeoutMs} ms and was stopped.`), { code: 'timeout' })), timeoutMs); });
    const r = await Promise.race([work, timeout]);
    work.catch(() => { /* settled after a timeout; the browser is closed below */ });
    const pageErrors = page.errors.filter(Boolean);
    const diagnostics = r.diagnostics.map(d => ({ ...d }));
    pageErrors.forEach(m => diagnostics.push({ code: 'page-error', path: '', severity: 'error', message: `Script error in the render page: ${m}` }));
    const ok = r.ok && !pageErrors.length;
    const slides = r.slides.map(s => ({ index: s.index, id: s.id, profile: s.profile, file: s.fileName, width: r.width, height: r.height, bytes: s.bytes, fit: s.fit, data: s.dataUrl }));
    const manifest = baseManifest(project, { ok, stage: ok ? 'done' : r.stage, width: r.width, height: r.height, durationMs: Date.now() - started, slides: ok ? slides.map(({ data, ...s }) => s) : [], diagnostics });
    if (ok && opts.outDir) {
      const written = [];
      try {
        mkdirSync(opts.outDir, { recursive: true });
        for (const s of slides) {
          const buf = Buffer.from(s.data.slice(s.data.indexOf(',') + 1), 'base64');
          const path = join(opts.outDir, s.file); writeFileSync(path, buf); written.push(path);
          manifest.slides[s.index].sha256 = createHash('sha256').update(buf).digest('hex');
        }
        manifest.renderedAt = new Date().toISOString();
        const mpath = join(opts.outDir, 'manifest.json'); writeFileSync(mpath, JSON.stringify(manifest, null, 2)); written.push(mpath);
      } catch (e) {
        written.forEach(p => rmSync(p, { force: true }));
        return baseManifest(project, { ok: false, stage: 'write', slides: [], diagnostics: [{ code: 'write', path: '', severity: 'error', message: `Could not write output: ${e.message}` }] });
      }
    }
    return manifest;
  } catch (e) {
    const code = e.code === 'timeout' ? 'timeout' : 'render';
    return baseManifest(project, { ok: false, stage: 'render', slides: [], durationMs: Date.now() - started, diagnostics: [{ code, path: '', severity: 'error', message: code === 'timeout' ? e.message : `Rendering failed: ${e.message}` }] });
  } finally {
    clearTimeout(timer);
    /* a timeout can fire while Chromium is still starting: wait for it, then close it */
    if (!page && launching) page = await launching.catch(() => null);
    if (page) await page.close();
    if (srv) await new Promise(r => { srv.server.closeAllConnections?.(); srv.server.close(() => r()); });
  }
}
