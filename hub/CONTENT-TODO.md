# Praxis-Hub — where content is missing

Updated 2026-11-16. The hub shows a dashed «Inhalt fehlt» box wherever something below is missing, and an «Entwurf» tag on wording that was drafted during the build. Both are meant to stay visible until the content is reviewed.

Teams, stories and screens are read from the repository's data files. Do not copy them into `hub/`; fix them at the source.

## 1. Wording that needs a trainer

| What | Where | State |
| --- | --- | --- |
| Agreement sentence for each of the 11 situations | `hub/src/content/editorial.ts` | All 11 are drafts. Set `status: 'final'` after review. |
| Transfer question for each of the 11 situations | `hub/src/content/editorial.ts` | All 11 are drafts. |
| Question, trigger, friction and boundary for three example stories | `hub/src/content/stories.ts` (`examples`) | Drafts: «Die Teamsitzung», «Über das Wochenende», «Die Zusage im Chat». The other eight use researched text from `src/research-catalogue.js`. |
| Tool introductions (one sentence each) | `hub/src/content/stories.ts` (`TOOLS`) | Drafts. |
| Theme assignment of each situation | `hub/src/content/editorial.ts` (`theme`) | First assignment, not reviewed. |

## 2. Teams

Twelve teams exist; eight are in the switcher, two per sector, business first. The selection is in `hub/src/content/teams.ts` (`EDITORIAL`).

| Gap | Affects | Fix at |
| --- | --- | --- |
| No «Mit wem arbeitet das Team zusammen?» | The six researched teams and Brunner Marketing | Add collaboration to `src/research-catalogue.js` / `src/library.js` |
| No situation with screens | Brunner Marketing, Urban Health Analytics, Dr. Nora Keller, Lehrteam Seminar, Kommission Digitale Zusammenarbeit | Their stories exist only in the older library (see 4) |
| Only one business team has its own story | Sector «Unternehmen» | New business stories; candidates in `docs/BUSINESS-DOMAINS-CH-DE-BUILD-PLAN.md` |
| Head count is text, not a number | The six researched teams | Optional: add a numeric size |
| Review the featured selection | All | Trainers decide which eight are most relatable |

## 3. Workspace (Haus, Zimmer, Regal)

- Only Campus & People Development has house views. Every other team sees that example with a note.
- Missing models: the research group (guest access in another organisation), the personal shelf for Dr. Nora Keller, and a business team.
- The house views are complete slides with their own heading. A house component without slide chrome needs engine work.

## 4. Situations

- **Digital Balance** has no situation.
- **Eight researched stories have no screens**: semester-preparation, committee-preparation, research-fieldwork, personal-to-group, structured-requests, recurring-operations, municipal-holiday-cover, service-checked-guide (`src/research-catalogue.js`).
- **The older library is not connected**: 8 situations and 7 sequences, including everything with Outlook, Explorer, SharePoint and OneDrive. Until then those three tools have no story and are hidden from the sidebar.
- The principle slide of a story («Prinzip: Aufgaben, vorher und nachher») is left out of «Szene», because its styles are not loaded in the hub.
- Screens without a slide title use the generic profile name as their label («Teams: Beiträge im Kanal»). A title per slide in the project reads better.

## 5. Not built

- **Teamskizze**: the page lists its seven steps only. Concept: `docs/PRAXIS-HUB-CONCEPT.md`, section 5.
- **Search across the hub (⌘K)**: only the text filter on «Alle Situationen» exists.
- **«Eigenes Team»** in the team switcher.
- **Tests** for the hub.

## 6. Decisions still open

- Name of the hub («Praxis-Hub» is a working title).
- Whether the landing headline should name Teams or stay tool-neutral.
- Whether drafts may be shown to learners, or the hub stays internal until section 1 is reviewed. `public/_headers` currently sets `noindex`.
