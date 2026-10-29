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
    get: function (k, d) { try { var v = sessionStorage.getItem('mtp.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { sessionStorage.setItem('mtp.' + k, JSON.stringify(v)); } catch (e) { /* session-only convenience */ } }
  };
  var state = {
    names: store.get('names', {}),
    draft: store.get('draft', { answers: {}, touched: false }),
    annot: store.get('annot', true),
    content: store.get('content', {})
  };
  function save() { store.set('names', state.names); store.set('draft', state.draft); store.set('annot', state.annot); store.set('content', state.content); }
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
  function sceneHtml(vm) { return vm.personal ? V.scene(vm, { annot: false }) : frameHtml(A.teams(vm, {}), 'Vorschau: ' + vm.team); }
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
      '<section class="block"><div class="block-h"><h2>Die Bibliothek</h2><p>Fünf Hochschulwelten und ein Business-Beispiel. Alle Personen und Einheiten sind fiktiv.</p></div>' +
        '<ul class="worlds">' + ws.map(worldCard).join('') + '</ul></section>' +
      '<section class="block"><div class="block-h"><h2>Drei Prinzipien zum Einstieg</h2><p>Jedes Prinzip zeigt ein Problem, ein Bild, eine Empfehlung im Kontext und ihre Grenze.</p></div>' +
        '<ul class="prlist">' + LIB.principles.map(function (p) {
          return '<li><a href="' + route('leadership-forum', 'eigenes-team', 'prinzip', p.id) + '"><strong>' + esc(p.title) + '</strong><span>' + esc(p.question) + '</span></a></li>';
        }).join('') + '</ul></section>';
  }

  /* ---------- Tools ---------- */
  var STATUS = { ready: ['Bereit', 'b-full'], story: ['Bereit in der Dateigeschichte', 'b-full'], partial: ['Teilweise', 'b-legacy'], planned: ['Geplant', 'b-plan'] };
  function toolSits(t) {
    return LIB.situations.filter(function (s) {
      var vm = vmFor(s.id);
      if (t.id === 'onedrive') return vm.personal;
      return t.id === 'teams' || t.id === 'planner' ? !vm.personal : (vm.tools || []).indexOf(t.id) >= 0;
    });
  }
  function tools(tid) {
    if (tid) {
      var t = LIB.tools.filter(function (x) { return x.id === tid; })[0];
      if (!t) return notFound();
      var sits = toolSits(t), st = STATUS[t.status];
      return crumbs([['Bibliothek', '#/'], ['Tools', '#/tools'], [t.label]]) +
        '<section class="block"><div class="block-h"><span class="badge ' + st[1] + '">' + st[0] + '</span><h1>' + esc(t.label) + '</h1><p class="lead">' + esc(t.desc) + '</p></div>' +
        (t.status === 'planned' ? '<p class="transfer" role="note"><strong>Noch keine OneDrive-Ansicht</strong>Diese Situationen zeigen persönliche Arbeit heute in der vereinfachten Darstellung «Persönliche Ablage», nicht als OneDrive-Oberfläche.</p>' : '') +
        '<h2 class="h2s">' + (t.screens.length ? 'Ansichten und passende Situationen' : 'Passende Situationen') + '</h2>' +
        '<ul class="sits">' + sits.map(function (s) {
          var vm = vmFor(s.id), sc = t.screens[0] ? t.screens[0][0] : null;
          return '<li class="sit"><a href="' + route(s.id, vm.variant && vm.variant.id, 'szene', sc) + '">' +
            '<span class="sit-top">' + collBadge(vm.collection) + (sc ? '<span class="badge b-full">' + esc(t.screens[0][1]) + '</span>' : '<span class="badge b-legacy">Persönliche Ablage</span>') + '</span>' +
            '<strong>' + esc(vm.title) + '</strong><span class="sit-w">' + esc(vm.world.name) + '</span><span class="sit-f">' + esc(vm.friction) + '</span></a></li>';
        }).join('') + '</ul></section>';
    }
    var vm = vmFor('leadership-forum', 'eigenes-team');
    return crumbs([['Bibliothek', '#/'], ['Tools']]) +
      '<section class="block"><div class="block-h"><h1>Tools</h1><p class="lead">Startet bei der Oberfläche, die ihr auf der Folie braucht. Nur fertige Ansichten sind als bereit markiert.</p></div>' +
      '<ul class="toolgrid">' + LIB.tools.map(function (t) {
        var st = STATUS[t.status], prev = t.screens[0] && t.status !== 'partial' ? frameHtml(A.app(vm, t.screens[0][0], {}), t.label) : '<div class="tool-ph">' + (t.status === 'planned' ? 'Geplant' : 'Als Reiter in Teams') + '</div>';
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
  var TOOLS = [['teams', 'Teams', 'posts'], ['outlook', 'Outlook', 'outlook'], ['explorer', 'Explorer', 'explorer'], ['sharepoint', 'SharePoint', 'sharepoint'], ['onedrive', 'OneDrive', null]];
  function visualHtml(vm, p, pid) {
    if (p.mode === 'prinzip') return V.principle(vm, pid, principleMeta(pid), { annot: state.annot });
    if (vm.personal) return V.scene(vm, { annot: state.annot });
    var html = A.app(vm, p.sub, { annot: state.annot });
    if (!html) return unavailable(vm, A.toolOf(p.sub));
    var notes = state.annot ? A.notes(vm, p.sub) : [];
    return frameHtml(html, 'Nachgebildete Oberfläche', true) +
      '<p class="fit-warn" hidden></p>' +
      (notes.length ? '<aside class="ws-notes" aria-label="Lesehinweise"><p class="tw-k">Was hier zu sehen ist</p><ol>' + notes.map(function (n) {
        return '<li><span class="mk" aria-hidden="true">' + n[0] + '</span><span>' + esc(n[1]) + '</span></li>';
      }).join('') + '</ol></aside>' : '') +
      (vm.scene.outside && vm.scene.outside.length && A.toolOf(p.sub) === 'teams' ? '<p class="tw-outside">' + ic('i-box') + '<span><strong>Bleibt ausserhalb:</strong> ' + vm.scene.outside.map(esc).join(' · ') + '</span></p>' : '') +
      (vm.variant && vm.variant.assumption ? '<p class="tw-assume ws-assume">' + ic('i-alert') + '<span><strong>Annahme:</strong> ' + esc(vm.fill(vm.variant.assumption)) + '</span></p>' : '');
  }
  function unavailable(vm, tool) {
    var t = LIB.tools.filter(function (x) { return x.id === tool; })[0] || { label: tool };
    return '<div class="unavail" role="note"><h3>' + esc(t.label) + ' ist für diese Situation nicht ausgearbeitet</h3><p>Die Dateigeschichte über Outlook, Explorer und SharePoint gibt es bisher für «Leadership Forum 2027» und «Kundenportal bis März». Hier zeigt die Bibliothek nichts Erfundenes.</p>' +
      '<p><a href="' + route('leadership-forum', 'eigenes-team', 'szene', tool) + '">' + esc(t.label) + ' im Leadership Forum ansehen</a> · <a href="' + route(vm.id, vm.variant && vm.variant.id, 'szene', 'posts') + '">Teams-Ansicht dieser Situation</a></p></div>';
  }
  function contentForm(vm) {
    if (!vm.story) return '';
    var c = state.content[vm.id] || {}, st = vm.story, post = vm.scene.posts.filter(function (q) { return q.canonical; })[0];
    var f = function (name, label, val, ph, area) {
      return '<label>' + label + (area ? '<textarea name="' + name + '" rows="4" placeholder="' + esc(ph) + '">' + esc(val || '') + '</textarea>' : '<input name="' + name + '" value="' + esc(val || '') + '" placeholder="' + esc(ph) + '" autocomplete="off">') + '</label>';
    };
    return '<form class="names contentf" data-sid="' + vm.id + '" data-kind="content" aria-label="Inhalte anpassen"><h3>Inhalte für die Folie</h3>' +
      '<p class="hint">Gilt in Outlook, Teams, SharePoint und im Prinzip. Kopien im Explorer behalten ihre Namen.</p>' +
      f('docName', 'Gemeinsame Datei', c.docName, st.doc.original) +
      f('subject', 'Betreff der Mail', c.subject, LIB.stories[vm.id].mails[0].subject) +
      f('body', 'Text der Mail', c.body, vm.fill(LIB.stories[vm.id].mails[0].body), true) +
      (post ? f('postTitle', 'Betreff des Teams-Beitrags', c.postTitle, LIB.situations.filter(function (s) { return s.id === vm.id; })[0].scene.posts.filter(function (q) { return q.id === post.id; })[0].title) +
        f('postText', 'Text des Teams-Beitrags', c.postText, vm.fill(LIB.situations.filter(function (s) { return s.id === vm.id; })[0].scene.posts.filter(function (q) { return q.id === post.id; })[0].text), true) : '') +
      (state.content[vm.id] && Object.keys(state.content[vm.id]).some(function (k) { return state.content[vm.id][k]; }) ? '<button class="btn btn-q" type="button" data-act="restore-content">Originaltexte wiederherstellen</button>' : '') + '</form>';
  }
  function situation(p) {
    var vm = vmFor(p.sid, p.variant);
    if (!vm) return notFound();
    var isP = p.mode === 'prinzip';
    var pid = isP ? (principleMeta(p.sub) ? p.sub : 'chat') : null;
    var vid = vm.variant && vm.variant.id;
    var tool = isP ? null : A.toolOf(p.sub);
    var teamsTab = !isP && tool === 'teams' && /^(posts|files|tasks)$/.test(p.sub || '') ? p.sub : 'posts';
    var toolNav = isP || vm.personal ? '' : '<nav class="toolpick" aria-label="Tool wählen">' + TOOLS.map(function (t) {
      var ok = t[0] === 'teams' || (vm.tools || []).indexOf(t[0]) >= 0, on = t[0] === tool;
      if (t[0] === 'onedrive') return '<span class="tp-off" title="Geplant">OneDrive <small>geplant</small></span>';
      return ok ? '<a href="' + route(p.sid, vid, 'szene', t[0] === 'teams' ? teamsTab : t[2]) + '"' + (on ? ' aria-current="page"' : '') + '>' + t[1] + '</a>' : '<span class="tp-off" title="Für diese Situation nicht ausgearbeitet">' + t[1] + ' <small>nicht verfügbar</small></span>';
    }).join('') + '</nav>';
    var presentHref = route(p.sid, vid, p.mode, isP ? pid : p.sub, true);
    return crumbs([['Bibliothek', '#/'], [vm.world.name, '#/personas/' + vm.world.id], [vm.title]]) +
      '<section class="sp"><div class="sp-h"><div>' + collBadge(vm.collection) + '<h1>' + esc(vm.title) + '</h1><p class="lead">' + esc(vm.scenario.trigger) + '</p></div>' +
        '<a class="btn btn-p" href="' + presentHref + '">' + ic('i-laptop') + 'Präsentieren / PNG exportieren</a></div>' +
      '<div class="ctxbar" aria-label="Kontext"><span><small>Situation</small>' + esc(vm.title) + '</span><span><small>Tool</small>' + (isP ? '–' : vm.personal ? 'Persönliche Ablage' : esc((LIB.tools.filter(function (t) { return t.id === tool; })[0] || {}).label)) + '</span><span><small>Darstellung</small>' + (isP ? 'Prinzip' : 'Szene') + '</span></div>' +
      (vm.variants.length > 1 ? '<fieldset class="variants"><legend>Aufbau</legend>' + vm.variants.map(function (v) {
        return '<a class="var' + (v.id === vid ? ' on' : '') + '" href="' + route(p.sid, v.id, p.mode, p.sub) + '"' + (v.id === vid ? ' aria-current="true"' : '') + '><strong>' + esc(v.label) + (v === vm.variants[0] ? ' <small>unsere Wahl</small>' : ' <small>Alternative</small>') + '</strong><span>' + esc(vm.fill(v.why)) + '</span></a>';
      }).join('') + '</fieldset>' : '') +
      '<div class="sp-bar"><nav class="modes" aria-label="Darstellung">' +
          '<a href="' + route(p.sid, vid, 'szene', tool && tool !== 'teams' ? tool : null) + '"' + (!isP ? ' aria-current="page"' : '') + '>Szene</a>' +
          '<a href="' + route(p.sid, vid, 'prinzip', 'chat') + '"' + (isP ? ' aria-current="page"' : '') + '>Prinzip</a></nav>' +
        toolNav +
        (isP ? '<nav class="prs" aria-label="Prinzip wählen">' + LIB.principles.map(function (x) {
          return '<a href="' + route(p.sid, vid, 'prinzip', x.id) + '"' + (x.id === pid ? ' aria-current="page"' : '') + '>' + esc(x.title) + '</a>';
        }).join('') + '</nav>' : '') +
        '<label class="tgl"><input type="checkbox" data-act="annot"' + (state.annot ? ' checked' : '') + '> Hinweise</label></div>' +
      '<div class="sp-grid"><div class="sp-vis" id="visual">' + visualHtml(vm, p, pid) + '</div>' +
        '<aside class="sp-side"><details open><summary>Namen anpassen</summary>' + nameForm(vm) + '</details>' +
        (vm.story ? '<details' + (state.content[vm.id] ? ' open' : '') + '><summary>Inhalte anpassen</summary>' + contentForm(vm) + '</details>' : '') +
        '<div class="sp-ctx"><h3>Kontext</h3><p>' + esc(vm.scenario.description) + '</p>' +
          (isP ? '<p><a href="' + route(p.sid, vid, 'szene') + '">Zur Szene dieser Situation</a></p>' : '<p><a href="' + route(p.sid, vid, 'prinzip', tool === 'teams' ? 'chat' : 'doc') + '">Als Prinzip erklären</a></p>') +
          (vm.legacyHref ? '<p><a href="' + vm.legacyHref + '">Details im Legacy-Atlas</a></p>' : '<p class="hint">Fiktive Synthese, noch nicht durch Recherche validiert.</p>') +
          (!vm.complete ? '<p class="hint">Diese Szene ist aus dem bestehenden Atlas übernommen und noch nicht voll ausgearbeitet.</p>' : '') +
        '</div></aside></div></section>';
  }

  /* ---------- Presentation stage + PNG export ---------- */
  var lastNonPresent = '#/';
  function compKinds(vm, p) {
    if (p.mode === 'prinzip') return [['prinzip', 'Prinzip-Folie']];
    if (vm.personal) return [['app', 'Szene']];
    var k = [['app', 'Nur Anwendung'], ['folie', 'Folie mit Hinweisen']];
    if (vm.story) k.push(['vergleich', 'Vorher / Nachher']);
    return k;
  }
  function present(p) {
    var vm = vmFor(p.sid, p.variant);
    if (!vm) return notFound();
    var isP = p.mode === 'prinzip', pid = isP ? (principleMeta(p.sub) ? p.sub : 'chat') : null;
    var kinds = compKinds(vm, p);
    var kind = isP ? 'prinzip' : (kinds.some(function (k) { return k[0] === p.comp; }) ? p.comp : (state.annot && !vm.personal ? 'folie' : 'app'));
    var slide = X.compose(vm, { mode: p.mode, sub: isP ? pid : p.sub, annot: state.annot }, kind, isP ? principleMeta(pid) : null) ||
      '<div class="slide" style="width:1920px;height:1080px">' + unavailable(vm, A.toolOf(p.sub)) + '</div>';
    var back = route(p.sid, vm.variant && vm.variant.id, p.mode, p.sub);
    var base = route(p.sid, vm.variant && vm.variant.id, p.mode, isP ? pid : (p.sub || (vm.personal ? '-' : 'posts')), true);
    return '<div class="stage-wrap" role="dialog" aria-modal="true" aria-label="Präsentation: ' + esc(vm.title) + '">' +
      '<div class="stage-ctl"><a class="btn btn-dark" href="' + back + '" data-act="exit">' + ic('i-back') + 'Beenden <kbd>Esc</kbd></a>' +
        (kinds.length > 1 ? '<nav class="comps" aria-label="Ausgabe">' + kinds.map(function (k) {
          return '<a href="' + base + '/' + k[0] + '"' + (k[0] === kind ? ' aria-current="true"' : '') + '>' + k[1] + '</a>';
        }).join('') + '</nav>' : '') +
        '<label class="tgl tgl-dark"><input type="checkbox" data-act="annot"' + (state.annot ? ' checked' : '') + '> Hinweise <kbd>H</kbd></label>' +
        '<button class="btn btn-p" type="button" data-act="png" data-kind="' + kind + '">' + ic('i-copy') + 'PNG herunterladen <small>1920 × 1080</small></button>' +
        '<span class="stage-note" id="png-status" role="status"></span></div>' +
      '<div class="stage" id="visual"><div class="stage-in stage-slide" style="width:1920px;height:1080px">' + slide + '</div></div></div>';
  }

  function notFound() { return '<section class="block"><h1>Nicht gefunden</h1><p><a href="#/">Zur Bibliothek</a></p></section>'; }

  /* ---------- Router ---------- */
  function parse() {
    var h = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    return h;
  }
  function render() {
    var h = parse(), html, presenting = false, p;
    document.body.classList.remove('presenting');
    if (!h.length) html = landing();
    else if (h[0] === 'personas') html = personas(h[1]);
    else if (h[0] === 'usecases') html = usecases(h[1]);
    else if (h[0] === 'tools') html = tools(h[1]);
    else if (h[0] === 'konfigurator') html = configurator(h[1] || '1');
    else if (h[0] === 's' || h[0] === 'p') {
      p = { sid: h[1], variant: h[2] === '-' ? null : h[2], mode: h[3] === 'prinzip' ? 'prinzip' : 'szene', sub: h[4] === '-' ? null : h[4], comp: h[5] };
      presenting = h[0] === 'p';
      html = presenting ? present(p) : situation(p);
    } else html = notFound();
    if (presenting) document.body.classList.add('presenting'); else lastNonPresent = location.hash || '#/';
    app.innerHTML = html;
    document.title = (presenting ? 'Präsentation · ' : '') + (document.querySelector('h1') ? document.querySelector('h1').textContent + ' · ' : '') + 'msteams-personas';
    fitFrames();
    if (presenting) { var x = app.querySelector('[data-act="exit"]'); if (x) x.focus(); fitStage(); }
    else if (!render.keepFocus) { var m = document.getElementById('main'); m.focus({ preventScroll: true }); window.scrollTo(0, 0); }
    render.keepFocus = false;
  }

  /* Re-render only the visual (keeps form focus while typing names). */
  function rerenderVisual() {
    var h = parse(), vis = document.getElementById('visual'), prev = document.getElementById('preview');
    if (prev) {
      var r = C.suggest(state.draft.answers);
      prev.innerHTML = sceneHtml(vmFor(r.best.situation, r.best.variant));
      fitFrames();
    }
    if (vis && (h[0] === 's' || h[0] === 'p')) {
      var tmp = document.createElement('div');
      var keep = render.keepFocus;
      render.keepFocus = true;
      tmp.innerHTML = situation({ sid: h[1], variant: h[2] === '-' ? null : h[2], mode: h[3] === 'prinzip' ? 'prinzip' : 'szene', sub: h[4] });
      var nv = tmp.querySelector('#visual');
      if (nv) vis.innerHTML = nv.innerHTML;
      fitFrames();
      render.keepFocus = keep;
    }
  }

  /* App frames: the application renders at 1600 x 900 and is scaled to its container. */
  function fitFrames() {
    Array.prototype.forEach.call(app.querySelectorAll('.appframe'), function (f) {
      var inner = f.querySelector('.m3'); if (!inner) return;
      inner.style.transform = 'scale(' + (f.clientWidth / A.W) + ')';
    });
    var vis = document.getElementById('visual'), warn = vis && vis.querySelector('.fit-warn');
    if (warn) { var iss = X.fitIssues(vis.querySelector('.appframe')); warn.hidden = !iss.length; warn.textContent = iss.length ? 'Passt nicht vollständig in die Ansicht: ' + iss.join(', ') + '. Texte kürzen oder einen anderen Reiter wählen.' : ''; }
  }
  /* Stage: the 1920 x 1080 slide composition, scaled to fit the window. */
  function fitStage() {
    var st = app.querySelector('.stage'), inner = app.querySelector('.stage-in');
    if (!st || !inner) return;
    var W = X.W, H = X.H, ctl = app.querySelector('.stage-ctl');
    var availW = window.innerWidth - 24, availH = window.innerHeight - (ctl ? ctl.offsetHeight : 0) - 36;
    var s = Math.min(availW / W, availH / H);
    inner.style.transform = 'scale(' + s + ')';
    st.style.width = W * s + 'px'; st.style.height = H * s + 'px';
    var sl = inner.querySelector('.slide'); if (sl) X.densify(sl);
    var issues = X.fitIssues(inner), note = document.getElementById('png-status');
    if (note && issues.length) note.textContent = 'Hinweis: ' + issues.join(', ');
  }
  function exportPng() {
    var h = parse(), slide = app.querySelector('.stage-in .slide'), status = document.getElementById('png-status');
    if (!slide) return Promise.resolve(null);
    var vm = vmFor(h[1], h[2] === '-' ? null : h[2]), btn = app.querySelector('[data-act="png"]');
    var p = { mode: h[3] === 'prinzip' ? 'prinzip' : 'szene', sub: h[4] };
    var name = X.fileName(vm, p, btn.getAttribute('data-kind'));
    if (status) status.textContent = 'PNG wird erzeugt …';
    return (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () { return X.toPNG(slide); }).then(function (blob) {
      window.__lastPng = { name: name, blob: blob, size: blob.size };
      X.download(blob, name);
      if (status) status.textContent = 'Gespeichert: ' + name + ' (' + Math.round(blob.size / 1024) + ' KB)';
      announce('PNG gespeichert'); return blob;
    }).catch(function (e) { if (status) status.textContent = 'Export fehlgeschlagen: ' + e.message; });
  }
  window.__exportPng = exportPng;

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
  });
  app.addEventListener('input', function (e) {
    var f = e.target.closest('form.names');
    if (!f) return;
    var sid = f.getAttribute('data-sid');
    if (f.getAttribute('data-kind') === 'content') {
      var c = state.content[sid] = state.content[sid] || {};
      c[e.target.name] = e.target.value;
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
      if (h[0] === 's' || h[0] === 'p') { location.hash = route(h[1], h[2] === '-' ? null : h[2], 'szene', b.getAttribute('data-tab'), h[0] === 'p'); render.keepFocus = true; pendingFocusTab = b.getAttribute('data-tab'); }
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
