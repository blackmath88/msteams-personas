/* The project editor owns drafts, import and export. These controls edit the workspace data. */
(function (root) {
  var W = root.WorkspaceCore, PC = root.ProjectCore, esc = root.Views.esc;
  var kinds = { team: 'Team', personal: 'Persönlicher Bereich', channel: 'Kanal', storage: 'Dateiablage', folder: 'Ordner', file: 'Datei' };
  function focus(p) { return p.scenes.find(function (s) { return s.profile === 'workspace-map'; }) || p.scenes.find(function (s) { return W.isProfile(s.profile); }); }
  function pairs(p, focus) {
    return p.scenes.filter(function (s) { return W.isProfile(s.profile) && s.root === focus.root && s.viewer === focus.viewer && s.selected === focus.selected; });
  }
  function option(id, label, on) { return '<option value="' + esc(id) + '"' + (on ? ' selected' : '') + '>' + esc(label) + '</option>'; }
  function field(id, label, value, max) {
    return '<label for="' + id + '">' + label + '</label><input id="' + id + '" type="text" maxlength="' + max + '" value="' + esc(value || '') + '">';
  }
  function select(id, label, options) { return '<label for="' + id + '">' + label + '</label><select id="' + id + '">' + options + '</select>'; }
  function tree(w, node, selected) {
    var kids = W.children(w, node.id);
    return '<li><button type="button" class="btn wp-node" data-op="wp-select" data-i="' + esc(node.id) + '" aria-pressed="' + (selected === node) + '">' +
      '<small>' + kinds[node.kind] + '</small> ' + esc(node.name) + '</button>' +
      (kids.length ? '<ul>' + kids.map(function (n) { return tree(w, n, selected); }).join('') + '</ul>' : '') + '</li>';
  }
  function destinations(w, m, node) {
    var index = W.index(w);
    return w.nodes.filter(function (n) {
      var trail = W.trail(index, n.id);
      return ['storage', 'folder'].includes(n.kind) && trail[0] === m.base && !trail.includes(node) &&
        (node.parent === n.id || W.children(w, n.id).length < W.budgets.entries);
    });
  }
  function controls(p) {
    var sc = focus(p);
    if (!sc) return '';
    var m = W.model(p, sc), w = p.workspace, index = W.index(w);
    var n = sc.editRoot ? m.base : m.selected;
    var pairedScene = pairs(p, sc).find(function (s) { return s.profile === 'workspace-scene'; });
    var folders = destinations(w, m, n);
    var container = ['storage', 'folder'].includes(n.kind) ? n : m.folder;
    var canAddEntry = w.nodes.length < W.budgets.nodes && W.children(w, container.id).length < W.budgets.entries;
    var canAddFolder = canAddEntry && W.trail(index, container.id).filter(function (a) { return a.kind === 'folder'; }).length < 2;
    var perspective = w.nodes.filter(function (a) { return ['team', 'personal'].includes(a.kind); }).map(function (a) {
      return a.kind === 'personal' ?
        option(a.id + ':' + a.owner, 'Person / ' + p.people.find(function (person) { return person.id === a.owner; }).name, sc.root === a.id && sc.viewer === a.owner) :
        option(a.id + ':', 'Team / ' + a.name, sc.root === a.id && !sc.viewer) +
        a.members.map(function (id) {
          var person = p.people.find(function (member) { return member.id === id; });
          return option(a.id + ':' + id, 'Person / ' + person.name + ' (' + a.name + ')', sc.root === a.id && sc.viewer === id);
        }).join('');
    }).join('');
    return '<div class="wp-controls"><fieldset><legend>Perspektive und Darstellung</legend>' +
      select('wp-perspective', 'Arbeitsbereich anzeigen als', perspective) +
      (m.base.kind === 'team' ? '<label class="wp-inline"><input id="wp-house" type="checkbox"' + (sc.house ? ' checked' : '') + '> Haus-Metapher anzeigen</label>' : '') +
      (m.base.kind === 'team' && pairedScene ? select('wp-tab', 'Teams-Vorschau', option('posts', 'Beiträge', pairedScene.tab === 'posts') + option('files', 'Dateien', pairedScene.tab === 'files')) : '') +
      '</fieldset><h2>Arbeitsbereich</h2><ul aria-label="Struktur des Arbeitsbereichs">' + tree(w, m.base, n) + '</ul>' +
      '<fieldset><legend>Eintrag bearbeiten</legend>' + field('wp-name', 'Name', n.name, W.budgets.name) +
      (['team', 'personal', 'channel'].includes(n.kind) ? field('wp-purpose', 'Wofür nutzen wir diesen Bereich?', n.purpose, W.budgets.purpose) : '') +
      (['folder', 'file'].includes(n.kind) ? select('wp-parent', 'Speicherort', folders.map(function (dest) {
        return option(dest.id, W.trail(index, dest.id).slice(1).map(function (a) { return a.name; }).join(' › '), dest.id === n.parent);
      }).join('')) : '') +
      '<p class="pj-acts"><button type="button" class="btn" data-op="wp-save-fields">Änderungen übernehmen</button></p>' +
      '<p class="pj-acts">' +
      (m.base.kind === 'team' && m.channels.length < W.budgets.channels && w.nodes.length <= W.budgets.nodes - 2 ? '<button type="button" class="btn" data-op="wp-add-channel">Kanal hinzufügen</button>' : '') +
      (canAddFolder ? '<button type="button" class="btn" data-op="wp-add-folder">Ordner hinzufügen</button>' : '') +
      (canAddEntry ? '<button type="button" class="btn" data-op="wp-add-file">Datei hinzufügen</button>' : '') +
      '</p></fieldset></div>';
  }
  function updateSelection(p, sc, id, tab) {
    var path = W.trail(W.index(p.workspace), id), base = path[0];
    pairs(p, sc).forEach(function (s) {
      s.selected = tab === 'posts' ? path[1].id : id;
      if (s.profile === 'workspace-scene') s.tab = tab || (base.kind === 'personal' || path.length > 2 ? 'files' : s.tab);
    });
  }
  function change(p, command, value) {
    var sc = focus(p), m = W.model(p, sc), w = p.workspace, index = W.index(w);
    var edited = sc.editRoot ? m.base : m.selected;
    if (command === 'wp-save-fields') {
      edited.name = value.name.trim();
      if (value.purpose != null) edited.purpose = value.purpose.trim() || undefined;
    }
    else if (command === 'wp-parent') edited.parent = value;
    else if (command === 'wp-house') pairs(p, sc).forEach(function (s) { s.house = value; });
    else if (command === 'wp-tab') updateSelection(p, sc, sc.selected, value);
    else if (command === 'wp-perspective') {
      var parts = value.split(':'), next = index.get(parts[0]), viewer = parts[1] || undefined;
      if (!next || !W.canSee(next, viewer)) return false;
      var selected = sc.root === next.id ? sc.selected : W.children(w, next.id)[0].id;
      pairs(p, sc).forEach(function (s) {
        s.root = next.id; s.viewer = viewer; s.selected = selected; delete s.editRoot;
        if (s.profile === 'workspace-scene' && next.kind === 'personal') s.tab = 'files';
      });
    } else if (command === 'wp-select') {
      if (value === m.base.id) sc.editRoot = true;
      else if (index.has(value)) { delete sc.editRoot; updateSelection(p, sc, value); }
    } else if (command === 'wp-add-channel') {
      delete sc.editRoot;
      var channel = { id: PC.newId('kanal-', w.nodes), kind: 'channel', parent: m.base.id, name: 'Neuer Kanal' };
      w.nodes.push(channel, { id: PC.newId('ablage-', w.nodes), kind: 'storage', parent: channel.id, name: 'Dateiablage' });
      updateSelection(p, sc, channel.id);
    } else if (command === 'wp-add-folder' || command === 'wp-add-file') {
      delete sc.editRoot;
      var kind = command === 'wp-add-folder' ? 'folder' : 'file';
      var node = { id: PC.newId('eintrag-', w.nodes), kind: kind, parent: m.folder.id, name: kind === 'folder' ? 'Neuer Ordner' : 'Neue Datei.docx' };
      w.nodes.push(node);
      updateSelection(p, sc, node.id, 'files');
    } else return false;
    return true;
  }
  root.WorkspaceEditor = { focus: focus, controls: controls, change: change };
})(window);
