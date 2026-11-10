# Business domains and working patterns for Switzerland and Germany

Date: 2026-11-10. Status: proposed research and implementation plan for external sparring. The user agreed the broader direction; domain order, taxonomy and slice sizes remain open to challenge. This document does not implement new examples or authorise a merge or deployment.

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

These are candidate teaching contexts. Groups, sizes, roles and scenarios will be fictional synthesis. The first four are the current proposal, not a quota that evidence must justify after the fact.

| Proposed wave | Domain and recognisable group | Collaboration problem | First scenario hypothesis | Important distinction |
| --- | --- | --- | --- | --- |
| First | Gemeinde- / Stadtverwaltung: department head, administrative staff and secretariat | Decisions and responsibilities cross organisational units; absence cover needs context | Prepare a proposal, discuss it, record the decision and review assigned actions | Internal coordination is different from the authoritative case record, formal approval and public publication |
| First | Handwerk & technischer Service: office, dispatch and technicians | Office and field staff need the same current assignment and a clear handover | An appointment changes; agree who checks materials, contacts the customer and takes over unfinished work | Extend existing Brunner content; the trade application remains the order record |
| First | Handel & Auftragsabwicklung: sales, purchasing, warehouse and service | A customer promise depends on several teams and external information | Resolve a delayed delivery, assign clarification work and agree a consistent customer response | CRM/ERP and stock figures are authoritative; do not invent automatic synchronisation |
| First | Industrie & Produktion: production, quality and maintenance | A recurring issue needs coordinated corrective action across shifts or functions | Review a quality issue, assign a corrective measure and check its completion | Distinguish collaboration tasks from QMS/MES records, work orders and technical safety procedures |
| Next candidate | Treuhand, Beratung & Ingenieurbüro: lead, specialists and assistant | Shared deliverables, deadlines, review and substitutes | Complete an internal deliverable review and hand over the next deadline | Client records, external access and professional obligations need explicit boundaries |
| Next candidate | Gesundheit & Soziales: administration, team leadership and operational services | Coordination across locations, people and changing availability | Organise onboarding, training or supplies | Start with operational work; clinical decisions and patient/client records stay in specialist systems |

Challenge omissions explicitly: construction and property/facility management, associations and NGOs, banking/insurance, hospitality, IT services and general professional services. Replace a proposed first-wave domain if a stronger combination of reach, distinctness and renderer fit exists. Existing business examples count as reuse opportunities, not as proof that an entire domain is already covered.

## Team type and domain are different dimensions

Test two independent facets within the existing Team-Personas entrance:

- **Branche / Umfeld:** the organisational context, such as public administration, technical service, trade or manufacturing. University remains a collection/context.
- **Teamtyp / Arbeitsweise:** a stable department, cross-functional project, customer/order team, operational/service team, recurring decision group or individual work with occasional collaboration.

HR, finance, IT, leadership and assistance are functions or roles that recur across domains. They should not all become separate industries. Larger-company departments should also be recognisable; do not equate business with microbusinesses alone.

Provisional data approach: add only the metadata needed for discovery to the shared catalogue, retain stable IDs and preserve existing routes and project compatibility. Let one scenario have appropriate tags without producing a separate copy for every combination. Do not create a full industry × team-type × role × tool cross-product or a new parallel catalogue. Website, CLI, MCP and the assistant authoring pack should expose the same available examples and status. Decide from code inspection whether optional catalogue fields are sufficient; do not presume a project-version change is necessary.

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
| [DIHK digitalisation survey 2025](https://www.dihk.de/de/newsroom/digitalisierung-2025-herausforderungen-und-fortschritte-fuer-unternehmen-157712) | Efficiency, cost and quality are prominent motives; time and complexity are barriers | Self-reported survey; does not rank the best domains for our product |
| [Bitkom Research, Handwerk 2025](https://bitkom-research.de/studien/handwerk-2025) | Survey of 504 German craft businesses documents digital quotations, invoicing and appointment services | Digital services are not proof of internal Teams/Planner use; German evidence |
| [EFK audit of M365, 21.10.2026](https://www.efk.admin.ch/prufung/sicherheit-und-nutzbarkeit-von-microsoft-365/) | Swiss federal rollout and the need for training and changed work practices | Restrictive federal configuration; no blanket feature or policy claim for other administrations |
| [KfW digitalisation research](https://www.kfw.de/%C3%9Cber-die-KfW/KfW-Research/Digitalisierung.html) | Company size, digital maturity and resources are relevant differences among SMEs | Use the linked study and its methodology for a specific claim, not the dossier heading alone |

Extend German official sector evidence: [Destatis employment by economic sector](https://www.destatis.de/DE/Themen/Arbeit/Arbeitsmarkt/Erwerbstaetigkeit/Tabellen/arbeitnehmer-wirtschaftsbereiche.html). Initial search excerpts were available, but direct full retrieval returned 403. Verify data and definitions before using exact figures. Do not compare jobs, employed persons, full-time equivalents and enterprise counts as if they were the same denominator.

## Scenario design and product boundaries

For every selected group, define purpose, roles, illustrative core-group size, duration, rhythm, organisational boundaries, artefacts, friction, tool choices and one teaching question.

For every scenario, define the trigger, current friction, desired outcome, ordered steps with actor/tool/action/artefact, a plausible alternative setup, a realistic failure and facilitator notes. Keep people, tasks, documents and shared components consistent across views. Name the work in ordinary German with Swiss spelling; keep German/Swiss terminology adaptable.

Use the existing shared contract and renderers first. Keep any unsupported step in a clearly labelled conceptual workflow or presenter explanation. Showing a specialist system as an outside dependency is not a working integration or a new screenshot renderer. In particular:

- Ordinary collaboration does not automatically require a new Team, a Planner board, Loop or an automation.
- Decisions written in a note are distinct from a formal approval or authoritative case record.
- Meeting-note tasks use the generated linked Planner plan; they do not automatically populate an arbitrary existing board.
- To Do requires the relevant connection and account assumptions; Mein Tag is a deliberate personal selection.
- A shared Loop table is not a synchronised Planner task list. Distinguish components, pages/workspaces and collaborative meeting notes.
- Copying a link, assigning responsibility, opening a plan, publishing an approved file and entering a result into ERP/CRM/QMS are separate manual actions unless a specific integration is verified.
- Do not illustrate external/private/shared access as implemented permissions without the necessary model support and evidence. Keep prerequisites beside the affected step.

Preserve Szene and Prinzip, the house metaphor, local Fluent assets and labelled arrows for manual action, links and verified synchronisation. Each scenario needs an artefact and a decision the viewer can recognise at presentation size; small screenshot text should not carry the whole explanation.

## Proposed implementation slices

1. **Selection and dispositions.** Research the candidate matrix, inspect existing content and reconcile Perplexity findings. Record keep/change/reject decisions and choose the first four groups. This is the work now being prepared; no new domain examples are built by this plan.
2. **One general discovery path.** Add minimal domain/team-type metadata and expose it through the existing website catalogue, CLI and MCP. Preserve university discovery and old links. Review a narrow-screen prototype before extending the entire taxonomy.
3. **Two complete reference stories.** Build one internal administration decision/follow-up story and one office–field service handover, unless the research changes the selection. Show different rhythms and boundaries, not just different company names. Reuse meeting/Loop features only where the work calls for them.
4. **Complete the first-wave portfolio.** Target one fully renderable example per selected group, provisionally four examples total, with a second researched scenario brief per group. The count can change if the evidence or visual review argues for fewer, stronger examples. Do not count the existing university examples as new business delivery.
5. **Visual and technical review.** Inspect actual PNGs, persona cards and workflow strips. Add meaningful identity/reference regressions and verify the combined catalogue through website, CLI and MCP. Run required repository checks, preserve offline assets, test 390 px and the existing zoom journeys, and record exact evidence and remaining gaps.

No framework/backend migration, live CRM/ERP integration, general industry simulation, new hosted service, AI backend or editable PowerPoint work is needed for this content expansion. If one bounded renderer gap is essential, justify it against a useful example using current capabilities before expanding the schema.

## Acceptance for the first implemented portfolio

- Four additional, distinct non-university groups, or a documented replacement portfolio supported by the research.
- Source-backed scenario briefs with clear fictional synthesis and material country/context differences.
- At least one complete renderable example per selected group; additional briefs honestly marked as research.
- Domain and working pattern discovery usable through the existing entrances and shared agent operations.
- Existing projects, catalogue entries, identities and links remain valid; no independent per-interface content copies.
- Actual exports inspected for clarity, fit and misleading transitions. Document automated tests, manual visual review, assistant-host evidence and live-tenant verification separately.
- A reviewer can explain what each new example adds beyond existing Marketing, customer-service onboarding and university stories.

## Questions for Perplexity

Challenge whether the proposed first four really offer the best combination of relevance and achievable teaching value for Switzerland and Germany. Should professional services or health administration enter the first wave instead? What audience are we missing if we prioritise office workers, or if we over-index on the largest employment sectors?

Test whether Branche and Teamtyp are understandable, independent facets that the current catalogue can support without duplication. Identify what can be reused from the existing business examples and what would be merely cosmetic renaming. Propose a smaller first slice if the plan is too broad, with evidence and explicit trade-offs.

Use the companion [Perplexity sparring prompt](research/PERPLEXITY-BUSINESS-DOMAINS-CH-DE-SPARRING.md). The desired result is a critical decision memo and implementation-ready scenario briefs, not application code or an endorsement of this plan.
