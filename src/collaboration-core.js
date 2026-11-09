/* Capability 6: shared component snapshots, meeting notes and labelled workflow explanations. */
(function (root, factory) {
  var value = factory();
  if (typeof module === 'object' && module.exports) module.exports = value;
  else root.CollaborationCore = value;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  var profiles = {
    'meeting-notes': { label: 'Teams: gemeinsame Besprechungsnotizen', renderer: 'meeting-notes', minCapabilityVersion: 6, needs: ['team', 'component', 'state', 'viewer', 'meeting', 'accessConfirmed'], budgets: { team: 40, meeting: 70, agenda: 3, decisions: 2, tasks: 4 } },
    'loop-component': { label: 'Loop: dieselbe Komponente in Chat oder Outlook', renderer: 'loop-component', minCapabilityVersion: 6, needs: ['team', 'component', 'state', 'surface', 'viewer', 'partner', 'accessConfirmed'], budgets: { team: 40, rows: 4, text: 100 } },
    workflow: { label: 'Prinzip: Arbeitsfluss mit Übergaben', renderer: 'workflow', minCapabilityVersion: 6, needs: ['team', 'title', 'steps', 'question', 'boundary'], budgets: { team: 40, steps: 5, action: 90, artefact: 50 } }
  };
  var obj = function (x) { return x && typeof x === 'object' && !Array.isArray(x); };
  var id = function (x) { return typeof x === 'string' && /^[a-z][a-z0-9-]{0,39}$/.test(x); };
  function isProfile(s) { return typeof s === 'string' && Object.prototype.hasOwnProperty.call(profiles, s); }
  function check(p, err) {
    var components = Object.create(null), people = Object.create(null), tasks = Object.create(null), states = Object.create(null);
    (Array.isArray(p.people) ? p.people : []).forEach(function (x) { if (obj(x) && typeof x.id === 'string') people[x.id] = x; });
    (Array.isArray(p.tasks) ? p.tasks : []).forEach(function (x) { if (obj(x) && typeof x.id === 'string') tasks[x.id] = x; });
    function text(x, max, path) { if (typeof x !== 'string' || !x.trim() || x.length > max) err('collaboration-text', path, 'Text erforderlich, höchstens ' + max + ' Zeichen.'); }
    function person(x, path) { if (typeof x !== 'string' || !people[x]) err('unknown-person', path, 'Eine vorhandene Personen-ID wählen.'); }
    var list = p.sharedComponents;
    if (list != null && (!Array.isArray(list) || list.length > 6)) err('shared-components', 'sharedComponents', 'Höchstens sechs gemeinsame Komponenten als Liste erfassen.');
    (Array.isArray(list) ? list : []).forEach(function (c, i) {
      var path = 'sharedComponents[' + i + ']';
      if (!obj(c)) { err('shared-component', path, 'Komponente muss ein Objekt sein.'); return; }
      if (!id(c.id) || components[c.id]) err('component-id', path + '.id', 'Gültige eindeutige Komponenten-ID erforderlich.');
      else components[c.id] = c;
      text(c.title, 60, path + '.title'); person(c.owner, path + '.owner');
      if (!['meeting-notes', 'table'].includes(c.kind)) err('component-kind', path + '.kind', 'Möglich: meeting-notes oder table.');
      if (c.storage !== 'onedrive') err('component-storage', path + '.storage', 'Dieses Profil illustriert eine in OneDrive erzeugte Komponente. storage: onedrive setzen.');
      if (p.capabilityVersion < 6) err('profile-version', path, 'Gemeinsame Komponenten brauchen capabilityVersion 6.');
    });
    (Array.isArray(p.states) ? p.states : []).forEach(function (st, i) {
      if (!obj(st)) return; if (typeof st.id === 'string') states[st.id] = st;
      if (st.components == null) return;
      if (!obj(st.components)) { err('component-state', 'states[' + i + '].components', 'Komponentenzustände müssen ein Objekt sein.'); return; }
      Object.keys(st.components).forEach(function (cid) {
        var path = 'states[' + i + '].components.' + cid, c = components[cid], snap = st.components[cid];
        if (!c) err('unknown-component', path, 'Komponenten-ID fehlt in sharedComponents.');
        if (!obj(snap)) { err('component-state', path, 'Vollständigen Komponentenzustand erfassen.'); return; }
        var fields = c && c.kind === 'table' ? ['rows'] : ['agenda', 'decisions'];
        fields.forEach(function (key) {
          var rows = snap[key], seen = Object.create(null), max = key === 'rows' ? 4 : key === 'agenda' ? 3 : 2;
          if (!Array.isArray(rows) || rows.length > max) { err('component-rows', path + '.' + key, 'Liste erforderlich, höchstens ' + max + ' Einträge.'); return; }
          rows.forEach(function (r, j) {
            var rp = path + '.' + key + '[' + j + ']';
            if (!obj(r)) { err('component-row', rp, 'Eintrag muss id, text und by enthalten.'); return; }
            if (!id(r.id) || seen[r.id]) err('component-row-id', rp + '.id', 'Gültige eindeutige Zeilen-ID erforderlich.');
            if (id(r.id)) seen[r.id] = true; text(r.text, 100, rp + '.text'); person(r.by, rp + '.by');
          });
        });
        if (c && c.kind === 'meeting-notes') {
          if (!Array.isArray(snap.taskIds) || snap.taskIds.length > 4 || new Set(snap.taskIds).size !== snap.taskIds.length) err('component-tasks', path + '.taskIds', 'Höchstens vier eindeutige Aufgaben-IDs erforderlich.');
          else snap.taskIds.forEach(function (tid, j) {
            var t = typeof tid === 'string' && obj(st.tasks) && st.tasks[tid];
            if (typeof tid !== 'string' || !tasks[tid] || !obj(t) || t.list !== 'plan' || !people[t.owner] || typeof t.due !== 'string' || !t.due.trim()) err('component-task-ref', path + '.taskIds[' + j + ']', 'Aufgabe muss in diesem Zustand im Notizenplan mit Person und Termin stehen.');
          });
        }
        if (c && c.kind === 'table' && snap.taskIds != null) err('table-tasks', path + '.taskIds', 'Eine Loop-Tabelle ist keine synchronisierte Aufgabenliste.');
      });
    });
    (Array.isArray(p.scenes) ? p.scenes : []).forEach(function (sc, i) {
      if (!obj(sc) || !isProfile(sc.profile)) return;
      var path = 'scenes[' + i + ']';
      if (p.capabilityVersion < 6) err('profile-version', path + '.profile', 'Diese Ansicht braucht capabilityVersion 6.');
      text(sc.team, 40, path + '.team');
      if (sc.profile === 'workflow') {
        text(sc.title, 70, path + '.title'); text(sc.question, 120, path + '.question'); text(sc.boundary, 220, path + '.boundary');
        if (!Array.isArray(sc.steps) || sc.steps.length < 2 || sc.steps.length > 5) { err('workflow-steps', path + '.steps', 'Zwei bis fünf Schritte erforderlich.'); return; }
        var seen = Object.create(null);
        sc.steps.forEach(function (s, j) {
          var sp = path + '.steps[' + j + ']';
          if (!obj(s)) { err('workflow-step', sp, 'Schritt muss ein Objekt sein.'); return; }
          if (!id(s.id) || seen[s.id]) err('workflow-id', sp + '.id', 'Eindeutige Schritt-ID erforderlich.'); if (id(s.id)) seen[s.id] = true;
          ['actor', 'tool', 'action', 'artefact'].forEach(function (k) { text(s[k], k === 'action' ? 90 : 50, sp + '.' + k); });
          if (!['manual', 'link', 'sync'].includes(s.relation)) err('workflow-relation', sp + '.relation', 'Beziehung als manual, link oder sync beschriften.');
          if (s.relation === 'sync' && !['loop-planner', 'planner-todo', 'loop-surfaces'].includes(s.evidence)) err('workflow-evidence', sp + '.evidence', 'Synchronisation braucht belegte Beziehung: loop-planner, planner-todo oder loop-surfaces.');
        }); return;
      }
      var c = typeof sc.component === 'string' && components[sc.component], st = typeof sc.state === 'string' && states[sc.state];
      if (typeof sc.component !== 'string' || !c) err('unknown-component', path + '.component', 'Vorhandene gemeinsame Komponente wählen.');
      if (!st || !obj(st.components) || (typeof sc.component !== 'string' || !obj(st.components[sc.component]))) err('component-state', path + '.state', 'Komponente muss im gewählten Zustand vollständig vorhanden sein.');
      person(sc.viewer, path + '.viewer');
      if (sc.accessConfirmed !== true) err('component-access', path + '.accessConfirmed', 'Bearbeitungszugriff und interne Konten als Voraussetzung mit accessConfirmed:true bestätigen.');
      if (sc.profile === 'meeting-notes') {
        if (c && c.kind !== 'meeting-notes') err('component-kind', path + '.component', 'Besprechungsnotizen benötigen kind meeting-notes.');
        text(sc.meeting, 70, path + '.meeting');
      } else {
        if (c && c.kind !== 'table') err('component-kind', path + '.component', 'Das Komponentenprofil unterstützt hier nur Tabellen.');
        if (!['teams-chat', 'outlook'].includes(sc.surface)) err('component-surface', path + '.surface', 'Unterstützt: teams-chat oder outlook.');
        person(sc.partner, path + '.partner');
        if (sc.viewer === sc.partner) err('component-participants', path + '.partner', 'Zwei unterschiedliche Personen wählen.');
      }
    });
  }
  function model(p, sc) {
    if (sc.profile === 'workflow') return { scene: sc };
    var component = p.sharedComponents.find(function (c) { return c.id === sc.component; });
    var state = p.states.find(function (s) { return s.id === sc.state; });
    var snapshot = state.components[component.id];
    return { scene: sc, component: component, label: state.label, snapshot: snapshot, tasks: (snapshot.taskIds || []).map(function (tid) { return Object.assign({}, p.tasks.find(function (t) { return t.id === tid; }), state.tasks[tid]); }) };
  }
  return { profiles: profiles, isProfile: isProfile, check: check, model: model };
});
