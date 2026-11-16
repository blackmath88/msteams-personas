import { Link } from '@tanstack/react-router';
import type { Team } from '../content/teams';
import { situationsFor, type Tool } from '../content/modules';

/* A tool has no story of its own: the page lists what teams agree on when they use it. */
export function ToolPage({ team, tool }: { team: Team; tool: Tool }) {
  const list = situationsFor(tool.id);
  return (
    <>
      <p className="eyebrow">Werkzeug</p>
      <h1>{tool.name}</h1>
      <p className="lead">{tool.primer}</p>
      <section className="section">
        <h2>Was Teams für {tool.name} vereinbaren</h2>
        <div className="list-links">
          {list.map((s) => (
            <Link key={s.id} className="glass" to="/$team/situation/$id" params={{ team: team.id, id: s.id }} search={{ schritt: 'vereinbarung' }}>
              «{s.agreement}»<span>aus: {s.title}</span>
            </Link>
          ))}
          {!list.length && <p className="note">Noch keine Situation zu diesem Werkzeug.</p>}
        </div>
      </section>
    </>
  );
}
