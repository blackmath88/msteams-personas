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
  var core = factory(typeof module === 'object' && module.exports ? require('./workspace-core.js') : root.WorkspaceCore,
    typeof module === 'object' && module.exports ? require('./workspace-examples.js') : root.WorkspaceExample,
    typeof module === 'object' && module.exports ? require('./collaboration-core.js') : root.CollaborationCore);
  if (typeof module === 'object' && module.exports) module.exports = core;
  else root.ProjectCore = core;
})(typeof window !== 'undefined' ? window : globalThis, function (Workspace, workspaceExample, Collaboration) {
  var FORMAT = 'msteams-personas/project';
  var PROJECT_VERSION = 1;
  var CAPABILITY_VERSION = 6;
  var RENDERER_VERSION = 'v3';
  var MAX_INPUT = 200 * 1024;
  var ID = /^[a-z][a-z0-9-]{0,39}$/;
  var PRINZIP_LISTS = 3; /* personal lists the «Aufgaben» diagram has room for */

  /* Supported profiles. Budgets are character limits that keep a 1920x1080 slide legible. */
  var CAPABILITIES = {
    capabilityVersion: CAPABILITY_VERSION,
    rendererVersion: RENDERER_VERSION,
    profiles: Object.assign({
      'teams-posts': {
        label: 'Teams: Beiträge im Kanal', renderer: 'posts', needs: ['team', 'channel', 'posts'],
        budgets: { team: 40, channel: 30, postTitle: 60, postText: 220, posts: 4 }
      },
      'teams-chat': {
        label: 'Teams: Chat zu zweit', renderer: 'chat', needs: ['team', 'viewer', 'partner', 'messages'],
        budgets: { team: 40, messageText: 220, messages: 6 }
      },
      planner: {
        label: 'Planner: gemeinsames Board', renderer: 'planner', needs: ['team', 'state'],
        budgets: { team: 40, taskTitle: 60, bucket: 24, tasks: 8 }
      },
      'planner-task': {
        label: 'Planner: Aufgabendetails', renderer: 'plantask', minCapabilityVersion: 3, needs: ['team', 'state', 'task'],
        budgets: { team: 40, notes: 240, checklist: 5, checklistText: 70, commentText: 180 }
      },
      todo: {
        label: 'Microsoft To Do: Mein Tag', renderer: 'todo', minCapabilityVersion: 3, needs: ['team', 'state', 'viewer', 'taskIds', 'personalListPrivate', 'myDaySelected'],
        budgets: { team: 40, tasks: 6, dateLabel: 40 }
      },
      'prinzip-tasks': {
        label: 'Prinzip: Aufgaben, vorher und nachher', renderer: 'principle:tasks', needs: ['before', 'after'],
        budgets: { title: 60, question: 90, problem: 200, recommendation: 200, boundary: 200 }
      }
    }, Workspace.profiles, Collaboration.profiles),
    limits: { people: 8, workspacePeople: 16, tasks: 12, documents: 8, slides: 6, presenterNotes: 1200, prinzipLists: PRINZIP_LISTS }
  };

  function copy(x) { return JSON.parse(JSON.stringify(x)); }
  function str(x) { return typeof x === 'string'; }
  function len(x) { return str(x) ? x.length : 0; }
  function diagnosticText(x) { return str(x) ? x : JSON.stringify(x); }

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

  /* ---------- Validation: structured diagnostics, never mutates, never throws ---------- */
  /* The editor and the bridge support exactly these two snapshots (see STATE_IDS). */
  var STATE_IDS = ['before', 'after'];
  function isObj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
  function validate(p) {
    var errors = [], warnings = [];
    function err(code, path, message, extra) { errors.push(Object.assign({ code: code, path: path, message: message, severity: 'error' }, extra || {})); }
    function warn(code, path, message, extra) { warnings.push(Object.assign({ code: code, path: path, message: message, severity: 'warning' }, extra || {})); }
    /* Optional text: absent/null is fine, anything else must be a string. */
    function optStr(o, k, path, label) { if (o[k] != null && !str(o[k])) err('type', path + '.' + k, label + ': «' + k + '» muss Text sein.', { expected: 'string' }); }
    function reqStr(o, k, path, code, message) {
      if (o[k] != null && !str(o[k])) err('type', path + '.' + k, message.replace(/ (hat|braucht) .*$/, '') + ': «' + k + '» muss Text sein.', { expected: 'string' });
      else if (!str(o[k]) || !o[k].trim()) err(code, path + '.' + k, message);
    }
    if (!isObj(p)) { err('not-object', '', 'Das Projekt ist kein JSON-Objekt.'); return { ok: false, errors: errors, warnings: warnings }; }
    if (p.format !== FORMAT) err('format', 'format', 'Unbekanntes Format. Erwartet: «' + FORMAT + '».');
    if (p.projectVersion !== PROJECT_VERSION) err('project-version', 'projectVersion', 'Projektversion ' + JSON.stringify(p.projectVersion) + ' wird nicht unterstützt (erwartet ' + PROJECT_VERSION + ').');
    if (![1, 2, 3, 4, 5, CAPABILITY_VERSION].includes(p.capabilityVersion)) err('capability-version', 'capabilityVersion', 'Fähigkeitsversion ' + JSON.stringify(p.capabilityVersion) + ' wird nicht unterstützt (erwartet 1 bis ' + CAPABILITY_VERSION + ').');
    var meta = p.meta;
    if (!isObj(meta)) { err('meta', 'meta', 'Angaben zur Abfolge («meta») fehlen oder sind kein Objekt.'); meta = {}; }
    reqStr(meta, 'title', 'meta', 'meta-title', 'Die Abfolge braucht einen Titel.');
    ['organisation', 'audience', 'goal', 'notes', 'locale'].forEach(function (k) { optStr(meta, k, 'meta', 'Angaben zur Abfolge'); });
    if (meta.id != null && (!str(meta.id) || !ID.test(meta.id))) err('bad-id', 'meta.id', 'Die Projekt-ID ist ungültig. Erlaubt: Kleinbuchstaben, Ziffern, Bindestrich.');
    if (meta.fictional != null && typeof meta.fictional !== 'boolean') err('type', 'meta.fictional', '«fictional» muss true oder false sein.', { expected: 'boolean' });
    else if (meta.fictional !== true) warn('not-fictional', 'meta.fictional', 'Das Projekt ist nicht als fiktiv markiert. Bitte keine echten Personen oder Daten verwenden.');
    if (meta.assumptions != null && (!Array.isArray(meta.assumptions) || !meta.assumptions.every(str))) err('type', 'meta.assumptions', '«assumptions» muss eine Liste von Texten sein.', { expected: 'string[]' });
    if (meta.source != null) {
      if (!isObj(meta.source)) err('type', 'meta.source', '«source» muss ein Objekt mit «kind» und «note» sein.', { expected: 'object' });
      else { optStr(meta.source, 'kind', 'meta.source', 'Quelle'); optStr(meta.source, 'note', 'meta.source', 'Quelle'); }
    }
    var L = CAPABILITIES.limits;
    /* Returns only the well-formed object entries, so later checks never touch null or text. */
    function list(key, max) {
      var a = p[key];
      if (!Array.isArray(a)) { err('missing-' + key, key, 'Liste «' + key + '» fehlt oder ist keine Liste.'); return []; }
      if (a.length > max) err('too-many-' + key, key, 'Zu viele Einträge in «' + key + '» (' + a.length + ', höchstens ' + max + ').');
      var seen = {}, ok = [];
      a.forEach(function (x, i) {
        if (!isObj(x)) { err('bad-entry', key + '[' + i + ']', 'Eintrag ' + (i + 1) + ' in «' + key + '» ist kein Objekt.'); return; }
        ok.push({ x: x, i: i });
        if (!str(x.id) || !ID.test(x.id)) err('bad-id', key + '[' + i + '].id', 'Ungültige ID in «' + key + '» an Position ' + (i + 1) + '. Erlaubt: Kleinbuchstaben, Ziffern, Bindestrich.');
        else if (seen[x.id]) err('dup-id', key + '[' + i + '].id', 'Die ID «' + x.id + '» kommt doppelt vor.');
        else seen[x.id] = true;
      });
      return ok;
    }
    var people = list('people', p.workspace ? L.workspacePeople : L.people), docs = list('documents', L.documents), tasks = list('tasks', L.tasks);
    var states = list('states', STATE_IDS.length), scenes = list('scenes', 8), slides = list('slides', L.slides);
    function ix(a) { var m = {}; a.forEach(function (e) { if (str(e.x.id)) m[e.x.id] = e.x; }); return m; }
    var P = ix(people), D = ix(docs), T = ix(tasks), S = ix(states), SC = ix(scenes);
    people.forEach(function (e) { reqStr(e.x, 'name', 'people[' + e.i + ']', 'person-name', 'Person ' + (e.i + 1) + ' hat keinen Namen.'); optStr(e.x, 'role', 'people[' + e.i + ']', 'Person ' + (e.i + 1)); });
    tasks.forEach(function (e) { reqStr(e.x, 'title', 'tasks[' + e.i + ']', 'task-title', 'Aufgabe ' + (e.i + 1) + ' hat keinen Titel.'); });
    docs.forEach(function (e) { reqStr(e.x, 'name', 'documents[' + e.i + ']', 'document-name', 'Dokument ' + (e.i + 1) + ' hat keinen Namen.'); });
    function personRef(id, path, where) {
      if (!str(id)) err('type', path, where + ': Die Person muss als ID (Text) angegeben sein.', { expected: 'string' });
      else if (!Object.prototype.hasOwnProperty.call(P, id)) err('unknown-person', path, where + ': Die Person «' + id + '» gibt es in diesem Projekt nicht.', { ref: id, where: where });
    }
    var ids = states.map(function (e) { return e.x.id; });
    if (Array.isArray(p.states) && (ids.length !== STATE_IDS.length || STATE_IDS.some(function (k) { return ids.indexOf(k) < 0; })))
      err('state-ids', 'states', 'Es braucht genau zwei Zustände mit den IDs «before» und «after» (gefunden: ' + (ids.map(function (x) { return '«' + x + '»'; }).join(', ') || 'keine') + '). Andere Zustände kann der Editor nicht bearbeiten.');
    states.forEach(function (e) {
      var st = e.x, si = e.i, tk = st.tasks;
      optStr(st, 'label', 'states[' + si + ']', 'Zustand «' + st.id + '»');
      if (!isObj(tk)) { err('state-tasks', 'states[' + si + '].tasks', 'Zustand «' + st.id + '»: Aufgaben fehlen.'); return; }
      Object.keys(tk).forEach(function (tid) {
        var t = tk[tid], path = 'states[' + si + '].tasks.' + tid;
        var where = 'Zustand «' + (str(st.label) && st.label || st.id) + '», Aufgabe «' + (T[tid] && str(T[tid].title) ? T[tid].title : tid) + '»';
        if (!T[tid]) err('unknown-task', path, where + ': Diese Aufgabe gibt es nicht.', { ref: tid });
        if (!isObj(t)) { err('bad-entry', path, where + ': Eintrag ist kein Objekt.'); return; }
        if (t.owner != null) personRef(t.owner, path + '.owner', where);
        if (t.list !== 'personal' && t.list !== 'plan') err('task-list', path + '.list', where + ': «list» muss «personal» oder «plan» sein.');
        if (t.list === 'personal' && t.owner == null) err('personal-owner', path + '.owner', where + ': Eine persönliche Aufgabe braucht eine Person.');
        optStr(t, 'bucket', path, where); optStr(t, 'due', path, where);
        if (t.done != null && typeof t.done !== 'boolean') err('type', path + '.done', where + ': «done» muss true oder false sein.', { expected: 'boolean' });
        var detailFields = ['notes', 'checklist', 'comment', 'progress'];
        if (p.capabilityVersion < 3 && detailFields.some(function (k) { return t[k] != null; })) err('task-version', path, where + ': Aufgabendetails brauchen capabilityVersion 3.');
        optStr(t, 'notes', path, where);
        if (len(t.notes) > 240) warn('long', path + '.notes', where + ': Notizen auf höchstens 240 Zeichen kürzen.');
        if (t.progress != null && ['not-started', 'in-progress', 'completed'].indexOf(t.progress) < 0) err('task-progress', path + '.progress', where + ': Möglich sind not-started, in-progress, completed.');
        if (t.progress != null && t.done != null && (t.progress === 'completed') !== t.done) err('task-progress-conflict', path + '.done', where + ': «done» und «progress» widersprechen sich. Beide auf denselben Abschlussstand setzen.');
        if (t.checklist != null) {
          if (!Array.isArray(t.checklist)) err('type', path + '.checklist', where + ': Checkliste muss eine Liste sein.');
          else {
            if (t.checklist.length > 5) err('too-many-checklist', path + '.checklist', where + ': Höchstens fünf Checklistenpunkte.');
            t.checklist.forEach(function (c, j) {
              var cp = path + '.checklist[' + j + ']';
              if (!isObj(c)) { err('bad-entry', cp, 'Checklistenpunkt muss ein Objekt mit text und done sein.'); return; }
              reqStr(c, 'text', cp, 'checklist-text', 'Checklistenpunkt braucht Text.');
              if (typeof c.done !== 'boolean') err('type', cp + '.done', 'Checklistenpunkt: done muss true oder false sein.');
              if (len(c.text) > 70) warn('long', cp + '.text', 'Checklistenpunkt auf höchstens 70 Zeichen kürzen.');
            });
          }
        }
        if (t.comment != null) {
          if (!isObj(t.comment)) err('type', path + '.comment', where + ': Kommentar muss ein Objekt mit by und text sein.');
          else {
            personRef(t.comment.by, path + '.comment.by', 'Aufgabenkommentar');
            reqStr(t.comment, 'text', path + '.comment', 'comment-text', 'Kommentar braucht Text.');
            if (len(t.comment.text) > 180) warn('long', path + '.comment.text', 'Kommentar auf höchstens 180 Zeichen kürzen.');
          }
        }
        if (len(t.bucket) > CAPABILITIES.profiles.planner.budgets.bucket) warn('long', path + '.bucket', where + ': Bucket-Name ist lang und wird eventuell gekürzt.');
      });
    });
    Workspace.check(p, err);
    Collaboration.check(p, err);
    scenes.forEach(function (e) {
      var sc = e.x, path = 'scenes[' + e.i + ']', prof = str(sc.profile) && Object.prototype.hasOwnProperty.call(CAPABILITIES.profiles, sc.profile) ? CAPABILITIES.profiles[sc.profile] : null;
      if (!prof) { err('unknown-profile', path + '.profile', 'Szene «' + diagnosticText(sc.id) + '»: Ansicht «' + diagnosticText(sc.profile) + '» wird nicht unterstützt. Möglich: ' + Object.keys(CAPABILITIES.profiles).join(', ') + '.'); return; }
      if (sc.profile === 'teams-chat' && p.capabilityVersion === 1) err('profile-version', path + '.profile', 'Teams: Chat zu zweit braucht capabilityVersion 2.');
      if (['todo', 'planner-task'].indexOf(sc.profile) >= 0 && p.capabilityVersion < 3) err('profile-version', path + '.profile', prof.label + ' braucht capabilityVersion 3.');
      if (Workspace.isProfile(sc.profile) || Collaboration.isProfile(sc.profile)) return;
      var B = prof.budgets;
      reqStr(sc, 'team', path, 'scene-team', 'Szene «' + diagnosticText(sc.id) + '» braucht einen Teamnamen.');
      if (len(sc.team) > B.team) warn('long', path + '.team', 'Teamname ist länger als ' + B.team + ' Zeichen.');
      if (sc.profile === 'teams-posts') {
        reqStr(sc, 'channel', path, 'scene-channel', 'Szene «' + diagnosticText(sc.id) + '» braucht einen Kanal.');
        if (!Array.isArray(sc.posts) || !sc.posts.length) err('scene-posts', path + '.posts', 'Szene «' + diagnosticText(sc.id) + '» braucht mindestens einen Beitrag.');
        else {
          if (sc.posts.length > B.posts) warn('many-posts', path + '.posts', 'Mehr als ' + B.posts + ' Beiträge passen nicht gut auf eine Folie.');
          sc.posts.forEach(function (q, j) {
            var qp = path + '.posts[' + j + ']', where = 'Teams-Beitrag ' + (j + 1);
            if (!isObj(q)) { err('bad-entry', qp, where + ' ist kein Objekt.'); return; }
            personRef(q.by, qp + '.by', where);
            reqStr(q, 'text', qp, 'post-text', where + ' hat keinen Text.');
            ['id', 'time', 'title', 'hint'].forEach(function (k) { optStr(q, k, qp, where); });
            if (len(q.text) > B.postText) warn('long', qp + '.text', where + ': Text ist länger als ' + B.postText + ' Zeichen.');
            if (len(q.title) > B.postTitle) warn('long', qp + '.title', where + ': Betreff ist länger als ' + B.postTitle + ' Zeichen.');
            if (q.document != null && !(str(q.document) && D[q.document])) err('unknown-document', qp + '.document', where + ': Das Dokument «' + diagnosticText(q.document) + '» gibt es nicht.', { ref: q.document });
          });
        }
      }
      if (sc.profile === 'teams-chat') {
        personRef(sc.viewer, path + '.viewer', 'Chat-Ansicht');
        personRef(sc.partner, path + '.partner', 'Chat-Partner');
        if (str(sc.viewer) && sc.viewer === sc.partner) err('chat-participants', path + '.partner', 'Ein Chat zu zweit braucht zwei verschiedene Personen.');
        if (sc.notSeenBy != null) {
          if (!Array.isArray(sc.notSeenBy)) err('type', path + '.notSeenBy', '«notSeenBy» muss eine Liste von Personen-IDs sein.', { expected: 'string[]' });
          else sc.notSeenBy.forEach(function (id, j) { personRef(id, path + '.notSeenBy[' + j + ']', 'Nicht am Chat beteiligt'); });
        }
        if (sc.messages != null && !Array.isArray(sc.messages)) err('type', path + '.messages', 'Chat-Nachrichten müssen eine Liste sein.', { expected: 'array' });
        else if (!sc.messages || !sc.messages.length) err('scene-messages', path + '.messages', 'Ein Chat braucht mindestens eine Nachricht.');
        else {
          if (sc.messages.length > B.messages) err('too-many-messages', path + '.messages', 'Ein Chat hat höchstens ' + B.messages + ' Nachrichten.');
          sc.messages.forEach(function (q, j) {
            var qp = path + '.messages[' + j + ']', where = 'Chat-Nachricht ' + (j + 1);
            if (!isObj(q)) { err('bad-entry', qp, where + ' ist kein Objekt.'); return; }
            reqStr(q, 'id', qp, 'message-id', where + ' braucht eine ID.');
            personRef(q.by, qp + '.by', where);
            if (str(q.by) && q.by !== sc.viewer && q.by !== sc.partner) err('chat-author', qp + '.by', where + ': Nur die beiden Chat-Personen können schreiben.');
            reqStr(q, 'text', qp, 'message-text', where + ' hat keinen Text.');
            ['time', 'hint'].forEach(function (k) { optStr(q, k, qp, where); });
            if (q.decision != null && typeof q.decision !== 'boolean') err('type', qp + '.decision', where + ': «decision» muss true oder false sein.', { expected: 'boolean' });
            if (len(q.text) > B.messageText) warn('long', qp + '.text', where + ': Text ist länger als ' + B.messageText + ' Zeichen.');
          });
        }
      }
      if (['planner', 'planner-task', 'todo'].indexOf(sc.profile) >= 0) {
        if (STATE_IDS.indexOf(sc.state) < 0 || !S[sc.state]) err('unknown-state', path + '.state', 'Planner-Szene «' + diagnosticText(sc.id) + '»: Zustand «' + diagnosticText(sc.state) + '» fehlt. Möglich: «before» oder «after».');
        else if (sc.profile === 'planner' && !planTasks(p, sc.state).length) warn('empty-plan', path + '.state', 'Im Zustand «' + diagnosticText(sc.state) + '» steht keine Aufgabe im gemeinsamen Plan.');
      }
      if (sc.profile === 'planner-task') {
        var snapshot = stateOf(p, sc.state), entry = snapshot && isObj(snapshot.tasks) && str(sc.task) && snapshot.tasks[sc.task];
        if (!str(sc.task) || !Object.prototype.hasOwnProperty.call(T, sc.task)) err('unknown-task', path + '.task', 'Aufgabendetails: eine vorhandene Aufgaben-ID in «task» wählen.');
        else if (!isObj(entry) || entry.list !== 'plan') err('detail-task-state', path + '.task', 'Aufgabendetails: die Aufgabe muss im gewählten Zustand im gemeinsamen Plan stehen.');
        else if (!entry.owner) err('detail-task-owner', path + '.task', 'Aufgabendetails: der Aufgabe im gewählten Zustand eine Person zuweisen.');
      }
      if (sc.profile === 'todo') {
        personRef(sc.viewer, path + '.viewer', 'To-Do-Ansicht');
        ['personalListPrivate', 'myDaySelected'].forEach(function (k) {
          if (sc[k] !== true) err('todo-assumption', path + '.' + k, 'To Do: «' + k + '» auf true setzen. Das Beispiel setzt eine nicht geteilte persönliche Liste und bewusst für Mein Tag gewählte Aufgaben voraus.');
        });
        if (sc.plannerConnected != null && typeof sc.plannerConnected !== 'boolean') err('type', path + '.plannerConnected', 'To Do: plannerConnected muss true oder false sein.');
        optStr(sc, 'dateLabel', path, 'To Do');
        if (len(sc.dateLabel) > B.dateLabel) warn('long', path + '.dateLabel', 'Datumszeile auf höchstens 40 Zeichen kürzen.');
        if (!Array.isArray(sc.taskIds) || !sc.taskIds.length) err('todo-tasks', path + '.taskIds', 'To Do: vorhandene Aufgaben-IDs für Mein Tag in «taskIds» auswählen.');
        else {
          if (sc.taskIds.length > B.tasks) err('too-many-todo', path + '.taskIds', 'To Do: höchstens sechs Aufgaben für Mein Tag auswählen.');
          var seenTasks = {};
          sc.taskIds.forEach(function (tid, j) {
            var tp = path + '.taskIds[' + j + ']', st = stateOf(p, sc.state), t = st && isObj(st.tasks) && str(tid) && st.tasks[tid];
            if (!str(tid) || !Object.prototype.hasOwnProperty.call(T, tid)) { err('unknown-task', tp, 'To Do: «' + diagnosticText(tid) + '» durch eine vorhandene Aufgaben-ID ersetzen.'); return; }
            if (seenTasks[tid]) err('duplicate-task', tp, 'To Do: jede Aufgabe nur einmal auswählen.');
            seenTasks[tid] = true;
            if (!isObj(t)) err('todo-task-state', tp, 'To Do: diese Aufgabe fehlt im gewählten Zustand. Aufgabe dort erfassen oder Auswahl entfernen.');
            else {
              if (t.owner !== sc.viewer) err('todo-task-owner', tp, 'To Do: nur Aufgaben der gewählten Person auswählen. Person oder Zuständigkeit im Zustand prüfen.');
              if (t.list === 'plan' && sc.plannerConnected !== true) err('todo-connection', path + '.plannerConnected', 'Zugewiesene Planner-Aufgaben: plannerConnected auf true setzen. Dasselbe Arbeitskonto und aktivierte Planner-Verbindung sind Voraussetzung.');
            }
          });
        }
      }
      if (sc.profile === 'prinzip-tasks') {
        if (sc.before !== 'before' || sc.after !== 'after') err('prinzip-states', path, 'Prinzip-Szene «' + diagnosticText(sc.id) + '»: «before» muss «before» und «after» muss «after» sein.');
        var b = S.before, rows = {};
        if (b && isObj(b.tasks)) Object.keys(b.tasks).forEach(function (k) { var t = b.tasks[k]; if (isObj(t) && t.list === 'personal' && str(t.owner)) rows[t.owner] = 1; });
        /* An error, not a warning: the diagram would silently drop the extra lists while their tasks still appear in the plan (seen in the bridge trial). */
        if (Object.keys(rows).length > PRINZIP_LISTS) err('prinzip-lists', path, 'Prinzip-Folie: ' + Object.keys(rows).length + ' Personen haben vorher eine persönliche Liste, die Folie zeigt höchstens ' + PRINZIP_LISTS + '. Bitte im Zustand «before» Aufgaben auf ' + PRINZIP_LISTS + ' Personen verteilen oder einzelne Aufgaben mit list "plan" als bereits geplant führen.', { ref: Object.keys(rows), limit: PRINZIP_LISTS });
      }
    });
    slides.forEach(function (e) {
      var sl = e.x, i = e.i, path = 'slides[' + i + ']', sc = str(sl.scene) ? SC[sl.scene] : null;
      if (!sc) { err('unknown-scene', path + '.scene', 'Folie ' + (i + 1) + ': Szene «' + sl.scene + '» fehlt.'); return; }
      optStr(sl, 'presenterNotes', path, 'Folie ' + (i + 1));
      if (len(sl.presenterNotes) > L.presenterNotes) warn('long', path + '.presenterNotes', 'Folie ' + (i + 1) + ': Notizen sind sehr lang.');
      if (sc.profile === 'prinzip-tasks') {
        var t = sl.teaching, B = CAPABILITIES.profiles['prinzip-tasks'].budgets;
        if (!isObj(t)) { err('teaching', path + '.teaching', 'Prinzip-Folie ' + (i + 1) + ': Lehrtext («teaching») fehlt.'); return; }
        ['title', 'recommendation', 'boundary'].forEach(function (k) { reqStr(t, k, path + '.teaching', 'teaching-' + k, 'Prinzip-Folie ' + (i + 1) + ': «' + k + '» fehlt.'); });
        ['question', 'problem'].forEach(function (k) { optStr(t, k, path + '.teaching', 'Prinzip-Folie ' + (i + 1)); });
        Object.keys(B).forEach(function (k) { if (len(t[k]) > B[k]) warn('long', path + '.teaching.' + k, 'Prinzip-Folie ' + (i + 1) + ': «' + k + '» ist länger als ' + B[k] + ' Zeichen.'); });
      }
    });
    if (Array.isArray(p.slides) && !p.slides.length) err('no-slides', 'slides', 'Die Abfolge hat keine Folien.');
    return { ok: !errors.length, errors: errors, warnings: warnings };
  }
  function idx(a) { var m = {}; a.forEach(function (x) { if (x && str(x.id)) m[x.id] = x; }); return m; }
  function stateOf(p, id) { return (Array.isArray(p.states) ? p.states : []).filter(function (s) { return isObj(s) && s.id === id; })[0] || null; }
  function planTasks(p, stateId) {
    var st = stateOf(p, stateId); if (!st || !isObj(st.tasks)) return [];
    return (Array.isArray(p.tasks) ? p.tasks : []).filter(function (t) { return isObj(t) && isObj(st.tasks[t.id]) && st.tasks[t.id].list === 'plan'; }).map(function (t) { return Object.assign({ id: t.id, title: t.title }, st.tasks[t.id]); });
  }

  /* Import review summary: safe for any parsed JSON, including malformed projects. */
  function summary(p) {
    var v = validate(p), o = isObj(p) ? p : {}, meta = isObj(o.meta) ? o.meta : {};
    function arr(x) { return Array.isArray(x) ? x : []; }
    var SC = idx(arr(o.scenes));
    return {
      title: str(meta.title) ? meta.title : '', organisation: str(meta.organisation) ? meta.organisation : '',
      people: arr(o.people).length, tasks: arr(o.tasks).length,
      slides: arr(o.slides).map(function (s, i) { var sc = isObj(s) && str(s.scene) ? SC[s.scene] : null, pr = sc && str(sc.profile) && Object.prototype.hasOwnProperty.call(CAPABILITIES.profiles, sc.profile) ? CAPABILITIES.profiles[sc.profile] : null; return (i + 1) + '. ' + (pr ? pr.label : 'unbekannt'); }),
      source: isObj(meta.source) ? meta.source : null, assumptions: arr(meta.assumptions).filter(str),
      errors: v.errors, warnings: v.warnings, ok: v.ok
    };
  }

  /* ---------- Compiler: project + slide -> view model the existing renderers accept ---------- */
  function compile(p, slideIndex) {
    var sl = p.slides[slideIndex]; if (!sl) return null;
    return compileScene(p, sl.scene, sl.teaching);
  }
  /* Scene → view model; slides add only their teaching text. Components compile scenes directly. */
  function compileScene(p, sceneId, teaching) {
    var sc = idx(p.scenes)[sceneId]; if (!sc) return null;
    var P = idx(p.people), D = idx(p.documents || []);
    var people = p.people.map(function (x, i) { return { id: x.id, idx: i, original: x.name, name: x.name, role: x.role || '', external: false, outside: false }; });
    var byId = idx(people);
    if (Collaboration.isProfile(sc.profile)) return { title: p.meta.title, team: sc.team, collaboration: Collaboration.model(p, sc), person: function (id) { return byId[id]; }, assumptions: p.meta.assumptions || [] };
    if (Workspace.isProfile(sc.profile)) {
      var model = Workspace.model(p, sc);
      function person(id) { return byId[id]; }
      if (model.houses) return { title: p.meta.title, workspace: model, person: person };
      var personal = model.base.kind === 'personal';
      var files = model.entries.map(function (n) {
        var shared = (n.sharedWith || []).map(function (id) { return byId[id].name; });
        return { id: n.id, name: n.name, kind: n.kind, canonical: n === model.selected, mark: n === model.selected ? 3 : null,
          note: shared.length ? 'Bearbeitungszugriff für ' + shared.join(', ') : 'Privat', when: '–' };
      });
      var workspaceIndex = Workspace.index(p.workspace);
      return {
        title: p.meta.title, world: { id: model.base.id }, team: model.base.name, workspace: model,
        tools: [personal ? 'onedrive' : 'teams'],
        person: person, fill: function (value) { return value || ''; },
        scene: { members: personal ? [model.base.owner] : model.base.members, viewer: model.viewer,
          active: model.active.name, channels: model.channels.map(function (n) { return n.name; }), activeIndex: model.channels.indexOf(model.active),
          channelIds: model.channels.map(function (n) { return n.id; }),
          folderPath: Workspace.trail(workspaceIndex, model.folder.id).slice(personal ? 2 : 3).map(function (n) { return n.name; }),
          files: files, tasks: [], workspace: true,
          posts: (model.active.posts || []).map(function (post) {
            var file = workspaceIndex.get(post.file);
            return Object.assign({}, post, { file: file && file.name, filePath: file && Workspace.trail(workspaceIndex, file.id).slice(1, -1).filter(function (n) { return n.kind !== 'storage'; }).map(function (n) { return n.name; }).join(' › '), mark: file ? 3 : null });
          }) }
      };
    }
    var notes = {}, mark = 0;
    var posts = sc.profile === 'teams-posts' ? sc.posts.map(function (q) {
      var m = q.hint ? ++mark : null; if (m) notes[m] = q.hint;
      return { id: q.id, by: q.by, time: q.time || '', title: q.title || '', text: q.text, file: q.document && D[q.document] ? D[q.document].name : undefined, replies: [], mark: m };
    }) : [];
    var chat = sc.profile === 'teams-chat' ? {
      viewer: sc.viewer, partner: sc.partner, generated: false, others: [], later: sc.notSeenBy || [], laterLabel: null,
      messages: sc.messages.map(function (q) {
        var m = q.hint ? ++mark : null; if (m) notes[m] = q.hint;
        return { id: q.id, by: q.by, time: q.time || '', text: q.text, mark: m, decision: !!q.decision };
      })
    } : null;
    var after = sc.state || sc.after;
    function taskView(t) { return Object.assign({}, t, { due: t.due || '', bucket: t.bucket || 'Aufgaben', done: t.progress ? t.progress === 'completed' : !!t.done }); }
    var tasks = planTasks(p, after).map(taskView);
    var taskDetail = null, todo = null;
    if (sc.profile === 'planner-task') {
      var selected = tasks.filter(function (t) { return t.id === sc.task; })[0];
      taskDetail = { task: selected, notes: selected.notes || '', checklist: (selected.checklist || []).map(function (c) { return [c.text, c.done]; }), comment: selected.comment || null };
    }
    if (sc.profile === 'todo') {
      var st = stateOf(p, sc.state), T = idx(p.tasks), selectedTasks = sc.taskIds.map(function (id) { return taskView(Object.assign({}, T[id], st.tasks[id])); });
      var owned = p.tasks.filter(function (t) { return st.tasks[t.id] && st.tasks[t.id].owner === sc.viewer; });
      todo = { viewer: sc.viewer, personal: selectedTasks.filter(function (t) { return t.list === 'personal'; }), assigned: selectedTasks.filter(function (t) { return t.list === 'plan'; }), personalCount: owned.filter(function (t) { return st.tasks[t.id].list === 'personal'; }).length, assignedCount: owned.filter(function (t) { return st.tasks[t.id].list === 'plan'; }).length, plan: sc.plannerConnected === true, dateLabel: sc.dateLabel || 'Für diesen Arbeitstag ausgewählt' };
    }
    var principles = {};
    if (sc.profile === 'prinzip-tasks') {
      /* Before side keeps the meaning of each entry: personal lists hold only list:'personal';
         tasks already in the shared plan before are shown as such, never as someone's list. */
      var t = teaching || {}, before = stateOf(p, sc.before), personal = [], beforeShared = [];
      p.tasks.forEach(function (task) {
        var e = before && before.tasks[task.id]; if (!e) return;
        if (e.list === 'plan') { beforeShared.push({ t: task.title, who: e.owner || null, whoLabel: e.owner ? '' : 'offen', due: e.due || '' }); return; }
        if (!e.owner) return;
        var row = personal.filter(function (r) { return r.who === e.owner; })[0];
        if (!row) personal.push(row = { who: e.owner, items: [] });
        row.items.push(task.title);
      });
      principles.tasks = {
        problem: t.problem || '', recommend: t.recommendation || '', boundary: t.boundary || '',
        personal: personal.slice(0, PRINZIP_LISTS), beforeShared: beforeShared,
        shared: planTasks(p, sc.after).map(function (x) { return { t: x.title, who: x.owner || null, whoLabel: x.owner ? '' : 'offen', due: x.due || '' }; }),
        sharedLabel: 'Plan ' + sc.team, exactBefore: true
      };
    }
    var members = people.map(function (x) { return x.id; });
    return {
      id: p.meta.id || 'projekt', project: true, complete: true, personal: false,
      title: p.meta.title, assumptions: p.meta.assumptions || [], persona: '', friction: '', usecases: [], collection: 'projekt',
      world: { id: p.meta.id || 'projekt', name: p.meta.organisation || '' },
      scenario: { id: sc.id, name: p.meta.title }, variant: null, variants: [],
      people: people, person: function (pid) { return byId[pid] || { id: pid, name: P[pid] ? P[pid].name : '?', role: '' }; },
      team: sc.team, teamOriginal: sc.team,
      scene: { personal: false, team: sc.team, teamNote: '', active: sc.channel || 'Allgemein', channels: [sc.channel || 'Allgemein'], members: members, posts: posts, files: [], tasks: tasks, outside: [], notes: notes },
      principles: principles, story: null, tools: (chat ? ['teams', 'chat', 'planner'] : ['teams', 'planner']).concat(taskDetail ? ['plantask'] : [], todo ? ['todo'] : []), taskDetail: taskDetail, chat: chat, todo: todo, ai: null,
      fill: function (x) { return x == null ? '' : String(x); }, legacyHref: null
    };
  }
  /* What the existing slide composer needs for this slide: params, kind and principle meta. */
  function slidePlan(p, slideIndex) {
    var sl = p.slides[slideIndex], sc = sl && idx(p.scenes)[sl.scene]; if (!sc) return null;
    if (Collaboration.isProfile(sc.profile)) return { params: {}, kind: 'collaboration', meta: null };
    if (Workspace.isProfile(sc.profile)) return { params: { mode: Workspace.hasTab(sc.profile) ? 'szene' : 'prinzip', sub: 'workspace', profile: sc.profile, tab: sc.tab, key: p.meta.id + '-' + sl.id }, kind: 'workspace', meta: null };
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

  /* ---------- Components: one M365 screen (or an excerpt) as a picture for the trainer's own slide ----------
   * A component instance is { scene, type?, view, select?, marks? }. The type follows from the
   * scene's profile; the view decides how much of the window is shown; select names the entities
   * by ID. The renderer returns the PNG plus measured anchors, so callouts are placed by entity,
   * never by authored pixels. Readability is checked where the picture is placed (see below).
   */
  var COMPONENT_VERSION = 1;
  var COMPONENTS = {
    'teams.channel': {
      profile: 'teams-posts', label: 'Teams: Kanal mit Beiträgen',
      teachingUses: ['Zeigen, wo eine Information heute steht', 'Ausgangslage oder Problem: Arbeit, die nur im Beitrag steht'],
      avoidWhen: ['Mehr als zwei Beiträge auf einer kleinen Fläche', 'Wenn es um Verantwortung und Termine geht: dafür planner.board'],
      views: {
        window: { label: 'Ganzes Teams-Fenster mit Navigation', select: null },
        posts: { label: 'Nur die Beiträge, ohne leeren Bereich', select: 'postIds', reflow: true }
      }
    },
    'teams.chat': {
      profile: 'teams-chat', label: 'Teams: Chat zu zweit',
      teachingUses: ['Eine Absprache, die nur zwei Personen sehen', 'Entscheid im Chat, der ins Team gehört'],
      avoidWhen: ['Wenn das ganze Team die Information braucht: dafür teams.channel'],
      views: {
        window: { label: 'Ganzes Chat-Fenster', select: null },
        messages: { label: 'Nur die Nachrichten', select: 'messageIds', reflow: true }
      }
    },
    'planner.board': {
      profile: 'planner', label: 'Planner: gemeinsames Board',
      teachingUses: ['Zielbild: jede Aufgabe mit Person, Termin und Bucket', 'Lösung nach einem Problem aus Teams'],
      avoidWhen: ['Persönliche Erinnerungen: die gehören nicht in den Plan'],
      views: {
        board: { label: 'Ganzes Planner-Fenster', select: null },
        bucket: { label: 'Ein Bucket mit seinen Aufgaben', select: 'bucket', required: true }
      }
    }
  };
  /* Effective text size on the slide = text px × 72 × placed width ÷ picture width (inches, pt). */
  var READABILITY = { minTextPt: 12, note: 'Kleinster Fliesstext im Bild, in Punkt auf der Folie. Unter 12 pt ist er im Schulungsraum schwer lesbar.' };
  var MAX_COMPONENTS = 8;
  /* Reflowed excerpts: list width in app px. Narrower wraps the text like a narrow Teams window,
     so the picture can be placed smaller at the same text size. */
  var REFLOW = { min: 420, max: 1080, default: 640 };

  function componentType(profile) {
    return Object.keys(COMPONENTS).filter(function (k) { return COMPONENTS[k].profile === profile; })[0] || null;
  }
  /* Entities a scene shows, for selection and anchors. */
  function sceneEntities(p, sc) {
    if (sc.profile === 'teams-posts') return { ids: sc.posts.map(function (q) { return q.id; }), buckets: [] };
    if (sc.profile === 'teams-chat') return { ids: sc.messages.map(function (q) { return q.id; }), buckets: [] };
    if (sc.profile === 'planner') {
      var t = planTasks(p, sc.state), b = [];
      t.forEach(function (x) { var n = x.bucket || 'Aufgaben'; if (b.indexOf(n) < 0) b.push(n); });
      return { ids: t.map(function (x) { return x.id; }), buckets: b };
    }
    return { ids: [], buckets: [] };
  }
  /* Validates the project and every component spec. Never throws. */
  function validateComponents(p, specs) {
    var v = validate(p), errors = v.errors.slice(), warnings = v.warnings.slice(), out = [];
    function err(code, path, message, extra) { errors.push(Object.assign({ code: code, path: path, message: message, severity: 'error' }, extra || {})); }
    function warn(code, path, message) { warnings.push({ code: code, path: path, message: message, severity: 'warning' }); }
    if (!Array.isArray(specs) || !specs.length) { err('components', 'components', 'Mindestens eine Komponente angeben.'); return { ok: false, errors: errors, warnings: warnings, components: out }; }
    if (specs.length > MAX_COMPONENTS) err('too-many-components', 'components', 'Höchstens ' + MAX_COMPONENTS + ' Komponenten pro Aufruf.');
    if (!v.ok) return { ok: false, errors: errors, warnings: warnings, components: out };
    var SC = idx(p.scenes);
    specs.slice(0, MAX_COMPONENTS).forEach(function (s, i) {
      var path = 'components[' + i + ']';
      if (!isObj(s)) { err('bad-entry', path, 'Komponente ' + (i + 1) + ' ist kein Objekt.'); return; }
      var sc = str(s.scene) ? SC[s.scene] : null;
      if (!sc) { err('unknown-scene', path + '.scene', 'Komponente ' + (i + 1) + ': Szene «' + diagnosticText(s.scene) + '» fehlt.'); return; }
      var type = componentType(sc.profile);
      if (!type) { err('no-component', path + '.scene', 'Szene «' + sc.id + '» (' + sc.profile + ') gibt es noch nicht als Komponente. Möglich: ' + Object.keys(COMPONENTS).join(', ') + '.'); return; }
      if (s.type != null && s.type !== type) { err('component-type', path + '.type', 'Szene «' + sc.id + '» ergibt «' + type + '», nicht «' + diagnosticText(s.type) + '».'); return; }
      var C = COMPONENTS[type], view = s.view == null ? Object.keys(C.views)[0] : s.view, V = C.views[view];
      if (!V) { err('component-view', path + '.view', '«' + type + '» kennt die Ansicht «' + diagnosticText(view) + '» nicht. Möglich: ' + Object.keys(C.views).join(', ') + '.'); return; }
      if (s.width != null && (!V.reflow || typeof s.width !== 'number' || !isFinite(s.width) || s.width < REFLOW.min || s.width > REFLOW.max))
        err('component-width', path + '.width', V.reflow ? '«width» ist eine Zahl von ' + REFLOW.min + ' bis ' + REFLOW.max + ' (Pixel der App).' : 'Ansicht «' + view + '» hat keine wählbare Breite.');
      if (s.marks != null && typeof s.marks !== 'boolean') err('type', path + '.marks', '«marks» muss true oder false sein.', { expected: 'boolean' });
      var E = sceneEntities(p, sc), dup = E.ids.filter(function (x, j) { return str(x) && E.ids.indexOf(x) !== j; });
      if (dup.length) err('duplicate-entity', path + '.scene', 'Szene «' + sc.id + '»: die ID «' + dup[0] + '» kommt mehrfach vor.');
      if (E.ids.some(function (x) { return !str(x); })) warn('no-entity-id', path + '.scene', 'Szene «' + sc.id + '»: Einträge ohne ID bekommen keinen Ankerpunkt.');
      var sel = isObj(s.select) ? s.select : {}, picked = null;
      if (s.select != null && !isObj(s.select)) err('type', path + '.select', '«select» muss ein Objekt sein.', { expected: 'object' });
      Object.keys(sel).forEach(function (k) { if (k !== V.select) err('select-field', path + '.select.' + k, 'Ansicht «' + view + '» wählt ' + (V.select ? 'mit «' + V.select + '»' : 'nichts aus') + ', nicht mit «' + k + '».'); });
      if (V.select === 'bucket') {
        picked = sel.bucket;
        if (!str(picked)) err('select-bucket', path + '.select.bucket', 'Ansicht «bucket» braucht einen Bucket. Möglich: ' + E.buckets.join(', ') + '.');
        else if (E.buckets.indexOf(picked) < 0) err('unknown-bucket', path + '.select.bucket', 'Den Bucket «' + picked + '» gibt es im Plan nicht. Möglich: ' + E.buckets.join(', ') + '.');
      } else if (V.select && sel[V.select] != null) {
        picked = sel[V.select];
        if (!Array.isArray(picked) || !picked.length || !picked.every(str)) err('type', path + '.select.' + V.select, '«' + V.select + '» muss eine nicht leere Liste von IDs sein.', { expected: 'string[]' });
        else picked.forEach(function (id, j) {
          if (E.ids.indexOf(id) < 0) err('unknown-entity', path + '.select.' + V.select + '[' + j + ']', 'Die ID «' + id + '» gibt es in Szene «' + sc.id + '» nicht.', { ref: id });
          else if (picked.indexOf(id) !== j) err('duplicate-entity', path + '.select.' + V.select + '[' + j + ']', 'Die ID «' + id + '» ist doppelt gewählt.');
        });
      }
      out.push({ index: i, type: type, scene: sc.id, profile: sc.profile, view: view, select: picked, marks: s.marks === true, width: V.reflow ? Math.round(s.width || REFLOW.default) : null });
    });
    return { ok: !errors.length, errors: errors, warnings: warnings, components: errors.length ? [] : out };
  }
  function componentFile(p, c) {
    var base = ((p.meta.id || 'projekt') + '-' + c.scene + '-' + c.view).toLowerCase().replace(/[äÄ]/g, 'ae').replace(/[öÖ]/g, 'oe').replace(/[üÜ]/g, 'ue').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return 'c' + ('0' + (c.index + 1)).slice(-2) + '-' + base + '.png';
  }
  function componentCatalogue() {
    var c = copy(COMPONENTS);
    return { componentVersion: COMPONENT_VERSION, readability: copy(READABILITY), reflowWidth: copy(REFLOW), maxPerCall: MAX_COMPONENTS, types: c };
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
    lines.push('Teams-Chat (teams-chat) ist eine optionale zusätzliche Folie; die Standardabfolge bleibt bei drei Folien.');
    lines.push('Vollständige Aufgabenabfolge (sechs Folien): teams-chat → teams-posts → planner → planner-task → todo → prinzip-tasks.');
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
    lines.push('- Prinzip-Folie: im Zustand «before» dürfen höchstens ' + PRINZIP_LISTS + ' Personen Aufgaben mit list "personal" haben; mehr ist ein Fehler. Alles, was die Erklärung braucht, muss auf der Folie sichtbar sein.');
    lines.push('- Klein halten: drei bis vier gemeinsame Aufgaben, höchstens eine persönliche Erinnerung, kurze Titel. Die Obergrenzen sind Formatgrenzen, keine Zielwerte.');
    lines.push('- Vor der Ausgabe prüfen: Uhrzeiten, Namen, Zuständigkeiten und Hinweise müssen zu den Beiträgen und zu beiden Zuständen passen. Jede erklärte Änderung muss in den Folien nachvollziehbar sein.');
    lines.push('- Aussagen zu Berechtigungen, Benachrichtigungen und Sichtbarkeit als Bedingungen dieses Beispiels formulieren («persönlich» heisst hier: nicht geteilt). Keine garantierten Teams-Benachrichtigungen behaupten.');
    lines.push('- Bei Pflege-, Schul- oder Mandatsbeispielen: organisatorische Aufgaben ohne Namen betreuter Personen und ohne Angaben zu Gesundheit oder Behandlung. Die Inhalte müssen die eigene Grenze («boundary») der Prinzip-Folie einhalten.');
    lines.push('- Annahmen über das Verhalten von Microsoft 365, die du triffst, schreibe in meta.assumptions.');
    lines.push('- planner-task: team, state und task (bestehende Aufgaben-ID). Die Aufgabe steht in diesem Zustand mit owner im Plan. Details stehen NUR in states[].tasks[taskId]: notes, progress (not-started/in-progress/completed), checklist [{text,done}], optional comment {by,text}. Kein zweiter Aufgabentitel in der Szene.');
    lines.push('- todo: team, state, viewer und taskIds (1–6 bestehende IDs, nur Aufgaben dieser Person). Zeigt die bewusst ausgewählten Aufgaben in Mein Tag. personalListPrivate:true und myDaySelected:true sind erforderlich. Für Planner-Aufgaben zusätzlich plannerConnected:true: gleiches Arbeitskonto und aktivierte Planner-Verbindung voraussetzen. Mein Tag ist keine automatische Kopie aller Aufgaben. Aufgaben-IDs, Titel, Termine und Status bleiben identisch mit dem Plan.');
    lines.push('- Ab capabilityVersion 6: sharedComponents [{id,kind:meeting-notes|table,title,owner,storage:onedrive}]. Vollständige Zustände in states[].components[componentId]. Für meeting-notes: agenda und decisions als Listen [{id,text,by}], taskIds als Referenzen auf Aufgaben desselben Zustands (list plan, owner und due nötig). Für table: rows [{id,text,by}], keine taskIds. Höchstens 3 Agendaeinträge, 2 Entscheide, 4 Aufgaben oder 4 Tabellenzeilen; je 100 Zeichen.');
    lines.push('- meeting-notes: team, component, state, viewer, meeting (bis 70 Zeichen), accessConfirmed:true. loop-component: team, component, state, viewer, partner, surface teams-chat|outlook, accessConfirmed:true. Titel und Inhalte nur am gemeinsamen Objekt, nie in Szenen duplizieren. Notizenplan entsteht beim ersten Aufgabeneintrag; Mein Tag bleibt persönliche Auswahl.');
    lines.push('- workflow: team, title, question, boundary, steps (2–5) [{id,actor,tool,action,artefact,relation:manual|link|sync,evidence}]. sync nur mit evidence loop-planner|planner-todo|loop-surfaces und dokumentierten Voraussetzungen. Dies sind Erklärbilder, keine Live-Integrationen. Beispielprojekte: CLI catalogue und example --kind weekly-meeting oder shared-loop; MCP get_catalogue und get_example.');
    lines.push('- Behaupte nicht, du hättest die Folien gerendert oder das JSON geprüft. Die Prüfung macht die Website beim Import.');
    lines.push('- Kein HTML, kein CSS, kein Script, keine Bild-URLs. Texte sind reiner Text.');
    lines.push('');
    lines.push('Optionale Chat-Szene (in scenes einfügen und in slides referenzieren): ' + JSON.stringify({ id: 'sc-chat', profile: 'teams-chat', team: 'Werkstatt Velotech', viewer: 'p-marco', partner: 'p-aylin', messages: [{ id: 'm1', by: 'p-aylin', text: 'Ich übernehme die Bremsen.', hint: 'Der Entscheid ist noch nicht im Plan.', decision: true }], notSeenBy: ['p-jonas'] }));
    lines.push('Optionale Detailszene: ' + JSON.stringify({ id: 'sc-detail', profile: 'planner-task', team: 'Werkstatt Velotech', state: 'after', task: 't-bremsen' }));
    lines.push('Optionale To-Do-Szene: ' + JSON.stringify({ id: 'sc-todo', profile: 'todo', team: 'Werkstatt Velotech', state: 'after', viewer: 'p-aylin', taskIds: ['t-bremsen', 't-lager'], personalListPrivate: true, myDaySelected: true, plannerConnected: true }));
    lines.push('');
    lines.push('Arbeitsbereich: workspace-map und workspace-scene verwenden dieselbe workspace.nodes-Liste. root und selected verweisen auf IDs. workspace-scene nutzt tab posts oder files. viewer ist für persönliche Ablagen erforderlich. house ist ein optionales Boolean für die Karte.');
    lines.push('Ab capabilityVersion 5: workspace-houses zeigt alle Teams der Person viewer anhand ihrer Mitgliedschaften. Keine Felder root, selected oder tab. workspace-house-teams zeigt ein Team (root) mit derselben Auswahl (selected) im Haus und in Teams, tab posts oder files. Optional: teamType und collaboration am Team, je maximal 24 Zeichen.');
    lines.push('Vollständiges Haus-Beispiel: ' + JSON.stringify(workspaceExample('workspace-houses')));
    lines.push('Vollständiges Arbeitsbereich-Beispiel (alternativ zur Aufgabenabfolge): ' + JSON.stringify(workspaceExample()));
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
    (q.sharedComponents || []).forEach(function (c) { if (c.owner === from) c.owner = to; });
    q.states.forEach(function (st) { Object.keys(st.components || {}).forEach(function (cid) { ['agenda', 'decisions', 'rows'].forEach(function (k) { (st.components[cid][k] || []).forEach(function (r) { if (r.by === from) r.by = to; }); }); }); });
    q.scenes.forEach(function (sc) {
      (sc.posts || []).concat(sc.messages || []).forEach(function (x) { if (x.by === from) x.by = to; });
      ['viewer', 'partner'].forEach(function (k) { if (sc[k] === from) sc[k] = to; });
      if (Array.isArray(sc.notSeenBy)) sc.notSeenBy = sc.notSeenBy.map(function (id) { return id === from ? to : id; });
    });
    if (q.workspace && Array.isArray(q.workspace.nodes)) q.workspace.nodes.forEach(function (n) {
      if (!isObj(n)) return;
      if (n.owner === from) n.owner = to;
      ['members', 'sharedWith'].forEach(function (k) {
        if (Array.isArray(n[k])) n[k] = Array.from(new Set(n[k].map(function (id) { return id === from ? to : id; })));
      });
      if (Array.isArray(n.posts)) n.posts.forEach(function (post) { if (isObj(post) && post.by === from) post.by = to; });
    });
    q.states.forEach(function (st) { Object.keys(st.tasks || {}).forEach(function (k) { if (st.tasks[k].owner === from) st.tasks[k].owner = to; if (st.tasks[k].comment && st.tasks[k].comment.by === from) st.tasks[k].comment.by = to; }); });
    return q;
  }
  function newId(prefix, list) {
    var n = list.length + 1; while (list.some(function (x) { return x.id === prefix + n; })) n++;
    return prefix + n;
  }
  function serialise(p) { return JSON.stringify(p, null, 2); }

  return {
    FORMAT: FORMAT, STATE_IDS: STATE_IDS.slice(), PROJECT_VERSION: PROJECT_VERSION, CAPABILITY_VERSION: CAPABILITY_VERSION, RENDERER_VERSION: RENDERER_VERSION, MAX_INPUT: MAX_INPUT,
    capabilities: function () { return copy(CAPABILITIES); },
    template: template, workspaceExample: workspaceExample, blank: blank, parseInput: parseInput, validate: validate, summary: summary,
    compile: compile, compileScene: compileScene, slidePlan: slidePlan, fileName: fileName, planTasks: planTasks,
    COMPONENT_VERSION: COMPONENT_VERSION, components: componentCatalogue, validateComponents: validateComponents, componentFile: componentFile,
    authoringPack: authoringPack, repairPrompt: repairPrompt, replacePersonRef: replacePersonRef, newId: newId, serialise: serialise, copy: copy
  };
});
