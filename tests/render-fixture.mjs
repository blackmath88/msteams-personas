// Cross-host render check: every example must render completely, and each slide must wrap its
// text exactly like the committed baseline (tests/fixtures/layout-baseline.json).
//
//   node tests/render-fixture.mjs            compare; exit 1 on a failed render or a different layout
//   node tests/render-fixture.mjs --update   rewrite the baseline after an intended layout change
//
// The baseline stores a hash of the line count of every text block, not pixels: anti-aliasing
// differs between operating systems, line breaks must not. Needs Chromium (CHROMIUM=/path).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, renderProject } from '../tools/render.mjs';

const BASELINE = join(ROOT, 'tests/fixtures/layout-baseline.json');
const update = process.argv.includes('--update');
const files = readdirSync(join(ROOT, 'examples')).filter(f => f.endsWith('.project.json')).sort();
const expected = update ? {} : JSON.parse(readFileSync(BASELINE, 'utf8')).examples;
const actual = {}, problems = [];
let browser = '';

for (const file of files) {
  const project = JSON.parse(readFileSync(join(ROOT, 'examples', file), 'utf8'));
  let m = await renderProject(project);
  /* A cold machine can be too slow to start the browser the first time. That is not a layout
     result, so try once more; a second failure is reported. */
  if (!m.ok && m.diagnostics.some(d => /did not start/.test(d.message))) { console.log(`${file}: browser did not start, retrying once`); m = await renderProject(project); }
  if (!m.ok) { problems.push(`${file}: render failed at stage ${m.stage}: ${m.diagnostics.filter(d => d.severity === 'error').map(d => d.message).join(' | ')}`); continue; }
  browser = m.environment.userAgent;
  actual[file] = m.slides.map(s => ({ id: s.id, textBlocks: s.layout.textBlocks, lines: s.layout.lines, hash: s.layout.hash }));
  if (update) continue;
  const want = expected[file];
  if (!want) { problems.push(`${file}: not in the baseline (run with --update)`); continue; }
  actual[file].forEach((s, i) => {
    const w = want[i];
    if (!w || w.hash !== s.hash) problems.push(`${file} slide ${i + 1} (${s.id}): layout ${s.hash} with ${s.lines} lines in ${s.textBlocks} text blocks, baseline ${w ? `${w.hash} with ${w.lines} lines in ${w.textBlocks}` : 'missing'}`);
  });
  if (want.length !== actual[file].length) problems.push(`${file}: ${actual[file].length} slides, baseline has ${want.length}`);
}
if (!update) Object.keys(expected).filter(f => !files.includes(f)).forEach(f => problems.push(`${f}: in the baseline but no longer in examples/`));

console.log(`browser: ${browser}`);
if (problems.length) { problems.forEach(p => console.error('FAIL ' + p)); process.exit(1); }
const slides = Object.values(actual).reduce((n, a) => n + a.length, 0);
if (update) {
  writeFileSync(BASELINE, JSON.stringify({ note: 'Line-wrap fingerprint per slide. Regenerate with: node tests/render-fixture.mjs --update', recordedWith: browser, examples: actual }, null, 2) + '\n');
  console.log(`baseline written: ${files.length} examples, ${slides} slides`);
} else console.log(`ok: ${files.length} examples, ${slides} slides wrap exactly like the baseline`);
