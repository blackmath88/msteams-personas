// Browser proof for import, authoring, identity, persistence and offline file opening.
// Requires the same static server as project-journey.mjs.
import { launch } from './cdp.mjs';
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
const root=new URL('../',import.meta.url).pathname;
const out=root+'docs/evidence-task-profiles/';
const project=JSON.parse(readFileSync(root+'examples/leadership-forum-six.project.json','utf8'));
const page=await launch({port:0});
const log=[];
const check=(name,ok)=>{assert.ok(ok,name); log.push(name); console.log('PASS '+name);};
const val=async(path,value,event='input')=>{
  await page.eval(`(()=>{const el=document.querySelector('[data-path="'+${JSON.stringify(path)}+'"]'); el.value=${JSON.stringify(value)}; el.dispatchEvent(new Event('${event}',{bubbles:true}));})()`);
  await page.sleep(200);
};
try{
  await page.size(1440,900);
  await page.goto((process.argv[2]||'http://127.0.0.1:8766/index.html')+'#/projekt');
  await page.eval(`ProjectUI.receive(${JSON.stringify(JSON.stringify(project))},'import')`);
  await page.sleep(200); await page.eval(`document.querySelector('[data-op="accept"]').click()`); await page.sleep(300);
  check('six-slide import opens detail and To Do previews',await page.eval(`document.querySelectorAll('.pj-thumb .slide').length===6 && !!document.querySelector('.pj-thumb .pt-dlg') && !!document.querySelector('.pj-thumb .m3-todo')`));
  await val('tasks.1.title','Einladung verbindlich versenden');
  check('one title edit reaches board, details, To Do and principle',await page.eval(`[2,3,4,5].every(i=>document.querySelectorAll('.pj-thumb')[i].innerText.includes('Einladung verbindlich versenden'))`));
  await val('states.1.tasks.t-einladung.notes','Freigegebener Text und geprüfter Link.');
  await val('states.1.tasks.t-einladung.progress','completed','change');
  check('explicit completion reaches detail and To Do without changing before',await page.eval(`document.querySelector('.pt-grid').innerText.includes('Abgeschlossen') && document.querySelector('.d-list li[data-task-id="t-einladung"]').classList.contains('done') && ProjectUI.current().states[0].tasks['t-einladung'].list==='personal'`));
  await page.eval(`document.querySelector('[data-op="add-check"][data-state="1"][data-task="t-einladung"]').click()`); await page.sleep(200);
  check('checklist editor adds a canonical item',await page.eval(`ProjectUI.current().states[1].tasks['t-einladung'].checklist.length===4`));
  await page.eval(`document.querySelector('[data-todo-task="4"][value="t-raum"]').click()`); await page.sleep(200);
  check('invalid To Do ownership stays editable and blocks export',await page.eval(`ProjectCore.validate(ProjectUI.current()).errors.some(e=>e.code==='todo-task-owner') && document.querySelector('#pj-valid').innerText.includes('nur Aufgaben')`));
  await page.eval(`document.querySelector('[data-todo-task="4"][value="t-raum"]').click()`); await page.sleep(200);
  await page.shot(out+'editor-desktop.png',true);
  const roundtrip=await page.eval(`JSON.stringify(ProjectUI.current())`);
  await page.eval('location.reload()'); await page.sleep(600);
  check('reload preserves task details and selections',roundtrip===await page.eval(`JSON.stringify(ProjectUI.current())`));
  const exported=await page.eval(`ProjectRender.renderAll(ProjectUI.current(),{dataUrl:true})`);
  check('website exports all six through shared operation',exported.ok && exported.slides.length===6);
  await page.size(390,844); await page.sleep(200);
  check('mobile editor has no page overflow',await page.eval('document.documentElement.scrollWidth<=innerWidth+1'));
  await page.shot(out+'editor-mobile.png',true);
  // New profiles can be created from the existing three-slide blank editor.
  await page.size(1440,900);
  await page.eval(`ProjectUI.receive(JSON.stringify(ProjectCore.blank()),'import')`); await page.sleep(200);
  await page.eval(`document.querySelector('[data-op="accept"]').click()`); await page.sleep(200);
  for(const kind of ['planner-task','todo']) {
    await page.eval(`document.querySelector('#pj-addp').value='${kind}'; document.querySelector('[data-op="add-slide"]').click()`); await page.sleep(200);
  }
  check('new-profile authoring upgrades capability version and stays valid',await page.eval(`ProjectUI.current().capabilityVersion===4 && ProjectCore.validate(ProjectUI.current()).ok && document.querySelectorAll('.pj-thumb .slide').length===5`));
  await page.goto('file://'+root+'index.html#/projekt');
  check('offline file editor loads the new catalogue',await page.eval(`ProjectCore.capabilities().capabilityVersion===4 && !!ProjectCore.capabilities().profiles.todo`));
  check('no script errors',page.errors.length===0);
  writeFileSync(out+'browser-checks.json',JSON.stringify(log,null,2));
}finally{await page.close();}
