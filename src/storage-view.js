/* Storage story slides. The pictures come from src/metaphors.js; the UI crops reuse the Teams classes of src/m365.css. */
(function (root) {
  var E = root.Views.esc, A = root.M365, M = root.Metaphors;
  /* Review variants of the look (docs/review/storage). One of them becomes the fixed look. */
  var LOOK = {
    a: { stroke: 2.5, look: 'flat' },
    b: { stroke: 4.5, look: 'flat' },
    c: { stroke: 2.5, look: 'print' }
  };
  function genitive(name) { var first = String(name).split(' ')[0]; return /[sxzß]$/i.test(first) ? first + '’' : first + 's'; }
  function opts(v, extra) { return Object.assign({}, LOOK[v], extra); }
  function railCrop() {
    return '<div class="st-crop st-crop-rail" aria-hidden="true"><nav class="t-rail">' + [['calls', 'Anrufe'], ['onedrive', 'OneDrive']].map(function (r) {
      return '<span class="t-ri">' + A.fi(r[0]) + '<small>' + r[1] + '</small></span>';
    }).join('') + '</nav></div>';
  }
  function tabCrop(sc) {
    return '<div class="st-crop st-crop-tabs" aria-hidden="true"><header class="t-ch"><span class="t-tile t-tile-l t-tile-1">' + E(root.Views.initials(sc.team)) + '</span><div class="t-chn"><p><strong># ' + E(sc.channel) + '</strong></p>' +
      '<div class="t-tabs"><button type="button" tabindex="-1" aria-selected="true">Beiträge</button><button type="button" tabindex="-1">Dateien</button><span class="t-tabplus">' + A.fi('plus') + '</span></div></div></header></div>';
  }
  function side(cls, badge, name, equals, picture, caption, lines, crop, cropCaption) {
    return '<section class="st-side ' + cls + '"><div class="st-picture">' + picture + '<p class="st-caption">' + caption + '</p></div>' +
      '<div class="st-text"><p class="st-badge">' + badge + '</p><h3>' + name + '</h3><p class="st-equals">' + equals + '</p>' +
      '<ul>' + lines.map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ul></div>' +
      (crop ? '<div class="st-where"><p>' + cropCaption + '</p>' + crop + '</div>' : '') + '</section>';
  }
  function metaphor(vm) {
    var m = vm.storage, sc = m.scene, v = m.variant, who = vm.person(sc.owner);
    var left = v === 'c' ? '<span class="st-duo">' + M.person(opts(v, { size: 290 })) + M.rucksack(opts(v, { size: 240 })) + '</span>' : M.rucksack(opts(v, { size: 380 }));
    var right = v === 'c' ? '<span class="st-inhouse">' + M.haus(opts(v, { size: 300, open: true })) + '<span>' + M.regal(opts(v, { size: 132 })) + '</span></span>' : M.regal(opts(v, { size: 380 }));
    var pointers = !m.crops ? '' : '<svg class="st-pointers" viewBox="0 0 1920 1080" aria-hidden="true">' +
      M.kreis(550, 834, 58, 50) + (v === 'c' ? M.pfeil(488, 812, 476, 652, [450, 740]) : M.pfeil(490, 815, 420, 694, [470, 720])) +
      M.kreis(1641, 844, 56, 30) + (v === 'c' ? M.pfeil(1590, 884, 1346, 660, [1300, 960]) : M.pfeil(1590, 884, 1350, 736, [1310, 960])) + '</svg>';
    return '<div class="slide st-slide st-metaphor st-v-' + v + (m.crops ? '' : ' st-nocrops') + '" style="width:1920px;height:1080px">' +
      '<header class="st-head"><p class="st-eyebrow">Prinzip · Wo liegt die Datei?</p><h2>' + E(sc.title) + '</h2>' +
      '<p class="st-deck">Der Rucksack gehört dir. Das Regal gehört dem Haus.</p></header>' +
      '<div class="st-sides">' +
      side('st-rucksack', 'Die Ausnahme', 'Rucksack', '= OneDrive «Eigene Dateien»', left, E(genitive(who.name)) + ' Rucksack',
        ['Gehört <strong>einer Person</strong>', 'Für das, was wirklich nur meins ist', 'Geht mit, wenn die Person geht'],
        m.crops && railCrop(), 'In Teams:<br>links «OneDrive»') +
      side('st-regal', 'Der Normalfall', 'Regal', '= SharePoint hinter «Dateien»', right, v === 'c' ? 'Regal im Haus<br>«' + E(sc.team) + '»' : 'Regal im Zimmer<br>«' + E(sc.channel) + '»',
        ['Gehört <strong>dem Haus</strong> (Team)', 'Für unsere Dateien, auch für Unfertiges', 'Bleibt, wenn jemand auszieht'],
        m.crops && tabCrop(sc), 'In Teams: Reiter «Dateien» im Kanal') +
      '</div>' + pointers +
      '<footer class="st-foot"><span>Fiktives Beispiel · nachgebildete Oberfläche, kein Produkt von Microsoft</span>' +
      '<span><strong>Haus</strong> = Team · <strong>Zimmer</strong> = Kanal · <strong>Regal</strong> = Dateiablage · <strong>Schublade</strong> = Ordner · <strong>Schlüssel</strong> = Mitgliedschaft</span></footer></div>';
  }
  function compose(vm) { return metaphor(vm); }
  root.StorageView = { compose: compose };
})(window);
