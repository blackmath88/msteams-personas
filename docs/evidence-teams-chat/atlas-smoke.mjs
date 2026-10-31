import { launch } from '../../tools/cdp.mjs';
const p = await launch({port:0});
let passed = 0;
try {
  await p.goto('http://127.0.0.1:8766/atlas.html');
  const ids = await p.eval('HE_WORLDS.worlds.map(w=>w.id)');
  for (const id of ids) for (const view of ['heute', 'm365', 'vergleich']) {
    await p.goto(`http://127.0.0.1:8766/atlas.html#/w/${id}/${view}`);
    const ok = await p.eval(`(()=>{const panel=document.querySelector('[role="tabpanel"]:not([hidden])');return !!panel && panel.id==='panel-${view}' && panel.innerText.length>100})()`);
    console.log(`${ok ? 'PASS' : 'FAIL'} ${id}/${view}`);
    if (!ok) throw new Error('Missing atlas view');
    passed++;
  }
  if (p.errors.length) throw new Error(p.errors.join('\n'));
} finally { await p.close(); }
console.log(`${passed}/15 passed; no script errors`);
