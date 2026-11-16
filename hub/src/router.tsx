import { createHashHistory, createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router';
import { Shell } from './components/Shell';
import { DEFAULT_TEAM, findTeam, teamById } from './content/teams';
import { BEATS, THEMES, storyById, toolById, type Beat } from './content/stories';
import { Landing } from './routes/Landing';
import { AllTeams, TeamPage } from './routes/TeamPage';
import { Workspace, WORKSPACE_STEPS } from './routes/Workspace';
import { Stories } from './routes/Stories';
import { Situation } from './routes/Situation';
import { ToolPage } from './routes/ToolPage';
import { Agreements, TeamSketch } from './routes/TeamSheet';

/*
 * Addresses (the team is always the first part, so every link carries the reader's context):
 *   #/<team>                                   landing with three doors
 *   #/<team>/team                              team persona
 *   #/<team>/arbeitsbereich?schritt=2          house, room, shelf
 *   #/<team>/situationen?thema=planner&q=…     all situations, grouped by theme
 *   #/<team>/situation/<id>?schritt=szene&bild=2
 *   #/<team>/werkzeug/<id>
 *   #/<team>/teamskizze   #/<team>/vereinbarungen   #/<team>/teams
 * Hash routing keeps the build a folder of static files.
 */
function NotFound() {
  return <><h1>Diese Seite gibt es nicht.</h1><p className="lead">Wählt links ein Team, eine Situation oder ein Werkzeug.</p></>;
}
const int = (v: unknown, max: number) => { const n = Math.round(Number(v)); return n >= 1 && n <= max ? n : 1; };

const root = createRootRoute({ component: Shell, notFoundComponent: NotFound });
const home = createRoute({ getParentRoute: () => root, path: '/', beforeLoad: () => { throw redirect({ to: '/$team', params: { team: DEFAULT_TEAM } }); } });
const team = createRoute({
  getParentRoute: () => root, path: '$team',
  beforeLoad: ({ params }) => { if (!findTeam(params.team)) throw redirect({ to: '/$team', params: { team: DEFAULT_TEAM } }); }
});
const useTeam = () => teamById(team.useParams().team);

const landing = createRoute({ getParentRoute: () => team, path: '/', component: function LandingRoute() { return <Landing team={useTeam()} />; } });
const persona = createRoute({ getParentRoute: () => team, path: 'team', component: function TeamRoute() { return <TeamPage team={useTeam()} />; } });
const teams = createRoute({ getParentRoute: () => team, path: 'teams', component: function TeamsRoute() { return <AllTeams team={useTeam()} />; } });
const sketch = createRoute({ getParentRoute: () => team, path: 'teamskizze', component: function SketchRoute() { return <TeamSketch team={useTeam()} />; } });
const agreements = createRoute({ getParentRoute: () => team, path: 'vereinbarungen', component: function AgreementsRoute() { return <Agreements team={useTeam()} />; } });

const workspace = createRoute({
  getParentRoute: () => team, path: 'arbeitsbereich',
  validateSearch: (s: Record<string, unknown>): { schritt: number } => ({ schritt: int(s.schritt, WORKSPACE_STEPS.length) }),
  component: function WorkspaceRoute() { return <Workspace team={useTeam()} step={workspace.useSearch().schritt} />; }
});

const stories = createRoute({
  getParentRoute: () => team, path: 'situationen',
  validateSearch: (s: Record<string, unknown>): { thema: string; q: string } => ({
    thema: THEMES.some((t) => t.id === s.thema) ? String(s.thema) : 'alle',
    q: typeof s.q === 'string' ? s.q.slice(0, 80) : ''
  }),
  component: function StoriesRoute() { const s = stories.useSearch(); return <Stories team={useTeam()} theme={s.thema} q={s.q} />; }
});

const situation = createRoute({
  getParentRoute: () => team, path: 'situation/$id',
  validateSearch: (s: Record<string, unknown>): { schritt: Beat['id']; bild: number } => ({
    schritt: BEATS.find((b) => b.id === s.schritt)?.id ?? 'frage', bild: int(s.bild, 12)
  }),
  component: function SituationRoute() {
    const story = storyById(situation.useParams().id), s = situation.useSearch();
    return story ? <Situation team={useTeam()} story={story} beat={s.schritt} screen={s.bild} /> : <NotFound />;
  }
});

const tool = createRoute({
  getParentRoute: () => team, path: 'werkzeug/$id',
  component: function ToolRoute() {
    const data = toolById(tool.useParams().id);
    return data ? <ToolPage team={useTeam()} tool={data} /> : <NotFound />;
  }
});

const routeTree = root.addChildren([home, team.addChildren([landing, persona, teams, sketch, agreements, workspace, stories, situation, tool])]);

export const router = createRouter({ routeTree, history: createHashHistory(), scrollRestoration: true });

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}
