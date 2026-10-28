/*
 * Library content for the visual-first prototype (v3 view layer).
 *
 * - Higher-education worlds stay in worlds.js (HE_WORLDS / HE_ATLAS) and are referenced by id.
 * - The business world below is a fictional synthesis, not an evidence-backed industry standard.
 * - Text may contain tokens: {p:person-id} renders that person's current (possibly customised) name,
 *   {s} the situation/team name. That keeps Szene, Prinzip and Präsentieren consistent.
 */
window.LIB = {
  schema: 'msteams-personas.library/v3-prototype',

  collections: [
    { id: 'hochschule', label: 'Hochschule', source: 'HE_WORLDS (Unibas / isolutions, fiktiv)' },
    { id: 'business', label: 'Business', source: 'Fiktive Synthese, noch nicht durch Recherche validiert' }
  ],

  /* ---------------- Business world (fictional) ---------------- */
  business: {
    id: 'brunner-marketing',
    collection: 'business',
    name: 'Marketing & Kommunikation, Brunner Haustechnik AG',
    short: 'Marketing-Abteilung',
    type: 'business-department',
    tagline: 'Kleine Abteilung, die ein bereichsübergreifendes Projekt mit IT, Vertrieb und einer Agentur koordiniert.',
    tension: 'Das Kundenportal gehört allen ein bisschen: Anforderungen kommen aus dem Vertrieb, die Technik aus der IT, die Texte von der Agentur.',
    size: 6,
    people: [
      { id: 'petra-schmid', name: 'Petra Schmid', role: 'Abteilungsleitung Marketing', focus: 'Budget, Prioritäten, Freigaben' },
      { id: 'luca-bernasconi', name: 'Luca Bernasconi', role: 'Projektleitung Kundenportal', focus: 'Plan, Termine, Abstimmung zwischen den Bereichen' },
      { id: 'aylin-demir', name: 'Aylin Demir', role: 'Content & Kampagnen', focus: 'Texte, Bilder, Launch-Kommunikation' },
      { id: 'marco-gerber', name: 'Marco Gerber', role: 'IT, Schnittstellen', focus: 'Anbindung ans CRM; gehört zur IT, nicht zur Abteilung', outside: true },
      { id: 'sandra-huber', name: 'Sandra Huber', role: 'Vertrieb Innendienst', focus: 'Anforderungen aus Kundensicht; gehört zum Vertrieb', outside: true },
      { id: 'tim-vogel', name: 'Tim Vogel', role: 'Agentur Nordlicht (extern)', focus: 'Gestaltung und Portaltexte, nur für dieses Projekt', external: true }
    ],
    artefacts: [
      { id: 'anforderungen', name: 'Anforderungsliste Kundenportal', owner: 'sandra-huber', state: 'shared' },
      { id: 'projektplan', name: 'Projektplan Kundenportal', owner: 'luca-bernasconi', state: 'shared' },
      { id: 'portaltexte', name: 'Portaltexte', owner: 'aylin-demir', state: 'draft' },
      { id: 'kundendaten', name: 'Kundendaten', owner: 'marco-gerber', state: 'outside' }
    ],
    scenario: {
      id: 'kundenportal-launch',
      name: 'Kundenportal bis März',
      trigger: 'Die Geschäftsleitung setzt den Launch auf März fest; drei Bereiche und eine Agentur arbeiten ab sofort am selben Portal.',
      description: 'Anforderungen, Texte und Technik entstehen parallel. Bisher laufen sie über Mail-Anhänge, Einzelchats und persönliche Listen.'
    }
  },

  /* ---------------- Situations: what the library, configurator and renderers share ---------------- */
  situations: [
    {
      id: 'leadership-forum',
      world: 'campus-people-development', scenario: 'leadership-forum-2027',
      complete: true,
      title: 'Leadership Forum 2027',
      persona: 'Verwaltungsteam mit befristetem Projekt',
      friction: 'Entscheide fallen im Chat, der Veranstaltungsplan existiert in drei Fassungen.',
      usecases: ['entscheide', 'fassungen', 'pendenzen'],
      variants: [
        {
          id: 'eigenes-team', label: 'Eigenes Team für das Forum',
          why: 'Campus & People Development und HR Services tragen das Forum gleichberechtigt, über mehr als ein Jahr, mit Budget, Aufgaben und Externen. Das Ende wird gleich eingeplant: archivieren nach der Nachbereitung.',
          team: 'Leadership Forum 2027', teamNote: 'befristet bis Anfang 2028',
          members: ['lea-baumann', 'sophie-frei', 'jonas-meier', 'mara-conti', 'daniel-wyss', 'regula-aebi'],
          channels: ['Allgemein', 'Konzeption', 'Referierende', 'Durchführung'], active: 'Durchführung'
        },
        {
          id: 'kanal', label: 'Kanal im bestehenden Team',
          why: 'Passt, wenn das Forum praktisch Sache des Teams ist und HR Services nur punktuell zuarbeitet. Am wenigsten Aufwand; HR Services muss dann ins ganze Team oder bleibt auf Links angewiesen.',
          team: 'Campus & People Development', teamNote: 'dauerhaftes Team',
          members: ['lea-baumann', 'sophie-frei', 'jonas-meier', 'mara-conti', 'daniel-wyss'],
          channels: ['Allgemein', 'Leadership Forum', 'Learning Programme', 'Interne Organisation'], active: 'Leadership Forum'
        }
      ],
      scene: {
        posts: [
          { id: 'p1', by: 'sophie-frei', time: 'Di 09:12', title: 'Entscheid: Termin 3 findet online statt',
            text: 'Nach Rücksprache mit {p:regula-aebi}: Der Raum ist doppelt belegt, wir wechseln auf online. Einladung folgt bis Freitag.',
            replies: [
              { by: 'daniel-wyss', time: 'Di 09:30', text: 'Ich passe die Einladung an und stelle den Entwurf hier rein.' },
              { by: 'regula-aebi', time: 'Di 10:02', text: 'Passt für HR Services. Bitte die HR-Teilnehmenden separat informieren.' }
            ], mark: 1 },
          { id: 'p2', by: 'mara-conti', time: 'Di 09:40', title: 'Veranstaltungsplan nachgeführt',
            text: 'Bitte nur noch diese Datei verwenden. Die Excel-Fassungen aus dem Postfach sind ab heute veraltet.',
            file: 'Veranstaltungsplan.xlsx', replies: [{ by: 'sophie-frei', time: 'Di 11:15', text: 'Danke. Referierende für Termin 4 sind ergänzt.' }], mark: 2 },
          { id: 'p3', by: 'lea-baumann', time: 'Mi 08:05', title: 'Pendenzen ab jetzt im Plan',
            text: 'Offene Punkte mit Verantwortung und Termin stehen im Reiter Aufgaben. Persönliche To-dos bleiben bei euch.', replies: [], mark: 3 }
        ],
        files: [
          { name: 'Veranstaltungsplan.xlsx', kind: 'table', by: 'mara-conti', when: 'Di 09:40', note: 'eine Fassung, Link statt Anhang', mark: 2 },
          { name: 'Konzept Leadership Forum.docx', kind: 'doc', by: 'sophie-frei', when: 'letzte Woche', note: 'abgestimmte Fassung' },
          { name: 'Einladung Termin 3.docx', kind: 'doc', by: 'daniel-wyss', when: 'Di 09:31', note: 'Entwurf, gemeinsam überarbeitet' },
          { name: 'Referierendenliste.xlsx', kind: 'table', by: 'sophie-frei', when: 'Mo', note: '' }
        ],
        tasks: [
          { title: 'Einladung Termin 3 versenden', owner: 'daniel-wyss', due: 'Fr', bucket: 'Kommunikation', done: false, mark: 3 },
          { title: 'Online-Raum für Termin 3 einrichten', owner: 'mara-conti', due: 'Do', bucket: 'Organisation', done: false },
          { title: 'Referierende Termin 4 bestätigen', owner: 'sophie-frei', due: 'nächste Woche', bucket: 'Referierende', done: false },
          { title: 'Feedback Termin 2 auswerten', owner: 'jonas-meier', due: 'erledigt', bucket: 'Nachbereitung', done: true }
        ],
        outside: ['Anmeldesystem der Universität: Anmeldedaten bleiben dort'],
        notes: {
          1: 'Der Entscheid steht mit Ergebnis im Titel im Kanal. Wer später fragt, findet ihn hier statt in einem Zweierchat.',
          2: 'Eine Datei im Kanal ersetzt drei Excel-Fassungen im Postfach.',
          3: 'Gemeinsame Pendenzen haben eine sichtbare Verantwortung und einen Termin.'
        }
      },
      principles: {
        chat: {
          problem: '{p:sophie-frei} und {p:regula-aebi} entscheiden im Chat, dass Termin 3 online stattfindet. {p:mara-conti} bucht weiter den Raum.',
          decision: 'Termin 3 findet online statt',
          inChat: ['sophie-frei', 'regula-aebi'], later: ['mara-conti', 'daniel-wyss', 'lea-baumann'],
          recommend: 'Entscheide zum Forum gehören als Beitrag mit dem Ergebnis im Titel in den Kanal «{c}».',
          boundary: 'Kurze Rückfragen zu zweit bleiben im Chat. Vertrauliches aus HR-Gesprächen gehört nicht in den Kanal.'
        },
        doc: {
          problem: 'Der Veranstaltungsplan liegt in drei Fassungen vor: bei {p:mara-conti}, bei {p:sophie-frei} und bei HR Services.',
          artefact: 'Veranstaltungsplan', copies: ['Veranstaltungsplan_Mara.xlsx', 'Plan_SF_v2.xlsx', 'Teilnehmende_HR.xlsx'],
          editors: ['mara-conti', 'sophie-frei', 'regula-aebi'], origin: 'mara-conti', drafter: 'sophie-frei', draft: 'Rohkonzept Termin 5',
          recommend: 'Eine Tabelle in den Dateien von «{c}», geteilt als Link statt als Anhang.',
          boundary: 'Rohkonzepte bleiben bei {p:sophie-frei}, bis sie abgestimmt sind. Anmeldedaten bleiben im Anmeldesystem.'
        },
        tasks: {
          problem: '{p:mara-conti} fragt das ganze Team per Mail: «Wer hat die aktuelle Pendenzenliste?»',
          personal: [{ who: 'mara-conti', items: ['Einarbeitungsfragen notieren'] }, { who: 'daniel-wyss', items: ['Newsletter-Text entwerfen'] }],
          shared: [{ t: 'Einladung Termin 3 versenden', who: 'daniel-wyss', due: 'Fr' }, { t: 'Online-Raum einrichten', who: 'mara-conti', due: 'Do' }, { t: 'Referierende bestätigen', who: 'sophie-frei', due: 'KW 12' }],
          recommend: 'Gemeinsame Pendenzen des Forums mit Verantwortung und Termin in einen Plan im Team.',
          boundary: 'Persönliche To-dos bleiben in der eigenen Liste. Nicht jede Kleinigkeit braucht eine Aufgabe im Plan.'
        }
      }
    },

    {
      id: 'kundenportal',
      world: 'brunner-marketing', scenario: 'kundenportal-launch',
      complete: true,
      title: 'Kundenportal bis März',
      persona: 'Abteilung koordiniert ein bereichsübergreifendes Projekt',
      friction: 'Anforderungen in Mail-Anhängen, Entscheide in Einzelchats, die Agentur arbeitet mit alten Fassungen.',
      usecases: ['entscheide', 'fassungen', 'pendenzen', 'externe'],
      variants: [
        {
          id: 'eigenes-team', label: 'Eigenes, befristetes Projektteam',
          why: 'Marketing, IT und Vertrieb arbeiten gleichberechtigt bis zum Launch. Ein eigenes Team bündelt Plan, Anforderungen und Entscheide und wird nach dem Launch archiviert.',
          assumption: 'Die Agentur ({p:tim-vogel}) ist nicht Mitglied; sie arbeitet nur an freigegebenen Dateien. Wie ihr Zugriff technisch geregelt ist, klärt die IT.',
          team: 'Projekt Kundenportal', teamNote: 'befristet bis Launch + 3 Monate',
          members: ['petra-schmid', 'luca-bernasconi', 'aylin-demir', 'marco-gerber', 'sandra-huber'],
          channels: ['Allgemein', 'Anforderungen', 'Inhalte & Agentur', 'Technik'], active: 'Anforderungen'
        },
        {
          id: 'kanal', label: 'Projektkanal im Abteilungsteam',
          why: 'Passt, wenn das Projekt im Kern Sache des Marketings bleibt und IT und Vertrieb nur punktuell beitragen. Weniger Struktur, aber IT und Vertrieb sehen dann die ganze Abteilung.',
          team: 'Marketing & Kommunikation', teamNote: 'dauerhaftes Abteilungsteam',
          members: ['petra-schmid', 'luca-bernasconi', 'aylin-demir'],
          channels: ['Allgemein', 'Kampagnen', 'Kundenportal', 'Budget'], active: 'Kundenportal'
        }
      ],
      scene: {
        posts: [
          { id: 'p1', by: 'luca-bernasconi', time: 'Mo 08:30', title: 'Entscheid: Login per Kundennummer zum Launch',
            text: 'Wir starten mit Login per Kundennummer. Single Sign-on kommt in Phase 2. Abgestimmt mit {p:marco-gerber} und {p:sandra-huber}.',
            replies: [
              { by: 'sandra-huber', time: 'Mo 08:52', text: 'Gut. Ich informiere den Innendienst, damit wir Kundenfragen beantworten können.' },
              { by: 'marco-gerber', time: 'Mo 09:10', text: 'Schnittstelle zum CRM ist dafür bereit. Details im Kanal Technik.' }
            ], mark: 1 },
          { id: 'p2', by: 'sandra-huber', time: 'Mo 10:15', title: 'Anforderungsliste aktualisiert',
            text: 'Zwölf neue Punkte aus Kundengesprächen. Bitte direkt in der Datei kommentieren, nicht per Mail.',
            file: 'Anforderungsliste Kundenportal.xlsx', replies: [{ by: 'aylin-demir', time: 'Mo 11:02', text: 'Ich übernehme die Punkte zu Texten und FAQ.' }], mark: 2 },
          { id: 'p3', by: 'petra-schmid', time: 'Di 07:55', title: 'Freigaben laufen über den Plan',
            text: 'Jede offene Freigabe steht als Aufgabe mit Verantwortung und Termin im Reiter Aufgaben.', replies: [], mark: 3 }
        ],
        files: [
          { name: 'Anforderungsliste Kundenportal.xlsx', kind: 'table', by: 'sandra-huber', when: 'Mo 10:15', note: 'eine Liste, alle kommentieren darin', mark: 2 },
          { name: 'Projektplan Kundenportal.xlsx', kind: 'table', by: 'luca-bernasconi', when: 'Fr', note: 'Meilensteine bis März' },
          { name: 'Portaltexte.docx', kind: 'doc', by: 'aylin-demir', when: 'gestern', note: 'gemeinsam mit {p:tim-vogel}' },
          { name: 'Freigabeprotokoll.docx', kind: 'doc', by: 'petra-schmid', when: 'Di', note: '' }
        ],
        tasks: [
          { title: 'Texte Startseite freigeben', owner: 'petra-schmid', due: 'Do', bucket: 'Freigaben', done: false, mark: 3 },
          { title: 'Kundennummer-Login testen', owner: 'marco-gerber', due: 'nächste Woche', bucket: 'Technik', done: false },
          { title: 'FAQ-Entwürfe liefern', owner: 'aylin-demir', due: 'Fr', bucket: 'Inhalte', done: false },
          { title: 'Anforderungen priorisieren', owner: 'sandra-huber', due: 'erledigt', bucket: 'Anforderungen', done: true }
        ],
        outside: ['CRM: Kundendaten bleiben dort, das Portal liest sie nur über die Schnittstelle'],
        notes: {
          1: 'Der Entscheid steht mit Ergebnis im Titel im Kanal. IT und Vertrieb lesen dieselbe Fassung.',
          2: 'Eine Anforderungsliste mit Kommentaren statt fünf Mail-Anhängen.',
          3: 'Freigaben sind gemeinsame Verpflichtungen: sichtbar, mit Person und Termin.'
        }
      },
      principles: {
        chat: {
          problem: '{p:luca-bernasconi} und {p:marco-gerber} entscheiden im Chat über das Login. {p:aylin-demir} schreibt weiter Texte für Single Sign-on.',
          decision: 'Login per Kundennummer zum Launch',
          inChat: ['luca-bernasconi', 'marco-gerber'], later: ['aylin-demir', 'sandra-huber', 'petra-schmid'],
          recommend: 'Projektentscheide als Beitrag mit dem Ergebnis im Titel in den Kanal «{c}».',
          boundary: 'Technische Detailklärung zu zweit darf im Chat bleiben, solange das Ergebnis im Kanal landet. Personalthemen gehören nicht ins Projekt.'
        },
        doc: {
          problem: 'Die Anforderungsliste kursiert als Anhang: {p:sandra-huber} ergänzt, {p:tim-vogel} arbeitet mit einer Fassung von letzter Woche.',
          artefact: 'Anforderungsliste Kundenportal', copies: ['Anforderungen_v3.xlsx', 'Anforderungen_v3_SH.xlsx', 'Anforderungen_final_Agentur.xlsx'],
          editors: ['luca-bernasconi', 'sandra-huber', 'tim-vogel'], origin: 'sandra-huber', drafter: 'aylin-demir', draft: 'Ideen für die Launch-Kampagne',
          recommend: 'Eine Liste in «{c}», alle kommentieren direkt darin. Die Agentur erhält Zugriff nur auf das, was sie braucht.',
          boundary: 'Kampagnenideen bleiben bei {p:aylin-demir}, bis sie reif sind. Wie die Agentur technisch Zugriff erhält, klärt eure IT; das Bild zeigt eine Annahme, keine geprüfte Berechtigung.'
        },
        tasks: {
          problem: 'Drei Freigaben hängen. Jede steht in einer anderen persönlichen Liste, und {p:petra-schmid} erfährt davon erst in der Steuerungssitzung.',
          personal: [{ who: 'aylin-demir', items: ['Bildideen sammeln'] }, { who: 'luca-bernasconi', items: ['Statusbericht vorbereiten'] }],
          shared: [{ t: 'Texte Startseite freigeben', who: 'petra-schmid', due: 'Do' }, { t: 'Login testen', who: 'marco-gerber', due: 'KW 8' }, { t: 'FAQ-Entwürfe liefern', who: 'aylin-demir', due: 'Fr' }],
          recommend: 'Freigaben und Lieferungen mit Person und Termin in einen Plan im Projektteam.',
          boundary: 'Persönliche Vorbereitungen bleiben in der eigenen Liste. Der Plan ersetzt kein Projektmanagement-Werkzeug, falls die Firma eines vorschreibt.'
        }
      }
    },

    { id: 'heat-health', world: 'urban-health-analytics', scenario: 'heat-health-basel',
      title: 'Heat & Health Basel', persona: 'Forschungsgruppe mit Datengrenze',
      friction: 'Das Paper wächst im OneDrive einer Person; Rohdaten gehören nicht ins Team.',
      usecases: ['fassungen', 'externe'] },
    { id: 'nora-publikation', world: 'nora-keller', scenario: 'vom-persoenlichen-entwurf-zur-gemeinsamen-publikation',
      title: 'Vom persönlichen Entwurf zur gemeinsamen Publikation', persona: 'Eigenständige Forscherin',
      friction: 'Eine Coautorin will mitschreiben; der Entwurf liegt allein bei Nora.',
      usecases: ['fassungen', 'einzelarbeit'], personal: true },
    { id: 'nora-abwesenheit', world: 'nora-keller', scenario: 'abwesenheit-drei-wochen',
      title: 'Drei Wochen Abwesenheit', persona: 'Eigenständige Forscherin',
      friction: 'Alles liegt im Kopf, Postfach und OneDrive einer Person.',
      usecases: ['wissen', 'einzelarbeit'], personal: true },
    { id: 'nora-reihe', world: 'nora-keller', scenario: 'workshop-wird-zur-reihe',
      title: '«Borders & Mobility» wird zur Reihe', persona: 'Eigenständige Forscherin',
      friction: 'Aus «Nora macht das nebenbei» wird eine Aufgabe mit mehreren Beteiligten.',
      usecases: ['einzelarbeit', 'pendenzen'], personal: true },
    { id: 'sitzungszyklus', world: 'commission-digital-collaboration', scenario: 'sitzungszyklus',
      title: 'Sitzungszyklus', persona: 'Periodisches Gremium',
      friction: 'Jedes Mal ein neuer Mailverteiler; Pendenzen gehen zwischen Sitzungen verloren.',
      usecases: ['pendenzen', 'entscheide'] },
    { id: 'semesterstart', world: 'teaching-team', scenario: 'semesterstart-und-uebergabe',
      title: 'Semesterstart und Übergabe', persona: 'Wiederkehrendes Lehrteam',
      friction: 'Jedes Semester beginnt bei null, weil das letzte im Postfach liegt.',
      usecases: ['wissen', 'fassungen'] }
  ],

  usecases: [
    { id: 'entscheide', title: 'Entscheide gehen im Chat verloren', question: 'Wer muss diesen Entscheid später finden?', principle: 'chat' },
    { id: 'fassungen', title: 'Mehrere Fassungen desselben Dokuments', question: 'Welche Datei gilt?', principle: 'doc' },
    { id: 'pendenzen', title: 'Niemand weiss, wer was erledigt', question: 'Wo werden gemeinsame Verpflichtungen sichtbar?', principle: 'tasks' },
    { id: 'externe', title: 'Externe arbeiten mit', question: 'Was sehen Personen ausserhalb der Einheit?', principle: 'doc' },
    { id: 'wissen', title: 'Wissen geht bei Wechsel verloren', question: 'Was muss die nächste Person vorfinden?', principle: 'doc' },
    { id: 'einzelarbeit', title: 'Aus Einzelarbeit wird Zusammenarbeit', question: 'Ab wann wird etwas Persönliches gemeinsam?', principle: 'doc' }
  ],

  principles: [
    { id: 'chat', title: 'Chat oder Kanal?', question: 'Wer muss diese Unterhaltung oder diesen Entscheid später finden?' },
    { id: 'doc', title: 'Persönlicher Entwurf oder gemeinsames Dokument?', question: 'Ein Arbeitsobjekt oder viele Kopien im Anhang?' },
    { id: 'tasks', title: 'Persönliche oder gemeinsame Verantwortung?', question: 'Wer muss sehen, dass etwas offen ist und bei wem es liegt?' }
  ]
};
