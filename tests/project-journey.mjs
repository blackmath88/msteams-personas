// Portable-project journey in headless Chromium: manual authoring, save/reopen, assistant import,
// repair, PNG export. Writes screenshots and real PNG exports.
// Needs a static server:  python3 -m http.server 8766 --bind 127.0.0.1
// Run:                    node tests/project-journey.mjs [baseUrl]
import { launch } from './cdp.mjs';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8766/index.html';
const SHOTS = new URL('../docs/screenshots/bridge/', import.meta.url).pathname;
const PNGS = new URL('../docs/png-samples-bridge/', import.meta.url).pathname;
mkdirSync(SHOTS, { recursive: true }); mkdirSync(PNGS, { recursive: true });
const REPLY = readFileSync(new URL('./fixtures/pflege-uebergabe.reply.md', import.meta.url), 'utf8');
const results = [];
const check = (name, ok, info = '') => { results.push({ name, ok: !!ok }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (info ? ' — ' + info : '')); };

const p = await launch();
const J = x => JSON.stringify(x);
const $ = (sel, prop = 'textContent') => p.eval(`(document.querySelector(${J(sel)})||{})[${J(prop)}]`);
const count = sel => p.eval(`document.querySelectorAll(${J(sel)}).length`);
const click = async sel => { await p.eval(`document.querySelector(${J(sel)}).click()`); await p.sleep(300); };
const setVal = async (sel, v, ev = 'input') => { await p.eval(`(()=>{const i=document.querySelector(${J(sel)});i.focus();i.value=${J(v)};i.dispatchEvent(new Event(${J(ev)},{bubbles:true}))})()`); await p.sleep(350); };
const prevText = n => p.eval(`document.querySelectorAll('.pj-thumb')[${n}].innerText`);
const cur = () => p.eval('ProjectUI.current()');
const drafts = () => p.eval('ProjectUI.state().drafts.length');
const noHScroll = () => p.eval('document.documentElement.scrollWidth <= window.innerWidth + 1');
const paste = async text => { await p.eval(`document.querySelector('.pj-paste').open=true`); await setVal('#pj-paste', text); await click('[data-op="paste"]'); await p.sleep(300); };

try {
  await p.size(1440, 900);
  await p.goto(BASE + '#/');
  await p.eval(`localStorage.removeItem('mtp.projects')`);
  await p.goto(BASE + '#/projekt'); await p.eval('location.reload()'); await p.sleep(700);
  check('landing links to Eigene Abfolge', await p.eval(`location.hash='#/'`) && (await count('a[href="#/projekt"]')) >= 2);
  await p.eval(`location.hash='#/projekt'`); await p.sleep(400);
  check('start: four routes visible', /Beispiel anpassen[\s\S]*Neue Abfolge[\s\S]*Mit deinem KI-Assistenten vorbereiten[\s\S]*Projekt öffnen/.test(await $('.pj-routes', 'innerText')));
  await p.shot(SHOTS + '01-start.png', true);

  // keyboard: Tab to «Beispiel anpassen» and press Enter
  await p.eval(`document.querySelector('[data-op="adapt"]').focus()`);
  check('keyboard: Beispiel anpassen focusable', await p.eval(`document.activeElement.getAttribute('data-op')`) === 'adapt');
  // The CDP helper sends keyDown/keyUp without a char event, so activation is a click on the native <button>.
  await click('[data-op="adapt"]'); await p.sleep(300);
  check('1 adapt: editor opens with three slide previews', /bearbeiten/.test(await p.eval('location.hash')) && (await count('.pj-thumb .slide')) === 3);
  check('1 adapt: previews are Teams, Planner, Prinzip', await p.eval(`[...document.querySelectorAll('.pj-thumb .slide')].map(s=>s.dataset.kind).join()`) === 'folie,folie,prinzip' && (await count('.pj-thumb .m3-planner')) === 1);
  await setVal('[data-path="meta.title"]', 'Werkstatt: Übergabe am Abend');
  check('1 adapt: title edit reaches heading and preview', (await $('.pj-head h1')) === 'Werkstatt: Übergabe am Abend' && /Übergabe am Abend/.test(await prevText(0)));

  // 4 rename one person: all views
  const ay = await p.eval(`ProjectUI.current().people.findIndex(x=>x.id==='p-aylin')`);
  await setVal(`[data-path="people.${ay}.name"]`, 'Aylin Yilmaz');
  const [t0, t1, t2] = [await prevText(0), await prevText(1), await prevText(2)];
  check('4 rename: Teams post shows new name', /Aylin Yilmaz/.test(t0) && !/Aylin Demir/.test(t0));
  check('4 rename: Planner initials and Prinzip names follow', /\bAY\b/.test(t1) && !/\bAD\b/.test(t1) && /Liste von Aylin Yilmaz/.test(t2) && !/Demir/.test(t2));

  // 5 change only the after-state owner
  const after = await p.eval(`ProjectUI.current().states.findIndex(s=>s.id==='after')`);
  await setVal(`select[data-path="states.${after}.tasks.t-bremsen.owner"]`, 'p-lina', 'change');
  const pj = await cur();
  check('5 after owner changed, before unchanged', pj.states[after].tasks['t-bremsen'].owner === 'p-lina' && pj.states.find(s => s.id === 'before').tasks['t-bremsen'].owner === 'p-marco');
  const pr = await prevText(2);
  check('5 Prinzip: Marco still lists the task before; plan shows Lina', /Liste von Marco Bianchi\s*E-Bike Meier/.test(pr) && /E-Bike Meier: Bremsen entlüften\s*LH\s*Lina Huber/.test(pr) && !/Liste von Aylin Yilmaz\s*Lagerliste Schläuche prüfen\s*E-Bike/.test(pr), pr.slice(0, 160).replace(/\n/g, ' | '));

  // 6 teaching text and presenter notes
  const pi = 2;
  await setVal(`[data-path="slides.${pi}.teaching.recommendation"]`, 'Offene Arbeit kommt mit Person und Termin in den Werkstattplan.');
  await setVal(`[data-path="slides.${pi}.teaching.boundary"]`, 'Garantiefälle laufen weiter über das Kassensystem.');
  await setVal(`[data-path="slides.${pi}.presenterNotes"]`, 'Pause vor der Grenze machen.');
  const pr2 = await prevText(2);
  check('6 recommendation, boundary and notes update', /Werkstattplan/.test(pr2) && /Kassensystem/.test(pr2) && /Pause vor der Grenze/.test(pr2));
  check('editing controls stay outside the slide', (await count('.pj-thumb .slide input, .pj-thumb .slide textarea, .pj-thumb .slide select, .pj-thumb .slide button:not([role=tab])')) === 0);

  // reorder and add a slide, then restore
  await click('[data-op="down"][data-i="0"]');
  check('reorder: first slide is now Planner', /Planner/.test(await $('.pj-slide h3')));
  await click('[data-op="up"][data-i="1"]');
  await p.shot(SHOTS + '02-editor-1440.png', true);

  // 8 export ordered PNGs (same compose/densify/toPNG path as the library)
  const res = await p.eval(`ProjectUI.exportAll({download:false,dataUrl:true}).then(r=>({ok:r.ok,slides:r.slides.map(s=>({name:s.fileName,size:s.bytes,dataUrl:s.dataUrl}))}))`);
  const out = res.slides;
  check('8 export: shared render operation reports ok', res.ok === true);
  for (const o of out) writeFileSync(PNGS + o.name, Buffer.from(o.dataUrl.split(',')[1], 'base64'));
  check('8 export: three ordered PNGs', out.map(o => o.name).join() === '01-velotech-werkstatt-uebergabe-teams-posts.png,02-velotech-werkstatt-uebergabe-planner.png,03-velotech-werkstatt-uebergabe-prinzip-tasks.png', out.map(o => o.name + ' ' + o.size).join(', '));
  const dims = out.map(o => { const b = Buffer.from(o.dataUrl.split(',')[1], 'base64'); return [b.readUInt32BE(16), b.readUInt32BE(20)]; });
  check('8 export: PNGs are 1920x1080 and not blank', dims.every(d => d[0] === 1920 && d[1] === 1080) && out.every(o => o.size > 40000), J(dims));

  // export refuses a structurally invalid project and says so; no slide is announced
  const keepTitle = (await cur()).meta.title;
  await setVal('[data-path="meta.title"]', '');
  const bad = await p.eval(`ProjectUI.exportAll({download:false,dataUrl:true}).then(r=>({ok:r.ok,n:r.slides.length,stage:r.stage}))`);
  check('export: invalid project refused, nothing produced', !bad.ok && bad.n === 0 && bad.stage === 'validate' && /Export abgebrochen, keine Datei/.test(await $('#pj-status')), J(bad));
  await setVal('[data-path="meta.title"]', keepTitle);

  // Optional Teams chat: add, edit all chat fields, export, save/review and remove.
  await setVal('#pj-addp', 'teams-chat', 'change');
  await click('[data-op="add-slide"]');
  const ci = (await cur()).scenes.length - 1;
  const cb = `scenes.${ci}.`;
  check('chat: fourth slide added with current capability version', (await count('.pj-thumb .m3-chat')) === 1 && (await cur()).capabilityVersion === 2 && /Teams: Chat zu zweit/.test(await p.eval(`document.querySelectorAll('.pj-slide h3')[3].textContent`)));
  await setVal(`[data-path="${cb}team"]`, 'Abendcrew');
  await setVal(`[data-path="${cb}viewer"]`, 'p-marco', 'change');
  await setVal(`[data-path="${cb}partner"]`, 'p-aylin', 'change');
  await setVal(`[data-path="${cb}messages.0.text"]`, 'Ich übernehme die offene Arbeit.');
  await setVal(`[data-path="${cb}messages.0.time"]`, '16:10');
  await setVal(`[data-path="${cb}messages.0.by"]`, 'p-aylin', 'change');
  await setVal(`[data-path="${cb}messages.0.hint"]`, 'Jonas sieht die Zusage hier nicht.');
  await click(`[data-bool="${cb}messages.0.decision"]`);
  await click(`[data-not-seen="${ci}"][value="p-jonas"]`);
  check('chat: participant controls rewrite author choices', await p.eval(`JSON.stringify([...document.querySelector('[data-path="${cb}messages.0.by"]').options].map(o=>o.value))`) === J(['p-marco', 'p-aylin']));
  check('chat: fields and decision appear in live preview', /Abendcrew/.test(await prevText(3)) && /Ich übernehme die offene Arbeit/.test(await prevText(3)) && /16:10/.test(await prevText(3)) && /Jonas sieht die Zusage/.test(await prevText(3)) && (await count('.pj-thumb .c-msg.dec')) === 1 && (await cur()).scenes[ci].notSeenBy.join() === 'p-jonas');
  await click(`[data-op="add-message"][data-s="${ci}"]`);
  check('chat: add message', (await cur()).scenes[ci].messages.length === 2);
  await click(`[data-op="del-message"][data-s="${ci}"][data-i="1"]`);
  check('chat: remove message', (await cur()).scenes[ci].messages.length === 1);
  const chatExport = await p.eval(`ProjectUI.exportAll({download:false,dataUrl:true}).then(r=>({ok:r.ok,files:r.slides.map(s=>s.fileName),diagnostics:r.diagnostics}))`);
  check('chat: four-slide PNG export succeeds', chatExport.ok && chatExport.files[3] === '04-velotech-werkstatt-uebergabe-teams-chat.png', J(chatExport.diagnostics));
  await p.shot(SHOTS + '08-teams-chat-editor.png', true);
  // Oversize text is a warning on import but a located fit error on render.
  const chatSavedSlide = (await cur()).slides[3].id;
  const chatFit = await p.eval(`(async()=>{const q=ProjectCore.copy(ProjectUI.current());const sc=q.scenes[${ci}];sc.messages=Array.from({length:6},(_,i)=>({id:'m'+i,by:sc.viewer,text:('Eine lange Nachricht mit Zeilenumbruch.'+String.fromCharCode(10)).repeat(15)}));const r=await ProjectRender.renderAll(q);return {ok:r.ok,diagnostics:r.diagnostics}})()`);
  check('chat: overflow aborts export with located fit error', !chatFit.ok && chatFit.diagnostics.some(d=>d.code==='fit' && d.slide===chatSavedSlide && /Chat-Nachrichten/.test(d.detail)));
  const chatSaved = await cur();
  await p.eval(`location.hash='#/projekt'`); await p.sleep(300);
  await paste(J(chatSaved));
  check('chat: import review lists the new profile', /Teams: Chat zu zweit/.test(await $('.pj-sum', 'innerText')) && /Keine Fehler/.test(await $('.pj', 'innerText')));
  await click('[data-op="cancel"]');
  await p.eval(`location.hash='#/projekt/bearbeiten'`); await p.sleep(300);
  await click('[data-op="del-slide"][data-i="3"]');

  // 2 save and reopen the whole project (file input path)
  const saved = await cur();
  const before = await drafts();
  await p.eval(`location.hash='#/projekt'`); await p.sleep(400);
  await p.eval(`(()=>{const dt=new DataTransfer();dt.items.add(new File([JSON.stringify(ProjectUI.current(),null,2)],'werkstatt.msteams-personas.json',{type:'application/json'}));const i=document.getElementById('pj-file');i.files=dt.files;i.dispatchEvent(new Event('change',{bubbles:true}))})()`);
  await p.sleep(600);
  check('2 reopen: file goes to import review', /import/.test(await p.eval('location.hash')) && /Keine Fehler/.test(await $('.pj', 'innerText')));
  await click('[data-op="accept"]');
  check('2 reopen: opened as a new draft, identical content', (await drafts()) === before + 1 && J(await cur()) === J(saved));

  // 3 import an equivalent unseen project through the assistant route
  await p.eval(`location.hash='#/projekt/ki'`); await p.sleep(400);
  await setVal('[data-brief="audience"]', 'Stationsleitungen');
  check('3 bridge: pack reflects the brief and capabilities', /Publikum: Stationsleitungen/.test(await $('#pj-pack', 'value')) && /prinzip-tasks/.test(await $('#pj-pack', 'value')));
  check('3 bridge: three steps shown', /Auftrag kopieren[\s\S]*Im KI-Assistenten vorbereiten[\s\S]*Ergebnis einfügen/.test(await $('.pj-steps', 'innerText')));
  await p.shot(SHOTS + '03-assistant.png', true);
  await paste(REPLY);
  const sum = await $('.pj-sum', 'innerText');
  check('3 import: summary of the unseen project', /Schichtübergabe auf Station 4B/.test(sum) && /Spital Seeblick/.test(sum) && /Teams: Beiträge[\s\S]*Planner[\s\S]*Prinzip/.test(sum) && /Klinikinformationssystem|Teams-Kanal pro Schicht/.test(sum));
  await p.shot(SHOTS + '04-import-summary.png', true);
  await click('[data-op="accept"]');
  check('3 import: opens as new draft, previous drafts kept', (await drafts()) === before + 2 && (await cur()).meta.id === 'pflege-schichtuebergabe' && /Ruth|Samir/.test(await prevText(0)));

  // 7 broken person reference: repair through the UI, current work preserved
  const workBefore = J(await p.eval('ProjectUI.state().drafts.map(d=>d.project)'));
  const broken = REPLY.replace('"by": "p-elena"', '"by": "p-elena-k"');
  await p.eval(`location.hash='#/projekt'`); await p.sleep(400);
  await paste(broken);
  const rv = await $('.pj', 'innerText');
  check('7 broken ref: explained in plain language with location', /Unbekannte Person «p-elena-k»/.test(rv) && /Teams-Beitrag 2/.test(rv));
  check('7 broken ref: no automatic guess, open is blocked', (await count('[data-op="accept"]')) === 0 && (await $('[data-fix="p-elena-k"]', 'value')) === '');
  check('7 repair prompt previews the copied text', /GANZE korrigierte Projekt/.test(await $('#pj-repair', 'value')) && /p-elena-k/.test(await $('#pj-repair', 'value')));
  await p.shot(SHOTS + '05-repair.png', true);
  await setVal('[data-fix="p-elena-k"]', 'p-elena', 'change');
  await click('[data-op="fix-person"]');
  check('7 repair: revalidated without errors', /Keine Fehler/.test(await $('.pj', 'innerText')) && (await count('[data-op="accept"]')) === 1);
  check('7 repair: existing drafts untouched by the import', J(await p.eval('ProjectUI.state().drafts.map(d=>d.project)')) === workBefore);
  await click('[data-op="accept"]');

  // malicious-looking text and invalid input
  const evil = REPLY.replace('Übernehme beides', '<img src=x onerror=\\"window.__pwned=1\\">Übernehme beides<script>window.__pwned=2</script>');
  await p.eval(`location.hash='#/projekt'`); await p.sleep(300);
  await paste(evil); await click('[data-op="accept"]'); await p.sleep(400);
  check('markup renders as inert text', (await p.eval('window.__pwned||0')) === 0 && (await count('.pj-thumb img')) === 0 && /<img src=x/.test(await prevText(0)));
  await p.eval(`location.hash='#/projekt'`); await p.sleep(300);
  await paste(REPLY.slice(0, 900));
  check('truncated JSON: clear error, no navigation', /unvollständig/.test(await $('#pj-paste-err')) && /#\/projekt$/.test(await p.eval('location.hash')));
  await paste(REPLY.replace('"profile": "planner"', '"profile": "excel"'));
  check('unknown profile: blocked in review', /Ansicht «excel» wird nicht unterstützt/.test(await $('.pj', 'innerText')) && (await count('[data-op="accept"]')) === 0);
  await click('[data-op="cancel"]');

  // storage failure is shown, work continues in memory
  await p.eval(`ProjectUI.state().current=0;location.hash='#/projekt/bearbeiten'`); await p.sleep(500);
  await p.eval(`window.__set=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('full','QuotaExceededError')}`);
  await setVal('[data-path="meta.goal"]', 'Ziel ohne Speicher');
  check('storage failure: visible warning, edit kept in memory', /nicht gespeichert[\s\S]*Projekt sichern/.test(await $('#pj-storage')) && !(await p.eval(`document.getElementById('pj-storage').hidden`)) && (await cur()).meta.goal === 'Ziel ohne Speicher');
  await p.eval(`Storage.prototype.setItem=window.__set`);

  // draft limit: nothing is deleted automatically
  await p.eval(`location.hash='#/projekt'`); await p.sleep(300);
  for (let i = await drafts(); i < 8; i++) { await click('[data-op="adapt"]'); await p.eval(`location.hash='#/projekt'`); await p.sleep(250); }
  const eight = J(await p.eval('ProjectUI.state().drafts.map(d=>d.project.meta.id)'));
  await click('[data-op="adapt"]');
  check('draft limit: no silent deletion, user told what to do', (await drafts()) === 8 && J(await p.eval('ProjectUI.state().drafts.map(d=>d.project.meta.id)')) === eight && /bereits 8 Entwürfe/.test(await $('#pj-storage')));
  await click('[data-op="del-draft"][data-i="7"]');
  check('draft limit: removing one is explicit', (await drafts()) === 7);

  // the project file used by the CLI and MCP proof reopens in the website and exports the same slides
  const lib = readFileSync(new URL('../examples/bibliothek-tannwil.project.json', import.meta.url), 'utf8');
  await p.eval(`location.hash='#/projekt'`); await p.sleep(300);
  await p.eval(`(()=>{const dt=new DataTransfer();dt.items.add(new File([${J(lib)}],'bibliothek-tannwil.project.json',{type:'application/json'}));const i=document.getElementById('pj-file');i.files=dt.files;i.dispatchEvent(new Event('change',{bubbles:true}))})()`);
  await p.sleep(600);
  check('cli/mcp project: import review without errors', /Keine Fehler/.test(await $('.pj', 'innerText')) && /Ausleihe-Rückstände/.test(await $('.pj-sum', 'innerText')));
  await click('[data-op="accept"]'); await p.sleep(400);
  check('cli/mcp project: order Teams → Planner → Prinzip in the editor', /Teams[\s\S]*Planner[\s\S]*Prinzip/.test(await p.eval(`[...document.querySelectorAll('.pj-slide h3')].map(h=>h.textContent).join(' ')`)));
  check('cli/mcp project: before-plan task shown as shared in the preview', /Schon im gemeinsamen Plan[\s\S]*Bücherkiste/.test(await prevText(2)) && !/Liste von Renate/.test(await prevText(2)));
  const web = await p.eval(`ProjectUI.exportAll({download:false,dataUrl:true}).then(r=>r.slides.map(s=>({name:s.fileName,data:s.dataUrl.split(',')[1]})))`);
  const { createHash } = await import('node:crypto');
  let cliM = null; try { cliM = JSON.parse(readFileSync(new URL('../docs/evidence-cli-mcp/cli/manifest.json', import.meta.url), 'utf8')); } catch { /* run tests/mcp-e2e.mjs first */ }
  const webHashes = web.map(w => createHash('sha256').update(Buffer.from(w.data, 'base64')).digest('hex'));
  check('cli/mcp project: website export = CLI files (names, order, bytes)', cliM && web.map(w => w.name).join() === cliM.slides.map(s => s.file).join() && webHashes.join() === cliM.slides.map(s => s.sha256).join(), cliM ? '' : 'no CLI manifest');
  await p.shot(SHOTS + '07-cli-mcp-project-editor.png', true);

  // 390 px
  await p.size(390, 844);
  await p.eval(`ProjectUI.state().current=1;location.hash='#/projekt/bearbeiten'`); await p.sleep(600);
  check('390: editor without horizontal scroll', await noHScroll());
  await p.shot(SHOTS + '06-editor-390.png');
  await p.eval(`location.hash='#/projekt/ki'`); await p.sleep(400);
  check('390: assistant page without horizontal scroll', await noHScroll());
  await p.size(1440, 900);

  // 9 original library routes still work
  await p.eval(`location.hash='#/abfolgen'`); await p.sleep(400);
  check('9 library: Abfolgen still lists sequences', (await count('a[href^="#/a/"]')) > 3);
  await p.eval(`location.hash='#/p/kundenportal/eigenes-team/prinzip/tasks'`); await p.sleep(700);
  check('9 library: curated principle presentation renders', (await count('.stage .slide')) === 1 && /Prinzip/i.test(await $('.stage', 'innerText')));
  check('no script errors', p.errors.length === 0, p.errors.join(' | '));
} catch (e) {
  check('journey ran to the end', false, e.message);
} finally {
  await p.close();
}
const failed = results.filter(r => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
