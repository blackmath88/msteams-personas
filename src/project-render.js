/*
 * The one render operation for projects: validate → compile → compose → densify/tighten →
 * fit check → PNG. The website export («Alle Folien als PNG») and the Node renderer
 * (tools/render.mjs, used by the CLI and the MCP server) both call renderAll(), so every
 * route produces the same slides.
 *
 * All-or-nothing: if validation fails, a slide cannot be composed, its content does not fit
 * or the PNG step fails, the result is ok:false with a diagnostic per problem. Callers must
 * not write or announce files from a failed result. No slide is ever skipped silently.
 */
(function (root) {
  var PC = root.ProjectCore, X = root.Export;

  function diag(code, message, extra) { return Object.assign({ code: code, path: '', message: message, severity: 'error' }, extra || {}); }
  function toDataUrl(b) { return new Promise(function (r, j) { var f = new FileReader(); f.onload = function () { r(f.result); }; f.onerror = function () { j(new Error('PNG konnte nicht gelesen werden')); }; f.readAsDataURL(b); }); }

  /* opts: { scale: 1|2, dataUrl: bool, onProgress(i, n) } */
  function renderAll(p, opts) {
    opts = opts || {};
    var v = PC.validate(p), base = { rendererVersion: PC.RENDERER_VERSION, width: X.W * (opts.scale || 1), height: X.H * (opts.scale || 1) };
    if (!v.ok) return Promise.resolve(Object.assign(base, { ok: false, stage: 'validate', slides: [], diagnostics: v.errors.concat(v.warnings) }));
    var host = document.createElement('div'), slides = [], problems = [];
    host.className = 'export-host'; document.body.appendChild(host);
    var chain = document.fonts ? document.fonts.ready : Promise.resolve();
    p.slides.forEach(function (sl, i) {
      chain = chain.then(function () {
        if (opts.onProgress) opts.onProgress(i, p.slides.length);
        var plan = PC.slidePlan(p, i), where = { path: 'slides[' + i + ']', slide: sl.id };
        var html = plan ? X.compose(PC.compile(p, i), plan.params, plan.kind, plan.meta) : null;
        host.innerHTML = html || '';
        var el = host.querySelector('.slide');
        if (!el) { problems.push(diag('compose', 'Folie ' + (i + 1) + ' konnte nicht zusammengesetzt werden.', where)); return; }
        X.densify(el); X.tighten(el);
        var fit = X.fitIssues(el);
        fit.forEach(function (f) { problems.push(diag('fit', 'Folie ' + (i + 1) + ': Inhalt passt nicht (' + f + '). Bitte Text kürzen oder Einträge entfernen.', Object.assign({ detail: f }, where))); });
        return X.toPNG(el, opts.scale || 1).then(function (blob) {
          return (opts.dataUrl ? toDataUrl(blob) : Promise.resolve(null)).then(function (d) {
            slides.push({ index: i, id: sl.id, profile: p.scenes.filter(function (s) { return s.id === sl.scene; })[0].profile, fileName: PC.fileName(p, i), bytes: blob.size, blob: opts.dataUrl ? undefined : blob, dataUrl: d || undefined, fit: fit });
          });
        }, function (e) { problems.push(diag('render', 'Folie ' + (i + 1) + ': PNG-Erzeugung fehlgeschlagen (' + e.message + ').', where)); });
      });
    });
    var done = function () { host.remove(); };
    return chain.then(function () {
      done();
      var ok = !problems.length && slides.length === p.slides.length;
      return Object.assign(base, { ok: ok, stage: ok ? 'done' : 'render', slides: slides, diagnostics: problems.concat(v.warnings) });
    }, function (e) {
      done();
      return Object.assign(base, { ok: false, stage: 'render', slides: slides, diagnostics: problems.concat([diag('render', 'Export abgebrochen: ' + e.message)], v.warnings) });
    });
  }

  root.ProjectRender = { renderAll: renderAll };
})(window);
