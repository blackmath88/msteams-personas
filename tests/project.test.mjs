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
  assert.deepEqual(Object.keys(PC.capabilities().profiles), ['teams-posts', 'teams-chat', 'planner', 'prinzip-tasks']);
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
  assert.match(pack, /projectVersion 1 · capabilityVersion 2/);
  assert.match(pack, /GENAU EIN vollständiges JSON-Projekt/);
  assert.match(pack, /Behaupte nicht, du hättest/);
  const parsed = PC.parseInput(pack);
  assert.equal(PC.validate(parsed.project).ok, true, 'the embedded example is a valid project');
});

/* ---------- regressions for the blockers found at the authoring baseline ---------- */
test('null and non-object entries are located errors, never a crash', () => {
  const cases = [
    p => { p.people = [null]; }, p => { p.people.push('Anna'); }, p => { p.scenes[0].posts = [null, 3]; },
    p => { p.scenes.push(null); }, p => { p.slides = [null]; }, p => { p.states[0].tasks['t-kunde'] = null; },
    p => { p.meta = null; }, p => { p.slides[2].teaching = null; }, p => { p.people = 'x'; }, p => { p.states = {}; }
  ];
  for (const f of cases) {
    const p = T(); f(p);
    const v = PC.validate(p);
    assert.equal(v.ok, false);
    assert.ok(v.errors.every(e => typeof e.path === 'string' && e.message), JSON.stringify(v.errors));
    assert.doesNotThrow(() => PC.summary(p));
  }
  for (const x of [null, 1, 'x', [], [null], { meta: 5 }]) { assert.equal(PC.validate(x).ok, false); assert.doesNotThrow(() => PC.summary(x)); }
});

test('incorrectly typed metadata and fields are rejected', () => {
  const p = T();
  Object.assign(p.meta, { organisation: 42, assumptions: 'eine', fictional: 'ja', source: 'chat' });
  p.people[0].role = 7; p.scenes[0].posts[0].time = 1352; p.slides[0].presenterNotes = ['a'];
  p.states[1].tasks['t-bremsen'].due = 14; p.slides[2].teaching.question = {};
  const paths = PC.validate(p).errors.filter(e => e.code === 'type').map(e => e.path).sort();
  assert.deepEqual(paths, ['meta.assumptions', 'meta.fictional', 'meta.organisation', 'meta.source', 'people[0].role', 'scenes[0].posts[0].time', 'slides[0].presenterNotes', 'slides[2].teaching.question', 'states[1].tasks.t-bremsen.due'].sort());
  const q = T(); q.meta.title = 5;
  assert.ok(PC.validate(q).errors.some(e => e.path === 'meta.title' && e.code === 'type'));
});

test('only the before/after states the editor supports are accepted', () => {
  const p = T();
  p.states[1].id = 'spaeter'; p.scenes[1].state = 'spaeter'; p.scenes[2].after = 'spaeter';
  const codes = PC.validate(p).errors.map(e => e.code);
  assert.ok(codes.includes('state-ids') && codes.includes('prinzip-states'), codes.join());
  const q = T(); q.states.push({ id: 'zwischen', tasks: {} });
  assert.ok(PC.validate(q).errors.some(e => e.code === 'too-many-states' || e.code === 'state-ids'));
  const r = T(); r.scenes[2].before = 'after'; r.scenes[2].after = 'before';
  assert.ok(PC.validate(r).errors.some(e => e.code === 'prinzip-states'));
  assert.deepEqual(PC.STATE_IDS, ['before', 'after']);
});

test('a task already in the shared plan before is shown as shared, not as a personal list item', () => {
  const p = T();
  p.states[0].tasks['t-kunde'] = { owner: 'p-jonas', list: 'plan', bucket: 'Heute', due: 'Mi 13.11.' };
  const b = PC.compile(p, 2).principles.tasks;
  assert.ok(!b.personal.some(r => r.items.includes('Kundin Rossi zurückrufen')), 'not in anyone\'s personal list');
  assert.deepEqual(b.beforeShared.map(t => [t.t, t.who]), [['Kundin Rossi zurückrufen', 'p-jonas']]);
  assert.equal(b.exactBefore, true);
});

test('more personal lists than the diagram holds is reported, not dropped silently', () => {
  const p = T();
  p.people.push({ id: 'p-eva', name: 'Eva Roth', role: '' });
  p.states[0].tasks['t-lager'] = { owner: 'p-eva', list: 'personal' };
  p.states[0].tasks['t-ersatz'] = { owner: 'p-aylin', list: 'personal' }; // Marco, Jonas, Aylin, Eva
  assert.ok(PC.validate(p).warnings.some(w => w.code === 'prinzip-lists'));
});
