/*
 * Team personas, read from the repository's data files (worlds.js, src/library.js,
 * src/research-catalogue.js). Nothing is copied: a correction there shows up here.
 *
 * What this file adds is editorial: which sector a team belongs to, in which order sectors
 * appear (business first), and which teams are featured in the team switcher.
 *
 * CONTENT: «featured» is a first selection of eight relatable teams, two per sector.
 * Review it with trainers; see hub/CONTENT-TODO.md.
 */
import { Content, type ResearchPersona, type World } from '../engine';

export type SectorId = 'business' | 'verwaltung' | 'forschung' | 'bildung';
export const SECTORS: { id: SectorId; label: string }[] = [
  { id: 'business', label: 'Unternehmen' },
  { id: 'verwaltung', label: 'Verwaltung' },
  { id: 'forschung', label: 'Forschung' },
  { id: 'bildung', label: 'Bildung und Lehre' }
];

export type Team = {
  id: string; name: string; sector: SectorId; featured: boolean;
  kind: string; summary: string; tension: string; question: string | null;
  sizeLabel: string; headcount: number | null; rhythm: string | null; boundary: string | null;
  people: { initials: string; name: string; role: string }[];
  groups: { color: string; kind: string; names: string[] }[];
  /** The engine has house views for this team (workspace examples). */
  hasWorkspace: boolean;
};

/* id → [sector, featured]. The order inside a sector is the order shown. */
const EDITORIAL: Record<string, [SectorId, boolean]> = {
  'technical-service': ['business', true],
  'brunner-marketing': ['business', true],
  'municipal-service': ['verwaltung', true],
  'campus-people-development': ['verwaltung', true],
  'commission-digital-collaboration': ['verwaltung', false],
  'urban-health-analytics': ['forschung', true],
  'nora-keller': ['forschung', true],
  grants: ['forschung', false],
  'teaching-team': ['bildung', true],
  service: ['bildung', true],
  practice: ['bildung', false],
  event: ['bildung', false]
};
const WITH_WORKSPACE = ['campus-people-development'];

function initials(name: string) {
  const parts = name.replace(/^((Prof|Dr)\.\s*)+/, '').trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}
const short = (role: string) => role.replace(/\s*\(.*$/, '');

function fromWorld(w: World): Omit<Team, 'sector' | 'featured'> {
  const c = w.collaboration;
  return {
    id: w.id, name: w.name, kind: w.unit_type ?? 'Abteilung im Unternehmen', summary: w.tagline, tension: w.tension,
    question: w.consulting_questions?.[0] ?? null,
    sizeLabel: w.size === 1 ? '1 Person' : w.size + ' Personen', headcount: w.size, rhythm: w.rhythm ?? null, boundary: w.boundary ?? null,
    people: w.people.map((p) => ({ initials: initials(p.name), name: p.name, role: short(p.role) })),
    groups: c ? [
      { color: '#5c5bd0', kind: 'Eng und dauerhaft', names: c.close_internal },
      { color: '#8a5bd0', kind: 'Gelegentlich, intern', names: c.occasional_internal },
      { color: '#2f6f9f', kind: 'Extern', names: c.external }
    ].filter((g) => g.names.length) : [],
    hasWorkspace: WITH_WORKSPACE.includes(w.id)
  };
}
function fromResearch(p: ResearchPersona): Omit<Team, 'sector' | 'featured'> {
  return {
    id: p.id, name: p.name, kind: p.archetype, summary: p.purpose, tension: p.friction, question: p.question,
    sizeLabel: p.size, headcount: null, rhythm: p.rhythm, boundary: p.boundary,
    people: p.people.map(([name, role]) => ({ initials: initials(name), name, role })),
    groups: [], hasWorkspace: false
  };
}

const all = [...Content.worlds.map(fromWorld), fromWorld(Content.businessWorld), ...Content.research.personas.map(fromResearch)];
const order = Object.keys(EDITORIAL);

export const TEAMS: Team[] = all
  .filter((t) => EDITORIAL[t.id])
  .map((t) => ({ ...t, sector: EDITORIAL[t.id][0], featured: EDITORIAL[t.id][1] }))
  .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

export const DEFAULT_TEAM = TEAMS[0].id;
export function findTeam(id: string | undefined) { return TEAMS.find((t) => t.id === id); }
export function teamById(id: string | undefined): Team { return findTeam(id) ?? TEAMS[0]; }
export function sectorLabel(id: SectorId) { return SECTORS.find((s) => s.id === id)!.label; }
export function teamsBySector(onlyFeatured: boolean) {
  return SECTORS.map((s) => ({ ...s, teams: TEAMS.filter((t) => t.sector === s.id && (!onlyFeatured || t.featured)) })).filter((s) => s.teams.length);
}
