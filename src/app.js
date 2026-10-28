/*
 * Library app: hash router, shared selection state, pages and presentation stage.
 * Routes:
 *   #/                       landing
 *   #/personas  #/usecases   browsing (both converge on situations)
 *   #/konfigurator/<1-6|ergebnis>
 *   #/s/<situation>/<variant|->/<szene|prinzip>/<tab|principle>
 *   #/p/<same params>        presentation stage
 */
(function () {
  var V = window.Views, M = window.Model, C = window.Configurator, LIB = window.LIB;
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
    annot: store.get('annot', true)
  };
  function save() { store.set('names', state.names); store.set('draft', state.draft); store.set('annot', state.annot); }
  function namesFor(sid) { return state.names[sid] || { team: '', people: {} }; }
  function hasCustom(sid) { var n = state.names[sid]; return !!(n && (n.team || Object.keys(n.people || {}).some(function (k) { return n.people[k]; }))); }

  function vmFor(sid, variant) {
    var n = namesFor(sid);
    return M.build(sid, { variant: variant, names: { team: n.team, people: n.people } });
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
  function landing() {
    var vm = vmFor('leadership-forum', 'eigenes-team');
    var ws = M.worlds();
    return '<section class="hero"><div class="hero-t">' +
        '<p class="kick">Bibliothek für Schulungen und Beratung</p>' +
        '<h1>Teams-Situationen zeigen, ohne ein Team zu bauen.</h1>' +
        '<p class="lead">Wählt eine vertraute Arbeitssituation oder beschreibt eure eigene. Ihr erhaltet lesbare Szenen und klare Prinzip-Bilder mit denselben Personen, ohne Testkonten, Dummy-Dateien oder Aufräumen danach.</p>' +
        '<ul class="entries">' +
          '<li><a class="entry" href="#/personas"><span class="entry-n">1</span><strong>Persona wählen</strong><span>Sechs Arbeitswelten: Verwaltung, Forschung, Einzelarbeit, Gremium, Lehre, Abteilung</span></a></li>' +
          '<li><a class="entry" href="#/usecases"><span class="entry-n">2</span><strong>Use Case wählen</strong><span>Von einer Reibung ausgehen: Entscheide, Fassungen, Pendenzen</span></a></li>' +
          '<li><a class="entry entry-main" href="#/konfigurator/1"><span class="entry-n">3</span><strong>Eigene Situation</strong><span>Sechs kurze Fragen, ein begründeter Vorschlag und eine Alternative</span></a></li>' +
        '</ul></div>' +
        '<div class="hero-v" aria-label="Beispiel: dieselbe Situation als Szene und als Prinzip">' +
          '<div class="hero-scene"><div class="hero-clip" inert>' + V.scene(vm, { annot: false }) + '</div><a class="hero-open" href="' + route('leadership-forum', 'eigenes-team', 'szene') + '">Szene öffnen</a></div>' +
          '<div class="hero-pr"><div class="hero-clip" inert>' + V.principle(vm, 'chat', principleMeta('chat'), { annot: false }) + '</div><a class="hero-open" href="' + route('leadership-forum', 'eigenes-team', 'prinzip', 'chat') + '">Prinzip öffnen</a></div>' +
          '<p class="hero-cap">Leadership Forum 2027: oben als <strong>Szene</strong>, unten als <strong>Prinzip</strong>. Dieselben Personen, derselbe Entscheid.</p>' +
        '</div></section>' +
      '<section class="block"><div class="block-h"><h2>Die Bibliothek</h2><p>Fünf Hochschulwelten und ein Business-Beispiel. Alle Personen und Einheiten sind fiktiv.</p></div>' +
        '<ul class="worlds">' + ws.map(worldCard).join('') + '</ul></section>' +
      '<section class="block"><div class="block-h"><h2>Drei Prinzipien zum Einstieg</h2><p>Jedes Prinzip zeigt ein Problem, ein Bild, eine Empfehlung im Kontext und ihre Grenze.</p></div>' +
        '<ul class="prlist">' + LIB.principles.map(function (p) {
          return '<li><a href="' + route('leadership-forum', 'eigenes-team', 'prinzip', p.id) + '"><strong>' + esc(p.title) + '</strong><span>' + esc(p.question) + '</span></a></li>';
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
      return crumbs([['Bibliothek', '#/'], ['Persona wählen', '#/personas'], [w.name]]) +
        '<section class="block"><div class="block-h">' + collBadge(w.collection) + '<h1>' + esc(w.name) + '</h1><p class="lead">' + esc(w.tagline) + '</p></div>' +
        '<h2 class="h2s">Situationen in dieser Arbeitswelt</h2><ul class="sits">' + w.situations.map(function (s) { return situationCard(s); }).join('') + '</ul>' +
        (w.collection === 'hochschule' ? '<p class="legacy-l">Alle Details, Entscheidungspunkte und die Druckfassung: <a href="atlas.html#/w/' + w.id + '">Legacy-Atlas öffnen</a></p>' : '<p class="legacy-l">Fiktive Synthese für den Prototyp, noch nicht durch Recherche validiert.</p>') +
        '</section>';
    }
    return crumbs([['Bibliothek', '#/'], ['Persona wählen']]) +
      '<section class="block"><div class="block-h"><h1>Persona wählen</h1><p class="lead">Arbeitswelten, keine demografischen Profile: Wie ist die Arbeit organisiert, und wo reibt es?</p></div>' +
      '<ul class="worlds">' + ws.map(worldCard).join('') + '</ul></section>';
  }
  function usecases(uid) {
    if (uid) {
      var u = LIB.usecases.filter(function (x) { return x.id === uid; })[0];
      if (!u) return notFound();
      var sits = LIB.situations.filter(function (s) { return s.usecases.indexOf(uid) >= 0; });
      var pm = principleMeta(u.principle);
      return crumbs([['Bibliothek', '#/'], ['Use Case wählen', '#/usecases'], [u.title]]) +
        '<section class="block"><div class="block-h"><h1>' + esc(u.title) + '</h1><p class="lead">' + esc(u.question) + ' Passendes Prinzip: <strong>' + esc(pm.title) + '</strong></p></div>' +
        '<ul class="sits">' + sits.map(function (s) {
          return situationCard(s.id).replace('/szene"', '/prinzip/' + u.principle + '"');
        }).join('') + '</ul></section>';
    }
    return crumbs([['Bibliothek', '#/'], ['Use Case wählen']]) +
      '<section class="block"><div class="block-h"><h1>Use Case wählen</h1><p class="lead">Startet bei der Reibung. Jeder Use Case führt zu konkreten Situationen aus der Bibliothek.</p></div>' +
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
          '<h3>Warum das passt</h3><ul class="why">' + r.best.reasons.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
          (r.cautions.length ? '<h3>Annahmen und Grenzen</h3><ul class="caut">' + r.cautions.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
          '<div class="res-alt"><p class="kick">Alternative</p><h3>' + esc(r.alt.label) + '</h3><p>' + esc(alt.variant && r.alt.variant ? alt.variant.why : (r.alt.reasons.join(' ') || alt.friction)) + '</p><p class="res-base">Grundlage: ' + esc(alt.title) + '</p><a href="' + route(r.alt.situation, r.alt.variant, 'szene') + '">Alternative ansehen</a></div>' +
        '</div>' +
        '<div class="res-edit">' + nameForm(vm) + '</div>' +
        '<div class="res-prev"><p class="kick">Live-Vorschau</p><div id="preview">' + V.scene(vm, { annot: false }) + '</div></div>' +
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

  /* ---------- Situation page (Szene / Prinzip) ---------- */
  function situation(p) {
    var vm = vmFor(p.sid, p.variant);
    if (!vm) return notFound();
    var isP = p.mode === 'prinzip';
    var pid = isP ? (principleMeta(p.sub) ? p.sub : 'chat') : null;
    var vid = vm.variant && vm.variant.id;
    var visual = isP ? V.principle(vm, pid, principleMeta(pid), { annot: state.annot }) : V.scene(vm, { annot: state.annot, tab: p.sub });
    return crumbs([['Bibliothek', '#/'], [vm.world.name, '#/personas/' + vm.world.id], [vm.title]]) +
      '<section class="sp"><div class="sp-h"><div>' + collBadge(vm.collection) + '<h1>' + esc(vm.title) + '</h1><p class="lead">' + esc(vm.scenario.trigger) + '</p></div>' +
        '<a class="btn btn-p" href="' + route(p.sid, vid, p.mode, isP ? pid : p.sub, true) + '">' + ic('i-laptop') + 'Präsentieren</a></div>' +
      (vm.variants.length > 1 ? '<fieldset class="variants"><legend>Aufbau</legend>' + vm.variants.map(function (v) {
        return '<a class="var' + (v.id === vid ? ' on' : '') + '" href="' + route(p.sid, v.id, p.mode, p.sub) + '"' + (v.id === vid ? ' aria-current="true"' : '') + '><strong>' + esc(v.label) + (v === vm.variants[0] ? ' <small>unsere Wahl</small>' : ' <small>Alternative</small>') + '</strong><span>' + esc(vm.fill(v.why)) + '</span></a>';
      }).join('') + '</fieldset>' : '') +
      '<div class="sp-bar"><nav class="modes" aria-label="Darstellung">' +
          '<a href="' + route(p.sid, vid, 'szene') + '"' + (!isP ? ' aria-current="page"' : '') + '>Szene</a>' +
          '<a href="' + route(p.sid, vid, 'prinzip', 'chat') + '"' + (isP ? ' aria-current="page"' : '') + '>Prinzip</a></nav>' +
        (isP ? '<nav class="prs" aria-label="Prinzip wählen">' + LIB.principles.map(function (x) {
          return '<a href="' + route(p.sid, vid, 'prinzip', x.id) + '"' + (x.id === pid ? ' aria-current="page"' : '') + '>' + esc(x.title) + '</a>';
        }).join('') + '</nav>' : '') +
        '<label class="tgl"><input type="checkbox" data-act="annot"' + (state.annot ? ' checked' : '') + '> Hinweise</label></div>' +
      '<div class="sp-grid"><div class="sp-vis" id="visual">' + visual + '</div>' +
        '<aside class="sp-side"><details open><summary>Namen anpassen</summary>' + nameForm(vm) + '</details>' +
        '<div class="sp-ctx"><h3>Kontext</h3><p>' + esc(vm.scenario.description) + '</p>' +
          (isP ? '<p><a href="' + route(p.sid, vid, 'szene') + '">Zur Szene dieser Situation</a></p>' : '<p><a href="' + route(p.sid, vid, 'prinzip', 'chat') + '">Als Prinzip erklären</a></p>') +
          (vm.legacyHref ? '<p><a href="' + vm.legacyHref + '">Details im Legacy-Atlas</a></p>' : '<p class="hint">Fiktive Synthese, noch nicht durch Recherche validiert.</p>') +
          (!vm.complete ? '<p class="hint">Diese Szene ist aus dem bestehenden Atlas übernommen und noch nicht voll ausgearbeitet.</p>' : '') +
        '</div></aside></div></section>';
  }

  /* ---------- Presentation stage ---------- */
  var lastNonPresent = '#/';
  function present(p) {
    var vm = vmFor(p.sid, p.variant);
    if (!vm) return notFound();
    var isP = p.mode === 'prinzip', pid = isP ? (principleMeta(p.sub) ? p.sub : 'chat') : null;
    var visual = isP ? V.principle(vm, pid, principleMeta(pid), { annot: state.annot, stage: true }) : V.scene(vm, { annot: state.annot, tab: p.sub, stage: true });
    var back = route(p.sid, vm.variant && vm.variant.id, p.mode, p.sub);
    return '<div class="stage-wrap" role="dialog" aria-modal="true" aria-label="Präsentation: ' + esc(vm.title) + '">' +
      '<div class="stage-ctl"><a class="btn btn-dark" href="' + back + '" data-act="exit">' + ic('i-back') + 'Beenden <kbd>Esc</kbd></a>' +
        '<label class="tgl tgl-dark"><input type="checkbox" data-act="annot"' + (state.annot ? ' checked' : '') + '> Hinweise <kbd>H</kbd></label>' +
        '<span class="stage-note">PNG-Export folgt später. Für jetzt: Bildschirmfoto.</span></div>' +
      '<div class="stage" id="visual"><div class="stage-in">' + visual + '<p class="stage-foot">' + esc(vm.title) + ' · fiktives Beispiel</p></div></div></div>';
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
    else if (h[0] === 'konfigurator') html = configurator(h[1] || '1');
    else if (h[0] === 's' || h[0] === 'p') {
      p = { sid: h[1], variant: h[2] === '-' ? null : h[2], mode: h[3] === 'prinzip' ? 'prinzip' : 'szene', sub: h[4] };
      presenting = h[0] === 'p';
      html = presenting ? present(p) : situation(p);
    } else html = notFound();
    if (presenting) document.body.classList.add('presenting'); else lastNonPresent = location.hash || '#/';
    app.innerHTML = html;
    document.title = (presenting ? 'Präsentation · ' : '') + (document.querySelector('h1') ? document.querySelector('h1').textContent + ' · ' : '') + 'msteams-personas';
    if (presenting) { var x = app.querySelector('[data-act="exit"]'); if (x) x.focus(); fitStage(); }
    else if (!render.keepFocus) { var m = document.getElementById('main'); m.focus({ preventScroll: true }); window.scrollTo(0, 0); }
    render.keepFocus = false;
  }

  /* Re-render only the visual (keeps form focus while typing names). */
  function rerenderVisual() {
    var h = parse(), vis = document.getElementById('visual'), prev = document.getElementById('preview');
    if (prev) {
      var r = C.suggest(state.draft.answers);
      prev.innerHTML = V.scene(vmFor(r.best.situation, r.best.variant), { annot: false });
    }
    if (vis && (h[0] === 's' || h[0] === 'p')) {
      var tmp = document.createElement('div');
      var keep = render.keepFocus;
      render.keepFocus = true;
      tmp.innerHTML = situation({ sid: h[1], variant: h[2] === '-' ? null : h[2], mode: h[3] === 'prinzip' ? 'prinzip' : 'szene', sub: h[4] });
      var nv = tmp.querySelector('#visual');
      if (nv) vis.innerHTML = nv.innerHTML;
      render.keepFocus = keep;
    }
  }

  /* Stage: keep a 16:9 canvas of fixed design size, scaled to fit the viewport. */
  function fitStage() {
    var st = app.querySelector('.stage'), inner = app.querySelector('.stage-in');
    if (!st || !inner) return;
    var W = 1600, H = 900, ctl = app.querySelector('.stage-ctl');
    var availW = window.innerWidth - 24, availH = window.innerHeight - (ctl ? ctl.offsetHeight : 0) - 24;
    var s = Math.min(availW / W, availH / H);
    inner.style.transform = 'scale(' + s + ')';
    /* Long text: step down density until the visual fits; flag anything still cut off. */
    var vis = inner.firstElementChild, over = function () { return [vis].concat(Array.prototype.slice.call(vis.querySelectorAll('.tw-main'))).some(function (e) { return e.scrollHeight > e.clientHeight + 2; }); };
    inner.classList.remove('dense', 'denser');
    var flag = inner.querySelector('.stage-overflow'); if (flag) flag.remove();
    if (over()) inner.classList.add('dense');
    if (over()) inner.classList.add('denser');
    if (over()) inner.insertAdjacentHTML('beforeend', '<p class="stage-overflow">Gekürzt: Volltext in der Arbeitsansicht</p>');
    st.style.width = W * s + 'px'; st.style.height = H * s + 'px';
  }

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
    var sid = f.getAttribute('data-sid'), n = state.names[sid] = state.names[sid] || { team: '', people: {} };
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
  window.addEventListener('resize', fitStage);
  render();
})();
