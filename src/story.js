/*
 * Cross-application story data: Outlook → Explorer → Teams → SharePoint.
 *
 * One canonical shared document per situation (a file already listed in scene.files) and its
 * travelling copies. The copy names are NOT repeated here: they come from principles.doc.copies,
 * so Prinzip, Outlook and Explorer always show the same files. Each copy gets mail metadata
 * (who sent it, when, size) in the same order. People are ids from the world.
 */
window.LIB.stories = {
  'leadership-forum': {
    viewer: 'daniel-wyss',
    canonical: 'Veranstaltungsplan.xlsx',
    mails: [
      { by: 'mara-conti', time: 'Mo 16:05', size: '46 KB', to: ['daniel-wyss', 'sophie-frei', 'regula-aebi'],
        subject: 'Veranstaltungsplan Termin 3 – aktuelle Fassung',
        body: 'Hallo zusammen\n\nIm Anhang der aktuelle Veranstaltungsplan für Termin 3. Bitte eure Ergänzungen bis Mittwoch direkt in der Datei markieren und zurückschicken.\n\nLiebe Grüsse\n{p:mara-conti}' },
      { by: 'sophie-frei', time: 'Mo 17:20', size: '47 KB', to: ['mara-conti', 'daniel-wyss'],
        subject: 'AW: Veranstaltungsplan Termin 3 – aktuelle Fassung',
        body: 'Ich habe die Referierenden ergänzt, siehe Anhang (v2).' },
      { by: 'regula-aebi', time: 'Di 08:12', size: '38 KB', to: ['mara-conti', 'daniel-wyss'],
        subject: 'Teilnehmende HR für Termin 3',
        body: 'Anbei unsere Liste der HR-Teilnehmenden, eingefügt in eure Vorlage.' }
    ],
    otherMail: [
      { by: 'lea-baumann', time: 'Fr', subject: 'Teamsitzung am Mittwoch', preview: 'Traktanden folgen bis Dienstag.' },
      { by: 'jonas-meier', time: 'Do', subject: 'Feedback Termin 2: Auswertung', preview: 'Die Rückmeldungen sind zusammengefasst.' }
    ],
    /* the copy downloaded twice from the first mail */
    redownload: 0
  },
  'kundenportal': {
    viewer: 'aylin-demir',
    canonical: 'Anforderungsliste Kundenportal.xlsx',
    mails: [
      { by: 'luca-bernasconi', time: 'Mi 14:10', size: '62 KB', to: ['aylin-demir', 'sandra-huber', 'marco-gerber'],
        subject: 'Anforderungen Kundenportal – Stand v3',
        body: 'Hallo zusammen\n\nIm Anhang die Anforderungsliste, Stand v3. Bitte Ergänzungen bis Freitag zurück an mich.\n\nGruss\n{p:luca-bernasconi}' },
      { by: 'sandra-huber', time: 'Do 09:05', size: '64 KB', to: ['luca-bernasconi', 'aylin-demir'],
        subject: 'AW: Anforderungen Kundenportal – Stand v3',
        body: 'Zwölf Punkte aus Kundengesprächen ergänzt, markiert mit SH.' },
      { by: 'tim-vogel', time: 'Do 16:40', size: '61 KB', to: ['aylin-demir'],
        subject: 'Anforderungen – unsere finale Fassung',
        body: 'Wir haben die Texte auf Basis dieser Fassung geplant.' }
    ],
    otherMail: [
      { by: 'petra-schmid', time: 'Di', subject: 'Budget Q2 Kampagnen', preview: 'Bitte bis Ende Woche bestätigen.' },
      { by: 'marco-gerber', time: 'Mo', subject: 'CRM-Schnittstelle: Testzugang', preview: 'Der Testzugang ist eingerichtet.' }
    ],
    redownload: 0
  }
};

/* Tool catalogue: what the library can actually render, and what is planned. */
window.LIB.tools = [
  { id: 'teams', label: 'Microsoft Teams', short: 'Teams', status: 'ready', screens: [['posts', 'Kanal: Beiträge'], ['files', 'Kanal: Dateien'], ['tasks', 'Kanal: Aufgaben']],
    desc: 'Team, Kanäle, Beiträge mit Antworten, Dateien und Aufgaben im Kanal.' },
  { id: 'outlook', label: 'Outlook', short: 'Outlook', status: 'story', screens: [['outlook', 'Posteingang mit Anhang']],
    desc: 'Posteingang, Nachrichtenliste und Lesebereich mit Anhang.' },
  { id: 'explorer', label: 'Windows Explorer', short: 'Explorer', status: 'story', screens: [['explorer', 'Downloads mit Kopien']],
    desc: 'Lokaler Downloads-Ordner mit heruntergeladenen Kopien.' },
  { id: 'sharepoint', label: 'SharePoint', short: 'SharePoint', status: 'story', screens: [['sharepoint', 'Dokumentbibliothek']],
    desc: 'Teamwebsite mit der gemeinsamen Dokumentbibliothek.' },
  { id: 'onedrive', label: 'OneDrive', short: 'OneDrive', status: 'planned', screens: [],
    desc: 'Persönliche Arbeitsdateien. Geplant; heute zeigt die vereinfachte «Persönliche Ablage» diese Situationen.' },
  { id: 'planner', label: 'Planner / To Do', short: 'Planner', status: 'partial', screens: [['tasks', 'Aufgaben im Teams-Kanal']],
    desc: 'Aufgaben erscheinen heute als Reiter im Teams-Kanal; eigene Planner-Ansicht später.' }
];
