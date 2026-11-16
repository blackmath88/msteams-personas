/*
 * Team personas: who, where, how many, what. Every module is read from a team's point of view.
 * Placeholder content taken from the Unibas example deck; all people and units are fictional.
 */
export type Team = {
  id: string;
  initials: string;
  name: string;
  kind: string;
  summary: string;
  facts: { who: string; where: string; size: string; work: string };
  headcount: number;
  headcountLabel: string;
  roles: { initials: string; name: string; does: string }[];
  groups: { color: string; kind: string; title: string; text: string }[];
};

export const TEAMS: Team[] = [
  {
    id: 'verwaltung', initials: 'CD', name: 'Campus & People Development', kind: 'Verwaltung',
    summary: 'Campus & People Development organisiert Weiterbildungen und Veranstaltungen für die Universität.',
    facts: { who: 'Stammteam mit Leitung', where: 'Universitätsverwaltung', size: '5 Personen', work: 'Weiterbildungen und Anlässe' },
    headcount: 5, headcountLabel: 'Personen im Stammteam',
    roles: [
      { initials: 'TL', name: 'Teamleitung', does: 'Prioritäten und Budget' },
      { initials: 'PA', name: 'Projektarbeit', does: 'Programme und Veranstaltungen' },
      { initials: 'LA', name: 'Lernangebote', does: 'Workshops und Trainings' },
      { initials: 'PK', name: 'Programmkoordination', does: 'Termine, Räume und Anmeldungen' },
      { initials: 'KO', name: 'Kommunikation', does: 'Einladungen und Informationen' }
    ],
    groups: [
      { color: '#5c5bd0', kind: 'Stammteam', title: 'Das Stammteam', text: 'Es betreut Weiterbildungen, Veranstaltungen und die laufende Organisation.' },
      { color: '#8a5bd0', kind: 'Bereichsübergreifend', title: 'Ein internes Projekt', text: 'Für Onboarding 2027 plant eine Pilotgruppe aus mehreren Uni-Bereichen den Testlauf.' },
      { color: '#2f6f9f', kind: 'Mit externen Partnern', title: 'Eine Kooperation', text: 'Für ein Weiterbildungsangebot plant das Team Workshops mit einem externen Partner.' }
    ]
  },
  {
    id: 'forschung', initials: 'UA', name: 'Urban Health Analytics', kind: 'Forschungsgruppe',
    summary: 'Urban Health Analytics untersucht, wie sich städtische Hitze auf die Gesundheit auswirkt.',
    facts: { who: 'Forschungsgruppe mit Leitung', where: 'Drittmittelfinanziert, Basel', size: '7 Personen', work: 'Feldarbeit und Publikationen' },
    headcount: 7, headcountLabel: 'Personen in der Gruppe',
    roles: [
      { initials: 'FL', name: 'Forschungsleitung', does: 'Leitet die Forschungsgruppe' },
      { initials: 'WM', name: 'Wissenschaftliche Mitarbeit', does: 'Messungen und Auswertung' },
      { initials: 'DO', name: 'Doktorierende', does: 'Feldkampagnen und Manuskripte' }
    ],
    groups: [
      { color: '#5c5bd0', kind: 'Stammteam', title: 'Die Forschungsgruppe', text: 'Sie stimmt sich jede Woche ab und teilt Geräte, Daten und Entwürfe.' },
      { color: '#8a5bd0', kind: 'Uni Basel lädt ein', title: 'Projekt Hitzevergleich', text: 'Gäste einer Partneruniversität arbeiten im Basler Projekthaus mit.' },
      { color: '#2f6f9f', kind: 'Partner lädt ein', title: 'Urban Climate Atlas', text: 'Die Gruppe schreibt als Gast bei einer zweiten Partneruniversität mit.' }
    ]
  }
];

export const DEFAULT_TEAM = TEAMS[0].id;
export function teamById(id: string): Team { return TEAMS.find((t) => t.id === id) ?? TEAMS[0]; }
