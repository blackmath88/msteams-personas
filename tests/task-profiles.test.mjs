import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const PC = createRequire(import.meta.url)('../src/project-core.js');
const fixture = () => JSON.parse(readFileSync(new URL('../examples/leadership-forum-six.project.json', import.meta.url), 'utf8'));
function error(p, code, path) {
  const v = PC.validate(p);
  assert.ok(v.errors.some(e => e.code === code && e.path === path), JSON.stringify(v));
}
test('six-profile Leadership Forum validates without warnings; v1/v2 remain accepted', () => {
  assert.deepEqual(PC.validate(fixture()), {ok:true, errors:[], warnings:[]});
  for (const version of [1,2]) {
    const p = PC.template(); p.capabilityVersion = version;
    assert.ok(PC.validate(p).ok);
  }
  for (const version of [1,2]) {
    const p = fixture(); p.capabilityVersion = version;
    error(p, 'profile-version', 'scenes[3].profile');
    error(p, 'profile-version', 'scenes[4].profile');
  }
});
test('board, details and assigned To Do preserve id, title, owner, date, checklist and completion', () => {
  const p = fixture();
  p.tasks.find(t => t.id === 't-einladung').title = 'Einladung geändert';
  p.states[1].tasks['t-einladung'].progress = 'completed';
  const board = PC.compile(p,2).scene.tasks.find(t=>t.id==='t-einladung');
  const detail = PC.compile(p,3).taskDetail.task;
  const assigned = PC.compile(p,4).todo.assigned[0];
  for (const t of [detail,assigned]) assert.deepEqual(t,board);
  assert.equal(detail.title,'Einladung geändert'); assert.equal(detail.done,true);
  assert.equal(PC.compile(p,4).todo.personal[0].id,'t-notizen');
  assert.equal(PC.compile(p,4).todo.personal[0].list,'personal');
  assert.equal(PC.slidePlan(p,3).params.sub,'plantask');
  assert.equal(PC.slidePlan(p,4).params.sub,'todo');
});
test('To Do never leaks other owners or inherits missing snapshot tasks', () => {
  const p=fixture(); p.scenes[4].taskIds.push('t-raum');
  error(p,'todo-task-owner','scenes[4].taskIds[2]');
  const q=fixture(); delete q.states[1].tasks['t-einladung'];
  error(q,'todo-task-state','scenes[4].taskIds[1]');
  error(q,'detail-task-state','scenes[3].task');
});
test('personal-only To Do works without connection; shared tasks require explicit assumptions', () => {
  const p=fixture(); p.scenes[4].taskIds=['t-notizen']; p.scenes[4].plannerConnected=false;
  assert.ok(PC.validate(p).ok);
  assert.equal(PC.compile(p,4).todo.assigned.length,0);
  for (const key of ['personalListPrivate','myDaySelected','plannerConnected']) {
    const q=fixture(); delete q.scenes[4][key];
    error(q,key==='plannerConnected'?'todo-connection':'todo-assumption','scenes[4].'+key);
  }
});
test('details reject personal, unassigned and unknown tasks; comments repair person references', () => {
  const p=fixture(); p.scenes[3].task='t-notizen';
  error(p,'detail-task-state','scenes[3].task');
  p.scenes[3].task='t-missing'; error(p,'unknown-task','scenes[3].task');
  const q=fixture(); delete q.states[1].tasks['t-einladung'].owner;
  error(q,'detail-task-owner','scenes[3].task');
  const r=fixture(); r.states[1].tasks['t-einladung'].comment.by='p-missing';
  error(r,'unknown-person','states[1].tasks.t-einladung.comment.by');
  assert.ok(PC.validate(PC.replacePersonRef(r,'p-missing','p-sophie')).ok);
});
test('duplicate, empty, unknown To Do selections and conflicting progress are actionable', () => {
  const p=fixture(); p.scenes[4].taskIds.push('t-einladung');
  error(p,'duplicate-task','scenes[4].taskIds[2]');
  p.scenes[4].taskIds=[]; error(p,'todo-tasks','scenes[4].taskIds');
  p.scenes[4].taskIds=['constructor']; error(p,'unknown-task','scenes[4].taskIds[0]');
  const q=fixture(); q.states[1].tasks['t-einladung'].done=true;
  error(q,'task-progress-conflict','states[1].tasks.t-einladung.done');
});
test('new fields handle malformed JSON types without throwing', () => {
  for(const value of [null,1,true,'',[],{}, {toString:3}, [null]]) {
    for(const key of ['task','state']) {
      const p=fixture(); p.scenes[3][key]=value;
      assert.doesNotThrow(()=>PC.validate(p)); assert.doesNotThrow(()=>PC.summary(p));
    }
    for(const key of ['viewer','taskIds','state','myDaySelected','personalListPrivate','plannerConnected','dateLabel']) {
      const p=fixture(); p.scenes[4][key]=value; assert.doesNotThrow(()=>PC.validate(p));
    }
    for(const key of ['notes','checklist','comment','progress']) {
      const p=fixture(); p.states[1].tasks['t-einladung'][key]=value; assert.doesNotThrow(()=>PC.validate(p));
    }
    const p=fixture(); p.scenes[4].taskIds=[value]; assert.doesNotThrow(()=>PC.validate(p));
    p.states[1].tasks['t-einladung'].checklist=[value]; assert.doesNotThrow(()=>PC.validate(p));
  }
});
test('budgets warn, checklist limits block, snapshots survive roundtrip; pack documents contract', () => {
  const p=fixture(), t=p.states[1].tasks['t-einladung'];
  t.notes='x'.repeat(241); t.comment.text='x'.repeat(181);
  assert.equal(PC.validate(p).warnings.length,2);
  while(t.checklist.length<6)t.checklist.push({text:'Schritt',done:false});
  error(p,'too-many-checklist','states[1].tasks.t-einladung.checklist');
  const q=fixture(); assert.deepEqual(PC.parseInput(PC.serialise(q)).project,q);
  for(const text of ['planner-task','taskIds','plannerConnected','myDaySelected','personalListPrivate']) assert.ok(PC.authoringPack().includes(text));
});
