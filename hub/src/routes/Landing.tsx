import { Link } from '@tanstack/react-router';
import type { Team } from '../content/teams';
import { SITUATIONS } from '../content/modules';
import { AppScreen } from '../components/Scaled';

export function Landing({ team }: { team: Team }) {
  const first = SITUATIONS[0];
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Zusammenarbeit im Alltag</p>
          <h1>So arbeitet ein Team wirklich mit Teams.</h1>
          <p className="lead">Keine Funktionsliste. Echte Situationen, gezeigt an einem Team, und die Vereinbarungen, die daraus entstehen.</p>
          <div className="row" style={{ marginTop: 30 }}>
            <Link className="btn" to="/$team/basis" params={{ team: team.id }} search={{ schritt: 1 }}>Team kennenlernen</Link>
            <Link className="btn ghost" to="/$team/situation/$id" params={{ team: team.id, id: first.id }} search={{ schritt: 'frage' }}>Zur ersten Situation</Link>
          </div>
        </div>
        <div className="glass" style={{ padding: 14 }}>
          {first.project && first.scene && <AppScreen project={first.project} scene={first.scene} label="Beispiel: nachgebildetes Planner-Board" caption="Nachgebildete Oberfläche · fiktives Beispiel" />}
        </div>
      </section>

      <dl className="facts glass" aria-label="Euer Team">
        <div><dt>Wer</dt><dd>{team.name}</dd></div>
        <div><dt>Wo</dt><dd>{team.facts.where}</dd></div>
        <div><dt>Wie viele</dt><dd>{team.facts.size}</dd></div>
        <div><dt>Was</dt><dd>{team.facts.work}</dd></div>
      </dl>

      <section className="section">
        <h2>Situationen aus dem Alltag</h2>
        <div className="cards">
          {SITUATIONS.map((s) => (
            <Link key={s.id} className="glass" to="/$team/situation/$id" params={{ team: team.id, id: s.id }} search={{ schritt: 'frage' }}>
              <strong>{s.title}</strong>
              <span>{s.question}</span>
              <span className="rule">«{s.agreement}»</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
