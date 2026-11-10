// Focused new UI/export regression. Start the repository HTTP server on 8766 first.
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { launch } from './cdp.mjs';
import R from '../src/research-catalogue.js';
const out = resolve(process.env.MTP_TEST_OUTPUT || 'docs/morning-review'); mkdirSync(out,{recursive:true});
const page = await launch({port:0}); const results = [];
const check = async (name, expression) => { assert.ok(await page.eval(expression), name); results.push(name); console.log('PASS '+name); };
const goto = route => page.goto('http://127.0.0.1:8766/index.html'+route);
try {
  await page.size(1440,1000); await goto('#/hochschule');
  await check('four group cards and twelve honest scenario statuses', "document.querySelectorAll('.he-persona').length===4 && document.querySelectorAll('.he-scenario').length===12 && document.querySelectorAll('.he-status.renderable').length===6");
  await check('twelve vocabulary symbols in small and large light/dark specimens', "document.querySelectorAll('.he-specimen>div').length===12 && document.querySelectorAll('.he-dark').length===6");
  await page.shot(resolve(out,'website-catalogue.png'),true);
  await goto('#/personas'); await check('existing persona entry exposes four researched additions', "document.querySelectorAll('.he-persona').length===6 && document.querySelectorAll('.worlds .world').length===7");
  await goto('#/hochschule/structured-requests');
  await check('provisional requests has no rendering or export controls', "!document.querySelector('.he-preview') && !document.querySelector('[data-he=export]') && document.body.innerText.includes('Provisorisch')");
  for (const s of R.scenarios.filter(x=>x.status==='renderable' && x.collection==='hochschule')) {
    await goto('#/hochschule/'+s.id);
    await check(s.id+' opens an actual fitting preview', "!!document.querySelector('#he-preview .slide') && Export.fitIssues(document.querySelector('#he-preview .slide')).length===0");
    await page.eval("document.querySelector('[data-he=next]').click()");
    await check(s.id+' advances with presenter notes', "document.getElementById('he-step').textContent.includes('Folie 2') && document.getElementById('he-notes').textContent.length>0");
  }
  await goto('#/hochschule/shared-loop');
  await page.eval("document.querySelector('[data-he=next]').click(); document.querySelector('[data-he=next]').click()");
  const mail = await page.eval("document.querySelector('[data-component-id]').outerHTML");
  await page.eval("document.querySelector('[data-he=next]').click()");
  assert.equal(await page.eval("document.querySelector('[data-component-id]').outerHTML"), mail); results.push('same edited component DOM across Outlook and Teams');
  await page.eval("document.querySelector('[data-he=adapt]').click()"); await page.sleep(250);
  await check('catalogue adapts via import review without overwriting a draft', "location.hash==='#/projekt/import' && document.querySelector('[data-op=accept]')");
  await page.eval("document.querySelector('[data-op=accept]').click()"); await page.sleep(250);
  await check('new profiles render in project editor with preserved metadata disclosure', "document.querySelectorAll('.pj-thumb .co-slide').length===5 && document.body.innerText.includes('erhaltene Metadaten')");
  const saved = await page.eval('ProjectCore.serialise(ProjectUI.current())');
  assert.deepEqual(JSON.parse(saved),R.project('shared-loop'));
  const render = await page.eval('ProjectRender.renderAll(ProjectUI.current(),{dataUrl:true})');
  assert.equal(render.ok,true,JSON.stringify(render.diagnostics));
  for (const slide of render.slides) { const bytes = Buffer.from(slide.dataUrl.split(',')[1],'base64'); assert.equal(bytes.toString('ascii',1,4),'PNG'); assert.equal(bytes.readUInt32BE(16),1920); assert.equal(bytes.readUInt32BE(20),1080); }
  results.push('website exports five real 1920x1080 Loop PNGs');
  await goto('#/hochschule/shared-loop');
  await page.eval("const p=ResearchCatalogue.project('shared-loop');p.states[0].components['c-methoden'].rows[0].text='<img src=x onerror=alert(1)>';const m=ProjectCore.compile(p,0);document.getElementById('he-preview').innerHTML=CollaborationView.compose(m)");
  await check('component text is escaped, never executable HTML', "!document.querySelector('#he-preview img') && document.querySelector('#he-preview').textContent.includes('<img src=x')");
  for (const [w,h,scale] of [[390,844,1],[720,500,2]]) {
    await page.size(w,h,scale);
    for (const route of ['#/hochschule','#/hochschule/gruppe/service','#/hochschule/weekly-meeting','#/hochschule/shared-loop']) {
      await goto(route); await check(`${w}px ${route} has no horizontal scroll`, 'document.documentElement.scrollWidth<=innerWidth+1');
    }
    await page.shot(resolve(out,w===390?'website-mobile.png':'website-200-percent.png'),true);
  }
  await page.size(1440,900); await goto('#/hochschule/weekly-meeting');
  await page.eval("document.querySelector('[data-he=next]').focus()"); await page.key('Tab','Tab',9);
  await check('keyboard reaches export after slide navigation', "document.activeElement.dataset.he==='export'");
  assert.deepEqual(page.errors,[]);
  writeFileSync(resolve(out,'browser-checks.json'),JSON.stringify({ok:true,checks:results,notes:'SDK/Chromium checks, not a live Microsoft tenant or assistant-host trial.'},null,2)+'\n');
  console.log(`${results.length} focused checks passed; no browser errors.`);
} finally { await page.close(); }
