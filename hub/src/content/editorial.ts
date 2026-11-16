/*
 * The editorial layer on top of the stories: theme, agreement and transfer question.
 *
 * CONTENT: every agreement and transfer question below is a first draft written during the
 * build, marked `draft`. They are the core message of the hub and need a trainer's wording.
 * Set `status: 'final'` when a sentence is approved; the «Entwurf» tag then disappears.
 * A story without an entry here shows a visible placeholder. See hub/CONTENT-TODO.md.
 */
export type ThemeId = 'teams' | 'communication' | 'documents' | 'loop' | 'planner' | 'balance';
/** Short labels for the navigation; the full titles and questions come from worlds.js. */
export const THEME_SHORT: Record<ThemeId, string> = {
  teams: 'Zusammenarbeiten', communication: 'Kommunizieren', documents: 'Dokumente',
  loop: 'Sitzungen und Loop', planner: 'Aufgaben', balance: 'Digital Balance'
};

export type Editorial = { theme: ThemeId; agreement: string; transfer: string; status: 'draft' | 'final' };

export const EDITORIAL: Record<string, Editorial> = {
  'service-appointment-change': {
    theme: 'communication', status: 'draft',
    agreement: 'Zugewiesen heisst nicht übernommen: Wir versprechen dem Kunden erst etwas, wenn die Übernahme bestätigt ist.',
    transfer: 'Woran erkennt ihr heute, dass jemand eine Aufgabe wirklich übernommen hat?'
  },
  'municipal-opening-hours': {
    theme: 'communication', status: 'draft',
    agreement: 'Abgestimmt heisst nicht veröffentlicht: Die Freigabe halten wir als eigenen Schritt fest.',
    transfer: 'Bei welcher Änderung war bei euch zuletzt unklar, ob sie schon nach aussen darf?'
  },
  'lichtblick-kulissenwechsel': {
    theme: 'communication', status: 'draft',
    agreement: 'Eine Zusage aus dem Chat tragen wir als Aufgabe in den gemeinsamen Plan ein.',
    transfer: 'Welche Zusage steht bei euch gerade nur in einem Chat?'
  },
  'leadership-forum': {
    theme: 'planner', status: 'draft',
    agreement: 'Jede Pendenz aus der Sitzung hat eine Person und einen Termin im Plan.',
    transfer: 'Welche Pendenzen aus eurer letzten Sitzung stehen heute nur in persönlichen Notizen?'
  },
  'bibliothek-tannwil': {
    theme: 'planner', status: 'draft',
    agreement: 'Was über das Wochenende offen bleibt, steht im gemeinsamen Plan und nicht auf einem Zettel.',
    transfer: 'Was erfährt bei euch die nächste Schicht nur, wenn sie nachfragt?'
  },
  'event-handover': {
    theme: 'planner', status: 'draft',
    agreement: 'Eine Übergabe gilt erst, wenn die übernehmende Person sie bestätigt hat.',
    transfer: 'Wie bestätigt ihr heute eine Übergabe?'
  },
  'weekly-meeting': {
    theme: 'loop', status: 'draft',
    agreement: 'Jede Sitzung beginnt mit den Aufgaben aus der letzten.',
    transfer: 'Wann habt ihr zuletzt ein altes Protokoll wieder geöffnet?'
  },
  'shared-loop': {
    theme: 'loop', status: 'draft',
    agreement: 'Eine Liste pflegen wir an einem Ort und verlinken sie, statt sie zu kopieren.',
    transfer: 'Welche Liste gibt es bei euch in mehreren Fassungen?'
  },
  'grant-submission': {
    theme: 'documents', status: 'draft',
    agreement: 'Wer einen Abschnitt übernimmt, steht mit Termin im Plan. Geschrieben wird in der gemeinsamen Datei.',
    transfer: 'Woran seht ihr heute, wer an welchem Teil eines Dokuments arbeitet?'
  },
  'peer-resource': {
    theme: 'documents', status: 'draft',
    agreement: 'Bevor wir etwas für andere freigeben, hat es eine verantwortliche Person und ein Prüfdatum.',
    transfer: 'Welche eurer Vorlagen hat niemand mehr geprüft?'
  },
  'service-onboarding': {
    theme: 'teams', status: 'draft',
    agreement: 'Was die nächste neue Person auch braucht, steht im Kanal und nicht im Chat.',
    transfer: 'Was musste eure letzte neue Kollegin einzeln erfragen?'
  }
};
