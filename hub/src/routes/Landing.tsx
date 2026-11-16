import { Link } from '@tanstack/react-router';
import { sectorLabel, type Team } from '../content/teams';
import { STORIES, TOOLS, orderedFor } from '../content/stories';
import { StoryCard } from '../components/StoryCard';
import { AppScreen } from '../components/Scaled';

export function Landing({ team }: { team: Team }) {
  const t = { team: team.id }, mine = orderedFor(team), hero = mine.find((s) => s.screens.some((x) => x.kind === 'app'));
  const shot = hero?.screens.find((x) => x.kind === 'app');
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Zusammenarbeit im Alltag</p>
          <h1>So arbeitet ein Team wirklich mit Teams.</h1>
          <p className="lead">Keine Funktionsliste. Echte Situationen, gezeigt an einem Team, und die Vereinbarungen, die daraus entstehen.</p>
        </div>
        <div className="glass" style={{ padding: 14 }}>
          {hero && shot && <AppScreen project={hero.project} scene={shot.scene} label={'Beispiel: ' + shot.label} caption={'Aus «' + hero.title + '» · nachgebildete Oberfläche, fiktives Beispiel'} />}
        </div>
      </section>

      <nav className="doors" aria-label="Einstiege">
        <Link className="glass" to="/$team/team" params={t}><span className="label">Grundlagen</span><strong>Ich will ein Team kennenlernen</strong><span>Wer, wo, wie viele, was – und wie der Arbeitsbereich aufgebaut ist.</span></Link>
        <Link className="glass" to="/$team/situationen" params={t} search={{ thema: 'alle', q: '' }}><span className="label">{STORIES.length} Situationen</span><strong>Ich habe eine Situation</strong><span>Vom Alltag her: Was tun wir, wenn …?</span></Link>
        <Link className="glass" to="/$team/werkzeug/$id" params={{ team: team.id, id: TOOLS[0].id }}><span className="label">{TOOLS.length} Werkzeuge</span><strong>Ich suche ein Werkzeug</strong><span>Was Teams vereinbaren, damit es im Alltag trägt.</span></Link>
      </nav>

      <section className="section">
        <p className="eyebrow">Euer Team · {sectorLabel(team.sector)}</p>
        <h2>{team.name}</h2>
        <p className="sub">{team.summary}</p>
        <dl className="facts glass" style={{ marginTop: 18 }}>
          <div><dt>Art</dt><dd>{team.kind}</dd></div>
          <div><dt>Grösse</dt><dd>{team.sizeLabel}</dd></div>
          <div><dt>Was schwierig ist</dt><dd>{team.tension}</dd></div>
        </dl>
      </section>

      <section className="section">
        <h2>Zum Einstieg</h2>
        <div className="cards">{mine.slice(0, 3).map((s) => <StoryCard key={s.id} story={s} team={team} />)}</div>
      </section>
    </>
  );
}
