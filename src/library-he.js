/*
 * Complete Szene / Prinzip content for the university worlds beyond Leadership Forum.
 * Merged into LIB.situations by id. People ids refer to HE_WORLDS; decisions follow the curated
 * decision points (picks) in worlds.js. Where the source leaves a choice open, it becomes a variant.
 */
(function (LIB) {
  var COMPLETE = {

    'heat-health': {
      variants: [
        { id: 'gruppenteam', label: 'Ein Team für die Gruppe, Kanäle nach Arbeitsbereich',
          why: 'Die Gruppe ist dauerhaft; Projekte, Geräte und Publikationen bekommen je einen Kanal. Rohdaten bleiben in der Forschungsdateninfrastruktur.',
          team: 'Urban Health Analytics', teamNote: 'dauerhaftes Gruppenteam',
          members: ['elena-rossi', 'david-brunner', 'amira-hassan', 'lukas-gerber', 'nina-petrovic', 'marc-schneider', 'julia-weber'],
          channels: ['Allgemein', 'Infrastruktur & Geräte', 'Heat & Health Basel', 'Publikationen', 'Gruppenorganisation'], active: 'Publikationen' }
      ],
      scene: {
        posts: [
          { id: 'p1', by: 'nina-petrovic', time: 'Mo 10:20', title: 'Revision: Entwurf liegt jetzt hier',
            text: 'Der Revisionstext liegt in den Dateien von «Publikationen». Bitte direkt in der Datei kommentieren, nicht als Kopie zurückschicken.',
            file: 'Paper_HeatHealth.docx', replies: [
              { by: 'david-brunner', time: 'Mo 11:05', text: 'Meine Kommentare aus der Kopie habe ich übertragen. Die alte Datei lösche ich.' },
              { by: 'elena-rossi', time: 'Mo 13:40', text: 'Danke. Abgabe an das Journal in sechs Wochen, ich lese am Freitag.' }
            ], mark: 1 },
          { id: 'p2', by: 'amira-hassan', time: 'Di 08:30', title: 'Literatur zur Hitzemortalität',
            text: 'Drei neue Studien für die Diskussion, mit kurzer Einschätzung. Bisher stand so etwas im Chat und war nach einer Woche weg.',
            file: 'Literatur_Revision.docx', replies: [{ by: 'lukas-gerber', time: 'Di 09:12', text: 'Die zweite Studie nutzt dieselben Sensoren wie wir, gut für die Methodik.' }], mark: 2 },
          { id: 'p3', by: 'marc-schneider', time: 'Di 14:02', title: 'Rohdaten bleiben in der Infrastruktur',
            text: 'Hier nur Pfad und aggregierte Resultate. Die Kopie «zur Sicherheit» im Gruppenordner habe ich entfernt.',
            replies: [], mark: 3 }
        ],
        files: [
          { name: 'Paper_HeatHealth.docx', kind: 'doc', by: 'nina-petrovic', when: 'Mo 10:20', note: 'eine Datei, alle kommentieren darin', mark: 1 },
          { name: 'Literatur_Revision.docx', kind: 'doc', by: 'amira-hassan', when: 'Di 08:30', note: 'statt Links im Chat', mark: 2 },
          { name: 'Abbildungen /', kind: 'folder', by: 'lukas-gerber', when: 'letzte Woche', note: 'aggregierte Resultate, keine Rohdaten' },
          { name: 'Datenbeschreibung.docx', kind: 'doc', by: 'marc-schneider', when: 'Di 14:02', note: 'Pfade in die Forschungsdateninfrastruktur', mark: 3 }
        ],
        tasks: [
          { title: 'Reviewer 2, Punkt 4: Sensitivitätsanalyse', owner: 'amira-hassan', due: 'KW 46', bucket: 'Revision', done: false },
          { title: 'Abbildung 3 neu rechnen', owner: 'lukas-gerber', due: 'Fr', bucket: 'Revision', done: false },
          { title: 'Antwortbrief an das Journal', owner: 'nina-petrovic', due: 'KW 48', bucket: 'Revision', done: false },
          { title: 'Kommentare aus Kopie übertragen', owner: 'david-brunner', due: 'erledigt', bucket: 'Revision', done: true }
        ],
        outside: ['Forschungsdateninfrastruktur: Sensor- und Gesundheitsdaten', 'Datenpartner des Kantons: Quartalsupdate per Mail mit Link, kein Gastzugang'],
        notes: {
          1: 'Ein Revisionstext im Kanal statt «v7» im OneDrive und «v7_DB» im Download-Ordner.',
          2: 'Literatur mit Einschätzung bleibt auffindbar; im Chat wäre sie nach einer Woche weg.',
          3: 'Sensible Daten bleiben im Fachsystem. Im Team stehen nur Beschreibung, Pfad und Resultate.'
        }
      },
      principles: {
        chat: {
          problem: '{p:amira-hassan} teilt Literatur im Gruppenchat; {p:lukas-gerber} kommt eine Woche später dazu und findet nichts mehr.',
          decision: 'Literatur mit Einschätzung im Kanal ablegen',
          inChat: ['amira-hassan', 'nina-petrovic'], later: ['lukas-gerber', 'david-brunner', 'elena-rossi'],
          recommend: 'Literatur und Absprachen zum Paper als Beitrag in «{c}», Datei in den Kanal-Dateien und den Link teilen.',
          boundary: 'Chat für Kurzes zwischen zwei Personen. Der Datenpartner des Kantons bekommt ein Quartalsupdate per Mail mit Link, keinen Zugang zum Team.'
        },
        doc: {
          problem: 'Der Revisionstext liegt in {p:nina-petrovic}s OneDrive; {p:david-brunner} schickt Kommentare als heruntergeladene Kopie zurück.',
          artefact: 'Paper_HeatHealth.docx', copies: ['Paper_HeatHealth_v7.docx', 'Paper_HeatHealth_v7_DB.docx', 'Paper_v7_ER_Kommentare.docx'],
          editors: ['nina-petrovic', 'david-brunner', 'elena-rossi'], drafter: 'lukas-gerber', draft: 'Konferenzpräsentation',
          recommend: 'Ab drei Beteiligten liegt der Entwurf in den Dateien von «{c}». Alle kommentieren in derselben Datei.',
          boundary: 'Präsentationen und Skripte bleiben bei der Person, bis Feedback nötig ist. Sensor- und Gesundheitsdaten gehören nie in Teams, sondern in die Forschungsdateninfrastruktur.'
        },
        tasks: {
          problem: 'Die Revisionspunkte stehen in drei persönlichen Listen. {p:elena-rossi} sieht vor der Frist nicht, was noch offen ist.',
          personal: [{ who: 'amira-hassan', items: ['Skript aufräumen'] }, { who: 'julia-weber', items: ['Reiseabrechnung Konferenz'] }],
          shared: [{ t: 'Sensitivitätsanalyse', who: 'amira-hassan', due: 'KW 46' }, { t: 'Abbildung 3 neu rechnen', who: 'lukas-gerber', due: 'Fr' }, { t: 'Antwortbrief Journal', who: 'nina-petrovic', due: 'KW 48' }],
          recommend: 'Revisionspunkte mit Person und Termin als gemeinsame Liste beim Paper. Für die Sommerkampagne ein eigener Plan, danach archivieren.',
          boundary: 'Formularfristen und Reisetermine bleiben im Kalender, nicht in einem Aufgabenplan. Persönliche Arbeit an Skripten bleibt persönlich.'
        }
      }
    },

    'sitzungszyklus': {
      variants: [
        { id: 'gastzugang', label: 'Ein Kanal, externes Mitglied als Gast',
          why: 'Die Kommission entscheidet sich für Gastzugang, damit {p:beat-kunz} dieselben Unterlagen sieht wie alle. Annahme: Die Richtlinien beider Hochschulen erlauben das und er nutzt ein Konto dafür. Das prüft die IT, nicht diese Szene.',
          team: 'Kommission Digitale Zusammenarbeit', teamNote: 'ein Kanal, bewusst schlank',
          members: ['martina-vogel', 'samuel-huber', 'anna-bachmann', 'karim-haddad', 'sarah-baumgartner', 'claudia-gisler', 'beat-kunz'],
          channels: ['Allgemein'], active: 'Allgemein' },
        { id: 'link', label: 'Ein Kanal, Link pro Sitzung für das externe Mitglied',
          why: 'Wenn Gastzugang nicht erlaubt oder nicht gewünscht ist: {p:beat-kunz} ist nicht im Team und erhält pro Sitzung einen Link auf den Unterlagenordner. Wie dieser Link geschützt ist, regelt die IT.',
          team: 'Kommission Digitale Zusammenarbeit', teamNote: 'ein Kanal, bewusst schlank',
          members: ['martina-vogel', 'samuel-huber', 'anna-bachmann', 'karim-haddad', 'sarah-baumgartner', 'claudia-gisler'],
          channels: ['Allgemein'], active: 'Allgemein' }
      ],
      scene: {
        posts: [
          { id: 'p1', by: 'claudia-gisler', time: 'Mo 09:00', title: 'Unterlagen Sitzung 4 liegen bereit',
            text: 'Agenda und Unterlagen im Ordner «Sitzung 4». Die Einladung per Mail enthält nur noch den Link.',
            file: 'Sitzung 4 /', replies: [{ by: 'martina-vogel', time: 'Mo 10:15', text: 'Danke. Rückmeldungen zur Agenda bitte bis Mittwoch direkt in der Datei.' }], mark: 1 },
          { id: 'p2', by: 'martina-vogel', time: 'Do 17:30', title: 'Entscheid: Pilot Kollaborationsrichtlinie freigegeben',
            text: 'Beschluss aus Sitzung 4. Eintrag in der Entscheid-Übersicht, mit Link zum Protokoll.',
            file: 'Entscheide.xlsx', replies: [{ by: 'sarah-baumgartner', time: 'Fr 08:10', text: 'IT Services startet den Pilot im Januar.' }], mark: 2 },
          { id: 'p3', by: 'claudia-gisler', time: 'Fr 11:00', title: 'Pendenzen bis Sitzung 5',
            text: 'Wie bisher am Ende des Protokolls. Ich frage zwei Wochen vor der Sitzung bei den Verantwortlichen nach.', replies: [], mark: 3 }
        ],
        files: [
          { name: 'Sitzung 4 /', kind: 'folder', by: 'claudia-gisler', when: 'Mo 09:00', note: 'Agenda, Unterlagen, Protokoll', mark: 1 },
          { name: 'Agenda.docx', kind: 'doc', by: 'claudia-gisler', when: 'Mi', note: 'eine Datei, vom Sekretariat gepflegt' },
          { name: 'Entscheide.xlsx', kind: 'table', by: 'claudia-gisler', when: 'Do 17:30', note: 'Datum, Beschluss, Link zum Protokoll', mark: 2 },
          { name: 'Protokolle / 2026 /', kind: 'folder', by: 'claudia-gisler', when: '', note: 'verabschiedete Fassungen als PDF' }
        ],
        tasks: [],
        outside: ['Beschlüsse gehen auf dem offiziellen Weg an die Universitätsleitung'],
        notes: {
          1: 'Ein Ordner pro Sitzung. Die Mail ist nur noch der Hinweis mit Link.',
          2: 'Entscheide stehen in einer Übersicht, statt nur in Protokollen.',
          3: 'Acht Pendenzen im Jahr brauchen keinen Aufgabenplan. Die Tabelle bleibt, das Nachfragen wird verlässlich.'
        }
      },
      principles: {
        chat: {
          problem: 'Die Vorsitzende und die Fakultätsvertretung klären am Telefon und im Chat, dass der Pilot startet. Drei Mitglieder erfahren es erst aus dem Protokoll.',
          decision: 'Pilot Kollaborationsrichtlinie freigegeben',
          inChat: ['martina-vogel', 'samuel-huber'], later: ['karim-haddad', 'sarah-baumgartner', 'anna-bachmann'],
          recommend: 'Beschlüsse als Beitrag in «{c}» und als Zeile in der Entscheid-Übersicht, mit Link zum Protokoll.',
          boundary: 'Mail bleibt der Weg für Einladung und Hinweis. Verbindlich ist der offizielle Weg an die Universitätsleitung.'
        },
        doc: {
          problem: 'Die Unterlagen gehen als Mailanhang an sieben Personen; {p:beat-kunz} hat sie nicht erhalten, {p:martina-vogel} schickt eine neuere Fassung.',
          artefact: 'Agenda Sitzung 4', copies: ['Agenda_v2.docx', 'Agenda_v2_nach_Rückmeldung_Vogel.docx', 'Agenda_final.pdf'],
          editors: ['claudia-gisler', 'martina-vogel', 'samuel-huber'], drafter: 'martina-vogel', draft: 'Notizen zur Sitzungsleitung',
          recommend: 'Ein Ordner pro Sitzung in «{c}», die Mail enthält nur den Link. Die beschlossene Fassung wird als PDF eingefroren.',
          boundary: 'Notizen der Vorsitzenden bleiben persönlich. Wie {p:beat-kunz} Zugriff erhält, hängt vom gewählten Aufbau ab (Gast oder Link) und von den Regeln der IT.'
        },
        tasks: {
          problem: 'Pendenzen stehen am Ende des Protokolls und werden erst an der nächsten Sitzung gelesen.',
          personal: [{ who: 'karim-haddad', items: ['Stellungnahme Forschung vorbereiten'] }, { who: 'sarah-baumgartner', items: ['Pilotgruppe anfragen'] }],
          shared: [],
          lean: 'Die Pendenzentabelle am Ende des Protokolls bleibt. Zwei Wochen vor jeder Sitzung fragt {p:claudia-gisler} bei den Verantwortlichen nach.',
          recommend: 'Kein Aufgabenplan für acht Pendenzen im Jahr. Verlässliches Nachfragen durch das Sekretariat genügt.',
          boundary: 'Wenn die Pendenzen deutlich zunehmen oder zwischen den Sitzungen gearbeitet wird, lohnt sich eine gemeinsame Liste im Kanal.'
        }
      }
    },

    'semesterstart': {
      variants: [
        { id: 'ohne-bewertung', label: 'Modulteam mit zwei Kanälen',
          why: 'Ein Team pro Modul, jedes Jahr weiterverwendet. {p:fabian-steiner} ist Mitglied und sieht das Bewertungsraster nur lesend; Noten bleiben im offiziellen System. Ein Kanal «Bewertung» ist hier nicht nötig.',
          team: 'Lehrteam Seminar «Stadt, Raum, Gesellschaft»', teamNote: 'pro Modul, jährlich weiterverwendet',
          members: ['ruth-ammann', 'simon-luethi', 'fabian-steiner'],
          channels: ['Allgemein', 'Semester'], active: 'Semester' },
        { id: 'mit-bewertung', label: 'Zusätzlicher Kanal «Bewertung» nur für Dozierende',
          why: 'Nur nötig, wenn tatsächlich vertrauliche Dateien der Dozierenden dazukommen, etwa Gutachten zu Härtefällen. Annahme: Der Kanal ist auf {p:ruth-ammann} und {p:simon-luethi} beschränkt; wie das technisch umgesetzt wird, ist hier nicht geprüft. Noten bleiben trotzdem im offiziellen System.',
          team: 'Lehrteam Seminar «Stadt, Raum, Gesellschaft»', teamNote: 'pro Modul, jährlich weiterverwendet',
          members: ['ruth-ammann', 'simon-luethi', 'fabian-steiner'],
          channels: ['Allgemein', 'Semester', 'Bewertung (nur Dozierende)'], active: 'Semester' }
      ],
      scene: {
        posts: [
          { id: 'p1', by: 'ruth-ammann', time: 'Mo 08:10', title: 'Semesterplan: eine Fassung',
            text: 'Semesterplan und Lesematerial liegen unter «Dateien». Die Lernplattform zeigt den Auszug für die Studierenden.',
            file: 'Semesterplan.xlsx', replies: [{ by: 'simon-luethi', time: 'Mo 09:02', text: 'Meine Fassung ist übertragen und gelöscht. Woche 7 ist jetzt die Exkursion.' }], mark: 1 },
          { id: 'p2', by: 'fabian-steiner', time: 'Do 16:45', title: 'Rückfragen zu Aufgabe 2',
            text: 'Sechs Fragen im Forum der Lernplattform, alle beantwortet. Hier nur die Zusammenfassung für uns.',
            replies: [{ by: 'ruth-ammann', time: 'Do 17:20', text: 'Gut so. Die Präzisierung zur Quellenangabe übernehmen wir nächstes Jahr in die Aufgabenstellung.' }], mark: 2 },
          { id: 'p3', by: 'simon-luethi', time: 'Fr 11:00', title: 'Übergabedossier angelegt',
            text: 'Für die Nachfolge im nächsten Jahr: freigegebene Unterlagen und eine Seite «Was ich nächstes Mal anders machen würde».',
            file: 'Übergabedossier /', replies: [], mark: 3 }
        ],
        files: [
          { name: 'Semesterplan.xlsx', kind: 'table', by: 'ruth-ammann', when: 'Mo 08:10', note: 'Quelle; Lernplattform zeigt Auszug', mark: 1 },
          { name: 'Lesematerial /', kind: 'folder', by: 'simon-luethi', when: 'letzte Woche', note: 'Quelle; Auslieferung über die Lernplattform' },
          { name: 'Bewertungsraster.docx', kind: 'doc', by: 'ruth-ammann', when: 'Mi', note: 'für {p:fabian-steiner} nur lesend' },
          { name: 'Übergabedossier /', kind: 'folder', by: 'simon-luethi', when: 'Fr 11:00', note: 'für die Nachfolge', mark: 3 }
        ],
        tasks: [],
        outside: ['Lernplattform: Studierende, Abgaben, Forum', 'Bewertungssystem: Noten und Einzelbewertungen'],
        notes: {
          1: 'Eine Quelle im Teamordner statt drei Fassungen in drei Postfächern.',
          2: 'Studierende bleiben auf der Lernplattform. Ins Team kommt nur, was das Lehrteam weiterbringt.',
          3: 'Das Wissen bleibt im Team, wenn {p:simon-luethi} geht.'
        }
      },
      principles: {
        chat: {
          problem: 'Eine Studentin schreibt allen drei zu Aufgabe 2; {p:simon-luethi} und {p:fabian-steiner} antworten unterschiedlich.',
          decision: 'Rückfragen laufen über das Forum der Lernplattform',
          inChat: ['simon-luethi', 'fabian-steiner'], later: ['ruth-ammann'],
          recommend: 'Absprachen im Lehrteam laufen in «{c}». Antworten an Studierende gehören ins Forum der Lernplattform.',
          boundary: 'Teams ersetzt die Lernplattform nicht. Die Studierenden sind nicht im Team.'
        },
        doc: {
          problem: 'Material und Semesterplan existieren in mehreren Fassungen in drei Postfächern.',
          artefact: 'Semesterplan.xlsx', copies: ['Semesterplan_Simon.xlsx', 'Semesterplan_HS_v3.xlsx', 'Semesterplan (Lernplattform).pdf'],
          editors: ['simon-luethi', 'ruth-ammann', 'fabian-steiner'], drafter: 'simon-luethi', draft: 'Neue Aufgabenstellung Woche 9',
          recommend: 'Eine Quelle im Teamordner; die Lernplattform zeigt den Auszug für die Studierenden.',
          boundary: 'Noten und Einzelbewertungen nie im Team, nur im offiziellen Bewertungssystem. Entwürfe bleiben persönlich, bis sie abgesprochen sind.'
        },
        tasks: {
          problem: 'Jedes Semester beginnt bei null; was zu tun ist, steht im Postfach der Vorgängerin.',
          personal: [{ who: 'simon-luethi', items: ['Exkursion Woche 7 planen'] }, { who: 'fabian-steiner', items: ['Korrekturen Aufgabe 2'] }],
          shared: [],
          lean: 'Eine Tabelle im Teamordner genügt für drei Personen. Das Übergabedossier hält fest, was nächstes Jahr anders sein soll.',
          recommend: 'Kein Aufgabenplan für ein Lehrteam mit drei Personen. Semesterplan und Übergabedossier tragen die gemeinsamen Verpflichtungen.',
          boundary: 'Wenn mehrere Gastreferierende und Exkursionen dazukommen, kann eine gemeinsame Liste im Kanal sinnvoll werden.'
        }
      }
    },

    'nora-publikation': {
      personalScene: {
        files: [
          { name: 'Artikel_Grenzen.docx', kind: 'doc', note: 'geteilt mit der Coautorin, Link mit Bearbeitungsrecht', mark: 1 },
          { name: 'Forschungsnotizen /', kind: 'folder', note: 'nur Nora', mark: 2 },
          { name: 'Frühe Entwürfe /', kind: 'folder', note: 'nur Nora', mark: 2 },
          { name: 'Lehrunterlagen /', kind: 'folder', note: 'nur Nora' }
        ],
        todo: ['Kommentare der Coautorin durchgehen', 'Kapitel 3 kürzen', 'Literatur bestellen'],
        note: 'Kein Team. Zwei Autorinnen, eine Datei, ein Link.',
        outside: ['Mail für Studierende und Externe'],
        notes: {
          1: 'Die Coautorin kommentiert direkt in der Datei. Keine «v5_zusammengeführt» mehr.',
          2: 'Notizen und frühe Entwürfe bleiben persönlich, nichts muss umziehen.'
        }
      },
      principles: {
        chat: {
          problem: 'Die Coautorin schickt Kommentare als Mailanhang; {p:nora-keller} führt sie von Hand in «v5» zusammen.',
          decision: 'Kommentare direkt im geteilten Artikel',
          inChat: ['nora-keller'], later: [], laterLabel: 'Coautorin (Wien)',
          recommend: 'Die Diskussion zum Artikel findet als Kommentar im Dokument statt, nicht im Postfach.',
          boundary: 'Ein gemeinsamer Raum lohnt sich erst, wenn eine dritte Person oder Daten dazukommen.'
        },
        doc: {
          problem: 'Der Entwurf liegt in OneDrive, die Coautorin bekommt Kopien per Mail, niemand weiss, welche Fassung gilt.',
          artefact: 'Artikel_Grenzen.docx', copies: ['Artikel_Nora_v4.docx', 'Artikel_Nora_v4_Kommentare.docx', 'Artikel_v5_zusammengeführt.docx'],
          editors: ['nora-keller'], editorsLabel: 'Coautorin (Wien)', drafter: 'nora-keller', draft: 'Forschungsnotizen',
          recommend: 'Die Datei bleibt in Noras OneDrive; die Coautorin bekommt einen Link mit Bearbeitungsrecht.',
          boundary: 'Notizen und frühe Entwürfe bleiben in OneDrive. Persönliche Arbeit darf persönlich bleiben.'
        },
        tasks: {
          problem: 'Was am Artikel noch offen ist, wissen beide Autorinnen nur aus ihren eigenen Listen.',
          personal: [{ who: 'nora-keller', items: ['Kapitel 3 kürzen', 'Literatur bestellen'] }],
          shared: [],
          lean: 'Offene Punkte zum Artikel stehen als Kommentare im Dokument; die eigene Liste bleibt bei Nora.',
          recommend: 'Für zwei Autorinnen kein Aufgabenplan. Offene Punkte als Kommentar im Artikel, mit @Erwähnung.',
          boundary: 'Kommt ein Projekt mit mehreren Beteiligten dazu, wandert der Artikel in dessen Team.'
        }
      }
    },

    'nora-abwesenheit': {
      personalScene: {
        files: [
          { name: 'Übergabe.docx', kind: 'doc', note: 'für die Vertretung freigegeben', mark: 1 },
          { name: 'Gutachten_Entwurf.docx', kind: 'doc', note: 'für die Vertretung freigegeben', mark: 1 },
          { name: 'Forschungsnotizen /', kind: 'folder', note: 'nur Nora, bleibt zu', mark: 2 },
          { name: 'Lehrunterlagen /', kind: 'folder', note: 'nur Nora, bleibt zu', mark: 2 }
        ],
        todo: ['Gutachten bis 15.', 'Betreuung Lea M., Di', 'Betreuung Tom R., Do', 'Workshop-Einladung versenden'],
        note: 'Die Vertretung sieht die Übergabe-Notiz und zwei Dateien, nicht das ganze OneDrive.',
        outside: ['Betreuungstermine: Outlook-Kalender', 'Abgaben der Studierenden: System der Universität'],
        notes: {
          1: 'Eine Übergabe-Notiz mit Terminen und Kontext, dazu gezielt freigegebene Dateien.',
          2: 'Der Rest bleibt persönlich. Wer vertritt, braucht nicht das ganze Archiv.'
        }
      },
      principles: {
        chat: {
          problem: 'Die Vertretung kennt nur Noras Mailbetreffs und fragt im Sekretariat: «Was ist dringend?»',
          decision: 'Übergabe-Notiz mit Terminen und Kontext',
          inChat: ['nora-keller'], later: [], laterLabel: 'Vertretung',
          recommend: 'Eine Übergabe-Notiz plus einzelne Dateien gezielt freigeben.',
          boundary: 'Kein Zugriff auf das ganze OneDrive. Nicht jede Abwesenheit braucht ein Team.'
        },
        doc: {
          problem: 'Wichtige Dateien liegen verstreut in OneDrive; das Gutachten existiert in zwei Entwürfen.',
          artefact: 'Übergabe.docx', copies: ['Gutachten_v1.docx', 'Gutachten_v2_neu.docx', 'Notizen_Betreuung.docx'],
          editors: ['nora-keller'], editorsLabel: 'Vertretung', drafter: 'nora-keller', draft: 'Forschungsnotizen',
          recommend: 'Eine Übergabe-Seite verlinkt die zwei Dateien, die die Vertretung braucht.',
          boundary: 'Das OneDrive bleibt zu. Abgaben und Bewertungen der Studierenden liegen im System der Universität.'
        },
        tasks: {
          problem: 'Die offenen Aufgaben sind in Noras privater To-Do-Liste.',
          personal: [{ who: 'nora-keller', items: ['Literatur bestellen', 'Reisekosten einreichen'] }],
          shared: [{ t: 'Gutachten abschliessen', who: 'nora-keller', due: '15.' }, { t: 'Betreuung Lea M.', who: 'nora-keller', due: 'Di' }, { t: 'Workshop-Einladung', who: 'nora-keller', due: 'Fr' }],
          sharedLabel: 'Übergabe-Notiz für die Vertretung',
          recommend: 'Die drei dringenden Punkte stehen mit Termin in der Übergabe-Notiz, nicht nur in Noras To Do.',
          boundary: 'Alles andere bleibt in Noras eigener Liste. Kein Aufgabenplan für drei Wochen.'
        }
      }
    },

    'nora-reihe': {
      personalScene: {
        files: [
          { name: 'Institutsablage › Borders & Mobility /', kind: 'folder', note: 'mit dem Sekretariat geteilt', mark: 1 },
          { name: 'Programm_2027.docx', kind: 'doc', note: 'im Ordner der Institutsablage', mark: 1 },
          { name: 'Kontaktliste Referierende.xlsx', kind: 'table', note: 'im Ordner der Institutsablage' },
          { name: 'Ideen für Termin 3 /', kind: 'folder', note: 'nur Nora', mark: 2 }
        ],
        todo: ['Referierende Termin 1 anfragen', 'Programmtext schreiben', 'Raum für Termin 2 klären'],
        note: 'Kein Team: ein Ordner in der Institutsablage und eine Outlook-Terminserie.',
        outside: ['Outlook-Terminserie: drei Termine', 'Honorare: Prozess des Sekretariats'],
        notes: {
          1: 'Programm und Kontaktliste liegen einmal in der Institutsablage, nicht als Word-Datei bei Nora und als Anhang beim Sekretariat.',
          2: 'Ideen bleiben persönlich, bis sie ins Programm gehen.'
        }
      },
      principles: {
        chat: {
          problem: 'Das Sekretariat fragt im Chat nach dem Honorar; die Antwort findet später niemand.',
          decision: 'Ordner in der Institutsablage plus Terminserie',
          inChat: ['nora-keller'], later: [], laterLabel: 'Sekretariat',
          recommend: 'Absprachen zur Reihe gehören in den gemeinsamen Ordner und in die Terminserie, nicht in einen Chat.',
          boundary: 'Drei Termine im Jahr brauchen kein Team. Wenn mehr als drei Personen aktiv Aufgaben tragen, kippt es in ein Team.'
        },
        doc: {
          problem: 'Das Programm liegt als Word-Datei bei Nora und als Mailanhang beim Sekretariat.',
          artefact: 'Programm_2027.docx', copies: ['Programm_Workshop.docx', 'Programm_Workshop_Sekretariat.docx', 'Programm_final_v2.docx'],
          editors: ['nora-keller'], editorsLabel: 'Sekretariat', drafter: 'nora-keller', draft: 'Ideen für Termin 3',
          recommend: 'Ein Ordner in der Institutsablage mit Programm und Kontaktliste, gemeinsam mit dem Sekretariat.',
          boundary: 'Ideen bleiben bei Nora, bis sie ins Programm gehen. Honorare laufen über den Prozess des Sekretariats.'
        },
        tasks: {
          problem: 'Aufgaben stehen in Noras To Do, das Sekretariat führt eine eigene Liste.',
          personal: [{ who: 'nora-keller', items: ['Programmtext schreiben'] }],
          shared: [{ t: 'Referierende Termin 1 anfragen', who: 'nora-keller', due: 'Feb' }, { t: 'Raum Termin 2 reservieren', whoLabel: 'Sekretariat', due: 'März' }, { t: 'Honorarvertrag Referentin', whoLabel: 'Sekretariat', due: 'April' }],
          sharedLabel: 'Liste im Ordner, mit dem Sekretariat',
          recommend: 'To Do für Noras Aufgaben; nur was das Sekretariat übernimmt, kommt in eine gemeinsame Liste.',
          boundary: 'Kein Aufgabenplan für drei Termine im Jahr. Persönliche To-dos bleiben persönlich.'
        }
      }
    }
  };

  LIB.situations.forEach(function (s) {
    var c = COMPLETE[s.id];
    if (!c) return;
    for (var k in c) s[k] = c[k];
    s.complete = true;
  });
})(window.LIB);
