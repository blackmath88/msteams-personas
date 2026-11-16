import { Link, Outlet, useNavigate, useParams } from '@tanstack/react-router';
import { DEFAULT_TEAM, teamById, teamsBySector } from '../content/teams';
import { STORIES, THEMES, TOOLS, storiesFor } from '../content/stories';
import { useAgreements } from '../agreements';

export function Shell() {
  const params = useParams({ strict: false }) as { team?: string };
  const team = teamById(params.team ?? DEFAULT_TEAM), t = { team: team.id };
  const navigate = useNavigate();
  const agreed = useAgreements(team.id);
  const active = { className: 'active' }, loose = { includeSearch: false };
  return (
    <div className="hub">
      <div className="hub-bg" aria-hidden="true"><i /><i /><i /></div>
      <a className="skip" href="#inhalt">Zum Inhalt</a>
      <div className="shell">
        <aside className="side">
          <nav className="side-in glass" aria-label="Navigation">
            <Link className="brand" to="/$team" params={t}><i aria-hidden="true" />Praxis-Hub</Link>
            <div className="team-pick">
              <label htmlFor="team">Euer Team</label>
              <select id="team" value={team.id} onChange={(e) => navigate({ to: '/$team', params: { team: e.target.value } })}>
                {teamsBySector(true).map((s) => (
                  <optgroup key={s.id} label={s.label}>{s.teams.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</optgroup>
                ))}
                {!team.featured && <option value={team.id}>{team.name}</option>}
              </select>
              <Link className="small-link" to="/$team/teams" params={t}>Alle Teams ansehen</Link>
            </div>
            <div className="nav-g">
              <p>Grundlagen</p>
              <Link to="/$team/team" params={t} activeProps={active}>Team kennenlernen</Link>
              <Link to="/$team/arbeitsbereich" params={t} search={{ schritt: 1 }} activeOptions={loose} activeProps={active}>Unser Arbeitsbereich</Link>
            </div>
            <div className="nav-g">
              <p>Situationen</p>
              <Link to="/$team/situationen" params={t} search={{ thema: 'alle', q: '' }} activeOptions={{ exact: true, includeSearch: true }} activeProps={active}>Alle Situationen<em>{STORIES.length}</em></Link>
              {THEMES.map((th) => (
                <Link key={th.id} to="/$team/situationen" params={t} search={{ thema: th.id, q: '' }} activeOptions={{ exact: true, includeSearch: true }} activeProps={active}>
                  {th.short}<em>{STORIES.filter((s) => s.theme === th.id).length}</em>
                </Link>
              ))}
            </div>
            <div className="nav-g">
              <p>Werkzeuge</p>
              {/* Tools without a story yet are left out here; their pages exist and say what is missing. */}
              {TOOLS.filter((tool) => storiesFor(tool.id).length).map((tool) => (
                <Link key={tool.id} to="/$team/werkzeug/$id" params={{ team: team.id, id: tool.id }} activeProps={active}>
                  <span className="dot" style={{ background: tool.color }} aria-hidden="true" />{tool.name}<em>{storiesFor(tool.id).length}</em>
                </Link>
              ))}
            </div>
            <div className="nav-g">
              <p>Unser Team</p>
              <Link to="/$team/teamskizze" params={t} activeProps={active}>Teamskizze</Link>
              <Link to="/$team/vereinbarungen" params={t} activeProps={active}>Vereinbarungen<em>{agreed.length}</em></Link>
            </div>
          </nav>
        </aside>
        <main className="main" id="inhalt" tabIndex={-1}>
          <div className="wrap"><Outlet /></div>
        </main>
      </div>
    </div>
  );
}
