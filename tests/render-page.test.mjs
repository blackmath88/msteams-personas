// The headless render page has an explicit load list (tools/render.mjs). These checks keep it in
// step with the website, so a script or stylesheet added to index.html must be classified.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { ROOT, RENDER_STYLES, RENDER_SCRIPTS, UI_ONLY_SCRIPTS, renderPage } from '../tools/render.mjs';

const index = readFileSync(join(ROOT, 'index.html'), 'utf8');
const scripts = [...index.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
const styles = [...index.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map(m => m[1]);

test('every website script is either a render script or declared UI-only, in the same order', () => {
  const unknown = scripts.filter(s => !RENDER_SCRIPTS.includes(s) && !UI_ONLY_SCRIPTS.includes(s));
  assert.deepEqual(unknown, [], 'Add new scripts to RENDER_SCRIPTS or UI_ONLY_SCRIPTS in tools/render.mjs');
  assert.deepEqual(scripts.filter(s => !UI_ONLY_SCRIPTS.includes(s)), RENDER_SCRIPTS);
  assert.deepEqual(UI_ONLY_SCRIPTS.filter(s => !scripts.includes(s)), []);
});

test('the render page loads the same stylesheets as the website, and every listed file exists', () => {
  assert.deepEqual(styles, RENDER_STYLES);
  for (const f of [...RENDER_STYLES, ...RENDER_SCRIPTS]) assert.ok(existsSync(join(ROOT, f)), f);
  const page = renderPage();
  for (const f of [...RENDER_STYLES, ...RENDER_SCRIPTS]) assert.ok(page.includes(`"${f}"`), f);
  for (const f of UI_ONLY_SCRIPTS) assert.ok(!page.includes(`"${f}"`), f);
  assert.match(page, /<symbol id="i-check"/);
});

test('the bundled fonts are embedded, so file:// and the SVG-based PNG export need no font request', () => {
  const css = readFileSync(join(ROOT, 'assets/fonts.css'), 'utf8');
  assert.equal((css.match(/@font-face/g) || []).length, 4);
  assert.equal((css.match(/url\(data:font\/woff2;base64,/g) || []).length, 4);
  assert.ok(!/url\((?!data:)/.test(css), 'fonts.css must not reference external files');
  for (const [file, weight] of [['selawik-regular', 400], ['selawik-semibold', 600], ['selawik-bold', 700]]) {
    const b64 = readFileSync(join(ROOT, 'assets/fonts', file + '.woff2')).toString('base64');
    assert.ok(css.includes(`font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${b64})`), `${file}: run node tools/gen-fonts-css.mjs`);
  }
  /* Slides and application screens must not name a system font ahead of the bundled one. */
  for (const f of RENDER_STYLES.slice(1)) assert.ok(!/font(-family)?:[^;}]*"?Segoe UI/.test(readFileSync(join(ROOT, f), 'utf8')), f);
});

test('slides may carry their own title and assumptions; the footer keeps the sequence title', () => {
  const PC = createRequire(import.meta.url)(join(ROOT, 'src/project-core.js'));
  const p = PC.template();
  p.slides[0].title = 'Was fehlt bei dieser Übergabe?';
  p.slides[0].assumptions = ['Nur diese Voraussetzung.'];
  p.slides[1].assumptions = [];
  assert.equal(PC.validate(p).ok, true);
  const a = PC.compile(p, 0), b = PC.compile(p, 1), c = PC.compile(p, 2);
  assert.equal(a.title, 'Was fehlt bei dieser Übergabe?');
  assert.equal(a.projectTitle, p.meta.title);
  assert.deepEqual(a.assumptions, ['Nur diese Voraussetzung.']);
  assert.equal(b.title, p.meta.title);
  assert.deepEqual(b.assumptions, []);
  assert.deepEqual(c.assumptions, p.meta.assumptions);
  p.slides[0].title = 5; p.slides[1].assumptions = 'x';
  assert.deepEqual(PC.validate(p).errors.map(e => e.path), ['slides[0].title', 'slides[1].assumptions']);
  p.slides[0].title = 'x'.repeat(71); p.slides[1].assumptions = ['a', 'b', 'c', 'd'];
  const v = PC.validate(p);
  assert.equal(v.ok, true);
  assert.deepEqual(v.warnings.filter(w => w.code === 'long').map(w => w.path), ['slides[0].title', 'slides[1].assumptions']);
});
