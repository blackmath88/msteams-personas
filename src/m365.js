/*
 * M365 application renderers. Pure functions: (viewModel, options) -> HTML string.
 * Every app renders at a fixed design viewport (1440 x 810 CSS px) so that the workspace
 * preview, the presentation stage and the PNG export share exactly the same geometry.
 *
 * Profiles (see docs/REFERENCE-PROFILES.md):
 *   Teams      – new Teams desktop (2024+), German, light, separate Teams view, channel layout «Beiträge»
 *   Outlook    – new Outlook / Outlook im Web, German, light, three-pane with reading pane right
 *   Explorer   – Windows 11 File Explorer, German (CH), light, details view
 *   SharePoint – SharePoint Online team site, modern document library, German, light
 *
 * Options: { annot: bool, tab: 'posts'|'files'|'tasks' }. Teaching marks are small numbered
 * badges only; the explanatory notes live outside the app (slide column / workspace).
 */
(function (root) {
  var V = root.Views, esc = V.esc, short = V.short, initials = V.initials;
  var W = 1440, H = 810;

  /* ---------- inline Fluent-style line icons (inline so PNG export needs no sprite) ---------- */
  var P = {
    activity: 'M10 3a4.5 4.5 0 0 0-4.5 4.5v3.2L4 13.5h12l-1.5-2.8V7.5A4.5 4.5 0 0 0 10 3zM8 15.5a2 2 0 0 0 4 0',
    chat: 'M4 4.5h12a1 1 0 0 1 1 1v7.5a1 1 0 0 1-1 1H9l-4 3v-3H4a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1z',
    teams: 'M7.5 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM3 16c0-2.6 2-4.3 4.5-4.3S12 13.4 12 16M13.5 9a2 2 0 1 0 0-4M14 11.8c1.8.3 3 1.7 3 3.7',
    calendar: 'M4 5.5h12v10.5H4zM4 8.5h12M7 3.5v3M13 3.5v3',
    calls: 'M6 3.5l2 3.2-1.4 1.6a8 8 0 0 0 5.1 5.1l1.6-1.4 3.2 2-1 2.3c-5.8.4-11.6-5.4-11.2-11.2z',
    onedrive: 'M6 15h9a3 3 0 0 0 .4-6A4.5 4.5 0 0 0 7 8a3.5 3.5 0 0 0-1 7z',
    apps: 'M4 4h5v5H4zM11 4h5v5h-5zM4 11h5v5H4zM11 11h5v5h-5z',
    more: 'M5 10h.01M10 10h.01M15 10h.01',
    search: 'M8.5 3.5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12.2 12.2L16.5 16.5',
    back: 'M12 4l-6 6 6 6',
    fwd: 'M8 4l6 6-6 6',
    up: 'M10 16V4M5 9l5-5 5 5',
    refresh: 'M15.5 9A5.5 5.5 0 1 0 14 13.5M15.5 4.5V9H11',
    video: 'M3.5 6h9v8h-9zM12.5 9l4-2.5v7l-4-2.5',
    info: 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM10 9v4.5M10 6.5h.01',
    reply: 'M8 5L3.5 9.5 8 14M4 9.5h7a5 5 0 0 1 5 5',
    smile: 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM7.3 11.5a3.3 3.3 0 0 0 5.4 0M7.5 8h.01M12.5 8h.01',
    edit: 'M4 16l1-4 8-8 3 3-8 8zM11.5 5.5l3 3',
    plus: 'M10 4v12M4 10h12',
    upload: 'M10 13V4M6 8l4-4 4 4M4 16h12',
    share: 'M13 4l4 4-4 4M17 8H9a5 5 0 0 0-5 5v2',
    link: 'M8.5 11.5l3-3M7 9.5l-1.5 1.5a2.5 2.5 0 0 0 3.5 3.5L10.5 13M13 10.5l1.5-1.5A2.5 2.5 0 0 0 11 5.5L9.5 7',
    sync: 'M4.5 10a5.5 5.5 0 0 1 9.5-3.8M15.5 10A5.5 5.5 0 0 1 6 13.8M14 3v3.5h-3.5M6 17v-3.5h3.5',
    download: 'M10 4v9M6 9l4 4 4-4M4 16h12',
    filter: 'M3.5 5h13M6 10h8M8.5 15h3',
    chevron: 'M7 5l5 5-5 5',
    chevd: 'M5 8l5 5 5-5',
    mail: 'M3.5 5.5h13v9h-13zM3.5 6l6.5 5 6.5-5',
    people: 'M7 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM2.5 16c0-2.6 2-4.3 4.5-4.3S11.5 13.4 11.5 16M13 9a2 2 0 1 0 0-4M13.5 11.8c1.8.3 3 1.7 3 3.7',
    clip: 'M14 9.5l-4.6 4.6a3 3 0 0 1-4.2-4.2L10.4 4.7a2 2 0 0 1 2.8 2.8L8.3 12.4a1 1 0 0 1-1.4-1.4L11 7',
    inbox: 'M3.5 4.5h13v11h-13zM3.5 11h4l1 2h3l1-2h4',
    send: 'M3.5 10L16.5 4l-3 12-3.5-4.5zM10 11.5L16.5 4',
    draft: 'M5 3.5h7l3 3v10H5zM12 3.5v3h3',
    trash: 'M5 6h10M8 6V4h4v2M6 6l.8 10h6.4L14 6',
    home: 'M4 9l6-5 6 5v7H4z',
    star: 'M10 3.5l2 4.2 4.5.6-3.3 3.1.8 4.5-4-2.2-4 2.2.8-4.5L3.5 8.3 8 7.7z',
    pc: 'M3.5 4.5h13v8.5h-13zM7.5 16h5M10 13v3',
    pic: 'M3.5 4.5h13v11h-13zM3.5 13l4-4 3 3 2-2 4 4',
    cut: 'M6 13.5a2 2 0 1 0 0 3 2 2 0 0 0 0-3zM14 13.5a2 2 0 1 0 0 3 2 2 0 0 0 0-3zM7.5 14L14 4M12.5 14L6 4',
    copy: 'M7.5 7.5h8v8h-8zM12.5 7.5V4.5h-8v8h3',
    paste: 'M6 4.5h8v11.5H6zM8 4.5V3h4v1.5',
    sort: 'M6 4v12M3.5 13.5L6 16l2.5-2.5M14 16V4M11.5 6.5L14 4l2.5 2.5',
    view: 'M3.5 5h13M3.5 10h13M3.5 15h13',
    check: 'M5 10.5l3 3 7-7',
    waffle: 'M4 4h2v2H4zM9 4h2v2H9zM14 4h2v2h-2zM4 9h2v2H4zM9 9h2v2H9zM14 9h2v2h-2zM4 14h2v2H4zM9 14h2v2H9zM14 14h2v2h-2z',
    gear: 'M10 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM10 3v2M10 15v2M3 10h2M15 10h2M5 5l1.4 1.4M13.6 13.6L15 15M5 15l1.4-1.4M13.6 6.4L15 5',
    bell: 'M10 3a4.5 4.5 0 0 0-4.5 4.5v3.2L4 13.5h12l-1.5-2.8V7.5A4.5 4.5 0 0 0 10 3zM8 15.5a2 2 0 0 0 4 0',
    window: 'M4 10h12', max: 'M5 5h10v10H5z', close: 'M5 5l10 10M15 5L5 15',
    lock: 'M6 9V7a4 4 0 0 1 8 0v2M5 9h10v8H5z',
    sun: 'M10 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM10 2.5v1.5M10 16v1.5M2.5 10H4M16 10h1.5M4.7 4.7l1 1M14.3 14.3l1 1M4.7 15.3l1-1M14.3 5.7l1-1',
    flag: 'M5 17V3.5M5 4h9l-2 3.5 2 3.5H5',
    sparkle: 'M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5l-1.6-4.4L4 8.5l4.4-1.6zM15.5 13l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z',
    listcheck: 'M3.5 5.5l1.5 1.5 2.5-2.5M3.5 11.5l1.5 1.5 2.5-2.5M10 6h6.5M10 12h6.5M10 16.5h6.5',
    board: 'M3.5 4h4v12h-4zM8.5 4h4v8h-4zM13.5 4h3v10h-3z',
    clock: 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM10 6v4l3 2',
    comment: 'M4 4.5h12v8.5H9l-4 3v-3H4z',
    attach: 'M14 9.5l-4.6 4.6a3 3 0 0 1-4.2-4.2L10.4 4.7a2 2 0 0 1 2.8 2.8L8.3 12.4a1 1 0 0 1-1.4-1.4L11 7',
    x: 'M6 6l8 8M14 6l-8 8'
  };
  function fi(n, cls) {
    return '<svg class="fi' + (cls ? ' ' + cls : '') + '" viewBox="0 0 20 20" aria-hidden="true"><path d="' + P[n] + '" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  /* Office-style file type glyphs: coloured tile with letter, folder in yellow. */
  function ftype(name, kind) {
    var ext = /\.([a-z0-9]+)$/i.exec(name || ''), e = ext ? ext[1].toLowerCase() : '';
    if (kind === 'folder' || /\/$/.test(name || '')) return '<span class="ft ft-folder" aria-hidden="true"></span>';
    var k = e === 'xlsx' || kind === 'table' ? 'x' : e === 'pptx' ? 'p' : e === 'pdf' ? 'pdf' : 'w';
    return '<span class="ft ft-' + k + '" aria-hidden="true"><b>' + (k === 'x' ? 'X' : k === 'p' ? 'P' : k === 'pdf' ? 'PDF' : 'W') + '</b></span>';
  }
  function avatar(p, size) {
    return '<span class="m-av m-av-' + (typeof p.idx === 'number' ? p.idx % 6 : 0) + '" style="--s:' + (size || 32) + 'px" aria-hidden="true">' + esc(initials(p.name)) + '</span>';
  }
  function mk(n, on) { return n && on ? '<span class="m-mk" aria-label="Hinweis ' + n + '">' + n + '</span>' : ''; }
  function nl2br(t) { return esc(t).replace(/\n/g, '<br>'); }
  function frame(cls, label, inner) {
    return '<div class="m3 ' + cls + '" role="img" aria-label="' + esc(label) + '" style="width:' + W + 'px;height:' + H + 'px">' + inner + '</div>';
  }
  function fileExt(n) { var m = /\.([a-z0-9]+)$/i.exec(n || ''); return m ? m[1].toLowerCase() : ''; }
  function typeName(n) { return { xlsx: 'Microsoft Excel-Arbeitsblatt', docx: 'Microsoft Word-Dokument', pptx: 'Microsoft PowerPoint-Präsentation', pdf: 'PDF-Dokument' }[fileExt(n)] || 'Datei'; }

  /* ================= Teams ================= */
  function teams(vm, o) {
    o = o || {};
    var sc = vm.scene;
    var tab = o.tab || 'posts';
    var tabs = [['posts', 'Beiträge', sc.posts.length], ['files', 'Dateien', sc.files.length], ['tasks', 'Aufgaben', sc.tasks.length]].filter(function (t) { return t[2] > 0; });
    if (!tabs.some(function (t) { return t[0] === tab; })) tab = tabs[0][0];
    var me = vm.person(vm.story ? vm.story.viewer : sc.members[0]);
    var members = sc.members.map(vm.person);
    /* Member pane only when the teaching point is about who belongs (guests/externals). */
    var showMembers = members.some(function (p) { return p.external; });
    var rail = teamsRail('teams');
    var body = tab === 'files' ? teamsFiles(vm, o) : tab === 'tasks' ? teamsTasks(vm, o) : teamsPosts(vm, o);
    var tile = '<span class="t-tile t-tile-' + (vm.world.id.length % 5) + '" aria-hidden="true">' + esc(initials(vm.team)) + '</span>';
    return frame('m3-teams' + (o.annot ? ' annot' : ''), 'Microsoft Teams, nachgebildet: ' + vm.team + ', Kanal ' + sc.active,
      '<div class="t-title">' +
        '<span class="t-nav">' + fi('back') + fi('fwd') + '</span>' +
        '<span class="t-search">' + fi('search') + '<span>Suchen</span></span>' +
        '<span class="t-acct">' + fi('more') + '<span class="t-me">' + avatar(me, 28) + '<i class="t-pres"></i></span></span>' +
      '</div>' +
      '<nav class="t-rail" aria-hidden="true">' + rail.map(function (r) {
        return '<span class="t-ri' + (r[2] ? ' on' : '') + '">' + fi(r[0]) + '<small>' + r[1] + '</small></span>';
      }).join('') + '<span class="t-ri">' + fi('more') + '</span><span class="t-ri t-ri-b">' + fi('apps') + '<small>Apps</small></span></nav>' +
      '<aside class="t-list">' +
        '<div class="t-lh"><strong>Teams</strong><span>' + fi('filter') + fi('more') + fi('plus') + '</span></div>' +
        '<p class="t-sec">' + fi('chevd') + 'Teams und Kanäle</p>' +
        '<div class="t-team">' + fi('chevd', 't-chev') + tile + '<span><strong data-bind="team">' + esc(vm.team) + '</strong></span>' + fi('more', 't-dim') + '</div>' +
        '<ul class="t-chans">' + sc.channels.map(function (c) {
          return '<li class="' + (c === sc.active ? 'on' : '') + '"' + (c === sc.active ? ' aria-current="true"' : '') + '>' + esc(c) + '</li>';
        }).join('') + '</ul>' +
        '<p class="t-all">Alle Ihre Teams und Kanäle anzeigen</p>' +
      '</aside>' +
      '<section class="t-main">' +
        '<header class="t-ch">' + tile.replace('t-tile', 't-tile t-tile-l') +
          '<div class="t-chn"><p><strong># ' + esc(sc.active) + '</strong><small>' + esc(vm.team) + '</small></p>' +
          '<div class="t-tabs" role="tablist" aria-label="Ansicht im Kanal">' + tabs.map(function (t) {
            return '<button type="button" role="tab" data-tab="' + t[0] + '" aria-selected="' + (t[0] === tab) + '"' + (t[0] === tab ? '' : ' tabindex="-1"') + '>' + t[1] + '</button>';
          }).join('') + '<span class="t-tabplus">' + fi('plus') + '</span></div></div>' +
          '<div class="t-cha"><span class="t-face">' + members.slice(0, 3).map(function (p) { return avatar(p, 24); }).join('') + '<small>' + members.length + '</small></span>' +
            '<span class="t-meet">' + fi('video') + 'Besprechen' + fi('chevd') + '</span>' + fi('info', 't-dim') + fi('more', 't-dim') + '</div>' +
        '</header>' +
        '<div class="t-body' + (showMembers ? ' t-body-m' : '') + '"><div class="t-content" role="tabpanel">' + body + '</div>' +
          (showMembers ? '<aside class="t-mem"><p class="t-memh">Mitglieder und Gäste · ' + members.length + '</p><ul class="t-memlist">' + members.map(function (p) {
            return '<li>' + avatar(p, 28) + '<span>' + esc(short(p.name)) + (p.external ? ' <em>extern</em>' : p.outside ? ' <em>andere Einheit</em>' : '') + '</span></li>';
          }).join('') + '</ul></aside>' : '') +
        '</div>' +
      '</section>');
  }

  function teamsRail(on) {
    return [['activity', 'Aktivität'], ['chat', 'Chat'], ['teams', 'Teams'], ['calendar', 'Kalender'], ['calls', 'Anrufe'], ['onedrive', 'OneDrive']].map(function (r) { return [r[0], r[1], r[0] === on ? 1 : 0]; });
  }
  /* Shared Teams chrome (title bar + rail) for chat and meeting screens. */
  function teamsChrome(me, on) {
    return '<div class="t-title"><span class="t-nav">' + fi('back') + fi('fwd') + '</span><span class="t-search">' + fi('search') + '<span>Suchen</span></span>' +
      '<span class="t-acct">' + fi('more') + '<span class="t-me">' + avatar(me, 28) + '<i class="t-pres"></i></span></span></div>' +
      '<nav class="t-rail" aria-hidden="true">' + teamsRail(on).map(function (r) {
        return '<span class="t-ri' + (r[2] ? ' on' : '') + '">' + fi(r[0]) + '<small>' + r[1] + '</small></span>';
      }).join('') + '<span class="t-ri">' + fi('more') + '</span><span class="t-ri t-ri-b">' + fi('apps') + '<small>Apps</small></span></nav>';
  }

  function teamsPosts(vm, o) {
    var list = vm.scene.posts;
    return '<ol class="t-posts">' + list.map(function (q) {
      var p = vm.person(q.by), reps = q.replies || [];
      var names = reps.map(function (r) { return short(vm.person(r.by).name).split(' ')[0]; }).filter(function (n, i, a) { return a.indexOf(n) === i; });
      return '<li class="t-post' + (q.canonical ? ' is-canon' : '') + '">' + avatar(p, 32) +
        '<div class="t-card">' + mk(q.mark, o.annot) +
          '<p class="t-ph"><strong>' + esc(short(p.name)) + '</strong><time>' + esc(q.time) + '</time></p>' +
          (q.title ? '<p class="t-subj">' + esc(vm.fill(q.title)) + '</p>' : '') +
          '<p class="t-tx">' + esc(vm.fill(q.text)) + '</p>' +
          (q.file ? '<div class="t-att">' + ftype(q.file) + '<span><strong data-docref="' + (q.canonical ? 'canonical' : '') + '">' + esc(q.file) + '</strong><small>' + esc(vm.team) + ' › Dokumente › ' + esc(vm.scene.active) + '</small></span>' + fi('more', 't-dim') + '</div>' : '') +
          (q.canonical ? '<p class="t-react"><span>👍 ' + Math.min(4, vm.scene.members.length - 1) + '</span></p>' : '') +
          /* Replies collapsed as in the «Beiträge» layout: avatars plus «n Antworten von …». */
          (reps.length ? '<div class="t-reps"><span class="t-rav">' + reps.slice(0, 3).map(function (r) { return avatar(vm.person(r.by), 20); }).join('') + '</span>' +
            '<p class="t-more">' + reps.length + (reps.length === 1 ? ' Antwort' : ' Antworten') + ' von ' + esc(names.join(' und ')) + '</p></div>' : '') +
          '<p class="t-replyl">' + fi('reply') + 'Antworten</p>' +
        '</div></li>';
    }).join('') + '</ol>' +
    '<div class="t-compose"><span class="t-start">' + fi('edit') + 'Beitrag starten</span></div>';
  }

  function cmdbar(items) {
    return '<div class="m-cmd">' + items.map(function (i) { return '<span class="' + (i[2] || '') + '">' + fi(i[0]) + esc(i[1]) + '</span>'; }).join('') + '</div>';
  }
  function teamsFiles(vm, o) {
    return '<div class="t-files">' +
      cmdbar([['plus', 'Neu', 'm-pri'], ['upload', 'Hochladen'], ['edit', 'In Rasteransicht bearbeiten'], ['share', 'Teilen'], ['link', 'Link kopieren'], ['sync', 'Synchronisieren'], ['more', '']]) +
      '<p class="t-crumb">Dokumente <span>›</span> <strong>' + esc(vm.scene.active) + '</strong></p>' +
      fileTable(vm, vm.scene.files, o, true) + '</div>';
  }
  function fileTable(vm, files, o, withBy) {
    return '<table class="m-ft"><thead><tr><th class="m-ck"></th><th scope="col">Name</th><th scope="col">Geändert</th>' + (withBy ? '<th scope="col">Geändert von</th>' : '') + '</tr></thead><tbody>' +
      files.map(function (f) {
        var p = f.by ? vm.person(f.by) : null;
        return '<tr class="' + (f.canonical && o.select ? 'sel' : '') + '"><td class="m-ck">' + (f.canonical && o.select ? '<span class="m-tick">' + fi('check') + '</span>' : '') + '</td>' +
          '<td><span class="m-fn">' + ftype(f.name, f.kind) + '<span' + (f.canonical ? ' data-docref="canonical"' : '') + '>' + esc(f.name) + '</span>' + mk(f.mark, o.annot) + '</span></td>' +
          '<td>' + esc(f.when || 'vor 2 Wochen') + '</td>' + (withBy ? '<td>' + (p ? esc(short(p.name)) : '–') + '</td>' : '') + '</tr>';
      }).join('') + '</tbody></table>';
  }
  function teamsTasks(vm, o) {
    return '<div class="t-tasks">' + cmdbar([['plus', 'Aufgabe hinzufügen', 'm-pri'], ['filter', 'Filter'], ['view', 'Raster']]) +
      '<ul class="m-tasks"><li class="m-th" aria-hidden="true"><span></span><span>Aufgabenname</span><span>Bucket</span><span>Fällig</span><span>Zugewiesen an</span></li>' + vm.scene.tasks.map(function (t) {
        var p = vm.person(t.owner);
        return '<li class="' + (t.done ? 'done' : '') + '"><span class="m-circ">' + (t.done ? fi('check') : '') + '</span>' +
          '<span class="m-tn">' + esc(t.title) + mk(t.mark, o.annot) + '</span><span>' + esc(t.bucket) + '</span><span>' + (t.done ? 'erledigt' : esc(t.due)) + '</span>' +
          '<span class="m-own">' + avatar(p, 24) + esc(short(p.name)) + '</span><span class="sr-only">' + (t.done ? 'Erledigt' : 'Offen') + '</span></li>';
      }).join('') + '</ul></div>';
  }

  /* ================= Outlook ================= */
  function outlook(vm, o) {
    o = o || {};
    var st = vm.story, me = vm.person(st.viewer), sel = st.mails[0];
    var list = st.mails.map(function (m, i) { return { m: m, i: i }; }).reverse();
    var from = vm.person(sel.by);
    var others = st.otherMail.map(function (x) { return '<li class="o-it">' + avatar(vm.person(x.by), 32) + '<div><p class="o-from">' + esc(short(vm.person(x.by).name)) + '<time>' + esc(x.time) + '</time></p><p class="o-subj">' + esc(x.subject) + '</p><p class="o-prev">' + esc(x.preview) + '</p></div></li>'; }).join('');
    return frame('m3-outlook', 'Outlook, nachgebildet: Posteingang von ' + me.name,
      '<div class="o-top">' + fi('waffle', 'o-waf') + '<strong>Outlook</strong><span class="o-search">' + fi('search') + '<span>Suchen</span></span>' +
        '<span class="o-tr">' + fi('bell') + fi('gear') + avatar(me, 30) + '</span></div>' +
      '<nav class="o-rail" aria-hidden="true">' + fi('mail', 'on') + fi('calendar') + fi('people') + fi('onedrive') + fi('apps') + '</nav>' +
      '<div class="o-ribbon"><span class="o-tabs"><b>Start</b><span>Ansicht</span><span>Hilfe</span></span>' +
        '<span class="o-cmds"><span class="o-new">' + fi('mail') + 'Neue E-Mail</span>' + fi('trash') + '<span>Archivieren</span><span>Antworten</span><span>Allen antworten</span><span>Weiterleiten</span></span></div>' +
      '<aside class="o-folders"><p class="o-fh">' + fi('chevd') + 'Favoriten</p>' +
        '<ul><li class="on">' + fi('inbox') + 'Posteingang<b>' + (st.mails.length) + '</b></li><li>' + fi('send') + 'Gesendete Elemente</li><li>' + fi('draft') + 'Entwürfe</li></ul>' +
        '<p class="o-fh">' + fi('chevd') + esc(short(me.name)) + '</p><ul><li>' + fi('inbox') + 'Posteingang<b>' + st.mails.length + '</b></li><li>' + fi('draft') + 'Entwürfe</li><li>' + fi('send') + 'Gesendete Elemente</li><li>' + fi('trash') + 'Gelöschte Elemente</li><li>' + fi('view') + 'Archiv</li></ul></aside>' +
      '<section class="o-list"><div class="o-lh"><strong>Posteingang</strong>' + fi('star') + '</div>' +
        '<div class="o-pivot"><b>Relevant</b><span>Sonstige</span>' + fi('filter') + '</div><p class="o-grp">Diese Woche</p>' +
        '<ul>' + list.map(function (x) {
          var m = x.m, p = vm.person(m.by), on = x.i === 0;
          return '<li class="o-it' + (on ? ' on' : ' unread') + '">' + avatar(p, 32) + '<div><p class="o-from">' + esc(short(p.name)) + '<time>' + esc(m.time) + '</time></p>' +
            '<p class="o-subj">' + (m.attachment ? fi('clip') : '') + esc(m.subject) + '</p><p class="o-prev">' + esc(m.body.replace(/\s+/g, ' ')) + '</p>' +
            (m.attachment ? '<p class="o-chip">' + ftype(m.attachment.name) + esc(m.attachment.name) + '</p>' : '') + '</div></li>';
        }).join('') + '</ul><p class="o-grp">Letzte Woche</p><ul>' + others + '</ul></section>' +
      '<section class="o-read"><h3 class="o-rsubj" data-mail="subject">' + esc(sel.subject) + '</h3>' +
        '<div class="o-rh">' + avatar(from, 40) + '<div><p><strong>' + esc(short(from.name)) + '</strong></p><p class="o-to">An: ' + sel.to.map(function (id) { return esc(short(vm.person(id).name)); }).join('; ') + '</p></div>' +
          '<span class="o-ract">' + fi('smile') + fi('reply') + fi('more') + '</span><time>' + esc(sel.time) + '</time></div>' +
        (sel.attachment ? '<div class="o-atts"><div class="o-att">' + ftype(sel.attachment.name) + '<span><strong data-docref="copy">' + esc(sel.attachment.name) + '</strong><small>' + esc(sel.attachment.size) + '</small></span>' + fi('chevd') + mk(1, o.annot) + '</div></div>' : '') +
        '<div class="o-body" data-mail="body">' + nl2br(sel.body) + '</div>' +
        '<div class="o-replybar"><span>' + fi('reply') + 'Antworten</span><span>Allen antworten</span><span>Weiterleiten</span></div>' +
      '</section>');
  }

  /* ================= Windows 11 Explorer ================= */
  function explorer(vm, o) {
    o = o || {};
    var st = vm.story, me = vm.person(st.viewer);
    var rows = [];
    st.copies.forEach(function (c, i) {
      rows.push({ name: c.name, time: c.time, size: c.size, mark: 1, copy: true });
      if (i === st.redownload) rows.push({ name: c.name.replace(/(\.[a-z0-9]+)$/i, ' (1)$1'), time: c.time, size: c.size, mark: 2, copy: true });
    });
    rows.push({ name: 'Rechnung_Hotel_Bern.pdf', time: 'Fr', size: '212 KB' });
    var day = function (t) { return /^(Mo|Di|Mi|Do|Fr|Sa|So)\s/.test(t) ? t.split(' ')[0] : t; };
    var dates = { Mo: '20.10.2026', Di: '21.10.2026', Mi: '22.10.2026', Do: '23.10.2026', Fr: '17.10.2026' };
    var clock = function (t) { var m = /(\d\d:\d\d)/.exec(t); return m ? m[1] : '08:30'; };
    return frame('m3-explorer', 'Windows Explorer, nachgebildet: Downloads von ' + me.name,
      '<div class="x-titl"><span class="x-tab">' + '<span class="ft ft-folder ft-s"></span>Downloads<span class="x-tx">' + fi('close') + '</span></span><span class="x-plus">' + fi('plus') + '</span>' +
        '<span class="x-win">' + fi('window') + fi('max') + fi('close') + '</span></div>' +
      '<div class="x-addr"><span class="x-navb">' + fi('back') + fi('fwd') + fi('up') + fi('refresh') + '</span>' +
        '<span class="x-path">' + fi('pc') + '<span>›</span>Dieser PC<span>›</span><b>Downloads</b></span>' +
        '<span class="x-search">' + fi('search') + 'Downloads durchsuchen</span></div>' +
      '<div class="x-cmd"><span class="x-new">' + fi('plus') + 'Neu' + fi('chevd') + '</span><i></i>' + fi('cut') + fi('copy') + fi('paste') + fi('edit') + fi('share') + fi('trash') + '<i></i>' +
        '<span>' + fi('sort') + 'Sortieren' + fi('chevd') + '</span><span>' + fi('view') + 'Anzeigen' + fi('chevd') + '</span>' + fi('more') + '<span class="x-det">' + fi('info') + 'Details</span></div>' +
      '<aside class="x-nav"><ul><li>' + fi('home') + 'Start</li><li>' + fi('pic') + 'Katalog</li><li class="x-od">' + fi('onedrive') + esc(short(me.name)) + ' – Persönlich</li></ul>' +
        '<ul><li>' + fi('pc') + 'Desktop</li><li class="on">' + fi('download') + 'Downloads</li><li>' + fi('draft') + 'Dokumente</li><li>' + fi('pic') + 'Bilder</li></ul>' +
        '<ul><li>' + fi('pc') + 'Dieser PC</li><li>' + fi('pc') + 'Netzwerk</li></ul></aside>' +
      '<section class="x-main"><table class="x-tbl"><thead><tr><th>Name</th><th>Änderungsdatum</th><th>Typ</th><th>Grösse</th></tr></thead><tbody>' +
        '<tr class="x-grp"><td colspan="4">' + fi('chevd') + 'Diese Woche</td></tr>' +
        rows.map(function (r, i) {
          return '<tr class="' + (i === 0 ? 'sel' : '') + '"><td><span class="m-fn">' + ftype(r.name) + '<span' + (r.copy ? ' data-docref="copy"' : '') + '>' + esc(r.name) + '</span>' + mk(r.mark, o.annot && (i === 0 || r.mark === 2)) + '</span></td>' +
            '<td>' + (dates[day(r.time)] || '24.10.2026') + ' ' + clock(r.time) + '</td><td>' + typeName(r.name) + '</td><td class="x-r">' + esc(r.size) + '</td></tr>';
        }).join('') + '</tbody></table></section>' +
      '<div class="x-status"><span>' + rows.length + ' Elemente</span><span>1 Element ausgewählt  ' + esc(rows[0].size) + '</span></div>');
  }

  /* ================= SharePoint document library ================= */
  function sharepoint(vm, o) {
    o = o || {};
    var st = vm.story, me = vm.person(st.viewer);
    var nav = ['Startseite', 'Unterhaltungen', 'Dokumente', 'Freigegeben für uns', 'Notizbuch', 'Seiten', 'Websiteinhalte'];
    return frame('m3-sharepoint', 'SharePoint, nachgebildet: Teamwebsite ' + vm.team + ', Dokumente',
      '<div class="s-suite">' + fi('waffle', 's-waf') + '<strong>SharePoint</strong><span class="s-search">' + fi('search') + '<span>Auf dieser Website suchen</span></span>' +
        '<span class="s-tr">' + fi('gear') + avatar(me, 30) + '</span></div>' +
      '<nav class="s-app" aria-hidden="true">' + fi('home') + fi('star') + fi('draft') + fi('onedrive') + fi('plus') + '</nav>' +
      '<header class="s-site"><span class="t-tile t-tile-l t-tile-' + (vm.world.id.length % 5) + '">' + esc(initials(vm.team)) + '</span><div><p class="s-name">' + esc(vm.team) + '</p>' +
        '<ul class="s-nav">' + nav.map(function (n) { return '<li' + (n === 'Dokumente' ? ' class="on"' : '') + '>' + n + '</li>'; }).join('') + '</ul></div>' +
        '<span class="s-priv">' + fi('people') + 'Private Gruppe · ' + vm.scene.members.length + ' Mitglieder</span></header>' +
      '<div class="s-cmdrow">' + cmdbar([['plus', 'Neu', 'm-pri'], ['upload', 'Hochladen'], ['edit', 'In Rasteransicht bearbeiten'], ['share', 'Teilen'], ['link', 'Link kopieren'], ['sync', 'Synchronisieren'], ['more', '']]) +
        '<span class="s-view">' + fi('view') + 'Alle Dokumente' + fi('chevd') + fi('filter') + fi('info') + '</span></div>' +
      '<section class="s-lib"><p class="s-crumb">Dokumente <span>›</span> <strong>' + esc(vm.scene.active) + '</strong></p>' +
        fileTable(vm, vm.scene.files, { annot: o.annot, select: true }, true).replace('<th scope="col">Geändert von</th>', '<th scope="col">Geändert von</th><th class="s-add">+ Spalte hinzufügen</th>').replace(/<\/td><\/tr>/g, '</td><td></td></tr>') +
      '</section>' +
      '<aside class="s-pane"><p class="s-ph">' + ftype(st.doc.name) + '<strong data-docref="canonical">' + esc(st.doc.name) + '</strong></p>' +
        '<p class="s-k">Zugriff</p><p>' + esc(vm.team) + ' – Mitglieder</p>' +
        '<p class="s-k">Geändert</p><p>' + esc(st.doc.when) + ' von ' + esc(short(vm.person(st.doc.by).name)) + '</p>' +
        '<p class="s-k">Speicherort</p><p>Dokumente › ' + esc(vm.scene.active) + '</p>' +
        '<p class="s-k">Versionsverlauf</p><p>Eine Datei, alle Änderungen im Verlauf</p>' + mk(1, o.annot) + '</aside>');
  }

  var APPS = { teams: teams, outlook: outlook, explorer: explorer, sharepoint: sharepoint };
  var NOTES = {};
  /* Tool for a scene sub-route: the old Teams tab routes (posts/files/tasks) stay valid. */
  function toolOf(sub) { return APPS[sub] && sub !== 'teams' ? sub : 'teams'; }
  function available(vm, tool) { return (vm.tools || []).indexOf(tool) >= 0; }
  function app(vm, sub, o) {
    o = o || {};
    var tool = toolOf(sub);
    if (!available(vm, tool)) return null;
    return tool === 'teams' ? teams(vm, Object.assign({}, o, { tab: sub })) : APPS[tool](vm, o);
  }
  /* Further renderers (src/m365-more.js) register here. */
  function register(id, fn, notesFn) { APPS[id] = fn; if (notesFn) NOTES[id] = notesFn; }

  /* Teaching notes per tool, shown outside the application (slide column / workspace). */
  function notes(vm, sub) {
    var tool = toolOf(sub), st = vm.story;
    if (NOTES[tool]) return NOTES[tool](vm);
    if (tool === 'teams') {
      var sc = vm.scene, tab = sub === 'files' || sub === 'tasks' ? sub : 'posts';
      var items = tab === 'files' ? sc.files : tab === 'tasks' ? sc.tasks : sc.posts, marks = [];
      items.forEach(function (x) { if (x.mark && marks.indexOf(x.mark) < 0 && sc.notes[x.mark]) marks.push(x.mark); });
      return marks.map(function (m) { return [m, vm.fill(sc.notes[m])]; });
    }
    var doc = st.doc.name, c0 = st.copies[0];
    if (tool === 'outlook') return [[1, short(vm.person(c0.by).name) + ' verschickt «' + c0.name + '» als Anhang. Jede Person, die ihn öffnet und ändert, erzeugt eine eigene Fassung.']];
    if (tool === 'explorer') return [[1, st.copies.length + ' Kopien desselben Plans aus verschiedenen Mails. Keine zeigt sicher den aktuellen Stand.'], [2, 'Zweimal heruntergeladen: Windows hängt «(1)» an. Noch eine Fassung.']];
    return [[1, '«' + doc + '» liegt einmal in der Bibliothek des Teams. Teams-Kanal und SharePoint zeigen dieselbe Datei.']];
  }

  root.M365 = { app: app, register: register, teamsChrome: teamsChrome, fileTable: fileTable, available: available, avatar: avatar, ftype: ftype, frame: frame, mk: mk, cmdbar: cmdbar, nl2br: nl2br, teams: teams, outlook: outlook, explorer: explorer, sharepoint: sharepoint, toolOf: toolOf, notes: notes, W: W, H: H, fi: fi };
})(window);
