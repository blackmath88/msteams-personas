import { Link } from '@tanstack/react-router';
import type { Team } from '../content/teams';
import { STORIES } from '../content/stories';
import { Draft, Todo } from '../components/Todo';
import { toggleAgreement, useAgreements } from '../agreements';

/* The agreements a reader has adopted for their team: one printable sheet. */
export function Agreements({ team }: { team: Team }) {
  const ids = useAgreements(team.id), list = STORIES.filter((s) => ids.includes(s.id) && s.editorial);
  return (
    <>
      <p className="eyebrow">Unser Team</p>
      <h1>Unsere Vereinbarungen</h1>
      <p className="lead">Was ihr in den Situationen übernommen habt. Die Liste bleibt in diesem Browser.</p>
      <section className="section stack">
        {list.length ? (
          <>
            <ol className="sheet glass">
              {list.map((s) => (
                <li key={s.id}>
                  <p className="big">{s.editorial!.agreement} {s.editorial!.status === 'draft' && <Draft />}</p>
                  <p className="meta">aus <Link to="/$team/situation/$id" params={{ team: team.id, id: s.id }} search={{ schritt: 'vereinbarung', bild: 1 }}>{s.title}</Link>
                    {' · '}<button type="button" className="linkish" onClick={() => toggleAgreement(team.id, s.id)}>entfernen</button></p>
                </li>
              ))}
            </ol>
            <div className="row"><button type="button" className="btn" onClick={() => window.print()}>Drucken</button></div>
          </>
        ) : (
          <p className="note">Noch keine Vereinbarung übernommen. Geht eine <Link to="/$team/situationen" params={{ team: team.id }} search={{ thema: 'alle', q: '' }}>Situation</Link> bis zum Schritt «Vereinbarung» durch.</p>
        )}
      </section>
    </>
  );
}

const SKETCH_STEPS = [
  ['Wer seid ihr?', 'Name, Art des Teams, Grösse'],
  ['Mit wem arbeitet ihr?', 'Stammteam, Projekte, externe Partner'],
  ['Welche Häuser und Zimmer habt ihr?', 'Teams und Kanäle, ein persönlicher Bereich'],
  ['Wie trefft ihr euch?', 'Rhythmus; wo Agenda, Notizen und Entscheide liegen'],
  ['Wie verteilt ihr Aufgaben?', 'Gemeinsamer Plan, persönliche Listen, wer zuweist'],
  ['Wo liegt die gültige Fassung?', 'Dateiablage im Kanal, persönlicher Bereich, was geteilt wird'],
  ['Eure Skizze', 'Hausbild und Vereinbarungen auf einem Blatt']
];

/* CONTENT/BUILD: the team sketch is specified in docs/PRAXIS-HUB-CONCEPT.md (section 5) and not built. */
export function TeamSketch({ team }: { team: Team }) {
  return (
    <>
      <p className="eyebrow">Unser Team</p>
      <h1>Teamskizze</h1>
      <p className="lead">Skizziert euren eigenen Arbeitsalltag in sieben Schritten. Am Ende stehen ein Bild eurer Häuser und eure Vereinbarungen.</p>
      <section className="section stack">
        <Todo>Die Teamskizze ist noch nicht gebaut. Unten steht, was sie fragen wird; das Konzept liegt in docs/PRAXIS-HUB-CONCEPT.md.</Todo>
        <ol className="levels">
          {SKETCH_STEPS.map(([q, what], i) => <li key={q} className="glass card"><span className="av" aria-hidden="true">{i + 1}</span><span><b>{q}</b><span>{what}</span></span></li>)}
        </ol>
        <div className="row"><Link className="btn ghost" to="/$team/vereinbarungen" params={{ team: team.id }}>Zu euren Vereinbarungen</Link></div>
      </section>
    </>
  );
}
