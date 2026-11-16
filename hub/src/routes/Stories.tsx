import { Link, useNavigate } from '@tanstack/react-router';
import type { Team } from '../content/teams';
import { STORIES, THEMES, orderedFor } from '../content/stories';
import { StoryCard } from '../components/StoryCard';
import { Todo } from '../components/Todo';

/* All situations, grouped by theme. The reader's team decides the order, never what is shown. */
export function Stories({ team, theme, q }: { team: Team; theme: string; q: string }) {
  const navigate = useNavigate(), t = { team: team.id };
  const needle = q.trim().toLowerCase();
  const match = orderedFor(team).filter((s) => !needle || [s.title, s.question, s.trigger, s.friction, s.editorial?.agreement ?? '', s.team?.name ?? s.organisation].join(' ').toLowerCase().includes(needle));
  const shown = THEMES.filter((th) => theme === 'alle' || th.id === theme);
  return (
    <>
      <p className="eyebrow">Situationen</p>
      <h1>Was tun wir, wenn …?</h1>
      <p className="lead">{STORIES.length} Situationen aus dem Alltag. Beispiele aus eurem Umfeld stehen zuerst.</p>
      <div className="filters">
        <div className="chips" role="group" aria-label="Thema">
          <Link className={theme === 'alle' ? 'on' : ''} to="/$team/situationen" params={t} search={{ thema: 'alle', q }}>Alle</Link>
          {THEMES.map((th) => <Link key={th.id} className={theme === th.id ? 'on' : ''} to="/$team/situationen" params={t} search={{ thema: th.id, q }}>{th.short}</Link>)}
        </div>
        <label className="search"><span className="sr-only">Situationen durchsuchen</span>
          <input type="search" placeholder="Suchen, z. B. Übergabe" value={q} onChange={(e) => navigate({ to: '/$team/situationen', params: t, search: { thema: theme, q: e.target.value }, replace: true })} />
        </label>
      </div>
      {shown.map((th) => {
        const list = match.filter((s) => s.theme === th.id);
        if (!list.length && needle) return null;
        return (
          <section key={th.id} className="section stack">
            <div><h2>{th.title}</h2><p className="sub">{th.question}</p></div>
            {list.length
              ? <div className="cards">{list.map((s) => <StoryCard key={s.id} story={s} team={team} />)}</div>
              : <Todo>Zu diesem Thema gibt es noch keine Situation mit Szenen.</Todo>}
          </section>
        );
      })}
      {needle && !match.length && <p className="note" style={{ marginTop: 32 }}>Keine Situation passt zu «{q}».</p>}
    </>
  );
}
