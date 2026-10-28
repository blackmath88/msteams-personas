// Browser journey through the real UI in headless Chromium, with screenshots.
// Needs a static server:  python3 -m http.server 8765 --bind 127.0.0.1
// Run:                    node tests/journey.mjs [baseUrl]
import { launch } from './cdp.mjs';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8765/index.html';
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
  check('landing: promise headline', /ohne ein Team zu bauen/.test(await $('h1')));
  check('landing: three entry points', await count('.entries .entry') === 3);
  check('landing: six world cards', await count('.worlds .world') === 6);
  check('landing: business card present', /Brunner/.test(await $('.worlds', 'innerText')));
  await p.shot(OUT + '01-landing-desktop.png', true);

  // Entry 1: Persona
  await click('.entries a[href="#/personas"]');
  check('persona entry navigates', (await hash()) === '#/personas');
  await click('.world a[href="#/personas/nora-keller"]');
  check('Nora world lists her three scenarios', await count('.sits .sit') === 3);
  await click('.sit a[href*="nora-abwesenheit"]');
  check('Nora personal-work scene renders (no Team)', await count('.tw-personal') === 1);
  await p.shot(OUT + '07-nora-personal-scene.png');
  await p.eval('history.back()'); await p.sleep(300);
  check('browser Back returns to persona world', (await hash()) === '#/personas/nora-keller');

  // Entry 2: Use case
  await p.goto(BASE + '#/');
  await click('.entries a[href="#/usecases"]');
  check('use-case entry lists six use cases', await count('.ucs li') === 6);
  await click('.ucs a[href="#/usecases/entscheide"]');
  check('use case converges on situations', await count('.sits .sit') >= 3);
  await click('.sit a[href*="kundenportal"]');
  check('use case opens matching principle', /prinzip\/chat$/.test(await hash()) && /Chat oder Kanal/.test(await $('.pr-h h3')));

  // Business example: Szene with working tabs
  await p.goto(BASE + '#/s/kundenportal/eigenes-team/szene');
  check('business scene: three posts', await count('.tw-post') === 3);
  await p.shot(OUT + '04-business-szene.png', true);
  await click('[data-tab="files"]');
  check('scene tab Dateien works', await count('.tw-files tbody tr') === 4);
  await click('[data-tab="tasks"]');
  check('scene tab Aufgaben works', await count('.tw-tasks li') === 4);
  await p.shot(OUT + '05-business-szene-aufgaben.png');
  await p.eval('document.querySelector("[data-tab=tasks]").focus()');
  await p.key('ArrowLeft', 'ArrowLeft', 37);
  check('arrow key moves between scene tabs', /files/.test(await hash()) && (await p.eval('document.activeElement.dataset.tab')) === 'files');
  await click('a.var[href*="/kanal/"]');
  check('variant switch changes structure', /Marketing & Kommunikation/.test(await $('.tw-team strong')));
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
  check('name change updates Szene live', /Sina Fehr/.test(await $('.tw', 'innerText')) && /Forum Führung 27/.test(await $('.tw-team strong')));
  check('typing keeps focus in field', (await p.eval('document.activeElement.name')) === 'team');
  await click('.modes a[href*="prinzip"]');
  check('name change carried into Prinzip', /Sina Fehr/.test(await $('.pr', 'innerText')) && /Forum Führung 27/.test(await $('.pr-k')));
  await click('a.btn-p[href^="#/p/"]');
  check('presentation opens with custom names', (await count('.stage')) === 1 && /Sina Fehr/.test(await $('.stage', 'innerText')));
  const fit = await p.eval(`(()=>{const r=document.querySelector('.stage').getBoundingClientRect();return r.right<=innerWidth&&r.bottom<=innerHeight&&Math.abs(r.width/r.height-16/9)<0.01})()`);
  check('stage is 16:9 and fits viewport', fit);
  check('site chrome hidden in presentation', (await p.eval('getComputedStyle(document.querySelector(".site")).display')) === 'none');
  const clipped = await p.eval(`(()=>{const v=document.querySelector('.stage-in').firstElementChild;const d=document.querySelector('.stage-in .pd').getBoundingClientRect(),f=document.querySelector('.stage-in .pr-foot').getBoundingClientRect();return (v.scrollHeight>v.clientHeight+2?1:0)+(d.bottom>f.top+1?1:0)})()`);
  check('presentation content not clipped (Prinzip)', clipped === 0, clipped + ' clipped');
  await p.shot(OUT + '08-present-prinzip-annot.png');
  await p.key('h', 'KeyH', 72);
  check('H toggles annotations off', (await count('.stage .pr-bound')) === 0);
  await p.shot(OUT + '09-present-prinzip-clean.png');
  await p.key('h', 'KeyH', 72);
  await p.key('Escape', 'Escape', 27);
  check('Escape exits presentation to same view', /^#\/s\/leadership-forum\/eigenes-team\/prinzip/.test(await hash()) && (await count('.stage')) === 0);
  await p.goto(BASE + '#/p/kundenportal/eigenes-team/szene/posts');
  const stageFits = () => p.eval(`(()=>{const v=document.querySelector('.stage-in').firstElementChild;const m=v.querySelector('.tw-main')||v;return v.scrollHeight<=v.clientHeight+2&&m.scrollHeight<=m.clientHeight+2&&!document.querySelector('.stage-overflow')})()`);
  const sClip = (await stageFits()) ? 0 : 1;
  check('presentation Szene posts not clipped', sClip === 0, sClip + ' clipped');
  await p.shot(OUT + '10-present-business-szene.png');
  for (const sid of ['leadership-forum/eigenes-team', 'leadership-forum/kanal', 'kundenportal/eigenes-team', 'kundenportal/kanal', 'heat-health/-', 'sitzungszyklus/gastzugang', 'sitzungszyklus/link', 'semesterstart/ohne-bewertung', 'semesterstart/mit-bewertung', 'nora-publikation/-', 'nora-abwesenheit/-', 'nora-reihe/-']) for (const v of ['prinzip/chat', 'prinzip/doc', 'prinzip/tasks', 'szene/posts', 'szene/files', 'szene/tasks']) {
    await p.goto(BASE + `#/p/${sid}/${v}`); await p.sleep(150);
    const ok = await stageFits();
    if (!ok) check(`stage fits: ${sid} ${v}`, false);
    for (const route of [`#/p/${sid}/${v}`, `#/s/${sid}/${v}`]) {
      if (route[2] === 's') { await p.goto(BASE + route); await p.sleep(100); }
      if (/\{p:|\{s\}|\{c\}/.test(await p.eval('document.body.innerText'))) check(`no raw tokens: ${route}`, false);
    }
  }
  check('stage fit + token sweep (12 situation/variant combinations × 6 views, stage and page) done', true);
  await p.goto(BASE + '#/p/kundenportal/eigenes-team/prinzip/doc');
  await p.shot(OUT + '15-present-business-prinzip-doc.png');
  await p.goto(BASE + '#/p/nora-reihe/-/szene');
  await p.shot(OUT + '11-present-nora.png');

  // Entry 3: configurator
  await p.goto(BASE + '#/');
  await click('.entries a[href="#/konfigurator/1"]');
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
  check('different answers -> personal starting point', /Persönliche Ablage/.test(await $('.res-main h2')) && (await count('#preview .tw-personal')) === 1);
  await p.shot(OUT + '14-configurator-result-personal.png', true);
  await p.eval('window.confirm = () => true');
  await click('[data-act="reset"]');
  check('reset returns to step 1 with defaults', (await hash()) === '#/konfigurator/1' && await p.eval('document.querySelector("input[name=goal][value=projekt]").checked'));

  // Remaining university worlds: complete scenes and explicit variants
  await p.size(1440, 900);
  await p.goto(BASE + '#/s/sitzungszyklus/gastzugang/szene');
  check('commission guest variant lists external member, marked extern', /Beat Kunz\s*extern/.test(await $('.tw-mem', 'innerText')));
  await p.shot(OUT + '40-commission-szene-gast.png', true);
  await click('a.var[href*="/link/"]');
  check('commission link variant: external member not in team', !/Beat Kunz/.test(await $('.tw-mem', 'innerText')));
  await p.goto(BASE + '#/s/sitzungszyklus/link/prinzip/tasks');
  check('commission tasks principle: lean, no plan', /Kein eigener Aufgabenplan/.test(await $('.pd-after', 'innerText')));
  await p.shot(OUT + '41-commission-prinzip-tasks.png', true);
  await p.goto(BASE + '#/s/semesterstart/mit-bewertung/szene');
  check('teaching variant adds Bewertung channel', /Bewertung/.test(await $('.tw-chans', 'innerText')));
  await p.goto(BASE + '#/s/semesterstart/ohne-bewertung/prinzip/doc');
  await p.shot(OUT + '42-teaching-prinzip-doc.png', true);
  await p.goto(BASE + '#/s/heat-health/gruppenteam/szene');
  check('research scene: three posts, no variant switcher', (await count('.tw-post')) === 3 && (await count('.variants')) === 0);
  await p.shot(OUT + '43-research-szene.png', true);
  await p.goto(BASE + '#/s/nora-reihe/-/prinzip/tasks');
  check('Nora series principle shows secretariat as non-person owner', /Sekretariat/.test(await $('.pd-after', 'innerText')));
  await p.shot(OUT + '44-nora-reihe-prinzip-tasks.png', true);
  await p.goto(BASE + '#/s/nora-publikation/-/szene');
  check('Nora publication has its own personal scene', /Kapitel 3 kürzen/.test(await $('.tw', 'innerText')));

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
  for (let i = 0; i < 9; i++) { await p.key('Tab', 'Tab', 9); seq.push(await p.eval('(document.activeElement.textContent||"").trim().slice(0,20)')); }
  check('keyboard reaches all three entries', ['Persona wählen', 'Use Case wählen', 'Eigene Situation'].every(t => seq.some(s => s.includes(t.slice(0, 10)))), seq.join(' | '));

  // Mobile 375px
  await p.size(375, 812, 2);
  for (const [name, route] of [['landing', '#/'], ['szene', '#/s/leadership-forum/eigenes-team/szene'], ['prinzip', '#/s/kundenportal/eigenes-team/prinzip/doc'], ['konfigurator', '#/konfigurator/1'], ['praesentation', '#/p/leadership-forum/eigenes-team/prinzip/chat']]) {
    await p.goto(BASE + route);
    check(`375px ${name}: no horizontal scroll`, await noHScroll());
    await p.shot(OUT + `20-mobile-${name}.png`, name !== 'praesentation');
  }
  // 200% zoom on a 1280x800 window = 640x400 CSS px at scale 2
  await p.size(640, 400, 2);
  for (const [name, route] of [['landing', '#/'], ['szene', '#/s/kundenportal/eigenes-team/szene'], ['prinzip', '#/s/leadership-forum/eigenes-team/prinzip/tasks']]) {
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
