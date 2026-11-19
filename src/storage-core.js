/* Capability 7: the storage story «Rucksack & Regal» (OneDrive = one person, SharePoint = the team). */
(function (root, factory) {
  var value = factory();
  if (typeof module === 'object' && module.exports) module.exports = value;
  else root.StorageCore = value;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  var VERSION = 7, VARIANTS = ['a', 'b', 'c'];
  var profiles = {
    'storage-metaphor': { label: 'Prinzip: Rucksack und Regal', renderer: 'storage', minCapabilityVersion: VERSION, needs: ['title', 'owner', 'team', 'channel'], budgets: { title: 40, team: 40, channel: 30 } }
  };
  var obj = function (x) { return x && typeof x === 'object' && !Array.isArray(x); };
  var str = function (x) { return typeof x === 'string' && x.trim().length > 0; };
  function isProfile(s) { return typeof s === 'string' && Object.prototype.hasOwnProperty.call(profiles, s); }
  function check(p, err) {
    var people = Object.create(null);
    (Array.isArray(p.people) ? p.people : []).forEach(function (x) { if (obj(x) && typeof x.id === 'string') people[x.id] = x; });
    (Array.isArray(p.scenes) ? p.scenes : []).forEach(function (sc, i) {
      if (!obj(sc) || !isProfile(sc.profile)) return;
      var path = 'scenes[' + i + ']', B = profiles[sc.profile].budgets;
      if (p.capabilityVersion < VERSION) err('profile-version', path + '.profile', 'Diese Ansicht braucht capabilityVersion ' + VERSION + '.');
      ['title', 'team', 'channel'].forEach(function (k) {
        if (!str(sc[k])) err('storage-field', path + '.' + k, 'Rucksack und Regal: «' + k + '» fehlt oder ist kein Text.');
        else if (sc[k].length > B[k]) err('storage-long', path + '.' + k, 'Rucksack und Regal: «' + k + '» ist länger als ' + B[k] + ' Zeichen.');
      });
      if (!people[sc.owner]) err('storage-owner', path + '.owner', 'Rucksack und Regal: «owner» muss eine Person aus people sein.');
      if (sc.crops != null && typeof sc.crops !== 'boolean') err('type', path + '.crops', 'Rucksack und Regal: «crops» muss true oder false sein.', { expected: 'boolean' });
      if (sc.variant != null && VARIANTS.indexOf(sc.variant) < 0) err('storage-variant', path + '.variant', 'Rucksack und Regal: «variant» ist a, b oder c.');
    });
  }
  function model(p, sc) { return { scene: sc, variant: sc.variant || 'a', crops: sc.crops !== false }; }
  return { profiles: profiles, isProfile: isProfile, check: check, model: model, VERSION: VERSION };
});
