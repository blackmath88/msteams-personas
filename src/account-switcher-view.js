/* A self-contained vector crop of the Teams desktop profile menu. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AccountSwitcherView = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  var W = 480;
  var C = { ink: '#242424', muted: '#494949', faint: '#616161', border: '#d1d1d1', gray: '#f4f4f4', white: '#fff', purple: '#514aa2', selection: '#eeecfb' };
  function esc(value) { return String(value).replace(/[&<>"']/g, function (v) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[v]; }); }
  function rect(x, y, w, h, color, radius, extra) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (radius || 0) + '" fill="' + color + '"' + (extra || '') + '/>'; }
  function circle(x, y, r, fill, stroke) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="2"' : '') + '/>'; }
  function text(value, x, y, size, opts) {
    opts = opts || {};
    return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + (opts.color || C.ink) + '"' +
      (opts.bold ? ' font-weight="600"' : '') + (opts.anchor ? ' text-anchor="' + opts.anchor + '"' : '') +
      (opts.essential ? ' class="as-essential"' : '') +
      (opts.width && Array.from(value).length * size * 0.54 > opts.width ? ' textLength="' + opts.width + '" lengthAdjust="spacingAndGlyphs"' : '') + '>' + esc(value) + '</text>';
  }
  function line(y) { return rect(4, y, W - 8, 1, C.border); }
  function chevron(x, y) { return '<path d="M' + x + ' ' + (y - 6) + 'l6 6-6 6" fill="none" stroke="' + C.muted + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'; }
  function glyph(name, x, y) {
    var paths = {
      bell: 'M5 14h14l-2-3V8a5 5 0 0 0-10 0v3zm5 2a2 2 0 0 0 4 0',
      office: 'M4 19V3h10v16m0-11h5v11H4m3-12h1m3 0h1m-5 4h1m3 0h1m-5 4h1m3 0h1m4-3h1m-1 4h1',
      edit: 'M13 5H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-7M8 15l1-4 8-8 3 3-8 8z',
      external: 'M11 4h7v7m0-7-8 8m6 1v4H5V6h4'
    };
    return '<path transform="translate(' + x + ' ' + y + ')" d="' + paths[name] + '" fill="none" stroke="' + C.muted + '" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  function avatar(account, x, y, rad, active) {
    var initials = account.name.trim().split(/\s+/).slice(0, 2).map(function (w) { return Array.from(w)[0]; }).join('').toUpperCase();
    return circle(x, y, rad, account.kind === 'personal' ? '#d5e9f6' : '#dcd8f5') +
      text(initials, x, y + rad * 0.25, rad * 0.83, { bold: true, anchor: 'middle', color: '#302a72' }) +
      (active ? circle(x + rad * 0.69, y + rad * 0.69, Math.max(4, rad * 0.26), '#c62c38', C.white) : '');
  }
  function entity(id, kind, content) {
    return '<g class="as-entity" data-entity="' + esc(id) + '" data-entity-kind="' + kind + '">' + content + '</g>';
  }

  function render(vm) {
    var a = vm.account, current = vm.organisation;
    var other = a.organisations.filter(function (o) { return o.id !== current.id; });
    var y = 295, H = y + other.length * 44 + vm.otherAccounts.length * 58 + 8;
    var activeLabel = current.role === 'guest' ? current.name + ' · Gast' : current.name;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" style="display:block;font-family:var(--mtp-font, Arial, sans-serif)" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc('Teams-Profilmenü, aktiv: ' + activeLabel) + '" font-family="Segoe UI, Arial, sans-serif">' +
      rect(0, 0, W, H, '#fafafa') + rect(0, 0, W, 43, '#e9e9e9') +
      text('···', 177, 26, 23, { color: C.faint }) + text(activeLabel, 207, 27, 15, { width: 217 }) +
      entity('profile-button', 'menu', rect(438, 3, 36, 36, 'none') + avatar(a, 456, 21, 17, true)) +
      rect(3, 44, W - 6, H - 47, C.white, 9, ' stroke="' + C.border + '"') +
      entity(current.id, 'organisation', rect(12, 53, 456, 39, 'none') +
        text(activeLabel, 20, 80, 21, { width: 338, bold: true, essential: true }) + text('Abmelden', 452, 80, 15, { anchor: 'end', color: C.muted })) +
      entity(a.id, 'account', rect(12, 99, 456, 84, 'none') + avatar(a, 52, 137, 30, true) +
        text(a.name, 99, 123, 21, { width: 347, bold: true, essential: true }) +
        text(a.email, 99, 149, 17, { width: 349, essential: true }) +
        text('Konto anzeigen', 99, 173, 16, { color: C.muted }) + glyph('external', 215, 157));
    [['Beschäftigt', null], ['Benachrichtigungen pausieren', 'bell'], ['Im Büro geplant', 'office'], ['Statusmeldung festlegen', 'edit']].forEach(function (row, i) {
      var top = 187 + i * 25;
      svg += (row[1] ? glyph(row[1], 75, top + 1) : circle(85, top + 12, 8, '#c62c38')) +
        text(row[0], 108, top + 18, 17, { color: C.muted }) + chevron(448, top + 12);
    });
    svg += line(289);
    other.forEach(function (o) {
      var highlighted = o.id === vm.highlightOrganisation;
      svg += entity(o.id, 'organisation', rect(5, y, W - 10, 43, highlighted ? C.selection : C.white, 4) +
        circle(85, y + 20, 9, 'none', highlighted ? C.purple : C.faint) +
        text(o.name, 108, y + 26, 19, { width: o.role === 'guest' ? 292 : 335, bold: true, color: highlighted ? '#352d7a' : C.ink, essential: true }) +
        (o.role === 'guest' ? text('Gast', 449, y + 25, 17, { anchor: 'end', color: C.muted, essential: true }) : ''));
      y += 44;
    });
    vm.otherAccounts.forEach(function (account) {
      svg += entity(account.id, 'account', rect(5, y, W - 10, 56, C.gray, 4) +
        avatar(account, 49, y + 28, 21, false) +
        text(account.name, 86, y + 24, 19, { width: 270, bold: true, essential: true }) +
        text(account.email, 86, y + 44, 17, { width: 360, color: C.muted, essential: true }) +
        text(account.kind === 'personal' ? 'Privat' : 'Geschäftlich', 448, y + 23, 14, { anchor: 'end', color: C.muted }));
      y += 58;
    });
    return { svg: svg + '</svg>', width: W, height: H };
  }

  function compose(vm) {
    var crop = render(vm.accountSwitcher);
    return '<div class="slide" style="width:1920px;height:1080px;background:#f3f2f8">' +
      '<header class="sl-h"><p class="sl-k">Microsoft Teams · Profilmenü</p><h2>' + esc(vm.title) + '</h2></header>' +
      '<div style="position:absolute;left:140px;top:176px;transform-origin:top left;transform:scale(' + Math.min(2, 790 / crop.height) + ')">' + crop.svg + '</div>' +
      '<aside style="position:absolute;left:1130px;top:326px;width:650px;color:#242424;font-size:31px">' +
      '<p><strong>Aktive Organisation</strong><br>' + esc(vm.accountSwitcher.organisation.name) + '</p>' +
      '<p><strong>Angemeldetes Konto</strong><br>' + esc(vm.accountSwitcher.account.email) + '</p></aside>' +
      '<p class="sl-foot"><span>Fiktives Beispiel · nachgebildete Oberfläche</span></p></div>';
  }
  return { render: render, compose: compose };
});
