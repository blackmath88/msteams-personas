import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import R from '../src/research-catalogue.js';
import {launch} from './cdp.mjs';
const dir=resolve('docs/business-review/checks');mkdirSync(dir,{recursive:true});
const page=await launch({port:0}),checks=[];
const check=async(name,expr)=>{assert.ok(await page.eval(expr),name);checks.push(name);console.log('PASS '+name);};
const goto=route=>page.goto('http://127.0.0.1:8766/index.html'+route);
try{
  await page.size(1440,1000);await goto('#/personas');
  await check('combined discovery has 7 existing worlds and 6 research groups',"document.querySelectorAll('.world').length===7&&document.querySelectorAll('.he-persona').length===6");
  await page.eval("document.getElementById('discovery-domain').value='administration';document.getElementById('discovery-domain').dispatchEvent(new Event('change',{bubbles:true}))");await page.sleep(180);
  await check('native domain filter preserves focus and matches one group',"document.querySelectorAll('.he-persona').length===1&&document.activeElement.id==='discovery-domain'&&document.getElementById('discovery-count').textContent.startsWith('1 ')");
  await page.eval("document.getElementById('discovery-pattern').value='individual';document.getElementById('discovery-pattern').dispatchEvent(new Event('change',{bubbles:true}))");await page.sleep(180);
  await check('combined filters have an explicit empty state',"document.body.innerText.includes('Keine passenden Beispiele')&&document.getElementById('discovery-count').textContent.startsWith('0 ')");
  await page.eval('history.back()');await page.sleep(180);
  await check('browser back restores filter selection',"document.getElementById('discovery-domain').value==='administration'&&document.getElementById('discovery-pattern').value===''");
  await goto('#/personas/auswahl/-/individual');
  await check('individual work remains findable through a legacy reference',"!!document.querySelector('a[href=\"#/personas/nora-keller\"]')");
  await goto('#/personas');await check('reset restores complete discovery',"document.getElementById('discovery-domain').value===''&&document.querySelectorAll('.he-persona').length===6");
  await goto('#/beispiele');await check('business overview separates two examples from two research briefs',"document.querySelectorAll('.he-persona').length===2&&document.querySelectorAll('.he-status.renderable').length===2&&document.querySelectorAll('.he-status.researched').length===2");
  for(const route of ['#/tools/planner','#/usecases']){
    await goto(route);await check(route+' exposes the canonical reference pair',"!!document.querySelector('a[href=\"#/beispiele/municipal-opening-hours\"]')&&!!document.querySelector('a[href=\"#/beispiele/service-appointment-change\"]')");
  }
  for(const s of R.scenarios.filter(s=>s.collection==='business'&&s.status==='renderable')){
    await goto('#/beispiele/'+s.id);
    for(let i=0;i<5;i++){
      await check(s.id+' slide '+(i+1)+' fits',"!!document.querySelector('#he-preview .slide')&&Export.fitIssues(document.querySelector('#he-preview .slide')).length===0");
      if(i<4)await page.eval("document.querySelector('[data-he=next]').click()");
    }
    await check(s.id+' shows simpler alternative and failure',"document.body.innerText.includes('Einfachere Alternative')&&document.body.innerText.includes('Typischer Fehler')");
    await page.eval("document.querySelector('[data-he=adapt]').click()");await page.sleep(180);
    await check(s.id+' imports through review',"location.hash==='#/projekt/import'&&!!document.querySelector('[data-op=accept]')");
    await page.eval("document.querySelector('[data-op=accept]').click()");await page.sleep(180);
    assert.deepEqual(await page.eval('ProjectUI.current()'),R.project(s.id));checks.push(s.id+' preserves full JSON through import');
    const output=await page.eval('ProjectRender.renderAll(ProjectUI.current(),{dataUrl:true})');assert.equal(output.ok,true,JSON.stringify(output.diagnostics));
    const cli=JSON.parse(readFileSync(resolve('docs/business-review',s.id,'manifest.json')));
    for(const [i,slide]of output.slides.entries())assert.equal(createHash('sha256').update(Buffer.from(slide.dataUrl.split(',')[1],'base64')).digest('hex'),cli.slides[i].sha256);
    checks.push(s.id+' website exports five PNGs byte-identically to CLI');
  }
  await goto('#/beispiele/municipal-holiday-cover');await check('research-only entries have no export',"!document.querySelector('[data-he=export]')");
  for(const [w,h,dpr] of [[390,844,1],[720,500,2]]){
    await page.size(w,h,dpr);
    for(const route of ['#/personas','#/personas/auswahl/administration/individual','#/beispiele','#/beispiele/municipal-opening-hours','#/beispiele/service-appointment-change']){
      await goto(route);await check(w+'px '+route+' has no horizontal scroll','document.documentElement.scrollWidth<=innerWidth+1');
    }
    await page.shot(resolve(dir,'website-'+w+'.png'),true);
  }
  assert.deepEqual(page.errors,[]);writeFileSync(resolve(dir,'browser.json'),JSON.stringify({ok:true,checks,scope:'Local Chromium, not real tenant or observed practitioner use.'},null,2)+'\n');console.log(checks.length+' checks passed');
}finally{await page.close();}
