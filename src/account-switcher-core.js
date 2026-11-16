/* Fictional accounts and the organisation selected within one account. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AccountSwitcherCore = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  var VERSION = 7, PROFILE = 'teams-account-switcher';
  var ID = /^[a-z][a-z0-9-]{0,39}$/;
  var B = { accounts: 3, organisations: 4, name: 44, email: 58, organisation: 42 };
  function isProfile(value) { return value === PROFILE; }
  function object(o) { return o && typeof o === 'object' && !Array.isArray(o); }
  function find(list, id) { return list.find(function (entry) { return object(entry) && entry.id === id; }); }

  function check(p, err) {
    var scenes = Array.isArray(p.scenes) ? p.scenes : [];
    if (!scenes.some(function (s) { return object(s) && isProfile(s.profile); })) return;
    function fail(path, message) { err('account-switcher', path, message); }
    function bounded(value, max, path) {
      if (typeof value !== 'string' || !value.trim() || value.length > max || /[\r\n\t]/.test(value))
        fail(path, 'Text mit 1 bis ' + max + ' Zeichen in einer Zeile erwartet.');
    }
    var accounts = Array.isArray(p.teamsAccounts) ? p.teamsAccounts : [];
    if (!accounts.length || accounts.length > B.accounts)
      fail('teamsAccounts', 'Ein bis ' + B.accounts + ' fiktive Teams-Konten angeben.');
    var ids = new Set(['profile-button']);
    function entity(o, path) {
      if (!object(o)) { fail(path, 'Objekt erwartet.'); return false; }
      if (typeof o.id !== 'string' || !ID.test(o.id) || ids.has(o.id)) fail(path + '.id', 'Eindeutige ID erwartet.');
      ids.add(o.id);
      return true;
    }
    accounts.forEach(function (a, i) {
      var path = 'teamsAccounts[' + i + ']';
      if (!entity(a, path)) return;
      bounded(a.name, B.name, path + '.name');
      bounded(a.email, B.email, path + '.email');
      if (typeof a.email === 'string' && !/^[^\s@<>]+@(?:[a-z0-9-]+\.)*example\.(?:org|com|net)$/i.test(a.email))
        fail(path + '.email', 'Eine fiktive Adresse unter example.org, example.com oder example.net verwenden.');
      if (a.kind !== 'work' && a.kind !== 'personal') fail(path + '.kind', '«work» oder «personal» erwartet.');
      if (!Array.isArray(a.organisations) || !a.organisations.length || a.organisations.length > B.organisations) {
        fail(path + '.organisations', 'Ein bis ' + B.organisations + ' Organisationen angeben.');
        return;
      }
      a.organisations.forEach(function (o, j) {
        var op = path + '.organisations[' + j + ']';
        if (!entity(o, op)) return;
        bounded(o.name, B.organisation, op + '.name');
        if (o.role !== 'home' && o.role !== 'guest') fail(op + '.role', '«home» oder «guest» erwartet.');
      });
      if (a.organisations.filter(function (o) { return object(o) && o.role === 'home'; }).length !== 1)
        fail(path + '.organisations', 'Genau eine eigene Organisation mit «role: home» angeben.');
    });
    scenes.forEach(function (s, i) {
      if (!object(s) || !isProfile(s.profile)) return;
      var path = 'scenes[' + i + ']';
      if (p.capabilityVersion < VERSION) fail(path + '.profile', 'Diese Ansicht braucht capabilityVersion ' + VERSION + '.');
      var account = find(accounts, s.account);
      if (!account) { fail(path + '.account', 'Aktives Konto fehlt in «teamsAccounts».'); return; }
      var orgs = Array.isArray(account.organisations) ? account.organisations : [];
      if (!find(orgs, s.organisation)) fail(path + '.organisation', 'Organisation fehlt im aktiven Konto.');
      if (s.highlightOrganisation != null && (!find(orgs, s.highlightOrganisation) || s.highlightOrganisation === s.organisation))
        fail(path + '.highlightOrganisation', 'Eine andere Organisation desselben Kontos wählen.');
    });
  }

  function model(p, scene) {
    var account = find(p.teamsAccounts, scene.account);
    return { account: account, organisation: find(account.organisations, scene.organisation),
      otherAccounts: p.teamsAccounts.filter(function (a) { return a.id !== account.id; }),
      highlightOrganisation: scene.highlightOrganisation };
  }

  function example() {
    return {
      format: 'msteams-personas/project', projectVersion: 1, capabilityVersion: VERSION,
      meta: { id: 'teams-organisation-wechseln', title: 'Organisation in Teams wechseln', locale: 'de-CH', fictional: true },
      people: [{ id: 'lukas', name: 'Lukas Gerber' }], tasks: [], documents: [],
      states: [{ id: 'before', tasks: {} }, { id: 'after', tasks: {} }],
      teamsAccounts: [
        { id: 'uni-konto', kind: 'work', name: 'Lukas Gerber', email: 'lukas.gerber@unibas.example.org',
          organisations: [{ id: 'basel', name: 'Universität Basel', role: 'home' }, { id: 'partner', name: 'Partneruniversität B', role: 'guest' }] },
        { id: 'privat-konto', kind: 'personal', name: 'Lukas Gerber', email: 'lukas.gerber@example.net',
          organisations: [{ id: 'persoenlich', name: 'Microsoft Teams persönlich', role: 'home' }] }
      ],
      scenes: [
        { id: 'uni-basel', profile: PROFILE, account: 'uni-konto', organisation: 'basel', highlightOrganisation: 'partner' },
        { id: 'als-gast', profile: PROFILE, account: 'uni-konto', organisation: 'partner' },
        { id: 'privates-konto', profile: PROFILE, account: 'privat-konto', organisation: 'persoenlich' }
      ],
      slides: [
        { id: 'profilmenue', scene: 'uni-basel' }, { id: 'gastorganisation', scene: 'als-gast' }, { id: 'konto-wechseln', scene: 'privates-konto' }
      ]
    };
  }

  var profiles = {};
  profiles[PROFILE] = { label: 'Teams: Konten und Organisationen', renderer: PROFILE, minCapabilityVersion: VERSION,
    needs: ['teamsAccounts', 'account', 'organisation'], budgets: B };
  return { VERSION: VERSION, profiles: profiles, isProfile: isProfile, check: check, model: model, example: example };
});
