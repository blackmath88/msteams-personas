import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const PC = createRequire(import.meta.url)('../src/project-core.js');
function project() {
  const p = PC.template();
  p.scenes[0] = { id: 'sc-kanal', profile: 'teams-chat', team: 'Werkstatt', viewer: 'p-marco', partner: 'p-aylin', notSeenBy: ['p-jonas'], messages: [
    { id: 'm1', by: 'p-marco', time: '13:52', text: 'Übernimmst du?', hint: 'Auftrag nur im Chat.' },
    { id: 'm2', by: 'p-aylin', text: 'Ja.', hint: 'Jonas sieht den Entscheid nicht.', decision: true },
    { id: 'm3', by: 'p-marco', text: 'Danke.' }
  ] };
  return p;
}
const error = (p, code, path) => assert.ok(PC.validate(p).errors.some(e => e.code === code && e.path === path), JSON.stringify(PC.validate(p)));
test('valid teams-chat, catalogue and default three-slide sequence', () => {
  assert.deepEqual(PC.validate(project()), { ok: true, errors: [], warnings: [] });
  assert.equal(PC.template().slides.length, 3);
  assert.equal(PC.capabilities().capabilityVersion, 2);
  assert.deepEqual(PC.capabilities().profiles['teams-chat'].budgets, { team: 40, messageText: 220, messages: 6 });
  assert.match(PC.authoringPack(), /optionale zusätzliche Folie/);
  assert.match(PC.authoringPack(), /"profile":"teams-chat"/);
  assert.match(PC.summary(project()).slides[0], /Teams: Chat zu zweit/);
});
test('v1 remains accepted but teams-chat needs capabilityVersion 2 at scene profile', () => {
  const old = PC.template(); old.capabilityVersion = 1;
  assert.equal(PC.validate(old).ok, true);
  const p = project(); p.capabilityVersion = 1;
  error(p, 'profile-version', 'scenes[0].profile');
});
test('chat rejects a known author outside the two participants', () => {
  const p = project(); p.scenes[0].messages[0].by = 'p-lina';
  error(p, 'chat-author', 'scenes[0].messages[0].by');
});
test('viewer and partner must differ', () => {
  const p = project(); p.scenes[0].partner = p.scenes[0].viewer;
  error(p, 'chat-participants', 'scenes[0].partner');
});
test('all chat person references are located and repairable', () => {
  for (const field of ['viewer', 'partner']) {
    const p = project(); p.scenes[0][field] = 'p-missing';
    error(p, 'unknown-person', 'scenes[0].' + field);
    assert.ok(PC.validate(PC.replacePersonRef(p, 'p-missing', field === 'viewer' ? 'p-marco' : 'p-aylin')).ok);
  }
  const p = project(); p.scenes[0].notSeenBy = ['p-missing']; p.scenes[0].messages[0].by = 'p-missing';
  error(p, 'unknown-person', 'scenes[0].notSeenBy[0]');
  error(p, 'unknown-person', 'scenes[0].messages[0].by');
  const q = PC.replacePersonRef(p, 'p-missing', 'p-marco');
  assert.deepEqual(q.scenes[0].notSeenBy, ['p-marco']);
  assert.ok(PC.validate(q).ok);
});
test('chat rejects prototype names as unknown people', () => {
  for (const id of ['constructor', '__proto__', 'toString']) {
    const p = project(); p.scenes[0].viewer = id; p.scenes[0].partner = id;
    p.scenes[0].messages[0].by = id; p.scenes[0].notSeenBy = [id];
    for (const field of ['viewer', 'partner', 'messages[0].by', 'notSeenBy[0]']) error(p, 'unknown-person', 'scenes[0].' + field);
  }
});
test('chat budgets warn for long team and text, reject more than six messages', () => {
  const p = project(), sc = p.scenes[0]; sc.team = 'x'.repeat(41); sc.messages[0].text = 'x'.repeat(221);
  assert.deepEqual(PC.validate(p).warnings.map(w => [w.code, w.path]), [['long', 'scenes[0].team'], ['long', 'scenes[0].messages[0].text']]);
  while (sc.messages.length < 7) sc.messages.push({ id: 'm' + sc.messages.length, by: sc.viewer, text: 'OK' });
  error(p, 'too-many-messages', 'scenes[0].messages');
});
test('chat requires messages and nonempty text', () => {
  for (const value of [undefined, null, []]) {
    const p = project(); p.scenes[0].messages = value;
    error(p, 'scene-messages', 'scenes[0].messages');
  }
  for (const value of [undefined, null, '', '  ']) {
    const p = project(); p.scenes[0].messages[0].text = value;
    error(p, 'message-text', 'scenes[0].messages[0].text');
  }
});
test('chat fields handle every JSON type without throwing', () => {
  const values = [null, true, false, 0, 7, '', 'text', [], {}, [null], { toString: 3 }];
  for (const value of values) {
    for (const field of ['id', 'profile', 'viewer', 'partner', 'team', 'notSeenBy', 'messages']) {
      const p = project(); p.scenes[0][field] = value;
      assert.doesNotThrow(() => PC.validate(p)); assert.doesNotThrow(() => PC.summary(p));
    }
    for (const field of ['id', 'by', 'time', 'text', 'hint', 'decision']) {
      const p = project(); p.scenes[0].messages[0][field] = value;
      assert.doesNotThrow(() => PC.validate(p)); assert.doesNotThrow(() => PC.summary(p));
    }
    const p = project(); p.scenes[0].messages = [value];
    assert.doesNotThrow(() => PC.validate(p));
    p.scenes[0].notSeenBy = [value]; assert.doesNotThrow(() => PC.validate(p));
  }
  const p = project(); Object.assign(p.scenes[0], { viewer: 42, partner: [], notSeenBy: 'p-lina', messages: {} });
  for (const f of ['viewer', 'partner', 'notSeenBy', 'messages']) error(p, 'type', 'scenes[0].' + f);
  const q = project(); Object.assign(q.scenes[0].messages[0], { id: 1, by: {}, text: false, time: 12, hint: [], decision: 'yes' });
  for (const f of ['id', 'by', 'text', 'time', 'hint', 'decision']) error(q, 'type', 'scenes[0].messages[0].' + f);
});
test('compile produces renderer chat with hint marks, notes, unseen people and stable filename', () => {
  const p = project(), vm = PC.compile(p, 0);
  assert.deepEqual(vm.chat, { viewer: 'p-marco', partner: 'p-aylin', generated: false, others: [], later: ['p-jonas'], laterLabel: null, messages: [
    { by: 'p-marco', time: '13:52', text: 'Übernimmst du?', mark: 1, decision: false },
    { by: 'p-aylin', time: '', text: 'Ja.', mark: 2, decision: true },
    { by: 'p-marco', time: '', text: 'Danke.', mark: null, decision: false }
  ] });
  assert.deepEqual(vm.scene.notes, { 1: 'Auftrag nur im Chat.', 2: 'Jonas sieht den Entscheid nicht.' });
  assert.ok(vm.tools.includes('chat'));
  assert.deepEqual(PC.slidePlan(p, 0), { params: { mode: 'szene', sub: 'chat', annot: true }, kind: 'folie', meta: null });
  assert.equal(PC.fileName(p, 0), '01-velotech-werkstatt-uebergabe-teams-chat.png');
  delete p.scenes[0].notSeenBy; assert.deepEqual(PC.compile(p, 0).chat.later, []);
});
test('project notes use hints, default only for unseen people; curated notes stay unchanged', () => {
  const registered = {};
  runInNewContext(readFileSync(new URL('../src/m365-more.js', import.meta.url), 'utf8'), { window: { M365: { register: (id, render, notes) => { registered[id] = notes; } }, Views: { short: x => x } } });
  const p = project();
  const notes = vm => JSON.parse(JSON.stringify(registered.chat(vm)));
  assert.deepEqual(notes(PC.compile(p, 0)), [[1, 'Auftrag nur im Chat.'], [2, 'Jonas sieht den Entscheid nicht.']]);
  p.scenes[0].messages.forEach(m => delete m.hint);
  assert.match(notes(PC.compile(p, 0))[0][1], /Jonas sehen ihn hier nicht/);
  delete p.scenes[0].notSeenBy;
  assert.deepEqual(notes(PC.compile(p, 0)), []);
  const vm = PC.compile(project(), 0); vm.project = false;
  assert.deepEqual(notes(vm), [[1, 'Der Entscheid fällt zu zweit im Chat. Jonas sehen ihn hier nicht.']]);
});
