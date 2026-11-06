import test from 'node:test';
import assert from 'node:assert/strict';
import PC from '../src/project-core.js';

test('workspace example validates and compiles map and scene from the same hierarchy', () => {
  const p = PC.workspaceExample();
  assert.deepEqual(PC.validate(p), {ok: true, errors: [], warnings: []});
  assert.deepEqual(p.slides.map((_, i) => PC.slidePlan(p, i).params.mode), ['prinzip', 'szene']);
  const node = id => p.workspace.nodes.find(n => n.id === id);
  node('forum').name = 'Forum und Veranstaltungen';
  node('event-plan').name = 'Plan_Termin_3.xlsx';
  node('event-plan').parent = 'forum-material';
  const [map, scene] = [0, 1].map(i => PC.compile(p, i));
  assert.equal(map.workspace.active.name, 'Forum und Veranstaltungen');
  assert.equal(scene.scene.posts[1].file, 'Plan_Termin_3.xlsx');
  assert.equal(scene.scene.posts[1].filePath, 'Forum und Veranstaltungen › Unterlagen');
  p.scenes.forEach(s => { s.selected = 'event-plan'; });
  p.scenes[1].tab = 'files';
  assert.equal(PC.validate(p).ok, true);
  assert.deepEqual(PC.compile(p, 1).scene.folderPath, ['Unterlagen']);
  assert.equal(PC.compile(p, 0).workspace.selected.id, 'event-plan');
});

test('invalid workspace links, scope, shape, depth and old capability are refused', () => {
  const cases = [
    [p => { p.workspace.nodes[0].members = null; }, /members/],
    [p => { p.workspace.nodes[0].kind = Object.create(null); }, /parent/],
    [p => { p.workspace.nodes.find(n => n.id === 'forum-material').parent = 'forum-material'; }, /parent/],
    [p => { p.workspace.nodes.push({...p.workspace.nodes[0]}); }, /nodes/],
    [p => { p.scenes[1].selected = 'heat-paper'; }, /selected/],
    [p => { p.scenes[1].viewer = 'nora'; }, /root/],
    [p => { p.scenes[0] = {...p.scenes[0], root: 'nora-work', selected: 'nora-drive', viewer: 'coauthor'}; }, /root/],
    [p => { p.workspace.nodes.find(n => n.id === 'forum').posts[1].file = 'nora-paper'; }, /posts.*file/],
    [p => { p.capabilityVersion = 3; }, /capabilityVersion/]
  ];
  for (const [change, path] of cases) {
    const p = PC.workspaceExample();
    change(p);
    const result = PC.validate(p);
    assert.equal(result.ok, false);
    assert.ok(result.errors.some(e => path.test(e.path)), JSON.stringify(result.errors));
  }
});

test('personal preview only compiles the selected owner’s workspace and explicit sharing', () => {
  const p = PC.workspaceExample();
  p.scenes.forEach(s => Object.assign(s, {root: 'nora-work', selected: 'nora-paper', viewer: 'nora', tab: 'files'}));
  assert.equal(PC.validate(JSON.parse(PC.serialise(p))).ok, true);
  const vm = PC.compile(p, 1);
  assert.deepEqual(vm.tools, ['onedrive']);
  assert.deepEqual(vm.scene.files.map(f => [f.name, f.note]), [
    ['Artikel_Grenzen.docx', 'Bearbeitungszugriff für Leonie Steiner'], ['Forschungsnotizen', 'Privat']
  ]);
  assert.deepEqual(vm.scene.channels, []);
});

test('house overview projects membership while the comparison resolves the same file and channel IDs', () => {
  const p = PC.workspaceExample('workspace-houses');
  assert.deepEqual(PC.validate(p), {ok: true, errors: [], warnings: []});
  const [overview, detail] = p.slides.map((_, i) => PC.compile(p, i));
  assert.deepEqual(overview.workspace.houses.map(h => h.team.id), ['campus', 'onboarding', 'partners']);
  const pilot = overview.workspace.houses[1].channels.find(c => c.id === 'pilot');
  assert.equal(detail.workspace.active, pilot);
  assert.equal(detail.scene.channelIds[detail.scene.activeIndex], pilot.id);
  assert.ok(detail.scene.files.some(f => f.id === 'pilot-checklist' && f.canonical));
  p.scenes[1].selected = 'pilot-feedback';
  assert.deepEqual(PC.compile(p, 1).scene.folderPath, ['Unterlagen', 'Rückmeldungen']);
});

test('house profiles reject old capabilities, invisible teams, empty membership and cross-team selection', () => {
  const cases = [
    [p => { p.capabilityVersion = 4; }, 'scenes[0].profile'],
    [p => { p.scenes[0].viewer = 'nora'; }, 'scenes[0].viewer'],
    [p => { p.scenes[0].root = 'onboarding'; }, 'scenes[0]'],
    [p => { p.scenes[1].viewer = 'nora'; }, 'scenes[1].root'],
    [p => { p.scenes[1].selected = 'heat-paper'; }, 'scenes[1].selected'],
    [p => { p.scenes[1].tab = 'posts'; }, 'scenes[1].tab']
  ];
  for (const [edit, path] of cases) {
    const p = PC.workspaceExample('workspace-houses');
    edit(p);
    assert.ok(PC.validate(p).errors.some(d => d.path === path), path);
  }
});
