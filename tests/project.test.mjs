// Portable project core: validation, parsing, compilation, bridge prompts.  Run: node --test tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const PC = createRequire(import.meta.url)('../src/project-core.js');
const T = () => PC.template();

test('template and blank are valid projects of the current versions', () => {
  for (const p of [T(), PC.blank()]) {
    const v = PC.validate(p);
    assert.deepEqual(v.errors, [], JSON.stringify(v.errors));
    assert.equal(p.projectVersion, PC.PROJECT_VERSION);
    assert.equal(p.capabilityVersion, PC.CAPABILITY_VERSION);
  }
  assert.deepEqual(Object.keys(PC.capabilities().profiles), ['teams-posts', 'planner', 'prinzip-tasks']);
});

test('save and reopen keeps every field, notes and assumptions included', () => {
  const p = T();
  p.meta.notes = 'Für den Workshop am Donnerstag';
  p.slides[1].presenterNotes = 'Neue Notiz';
  const back = PC.parseInput(PC.serialise(p)).project;
  assert.deepEqual(back, p);
});

test('renaming a person updates Teams, Planner and Prinzip views', () => {
  const p = T();
  p.people.find(x => x.id === 'p-aylin').name = 'Aylin Yilmaz';
  const posts = PC.compile(p, 0), plan = PC.compile(p, 1), pr = PC.compile(p, 2);
  assert.equal(posts.person(posts.scene.posts[1].by).name, 'Aylin Yilmaz');
  assert.ok(plan.scene.tasks.some(t => plan.person(t.owner).name === 'Aylin Yilmaz'));
  assert.ok(pr.principles.tasks.shared.some(t => pr.person(t.who).name === 'Aylin Yilmaz'));
  assert.ok(pr.principles.tasks.personal.some(r => pr.person(r.who).name === 'Aylin Yilmaz'));
});

test('changing only the after-state owner leaves the before state unchanged', () => {
  const p = T();
  p.states.find(s => s.id === 'after').tasks['t-bremsen'].owner = 'p-lina';
  const pr = PC.compile(p, 2);
  assert.equal(pr.principles.tasks.shared.find(t => t.t.startsWith('E-Bike')).who, 'p-lina');
  const marco = pr.principles.tasks.personal.find(r => r.who === 'p-marco');
  assert.ok(marco.items.some(i => i.startsWith('E-Bike')), 'before state still lists the task under Marco');
});

test('absence: a task missing from a state is not shown there and not deleted', () => {
  const p = T();
  delete p.states.find(s => s.id === 'after').tasks['t-ersatz'];
  assert.ok(!PC.compile(p, 1).scene.tasks.some(t => /Akku/.test(t.title)));
  assert.ok(p.tasks.some(t => t.id === 't-ersatz'));
  assert.equal(PC.validate(p).ok, true);
});

test('teaching text compiles into the principle binding', () => {
  const p = T();
  Object.assign(p.slides[2].teaching, { recommendation: 'R neu', boundary: 'G neu' });
  const b = PC.compile(p, 2).principles.tasks;
  assert.equal(b.recommend, 'R neu');
  assert.equal(b.boundary, 'G neu');
  assert.deepEqual(PC.slidePlan(p, 2).meta, { id: 'tasks', title: p.slides[2].teaching.title, question: p.slides[2].teaching.question });
});

test('broken person reference is a located error; explicit replacement repairs it', () => {
  const p = T();
  p.scenes[0].posts[0].by = 'p-unbekannt';
  const v = PC.validate(p);
  assert.equal(v.ok, false);
  const d = v.errors.find(e => e.code === 'unknown-person');
  assert.equal(d.ref, 'p-unbekannt');
  assert.match(d.message, /Teams-Beitrag 1/);
  const fixed = PC.replacePersonRef(p, 'p-unbekannt', 'p-marco');
  assert.equal(PC.validate(fixed).ok, true);
  assert.equal(p.scenes[0].posts[0].by, 'p-unbekannt', 'repair returns a copy');
  assert.match(PC.repairPrompt(p, v.errors), /GANZE korrigierte Projekt[\s\S]*p-unbekannt/);
});

test('rejects unknown versions and profiles, truncated JSON, oversized and ambiguous input', () => {
  assert.equal(PC.validate({ ...T(), projectVersion: 2 }).errors[0].code, 'project-version');
  const q = T(); q.scenes[1].profile = 'excel';
  assert.ok(PC.validate(q).errors.some(e => e.code === 'unknown-profile'));
  const s = PC.serialise(T());
  assert.equal(PC.parseInput(s.slice(0, s.length - 40)).error.code, 'bad-json');
  assert.equal(PC.parseInput('Antwort:\n```json\n' + s.slice(0, 300)).error.code, 'bad-json');
  assert.equal(PC.parseInput('x'.repeat(PC.MAX_INPUT + 1)).error.code, 'too-large');
  assert.equal(PC.parseInput('a\n```json\n{}\n```\nb\n```json\n{}\n```').error.code, 'many-blocks');
  assert.equal(PC.parseInput('Hier ist es:\n```json\n' + s + '\n```\nViel Erfolg').project.meta.title, T().meta.title);
  assert.equal(PC.parseInput('kein json').error.code, 'no-json');
});

test('markup in text stays data: compile does not interpret it', () => {
  const p = T();
  p.scenes[0].posts[0].text = '<img src=x onerror=alert(1)><script>alert(2)</script>';
  assert.equal(PC.validate(p).ok, true);
  assert.equal(PC.compile(p, 0).scene.posts[0].text, p.scenes[0].posts[0].text);
});

test('authoring pack is built from the live capabilities and its example validates', () => {
  const pack = PC.authoringPack({ audience: 'Pflege', goal: 'Übergaben', context: 'Spital' });
  for (const k of Object.keys(PC.capabilities().profiles)) assert.match(pack, new RegExp(k));
  assert.match(pack, /projectVersion 1 · capabilityVersion 1/);
  assert.match(pack, /GENAU EIN vollständiges JSON-Projekt/);
  assert.match(pack, /Behaupte nicht, du hättest/);
  const parsed = PC.parseInput(pack);
  assert.equal(PC.validate(parsed.project).ok, true, 'the embedded example is a valid project');
});
