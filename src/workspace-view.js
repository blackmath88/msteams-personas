/* One visual grammar for the workspace map and its matching application scene. */
(function (root) {
  var esc = root.Views.esc, A = root.M365;
  function marker(n) { return '<span class="wp-mark">' + n + '</span>'; }
  function labels(m) {
    return m.base.kind === 'personal' ? ['Persönlicher Bereich', 'Dateiablage'] :
      m.house ? ['Team / Haus', 'Kanal / Zimmer', 'Dateiablage / Regal'] : ['Team', 'Kanal', 'Dateiablage'];
  }
  function breadcrumb(nodes) { return nodes.map(function (n) { return esc(n.name); }).join(' <span aria-hidden="true">›</span> '); }
  function map(vm) {
    var m = vm.workspace, personal = m.base.kind === 'personal', l = labels(m);
    var linked = vm.scene.posts.find(function (post) { return post.file; });
    var entries = m.entries.map(function (n) {
      var selected = n === m.selected;
      var access = personal && n.kind === 'file' ? ((n.sharedWith || []).length ?
        'Geteilt mit ' + n.sharedWith.map(function (id) { return vm.person(id).name; }).join(', ') : 'Privat') : '';
      return '<li' + (selected ? ' class="wp-selected"' : '') + '><span>' + esc(n.name) + '</span>' +
        '<small>' + (selected ? 'Ausgewählt · ' : '') + esc(access || (n.kind === 'folder' ? (personal ? 'Ordner · Privat' : 'Ordner') : 'Datei')) + '</small></li>';
    }).join('');
    return '<div class="wp-map"><section class="wp-tree"><p class="wp-kind">' + marker(1) + l[0] + '</p>' +
      '<h3>' + esc(m.base.name) + '</h3>' + (m.base.purpose ? '<p class="wp-desc">' + esc(m.base.purpose) + '</p>' : '') +
      (personal ? '<p class="wp-viewer">Ansicht von ' + esc(vm.person(m.viewer).name) + '</p>' :
        '<p class="wp-kind">' + marker(2) + l[1] + ' <span>· ' + m.channels.length + ' Kanäle</span></p><ul class="wp-channels">' +
        m.channels.map(function (n) {
          var active = n === m.active;
          return '<li' + (active ? ' class="wp-selected"' : '') + '><span class="wp-hash" aria-hidden="true">#</span> ' + esc(n.name) +
            (active ? '<small>Ausgewählt</small>' : '') + '</li>';
        }).join('') + '</ul><p class="wp-viewer">' + m.base.members.length + ' Teammitglieder' +
        (m.viewer ? ' · Ansicht von ' + esc(vm.person(m.viewer).name) : '') + '</p>') +
      '</section><section class="wp-detail"><p class="wp-kind">' + marker(3) + l[l.length - 1] + '</p>' +
      '<h3>' + esc(m.storage.name) + '</h3><p class="wp-crumb">' + breadcrumb(m.path.slice(0, m.selected.kind === 'file' ? -1 : undefined)) + '</p>' +
      '<p class="wp-provider">' + (personal ? 'OneDrive · Persönliche Ablage' : 'SharePoint · Gemeinsame Dateien dieses Kanals') + '</p>' +
      '<ul class="wp-entries">' + (entries || '<li>Hier liegen noch keine Dateien oder Ordner.</li>') + '</ul>' +
      (!personal ? '<p class="wp-work"><strong>Beiträge</strong> ' + esc(m.active.purpose || 'Absprachen im Kanal') + '</p>' +
        (linked ? '<p class="wp-reference">Verweis im Beitrag: ' + esc(linked.file) + '</p>' : '') : '') +
      '</section></div>';
  }
  // The shapes follow docs/mockups/three-houses.html. The rooms always come from the workspace model.
  var roofs = [
    { outline: 'M5 125L250 13 495 125Z', shade: 'M250 13L495 125H250Z', x: 250, y: 79, chimney: 372 },
    { outline: 'M5 125L128 24H278L495 125Z', shade: 'M278 24L495 125H322Z', x: 199, y: 77, chimney: 353 },
    { outline: 'M5 125L93 46H157L258 8 495 125Z', shade: 'M258 8L495 125H280Z', x: 258, y: 76, chimney: 391 }
  ];
  function roof(tone, key) {
    var r = roofs[tone], id = 'wp-tiles-' + esc(key);
    return '<svg class="wp-roof" viewBox="0 0 500 130" aria-hidden="true">' +
      '<defs><pattern id="' + id + '" width="54" height="26" patternUnits="userSpaceOnUse">' +
      '<path d="M0 0h54M0 13h54M27 0v13M0 13v13" fill="none" stroke="white" opacity=".24" stroke-width="1.6"/></pattern></defs>' +
      '<path class="wp-eaves wp-chimney" d="M' + r.chimney + ' 84V36h29v56z"/><path class="wp-eaves" d="M' + (r.chimney - 4) + ' 36h37"/>' +
      '<path class="wp-roof-face" d="' + r.outline + '"/><path class="wp-roof-light" d="' + r.shade + '"/>' +
      '<path d="' + r.outline + '" fill="url(#' + id + ')"/><path class="wp-eaves" d="' + r.outline + '"/>' +
      '<g class="wp-attic" transform="translate(' + r.x + ' ' + r.y + ')"><path d="M-15 16v-20a15 15 0 0 1 30 0v20z" fill="#f3f3fb"/>' +
      '<path d="M0 -18v34M-15 2h30M-19 17h38" fill="none"/></g></svg>';
  }
  function cabinet() {
    return '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">' +
      '<rect x="5" y="4" width="22" height="23" rx="2" fill="white"/><path d="M5 15.5h22m-14-6h6m-6 11.5h6M9 27v2m14-2v2"/>' +
      '<path d="M27 5l3 2v19l-3 2z" fill="currentColor" stroke="none" opacity=".27"/></svg>';
  }
  // Room icons are visual cues read from the channel name and purpose; they carry no data and fall back to the discussion icon.
  var cues = [
    ['calendar', /termin|anlass|anläss|planung|kalender|ablauf|veranstalt|forum|sitzung/i],
    ['listcheck', /aufgabe|organisation|koordin|auswert|rückmeld|zuständig|entscheid|protokoll/i],
    ['people', /weiterbildung|learning|schulung|kurs(?!material)|mitglied|personal/i],
    ['share', /material|unterlagen|datei|manuskript|publikation|dokument|vorlage/i],
    ['board', /pilot|test|projekt|board|phase|umsetz|sprint/i]
  ];
  function roomIcon(c) {
    if (/^allgemein$/i.test(String(c.name).trim())) return 'chat';
    var text = c.name + ' ' + (c.purpose || '');
    var hit = cues.find(function (cue) { return cue[1].test(text); });
    return hit ? hit[0] : 'chat';
  }
  var counts = ['keinem Team', 'einem Team', 'zwei Teams', 'drei Teams', 'vier Teams', 'fünf Teams', 'sechs Teams'];
  function firstName(person) { return root.Views.short(person.name).split(' ')[0]; }
  // The open cabinet of the selected room: the same entries and selection the Teams file list shows.
  function drawer(m, interactive) {
    var crumb = ['Dateien'].concat(m.path.slice(3).filter(function (n) { return n.kind === 'folder'; }).map(function (n) { return esc(n.name); }));
    var rows = m.entries.map(function (n) {
      var on = n === m.selected, folder = n.kind === 'folder';
      var label = (on ? '<span class="m-tick">' + A.fi('check', null, true) + '</span>' : A.ftype(n.name, n.kind)) + '<span>' + esc(n.name) + '</span>' + (folder ? A.fi('chevron', 'wp-entry-chev') : '');
      return '<li class="wp-entry' + (on ? ' wp-entry-on' : '') + '">' + (interactive ? '<button type="button" data-op="wp-select" data-i="' + esc(n.id) + '">' + label + '</button>' : '<span>' + label + '</span>') + '</li>';
    }).join('');
    return '<div class="wp-drawer"><p class="wp-drawer-crumb">' + crumb.map(function (c, i) { return i === crumb.length - 1 ? '<strong>' + c + '</strong>' : c; }).join(' <span aria-hidden="true">›</span> ') + '</p>' +
      '<ul>' + (rows || '<li class="wp-entry wp-entry-empty"><span>Hier liegen noch keine Dateien oder Ordner.</span></li>') + '</ul></div>';
  }
  function house(team, channels, tone, key, active, files, interactive, m) {
    function cell(cls, channel, content, file) {
      if (!interactive) return '<span class="' + cls + '"' + (file ? ' aria-label="Dateiablage"' : '') + '>' + content + '</span>';
      return '<button type="button" class="' + cls + '" data-op="' + (file ? 'wp-open-files' : 'wp-select') + '" data-i="' + esc(channel.id) +
        '"' + (file ? ' aria-label="Dateien in ' + esc(channel.name) + '"' : '') + '>' + content + '</button>';
    }
    var tabKnown = !!active, filesOn = tabKnown ? files : true;
    return '<section class="wp-house wp-house-' + tone + (tabKnown && channels.length > 3 ? ' wp-house-dense' : '') + '">' + roof(tone, key) +
      '<div class="wp-house-building"><header class="wp-house-name">' + A.fi('chevd') + '<span class="wp-house-tile" aria-hidden="true">' + esc(root.Views.initials(team.name)) + '</span><div><h3>' + esc(team.name) + (active ? marker(1) : '') + '</h3>' +
      (team.teamType ? '<span class="wp-house-type">' + esc(team.teamType) + '</span>' : '') +
      (team.collaboration ? '<span class="wp-house-scope">' + esc(team.collaboration) + '</span>' : '') + '</div></header>' +
      '<div class="wp-house-cols" aria-hidden="true"><span' + (tabKnown && !filesOn ? ' class="wp-col-on"' : '') + '>Kanäle</span><span' + (filesOn ? ' class="wp-col-on"' : '') + '>Dateien</span></div><ul>' + channels.map(function (c) {
        var on = c === active, open = on && files;
        return '<li class="wp-room' + (on ? ' wp-room-on' : '') + (open ? ' wp-room-open' : '') + '"' + (on ? ' aria-current="true"' : '') + '>' +
          cell('wp-room-label', c, '<span class="wp-room-icon">' + (on ? marker(2) : A.fi(roomIcon(c))) + '</span><span><strong>' + esc(c.name) + '</strong>' +
          (c.purpose ? '<small>' + esc(c.purpose) + '</small>' : '') + '</span>', false) +
          cell('wp-room-files' + (open ? ' wp-room-files-on' : ''), c, (open ? marker(3) : '') + cabinet(), true) +
          (open && m ? drawer(m, interactive) : '') + '</li>';
      }).join('') + '</ul></div><div class="wp-foundation" aria-hidden="true"></div></section>';
  }
  // Footer path: one crumb per level; when the names are long, every crumb shrinks with an ellipsis and the file keeps most of its width.
  function pathLine(m, tab) {
    var parts = [marker(1) + esc(m.base.name), marker(2) + esc(m.active.name)];
    if (tab === 'files') { parts.push(marker(3) + 'Dateien'); m.path.slice(3).forEach(function (n) { parts.push(esc(n.name)); }); }
    else parts.push('Beiträge');
    return parts.map(function (part, i) {
      var cls = i === 2 && tab === 'files' ? ' wp-crumb-fixed' : i === parts.length - 1 ? ' wp-crumb-last' : '';
      return '<span class="wp-crumb' + cls + '">' + part + '</span>';
    }).join('<span class="wp-sep" aria-hidden="true">›</span>');
  }
  function housesSlide(vm, params) {
    var m = vm.workspace, overview = !!m.houses, tab = params.tab;
    var legend = '<strong>Haus</strong> = Team &nbsp;·&nbsp; <strong>Zimmer</strong> = Kanal &nbsp;·&nbsp; <strong>Schrank</strong> = Dateien';
    var head, body, foot;
    if (overview) {
      var who = vm.person(m.viewer), n = m.houses.length, dense = m.houses.some(function (h) { return h.channels.length > 4; });
      head = '<p class="wp-eyebrow">Teams sinnvoll nutzen · Perspektive von ' + esc(root.Views.short(who.name)) + '</p><h2>' + esc(firstName(who) + ' arbeitet in ' + (counts[n] || n + ' Teams')) + '</h2>' +
        '<p class="wp-deck">Die Zimmer zeigen, woran die Teams arbeiten. Rechts liegen die Dateien zum jeweiligen Kanal.</p>';
      body = '<div class="wp-houses wp-houses-' + n + (dense ? ' wp-houses-dense' : '') + '" style="--houses:' + n + '">' + m.houses.map(function (h, i) {
        return house(h.team, h.channels, i % roofs.length, params.key + '-' + i);
      }).join('') + '</div>';
      foot = '<span>Fiktives Beispiel' + (vm.organisation ? ' · ' + esc(vm.organisation) : '') + '</span><span>' + legend + '</span>';
    } else {
      var tone = m.houseTone % roofs.length;
      head = '<p class="wp-eyebrow">Szene · Metapher links, nachgebildete Oberfläche rechts</p><h2>' + esc(vm.title) + '</h2>';
      body = '<div class="wp-house-compare wp-house-' + tone + '">' + house(m.base, m.channels, tone, params.key, m.active, tab === 'files', params.interactive, m) +
        '<div class="wp-house-app">' + A.app(vm, tab, { annot: true, select: true, workspaceNav: params.interactive, workspaceCompare: true }) + '</div></div>';
      foot = '<span class="wp-path">' + pathLine(m, tab) + '</span><span>Fiktives Beispiel &nbsp;·&nbsp; ' + legend + '</span>';
    }
    return '<div class="slide wp-slide wp-house-slide' + (overview ? ' wp-house-overview' : ' wp-house-scene') + '" style="width:1920px;height:1080px"><header class="wp-house-head">' + head + '</header>' +
      body + '<footer class="wp-house-foot">' + foot + '</footer></div>';
  }
  function compose(vm, params) {
    if (['workspace-houses', 'workspace-house-teams'].includes(params.profile)) return housesSlide(vm, params);
    var m = vm.workspace, personal = m.base.kind === 'personal', isMap = params.mode === 'prinzip';
    var location = personal ? 'OneDrive / Meine Dateien' : m.base.name + ' / ' + m.active.name;
    var sub = personal ? 'onedrive' : params.tab;
    var linked = vm.scene.posts.find(function (post) { return post.file; });
    var app = !isMap && A.app(vm, sub, { annot: true, select: true });
    return '<div class="slide wp-slide' + (isMap ? ' wp-slide-map' : ' wp-slide-scene') + '" style="width:1920px;height:1080px">' +
      '<header class="wp-head"><p>' + (isMap ? 'Prinzip / Arbeitsbereich' : 'Szene / ' + (personal ? 'OneDrive' : 'Teams')) + '</p>' +
      '<h2>' + esc(isMap ? vm.title : location) + '</h2></header>' +
      (isMap ? map(vm) : '<div class="wp-app">' + app + '</div><aside class="wp-guide"><p class="wp-kind">In dieser Ansicht</p>' +
        (personal ? '<p>' + marker(1) + '<strong>' + esc(vm.person(m.viewer).name) + '</strong></p><p>' + marker(3) + 'Persönliche Dateiablage in OneDrive</p>' :
          '<p>' + marker(1) + '<strong>' + esc(m.base.name) + '</strong></p><p>' + marker(2) + '<strong>' + esc(m.active.name) + '</strong></p><p>' + marker(3) +
          (params.tab === 'posts' ? 'Beiträge im Kanal' : 'Dateiablage in SharePoint') + '</p>') +
        '<p class="wp-guide-focus">' + esc(m.selected.kind === 'file' ? m.selected.name : params.tab === 'posts' && linked ? linked.file : m.active.purpose || '') + '</p></aside>') +
      '<p class="wp-foot">Fiktives Beispiel' + (isMap ? ' · Vereinfachte Übersicht' : ' · Nachgebildete Oberfläche') + '</p></div>';
  }
  root.WorkspaceView = { compose: compose };
})(window);
