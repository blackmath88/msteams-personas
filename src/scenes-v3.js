/*
 * v3 content: Teams chats, an AI meeting-recap simulation, a second business world
 * (customer service onboarding) and teaching sequences that connect screens in story order.
 * All people, companies and content are fictional. People are referenced by id.
 */
(function (LIB) {
  /* ---------- Teams 1:1 chats: the «before» moment of «Chat oder Kanal?» ---------- */
  LIB.chats = {
    'leadership-forum': {
      viewer: 'sophie-frei', partner: 'regula-aebi',
      messages: [
        { by: 'regula-aebi', time: '08:41', text: 'Sophie, der Raum für Termin 3 ist doppelt belegt. Die Fakultät hat ihn schon im Juni reserviert.' },
        { by: 'sophie-frei', time: '08:44', text: 'Mist. Einen Ersatzraum für 60 Personen finden wir so kurzfristig kaum.' },
        { by: 'regula-aebi', time: '08:46', text: 'Sollen wir Termin 3 online machen? Die HR-Teilnehmenden wären froh.' },
        { by: 'sophie-frei', time: '08:52', text: 'Ja, machen wir so: Termin 3 findet online statt.', mark: 1, decision: true },
        { by: 'regula-aebi', time: '08:53', text: 'Super, danke! 👍' }
      ],
      others: [['mara-conti', 'Raum für Termin 3 ist bestätigt, ich buche Catering.'], ['lea-baumann', 'Budget Q1 liegt im Kanal.']]
    },
    'kundenportal': {
      viewer: 'luca-bernasconi', partner: 'marco-gerber',
      messages: [
        { by: 'marco-gerber', time: '16:05', text: 'Single Sign-on zum Launch wird knapp. Die Freigabe der Konzern-IT dauert mindestens sechs Wochen.' },
        { by: 'luca-bernasconi', time: '16:07', text: 'Dann starten wir mit Login per Kundennummer? Das CRM kann das schon.' },
        { by: 'marco-gerber', time: '16:08', text: 'Ja, das geht. SSO dann in Phase 2.' },
        { by: 'luca-bernasconi', time: '16:10', text: 'Abgemacht: Login per Kundennummer zum Launch.', mark: 1, decision: true },
        { by: 'marco-gerber', time: '16:10', text: '👍' }
      ],
      others: [['aylin-demir', 'Die Texte für die SSO-Anmeldung sind fast fertig!'], ['petra-schmid', 'Steuerungssitzung verschoben auf Do.']]
    },
    'onboarding': {
      viewer: 'elif-kaya', partner: 'nadine-odermatt',
      messages: [
        { by: 'nadine-odermatt', time: '10:12', text: 'Elif, eine Kundin meldet einen Heizungsausfall. Nehme ich das als normales Ticket auf?' },
        { by: 'elif-kaya', time: '10:13', text: 'Nein, Ausfälle im Winter sind Notfälle. Die gehen immer zuerst telefonisch an die Disposition.' },
        { by: 'nadine-odermatt', time: '10:14', text: 'Ah, das steht nirgends. Gut zu wissen!' },
        { by: 'elif-kaya', time: '10:15', text: 'Regel: Notfälle immer zuerst an die Disposition, danach das Ticket.', mark: 1, decision: true },
        { by: 'nadine-odermatt', time: '10:15', text: 'Danke! 🙏' }
      ],
      others: [['reto-furrer', 'Feedbackgespräch am Freitag passt?'], ['samuel-brand', 'Einführung Disposition morgen um 9.']]
    }
  };

  /* ---------- AI-assisted meeting follow-up (deterministic teaching simulation) ---------- */
  LIB.ai = {
    'kundenportal': {
      meeting: 'Projektsitzung Kundenportal', when: 'Di, 14:00–14:45', reviewer: 'luca-bernasconi',
      attendees: ['petra-schmid', 'luca-bernasconi', 'aylin-demir', 'marco-gerber', 'sandra-huber'],
      notes: [
        'Login per Kundennummer bleibt für den Launch gesetzt; Single Sign-on folgt in Phase 2.',
        'Zwölf neue Anforderungen aus Kundengesprächen sind priorisiert; drei betreffen die FAQ.',
        'Die Agentur liefert die Texte der Startseite bis Donnerstag.',
        'Offen: ob der Innendienst vor dem Launch geschult wird.'
      ],
      suggestions: [
        { text: 'FAQ-Texte zu den drei neuen Anforderungen entwerfen', owner: 'aylin-demir', due: 'Fr', status: 'accepted' },
        { text: 'Testzugang für den Innendienst einrichten', owner: 'marco-gerber', due: 'Mo', status: 'edited', edited: 'Testzugang für zwei Personen im Innendienst einrichten' },
        { text: 'Schulung des Innendienstes planen', owner: 'sandra-huber', due: 'KW 10', status: 'rejected', reason: 'Noch nicht entschieden: zuerst Budget klären ({p:petra-schmid}).' },
        { text: 'Startseitentexte bei der Agentur einfordern', owner: 'luca-bernasconi', due: 'Do', status: 'accepted' }
      ],
      short: 'Simulation ohne echte KI. Intelligent Recap setzt Teams Premium oder Microsoft 365 Copilot und aktivierte Transkription voraus.',
      assumption: 'Simulation. Intelligent Recap mit KI-Notizen und Aufgabenvorschlägen setzt laut Microsoft eine Teams Premium- oder Microsoft 365 Copilot-Lizenz und eine aktivierte Transkription voraus. Ob und wie Vorschläge in Planner landen, hängt von Version und Konfiguration ab; hier wurden sie von Hand übertragen.'
    }
  };

  /* ---------- Second business world: customer service onboarding ---------- */
  var kd = {
    id: 'brunner-kundendienst',
    collection: 'business',
    name: 'Kundendienst, Brunner Haustechnik AG',
    short: 'Kundendienst-Team',
    label: 'Team mit Einarbeitung',
    type: 'business-team',
    tagline: 'Sechsköpfiges Team, das Serviceanfragen und Einsätze koordiniert und regelmässig neue Leute einarbeitet.',
    tension: 'Wer neu kommt, bekommt zwölf Mails, drei Ordnerpfade und ein «frag einfach Elif».',
    size: 6,
    people: [
      { id: 'reto-furrer', name: 'Reto Furrer', role: 'Teamleitung Kundendienst', focus: 'Einsatzplanung, Personal, Qualität' },
      { id: 'nadine-odermatt', name: 'Nadine Odermatt', role: 'Kundendienst, neu ab 3. November', focus: 'Telefon, Ticketerfassung, Terminvereinbarung' },
      { id: 'elif-kaya', name: 'Elif Kaya', role: 'Kundendienst, Buddy für die Einarbeitung', focus: 'Erfahrene Ansprechperson, pflegt den Leitfaden' },
      { id: 'samuel-brand', name: 'Samuel Brand', role: 'Disposition Servicetechnik', focus: 'Einsätze der Techniker, Notfälle' },
      { id: 'corinne-wey', name: 'Corinne Wey', role: 'HR Business Partnerin', focus: 'Vertrag, Probezeit; gehört zu HR', outside: true },
      { id: 'thomas-luethi', name: 'Thomas Lüthi', role: 'IT-Support', focus: 'Geräte und Zugänge; gehört zur IT', outside: true }
    ],
    artefacts: [
      { id: 'leitfaden', name: 'Leitfaden Serviceanfragen', owner: 'elif-kaya', state: 'shared' },
      { id: 'einarbeitungsplan', name: 'Einarbeitungsplan Nadine', owner: 'reto-furrer', state: 'shared' },
      { id: 'notizen', name: 'Eigene Notizen zur Einarbeitung', owner: 'nadine-odermatt', state: 'personal' }
    ],
    scenario: {
      id: 'einarbeitung-nadine', name: 'Einarbeitung im Kundendienst',
      trigger: 'Nadine Odermatt beginnt am 3. November im Kundendienst. Ihre Vorgängerin ist schon weg.',
      description: 'Bisher lief jede Einarbeitung über Mails, eine Papiercheckliste und viele Fragen an Elif. Diesmal sollen Wissen, Unterlagen und Verantwortlichkeiten sichtbar sein.'
    }
  };
  LIB.businessWorlds = [LIB.business, kd];

  LIB.usecases.push({ id: 'einarbeitung', title: 'Neue Person findet den Stand nicht', question: 'Wie findet eine neue Person den Stand und wer ist wofür zuständig?', principle: 'tasks' });

  LIB.situations.push({
    id: 'onboarding', world: 'brunner-kundendienst', scenario: 'einarbeitung-nadine', complete: true,
    title: 'Einarbeitung im Kundendienst',
    persona: 'Bestehendes Team arbeitet eine neue Person ein',
    friction: 'Wissen steckt in Köpfen und Mails; die Checkliste liegt auf Papier bei der Teamleitung.',
    usecases: ['einarbeitung', 'wissen', 'pendenzen', 'entscheide'],
    variants: [
      { id: 'kanal', label: 'Kanal «Einarbeitung» im Team Kundendienst',
        why: 'Das Team arbeitet mehrmals im Jahr neue Leute ein. Ein fester Kanal sammelt Begrüssung, Leitfaden und Checkliste; die nächste neue Person findet alles schon vor.',
        team: 'Kundendienst', teamNote: 'dauerhaftes Team',
        members: ['reto-furrer', 'nadine-odermatt', 'elif-kaya', 'samuel-brand'],
        channels: ['Allgemein', 'Einsatzplanung', 'Einarbeitung', 'Wissen & Vorlagen'], active: 'Einarbeitung' },
      { id: 'nur-plan', label: 'Nur eine Checkliste im Plan, ohne eigenen Kanal',
        why: 'Passt, wenn selten jemand neu kommt. Die Checkliste liegt im Plan des Teams, die Begrüssung im Kanal «Allgemein». Weniger Struktur, aber Fragen und Antworten verteilen sich.',
        team: 'Kundendienst', teamNote: 'dauerhaftes Team',
        members: ['reto-furrer', 'nadine-odermatt', 'elif-kaya', 'samuel-brand'],
        channels: ['Allgemein', 'Einsatzplanung', 'Wissen & Vorlagen'], active: 'Allgemein' }
    ],
    scene: {
      posts: [
        { id: 'p1', by: 'reto-furrer', time: 'Mo 08:00', title: 'Willkommen, Nadine!',
          text: 'Ab heute verstärkt {p:nadine-odermatt} den Kundendienst. {p:elif-kaya} ist ihr Buddy für die ersten vier Wochen. Alles zur Einarbeitung findet ihr hier.',
          replies: [{ by: 'elif-kaya', time: 'Mo 08:12', text: 'Willkommen! Ich hole dich um 9 Uhr am Empfang ab.' }, { by: 'samuel-brand', time: 'Mo 08:30', text: 'Willkommen im Team!' }], mark: 1 },
        { id: 'p2', by: 'elif-kaya', time: 'Mo 09:15', title: 'Leitfaden Serviceanfragen: gültige Fassung',
          text: 'Der Leitfaden ist ab heute nur noch hier. Bitte nicht lokal kopieren; Ergänzungen direkt in der Datei.',
          file: 'Leitfaden Serviceanfragen.docx', replies: [{ by: 'nadine-odermatt', time: 'Mo 09:40', text: 'Danke! Ich ergänze die Notfallregel aus unserem Chat.' }], mark: 2 },
        { id: 'p3', by: 'reto-furrer', time: 'Mo 10:30', title: 'Checkliste im Plan',
          text: 'Zugänge, Schulungen, Feedback: Jede Aufgabe hat eine verantwortliche Person und ein Datum im Reiter Aufgaben.', replies: [], mark: 3 }
      ],
      files: [
        { name: 'Leitfaden Serviceanfragen.docx', kind: 'doc', by: 'elif-kaya', when: 'Mo 09:15', note: 'eine gültige Fassung', mark: 2 },
        { name: 'Einarbeitungsplan Nadine.xlsx', kind: 'table', by: 'reto-furrer', when: 'Fr', note: 'Woche für Woche' },
        { name: 'Telefonskript Störungsmeldungen.docx', kind: 'doc', by: 'elif-kaya', when: 'letzte Woche', note: '' },
        { name: 'Kontaktliste Servicetechnik.xlsx', kind: 'table', by: 'samuel-brand', when: 'Do', note: '' }
      ],
      tasks: [
        { title: 'Laptop und Konten einrichten', owner: 'thomas-luethi', due: '31.10.', bucket: 'Vor dem Start', done: true },
        { title: 'Zugang Ticketsystem freischalten', owner: 'thomas-luethi', due: 'Mo', bucket: 'Woche 1', done: false, mark: 3 },
        { title: 'Einführung Disposition (2 h)', owner: 'samuel-brand', due: 'Di', bucket: 'Woche 1', done: false },
        { title: 'Mitlaufen am Telefon', owner: 'elif-kaya', due: 'Mi', bucket: 'Woche 1', done: false },
        { title: 'Datenschutzschulung absolvieren', owner: 'nadine-odermatt', due: '14.11.', bucket: 'Woche 2–4', done: false },
        { title: 'Erstes Feedbackgespräch', owner: 'reto-furrer', due: '14.11.', bucket: 'Woche 2–4', done: false }
      ],
      outside: ['HR-System: Vertrag und Personaldaten bleiben dort (HR, Corinne Wey)'],
      notes: {
        1: 'Begrüssung und Ansprechperson stehen sichtbar im Kanal statt in zwölf Einzelmails.',
        2: 'Eine gültige Fassung des Leitfadens statt Kopien in persönlichen Ordnern.',
        3: 'Jede Einarbeitungsaufgabe hat eine verantwortliche Person und einen Termin.'
      }
    },
    principles: {
      chat: {
        problem: '{p:elif-kaya} erklärt {p:nadine-odermatt} im Chat, dass Notfälle zuerst an die Disposition gehen. Die nächste neue Person fragt wieder dasselbe.',
        decision: 'Notfälle immer zuerst an die Disposition',
        inChat: ['elif-kaya', 'nadine-odermatt'], later: ['samuel-brand', 'reto-furrer'], laterLabel: 'die nächste neue Person',
        recommend: 'Antworten, die auch die nächste neue Person braucht, gehören als Beitrag in «{c}» oder direkt in den Leitfaden.',
        boundary: 'Persönliche Fragen zu Lohn, Gesundheit oder Probezeit bleiben im Chat oder bei HR.'
      },
      doc: {
        problem: 'Der Leitfaden existiert in drei Fassungen: als alter Mailanhang, mit Elifs Notizen und als Kopie bei Nadine.',
        artefact: 'Leitfaden Serviceanfragen',
        copies: [{ n: 'Leitfaden_2023.docx', by: 'reto-furrer' }, { n: 'Leitfaden_Elif_Notizen.docx', by: 'elif-kaya' }, { n: 'Leitfaden Serviceanfragen (Kopie).docx', by: 'nadine-odermatt' }],
        editors: ['elif-kaya', 'reto-furrer', 'samuel-brand'], origin: 'elif-kaya', drafter: 'nadine-odermatt', draft: 'Eigene Notizen zur Einarbeitung',
        recommend: 'Ein Leitfaden in den Dateien von «{c}», den alle direkt aktualisieren.',
        boundary: 'Nadines Lernnotizen bleiben bei ihr. Kundendaten bleiben im Ticketsystem.'
      },
      tasks: {
        problem: 'Wer schaltet den Zugang zum Ticketsystem frei? Die Checkliste liegt ausgedruckt bei {p:reto-furrer}.',
        personal: [{ who: 'nadine-odermatt', items: ['Fragen für das Feedbackgespräch notieren'] }, { who: 'elif-kaya', items: ['Beispielfälle für Nadine sammeln'] }],
        shared: [{ t: 'Zugang Ticketsystem freischalten', who: 'thomas-luethi', due: 'Mo' }, { t: 'Einführung Disposition', who: 'samuel-brand', due: 'Di' }, { t: 'Erstes Feedbackgespräch', who: 'reto-furrer', due: '14.11.' }],
        recommend: 'Die Einarbeitung als Checkliste im Plan des Teams: jede Aufgabe mit Person und Datum.',
        boundary: 'Persönliche Lernziele und Notizen bleiben in Nadines To Do. Vertragsfragen laufen über HR.'
      }
    }
  });

  /* Personal To Do content per situation: whose list, and what stays personal. */
  LIB.todos = {
    'leadership-forum': { viewer: 'daniel-wyss', personal: ['Newsletter-Text entwerfen', 'Fotos vom Termin 2 sortieren'] },
    'kundenportal': { viewer: 'aylin-demir', personal: ['Texte für die SSO-Anmeldung fertigstellen', 'Bildideen sammeln'] },
    'onboarding': { viewer: 'nadine-odermatt', personal: ['Fragen für das Feedbackgespräch notieren', 'Tastenkürzel Ticketsystem üben'] }
  };

  /* ---------- Teaching sequences: three to five moments in story order ---------- */
  LIB.sequences = [
    { id: 'dateiversion', title: 'Vom Mail-Anhang zur gemeinsamen Datei', situation: 'leadership-forum', variant: 'eigenes-team',
      objective: 'Zeigen, warum Kopien im Anhang zu «Welche Fassung gilt?» führen und wie ein Link auf eine Datei das löst.',
      boundary: 'Externe ohne Zugang zum Team brauchen weiterhin eine Freigabe oder einen Anhang; vertrauliche Anmeldedaten bleiben im Anmeldesystem.',
      steps: [
        { mode: 'szene', sub: 'outlook', label: 'Anhang im Posteingang' },
        { mode: 'szene', sub: 'explorer', label: 'Kopien im Downloads-Ordner' },
        { mode: 'szene', sub: 'posts', label: 'Beitrag verweist auf eine Datei' },
        { mode: 'szene', sub: 'sharepoint', label: 'Eine Datei in der Bibliothek' },
        { mode: 'prinzip', sub: 'doc', label: 'Prinzip: ein Dokument statt Kopien' }
      ] },
    { id: 'entscheid-chat', title: 'Ein Entscheid verschwindet im Chat', situation: 'kundenportal', variant: 'eigenes-team',
      objective: 'Erkennen, welche Entscheide andere später finden müssen, und sie als Kanalbeitrag mit Ergebnis im Titel festhalten.',
      boundary: 'Technische Detailklärung zu zweit darf im Chat bleiben, solange das Ergebnis im Kanal landet.',
      steps: [
        { mode: 'szene', sub: 'chat', label: 'Entscheid fällt im Einzelchat' },
        { mode: 'szene', sub: 'todo', label: 'Aylin arbeitet am alten Stand weiter' },
        { mode: 'szene', sub: 'posts', label: 'Entscheid als Kanalbeitrag' },
        { mode: 'prinzip', sub: 'chat', label: 'Prinzip: Chat oder Kanal?' }
      ] },
    { id: 'planner-todo', title: 'Gemeinsamer Plan und persönliche Liste', situation: 'leadership-forum', variant: 'eigenes-team',
      objective: 'Gemeinsame Verpflichtungen im Plan sichtbar machen und persönliche To-dos bewusst persönlich lassen.',
      boundary: 'Nicht jede Kleinigkeit braucht eine Aufgabe im Plan. Kleine Teams kommen oft mit einer Liste im Kanal aus.',
      steps: [
        { mode: 'szene', sub: 'planner', label: 'Plan des Teams: Buckets und Verantwortung' },
        { mode: 'szene', sub: 'todo', label: 'Daniels To Do: persönlich und zugewiesen' },
        { mode: 'szene', sub: 'posts', label: 'Pendenzen-Regel im Kanal' },
        { mode: 'prinzip', sub: 'tasks', label: 'Prinzip: persönliche oder gemeinsame Verantwortung' }
      ] },
    { id: 'einarbeitung', title: 'Eine neue Person einarbeiten', situation: 'onboarding', variant: 'kanal',
      objective: 'Einarbeitung so gestalten, dass Wissen, Unterlagen und Zuständigkeiten für die nächste neue Person erhalten bleiben.',
      boundary: 'Vertrag, Lohn und Probezeit laufen über HR, nicht über das Team. Bei seltenen Einarbeitungen reicht eine Checkliste ohne eigenen Kanal.',
      steps: [
        { mode: 'szene', sub: 'posts', label: 'Begrüssung und Buddy im Kanal' },
        { mode: 'szene', sub: 'chat', label: 'Wissen bleibt im Chat hängen' },
        { mode: 'szene', sub: 'planner', label: 'Checkliste mit Verantwortlichen' },
        { mode: 'szene', sub: 'todo', label: 'Nadines eigene Liste' },
        { mode: 'prinzip', sub: 'tasks', label: 'Prinzip: gemeinsame Verantwortung' }
      ] },
    { id: 'abwesenheit', title: 'Drei Wochen weg: was die Vertretung braucht', situation: 'nora-abwesenheit', variant: null,
      objective: 'Vor einer Abwesenheit gezielt freigeben, statt das ganze OneDrive zu öffnen oder Kopien zu mailen.',
      boundary: 'Forschungsnotizen und Lehrunterlagen bleiben privat. Termine laufen über den Kalender, Abgaben über das System der Universität.',
      steps: [
        { mode: 'szene', sub: 'onedrive', label: 'OneDrive: privat und gezielt geteilt' },
        { mode: 'szene', sub: 'todo', label: 'Noras offene Punkte' },
        { mode: 'prinzip', sub: 'doc', label: 'Prinzip: persönlicher Entwurf oder gemeinsames Dokument' }
      ] },
    { id: 'ki-besprechung', title: 'KI-Vorschläge aus der Besprechung prüfen', situation: 'kundenportal', variant: 'eigenes-team', ai: true,
      objective: 'Zeigen, dass KI-Vorschläge aus Besprechungsnotizen erst nach menschlicher Prüfung zu verbindlichen Aufgaben werden.',
      boundary: 'Simulation ohne echte KI. Vorschläge können falsch oder unvollständig sein; Verantwortung und Termine bestätigt eine Person.',
      steps: [
        { mode: 'szene', sub: 'recap', label: 'KI-Notizen und Aufgabenvorschläge' },
        { mode: 'szene', sub: 'planner', label: 'Geprüfte Aufgaben im Plan' },
        { mode: 'prinzip', sub: 'tasks', label: 'Prinzip: Verantwortung bleibt beim Team' }
      ] }
  ];
})(window.LIB);
