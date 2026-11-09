/* Offline discovery and review, using the same catalogue and project renderer as CLI/MCP. */
(function (root) {
  var R = root.ResearchCatalogue, PC = root.ProjectCore, CV = root.CollaborationView, E = root.Views.esc, X = root.Export;
  var stepIndex = 0, active = '', container;
  function cards(filter) {
    return '<ul class="he-personas">' + R.personas.filter(function (p) { return !filter || p.id === filter; }).map(function (p) {
      return '<li class="he-persona ' + E(p.tone) + '">' + CV.icon('house') + '<span class="he-kicker">' + E(p.archetype) + '</span><h2>' + E(p.name) + '</h2><p>' + E(p.friction) + '</p><dl><dt>Menschen und Rhythmus</dt><dd>' + E(p.size + ' · ' + p.rhythm) + '</dd><dt>Auftrag</dt><dd>' + E(p.purpose) + '</dd><dt>Dauer</dt><dd>' + E(p.duration) + '</dd></dl><a href="#/hochschule/gruppe/' + p.id + '">Gruppe und Szenarien ansehen →</a></li>';
    }).join('') + '</ul>';
  }
  var labels = { renderable: 'Beispiel renderbar', researched: 'Recherchiert · kein Beispielprojekt', provisional: 'Provisorisch · Prüfung offen' };
  function status(s) { return '<span class="he-status ' + s.status + '">' + labels[s.status] + '</span>'; }
  function sources(ids) {
    return '<ol class="he-source">' + R.sources.filter(function (s) { return ids.includes(s.id); }).map(function (s) { return '<li><a href="' + E(s.url) + '" target="_blank" rel="noopener">' + E(s.title) + '</a> · ' + E(s.publisher) + ' · ' + E(s.accessed) + '<br><b>' + E(s.kind) + '</b>: ' + E(s.supportedClaim) + '<br>Grenze: ' + E(s.limitations) + '</li>'; }).join('') + '</ol>';
  }
  function list(group) { return '<ul class="he-scenarios">' + R.scenarios.filter(function (s) { return !group || s.persona === group; }).map(function (s) { return '<li class="he-scenario">' + status(s) + '<h3><a href="#/hochschule/' + s.id + '">' + E(s.title) + '</a></h3><p>' + E(s.objective) + '</p><small>' + E(s.steps.map(function (x) { return x.tool; }).join(' → ')) + '</small></li>'; }).join('') + '</ul>'; }
  function specimen() { return '<section><h2>Eine gemeinsame Bildsprache</h2><p>Haus = Gruppe. Person = Verantwortung. Rahmen = gemeinsames Objekt. Pfeile tragen ihre Bedeutung als Text.</p><div class="he-specimen">' + Object.keys(CV.vocabulary).map(function (k, i) { return '<div' + (i % 2 ? ' class="he-dark"' : '') + '><span class="he-big">' + CV.symbol(k) + '</span><span class="he-small">' + CV.symbol(k) + '</span></div>'; }).join('') + '</div></section>'; }
  function render(h) {
    var id = h[1], group = id === 'gruppe' && R.persona(h[2]);
    if (group) return '<section class="he-detail"><p><a href="#/hochschule">← Alle Hochschul-Szenarien</a></p><h1>' + E(group.name) + '</h1><p class="lead">' + E(group.purpose) + '</p>' + cards(group.id) + '<h2>Arbeitsweise</h2><p>' + E(group.roles.join(' · ')) + '</p><p>Artefakte: ' + E(group.artefacts.join(' · ')) + '</p><p class="he-callout">' + E(group.boundary) + '</p><h2>Die Lehrfrage</h2><p>' + E(group.question) + '</p><h2>Szenarien dieser Gruppe</h2>' + list(group.id) + '<details><summary>Quellen und Einordnung</summary>' + sources(group.sources) + '</details></section>';
    var s = R.get(id);
    if (s) {
      if (active !== id) { active = id; stepIndex = 0; }
      var g = R.persona(s.persona), p = s.status === 'renderable' ? R.project(s.id) : null;
      return '<section class="he-detail"><p><a href="#/hochschule">← Alle Hochschul-Szenarien</a>' + (g ? ' · <a href="#/hochschule/gruppe/' + g.id + '">' + E(g.name) + '</a>' : '') + '</p>' + status(s) + '<h1>' + E(s.title) + '</h1><p class="lead">' + E(s.objective) + '</p><p><b>Auslöser:</b> ' + E(s.trigger) + ' <b>Reibung:</b> ' + E(s.friction) + '</p><p><b>Ergebnis:</b> ' + E(s.outcome) + '</p>' + CV.strip(s.steps) +
        (p ? '<div class="he-controls"><span class="he-step-label" id="he-step"></span><button class="btn" data-he="prev" aria-label="Vorherige Folie">← Zurück</button><button class="btn" data-he="next" aria-label="Nächste Folie">Weiter →</button></div><div class="he-preview" id="he-preview" aria-label="Vorschau der gewählten Folie"></div><p id="he-notes" class="he-callout"></p><div class="he-controls"><button class="btn btn-p" data-he="export">Ganze Abfolge als PNG</button><button class="btn" data-he="json">Projekt-JSON sichern</button><button class="btn" data-he="adapt">Als eigenen Entwurf öffnen</button></div><p id="he-export-status" role="status"></p>' : '<p class="he-callout">Rechercheeintrag. Kein renderbares Projekt und keine neuen Produktoberflächen zugesagt.</p>') +
        '<h2>Voraussetzungen und Grenze</h2><ul>' + s.prerequisites.map(function (x) { return '<li>' + E(x) + '</li>'; }).join('') + '</ul><p>' + E(s.boundary) + '</p><h2>Frage für die Schulung</h2><p class="lead">' + E(s.question) + '</p><details><summary>Quellen, Belege und fiktive Synthese</summary><p>Die Situation, Namen und Arbeitsschritte sind fiktive Synthese. Quellen belegen den Kontext und einzelne Produktbeziehungen, keine reale Einführung dieser Gruppe.</p>' + sources(s.sources) + '</details></section>';
    }
    return '<section class="he-hero"><p class="he-kicker">HOCHSCHULE · RECHERCHIERTE ARBEITSMUSTER</p><h1>Wer arbeitet zusammen?<br>Und was bleibt danach?</h1><p class="lead">Vier neue Gruppen. Zwölf konkrete Situationen. Sechs vollständige Beispielabfolgen – mit derselben Aufgabe und demselben Inhalt über mehrere Ansichten.</p><p>Alle Gruppen und Geschichten sind fiktiv. Hochschulquellen liefern den Kontext, Microsoft-Dokumentation die Produktgrenzen.</p><p><a href="docs/morning-review/index.html">Morgenreview: vollständige PNG-Galerie öffnen →</a></p></section>' + cards() + '<section><h2>Vom Arbeitsproblem zur erklärbaren Abfolge</h2>' + list() + '</section>' + specimen() + '<section><h2>Zwei Vergleiche zum Prüfen</h2><div class="he-review-images"><a href="#/hochschule/weekly-meeting"><img loading="lazy" src="docs/morning-review/meeting-comparison.png" alt="Meeting: zugewiesene Aufgabe vor und erledigte Aufgabe beim Review"></a><a href="#/hochschule/shared-loop"><img loading="lazy" src="docs/morning-review/loop-comparison.png" alt="Dieselbe Loop-Tabelle nach einer Änderung in Outlook und Teams"></a></div></section>';
  }
  function fit() { if (!container) return; var box = container.querySelector('.he-preview'), slide = box && box.querySelector('.slide'); if (slide) slide.style.transform = 'scale(' + (box.clientWidth / 1920) + ')'; }
  function preview() {
    var s = R.get(active), box = container.querySelector('#he-preview'); if (!s || !box) return;
    var p = R.project(active); stepIndex = Math.max(0, Math.min(p.slides.length - 1, stepIndex));
    var plan = PC.slidePlan(p, stepIndex); box.innerHTML = X.compose(PC.compile(p, stepIndex), plan.params, plan.kind, plan.meta);
    X.densify(box.firstElementChild); X.tighten(box.firstElementChild); fit();
    container.querySelector('#he-step').textContent = 'Folie ' + (stepIndex + 1) + ' / ' + p.slides.length + ' · ' + PC.capabilities().profiles[p.scenes.find(function (x) { return x.id === p.slides[stepIndex].scene; }).profile].label;
    container.querySelector('#he-notes').textContent = p.slides[stepIndex].presenterNotes;
    container.querySelector('[data-he="prev"]').disabled = stepIndex === 0;
    container.querySelector('[data-he="next"]').disabled = stepIndex === p.slides.length - 1;
  }
  function mount(el) {
    container = el; preview();
    if (el.dataset.heMounted) return; el.dataset.heMounted = 'true';
    el.addEventListener('click', async function (e) {
      var b = e.target.closest('[data-he]'); if (!b || !/^#\/hochschule\//.test(location.hash)) return;
      var op = b.dataset.he;
      if (op === 'prev' || op === 'next') { stepIndex += op === 'prev' ? -1 : 1; preview(); return; }
      var p = R.project(active);
      if (op === 'adapt') { root.ProjectUI.receive(PC.serialise(p), 'Hochschul-Katalog'); return; }
      if (op === 'json') { X.download(new Blob([PC.serialise(p)], { type: 'application/json' }), p.meta.id + '.project.json'); return; }
      if (op === 'export') {
        var output = el.querySelector('#he-export-status'); b.disabled = true;
        try {
          var result = await root.ProjectRender.renderAll(p, { onProgress: function (i, n) { if (output.isConnected) output.textContent = 'PNG ' + (i + 1) + ' von ' + n + ' wird erstellt …'; } });
          if (!result.ok) { if (output.isConnected) output.textContent = result.diagnostics.map(function (d) { return d.message; }).join(' '); return; }
          for (var i = 0; i < result.slides.length; i++) { X.download(result.slides[i].blob, result.slides[i].fileName); await new Promise(function (r) { setTimeout(r, 150); }); }
          if (output.isConnected) output.textContent = result.slides.length + ' PNGs erstellt. Mehrere Downloads im Browser erlauben.';
        } catch (err) { if (output.isConnected) output.textContent = 'Export fehlgeschlagen: ' + err.message; }
        finally { b.disabled = false; }
      }
    });
    window.addEventListener('resize', fit);
  }
  root.ResearchUI = { render: render, mount: mount, cards: cards, specimen: specimen };
})(window);
