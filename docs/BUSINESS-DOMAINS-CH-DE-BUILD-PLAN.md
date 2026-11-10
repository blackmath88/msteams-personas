# Business domains and working patterns for Switzerland and Germany

Date: 2026-11-10. Status: the first reference pair and minimal discovery are implemented in PR #15; see the [build handoff](BUSINESS-REFERENCE-HANDOFF.md). Practitioner recognition and follow-on portfolio selection remain open. This plan alone does not authorise a merge or deployment; the user subsequently authorised publishing this completed slice on main. See the [review decisions](research/BUSINESS-DOMAINS-CH-DE-REVIEW-DECISIONS.md) and [original returned review](research/PERPLEXITY-BUSINESS-DOMAINS-CH-DE-REVIEW-2026-11-10.md).

## Outcome and direction

Make the library useful to trainers working with ordinary organisations in Switzerland and Germany: public administration, SMEs and operational teams as well as office-based specialists. A visitor should recognise their work, choose a concrete situation and export an understandable teaching sequence without provisioning a Microsoft tenant.

The next content expansion broadens business and public-service coverage. It replaces further higher-education expansion as the next content priority. Keep the university collection and its working capabilities. Avoid building another specialist collection with different names but the same underlying story.

Select for recognisability, collaboration needs and teaching value as well as economic reach. Employment counts are useful context; they do not measure M365 use, licence availability, training demand or how many people our examples will reach. The proposed portfolio is a product judgement, not a statistically established maximum-coverage solution.

## Current repository baseline

PR #14 is merged into `main` at `9a017f59ac7a9792f797d9195c98f6646960066a`. Recheck current main before implementation. Read AGENTS.md and its required documents first. For actual capability coverage, inspect the code and recent handoffs: some older architecture documents still describe pre-implementation states.

- Static German-language website, Swiss spelling, local assets and shared rendering; portable project format v1, capability version 6, CLI and local MCP.
- Curated library includes more application surfaces than portable projects. Do not assume every curated Outlook, file or AI-recap screen can already be authored as an arbitrary portable project.
- Portable profiles: `teams-posts`, `teams-chat`, `planner`, `planner-task`, `todo`, `prinzip-tasks`, four workspace profiles, `meeting-notes`, `loop-component` and `workflow`. Confirm their exact fields and budgets through `ProjectCore` or CLI `capabilities`.
- The new research catalogue contains four higher-education additions, twelve scenario records and six renderable examples. It is exposed through the website, CLI `catalogue` and MCP `get_catalogue`.
- Business content already includes Marketing & Kommunikation and customer-service onboarding at the fictional Brunner Haustechnik AG. Portable examples also include a workshop and other non-university settings. A new technical-service example must extend these with office–field coordination rather than repeat onboarding or the marketing project.
- Shared component and workflow content is preserved metadata in the form and currently edited through JSON. The new profiles export full slides; they are not new D1 component-export types.
- Real tenant acceptance, a real assistant-host trial for capability 6, a current German notes-panel reference and a full screen-reader review remain open. Earlier local test results do not settle those questions.

Inspect [current implementation handoff](PERSONA-SCENARIO-HANDOFF.md), [shared catalogue](../src/research-catalogue.js), [project core](../src/project-core.js), [collaboration core](../src/collaboration-core.js), [business library](../src/library.js), [additional scenes](../src/scenes-v3.js), [deck components plan](DECK-COMPONENTS-PLAN.md) and [review gallery](morning-review/index.html).

## Proposed domain portfolio

These are candidate teaching contexts. Groups, sizes, roles and scenarios will be fictional synthesis. Build two reference stories first. Trade is the next candidate; engineering is the provisional fourth choice, with manufacturing retained as a substantive challenger. Selecting a portfolio does not commit to delivering four examples immediately.

| Proposed wave | Domain and recognisable group | Collaboration problem | First scenario hypothesis | Important distinction |
| --- | --- | --- | --- | --- |
| Reference 1 | Gemeinde- / Stadtverwaltung: internal cross-department service group | An internally agreed change is mistaken for an approved public announcement | Prepare revised opening hours, resolve staffing and text tasks, show approval/publication still pending | Use a stated fictional local approval path; do not imply every opening-hours change requires a council decision |
| Reference 2 | Handwerk & technischer Service: office, dispatch and technicians | A provisional appointment and an assigned coordination task are mistaken for an accepted visit | A missing part changes a visit; verify material, obtain explicit acceptance and update the order before informing the customer | Extend existing Brunner Haustechnik AG identities; the trade application remains the order record |
| Follow-on candidate | Handel & Auftragsabwicklung: sales, purchasing, warehouse and service | A customer promise depends on information not yet confirmed | Resolve a delayed delivery and possible partial shipment; agree what may be promised | CRM/ERP and stock figures are authoritative; no automatic synchronisation |
| Provisional fourth | Ingenieurbüro: lead, specialist, reviewer and substitute | Completing a review is mistaken for authority to release or deliver | Review an internal deliverable; hand over coordination with release still pending | Show a document reference, not an unsupported Word review screen; define the fictional release arrangement |
| Fourth-place challenger | Industrie & Produktion: production, quality and maintenance | A recurring issue needs coordinated corrective action across shifts or functions | Test a non-safety-critical coordination story that adds something beyond an office task board | Require credible workplace detail and clear QMS/MES boundaries; do not dismiss frontline relevance because office examples render more easily |
| Separate research candidates | Treuhand and Beratung | Client work, internal review and substitutes may differ substantially | Research each context separately before choosing a story | These are not synonyms for engineering; no combined professional-services persona |
| Next candidate | Gesundheit & Soziales: administration, team leadership and operational services | Coordination across locations, people and changing availability | Organise onboarding, training or supplies | Start with operational work; clinical decisions and patient/client records stay in specialist systems |

Challenge omissions explicitly: construction and property/facility management, associations and NGOs, banking/insurance, hospitality, IT services and general professional services. Replace a proposed first-wave domain if a stronger combination of reach, distinctness and renderer fit exists. Existing business examples count as reuse opportunities, not as proof that an entire domain is already covered.

## Team type and domain are different dimensions

Test two discovery facets within the existing Team-Personas entrance:

- **Branche / Umfeld:** the organisational context, such as public administration, technical service, trade or manufacturing. University remains a collection/context.
- **Zusammenarbeit:** start with Dauerhaftes Team, Projektteam, Service- und Auftragsteam, Gremium / Arbeitsgruppe and Einzelarbeit mit Zusammenarbeit. Test this wording against Teamtyp. These useful discovery labels mix rhythm and structure; do not present them as a formally independent organisational taxonomy. Multiple tags may be appropriate.

HR, finance, IT, leadership and assistance are functions or roles that recur across domains. They should not all become separate industries. Larger-company departments should also be recognisable; do not equate business with microbusinesses alone.

Provisional data approach: optional controlled-ID `domains` and `teamPatterns` fields on catalogue groups, with scenario overrides only when needed. Retain stable IDs, existing routes and project compatibility. Adapt legacy library entries by reference rather than copying their scenes into a second catalogue. Preserve discovery of individual work, including the existing personal-work examples. Do not create a full industry × team-type × role × tool cross-product. Website, CLI, MCP and the assistant authoring pack should expose the same available examples and status. Discovery metadata alone does not justify a portable-project version change.

Before integrating the first business fixture, remove the catalogue factory's assumption that every project belongs to Hochschule Tannwil and its university audience/source note. Preserve the existing examples' generated metadata. Give each new source its actual access date and separate publication/data period rather than inheriting the current shared `2026-11-09` date. This is a bounded compatibility change, not a new framework.

Keep the three existing entrances: Team-Personas, Tools and Use Cases. Challenge the wording and usefulness of the proposed facets before changing navigation. A country variant should exist only where wording, work arrangements or a material boundary differs; two flags are not two personas.

## Research and selection

Compare 8–10 domain/team combinations, including the six above and credible counter-candidates. Assess:

1. Relevance to Switzerland and Germany, with company size and worker population made explicit.
2. Observable collaboration needs and trainer usefulness, separate from M365 market share.
3. Difference from existing examples and transferability across sectors.
4. A scenario that needs more than a meeting and a renamed task board.
5. Fit with the current public authoring contract and a realistic first implementation slice.

Use BFS/SECO, Destatis and other official statistics for economic structure; chambers, associations and credible workplace studies for working practices; actual organisational guidance for concrete arrangements; and current Microsoft primary documentation for product mechanisms. Vendor case studies may illustrate adoption but are not representative sector evidence.

For selected scenarios, record publisher, direct URL, publication/data period, access date, supported claim, limits and evidence type: statistical context, documented practice, vendor recommendation, product mechanism or fictional synthesis. Compare both countries at portfolio level. Do not generalise one Swiss federal configuration to municipalities, cantons or German administrations. State when a proposed group or workflow has only indirect evidence.

Do not fabricate sector coverage percentages, interview findings, ROI or a universal best-practice Teams structure. Any numerical prioritisation score needs stated criteria and should not imply statistical precision.

## Initial evidence and research leads

The following sources were inspected during the initial research on 2026-11-10. They support the stated context only; the concrete personas and M365 scenarios above remain proposals.

| Source | What it supports | Limit |
| --- | --- | --- |
| [BFS, Swiss SMEs 2024, published 05.11.2026](https://statistik.admin.ch/de/news/2026-0594) | More than 3.2 million people employed in Swiss SMEs; an SME lens is relevant | Market-economy scope; not a complete account of public administration or M365 adoption |
| [SECO, firms and employees](https://www.kmu.admin.ch/de/kmu-in-zahlen-firmen-und-beschaeftigte) | SMEs account for over 99% of Swiss market-economy companies and about two thirds of jobs | Page uses 2023 data; prefer newer BFS figures when making year-specific claims |
| [BFS, sector and company size, 2024](https://statistik.admin.ch/de/asset/36870321) | Manufacturing and trade each have over 400,000 employees in Swiss SMEs | Scale is context, not proof of a particular collaboration pattern |
| [BFS, employment by sector, 2025](https://statistik.admin.ch/de/asset/36463722) | Health/social services, manufacturing and trade are major Swiss employment sectors | Sector size does not establish tool access or suitability for every worker |
| [DIHK digitalisation survey 2026](https://www.dihk.de/de/newsroom/digitalisierung-2026-unternehmen-halten-kurs-163290) | Efficiency and quality motives; transformation requires time, money and changes to internal processes | Current page rechecked 10.11.2026; self-reported context, not a ranking of our training market. Publication/survey dates in the returned review remain separately attributed |
| [Bitkom Research, Handwerk 2025](https://bitkom-research.de/studien/handwerk-2025) | Survey of 504 German craft businesses documents digital quotations, invoicing and appointment services | Digital services are not proof of internal Teams/Planner use; German evidence |
| [EFK audit of M365, 21.10.2026](https://www.efk.admin.ch/prufung/sicherheit-und-nutzbarkeit-von-microsoft-365/) | Swiss federal rollout and the need for training and changed work practices | Restrictive federal configuration; no blanket feature or policy claim for other administrations |
| [KfW digitalisation research](https://www.kfw.de/%C3%9Cber-die-KfW/KfW-Research/Digitalisierung.html) | Company size, digital maturity and resources are relevant differences among SMEs | Use the linked study and its methodology for a specific claim, not the dossier heading alone |
| [Stadt Köln, Ratsinformationssystem](https://www.stadt-koeln.de/artikel/65600/index.html) | A concrete city publishes meeting material and public results/minutes through its council-information service | Rechecked 10.11.2026; evidence for that service, not for our fictional internal workflow or a universal municipal approval rule |

The returned review also supplies a [Bitkom publication](https://www.bitkom.org/Bitkom/Publikationen/Digitalisierung-des-Handwerks) with survey-method details and updated Destatis figures. Preserve these as reviewer-reported leads until directly checked for the intended claim. Its statement that full Destatis retrieval succeeded does not retroactively turn the initial search excerpts into our own verification. Do not copy exact statistics into catalogue entries from the review alone.

Extend German official sector evidence: [Destatis employment by economic sector](https://www.destatis.de/DE/Themen/Arbeit/Arbeitsmarkt/Erwerbstaetigkeit/Tabellen/arbeitnehmer-wirtschaftsbereiche.html). Initial search excerpts were available, but direct full retrieval returned 403. Verify data and definitions before using exact figures. Do not compare jobs, employed persons, full-time equivalents and enterprise counts as if they were the same denominator.

## Scenario design and product boundaries

For every selected group, define purpose, roles, illustrative core-group size, duration, rhythm, organisational boundaries, artefacts, friction, tool choices and one teaching question.

For every scenario, define the trigger, current friction, desired outcome, ordered steps with actor/tool/action/artefact, a plausible alternative setup, a realistic failure and facilitator notes. Keep people, tasks, documents and shared components consistent across views. Name the work in ordinary German with Swiss spelling; keep German/Swiss terminology adaptable.

Use the existing shared contract and renderers first. Keep any unsupported step in a clearly labelled conceptual workflow or presenter explanation. Showing a specialist system as an outside dependency is not a working integration or a new screenshot renderer. In particular:

- Ordinary collaboration does not automatically require a new Team, a Planner board, Loop or an automation.
- Decisions written in a note are distinct from a formal approval or authoritative case record.
- Meeting-note tasks use the generated linked Planner plan; they do not automatically populate an arbitrary existing board.
- Microsoft's [task-list guidance](https://support.microsoft.com/en-us/loop/manage-your-tasks-from-loop-task-lists-and-collaborative-notes-in-planner), rechecked 10.11.2026, says adding the first task creates a plan. These generated lightweight plans have no plan owner and any member can delete them. Distinguish the person accountable for follow-up from a product-level plan owner. Advanced task features are opened in Planner; do not imply every Planner field synchronises back into notes.
- To Do requires the relevant connection and account assumptions; Mein Tag is a deliberate personal selection.
- A shared Loop table is not a synchronised Planner task list. Distinguish components, pages/workspaces and collaborative meeting notes.
- Copying a link, assigning responsibility, opening a plan, publishing an approved file and entering a result into ERP/CRM/QMS are separate manual actions unless a specific integration is verified.
- Do not illustrate external/private/shared access as implemented permissions without the necessary model support and evidence. Keep prerequisites beside the affected step.

Preserve Szene and Prinzip, the house metaphor, local Fluent assets and labelled arrows for manual action, links and verified synchronisation. Each scenario needs an artefact and a decision the viewer can recognise at presentation size; small screenshot text should not carry the whole explanation.

The current contract permits exactly two complete snapshots, `before` and `after`, up to six slides, normally eight people, twelve tasks and eight documents. Workspace profiles allow sixteen people. Workflows have two–five steps; Teams chat has two speakers; portable Loop components are tables shown in Teams chat or Outlook. Choose one meaningful transition and reuse its IDs across views. Do not add a third state, group-chat screen or arbitrary Loop/Word page to make a storyboard appear supported.

## Two reference stories to build first

All names, dates and work arrangements below are fictional synthesis, not observed municipal or craft-business practice. Each five-slide storyboard fits the current profiles; neither needs a new Loop-table example simply to use another tool.

### 1. Neue Öffnungszeit: abgestimmt ist noch nicht veröffentlicht

Gemeinde Lindenried has a representative four-person core from Einwohnerdienste, counter coordination, communication and secretariat, within a six-person working group. Over four weeks it meets for twenty minutes weekly. A Thursday evening opening is proposed, while staffing, web text and internal instructions disagree.

| Moment | Existing profile / state | Visible teaching evidence |
| --- | --- | --- |
| Proposal | `teams-posts` | Anna marks the change as a proposal and links `Entwurf_Servicezeiten.docx`; no publication yet |
| Joint preparation | `meeting-notes` / `before` | Agenda, internal agreement to prepare, and named staffing/text tasks |
| Follow-up | `planner-task` / `after` | The same text-preparation task, assignee and checklist; completion means a draft is ready, not published |
| Next meeting | `meeting-notes` / `after` | Staffing checked and draft ready; formal approval/publication explicitly remain open |
| Transfer | `workflow` | Prepare → agree internally → record the required local approval → publish; manual steps except the separately evidenced notes/Planner task continuity |

Keep task IDs, assignees, dates and the note's linked plan consistent. The task uses the plan generated from these notes, not an unrelated department board. The illustrated change is preparation pending → preparation complete; it is not a third approval state. Personal speaking notes remain private. Resident cases stay outside the story. A shared document and an action list are a plausible simpler alternative.

Recognition question: can a viewer tell which work is finished and why the website still cannot be updated? Verify that prerequisite/authority wording fits the particular fictional municipality without implying a Swiss/German legal rule.

### 2. Termin verschoben: Wer übernimmt den Rest?

Reuse Brunner Haustechnik AG: Samuel Brand remains disposition, Elif Kaya remains customer service and Reto Furrer remains customer-service lead. Introduce a clearly fictional technician, Nina Graf, without renaming the existing company or identities. A four-person representative core coordinates a non-emergency visit within a seven-person service group. A part for job A-2048 is unavailable; Friday is only a proposal.

| Moment | Existing profile / state | Visible teaching evidence |
| --- | --- | --- |
| Uncertainty | `teams-chat` | Elif asks Samuel if Friday is confirmed; he identifies material and acceptance still open |
| Explicit request | `teams-posts` | Samuel names Nina and a reply deadline; assigning a task alone does not confirm the visit |
| Acceptance | `planner-task` / `after` | Same coordination task records material checked, Nina's explicit acceptance and service informed; customer notification waits for the order update |
| Shared follow-up | `planner` / `after` | Remaining order-update/customer-response tasks retain the same owners and references |
| Transfer | `workflow` | Check order → coordinate exception → confirm acceptance → update order → inform customer; all manual |

The two snapshots express acceptance pending → acceptance confirmed; unresolved remaining tasks stay unresolved. The trade application owns the appointment, customer address, prices and technical record. A desktop scene illustrates coordination, not a tested field/mobile experience. Prefer the existing dispatch system plus a call if it already provides adequate context and acknowledgement.

Recognition question: can a viewer identify who accepted the visit, who still needs to update the order and when a customer promise becomes justified?

### Research-only backlog after the reference pair

Keep all eight returned briefs as source material; their presence does not make them renderable examples.

| Context | Next brief | Distinct decision |
| --- | --- | --- |
| Administration | Ferienvertretung am Schalter | Access to files is not acceptance of responsibility; resident cases remain elsewhere |
| Technical service | Wiederkehrende Rückfrage wird zur geprüften Serviceanleitung | A helpful chat answer is not an approved instruction; document editing remains outside the current portable profiles |
| Trade, first candidate | Liefertermin offen: Noch nichts versprechen | Confirm supplier date and available quantity before updating ERP and informing the customer |
| Trade, second brief | Vertretung übernimmt eine offene Reklamationsklärung | Completing a clarification task does not issue a credit note |
| Engineering, first candidate | Prüfung erledigt ist noch keine Auslieferung | A document reference and completed review do not grant release authority |
| Engineering, second brief | Projektübergabe vor zwei Wochen Abwesenheit | Folder access does not transfer coordination responsibility |

Together with the two reference stories this is eight researched story hypotheses. Engineering's fourth-place recommendation remains provisional until compared with a concrete manufacturing alternative. Practitioner recognition, distinctness from existing reviews and frontline inclusion matter more than easy rendering.

## Proposed implementation slices

1. **Review disposition and bounded selection.** Preserve the returned review, verify consequential code/product claims and document adopted, qualified and unresolved recommendations. The first pair is administration and service; four immediate builds are not the target. This slice updates documents only.
2. **Two complete reference projects.** Build the two storyboards above using existing profiles. Parameterise catalogue organisation/audience/source wording and per-source dates before adding business entries. Preserve old fixture output and identities. Render and inspect all slides, persona cards and workflow strips before expanding discovery.
3. **Recognition and transfer review.** Seek a trainer and a relevant practitioner for each story, covering Switzerland and Germany across the pair where feasible. Ask them to explain the decision, remaining work and simpler alternative. This is formative feedback, not a representative market study. If participants are unavailable, complete reviewable artefacts and report validation pending; do not invent interviews or turn the request into an automatic approval requirement.
4. **Minimal discovery integration.** Add only the metadata justified by the reference pair through the existing website catalogue, CLI and MCP. Preserve university and individual-work discovery and old links; inspect 390 px, result counts, reset and empty states. Integrate with the existing library by reference, not copied examples.
5. **Conditional follow-on portfolio.** Use the evidence from the pair to decide whether trade and engineering, or a stronger manufacturing alternative, should be built next. Each needs a distinct decision and a second researched brief. Record the fourth-place trade-off; four delivered examples remain an optional later outcome, not first-slice acceptance.
6. **Visual and technical handoff.** Add meaningful identity/reference/compatibility checks and run the required repository checks when implementation starts. Inspect actual exports, preserve offline assets and existing zoom journeys. Report automated tests, visual inspection, practitioner feedback, assistant-host checks, live-tenant verification and accessibility evidence separately.

No framework/backend migration, live CRM/ERP integration, general industry simulation, new hosted service, AI backend or editable PowerPoint work is needed for this content expansion. If one bounded renderer gap is essential, justify it against a useful example using current capabilities before expanding the schema.

## Acceptance for the first implemented slice

- Two additional, distinct non-university reference groups: administration and technical service. Trade and the fourth-place choice remain follow-on candidates.
- Source-backed scenario briefs with clear fictional synthesis and material country/context differences.
- One complete renderable example for each reference group, with the same task/person/document IDs across views and no unsupported states. Additional briefs honestly marked as research.
- Minimal domain and collaboration discovery usable through the existing entrances and shared agent operations; individual work remains findable.
- Existing projects, catalogue entries, identities and links remain valid; no independent per-interface content copies.
- Actual exports inspected for clarity, fit and misleading transitions. Document automated tests, manual visual review, assistant-host evidence and live-tenant verification separately.
- A reviewer can explain what each new example adds beyond existing Marketing, customer-service onboarding and university stories. Capture practitioner recognition if available; label it pending otherwise.

## Follow-up research questions

The initial sparring is complete. Next, test whether engineering beats a credible non-safety-critical manufacturing coordination story once existing-content overlap and frontline relevance are considered. Find direct Swiss and German workplace evidence for the proposed reference stories; present current indirect evidence honestly. Which workers are we missing through device, licence, language or schedule assumptions?

Test whether Branche and Zusammenarbeit help people find relevant examples without duplication. Compare the labels against Teamtyp, including individual work. Identify what can be reused from the existing business examples and what would be merely cosmetic renaming.

The [original Perplexity prompt](research/PERPLEXITY-BUSINESS-DOMAINS-CH-DE-SPARRING.md) and its returned review are historical inputs to this revision. Use the current plan and review decisions for subsequent implementation preparation.
