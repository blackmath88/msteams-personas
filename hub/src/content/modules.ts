/*
 * Modules. A situation is a story that ends in a team agreement ("Vereinbarung").
 * A tool page is an index over the situations that involve that tool; it has no story of its own.
 */
import type { Project } from '../engine';
import leadership from '../../../examples/leadership-forum-six.project.json';

export type Beat = { id: 'frage' | 'szene' | 'vereinbarung' | 'grenze' | 'transfer'; label: string };
export const BEATS: Beat[] = [
  { id: 'frage', label: 'Frage' }, { id: 'szene', label: 'Szene' }, { id: 'vereinbarung', label: 'Vereinbarung' },
  { id: 'grenze', label: 'Grenze' }, { id: 'transfer', label: 'Transfer' }
];

export type Situation = {
  id: string;
  title: string;
  question: string;
  context: string;
  tools: string[];
  agreement: string;
  limit: string;
  transfer: string;
  /** Portable project and the scene shown in «Szene». Absent: the screen is not built yet. */
  project?: Project;
  scene?: string;
};

export const SITUATIONS: Situation[] = [
  {
    id: 'teamsitzung', title: 'Die Teamsitzung', tools: ['teams', 'planner', 'todo'],
    question: 'Wer weiss nach der Sitzung, was zu tun ist?',
    context: 'Das Team bespricht das Leadership Forum. Drei Pendenzen entstehen. Wo stehen sie morgen?',
    agreement: 'Jede Pendenz aus der Sitzung hat eine Person und einen Termin im Plan.',
    limit: 'Kurze persönliche Erinnerungen gehören nicht in den Plan. Der Plan ersetzt kein Gespräch.',
    transfer: 'Welche Pendenzen aus eurer letzten Sitzung stehen heute nur in persönlichen Notizen?',
    project: leadership as unknown as Project, scene: 'sc-plan'
  },
  {
    id: 'dokument', title: 'Gemeinsam am Dokument', tools: ['teams', 'onedrive'],
    question: 'Welche Datei gilt, wenn alle mitschreiben?',
    context: 'Ein Entwurf wandert als Anhang durchs Team. Am Ende gibt es fünf Versionen.',
    agreement: 'Wir arbeiten in der Datei im Kanal, nicht in Kopien.',
    limit: 'Eigene Entwürfe dürfen zuerst im persönlichen Bereich entstehen.',
    transfer: 'Wo liegt bei euch die gültige Fassung, und wissen das alle?'
  },
  {
    id: 'uebergabe', title: 'Die Übergabe', tools: ['teams', 'planner'],
    question: 'Was bleibt liegen, wenn jemand ausfällt?',
    context: 'Eine Person fehlt eine Woche. Ihre offenen Arbeiten stehen im Chat.',
    agreement: 'Offene Arbeit steht im Plan, nicht nur im Chat.',
    limit: 'Vertrauliches gehört nicht in einen Plan, den das ganze Team sieht.',
    transfer: 'Was müsste jemand heute wissen, um morgen für euch einzuspringen?'
  }
];

export type Tool = { id: string; name: string; color: string; primer: string };
export const TOOLS: Tool[] = [
  { id: 'teams', name: 'Teams', color: '#5c5bd0', primer: 'Der Ort für Absprachen, die das Team betreffen, und für die gemeinsamen Dateien.' },
  { id: 'planner', name: 'Planner', color: '#1f7a55', primer: 'Der gemeinsame Plan: wer macht was bis wann.' },
  { id: 'todo', name: 'To Do', color: '#2564cf', primer: 'Die persönliche Sicht auf eigene und zugewiesene Aufgaben.' },
  { id: 'onedrive', name: 'OneDrive', color: '#1667b7', primer: 'Der persönliche Arbeitsbereich, aus dem gezielt geteilt wird.' }
];

export function situationById(id: string) { return SITUATIONS.find((s) => s.id === id); }
export function toolById(id: string) { return TOOLS.find((t) => t.id === id); }
export function situationsFor(toolId: string) { return SITUATIONS.filter((s) => s.tools.includes(toolId)); }
