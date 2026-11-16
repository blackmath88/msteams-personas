import { Link } from '@tanstack/react-router';
import type { Team } from '../content/teams';
import { BEATS, CLOSENESS_LABEL, THEMES, TOOLS, closeness, type Beat, type Story } from '../content/stories';
import { AppScreen, SlideView } from '../components/Scaled';
import { Stepper } from '../components/Stepper';
import { Draft, Todo } from '../components/Todo';
import { toggleAgreement, useAgreements } from '../agreements';

/* One situation in five beats: Frage → Szene → Vereinbarung → Grenze → Transfer. */
export function Situation({ team, story, beat, screen }: { team: Team; story: Story; beat: Beat['id']; screen: number }) {
  const i = BEATS.findIndex((b) => b.id === beat), agreed = useAgreements(team.id).includes(story.id);
  const at = (schritt: Beat['id'], bild = 1) => ({ to: '/$team/situation/$id' as const, params: { team: team.id, id: story.id }, search: { schritt, bild } });
  const theme = THEMES.find((x) => x.id === story.theme)!, shot = story.screens[Math.min(screen, story.screens.length) - 1];
  const e = story.editorial;
  return (
    <>
      <p className="eyebrow">
        <Link to="/$team/situationen" params={{ team: team.id }} search={{ thema: theme.id, q: '' }}>{theme.short}</Link> · {story.tools.map((id) => TOOLS.find((x) => x.id === id)!.name).join(' · ')}
      </p>
      <h1>{story.title}</h1>
      <p className="lead">{story.question}</p>
      <p className="origin">
        <span className={'tag tag-' + closeness(story, team)}>{CLOSENESS_LABEL[closeness(story, team)]}</span>
        Beispiel: {story.team ? <Link to="/$team/team" params={{ team: story.team.id }}>{story.team.name}</Link> : story.organisation}
        {' · '}baut auf <Link to="/$team/arbeitsbereich" params={{ team: team.id }} search={{ schritt: 1 }}>Unser Arbeitsbereich</Link>
      </p>
      <Stepper label="Schritte" steps={BEATS.map((b) => b.label)} current={i} link={(n, className, children) => <Link className={className} {...at(BEATS[n].id)}>{children}</Link>} />

      <section className="stage glass" aria-live="polite">
        {beat === 'frage' && (
          <>
            <div><h2>{story.question}</h2>{story.framingDraft && <Draft />}</div>
            <dl className="frame">
              <div><dt>Auslöser</dt><dd>{story.trigger}</dd></div>
              <div><dt>Was schwierig ist</dt><dd>{story.friction}</dd></div>
            </dl>
          </>
        )}
        {beat === 'szene' && (shot ? (
          <>
            <div className="screens">
              <ol className="chips" aria-label="Ansichten dieser Szene">
                {story.screens.map((s, n) => <li key={n}><Link className={n + 1 === screen ? 'on' : ''} {...at('szene', n + 1)}>{n + 1} · {s.label}</Link></li>)}
              </ol>
            </div>
            {shot.kind === 'app'
              ? <AppScreen project={story.project} scene={shot.scene} marks label={shot.label} caption="Nachgebildete Oberfläche · fiktives Beispiel" />
              : <SlideView project={story.project} index={shot.slideIndex} label={shot.label} caption="Nachgebildete Oberfläche · fiktives Beispiel" />}
            {shot.note && <p className="sub">{shot.note}</p>}
          </>
        ) : <Todo>Diese Situation hat noch keine Szene.</Todo>)}
        {beat === 'vereinbarung' && (e ? (
          <div className="rule-box">
            <p className="label">Vereinbarung {e.status === 'draft' && <Draft />}</p>
            <p className="big">{e.agreement}</p>
            <div className="row" style={{ marginTop: 20 }}>
              <button type="button" className={agreed ? 'btn ghost' : 'btn'} aria-pressed={agreed} onClick={() => toggleAgreement(team.id, story.id)}>
                {agreed ? 'Übernommen · zurücknehmen' : 'Für unser Team übernehmen'}
              </button>
            </div>
          </div>
        ) : <Todo>Für diese Situation ist die Vereinbarung noch nicht formuliert (hub/src/content/editorial.ts).</Todo>)}
        {beat === 'grenze' && (
          <>
            <div><h2>Wann das nicht gilt</h2>{story.framingDraft && <Draft />}</div>
            <p className="sub">{story.boundary}</p>
            {story.prerequisites.length > 0 && <div className="note"><b>Voraussetzungen</b><ul className="plain">{story.prerequisites.map((p) => <li key={p}>{p}</li>)}</ul></div>}
          </>
        )}
        {beat === 'transfer' && (e ? (
          <>
            <div><h2>Und bei euch?</h2>{e.status === 'draft' && <Draft />}</div>
            <p className="sub">{e.transfer}</p>
            <div className="row"><Link className="btn ghost" to="/$team/teamskizze" params={{ team: team.id }}>In der Teamskizze festhalten</Link></div>
          </>
        ) : <Todo>Die Transferfrage fehlt noch (hub/src/content/editorial.ts).</Todo>)}
      </section>

      <div className="stepnav">
        <Link className="btn ghost" aria-disabled={i === 0} {...at(BEATS[Math.max(0, i - 1)].id)}><span aria-hidden="true">←</span>Zurück</Link>
        <span>Schritt {i + 1} von {BEATS.length}</span>
        {i === BEATS.length - 1
          ? <Link className="btn" to="/$team/situationen" params={{ team: team.id }} search={{ thema: 'alle', q: '' }}>Weitere Situationen<span aria-hidden="true">→</span></Link>
          : <Link className="btn" {...at(BEATS[i + 1].id)}>Weiter<span aria-hidden="true">→</span></Link>}
      </div>
    </>
  );
}
