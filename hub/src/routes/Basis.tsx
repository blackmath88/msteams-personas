import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import type { Team } from '../content/teams';
import { ProjectCore } from '../engine';
import { SlideView } from '../components/Scaled';
import { Stepper } from '../components/Stepper';
import { SITUATIONS } from '../content/modules';

/*
 * The basis every module builds on: who the team is, who it works with, and how its
 * workspace is laid out. The house views come from the engine's workspace examples,
 * which currently exist for the administration team only.
 */
const houses = ProjectCore.workspaceExample('workspace-houses');
const workspace = ProjectCore.workspaceExample('workspace');

function Roof({ color }: { color: string }) {
  return <svg className="roof" viewBox="0 0 44 30" aria-hidden="true"><path d="M2 28L22 4l20 24z" fill={color} /></svg>;
}
function NotYet({ team }: { team: Team }) {
  return <p className="note"><b>Noch nicht gebaut</b>Für «{team.name}» gibt es im Renderer noch keinen Arbeitsbereich. Die Ansicht für die Verwaltung zeigt, wie dieser Schritt aussehen wird.</p>;
}

type Step = { short: string; title: string; sub: (t: Team) => string; body: (t: Team) => ReactNode };
export const BASIS_STEPS: Step[] = [
  {
    short: 'Wer sind wir?', title: 'Wer sind wir?', sub: (t) => t.summary,
    body: (t) => (
      <>
        <div className="stat"><b>{t.headcount}</b><span>{t.headcountLabel}<small>{t.facts.where}</small></span></div>
        <ul className="roles">{t.roles.map((r) => <li key={r.name} className="role"><span className="av" aria-hidden="true">{r.initials}</span><span><b>{r.name}</b><span>{r.does}</span></span></li>)}</ul>
      </>
    )
  },
  {
    short: 'Mit wem?', title: 'Mit wem arbeiten wir zusammen?', sub: () => 'Die laufende Arbeit bleibt beim Stammteam. Für einzelne Vorhaben kommen andere Personen hinzu.',
    body: (t) => (
      <>
        <ul className="groups">{t.groups.map((g) => <li key={g.title} className="glass card"><Roof color={g.color} /><p className="label">{g.kind}</p><h3>{g.title}</h3><p>{g.text}</p></li>)}</ul>
        <p className="note"><b>Was sich ändert</b>Je nach Vorhaben arbeiten andere Personen mit und brauchen Zugang zu den passenden Unterlagen.</p>
      </>
    )
  },
  {
    short: 'Die Häuser', title: 'Jede Gruppe hat ihren Arbeitsbereich', sub: () => 'So sieht die Übersicht für ein Mitglied aus, das in mehreren Gruppen mitarbeitet.',
    body: (t) => t.id === 'verwaltung'
      ? <SlideView project={houses} index={0} label="Die Arbeitsbereiche als Häuser" caption="Hausmodell · fiktives Beispiel" />
      : <NotYet team={t} />
  },
  {
    short: 'Ein Haus von innen', title: 'Ein Blick in ein Haus', sub: () => 'Dasselbe Team, einmal als Haus und einmal in Teams: Kanal und Dateiablage sind dieselben.',
    body: (t) => t.id === 'verwaltung'
      ? <SlideView project={houses} index={1} label="Hausmodell und nachgebildetes Teams-Fenster nebeneinander" caption="Hausmodell und Microsoft Teams (nachgebildet)" />
      : <NotYet team={t} />
  },
  {
    short: 'Dateiablage', title: 'Wo liegen die Unterlagen?', sub: () => 'Jeder Kanal hat seine Dateiablage. Ordner ändern daran nichts: Das Regal bleibt dasselbe.',
    body: (t) => t.id === 'verwaltung'
      ? <SlideView project={workspace} index={1} label="Nachgebildetes Teams-Fenster mit der Dateiablage eines Kanals" caption="Microsoft Teams (nachgebildet)" />
      : <NotYet team={t} />
  }
];

export function Basis({ team, step }: { team: Team; step: number }) {
  const i = step - 1, s = BASIS_STEPS[i], last = i === BASIS_STEPS.length - 1;
  return (
    <>
      <p className="eyebrow">Grundlagen · {team.kind}</p>
      <h1>{team.name}</h1>
      <p className="lead">Lernt zuerst das Team kennen und seht, wie sein Arbeitsbereich aufgebaut ist. Alle Situationen und Werkzeuge bauen darauf auf.</p>
      <Stepper label="Schritte" steps={BASIS_STEPS.map((x) => x.short)} current={i}
        link={(n, className, children) => <Link className={className} to="/$team/basis" params={{ team: team.id }} search={{ schritt: n + 1 }}>{children}</Link>} />
      <section className="stage glass" aria-live="polite">
        <div><h2>{s.title}</h2><p className="sub">{s.sub(team)}</p></div>
        {s.body(team)}
      </section>
      <div className="stepnav">
        <Link className="btn ghost" aria-disabled={i === 0} to="/$team/basis" params={{ team: team.id }} search={{ schritt: Math.max(1, step - 1) }}><span aria-hidden="true">←</span>Zurück</Link>
        <span>Schritt {step} von {BASIS_STEPS.length}</span>
        {last
          ? <Link className="btn" to="/$team/situation/$id" params={{ team: team.id, id: SITUATIONS[0].id }} search={{ schritt: 'frage' }}>Zur ersten Situation<span aria-hidden="true">→</span></Link>
          : <Link className="btn" to="/$team/basis" params={{ team: team.id }} search={{ schritt: step + 1 }}>Weiter<span aria-hidden="true">→</span></Link>}
      </div>
    </>
  );
}
