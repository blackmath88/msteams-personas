import { Link } from '@tanstack/react-router';
import { sectorLabel, teamsBySector, type Team } from '../content/teams';
import { STORIES } from '../content/stories';
import { StoryCard } from '../components/StoryCard';
import { Todo } from '../components/Todo';

function Roof({ color }: { color: string }) {
  return <svg className="roof" viewBox="0 0 44 30" aria-hidden="true"><path d="M2 28L22 4l20 24z" fill={color} /></svg>;
}

/* «Team kennenlernen»: who, where, how many, what – and what is hard for this team. */
export function TeamPage({ team }: { team: Team }) {
  const own = STORIES.filter((s) => s.team?.id === team.id);
  return (
    <>
      <p className="eyebrow">Team kennenlernen · {sectorLabel(team.sector)}</p>
      <h1>{team.name}</h1>
      <p className="lead">{team.summary}</p>

      <section className="section stack">
        <div className="stat">
          {team.headcount ? <b>{team.headcount}</b> : null}
          <span>{team.headcount ? (team.headcount === 1 ? 'Person' : 'Personen') : team.sizeLabel}<small>{team.kind}</small></span>
        </div>
        <ul className="roles">{team.people.map((p) => <li key={p.name} className="role"><span className="av" aria-hidden="true">{p.initials}</span><span><b>{p.name}</b><span>{p.role}</span></span></li>)}</ul>
        {team.rhythm && <p className="sub"><b>Rhythmus:</b> {team.rhythm}</p>}
      </section>

      <section className="section stack">
        <h2>Was hier schwierig ist</h2>
        <p className="note tension">{team.tension}</p>
        {team.question && <p className="sub"><b>Die Frage dahinter:</b> {team.question}</p>}
      </section>

      <section className="section stack">
        <h2>Mit wem arbeitet das Team zusammen?</h2>
        {team.groups.length
          ? <ul className="groups">{team.groups.map((g) => <li key={g.kind} className="glass card"><Roof color={g.color} /><p className="label">{g.kind}</p><ul className="plain">{g.names.map((n) => <li key={n}>{n}</li>)}</ul></li>)}</ul>
          : <Todo>Für dieses Team ist noch nicht beschrieben, mit wem es eng, gelegentlich und extern zusammenarbeitet.</Todo>}
        {team.boundary && <p className="note"><b>Grenze</b>{team.boundary}</p>}
      </section>

      <section className="section stack">
        <h2>Situationen aus diesem Team</h2>
        {own.length
          ? <div className="cards">{own.map((s) => <StoryCard key={s.id} story={s} team={team} />)}</div>
          : <Todo>Für dieses Team gibt es noch keine Situation mit Szenen. Bis dahin zeigt «Alle Situationen» Beispiele aus ähnlichen Teams zuerst.</Todo>}
        <div className="row">
          <Link className="btn" to="/$team/arbeitsbereich" params={{ team: team.id }} search={{ schritt: 1 }}>Weiter: Unser Arbeitsbereich<span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </>
  );
}

/* Every team in the repository, business first. Featured teams are the ones in the switcher. */
export function AllTeams({ team }: { team: Team }) {
  return (
    <>
      <p className="eyebrow">Alle Teams</p>
      <h1>In welchem Team erkennt ihr euch wieder?</h1>
      <p className="lead">Alle Teams sind fiktiv. Wählt das ähnlichste: Es bestimmt, welche Beispiele zuerst erscheinen.</p>
      {teamsBySector(false).map((s) => (
        <section key={s.id} className="section stack">
          <h2>{s.label}</h2>
          <div className="cards">
            {s.teams.map((x) => (
              <Link key={x.id} className="glass story-card" to="/$team/team" params={{ team: x.id }}>
                <span className={'tag ' + (x.id === team.id ? 'tag-own' : 'tag-other')}>{x.id === team.id ? 'Gewählt' : x.kind}</span>
                <strong>{x.name}</strong>
                <span>{x.summary}</span>
                <span className="meta">{x.sizeLabel}{x.featured ? '' : ' · nicht in der Kurzauswahl'}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
