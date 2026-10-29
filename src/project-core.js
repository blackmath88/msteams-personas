/*
 * Portable projects («Slides as Code», first increment).
 * One self-contained JSON project format shared by the manual website route and the
 * AI-assistant bridge. Pure functions only: no DOM, no network, no storage. Runs in the
 * browser (window.ProjectCore) and in Node (module.exports) so tests use the same code.
 *
 * Versions are separate on purpose:
 *   projectVersion     shape of the JSON file
 *   capabilityVersion  which screens/profiles and text budgets a project may use
 *   RENDERER_VERSION   the renderer generation the compiler targets (informational)
 *
 * Absence semantics: a task missing from a state snapshot is NOT shown in that state.
 * It is not deleted, and it is not inherited from another state. Snapshots are complete
 * for the objects they include; there are no patch chains.
 */
(function (root, factory) {
  var core = factory();
  if (typeof module === 'object' && module.exports) module.exports = core;
  else root.ProjectCore = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  var FORMAT = 'msteams-personas/project';
  var PROJECT_VERSION = 1;
  var CAPABILITY_VERSION = 1;
  var RENDERER_VERSION = 'v3';
  var MAX_INPUT = 200 * 1024;
  var ID = /^[a-z][a-z0-9-]{0,39}$/;

  /* Supported profiles. Budgets are character limits that keep a 1920x1080 slide legible. */
  var CAPABILITIES = {
    capabilityVersion: CAPABILITY_VERSION,
    rendererVersion: RENDERER_VERSION,
    profiles: {
      'teams-posts': {
        label: 'Teams: Beiträge im Kanal', renderer: 'posts', needs: ['team', 'channel', 'posts'],
        budgets: { team: 40, channel: 30, postTitle: 60, postText: 220, posts: 4 }
      },
      planner: {
        label: 'Planner: gemeinsames Board', renderer: 'planner', needs: ['team', 'state'],
        budgets: { team: 40, taskTitle: 60, bucket: 24, tasks: 8 }
      },
      'prinzip-tasks': {
        label: 'Prinzip: Aufgaben, vorher und nachher', renderer: 'principle:tasks', needs: ['before', 'after'],
        budgets: { title: 60, question: 90, problem: 200, recommendation: 200, boundary: 200 }
      }
    },
    limits: { people: 8, tasks: 12, documents: 8, slides: 6, presenterNotes: 1200 }
  };

  function copy(x) { return JSON.parse(JSON.stringify(x)); }
  function str(x) { return typeof x === 'string'; }
  function len(x) { return str(x) ? x.length : 0; }

  /* ---------- Template: a NEW fictional organisation (not a curated fixture) ---------- */
  function template() {
    return {
      format: FORMAT, projectVersion: PROJECT_VERSION, capabilityVersion: CAPABILITY_VERSION,
      meta: {
        id: 'velotech-werkstatt-uebergabe',
        title: 'Werkstatt-Übergabe ohne verlorene Aufträge',
        organisation: 'Velotech Werkstätten (fiktiv)',
        audience: 'Teamleitungen in Werkstatt und Verkauf',
        goal: 'Zeigen, wie offene Aufträge bei Schichtwechseln sichtbar bleiben',
        locale: 'de-CH', fictional: true,
        source: { kind: 'template', note: 'Vorlage der Bibliothek, fiktiver Inhalt' },
        assumptions: ['Das Team nutzt einen Teams-Kanal und einen gemeinsamen Planner-Plan.'],
        notes: ''
      },
      people: [
        { id: 'p-lina', name: 'Lina Huber', role: 'Leitung Werkstatt' },
        { id: 'p-marco', name: 'Marco Bianchi', role: 'Mechaniker Frühschicht' },
        { id: 'p-aylin', name: 'Aylin Demir', role: 'Mechanikerin Spätschicht' },
        { id: 'p-jonas', name: 'Jonas Keller', role: 'Verkauf und Annahme' }
      ],
      documents: [{ id: 'd-uebergabe', name: 'Schichtübergabe Werkstatt.docx' }],
      tasks: [
        { id: 't-bremsen', title: 'E-Bike Meier: Bremsen entlüften' },
        { id: 't-ersatz', title: 'Ersatzteil Akku bestellen' },
        { id: 't-kunde', title: 'Kundin Rossi zurückrufen' },
        { id: 't-lager', title: 'Lagerliste Schläuche prüfen' }
      ],
      states: [
        { id: 'before', label: 'Heute', tasks: {
          't-bremsen': { owner: 'p-marco', list: 'personal' },
          't-ersatz': { owner: 'p-marco', list: 'personal' },
          't-kunde': { owner: 'p-jonas', list: 'personal' },
          't-lager': { owner: 'p-aylin', list: 'personal' }
        } },
        { id: 'after', label: 'Mit gemeinsamem Plan', tasks: {
          't-bremsen': { owner: 'p-aylin', list: 'plan', bucket: 'Heute', due: 'Do 14.11.' },
          't-ersatz': { owner: 'p-marco', list: 'plan', bucket: 'Bestellungen', due: 'Fr 15.11.' },
          't-kunde': { owner: 'p-jonas', list: 'plan', bucket: 'Heute', due: 'Do 14.11.' },
          't-lager': { owner: 'p-aylin', list: 'personal' }
        } }
      ],
      scenes: [
        { id: 'sc-kanal', profile: 'teams-posts', team: 'Werkstatt Velotech', channel: 'Schichtwechsel', posts: [
          { id: 'q1', by: 'p-marco', time: '13:52', title: 'Übergabe Frühschicht', text: 'E-Bike Meier steht auf Platz 3, Bremsen noch nicht entlüftet. Akku ist bestellt? Weiss ich nicht sicher.', hint: 'Offene Arbeit steht nur im Beitrag, ohne verantwortliche Person.' },
          { id: 'q2', by: 'p-aylin', time: '14:05', title: '', text: 'Übernehme Platz 3. Ich trage es im Plan ein, damit Jonas der Kundin Bescheid geben kann.', document: 'd-uebergabe', hint: 'Die Übergabe verweist auf eine gemeinsame Datei und den Plan.' }
        ] },
        { id: 'sc-plan', profile: 'planner', team: 'Werkstatt Velotech', state: 'after' },
        { id: 'sc-prinzip', profile: 'prinzip-tasks', team: 'Werkstatt Velotech', before: 'before', after: 'after' }
      ],
      slides: [
        { id: 's-1', scene: 'sc-kanal', presenterNotes: 'Fragen: Woran merkt die Spätschicht, was noch offen ist?' },
        { id: 's-2', scene: 'sc-plan', presenterNotes: 'Jede offene Arbeit hat eine Person, einen Termin und einen Bucket.' },
        { id: 's-3', scene: 'sc-prinzip', presenterNotes: 'Persönliche Notizen bleiben persönlich. Nur, was jemand anderes betrifft, kommt in den Plan.',
          teaching: {
            title: 'Gemeinsame Aufgaben gehören in einen Plan',
            question: 'Wer erledigt was bis wann, auch nach dem Schichtwechsel?',
            problem: 'Offene Arbeiten stehen in Beiträgen und persönlichen Listen. Bei der Übergabe geht etwas verloren.',
            recommendation: 'Aufgaben, die eine andere Person übernehmen kann, in den gemeinsamen Plan: mit Person, Termin und Bucket.',
            boundary: 'Kurze persönliche Erinnerungen gehören nicht in den Plan. Der Plan ersetzt kein Gespräch bei der Übergabe.'
          } }
      ]
    };
  }

  /* An empty but valid starting point for «Neue Abfolge». */
  function blank() {
    var p = template();
    p.meta = Object.assign(p.meta, { id: 'neue-abfolge', title: 'Neue Abfolge', organisation: 'Meine Organisation (fiktiv)', audience: '', goal: '', source: { kind: 'manual', note: '' }, assumptions: [], notes: '' });
    p.people = [{ id: 'p-a', name: 'Person A', role: '' }, { id: 'p-b', name: 'Person B', role: '' }];
    p.documents = [];
    p.tasks = [{ id: 't-1', title: 'Erste gemeinsame Aufgabe' }];
    p.states = [
      { id: 'before', label: 'Heute', tasks: { 't-1': { owner: 'p-a', list: 'personal' } } },
      { id: 'after', label: 'Nachher', tasks: { 't-1': { owner: 'p-b', list: 'plan', bucket: 'Offen', due: '' } } }
    ];
    p.scenes = [
      { id: 'sc-kanal', profile: 'teams-posts', team: 'Mein Team', channel: 'Allgemein', posts: [{ id: 'q1', by: 'p-a', time: '09:00', title: '', text: 'Wer übernimmt die erste Aufgabe?' }] },
      { id: 'sc-plan', profile: 'planner', team: 'Mein Team', state: 'after' },
      { id: 'sc-prinzip', profile: 'prinzip-tasks', team: 'Mein Team', before: 'before', after: 'after' }
    ];
    p.slides.forEach(function (s) { s.presenterNotes = ''; });
    p.slides[2].teaching = { title: 'Prinzip', question: 'Wer erledigt was bis wann?', problem: '', recommendation: 'Empfehlung hier eintragen.', boundary: 'Grenze hier eintragen.' };
    return p;
  }

  /* ---------- Input parsing: file text, raw JSON or exactly one JSON code fence ---------- */
  function parseInput(text) {
    if (!str(text) || !text.trim()) return { error: { code: 'empty', message: 'Es wurde nichts eingefügt.' } };
    if (text.length > MAX_INPUT) return { error: { code: 'too-large', message: 'Die Eingabe ist grösser als ' + Math.round(MAX_INPUT / 1024) + ' KB. Ein Projekt dieser Art ist viel kleiner.' } };
    var t = text.trim(), body = t;
    if (t.charAt(0) !== '{') {
      var fences = t.match(/```[a-zA-Z]*\s*\n[\s\S]*?```/g) || [];
      var json = fences.filter(function (f) { return /^```(json)?\s*\n\s*\{/i.test(f); });
      if (json.length > 1) return { error: { code: 'many-blocks', message: 'Es gibt ' + json.length + ' JSON-Blöcke. Bitte genau einen vollständigen Block einfügen.' } };
      if (!json.length && /```(json)?\s*\n\s*\{/i.test(t)) return { error: { code: 'bad-json', message: 'Der JSON-Block ist unvollständig: er endet nicht. Oft wurde die Antwort abgeschnitten. Bitte die ganze Antwort kopieren.' } };
      if (!json.length) return { error: { code: 'no-json', message: 'Kein JSON-Projekt gefunden. Erwartet wird eine Datei, reines JSON oder ein einzelner ```json-Block.' } };
      body = json[0].replace(/^```[a-zA-Z]*\s*\n/, '').replace(/```$/, '').trim();
    }
    try { return { project: JSON.parse(body) }; }
    catch (e) { return { error: { code: 'bad-json', message: 'Das JSON ist unvollständig oder fehlerhaft (' + e.message + '). Oft fehlt das Ende der Antwort.' } }; }
  }

  /* ---------- Validation: structured diagnostics, never mutates ---------- */
  function validate(p) {
    var errors = [], warnings = [];
    function err(code, path, message, extra) { errors.push(Object.assign({ code: code, path: path, message: message, severity: 'error' }, extra || {})); }
    function warn(code, path, message, extra) { warnings.push(Object.assign({ code: code, path: path, message: message, severity: 'warning' }, extra || {})); }
    if (!p || typeof p !== 'object' || Array.isArray(p)) { err('not-object', '', 'Das Projekt ist kein JSON-Objekt.'); return { ok: false, errors: errors, warnings: warnings }; }
    if (p.format !== FORMAT) err('format', 'format', 'Unbekanntes Format. Erwartet: «' + FORMAT + '».');
    if (p.projectVersion !== PROJECT_VERSION) err('project-version', 'projectVersion', 'Projektversion ' + JSON.stringify(p.projectVersion) + ' wird nicht unterstützt (erwartet ' + PROJECT_VERSION + ').');
    if (p.capabilityVersion !== CAPABILITY_VERSION) err('capability-version', 'capabilityVersion', 'Fähigkeitsversion ' + JSON.stringify(p.capabilityVersion) + ' wird nicht unterstützt (erwartet ' + CAPABILITY_VERSION + ').');
    var meta = p.meta || {};
    if (!str(meta.title) || !meta.title.trim()) err('meta-title', 'meta.title', 'Die Abfolge braucht einen Titel.');
    if (meta.fictional !== true) warn('not-fictional', 'meta.fictional', 'Das Projekt ist nicht als fiktiv markiert. Bitte keine echten Personen oder Daten verwenden.');
    var L = CAPABILITIES.limits;
    function list(key, max) {
      var a = p[key];
      if (!Array.isArray(a)) { err('missing-' + key, key, 'Liste «' + key + '» fehlt.'); return []; }
      if (a.length > max) err('too-many-' + key, key, 'Zu viele Einträge in «' + key + '» (' + a.length + ', höchstens ' + max + ').');
      var seen = {};
      a.forEach(function (x, i) {
        if (!x || !str(x.id) || !ID.test(x.id)) err('bad-id', key + '[' + i + '].id', 'Ungültige ID in «' + key + '» an Position ' + (i + 1) + '. Erlaubt: Kleinbuchstaben, Ziffern, Bindestrich.');
        else if (seen[x.id]) err('dup-id', key + '[' + i + '].id', 'Die ID «' + x.id + '» kommt doppelt vor.');
        else seen[x.id] = true;
      });
      return a;
    }
    var people = list('people', L.people), docs = list('documents', L.documents), tasks = list('tasks', L.tasks);
    var states = list('states', 4), scenes = list('scenes', 8), slides = list('slides', L.slides);
    var P = idx(people), D = idx(docs), T = idx(tasks), S = idx(states), SC = idx(scenes);
    people.forEach(function (x, i) { if (!str(x.name) || !x.name.trim()) err('person-name', 'people[' + i + '].name', 'Person ' + (i + 1) + ' hat keinen Namen.'); });
    tasks.forEach(function (x, i) { if (!str(x.title) || !x.title.trim()) err('task-title', 'tasks[' + i + '].title', 'Aufgabe ' + (i + 1) + ' hat keinen Titel.'); });
    function personRef(id, path, where) {
      if (!P[id]) err('unknown-person', path, where + ': Die Person «' + id + '» gibt es in diesem Projekt nicht.', { ref: id, where: where });
    }
    states.forEach(function (st, si) {
      var tk = st.tasks || {};
      if (typeof tk !== 'object' || Array.isArray(tk)) { err('state-tasks', 'states[' + si + '].tasks', 'Zustand «' + st.id + '»: Aufgaben fehlen.'); return; }
      Object.keys(tk).forEach(function (tid) {
        var e = tk[tid] || {}, path = 'states[' + si + '].tasks.' + tid;
        var where = 'Zustand «' + (st.label || st.id) + '», Aufgabe «' + (T[tid] ? T[tid].title : tid) + '»';
        if (!T[tid]) err('unknown-task', path, where + ': Diese Aufgabe gibt es nicht.', { ref: tid });
        if (e.owner != null) personRef(e.owner, path + '.owner', where);
        if (e.list !== 'personal' && e.list !== 'plan') err('task-list', path + '.list', where + ': «list» muss «personal» oder «plan» sein.');
        if (e.list === 'personal' && e.owner == null) err('personal-owner', path + '.owner', where + ': Eine persönliche Aufgabe braucht eine Person.');
        if (len(e.bucket) > CAPABILITIES.profiles.planner.budgets.bucket) warn('long', path + '.bucket', where + ': Bucket-Name ist lang und wird eventuell gekürzt.');
      });
    });
    scenes.forEach(function (sc, i) {
      var path = 'scenes[' + i + ']', prof = CAPABILITIES.profiles[sc.profile];
      if (!prof) { err('unknown-profile', path + '.profile', 'Szene «' + sc.id + '»: Ansicht «' + sc.profile + '» wird nicht unterstützt. Möglich: ' + Object.keys(CAPABILITIES.profiles).join(', ') + '.'); return; }
      var B = prof.budgets;
      if (!str(sc.team) || !sc.team.trim()) err('scene-team', path + '.team', 'Szene «' + sc.id + '» braucht einen Teamnamen.');
      else if (sc.team.length > B.team) warn('long', path + '.team', 'Teamname ist länger als ' + B.team + ' Zeichen.');
      if (sc.profile === 'teams-posts') {
        if (!str(sc.channel) || !sc.channel.trim()) err('scene-channel', path + '.channel', 'Szene «' + sc.id + '» braucht einen Kanal.');
        if (!Array.isArray(sc.posts) || !sc.posts.length) err('scene-posts', path + '.posts', 'Szene «' + sc.id + '» braucht mindestens einen Beitrag.');
        else {
          if (sc.posts.length > B.posts) warn('many-posts', path + '.posts', 'Mehr als ' + B.posts + ' Beiträge passen nicht gut auf eine Folie.');
          sc.posts.forEach(function (q, j) {
            var qp = path + '.posts[' + j + ']', where = 'Teams-Beitrag ' + (j + 1);
            personRef(q.by, qp + '.by', where);
            if (!str(q.text) || !q.text.trim()) err('post-text', qp + '.text', where + ' hat keinen Text.');
            if (len(q.text) > B.postText) warn('long', qp + '.text', where + ': Text ist länger als ' + B.postText + ' Zeichen.');
            if (len(q.title) > B.postTitle) warn('long', qp + '.title', where + ': Betreff ist länger als ' + B.postTitle + ' Zeichen.');
            if (q.document != null && !D[q.document]) err('unknown-document', qp + '.document', where + ': Das Dokument «' + q.document + '» gibt es nicht.', { ref: q.document });
          });
        }
      }
      if (sc.profile === 'planner') {
        if (!S[sc.state]) err('unknown-state', path + '.state', 'Planner-Szene «' + sc.id + '»: Zustand «' + sc.state + '» fehlt.');
        else if (!planTasks(p, sc.state).length) warn('empty-plan', path + '.state', 'Im Zustand «' + sc.state + '» steht keine Aufgabe im gemeinsamen Plan.');
      }
      if (sc.profile === 'prinzip-tasks') {
        if (!S[sc.before]) err('unknown-state', path + '.before', 'Prinzip-Szene: Vorher-Zustand «' + sc.before + '» fehlt.');
        if (!S[sc.after]) err('unknown-state', path + '.after', 'Prinzip-Szene: Nachher-Zustand «' + sc.after + '» fehlt.');
      }
    });
    slides.forEach(function (sl, i) {
      var path = 'slides[' + i + ']', sc = SC[sl.scene];
      if (!sc) { err('unknown-scene', path + '.scene', 'Folie ' + (i + 1) + ': Szene «' + sl.scene + '» fehlt.'); return; }
      if (len(sl.presenterNotes) > L.presenterNotes) warn('long', path + '.presenterNotes', 'Folie ' + (i + 1) + ': Notizen sind sehr lang.');
      if (sc.profile === 'prinzip-tasks') {
        var t = sl.teaching || {}, B = CAPABILITIES.profiles['prinzip-tasks'].budgets;
        ['title', 'recommendation', 'boundary'].forEach(function (k) {
          if (!str(t[k]) || !t[k].trim()) err('teaching-' + k, path + '.teaching.' + k, 'Prinzip-Folie ' + (i + 1) + ': «' + k + '» fehlt.');
        });
        Object.keys(B).forEach(function (k) { if (len(t[k]) > B[k]) warn('long', path + '.teaching.' + k, 'Prinzip-Folie ' + (i + 1) + ': «' + k + '» ist länger als ' + B[k] + ' Zeichen.'); });
      }
    });
    if (!slides.length) err('no-slides', 'slides', 'Die Abfolge hat keine Folien.');
    return { ok: !errors.length, errors: errors, warnings: warnings };
  }
  function idx(a) { var m = {}; a.forEach(function (x) { if (x && str(x.id)) m[x.id] = x; }); return m; }
  function stateOf(p, id) { return (p.states || []).filter(function (s) { return s.id === id; })[0] || null; }
  function planTasks(p, stateId) {
    var st = stateOf(p, stateId); if (!st) return [];
    return (p.tasks || []).filter(function (t) { return st.tasks[t.id] && st.tasks[t.id].list === 'plan'; }).map(function (t) { return Object.assign({ id: t.id, title: t.title }, st.tasks[t.id]); });
  }

  function summary(p) {
    var v = validate(p);
    return {
      title: p && p.meta && p.meta.title, organisation: p && p.meta && p.meta.organisation,
      people: (p.people || []).length, tasks: (p.tasks || []).length,
      slides: (p.slides || []).map(function (s, i) { var sc = idx(p.scenes || [])[s.scene]; return (i + 1) + '. ' + (sc && CAPABILITIES.profiles[sc.profile] ? CAPABILITIES.profiles[sc.profile].label : 'unbekannt'); }),
      source: p && p.meta && p.meta.source, assumptions: (p && p.meta && p.meta.assumptions) || [],
      errors: v.errors, warnings: v.warnings, ok: v.ok
    };
  }

  /* ---------- Compiler: project + slide -> view model the existing renderers accept ---------- */
  function compile(p, slideIndex) {
    var sl = p.slides[slideIndex]; if (!sl) return null;
    var sc = idx(p.scenes)[sl.scene]; if (!sc) return null;
    var P = idx(p.people), D = idx(p.documents || []);
    var people = p.people.map(function (x, i) { return { id: x.id, idx: i, original: x.name, name: x.name, role: x.role || '', external: false, outside: false }; });
    var byId = idx(people);
    var notes = {}, mark = 0;
    var posts = sc.profile === 'teams-posts' ? sc.posts.map(function (q) {
      var m = q.hint ? ++mark : null; if (m) notes[m] = q.hint;
      return { id: q.id, by: q.by, time: q.time || '', title: q.title || '', text: q.text, file: q.document && D[q.document] ? D[q.document].name : undefined, replies: [], mark: m };
    }) : [];
    var after = sc.profile === 'planner' ? sc.state : sc.after;
    var tasks = planTasks(p, after).map(function (t) { return { title: t.title, owner: t.owner, due: t.due || '', bucket: t.bucket || 'Aufgaben', done: !!t.done }; });
    var principles = {};
    if (sc.profile === 'prinzip-tasks') {
      var t = sl.teaching || {}, before = stateOf(p, sc.before), personal = [];
      p.tasks.forEach(function (task) {
        var e = before && before.tasks[task.id]; if (!e || !e.owner) return;
        var row = personal.filter(function (r) { return r.who === e.owner; })[0];
        if (!row) personal.push(row = { who: e.owner, items: [] });
        row.items.push(task.title);
      });
      principles.tasks = {
        problem: t.problem || '', recommend: t.recommendation || '', boundary: t.boundary || '',
        personal: personal.slice(0, 3),
        shared: planTasks(p, sc.after).map(function (x) { return { t: x.title, who: x.owner || null, whoLabel: x.owner ? '' : 'offen', due: x.due || '' }; }),
        sharedLabel: 'Plan ' + sc.team, exactBefore: true
      };
    }
    var members = people.map(function (x) { return x.id; });
    return {
      id: p.meta.id || 'projekt', project: true, complete: true, personal: false,
      title: p.meta.title, persona: '', friction: '', usecases: [], collection: 'projekt',
      world: { id: p.meta.id || 'projekt', name: p.meta.organisation || '' },
      scenario: { id: sc.id, name: p.meta.title }, variant: null, variants: [],
      people: people, person: function (pid) { return byId[pid] || { id: pid, name: P[pid] ? P[pid].name : '?', role: '' }; },
      team: sc.team, teamOriginal: sc.team,
      scene: { personal: false, team: sc.team, teamNote: '', active: sc.channel || 'Allgemein', channels: [sc.channel || 'Allgemein'], members: members, posts: posts, files: [], tasks: tasks, outside: [], notes: notes },
      principles: principles, story: null, tools: ['teams', 'planner'], taskDetail: null, chat: null, todo: null, ai: null,
      fill: function (x) { return x == null ? '' : String(x); }, legacyHref: null
    };
  }
  /* What the existing slide composer needs for this slide: params, kind and principle meta. */
  function slidePlan(p, slideIndex) {
    var sl = p.slides[slideIndex], sc = sl && idx(p.scenes)[sl.scene]; if (!sc) return null;
    if (sc.profile === 'prinzip-tasks') {
      var t = sl.teaching || {};
      return { params: { mode: 'prinzip', sub: 'tasks', annot: false }, kind: 'prinzip', meta: { id: 'tasks', title: t.title || 'Prinzip', question: t.question || '' } };
    }
    return { params: { mode: 'szene', sub: CAPABILITIES.profiles[sc.profile].renderer, annot: true }, kind: 'folie', meta: null };
  }
  function fileName(p, slideIndex) {
    var sl = p.slides[slideIndex], sc = idx(p.scenes)[sl.scene];
    var base = ((p.meta.id || 'projekt') + '-' + sc.profile).toLowerCase().replace(/[äÄ]/g, 'ae').replace(/[öÖ]/g, 'oe').replace(/[üÜ]/g, 'ue').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return ('0' + (slideIndex + 1)).slice(-2) + '-' + base + '.png';
  }

  /* ---------- Assistant bridge: authoring pack and repair prompt ---------- */
  function minimalExample() {
    var p = template();
    p.meta.source = { kind: 'assistant', note: 'Beispiel aus dem Auftrag' };
    return p;
  }
  function authoringPack(brief) {
    brief = brief || {};
    var prof = CAPABILITIES.profiles, lines = [];
    lines.push('# Auftrag: Schulungsabfolge für msteams-personas vorbereiten');
    lines.push('Pack: ' + FORMAT + ' · projectVersion ' + PROJECT_VERSION + ' · capabilityVersion ' + CAPABILITY_VERSION);
    lines.push('');
    lines.push('## Kurzbriefing');
    lines.push('- Publikum: ' + (brief.audience || '(nicht angegeben, bitte sinnvoll annehmen)'));
    lines.push('- Ziel: ' + (brief.goal || '(nicht angegeben)'));
    lines.push('- Kontext: ' + (brief.context || '(nicht angegeben)'));
    if (brief.duration) lines.push('- Dauer: ' + brief.duration);
    lines.push('- Standard: drei Folien in dieser Reihenfolge: Teams-Beiträge → Planner-Board → Prinzip (Aufgaben vorher/nachher).');
    lines.push('');
    lines.push('## Vorgehen');
    lines.push('Du darfst zuerst kurz ein Storyboard (3 Zeilen) vorschlagen und Rückfragen stellen. Wenn keine Antwort kommt, arbeite mit den Standards weiter.');
    lines.push('Gib am Ende GENAU EIN vollständiges JSON-Projekt zurück, als Datei oder in einem einzigen ```json-Block. Kein weiterer JSON-Block in der Antwort.');
    lines.push('');
    lines.push('## Regeln');
    lines.push('- Alle Personen, Organisationen und Inhalte sind fiktiv. Keine echten Namen oder Firmendaten.');
    lines.push('- Deutsch mit Schweizer Rechtschreibung (ss statt ß).');
    lines.push('- IDs: Kleinbuchstaben, Ziffern, Bindestrich, mit Buchstaben beginnen (z. B. p-anna, t-bericht). Jede Referenz (by, owner, document, scene) muss auf eine vorhandene ID zeigen.');
    lines.push('- states: «before» und «after» sind vollständige Momentaufnahmen. Eine Aufgabe, die in einem Zustand fehlt, wird dort nicht gezeigt. list = "personal" (persönliche Liste, owner nötig) oder "plan" (gemeinsamer Plan, mit bucket und due).');
    lines.push('- Nur diese Ansichten (profile) sind möglich:');
    Object.keys(prof).forEach(function (k) {
      var b = prof[k].budgets;
      lines.push('  - ' + k + ': ' + prof[k].label + '. Höchstlängen: ' + Object.keys(b).map(function (x) { return x + ' ' + b[x]; }).join(', ') + '.');
    });
    lines.push('- Grenzen: höchstens ' + CAPABILITIES.limits.people + ' Personen, ' + CAPABILITIES.limits.tasks + ' Aufgaben, ' + CAPABILITIES.limits.slides + ' Folien.');
    lines.push('- Annahmen über das Verhalten von Microsoft 365, die du triffst, schreibe in meta.assumptions.');
    lines.push('- Behaupte nicht, du hättest die Folien gerendert oder das JSON geprüft. Die Prüfung macht die Website beim Import.');
    lines.push('- Kein HTML, kein CSS, kein Script, keine Bild-URLs. Texte sind reiner Text.');
    lines.push('');
    lines.push('## Vollständiges Beispiel (Inhalt ersetzen, Struktur beibehalten)');
    lines.push('```json');
    lines.push(JSON.stringify(minimalExample(), null, 1));
    lines.push('```');
    return lines.join('\n');
  }
  function repairPrompt(p, diagnostics) {
    var lines = [];
    lines.push('# Korrektur: msteams-personas-Projekt');
    lines.push('Die Website hat beim Import diese Probleme gefunden:');
    diagnostics.forEach(function (d) { lines.push('- ' + d.message + ' (Pfad: ' + d.path + ')'); });
    lines.push('');
    lines.push('Bitte gib das GANZE korrigierte Projekt zurück, als ein einziger ```json-Block. Ändere nur, was für diese Probleme nötig ist; alle anderen Inhalte bleiben genau gleich. IDs bestehender Personen und Aufgaben nicht ändern.');
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(p, null, 1));
    lines.push('```');
    return lines.join('\n');
  }

  /* ---------- Shared editing operations (website and bridge use the same ones) ---------- */
  function replacePersonRef(p, from, to) {
    var q = copy(p);
    q.scenes.forEach(function (sc) { (sc.posts || []).forEach(function (x) { if (x.by === from) x.by = to; }); });
    q.states.forEach(function (st) { Object.keys(st.tasks || {}).forEach(function (k) { if (st.tasks[k].owner === from) st.tasks[k].owner = to; }); });
    return q;
  }
  function newId(prefix, list) {
    var n = list.length + 1; while (list.some(function (x) { return x.id === prefix + n; })) n++;
    return prefix + n;
  }
  function serialise(p) { return JSON.stringify(p, null, 2); }

  return {
    FORMAT: FORMAT, PROJECT_VERSION: PROJECT_VERSION, CAPABILITY_VERSION: CAPABILITY_VERSION, RENDERER_VERSION: RENDERER_VERSION, MAX_INPUT: MAX_INPUT,
    capabilities: function () { return copy(CAPABILITIES); },
    template: template, blank: blank, parseInput: parseInput, validate: validate, summary: summary,
    compile: compile, slidePlan: slidePlan, fileName: fileName, planTasks: planTasks,
    authoringPack: authoringPack, repairPrompt: repairPrompt, replacePersonRef: replacePersonRef, newId: newId, serialise: serialise, copy: copy
  };
});
