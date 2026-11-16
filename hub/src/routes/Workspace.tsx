import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { teamById, type Team } from '../content/teams';
import { ProjectCore } from '../engine';
import { SlideView } from '../components/Scaled';
import { Stepper } from '../components/Stepper';
import { Todo } from '../components/Todo';

/*
 * «Unser Arbeitsbereich»: house, room, shelf. The views come from the engine's workspace
 * examples, which exist for one team (Campus & People Development). Other teams see that
 * example, clearly labelled, until their own workspace is modelled.
 */
const houses = ProjectCore.workspaceExample('workspace-houses');
const workspace = ProjectCore.workspaceExample('workspace');
const EXAMPLE_TEAM = 'campus-people-development';

const LEVELS = [
  ['Team', 'Haus', 'Wer arbeitet zusammen?'],
  ['Kanal', 'Zimmer', 'Welches Thema braucht einen eigenen Ort?'],
  ['Dateiablage', 'Regal', 'Wie finden wir die Unterlagen wieder?']
];

export const WORKSPACE_STEPS: { short: string; title: string; sub: string; body: () => ReactNode }[] = [
  {
    short: 'Haus, Zimmer, Regal', title: 'Drei Ebenen, drei Fragen', sub: 'Vom Personenkreis über das Thema bis zur Dateiablage. Jede Ebene beantwortet eine andere Frage.',
    body: () => (
      <ol className="levels">{LEVELS.map(([tech, house, q], i) => <li key={tech} className="glass card"><span className="av" aria-hidden="true">{i + 1}</span><span><b>{tech} · {house}</b><span>{q}</span></span></li>)}</ol>
    )
  },
  {
    short: 'Die Häuser', title: 'Jede Gruppe hat ihren Arbeitsbereich', sub: 'So sieht die Übersicht für ein Mitglied aus, das in mehreren Gruppen mitarbeitet.',
    body: () => <SlideView project={houses} index={0} label="Die Arbeitsbereiche als Häuser" caption="Hausmodell · fiktives Beispiel" />
  },
  {
    short: 'Ein Haus von innen', title: 'Ein Blick in ein Haus', sub: 'Dasselbe Team, einmal als Haus und einmal in Teams: Kanal und Dateiablage sind dieselben.',
    body: () => <SlideView project={houses} index={1} label="Hausmodell und nachgebildetes Teams-Fenster nebeneinander" caption="Hausmodell und Microsoft Teams (nachgebildet)" />
  },
  {
    short: 'Dateiablage', title: 'Wo liegen die Unterlagen?', sub: 'Jeder Kanal hat seine Dateiablage. Ordner ändern daran nichts: Das Regal bleibt dasselbe.',
    body: () => <SlideView project={workspace} index={1} label="Nachgebildetes Teams-Fenster mit der Dateiablage eines Kanals" caption="Microsoft Teams (nachgebildet)" />
  }
];

export function Workspace({ team, step }: { team: Team; step: number }) {
  const i = step - 1, s = WORKSPACE_STEPS[i], last = i === WORKSPACE_STEPS.length - 1, t = { team: team.id };
  return (
    <>
      <p className="eyebrow">Grundlagen · Unser Arbeitsbereich</p>
      <h1>Haus, Zimmer, Regal</h1>
      <p className="lead">Bevor es um Werkzeuge geht: Wer arbeitet mit wem, und wo liegt was? Alle Situationen bauen darauf auf.</p>
      <Stepper label="Schritte" steps={WORKSPACE_STEPS.map((x) => x.short)} current={i}
        link={(n, className, children) => <Link className={className} to="/$team/arbeitsbereich" params={t} search={{ schritt: n + 1 }}>{children}</Link>} />
      <section className="stage glass" aria-live="polite">
        <div><h2>{s.title}</h2><p className="sub">{s.sub}</p></div>
        {i > 0 && !team.hasWorkspace && (
          <Todo>Für «{team.name}» ist der Arbeitsbereich noch nicht modelliert. Gezeigt wird das Beispiel «{teamById(EXAMPLE_TEAM).name}».</Todo>
        )}
        {s.body()}
      </section>
      <div className="stepnav">
        <Link className="btn ghost" aria-disabled={i === 0} to="/$team/arbeitsbereich" params={t} search={{ schritt: Math.max(1, step - 1) }}><span aria-hidden="true">←</span>Zurück</Link>
        <span>Schritt {step} von {WORKSPACE_STEPS.length}</span>
        {last
          ? <Link className="btn" to="/$team/situationen" params={t} search={{ thema: 'alle', q: '' }}>Zu den Situationen<span aria-hidden="true">→</span></Link>
          : <Link className="btn" to="/$team/arbeitsbereich" params={t} search={{ schritt: step + 1 }}>Weiter<span aria-hidden="true">→</span></Link>}
      </div>
    </>
  );
}
