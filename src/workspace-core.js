/* Fictional workspace topology shared by project validation, the editor and renderers. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.WorkspaceCore = factory();
})(typeof window !== 'undefined' ? window : globalThis, function () {
  var VERSION = 4;
  var B = { roots: 4, channels: 6, entries: 7, nodes: 60, name: 50, purpose: 110, posts: 3, postText: 180, postTitle: 60 };
  var parents = { channel: ['team'], storage: ['channel', 'personal'], folder: ['storage', 'folder'], file: ['storage', 'folder'] };
  var roots = ['team', 'personal'];
  var profiles = {
    'workspace-map': { label: 'Prinzip: Arbeitsbereich', renderer: 'principle:workspace', minCapabilityVersion: VERSION, needs: ['workspace', 'root', 'selected'], budgets: B },
    'workspace-scene': { label: 'Szene: Arbeitsbereich', renderer: 'workspace', minCapabilityVersion: VERSION, needs: ['workspace', 'root', 'selected', 'tab'], budgets: B }
  };
  function isProfile(id) { return typeof id === 'string' && Object.hasOwn(profiles, id); }
  function object(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
  function children(w, id) { return w.nodes.filter(function (n) { return n.parent === id; }); }
  function nodesById(w) { return new Map(w.nodes.map(function (n) { return [n.id, n]; })); }
  function trail(index, id) {
    var path = [], seen = new Set(), node = index.get(id);
    while (node && !seen.has(node.id)) {
      seen.add(node.id); path.unshift(node); node = index.get(node.parent);
    }
    return path;
  }
  function canSee(node, viewer) {
    return node.kind === 'personal' ? node.owner === viewer : node.kind === 'team' && (!viewer || node.members.includes(viewer));
  }
  function check(p, err) {
    var scenes = Array.isArray(p.scenes) ? p.scenes : [];
    if (p.workspace == null && !scenes.some(function (s) { return object(s) && isProfile(s.profile); })) return;
    if (p.capabilityVersion < VERSION) err('workspace-version', 'capabilityVersion', 'Arbeitsbereiche brauchen capabilityVersion ' + VERSION + '.');
    var w = p.workspace;
    if (!object(w) || !Array.isArray(w.nodes) || !w.nodes.length || w.nodes.length > B.nodes || !w.nodes.every(object)) {
      err('workspace-nodes', 'workspace.nodes', 'Der Arbeitsbereich braucht 1 bis ' + B.nodes + ' gültige Einträge.'); return;
    }
    var index = nodesById(w), people = new Set((Array.isArray(p.people) ? p.people : []).filter(object).map(function (person) { return person.id; }));
    function fail(field, message) { err('workspace-field', field, message); }
    function label(x, max, field, name) {
      if (typeof x !== 'string' || !x.trim() || x.length > max || /[\r\n]/.test(x)) fail(field, name + ' braucht eine Zeile mit höchstens ' + max + ' Zeichen.');
    }
    function personIds(x, field, required) {
      if (!Array.isArray(x) || (required && !x.length) || new Set(x).size !== x.length || !x.every(function (id) { return people.has(id); })) fail(field, 'Wähle vorhandene Personen ohne Duplikate.');
    }
    var rootCount = 0;
    w.nodes.forEach(function (n, i) {
      var path = 'workspace.nodes[' + i + ']', kind = n.kind, parent = index.get(n.parent), kids = children(w, n.id);
      if (typeof n.id !== 'string' || !/^[a-z][a-z0-9-]{0,39}$/.test(n.id)) fail(path + '.id', 'Verwende eine ID aus Kleinbuchstaben, Ziffern und Bindestrichen.');
      label(n.name, B.name, path + '.name', 'Der Name');
      if (n.purpose != null) label(n.purpose, B.purpose, path + '.purpose', 'Der Zweck');
      if (roots.includes(kind)) {
        rootCount++;
        if (n.parent != null) fail(path + '.parent', 'Ein Team oder persönlicher Bereich hat keinen übergeordneten Eintrag.');
      } else if (typeof kind !== 'string' || !Object.hasOwn(parents, kind) || !parent || !parents[kind].includes(parent.kind)) fail(path + '.parent', 'Wähle einen gültigen übergeordneten Eintrag für diesen Typ.');
      var lineage = trail(index, n.id), top = lineage[0];
      if (!top || !roots.includes(top.kind) || lineage.filter(function (a) { return a.kind === 'folder'; }).length > 2) fail(path + '.parent', 'Der Pfad muss bei einem Team oder persönlichen Bereich beginnen und darf höchstens zwei Ordner enthalten.');
      if (kind === 'team') {
        personIds(n.members, path + '.members', true);
        if (!kids.length || kids.length > B.channels) fail(path, 'Ein Team braucht 1 bis ' + B.channels + ' Kanäle.');
      }
      if (kind === 'personal' && !people.has(n.owner)) fail(path + '.owner', 'Wähle die Person, der diese Ablage gehört.');
      if ((kind === 'personal' || kind === 'channel') && kids.filter(function (c) { return c.kind === 'storage'; }).length !== 1) fail(path, 'Dieser Eintrag braucht genau eine Dateiablage.');
      if ((kind === 'storage' || kind === 'folder') && kids.length > B.entries) fail(path, 'Eine Ablage oder ein Ordner zeigt höchstens ' + B.entries + ' Einträge.');
      if (n.sharedWith != null) {
        if (kind !== 'file' || !top || top.kind !== 'personal') fail(path + '.sharedWith', 'Diese Freigabe ist nur für persönliche Dateien vorgesehen.');
        personIds(n.sharedWith, path + '.sharedWith', false);
        if (top && Array.isArray(n.sharedWith) && n.sharedWith.includes(top.owner)) fail(path + '.sharedWith', 'Die Eigentümerin oder der Eigentümer braucht keine Freigabe.');
      }
      if (n.posts != null) {
        if (kind !== 'channel' || !Array.isArray(n.posts) || n.posts.length > B.posts) { fail(path + '.posts', 'Ein Kanal zeigt höchstens ' + B.posts + ' Beiträge.'); return; }
        n.posts.forEach(function (post, j) {
          var pp = path + '.posts[' + j + ']';
          if (!object(post)) { fail(pp, 'Ein Beitrag braucht Person, Titel und Text.'); return; }
          if (!top || !Array.isArray(top.members) || !top.members.includes(post.by)) fail(pp + '.by', 'Die Person muss zum Team gehören.');
          label(post.title, B.postTitle, pp + '.title', 'Der Titel');
          label(post.text, B.postText, pp + '.text', 'Der Text');
          if (post.file != null) {
            var file = index.get(post.file), filePath = trail(index, post.file);
            if (!file || file.kind !== 'file' || filePath[0] !== top) fail(pp + '.file', 'Der Link braucht eine vorhandene Datei im selben Team.');
          }
        });
      }
    });
    if (index.size !== w.nodes.length) err('workspace-duplicate', 'workspace.nodes', 'Jede Eintrags-ID darf nur einmal vorkommen.');
    if (rootCount > B.roots) fail('workspace.nodes', 'Höchstens ' + B.roots + ' Arbeitsbereiche sind möglich.');
    scenes.forEach(function (s, i) {
      if (!object(s) || !isProfile(s.profile)) return;
      var path = 'scenes[' + i + ']', base = index.get(s.root), chain = trail(index, s.selected);
      var validViewer = s.viewer == null || people.has(s.viewer);
      if (!base || !roots.includes(base.kind) || !validViewer ||
          (base.kind === 'personal' && (!s.viewer || base.owner !== s.viewer)) ||
          (base.kind === 'team' && s.viewer && (!Array.isArray(base.members) || !base.members.includes(s.viewer)))) {
        fail(path + '.root', 'Wähle einen Arbeitsbereich, den diese Person sehen darf.'); return;
      }
      if (chain.length < 2 || chain[0] !== base) fail(path + '.selected', 'Wähle einen Eintrag innerhalb dieses Arbeitsbereichs.');
      if (s.house != null && typeof s.house !== 'boolean') fail(path + '.house', 'Die Haus-Metapher braucht true oder false.');
      if (s.profile === 'workspace-scene' && (!['posts', 'files'].includes(s.tab) || (base.kind === 'personal' && s.tab !== 'files') || (chain.length > 2 && s.tab !== 'files'))) fail(path + '.tab', 'Wähle Beiträge für einen Kanal oder Dateien für die Ablage.');
    });
  }
  function model(p, scene) {
    var w = p.workspace, path = trail(nodesById(w), scene.selected), base = path[0], active = path[1];
    var storage = base.kind === 'personal' ? active : children(w, active.id).find(function (n) { return n.kind === 'storage'; });
    var selected = path[path.length - 1];
    var folder = selected.kind === 'file' ? path[path.length - 2] : selected.kind === 'folder' ? selected : storage;
    return { base: base, active: active, storage: storage, selected: selected, path: path,
      channels: base.kind === 'team' ? children(w, base.id) : [],
      folder: folder, entries: children(w, folder.id), house: !!scene.house, viewer: scene.viewer || null };
  }

  return { VERSION: VERSION, budgets: B, profiles: profiles, isProfile: isProfile, check: check,
    model: model, children: children, trail: trail, index: nodesById, canSee: canSee };
});
