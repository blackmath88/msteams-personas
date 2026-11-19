// Storage story «Rucksack & Regal»: drawn metaphors are deterministic and the profile validates.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const M = require('../src/metaphors.js');
const PC = require('../src/project-core.js');
const project = () => JSON.parse(readFileSync(new URL('../docs/review/storage/variant-a.project.json', import.meta.url), 'utf8'));
const codes = p => PC.validate(p).errors.map(e => e.code);

test('metaphors: same input gives the same picture, and only palette colours are used', () => {
  const palette = Object.values(M.colours).map(c => c.toLowerCase());
  for (const name of ['rucksack', 'regal', 'haus', 'person', 'schluessel']) {
    const o = { size: 300, highlight: true, label: 'Maras <Rucksack>' };
    const svg = M[name](o);
    assert.equal(svg, M[name](o), name);
    assert.match(svg, /^<svg class="mx mx-/);
    assert.ok(svg.includes('Maras &lt;Rucksack&gt;'), name + ': label is escaped');
    for (const c of svg.match(/#[0-9a-f]{6}/gi)) assert.ok(palette.includes(c.toLowerCase()), name + ' ' + c);
  }
});

test('metaphors: states change the drawing', () => {
  const plain = M.rucksack({});
  assert.notEqual(M.rucksack({ empty: true }), plain);
  assert.match(M.rucksack({ empty: true }), /stroke-dasharray/);
  assert.notEqual(M.rucksack({ crossed: true }), plain);
  assert.notEqual(M.rucksack({ sidePocket: 'highlight' }), plain);
  assert.notEqual(M.person({ walking: true, rucksack: true }), M.person({}));
  assert.equal((M.regal({ count: 3 }).match(/<g transform/g) || []).length, 3);
  assert.match(M.rucksack({ size: 480, stroke: 2.5 }), /stroke-width="1.25"/); // 2.5 px at twice the drawing size
});

test('storage-metaphor: valid at capability 7, refused below, fields checked', () => {
  assert.deepEqual(PC.validate(project()), { ok: true, errors: [], warnings: [] });
  assert.equal(PC.capabilities().profiles['storage-metaphor'].minCapabilityVersion, 7);
  let p = project(); p.capabilityVersion = 6; assert.ok(codes(p).includes('profile-version'));
  p = project(); p.scenes[0].owner = 'niemand'; assert.ok(codes(p).includes('storage-owner'));
  p = project(); delete p.scenes[0].channel; assert.ok(codes(p).includes('storage-field'));
  p = project(); p.scenes[0].title = 'x'.repeat(61); assert.ok(codes(p).includes('storage-long'));
  p = project(); p.scenes[0].variant = 'z'; assert.ok(codes(p).includes('storage-variant'));
  p = project(); p.scenes[0].crops = 'ja'; assert.ok(codes(p).includes('type'));
  assert.equal(PC.slidePlan(project(), 0).kind, 'storage');
});
