import { Link, Outlet, useNavigate, useParams } from '@tanstack/react-router';
import { DEFAULT_TEAM, TEAMS, teamById } from '../content/teams';
import { SITUATIONS, TOOLS, situationsFor } from '../content/modules';
import { useAgreements } from '../agreements';

export function Shell() {
  const params = useParams({ strict: false }) as { team?: string };
  const team = teamById(params.team ?? DEFAULT_TEAM);
  const navigate = useNavigate();
  const agreed = useAgreements(team.id);
  return (
    <div className="hub">
      <div className="hub-bg" aria-hidden="true"><i /><i /><i /></div>
      <a className="skip" href="#inhalt">Zum Inhalt</a>
      <div className="shell">
        <aside className="side">
          <nav className="side-in glass" aria-label="Navigation">
            <Link className="brand" to="/$team" params={{ team: team.id }}><i aria-hidden="true" />Praxis-Hub</Link>
            <div className="team-pick">
              <label htmlFor="team">Euer Team</label>
              <select id="team" value={team.id} onChange={(e) => navigate({ to: '/$team', params: { team: e.target.value } })}>
                {TEAMS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="nav-g">
              <p>Grundlagen</p>
              <Link to="/$team/basis" params={{ team: team.id }} search={{ schritt: 1 }} activeOptions={{ includeSearch: false }} activeProps={{ className: 'active' }}>Team und Arbeitsbereich</Link>
            </div>
            <div className="nav-g">
              <p>Situationen</p>
              {SITUATIONS.map((s) => (
                <Link key={s.id} to="/$team/situation/$id" params={{ team: team.id, id: s.id }} search={{ schritt: 'frage' }} activeOptions={{ includeSearch: false }} activeProps={{ className: 'active' }}>{s.title}</Link>
              ))}
            </div>
            <div className="nav-g">
              <p>Werkzeuge</p>
              {TOOLS.map((t) => (
                <Link key={t.id} to="/$team/werkzeug/$id" params={{ team: team.id, id: t.id }} activeProps={{ className: 'active' }}>
                  <span className="dot" style={{ background: t.color }} aria-hidden="true" />{t.name}<em>{situationsFor(t.id).length}</em>
                </Link>
              ))}
            </div>
            <div className="side-foot">
              <b>Eure Vereinbarungen · {agreed.length}</b>
              {agreed.length
                ? <ul>{SITUATIONS.filter((s) => agreed.includes(s.id)).map((s) => <li key={s.id}>{s.agreement}</li>)}</ul>
                : 'Sie sammeln sich hier, sobald ihr die ersten Situationen durchgeht.'}
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
