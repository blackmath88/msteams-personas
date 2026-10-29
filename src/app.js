/*
 * Library app: hash router, shared selection state, pages and presentation stage.
 * Routes:
 *   #/                       landing
 *   #/personas  #/tools  #/usecases   three equal entries (all converge on the same workspace)
 *   #/konfigurator/<1-6|ergebnis>     Eigene Situation (secondary)
 *   #/s/<situation>/<variant|->/<szene|prinzip>/<screen|principle>
 *        screen: posts|files|tasks (Teams), outlook, explorer, sharepoint
 *   #/p/<same params>[/<app|folie|vergleich>]   presentation + PNG export
 */
(function () {
  var V = window.Views, M = window.Model, C = window.Configurator, LIB = window.LIB, A = window.M365, X = window.Export;
  var esc = V.esc, ic = V.ic;
  var app = document.getElementById('app');
  var live = document.getElementById('live');

  /* ---------- session-only state (names per situation, configurator draft, annotation toggle) ---------- */
  var store = {
    /* Customised examples persist locally in this browser (no account, no backend). */
    get: function (k, d) { try { var v = localStorage.getItem('mtp.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('mtp.' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable: session keeps working */ } }
  };
  var state = {
    names: store.get('names', {}),
    draft: store.get('draft', { answers: {}, touched: false }),
    annot: store.get('annot', true),
    content: store.get('content', {}),
    hires: store.get('hires', false)
  };
  function save() { store.set('names', state.names); store.set('draft', state.draft); store.set('annot', state.annot); store.set('content', state.content); store.set('hires', state.hires); }
  function namesFor(sid) { return state.names[sid] || { team: '', people: {} }; }
  function hasCustom(sid) { var n = state.names[sid]; return !!(n && (n.team || Object.keys(n.people || {}).some(function (k) { return n.people[k]; }))); }

  function vmFor(sid, variant) {
    var n = namesFor(sid);
    return M.build(sid, { variant: variant, names: { team: n.team, people: n.people }, content: state.content[sid] || {} });
  }
  function route(sid, variant, mode, sub, present) {
    return '#/' + (present ? 'p' : 's') + '/' + sid + '/' + (variant || '-') + '/' + (mode || 'szene') + (sub ? '/' + sub : '');
  }
  function principleMeta(pid) { return LIB.principles.filter(function (p) { return p.id === pid; })[0]; }
  function announce(t) { live.textContent = ''; setTimeout(function () { live.textContent = t; }, 30); }

  /* ---------- shared pieces ---------- */
  function collBadge(c) { return '<span class="badge b-' + c + '">' + (c === 'business' ? 'Business' : 'Hochschule') + '</span>'; }
  function crumbs(list) {
    return '<nav class="crumbs" aria-label="Pfad"><ol>' + list.map(function (c, i) {
      return '<li>' + (c[1] && i < list.length - 1 ? '<a href="' + c[1] + '">' + esc(c[0]) + '</a>' : '<span aria-current="page">' + esc(c[0]) + '</span>') + '</li>';
    }).join('') + '</ol></nav>';
  }
  function avatars(vm, max) {
    var ps = vm.people.slice(0, max || 5);
    return '<span class="avs" aria-hidden="true">' + ps.map(function (p) { return V.av(p, 's'); }).join('') + (vm.people.length > ps.length ? '<span class="av av-s av-more">+' + (vm.people.length - ps.length) + '</span>' : '') + '</span>';
  }
  function situationCard(sid, why) {
    var s = M.situationById(sid), vm = vmFor(sid);
    return '<li class="sit"><a href="' + route(sid, vm.variant && vm.variant.id, 'szene') + '">' +
      '<span class="sit-top">' + collBadge(vm.collection) + (s.complete ? '<span class="badge b-full">Vollständige Szene</span>' : '<span class="badge b-legacy">Szene aus Atlas</span>') + '</span>' +
      '<strong>' + esc(vm.title) + '</strong><span class="sit-w">' + esc(vm.world.name) + '</span>' +
      '<span class="sit-f">' + esc(why || vm.friction) + '</span>' +
      '<span class="sit-p">' + avatars(vm, 4) + '<span>' + (vm.world.size === 1 ? '1 Person' : vm.people.length + ' Personen') + '</span></span></a></li>';
  }

  /* ---------- Landing ---------- */
  function sceneHtml(vm) { return frameHtml(A.app(vm, vm.personal ? 'onedrive' : 'posts', {}), 'Vorschau: ' + vm.team); }
  function frameHtml(html, label, live) { return '<div class="appframe"' + (live ? '' : ' aria-label="' + esc(label) + '"') + '><div class="af-in"' + (live ? '' : ' inert') + '>' + html + '</div></div>'; }
  function landing() {
    var vm = vmFor('leadership-forum', 'eigenes-team');
    var ws = M.worlds();
    var story = [['outlook', '1 · Outlook', 'Der Plan kommt als Anhang.'], ['explorer', '2 · Explorer', 'Kopien im Downloads-Ordner.'], ['posts', '3 · Teams', 'Ein Beitrag verweist auf eine Datei.'], ['sharepoint', '4 · SharePoint', 'Die Datei liegt einmal in der Bibliothek.']];
    return '<section class="hero"><div class="hero-t">' +
        '<p class="kick">Visuals für M365-Schulung, Adoption und Beratung</p>' +
        '<h1>M365-Situationen sichtbar machen – ohne eine Testumgebung aufzubauen.</h1>' +
        '<p class="lead how"><span>Beispiel wählen</span>' + ic('i-back') + '<span>anpassen</span>' + ic('i-back') + '<span>als Schulungsvisual verwenden</span></p>' +
        '<p class="lead">Fiktive, aber stimmige Arbeitssituationen: als nachgebildete Teams-, Outlook-, Explorer- oder SharePoint-Ansicht und als Prinzip-Bild. Mit euren Namen und Texten, direkt als PNG für PowerPoint.</p>' +
        '<ul class="entries entries3">' +
          '<li><a class="entry" href="#/personas"><span class="entry-n">' + ic('i-people') + '</span><strong>Team-Personas</strong><span>Welcher Arbeitskontext ähnelt eurem? Abteilung, Projekt, Forschungsgruppe, Gremium, Lehrteam, Einzelarbeit.</span></a></li>' +
          '<li><a class="entry" href="#/tools"><span class="entry-n">' + ic('i-laptop') + '</span><strong>Tools</strong><span>Von welcher Oberfläche braucht ihr ein Bild? Teams, Outlook, Explorer, SharePoint.</span></a></li>' +
          '<li><a class="entry" href="#/usecases"><span class="entry-n">' + ic('i-alert') + '</span><strong>Use Cases</strong><span>Welches Problem wollt ihr erklären? Welche Datei gilt? Wer findet den Entscheid?</span></a></li>' +
        '</ul>' +
        '<p class="own"><a class="btn" href="#/konfigurator/1">' + ic('i-repeat') + 'Eigene Situation beschreiben</a><span>Sechs Fragen, ein begründeter Vorschlag zum Anpassen.</span></p>' +
      '</div>' +
      '<div class="hero-v" aria-label="Beispiel: dieselbe Situation als Szene und als Prinzip">' +
        '<div class="hero-scene">' + frameHtml(A.teams(vm, { annot: false }), 'Beispiel: Teams-Kanal Leadership Forum 2027') + '<a class="hero-open" href="' + route('leadership-forum', 'eigenes-team', 'szene', 'posts') + '">Szene öffnen</a></div>' +
        '<div class="hero-pr"><div class="hero-clip" inert>' + V.principle(vm, 'doc', principleMeta('doc'), { annot: false }) + '</div><a class="hero-open" href="' + route('leadership-forum', 'eigenes-team', 'prinzip', 'doc') + '">Prinzip öffnen</a></div>' +
        '<p class="hero-cap">Leadership Forum 2027: oben als <strong>Szene</strong> in Teams, unten als <strong>Prinzip</strong>. Dieselben Personen, dieselbe Datei.</p>' +
      '</div></section>' +
      '<section class="block"><div class="block-h"><h2>Eine Geschichte über vier Anwendungen</h2><p>Dieselben Personen und dieselbe Datei, vom Anhang bis zur gemeinsamen Bibliothek. Jede Ansicht lässt sich als PNG exportieren.</p></div>' +
        '<ol class="storyrow">' + story.map(function (x) {
          return '<li><a href="' + route('leadership-forum', 'eigenes-team', 'szene', x[0]) + '">' + frameHtml(A.app(vm, x[0], {}), x[1]) + '<strong>' + x[1] + '</strong><span>' + x[2] + '</span></a></li>';
        }).join('') + '</ol></section>' +
      '<section class="block"><div class="block-h"><h2>Abfolgen für eure Schulung</h2><p>Situation wählen → Szene anpassen → Bildausschnitt prüfen → exportieren. Jede Abfolge verbindet drei bis fünf Ansichten mit einem Prinzip.</p></div>' +
        '<ul class="seqlist seqlist-s">' + LIB.sequences.map(function (q) {
          return '<li><a href="#/a/' + q.id + '/1"><strong>' + esc(q.title) + '</strong><span class="sit-f">' + esc(q.objective) + '</span><span class="wl">' + q.steps.length + ' Ansichten' + (q.ai ? ' · KI-Simulation' : '') + '</span></a></li>';
        }).join('') + '</ul><p class="legacy-l"><a href="#/abfolgen">Alle Abfolgen</a></p></section>' +
      '<section class="block"><div class="block-h"><h2>Die Bibliothek</h2><p>Fünf Hochschulwelten und zwei Business-Teams. Alle Personen und Einheiten sind fiktiv.</p></div>' +
        '<ul class="worlds">' + ws.map(worldCard).join('') + '</ul></section>' +
      '<section class="block"><div class="block-h"><h2>Drei Prinzipien zum Einstieg</h2><p>Jedes Prinzip zeigt ein Problem, ein Bild, eine Empfehlung im Kontext und ihre Grenze.</p></div>' +
        '<ul class="prlist">' + LIB.principles.map(function (p) {
          return '<li><a href="' + route('leadership-forum', 'eigenes-team', 'prinzip', p.id) + '"><strong>' + esc(p.title) + '</strong><span>' + esc(p.question) + '</span></a></li>';
        }).join('') + '</ul></section>';
  }

  /* ---------- Tools ---------- */
  var STATUS = { ready: ['Bereit', 'b-full'], story: ['Bereit in der Dateigeschichte', 'b-full'], partial: ['Teilweise', 'b-legacy'], planned: ['Geplant', 'b-plan'], ki: ['KI-Simulation', 'b-plan'] };
  function toolSits(t) {
    return LIB.situations.filter(function (s) { return A.available(vmFor(s.id), t.id === 'chat' ? 'chat' : t.id); });
  }
  function tools(tid) {
    if (tid) {
      var t = LIB.tools.filter(function (x) { return x.id === tid; })[0];
      if (!t) return notFound();
      var sits = toolSits(t), st = STATUS[t.status];
      return crumbs([['Bibliothek', '#/'], ['Tools', '#/tools'], [t.label]]) +
        '<section class="block"><div class="block-h"><span class="badge ' + st[1] + '">' + st[0] + '</span><h1>' + esc(t.label) + '</h1><p class="lead">' + esc(t.desc) + '</p></div>' +
        (t.status === 'ki' ? '<p class="transfer" role="note"><strong>Simulation</strong>Die KI-Inhalte sind fest vorgegeben. Es findet keine Inferenz statt und es besteht keine Verbindung zu Microsoft 365.</p>' : '') +
        '<h2 class="h2s">' + (t.screens.length ? 'Ansichten und passende Situationen' : 'Passende Situationen') + '</h2>' +
        '<ul class="sits">' + sits.map(function (s) {
          var vm = vmFor(s.id), sc = t.screens[0] ? t.screens[0][0] : null;
          return '<li class="sit"><a href="' + route(s.id, vm.variant && vm.variant.id, 'szene', sc) + '">' +
            '<span class="sit-top">' + collBadge(vm.collection) + (sc ? '<span class="badge b-full">' + esc(t.screens[0][1]) + '</span>' : '') + '</span>' +
            '<strong>' + esc(vm.title) + '</strong><span class="sit-w">' + esc(vm.world.name) + '</span><span class="sit-f">' + esc(vm.friction) + '</span></a></li>';
        }).join('') + '</ul></section>';
    }
    var vm = vmFor('leadership-forum', 'eigenes-team');
    return crumbs([['Bibliothek', '#/'], ['Tools']]) +
      '<section class="block"><div class="block-h"><h1>Tools</h1><p class="lead">Startet bei der Oberfläche, die ihr auf der Folie braucht. Nur fertige Ansichten sind als bereit markiert.</p></div>' +
      '<ul class="toolgrid">' + LIB.tools.map(function (t) {
        var ps = toolSits(t)[0], pvm = ps && vmFor(ps.id);
        var st = STATUS[t.status], prev = t.screens[0] && pvm ? frameHtml(A.app(pvm, t.screens[0][0], {}), t.label) : '<div class="tool-ph">Geplant</div>';
        return '<li><a href="#/tools/' + t.id + '">' + prev + '<span class="badge ' + st[1] + '">' + st[0] + '</span><strong>' + esc(t.label) + '</strong><span>' + esc(t.desc) + '</span></a></li>';
      }).join('') + '</ul></section>';
  }
  function worldCard(w) {
    var first = w.situations[0], vm = vmFor(first);
    return '<li class="world"><a href="#/personas/' + w.id + '">' +
      '<span class="sit-top">' + collBadge(w.collection) + '<span class="wl">' + esc(w.label || '') + '</span></span>' +
      '<strong>' + esc(w.name) + '</strong><span class="sit-f">' + esc(w.tension) + '</span>' +
      '<span class="sit-p">' + avatars(vm, 5) + '<span>' + (w.size === 1 ? '1 Person' : w.people.length + ' Personen') + ' · ' + w.situations.length + (w.situations.length === 1 ? ' Situation' : ' Situationen') + '</span></span></a></li>';
  }

  /* ---------- Personas / Use cases ---------- */
  function personas(wid) {
    var ws = M.worlds();
    if (wid) {
      var w = ws.filter(function (x) { return x.id === wid; })[0];
      if (!w) return notFound();
      return crumbs([['Bibliothek', '#/'], ['Team-Personas', '#/personas'], [w.name]]) +
        '<section class="block"><div class="block-h">' + collBadge(w.collection) + '<h1>' + esc(w.name) + '</h1><p class="lead">' + esc(w.tagline) + '</p></div>' +
        '<h2 class="h2s">Situationen in dieser Arbeitswelt</h2><ul class="sits">' + w.situations.map(function (s) { return situationCard(s); }).join('') + '</ul>' +
        (w.collection === 'hochschule' ? '<p class="legacy-l">Alle Details, Entscheidungspunkte und die Druckfassung: <a href="atlas.html#/w/' + w.id + '">Legacy-Atlas öffnen</a></p>' : '<p class="legacy-l">Fiktive Synthese für den Prototyp, noch nicht durch Recherche validiert.</p>') +
        '</section>';
    }
    return crumbs([['Bibliothek', '#/'], ['Team-Personas']]) +
      '<section class="block"><div class="block-h"><h1>Team-Personas</h1><p class="lead">Arbeitswelten, keine demografischen Profile: Wie ist die Arbeit organisiert, und wo reibt es?</p></div>' +
      '<ul class="worlds">' + ws.map(worldCard).join('') + '</ul></section>';
  }
  function usecases(uid) {
    if (uid) {
      var u = LIB.usecases.filter(function (x) { return x.id === uid; })[0];
      if (!u) return notFound();
      var sits = LIB.situations.filter(function (s) { return s.usecases.indexOf(uid) >= 0; });
      var pm = principleMeta(u.principle);
      return crumbs([['Bibliothek', '#/'], ['Use Cases', '#/usecases'], [u.title]]) +
        '<section class="block"><div class="block-h"><h1>' + esc(u.title) + '</h1><p class="lead">' + esc(u.question) + ' Passendes Prinzip: <strong>' + esc(pm.title) + '</strong></p></div>' +
        '<ul class="sits">' + sits.map(function (s) {
          return situationCard(s.id).replace('/szene"', '/prinzip/' + u.principle + '"');
        }).join('') + '</ul>' +
        (u.principle === 'doc' && sits.some(function (s) { return LIB.stories[s.id]; }) ? '<p class="legacy-l">Als Dateigeschichte über Outlook, Explorer, Teams und SharePoint: ' + sits.filter(function (s) { return LIB.stories[s.id]; }).map(function (s) {
          return '<a href="' + route(s.id, vmFor(s.id).variant.id, 'szene', 'outlook') + '">' + esc(s.title) + '</a>';
        }).join(' · ') + '</p>' : '') + '</section>';
    }
    return crumbs([['Bibliothek', '#/'], ['Use Cases']]) +
      '<section class="block"><div class="block-h"><h1>Use Cases</h1><p class="lead">Startet bei der Reibung. Jeder Use Case führt zu konkreten Situationen aus der Bibliothek.</p></div>' +
      '<ul class="ucs">' + LIB.usecases.map(function (u) {
        var n = LIB.situations.filter(function (s) { return s.usecases.indexOf(u.id) >= 0; }).length;
        return '<li><a href="#/usecases/' + u.id + '"><strong>' + esc(u.title) + '</strong><span>' + esc(u.question) + '</span><small>' + n + ' Situationen · Prinzip «' + esc(principleMeta(u.principle).title) + '»</small></a></li>';
      }).join('') + '</ul></section>';
  }

  /* ---------- Configurator ---------- */
  function configurator(step) {
    var Q = C.QUESTIONS, a = state.draft.answers;
    if (step === 'ergebnis') return result();
    var i = Math.max(1, Math.min(6, parseInt(step, 10) || 1)), q = Q[i - 1];
    return crumbs([['Bibliothek', '#/'], ['Eigene Situation']]) +
      '<section class="cfg"><div class="cfg-h"><h1>Eigene Situation</h1><p class="cfg-prog" aria-label="Frage ' + i + ' von 6"><span style="--p:' + (i / 6 * 100) + '%"></span>Frage ' + i + ' von 6</p></div>' +
      '<form class="cfg-q" id="cfg-form"><h2>' + esc(q.title) + '</h2>' + q.fields.map(function (f) {
        var cur = a[f.id] || C.DEFAULTS[f.id];
        return '<fieldset><legend>' + esc(f.label) + '</legend><div class="opts">' + f.options.map(function (o) {
          return '<label class="opt"><input type="radio" name="' + f.id + '" value="' + o[0] + '"' + (cur === o[0] ? ' checked' : '') + '><span>' + esc(o[1]) + '</span></label>';
        }).join('') + '</div></fieldset>';
      }).join('') +
      '<p class="cfg-def">Voreingestellt ist eine typische Antwort. Ihr könnt jederzeit zurück und ändern.</p>' +
      '<div class="cfg-nav">' + (i > 1 ? '<a class="btn" href="#/konfigurator/' + (i - 1) + '">Zurück</a>' : '<a class="btn" href="#/">Abbrechen</a>') +
        '<button class="btn btn-p" type="submit">' + (i < 6 ? 'Weiter' : 'Vorschlag anzeigen') + '</button>' +
        (state.draft.touched ? '<button class="btn btn-q" type="button" data-act="reset">Zurücksetzen</button>' : '') + '</div></form></section>';
  }
  function result() {
    var r = C.suggest(state.draft.answers);
    var vm = vmFor(r.best.situation, r.best.variant), alt = vmFor(r.alt.situation, r.alt.variant);
    return crumbs([['Bibliothek', '#/'], ['Eigene Situation', '#/konfigurator/1'], ['Vorschlag']]) +
      '<section class="cfg cfg-r"><div class="cfg-h"><h1>Euer Ausgangspunkt</h1><p class="lead">Ein Vorschlag aus festen Regeln, keine einzig richtige Konfiguration. Die Anpassung gilt nur in dieser Sitzung.</p></div>' +
      '<div class="res">' +
        '<div class="res-main"><p class="kick">Vorschlag</p><h2>' + esc(r.best.label) + '</h2><p class="res-base">Grundlage: ' + esc(vm.title) + ' (' + esc(vm.world.name) + ')</p>' +
          (r.best.transfer ? '<p class="transfer" role="note"><strong>Übertragbares Beispiel aus der ' + esc(r.best.transfer.fromLabel) + '</strong>Für «' + esc(r.best.transfer.toLabel) + '» gibt es dieses Muster in der Bibliothek noch nicht. Das Prinzip ist übertragbar; Rollen, Systeme und Begriffe im Beispiel stammen aus der ' + esc(r.best.transfer.fromLabel) + '. Passt die Namen rechts an eure Situation an.</p>' : '') +
          '<h3>Warum das passt</h3><ul class="why">' + r.best.reasons.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
          (r.cautions.length ? '<h3>Annahmen und Grenzen</h3><ul class="caut">' + r.cautions.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
          '<div class="res-alt"><p class="kick">Alternative' + (r.alt.transfer ? ' · Beispiel aus der ' + esc(r.alt.transfer.fromLabel) : '') + '</p><h3>' + esc(r.alt.label) + '</h3><p>' + esc(alt.variant && r.alt.variant ? alt.variant.why : (r.alt.reasons.join(' ') || alt.friction)) + '</p><p class="res-base">Grundlage: ' + esc(alt.title) + '</p><a href="' + route(r.alt.situation, r.alt.variant, 'szene') + '">Alternative ansehen</a></div>' +
        '</div>' +
        '<div class="res-edit">' + nameForm(vm) + '</div>' +
        '<div class="res-prev"><p class="kick">Live-Vorschau' + (r.best.transfer ? ' · Beispiel aus der ' + esc(r.best.transfer.fromLabel) : '') + '</p><div id="preview">' + sceneHtml(vm) + '</div></div>' +
      '</div>' +
      '<div class="cfg-nav"><a class="btn" href="#/konfigurator/6">Antworten ändern</a>' +
        '<a class="btn btn-p" href="' + route(r.best.situation, r.best.variant, 'szene') + '">Szene und Prinzip öffnen</a>' +
        '<button class="btn btn-q" type="button" data-act="reset">Zurücksetzen</button></div></section>';
  }

  function nameForm(vm) {
    var n = namesFor(vm.id);
    return '<form class="names" data-sid="' + vm.id + '" aria-label="Namen anpassen"><h3>Namen anpassen</h3>' +
      '<p class="hint">Gilt für Szene, Prinzip und Präsentation. Die Originale bleiben erhalten.</p>' +
      '<label>Team oder Situation<input name="team" value="' + esc(n.team || '') + '" placeholder="' + esc(vm.teamOriginal) + '" autocomplete="off"></label>' +
      vm.people.map(function (p) {
        return '<label>' + esc(p.role) + '<input name="p:' + p.id + '" value="' + esc((n.people || {})[p.id] || '') + '" placeholder="' + esc(p.original) + '" autocomplete="off"></label>';
      }).join('') +
      (hasCustom(vm.id) ? '<button class="btn btn-q" type="button" data-act="restore">Originalnamen wiederherstellen</button>' : '') + '</form>';
  }

  /* ---------- Workspace (Szene / Prinzip) ---------- */
  /* ---------- Screens: what a trainer can pick, grouped by application ---------- */
  var SCREENS = [
    ['Teams', [['posts', 'Beiträge'], ['files', 'Dateien'], ['tasks', 'Aufgaben im Kanal'], ['chat', 'Chat'], ['recap', 'Besprechung · KI-Simulation']]],
    ['Outlook', [['outlook', 'Posteingang']]],
    ['Dateien', [['explorer', 'Explorer'], ['sharepoint', 'SharePoint'], ['onedrive', 'OneDrive']]],
    ['Aufgaben', [['planner', 'Planner'], ['plantask', 'Planner: Aufgabe'], ['todo', 'To Do']]]
  ];
  var WHY_OFF = {
    teams: 'Kein Team in dieser Situation (persönliche Arbeit).', chat: 'Kein Team in dieser Situation (persönliche Arbeit).',
    outlook: 'Nur in Situationen mit Dateigeschichte (Leadership Forum, Kundenportal).', explorer: 'Nur in Situationen mit Dateigeschichte (Leadership Forum, Kundenportal).',
    sharepoint: 'Nur in Situationen mit Dateigeschichte (Leadership Forum, Kundenportal).', recap: 'Nur im KI-Beispiel «Kundenportal bis März».',
    onedrive: 'Für persönliche Arbeitssituationen (Nora Keller). Teams-Situationen zeigen Dateien in Teams oder SharePoint.',
    planner: 'Diese Situation hat keine gemeinsamen Aufgaben.', plantask: 'Aufgabendetails gibt es für Leadership Forum, Kundenportal und die Einarbeitung.', todo: 'Diese Situation hat keine Aufgaben.'
  };
  function defaultSub(vm) { return vm.personal ? 'onedrive' : 'posts'; }
  function subOf(vm, p) { return p.sub || defaultSub(vm); }
  function screenLabel(sub) { var l = null; SCREENS.forEach(function (g) { g[1].forEach(function (x) { if (x[0] === sub) l = g[0] === 'Dateien' || g[0] === 'Aufgaben' || g[0] === 'Outlook' ? x[1] : g[0] + ': ' + x[1]; }); }); return l || sub; }

  function visualHtml(vm, p, pid) {
    if (p.mode === 'prinzip') return V.principle(vm, pid, principleMeta(pid), { annot: state.annot });
    var sub = subOf(vm, p), html = A.app(vm, sub, { annot: state.annot });
    if (!html) return unavailable(vm, A.toolOf(sub));
    var notes = state.annot ? A.notes(vm, sub) : [];
    var tool = A.toolOf(sub);
    return frameHtml(html, 'Nachgebildete Oberfläche', true) +
      '<p class="fit-warn" hidden></p>' +
      (notes.length ? '<aside class="ws-notes" aria-label="Lesehinweise"><p class="tw-k">Was hier zu sehen ist</p><ol>' + notes.map(function (n) {
        return '<li><span class="mk" aria-hidden="true">' + n[0] + '</span><span>' + esc(n[1]) + '</span></li>';
      }).join('') + '</ol></aside>' : '') +
      (vm.scene.outside && vm.scene.outside.length && tool === 'teams' ? '<p class="tw-outside">' + ic('i-box') + '<span><strong>Bleibt ausserhalb:</strong> ' + vm.scene.outside.map(esc).join(' · ') + '</span></p>' : '') +
      (vm.variant && vm.variant.assumption ? '<p class="tw-assume ws-assume">' + ic('i-alert') + '<span><strong>Annahme:</strong> ' + esc(vm.fill(vm.variant.assumption)) + '</span></p>' : '') +
      (vm.ai && (tool === 'recap' || tool === 'planner') ? '<p class="tw-assume ws-assume">' + ic('i-alert') + '<span><strong>KI-Simulation:</strong> ' + esc(vm.ai.assumption) + '</span></p>' : '') +
      (vm.chat && vm.chat.generated && tool === 'chat' ? '<p class="hint">Chatverlauf aus dem Prinzip «Chat oder Kanal?» abgeleitet, nicht einzeln ausgearbeitet.</p>' : '');
  }
  function unavailable(vm, tool) {
    var t = LIB.tools.filter(function (x) { return x.id === tool; })[0] || { label: tool };
    var alt = LIB.situations.filter(function (s) { return A.available(vmFor(s.id), tool); })[0];
    return '<div class="unavail" role="note"><h3>' + esc(t.label) + ' ist für diese Situation nicht ausgearbeitet</h3><p>' + esc(WHY_OFF[tool] || 'Diese Kombination gibt es noch nicht.') + ' Die Bibliothek zeigt hier nichts Erfundenes.</p>' +
      '<p>' + (alt ? '<a href="' + route(alt.id, null, 'szene', tool === 'teams' ? 'posts' : tool) + '">' + esc(t.label) + ' in «' + esc(alt.title) + '» ansehen</a> · ' : '') + '<a href="' + route(vm.id, vm.variant && vm.variant.id, 'szene', defaultSub(vm)) + '">Verfügbare Ansicht dieser Situation</a></p></div>';
  }
  function screenPicker(vm, p) {
    var cur = subOf(vm, p), vid = vm.variant && vm.variant.id;
    return '<nav class="screens" aria-label="Anwendung und Ansicht wählen">' + SCREENS.map(function (g) {
      return '<div class="sg"><span class="sg-h">' + g[0] + '</span>' + g[1].map(function (x) {
        var ok = A.available(vm, A.toolOf(x[0]));
        return ok ? '<a href="' + route(vm.id, vid, 'szene', x[0]) + '"' + (p.mode !== 'prinzip' && x[0] === cur ? ' aria-current="page"' : '') + '>' + esc(x[1]) + '</a>'
          : '<span class="tp-off" title="' + esc(WHY_OFF[A.toolOf(x[0])] || '') + '">' + esc(x[1]) + ' <small>nicht verfügbar</small></span>';
      }).join('') + '</div>';
    }).join('') + '</nav>';
  }

  /* ---------- Customisation: names + focused content per screen, persisted locally ---------- */
  function customState(sid) {
    var out = [], c = state.content[sid] || {};
    if (hasCustom(sid)) out.push('Namen');
    var has = function (v) { return v && (typeof v === 'string' ? v.trim() : Object.keys(v).some(function (k) { return has(v[k]); })); };
    if (['docName', 'subject', 'body', 'postTitle', 'postText', 'posts'].some(function (k) { return has(c[k]); })) out.push('Texte');
    if (has(c.tasks)) out.push('Aufgaben');
    if (has(c.chat)) out.push('Chat');
    return out;
  }
  function getPath(o, path) { return path.split('.').reduce(function (a, k) { return a && a[k]; }, o); }
  function setPath(o, path, v) {
    var ks = path.split('.'), last = ks.pop();
    ks.forEach(function (k) { o = o[k] = (o[k] && typeof o[k] === 'object') ? o[k] : {}; });
    o[last] = v;
  }
  function contentForm(vm, p) {
    var sub = subOf(vm, p), tool = A.toolOf(sub), c = state.content[vm.id] || {}, sit = LIB.situations.filter(function (s) { return s.id === vm.id; })[0];
    var orig = M.build(vm.id, { variant: vm.variant && vm.variant.id });
    var f = function (name, label, ph, area) {
      var val = getPath(c, name) || '';
      return '<label>' + esc(label) + (area ? '<textarea name="' + name + '" rows="3" placeholder="' + esc(ph) + '">' + esc(val) + '</textarea>' : '<input name="' + name + '" value="' + esc(val) + '" placeholder="' + esc(ph) + '" autocomplete="off">') + '</label>';
    };
    var fields = '';
    if (p.mode !== 'prinzip' && !A.available(vm, tool)) fields = '<p class="hint">Diese Ansicht gibt es für diese Situation nicht.</p>';
    else if (p.mode === 'prinzip') fields = '<p class="hint">Das Prinzip übernimmt Namen, Dateinamen und Aufgaben aus den Szenen dieser Situation.</p>';
    else if (tool === 'outlook') fields = f('docName', 'Gemeinsame Datei', vm.story.doc.original) + f('subject', 'Betreff der Mail', LIB.stories[vm.id].mails[0].subject) + f('body', 'Text der Mail', orig.story.mails[0].body, true);
    else if (sub === 'posts') fields = (vm.story ? f('docName', 'Gemeinsame Datei', vm.story.doc.original) : '') + orig.scene.posts.map(function (q, i) {
        return q.canonical ? f('postTitle', 'Beitrag ' + (i + 1) + ': Betreff', q.title) + f('postText', 'Beitrag ' + (i + 1) + ': Text', orig.fill(q.text), true)
          : f('posts.' + i + '.title', 'Beitrag ' + (i + 1) + ': Betreff', q.title) + f('posts.' + i + '.text', 'Beitrag ' + (i + 1) + ': Text', orig.fill(q.text), true);
      }).join('');
    else if (sub === 'files' || tool === 'sharepoint') fields = vm.story ? f('docName', 'Gemeinsame Datei', vm.story.doc.original) : '<p class="hint">Dateinamen dieser Situation sind kuratiert; anpassbar sind Namen der Personen.</p>';
    else if (tool === 'chat' && orig.chat) fields = orig.chat.messages.map(function (m, i) { return f('chat.' + i, 'Nachricht ' + (i + 1) + ' (' + V.short(vm.person(m.by).name) + ')', m.text, true); }).join('');
    else if (sub === 'tasks' || tool === 'planner' || tool === 'plantask' || (tool === 'todo' && !vm.personal)) fields = orig.scene.tasks.map(function (t, i) { return f('tasks.' + i, 'Aufgabe ' + (i + 1) + ' (' + V.short(vm.person(t.owner).name) + ')', t.title); }).join('');
    else fields = '<p class="hint">In dieser Ansicht sind die Namen der Personen anpassbar; Inhalte stammen aus der kuratierten Situation.</p>';
    var custom = state.content[vm.id] && customState(vm.id).some(function (x) { return x !== 'Namen'; });
    return '<form class="names contentf" data-sid="' + vm.id + '" data-kind="content" aria-label="Inhalte anpassen"><h3>Inhalte: ' + esc(p.mode === 'prinzip' ? 'Prinzip' : screenLabel(sub)) + '</h3>' +
      '<p class="hint">Leere Felder zeigen den Originaltext. Änderungen gelten in allen Ansichten dieser Situation.</p>' + fields +
      (custom ? '<button class="btn btn-q" type="button" data-act="restore-content">Originaltexte wiederherstellen</button>' : '') + '</form>';
  }
  function savePanel() {
    return '<details class="savep"><summary>Anpassungen sichern</summary><p class="hint">Anpassungen bleiben in diesem Browser gespeichert. Als Datei könnt ihr sie weitergeben oder später wieder laden.</p>' +
      '<p class="savebtns"><button class="btn" type="button" data-act="json-export">JSON herunterladen</button>' +
      '<label class="btn">JSON importieren<input type="file" accept="application/json,.json" data-act="json-import" class="sr-only"></label>' +
      '<button class="btn btn-q" type="button" data-act="reset-all">Alle Anpassungen zurücksetzen</button></p><p class="hint" id="json-status" role="status"></p></details>';
  }
  function flow(step, p, vm) {
    var vid = vm.variant && vm.variant.id, pres = p.seq ? seqRoute(p.seq.id, p.step, true) : route(vm.id, vid, p.mode, p.mode === 'prinzip' ? p.sub || 'chat' : subOf(vm, p), true);
    var items = [['Situation wählen', '#/'], ['Szene anpassen', p.seq ? seqRoute(p.seq.id, p.step) : route(vm.id, vid, p.mode, p.sub)], ['Bildausschnitt prüfen', pres], ['Exportieren', pres]];
    return '<ol class="flow" aria-label="Arbeitsschritte">' + items.map(function (x, i) {
      var n = i + 1, cls = n < step ? 'done' : n === step ? 'on' : '';
      return '<li class="' + cls + '"><a href="' + x[1] + '"' + (n === step ? ' aria-current="step"' : '') + '><b>' + n + '</b>' + x[0] + '</a></li>';
    }).join('') + '</ol>';
  }

  /* ---------- Sequences ---------- */
  function seqById(id) { return (LIB.sequences || []).filter(function (s) { return s.id === id; })[0]; }
  function seqRoute(id, n, present, comp) { return '#/' + (present ? 'ap' : 'a') + '/' + id + '/' + n + (comp ? '/' + comp : ''); }
  function stepParams(seq, n, comp) {
    var st = seq.steps[n - 1];
    return { sid: seq.situation, variant: seq.variant, mode: st.mode, sub: st.sub, comp: comp, seq: seq, step: n };
  }
  function seqBar(p, present) {
    var seq = p.seq, n = p.step;
    return '<nav class="seqbar' + (present ? ' seqbar-dark' : '') + '" aria-label="Abfolge: ' + esc(seq.title) + '"><span class="seq-t">Abfolge · ' + esc(seq.title) + '</span><ol>' + seq.steps.map(function (s, i) {
      return '<li><a href="' + seqRoute(seq.id, i + 1, present, present ? p.comp : null) + '"' + (i + 1 === n ? ' aria-current="step"' : '') + '><b>' + (i + 1) + '</b>' + esc(s.label) + '</a></li>';
    }).join('') + '</ol>' +
      '<span class="seq-nav">' + (n > 1 ? '<a class="btn' + (present ? ' btn-dark' : '') + '" href="' + seqRoute(seq.id, n - 1, present, present ? p.comp : null) + '" data-act="seq-prev">← Zurück</a>' : '') +
      (n < seq.steps.length ? '<a class="btn btn-p" href="' + seqRoute(seq.id, n + 1, present, present ? p.comp : null) + '" data-act="seq-next">Weiter →</a>' : '') + '</span></nav>';
  }
  function sequences() {
    return crumbs([['Bibliothek', '#/'], ['Abfolgen']]) +
      '<section class="block"><div class="block-h"><h1>Abfolgen für Schulungen</h1><p class="lead">Drei bis fünf Ansichten in Erzählreihenfolge, mit Lernziel, Prinzip und Grenze. Jede Ansicht lässt sich anpassen und als PNG exportieren, auch die ganze Abfolge auf einmal.</p></div>' +
      '<ol class="howto"><li><b>Abfolge wählen</b>oder über Team-Personas, Tools und Use Cases eine Situation öffnen.</li><li><b>Szene anpassen</b>Ansicht oben wählen, rechts Namen, Texte und Aufgaben ändern. Alles bleibt in diesem Browser gespeichert.</li><li><b>Bildausschnitt prüfen</b>Nur Anwendung, Folie mit Hinweisen, Fokus-Ausschnitt oder Vorher / Nachher wählen.</li><li><b>Exportieren</b>Einzelnes PNG oder «Ganze Abfolge» in Erzählreihenfolge, wahlweise in 2×.</li></ol>' +
      '<ul class="seqlist">' + LIB.sequences.map(function (s) {
        var vm = vmFor(s.situation, s.variant);
        return '<li><a href="' + seqRoute(s.id, 1) + '"><span class="sit-top">' + collBadge(vm.collection) + (s.ai ? '<span class="badge b-plan">KI-Simulation</span>' : '') + '<span class="wl">' + s.steps.length + ' Ansichten</span></span>' +
          '<strong>' + esc(s.title) + '</strong><span class="sit-w">' + esc(vm.title) + ' · ' + esc(vm.world.name) + '</span><span class="sit-f">' + esc(s.objective) + '</span>' +
          '<span class="seq-steps">' + s.steps.map(function (x, i) { return '<i>' + (i + 1) + ' ' + esc(x.label) + '</i>'; }).join('') + '</span></a></li>';
      }).join('') + '</ul></section>';
  }

  /* ---------- Workspace ---------- */
  function situation(p) {
    var vm = vmFor(p.sid, p.variant);
    if (!vm) return notFound();
    var isP = p.mode === 'prinzip';
    var pid = isP ? (principleMeta(p.sub) ? p.sub : 'chat') : null;
    var vid = vm.variant && vm.variant.id;
    var sub = isP ? null : subOf(vm, p), tool = isP ? null : A.toolOf(sub);
    var presentHref = p.seq ? seqRoute(p.seq.id, p.step, true) : route(p.sid, vid, p.mode, isP ? pid : sub, true);
    var cs = customState(vm.id);
    return crumbs([['Bibliothek', '#/'], [vm.world.name, '#/personas/' + vm.world.id], [vm.title]]) +
      flow(2, p, vm) +
      (p.seq ? seqBar(p, false) + '<p class="seq-obj"><strong>Lernziel:</strong> ' + esc(p.seq.objective) + ' <strong>Grenze:</strong> ' + esc(p.seq.boundary) + '</p>' : '') +
      '<section class="sp sp-ws"><div class="sp-h"><div>' + collBadge(vm.collection) + '<h1>' + esc(vm.title) + '</h1><p class="lead">' + esc(vm.scenario.trigger) + '</p></div>' +
        '<a class="btn btn-p" href="' + presentHref + '">' + ic('i-laptop') + 'Bildausschnitt prüfen und exportieren</a></div>' +
      '<div class="ctxbar" aria-label="Kontext"><span><small>Situation</small>' + esc(vm.title) + '</span><span><small>Ansicht</small>' + (isP ? 'Prinzip: ' + esc(principleMeta(pid).title) : esc(screenLabel(sub))) + '</span>' +
        '<span class="cstate' + (cs.length ? ' on' : '') + '"><small>Anpassungen</small>' + (cs.length ? 'angepasst: ' + cs.join(', ') : 'Original') + '</span></div>' +
      (vm.variants.length > 1 ? '<fieldset class="variants variants-c"><legend>Aufbau</legend>' + vm.variants.map(function (v) {
        return '<a class="var' + (v.id === vid ? ' on' : '') + '" href="' + (p.seq ? route(p.sid, v.id, p.mode, p.sub) : route(p.sid, v.id, p.mode, p.sub)) + '"' + (v.id === vid ? ' aria-current="true"' : '') + ' title="' + esc(vm.fill(v.why)) + '"><strong>' + esc(v.label) + (v === vm.variants[0] ? ' <small>unsere Wahl</small>' : ' <small>Alternative</small>') + '</strong></a>';
      }).join('') + '<p class="var-why">' + esc(vm.fill(vm.variant.why)) + '</p></fieldset>' : '') +
      '<div class="sp-bar"><nav class="modes" aria-label="Darstellung">' +
          '<a href="' + route(p.sid, vid, 'szene', tool && tool !== 'teams' ? sub : null) + '"' + (!isP ? ' aria-current="page"' : '') + '>Szene</a>' +
          '<a href="' + route(p.sid, vid, 'prinzip', 'chat') + '"' + (isP ? ' aria-current="page"' : '') + '>Prinzip</a></nav>' +
        (isP ? '<nav class="prs" aria-label="Prinzip wählen">' + LIB.principles.map(function (x) {
          return '<a href="' + route(p.sid, vid, 'prinzip', x.id) + '"' + (x.id === pid ? ' aria-current="page"' : '') + '>' + esc(x.title) + '</a>';
        }).join('') + '</nav>' : '') +
        '<label class="tgl"><input type="checkbox" data-act="annot"' + (state.annot ? ' checked' : '') + '> Hinweise</label></div>' +
      (isP ? '' : screenPicker(vm, p)) +
      '<div class="sp-grid"><div class="sp-vis" id="visual">' + visualHtml(vm, p, pid) + '</div>' +
        '<aside class="sp-side" aria-label="Anpassen"><p class="side-h">Anpassen</p>' +
        '<details open><summary>Inhalte dieser Ansicht</summary>' + contentForm(vm, p) + '</details>' +
        '<details open><summary>Namen</summary>' + nameForm(vm) + '</details>' +
        savePanel() +
        '<div class="sp-ctx"><h3>Kontext</h3><p>' + esc(vm.scenario.description) + '</p>' +
          (vm.legacyHref ? '<p><a href="' + vm.legacyHref + '">Details im Legacy-Atlas</a></p>' : '<p class="hint">Fiktive Synthese, noch nicht durch Recherche validiert.</p>') +
          ((LIB.sequences || []).filter(function (s) { return s.situation === vm.id; }).map(function (s) { return '<p><a href="' + seqRoute(s.id, 1) + '">Abfolge: ' + esc(s.title) + '</a></p>'; }).join('')) +
        '</div></aside></div></section>';
  }

  /* ---------- Presentation stage + PNG export ---------- */
  var lastNonPresent = '#/';
  function compKinds(vm, p) {
    if (p.mode === 'prinzip') return [['prinzip', 'Prinzip-Folie']];
    var k = [['app', 'Nur Anwendung'], ['folie', 'Folie mit Hinweisen'], ['fokus', 'Fokus-Ausschnitt']];
    if (vm.story) k.push(['vergleich', 'Vorher / Nachher']);
    return k;
  }
  function compose(vm, p, kind) {
    var isP = p.mode === 'prinzip', pid = isP ? (principleMeta(p.sub) ? p.sub : 'chat') : null;
    return X.compose(vm, { mode: p.mode, sub: isP ? pid : subOf(vm, p), annot: state.annot }, kind, isP ? principleMeta(pid) : null);
  }
  function kindFor(vm, p) {
    var kinds = compKinds(vm, p);
    return p.mode === 'prinzip' ? 'prinzip' : (kinds.some(function (k) { return k[0] === p.comp; }) ? p.comp : (state.annot ? 'folie' : 'app'));
  }
  function present(p) {
    var vm = vmFor(p.sid, p.variant);
    if (!vm) return notFound();
    var isP = p.mode === 'prinzip', pid = isP ? (principleMeta(p.sub) ? p.sub : 'chat') : null;
    var kinds = compKinds(vm, p), kind = kindFor(vm, p);
    var slide = compose(vm, p, kind) || '<div class="slide" style="width:1920px;height:1080px">' + unavailable(vm, A.toolOf(subOf(vm, p))) + '</div>';
    var back = p.seq ? seqRoute(p.seq.id, p.step) : route(p.sid, vm.variant && vm.variant.id, p.mode, p.sub);
    var base = function (k) { return p.seq ? seqRoute(p.seq.id, p.step, true, k) : route(p.sid, vm.variant && vm.variant.id, p.mode, isP ? pid : subOf(vm, p), true) + '/' + k; };
    return '<div class="stage-wrap" role="dialog" aria-modal="true" aria-label="Präsentation: ' + esc(vm.title) + '">' +
      '<div class="stage-ctl"><a class="btn btn-dark" href="' + back + '" data-act="exit">' + ic('i-back') + 'Zurück zum Anpassen <kbd>Esc</kbd></a>' +
        (kinds.length > 1 ? '<nav class="comps" aria-label="Ausgabe">' + kinds.map(function (k) {
          return '<a href="' + base(k[0]) + '"' + (k[0] === kind ? ' aria-current="true"' : '') + '>' + k[1] + '</a>';
        }).join('') + '</nav>' : '') +
        '<label class="tgl tgl-dark"><input type="checkbox" data-act="annot"' + (state.annot ? ' checked' : '') + '> Hinweise <kbd>H</kbd></label>' +
        '<label class="tgl tgl-dark"><input type="checkbox" data-act="hires"' + (state.hires ? ' checked' : '') + '> 2× (3840 × 2160)</label>' +
        '<button class="btn btn-p" type="button" data-act="png" data-kind="' + kind + '">' + ic('i-copy') + 'PNG herunterladen</button>' +
        (p.seq ? '<button class="btn btn-dark" type="button" data-act="png-seq">Ganze Abfolge (' + p.seq.steps.length + ' PNG)</button>' : '') +
        '<span class="stage-note" id="png-status" role="status"></span></div>' +
      (p.seq ? seqBar(p, true) : '') +
      '<div class="stage" id="visual"><div class="stage-in stage-slide" style="width:1920px;height:1080px">' + slide + '</div></div></div>';
  }

  function notFound() { return '<section class="block"><h1>Nicht gefunden</h1><p><a href="#/">Zur Bibliothek</a></p></section>'; }

  /* ---------- Router ---------- */
  function parse() {
    var h = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    return h;
  }
  /* Route -> workspace params; sequences resolve to the same params plus their context. */
  function routeParams(h) {
    if (h[0] === 's' || h[0] === 'p') return { sid: h[1], variant: h[2] === '-' ? null : h[2], mode: h[3] === 'prinzip' ? 'prinzip' : 'szene', sub: h[4] === '-' ? null : h[4], comp: h[5], present: h[0] === 'p' };
    if (h[0] === 'a' || h[0] === 'ap') {
      var seq = seqById(h[1]); if (!seq) return null;
      var n = Math.max(1, Math.min(seq.steps.length, parseInt(h[2], 10) || 1));
      var p = stepParams(seq, n, h[3]); p.present = h[0] === 'ap'; return p;
    }
    return null;
  }
  function render() {
    var h = parse(), html, presenting = false, p = routeParams(h);
    document.body.classList.remove('presenting');
    if (!h.length) html = landing();
    else if (h[0] === 'personas') html = personas(h[1]);
    else if (h[0] === 'usecases') html = usecases(h[1]);
    else if (h[0] === 'tools') html = tools(h[1]);
    else if (h[0] === 'abfolgen') html = sequences();
    else if (h[0] === 'konfigurator') html = configurator(h[1] || '1');
    else if (p) { presenting = p.present; html = presenting ? present(p) : situation(p); }
    else html = notFound();
    if (presenting) document.body.classList.add('presenting'); else lastNonPresent = location.hash || '#/';
    app.innerHTML = html;
    document.title = (presenting ? 'Präsentation · ' : '') + (document.querySelector('h1') ? document.querySelector('h1').textContent + ' · ' : '') + 'msteams-personas';
    fitFrames();
    if (presenting) { var x = app.querySelector('[data-act="exit"]'); if (x) x.focus(); fitStage(); }
    else if (!render.keepFocus) { var m = document.getElementById('main'); m.focus({ preventScroll: true }); window.scrollTo(0, 0); }
    render.keepFocus = false;
  }

  /* Re-render only the visual (keeps form focus while typing). */
  function rerenderVisual() {
    var h = parse(), vis = document.getElementById('visual'), prev = document.getElementById('preview'), p = routeParams(h);
    if (prev) {
      var r = C.suggest(state.draft.answers);
      prev.innerHTML = sceneHtml(vmFor(r.best.situation, r.best.variant));
      fitFrames();
    }
    if (vis && p && !p.present) {
      var tmp = document.createElement('div');
      var keep = render.keepFocus;
      render.keepFocus = true;
      tmp.innerHTML = situation(p);
      var nv = tmp.querySelector('#visual');
      if (nv) vis.innerHTML = nv.innerHTML;
      var cs = tmp.querySelector('.cstate'), ocs = app.querySelector('.cstate');
      if (cs && ocs) ocs.outerHTML = cs.outerHTML;
      fitFrames();
      render.keepFocus = keep;
    }
  }

  /* App frames: the application renders at its design size and is scaled to its container. */
  function fitFrames() {
    Array.prototype.forEach.call(app.querySelectorAll('.appframe'), function (f) {
      var inner = f.querySelector('.m3'); if (!inner) return;
      inner.style.transform = 'scale(' + (f.clientWidth / A.W) + ')';
    });
    var vis = document.getElementById('visual'), warn = vis && vis.querySelector('.fit-warn');
    if (warn) { var iss = X.fitIssues(vis.querySelector('.appframe')); warn.hidden = !iss.length; warn.textContent = iss.length ? 'Passt nicht vollständig in die Ansicht: ' + iss.join(', ') + '. Texte kürzen oder den Fokus-Ausschnitt wählen.' : ''; }
  }
  /* Stage: the 1920 x 1080 slide composition, scaled to fit the window. */
  function fitStage() {
    var st = app.querySelector('.stage'), inner = app.querySelector('.stage-in');
    if (!st || !inner) return;
    var W = X.W, H = X.H, ctl = app.querySelector('.stage-ctl'), sb = app.querySelector('.seqbar');
    var availW = window.innerWidth - 24, availH = window.innerHeight - (ctl ? ctl.offsetHeight : 0) - (sb ? sb.offsetHeight + 10 : 0) - 36;
    var s = Math.max(0.05, Math.min(availW / W, availH / H));
    inner.style.transform = 'scale(' + s + ')';
    st.style.width = W * s + 'px'; st.style.height = H * s + 'px';
    var sl = inner.querySelector('.slide'); if (sl) { X.densify(sl); X.tighten(sl); }
    var issues = X.fitIssues(inner), note = document.getElementById('png-status');
    if (note && issues.length) note.textContent = 'Hinweis: ' + issues.join(', ');
  }
  function renderSlide(slide, name) {
    var scale = state.hires ? 2 : 1;
    return (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () { return X.toPNG(slide, scale); }).then(function (blob) {
      var nm = scale === 2 ? name.replace(/\.png$/, '@2x.png') : name;
      X.download(blob, nm);
      return { name: nm, blob: blob, size: blob.size, scale: scale };
    });
  }
  function exportPng() {
    var p = routeParams(parse()), slide = app.querySelector('.stage-in .slide'), status = document.getElementById('png-status');
    if (!slide || !p) return Promise.resolve(null);
    var vm = vmFor(p.sid, p.variant), btn = app.querySelector('[data-act="png"]');
    var name = (p.seq ? ('0' + p.step).slice(-2) + '-' : '') + X.fileName(vm, { mode: p.mode, sub: p.mode === 'prinzip' ? p.sub : subOf(vm, p) }, btn.getAttribute('data-kind'));
    if (status) status.textContent = 'PNG wird erzeugt …';
    return renderSlide(slide, name).then(function (r) {
      window.__lastPng = r;
      if (status) status.textContent = 'Gespeichert: ' + r.name + ' (' + Math.round(r.size / 1024) + ' KB)';
      announce('PNG gespeichert'); return r.blob;
    }).catch(function (e) { if (status) status.textContent = 'Export fehlgeschlagen: ' + e.message; });
  }
  /* Whole sequence: each step rendered offscreen with the current output choice, then saved. */
  function exportSequence() {
    var p = routeParams(parse()); if (!p || !p.seq) return Promise.resolve([]);
    var status = document.getElementById('png-status'), host = document.createElement('div'), out = [];
    host.className = 'export-host'; document.body.appendChild(host);
    var chain = Promise.resolve();
    p.seq.steps.forEach(function (st, i) {
      chain = chain.then(function () {
        var sp = stepParams(p.seq, i + 1, p.comp), vm = vmFor(sp.sid, sp.variant), kind = kindFor(vm, sp);
        host.innerHTML = compose(vm, sp, kind) || '';
        var sl = host.querySelector('.slide'); if (!sl) return;
        X.densify(sl); X.tighten(sl);
        if (status) status.textContent = 'Abfolge: PNG ' + (i + 1) + ' von ' + p.seq.steps.length + ' …';
        return renderSlide(sl, ('0' + (i + 1)).slice(-2) + '-' + X.fileName(vm, { mode: sp.mode, sub: sp.sub }, kind)).then(function (r) { out.push({ name: r.name, size: r.size, kind: kind }); });
      });
    });
    return chain.then(function () {
      host.remove(); window.__lastSeq = out;
      if (status) status.textContent = out.length + ' PNG gespeichert (' + p.seq.title + ')';
      announce('Abfolge exportiert'); return out;
    });
  }
  window.__exportPng = exportPng;
  window.__exportSeq = exportSequence;

  /* ---------- JSON export / import of customisations (versioned, local only) ---------- */
  var SCHEMA = 'msteams-personas.customisations';
  function exportJson() {
    var data = { schema: SCHEMA, version: 1, exported: new Date().toISOString(), names: state.names, content: state.content };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    X.download(blob, 'msteams-personas-anpassungen.json');
    window.__lastJson = data;
    return data;
  }
  function validText(v, depth) {
    if (typeof v === 'string') return v.length <= 4000;
    if (!v || typeof v !== 'object' || Array.isArray(v) || depth > 4) return false;
    return Object.keys(v).every(function (k) { return k.length <= 80 && validText(v[k], depth + 1); });
  }
  function importJson(text) {
    var d;
    try { d = JSON.parse(text); } catch (e) { return 'Keine gültige JSON-Datei.'; }
    if (!d || d.schema !== SCHEMA) return 'Unbekanntes Format: erwartet «' + SCHEMA + '».';
    if (d.version !== 1) return 'Version ' + d.version + ' wird nicht unterstützt (erwartet 1).';
    var known = LIB.situations.map(function (s) { return s.id; });
    var names = d.names || {}, content = d.content || {};
    if (!validText(names, 0) || !validText(content, 0)) return 'Die Datei enthält ungültige Werte.';
    var keys = Object.keys(names).concat(Object.keys(content));
    if (keys.some(function (k) { return known.indexOf(k) < 0; })) return 'Die Datei verweist auf unbekannte Situationen.';
    state.names = names; state.content = content; save();
    return null;
  }
  window.__importJson = function (t) { var e = importJson(t); if (!e) render(); return e; };


  /* ---------- Events ---------- */
  app.addEventListener('submit', function (e) {
    if (e.target.id !== 'cfg-form') return;
    e.preventDefault();
    var fd = new FormData(e.target);
    fd.forEach(function (v, k) { state.draft.answers[k] = v; });
    state.draft.touched = true; save();
    var i = parseInt(parse()[1], 10) || 1;
    location.hash = '#/konfigurator/' + (i < 6 ? i + 1 : 'ergebnis');
  });
  app.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('#cfg-form input[type=radio]')) { state.draft.answers[t.name] = t.value; state.draft.touched = true; save(); }
    if (t.matches('[data-act="annot"]')) { state.annot = t.checked; save(); rerender(); announce(state.annot ? 'Hinweise eingeblendet' : 'Hinweise ausgeblendet'); }
    if (t.matches('[data-act="hires"]')) { state.hires = t.checked; save(); announce(state.hires ? 'Export in doppelter Auflösung' : 'Export in 1920 × 1080'); }
    if (t.matches('[data-act="json-import"]') && t.files && t.files[0]) {
      var rd = new FileReader();
      rd.onload = function () {
        var err = importJson(String(rd.result));
        if (err) { var st = document.getElementById('json-status'); if (st) st.textContent = err; announce(err); return; }
        render.keepFocus = true; render(); var st2 = document.getElementById('json-status'); if (st2) st2.textContent = 'Anpassungen importiert.'; announce('Anpassungen importiert');
      };
      rd.readAsText(t.files[0]);
    }
  });
  app.addEventListener('input', function (e) {
    var f = e.target.closest('form.names');
    if (!f) return;
    var sid = f.getAttribute('data-sid');
    if (f.getAttribute('data-kind') === 'content') {
      var c = state.content[sid] = state.content[sid] || {};
      setPath(c, e.target.name, e.target.value);
      save(); rerenderVisual(); return;
    }
    var n = state.names[sid] = state.names[sid] || { team: '', people: {} };
    if (e.target.name === 'team') n.team = e.target.value.trim();
    else n.people[e.target.name.slice(2)] = e.target.value.trim();
    save(); rerenderVisual();
  });
  app.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act], [data-tab]');
    if (!b) return;
    if (b.hasAttribute('data-tab')) {
      var h = parse();
      var tp = routeParams(h);
      if (tp) { location.hash = route(tp.sid, tp.variant, 'szene', b.getAttribute('data-tab'), tp.present); render.keepFocus = true; pendingFocusTab = b.getAttribute('data-tab'); }
      return;
    }
    var act = b.getAttribute('data-act');
    if (act === 'reset') {
      if (!confirm('Antworten und angepasste Namen dieses Entwurfs verwerfen? Der Entwurf gilt nur in dieser Sitzung.')) return;
      var r = C.suggest(state.draft.answers);
      delete state.names[r.best.situation];
      state.draft = { answers: {}, touched: false }; save();
      location.hash = '#/konfigurator/1'; announce('Entwurf zurückgesetzt'); render();
    }
    if (act === 'png') { exportPng(); return; }
    if (act === 'png-seq') { exportSequence(); return; }
    if (act === 'json-export') { exportJson(); var js = document.getElementById('json-status'); if (js) js.textContent = 'Datei «msteams-personas-anpassungen.json» gespeichert.'; return; }
    if (act === 'reset-all') {
      if (!confirm('Alle gespeicherten Anpassungen (Namen und Texte aller Situationen) in diesem Browser löschen?')) return;
      state.names = {}; state.content = {}; save(); render.keepFocus = true; render(); announce('Alle Anpassungen zurückgesetzt'); return;
    }
    if (act === 'restore-content') {
      var cs = b.closest('form').getAttribute('data-sid');
      if (!confirm('Angepasste Texte verwerfen und Originaltexte anzeigen?')) return;
      delete state.content[cs]; save(); render.keepFocus = true; render(); announce('Originaltexte wiederhergestellt'); return;
    }
    if (act === 'restore') {
      var sid = b.closest('form').getAttribute('data-sid');
      if (!confirm('Angepasste Namen verwerfen und Originalnamen anzeigen?')) return;
      delete state.names[sid]; save(); render.keepFocus = true; render(); announce('Originalnamen wiederhergestellt');
    }
  });
  var pendingFocusTab = null;
  /* Arrow-key navigation inside the scene tab list. */
  app.addEventListener('keydown', function (e) {
    var t = e.target;
    if (t.getAttribute && t.getAttribute('role') === 'tab' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      var tabs = Array.prototype.slice.call(t.parentNode.querySelectorAll('[role=tab]'));
      var i = tabs.indexOf(t) + (e.key === 'ArrowRight' ? 1 : -1);
      var n = tabs[(i + tabs.length) % tabs.length];
      n.click(); e.preventDefault();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (!document.body.classList.contains('presenting')) return;
    if (e.key === 'Escape') { var x = app.querySelector('[data-act="exit"]'); if (x) location.hash = x.getAttribute('href'); }
    var tag = (e.target && e.target.tagName) || '';
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !/INPUT|TEXTAREA|SELECT/.test(tag)) {
      var sn = app.querySelector(e.key === 'ArrowRight' ? '[data-act="seq-next"]' : '[data-act="seq-prev"]');
      if (sn) { location.hash = sn.getAttribute('href'); e.preventDefault(); }
    }
    if ((e.key === 'h' || e.key === 'H') && !e.ctrlKey && !e.metaKey) { state.annot = !state.annot; save(); rerender(); announce(state.annot ? 'Hinweise eingeblendet' : 'Hinweise ausgeblendet'); }
  });
  function rerender() { render.keepFocus = true; var a = document.activeElement && document.activeElement.getAttribute('data-act'); render(); if (a) { var el = app.querySelector('[data-act="' + a + '"]'); if (el) el.focus(); } }
  window.addEventListener('hashchange', function () {
    render();
    if (pendingFocusTab) { var el = app.querySelector('[data-tab="' + pendingFocusTab + '"]'); if (el) el.focus(); pendingFocusTab = null; }
  });
  window.addEventListener('resize', function () { fitFrames(); fitStage(); });
  render();
})();
