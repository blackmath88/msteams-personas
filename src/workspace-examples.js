(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.WorkspaceExample = factory();
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function example(kind) {
    var people = [
      { id: 'mara', name: 'Mara Conti' }, { id: 'sophie', name: 'Sophie Frei' },
      { id: 'daniel', name: 'Daniel Wyss' }, { id: 'lea', name: 'Lea Baumann' },
      { id: 'regula', name: 'Regula Aebi' }, { id: 'nora', name: 'Dr. Nora Keller' },
      { id: 'elena', name: 'Elena Rossi' }, { id: 'lukas', name: 'Lukas Gerber' },
      { id: 'amira', name: 'Amira Hassan' }, { id: 'marc', name: 'Marc Schneider' },
      { id: 'nina', name: 'Nina Petrović' }, { id: 'julia', name: 'Julia Berger' },
      { id: 'david', name: 'David Bucher' }, { id: 'coauthor', name: 'Leonie Steiner' }
    ];
    var nodes = [
      { id: 'campus', kind: 'team', name: 'Campus & People Development', purpose: 'Das Verwaltungsteam organisiert Weiterbildungen und das Leadership Forum.', members: ['mara', 'sophie', 'daniel', 'lea', 'regula'] },
      { id: 'urban', kind: 'team', name: 'Urban Health Analytics', purpose: 'Die Forschungsgruppe untersucht Hitze in Basel und publiziert ihre Ergebnisse.', members: ['elena', 'lukas', 'amira', 'marc', 'nina', 'julia', 'david'] },
      { id: 'nora-work', kind: 'personal', name: 'Noras Arbeitsbereich', owner: 'nora', purpose: 'Nora arbeitet eigenständig und gibt ihren Artikel gezielt zur Bearbeitung frei.' },
      { id: 'nora-drive', kind: 'storage', parent: 'nora-work', name: 'Meine Dateien' },
      { id: 'nora-paper', kind: 'file', parent: 'nora-drive', name: 'Artikel_Grenzen.docx', sharedWith: ['coauthor'] },
      { id: 'nora-notes', kind: 'folder', parent: 'nora-drive', name: 'Forschungsnotizen' }
    ];
    function channel(team, id, name, purpose) {
      nodes.push({ id: id, kind: 'channel', parent: team, name: name, purpose: purpose });
      nodes.push({ id: id + '-files', kind: 'storage', parent: id, name: 'Dateiablage' });
    }
    channel('campus', 'campus-general', 'Allgemein', 'Mitteilungen für das ganze Team');
    channel('campus', 'forum', 'Leadership Forum', 'Entscheide, Vorbereitung und gemeinsame Unterlagen zum Anlass');
    channel('campus', 'learning', 'Learning Programme', 'Weiterbildungen planen und Material austauschen');
    channel('campus', 'organisation', 'Interne Organisation', 'Laufende Teamarbeit koordinieren');
    channel('urban', 'urban-general', 'Allgemein', 'Mitteilungen für die Forschungsgruppe');
    channel('urban', 'equipment', 'Infrastruktur & Geräte', 'Messgeräte und Einsatzmaterial organisieren');
    channel('urban', 'heat-health', 'Heat & Health Basel', 'Messorte und Einsätze koordinieren. Rohdaten bleiben im Fachsystem.');
    channel('urban', 'publications', 'Publikationen', 'Am gemeinsamen Manuskript arbeiten');
    channel('urban', 'urban-organisation', 'Gruppenorganisation', 'Die interne Gruppenarbeit koordinieren');
    nodes.find(function (n) { return n.id === 'forum'; }).posts = [
      { by: 'sophie', title: 'Termin 3 findet online statt', text: 'Der Raum ist doppelt belegt. Der Termin bleibt bestehen und wir treffen uns online.' },
      { by: 'mara', title: 'Veranstaltungsplan nachgeführt', text: 'Über diesen Link öffnet ihr die aktuelle Fassung.', file: 'event-plan' }
    ];
    nodes.push({ id: 'event-plan', kind: 'file', parent: 'forum-files', name: 'Veranstaltungsplan.xlsx' },
      { id: 'forum-material', kind: 'folder', parent: 'forum-files', name: 'Unterlagen' },
      { id: 'heat-paper', kind: 'file', parent: 'publications-files', name: 'Paper_HeatHealth.docx' });
    var project = {
      format: 'msteams-personas/project', projectVersion: 1, capabilityVersion: 4,
      meta: { id: 'uni-bas-arbeitsbereich', title: 'Wie ist der Arbeitsbereich organisiert?', fictional: true, locale: 'de-CH',
        source: { kind: 'fictional', note: 'Uni Basel M365, Modul 1' },
        assumptions: ['In diesem Beispiel sehen alle Teammitglieder die gezeigten Kanäle. Nora gibt ihren Artikel gezielt zur Bearbeitung frei.'] },
      people: people, documents: [], tasks: [],
      states: [{ id: 'before', tasks: {} }, { id: 'after', tasks: {} }],
      workspace: { nodes: nodes },
      scenes: [
        { id: 'overview', profile: 'workspace-map', root: 'campus', selected: 'forum' },
        { id: 'teams', profile: 'workspace-scene', root: 'campus', selected: 'forum', tab: 'posts' }
      ],
      slides: [
        { id: 'map', scene: 'overview', presenterNotes: 'Wo würdest du den Veranstaltungsplan suchen? Zeige Team, Kanal und Dateiablage.' },
        { id: 'preview', scene: 'teams', presenterNotes: 'Zeige den Kanal in Teams und die Beiträge zum Termin. Wechsle zu Dateien, um denselben Plan zu öffnen.' }
      ]
    };
    if (kind !== 'workspace-houses') return project;

    project.capabilityVersion = 5;
    project.meta.id = 'uni-bas-teams-haeuser';
    project.meta.title = 'Haus und Teams zeigen denselben Kanal';
    project.meta.assumptions = ['Mara ist Mitglied in drei Teams. In diesem Beispiel sehen alle Teammitglieder alle Kanäle ihres Teams.'];
    project.workspace.nodes = nodes.filter(function (n) { return n.id !== 'nora-work' && n.parent !== 'nora-work' && n.parent !== 'nora-drive'; });
    Object.assign(nodes[0], { teamType: 'Stammteam', collaboration: 'Eigener Bereich' });
    project.workspace.nodes.push(
      { id: 'onboarding', kind: 'team', name: 'Onboarding 2027', teamType: 'Projektteam', collaboration: 'Mehrere Bereiche', members: ['mara', 'lea', 'elena'] },
      { id: 'partners', kind: 'team', name: 'Weiterbildungskooperation', teamType: 'Arbeitsgruppe', collaboration: 'Externe Partner', members: ['mara', 'coauthor'] }
    );
    nodes = project.workspace.nodes;
    channel('onboarding', 'onboarding-general', 'Allgemein', 'Projektstand und Termine');
    channel('onboarding', 'pilot', 'Pilotphase', 'Testlauf vorbereiten');
    channel('onboarding', 'review', 'Auswertung', 'Rückmeldungen besprechen');
    channel('partners', 'partners-general', 'Allgemein', 'Absprachen mit Partnern');
    channel('partners', 'workshops', 'Workshop-Planung', 'Programm und Ablauf');
    channel('partners', 'material', 'Kursmaterial', 'Unterlagen gemeinsam pflegen');
    nodes.push(
      { id: 'pilot-checklist', kind: 'file', parent: 'pilot-files', name: 'Checkliste_Pilot.docx' },
      { id: 'pilot-material', kind: 'folder', parent: 'pilot-files', name: 'Unterlagen' },
      { id: 'pilot-feedback', kind: 'folder', parent: 'pilot-material', name: 'Rückmeldungen' }
    );
    project.scenes = [
      { id: 'overview', profile: 'workspace-houses', viewer: 'mara' },
      { id: 'teams', profile: 'workspace-house-teams', root: 'onboarding', selected: 'pilot-checklist', viewer: 'mara', tab: 'files' }
    ];
    project.slides[0].presenterNotes = 'Zeige Maras drei Teams. Jedes Haus ist ein Team, jedes Zimmer ein Kanal. Rechts liegt die Dateiablage des Kanals.';
    project.slides[1].presenterNotes = 'Verfolge den Weg in beiden Ansichten: Onboarding 2027 → Pilotphase → Dateien → Checkliste_Pilot.docx.';
    return project;
  }
  return example;
});
