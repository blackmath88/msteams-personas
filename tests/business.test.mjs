import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import PC from '../src/project-core.js';
import R from '../src/research-catalogue.js';
import {getCatalogue,getCapabilities} from '../tools/ops.mjs';

test('business examples are valid saved projects with neutral metadata and stable people',()=>{
  for(const id of ['municipal-opening-hours','service-appointment-change']) {
    const p=R.project(id);
    assert.deepEqual(PC.validate(p),{ok:true,errors:[],warnings:[]});
    assert.deepEqual(JSON.parse(readFileSync(new URL(`../examples/${id}.project.json`,import.meta.url))),p);
    assert.doesNotMatch(JSON.stringify(p.meta),/Hochschul|Tannwil/);
    assert.match(p.meta.source.note,/2026-11-10/);
    assert.equal(p.slides.length,5);
    assert.deepEqual(PC.parseInput(PC.serialise(p)).project,p);
  }
  const p=R.project('service-appointment-change');
  assert.equal(p.people.find(x=>x.id==='samuel-brand').role,'Disposition Servicetechnik');
  assert.equal(p.people.find(x=>x.id==='reto-furrer').role,'Teamleitung Kundendienst');
  assert.match(p.meta.organisation,/Brunner Haustechnik AG/);
});
test('municipal draft completion leaves release pending in the same meeting component',()=>{
  const p=R.project('municipal-opening-hours'),before=PC.compile(p,1).collaboration,after=PC.compile(p,3).collaboration,detail=PC.compile(p,2).taskDetail.task;
  assert.equal(before.component.id,after.component.id);
  const draft=before.tasks.find(x=>x.id===detail.id),review=after.tasks.find(x=>x.id===detail.id);
  assert.equal(draft.done,false);assert.equal(detail.done,true);assert.equal(review.done,true);
  for(const k of ['id','title','owner','due'])assert.equal(draft[k],detail[k]);
  assert.equal(after.tasks.find(x=>x.id==='t-3').done,false);
  assert.match(detail.comment.text,/weiterhin offen/);
  assert.ok(after.snapshot.decisions.some(x=>/Freigabe steht noch aus/.test(x.text)));
});
test('service acceptance is explicit while order and customer tasks stay open',()=>{
  const p=R.project('service-appointment-change'),task=PC.compile(p,2).taskDetail.task,board=PC.compile(p,3).scene.tasks;
  assert.equal(p.states[0].tasks['t-1'].done,false);assert.equal(task.done,true);
  assert.equal(task.comment.by,'nina-graf');assert.match(task.comment.text,/Ich übernehme A-2048/);
  assert.equal(task.owner,'samuel-brand'); // coordination owner is not the accepting technician
  for(const id of ['t-2','t-3'])assert.equal(board.find(x=>x.id===id).done,false);
  assert.equal(board.find(x=>x.id===task.id).owner,task.owner);
  assert.ok(p.scenes.at(-1).steps.every(x=>x.relation==='manual'));
});
test('catalogue facets combine, retain personal work and never copy legacy scenes',()=>{
  const c=getCatalogue({domain:'administration',teamPattern:'committee'});
  assert.deepEqual(c.personas.map(x=>x.id),['municipal-service']);assert.equal(c.scenarios.length,2);
  assert.equal(getCatalogue({domain:'administration',teamPattern:'individual'}).personas.length,0);
  const personal=getCatalogue({teamPattern:'individual'});
  assert.ok(personal.legacy.some(x=>x.world==='nora-keller'));
  assert.ok(personal.scenarios.some(x=>x.id==='personal-to-group'));
  assert.ok(getCatalogue().legacy.every(x=>!x.people&&!x.scenes));
  for(const key of ['personas','scenarios','legacy'])assert.equal(getCatalogue({domain:'unknown'})[key].length,0);
  const detached=R.catalogue();detached.personas[0].domains.push('mutated');assert.ok(!R.personas[0].domains.includes('mutated'));
  for(const id of ['municipal-opening-hours','service-appointment-change'])assert.ok(getCapabilities().examples.includes(id));
});
test('new source dates and evidence limits are explicit, older projects remain identical',()=>{
  const sources=new Set(R.sources.map(s=>s.id));
  for(const s of R.scenarios.filter(x=>x.collection==='business')) {
    assert.ok(s.sources.every(id=>sources.has(id)));assert.ok(s.alternative&&s.failure&&s.evidence.length);
    assert.equal(s.synthesis,'fictional-synthesis');
    if(s.status!=='renderable')assert.throws(()=>R.project(s.id));
  }
  for(const s of R.sources.filter(x=>x.accessed==='2026-11-10'))assert.ok(s.published&&s.dataPeriod&&s.limitations);
  for(const s of R.scenarios.filter(x=>x.collection==='hochschule'&&x.status==='renderable')){
    assert.deepEqual(R.project(s.id),JSON.parse(readFileSync(new URL(`../examples/${s.id}.project.json`,import.meta.url))));
    assert.match(R.project(s.id).meta.source.note,/2026-11-09/);
  }
});
