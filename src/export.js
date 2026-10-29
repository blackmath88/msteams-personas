/*
 * Slide compositions (1920 x 1080) and PNG export.
 *
 * The same composition HTML is used for the presentation stage and for the PNG, so what is
 * previewed is what is exported. PNG rendering is dependency-free: the composition plus all
 * same-origin CSS and the icon sprite are serialised into an SVG <foreignObject>, drawn on a
 * canvas and saved via canvas.toBlob. Everything stays local; no CDN, API or backend.
 *
 * Kinds: 'app' (clean application view), 'folie' (annotated teaching slide),
 *        'vergleich' (before/after: Explorer copies vs SharePoint library), 'prinzip'.
 */
(function (root) {
  var V = root.Views, A = root.M365, esc = V.esc;
  var SW = 1920, SH = 1080;
  var TOOL_LABEL = { teams: 'Microsoft Teams', outlook: 'Outlook', explorer: 'Windows Explorer', sharepoint: 'SharePoint' };

  function scaled(html, s, cls, w, h) {
    w = w || A.W; h = h || A.H;
    return '<div class="sl-app ' + (cls || '') + '" style="width:' + Math.round(w * s) + 'px;height:' + Math.round(h * s) + 'px"><div class="sl-in' + (cls === 'sl-pr' ? ' stage-in' : '') + '" style="width:' + w + 'px;height:' + h + 'px;transform:scale(' + s + ')">' + html + '</div></div>';
  }
  function foot(vm, extra) {
    var a = vm.variant && vm.variant.assumption ? 'Annahme: ' + vm.fill(vm.variant.assumption) : '';
    return '<p class="sl-foot"><span>Fiktives Beispiel · nachgebildete Oberfläche, kein Produkt von Microsoft · ' + esc(vm.title) + '</span>' +
      (a || extra ? '<span class="sl-assume">' + esc([extra, a].filter(Boolean).join(' · ')) + '</span>' : '') + '</p>';
  }

  /* Returns the slide HTML, or null if the combination is not available. */
  function compose(vm, p, kind, principleMeta) {
    if (p.mode === 'prinzip') {
      var pid = principleMeta ? principleMeta.id : 'chat';
      return '<div class="slide slide-prinzip" data-kind="prinzip" style="width:' + SW + 'px;height:' + SH + 'px">' +
        scaled(V.principle(vm, pid, principleMeta, { annot: p.annot, stage: true }), 1.08, 'sl-pr', 1600, 900) + foot(vm) + '</div>';
    }
    var tool = A.toolOf(p.sub);
    if (kind === 'vergleich') {
      if (!vm.story) return null;
      var st = vm.story;
      return '<div class="slide slide-cmp" data-kind="vergleich" style="width:' + SW + 'px;height:' + SH + 'px">' +
        '<header class="sl-h"><p class="sl-k">Vorher / Nachher · ' + esc(vm.team) + '</p><h2>Von ' + st.copies.length + ' Kopien zu einer gemeinsamen Datei</h2></header>' +
        '<div class="sl-cmp"><figure><figcaption><b>Vorher</b> Kopien aus Mail-Anhängen im Downloads-Ordner</figcaption>' + scaled(A.explorer(vm, { annot: false }), 0.605) + '</figure>' +
        '<figure><figcaption><b>Nachher</b> «' + esc(st.doc.name) + '» einmal in der Bibliothek des Teams</figcaption>' + scaled(A.sharepoint(vm, { annot: false }), 0.605) + '</figure></div>' +
        '<p class="sl-chain">' + st.copies.map(function (c) { return '<span>' + esc(c.name) + '</span>'; }).join('') + '<b>→</b><strong>' + esc(st.doc.name) + '</strong></p>' +
        foot(vm) + '</div>';
    }
    var html = vm.scene.personal ? '<div class="sl-legacy" style="width:' + A.W + 'px;height:' + A.H + 'px">' + V.scene(vm, { annot: kind === 'folie', stage: true }) + '</div>' : A.app(vm, p.sub, { annot: kind === 'folie' });
    if (!html) return null;
    if (kind === 'app' || vm.scene.personal) {
      return '<div class="slide slide-app" data-kind="app" style="width:' + SW + 'px;height:' + SH + 'px">' + scaled(html, 1.2) + foot(vm) + '</div>';
    }
    var notes = A.notes(vm, p.sub);
    return '<div class="slide slide-folie" data-kind="folie" style="width:' + SW + 'px;height:' + SH + 'px">' +
      '<header class="sl-h"><p class="sl-k">' + esc(TOOL_LABEL[tool]) + ' · ' + esc(vm.team) + '</p><h2>' + esc(vm.title) + '</h2></header>' +
      '<div class="sl-row">' + scaled(html, 0.93) +
        '<aside class="sl-notes"><p class="sl-nh">Was hier zu sehen ist</p><ol>' + notes.map(function (n) {
          return '<li><span class="m-mk">' + n[0] + '</span><span>' + esc(n[1]) + '</span></li>';
        }).join('') + '</ol>' + (vm.scene.outside && vm.scene.outside.length && tool === 'teams' ? '<p class="sl-out"><strong>Bleibt ausserhalb</strong>' + vm.scene.outside.map(esc).join(' · ') + '</p>' : '') + '</aside></div>' +
      foot(vm) + '</div>';
  }

  /* Fit check: reports content that does not fit instead of silently cutting it. */
  function fitIssues(el) {
    var out = [];
    Array.prototype.forEach.call(el.querySelectorAll('.t-posts'), function (c) {
      var f = c.firstElementChild; if (f && f.getBoundingClientRect().top < c.getBoundingClientRect().top - 1) out.push('Beiträge oben abgeschnitten');
    });
    Array.prototype.forEach.call(el.querySelectorAll('.o-read, .s-lib, .x-main, .t-files, .t-tasks, .t-content, .slide > .sl-app .pr, .sl-notes'), function (c) {
      if (c.scrollHeight > c.clientHeight + 2) out.push(c.className.split(' ')[0] + ' zu lang');
    });
    return out;
  }

  /* Long principle texts: step down density (same rules as the earlier stage), then report. */
  function densify(slideEl) {
    var inner = slideEl.querySelector('.sl-pr .sl-in'); if (!inner) return;
    var pr = inner.querySelector('.pr'), over = function () { return pr.scrollHeight > pr.clientHeight + 2; };
    inner.classList.remove('dense', 'denser');
    if (over()) inner.classList.add('dense');
    if (over()) inner.classList.add('denser');
  }

  var cssCache = null;
  function allCss() {
    if (cssCache) return cssCache;
    var t = [];
    Array.prototype.forEach.call(document.styleSheets, function (ss) {
      try { Array.prototype.forEach.call(ss.cssRules, function (r) { t.push(r.cssText); }); } catch (e) { /* cross-origin sheet: none expected */ }
    });
    return (cssCache = t.join('\n'));
  }

  /* Render a slide element (already in the DOM, unscaled size SW x SH) to a PNG blob. */
  function toPNG(slideEl, scale) {
    scale = scale || 1;
    var wrap = document.createElement('div');
    wrap.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    wrap.className = 'export-root';
    var style = document.createElement('style'); style.textContent = allCss() + '\n.export-root{margin:0}';
    wrap.appendChild(style);
    var sprite = document.querySelector('body > svg'); if (sprite) wrap.appendChild(sprite.cloneNode(true));
    var clone = slideEl.cloneNode(true); clone.style.transform = 'none'; wrap.appendChild(clone);
    var xml = new XMLSerializer().serializeToString(wrap);
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + SW + '" height="' + SH + '"><foreignObject x="0" y="0" width="' + SW + '" height="' + SH + '">' + xml + '</foreignObject></svg>';
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        var c = document.createElement('canvas'); c.width = SW * scale; c.height = SH * scale;
        var g = c.getContext('2d'); g.scale(scale, scale); g.fillStyle = '#fff'; g.fillRect(0, 0, SW, SH); g.drawImage(img, 0, 0);
        c.toBlob(function (b) { b ? resolve(b) : reject(new Error('PNG-Erzeugung fehlgeschlagen')); }, 'image/png');
      };
      img.onerror = function () { reject(new Error('Bild konnte nicht gerendert werden')); };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  }

  function fileName(vm, p, kind) {
    var base = (vm.title + '-' + (p.mode === 'prinzip' ? 'prinzip-' + (p.sub || 'chat') : A.toolOf(p.sub) + (p.sub && p.sub !== A.toolOf(p.sub) ? '-' + p.sub : '')) + '-' + kind).toLowerCase()
      .replace(/[äÄ]/g, 'ae').replace(/[öÖ]/g, 'oe').replace(/[üÜ]/g, 'ue').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return base + '.png';
  }
  function download(blob, name) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
  }

  root.Export = { compose: compose, toPNG: toPNG, fitIssues: fitIssues, densify: densify, fileName: fileName, download: download, W: SW, H: SH };
})(window);
