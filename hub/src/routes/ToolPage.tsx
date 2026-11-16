import { Link } from '@tanstack/react-router';
import type { Team } from '../content/teams';
import { orderedFor, storiesFor, toolById } from '../content/stories';
import { Draft, Todo } from '../components/Todo';

type Tool = NonNullable<ReturnType<typeof toolById>>;

/* A tool has no story of its own: the page lists what teams agree on when they use it. */
export function ToolPage({ team, tool }: { team: Team; tool: Tool }) {
  const list = orderedFor(team, storiesFor(tool.id));
  return (
    <>
      <p className="eyebrow">Werkzeug</p>
      <h1>{tool.name}</h1>
      <p className="lead">{tool.primer}</p>
      <section className="section stack">
        <h2>Was Teams für {tool.name} vereinbaren</h2>
        {list.length ? (
          <div className="list-links">
            {list.map((s) => (
              <Link key={s.id} className="glass" to="/$team/situation/$id" params={{ team: team.id, id: s.id }} search={{ schritt: 'vereinbarung', bild: 1 }}>
                <span className="q">{s.editorial ? <>«{s.editorial.agreement}» {s.editorial.status === 'draft' && <Draft />}</> : s.question}</span>
                <span>aus: {s.title} · {s.team?.name ?? s.organisation}</span>
              </Link>
            ))}
          </div>
        ) : <Todo>Zu {tool.name} gibt es noch keine Situation mit Szenen. Sie kommen mit der älteren Bibliothek (Outlook, Explorer, SharePoint, OneDrive).</Todo>}
      </section>
    </>
  );
}
