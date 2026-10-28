// Validates worlds.js (schema v2). Usage: node check-worlds.mjs
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), 'worlds.js');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
const D = ctx.window.HE_WORLDS;

const errors = [], warns = [];
const err = m => errors.push(m), warn = m => warns.push(m);
const isArr = Array.isArray;
const isObj = v => v && typeof v === 'object' && !isArr(v);
const need = (o, keys, where) => {
  if (!isObj(o)) return err(`${where}: not an object`);
  for (const k of keys) if (!(k in o)) err(`${where}: missing key "${k}"`);
};
const uniq = (ids, where) => {
  const seen = new Set();
  for (const id of ids) {
    if (typeof id !== 'string' || !id) err(`${where}: invalid id ${JSON.stringify(id)}`);
    else if (seen.has(id)) err(`${where}: duplicate id "${id}"`);
    seen.add(id);
  }
  return seen;
};
let nulls = 0;
const countNulls = v => {
  if (v === null) nulls++;
  else if (isArr(v)) v.forEach(countNulls);
  else if (isObj(v)) Object.values(v).forEach(countNulls);
};

if (!isObj(D)) { console.error('window.HE_WORLDS missing'); process.exit(1); }
need(D, ['schema', 'status', 'fictional', 'locale', 'purpose', 'sources', 'modules', 'worlds'], 'root');
if (D.schema !== 'm365-toolbox.higher-education-worlds/v2') err(`root: unexpected schema "${D.schema}"`);
const SRC = new Set(Object.keys(D.sources || {}));
for (const k of ['MS', 'P', 'S']) if (!SRC.has(k)) err(`sources: missing "${k}"`);
const STATES = new Set(['personal', 'shared', 'institutional', null]);

const mods = isArr(D.modules) ? D.modules : [];
mods.forEach((m, i) => need(m, ['id', 'nr', 'title', 'question'], `modules[${i}]`));
const modIds = uniq(mods.map(m => m.id), 'modules');

const WKEYS = ['id', 'type', 'name', 'tagline', 'tension', 'unit_type', 'rhythm', 'lifecycle', 'size', 'people',
  'collaboration', 'work_mix', 'personal_vs_shared', 'artefacts', 'scenarios', 'consulting_questions', 'boundary', 'training_hooks'];
const worlds = isArr(D.worlds) ? D.worlds : [];
uniq(worlds.map(w => w.id), 'worlds');
const surnames = new Map();
let nPeople = 0, nArt = 0, nSc = 0, nDp = 0;

for (const w of worlds) {
  const W = `world "${w.id}"`;
  need(w, WKEYS, W);
  countNulls(w);
  const people = isArr(w.people) ? w.people : [];
  people.forEach((p, i) => need(p, ['id', 'name', 'role', 'focus', 'stays_personal', 'shares'], `${W} people[${i}]`));
  const pIds = uniq(people.map(p => p.id), `${W} people`);
  nPeople += people.length;
  for (const p of people) {
    const sn = String(p.name).replace(/^((Prof|Dr)\.\s*)+/, '').trim().split(/\s+/).pop();
    if (!surnames.has(sn)) surnames.set(sn, []);
    surnames.get(sn).push(`${p.name} (${w.id})`);
  }
  need(w.collaboration, ['close_internal', 'occasional_internal', 'external'], `${W} collaboration`);
  if (w.work_mix !== null) need(w.work_mix, ['individual_percent', 'examples'], `${W} work_mix`);
  need(w.personal_vs_shared, ['stays_personal', 'shared', 'moves_to_shared'], `${W} personal_vs_shared`);
  (w.personal_vs_shared?.moves_to_shared || []).forEach((m, i) => need(m, ['when', 'why'], `${W} moves_to_shared[${i}]`));

  const arts = isArr(w.artefacts) ? w.artefacts : [];
  nArt += arts.length;
  arts.forEach((a, i) => need(a, ['id', 'name', 'owner', 'state', 'lifespan', 'sensitivity', 'where_now', 'where_better'], `${W} artefacts[${i}]`));
  uniq(arts.map(a => a.id), `${W} artefacts`);
  for (const a of arts) {
    if (a.owner !== null && !pIds.has(a.owner)) err(`${W} artefact "${a.id}": unknown owner "${a.owner}"`);
    if (!STATES.has(a.state)) err(`${W} artefact "${a.id}": invalid state "${a.state}"`);
  }

  const scs = isArr(w.scenarios) ? w.scenarios : [];
  nSc += scs.length;
  uniq(scs.map(s => s.id), `${W} scenarios`);
  for (const s of scs) {
    const S = `${W} scenario "${s.id}"`;
    need(s, ['id', 'name', 'trigger', 'description', 'stakes', 'stages', 'current_state', 'decision_points', 'm365_model'], S);
    need(s.current_state, ['frictions'], `${S} current_state`);
    (s.stages || []).forEach((g, i) => need(g, ['id', 'stage', 'question'], `${S} stages[${i}]`));
    uniq((s.stages || []).map(g => g.id), `${S} stages`);
    if (s.m365_model !== null) need(s.m365_model, ['team', 'channels', 'planner_buckets', 'notes'], `${S} m365_model`);
    const dps = s.decision_points || [];
    nDp += dps.length;
    uniq(dps.map(d => d.id), `${S} decision_points`);
    dps.forEach((d, i) => {
      const D_ = `${S} decision_points[${i}]`;
      need(d, ['id', 'question', 'modules', 'options', 'pick', 'not_do', 'source'], D_);
      for (const m of d.modules || []) if (!modIds.has(m)) err(`${D_}: unknown module "${m}"`);
      if (!SRC.has(d.source)) err(`${D_}: invalid source "${d.source}"`);
      (d.options || []).forEach((o, j) => need(o, ['label', 'fits_when', 'tradeoff'], `${D_} options[${j}]`));
      need(d.pick, ['label', 'why'], `${D_} pick`);
    });
  }

  const th = w.training_hooks || {};
  for (const m of modIds) {
    if (!(m in th)) err(`${W} training_hooks: missing module "${m}"`);
    else need(th[m], ['prompt', 'decisions'], `${W} training_hooks.${m}`);
  }
  for (const k of Object.keys(th)) if (!modIds.has(k)) err(`${W} training_hooks: unknown module "${k}"`);
}


// ---- atlas layer (window.HE_ATLAS) ----
const A = ctx.window.HE_ATLAS;
const PATTERNS = new Set(['continuous', 'mixed', 'solo', 'periodic', 'cyclic']);
const ROLES = new Set(['valid', 'wrong', 'duplicate', 'dependency', 'specialist']);
const KINDS = new Set(['mail', 'calendar', 'table', 'doc', 'chat', 'list', 'people', 'folder', 'laptop', 'building', 'box']);
const ZONES = new Set(['personal', 'shared', 'institutional', 'outside']);
const CATS = ['communication', 'documents', 'tasks', 'knowledge', 'attention'];
if (!isObj(A)) err('window.HE_ATLAS missing');
else {
  for (const id of Object.keys(A)) if (!worlds.some(w => w.id === id)) err(`atlas: unknown world "${id}"`);
  for (const w of worlds) {
    const a = A[w.id], X = `atlas "${w.id}"`;
    if (!a) { err(`${X}: missing`); continue; }
    need(a, ['label', 'shape', 'pattern', 'footprint', 'flow', 'map', 'tools', 'shifts', 'zones', 'model', 'picks', 'anti', 'scenes'], X);
    if (!PATTERNS.has(a.pattern)) err(`${X}: invalid pattern "${a.pattern}"`);
    const pIds = new Set(w.people.map(p => p.id));
    for (const k of ['outside', 'external_people']) for (const id of a.map?.[k] || []) if (!pIds.has(id)) err(`${X} map.${k}: unknown person "${id}"`);
    (a.tools || []).forEach((t, i) => {
      need(t, ['name', 'use', 'role', 'kind'], `${X} tools[${i}]`);
      if (!ROLES.has(t.role)) err(`${X} tools[${i}]: invalid role "${t.role}"`);
      if (!KINDS.has(t.kind)) err(`${X} tools[${i}]: invalid kind "${t.kind}"`);
    });
    const collab = new Set(Object.values(w.collaboration).flat());
    for (const t of a.map?.temporary || []) if (!collab.has(t)) err(`${X} map.temporary: "${t}" is not in collaboration`);
    const f = a.flow;
    const steps = f?.type === 'overlay' ? f.overlay?.steps : f?.steps;
    if (!['sequence', 'overlay'].includes(f?.type)) err(`${X} flow.type invalid`);
    if (f?.type === 'overlay') need(f.base, ['label', 'text'], `${X} flow.base`);
    if (!isArr(steps) || steps.length < 3) err(`${X} flow: needs at least 3 steps`);
    (steps || []).forEach((g, i) => { need(g, ['t', 'z', 'n'], `${X} flow step ${i}`); if (!ZONES.has(g.z)) err(`${X} flow step ${i}: invalid zone "${g.z}"`); });
    const shifts = a.shifts || [];
    if (shifts.length < 3 || shifts.length > 6) err(`${X} shifts: expected 3-6, got ${shifts.length}`);
    const artIds = new Set(w.artefacts.map(x => x.id));
    shifts.forEach((x, i) => {
      need(x, ['from', 'role', 'to', 'zone', 'kind', 'ref'], `${X} shifts[${i}]`);
      if (!ROLES.has(x.role)) err(`${X} shifts[${i}]: invalid role "${x.role}"`);
      if (!ZONES.has(x.zone)) err(`${X} shifts[${i}]: invalid zone "${x.zone}"`);
      if (!['move', 'stay'].includes(x.kind)) err(`${X} shifts[${i}]: invalid kind "${x.kind}"`);
      if (x.ref !== null && !artIds.has(x.ref)) err(`${X} shifts[${i}]: unknown artefact "${x.ref}"`);
    });
    need(a.zones, ['institutional', 'outside'], `${X} zones`);
    const sc = a.scenes, nShift = shifts.length;
    const mark = (m, where) => { if (m !== null && !(Number.isInteger(m) && m >= 1 && m <= nShift)) err(`${where}: mark ${m} outside 1..${nShift}`); };
    const person = (id, where) => { if (/^[a-z]+(-[a-z]+)+$/.test(id) && !pIds.has(id)) err(`${where}: unknown person "${id}"`); };
    need(sc, ['today', 'target'], `${X} scenes`);
    (sc?.today?.items || []).forEach((it, i) => {
      const W_ = `${X} scenes.today[${i}]`;
      need(it, ['type', 'who', 'title', 'meta', 'role', 'mark'], W_);
      if (!['mail', 'chat', 'file', 'folder', 'local'].includes(it.type)) err(`${W_}: invalid type "${it.type}"`);
      if (!ROLES.has(it.role)) err(`${W_}: invalid role "${it.role}"`);
      person(it.who, W_); mark(it.mark, W_);
    });
    const t = sc?.target || {};
    if (!['team', 'personal'].includes(t.kind)) err(`${X} scenes.target: invalid kind "${t.kind}"`);
    if (t.kind === 'team') {
      const ch = w.scenarios[0].m365_model?.channels || [];
      if (!ch.includes(t.active)) err(`${X} scenes.target.active "${t.active}" is not a channel in m365_model`);
      (t.posts || []).forEach((q, i) => { need(q, ['by', 'time', 'text', 'file', 'mark'], `${X} posts[${i}]`); person(q.by, `${X} posts[${i}]`); mark(q.mark, `${X} posts[${i}]`); });
    }
    (t.files || []).forEach((f_, i) => { need(f_, ['name', 'meta'], `${X} target.files[${i}]`); mark(f_.mark ?? null, `${X} target.files[${i}]`); });
    (t.systems || []).forEach((y, i) => mark(y.mark ?? null, `${X} target.systems[${i}]`));
    for (const c of CATS) need(a.model?.[c], ['change', 'stay', 'm365', 'outside'], `${X} model.${c}`);
    const dps = new Set(w.scenarios.flatMap(s => s.decision_points.map(d => d.id)));
    for (const id of a.picks || []) if (!dps.has(id)) err(`${X} picks: unknown decision "${id}"`);
  }
}

for (const [sn, list] of surnames) if (list.length > 1) warn(`surname "${sn}" used ${list.length}x: ${list.join(', ')}`);

console.log(`worlds: ${worlds.length}, people: ${nPeople}, artefacts: ${nArt}, scenarios: ${nSc}, decision points: ${nDp}, null fields: ${nulls}`);
warns.forEach(m => console.log('WARN  ' + m));
errors.forEach(m => console.log('ERROR ' + m));
console.log(`${errors.length} error(s), ${warns.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
