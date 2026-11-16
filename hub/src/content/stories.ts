/*
 * Situations: every renderable story in the repository, with its screens.
 *
 * Eight come from the research catalogue (question, trigger, friction, outcome, boundary are
 * already written there). Three are example projects without catalogue entry; their framing
 * below is a draft.
 *
 * CONTENT: the eight researched stories without screens are not listed here. They need a
 * project first (see src/research-catalogue.js, status «researched» / «provisional»).
 */
import { Content, ProjectCore, type Project } from '../engine';
import { EDITORIAL, THEME_SHORT, type Editorial, type ThemeId } from './editorial';
import { findTeam, type SectorId, type Team } from './teams';
import leadership from '../../../examples/leadership-forum-six.project.json';
import bibliothek from '../../../examples/bibliothek-tannwil.project.json';
import lichtblick from '../../../examples/lichtblick-kulissenwechsel.project.json';

export type ToolId = 'teams' | 'planner' | 'todo' | 'loop' | 'onedrive' | 'outlook' | 'sharepoint';
export const TOOLS: { id: ToolId; name: string; color: string; primer: string }[] = [
  { id: 'teams', name: 'Teams', color: '#5c5bd0', primer: 'Der Ort für Absprachen, die das Team betreffen, und für die gemeinsamen Dateien.' },
  { id: 'planner', name: 'Planner', color: '#1f7a55', primer: 'Der gemeinsame Plan: wer macht was bis wann.' },
  { id: 'todo', name: 'To Do', color: '#2564cf', primer: 'Die persönliche Sicht auf eigene und zugewiesene Aufgaben.' },
  { id: 'loop', name: 'Loop und Notizen', color: '#8a5bd0', primer: 'Gemeinsame Notizen und Listen, die an mehreren Orten dieselben bleiben.' },
  /* CONTENT: no portable story uses these three yet. They arrive with the older library (Outlook, Explorer, SharePoint, OneDrive scenes). */
  { id: 'onedrive', name: 'OneDrive', color: '#1667b7', primer: 'Der persönliche Arbeitsbereich, aus dem gezielt geteilt wird.' },
  { id: 'outlook', name: 'Outlook', color: '#0a5ea8', primer: 'Mail und Kalender, dort wo Zusammenarbeit oft beginnt.' },
  { id: 'sharepoint', name: 'SharePoint', color: '#03787c', primer: 'Die Bibliothek hinter den Dateien eines Teams.' }
];
const PROFILE_TOOL: Record<string, ToolId | undefined> = {
  'teams-posts': 'teams', 'teams-chat': 'teams', planner: 'planner', 'planner-task': 'planner', todo: 'todo',
  'meeting-notes': 'loop', 'loop-component': 'loop'
};
/* Profiles drawn as one application window; the others exist only as complete slides. */
const APP_PROFILES = ['teams-posts', 'teams-chat', 'planner', 'planner-task', 'todo'];
/* The principle slide needs styles the hub does not load yet; it is left out of «Szene». */
const SKIPPED_PROFILES = ['prinzip-tasks'];

export type Screen = { kind: 'app' | 'slide'; scene: string; slideIndex: number; label: string; note: string };
export type Story = {
  id: string; title: string; project: Project;
  team: Team | null; organisation: string; sector: SectorId;
  question: string; trigger: string; friction: string; boundary: string; prerequisites: string[];
  tools: ToolId[]; screens: Screen[];
  theme: ThemeId; editorial: Editorial | null;
  /** The framing (question, trigger, friction, boundary) is a build draft, not researched text. */
  framingDraft: boolean;
};

function screens(project: Project): Screen[] {
  const profiles = ProjectCore.capabilities().profiles;
  return project.slides.flatMap((slide, slideIndex) => {
    const scene = project.scenes.find((s) => s.id === slide.scene);
    if (!scene || SKIPPED_PROFILES.includes(scene.profile)) return [];
    return [{
      kind: APP_PROFILES.includes(scene.profile) ? 'app' as const : 'slide' as const, scene: scene.id, slideIndex,
      label: slide.title || profiles[scene.profile]?.label || scene.profile,
      note: slide.presenterNotes ?? ''
    }];
  });
}
function tools(project: Project): ToolId[] {
  const found = project.scenes.map((s) => PROFILE_TOOL[s.profile]).filter((t): t is ToolId => !!t);
  return TOOLS.map((t) => t.id).filter((id) => found.includes(id));
}
const organisation = (p: Project) => String((p.meta as { organisation?: string }).organisation ?? '').replace(/\s*\(fiktiv\)/, '');

const researched: Story[] = Content.research.scenarios.filter((s) => s.status === 'renderable').map((s) => {
  const project = Content.research.project(s.id), team = findTeam(s.persona) ?? null;
  return {
    id: s.id, title: s.title, project, team, organisation: organisation(project), sector: team?.sector ?? 'bildung',
    question: s.question, trigger: s.trigger, friction: s.friction, boundary: s.boundary, prerequisites: s.prerequisites,
    tools: tools(project), screens: screens(project),
    theme: EDITORIAL[s.id]?.theme ?? 'teams', editorial: EDITORIAL[s.id] ?? null, framingDraft: false
  };
});

/* CONTENT: framing drafts for the three example projects. Replace with reviewed wording. */
function example(id: string, raw: unknown, teamId: string | null, sector: SectorId, f: { title: string; question: string; trigger: string; friction: string; boundary: string }): Story {
  const project = raw as Project, team = findTeam(teamId ?? undefined) ?? null;
  return {
    id, project, team, organisation: organisation(project), sector, ...f, prerequisites: project.meta.assumptions ?? [],
    tools: tools(project), screens: screens(project),
    theme: EDITORIAL[id]?.theme ?? 'planner', editorial: EDITORIAL[id] ?? null, framingDraft: true
  };
}
const examples: Story[] = [
  example('lichtblick-kulissenwechsel', lichtblick, null, 'business', {
    title: 'Die Zusage im Chat', question: 'Wer hat zugesagt, und wo steht das?',
    trigger: 'Vor der Premiere wird der Kulissenwechsel neu verteilt. Zwei Personen einigen sich im Chat.',
    friction: 'Die Zusage sehen nur die beiden. Die Crew plant mit dem alten Stand.',
    boundary: 'Kurze Rückfragen bleiben im Chat. In den Plan gehört, worauf sich andere verlassen.'
  }),
  example('leadership-forum', leadership, 'campus-people-development', 'verwaltung', {
    title: 'Die Teamsitzung', question: 'Wer weiss nach der Sitzung, was zu tun ist?',
    trigger: 'Das Team bespricht das Leadership Forum. Drei Pendenzen entstehen.',
    friction: 'Die Pendenzen stehen im Chat, im Kanal und in drei persönlichen Listen.',
    boundary: 'Kurze persönliche Erinnerungen gehören nicht in den Plan. Der Plan ersetzt kein Gespräch.'
  }),
  example('bibliothek-tannwil', bibliothek, null, 'verwaltung', {
    title: 'Über das Wochenende', question: 'Was bleibt liegen, wenn die Schicht wechselt?',
    trigger: 'Am Freitag sind Mahnungen und Reservationen offen. Am Montag arbeitet jemand anderes.',
    friction: 'Offene Arbeit steht im Beitrag vom Freitag und bei einzelnen Personen.',
    boundary: 'Ausleihdaten bleiben im Bibliothekssystem. Der Plan zeigt nur, wer sich worum kümmert.'
  })
];

export const STORIES: Story[] = [...researched, ...examples];
export const THEMES = Content.themes.map((t) => ({ id: t.id as ThemeId, title: t.title, question: t.question, short: THEME_SHORT[t.id as ThemeId] ?? t.title }));

export function storyById(id: string) { return STORIES.find((s) => s.id === id); }
export function toolById(id: string) { return TOOLS.find((t) => t.id === id); }
export function storiesFor(tool: ToolId) { return STORIES.filter((s) => s.tools.includes(tool)); }

/** How close a story is to the reader's team: own team, same sector, or another setting. */
export type Closeness = 'own' | 'similar' | 'other';
export function closeness(story: Story, team: Team): Closeness {
  return story.team?.id === team.id ? 'own' : story.sector === team.sector ? 'similar' : 'other';
}
export const CLOSENESS_LABEL: Record<Closeness, string> = { own: 'Aus eurem Team', similar: 'Aus einem ähnlichen Umfeld', other: 'Anderes Umfeld' };
/** Own team first, then the same sector, then the rest. Never hides a story. */
export function orderedFor(team: Team, list: Story[] = STORIES): Story[] {
  const rank = { own: 0, similar: 1, other: 2 };
  return [...list].sort((a, b) => rank[closeness(a, team)] - rank[closeness(b, team)]);
}

export type Beat = { id: 'frage' | 'szene' | 'vereinbarung' | 'grenze' | 'transfer'; label: string };
export const BEATS: Beat[] = [
  { id: 'frage', label: 'Frage' }, { id: 'szene', label: 'Szene' }, { id: 'vereinbarung', label: 'Vereinbarung' },
  { id: 'grenze', label: 'Grenze' }, { id: 'transfer', label: 'Transfer' }
];
