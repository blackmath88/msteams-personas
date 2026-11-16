# Praxis-Hub — content, navigation and team sketch

Concept, 2026-11-16. Proposal for discussion; nothing here is built beyond the base in `hub/`. Counts were read from the data files on this date.

## 1. What the repository already holds

| Kind | Count | Where | State for the hub |
| --- | --- | --- | --- |
| Team personas, higher education | 5 | `worlds.js` | Rich and structured: tagline, tension, rhythm, lifecycle, people, work mix, personal vs shared, artefacts, consulting questions, boundary. Ready to show. |
| Team persona, business | 1 | `src/library.js` (Brunner Marketing) | Same shape. Ready. |
| Researched groups | 6 | `src/research-catalogue.js` | Shorter profiles with archetype, domain and team pattern. Ready. |
| Renderable stories | 11 | `examples/*.project.json` | Portable projects with 3 to 6 screens each. The hub can draw them today. |
| Researched, not renderable | 8 | `src/research-catalogue.js` | Trigger, friction, outcome, question and boundary exist; screens do not. Backlog. |
| Library situations | 8 | `src/library.js` | On the older model, with variants. Drawable after loading four more scripts in the hub. |
| Teaching sequences | 7 | `src/library.js` | 3 to 5 screens across tools with a stated objective. Same older model. |
| Use cases | 7 | `src/library.js` | A problem and a question each, mapped to a principle. |
| Principles | 3 | `src/library.js` | Chat or channel; personal draft or shared document; personal or shared responsibility. |
| Tools | 9 | `src/library.js` | Teams, chat, Outlook, Explorer, SharePoint, OneDrive, Planner, To Do, meeting recap. Plus Loop, meeting notes and workflow as project profiles. |
| Training themes | 6 | `worlds.js` (`modules`) | Each with one guiding question, e.g. «Wo findet unsere gemeinsame Arbeit statt?». |
| Workspace model | 1 | `src/workspace-core.js` | Team, channel, storage, folder, file, personal area; house overview and house-next-to-Teams views. |
| Six-question configurator | 1 | `src/configurator.js` | Deterministic suggestion from context, people, rhythm, externals, sharing, access. |

The three personas of the Unibas deck are three of the five worlds: Campus & People Development, Urban Health Analytics and Dr. Nora Keller.

### What the data already gives each story

A researched scenario carries `trigger`, `friction`, `question`, `outcome`, `boundary`, `prerequisites` and `sources`. That is four of the five beats without new writing:

| Beat | Source field |
| --- | --- |
| Frage | `question`, `trigger` |
| Szene | the project's screens, with `friction` as the lead-in |
| Vereinbarung | **missing**: `outcome` describes a result, not a rule a team adopts |
| Grenze | `boundary`, `prerequisites` |
| Transfer | **missing** |

So the writing work is one agreement sentence and one transfer question per story, not whole stories.

## 2. What can be ported, in order of effort

**Now, no engine change**

- All 12 persona pages, read directly from the data files instead of the copies in `hub/src/content/teams.ts`.
- The 11 renderable stories as situations. Each has several screens, so the «Szene» beat becomes a short sequence of screens, not one picture.
- Tool pages as an index over those stories.
- The house views for the administration team.

**Small adapter**

- The 8 library situations and 7 sequences: load `worlds.js`, `library.js`, `scenes-v3.js` and `model.js` in the hub's engine bridge and draw through the older view model. This adds Outlook, Explorer and SharePoint, including the «Mail-Anhang zur gemeinsamen Datei» story.
- The three principles as pages (problem, picture, recommendation, boundary). They need parts of `src/app.css`, which the hub does not load today.

**Needs engine or content work**

- House views for the research group and for Nora (personal shelf, guest access in another organisation). The model supports personal areas; there is no example yet, and cross-organisation houses are not modelled.
- A house as a component without slide heading and footer.
- The 8 researched stories without screens.

## 3. One honest limit: a story has its own cast

Every project carries its own people, tasks and files. The hub cannot replay «Die Teamsitzung» with the people of a different team; pretending to would break the identity rule the product is built on.

Proposal: the chosen team does three things, and nothing more.

1. It decides which Grundlagen pages are shown.
2. It orders and marks situations: «aus eurem Team», «aus einem ähnlichen Team», «anderes Umfeld».
3. It owns the list of adopted agreements.

A situation always shows its native team, named at the top: «Beispiel: Campus-Service Lernräume». Replaying one story with any team needs shared personas in the project format, which is a later model change.

## 4. Navigation

The difficulty is three axes at once: team, situation, tool. The rule: **one question per level, and the sidebar never shows more than four groups.**

```text
[ Euer Team ▾ ]                    always visible; includes «Eigenes Team» from the sketch

Grundlagen                         Who are we, where do we work?
  Team kennenlernen
  Unser Arbeitsbereich

Situationen                        What do we do when …?   (grouped by theme)
  Zusammen arbeiten                  ← the six training themes as group labels
  Kommunizieren
  Dokumente
  Aufgaben
  Sitzungen und Loop
  Digital Balance

Werkzeuge                          What do we agree on to use …?
  Teams · Planner · To Do · OneDrive · Outlook · SharePoint · Loop

Unser Team                         What have we decided?
  Teamskizze
  Vereinbarungen
```

Themes are group labels inside «Situationen», not a level of their own. A reader never has to choose between «theme» and «situation».

### Wayfinding rules

- **Three doors on the landing page**, each a full sentence: «Ich will ein Team kennenlernen», «Ich habe eine Situation», «Ich suche ein Werkzeug».
- **Every page says where it is**: team › group › page, and the step inside it.
- **Every situation says what it assumes**: «Baut auf: Unser Arbeitsbereich», with a link.
- **A tool page never explains buttons.** It lists the agreements that involve the tool and links into the situations.
- **Search (⌘K)** over situations, agreements and tools. With about 30 stories this becomes the fastest entry.
- **Unavailable is stated**, never hidden: «Für dieses Team noch nicht gebaut».
- **Addresses stay shareable**: team and step in the URL, as today.

### Page types

Five templates cover everything, which keeps the build small and the reader oriented:

| Template | Used for |
| --- | --- |
| Landing | Entry, three doors, the chosen team's facts |
| Persona | «Team kennenlernen»: who, where, how many, what; tension; who they work with |
| Steps | «Unser Arbeitsbereich» and every situation |
| Index | A tool, a theme group, the list of all teams |
| Sheet | Teamskizze result and the agreements, printable |

## 5. Teamskizze — sketch your own team

A guided sketch that ends in two things a team can keep: a picture of its houses and a one-page list of agreements. It is the «Transfer» of the whole hub.

| Step | Question | Input | Comes from |
| --- | --- | --- | --- |
| 1 | Wer seid ihr? | Name, kind of team, size | Configurator questions 1 and 2 |
| 2 | Mit wem arbeitet ihr? | Stammteam, projects, external partners | Configurator 2 and 4, persona «groups» |
| 3 | Welche Häuser und Zimmer habt ihr? | Teams and their channels, a personal area | Workspace model; starts from a template chosen by team pattern |
| 4 | Wie trefft ihr euch? | Rhythm; where agenda, notes and decisions live | New |
| 5 | Wie verteilt ihr Aufgaben? | Shared plan, personal lists, who assigns | New |
| 6 | Wo liegt die gültige Fassung? | Channel files, personal area, what is shared | Configurator 5 and 6 |
| 7 | Eure Skizze | House picture and agreement sheet | Engine and the adopted agreements |

How it works:

- **Steps 1 to 3 build a real workspace.** The answers become a portable project with the `workspace-houses` profile. The engine validates it and draws the houses, so the picture uses the same renderer as the examples.
- **Steps 4 to 6 produce agreements.** Each answer offers two or three candidate sentences taken from the situations («Jede Pendenz hat eine Person und einen Termin im Plan.»), each linked to the story that explains it. A team can adopt one or write its own.
- **Step 7 is the sheet.** Houses on top, agreements below, open questions marked. Export as PNG, print, and download as project JSON that the existing website, CLI and MCP server can open.
- **The sketch becomes a team.** After step 3 it appears in the team switcher as «Eigenes Team», and the Grundlagen pages show it.

Limits to state in the interface:

- Stored in this browser only. No account, no upload.
- A reminder not to enter real personal data; the sketch is a planning aid.
- Engine limits apply (16 people in a workspace, short labels). The sketch shows these as hints while typing, not as errors at the end.
- It suggests; it does not decide. A sketch is not a provisioning plan for a tenant.

## 6. Build order

1. **Read content from the data files.** Twelve teams and eleven stories appear without rewriting. Replace the placeholder files in `hub/src/content/`.
2. **Situation template with a screen sequence**, and one agreement plus one transfer question written per story.
3. **Navigation**: theme groups, tool index, the three doors, page position, search.
4. **Teamskizze steps 1 to 3 and the house picture.** This is the first thing a reader can take away.
5. **Teamskizze steps 4 to 6 and the sheet.**
6. **Older library through the adapter**: sequences, Outlook, Explorer, SharePoint, principles.
7. **Engine work**: house component without slide chrome; houses for the research group and the personal shelf.

Steps 1 to 3 make the hub useful to read. Steps 4 and 5 make it useful to a team.

## 7. Decisions needed

- **Which teams come first?** Proposal: the deck's three, then the two business groups.
- **Does choosing a team filter or only reorder?** Proposal: reorder and mark; never hide.
- **Who writes the agreement sentences?** They are the core message and should come from a trainer, not be generated.
- **Name of the hub.**
- **Is the sketch private by design?** A shareable link would need either a long URL or a server.
