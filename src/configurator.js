/*
 * Six-question configurator with transparent, deterministic template scoring.
 * suggest(answers) -> { best, alt, reasons } ; same answers always give the same result.
 */
(function (root) {
  var QUESTIONS = [
    { id: 'goal', title: 'Was wollt ihr organisieren, und was ist heute schwierig?', fields: [
      { id: 'context', label: 'Umfeld', options: [['business', 'Unternehmen'], ['hochschule', 'Hochschule']] },
      { id: 'goal', label: 'Arbeit', options: [['projekt', 'Ein Projekt mit Ziel und Termin'], ['betrieb', 'Laufender Betrieb eines Teams'], ['gremium', 'Sitzungen eines Gremiums'], ['kurs', 'Ein Kurs oder eine Durchführung'], ['forschung', 'Forschung mit Daten'], ['eigen', 'Eigene Arbeit, gelegentlich mit anderen']] },
      { id: 'friction', label: 'Schwierig ist heute', options: [['entscheide', 'Entscheide gehen im Chat oder Mail verloren'], ['fassungen', 'Mehrere Fassungen derselben Datei'], ['pendenzen', 'Unklar, wer was erledigt'], ['wissen', 'Wissen geht bei Wechseln verloren']] }
    ] },
    { id: 'people', title: 'Wer arbeitet zusammen, und wie viele Personen sind es?', fields: [
      { id: 'size', label: 'Anzahl Personen', options: [['1', 'Nur ich'], ['2-4', '2 bis 4'], ['5-8', '5 bis 8'], ['9+', '9 oder mehr']] },
      { id: 'units', label: 'Beteiligte Einheiten', options: [['eine', 'Nur unsere Einheit'], ['mehrere', 'Mehrere Abteilungen oder Bereiche']] }
    ] },
    { id: 'rhythm', title: 'Ist die Arbeit laufend, befristet oder wiederkehrend?', fields: [
      { id: 'rhythm', label: 'Rhythmus', options: [['laufend', 'Laufend, ohne Enddatum'], ['befristet', 'Befristet, mit Abschluss'], ['wiederkehrend', 'Wiederkehrend (Semester, Sitzungen, Zyklen)']] }
    ] },
    { id: 'external', title: 'Arbeiten externe Personen mit?', fields: [
      { id: 'external', label: 'Externe', options: [['keine', 'Nein'], ['punktuell', 'Punktuell, für einen Teil'], ['regelmaessig', 'Regelmässig']] }
    ] },
    { id: 'share', title: 'Was muss gemeinsam sein, was bleibt persönlich?', fields: [
      { id: 'share', label: 'Verhältnis', options: [['gemeinsam', 'Vieles gemeinsam: Dateien, Aufgaben, Entscheide'], ['gemischt', 'Gemischt: Entwürfe persönlich, Ergebnisse gemeinsam'], ['persoenlich', 'Meist persönlich, selten geteilt']] }
    ] },
    { id: 'access', title: 'Gibt es Vertraulichkeits- oder Zugriffsgrenzen?', fields: [
      { id: 'access', label: 'Grenzen', options: [['keine', 'Nichts Besonderes, intern'], ['einzelne', 'Einzelne vertrauliche Inhalte'], ['sensibel', 'Sensible Daten (Personen, Gesundheit, Kunden)']] }
    ] }
  ];

  var DEFAULTS = { context: 'business', goal: 'projekt', friction: 'entscheide', size: '5-8', units: 'mehrere', rhythm: 'befristet', external: 'punktuell', share: 'gemeinsam', access: 'einzelne' };

  /* Each template: target situation/variant and scoring rules [field, value, points, reason]. */
  var TEMPLATES = [
    { id: 'projektteam', label: 'Eigenes, befristetes Projektteam',
      target: function (a) { return a.context === 'hochschule' ? ['leadership-forum', 'eigenes-team'] : ['kundenportal', 'eigenes-team']; },
      rules: [['goal', 'projekt', 3, 'Ihr arbeitet auf ein Ziel mit Termin hin.'], ['rhythm', 'befristet', 3, 'Die Arbeit ist befristet; das Team kann danach archiviert werden.'], ['units', 'mehrere', 3, 'Mehrere Bereiche tragen die Arbeit gleichberechtigt.'], ['size', '5-8', 1, 'Für 5 bis 8 Personen lohnt sich ein eigener Ort.'], ['size', '9+', 2, 'Viele Beteiligte brauchen einen klaren gemeinsamen Ort.'], ['external', 'punktuell', 1, 'Externe arbeiten nur in einem abgegrenzten Teil mit.'], ['share', 'gemeinsam', 1, 'Vieles muss gemeinsam sichtbar sein.']] },
    { id: 'projektkanal', label: 'Projektkanal im bestehenden Team',
      target: function (a) { return a.context === 'hochschule' ? ['leadership-forum', 'kanal'] : ['kundenportal', 'kanal']; },
      rules: [['goal', 'projekt', 2, 'Es geht um ein Projekt.'], ['goal', 'betrieb', 2, 'Die Arbeit gehört zum laufenden Betrieb eines Teams.'], ['units', 'eine', 3, 'Die Arbeit bleibt im Kern bei eurer Einheit.'], ['size', '2-4', 1, 'Für wenige Personen reicht ein Kanal.'], ['size', '5-8', 1, 'Euer Team besteht schon.'], ['rhythm', 'laufend', 2, 'Die Arbeit läuft weiter; ein Kanal im bestehenden Team bleibt.'], ['external', 'keine', 1, 'Ohne Externe ist ein Kanal im eigenen Team am einfachsten.']] },
    { id: 'gremium', label: 'Schlankes Gremiumsteam mit Ordner pro Sitzung', target: function () { return ['sitzungszyklus', null]; },
      rules: [['goal', 'gremium', 5, 'Ihr organisiert Sitzungen eines Gremiums.'], ['rhythm', 'wiederkehrend', 2, 'Die Arbeit kommt in Zyklen wieder.'], ['friction', 'fassungen', 1, 'Unterlagen sollen in einer Fassung vorliegen.'], ['share', 'gemischt', 1, 'Zwischen den Sitzungen ist wenig gemeinsame Arbeit nötig.']] },
    { id: 'lehrteam', label: 'Wiederkehrendes Team mit Übergabedossier', target: function () { return ['semesterstart', null]; },
      rules: [['goal', 'kurs', 5, 'Ihr bereitet einen Kurs oder eine Durchführung vor.'], ['rhythm', 'wiederkehrend', 2, 'Jede Durchführung baut auf der letzten auf.'], ['friction', 'wissen', 3, 'Wissen soll einen Wechsel überstehen.'], ['size', '2-4', 1, 'Ein kleines Team genügt.']] },
    { id: 'forschung', label: 'Forschungsteam mit klarer Datengrenze', target: function () { return ['heat-health', null]; },
      rules: [['goal', 'forschung', 5, 'Ihr arbeitet mit Forschungsdaten.'], ['access', 'sensibel', 3, 'Sensible Daten bleiben in ihrem Fachsystem; im Team nur Beschreibung und Link.'], ['rhythm', 'laufend', 1, 'Die Gruppe besteht dauerhaft.'], ['friction', 'fassungen', 1, 'Entwürfe sollen nicht als Kopien kursieren.']] },
    { id: 'persoenlich', label: 'Persönliche Ablage, geteilt per Link',
      target: function (a) { return [a.friction === 'wissen' ? 'nora-abwesenheit' : a.friction === 'pendenzen' ? 'nora-reihe' : 'nora-publikation', null]; },
      rules: [['size', '1', 5, 'Die Arbeit liegt bei einer Person.'], ['goal', 'eigen', 4, 'Zusammenarbeit tritt nur gelegentlich auf.'], ['share', 'persoenlich', 3, 'Das meiste bleibt persönlich; kein Team nötig.'], ['size', '2-4', 1, 'Mit wenigen Beteiligten reicht oft ein geteilter Link.']] }
  ];

  function score(t, a) {
    var pts = 0, reasons = [];
    t.rules.forEach(function (r) { if (a[r[0]] === r[1]) { pts += r[2]; reasons.push(r[3]); } });
    return { template: t, points: pts, reasons: reasons };
  }

  /* Collection of a library situation, to flag examples borrowed from another context. */
  function collectionOf(sid) {
    var LIB = root.LIB, sit = LIB && LIB.situations.filter(function (x) { return x.id === sid; })[0];
    return sit && LIB.business && sit.world === LIB.business.id ? 'business' : 'hochschule';
  }
  var CONTEXT_LABEL = { business: 'Unternehmen', hochschule: 'Hochschule' };

  function suggest(answers) {
    var a = {};
    Object.keys(DEFAULTS).forEach(function (k) { a[k] = answers[k] || DEFAULTS[k]; });
    var ranked = TEMPLATES.map(function (t) { return score(t, a); })
      .sort(function (x, y) { return y.points - x.points || TEMPLATES.indexOf(x.template) - TEMPLATES.indexOf(y.template); });
    var best = ranked[0];
    var bt = best.template.target(a);
    var alt = ranked.slice(1).filter(function (r) { var t = r.template.target(a); return t[0] !== bt[0] || t[1] !== bt[1]; })[0];
    var at = alt.template.target(a);
    var cautions = [];
    if (a.access === 'sensibel') cautions.push('Sensible Daten: Das Bild zeigt eine Annahme. Welche Daten in Teams gehören, klären Datenschutz und IT; die Vorschau prüft keine echten Berechtigungen.');
    if (a.access === 'einzelne') cautions.push('Vertrauliche Einzelinhalte bleiben ausserhalb des gemeinsamen Kanals oder in einem separat geregelten Bereich (Annahme, nicht geprüft).');
    if (a.external !== 'keine') cautions.push('Externe: Wie sie technisch Zugriff erhalten, hängt von den Regeln eurer Organisation ab. Die Szene garantiert keinen Zugang ohne Konto.');
    var transfer = function (sid) {
      var c = collectionOf(sid);
      return c === a.context ? null : { from: c, fromLabel: CONTEXT_LABEL[c], toLabel: CONTEXT_LABEL[a.context] };
    };
    return {
      answers: a,
      best: { id: best.template.id, label: best.template.label, situation: bt[0], variant: bt[1], reasons: best.reasons, points: best.points, transfer: transfer(bt[0]) },
      alt: { id: alt.template.id, label: alt.template.label, situation: at[0], variant: at[1], reasons: alt.reasons, points: alt.points, transfer: transfer(at[0]) },
      cautions: cautions
    };
  }

  root.Configurator = { QUESTIONS: QUESTIONS, DEFAULTS: DEFAULTS, TEMPLATES: TEMPLATES, suggest: suggest };
})(typeof window !== 'undefined' ? window : globalThis);
