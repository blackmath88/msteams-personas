import { Link } from '@tanstack/react-router';
import type { Team } from '../content/teams';
import { BEATS, TOOLS, type Beat, type Situation as SituationData } from '../content/modules';
import { AppScreen } from '../components/Scaled';
import { Stepper } from '../components/Stepper';
import { toggleAgreement, useAgreements } from '../agreements';

/* One situation in five beats: Frage → Szene → Vereinbarung → Grenze → Transfer. */
export function Situation({ team, situation, beat }: { team: Team; situation: SituationData; beat: Beat['id'] }) {
  const i = BEATS.findIndex((b) => b.id === beat), agreed = useAgreements(team.id).includes(situation.id);
  const to = (n: number) => ({ to: '/$team/situation/$id' as const, params: { team: team.id, id: situation.id }, search: { schritt: BEATS[n].id } });
  return (
    <>
      <p className="eyebrow">Situation · {situation.tools.map((id) => TOOLS.find((t) => t.id === id)?.name).join(' · ')}</p>
      <h1>{situation.question}</h1>
      <p className="lead">{situation.context}</p>
      <Stepper label="Schritte" steps={BEATS.map((b) => b.label)} current={i} link={(n, className, children) => <Link className={className} {...to(n)}>{children}</Link>} />
      <section className="stage glass" aria-live="polite">
        {beat === 'frage' && <><h2>{situation.question}</h2><p className="sub">{situation.context}</p><p className="note"><b>Aus Sicht von</b>{team.name}</p></>}
        {beat === 'szene' && (situation.project && situation.scene
          ? <AppScreen project={situation.project} scene={situation.scene} marks label={'Szene: ' + situation.title} caption="Nachgebildete Oberfläche · fiktives Beispiel" />
          : <p className="note"><b>Noch nicht gebaut</b>Für diese Situation gibt es noch kein Projekt mit einer Szene.</p>)}
        {beat === 'vereinbarung' && (
          <div className="rule-box">
            <p className="label">Vereinbarung</p>
            <p className="big">{situation.agreement}</p>
            <div className="row" style={{ marginTop: 20 }}>
              <button type="button" className={agreed ? 'btn ghost' : 'btn'} aria-pressed={agreed} onClick={() => toggleAgreement(team.id, situation.id)}>
                {agreed ? 'Übernommen · zurücknehmen' : 'Für unser Team übernehmen'}
              </button>
            </div>
          </div>
        )}
        {beat === 'grenze' && <><h2>Wann das nicht gilt</h2><p className="sub">{situation.limit}</p></>}
        {beat === 'transfer' && <><h2>Und bei euch?</h2><p className="sub">{situation.transfer}</p></>}
      </section>
      <div className="stepnav">
        <Link className="btn ghost" aria-disabled={i === 0} {...to(Math.max(0, i - 1))}><span aria-hidden="true">←</span>Zurück</Link>
        <span>Schritt {i + 1} von {BEATS.length}</span>
        <Link className="btn" aria-disabled={i === BEATS.length - 1} {...to(Math.min(BEATS.length - 1, i + 1))}>Weiter<span aria-hidden="true">→</span></Link>
      </div>
    </>
  );
}
