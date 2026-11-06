import { launch } from './cdp.mjs';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const base = process.argv[2] || pathToFileURL(resolve('index.html')).href;
const page = await launch({port: 0});
const evaluate = code => page.eval(code);
const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
const set = (id, value) => evaluate(`{
  const el = document.getElementById(${JSON.stringify(id)});
  el.value = ${JSON.stringify(value)};
  el.dispatchEvent(new Event('change', {bubbles:true}));
}`);
const check = async (label, code) => { assert.ok(await evaluate(code), label); console.log('PASS ' + label); };
try {
  await page.size(1440, 900);
  await page.goto(base + '#/projekt/arbeitsbereich');
  await click('[data-op="adapt-workspace"]');
  await page.sleep(250);
  await check('Campus opens map and Teams preview', "document.querySelectorAll('.wp-slide').length === 2 && document.querySelector('.wp-m365').innerText.includes('Termin 3 findet online statt')");
  await set('wp-name', 'Forum und Veranstaltungen');
  await click('[data-op="wp-save-fields"]');
  await check('channel rename follows into both views', "[...document.querySelectorAll('.wp-slide')].every(slide => slide.innerText.includes('Forum und Veranstaltungen'))");
  await click('#wp-house');
  await check('house labels are map only', "document.querySelector('.wp-slide-map').textContent.includes('Dateiablage / Regal') && !document.querySelector('.wp-slide-scene').innerText.includes('Regal')");
  await click('[data-op="wp-select"][data-i="event-plan"]');
  await set('wp-parent', 'forum-material');
  await check('moving the file updates both views', "[...document.querySelectorAll('.wp-slide')].every(slide => slide.innerText.includes('Unterlagen') && slide.innerText.includes('Veranstaltungsplan.xlsx'))");
  await click('[data-op="wp-add-file"]');
  await check('added files appear in both views', "[...document.querySelectorAll('.wp-slide')].every(slide => slide.innerText.includes('Neue Datei.docx'))");
  await set('wp-perspective', 'urban:lukas');
  await click('[data-op="wp-select"][data-i="publications"]');
  await check('research view has its own five channels and working manuscript', "document.querySelector('.wp-slide-map').textContent.includes('5 Kanäle') && document.querySelector('.wp-slide-scene').innerText.includes('Paper_HeatHealth.docx')");
  await set('wp-perspective', 'nora-work:nora');
  await check('Nora uses OneDrive with personal sharing', "!!document.querySelector('.m3-onedrive') && !document.querySelector('.m3-teams') && document.querySelector('.wp-slide-map').innerText.includes('Geteilt mit Leonie Steiner')");
  const draft = await evaluate('ProjectCore.serialise(ProjectUI.current())');
  await evaluate('location.reload()');
  await page.sleep(500);
  assert.equal(await evaluate('ProjectCore.serialise(ProjectUI.current())'), draft);
  await page.size(390, 844);
  await check('narrow screen keeps a readable layout without horizontal scrolling', 'document.documentElement.scrollWidth <= innerWidth + 1');
  await evaluate(`ProjectUI.receive(${JSON.stringify(draft)}, 'import')`);
  await page.sleep(250);
  await click('[data-op="accept"]');
  await page.sleep(250);
  await check('round-trip opens the workspace editor', "ProjectUI.current().workspace && !!document.querySelector('.m3-onedrive')");
  if (base.startsWith('http')) {
    const result = await evaluate('ProjectRender.renderAll(ProjectUI.current(), {dataUrl: true})');
    assert.equal(result.ok, true, JSON.stringify(result.diagnostics));
    assert.ok(result.slides.every(slide => slide.dataUrl.startsWith('data:image/png;base64,')));
    console.log('PASS website produces both PNGs through the shared renderer');
  }
  await page.size(1440, 900);
  await page.goto(base + '#/projekt/arbeitsbereich');
  await click('[data-op="adapt-workspace-houses"]');
  await page.sleep(250);
  await check('Mara sees exactly her three houses and the paired Teams file', `
    document.querySelectorAll('.wp-houses .wp-house').length === 3 &&
    !document.querySelector('.wp-houses').textContent.includes('Urban Health') &&
    document.querySelector('.wp-house-app .m-fn').textContent.includes('Checkliste_Pilot.docx')`);
  await click('.wp-house-compare [data-op="wp-open-files"][data-i="onboarding-general"]');
  await check('house cabinet opens the same channel in Teams files', `
    document.querySelector('.wp-room-on').textContent.includes('Allgemein') &&
    document.querySelector('.wp-house-app .t-crumb').textContent.includes('Allgemein')`);
  await click('.wp-house-app .t-chans [data-i="pilot"]');
  await click('.wp-house-app .m-fn [data-i="pilot-material"]');
  await click('.wp-house-app .m-fn [data-i="pilot-feedback"]');
  await check('Teams navigation follows nested folders with the same room still selected', `
    document.querySelector('.wp-room-on').textContent.includes('Pilotphase') &&
    document.querySelector('.wp-house-app .t-crumb').textContent.includes('Unterlagen › Rückmeldungen')`);
  await click('.wp-house-app [data-op="wp-preview-tab"][data-i="posts"]');
  await check('switching back to posts selects the channel instead of the folder', `
    ProjectUI.current().scenes[1].selected === 'pilot' &&
    document.querySelector('.wp-house-app .t-posts') &&
    !document.querySelector('.wp-room-files-on')`);
  await set('wp-perspective', 'campus:sophie');
  await check('changing the linked viewer keeps the overview within membership', `
    document.querySelectorAll('.wp-houses .wp-house').length === 1 &&
    document.querySelector('.wp-house-compare h3').textContent.includes('Campus & People Development')`);
  await page.size(390, 844);
  await check('house and Teams drafts fit the narrow editor width', 'document.documentElement.scrollWidth <= innerWidth + 1');
  assert.deepEqual(page.errors, []);
} finally { await page.close(); }
