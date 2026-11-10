import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import PC from '../src/project-core.js';
import C from '../src/collaboration-core.js';
import R from '../src/research-catalogue.js';
const copy = x => structuredClone(x);
const has = (p, code) => assert.ok(PC.validate(p).errors.some(e => e.code === code), JSON.stringify(PC.validate(p)));

test('catalogue is traceable: four additions, twelve scenarios, six valid saved projects', () => {
  assert.equal(R.personas.length, 4); assert.equal(R.scenarios.length, 12);
  const sources = new Set(R.sources.map(s => s.id));
  for (const source of R.sources) {
    assert.match(source.url, /^https:\/\//); assert.equal(source.accessed, '2026-11-09');
    for (const k of ['publisher', 'kind', 'supportedClaim', 'limitations']) assert.ok(source[k]);
  }
  for (const g of R.personas) {
    assert.ok(g.sources.length >= 2);
    for (const k of ['purpose', 'roles', 'size', 'duration', 'rhythm', 'boundary', 'artefacts', 'friction', 'tools', 'question']) assert.ok(g[k]?.length);
  }
  const complete = R.scenarios.filter(s => s.status === 'renderable'); assert.equal(complete.length, 6);
  for (const s of R.scenarios) {
    assert.equal(s.synthesis, 'fictional-synthesis'); assert.ok(s.sources.every(id => sources.has(id)));
    assert.ok(s.evidence.length && s.steps.length && s.question && s.boundary);
    if (s.status !== 'renderable') assert.throws(() => R.project(s.id));
  }
  for (const s of complete) {
    const p = R.project(s.id); assert.deepEqual(PC.validate(p), {ok: true, errors: [], warnings: []});
    assert.deepEqual(JSON.parse(readFileSync(new URL(`../examples/${s.id}.project.json`, import.meta.url))), p);
    assert.deepEqual(PC.parseInput(PC.serialise(p)).project, p);
  }
});
test('capability six preserves earlier projects and rejects new profiles in old versions', () => {
  for (const v of [1,2,3,4,5,6]) { const p = PC.template(); p.capabilityVersion = v; assert.equal(PC.validate(p).ok, true); }
  const p = R.project('weekly-meeting'); p.capabilityVersion = 5; has(p, 'profile-version');
});
test('Loop surfaces project the same snapshot and stable row identity', () => {
  const p = R.project('shared-loop');
  assert.deepEqual(PC.compile(p, 0).collaboration.snapshot, PC.compile(p, 1).collaboration.snapshot);
  assert.deepEqual(PC.compile(p, 2).collaboration.snapshot, PC.compile(p, 3).collaboration.snapshot);
  assert.equal(PC.compile(p, 0).collaboration.component.id, PC.compile(p, 3).collaboration.component.id);
  const before = PC.compile(p, 0).collaboration.snapshot.rows[0], after = PC.compile(p, 3).collaboration.snapshot.rows[0];
  assert.equal(before.id, after.id); assert.notEqual(before.text, after.text);
  p.states[1].components['c-methoden'].rows[0].text = 'Eine neue Präzisierung';
  for (const i of [2,3]) assert.equal(PC.compile(p, i).collaboration.snapshot.rows[0].text, 'Eine neue Präzisierung');
});
test('meeting, Planner, To Do and review preserve task identity, owner, due date and completion', () => {
  const p = R.project('weekly-meeting');
  const meeting = PC.compile(p, 0).collaboration.tasks[0], planner = PC.compile(p, 1).scene.tasks[0], todo = PC.compile(p, 2).todo.assigned[0];
  for (const k of ['id','title','owner','due','done']) { assert.equal(meeting[k], planner[k]); assert.equal(meeting[k], todo[k]); }
  assert.equal(meeting.done, false);
  const review = PC.compile(p, 3).collaboration.tasks[0], reviewedPlan = PC.compile(p, 4).scene.tasks[0];
  assert.equal(review.id, meeting.id); assert.equal(review.done, true); assert.equal(reviewedPlan.done, true);
  const after = copy(p); after.scenes[2].state = 'after'; assert.equal(PC.compile(after, 2).todo.assigned[0].done, true);
});
test('broken component, snapshot, row author and task links have located diagnostics', () => {
  for (const [mutate, code] of [
    [p => p.scenes[0].component = 'missing', 'unknown-component'],
    [p => delete p.states[0].components['c-wochenrunde'], 'component-state'],
    [p => p.states[0].components['c-wochenrunde'].agenda[0].by = 'missing', 'unknown-person'],
    [p => p.states[0].components['c-wochenrunde'].taskIds[0] = 'missing', 'component-task-ref'],
    [p => p.states[0].tasks['t-1'].list = 'personal', 'component-task-ref'],
    [p => p.scenes[0].accessConfirmed = false, 'component-access'],
    [p => p.scenes[5].steps[1].evidence = 'invented-sync', 'workflow-evidence']
  ]) { const p = R.project('weekly-meeting'); mutate(p); has(p, code); assert.ok(PC.validate(p).errors.every(e => typeof e.path === 'string')); }
  const p = R.project('shared-loop'); p.states[0].components['c-methoden'].taskIds = ['t-1']; has(p, 'table-tasks');
  p.scenes[0].surface = 'unsupported'; has(p, 'component-surface');
});
test('shared components and all new scene fields tolerate malformed JSON without throwing', () => {
  const values = [null, false, 7, '', [], {}, {toString: null}, ['x'], '__proto__'];
  for (const profile of ['weekly-meeting', 'shared-loop']) {
    const baseline = R.project(profile);
    for (const key of ['profile','team','component','state','viewer','partner','surface','meeting','accessConfirmed']) for (const v of values) {
      const p = copy(baseline); p.scenes[0][key] = v; assert.doesNotThrow(() => PC.validate(p), key);
    }
    for (const v of values) { const p = copy(baseline); p.sharedComponents = v; assert.doesNotThrow(() => PC.validate(p)); }
    for (const key of ['id','owner','title','kind','storage']) for (const v of values) { const p = copy(baseline); p.sharedComponents[0][key] = v; assert.doesNotThrow(() => PC.validate(p), key); }
  }
  assert.equal(C.isProfile({toString:null}), false);
});
test('person replacement follows component authors and ownership without changing object IDs', () => {
  const p = PC.replacePersonRef(R.project('weekly-meeting'), 'p-1', 'p-2');
  assert.equal(PC.validate(p).ok, true); assert.equal(p.sharedComponents[0].owner, 'p-2');
  assert.equal(p.states[0].components['c-wochenrunde'].decisions[0].by, 'p-2');
  assert.equal(p.sharedComponents[0].id, 'c-wochenrunde');
});
test('publication follows a visible completed review, and onboarding retains a personal task', () => {
  const p = R.project('peer-resource'), profiles=p.slides.map(s=>p.scenes.find(sc=>sc.id===s.scene).profile);
  assert.ok(profiles.indexOf('todo')<profiles.indexOf('planner-task'));
  const detail=PC.compile(p,profiles.indexOf('planner-task')).taskDetail.task;
  const todo=PC.compile(p,profiles.indexOf('todo')).todo.assigned[0];
  assert.equal(todo.id,detail.id); assert.equal(todo.done,false); assert.equal(detail.done,true); assert.equal(detail.owner,'p-3');
  assert.ok(profiles.indexOf('planner-task')<profiles.indexOf('teams-posts'));
  const on=R.project('service-onboarding'), index=on.slides.findIndex(s=>on.scenes.find(sc=>sc.id===s.scene).profile==='todo');
  const personal=PC.compile(on,index).todo;
  assert.equal(personal.personal.length,1); assert.equal(personal.assigned.length,1);
  assert.ok(!PC.planTasks(on,'after').some(t=>t.id===personal.personal[0].id));
});
test('synchronisation cannot be attached to an unrelated tool transition', () => {
  const p=R.project('weekly-meeting');
  p.scenes.find(s=>s.profile==='workflow').steps[2].tool='SharePoint';
  has(p,'workflow-sync-pair');
});
