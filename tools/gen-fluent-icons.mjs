// Regenerate the icon table in src/m365.js (P and PF) from @fluentui/svg-icons:
//   npm pack @fluentui/svg-icons@1.1.340 && tar xzf fluentui-svg-icons-1.1.340.tgz
//   node tools/gen-fluent-icons.mjs package/icons table.js   → paste table.js over P and PF
import { readFileSync, writeFileSync } from 'node:fs';
const [dir, out] = process.argv.slice(2);
const MAP = { activity:'alert', chat:'chat', teams:'people_team', calendar:'calendar_ltr', calls:'call', onedrive:'cloud', apps:'apps', more:'more_horizontal', search:'search', back:'chevron_left', fwd:'chevron_right', up:'arrow_up', refresh:'arrow_clockwise', video:'video', info:'info', reply:'arrow_reply', smile:'emoji', edit:'edit', plus:'add', upload:'arrow_upload', share:'share', link:'link', sync:'arrow_sync', download:'arrow_download', filter:'filter', chevron:'chevron_right', chevd:'chevron_down', mail:'mail', people:'people', clip:'attach', inbox:'mail_inbox', send:'send', draft:'drafts', trash:'delete', home:'home', star:'star', pc:'desktop', pic:'image', cut:'cut', copy:'copy', paste:'clipboard_paste', sort:'arrow_sort', view:'text_align_justify', check:'checkmark', waffle:'grid_dots', gear:'settings', bell:'alert', window:'subtract', max:'square', close:'dismiss', lock:'lock_closed', sun:'weather_sunny', flag:'flag', sparkle:'sparkle', listcheck:'task_list_ltr', board:'board', clock:'clock', comment:'comment', attach:'attach', x:'dismiss' };
const FILLED = ['activity', 'chat', 'teams', 'calendar', 'calls', 'onedrive', 'apps', 'mail', 'people', 'listcheck', 'board', 'home', 'check', 'x'];
const paths = f => { const s = readFileSync(`${dir}/${f}.svg`, 'utf8'); if (/fill-rule|transform|<(?!svg|path|\/svg)/.test(s)) throw new Error('unexpected markup in ' + f); return [...s.matchAll(/<path d="([^"]+)"/g)].map(m => m[1]); };
const line = (k, f) => `    ${k}: ${JSON.stringify(paths(f)).replace(/"/g, "'")} /* ${f} */`;
const reg = Object.entries(MAP).map(([k, v]) => line(k, v + '_20_regular')).join(',\n');
const fil = FILLED.map(k => line(k, MAP[k] + '_20_filled')).join(',\n');
writeFileSync(out, `  var P = {\n${reg}\n  };\n  var PF = {\n${fil}\n  };\n`);
