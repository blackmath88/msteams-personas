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
  function compose(vm, params) {
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
