/*
 * Project workspace: manual authoring and the AI-assistant bridge on one format.
 * Routes (handled from app.js):
 *   #/projekt              start: Beispiel anpassen, Neue Abfolge, Projekt öffnen, KI-Assistent
 *   #/projekt/bearbeiten   editor with live slide previews, save and PNG export
 *   #/projekt/ki           guided brief → authoring pack → paste result
 *   #/projekt/import       import review: summary, person repair, repair prompt
 * All checks and transformations go through ProjectCore; this file only handles the page.
 * Drafts live in this browser (localStorage). Storage failures are shown, never swallowed, and
 * a draft is only removed when the user removes it. Imported text is never executed: every
 * value is escaped, source URLs are not fetched.
 */
(function (root) {
  var PC = root.ProjectCore, V = root.Views, X = root.Export, A = root.M365;
  var esc = V.esc, WE = root.WorkspaceEditor;
  var KEY = 'mtp.projects';

  /* ---------- storage: several drafts, one current; an import never overwrites a draft ---------- */
  var MAX_DRAFTS = 8, storageProblem = '';
  function empty() { return { drafts: [], current: -1, brief: {}, pending: null }; }
  function load() {
    var raw;
    try { raw = localStorage.getItem(KEY); } catch (e) { storageProblem = 'Der Browser erlaubt hier keine Speicherung. Entwürfe gehen beim Schliessen verloren: bitte «Projekt sichern».'; return empty(); }
    if (!raw) return empty();
    try { var o = JSON.parse(raw); if (o && Array.isArray(o.drafts)) return o; } catch (e) { /* handled below */ }
    /* Unreadable data is kept under a second key instead of being overwritten. */
    try { localStorage.setItem(KEY + '.unlesbar', raw); } catch (e) { /* reported below */ }
    storageProblem = 'Gespeicherte Entwürfe waren nicht lesbar. Sie wurden unter «' + KEY + '.unlesbar» aufbewahrt und nicht gelöscht.';
    return empty();
  }
  var st = load();
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(st)); if (/nicht gespeichert/.test(storageProblem)) storageProblem = ''; return true; }
    catch (e) { storageProblem = 'Entwurf konnte in diesem Browser nicht gespeichert werden (' + (e && e.name || 'Fehler') + '). Die Änderungen bleiben nur bis zum Schliessen der Seite: bitte «Projekt sichern».'; showStorage(); return false; }
  }
  function showStorage() { var el = document.getElementById('pj-storage'); if (el) { el.textContent = storageProblem; el.hidden = !storageProblem; } }
  function storageBox() { return '<p class="pj-errbox" id="pj-storage" role="alert"' + (storageProblem ? '' : ' hidden') + '>' + esc(storageProblem) + '</p>'; }
  function cur() { return st.drafts[st.current] ? st.drafts[st.current].project : null; }
  /* Never drops an older draft to make room: at the limit the user decides what to remove. */
  function addDraft(p, origin) {
    if (st.drafts.length >= MAX_DRAFTS) {
      storageProblem = 'Es sind bereits ' + MAX_DRAFTS + ' Entwürfe gespeichert. Bitte zuerst einen Entwurf sichern und entfernen; es wird nichts automatisch gelöscht.';
      showStorage(); announce(storageProblem); return false;
    }
    st.drafts.unshift({ project: p, origin: origin, savedAt: new Date().toISOString() });
    st.current = 0; persist(); return true;
  }
  function touch() { if (st.drafts[st.current]) st.drafts[st.current].savedAt = new Date().toISOString(); persist(); }

  function announce(t) { var l = document.getElementById('live'); if (l) { l.textContent = ''; setTimeout(function () { l.textContent = t; }, 30); } }
  function profiles() { return PC.capabilities().profiles; }
  function sceneOf(p, sl) { return p.scenes.filter(function (s) { return s.id === sl.scene; })[0]; }
  function personOptions(p, value, allowNone) {
    var known = p.people.some(function (x) { return x.id === value; });
    return (allowNone ? '<option value="">(niemand)</option>' : '') +
      (!known && value ? '<option value="' + esc(value) + '" selected>Unbekannt: ' + esc(value) + '</option>' : '') +
      p.people.map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === value ? ' selected' : '') + '>' + esc(x.name) + '</option>'; }).join('');
  }
  function field(label, path, value, o) {
    o = o || {};
    var id = 'f-' + path.replace(/[^a-z0-9]+/gi, '-');
    var input = o.area ? '<textarea id="' + id + '" data-path="' + esc(path) + '" rows="' + (o.rows || 3) + '"' + (o.max ? ' maxlength="' + (o.max * 2) + '"' : '') + '>' + esc(value || '') + '</textarea>'
      : '<input id="' + id + '" data-path="' + esc(path) + '" value="' + esc(value || '') + '"' + (o.max ? ' maxlength="' + (o.max * 2) + '"' : '') + '>';
    return '<p class="pj-f' + (o.cls ? ' ' + o.cls : '') + '"><label for="' + id + '">' + esc(label) + (o.max ? ' <small>bis ' + o.max + ' Zeichen</small>' : '') + '</label>' + input + '</p>';
  }
  function select(label, path, options, o) {
    var id = 'f-' + path.replace(/[^a-z0-9]+/gi, '-');
    return '<p class="pj-f' + (o && o.cls ? ' ' + o.cls : '') + '"><label for="' + id + '">' + esc(label) + '</label><select id="' + id + '" data-path="' + esc(path) + '">' + options + '</select></p>';
  }
  function getPath(o, path) { return path.split('.').reduce(function (a, k) { return a == null ? a : a[k]; }, o); }
  function setPath(o, path, v) {
    var ks = path.split('.'), last = ks.pop();
    var t = ks.reduce(function (a, k) { if (a[k] == null) a[k] = {}; return a[k]; }, o);
    t[last] = v;
  }

  /* ---------- pages ---------- */
  function start() {
    var drafts = st.drafts.map(function (d, i) {
      var p = d.project;
      var title = p && p.meta && typeof p.meta.title === 'string' && p.meta.title || 'Ohne Titel';
      return '<li><button type="button" class="linkish" data-op="open-draft" data-i="' + i + '">' + esc(title) + '</button> <small>' + esc(p && p.meta && typeof p.meta.organisation === 'string' ? p.meta.organisation : '') + ' · ' + esc(originLabel(d.origin)) + ' · ' + esc(new Date(d.savedAt).toLocaleString('de-CH')) + '</small> <button type="button" class="linkish" data-op="del-draft" data-i="' + i + '" aria-label="Entwurf «' + esc(title) + '» entfernen">entfernen</button></li>';
    }).join('');
    return '<section class="block pj"><nav class="pj-crumbs" aria-label="Pfad"><a href="#/">Bibliothek</a> › Eigene Abfolge</nav>' +
      '<h1>Eigene Abfolge erstellen</h1>' + storageBox() +
      '<p class="lead">Eine kurze Folgenreihe für die Schulung: Teams-Beiträge → Planner → Prinzip. Von Hand im Formular oder mit deinem KI-Assistenten vorbereitet. Beide Wege ergeben dieselbe Projektdatei, die du sichern, wieder öffnen und als PNG exportieren kannst.</p>' +
      '<div class="pj-routes">' +
        '<div class="pj-route"><h2>Arbeitsbereich erkunden</h2><p>Team, Kanäle und Dateiablage planen und in der Vorschau ansehen.</p>' +
          '<p><button type="button" class="btn btn-p" data-op="adapt-workspace">Arbeitsbereich öffnen</button></p></div>' +
        '<div class="pj-route"><h2>Von Hand</h2><p>Mit beschrifteten Feldern. Kein JSON nötig.</p>' +
          '<p class="pj-acts"><button type="button" class="btn btn-p" data-op="adapt">Beispiel anpassen</button> <button type="button" class="btn" data-op="new">Neue Abfolge</button></p></div>' +
        '<div class="pj-route"><h2>Mit deinem KI-Assistenten vorbereiten</h2><p>Kurz beschreiben, Auftrag kopieren, Ergebnis hier einfügen. Gedacht für Chat-Assistenten, die einen längeren Auftrag annehmen; kein Konto oder Schlüssel nötig. Ob ein bestimmter Assistent gültige Projekte liefert, ist nicht garantiert: die Website prüft jedes Ergebnis.</p>' +
          '<p class="pj-acts"><a class="btn btn-p" href="#/projekt/ki">Mit deinem KI-Assistenten vorbereiten</a></p></div>' +
        '<div class="pj-route"><h2>Projekt öffnen</h2><p>Eine gesicherte Projektdatei (.json) oder ein eingefügtes Ergebnis.</p>' +
          '<p class="pj-acts"><label class="btn" for="pj-file">Projekt öffnen</label><input type="file" id="pj-file" accept=".json,application/json,text/plain" class="sr-only" data-op="file"></p>' +
          importBox() + '</div>' +
      '</div>' +
      (drafts ? '<h2>Entwürfe in diesem Browser (' + st.drafts.length + ' von ' + MAX_DRAFTS + ')</h2><ul class="pj-drafts">' + drafts + '</ul>' : '') +
      '<p class="pj-small">Die gesicherten Anpassungen der Bibliothek (Namen, Folientexte) sind ein eigenes Format und funktionieren weiter wie bisher.</p></section>';
  }
  function originLabel(o) { return { template: 'aus Beispiel', manual: 'neu', import: 'importiert', assistant: 'vom KI-Assistenten' }[o] || o || ''; }
  function importBox() {
    return '<details class="pj-paste"><summary>Ergebnis einfügen</summary><p><label for="pj-paste">Die ganze Antwort des Assistenten oder das JSON</label><textarea id="pj-paste" rows="6" spellcheck="false"></textarea></p>' +
      '<p><button type="button" class="btn" data-op="paste">Prüfen</button></p><p class="pj-err" id="pj-paste-err" role="alert"></p></details>';
  }

  function assistant() {
    var b = st.brief || {};
    var pack = PC.authoringPack(b);
    return '<section class="block pj"><nav class="pj-crumbs" aria-label="Pfad"><a href="#/">Bibliothek</a> › <a href="#/projekt">Eigene Abfolge</a> › KI-Assistent</nav>' +
      '<h1>Mit deinem KI-Assistenten vorbereiten</h1>' +
      '<ol class="pj-steps"><li class="on">Auftrag kopieren</li><li>Im KI-Assistenten vorbereiten</li><li>Ergebnis einfügen</li></ol>' +
      '<form class="pj-brief" onsubmit="return false">' +
        bf('Publikum', 'audience', b.audience, 'z. B. Teamleitungen in der Pflege') +
        bf('Ziel', 'goal', b.goal, 'z. B. Übergaben ohne verlorene Aufgaben') +
        bf('Kontext', 'context', b.context, 'z. B. Spital, drei Schichten, Teams und Planner vorhanden') +
        bf('Dauer (optional)', 'duration', b.duration, 'z. B. 10 Minuten') +
      '</form>' +
      '<p class="pj-small">Standard: drei Folien (Teams-Beiträge → Planner → Prinzip). Der Auftrag enthält die erlaubten Ansichten, Textlängen und ein vollständiges Beispiel. Die Website prüft das Ergebnis beim Einfügen; der Assistent prüft nichts.</p>' +
      '<h2>1. Auftrag kopieren</h2><p><button type="button" class="btn btn-p" data-op="copy" data-src="pj-pack">Auftrag kopieren</button> <span class="pj-small" id="pj-copied" role="status"></span></p>' +
      '<details><summary>Auftrag ansehen (' + pack.length + ' Zeichen)</summary><textarea id="pj-pack" rows="14" readonly spellcheck="false">' + esc(pack) + '</textarea></details>' +
      '<h2>2. Im KI-Assistenten vorbereiten</h2><p>Füge den Auftrag in deinen gewohnten Assistenten ein. Er darf Rückfragen stellen oder ein Storyboard vorschlagen. Am Ende gibt er ein JSON-Projekt zurück.</p>' +
      '<h2>3. Ergebnis einfügen</h2>' + importBox().replace('<details class="pj-paste">', '<details class="pj-paste" open>') +
      '</section>';
  }
  function bf(label, k, v, ph) { return '<p class="pj-f"><label for="b-' + k + '">' + label + '</label><input id="b-' + k + '" data-brief="' + k + '" value="' + esc(v || '') + '" placeholder="' + esc(ph) + '"></p>'; }

  function review() {
    var pd = st.pending;
    if (!pd) return '<section class="block pj"><h1>Kein Import offen</h1><p><a href="#/projekt">Zurück</a></p></section>';
    var p = pd.project, s = PC.summary(p);
    var persons = s.errors.filter(function (e) { return e.code === 'unknown-person'; });
    var refs = persons.map(function (e) { return e.ref; }).filter(function (r, i, a) { return a.indexOf(r) === i; });
    var other = s.errors.filter(function (e) { return e.code !== 'unknown-person'; });
    var canPeople = Array.isArray(p.people) && p.people.length;
    return '<section class="block pj"><nav class="pj-crumbs" aria-label="Pfad"><a href="#/">Bibliothek</a> › <a href="#/projekt">Eigene Abfolge</a> › Import prüfen</nav>' +
      '<h1>Import prüfen</h1>' +
      '<p class="lead">Das Ergebnis wird als <strong>neuer Entwurf</strong> geöffnet. Deine bisherigen Entwürfe bleiben unverändert.</p>' +
      '<dl class="pj-sum"><dt>Titel</dt><dd>' + esc(s.title || '(fehlt)') + '</dd><dt>Organisation</dt><dd>' + esc(s.organisation || '') + '</dd>' +
        '<dt>Folien</dt><dd><ol>' + s.slides.map(function (x) { return '<li>' + esc(x.replace(/^\d+\.\s*/, '')) + '</li>'; }).join('') + '</ol></dd>' +
        '<dt>Personen · Aufgaben</dt><dd>' + s.people + ' · ' + s.tasks + '</dd>' +
        (s.assumptions.length ? '<dt>Annahmen</dt><dd><ul>' + s.assumptions.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul></dd>' : '') + '</dl>' +
      (s.ok ? '<p class="pj-ok">' + V.ic('i-check') + 'Keine Fehler gefunden.</p>' : '<h2>Was nicht passt</h2>') +
      refs.map(function (r) {
        var where = persons.filter(function (e) { return e.ref === r; }).map(function (e) { return '<li>' + esc(e.message) + '</li>'; }).join('');
        return '<div class="pj-fix"><p><strong>Unbekannte Person «' + esc(r) + '»</strong></p><ul>' + where + '</ul>' +
          (canPeople ? '<p class="pj-f"><label for="fix-' + esc(r) + '">Durch diese Person ersetzen</label><select id="fix-' + esc(r) + '" data-fix="' + esc(r) + '"><option value="">Bitte wählen …</option>' + personOptions(p, '', false) + '</select> <button type="button" class="btn" data-op="fix-person" data-ref="' + esc(r) + '">Ersetzen</button></p>' : '') + '</div>';
      }).join('') +
      (other.length ? '<ul class="pj-errs">' + other.map(function (e) { return '<li>' + esc(e.message) + '</li>'; }).join('') + '</ul>' : '') +
      (s.warnings.length ? '<h2>Hinweise (blockieren nicht)</h2><ul class="pj-warns">' + s.warnings.map(function (e) { return '<li>' + esc(e.message) + '</li>'; }).join('') + '</ul>' : '') +
      (!s.ok ? '<details class="pj-repair"><summary>Korrektur-Auftrag für den KI-Assistenten</summary><p>Dieser Text wird kopiert. Er enthält die Fehler und das ganze Projekt:</p><textarea id="pj-repair" rows="10" readonly spellcheck="false">' + esc(PC.repairPrompt(p, s.errors)) + '</textarea><p><button type="button" class="btn" data-op="copy" data-src="pj-repair">Korrektur-Auftrag kopieren</button> <span class="pj-small" id="pj-copied" role="status"></span></p></details>' : '') +
      '<p class="pj-acts">' + (s.ok ? '<button type="button" class="btn btn-p" data-op="accept">Als neuen Entwurf öffnen</button>' : (editable(s) ? '<button type="button" class="btn" data-op="accept-anyway">Trotzdem öffnen und von Hand korrigieren</button>' : '<span class="pj-small">Diese Fehler kann der Editor nicht anzeigen. Bitte mit dem Korrektur-Auftrag oder in der Datei beheben.</span>')) +
      ' <button type="button" class="btn" data-op="cancel">Abbrechen</button></p>' +
      importBox() + '</section>';
  }

  function editor() {
    var p = cur();
    if (!p) return start();
    var v = PC.validate(p), prof = profiles();
    if (!editable(v)) return '<section class="block pj"><nav class="pj-crumbs" aria-label="Pfad"><a href="#/">Bibliothek</a> › <a href="#/projekt">Eigene Abfolge</a> › Bearbeiten</nav><h1>Dieser Entwurf kann nicht bearbeitet werden</h1>' +
      '<p>Er hat Strukturfehler, die der Editor nicht anzeigen kann:</p>' + validity(v) +
      '<p class="pj-acts"><button type="button" class="btn" data-op="save">Projekt sichern</button> <a class="btn" href="#/projekt">Zurück</a></p><p class="pj-small" id="pj-status" role="status"></p></section>';
    if (p.workspace && v.ok && WE.focus(p)) return workspaceEditor(p, v);
    var after = p.states.filter(function (s) { return s.id === 'after'; })[0], before = p.states.filter(function (s) { return s.id === 'before'; })[0];
    var bi = p.states.indexOf(before), ai = p.states.indexOf(after);
    function stateSel(si, tid) {
      var e = p.states[si] && p.states[si].tasks[tid], val = !e ? 'none' : e.list;
      return '<select data-state="' + si + '" data-task="' + esc(tid) + '" aria-label="' + esc(p.states[si].label) + ': wo steht die Aufgabe?">' +
        [['personal', 'Persönliche Liste'], ['plan', 'Gemeinsamer Plan'], ['none', 'Nicht gezeigt']].map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === val ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>';
    }
    var html = '<section class="block pj pj-ed"><nav class="pj-crumbs" aria-label="Pfad"><a href="#/">Bibliothek</a> › <a href="#/projekt">Eigene Abfolge</a> › Bearbeiten</nav>' + storageBox() +
      '<header class="pj-head"><h1>' + esc(p.meta.title) + '</h1>' +
      '<p class="pj-acts"><button type="button" class="btn btn-p" data-op="save">Projekt sichern</button> <button type="button" class="btn" data-op="export">Alle Folien als PNG</button> <a class="btn" href="#/projekt">Andere Abfolge</a></p>' +
      '<p class="pj-small" id="pj-status" role="status">Entwurf wird in diesem Browser laufend gespeichert. «Projekt sichern» lädt die Datei herunter.</p></header>' +
      '<div class="pj-cols"><div class="pj-form">' +
      '<div id="pj-valid">' + validity(v) + '</div>' +
      '<fieldset><legend>Abfolge</legend>' + field('Titel', 'meta.title', p.meta.title, { max: 70 }) + field('Organisation (fiktiv)', 'meta.organisation', p.meta.organisation) +
        field('Publikum', 'meta.audience', p.meta.audience) + field('Ziel', 'meta.goal', p.meta.goal) +
        '<p class="pj-f"><label for="f-assume">Annahmen, eine pro Zeile</label><textarea id="f-assume" data-lines="meta.assumptions" rows="2">' + esc((p.meta.assumptions || []).join('\n')) + '</textarea></p>' +
        field('Notizen zum Projekt', 'meta.notes', p.meta.notes, { area: true, rows: 2 }) + '</fieldset>' +
      '<fieldset><legend>Personen</legend><ul class="pj-rows">' + p.people.map(function (x, i) {
        return '<li>' + field('Name', 'people.' + i + '.name', x.name, { cls: 'pj-half' }) + field('Rolle', 'people.' + i + '.role', x.role, { cls: 'pj-half' }) +
          '<button type="button" class="btn sm" data-op="del-person" data-i="' + i + '" aria-label="' + esc(x.name) + ' entfernen">Entfernen</button></li>';
      }).join('') + '</ul><p><button type="button" class="btn sm" data-op="add-person">Person hinzufügen</button></p></fieldset>' +
      '<fieldset><legend>Aufgaben: vorher und nachher</legend><p class="pj-small">«Vorher» füllt die linke Seite des Prinzips, «Nachher» den Planner und die rechte Seite. Eine nicht gezeigte Aufgabe bleibt im Projekt.</p>' +
        '<ul class="pj-rows pj-tasks">' + p.tasks.map(function (t, i) {
          var eb = before && before.tasks[t.id], ea = after && after.tasks[t.id];
          return '<li>' + field('Aufgabe', 'tasks.' + i + '.title', t.title, { max: 60 }) +
            '<div class="pj-st"><p class="pj-f"><span class="pj-lab">' + esc(before.label) + '</span>' + stateSel(bi, t.id) + '</p>' +
              (eb ? select('Person', 'states.' + bi + '.tasks.' + t.id + '.owner', personOptions(p, eb.owner, eb.list === 'plan')) : '') + '</div>' +
            '<div class="pj-st"><p class="pj-f"><span class="pj-lab">' + esc(after.label) + '</span>' + stateSel(ai, t.id) + '</p>' +
              (ea ? select('Person', 'states.' + ai + '.tasks.' + t.id + '.owner', personOptions(p, ea.owner, ea.list === 'plan')) : '') +
              (ea && ea.list === 'plan' ? field('Bucket', 'states.' + ai + '.tasks.' + t.id + '.bucket', ea.bucket, { cls: 'pj-half' }) + field('Termin', 'states.' + ai + '.tasks.' + t.id + '.due', ea.due, { cls: 'pj-half' }) : '') + '</div>' +
            [before, after].map(function (s) {
              var e = s.tasks[t.id], si1 = p.states.indexOf(s), b = 'states.' + si1 + '.tasks.' + t.id + '.';
              if (!e) return '';
              return '<details><summary>Details: ' + esc(s.label) + '</summary>' +
                field('Termin', b + 'due', e.due) +
                select('Fortschritt', b + 'progress', [['not-started', 'Nicht begonnen'], ['in-progress', 'In Bearbeitung'], ['completed', 'Abgeschlossen']].map(function (v) { return '<option value="' + v[0] + '"' + ((e.progress || (e.done ? 'completed' : 'not-started')) === v[0] ? ' selected' : '') + '>' + v[1] + '</option>'; }).join('')) +
                field('Notizen', b + 'notes', e.notes, { area: true, max: 240 }) +
                (e.checklist || []).map(function (c, j) { return field('Checklistenpunkt ' + (j + 1), b + 'checklist.' + j + '.text', c.text, { max: 70 }) + '<p><label><input type="checkbox" data-bool="' + b + 'checklist.' + j + '.done"' + (c.done ? ' checked' : '') + '> Erledigt</label> <button type="button" class="btn sm" data-op="del-check" data-state="' + si1 + '" data-task="' + esc(t.id) + '" data-i="' + j + '">Punkt entfernen</button></p>'; }).join('') +
                '<button type="button" class="btn sm" data-op="add-check" data-state="' + si1 + '" data-task="' + esc(t.id) + '"' + ((e.checklist || []).length >= 5 ? ' disabled' : '') + '>Checklistenpunkt hinzufügen</button>' +
                (e.comment ? select('Kommentar von', b + 'comment.by', personOptions(p, e.comment.by)) + field('Kommentar', b + 'comment.text', e.comment.text, { area: true, max: 180 }) : '') +
                '<button type="button" class="btn sm" data-op="' + (e.comment ? 'del-comment' : 'add-comment') + '" data-state="' + si1 + '" data-task="' + esc(t.id) + '">Kommentar ' + (e.comment ? 'entfernen' : 'hinzufügen') + '</button></details>';
            }).join('') +
            '<button type="button" class="btn sm" data-op="del-task" data-i="' + i + '" aria-label="Aufgabe ' + (i + 1) + ' entfernen">Entfernen</button></li>';
        }).join('') + '</ul><p><button type="button" class="btn sm" data-op="add-task">Aufgabe hinzufügen</button></p></fieldset>' +
      '<fieldset><legend>Folien</legend><ol class="pj-slides">' + p.slides.map(function (sl, i) {
        var sc = sceneOf(p, sl), si = p.scenes.indexOf(sc), pr = sc && prof[sc.profile];
        var body = '';
        if (sc && sc.profile === 'teams-posts') {
          body = field('Team', 'scenes.' + si + '.team', sc.team, { cls: 'pj-half' }) + field('Kanal', 'scenes.' + si + '.channel', sc.channel, { cls: 'pj-half' }) +
            '<ol class="pj-posts">' + sc.posts.map(function (q, j) {
              var b = 'scenes.' + si + '.posts.' + j + '.';
              return '<li>' + select('Von', b + 'by', personOptions(p, q.by), { cls: 'pj-half' }) + field('Zeit', b + 'time', q.time, { cls: 'pj-half' }) +
                field('Betreff', b + 'title', q.title, { max: 60 }) + field('Text', b + 'text', q.text, { area: true, max: 220 }) + field('Hinweis auf der Folie', b + 'hint', q.hint, { max: 140 }) +
                '<button type="button" class="btn sm" data-op="del-post" data-s="' + si + '" data-i="' + j + '">Beitrag entfernen</button></li>';
            }).join('') + '</ol><p><button type="button" class="btn sm" data-op="add-post" data-s="' + si + '">Beitrag hinzufügen</button></p>';
        } else if (sc && sc.profile === 'teams-chat') {
          var base = 'scenes.' + si + '.', participants = p.people.filter(function (x) { return x.id === sc.viewer || x.id === sc.partner; });
          body = field('Team', base + 'team', sc.team, { max: 40 }) +
            select('Ansicht von', base + 'viewer', personOptions(p, sc.viewer)) + select('Chat mit', base + 'partner', personOptions(p, sc.partner)) +
            '<ol class="pj-posts">' + sc.messages.map(function (q, j) {
              var b = base + 'messages.' + j + '.';
              return '<li>' + select('Von', b + 'by', participants.map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === q.by ? ' selected' : '') + '>' + esc(x.name) + '</option>'; }).join('')) +
                field('Zeit', b + 'time', q.time) + field('Text', b + 'text', q.text, { area: true, max: 220 }) + field('Hinweis auf der Folie', b + 'hint', q.hint, { max: 140 }) +
                '<p><label><input type="checkbox" data-bool="' + b + 'decision"' + (q.decision ? ' checked' : '') + '> Entscheid</label></p>' +
                '<button type="button" class="btn sm" data-op="del-message" data-s="' + si + '" data-i="' + j + '">Nachricht entfernen</button></li>';
            }).join('') + '</ol><p><button type="button" class="btn sm" data-op="add-message" data-s="' + si + '"' + (sc.messages.length >= 6 ? ' disabled' : '') + '>Nachricht hinzufügen</button></p>' +
            '<p class="pj-lab">Sehen diesen Chat nicht</p>' + p.people.map(function (x) {
              return '<p><label><input type="checkbox" data-not-seen="' + si + '" value="' + esc(x.id) + '"' + ((sc.notSeenBy || []).indexOf(x.id) >= 0 ? ' checked' : '') + '> ' + esc(x.name) + '</label></p>';
            }).join('');
        } else if (sc && sc.profile === 'planner') {
          body = field('Plan / Team', 'scenes.' + si + '.team', sc.team) + '<p class="pj-small">Zeigt alle Aufgaben, die «' + esc((sc.state === 'before' ? before : after).label) + '» im gemeinsamen Plan stehen.</p>';
        } else if (sc && (sc.profile === 'planner-task' || sc.profile === 'todo')) {
          var b = 'scenes.' + si + '.', state = p.states.filter(function (s) { return s.id === sc.state; })[0];
          body = field('Plan / Team', b + 'team', sc.team) +
            select('Zustand', b + 'state', p.states.map(function (s) { return '<option value="' + s.id + '"' + (s.id === sc.state ? ' selected' : '') + '>' + esc(s.label) + '</option>'; }).join(''));
          if (sc.profile === 'planner-task') {
            body += select('Aufgabe im Plan', b + 'task', '<option value="">Bitte wählen</option>' + p.tasks.map(function (t) { return '<option value="' + t.id + '"' + (t.id === sc.task ? ' selected' : '') + '>' + esc(t.title) + '</option>'; }).join('')) + '<p class="pj-small">Titel, Zuständigkeit und Details oben bei der Aufgabe bearbeiten. Diese Ansicht zeigt dieselbe Aufgabe.</p>';
          } else {
            body += select('Ansicht von', b + 'viewer', personOptions(p, sc.viewer)) + field('Datumszeile', b + 'dateLabel', sc.dateLabel, { max: 40 }) +
              '<p>Aufgaben für Mein Tag bewusst auswählen. Nur Aufgaben dieser Person sind zulässig.</p>' +
              p.tasks.concat((sc.taskIds || []).filter(function (id) { return !p.tasks.some(function (t) { return t.id === id; }); }).map(function (id) { return { id: id, title: 'Unbekannte Aufgabe: ' + id }; })).map(function (t) { var e = state && state.tasks[t.id]; return '<p><label><input type="checkbox" data-todo-task="' + si + '" value="' + esc(t.id) + '"' + ((sc.taskIds || []).indexOf(t.id) >= 0 ? ' checked' : '') + '> ' + esc(t.title) + ' (' + (e ? e.list === 'plan' ? 'gemeinsam zugewiesen' : 'persönlich' : 'nicht gezeigt') + ')</label></p>'; }).join('') +
              [['personalListPrivate', 'Annahme: persönliche Liste ist nicht geteilt'], ['myDaySelected', 'Annahme: Aufgaben bewusst zu Mein Tag hinzugefügt'], ['plannerConnected', 'Annahme: gleiches Arbeitskonto und Planner-Verbindung aktiviert']].map(function (x) { return '<p><label><input type="checkbox" data-bool="' + b + x[0] + '"' + (sc[x[0]] ? ' checked' : '') + '> ' + x[1] + '</label></p>'; }).join('');
          }
        } else if (sc && sc.profile === 'prinzip-tasks') {
          var t = 'slides.' + i + '.teaching.', tc = sl.teaching || {};
          body = field('Titel', t + 'title', tc.title, { max: 60 }) + field('Frage', t + 'question', tc.question, { max: 90 }) + field('Situation', t + 'problem', tc.problem, { area: true, rows: 2, max: 200 }) +
            field('Empfehlung', t + 'recommendation', tc.recommendation, { area: true, rows: 2, max: 200 }) + field('Grenze', t + 'boundary', tc.boundary, { area: true, rows: 2, max: 200 });
        } else if (sc && root.CollaborationCore.isProfile(sc.profile)) {
          body = '<p class="pj-small">Diese Ansicht wird vollständig gerendert. Komponenten, Momentaufnahmen und Arbeitsflussschritte bleiben hier erhaltene Metadaten. Zum Ändern Projekt-JSON sichern, bearbeiten und erneut importieren.</p>' + field('Team / Plan', 'scenes.' + si + '.team', sc.team);
        } else body = '<p class="pj-err">Ansicht nicht unterstützt.</p>';
        return '<li class="pj-slide"><h3>Folie ' + (i + 1) + ' · ' + esc(pr ? pr.label : (sc ? sc.profile : '?')) + '</h3>' +
          '<p class="pj-move"><button type="button" class="btn sm" data-op="up" data-i="' + i + '"' + (i ? '' : ' disabled') + ' aria-label="Folie ' + (i + 1) + ' nach oben">↑</button><button type="button" class="btn sm" data-op="down" data-i="' + i + '"' + (i < p.slides.length - 1 ? '' : ' disabled') + ' aria-label="Folie ' + (i + 1) + ' nach unten">↓</button><button type="button" class="btn sm" data-op="del-slide" data-i="' + i + '" aria-label="Folie ' + (i + 1) + ' entfernen">Entfernen</button></p>' +
          body + field('Notizen für die Moderation', 'slides.' + i + '.presenterNotes', sl.presenterNotes, { area: true, rows: 2 }) + '</li>';
      }).join('') + '</ol>' +
      '<p class="pj-f"><label for="pj-addp">Folie hinzufügen</label><select id="pj-addp">' + Object.keys(prof).filter(function (k) { return !root.WorkspaceCore.isProfile(k) && !root.CollaborationCore.isProfile(k); }).map(function (k) { return '<option value="' + k + '">' + esc(prof[k].label) + '</option>'; }).join('') + '</select> <button type="button" class="btn sm" data-op="add-slide">Hinzufügen</button></p>' +
      '<p class="pj-small">Noch nicht unterstützt: weitere Ansichten (Outlook, Dateien), Antworten auf Beiträge, Bilder und eigene Layouts.</p></fieldset>' +
      '</div><div class="pj-prev" id="pj-prev" aria-label="Vorschau der Folien">' + previews(p) + '</div></div></section>';
    return html;
  }
  /* Errors the form can show and fix; anything structural must be repaired before editing. */
  var EDITABLE = ['unknown-person', 'person-name', 'task-title', 'post-text', 'message-text', 'chat-author', 'chat-participants', 'scene-team', 'scene-channel', 'teaching-title', 'teaching-recommendation', 'teaching-boundary', 'meta-title', 'long', 'prinzip-lists', 'unknown-task', 'detail-task-state', 'detail-task-owner', 'todo-task-state', 'todo-task-owner', 'todo-connection', 'todo-assumption', 'todo-tasks', 'checklist-text', 'comment-text'];
  function editable(v) { return v.errors.every(function (e) { return EDITABLE.indexOf(e.code) >= 0; }); }
  function validity(v) {
    if (v.ok && !v.warnings.length) return '<p class="pj-ok">' + V.ic('i-check') + 'Alles passt.</p>';
    return (v.errors.length ? '<div class="pj-errbox"><p><strong>' + v.errors.length + ' Fehler</strong></p><ul>' + v.errors.map(function (e) { return '<li>' + esc(e.message) + '</li>'; }).join('') + '</ul></div>' : '') +
      (v.warnings.length ? '<div class="pj-warnbox"><p><strong>Hinweise</strong></p><ul>' + v.warnings.map(function (e) { return '<li>' + esc(e.message) + '</li>'; }).join('') + '</ul></div>' : '');
  }
  function workspaceEditor(p, v) {
    return '<section class="block pj"><nav class="pj-crumbs" aria-label="Pfad"><a href="#/">Bibliothek</a> › <a href="#/projekt">Eigene Abfolge</a> › Arbeitsbereich</nav>' +
      '<h1>Arbeitsbereich erkunden</h1>' + storageBox() +
      '<p class="lead">Wähle einen Eintrag aus, um seinen Ort in der Karte und in der Vorschau zu sehen. Änderungen bleiben in diesem fiktiven Entwurf.</p>' +
      '<p class="pj-acts"><button type="button" class="btn" data-op="save">Projekt sichern</button> <button type="button" class="btn btn-p" data-op="export">Alle Folien als PNG</button></p>' +
      '<p class="pj-small" id="pj-status" role="status"></p>' + validity(v) +
      '<div class="wp-editor">' + WE.controls(p) + '<section id="pj-prev"><h2>Vorschau</h2>' + previews(p) + '</section></div></section>';
  }
  function workspaceChange(p, command, value) {
    var next = PC.copy(p);
    if (!WE.change(next, command, value)) return;
    var v = PC.validate(next);
    if (v.ok) { st.drafts[st.current].project = next; touch(); }
    render.keep();
    if (!v.ok) document.getElementById('pj-status').textContent = v.errors[0].message;
  }
  function slideHtml(p, i, interactive) {
    var plan = PC.slidePlan(p, i); if (!plan) return '';
    var vm = PC.compile(p, i);
    plan.params.interactive = interactive;
    return X.compose(vm, plan.params, plan.kind, plan.meta) || '';
  }
  function previews(p) {
    return p.slides.map(function (sl, i) {
      var html = '';
      var focus = p.workspace && WE.focus(p);
      var interactive = focus && focus.profile === 'workspace-house-teams' && focus.id === sl.scene;
      try { html = slideHtml(p, i, interactive); } catch (e) { html = ''; }
      return '<figure class="pj-thumb"><figcaption>Folie ' + (i + 1) + '</figcaption><div class="pj-sl"' + (interactive ? '' : ' inert') + '>' + (html || '<p class="pj-err">Diese Folie kann noch nicht dargestellt werden.</p>') + '</div>' +
        (sl.presenterNotes ? '<p class="pj-notes"><strong>Notizen:</strong> ' + esc(sl.presenterNotes) + '</p>' : '') + '</figure>';
    }).join('');
  }
  function fitPreviews(scope) {
    Array.prototype.forEach.call(scope.querySelectorAll('.pj-sl'), function (box) {
      var sl = box.querySelector('.slide'); if (!sl) return;
      X.densify(sl); X.tighten(sl);
      var s = box.clientWidth / X.W;
      sl.style.transform = 'scale(' + s + ')'; sl.style.transformOrigin = '0 0';
      box.style.height = Math.round(X.H * s) + 'px';
    });
  }

  /* ---------- export: the shared ProjectRender operation (also used by CLI and MCP) ---------- */
  function exportAll(opts) {
    opts = opts || {};
    var p = cur(); if (!p) return Promise.resolve({ ok: false, slides: [], diagnostics: [] });
    var status = document.getElementById('pj-status');
    return root.ProjectRender.renderAll(p, { scale: opts.scale || 1, dataUrl: !!opts.dataUrl, onProgress: function (i, n) { if (status) status.textContent = 'PNG ' + (i + 1) + ' von ' + n + ' …'; } }).then(function (r) {
      if (!r.ok) {
        var errs = r.diagnostics.filter(function (d) { return d.severity === 'error'; });
        if (status) status.innerHTML = '<strong>Export abgebrochen, keine Datei erzeugt.</strong> ' + errs.map(function (d) { return esc(d.message); }).join(' ');
        announce('Export abgebrochen: ' + errs.length + ' Problem' + (errs.length === 1 ? '' : 'e'));
        return r;
      }
      if (opts.download !== false) r.slides.forEach(function (s) { X.download(s.blob, s.fileName); });
      if (status) status.textContent = r.slides.length + ' PNG erzeugt: ' + r.slides.map(function (s) { return s.fileName; }).join(', ');
      announce(r.slides.length + ' PNG erzeugt');
      return r;
    });
  }

  /* ---------- import ---------- */
  function receive(text, origin) {
    var r = PC.parseInput(text);
    if (r.error) return r.error;
    st.pending = { project: r.project, origin: origin }; persist();
    location.hash = '#/projekt/import';
    return null;
  }

  /* ---------- events ---------- */
  var container = null, timer = null;
  function refresh() {
    var p = cur(); if (!p || !container) return;
    var prev = container.querySelector('#pj-prev'), val = container.querySelector('#pj-valid'), h1 = container.querySelector('.pj-head h1');
    if (prev) { prev.innerHTML = previews(p); fitPreviews(prev); }
    if (val) val.innerHTML = validity(PC.validate(p));
    if (h1) h1.textContent = p.meta.title;
  }
  function rerender() { root.dispatchEvent(new HashChangeEvent('hashchange')); }
  function onInput(e) {
    var t = e.target;
    if (t.hasAttribute('data-brief')) { st.brief[t.getAttribute('data-brief')] = t.value; persist(); var pk = document.getElementById('pj-pack'); if (pk) pk.value = PC.authoringPack(st.brief); return; }
    var p = cur(); if (!p) return;
    if (t.tagName === 'SELECT') return;
    if (t.hasAttribute('data-path')) setPath(p, t.getAttribute('data-path'), t.value);
    else if (t.hasAttribute('data-lines')) setPath(p, t.getAttribute('data-lines'), t.value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean));
    else return;
    if (/^states\.\d+\.tasks\..+\.(notes|checklist|comment)/.test(t.getAttribute('data-path') || '')) p.capabilityVersion = Math.max(p.capabilityVersion, 3);
    touch(); clearTimeout(timer); timer = setTimeout(refresh, 120);
  }
  function onChange(e) {
    var t = e.target, p = cur();
    if (t.id === 'pj-file') {
      var f = t.files && t.files[0]; if (!f) return;
      if (f.size > PC.MAX_INPUT) { alertBox('Die Datei ist zu gross.'); return; }
      f.text().then(function (txt) { var err = receive(txt, 'import'); if (err) alertBox(err.message); });
      return;
    }
    if (p && p.workspace && /^wp-(parent|perspective|house|house-viewer|tab)$/.test(t.id)) {
      workspaceChange(p, t.id, t.type === 'checkbox' ? t.checked : t.value); return;
    }
    if (p && t.hasAttribute('data-bool')) { setPath(p, t.getAttribute('data-bool'), t.checked); touch(); refresh(); return; }
    if (p && t.hasAttribute('data-todo-task')) {
      var todo = p.scenes[+t.getAttribute('data-todo-task')];
      todo.taskIds = (todo.taskIds || []).filter(function (id) { return id !== t.value; });
      if (t.checked) todo.taskIds.push(t.value);
      touch(); refresh(); return;
    }
    if (p && t.hasAttribute('data-not-seen')) {
      var chat = p.scenes[+t.getAttribute('data-not-seen')], ids = chat.notSeenBy || [];
      chat.notSeenBy = ids.filter(function (id) { return id !== t.value; });
      if (t.checked) chat.notSeenBy.push(t.value);
      touch(); refresh(); return;
    }
    if (p && t.hasAttribute('data-path') && /^scenes\.\d+\.(viewer|partner)$/.test(t.getAttribute('data-path'))) {
      var bits = t.getAttribute('data-path').split('.'), chat = p.scenes[+bits[1]], old = chat[bits[2]];
      chat[bits[2]] = t.value;
      (chat.messages || []).forEach(function (m) { if (m.by === old) m.by = t.value; });
      touch(); render.keep(); return;
    }
    if (t.hasAttribute('data-state') && p) {
      var s = p.states[+t.getAttribute('data-state')], tid = t.getAttribute('data-task'), v = t.value, e0 = s.tasks[tid];
      if (v === 'none') delete s.tasks[tid];
      else s.tasks[tid] = Object.assign({ owner: (e0 && e0.owner) || p.people[0].id }, e0 || {}, { list: v }, v === 'plan' ? { bucket: (e0 && e0.bucket) || 'Offen', due: (e0 && e0.due) || '' } : {});
      touch(); render.keep(); return;
    }
    if (t.tagName === 'SELECT' && t.hasAttribute('data-path') && p) {
      var path = t.getAttribute('data-path');
      setPath(p, path, t.value || null);
      if (/^states\.\d+\.tasks\..+\.progress$/.test(path)) {
        setPath(p, path.replace(/progress$/, 'done'), t.value === 'completed'); p.capabilityVersion = Math.max(p.capabilityVersion, 3);
      }
      touch();
      if (/^scenes\.\d+\.(state|task)$/.test(path)) render.keep(); else refresh();
    }
  }
  function alertBox(msg) { var el = document.getElementById('pj-paste-err'); if (el) { el.textContent = msg; var d = el.closest('details'); if (d) d.open = true; } else announce(msg); }
  function copyFrom(id) {
    var ta = document.getElementById(id), done = function (ok) { var c = document.getElementById('pj-copied'); if (c) c.textContent = ok ? 'Kopiert.' : 'Bitte von Hand kopieren (Text ist markiert).'; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(function () { done(true); }, function () { ta.closest('details') && (ta.closest('details').open = true); ta.select(); done(false); });
    else { ta.closest('details') && (ta.closest('details').open = true); ta.select(); done(false); }
  }
  function download(p) {
    var blob = new Blob([PC.serialise(p)], { type: 'application/json' });
    X.download(blob, (p.meta.id || 'projekt') + '.msteams-personas.json');
  }
  function referenced(p, pid) {
    return p.scenes.some(function (sc) { return sc.viewer === pid || sc.partner === pid || (sc.notSeenBy || []).indexOf(pid) >= 0 || (sc.posts || []).concat(sc.messages || []).some(function (q) { return q.by === pid; }); }) ||
      p.states.some(function (s) { return Object.keys(s.tasks).some(function (k) { return s.tasks[k].owner === pid || (s.tasks[k].comment && s.tasks[k].comment.by === pid); }); });
  }
  function onClick(e) {
    var b = e.target.closest('[data-op]'); if (!b || b.tagName === 'INPUT') return;
    var op = b.getAttribute('data-op'), p = cur(), i = +b.getAttribute('data-i');
    if (op === 'adapt') { if (addDraft(PC.template(), 'template')) go('bearbeiten'); }
    else if (op === 'adapt-workspace' || op === 'adapt-workspace-houses') { if (addDraft(PC.workspaceExample(op === 'adapt-workspace-houses' ? 'workspace-houses' : 'workspace'), 'template')) go('bearbeiten'); }
    else if (op === 'new') { if (addDraft(PC.blank(), 'manual')) go('bearbeiten'); }
    else if (op === 'open-draft') { st.current = i; persist(); go('bearbeiten'); }
    else if (op === 'del-draft') { st.drafts.splice(i, 1); st.current = st.drafts.length ? 0 : -1; if (/Entwürfe gespeichert/.test(storageProblem)) storageProblem = ''; persist(); render.keep(); announce('Entwurf entfernt'); }
    else if (op === 'paste') { var err = receive(document.getElementById('pj-paste').value, location.hash.indexOf('/ki') >= 0 ? 'assistant' : 'import'); if (err) alertBox(err.message); }
    else if (op === 'copy') copyFrom(b.getAttribute('data-src'));
    else if (op === 'fix-person') {
      var ref = b.getAttribute('data-ref'), sel = container.querySelector('[data-fix="' + CSS.escape(ref) + '"]');
      if (!sel || !sel.value) { announce('Bitte zuerst eine Person wählen.'); sel && sel.focus(); return; }
      st.pending.project = PC.replacePersonRef(st.pending.project, ref, sel.value); persist(); render.keep(); announce('Ersetzt. Erneut geprüft.');
    }
    else if (op === 'accept' || op === 'accept-anyway') {
      var pd = st.pending;
      if (!addDraft(pd.project, pd.origin)) return;
      st.pending = null; persist(); go('bearbeiten'); announce('Als neuer Entwurf geöffnet.');
    }
    else if (op === 'cancel') { st.pending = null; persist(); location.hash = '#/projekt'; }
    else if (!p) return;
    else if (op === 'save') { download(p); var s = document.getElementById('pj-status'); if (s) s.textContent = 'Projektdatei gesichert: ' + (p.meta.id || 'projekt') + '.msteams-personas.json'; announce('Projekt gesichert'); }
    else if (op === 'export') exportAll();
    else if (p.workspace && op === 'wp-preview-tab') workspaceChange(p, 'wp-tab', b.getAttribute('data-i'));
    else if (p.workspace && op === 'wp-save-fields') {
      var purpose = document.getElementById('wp-purpose');
      workspaceChange(p, op, { name: document.getElementById('wp-name').value, purpose: purpose && purpose.value });
    }
    else if (p.workspace && op.indexOf('wp-') === 0) workspaceChange(p, op, b.getAttribute('data-i'));
    else {
      if (op === 'add-person') p.people.push({ id: PC.newId('p-', p.people), name: 'Neue Person', role: '' });
      else if (op === 'del-person') {
        if (p.people.length < 2) { announce('Mindestens eine Person bleibt.'); return; }
        if (referenced(p, p.people[i].id)) { var st2 = document.getElementById('pj-status'); if (st2) st2.textContent = '«' + p.people[i].name + '» ist noch Beiträgen, Chats oder Aufgaben zugeordnet. Zuerst dort eine andere Person wählen.'; return; }
        p.people.splice(i, 1);
      }
      else if (op === 'add-task') {
        var id = PC.newId('t-', p.tasks); p.tasks.push({ id: id, title: 'Neue Aufgabe' });
        p.states.forEach(function (s) { s.tasks[id] = s.id === 'after' ? { owner: p.people[0].id, list: 'plan', bucket: 'Offen', due: '' } : { owner: p.people[0].id, list: 'personal' }; });
      }
      else if (op === 'del-task') {
        var tid = p.tasks[i].id;
        if (p.scenes.some(function (sc) { return sc.task === tid || (sc.taskIds || []).indexOf(tid) >= 0; })) { announce('Diese Aufgabe ist in einer Detail- oder To-Do-Folie ausgewählt. Bitte zuerst dort die Auswahl ändern.'); return; }
        p.tasks.splice(i, 1); p.states.forEach(function (s) { delete s.tasks[tid]; });
      }
      else if (['add-check', 'del-check', 'add-comment', 'del-comment'].indexOf(op) >= 0) {
        var entry = p.states[+b.getAttribute('data-state')].tasks[b.getAttribute('data-task')];
        if (op === 'add-check') { entry.checklist = entry.checklist || []; if (entry.checklist.length < 5) entry.checklist.push({ text: 'Neuer Teilschritt', done: false }); }
        if (op === 'del-check') entry.checklist.splice(i, 1);
        if (op === 'add-comment') entry.comment = { by: entry.owner || p.people[0].id, text: 'Neuer Kommentar' };
        if (op === 'del-comment') delete entry.comment;
        p.capabilityVersion = Math.max(p.capabilityVersion, 3);
      }
      else if (op === 'add-message') { var chat = p.scenes[+b.getAttribute('data-s')]; if (chat.messages.length < 6) chat.messages.push({ id: PC.newId('m', chat.messages), by: chat.viewer, time: '', text: 'Neue Nachricht' }); }
      else if (op === 'del-message') { var chat = p.scenes[+b.getAttribute('data-s')]; if (chat.messages.length > 1) chat.messages.splice(i, 1); }
      else if (op === 'add-post') { var sc = p.scenes[+b.getAttribute('data-s')]; sc.posts.push({ id: PC.newId('q', sc.posts), by: p.people[0].id, time: '', title: '', text: 'Neuer Beitrag' }); }
      else if (op === 'del-post') { var sc2 = p.scenes[+b.getAttribute('data-s')]; if (sc2.posts.length > 1) sc2.posts.splice(i, 1); }
      else if (op === 'up' && i > 0) p.slides.splice(i - 1, 0, p.slides.splice(i, 1)[0]);
      else if (op === 'down' && i < p.slides.length - 1) p.slides.splice(i + 1, 0, p.slides.splice(i, 1)[0]);
      else if (op === 'del-slide') { if (p.slides.length < 2) { announce('Mindestens eine Folie bleibt.'); return; } var gone = p.slides.splice(i, 1)[0]; if (!p.slides.some(function (s) { return s.scene === gone.scene; })) p.scenes = p.scenes.filter(function (s) { return s.id !== gone.scene; }); }
      else if (op === 'add-slide') {
        var kind = document.getElementById('pj-addp').value, scId = PC.newId('sc-', p.scenes), team = (p.scenes[0] && p.scenes[0].team) || 'Mein Team';
        var afterTasks = p.states.filter(function (s) { return s.id === 'after'; })[0].tasks;
        var firstOwned = p.tasks.filter(function (t) { return afterTasks[t.id] && afterTasks[t.id].owner; })[0];
        var defaultViewer = firstOwned ? afterTasks[firstOwned.id].owner : p.people[0].id;
        var scn = kind === 'teams-posts' ? { id: scId, profile: kind, team: team, channel: 'Allgemein', posts: [{ id: 'q1', by: p.people[0].id, time: '', title: '', text: 'Neuer Beitrag' }] }
          : kind === 'teams-chat' ? { id: scId, profile: kind, team: team, viewer: p.people[0].id, partner: (p.people[1] || p.people[0]).id, messages: [{ id: 'm1', by: p.people[0].id, time: '', text: 'Neue Nachricht' }], notSeenBy: [] }
          : kind === 'planner' ? { id: scId, profile: kind, team: team, state: 'after' }
          : kind === 'planner-task' ? { id: scId, profile: kind, team: team, state: 'after', task: (PC.planTasks(p, 'after').filter(function (t) { return t.owner; })[0] || {}).id || '' }
          : kind === 'todo' ? { id: scId, profile: kind, team: team, state: 'after', viewer: defaultViewer, taskIds: p.tasks.filter(function (t) { var e = afterTasks[t.id]; return e && e.owner === defaultViewer; }).slice(0, 6).map(function (t) { return t.id; }), personalListPrivate: true, myDaySelected: true, plannerConnected: true }
          : { id: scId, profile: kind, team: team, before: 'before', after: 'after' };
        if (kind === 'teams-chat') p.capabilityVersion = Math.max(p.capabilityVersion, 2);
        if (kind === 'todo' || kind === 'planner-task') p.capabilityVersion = Math.max(p.capabilityVersion, 3);
        p.scenes.push(scn);
        p.slides.push(Object.assign({ id: PC.newId('s-', p.slides), scene: scId, presenterNotes: '' }, kind === 'prinzip-tasks' ? { teaching: { title: 'Prinzip', question: '', problem: '', recommendation: 'Empfehlung', boundary: 'Grenze' } } : {}));
      }
      else return;
      touch(); render.keep(); announce('Geändert');
    }
  }
  function go(page) { location.hash = '#/projekt/' + page; }

  function render(h) {
    var page = h[1] || '';
    if (page === 'bearbeiten') return editor();
    if (page === 'arbeitsbereich') return '<section class="block pj"><nav class="pj-crumbs" aria-label="Pfad"><a href="#/">Bibliothek</a> › Arbeitsbereich</nav>' +
      '<h1>Arbeitsbereich erkunden</h1>' + storageBox() +
      '<p class="lead">Plane, wo ein Team zusammenarbeitet. Das fiktive Beispiel verbindet Team, Kanäle und Dateiablage mit einer passenden Vorschau.</p>' +
      '<p><button type="button" class="btn btn-p" data-op="adapt-workspace">Karte und Vorschau öffnen</button> <button type="button" class="btn" data-op="adapt-workspace-houses">Häuser und Teams öffnen</button> <a href="#/projekt">Gespeicherte Entwürfe</a></p></section>';
    if (page === 'ki') return assistant();
    if (page === 'import') return review();
    return start();
  }
  /* Re-render the current project page in place, keeping scroll position and focus where possible. */
  render.keep = function () {
    if (!container) return;
    var previewSource = document.activeElement && document.activeElement.closest('.wp-house-app, .wp-house');
    var y = window.scrollY, active = document.activeElement, wpId = active && active.id, key = active && (active.getAttribute('data-path') || active.getAttribute('data-op') + (active.getAttribute('data-i') || ''));
    container.innerHTML = render(location.hash.replace(/^#\/?/, '').split('/').filter(Boolean));
    mount(container); window.scrollTo(0, y);
    if (wpId && wpId.indexOf('wp-') === 0) { var field = document.getElementById(wpId); if (field) field.focus(); }
    else if (key) { var again = container.querySelector('[data-path="' + CSS.escape(key) + '"]') || Array.prototype.filter.call(container.querySelectorAll('[data-op]'), function (x) {
      var source = x.closest('.wp-house-app, .wp-house');
      return x.getAttribute('data-op') + (x.getAttribute('data-i') || '') === key && !x.disabled &&
        (previewSource ? source && source.classList[0] === previewSource.classList[0] : !source);
    })[0]; if (again) again.focus(); }
  };
  function mount(el) {
    if (container !== el) {
      container = el;
      el.addEventListener('input', function (e) { if (isProject()) onInput(e); });
      el.addEventListener('change', function (e) { if (isProject()) onChange(e); });
      el.addEventListener('click', function (e) { if (isProject()) onClick(e); });
      window.addEventListener('resize', function () { if (isProject()) fitPreviews(container); });
    }
    fitPreviews(el);
  }
  function isProject() { return /^#\/projekt/.test(location.hash); }

  root.ProjectUI = { render: render, mount: mount, exportAll: exportAll, current: cur, state: function () { return st; }, receive: receive };
})(window);
