/*
 * Further M365 renderers: Teams chat, Planner board, To Do, OneDrive (work/school) and a
 * Teams meeting recap with simulated AI suggestions. Same 1440 x 810 viewport and helpers
 * as src/m365.js; content comes only from the shared view model.
 *
 * Profiles (docs/REFERENCE-PROFILES.md):
 *   Teams chat – new Teams desktop, Chat selected in the rail, 1:1 chat
 *   Planner    – Planner (web / new Planner), plan in «Board» view grouped by bucket
 *   To Do      – Microsoft To Do (web), «Mein Tag» with personal tasks and «Zugewiesen an mich»
 *   OneDrive   – OneDrive for work or school (web), «Meine Dateien», list view with «Freigabe»
 *   Recap      – Teams meeting chat, «Zusammenfassung» tab; AI content is a labelled simulation
 */
(function (root) {
  var A = root.M365, V = root.Views, esc = V.esc, short = V.short;
  var fi = A.fi, avatar = A.avatar, ftype = A.ftype, frame = A.frame, mk = A.mk;
  var first = function (n) { return short(n).split(' ')[0]; };
  var LABELS = ['#c4314b', '#ca5010', '#0f7b6c', '#5b5fc7', '#8764b8', '#498205'];

  /* ================= Teams chat ================= */
  function chat(vm, o) {
    o = o || {};
    var c = vm.chat, me = vm.person(c.viewer), other = vm.person(c.partner);
    var list = [[other, c.messages[c.messages.length - 1].text, c.messages[c.messages.length - 1].time, true]].concat(c.others.map(function (x, i) {
      return [vm.person(x[0]), x[1], ['Gestern', 'Mo', 'Fr'][i] || 'Do', false];
    }));
    return frame('m3-teams m3-chat', 'Microsoft Teams, nachgebildet: Chat zwischen ' + me.name + ' und ' + other.name,
      A.teamsChrome(me, 'chat') +
      '<aside class="t-list"><div class="t-lh"><strong>Chat</strong><span>' + fi('filter') + fi('more') + fi('edit') + '</span></div>' +
        '<p class="t-sec">' + fi('chevd') + 'Chats</p><ul class="c-list">' + list.map(function (x) {
          return '<li class="' + (x[3] ? 'on' : '') + '">' + avatar(x[0], 32) + '<span><b>' + esc(short(x[0].name)) + '<time>' + esc(x[2]) + '</time></b><small>' + esc(x[1]) + '</small></span></li>';
        }).join('') + '</ul>' +
        '<p class="t-sec">' + fi('chevd') + 'Teams und Kanäle</p><div class="t-team"><span class="t-tile t-tile-' + (vm.world.id.length % 5) + '">' + esc(V.initials(vm.team)) + '</span><span><strong>' + esc(vm.team) + '</strong></span></div>' +
      '</aside>' +
      '<section class="t-main c-main"><header class="c-head">' + avatar(other, 32) + '<p><strong>' + esc(short(other.name)) + '</strong></p>' +
          '<div class="t-tabs c-tabs"><span class="on">Chat</span><span>Freigegeben</span>' + fi('plus') + '</div>' +
          '<span class="c-ha">' + fi('video') + fi('calls') + fi('people') + fi('more') + '</span></header>' +
        '<div class="c-body"><ol class="c-msgs">' + c.messages.map(function (m) {
          var p = vm.person(m.by), mine = m.by === c.viewer;
          return '<li class="c-msg' + (mine ? ' me' : '') + (m.decision ? ' dec' : '') + '">' + (mine ? '' : avatar(p, 32)) +
            '<div class="c-bub">' + mk(m.mark, o.annot) + (mine ? '<time>' + esc(m.time) + '</time>' : '<p class="c-meta"><b>' + esc(short(p.name)) + '</b><time>' + esc(m.time) + '</time></p>') +
            '<p>' + esc(m.text) + '</p></div></li>';
        }).join('') + '</ol>' +
        '<div class="c-compose"><span>Nachricht eingeben</span><span class="c-ci">' + fi('smile') + fi('attach') + fi('plus') + '<i class="c-send">' + fi('send') + '</i></span></div></div>' +
      '</section>');
  }
  function chatNotes(vm) {
    var c = vm.chat, later = c.later.map(function (id) { return first(vm.person(id).name); });
    var who = later.length ? later.join(', ') : '';
    return [[1, 'Der Entscheid fällt zu zweit im Chat. ' + (who ? who + (c.laterLabel ? ' und ' + c.laterLabel : '') : (c.laterLabel || 'Weitere Beteiligte')) + ' sehen ihn hier nicht.']];
  }

  /* ================= Planner board ================= */
  function plannerTasks(vm) {
    var tasks = vm.scene.tasks.slice();
    /* Reviewed AI suggestions lead the board: they are the point of the AI sequence. */
    if (vm.ai) vm.ai.suggestions.slice().reverse().forEach(function (s) {
      if (s.status === 'rejected') return;
      tasks.unshift({ title: s.status === 'edited' ? s.edited : s.text, owner: s.owner, due: s.due, bucket: 'Aus Projektsitzung', done: false, fromAi: true, mark: s.status === 'edited' ? 2 : 1 });
    });
    return tasks;
  }
  function planner(vm, o) {
    o = o || {};
    var tasks = plannerTasks(vm), buckets = [];
    if (!vm.ai && !tasks.some(function (t) { return t.mark && !t.done; })) {
      var f = tasks.filter(function (t) { return !t.done; })[0];
      if (f) tasks[tasks.indexOf(f)] = Object.assign({}, f, { mark: 1 });
    }
    tasks.forEach(function (t) { if (buckets.indexOf(t.bucket) < 0) buckets.push(t.bucket); });
    var me = vm.person(vm.todo ? vm.todo.viewer : vm.scene.members[0]);
    var open = tasks.filter(function (t) { return !t.done; }).length;
    return frame('m3-planner', 'Planner, nachgebildet: Plan ' + vm.team + ' in der Board-Ansicht',
      '<div class="p-top">' + fi('waffle', 'p-waf') + '<strong>Planner</strong><span class="p-search">' + fi('search') + '<span>Suchen</span></span><span class="p-tr">' + fi('gear') + avatar(me, 30) + '</span></div>' +
      '<nav class="p-nav"><ul><li>' + fi('sun') + 'Mein Tag</li><li>' + fi('listcheck') + 'Meine Aufgaben</li><li>' + fi('board') + 'Meine Pläne</li></ul><p class="p-k">Angeheftet</p><ul><li class="on"><span class="p-ic p-ic-' + (vm.world.id.length % 5) + '">' + esc(V.initials(vm.team)) + '</span>' + esc(vm.team) + '</li></ul>' +
        '<p class="p-new">' + fi('plus') + 'Neuer Plan</p></nav>' +
      '<section class="p-main"><header class="p-head"><span class="p-ic p-ic-l p-ic-' + (vm.world.id.length % 5) + '">' + esc(V.initials(vm.team)) + '</span><div><p class="p-name">' + esc(vm.team) + fi('star') + '</p>' +
          '<div class="p-views"><span>' + fi('listcheck') + 'Raster</span><span class="on">' + fi('board') + 'Board</span><span>' + fi('clock') + 'Diagramme</span><span>' + fi('calendar') + 'Zeitplan</span></div></div>' +
          '<span class="p-ha"><span class="p-filter">' + fi('filter') + 'Filter</span><span>Gruppieren nach Bucket' + fi('chevd') + '</span><span class="p-mem">' + vm.scene.members.slice(0, 4).map(function (id) { return avatar(vm.person(id), 26); }).join('') + '</span></span></header>' +
        board(tasks, buckets, vm, o) +
        '<p class="sr-only">' + open + ' offene Aufgaben</p></section>');
  }
  function board(tasks, buckets, vm, o, avail) {
    var n = buckets.length, w = Math.min(280, Math.floor(((avail || 1208) - 48 - 150 - 16 * n) / n));
    return '<div class="p-board" style="--bw:' + w + 'px">' + buckets.map(function (b, bi) {
          var bt = tasks.filter(function (t) { return t.bucket === b; });
          var openT = bt.filter(function (t) { return !t.done; }), done = bt.filter(function (t) { return t.done; });
          return '<div class="p-bucket"><p class="p-bh"><strong>' + esc(b) + '</strong>' + fi('more') + '</p><p class="p-add">' + fi('plus') + 'Aufgabe hinzufügen</p>' +
            openT.map(function (t) { return card(vm, t, bi, o); }).join('') +
            (done.length ? '<p class="p-done">Erledigte Aufgaben anzeigen <b>' + done.length + '</b>' + fi('chevd') + '</p>' : '') + '</div>';
        }).join('') + '<div class="p-bucket p-newb"><p class="p-add">Neuen Bucket hinzufügen</p></div></div>';
  }
  /* Board only, for the Teams «Aufgaben» tab. */
  function plannerBoard(vm, o) {
    var tasks = plannerTasks(vm), buckets = [];
    if (!tasks.some(function (t) { return t.mark && !t.done; })) {
      var f = tasks.filter(function (t) { return !t.done; })[0];
      if (f) tasks[tasks.indexOf(f)] = Object.assign({}, f, { mark: 1 });
    }
    tasks.forEach(function (t) { if (buckets.indexOf(t.bucket) < 0) buckets.push(t.bucket); });
    return '<div class="p-views t-pv"><span class="on">' + fi('board') + 'Board</span><span>' + fi('listcheck') + 'Raster</span><span>' + fi('clock') + 'Diagramme</span><span class="t-pvf">' + fi('filter') + 'Filter</span></div>' + board(tasks, buckets, vm, o, 1082);
  }
  function card(vm, t, bi, o) {
    var p = vm.person(t.owner), late = /^(Mo|Di)$/.test(t.due);
    return '<div class="p-card' + (t.fromAi ? ' ai' : '') + '">' + mk(t.mark, o.annot) +
      (t.fromAi ? '<span class="p-lab" style="background:#e8ebfa;color:#444791">Besprechung</span>' : '<span class="p-lab" style="background:' + LABELS[bi % LABELS.length] + '22;color:' + LABELS[bi % LABELS.length] + '">' + esc(t.bucket) + '</span>') +
      '<p class="p-ct"><span class="p-circ"></span>' + esc(t.title) + '</p>' +
      '<p class="p-cf"><span class="p-due' + (late ? ' late' : '') + '">' + fi('calendar') + esc(t.due) + '</span>' + (t.fromAi ? '' : '<span class="p-chk">' + fi('listcheck') + '0/2</span>') + '<span class="p-own">' + avatar(p, 24) + '</span></p></div>';
  }
  function plannerNotes(vm) {
    var out = vm.ai ? [[1, 'Nur Vorschläge, die eine Person geprüft und bestätigt hat, stehen im Plan.'], [2, 'Dieser Vorschlag wurde vor der Übernahme angepasst.']] : [];
    var marks = [];
    vm.scene.tasks.forEach(function (t) { if (t.mark && !t.done && marks.indexOf(t.mark) < 0 && vm.scene.notes[t.mark]) marks.push(t.mark); });
    if (!vm.ai && !marks.length) return [[1, 'Jede gemeinsame Aufgabe hat eine verantwortliche Person, einen Termin und einen Bucket.']];
    return out.concat(marks.map(function (m) { return [m, vm.fill(vm.scene.notes[m])]; }));
  }

  /* ================= To Do ================= */
  function todo(vm, o) {
    o = o || {};
    var d = vm.todo, me = vm.person(d.viewer);
    var rows = d.personal.map(function (t, i) { return { t: t, sub: 'Aufgaben', mark: i === 0 ? 1 : 0, mine: true }; })
      .concat(d.assigned.map(function (t, i) { return { t: t.title, sub: 'Zugewiesen an mich · Plan «' + vm.team + '»', due: t.due, done: t.done, mark: i === 0 ? 2 : 0 }; }));
    return frame('m3-todo', 'Microsoft To Do, nachgebildet: Mein Tag von ' + me.name,
      '<div class="d-top">' + fi('waffle', 'd-waf') + '<strong>To Do</strong><span class="d-search">' + fi('search') + '<span>Suchen</span></span><span class="d-tr">' + fi('gear') + avatar(me, 30) + '</span></div>' +
      '<nav class="d-nav"><ul><li class="on">' + fi('sun') + 'Mein Tag<b>' + rows.length + '</b></li><li>' + fi('star') + 'Wichtig</li><li>' + fi('calendar') + 'Geplant</li>' +
        (d.plan ? '<li>' + fi('people') + 'Zugewiesen an mich<b>' + d.assigned.length + '</b></li>' : '') + '<li>' + fi('home') + 'Aufgaben<b>' + d.personal.length + '</b></li></ul>' +
        '<p class="d-newl">' + fi('plus') + 'Neue Liste</p></nav>' +
      '<section class="d-main"><h3>Mein Tag</h3><p class="d-date">Dienstag, 4. November</p>' +
        '<p class="d-add">' + fi('plus') + 'Aufgabe hinzufügen</p>' +
        '<ul class="d-list">' + rows.map(function (r) {
          return '<li class="' + (r.done ? 'done' : '') + '"><span class="d-circ">' + (r.done ? fi('check') : '') + '</span><span class="d-t"><b>' + esc(r.t) + mk(r.mark, o.annot) + '</b><small>' + (r.mine ? fi('sun') + 'Mein Tag · ' : '') + esc(r.sub) + (r.due ? ' · ' + fi('calendar') + esc(r.due) : '') + '</small></span>' + fi('star', 'd-star') + '</li>';
        }).join('') + '</ul></section>');
  }
  function todoNotes(vm) {
    var d = vm.todo, n = first(vm.person(d.viewer).name);
    var out = [[1, 'Persönliche To-dos von ' + n + ': niemand sonst muss sie sehen.']];
    if (d.assigned.length) out.push([2, 'Aus dem gemeinsamen Plan zugewiesen: dieselbe Aufgabe, die das Team im Plan sieht.']);
    return out;
  }

  /* ================= OneDrive (work or school) ================= */
  function sharingOf(f) {
    var n = f.note || '';
    if (/nur |bleibt zu|privat/i.test(n)) return { shared: false, label: 'Privat' };
    return { shared: true, label: 'Geteilt', who: n };
  }
  function onedrive(vm, o) {
    o = o || {};
    var me = vm.person(vm.scene.members[0]), files = vm.scene.files;
    var sel = files.filter(function (f) { return sharingOf(f).shared; })[0] || files[0];
    return frame('m3-onedrive', 'OneDrive, nachgebildet: Meine Dateien von ' + me.name,
      '<div class="od-top">' + fi('waffle', 'od-waf') + '<strong>OneDrive</strong><span class="od-search">' + fi('search') + '<span>Suchen</span></span><span class="od-tr">' + fi('gear') + avatar(me, 30) + '</span></div>' +
      '<nav class="od-nav"><p class="od-me">' + esc(short(me.name)) + '</p><ul><li>' + fi('home') + 'Start</li><li class="on">' + fi('draft') + 'Meine Dateien</li><li>' + fi('clock') + 'Zuletzt verwendet</li><li>' + fi('people') + 'Geteilt</li><li>' + fi('star') + 'Favoriten</li><li>' + fi('trash') + 'Papierkorb</li></ul></nav>' +
      '<section class="od-main">' + A.cmdbar([['plus', 'Hinzufügen oder erstellen', 'm-pri'], ['upload', 'Hochladen'], ['share', 'Teilen'], ['link', 'Link kopieren'], ['download', 'Herunterladen'], ['more', '']]) +
        '<h3>Meine Dateien</h3><table class="m-ft od-ft"><thead><tr><th class="m-ck"></th><th>Name</th><th>Geändert</th><th>Dateigröße</th><th>Freigabe</th></tr></thead><tbody>' +
        files.map(function (f, i) {
          var sh = sharingOf(f), on = f === sel;
          return '<tr class="' + (on ? 'sel' : '') + '"><td class="m-ck">' + (on ? '<span class="m-tick">' + fi('check') + '</span>' : '') + '</td>' +
            '<td><span class="m-fn">' + ftype(f.name.replace(/\s*\/$/, ''), f.kind) + '<span>' + esc(f.name.replace(/\s*\/$/, '')) + '</span>' + mk(f.mark, o.annot) + '</span></td>' +
            '<td>' + ['Gestern', 'Mo', 'letzte Woche', '12. Sept.'][i % 4] + '</td><td>' + (f.kind === 'folder' ? (i + 3) + ' Elemente' : ['84 KB', '1,2 MB', '36 KB', '420 KB'][i % 4]) + '</td>' +
            '<td class="od-sh' + (sh.shared ? ' on' : '') + '">' + (sh.shared ? fi('people') : fi('lock')) + sh.label + '</td></tr>';
        }).join('') + '</tbody></table></section>' +
      '<aside class="od-pane"><p class="s-ph">' + ftype(sel.name, sel.kind) + '<strong>' + esc(sel.name.replace(/\s*\/$/, '')) + '</strong></p>' +
        '<p class="s-k">Zugriff</p><p class="od-acc">' + fi('people') + esc(vm.fill(sel.note || '')) + '</p>' +
        '<p class="s-k">Speicherort</p><p>OneDrive › Meine Dateien</p>' +
        '<p class="s-k">Alle anderen Dateien</p><p>' + fi('lock') + 'Privat: nur ' + esc(first(me.name)) + '</p></aside>');
  }
  function onedriveNotes(vm) {
    var sc = vm.scene, marks = [];
    sc.files.forEach(function (f) { if (f.mark && marks.indexOf(f.mark) < 0 && sc.notes[f.mark]) marks.push(f.mark); });
    return marks.map(function (m) { return [m, vm.fill(sc.notes[m])]; });
  }

  /* ================= Teams meeting recap with simulated AI suggestions ================= */
  function recap(vm, o) {
    o = o || {};
    var a = vm.ai, rev = vm.person(a.reviewer);
    var st = { accepted: ['Übernommen', 'ok'], edited: ['Angepasst und übernommen', 'ed'], rejected: ['Verworfen', 'no'] };
    return frame('m3-teams m3-recap', 'Microsoft Teams, nachgebildet: Besprechungszusammenfassung mit simulierten KI-Vorschlägen',
      A.teamsChrome(rev, 'calendar') +
      '<aside class="t-list"><div class="t-lh"><strong>Kalender</strong><span>' + fi('plus') + '</span></div>' +
        '<ul class="c-list"><li class="on"><span class="r-cal">' + fi('calendar') + '</span><span><b>' + esc(a.meeting) + '</b><small>' + esc(a.when) + ' · ' + a.attendees.length + ' Teilnehmende</small></span></li></ul></aside>' +
      '<section class="t-main r-main"><header class="c-head"><span class="r-cal">' + fi('calendar') + '</span><p><strong>' + esc(a.meeting) + '</strong><small>' + esc(a.when) + '</small></p>' +
          '<div class="t-tabs c-tabs"><span>Chat</span><span>Freigegeben</span><span class="on">Zusammenfassung</span></div><span class="c-ha">' + fi('more') + '</span></header>' +
        '<div class="r-body"><p class="r-sim">' + fi('sparkle') + '<b>Simulation für Schulungszwecke</b> Keine echte KI-Auswertung. Inhalte von KI-Notizen sind Vorschläge und können falsch sein.</p>' +
          '<div class="r-cols"><div class="r-notes"><h4>' + fi('sparkle') + 'KI-Notizen</h4><ul>' + a.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' +
            '<p class="r-att">Teilnehmende: ' + a.attendees.map(function (id) { return esc(first(vm.person(id).name)); }).join(', ') + '</p></div>' +
          '<div class="r-tasks"><h4>' + fi('listcheck') + 'Vorgeschlagene Aufgaben' + mk(1, o.annot) + '</h4><ul>' + a.suggestions.map(function (s) {
            var p = vm.person(s.owner), state = st[s.status];
            return '<li class="r-s r-' + state[1] + '"><div class="r-st">' + (s.status === 'rejected' ? fi('x') : fi('check')) + '</div><div class="r-tx">' +
              (s.status === 'edited' ? '<p><s>' + esc(s.text) + '</s></p><p><b>' + esc(s.edited) + '</b></p>' : '<p>' + (s.status === 'rejected' ? '<s>' + esc(s.text) + '</s>' : '<b>' + esc(s.text) + '</b>') + '</p>') +
              '<p class="r-meta">' + avatar(p, 20) + esc(short(p.name)) + ' · fällig ' + esc(s.due) + '</p>' +
              (s.reason ? '<p class="r-why">' + esc(s.reason) + '</p>' : '') + '</div>' +
              '<span class="r-badge">' + state[0] + '</span></li>';
          }).join('') + '</ul><p class="r-rev">' + mk(2, o.annot) + 'Geprüft von ' + esc(short(rev.name)) + ' · bestätigte Aufgaben in Planner übertragen</p></div></div></div></section>');
  }
  function recapNotes(vm) {
    return [[1, 'Die KI schlägt Aufgaben vor. Sie sind noch keine Verpflichtung.'], [2, 'Eine Person prüft: übernehmen, anpassen oder verwerfen. Erst dann entsteht eine Aufgabe im Plan.']];
  }

  A.register('chat', chat, chatNotes);
  A.register('planner', planner, plannerNotes);
  A.register('todo', todo, todoNotes);
  A.register('onedrive', onedrive, onedriveNotes);
  A.register('recap', recap, recapNotes);
  A.plannerTasks = plannerTasks;
  A.plannerBoard = plannerBoard;
})(window);
