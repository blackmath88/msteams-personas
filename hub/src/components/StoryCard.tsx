import { Link } from '@tanstack/react-router';
import type { Team } from '../content/teams';
import { CLOSENESS_LABEL, TOOLS, closeness, type Story } from '../content/stories';

export function StoryCard({ story, team }: { story: Story; team: Team }) {
  const c = closeness(story, team);
  return (
    <Link className="glass story-card" to="/$team/situation/$id" params={{ team: team.id, id: story.id }} search={{ schritt: 'frage', bild: 1 }}>
      <span className={'tag tag-' + c}>{CLOSENESS_LABEL[c]}</span>
      <strong>{story.title}</strong>
      <span>{story.question}</span>
      <span className="meta">{story.team?.name ?? story.organisation} · {story.tools.map((id) => TOOLS.find((x) => x.id === id)!.name).join(', ')}</span>
    </Link>
  );
}
