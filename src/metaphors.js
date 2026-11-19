/*
 * Drawn metaphors for the storage story («Rucksack & Regal»): rucksack, regal, haus, person,
 * schluessel, plus the accent arrow and circle used to point at them.
 *
 * Every picture is an SVG string built from fixed coordinates: same input, same picture, every
 * time. No images, no randomness. Colours are the Teams purples of the house slides (src/workspace.css), no mint and no red.
 * One signal colour (amber, as in src/m365.css) carries highlight, cross, circle and arrow.
 * The outline keeps its width in slide pixels whatever the size of the object.
 *
 * Options shared by all objects:
 *   size       height of the drawing in px (the width follows)
 *   stroke     outline width in px (default 2.5)
 *   look       'flat' (default) or 'print' (fills sit slightly beside the outline)
 *   highlight  amber outline; regal also accepts a drawer number (1 or 2)
 *   empty      emptied: no fills, dashed outline
 *   crossed    amber cross over the object
 *   label      caption under the object
 */
(function (root, factory) {
  var value = factory();
  if (typeof module === 'object' && module.exports) module.exports = value;
  else root.Metaphors = value;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  var C = { ink: '#202239', ink2: '#4B4D68', lilac: '#D8D9ED', tint: '#EEEFFC', accent: '#5B5FC7', signal: '#E8A200', purple: '#6264A7', grey: '#C8C9D4', pale: '#F5F5F5', white: '#FFFFFF' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function n(x) { return Math.round(x * 100) / 100; }
  function rr(x, y, w, h, r) { r = r || 0; return 'M' + (x + r) + ' ' + y + 'H' + (x + w - r) + 'Q' + (x + w) + ' ' + y + ' ' + (x + w) + ' ' + (y + r) + 'V' + (y + h - r) + 'Q' + (x + w) + ' ' + (y + h) + ' ' + (x + w - r) + ' ' + (y + h) + 'H' + (x + r) + 'Q' + x + ' ' + (y + h) + ' ' + x + ' ' + (y + h - r) + 'V' + (y + r) + 'Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y + 'Z'; }
  function circ(cx, cy, r) { return 'M' + (cx - r) + ' ' + cy + 'a' + r + ' ' + r + ' 0 1 0 ' + (2 * r) + ' 0a' + r + ' ' + r + ' 0 1 0 ' + (-2 * r) + ' 0Z'; }

  /* A shape is [path, fill or null, 'hl' when it carries the highlight]. */
  function draw(shapes, o, sw) {
    var off = o.look === 'print' ? sw * 1.6 : 0;
    return shapes.map(function (s) {
      var fill = o.empty ? null : s[1], hl = s[2] === 'hl' && o.highlight;
      var line = '<path d="' + s[0] + '" fill="' + (off || !fill ? 'none' : fill) + '" stroke="' + (hl ? C.signal : C.ink) + '" stroke-width="' + n(hl ? sw * 1.8 : sw) + '"' + (o.empty ? ' stroke-dasharray="' + n(sw * 3) + ' ' + n(sw * 2.4) + '"' : '') + '/>';
      return (off && fill ? '<path d="' + s[0] + '" fill="' + fill + '" stroke="none" transform="translate(' + n(off) + ' ' + n(off) + ')"/>' : '') + line;
    }).join('');
  }
  function frame(name, w, h, o, inner) {
    o = o || {};
    var size = o.size || h, k = size / h, sw = (o.stroke || 2.5) / k, pad = sw * 3;
    var labelH = o.label ? 46 / k : 0, fs = 26 / k;
    if (o.label) pad = Math.max(pad, (String(o.label).length * fs * 0.6 - w) / 2); /* room for a caption wider than the object */
    var body = inner(sw);
    if (o.crossed) body += '<path d="M' + n(w * 0.12) + ' ' + n(h * 0.12) + 'L' + n(w * 0.88) + ' ' + n(h * 0.88) + 'M' + n(w * 0.88) + ' ' + n(h * 0.12) + 'L' + n(w * 0.12) + ' ' + n(h * 0.88) + '" fill="none" stroke="' + C.signal + '" stroke-width="' + n(sw * 2.6) + '"/>';
    if (o.label) body += '<text x="' + n(w / 2) + '" y="' + n(h + labelH * 0.72) + '" text-anchor="middle" font-size="' + n(fs) + '" font-weight="600" fill="' + C.ink + '" stroke="none">' + esc(o.label) + '</text>';
    return '<svg class="mx mx-' + name + '" xmlns="http://www.w3.org/2000/svg" width="' + Math.round((w + 2 * pad) * k) + '" height="' + Math.round((h + labelH + 2 * pad) * k) + '" viewBox="' + n(-pad) + ' ' + n(-pad) + ' ' + n(w + 2 * pad) + ' ' + n(h + labelH + 2 * pad) + '" role="img" aria-label="' + esc(o.label || name) + '">' +
      '<g fill="none" stroke="' + C.ink + '" stroke-linejoin="round" stroke-linecap="round" fill-rule="evenodd">' + body + '</g></svg>';
  }

  /* Rucksack = OneDrive: belongs to one person. sidePocket (true or 'highlight') = «Microsoft Teams Chat Files». */
  function rucksack(o) {
    o = o || {};
    return frame('rucksack', 200, 240, o, function (sw) {
      var shapes = [
        ['M46 78C18 96 14 150 30 206L45 201C33 152 37 108 57 90Z', C.grey],
        ['M154 78C182 96 186 150 170 206L155 201C167 152 163 108 143 90Z', C.grey],
        ['M77 40C74 6 126 6 123 40L112 40C113 21 87 21 88 40Z', C.grey],
        ['M42 86C41 46 70 30 100 30C130 30 159 46 158 86L164 198C165 214 154 225 140 225L60 225C46 225 35 214 36 198Z', C.purple, 'hl']
      ];
      if (o.sidePocket) shapes.push(['M161 138L177 143C183 145 186 150 186 157L186 190C186 198 181 203 173 203L164 203Z', o.sidePocket === 'highlight' ? C.signal : C.grey]);
      shapes.push(
        ['M42 86C41 46 70 30 100 30C130 30 159 46 158 86L158 101C140 118 60 118 42 101Z', C.lilac],
        [rr(92, 88, 16, 42, 3), C.grey],
        [rr(87, 124, 26, 15, 4), C.accent],
        [rr(62, 152, 76, 56, 13), C.tint],
        ['M74 168H126', null]
      );
      return draw(shapes, o, sw);
    });
  }

  /* One cabinet: open shelves with binders on top, two drawers (Schublade = Ordner) below. */
  function cabinet(o, drawers) {
    var hl = o.highlight, shapes = [
      [rr(34, 262, 15, 14, 2), C.ink2], [rr(191, 262, 15, 14, 2), C.ink2],
      [rr(20, 18, 200, 248, 6), C.white, hl === true ? 'hl' : ''],
      [rr(12, 8, 216, 18, 6), C.grey],
      [rr(20, 86, 200, 8, 0), C.grey]
    ];
    if (!o.empty) shapes.push(
      [rr(34, 40, 18, 46, 2), C.purple], [rr(54, 34, 22, 52, 2), C.lilac], [rr(78, 44, 15, 42, 2), C.grey],
      ['M101 86L118 40L134 46L117 86Z', C.purple], [rr(160, 36, 22, 50, 2), C.lilac], [rr(184, 46, 18, 40, 2), C.accent],
      [rr(38, 104, 24, 50, 2), C.grey], [rr(64, 110, 18, 44, 2), C.purple], [rr(84, 100, 20, 54, 2), C.lilac],
      [rr(134, 122, 66, 32, 3), C.pale], ['M134 132H200', null]
    );
    shapes.push(
      [rr(20, 154, 200, 6, 0), C.grey],
      [rr(30, 166, 180, 42, 5), C.purple, hl === 1 ? 'hl' : ''], [rr(98, 181, 44, 10, 5), C.white],
      [rr(30, 214, 180, 42, 5), C.lilac, hl === 2 ? 'hl' : ''], [rr(98, 229, 44, 10, 5), C.white]
    );
    return shapes;
  }
  /* Regal = SharePoint library of a channel. count > 1 draws several cabinets (several channels); labels name them. */
  function regal(o) {
    o = o || {};
    var count = Math.max(1, Math.min(4, o.count || 1)), labels = o.labels || [];
    return frame('regal', 240 * count, 280, o, function (sw) {
      var out = '';
      for (var i = 0; i < count; i++) {
        out += '<g transform="translate(' + 240 * i + ' 0)">' + draw(cabinet(o), o, sw) +
          (labels[i] ? '<text x="120" y="23" text-anchor="middle" font-size="12" font-weight="700" fill="' + C.ink + '" stroke="none">' + esc(labels[i]) + '</text>' : '') + '</g>';
      }
      return out;
    });
  }

  /* Zimmer = Kanal, with its Regal as an annex on the right: the file shelf belongs to the room, not to the house as a whole. */
  function zimmer(o) {
    o = o || {};
    return frame('zimmer', 400, 300, o, function (sw) {
      var room = [[rr(10, 70, 150, 216, 0), C.tint]];
      if (!o.empty) room.push([rr(52, 170, 60, 116, 4), C.lilac], [circ(100, 232, 3), C.ink], [rr(60, 100, 44, 40, 3), C.white], ['M82 100V140M60 120H104', null]);
      room.push([rr(160, 30, 230, 256, 0), C.white, 'hl'], ['M0 286H400', null]);
      var inner = Object.assign({}, o, { highlight: false });
      return draw(room, o, sw) + '<g transform="translate(179 56) scale(.8)">' + draw(cabinet(inner), inner, sw / 0.8) + '</g>';
    });
  }

  /* Haus = Team. open: only walls and roof, so other objects can stand inside. */
  function haus(o) {
    o = o || {};
    return frame('haus', 300, 260, o, function (sw) {
      var shapes = [
        [rr(208, 30, 28, 60, 2), C.grey],
        [rr(36, 112, 228, 138, 0), C.white],
        ['M8 114L150 16L292 114Z', C.purple, 'hl']
      ];
      if (!o.open) shapes.push(
        [rr(128, 170, 46, 80, 4), C.lilac], [circ(164, 212, 3), C.ink],
        [rr(58, 138, 46, 42, 3), C.tint], ['M81 138V180M58 159H104', null],
        [rr(198, 138, 46, 42, 3), C.tint], ['M221 138V180M198 159H244', null]
      );
      shapes.push(['M14 250H286', null]);
      return draw(shapes, o, sw);
    });
  }

  /* Person. rucksack: carries it on the back. walking: strides to the right, out of the picture. */
  function person(o) {
    o = o || {};
    return frame('person', 150, 240, o, function (sw) {
      var shapes = [];
      if (o.walking) shapes.push(['M4 96H24M0 128H18M6 160H26', null]);
      if (o.rucksack) shapes.push(['M40 84C28 84 22 92 22 102L22 138C22 148 28 154 38 154L56 154L56 84Z', C.purple], ['M22 106H52', null]);
      if (o.walking) shapes.push(
        ['M62 150L36 220L24 220L24 232L50 232L80 158Z', C.ink2],
        ['M72 150L104 216L98 228L124 228L124 218L114 216L90 150Z', C.ink2]
      ); else shapes.push(
        ['M56 150L54 222L42 222L42 234L70 234L74 150Z', C.ink2],
        ['M76 150L80 222L80 234L108 234L108 222L96 222L94 150Z', C.ink2]
      );
      shapes.push(['M52 86C52 72 62 66 75 66C88 66 98 72 98 86L100 156L50 156Z', C.grey, 'hl']);
      shapes.push(o.walking ? ['M70 92L104 126L96 136L60 104Z', C.grey] : ['M66 94C62 112 62 130 65 148L78 148C75 130 76 112 80 96Z', C.grey]);
      shapes.push([circ(75, 40, 22), C.pale]);
      return draw(shapes, o, sw);
    });
  }

  /* Schlüssel = Mitgliedschaft: access comes with the house. */
  function schluessel(o) {
    o = o || {};
    return frame('schluessel', 200, 90, o, function (sw) {
      return draw([
        [rr(74, 37, 110, 16, 4), C.lilac],
        ['M146 53V72H158V53M168 53V66H178V53', C.lilac],
        [circ(45, 45, 34) + circ(45, 45, 13), C.lilac, 'hl']
      ], o, sw);
    });
  }

  /* Pointer drawn in slide coordinates: a slightly open circle and a curved arrow. */
  function kreis(cx, cy, rx, ry, sw) {
    sw = sw || 5;
    return '<path d="M' + n(cx - rx * 0.86) + ' ' + n(cy - ry * 0.62) + 'C' + n(cx - rx * 0.3) + ' ' + n(cy - ry * 1.3) + ' ' + n(cx + rx * 1.1) + ' ' + n(cy - ry * 1.1) + ' ' + n(cx + rx) + ' ' + n(cy + ry * 0.1) +
      'C' + n(cx + rx * 0.9) + ' ' + n(cy + ry * 1.2) + ' ' + n(cx - rx * 0.9) + ' ' + n(cy + ry * 1.25) + ' ' + n(cx - rx * 1.02) + ' ' + n(cy + ry * 0.05) +
      'C' + n(cx - rx * 1.08) + ' ' + n(cy - ry * 0.7) + ' ' + n(cx - rx * 0.4) + ' ' + n(cy - ry * 1.12) + ' ' + n(cx + rx * 0.2) + ' ' + n(cy - ry * 1.08) + '" fill="none" stroke="' + C.signal + '" stroke-width="' + sw + '" stroke-linecap="round"/>';
  }
  function pfeil(x1, y1, x2, y2, bend, sw) {
    sw = sw || 5; bend = bend == null ? 0.22 : bend; /* bend: curvature, or the control point [x, y] */
    var mx = Array.isArray(bend) ? bend[0] : (x1 + x2) / 2 - (y2 - y1) * bend, my = Array.isArray(bend) ? bend[1] : (y1 + y2) / 2 + (x2 - x1) * bend;
    var a = Math.atan2(y2 - my, x2 - mx), L = 26, w = 0.45;
    return '<path d="M' + n(x1) + ' ' + n(y1) + 'Q' + n(mx) + ' ' + n(my) + ' ' + n(x2) + ' ' + n(y2) +
      'M' + n(x2 - L * Math.cos(a - w)) + ' ' + n(y2 - L * Math.sin(a - w)) + 'L' + n(x2) + ' ' + n(y2) + 'L' + n(x2 - L * Math.cos(a + w)) + ' ' + n(y2 - L * Math.sin(a + w)) +
      '" fill="none" stroke="' + C.signal + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  return { rucksack: rucksack, regal: regal, haus: haus, zimmer: zimmer, person: person, schluessel: schluessel, kreis: kreis, pfeil: pfeil, colours: C };
});
