// Adapter, configurator and shared-name tests.  Run: node --test tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const ctx = { window: {} };
ctx.globalThis = ctx;
vm.createContext(ctx);
for (const f of ['worlds.js', 'src/library.js', 'src/library-he.js', 'src/model.js', 'src/configurator.js']) vm.runInContext(readFileSync(new URL('../' + f, import.meta.url), 'utf8'), ctx);
// model.js / configurator.js attach to window
const { Model, Configurator, LIB, HE_WORLDS } = ctx.window;

test('every legacy scenario is reachable through a library situation', () => {
  const linked = new Set(LIB.situations.map(s => s.world + '/' + s.scenario));
  for (const w of HE_WORLDS.worlds) for (const s of w.scenarios) assert.ok(linked.has(w.id + '/' + s.id), `${w.id}/${s.id} not reachable`);
  assert.equal(HE_WORLDS.worlds.reduce((n, w) => n + w.scenarios.length, 0), 7);
});

test('six worlds: five university, one business', () => {
  const ws = Model.worlds();
  assert.equal(ws.length, 6);
  assert.equal(ws.filter(w => w.collection === 'hochschule').length, 5);
  assert.equal(ws.filter(w => w.collection === 'business').length, 1);
});

test('all situation references resolve (people, use cases, principles)', () => {
  const ucs = new Set(LIB.usecases.map(u => u.id));
  for (const s of LIB.situations) {
    const v = Model.build(s.id);
    assert.ok(v, s.id);
    const ids = new Set(v.people.map(p => p.id));
    for (const u of s.usecases) assert.ok(ucs.has(u), `${s.id}: usecase ${u}`);
    for (const pid of ['chat', 'doc', 'tasks']) {
      const b = v.principles[pid];
      assert.ok(b && b.recommend, `${s.id}: principle ${pid} recommendation`);
      for (const ref of [...(b.inChat || []), ...(b.later || []), ...(b.editors || []), ...(b.personal || []).map(x => x.who), ...(b.shared || []).filter(x => !x.whoLabel).map(x => x.who)])
        assert.ok(ids.has(ref), `${s.id}.${pid}: unknown person ${ref}`);
      assert.doesNotMatch(v.fill(b.problem + b.recommend + b.boundary), /\{p:|\{s\}|\{c\}/, `${s.id}.${pid}: unresolved token`);
    }
    const d = v.principles.doc;
    if (d.origin) assert.ok(ids.has(d.origin), `${s.id}: doc origin ${d.origin}`);
    for (const c of d.copies) if (typeof c === 'object') assert.ok(ids.has(c.by) || c.by === d.editorsLabel, `${s.id}: copy holder ${c.by}`);
    for (const x of v.variants) assert.doesNotMatch(v.fill(x.assumption || ''), /\{p:/, `${s.id}: assumption token`);
    for (const x of v.variants) assert.doesNotMatch(v.fill(x.why), /\{p:|\{s\}|\{c\}/, `${s.id}: variant ${x.id} token`);
    for (const x of [...v.scene.files.map(f => f.note), ...Object.values(v.scene.notes)]) assert.doesNotMatch(v.fill(x), /\{p:/, `${s.id}: scene token`);
    for (const q of v.scene.posts) { assert.ok(ids.has(q.by), `${s.id}: post author ${q.by}`); for (const r of q.replies || []) assert.ok(ids.has(r.by)); }
    for (const t of v.scene.tasks) assert.ok(ids.has(t.owner), `${s.id}: task owner ${t.owner}`);
    for (const m of v.scene.members) assert.ok(ids.has(m), `${s.id}: member ${m}`);
  }
});

test('custom names flow into scene and principle text; originals stay intact', () => {
  const v = Model.build('leadership-forum', { names: { team: 'Forum X', people: { 'regula-aebi': 'Rita Muster' } } });
  assert.equal(v.team, 'Forum X');
  assert.equal(v.person('regula-aebi').name, 'Rita Muster');
  assert.match(v.fill(v.principles.chat.problem), /Rita Muster/);
  assert.match(v.fill(v.scene.posts[0].text), /Rita Muster/);
  const orig = Model.build('leadership-forum');
  assert.equal(orig.person('regula-aebi').name, 'Regula Aebi');
  assert.equal(HE_WORLDS.worlds[0].people.find(p => p.id === 'regula-aebi').name, 'Regula Aebi');
});

test('every situation is complete and documented contradictions are explicit variants', () => {
  for (const s of LIB.situations) assert.ok(s.complete, `${s.id} not complete`);
  const ids = v => Model.build(v).variants.map(x => x.id).join();
  assert.equal(ids('sitzungszyklus'), 'gastzugang,link');
  assert.equal(ids('semesterstart'), 'ohne-bewertung,mit-bewertung');
  assert.ok(Model.build('sitzungszyklus', { variant: 'gastzugang' }).scene.members.includes('beat-kunz'));
  assert.ok(!Model.build('sitzungszyklus', { variant: 'link' }).scene.members.includes('beat-kunz'));
  assert.match(Model.build('sitzungszyklus').variants[0].assumption, /prüft die IT/);
  const nora = ['nora-publikation', 'nora-abwesenheit', 'nora-reihe'].map(id => Model.build(id));
  for (const v of nora) assert.ok(v.scene.personal && v.scene.channels.length === 0, 'Nora stays without a Team');
  assert.equal(new Set(nora.map(v => v.scene.files.map(f => f.name).join())).size, 3, 'each Nora scenario has its own scene');
  assert.equal(new Set(nora.map(v => v.principles.chat.recommend)).size, 3, 'each Nora scenario has its own principle binding');
});

test('variants change structure, not just labels', () => {
  const a = Model.build('kundenportal', { variant: 'eigenes-team' }), b = Model.build('kundenportal', { variant: 'kanal' });
  assert.notEqual(a.team, b.team);
  assert.notDeepEqual(a.scene.channels, b.scene.channels);
  assert.notEqual(a.scene.members.length, b.scene.members.length);
});

test('configurator is deterministic and different answers give different starting points', () => {
  const project = { context: 'business', goal: 'projekt', size: '5-8', units: 'mehrere', rhythm: 'befristet', external: 'punktuell', share: 'gemeinsam', access: 'einzelne', friction: 'entscheide' };
  const solo = { context: 'hochschule', goal: 'eigen', size: '1', units: 'eine', rhythm: 'laufend', external: 'punktuell', share: 'persoenlich', access: 'keine', friction: 'fassungen' };
  const board = { context: 'hochschule', goal: 'gremium', size: '5-8', units: 'eine', rhythm: 'wiederkehrend', external: 'keine', share: 'gemischt', access: 'keine', friction: 'pendenzen' };
  const r1 = Configurator.suggest(project), r1b = Configurator.suggest(project);
  assert.deepEqual(r1.best, r1b.best);
  assert.equal(r1.best.situation, 'kundenportal'); assert.equal(r1.best.variant, 'eigenes-team');
  assert.equal(Configurator.suggest(solo).best.situation, 'nora-publikation');
  assert.equal(Configurator.suggest(board).best.situation, 'sitzungszyklus');
  assert.equal(Configurator.suggest({ ...project, context: 'hochschule' }).best.situation, 'leadership-forum');
  assert.equal(Configurator.suggest({ ...project, units: 'eine', rhythm: 'laufend', external: 'keine' }).best.id, 'projektkanal');
  for (const r of [r1, Configurator.suggest(solo), Configurator.suggest(board)]) {
    assert.ok(r.best.reasons.length > 0, 'has rationale');
    assert.ok(r.alt && (r.alt.situation !== r.best.situation || r.alt.variant !== r.best.variant), 'alternative differs');
  }
  assert.ok(Configurator.suggest({ ...project, access: 'sensibel' }).cautions.some(c => /Annahme/.test(c)), 'sensitive data surfaces an assumption');
});

test('configurator flags examples borrowed from the other collection', () => {
  const base = { context: 'business', goal: 'kurs', friction: 'wissen', size: '2-4', units: 'eine', rhythm: 'wiederkehrend', external: 'keine', share: 'gemischt', access: 'keine' };
  const r = Configurator.suggest(base);
  assert.equal(r.best.situation, 'semesterstart');
  assert.equal(r.best.transfer && r.best.transfer.fromLabel, 'Hochschule');
  assert.equal(Configurator.suggest({ ...base, context: 'hochschule' }).best.transfer, null);
  assert.equal(Configurator.suggest({ ...base, goal: 'projekt', units: 'mehrere', rhythm: 'befristet' }).best.transfer, null, 'business project stays in business');
});

test('setups with access or restriction assumptions carry them explicitly', () => {
  for (const [sid, vid] of [['sitzungszyklus', 'gastzugang'], ['sitzungszyklus', 'link'], ['semesterstart', 'mit-bewertung'], ['kundenportal', 'eigenes-team']])
    assert.ok(Model.build(sid, { variant: vid }).variant.assumption, `${sid}/${vid} needs an assumption`);
});
