import { createHashHistory, createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router';
import { Shell } from './components/Shell';
import { DEFAULT_TEAM, TEAMS, teamById } from './content/teams';
import { BEATS, situationById, toolById, type Beat } from './content/modules';
import { Landing } from './routes/Landing';
import { Basis, BASIS_STEPS } from './routes/Basis';
import { Situation } from './routes/Situation';
import { ToolPage } from './routes/ToolPage';

/*
 * Addresses:  #/<team>                     landing, seen from one team
 *             #/<team>/basis?schritt=3     team and workspace, one step at a time
 *             #/<team>/situation/<id>?schritt=vereinbarung
 *             #/<team>/werkzeug/<id>
 * The team and the step are part of the address, so a trainer can send a link to an exact
 * step. Hash routing keeps the build a folder of static files.
 */
function NotFound() {
  return <><h1>Diese Seite gibt es nicht.</h1><p className="lead">Wählt links ein Team, eine Situation oder ein Werkzeug.</p></>;
}

const root = createRootRoute({ component: Shell, notFoundComponent: NotFound });

const home = createRoute({ getParentRoute: () => root, path: '/', beforeLoad: () => { throw redirect({ to: '/$team', params: { team: DEFAULT_TEAM } }); } });

const team = createRoute({
  getParentRoute: () => root, path: '$team',
  beforeLoad: ({ params }) => { if (!TEAMS.some((t) => t.id === params.team)) throw redirect({ to: '/$team', params: { team: DEFAULT_TEAM } }); }
});
const landing = createRoute({ getParentRoute: () => team, path: '/', component: function LandingRoute() { return <Landing team={teamById(team.useParams().team)} />; } });

const basis = createRoute({
  getParentRoute: () => team, path: 'basis',
  validateSearch: (s: Record<string, unknown>): { schritt: number } => {
    const n = Math.round(Number(s.schritt));
    return { schritt: n >= 1 && n <= BASIS_STEPS.length ? n : 1 };
  },
  component: function BasisRoute() { return <Basis team={teamById(team.useParams().team)} step={basis.useSearch().schritt} />; }
});

const situation = createRoute({
  getParentRoute: () => team, path: 'situation/$id',
  validateSearch: (s: Record<string, unknown>): { schritt: Beat['id'] } => ({ schritt: BEATS.find((b) => b.id === s.schritt)?.id ?? 'frage' }),
  component: function SituationRoute() {
    const data = situationById(situation.useParams().id);
    return data ? <Situation team={teamById(team.useParams().team)} situation={data} beat={situation.useSearch().schritt} /> : <NotFound />;
  }
});

const tool = createRoute({
  getParentRoute: () => team, path: 'werkzeug/$id',
  component: function ToolRoute() {
    const data = toolById(tool.useParams().id);
    return data ? <ToolPage team={teamById(team.useParams().team)} tool={data} /> : <NotFound />;
  }
});

const routeTree = root.addChildren([home, team.addChildren([landing, basis, situation, tool])]);

export const router = createRouter({ routeTree, history: createHashHistory(), scrollRestoration: true });

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}
