/*
 * Components: one M365 screen, or an excerpt of it, as a picture for the trainer's own slide.
 * Unlike ProjectRender.renderAll() there is no heading, side explanation or footer: the
 * trainer's slide (or deck builder) supplies those. Used by the CLI and the MCP server via
 * tools/render.mjs; the website can call the same function.
 *
 * Per component: compile the scene → render the app at its native size (M365.W × M365.H) →
 * remove entities that are not selected → measure the crop box, entity anchors and the smallest
 * essential text → PNG of the crop only. Anchors are normalised to the picture ([x, y, w, h],
 * 0..1), so a slide can place callouts by entity ID at any picture size.
 *
 * All-or-nothing like renderAll(): any failing component makes the whole result ok:false.
 */
(function (root) {
  var PC = root.ProjectCore, X = root.Export, A = root.M365;
  var ATTRIBUTION = 'Fiktives Beispiel · nachgebildete Oberfläche, kein Produkt von Microsoft';
  /* Per component type: entity elements, the list that holds them, and the essential text. */
  var DOM = {
    'teams.channel': { item: '.t-post', list: '.t-posts', text: '.t-tx', kind: 'post' },
    'teams.chat': { item: '.c-msg', list: '.c-msgs', text: '.c-bub > p:last-child', kind: 'message' },
    'planner.board': { item: '.p-card', list: '.p-board', text: '.p-ct', kind: 'task' }
  };
  var PAD = 16;

  function diag(code, message, extra) { return Object.assign({ code: code, path: '', message: message, severity: 'error' }, extra || {}); }
  function toDataUrl(b) { return new Promise(function (r, j) { var f = new FileReader(); f.onload = function () { r(f.result); }; f.onerror = function () { j(new Error('PNG konnte nicht gelesen werden')); }; f.readAsDataURL(b); }); }
  function visible(el) { return el.offsetParent !== null && el.getBoundingClientRect().height > 0; }
  function round(n) { return Math.round(n * 10000) / 10000; }

  function context(p, c) {
    var sc = p.scenes.filter(function (s) { return s.id === c.scene; })[0];
    if (c.type === 'teams.channel') return 'Microsoft Teams · ' + sc.team + ' › ' + (sc.channel || 'Allgemein');
    if (c.type === 'teams.chat') return 'Microsoft Teams · Chat';
    return 'Planner · ' + sc.team + (c.view === 'bucket' ? ' › ' + c.select : '');
  }

  /* Crop box in app px for the view, after unselected entities are hidden. */
  function cropBox(app, c, D) {
    var R = app.getBoundingClientRect(), rel = function (r) { return { l: r.left - R.left, t: r.top - R.top, r: r.right - R.left, b: r.bottom - R.top }; };
    if (c.view === 'window' || c.view === 'board') return { x: 0, y: 0, w: A.W, h: A.H };
    var parts, pad = PAD;
    if (c.view === 'bucket') { parts = [app.querySelector('.p-bucket[data-bucket="' + CSS.escape(c.select) + '"]')]; pad = 8; /* buckets sit 16 px apart */ }
    else {
      var list = app.querySelector(D.list), items = Array.prototype.filter.call(app.querySelectorAll(D.item), visible);
      if (!list || !items.length) return null;
      var L = rel(list.getBoundingClientRect());
      parts = items;
      /* full list width, so avatars and own-message alignment stay as in the app */
      var u = items.map(function (el) { return rel(el.getBoundingClientRect()); }).reduce(function (a, b) { return { l: a.l, t: Math.min(a.t, b.t), r: a.r, b: Math.max(a.b, b.b) }; }, { l: L.l, t: Infinity, r: L.r, b: -Infinity });
      return clamp(u);
    }
    if (!parts[0]) return null;
    return clamp(rel(parts[0].getBoundingClientRect()));
    function clamp(u) {
      var x = Math.max(0, Math.floor(u.l - pad)), y = Math.max(0, Math.floor(u.t - pad));
      return { x: x, y: y, w: Math.min(A.W, Math.ceil(u.r + pad)) - x, h: Math.min(A.H, Math.ceil(u.b + pad)) - y };
    }
  }

  function measure(app, box, D) {
    var R = app.getBoundingClientRect();
    function norm(el) {
      var r = el.getBoundingClientRect(), x = r.left - R.left - box.x, y = r.top - R.top - box.y;
      return [round(x / box.w), round(y / box.h), round(r.width / box.w), round(r.height / box.h)];
    }
    function inside(b) { return b[0] >= -0.001 && b[1] >= -0.001 && b[0] + b[2] <= 1.001 && b[1] + b[3] <= 1.001; }
    var anchors = [];
    Array.prototype.forEach.call(app.querySelectorAll(D.item + '[data-entity]'), function (el) {
      if (!visible(el)) return;
      var b = norm(el); if (!inside(b)) return;
      anchors.push({ entity: el.getAttribute('data-entity'), kind: D.kind, box: b });
    });
    Array.prototype.forEach.call(app.querySelectorAll('.p-bucket[data-bucket]'), function (el) {
      var b = norm(el); if (inside(b) && el.getAttribute('data-bucket')) anchors.push({ entity: el.getAttribute('data-bucket'), kind: 'bucket', box: b });
    });
    var marks = Array.prototype.filter.call(app.querySelectorAll('.m-mk'), visible).map(function (el) { return { mark: +el.textContent, box: norm(el) }; }).filter(function (m) { return inside(m.box); });
    var sizes = Array.prototype.filter.call(app.querySelectorAll(D.text), visible).filter(function (el) { return inside(norm(el)); }).map(function (el) { return parseFloat(getComputedStyle(el).fontSize); });
    return { anchors: anchors, marks: marks, textPx: sizes.length ? Math.min.apply(null, sizes) : null };
  }

  function renderOne(p, c, host, scale) {
    var D = DOM[c.type], vm = PC.compileScene(p, c.scene);
    var html = vm && A.app(vm, PC.capabilities().profiles[c.profile].renderer, { annot: c.marks });
    if (!html) return Promise.reject(new Error('Szene «' + c.scene + '» konnte nicht gezeichnet werden.'));
    host.innerHTML = '<div class="slide slide-cmp" style="width:' + A.W + 'px;height:' + A.H + 'px;background:#fff"><div class="sl-in" style="width:' + A.W + 'px;height:' + A.H + 'px">' + html + '</div></div>';
    var frame = host.firstChild, inner = frame.firstChild, app = inner.firstElementChild;
    var picked = Array.isArray(c.select) ? c.select : null;
    if (picked) Array.prototype.forEach.call(app.querySelectorAll(D.item), function (el) { if (picked.indexOf(el.getAttribute('data-entity')) < 0) el.remove(); });
    var list = c.width && app.querySelector(D.list);
    if (list) { list.style.width = c.width + 'px'; list.style.flex = '1 0 auto'; list.style.alignSelf = 'flex-start'; }
    var problems = X.fitIssues(frame);
    var box = cropBox(app, c, D);
    if (!box) return Promise.reject(new Error('Für «' + c.view + '» wurde nichts gefunden.'));
    var m = measure(app, box, D);
    frame.style.width = box.w + 'px'; frame.style.height = box.h + 'px';
    inner.style.transform = 'translate(' + (-box.x) + 'px,' + (-box.y) + 'px)';
    var R = PC.components().readability;
    return X.toPNG(frame, scale, box.w, box.h).then(function (blob) {
      return toDataUrl(blob).then(function (d) {
        return {
          index: c.index, type: c.type, scene: c.scene, view: c.view, select: c.select, marks: c.marks, reflowWidth: c.width,
          file: PC.componentFile(p, c), width: box.w * scale, height: box.h * scale, bytes: blob.size, dataUrl: d,
          excerpt: c.view !== 'window' && c.view !== 'board', crop: [box.x, box.y, box.w, box.h],
          anchors: m.anchors, markers: m.marks,
          text: { essentialPx: m.textPx, minTextPt: R.minTextPt, minPlacedWidthIn: m.textPx ? Math.round(R.minTextPt * box.w / (72 * m.textPx) * 100) / 100 : null },
          context: context(p, c), attribution: ATTRIBUTION, fit: problems
        };
      });
    });
  }

  /* specs: [{ scene, type?, view?, select?, marks? }]. opts: { scale: 1|2 } (default 2: crisp when enlarged). */
  function render(p, specs, opts) {
    opts = opts || {};
    var scale = opts.scale || 2, v = PC.validateComponents(p, specs);
    var base = { componentVersion: PC.COMPONENT_VERSION, rendererVersion: PC.RENDERER_VERSION, scale: scale };
    if (!v.ok) return Promise.resolve(Object.assign(base, { ok: false, stage: 'validate', components: [], diagnostics: v.errors.concat(v.warnings) }));
    var host = document.createElement('div'), out = [], problems = [];
    host.className = 'export-host'; document.body.appendChild(host);
    var chain = document.fonts ? document.fonts.ready : Promise.resolve();
    v.components.forEach(function (c) {
      chain = chain.then(function () { return renderOne(p, c, host, scale); }).then(function (r) {
        r.fit.forEach(function (f) { problems.push(diag('fit', 'Komponente ' + (c.index + 1) + ': Inhalt passt nicht (' + f + ').', { path: 'components[' + c.index + ']', detail: f })); });
        out.push(r);
      }, function (e) { problems.push(diag('render', 'Komponente ' + (c.index + 1) + ': ' + e.message, { path: 'components[' + c.index + ']' })); });
    });
    return chain.then(function () {
      host.remove();
      var ok = !problems.length && out.length === v.components.length;
      return Object.assign(base, { ok: ok, stage: ok ? 'done' : 'render', components: out, diagnostics: problems.concat(v.warnings) });
    }, function (e) {
      host.remove();
      return Object.assign(base, { ok: false, stage: 'render', components: out, diagnostics: problems.concat([diag('render', 'Export abgebrochen: ' + e.message)], v.warnings) });
    });
  }

  root.ProjectComponents = { render: render, ATTRIBUTION: ATTRIBUTION };
})(window);
