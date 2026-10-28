/* Higher-education atlas: renders window.HE_WORLDS + window.HE_ATLAS (worlds.js). No dependencies.
 * Routes:  #/  (atlas)   #/w/<world-id>[/heute|m365]   (no suffix = Vergleich)  */
(function () {
  'use strict';

  var D = window.HE_WORLDS, A = window.HE_ATLAS;
  var app = document.getElementById('app');
  var live = document.getElementById('live');
  if (!D || !A || !app) return;

  var DEFAULT_VIEW = 'vergleich';
  var VIEWS = ['vergleich', 'heute', 'm365'];
  var VIEW_LABEL = { vergleich: 'Vergleich', heute: 'Arbeitswelt heute', m365: 'M365-Arbeitsmodell' };
  var PATTERN = { continuous: 'Laufender Betrieb', mixed: 'Gemischt', solo: 'Einzelarbeit', periodic: 'Periodisch', cyclic: 'Wiederkehrend' };
  var ROLE = {
    valid: { label: 'Hat weiter seinen Platz', icon: 'i-check', tone: 'ok' },
    wrong: { label: 'Falscher Job', icon: 'i-alert', tone: 'bad' },
    duplicate: { label: 'Doppelte Quelle', icon: 'i-copy', tone: 'bad' },
    dependency: { label: 'Persönlich, aber zur Abhängigkeit geworden', icon: 'i-person', tone: 'bad' },
    specialist: { label: 'Spezialsystem, bleibt ausserhalb', icon: 'i-box', tone: 'out' }
  };
  var ZONE = {
    personal: { label: 'Persönlich', icon: 'i-person', where: 'OneDrive, To Do, Entwürfe' },
    shared: { label: 'Gemeinsam', icon: 'i-people', where: 'Teams, Kanäle, SharePoint, Planner' },
    institutional: { label: 'Institutionell', icon: 'i-building', where: 'Massgebliche Systeme der Universität' },
    outside: { label: 'Spezialsysteme', icon: 'i-box', where: 'Ausserhalb von M365' }
  };
  var STATE = { personal: 'persönlich', shared: 'gemeinsam', institutional: 'institutionell' };
  var CATS = [
    ['communication', 'Kommunikation'], ['documents', 'Dokumente'], ['tasks', 'Aufgaben'],
    ['knowledge', 'Wissen'], ['attention', 'Meetings und Aufmerksamkeit']
  ];

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function icon(id) { return '<svg class="ic" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function worldById(id) { return D.worlds.filter(function (w) { return w.id === id; })[0]; }
  function href(id, view) { return '#/w/' + id + (view && view !== DEFAULT_VIEW ? '/' + view : ''); }
  function personName(n) { return n.replace(/^((Prof|Dr)\.\s*)+/, '').trim(); }
  function initials(n) {
    var p = personName(n).split(/\s+/);
    return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
  }
  function avatar(i, name) { return '<span class="av av-' + (i % 6) + '" aria-hidden="true">' + esc(initials(name)) + '</span>'; }
  function list(items, cls) {
    return '<ul class="' + (cls || 'plain') + '">' + items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
  }
  function sizeLabel(w) { return w.size === 1 ? '1 Person' : w.size + ' Personen'; }
  function quoted(t) { return /«/.test(t) ? esc(t) : '«' + esc(t) + '»'; }
  function stripPrefix(s) { return s.replace(/^Unsere Wahl für diesen Kontext:\s*/, ''); }
  function more(summary, body, cls) {
    return '<details class="more ' + (cls || '') + '"><summary>' + esc(summary) + '</summary><div class="more-b">' + body + '</div></details>';
  }
  function zoneBadge(z) { return '<span class="zb z-' + z + '">' + icon(ZONE[z].icon) + esc(ZONE[z].label) + '</span>'; }

  /* One signature glyph per work pattern; this is what makes the worlds look different at a glance. */
  function glyph(p) {
    var g = {
      continuous: '<line x1="6" y1="52" x2="114" y2="52" class="g-base"/><rect x="48" y="30" width="46" height="9" rx="2" class="g-acc"/><line x1="48" y1="39" x2="48" y2="52" class="g-thin"/><line x1="94" y1="39" x2="94" y2="52" class="g-thin"/>',
      mixed: '<line x1="6" y1="20" x2="60" y2="20" class="g-thin"/><line x1="6" y1="36" x2="60" y2="36" class="g-thin"/><line x1="6" y1="52" x2="60" y2="52" class="g-thin"/><line x1="60" y1="14" x2="60" y2="58" class="g-base"/><rect x="60" y="14" width="54" height="44" rx="3" class="g-acc"/>',
      solo: '<circle cx="34" cy="36" r="13" class="g-solid"/><circle cx="100" cy="18" r="4" class="g-dot"/><circle cx="104" cy="56" r="4" class="g-dot"/><path d="M47 36 C70 36 80 24 96 19" class="g-dash"/><path d="M47 38 C70 40 86 50 99 54" class="g-dash"/>',
      periodic: '<line x1="6" y1="54" x2="114" y2="54" class="g-base"/><line x1="16" y1="54" x2="16" y2="22" class="g-tick"/><line x1="36" y1="54" x2="36" y2="22" class="g-tick"/><line x1="56" y1="54" x2="56" y2="22" class="g-tick"/><line x1="76" y1="54" x2="76" y2="22" class="g-tick"/><line x1="96" y1="54" x2="96" y2="22" class="g-tick"/><line x1="112" y1="54" x2="112" y2="22" class="g-tick"/>',
      cyclic: '<path d="M60 12 A24 24 0 1 1 36 36" class="g-base" fill="none"/><path d="M30 28 L36 37 L44 31" class="g-base" fill="none"/><circle cx="60" cy="12" r="5" class="g-acc"/><circle cx="84" cy="36" r="5" class="g-solid"/><circle cx="60" cy="60" r="5" class="g-solid"/><circle cx="36" cy="36" r="5" class="g-solid"/>'
    }[p] || '';
    return '<svg class="glyph" viewBox="0 0 120 72" aria-hidden="true" focusable="false">' + g + '</svg>';
  }

  function people(w, atlas) {
    var out = atlas.map.outside || [], ext = atlas.map.external_people || [];
    return {
      core: w.people.filter(function (p) { return out.indexOf(p.id) < 0 && ext.indexOf(p.id) < 0; }),
      outside: w.people.filter(function (p) { return out.indexOf(p.id) >= 0; }),
      external: w.people.filter(function (p) { return ext.indexOf(p.id) >= 0; })
    };
  }
  function avatarGroup(w, atlas, max) {
    var core = people(w, atlas).core, shown = core.slice(0, max), rest = core.length - shown.length;
    return '<ul class="avs" aria-label="Personen: ' + esc(core.map(function (p) { return personName(p.name); }).join(', ')) + '">' +
      shown.map(function (p) { return '<li>' + avatar(w.people.indexOf(p), p.name) + '</li>'; }).join('') +
      (rest > 0 ? '<li><span class="av av-more" aria-hidden="true">+' + rest + '</span></li>' : '') + '</ul>';
  }

  /* ---------- atlas ---------- */
  function renderAtlas() {
    var rows = D.worlds.map(function (w) {
      var a = A[w.id];
      return '<tr>' +
        '<th scope="row"><a href="' + href(w.id) + '">' + esc(a.label) + '</a><span class="sub">' + esc(w.name) + '</span></th>' +
        '<td data-l="Grösse">' + esc(sizeLabel(w)) + '</td>' +
        '<td data-l="Takt"><span class="tkt">' + glyph(a.pattern) + '<span>' + esc(PATTERN[a.pattern]) + '</span></span></td>' +
        '<td data-l="Einzelarbeit"><span class="meter"><span class="bar" style="--v:' + w.work_mix.individual_percent + '%"></span><span class="num">' + w.work_mix.individual_percent + ' %</span></span></td>' +
        '<td data-l="Passendes M365-Setup" class="fp">' + esc(a.footprint) + '</td></tr>';
    }).join('');

    var worlds = D.worlds.map(function (w) {
      var a = A[w.id], s = w.scenarios[0];
      return '<article class="world" data-pattern="' + a.pattern + '" aria-labelledby="wh-' + w.id + '">' +
        '<div class="world-sig">' + glyph(a.pattern) + '<p class="kick">' + esc(a.label) + '</p></div>' +
        '<div class="world-main">' +
          '<h2 id="wh-' + w.id + '"><a href="' + href(w.id) + '">' + esc(w.name) + '</a></h2>' +
          '<p class="tag">' + esc(w.tagline) + '</p>' +
          '<blockquote class="tension"><p>' + esc(w.tension) + '</p></blockquote>' +
        '</div>' +
        '<div class="world-side">' +
          miniFootprint(w, a) +
          avatarGroup(w, a, 6) +
          '<p class="meta"><span class="k">Szenario</span> ' + esc(s.name) + '</p>' +
          '<p class="meta"><span class="k">Takt</span> ' + esc(w.rhythm.split(';')[0]) + '</p>' +
          '<p class="meta"><span class="k">M365-Setup</span> ' + esc(a.footprint) + '</p>' +
          '<a class="go" href="' + href(w.id) + '">Arbeitswelt ansehen' + icon('i-arrow') + '</a>' +
        '</div></article>';
    }).join('');

    app.innerHTML =
      '<div class="wrap">' +
      '<section class="intro" aria-labelledby="t">' +
        '<p class="kick">Fiktive Hochschule · fünf Arbeitswelten</p>' +
        '<h1 id="t">Dieselbe Universität, ganz verschiedene Arbeit.</h1>' +
        '<p class="lede">Eine kleine Verwaltungsstelle, eine Forschungsgruppe, eine einzelne Forscherin, eine Kommission und ein Lehrteam. Jede Welt zeigt zuerst den Vergleich: wie sie heute arbeitet und was ein passendes M365-Arbeitsmodell ändert. Es sieht für jede Welt anders aus.</p>' +
      '</section>' +
      '<section class="glance" aria-labelledby="g"><h2 id="g" class="h-sec">Auf einen Blick</h2>' +
        '<table class="cmp"><thead><tr><th scope="col">Arbeitswelt</th><th scope="col">Grösse</th><th scope="col">Takt</th><th scope="col">Anteil Einzelarbeit</th><th scope="col">Passendes M365-Setup</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '</section>' +
      '<section class="worlds" aria-label="Die Arbeitswelten">' + worlds + '</section>' +
      '</div>';
    document.title = 'Arbeitswelten Hochschule — msteams-personas';
    setHeading(document.getElementById('t'), 'Übersicht der Arbeitswelten');
  }

  /* ---------- shared diagram pieces ---------- */
  function flowHtml(a) {
    var f = a.flow;
    var steps = function (list) {
      return '<ol class="flow">' + list.map(function (g) {
        return '<li class="fstep z-' + g.z + '"><span class="fz">' + esc(ZONE[g.z].label) + '</span><strong>' + esc(g.t) + '</strong><span class="fn">' + esc(g.n) + '</span></li>';
      }).join('') + '</ol>';
    };
    if (f.type === 'overlay') {
      return '<div class="overlay">' +
        '<div class="lane lane-base"><p class="ll">' + esc(f.base.label) + '</p><p class="bar-t">' + esc(f.base.text) + '</p></div>' +
        '<div class="lane lane-over"><p class="ll">' + esc(f.overlay.label) + '</p>' + steps(f.overlay.steps) + '</div></div>';
    }
    return steps(f.steps) + (f.loop ? '<p class="loop">' + icon('i-repeat') + 'Danach wieder von vorn: ' + esc(f.loop) + '</p>' : '');
  }

  /* ---------- scenes: illustrative "heute" and M365 vignettes (HTML, not screenshots) ---------- */
  var TYPE_ICON = { mail: 'i-mail', chat: 'i-chat', file: 'i-doc', folder: 'i-folder', local: 'i-laptop' };
  var PLACE = [['mail', 'Postfach'], ['chat', 'Chat'], ['file', 'Dateien'], ['local', 'Lokal'], ['folder', 'Ablage']];
  function who(w, id) {
    var p = w.people.filter(function (x) { return x.id === id; })[0];
    return p ? { name: personName(p.name), av: avatar(w.people.indexOf(p), p.name) }
             : { name: id, av: '<span class="av av-ext" aria-hidden="true">' + esc(id.charAt(0).toUpperCase()) + '</span>' };
  }
  function mk(n) { return n ? '<span class="mk" aria-hidden="true">' + n + '</span><span class="sr-only">Veränderung ' + n + ': </span>' : ''; }
  function key(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-'); }
  function systems(list) {
    if (!list || !list.length) return '';
    return '<p class="sc-sys"><span class="k">Bleibt ausserhalb, verlinkt</span>' + list.map(function (y) {
      return '<span class="sys">' + mk(y.mark) + icon('i-box') + esc(y.name) + '</span>';
    }).join('') + '</p>';
  }
  function fileRows(files) {
    return '<ul class="sc-files">' + files.map(function (f) {
      var dir = /\/\s*$/.test(f.name);
      return '<li>' + mk(f.mark) + icon(dir ? 'i-folder' : 'i-doc') + '<span><strong>' + esc(f.name) + '</strong><span>' + esc(f.meta) + '</span></span></li>';
    }).join('') + '</ul>';
  }

  /* Heute as a topology: people above, the places where work sits below, lines drawn by drawTopo(). */
  function sceneToday(w, a) {
    var t = a.scenes.today, ppl = [];
    t.items.forEach(function (it) { if (ppl.indexOf(it.who) < 0) ppl.push(it.who); });
    var places = PLACE.filter(function (p) { return t.items.some(function (it) { return it.type === p[0]; }); });
    return '<figure class="scene sc-today"><figcaption><span class="sc-k">Heute</span>' + esc(t.title) + '</figcaption>' +
      '<div class="sc-frame topo" data-topo>' +
        '<ul class="topo-people">' + ppl.map(function (id) {
          var p = who(w, id);
          return '<li data-p="' + key(id) + '">' + p.av + '<span>' + esc(p.name) + '</span></li>';
        }).join('') + '</ul>' +
        '<div class="topo-places" style="--n:' + places.length + '">' + places.map(function (pl) {
          return '<div class="place"><h5>' + icon(TYPE_ICON[pl[0]]) + pl[1] + '</h5><ul>' + t.items.filter(function (it) { return it.type === pl[0]; }).map(function (it) {
            var r = ROLE[it.role];
            return '<li class="titem tone-' + r.tone + '" data-from="' + key(it.who) + '" data-mark="' + (it.mark || '') + '" data-role="' + it.role + '">' + mk(it.mark) +
              '<strong>' + esc(it.title) + '</strong><span class="tm"><span class="tw">' + esc(who(w, it.who).name) + ' · </span>' + esc(it.meta) + '</span>' +
              '<span class="role">' + icon(r.icon) + esc(r.label) + '</span></li>';
          }).join('') + '</ul></div>';
        }).join('') + '</div>' +
      '</div>' +
      '<p class="topo-key" aria-hidden="true"><span class="k-ln"></span>wer womit arbeitet<span class="k-dep"></span>persönliche Abhängigkeit<span class="k-dup"></span>dasselbe doppelt</p>' +
      '</figure>';
  }
  function sceneTarget(w, a) {
    var t = a.scenes.target, m = w.scenarios[0].m365_model;
    if (t.kind === 'personal') {
      return '<figure class="scene sc-target sc-personal"><figcaption><span class="sc-k">M365-Arbeitsmodell</span>OneDrive und To Do, kein Team</figcaption>' +
        '<div class="sc-frame"><div class="sc-two">' +
          '<div><h4 class="sc-h">' + icon('i-folder') + 'OneDrive</h4>' + fileRows(t.files.slice(0, 3)) + '</div>' +
          '<div><h4 class="sc-h">' + icon('i-list') + 'To Do</h4><ul class="sc-todo">' + t.todo.slice(0, 3).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
        '</div><p class="sc-note">' + esc(t.note) + '</p>' + systems(t.systems) + '</div></figure>';
    }
    var core = people(w, a).core;
    var chans = '<ul class="sc-chans">' + m.channels.map(function (c) {
      return '<li' + (c === t.active ? ' class="on" aria-current="true"' : '') + '>' + esc(c) + '</li>';
    }).join('') + '</ul>';
    var body = t.view === 'files' ? fileRows(t.files.slice(0, 3)) : '<ul class="sc-posts">' + t.posts.slice(0, 2).map(function (q) {
      var p = who(w, q.by);
      return '<li>' + mk(q.mark) + p.av + '<div><p class="sc-meta">' + esc(p.name) + '</p><p>' + esc(q.text) + '</p>' +
        (q.file ? '<span class="chip">' + icon(/\/\s*$/.test(q.file) ? 'i-folder' : 'i-doc') + esc(q.file) + '</span>' : '') + '</div></li>';
    }).join('') + '</ul>';
    return '<figure class="scene sc-target"><figcaption><span class="sc-k">M365-Arbeitsmodell</span>Team ' + quoted(m.team) + '</figcaption>' +
      '<div class="sc-frame sc-shell">' +
        '<div class="sc-nav"><p class="sc-team">' + esc(m.team) + '</p>' +
          '<ul class="sc-members" aria-label="Mitglieder: ' + esc(core.map(function (p) { return personName(p.name); }).join(', ')) + '">' +
            core.slice(0, 5).map(function (p) { return '<li>' + avatar(w.people.indexOf(p), p.name) + '</li>'; }).join('') + '</ul>' + chans + '</div>' +
        '<div class="sc-main"><div class="sc-top"><h4 class="sc-h">' + esc(t.active) + '</h4><p class="sc-tabs">' + t.tabs.map(function (x, i) {
          return '<span' + (i === (t.view === 'files' ? 1 : 0) ? ' class="on"' : '') + '>' + esc(x) + '</span>';
        }).join('') + '</p></div>' + body + (t.note ? '<p class="sc-note">' + esc(t.note) + '</p>' : '') + systems(t.systems) + '</div>' +
      '</div></figure>';
  }
  function scenePair(w, a) {
    return '<div class="scenes">' + sceneToday(w, a) +
      '<div class="sc-arrow" aria-hidden="true"><svg class="ic"><use href="#i-arrow-b"/></svg></div>' + sceneTarget(w, a) + '</div>' +
      '<p class="sc-cap">Illustrative Szenen, fiktive Personen, kein Produktbild. Die Nummern führen zu den Veränderungen darunter.</p>';
  }

  /* Connector lines for the Heute topology. They are measured, so they only appear when the geometry is trustworthy:
     the box has class "has-lines" only after a clean draw. Without it, CSS shows each item's person as text
     ("Sophie Frei · …") and hides the line legend, so the scene still reads without any connectors. */
  var SVGNS = 'http://www.w3.org/2000/svg';
  function clearTopo(box) {
    var old = box.querySelector('svg.topo-lines');
    if (old) old.remove();
    box.classList.remove('has-lines');
  }
  function drawTopo(box) {
    clearTopo(box);
    try {
      if (!box.isConnected || getComputedStyle(box).getPropertyValue('--lines').trim() === '0') return;
      var R = box.getBoundingClientRect();
      if (!(R.width > 40 && R.height > 40)) return;
      var ok = function (r) {
        return r.width > 0 && r.height > 0 && isFinite(r.left + r.top + r.right + r.bottom) &&
          r.left >= R.left - 2 && r.right <= R.right + 2 && r.top >= R.top - 2 && r.bottom <= R.bottom + 2;
      };
      var rel = function (r) { return { l: r.left - R.left, r: r.right - R.left, t: r.top - R.top, b: r.bottom - R.top, cy: r.top - R.top + r.height / 2 }; };
      var paths = [];
      var items = [].slice.call(box.querySelectorAll('.titem'));
      for (var i = 0; i < items.length; i++) {
        var it = items[i], who_ = box.querySelector('[data-p="' + it.getAttribute('data-from') + '"]');
        if (!who_) return;
        var pr = who_.getBoundingClientRect(), ir = it.getBoundingClientRect();
        if (!ok(pr) || !ok(ir)) return;
        var P = rel(pr), B = rel(ir);
        var x1 = P.r + 6, y1 = P.cy, x2 = B.l, y2 = B.t + 14;
        if (x2 - x1 < 24) return;              /* people and places are not side by side: lines would lie */
        var dx = Math.max(24, (x2 - x1) * .5);
        paths.push(['M' + x1 + ' ' + y1 + ' C' + (x1 + dx) + ' ' + y1 + ' ' + (x2 - dx) + ' ' + y2 + ' ' + x2 + ' ' + y2,
          'ln' + (it.getAttribute('data-role') === 'dependency' ? ' ln-dep' : '')]);
      }
      /* the same thing kept twice: a dashed bracket on the right, joining the copies */
      var byMark = {};
      items.forEach(function (it) { var m = it.getAttribute('data-mark'); if (m && it.getAttribute('data-role') === 'duplicate') (byMark[m] = byMark[m] || []).push(it); });
      Object.keys(byMark).forEach(function (m) {
        var g = byMark[m].map(function (it) { return rel(it.getBoundingClientRect()); });
        if (g.length < 2) return;
        var x = Math.max.apply(null, g.map(function (r) { return r.r; })) + 18, d = '';
        g.forEach(function (r) { d += 'M' + r.r + ' ' + r.cy + ' H' + x + ' '; });
        paths.push([d + 'M' + x + ' ' + g[0].cy + ' V' + g[g.length - 1].cy, 'ln-dup']);
      });
      if (!paths.length) return;
      var svg = document.createElementNS(SVGNS, 'svg');
      svg.setAttribute('class', 'topo-lines'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
      svg.setAttribute('width', R.width); svg.setAttribute('height', R.height);
      paths.forEach(function (p) {
        var el = document.createElementNS(SVGNS, 'path');
        el.setAttribute('d', p[0]); el.setAttribute('class', p[1]); svg.appendChild(el);
      });
      box.insertBefore(svg, box.firstChild);
      box.classList.add('has-lines');
    } catch (e) {
      clearTopo(box);
    }
  }
  /* redraw on any size change of the box or of its two columns (text wrap, font swap, tab shown), batched per frame */
  var topoQueued = [];
  function queueTopo(box) {
    if (topoQueued.indexOf(box) >= 0) return;
    if (!topoQueued.length) requestAnimationFrame(function () { var q = topoQueued; topoQueued = []; q.forEach(drawTopo); });
    topoQueued.push(box);
  }
  var topoRO = window.ResizeObserver ? new ResizeObserver(function (es) {
    es.forEach(function (e) { var box = e.target.closest('[data-topo]'); if (box) queueTopo(box); });
  }) : null;
  function watchTopos() {
    app.querySelectorAll('[data-topo]').forEach(function (box) {
      if (topoRO) [box, box.querySelector('.topo-people'), box.querySelector('.topo-places')].forEach(function (el) { if (el) topoRO.observe(el); });
      queueTopo(box);
    });
  }
  function redrawAllTopos() { app.querySelectorAll('[data-topo]').forEach(queueTopo); }
  if (!topoRO) window.addEventListener('resize', redrawAllTopos);
  /* web fonts or a late system-font swap change text metrics after the first draw */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(redrawAllTopos);

  /* tiny skeleton for the atlas cards: the five setups differ before anyone reads */
  function miniFootprint(w, a) {
    var m = w.scenarios[0].m365_model;
    if (!m) return '<div class="fpm fpm-solo" aria-hidden="true"><span class="fpm-cloud">' + icon('i-folder') + '</span><span class="fpm-todo"><i></i><i></i><i></i></span><span class="fpm-no">kein Team</span></div>';
    return '<div class="fpm" aria-hidden="true"><span class="fpm-ch">' +
      m.channels.map(function (c, i) { return '<i' + (i === 0 ? ' class="on"' : '') + '></i>'; }).join('') + '</span>' +
      (m.planner_buckets.length || /Planner nur/.test(a.footprint) ? '<span class="fpm-pl"><i></i><i></i><i></i></span>' : '') + '</div>';
  }

  /* ---------- world: Vergleich (default) ---------- */
  function countLine(shifts) {
    var mv = shifts.filter(function (x) { return x.kind === 'move'; }).length, st = shifts.length - mv;
    return (mv === 1 ? '1 Veränderung' : mv + ' Veränderungen') + ', ' +
      (st === 1 ? '1 Sache, die bewusst so bleibt.' : st + ' Dinge, die bewusst so bleiben.');
  }
  function sectionC(w, a) {
    var rows = a.shifts.map(function (x, i) {
      var r = ROLE[x.role], stay = x.kind === 'stay';
      return '<li class="shift ' + (stay ? 'is-stay' : 'is-move') + '">' +
        '<span class="sn" aria-hidden="true">' + (i + 1) + '</span>' +
        '<div class="sf tone-' + r.tone + '"><p class="lbl">Heute</p><p class="s-t"><span class="sr-only">Veränderung ' + (i + 1) + '. Heute: </span>' + esc(x.from) + '</p>' +
          '<p class="role">' + icon(r.icon) + esc(r.label) + '</p></div>' +
        '<div class="sa" aria-hidden="true"><svg class="ic arr"><use href="#i-arrow-b"/></svg><span>' + (stay ? 'bleibt' : 'ändert sich') + '</span></div>' +
        '<div class="st z-' + x.zone + '"><p class="lbl">' + (stay ? 'Bleibt so' : 'M365-Arbeitsmodell') + '</p>' +
          '<p class="s-t"><span class="sr-only">' + (stay ? 'Bleibt so: ' : 'Besseres Modell: ') + '</span>' + esc(x.to) + '</p>' +
          zoneBadge(x.zone) + '</div>' +
        '</li>';
    }).join('');

    return '<section class="cmpv" aria-labelledby="cmp-h">' +
      '<div class="cmp-top"><div><p class="sec-no" aria-hidden="true">Vergleich</p><h2 id="cmp-h" class="cmp-h">Was ändert sich, was bleibt</h2>' +
        '<p class="cmp-sub">' + countLine(a.shifts) + '</p></div>' +
        '<p class="cmp-fp"><span class="k">Passendes Setup</span><strong>' + esc(a.footprint) + '</strong></p></div>' +
      scenePair(w, a) +
      '<div class="shifts-head" aria-hidden="true"><span></span><span>Heute</span><span></span><span>M365-Arbeitsmodell</span></div>' +
      '<ol class="shifts">' + rows + '</ol>' +
      '<p class="boundary"><span class="k">Grenze</span>' + esc(w.boundary) + '</p>' +
      '<p class="cmp-more no-print">Mehr dazu: <a href="' + href(w.id, 'heute') + '" data-view-link="heute">Arbeitswelt heute</a> · <a href="' + href(w.id, 'm365') + '" data-view-link="m365">M365-Arbeitsmodell</a></p>' +
      '</section>';
  }

  /* ---------- world: Arbeitswelt heute ---------- */
  function sectionA(w, a) {
    var s = w.scenarios[0], who = people(w, a), c = w.collaboration, mix = w.work_mix.individual_percent, pvs = w.personal_vs_shared;
    var temp = a.map.temporary || [];

    var peopleRow = function (p) {
      return '<li>' + avatar(w.people.indexOf(p), p.name) + '<span class="pn"><strong>' + esc(p.name) + '</strong><span>' + esc(p.role) + '</span></span></li>';
    };
    var item = function (t) { return '<li>' + esc(t) + (temp.indexOf(t) >= 0 ? ' <span class="tmp">befristet</span>' : '') + '</li>'; };
    var ring = function (cls, title, note, inner) {
      return inner ? '<div class="ring ' + cls + '"><h4>' + title + '<span>' + note + '</span></h4>' + inner + '</div>' : '';
    };
    var near = (who.outside.length ? '<ul class="people">' + who.outside.map(peopleRow).join('') + '</ul>' + (a.map.outside_label ? '<p class="note">' + esc(a.map.outside_label) + '</p>' : '') : '') +
      (c.close_internal.length ? '<ul class="plain">' + c.close_internal.map(item).join('') + '</ul>' : '');
    var ext = (who.external.length ? '<ul class="people">' + who.external.map(peopleRow).join('') + '</ul>' : '') +
      (c.external.length ? '<ul class="plain">' + c.external.map(item).join('') + '</ul>' : '');
    var peopleBlock =
      '<div class="orbit">' +
        '<div class="o-core"><h4>' + (w.size === 1 ? 'Person' : 'Kernteam') + '<span>dauerhaft</span></h4><ul class="people">' + who.core.map(peopleRow).join('') + '</ul></div>' +
        '<div class="o-rings">' +
          ring('r-near', 'Eng verbunden', 'dauerhaft', near) +
          ring('r-occ', 'Gelegentlich, intern', 'bei Bedarf', c.occasional_internal.length ? '<ul class="plain">' + c.occasional_internal.map(item).join('') + '</ul>' : '') +
          ring('r-ext', 'Extern', 'punktuell oder befristet', ext) +
        '</div></div>' +
      '<p class="legend-line">Durchgezogene Linie: dauerhaft. Gestrichelt: extern oder befristet.</p>';

    /* tool landscape: where work lives today, grouped by what the tool is doing for the team */
    var group = function (cls, title, roles) {
      var t = a.tools.filter(function (x) { return roles.indexOf(x.role) >= 0; });
      if (!t.length) return '';
      return '<div class="band ' + cls + '"><h4>' + title + '</h4><ul class="tiles">' + t.map(function (x) {
        var r = ROLE[x.role];
        return '<li class="tile tone-' + r.tone + '">' + icon('i-' + x.kind) + '<span class="tn"><strong>' + esc(x.name) + '</strong><span>' + esc(x.use) + '</span></span>' +
          '<span class="role">' + icon(r.icon) + esc(r.label) + '</span></li>';
      }).join('') + '</ul></div>';
    };
    var land =
      '<div class="land"><div class="hub">' + avatarGroup(w, a, 5) + '<span>' + esc(a.label) + '</span></div>' +
      '<div class="bands">' +
        group('b-ok', 'Hat weiter seinen Platz', ['valid']) +
        group('b-out', 'Spezialsysteme, bleiben ausserhalb', ['specialist']) +
        group('b-bad', 'Wird falsch oder doppelt genutzt', ['wrong', 'duplicate', 'dependency']) +
      '</div></div>';

    var arts = '<ul class="arts">' + w.artefacts.map(function (x) {
      return '<li><div class="an"><strong>' + esc(x.name) + '</strong><span class="st st-' + x.state + '">' + esc(STATE[x.state] || '') + '</span></div><p>' + esc(x.where_now) + '</p></li>';
    }).join('') + '</ul>';

    var moves = '<ul class="moves">' + pvs.moves_to_shared.map(function (m) {
      return '<li><strong>' + esc(m.when) + '</strong><span>' + esc(m.why) + '</span></li>';
    }).join('') + '</ul>';

    return '' +
      sec('Wer arbeitet hier', 'Kernteam, Beziehungen, dauerhaft oder befristet', peopleBlock) +
      sec('Wie die Arbeit läuft', 'Gestalt und Takt der Arbeit',
        flowHtml(a) + '<p class="life">' + esc(w.lifecycle) + '</p>' +
        '<div class="mix"><div class="meter big"><span class="bar" style="--v:' + mix + '%"></span></div><p><strong>' + mix + ' % Einzelarbeit</strong>, ' + (100 - mix) + ' % gemeinsam. Typisch: ' + esc(w.work_mix.examples.slice(0, 4).join(', ')) + '.</p></div>' +
        '<div class="scen"><h4>Szenario: ' + esc(s.name) + '</h4><p>' + esc(s.description) + '</p><p class="stakes">' + esc(s.stakes) + '</p>' +
        more('Phasen des Szenarios', '<ol class="stages">' + s.stages.map(function (g) { return '<li><strong>' + esc(g.stage) + '</strong><span>' + esc(g.question) + '</span></li>'; }).join('') + '</ol>') + '</div>') +
      sec('Wo die Arbeit heute lebt', 'Werkzeuge und Informationen', land +
        more('Dokumente und Unterlagen im Detail (' + w.artefacts.length + ')', arts, 'arts-more')) +
      sec('Was schwierig ist', 'Charakteristische Reibung',
        '<ul class="frictions">' + s.current_state.frictions.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
        '<p class="tens"><span class="k">Kernspannung</span> ' + esc(w.tension) + '</p>') +
      sec('Persönlich oder gemeinsam', 'Was bei wem liegt',
        '<div class="two"><div><h4>Bleibt persönlich</h4>' + list(pvs.stays_personal) + '</div><div><h4>Ist gemeinsam</h4>' + list(pvs.shared) + '</div></div>' +
        more('Wann etwas von persönlich zu gemeinsam wechselt', moves));
  }

  /* ---------- world: M365-Arbeitsmodell ---------- */
  function sectionB(w, a) {
    var s = w.scenarios[0], m = s.m365_model, pvs = w.personal_vs_shared;
    var setup = m
      ? '<p class="fp-big">' + esc(a.footprint) + '</p><p class="setup-lead">Team ' + quoted(m.team) + '' + (m.channels.length ? ', Kanäle: ' + esc(m.channels.join(', ')) : '') + '.</p><p>' + esc(m.notes.replace(/\s*\([a-z]+(-[a-z0-9]+)+\)/g, '')) + '</p>'
      : '<p class="fp-big">' + esc(a.footprint) + '</p><p>Kein Team, kein Kanal. Persönliche Arbeit bleibt persönlich, gemeinsame Arbeit entsteht erst, wenn jemand mitschreibt.</p>';

    var zoneList = [
      ['personal', pvs.stays_personal],
      ['shared', pvs.shared],
      ['institutional', a.zones.institutional],
      ['outside', a.zones.outside]
    ].filter(function (z) { return z[1].length; });
    var track = '<ol class="track" style="--n:' + zoneList.length + '" aria-label="Persönlich, gemeinsam, institutionell, Spezialsysteme">' + zoneList.map(function (z) {
      var Z = ZONE[z[0]];
      return '<li class="zone z-' + z[0] + '"><h4>' + icon(Z.icon) + esc(Z.label) + '</h4><p class="zs">' + esc(Z.where) + '</p>' + list(z[1]) + '</li>';
    }).join('') + '</ol>' +
    '<p class="legend-line">' + (a.zones.outside.length ? 'Nicht alles gehört nach Teams: Institutionelles und Spezialsysteme behalten ihren eigenen Ort.' : 'Hier gibt es keine Spezialsysteme. Die Frage ist nur, was persönlich bleibt und was gemeinsam wird.') + '</p>';

    var cats = CATS.map(function (c) {
      var x = a.model[c[0]];
      var cell = function (k, v, cls) {
        return '<div class="cell ' + cls + '"><h5>' + k + '</h5>' + (v ? '<p>' + esc(v) + '</p>' : '<p class="none"><span aria-hidden="true">—</span><span class="sr-only">nichts</span></p>') + '</div>';
      };
      return '<article class="cat"><h4>' + c[1] + '</h4><div class="cells">' +
        cell('Ändert sich', x.change, 'c-chg') + cell('Bleibt', x.stay, 'c-stay') + cell('M365 trägt', x.m365, 'c-m365') + cell('Bleibt ausserhalb', x.outside, 'c-out') +
        '</div></article>';
    }).join('');

    var dps = s.decision_points.filter(function (d) { return a.picks.indexOf(d.id) >= 0; });
    var picks = '<ul class="picks">' + dps.map(function (d) {
      return '<li><h4>' + esc(d.question) + '</h4><p class="pick"><span class="k">Unsere Wahl</span> <strong>' + esc(d.pick.label) + '</strong></p><p>' + esc(stripPrefix(d.pick.why)) + '</p></li>';
    }).join('') + '</ul>';

    var mods = D.modules.map(function (mod) {
      var th = w.training_hooks[mod.id];
      return '<li><strong>' + mod.nr + '. ' + esc(mod.title) + '</strong><span>' + esc(th ? th.prompt : '') + '</span></li>';
    }).join('');

    return '' +
      sec('Das passende Setup', 'Kein Standard, sondern eine Empfehlung für diesen Kontext', setup + sceneTarget(w, a)) +
      sec('Wo wohnt was', 'Persönlich, gemeinsam, institutionell, ausserhalb', track, 'wide') +
      sec('Nach Arbeitsmuster', 'Was sich ändert, was bleibt, was ausserhalb liegt', '<div class="cats">' + cats + '</div>', 'wide') +
      sec('Unsere Wahl für diesen Kontext', 'Entscheide, die sich aus dieser Arbeitswelt ergeben', picks) +
      sec('Grenzen', 'Was M365 hier nicht tun soll',
        '<p class="boundary">' + esc(w.boundary) + '</p>' +
        '<h4 class="sub-h">Nicht so</h4><ul class="anti">' + a.anti.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>') +
      '<details class="more mods no-print"><summary>Wo diese Welt in den Deep Dives vorkommt</summary><div class="more-b"><ul>' + mods + '</ul></div></details>';
  }

  function sec(title, sub, body, cls) {
    return '<section class="sec ' + (cls || '') + '"><header class="sec-h"><h3>' + esc(title) + '</h3><p>' + esc(sub) + '</p></header><div class="sec-b">' + body + '</div></section>';
  }

  /* ---------- world page ---------- */
  function renderWorld(id, view) {
    var w = worldById(id);
    if (!w) return renderAtlas();
    var a = A[w.id];
    if (VIEWS.indexOf(view) < 0) view = DEFAULT_VIEW;

    var tabs = VIEWS.map(function (v) {
      return '<button type="button" role="tab" id="tab-' + v + '" class="tab" aria-selected="' + (v === view) + '" aria-controls="panel-' + v + '" tabindex="' + (v === view ? 0 : -1) + '" data-view="' + v + '">' + VIEW_LABEL[v] + '</button>';
    }).join('');

    var others = D.worlds.filter(function (x) { return x.id !== w.id; }).map(function (x) {
      return '<li><a href="' + href(x.id, view) + '"><span class="ol">' + esc(A[x.id].label) + '</span><span class="on">' + esc(x.name) + '</span><span class="of">' + esc(A[x.id].footprint) + '</span></a></li>';
    }).join('');

    var panel = function (v, cls, inner) {
      return '<div role="tabpanel" id="panel-' + v + '" class="panel ' + cls + '" aria-labelledby="tab-' + v + '" tabindex="0"' + (v === view ? '' : ' hidden') + '>' + inner + '</div>';
    };

    app.innerHTML =
      '<div class="wrap world-page" data-pattern="' + a.pattern + '">' +
      '<nav class="crumbs no-print" aria-label="Brotkrumen"><a href="#/">Alle Arbeitswelten</a><span aria-hidden="true">/</span><span aria-current="page">' + esc(a.label) + '</span></nav>' +
      '<header class="hero">' +
        '<div class="hero-text"><p class="kick">' + esc(a.label) + ' · ' + esc(sizeLabel(w)) + '</p>' +
        '<h1 id="t" tabindex="-1">' + esc(w.name) + '</h1>' +
        '<p class="lede">' + esc(w.tagline) + '</p>' +
        '<blockquote class="tension"><p>' + esc(w.tension) + '</p></blockquote></div>' +
        '<div class="hero-side">' + glyph(a.pattern) +
          '<dl class="facts"><div><dt>Form</dt><dd>' + esc(a.shape) + '</dd></div><div><dt>Takt</dt><dd>' + esc(PATTERN[a.pattern]) + '</dd></div><div><dt>Einzelarbeit</dt><dd>' + w.work_mix.individual_percent + ' %</dd></div></dl>' +
        '</div>' +
      '</header>' +
      '<div class="switch no-print"><div class="switch-in">' +
        '<div class="tabs" role="tablist" aria-label="Ansicht wählen">' + tabs + '</div>' +
        '<button type="button" class="print" id="print">' + icon('i-print') + 'Drucken</button>' +
      '</div></div>' +
      '<div class="panels">' +
        panel('vergleich', 'panel-c', sectionC(w, a)) +
        panel('heute', 'panel-a', '<p class="side-tag">Arbeitswelt heute</p>' + sectionA(w, a)) +
        panel('m365', 'panel-b', '<p class="side-tag">M365-Arbeitsmodell</p>' + sectionB(w, a)) +
      '</div>' +
      '<nav class="others no-print" aria-labelledby="oh"><h2 id="oh" class="h-sec">Andere Arbeitswelten</h2><ul>' + others + '</ul></nav>' +
      '</div>';

    document.title = w.name + ' — Arbeitswelten Hochschule';
    setHeading(document.getElementById('t'), w.name);
    wireTabs();
    watchTopos();
  }

  function wireTabs() {
    var tabs = [].slice.call(app.querySelectorAll('[role=tab]'));
    var print = document.getElementById('print');
    if (print) print.addEventListener('click', function () { window.print(); });
    function select(t, focus) {
      var v = t.getAttribute('data-view');
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', on);
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) t.focus();
      var id = location.hash.split('/')[2];
      history.replaceState(null, '', href(id, v));
      live.textContent = VIEW_LABEL[v] + ' angezeigt';
      app.querySelectorAll('.others a').forEach(function (l, i) {
        l.setAttribute('href', href(l.getAttribute('href').split('/')[2], v));
      });
      var bar = app.querySelector('.switch');
      if (bar && bar.getBoundingClientRect().top <= 0) bar.scrollIntoView({ block: 'start' });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t, false); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') n = tabs[0];
        else if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
    app.querySelectorAll('[data-view-link]').forEach(function (l) {
      l.addEventListener('click', function (e) {
        e.preventDefault();
        select(document.getElementById('tab-' + l.getAttribute('data-view-link')), true);
      });
    });
  }

  /* ---------- routing / focus ---------- */
  var firstRender = true;
  function setHeading(h, announce) {
    live.textContent = announce;
    if (h && !firstRender) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  }
  function route() {
    var p = location.hash.replace(/^#\/?/, '').split('/');
    if (p[0] === 'w' && p[1]) renderWorld(p[1], p[2] || DEFAULT_VIEW);
    else renderAtlas();
    firstRender = false;
  }

  /* collapsed <details> would print empty: open them for the printout, restore afterwards */
  var wasOpen = [];
  window.addEventListener('beforeprint', function () {
    wasOpen = [];
    document.querySelectorAll('details').forEach(function (d) { wasOpen.push([d, d.open]); d.open = true; });
  });
  window.addEventListener('afterprint', function () { wasOpen.forEach(function (x) { x[0].open = x[1]; }); });

  window.addEventListener('hashchange', route);
  route();
})();
