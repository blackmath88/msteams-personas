// Browser journey through the real UI in headless Chromium, with screenshots.
// Needs a static server:  python3 -m http.server 8765 --bind 127.0.0.1
// Run:                    node tests/journey.mjs [baseUrl]
import { launch } from './cdp.mjs';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] || "http://127.0.0.1:8766/index.html";
const OUT = new URL('../docs/screenshots/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const results = [];
const check = (name, ok, info = '') => { results.push({ name, ok: !!ok, info }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (info ? ' — ' + info : '')); };

const p = await launch();
const $ = (sel, prop = 'textContent') => p.eval(`(document.querySelector(${JSON.stringify(sel)})||{})[${JSON.stringify(prop)}]`);
const count = sel => p.eval(`document.querySelectorAll(${JSON.stringify(sel)}).length`);
const click = async sel => { await p.eval(`document.querySelector(${JSON.stringify(sel)}).click()`); await p.sleep(250); };
const hash = () => p.eval('location.hash');
const noHScroll = () => p.eval('document.documentElement.scrollWidth <= window.innerWidth + 1');
const setInput = async (sel, v) => { await p.eval(`(()=>{const i=document.querySelector(${JSON.stringify(sel)});i.focus();i.value=${JSON.stringify(v)};i.dispatchEvent(new Event('input',{bubbles:true}))})()`); await p.sleep(150); };

try {
  await p.size(1440, 900);
  await p.goto(BASE + '#/');
  await p.eval('sessionStorage.clear()');
  await p.goto(BASE + '#/');
  check('landing: promise headline', /ohne eine Testumgebung/.test(await $('h1')));
  check('landing: three entry points (Team-Personas, Tools, Use Cases)', await count('.entries .entry') === 3 && /Team-Personas[\s\S]*Tools[\s\S]*Use Cases/.test(await $('.entries', 'innerText')));
  check('landing: Eigene Situation as secondary action', (await count('.own a[href="#/konfigurator/1"]')) === 1);
  check('landing: four-app story thumbnails', (await count('.storyrow .appframe .m3')) === 4);
  check('landing: seven world cards', await count('.worlds .world') === 7);
  check('landing: business card present', /Brunner/.test(await $('.worlds', 'innerText')));
  await p.shot(OUT + '01-landing-desktop.png', true);

  // Entry 1: Persona
  await click('.entries a[href="#/personas"]');
  check('persona entry navigates', (await hash()) === '#/personas');
  await click('.world a[href="#/personas/nora-keller"]');
  check('Nora world lists her three scenarios', await count('.sits .sit') === 3);
  await click('.sit a[href*="nora-abwesenheit"]');
  check('Nora personal work opens in OneDrive (no Team)', await count('.m3-onedrive') === 1 && await count('.m3-teams') === 0);
  await p.shot(OUT + '07-nora-personal-scene.png');
  await p.eval('history.back()'); await p.sleep(300);
  check('browser Back returns to persona world', (await hash()) === '#/personas/nora-keller');

  // Entry 2: Use case
  await p.goto(BASE + '#/');
  await click('.entries a[href="#/usecases"]');
  check('use-case entry lists seven use cases', await count('.ucs li') === 7);
  await click('.ucs a[href="#/usecases/entscheide"]');
  check('use case converges on situations', await count('.sits .sit') >= 3);
  await click('.sit a[href*="kundenportal"]');
  check('use case opens matching principle', /prinzip\/chat$/.test(await hash()) && /Chat oder Kanal/.test(await $('.pr-h h3')));

  // Business example: Szene with working tabs
  await p.goto(BASE + '#/s/kundenportal/eigenes-team/szene');
  check('business scene: three posts', await count('.t-post') === 3);
  check('Teams profile: rail, search, channel list, tabs, composer', (await count('.t-rail .t-ri.on')) === 1 && (await count('.t-search')) === 1 && (await count('.t-chans li.on')) === 1 && (await count('.t-tabs [role=tab]')) === 3 && (await count('.t-start')) === 1);
  check('Teams: no permanent member roster by default', (await count('.t-mem')) === 0);
  await p.shot(OUT + '04-business-szene.png', true);
  await click('[data-tab="files"]');
  check('scene tab Dateien works', await count('.m-ft tbody tr') === 4);
  await click('[data-tab="tasks"]');
  check('scene tab Aufgaben hosts the Planner board (incl. reviewed AI tasks)', (await count('.t-plan .p-card')) >= 3 && /Aus Projektsitzung/.test(await $('.t-plan', 'innerText')));
  await p.shot(OUT + '05-business-szene-aufgaben.png');
  await p.eval('document.querySelector("[data-tab=tasks]").focus()');
  await p.key('ArrowLeft', 'ArrowLeft', 37);
  check('arrow key moves between scene tabs', /files/.test(await hash()) && (await p.eval('document.activeElement.dataset.tab')) === 'files');
  await click('a.var[href*="/kanal/"]');
  check('variant switch changes structure', /Marketing & Kommunikation/.test(await $('.t-team strong')));
  for (const pid of ['chat', 'doc', 'tasks']) {
    await p.goto(BASE + '#/s/kundenportal/eigenes-team/prinzip/' + pid);
    check(`business Prinzip ${pid}: diagram + recommendation + boundary`, (await count('.pd-panel')) === 2 && (await count('.pr-rec')) === 1 && (await count('.pr-bound')) === 1);
    await p.shot(OUT + `06-business-prinzip-${pid}.png`, true);
  }

  // Leadership Forum: Szene + Prinzip
  await p.goto(BASE + '#/s/leadership-forum/eigenes-team/szene');
  await p.shot(OUT + '02-leadership-szene.png', true);
  for (const pid of ['chat', 'doc', 'tasks']) {
    await p.goto(BASE + '#/s/leadership-forum/eigenes-team/prinzip/' + pid);
    await p.shot(OUT + `03-leadership-prinzip-${pid}.png`, true);
  }
  check('Leadership Prinzip shows alternative variant', /Kanal im bestehenden Team/.test(await $('.pr-alt')));

  // Shared naming across modes and presentation
  await p.goto(BASE + '#/s/leadership-forum/eigenes-team/szene');
  await setInput('input[name="p:sophie-frei"]', 'Sina Fehr');
  await setInput('input[name="team"]', 'Forum Führung 27');
  check('name change updates Szene live', /Sina Fehr/.test(await $('.m3', 'innerText')) && /Forum Führung 27/.test(await $('.t-team strong')));
  check('typing keeps focus in field', (await p.eval('document.activeElement.name')) === 'team');
  await click('.modes a[href*="prinzip"]');
  check('name change carried into Prinzip', /Sina Fehr/.test(await $('.pr', 'innerText')) && /Forum Führung 27/.test(await $('.pr-k')));
  await click('a.btn-p[href^="#/p/"]');
  check('presentation opens with custom names', (await count('.stage')) === 1 && /Sina Fehr/.test(await $('.stage', 'innerText')));
  const fit = await p.eval(`(()=>{const r=document.querySelector('.stage').getBoundingClientRect();return r.right<=innerWidth&&r.bottom<=innerHeight&&Math.abs(r.width/r.height-16/9)<0.01})()`);
  check('stage is 16:9 and fits viewport', fit);
  check('site chrome hidden in presentation', (await p.eval('getComputedStyle(document.querySelector(".site")).display')) === 'none');
  const clipped = await p.eval(`(()=>{const d=document.querySelector('.stage-in .pd').getBoundingClientRect(),f=document.querySelector('.stage-in .pr-foot').getBoundingClientRect();return Export.fitIssues(document.querySelector('.stage-in')).length+(d.bottom>f.top+1?1:0)})()`);
  check('presentation content not clipped (Prinzip)', clipped === 0, clipped + ' clipped');
  await p.shot(OUT + '08-present-prinzip-annot.png');
  await p.key('h', 'KeyH', 72);
  check('H hides decorative annotation but keeps boundary and alternative', (await count('.stage .pr-problem')) === 0 && (await count('.stage .pr-bound')) === 1 && (await count('.stage .pr-alt')) === 1);
  await p.shot(OUT + '09-present-prinzip-clean.png');
  await p.key('h', 'KeyH', 72);
  await p.key('Escape', 'Escape', 27);
  check('Escape exits presentation to same view', /^#\/s\/leadership-forum\/eigenes-team\/prinzip/.test(await hash()) && (await count('.stage')) === 0);
  await p.goto(BASE + '#/p/kundenportal/eigenes-team/szene/posts');
  const stageFits = () => p.eval(`Export.fitIssues(document.querySelector('.stage-in')).length===0 && !!document.querySelector('.stage-in .slide')`);
  const sClip = (await stageFits()) ? 0 : 1;
  check('presentation Szene posts not clipped', sClip === 0, sClip + ' clipped');
  await p.shot(OUT + '10-present-business-szene.png');
  for (const sid of ['leadership-forum/eigenes-team', 'leadership-forum/kanal', 'kundenportal/eigenes-team', 'kundenportal/kanal', 'heat-health/-', 'sitzungszyklus/gastzugang', 'sitzungszyklus/link', 'semesterstart/ohne-bewertung', 'semesterstart/mit-bewertung', 'nora-publikation/-', 'nora-abwesenheit/-', 'nora-reihe/-']) for (const v of ['prinzip/chat', 'prinzip/doc', 'prinzip/tasks', 'szene/posts', 'szene/files', 'szene/tasks']) {
    await p.goto(BASE + `#/p/${sid}/${v}`); await p.sleep(150);
    const ok = await stageFits();
    if (!ok) check(`stage fits: ${sid} ${v}`, false);
    if (v === 'prinzip/doc') {
      const same = await p.eval(`(()=>{const t=[...document.querySelectorAll('.stage [data-doc], .stage .pd-onedoc .pd-boxh')].map(e=>e.textContent.trim());return t.length===3&&t.every(x=>x===t[0])})()`);
      if (!same) check(`doc identity consistent: ${sid}`, false);
    }
    for (const route of [`#/p/${sid}/${v}`, `#/s/${sid}/${v}`]) {
      if (route[2] === 's') { await p.goto(BASE + route); await p.sleep(100); }
      if (/\{p:|\{s\}|\{c\}/.test(await p.eval('document.body.innerText'))) check(`no raw tokens: ${route}`, false);
    }
  }
  check('stage fit + token + document-identity sweep (12 situation/variant combinations × 6 views) done', true);
  await p.goto(BASE + '#/p/kundenportal/eigenes-team/prinzip/doc');
  await p.shot(OUT + '15-present-business-prinzip-doc.png');
  await p.goto(BASE + '#/p/nora-reihe/-/szene');
  await p.shot(OUT + '11-present-nora.png');

  // ---------- v2: three entrances converge, tools, content, PNG ----------
  await p.size(1440, 900);
  await p.goto(BASE + '#/personas/campus-people-development');
  await click('.sit a[href*="leadership-forum"]');
  const viaPersona = await hash();
  await p.goto(BASE + '#/tools');
  check('tools page lists tools with honest states incl. KI-Simulation', (await count('.toolgrid > li')) === 9 && /KI-Simulation/i.test(await $('.toolgrid', 'innerText')));
  await click('.toolgrid a[href="#/tools/outlook"]');
  await click('.sit a[href*="leadership-forum"]');
  const viaTool = await hash();
  check('tool entry opens Outlook screen', /\/szene\/outlook$/.test(viaTool) && (await count('.m3-outlook')) === 1);
  await p.goto(BASE + '#/usecases/fassungen');
  await click('.sit a[href*="leadership-forum"]');
  const viaUse = await hash();
  check('three entrances converge on the same situation', [viaPersona, viaTool, viaUse].every(h => h.startsWith('#/s/leadership-forum/eigenes-team/')), [viaPersona, viaTool, viaUse].join(' '));
  await p.goto(BASE + '#/s/leadership-forum/eigenes-team/szene/posts');
  await setInput('input[name="p:mara-conti"]', 'Mia Costa');
  for (const t of ['outlook', 'explorer', 'sharepoint', 'posts']) {
    await click(`.screens a[href$="/szene/${t}"]`);
    // Explorer shows only file names and the viewer (Daniel); the others must show the custom name.
    if (t !== 'explorer' && !/Mia Costa/.test(await $('.m3', 'innerText'))) check(`custom name survives tool switch to ${t}`, false);
  }
  check('custom name survives Teams → Outlook → Explorer → SharePoint → Teams', /Mia Costa/.test(await $('.m3', 'innerText')));
  await p.goto(BASE + '#/s/leadership-forum/eigenes-team/szene/sharepoint');
  await p.eval('document.querySelector("details:not([open])") && document.querySelectorAll("details").forEach(d=>d.open=true)');
  await setInput('form.contentf input[name="docName"]', 'Forum-Plan 2027.xlsx');
  const idsSP = await p.eval('[...document.querySelectorAll(".m3 [data-docref=canonical]")].map(e=>e.textContent)');
  await click('.screens a[href$="/szene/posts"]');
  await setInput('form.contentf textarea[name="postText"]', 'Neu <img src=x onerror="window.__xss=1"> & «Plan»');
  check('content field keeps focus while typing', (await p.eval('document.activeElement.name')) === 'postText');
  const idsT = await p.eval('[...document.querySelectorAll(".m3 [data-docref=canonical]")].map(e=>e.textContent)');
  check('edited post text rendered as text, not markup', (await count('.m3 img')) === 0 && !(await p.eval('window.__xss')) && /<img src=x/.test(await $('.m3', 'innerText')));
  await click('.screens a[href$="/szene/explorer"]');
  const copies = await p.eval('[...document.querySelectorAll(".m3 [data-docref=copy]")].map(e=>e.textContent)');
  await p.goto(BASE + '#/s/leadership-forum/eigenes-team/prinzip/doc');
  const prDoc = await $('.pd-onedoc .pd-boxh');
  check('cross-app identity: renamed canonical file in SharePoint, Teams and Prinzip', idsSP.length >= 2 && idsSP.every(x => x === 'Forum-Plan 2027.xlsx') && idsT.length >= 1 && idsT.every(x => x === 'Forum-Plan 2027.xlsx') && /Forum-Plan 2027/.test(prDoc), JSON.stringify([idsSP, idsT, prDoc]));
  check('cross-app identity: Explorer copies match Prinzip copies, not the canonical file', copies.includes('Veranstaltungsplan_Mara.xlsx') && copies.includes('Plan_SF_v2.xlsx') && !copies.includes('Forum-Plan 2027.xlsx') && /Veranstaltungsplan_Mara\.xlsx/.test(await $('.pd-copies', 'innerText')));
  await p.goto(BASE + '#/s/heat-health/gruppenteam/szene/outlook');
  check('unsupported tool shows honest unavailable state', (await count('.unavail')) === 1 && (await count('.m3-outlook')) === 0 && /nicht verfügbar/.test(await $('.screens', 'innerText')));
  await p.goto(BASE + '#/s/kundenportal/eigenes-team/szene/files');
  check('old Teams tab route still valid', (await count('.m-ft tbody tr')) === 4);
  // PNG export: real bytes, dimensions, no controls in output
  const pngs = [];
  for (const [r, kind] of [['#/p/leadership-forum/eigenes-team/szene/posts/app', 'app'], ['#/p/leadership-forum/eigenes-team/szene/posts/folie', 'folie'], ['#/p/leadership-forum/eigenes-team/prinzip/doc', 'prinzip'], ['#/p/kundenportal/eigenes-team/szene/posts/folie', 'folie'], ['#/p/leadership-forum/eigenes-team/szene/sharepoint/vergleich', 'vergleich']]) {
    await p.goto(BASE + r); await p.sleep(200);
    const ctlInSlide = await count('.stage-in .slide .stage-ctl, .stage-in .slide .btn, .stage-in .slide input, .stage-in .slide .toolpick');
    const res = await p.eval(`(async()=>{const b=await window.__exportPng();if(!b)return null;const u=new Uint8Array(await b.arrayBuffer());const dv=new DataView(u.buffer);return {name:window.__lastPng.name,size:u.length,sig:[...u.slice(1,4)].map(c=>String.fromCharCode(c)).join(''),w:dv.getUint32(16),h:dv.getUint32(20),kind:document.querySelector('.stage-in .slide').dataset.kind}})()`);
    pngs.push(res);
    check(`PNG ${kind}: real PNG 1920×1080, selected output, no controls`, res && res.sig === 'PNG' && res.w === 1920 && res.h === 1080 && res.size > 40000 && res.kind === kind && ctlInSlide === 0, JSON.stringify(res));
  }

  // ---------- v3: screens, sequences, trainer workflow, persistence ----------
  await p.size(1440, 900);
  const SCREENS = ['posts', 'files', 'tasks', 'chat', 'recap', 'outlook', 'explorer', 'sharepoint', 'onedrive', 'planner', 'plantask', 'todo'];
  let sweepBad = [];
  for (const sv of ['leadership-forum/eigenes-team', 'kundenportal/kanal', 'onboarding/kanal', 'onboarding/nur-plan', 'heat-health/-', 'sitzungszyklus/gastzugang', 'semesterstart/mit-bewertung', 'nora-publikation/-', 'nora-abwesenheit/-', 'nora-reihe/-']) {
    for (const sc of SCREENS) {
      await p.goto(BASE + `#/s/${sv}/szene/${sc}`); await p.sleep(60);
      const st = await p.eval(`({m3: document.querySelectorAll('#visual .m3').length, un: document.querySelectorAll('#visual .unavail').length, picked: !!document.querySelector('.screens [aria-current]')})`);
      if (st.m3 + st.un !== 1) sweepBad.push(`${sv} ${sc}: ${JSON.stringify(st)}`);
      if (st.m3) {
        await p.goto(BASE + `#/p/${sv}/szene/${sc}/folie`); await p.sleep(60);
        const iss = await p.eval(`Export.fitIssues(document.querySelector('.stage-in'))`);
        if (iss.length) sweepBad.push(`${sv} ${sc} folie: ${iss.join(',')}`);
        if (/\{p:|\{s\}|\{c\}/.test(await p.eval('document.body.innerText'))) sweepBad.push(`${sv} ${sc}: raw token`);
      }
    }
  }
  check('screen sweep: 10 situation/variant × 12 screens render or explain unavailability, slides fit', sweepBad.length === 0, sweepBad.slice(0, 6).join(' | '));
  await p.goto(BASE + '#/abfolgen');
  check('sequences page lists seven teaching sequences with a how-to', (await count('.seqlist > li')) === 7 && (await count('.howto li')) === 4);
  await click('.seqlist a[href="#/a/einarbeitung/1"]');
  check('sequence step 1 opens workspace with flow, sequence bar and objective', (await count('.flow .on')) === 1 && (await count('.seqbar ol li')) === 5 && /Lernziel/.test(await $('.seq-obj')) && (await count('.m3-teams')) === 1);
  await click('.seqbar [data-act="seq-next"]');
  check('Weiter moves to step 2 (chat)', /#\/a\/einarbeitung\/2$/.test(await hash()) && (await count('.m3-chat')) === 1);
  await click('.sp-h a.btn-p');
  check('sequence stage opens on same step', /#\/ap\/einarbeitung\/2/.test(await hash()) && (await count('.stage-wrap .seqbar')) === 1);
  await p.key('ArrowRight', 'ArrowRight', 39); await p.sleep(250);
  check('ArrowRight advances the sequence in presentation', /#\/ap\/einarbeitung\/3/.test(await hash()) && (await count('.stage .m3-planner')) === 1);
  const seqOut = await p.eval(`window.__exportSeq().then(r=>r)`);
  check('whole sequence exports 5 PNGs in story order', seqOut.length === 5 && seqOut.every((r, i) => r.name.startsWith(('0' + (i + 1)).slice(-2) + '-') && r.size > 30000), JSON.stringify(seqOut.map(r => r.name)));
  // focused task editing: one identity in Planner, To Do and Prinzip
  await p.goto(BASE + '#/s/leadership-forum/eigenes-team/szene/planner');
  await setInput('form.contentf input[name="tasks.0"]', 'Einladung an alle 60 Teilnehmenden versenden');
  check('task edit keeps focus and updates Planner live', (await p.eval('document.activeElement.name')) === 'tasks.0' && /Einladung an alle 60/.test(await $('.m3-planner', 'innerText')) && /angepasst/.test(await $('.cstate')));
  await click('.screens a[href$="/szene/todo"]');
  const todoHas = /Einladung an alle 60/.test(await $('.m3-todo', 'innerText'));
  await p.goto(BASE + '#/s/leadership-forum/eigenes-team/prinzip/tasks');
  check('renamed task identical in To Do (Daniel) and Prinzip', todoHas && /Einladung an alle 60/.test(await $('.pr', 'innerText')));
  // long names and filenames stay readable in exported Outlook slide
  await p.goto(BASE + '#/s/leadership-forum/eigenes-team/szene/outlook');
  await setInput('input[name="p:mara-conti"]', 'Maximiliane Alexandra von Wartensee-Bürgisser');
  await setInput('form.contentf input[name="docName"]', 'Veranstaltungsplan Leadership Forum 2027 – Gesamtübersicht abgestimmt.xlsx');
  await p.goto(BASE + '#/p/leadership-forum/eigenes-team/szene/outlook/folie'); await p.sleep(150);
  const att = await p.eval(`(()=>{const s=document.querySelector('.stage .o-att strong');return {w:s.scrollWidth<=s.clientWidth+1, txt:s.textContent}})()`);
  check('long attachment name fully visible (no ellipsis), slide fits', att.w && /Mara\.xlsx$/.test(att.txt) && (await p.eval(`Export.fitIssues(document.querySelector('.stage-in')).length`)) === 0, JSON.stringify(att));
  check('annotation badges are circles', await p.eval(`[...document.querySelectorAll('.stage .m-mk')].every(e=>{const r=e.getBoundingClientRect();return Math.abs(r.width-r.height)<1})`));
  // 2x export
  await p.eval('(()=>{const t=document.querySelector("[data-act=hires]");t.checked=true;t.dispatchEvent(new Event("change",{bubbles:true}))})()');
  const hi = await p.eval(`(async()=>{const b=await window.__exportPng();const u=new Uint8Array(await b.arrayBuffer());const dv=new DataView(u.buffer);return {w:dv.getUint32(16),h:dv.getUint32(20),name:window.__lastPng.name}})()`);
  check('2× export produces 3840×2160 PNG', hi.w === 3840 && hi.h === 2160 && /@2x\.png$/.test(hi.name), JSON.stringify(hi));
  await p.eval('(()=>{const t=document.querySelector("[data-act=hires]");t.checked=false;t.dispatchEvent(new Event("change",{bubbles:true}))})()');
  // persistence + JSON
  await p.goto(BASE + '#/s/leadership-forum/eigenes-team/szene/outlook'); await p.eval('location.reload()'); for (let i = 0; i < 50 && !(await p.eval("!!document.querySelector('.m3')").catch(() => false)); i++) await p.sleep(100);
  check('customisations persist after reload (localStorage)', /Maximiliane/.test(await $('.m3', 'innerText')));
  await click('[data-act="json-export"]');
  const js = await p.eval('JSON.stringify(window.__lastJson)');
  check('JSON download is versioned and contains customisations', /"schema":"msteams-personas.customisations"/.test(js) && /"version":1/.test(js) && /Maximiliane/.test(js));
  await p.eval('window.confirm = () => true');
  await click('[data-act="reset-all"]');
  check('reset all restores originals', /Mara Conti/.test(await $('.m3', 'innerText')) && /Original/.test(await $('.cstate')));
  const bad = await p.eval(`window.__importJson('{"schema":"x","version":1}')`);
  const bad2 = await p.eval(`window.__importJson(${JSON.stringify(JSON.stringify({ schema: 'msteams-personas.customisations', version: 1, names: { 'unbekannt': { team: 'x' } } }))})`);
  const ok = await p.eval(`window.__importJson(${JSON.stringify(js)})`);
  await p.sleep(200);
  check('JSON import validates schema and situations, restores customisations', !!bad && !!bad2 && ok === null && /Maximiliane/.test(await $('.m3', 'innerText')), [bad, bad2, ok].join(' / '));
  // realistic long post: honest fit warning instead of silent truncation
  await p.goto(BASE + '#/s/heat-health/gruppenteam/szene/posts');
  await setInput('form.contentf textarea[name="posts.0.text"]', 'Die Revision ist eingereicht. '.repeat(30));
  check('long post text: workspace shows a fit warning (no silent truncation)', await p.eval(`!document.querySelector('.fit-warn').hidden && /Fokus-Ausschnitt/.test(document.querySelector('.fit-warn').textContent)`));
  await p.goto(BASE + '#/p/heat-health/gruppenteam/szene/posts/folie'); await p.sleep(150);
  check('long post text: stage reports the fit issue before export', /Hinweis/.test(await $('#png-status')));
  await p.goto(BASE + '#/s/heat-health/gruppenteam/szene/posts');
  await setInput('form.contentf textarea[name="posts.0.text"]', '');
  // Planner task details
  await p.goto(BASE + '#/s/onboarding/kanal/szene/plantask');
  check('Planner task details: owner, checklist and comment for the same task', /Zugang Ticketsystem freischalten/.test(await $('.pt-dlg', 'innerText')) && (await count('.pt-check li')) === 3 && /Thomas Lüthi/.test(await $('.pt-who', 'innerText')));
  // AI simulation
  await p.goto(BASE + '#/a/ki-besprechung/1');
  check('AI recap labelled as simulation with human review states', /Simulation für Schulungszwecke/.test(await $('.m3-recap', 'innerText')) && (await count('.r-s')) === 4 && /Verworfen/.test(await $('.m3-recap', 'innerText')) && /Teams Premium/.test(await $('#visual', 'innerText')));
  await click('.seqbar [data-act="seq-next"]');
  const pl = await $('.m3-planner', 'innerText');
  check('Planner shows only reviewed AI tasks (edited text, rejected absent)', /Aus Projektsitzung/.test(pl) && /zwei Personen im Innendienst/.test(pl) && !/Schulung des Innendienstes planen/.test(pl));
  // offline: every loaded resource is local
  const ext = await p.eval(`performance.getEntriesByType('resource').map(r=>r.name).filter(n=>!n.startsWith(location.origin)&&!n.startsWith('data:')&&!n.startsWith('blob:'))`);
  check('offline: no external resources loaded', ext.length === 0, ext.join(' '));
  await p.eval('window.confirm = () => true');

  // Entry 3: configurator
  await p.goto(BASE + '#/');
  await click('.own a[href="#/konfigurator/1"]');
  check('configurator step 1', /Frage 1 von 6/.test(await $('.cfg-prog')));
  await click('input[name="context"][value="hochschule"]');
  await click('#cfg-form button[type=submit]');
  await click('input[name="size"][value="9+"]');
  await click('#cfg-form button[type=submit]');
  await click('.cfg-nav a[href="#/konfigurator/2"]');
  check('Back keeps previous answer', await p.eval('document.querySelector("input[name=size][value=\'9+\']").checked'));
  await p.shot(OUT + '12-configurator-question.png', true);
  for (let i = 2; i <= 6; i++) await click('#cfg-form button[type=submit]');
  check('result page', /ergebnis/.test(await hash()) && /Projektteam/.test(await $('.res-main h2')));
  check('rationale + alternative shown', (await count('.why li')) >= 2 && (await count('.res-alt')) === 1);
  check('suggestion is Leadership Forum for university project', /Leadership Forum/.test(await $('.res-base')));
  check('earlier customisation preserved after changing answers', /Sina Fehr/.test(await $('#preview', 'innerText')));
  await setInput('.res-edit input[name="p:lea-baumann"]', 'Lena Brunner');
  check('live preview updates names', /Lena Brunner/.test(await $('#preview', 'innerText')));
  await p.shot(OUT + '13-configurator-result.png', true);
  // a different answer set -> different structure
  await p.goto(BASE + '#/konfigurator/1');
  await click('input[name="goal"][value="eigen"]');
  await click('#cfg-form button[type=submit]');
  await click('input[name="size"][value="1"]');
  await click('#cfg-form button[type=submit]');
  await p.goto(BASE + '#/konfigurator/5');
  await click('input[name="share"][value="persoenlich"]');
  await click('#cfg-form button[type=submit]');
  await click('#cfg-form button[type=submit]');
  check('different answers -> personal starting point', /Persönliche Ablage/.test(await $('.res-main h2')) && (await count('#preview .m3-onedrive')) === 1);
  await p.shot(OUT + '14-configurator-result-personal.png', true);
  await p.eval('window.confirm = () => true');
  await click('[data-act="reset"]');
  check('reset returns to step 1 with defaults', (await hash()) === '#/konfigurator/1' && await p.eval('document.querySelector("input[name=goal][value=projekt]").checked'));

  // Remaining university worlds: complete scenes and explicit variants
  await p.size(1440, 900);
  await p.goto(BASE + '#/s/sitzungszyklus/gastzugang/szene');
  check('commission guest variant lists external member, marked extern', /Beat Kunz\s*extern/.test(await $('.t-memlist', 'innerText')));
  await p.shot(OUT + '40-commission-szene-gast.png', true);
  await click('a.var[href*="/link/"]');
  check('commission link variant: external member not in team', !/Beat Kunz/.test(await $('.t-memlist', 'innerText') || ''));
  await p.goto(BASE + '#/s/sitzungszyklus/link/prinzip/tasks');
  check('commission tasks principle: lean, no plan', /Kein eigener Aufgabenplan/.test(await $('.pd-after', 'innerText')));
  await p.shot(OUT + '41-commission-prinzip-tasks.png', true);
  await p.goto(BASE + '#/s/semesterstart/mit-bewertung/szene');
  check('teaching variant adds Bewertung channel', /Bewertung/.test(await $('.t-chans', 'innerText')));
  await p.goto(BASE + '#/s/semesterstart/ohne-bewertung/prinzip/doc');
  await p.shot(OUT + '42-teaching-prinzip-doc.png', true);
  await p.goto(BASE + '#/s/heat-health/gruppenteam/szene');
  check('research scene: three posts, no variant switcher', (await count('.t-post')) === 3 && (await count('.variants')) === 0);
  await p.shot(OUT + '43-research-szene.png', true);
  await p.goto(BASE + '#/s/nora-reihe/-/prinzip/tasks');
  check('Nora series principle shows secretariat as non-person owner', /Sekretariat/.test(await $('.pd-after', 'innerText')));
  await p.shot(OUT + '44-nora-reihe-prinzip-tasks.png', true);
  await p.goto(BASE + '#/s/nora-publikation/-/szene/todo');
  check('Nora publication has its own personal scene', /Kapitel 3 kürzen/.test(await $('.m3-todo', 'innerText')));

  // Assumptions survive Hinweise off (scene, principle, stage)
  await p.goto(BASE + '#/s/sitzungszyklus/gastzugang/szene');
  await p.eval('(()=>{const t=document.querySelector("[data-act=annot]");t.checked=false;t.dispatchEvent(new Event("change",{bubbles:true}))})()'); await p.sleep(200);
  check('Hinweise off: scene hides notes but keeps assumption', (await count('.ws-notes')) === 0 && /Gastzugang setzt voraus/.test(await $('.tw-assume')));
  await p.goto(BASE + '#/p/semesterstart/mit-bewertung/prinzip/chat');
  check('Hinweise off: stage keeps boundary, alternative and assumption', (await count('.stage .pr-bound')) === 1 && (await count('.stage .pr-alt')) === 1 && /nicht geprüft/.test(await $('.stage .pr-assume')));
  await p.shot(OUT + '45-present-teaching-clean-assumption.png');
  await p.key('h', 'KeyH', 72);

  // Configurator: Business context with a course answer gets a labelled transferable example
  await p.goto(BASE + '#/konfigurator/1');
  await click('input[name="context"][value="business"]');
  await click('input[name="goal"][value="kurs"]');
  await click('input[name="friction"][value="wissen"]');
  await click('#cfg-form button[type=submit]');
  await click('input[name="size"][value="2-4"]'); await click('input[name="units"][value="eine"]');
  await click('#cfg-form button[type=submit]');
  await click('input[name="rhythm"][value="wiederkehrend"]');
  for (let i = 3; i <= 6; i++) await click('#cfg-form button[type=submit]');
  check('Business + course answer: result labelled as example from Hochschule', /Übertragbares Beispiel aus der Hochschule/.test(await $('.transfer')) && /Hochschule/.test(await $('.res-prev .kick')));
  await p.shot(OUT + '16-configurator-transfer.png', true);
  await p.eval('window.confirm = () => true');
  await click('[data-act="reset"]');

  // Direct links + legacy
  await p.goto(BASE + '#/s/semesterstart/-/prinzip/doc');
  check('direct link to legacy-world Prinzip works', /Persönlicher Entwurf/.test(await $('.pr-h h3')));
  await p.goto(BASE.replace('index.html', 'atlas.html') + '#/w/commission-digital-collaboration');
  await p.sleep(400);
  check('legacy atlas still renders', (await p.eval('document.getElementById("app").innerText.length')) > 500);

  // Keyboard on landing
  await p.goto(BASE + '#/');
  await p.eval('document.activeElement.blur()');
  const seq = [];
  for (let i = 0; i < 12; i++) { await p.key('Tab', 'Tab', 9); seq.push(await p.eval('(document.activeElement.textContent||"").trim().slice(0,20)')); }
  check('keyboard reaches three entries and Eigene Situation', ['Team-Personas', 'Tools', 'Use Cases', 'Eigene Situation'].every(t => seq.some(s => s.startsWith(t))), seq.join(' | '));

  // Mobile 375px
  await p.size(375, 812, 2);
  for (const [name, route] of [['landing', '#/'], ['szene', '#/s/leadership-forum/eigenes-team/szene'], ['prinzip', '#/s/kundenportal/eigenes-team/prinzip/doc'], ['konfigurator', '#/konfigurator/1'], ['praesentation', '#/p/leadership-forum/eigenes-team/prinzip/chat'], ['abfolgen', '#/abfolgen'], ['abfolge-schritt', '#/a/einarbeitung/3'], ['tools', '#/tools'], ['abfolge-praesentation', '#/ap/ki-besprechung/1/folie']]) {
    await p.goto(BASE + route);
    check(`375px ${name}: no horizontal scroll`, await noHScroll());
    await p.shot(OUT + `20-mobile-${name}.png`, !name.includes('praesentation'));
  }
  // 200% zoom on a 1280x800 window = 640x400 CSS px at scale 2
  await p.size(640, 400, 2);
  for (const [name, route] of [['landing', '#/'], ['szene', '#/s/kundenportal/eigenes-team/szene'], ['prinzip', '#/s/leadership-forum/eigenes-team/prinzip/tasks'], ['abfolge', '#/a/entscheid-chat/1'], ['planner', '#/s/onboarding/kanal/szene/planner']]) {
    await p.goto(BASE + route);
    check(`200% zoom ${name}: no horizontal scroll`, await noHScroll());
  }
  await p.shot(OUT + '30-zoom200-prinzip.png');
  check('no JS errors during journey', p.errors.length === 0, p.errors.join(' / '));
} catch (e) {
  check('journey ran without exception', false, e.message);
} finally {
  await p.close();
}
const failed = results.filter(r => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
