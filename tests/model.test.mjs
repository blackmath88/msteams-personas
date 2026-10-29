// Adapter, configurator and shared-name tests.  Run: node --test tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const ctx = { window: {} };
ctx.globalThis = ctx;
vm.createContext(ctx);
for (const f of ['worlds.js', 'src/library.js', 'src/library-he.js', 'src/story.js', 'src/scenes-v3.js', 'src/model.js', 'src/configurator.js']) vm.runInContext(readFileSync(new URL('../' + f, import.meta.url), 'utf8'), ctx);
// model.js / configurator.js attach to window
const { Model, Configurator, LIB, HE_WORLDS } = ctx.window;

test('every legacy scenario is reachable through a library situation', () => {
  const linked = new Set(LIB.situations.map(s => s.world + '/' + s.scenario));
  for (const w of HE_WORLDS.worlds) for (const s of w.scenarios) assert.ok(linked.has(w.id + '/' + s.id), `${w.id}/${s.id} not reachable`);
  assert.equal(HE_WORLDS.worlds.reduce((n, w) => n + w.scenarios.length, 0), 7);
});

test('seven worlds: five university, two business', () => {
  const ws = Model.worlds();
  assert.equal(ws.length, 7);
  assert.equal(ws.filter(w => w.collection === 'hochschule').length, 5);
  assert.equal(ws.filter(w => w.collection === 'business').length, 2);
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

test('story: copies come from Prinzip copies, canonical file is a scene file', () => {
  for (const sid of ['leadership-forum', 'kundenportal']) {
    for (const variant of ['eigenes-team', 'kanal']) {
      const v = Model.build(sid, { variant });
      assert.ok(v.story, sid);
      assert.deepEqual(v.story.copies.map(c => c.name), v.principles.doc.copies.map(c => typeof c === 'string' ? c : c.n));
      assert.ok(v.scene.files.some(f => f.canonical && f.name === v.story.doc.name), `${sid}: canonical in files`);
      assert.ok(v.scene.posts.some(q => q.canonical && q.file === v.story.doc.name), `${sid}: canonical in post`);
      assert.ok(v.story.mails.every(m => !m.attachment || v.story.copies.some(c => c === m.attachment)), `${sid}: mail attachments are copies`);
      assert.ok(!v.story.copies.some(c => c.name === v.story.doc.name), `${sid}: copies distinct from canonical`);
      assert.ok(v.people.some(p => p.id === v.story.viewer));
      for (const t of ['teams', 'chat', 'planner', 'todo', 'outlook', 'explorer', 'sharepoint']) assert.ok(v.tools.includes(t), `${sid}: ${t}`);
    }
  }
});

test('story: content overrides rename the canonical file everywhere but leave originals intact', () => {
  const orig = JSON.stringify(LIB.situations.find(s => s.id === 'leadership-forum'));
  const v = Model.build('leadership-forum', { content: { docName: 'Plan.xlsx', subject: 'Neu', postTitle: 'T' } });
  assert.equal(v.story.doc.name, 'Plan.xlsx');
  assert.equal(v.principles.doc.artefact, 'Plan');
  assert.ok(v.scene.files.some(f => f.name === 'Plan.xlsx'));
  assert.equal(v.scene.posts.find(q => q.canonical).title, 'T');
  assert.equal(v.story.mails[0].subject, 'Neu');
  assert.equal(JSON.stringify(LIB.situations.find(s => s.id === 'leadership-forum')), orig);
  assert.equal(Model.build('leadership-forum').story.doc.name, 'Veranstaltungsplan.xlsx');
});

test('situations without a story only offer Teams (or nothing for personal work)', () => {
  assert.equal(Model.build('heat-health').story, null);
  assert.ok(!Model.build('heat-health').tools.includes('outlook'));
  assert.ok(Model.build('heat-health').tools.includes('teams'));
  assert.deepEqual([...Model.build('nora-reihe').tools], ['onedrive', 'todo']);
});

test('sequences: every step resolves to an available screen or a principle', () => {
  assert.ok(LIB.sequences.length >= 6);
  for (const q of LIB.sequences) {
    assert.ok(q.objective && q.boundary, q.id);
    assert.ok(q.steps.length >= 3 && q.steps.length <= 5, q.id);
    const v = Model.build(q.situation, { variant: q.variant });
    assert.ok(v, q.id);
    for (const st of q.steps) {
      if (st.mode === 'prinzip') { assert.ok(v.principles[st.sub], `${q.id}: principle ${st.sub}`); continue; }
      const tool = ['posts', 'files', 'tasks'].includes(st.sub) ? 'teams' : st.sub;
      assert.ok(v.tools.includes(tool), `${q.id}: ${st.sub} not available`);
    }
  }
});

test('chat: curated decision matches the principle; generated chats exist for team situations', () => {
  for (const sid of ['leadership-forum', 'kundenportal', 'onboarding']) {
    const v = Model.build(sid);
    const dec = v.chat.messages.find(m => m.decision);
    assert.ok(dec && dec.mark === 1, sid);
    assert.ok([v.chat.viewer, v.chat.partner].every(id => v.people.some(p => p.id === id)), sid);
  }
  const g = Model.build('sitzungszyklus');
  assert.ok(g.chat && g.chat.generated && g.chat.messages.some(m => m.decision && m.text.includes(g.principles.chat.decision)));
});

test('task edits keep one identity across Teams tasks, Planner/To Do and Prinzip', () => {
  const v = Model.build('leadership-forum', { content: { tasks: { 0: 'Einladung an alle versenden' } } });
  assert.equal(v.scene.tasks[0].title, 'Einladung an alle versenden');
  assert.ok(v.principles.tasks.shared.some(x => x.t === 'Einladung an alle versenden'));
  assert.ok(v.todo.assigned.some(t => t.title === 'Einladung an alle versenden'), 'Daniel sees the renamed task');
  assert.equal(Model.build('leadership-forum').scene.tasks[0].title, 'Einladung Termin 3 versenden');
});

test('AI simulation: rejected suggestions never become tasks; assumption names licensing', () => {
  const v = Model.build('kundenportal');
  assert.ok(v.ai.suggestions.some(s => s.status === 'rejected'));
  assert.match(v.ai.assumption, /Teams Premium/);
  assert.match(v.ai.assumption, /Copilot/);
  assert.ok(!/\{p:/.test(v.ai.suggestions.map(s => s.reason).join('')));
});

test('onboarding world is its own business context, not renamed university people', () => {
  const v = Model.build('onboarding');
  assert.equal(v.collection, 'business');
  const he = new Set(HE_WORLDS.worlds.flatMap(w => w.people.map(p => p.name)));
  assert.ok(v.people.every(p => !he.has(p.name)));
  assert.equal(v.todo.viewer, 'nadine-odermatt');
});
