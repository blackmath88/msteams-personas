/*
 * Renderers for Szene and Prinzip. Pure functions: (viewModel, options) -> HTML string.
 * Options: { annot: bool, stage: bool, tab: 'posts'|'files'|'tasks' }.
 */
(function (root) {
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function initials(n) {
    var parts = String(n).replace(/^((Prof|Dr)\.\s*)+/, '').trim().split(/\s+/).filter(function (w) { return /^[A-Za-zÄÖÜäöü«]/.test(w); });
    parts = parts.map(function (w) { return w.replace(/^«/, ''); });
    if (!parts.length) parts = ['?'];
    return ((parts[0] || '?')[0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  }
  function hue(id) { var h = 0; for (var i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 6; return h; }
  function av(p, size) {
    return '<span class="av av-' + (typeof p.idx === 'number' ? p.idx % 6 : hue(p.id)) + (size ? ' av-' + size : '') + '" aria-hidden="true">' + esc(initials(p.name)) + '</span>';
  }
  function short(n) { return String(n).replace(/^((Prof|Dr)\.\s*)+/, '').trim(); }
  function mark(n, on) { return n && on ? '<span class="mk" aria-label="Hinweis ' + n + '">' + n + '</span>' : ''; }
  var FILE_IC = { table: 'i-table', doc: 'i-doc', folder: 'i-folder' };
  function ic(id) { return '<svg class="ic" aria-hidden="true"><use href="#' + id + '"/></svg>'; }

  /* ---------------- Szene ---------------- */

  function scene(vm, o) {
    o = o || {};
    var sc = vm.scene;
    if (sc.personal) return personalScene(vm, o);
    var tab = o.tab || 'posts';
    var tabs = [['posts', 'Beiträge', sc.posts.length], ['files', 'Dateien', sc.files.length], ['tasks', 'Aufgaben', sc.tasks.length]]
      .filter(function (t) { return t[2] > 0; });
    if (!tabs.some(function (t) { return t[0] === tab; })) tab = tabs[0][0];
    var body = tab === 'files' ? files(vm, o) : tab === 'tasks' ? tasks(vm, o) : posts(vm, o);
    var members = sc.members.map(vm.person);
    var notes = o.annot ? notesList(vm, tab) : '';
    return '<figure class="tw' + (o.stage ? ' tw-stage' : '') + (o.annot ? ' annot' : '') + '" aria-label="Szene: ' + esc(vm.team) + ', Kanal ' + esc(sc.active) + '">' +
      '<div class="tw-bar"><span class="tw-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="tw-app">Zusammenarbeit</span><span class="tw-label">Fiktives Beispiel · vereinfachte, Teams-ähnliche Darstellung</span></div>' +
      '<div class="tw-body">' +
        '<div class="tw-side">' +
          '<p class="tw-team"><span class="tw-tile" aria-hidden="true">' + esc(initials(vm.team)) + '</span><span><strong data-bind="team">' + esc(vm.team) + '</strong><small>' + esc(sc.teamNote || '') + '</small></span></p>' +
          '<p class="tw-k">Kanäle</p><ul class="tw-chans">' + sc.channels.map(function (c) {
            return c === sc.active ? '<li class="on" aria-current="true"># ' + esc(c) + '</li>' : '<li class="off" title="In diesem Beispiel nicht ausgearbeitet"># ' + esc(c) + '</li>';
          }).join('') + '</ul>' +
          '<p class="tw-k">Mitglieder · ' + members.length + '</p><ul class="tw-mem">' + members.map(function (p) {
            return '<li>' + av(p, 's') + '<span>' + esc(short(p.name)) + (p.external ? ' <em>extern</em>' : p.outside ? ' <em>andere Einheit</em>' : '') + '</span></li>';
          }).join('') + '</ul>' +
        '</div>' +
        '<div class="tw-main">' +
          '<div class="tw-head"><h3># ' + esc(sc.active) + '</h3>' +
            '<div class="tw-tabs" role="tablist" aria-label="Ansicht im Kanal">' + tabs.map(function (t) {
              return '<button type="button" role="tab" data-tab="' + t[0] + '" aria-selected="' + (t[0] === tab) + '"' + (t[0] === tab ? '' : ' tabindex="-1"') + '>' + t[1] + '</button>';
            }).join('') + '</div></div>' +
          '<div class="tw-content" role="tabpanel">' + body + '</div>' +
          (sc.outside && sc.outside.length ? '<p class="tw-outside">' + ic('i-box') + '<span><strong>Bleibt ausserhalb:</strong> ' + sc.outside.map(esc).join(' · ') + '</span></p>' : '') +
          (vm.variant && vm.variant.assumption ? '<p class="tw-assume">' + ic('i-alert') + '<span><strong>Annahme:</strong> ' + esc(vm.fill(vm.variant.assumption)) + '</span></p>' : '') +
        '</div>' +
        notes +
      '</div></figure>';
  }

  function notesList(vm, tab) {
    var sc = vm.scene, items = tab === 'files' ? sc.files : tab === 'tasks' ? sc.tasks : sc.posts;
    var marks = [];
    items.forEach(function (x) { if (x.mark && marks.indexOf(x.mark) < 0 && sc.notes[x.mark]) marks.push(x.mark); });
    if (!marks.length) return '';
    return '<aside class="tw-notes" aria-label="Lesehinweise"><p class="tw-k">Was hier anders ist</p><ol>' + marks.map(function (m) {
      return '<li><span class="mk" aria-hidden="true">' + m + '</span><span>' + esc(vm.fill(sc.notes[m])) + '</span></li>';
    }).join('') + '</ol></aside>';
  }

  function posts(vm, o) {
    var list = vm.scene.posts, max = o.stage ? 2 : list.length;
    return '<ol class="tw-posts">' + list.slice(0, max).map(function (q) {
      var p = vm.person(q.by), reps = q.replies || [], rmax = o.stage ? 1 : reps.length;
      return '<li class="tw-post">' + mark(q.mark, o.annot) +
        '<div class="tw-ph">' + av(p) + '<p><strong>' + esc(short(p.name)) + '</strong><time>' + esc(q.time) + '</time></p></div>' +
        (q.title ? '<p class="tw-pt">' + esc(vm.fill(q.title)) + '</p>' : '') +
        '<p class="tw-tx">' + esc(vm.fill(q.text)) + '</p>' +
        (q.file ? '<p class="tw-file">' + ic(/xlsx$/.test(q.file) ? 'i-table' : /\/$/.test(q.file) ? 'i-folder' : 'i-doc') + esc(q.file) + '</p>' : '') +
        (reps.length ? '<ol class="tw-replies">' + reps.slice(0, rmax).map(function (r) {
          var rp = vm.person(r.by);
          return '<li>' + av(rp, 's') + '<p><strong>' + esc(short(rp.name)) + '</strong> <time>' + esc(r.time) + '</time><br>' + esc(vm.fill(r.text)) + '</p></li>';
        }).join('') + (reps.length > rmax ? '<li class="more">+ ' + (reps.length - rmax) + (reps.length - rmax === 1 ? ' weitere Antwort' : ' weitere Antworten') + '</li>' : '') + '</ol>' : '') +
        '</li>';
    }).join('') + (list.length > max ? '<li class="more">+ ' + (list.length - max) + (list.length - max === 1 ? ' weiterer Beitrag' : ' weitere Beiträge') + '</li>' : '') + '</ol>';
  }

  function files(vm, o) {
    return '<table class="tw-files"><thead><tr><th scope="col">Name</th>' + (o.personal ? '' : '<th scope="col">Geändert</th>') + '<th scope="col">' + (o.personal ? 'Freigabe' : 'Hinweis') + '</th></tr></thead><tbody>' +
      vm.scene.files.map(function (f) {
        var p = f.by ? vm.person(f.by) : null;
        return '<tr><td><span class="fn">' + mark(f.mark, o.annot) + ic(FILE_IC[f.kind] || 'i-doc') + '<span>' + esc(f.name) + '</span></span></td>' +
          (o.personal ? '' : '<td>' + (p ? esc(short(p.name)) + (f.when ? ', ' + esc(f.when) : '') : '–') + '</td>') + '<td>' + esc(vm.fill(f.note)) + '</td></tr>';
      }).join('') + '</tbody></table>';
  }

  function tasks(vm, o) {
    return '<ul class="tw-tasks">' + vm.scene.tasks.map(function (t) {
      var p = vm.person(t.owner);
      return '<li class="' + (t.done ? 'done' : '') + '">' + mark(t.mark, o.annot) +
        '<span class="tw-chk" aria-hidden="true">' + (t.done ? '✓' : '') + '</span>' +
        '<span class="tw-tt"><strong>' + esc(t.title) + '</strong><small>' + esc(t.bucket) + '</small></span>' +
        '<span class="tw-own">' + av(p, 's') + esc(short(p.name)) + '</span>' +
        '<span class="tw-due">' + (t.done ? 'erledigt' : esc(t.due)) + '</span>' +
        '<span class="sr-only">' + (t.done ? 'Erledigt' : 'Offen') + '</span></li>';
    }).join('') + '</ul>';
  }

  function personalScene(vm, o) {
    var sc = vm.scene, me = vm.person(sc.members[0]);
    return '<figure class="tw tw-personal' + (o.stage ? ' tw-stage' : '') + (o.annot ? ' annot' : '') + '" aria-label="Szene: persönliche Ablage von ' + esc(me.name) + '">' +
      '<div class="tw-bar"><span class="tw-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="tw-app">Persönliche Ablage</span><span class="tw-label">Fiktives Beispiel · kein Team</span></div>' +
      '<div class="tw-body tw-pbody">' +
        '<div class="tw-main"><div class="tw-head"><h3>' + av(me, 's') + ' Meine Dateien</h3></div><div class="tw-content">' + files(vm, { annot: o.annot, personal: true }) + '</div></div>' +
        '<div class="tw-main tw-todo"><div class="tw-head"><h3>' + ic('i-list') + ' To Do</h3></div><ul class="tw-tasks">' + sc.tasks.map(function (t) {
          return '<li><span class="tw-chk" aria-hidden="true"></span><span class="tw-tt"><strong>' + esc(t.title) + '</strong></span></li>';
        }).join('') + '</ul><p class="tw-pnote">' + esc(sc.teamNote) + '</p></div>' +
        (o.annot ? notesList(vm, 'files') : '') +
      '</div>' +
      (sc.outside.length ? '<p class="tw-outside">' + ic('i-box') + '<span><strong>Bleibt ausserhalb:</strong> ' + sc.outside.map(esc).join(' · ') + '</span></p>' : '') +
      '</figure>';
  }

  /* ---------------- Prinzip ---------------- */

  function chip(p, extra) { return '<li class="pp' + (extra ? ' ' + extra : '') + '">' + av(p) + '<span>' + esc(short(p.name)) + '</span></li>'; }
  function placeholder(label) { return '<li class="pp pp-ghost"><span class="av av-ghost" aria-hidden="true">?</span><span>' + esc(label) + '</span></li>'; }

  function panel(kind, label, title, inner) {
    return '<section class="pd-panel pd-' + kind + '"><p class="pd-tag">' + esc(label) + '</p><h4>' + esc(title) + '</h4>' + inner + '</section>';
  }
  function link(text, broken) {
    return '<div class="pd-link' + (broken ? ' broken' : '') + '"><span>' + esc(text) + '</span></div>';
  }

  function diagramChat(vm, b, o) {
    var inChat = b.inChat.map(vm.person), later = b.later.map(vm.person);
    var laterHtml = later.length ? later.map(function (p) { return chip(p); }).join('') : placeholder(b.laterLabel || 'wer später dazukommt');
    var left = '<div class="pd-box pd-chatbox"><p class="pd-boxh">' + ic('i-chat') + 'Chat zu zweit</p><ul class="pd-people">' + inChat.map(function (p) { return chip(p); }).join('') + '</ul>' +
      '<p class="pd-bubble">«' + esc(vm.fill(b.decision)) + '»</p></div>' +
      link('sieht den Entscheid nicht', true) + '<ul class="pd-people pd-out">' + laterHtml + '</ul>';
    var all = inChat.concat(later);
    var placeName = vm.scene.personal ? 'Im Dokument' : '# ' + vm.scene.active;
    var right = '<div class="pd-box pd-chanbox"><p class="pd-boxh">' + (vm.scene.personal ? ic('i-doc') : ic('i-people')) + esc(placeName) + '</p>' +
      '<p class="pd-post"><strong>' + esc(vm.fill(b.decision)) + '</strong><small>von ' + esc(short(inChat[0].name)) + ', mit Antworten darunter</small></p></div>' +
      link('finden es später', false) + '<ul class="pd-people">' + (all.length > 1 ? all : all.concat([])).map(function (p) { return chip(p); }).join('') + (b.laterLabel ? placeholder(b.laterLabel) : '') + '</ul>';
    return panel('before', 'Heute', 'Entscheid im Chat', left) + arrow() + panel('after', 'Für diese Situation', vm.scene.personal ? 'Dort, wo alle Beteiligten schon sind' : 'Entscheid als Kanalbeitrag', right);
  }

  function diagramDoc(vm, b) {
    var eds = b.editors.map(vm.person), dr = vm.person(b.drafter);
    var origin = vm.person(b.origin || b.editors[0]);
    var holders = eds.map(function (p) { return short(p.name); }).concat(b.editorsLabel ? [b.editorsLabel] : []);
    /* A copy may name its holder ({n, by}); by is a person id or a label. */
    var holderOf = function (c, i) { return c.by ? (vm.people.some(function (p) { return p.id === c.by; }) ? short(vm.person(c.by).name) : c.by) : holders[i % holders.length]; };
    var left = '<ol class="pd-copies">' + b.copies.map(function (c, i) {
      c = typeof c === 'string' ? { n: c } : c;
      return '<li>' + ic('i-doc') + '<span><strong>' + esc(c.n) + '</strong><small>bei ' + esc(holderOf(c, i)) + '</small></span></li>';
    }).join('') + '</ol>' + '<p class="pd-q">Welche Fassung gilt?</p>';
    var right = '<div class="pd-box pd-onedoc"><p class="pd-boxh">' + ic('i-doc') + esc(vm.fill(b.artefact)) + '</p><p class="pd-small">eine Datei, Link statt Anhang</p></div>' +
      link('bearbeiten und kommentieren am selben Ort', false) + '<ul class="pd-people">' + eds.map(function (p) { return chip(p); }).join('') + (b.editorsLabel ? placeholder(b.editorsLabel) : '') + '</ul>';
    var art = esc(vm.fill(b.artefact));
    return panel('before', 'Heute', 'Kopien im Anhang', left) + arrow() + panel('after', 'Für diese Situation', 'Ein gemeinsames Dokument', right) +
      '<div class="pd-bottom"><div class="pd-life" aria-label="Weg von «' + art + '» vom Entwurf zum gemeinsamen Dokument">' +
        '<p class="pd-life-h">Weg dieses Dokuments</p>' +
        '<div class="pd-stage"><p class="pd-tag">Persönlich</p><p><strong data-doc>' + art + '</strong><small>Entwurf bei ' + esc(short(origin.name)) + '</small></p></div>' +
        '<div class="pd-arrow-l"><span>teilen, sobald andere mitarbeiten</span></div>' +
        '<div class="pd-stage pd-stage-on"><p class="pd-tag">Gemeinsam</p><p><strong data-doc>' + art + '</strong><small>eine Fassung für alle</small></p></div>' +
      '</div>' +
      '<div class="pd-keepdoc" aria-label="Anderes Beispiel: bleibt persönlich"><p class="pd-tag">Anderes Beispiel · bleibt persönlich</p><p><strong>' + esc(vm.fill(b.draft)) + '</strong><small>bei ' + esc(short(dr.name)) + ', wird nicht geteilt, solange niemand mitarbeitet</small></p></div></div>';
  }

  function diagramTasks(vm, b) {
    var lists = b.personal.map(function (x) {
      var p = vm.person(x.who);
      return '<li class="pd-list">' + '<p class="pd-boxh">' + av(p, 's') + 'Liste von ' + esc(short(p.name)) + '</p><ul>' + x.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') +
        (b.shared[0] && b.shared[0].who === x.who ? '<li>' + esc(b.shared[0].t) + '</li>' : '') + '</ul><p class="pd-small">nur für diese Person sichtbar</p></li>';
    }).join('');
    var left = '<ul class="pd-lists">' + lists + '</ul><p class="pd-q">Wer erledigt was bis wann?</p>';
    var right = b.shared.length ? '<div class="pd-box pd-plan"><p class="pd-boxh">' + ic('i-list') + esc(b.sharedLabel || 'Gemeinsamer Plan') + '</p><ul class="pd-rows">' + b.shared.map(function (t) {
      var own = t.who ? av(vm.person(t.who), 's') + esc(short(vm.person(t.who).name)) : '<span class="av av-s av-ghost" aria-hidden="true">?</span>' + esc(t.whoLabel);
      return '<li><span>' + esc(t.t) + '</span><span class="pd-own">' + own + '</span>' + (t.due ? '<span class="pd-due">' + esc(t.due) + '</span>' : '') + '</li>';
    }).join('') + '</ul></div>' + link('für alle Beteiligten sichtbar', false) :
      '<div class="pd-box pd-plan"><p class="pd-boxh">' + ic('i-list') + 'Kein eigener Aufgabenplan</p><p class="pd-lean">' + esc(vm.fill(b.lean || b.recommend)) + '</p></div>';
    right += '<p class="pd-keep">' + ic('i-person') + 'Persönliche To-dos bleiben in der eigenen Liste</p>';
    return panel('before', 'Heute', 'Verpflichtungen in persönlichen Listen', left) + arrow() + panel('after', 'Für diese Situation', b.shared.length ? 'Gemeinsame Verantwortung sichtbar' : 'Bewusst schlank', right);
  }

  function arrow() { return '<div class="pd-arrow" aria-hidden="true"><svg viewBox="0 0 40 24"><path d="M2 12h32m-9-8 9 8-9 8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>'; }

  var DIAG = { chat: diagramChat, doc: diagramDoc, tasks: diagramTasks };

  function principle(vm, pid, meta, o) {
    o = o || {};
    var b = vm.principles[pid];
    var alt = vm.variants.filter(function (v) { return vm.variant && v.id !== vm.variant.id; })[0];
    return '<article class="pr' + (o.stage ? ' pr-stage' : '') + (o.annot ? ' annot' : '') + '" aria-label="Prinzip: ' + esc(meta.title) + '">' +
      '<header class="pr-h"><p class="pr-k">Prinzip · ' + esc(vm.team) + '</p><h3>' + esc(meta.title) + '</h3><p class="pr-q">' + esc(meta.question) + '</p></header>' +
      (o.annot ? '<p class="pr-problem"><strong>Situation:</strong> ' + esc(vm.fill(b.problem)) + '</p>' : '') +
      '<div class="pd">' + DIAG[pid](vm, b, o) + '</div>' +
      '<div class="pr-foot">' +
        '<p class="pr-rec"><strong>Empfehlung hier</strong>' + esc(vm.fill(b.recommend)) + '</p>' +
        /* Qualifications stay visible with Hinweise off; only decorative annotation is toggled. */
        '<p class="pr-bound"><strong>Grenze</strong>' + esc(vm.fill(b.boundary)) + '</p>' +
        (alt ? '<p class="pr-alt"><strong>Alternative</strong>' + esc(alt.label) + (o.stage ? '' : ': ' + esc(vm.fill(alt.why))) + '</p>' : '') +
        (vm.variant && vm.variant.assumption ? '<p class="pr-assume"><strong>Annahme</strong>' + esc(vm.fill(vm.variant.assumption)) + '</p>' : '') +
      '</div></article>';
  }

  root.Views = { scene: scene, principle: principle, esc: esc, av: av, short: short, ic: ic, initials: initials };
})(window);
