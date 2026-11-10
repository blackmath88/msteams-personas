## 1. Verdict: keep the expansion, change the portfolio, reject the four-domain build commitment

Keep the move beyond higher education, the existing three entrances, and the distinction between collaboration and authoritative business records.

Change the first-four portfolio to:

1. Gemeinde-/Stadtverwaltung — internal cross-department service coordination.
2. Handwerk & technischer Service — office–field exception handover.
3. Handel & Auftragsabwicklung — cross-functional delivery exception.
4. Ingenieurbüro — internal deliverable review and absence cover.

Defer Industrie & Produktion rather than reject it. Its economic importance is clear; the case for your current visual product is weaker. A convincing production example needs more than an office task board with manufacturing vocabulary. Replace it initially with a narrowly defined engineering-office team—not the heterogeneous bundle “Treuhand/Beratung/Ingenieurbüro”.

Reject the assumption that four selected groups should immediately become four complete examples. Build two reference stories first, validate recognition and transfer, then release the other two.

This is a product recommendation under incomplete workplace evidence, not an empirically established ranking of M365 training markets. The strongest evidence supports economic relevance, constraints on digital adoption, and Microsoft mechanisms—not demand for these particular training assets. German workplace evidence explicitly points to time and complexity as barriers, favouring a smaller, reusable release rather than more tool-rich stories. [dihk](https://www.dihk.de/de/newsroom/digitalisierung-2026-unternehmen-halten-kurs-163290)

## 2. What I inspected—and what I could not establish

### Revision and repository scope

I inspected the planning branch at:

`f937a71055c85cb3d3fb7033c8fd8ba6222365d2`

Its parent implementation baseline is the merged PR #14 revision:

`9a017f59ac7a9792f797d9195c98f6646960066a`

A separate check of `main` returned that same implementation revision; it had not advanced at inspection.

I read both requested documents, `AGENTS.md`, `README.md`, the recent `PERSONA-SCENARIO-HANDOFF.md`, and the returned source for:

- `src/library.js`
- `src/scenes-v3.js`
- `src/research-catalogue.js`
- `src/project-core.js`
- `src/collaboration-core.js`

The GitHub connector returned truncated content for `project-core.js` and `research-catalogue.js`. Consequently, I inspected their capability declarations, significant validation logic, catalogue records and the beginning of project generation—not every compiler/export branch.

The public repository URL failed through the web fetcher; authenticated GitHub reading worked. I did not execute the application, inspect the actual PNG gallery, run tests, or enter a Microsoft tenant. The handoff’s visual review and test results are builder-reported evidence, not tests I independently repeated. I did not read all the pre-build documents listed in `AGENTS.md`; this is a research assessment, not a build-readiness audit.

### Capability findings that affect the recommendation

The inspected code supports a substantially stronger baseline than “Teams screenshot generator”:

| Implemented contract | Consequence for this expansion |
|---|---|
| Portable project v1, capability 6 | No project-version change is justified for discovery metadata alone. |
| `teams-posts`, two-person `teams-chat`, `planner`, `planner-task`, `todo`, `prinzip-tasks` | Strong support for ownership, handover, shared/personal boundaries and explicit task detail. |
| `meeting-notes`, `loop-component`, `workflow` | Connected meeting and shared-component stories already exist; they are not new domain differentiators. |
| Six slides; normally eight people, twelve tasks, eight documents | Show a representative core group, not an entire organisation. |
| Exactly `before` and `after` task/component snapshots | Do not design a three-state unfinished → reassigned → completed narrative without choosing which transition to illustrate. |
| Workflow: two–five steps | A six-slide story can include a five-step conceptual summary, but not an unlimited process diagram. |
| Loop component: table, Teams chat or Outlook surface | Not arbitrary Loop pages, workspaces or a synchronised Planner table. |
| `accessConfirmed` and explicit To Do assumptions | These express prerequisites; they do not implement or prove permissions. |

A critical qualification: the curated library includes Outlook, file and other surfaces that are not automatically available as arbitrary portable-project profiles. The engineering story below therefore shows a document reference and review task—not an invented Word review renderer.

### Existing-content duplication is the main product risk

The existing library already covers:

- A cross-functional customer-portal project.
- Brunner customer-service onboarding.
- A workshop handover template.
- Recurring committee work.
- Meeting notes → linked plan → personal execution → review.
- Shared Loop content across Outlook and Teams.
- Submission deadlines, event handover, resource review and publication.

Therefore, “another meeting with tasks” adds little. Each new example needs a different decision:

- Administration: “Is this an internal agreement or an authoritative decision?”
- Technical service: “Who has actually accepted the changed assignment?”
- Trade: “What can we promise before the authoritative delivery date is confirmed?”
- Engineering: “What evidence allows a substitute to continue—and who authorises release?”

## 3. Evidence and comparison matrix

### Economic scale is not addressable training demand

Swiss SMEs accounted for 99.7% of market-economy companies and 65.9% of employment in that scope in 2024. That supports including SMEs, but not treating all business users as microbusiness employees. It also does not describe the whole public sector. [statistik.admin](https://statistik.admin.ch/de/asset/36870356)

For Switzerland in 2025, health/social services represented 15.1% of employed people, manufacturing/mining 12.2%, and trade/motor-vehicle repair 11.1%. Those figures establish scale, not desk access, M365 licensing or demand for Planner training. [statistik.admin](https://statistik.admin.ch/de/asset/36463722)

The updated German annual table reports 7.262 million employed people in manufacturing in 2025, 2.579 million in construction and 6.196 million in business services. Its “trade, transport and hospitality” aggregate cannot be presented as trade alone; likewise its broad public/private-service aggregate is not municipal administration. [destatis](https://www.destatis.de/DE/Themen/Arbeit/Arbeitsmarkt/Erwerbstaetigkeit/Tabellen/arbeitnehmer-wirtschaftsbereiche.html)

### Candidate assessment

These are qualitative selection judgements, not numerical market scores.

“Fit” means fit with the inspected portable profiles. “Confidence” concerns the proposed scenario’s suitability, not confidence that the sector exists. Workplace evidence is indirect unless explicitly stated.

| Candidate domain / team | Swiss relevance | German relevance | Worker/company context and practical evidence | Existing overlap | Teaching value / renderer fit | Confidence |
|---|---|---|---|---|---|---|
| Municipality / internal service-coordination group | Recognisable public-service context; federal M365 audit demonstrates adoption work, not municipal configuration | Recognisable administrative setting; formal council records demonstrably have their own systems | Office-based core spanning departments; local M365 practice remains unverified | High: committee and weekly meeting | Strong if about coordination versus formal record; high fit | Medium |
| Technical service / dispatch–field exception team | Relevant SME context; no Swiss sector-specific Teams evidence established | Craft survey documents smartphones, email, messengers and digital-service activity | Office plus mobile workers; device access and duplicate entry are decisive | High: Brunner onboarding and workshop handover | High only if changed assignment and acceptance are central; high desktop-illustration fit | Medium |
| Wholesale/trade / delivery-exception group | Trade is a major employment category | Large trade-containing aggregate; not a clean measure of this team population | Sales, buying, warehouse, service; exact workflow is synthesis | Medium: customer portal | Distinct information uncertainty and customer promise; high fit | Medium–low |
| Engineering office / internal deliverable-review team | Fits professional/technical-services context; exact demand unmeasured | Business services substantial but broader than engineering | Desk-based specialists with shared deliverable and substitute | High: grant and resource review | Strong review/release distinction; high fit if document editing remains outside screenshot sequence | Medium–low |
| Manufacturing / quality-improvement group | Major employment sector | Major employment sector | Production, quality, maintenance; shop-floor access and authoritative records unresolved | Medium: recurring service operations | Potentially very high; only medium current fit without QMS/MES or shift-specific evidence | Low–medium |
| Health/social care / operational-support team | Largest Swiss employment category | Broad public/service employment context; not isolated here | Operational staff, administrators and location leads; avoid clinical work | High: onboarding and campus service | Good administration scenario, weak distinctness; high fit for non-clinical work only | Low–medium |
| Construction/facilities / internal defect-coordination team | Recognisable office–site pattern; exact reach not measured | Construction large; craft evidence includes construction subset | Site staff, project office, facilities; specialist platforms may dominate | High: technical service and handover | Good record-versus-action distinction; medium fit, especially for site/mobile work | Medium–low |
| Associations/NGOs / committee and event team | Recognisable but no quantified local demand established | Recognisable; no candidate-specific demand established | Small office plus volunteers, often irregular access | Very high: committee and conference | Useful simple-tool counterexample; high fit | Low–medium |
| Finance/insurance / internal change team | Plausible office audience; no adoption-demand evidence established here | Distinct official sector, 1.093 million employed people in 2025 | Office teams; internal change avoids transaction systems | Very high: customer-portal project | Easy to render, little new teaching value | Low–medium |
| Hospitality / location operations team | Irregular schedules and on-call work matter | Included in broad trade/transport/hospitality aggregate | Frontline, shift-based, variable device access | Medium: service and onboarding | Strong potential, but scheduling/mobile surfaces are a gap; medium–low fit | Low |

Economic context: BFS and Destatis. Craft practice: Bitkom’s 504-business German survey. Administrative boundary: EFK’s federal audit and Cologne’s actual council-information service. None establishes representative sector-wide Teams/Planner use. [statistik.admin](https://statistik.admin.ch/de/asset/36870356)

IT services is another plausible alternative, but it would mostly reproduce the existing cross-functional portal project or require showing ticket/change-management systems you do not render. It should be a later vocabulary adaptation, not a first-wave flagship.

## 4. Ranked first four—and their conditions

### 1. Municipality: internal service coordination, not “digital council”

This provides recognisability outside commerce and teaches a consequential boundary. Keep the first story about a public-facing service change, not a sensitive individual case or formal political decision.

There is a real Swiss adoption signal: the EFK says additional federal M365 functions require changed working practices, continuous training and clear instructions. However, federal configuration is not evidence of municipal feature availability. [efk.admin](https://www.efk.admin.ch/prufung/sicherheit-und-nutzbarkeit-von-microsoft-365/)

For Germany, the concrete evidence here is the separate council-information system, not a verified municipal Teams rollout. Cologne publishes agendas, proposals, results and minutes through its Ratsinformationssystem. That makes the “collaboration is not the authoritative record” distinction defensible. [stadt-koeln](https://www.stadt-koeln.de/artikel/65600/index.html)

### 2. Technical service: changed assignment across office and field

Keep it because it broadens the worker reality—not because “handwork is digital”.

The German survey documents universal smartphone/email use among respondents, substantial messenger use and uneven digital capability. It does not establish Teams use. Your story must work without pretending that every technician spends the day in Planner. [bitkom](https://www.bitkom.org/Presse/Presseinformation/Handwerk-Azubis-Betriebe-Digitalisierung)

This selection is conditional on a technician and dispatcher recognising the handover. Otherwise, it is merely the existing workshop example with a van.

### 3. Trade: uncertain information before a customer promise

Keep a narrowly defined wholesale/order-exception team. Do not claim to cover retail shop-floor work.

Its distinctive object is a provisional promise whose prerequisites are incomplete. The lesson is not “put orders in Planner”; it is “coordinate the exception without creating a shadow order system”.

The economic justification is strong; the candidate-specific workplace evidence remains indirect. [statistik.admin](https://statistik.admin.ch/de/asset/36463722)

### 4. Engineering office: internal review and substitute

Add this as a credible desk-based anchor, but acknowledge its duplication risk. The new value must be review scope, release authority and continuity—not a renamed grant deadline.

Do not launch “Treuhand/Beratung/Ingenieurbüro” as one persona. A payroll deadline, consulting presentation and engineering deliverable have materially different records and review risks.

### Why the others wait

- Manufacturing: strong next challenger, but require a production/quality interview before choosing its first story.
- Health/social services: economic importance alone cannot justify another generic onboarding example.
- Construction/facilities: overlaps the selected service handover; external access and site tools complicate the first slice.
- Associations: highly renderable, but largely duplicates committee/event content.
- Finance and IT: familiar M365 audiences, weak incremental distinctness.
- Hospitality: meaningful reach beyond desks, but current surfaces risk office-centring its work.

### Strongest counterargument to this recommendation

Replacing manufacturing with engineering may optimise for your renderer rather than everyday relevance. It privileges people already comfortable with documents, meetings and individual computers, while excluding production workers whose collaboration differs most from higher education.

Furthermore, engineering review closely resembles the existing grant/resource stories. A well-researched manufacturing improvement team could add more genuine difference than engineering.

Accordingly, the fourth place should remain contestable: promote manufacturing if human validation produces a distinctive, non-safety-critical coordination story that does not duplicate QMS/MES work.

## 5. Product rules for all eight briefs

All organisations, people, group sizes, rhythms, dialogue and detailed sequences below are fictional synthesis. They are design proposals, not documented implementations.

Apply these rules beside the affected visual—not only in a final disclaimer:

1. Meeting-note tasks create a linked Planner plan after the first task is added. They do not automatically enter an arbitrary existing departmental board. Microsoft also notes that these lightweight plans lack a plan owner and any member can delete them. [support.microsoft](https://support.microsoft.com/en-us/loop/manage-your-tasks-from-loop-task-lists-and-collaborative-notes-in-planner)
2. Planner assignments appear in To Do with the relevant licence, smart list and Planner connection. Adding an assignment to “Mein Tag” is a separate personal action. [support.microsoft](https://support.microsoft.com/en-us/planner/see-planner-tasks-in-microsoft-to-do)
3. A Loop table is shared content, not a synchronised Planner task list. Copying its link into another supported surface is deliberate; subsequent edits concern the same component. [support.microsoft](https://support.microsoft.com/en-us/loop/manage-your-tasks-from-loop-task-lists-and-collaborative-notes-in-planner)
4. Meeting notes exclude external attendees; indirect invitees can have limited access. Use directly invited internal people in the illustrated meeting story. [support.microsoft](https://support.microsoft.com/en-us/teams/meetings/take-meeting-notes-in-microsoft-teams)
5. Loop availability depends on licensing, policy, network and cloud environment. Current Learn guidance distinguishes component licensing from workspace licensing; Exchange Online is required for full functionality, including mentions and workspace sharing. Do not turn that into a universal claim that every component action requires the same prerequisites. [learn.microsoft](https://learn.microsoft.com/en-us/microsoft-365/loop/loop-requirements?view=o365-worldwide)
6. No CRM, ERP, QMS, dispatch or document-management integration is established here. All transitions to those systems are manual, conceptual steps.

## 6. Scenario briefs

### Group 1: “Servicekoordination Gemeinde Lindenried”

#### A. Fully developed: “Neue Öffnungszeit: abgestimmt ist noch nicht veröffentlicht”

Purpose and rhythm: six-person internal group; four representative people; weekly 20-minute coordination during a four-week service change.

Roles:

- Anna Frei — Leitung Einwohnerdienste.
- Cem Yilmaz — Schalterkoordination.
- Lea Roth — Kommunikation.
- Martin Keller — Verwaltungssekretariat.

Trigger: the office proposes a changed Thursday opening time. Website text, staffing and the internal instruction do not yet agree.

Artefacts: `Entwurf_Servicezeiten.docx`, shared meeting notes, two follow-up tasks, and an authoritative record outside the illustrated M365 views.

Personal/shared boundary: staffing preparation and publication responsibility are shared; Anna’s personal speaking notes remain private. No resident records appear.

| Moment | Fictional scene copy | Profile / implementation boundary |
|---|---|---|
| 1. Define the unresolved issue | Anna: “Die neue Öffnungszeit ist ein Vorschlag. Bitte noch nicht veröffentlichen.” Document reference attached. | `teams-posts` |
| 2. Agree internal next steps | Agenda: “Besetzung und Kommunikation klären.” Decision: “Wir bereiten Donnerstag bis 18 Uhr vor.” Tasks assigned to Cem and Lea with dates. | `meeting-notes`, `before`; linked notes plan, not existing board |
| 3. Inspect responsibility | Task: “Website-Text zur Prüfung vorbereiten”. Note: “Nicht veröffentlichen. Freigabeweg gemäss interner Vorgabe.” | `planner-task`, same task ID |
| 4. Review completed preparation | “Besetzung geprüft. Textentwurf bereit. Formale Freigabe noch offen.” | `meeting-notes`, `after`; intentionally reopen previous notes |
| 5. Separate the formal steps | “Vorbereiten → intern abstimmen → formalen Entscheid dokumentieren → freigegebenen Text veröffentlichen.” | `workflow`; four steps, all manual/link; external record is conceptual |

Manual handovers: attach/link the draft; enter tasks; reopen notes; place the authorised outcome in the applicable records system; publish separately.

Failure: Lea treats the meeting note as publication permission.

Trainer questions:

- “Was ist hier abgestimmt, und was ist bereits verbindlich?”
- “Wo muss die Vertretung den formalen Entscheid finden?”

Simpler alternative: one shared document with a short responsibility list in an existing team; no Planner if two actions are easily reviewed there.

Distinctness: not another committee meeting, but preparation, authority and publication deliberately separated.

Country adaptation: do not merely change a flag. For a German municipality, identify the actual DMS/Ratsinformationssystem and local decision/publication route; for a Swiss municipality, identify its own governing body, records practice and approved M365 scope. Neither Cologne nor the federal audit settles another municipality’s arrangements. [efk.admin](https://www.efk.admin.ch/prufung/sicherheit-und-nutzbarkeit-von-microsoft-365/)

#### B. Research-only: “Ferienvertretung am Schalter”

- Group/rhythm: four-person service core; one handover before a two-week absence.
- Trigger/friction: substitute can find instructions but not unresolved coordination.
- Artefacts: current service guide, three open actions, absence-cover note.
- Boundary: personal reminders stay private; individual resident cases stay in the case system.
- Four moments: `teams-posts` handover → `planner` open responsibilities → `planner-task` accepted action → `workflow` case-system boundary.
- Manual transition: reassign and explicitly acknowledge ownership; no inheritance from an absence setting.
- Failure: colleague assumes being mentioned means ownership changed.
- Alternative: shared handover document and calendar cover.
- Trainer question: “Woran erkennt die Vertretung, dass sie wirklich übernommen hat?”

### Group 2: “Brunner Servicetechnik: Büro und Aussendienst”

#### A. Fully developed: “Termin verschoben: Wer übernimmt den Rest?”

Purpose and rhythm: seven-person service unit; four representative people; daily dispatch and exception-based handovers. This is a non-emergency job, not emergency dispatch.

Reuse existing identities:

- Samuel Brand — Disposition.
- Elif Kaya — Kundendienst.
- Reto Furrer — Teamleitung.
- New stable identity: Nina Graf — Servicetechnikerin.

Trigger: a planned service visit moves because a required part is unavailable.

Artefacts: fictional order reference `A-2048`, handover note, coordination task, material-confirmation checklist. Customer address, pricing and technical record remain outside.

| Moment | Fictional scene copy | Profile / implementation boundary |
|---|---|---|
| 1. Show the incomplete promise | Elif: “Ist Freitag bestätigt?” Samuel: “Noch nicht. Material und Übernahme sind offen.” | `teams-chat`; exactly two speakers |
| 2. Make the shared status explicit | Samuel: “A-2048: Freitag ist vorgemerkt, nicht bestätigt. Nina prüft die Übernahme bis 14 Uhr.” | `teams-posts` |
| 3. Confirm the accepted coordination | Task: “Übernahme A-2048 bestätigen”. Checklist: “Materialstatus geprüft”; “Nina bestätigt”; “Kundendienst informiert”. | `planner-task`; `after` shows accepted ownership |
| 4. See remaining dependencies | Buckets: “Zu klären”, “Bestätigt”. Separate task: “Termin im Fachsystem nachführen”. | `planner`, same `after` snapshot |
| 5. Explain where the job actually lives | “Auftrag prüfen → Ausnahme abstimmen → Übernahme bestätigen → Auftrag nachführen → Kundschaft informieren.” | `workflow`; five manual/link steps |

Personal/shared boundary: Nina’s private preparation reminder stays personal. Work that another person depends on is shared. Do not expose a whole personal list to dispatch.

Manual handovers: Samuel creates the coordination task; Nina confirms acceptance; an authorised person updates the dispatch/order system; Elif contacts the customer. Planner completion alone changes no appointment.

Failure: the team sees the accepted coordination task and assumes the customer appointment is already confirmed.

Trainer questions:

- “Was hat Nina übernommen: die Abstimmung oder den verbindlichen Auftrag?”
- “Welche Information darf nur im Fachsystem geändert werden?”

Simpler alternative: dispatch application plus a direct call and a documented handover there. If that already solves the problem, adding Planner is counterproductive.

Renderer limitation: desktop training mock-ups do not establish a usable technician mobile experience, offline access or dispatch functionality.

Distinctness: extends Brunner from onboarding into office–field operational dependency. If trainers cannot see that difference, reuse the workshop example instead of adding another entry.

Country adaptation: the German craft survey supports the need to account for mixed communication channels and digital capability. It does not justify copying the same access assumptions into Switzerland. Validate devices, licences and field connectivity separately in each country. [bitkom](https://www.bitkom.org/Presse/Presseinformation/Handwerk-Azubis-Betriebe-Digitalisierung)

#### B. Research-only: “Wiederkehrende Rückfrage wird zur Arbeitsanweisung”

- Group/rhythm: same core; weekly ten-minute knowledge review.
- Trigger/friction: technicians repeatedly ask about the same non-safety-critical administrative step.
- Artefacts: approved service-guide section, review task, published link.
- Boundary: no invented technical repair or safety instruction.
- Four moments: `teams-posts` recurring question → `planner-task` review → `teams-posts` approved guide link → `workflow` publication.
- Manual transition: someone edits and approves the document outside the depicted profiles.
- Failure: an unreviewed chat answer becomes the apparent instruction.
- Alternative: update the guide directly; no task board.
- Trainer question: “Wer darf aus einer Antwort eine gültige Arbeitsanweisung machen?”

### Group 3: “Handelshaus Aare: Lieferausnahmen”

#### A. Fully developed: “Liefertermin offen: Noch nichts versprechen”

Purpose and rhythm: six-person exception group inside a larger trading company; four representative people; asynchronous work plus a ten-minute daily check during the exception.

Roles:

- Sara Meier — Verkauf Innendienst.
- Jonas Beck — Einkauf.
- Mila Graf — Lagerkoordination.
- David Roth — Kundenservice.

Trigger: a supplier delays one order line; sales has already discussed a Friday delivery.

Artefacts: order reference `B-731`, exception note, three clarification tasks, customer-response draft. ERP remains authoritative for stock, order and confirmed date.

| Moment | Fictional scene copy | Profile / implementation boundary |
|---|---|---|
| 1. Prevent an unsupported promise | Sara: “B-731: Freitag ist nicht bestätigt. Bitte keine neue Zusage, bevor Einkauf und Lager geprüft haben.” | `teams-posts` |
| 2. Separate the dependencies | “Lieferantentermin klären” — Jonas; “Teilmenge prüfen” — Mila; “Kundenantwort vorbereiten” — David. | `planner`, `before` |
| 3. Inspect what confirmation requires | Checklist: “Lieferant bestätigt”; “Teilmenge geprüft”; “ERP-Referenz notiert”. | `planner-task`, `after` |
| 4. Publish the coordinated internal result | Sara: “Teilmenge ist möglich. David informiert die Kundschaft nach Nachführung im ERP.” | `teams-posts` |
| 5. Keep the transaction outside | “ERP prüfen → Klärungen koordinieren → Ergebnis bestätigen → ERP nachführen → Kundschaft informieren.” | `workflow`; five manual/link steps |

Personal/shared boundary: Jonas’s negotiation preparation remains personal; the confirmed outcome and next responsibility are shared. Avoid copying commercially sensitive customer details into the teaching channel.

Manual handovers: every task is created deliberately; supplier confirmation is captured by a person; ERP update and customer communication are separate actions.

Failure: “task done” is mistaken for “order changed”.

Trainer questions:

- “Welche Quelle gilt, wenn Kanal und ERP verschiedene Termine zeigen?”
- “Welche Aufgabe braucht die gemeinsame Gruppe tatsächlich?”

Simpler alternative: use the ERP’s exception queue or existing CRM case if it already offers ownership, history and notification. Teams may add only a short coordination conversation.

Distinctness: temporary uncertainty and customer promises, rather than a long-running project or an onboarding checklist.

Country adaptation: use the actual firm’s fulfilment setup. A cross-border Swiss import variant would need additional evidence about its customs/logistics steps; do not add them merely to make the story look Swiss.

#### B. Research-only: “Vertretung übernimmt eine offene Reklamationsklärung”

- Group/rhythm: four-person core; short daily check until resolution.
- Trigger/friction: account owner is absent; replacement sees messages but not the outstanding supplier question.
- Artefacts: authoritative complaint reference, open-action checklist, response draft.
- Boundary: complaint record and commercial credit remain in specialist systems.
- Four moments: `teams-posts` handover → `planner-task` responsibility/context → `teams-posts` confirmed internal outcome → `workflow` manual record update.
- Failure: closing a coordination task is interpreted as issuing a credit.
- Alternative: existing complaint-management case with substitute.
- Trainer question: “Was wurde geklärt, und welche Geschäftstransaktion ist noch offen?”

### Group 4: “Ingenieurbüro Nord: Projektprüfung”

#### A. Fully developed: “Prüfung erledigt ist noch keine Auslieferung”

Purpose and rhythm: five-person internal project team; four representative people; two reviews per week during a three-week deliverable phase.

Roles:

- Eva Keller — Projektleitung.
- Amir Demir — Fachbearbeitung.
- Nora Frei — interne Prüfung.
- Luca Baumann — Projektassistenz und Vertretung.

Trigger: Eva will be absent when the internal review finishes.

Artefacts: document reference `Bericht_Entwurf.docx`, explicit review scope, checklist, release instruction and authoritative delivery record outside the shown screens.

| Moment | Fictional scene copy | Profile / implementation boundary |
|---|---|---|
| 1. Define review scope and release limit | Eva: “Nora prüft Vollständigkeit und Querverweise. Versand erst nach meiner Freigabe oder der benannten Vertretung.” | `teams-posts`, document reference |
| 2. Show open responsibilities | “Bericht intern prüfen” — Nora; “Rückfragen bearbeiten” — Amir; “Freigabestand nachführen” — Luca. | `planner`, `before` |
| 3. Inspect the completed review | Checklist: “Abschnitte vollständig”; “Querverweise geprüft”; “Offene Punkte dokumentiert”. Comment: “Interne Prüfung abgeschlossen; Freigabe ausstehend.” | `planner-task`, `after` |
| 4. Make cover actionable | Luca: “Ich übernehme die Koordination. Freigabeberechtigung bleibt gemäss Projektvorgabe.” | `teams-posts` |
| 5. Separate review, authority and delivery | “Entwurf bearbeiten → intern prüfen → Freigabe dokumentieren → freigegebene Fassung ausliefern.” | `workflow`; four manual/link steps |

Personal/shared boundary: Nora’s preparatory notes remain private; review scope, findings and release state are shared. Client access is not illustrated.

Manual handovers: document editing/review occurs outside these portable screenshots; the reviewer records completion; the authorised person records release; delivery is deliberate.

Failure: substitute sends the document because all Planner tasks appear complete.

Trainer questions:

- “Welche Aussage beweist die erledigte Aufgabe—und welche nicht?”
- “Was braucht Luca ausser einem Link?”

Simpler alternative: the existing document-management review workflow, or one shared review document. Do not add Planner solely to repeat its status.

Distinctness: conditional release and absence continuity. Without those, this is cosmetic duplication of the existing grant/resource-review stories.

Country adaptation: retain a neutral internal report first. Do not invent Swiss/German professional-signature, engineering-standard or contractual approval differences without a specific discipline and client context.

#### B. Research-only: “Projektübergabe vor zwei Wochen Abwesenheit”

- Group/rhythm: same core; one 30-minute handover.
- Trigger/friction: pending client questions are distributed across private preparation and shared commitments.
- Artefacts: project-status note, three open questions, current deliverable references.
- Boundary: private preparation stays private; contractual correspondence remains in its required record.
- Four moments: `teams-chat` identifies missing context → `teams-posts` shared handover → `planner-task` accepted follow-up → `workflow` external correspondence.
- Manual transition: reassign, acknowledge, then record client communication in the required system.
- Failure: sharing a folder is mistaken for transferring responsibility.
- Alternative: project-system handover plus a conversation.
- Trainer question: “Welche Information macht die Vertretung handlungsfähig?”

## 7. Minimal taxonomy grounded in the repository

### Are Branche and Teamtyp independent?

Conceptually yes; operationally, not perfectly.

An engineering office can contain a stable department, temporary project and recurring review group. An internal service team can exist in a municipality or technical-service company. That is sufficient independence for useful facets—but not for generating a complete cross-product.

Use:

- `Branche / Umfeld`
- `Zusammenarbeit`

I would test “Zusammenarbeit” against “Teamtyp”. Your proposed Teamtyp list currently mixes structure, duration, work purpose and individual work. That ambiguity will grow faster than the catalogue.

Start with four collaboration labels:

- `Dauerhaftes Team`
- `Projektteam`
- `Service- und Auftragsteam`
- `Gremium / Arbeitsgruppe`

Do not make HR, finance, IT or assistance industries. Keep roles and functions in searchable descriptive content until actual discovery failures justify another facet.

### Smallest data change

Extend the existing shared research catalogue, not portable project v1:

| Level | Suggested optional metadata |
|---|---|
| Persona | `domains`, `teamPatterns` using controlled IDs |
| Scenario | Existing status retained; optional scenario-level facet override only when needed |
| Source | Publication/data period, evidence type and limitation where currently missing |
| Discovery adapter | Stable references to legacy library entries, without copying their entire content |

Important repository-specific constraint: the inspected catalogue’s project factory uses a university organisation/audience and source-note wording. Adding business tags alone would not make it domain-neutral. Parameterise those assumptions when adding the first business persona; keep existing university output unchanged.

Also, the inspected source helper uses a shared access date. New research needs per-source dates rather than inheriting the older catalogue date.

### Reuse without duplication

The same `Service- und Auftragsteam` pattern can describe:

- `Öffentliche Verwaltung` → internal service change.
- `Handwerk & technischer Service` → changed service appointment.

Reuse the discovery label, task-identity rules and handover structure. Do not reuse the same dialogue and artefacts: their authority and customer-record boundaries differ.

Retain `Team-Personas`, `Tools` and `Use Cases`. Show result counts, clear filters and an honest empty state. Do not offer country filtering before material country variants exist.

## 8. Revised implementation sequence and acceptance criteria

### Slice 0: decision record and anti-duplication review

Record the recommended four, the manufacturing challenge, evidence gaps and one distinct learning decision per story.

Acceptance:

- Each story can be differentiated from an existing example in one sentence.
- Every material workplace statement has an evidence classification.
- Unverified country differences are marked as validation requirements, not facts.

### Slice 1: two reference projects before taxonomy expansion

Build:

1. Municipality service change.
2. Technical-service changed assignment.

These test different boundaries: authority versus coordination, and office–field acceptance.

Acceptance:

- Maximum six slides; the proposed five-slide stories need no limit increase.
- Exactly two complete state snapshots.
- Stable identities and artefact/task references across views.
- No screen implies unimplemented ERP/DMS/dispatch functionality.
- No “sync” arrow crosses a manual business-system transition.
- Every scene carries one understandable decision at presentation size.

### Slice 2: trainer and worker recognition test

Use the exported images, not just scenario prose.

Proposed gate: at least one trainer and one domain practitioner for each reference story; include Swiss and German reviewers across the pair. This is a design-validation sample, not representative market research.

Acceptance:

- Reviewers identify the intended work situation without being told the sector.
- They correctly explain where the authoritative record lives.
- They identify who owns the next action.
- They can name when the simpler alternative is better.
- Misread transitions are corrected before expanding content.

### Slice 3: minimal discovery and shared-agent parity

Add the two facets and remove university assumptions from new business generation.

Acceptance:

- Website, CLI catalogue, MCP and authoring guidance expose the same IDs, statuses and available examples.
- Old routes and projects remain valid.
- Research-only briefs cannot be mistaken for renderable projects.
- Existing university examples retain their organisation, sources and behaviour.
- Narrow-screen review includes 390 px and filter reset/empty states.

### Slice 4: trade and engineering—or manufacturing replacement

Build only after the first recognition test. Reopen fourth-place selection before engineering implementation.

Acceptance:

- Trade demonstrates uncertainty and the ERP boundary, not order management.
- Engineering demonstrates release/cover, not generic document review.
- A manufacturing replacement must establish its distinctive work pattern and avoid a shadow QMS/MES.
- Second scenarios remain researched briefs unless independently worth rendering.

### Slice 5: technical and visual evidence

Reuse the repository’s existing validation, journeys, exports and catalogue tests.

Record separately:

1. Automated validation and regression results.
2. Human inspection of actual PNGs.
3. Real assistant-host capability-6 trial.
4. Live-tenant verification of depicted Microsoft behaviour.
5. Accessibility testing.

Do not let passing local tests close the handoff’s outstanding tenant, host-trial or screen-reader questions.

Defer new renderers, Forms/Lists automation, mobile simulation, permissions models, external collaboration, live integrations and new D1 export types. None is necessary for these first reference projects.

## 9. Compact source and uncertainty register

All sources below were accessed on 10 November 2026. URLs are supplied explicitly as requested. “Undated” means the retrieved Support page did not expose a publication date.

| Publisher / source | Publication or data period | Supports / limit |
|---|---|---|
| BFS — `https://statistik.admin.ch/de/asset/36870356` | Published 5 Nov 2026; 2024 data | Statistical context: Swiss SME structure; market-economy scope, not M365 use.  [statistik.admin](https://statistik.admin.ch/de/asset/36870356) |
| BFS — `https://statistik.admin.ch/de/asset/36463722` | Published 17 Mar 2026; 2025 data | Statistical context: sector employment shares; not tool access or training demand.  [statistik.admin](https://statistik.admin.ch/de/asset/36463722) |
| Destatis — `https://www.destatis.de/DE/Themen/Arbeit/Arbeitsmarkt/Erwerbstaetigkeit/Tabellen/arbeitnehmer-wirtschaftsbereiche.html` | Updated 18 Aug 2026; 2025 annual data | Statistical context: German sector employment; aggregate definitions restrict comparisons. Full retrieval succeeded in this review.  [destatis](https://www.destatis.de/DE/Themen/Arbeit/Arbeitsmarkt/Erwerbstaetigkeit/Tabellen/arbeitnehmer-wirtschaftsbereiche.html) |
| DIHK — `https://www.dihk.de/de/newsroom/digitalisierung-2026-unternehmen-halten-kurs-163290` | Published 28 Jan 2026; survey Nov 2025 | Workplace survey: maturity and adoption barriers; not representative Teams-training demand for these groups.  [dihk](https://www.dihk.de/de/newsroom/digitalisierung-2026-unternehmen-halten-kurs-163290) |
| Bitkom — `https://www.bitkom.org/Bitkom/Publikationen/Digitalisierung-des-Handwerks` | Published Jan 2026; 504 interviews, weeks 23–29 of 2025 | German craft practice and capability constraints; no sector-wide Teams/Planner estimate.  [bitkom](https://www.bitkom.org/Bitkom/Publikationen/Digitalisierung-des-Handwerks) |
| EFK — `https://www.efk.admin.ch/prufung/sicherheit-und-nutzbarkeit-von-microsoft-365/` | Published 21 Oct 2026 | Documented Swiss federal deployment and adoption need; not municipal or German configuration.  [efk.admin](https://www.efk.admin.ch/prufung/sicherheit-und-nutzbarkeit-von-microsoft-365/) |
| City of Cologne — `https://www.stadt-koeln.de/artikel/65600/index.html` | Undated current service page | Documented practice: council materials and results in a specialist information system; not proof of internal M365 use.  [stadt-koeln](https://www.stadt-koeln.de/artikel/65600/index.html) |
| Microsoft Support — `https://support.microsoft.com/en-us/loop/manage-your-tasks-from-loop-task-lists-and-collaborative-notes-in-planner` | Undated current guidance | Product mechanism: linked plan creation, buckets and task movement; not arbitrary-board integration.  [support.microsoft](https://support.microsoft.com/en-us/loop/manage-your-tasks-from-loop-task-lists-and-collaborative-notes-in-planner) |
| Microsoft Support — `https://support.microsoft.com/en-us/planner/see-planner-tasks-in-microsoft-to-do` | Undated current guidance | Product mechanism: connection, licence and explicit My Day action.  [support.microsoft](https://support.microsoft.com/en-us/planner/see-planner-tasks-in-microsoft-to-do) |
| Microsoft Support — `https://support.microsoft.com/en-us/loop/use-loop-components-in-outlook` | Undated current guidance | Product mechanism: supported shared-component surfaces and manual link sharing.  [support.microsoft](https://support.microsoft.com/en-us/loop/use-loop-components-in-outlook) |
| Microsoft Support — `https://support.microsoft.com/en-us/teams/meetings/take-meeting-notes-in-microsoft-teams` | Undated current guidance | Product mechanism: notes, direct invitations and external-attendee limitation.  [support.microsoft](https://support.microsoft.com/en-us/teams/meetings/take-meeting-notes-in-microsoft-teams) |
| Microsoft Learn — `https://learn.microsoft.com/en-us/microsoft-365/loop/loop-requirements?view=o365-worldwide` | Updated 18 Aug 2026 | Product prerequisites and environment differences; current tenant still needs checking.  [learn.microsoft](https://learn.microsoft.com/en-us/microsoft-365/loop/loop-requirements?view=o365-worldwide) |

Evidence separation:

- Statistical context justifies considering sectors.
- Documented practice establishes particular real arrangements.
- Microsoft documentation establishes product mechanisms, not adoption outcomes.
- Vendor recommendations are not independent evidence of workplace demand; none determines this ranking.
- All proposed personas and detailed scenes are fictional synthesis.

The largest uncertainty is not renderer feasibility. It is whether the chosen examples solve trainers’ actual recognition problem without recommending a second work-management system alongside an adequate specialist one.

## 10. Five consequential human-validation questions

1. Which recent CH and DE training sessions actually lacked a recognisable example—and what work did those participants perform, rather than which industry employed them?

2. For office–field and production audiences, who has an individual account, suitable device, licence and time to use the depicted tools during work?

3. Which proposed coordination tasks already exist in the dispatch, ERP, DMS, project or quality system—and would copying them into Planner create a harmful second source?

4. Can municipal practitioners distinguish the illustrated internal agreement, formal decision, record and publication—and which exact local systems and authorities govern those transitions?

5. Does engineering review add enough beyond the existing grant/resource stories, or can a manufacturing practitioner provide a more distinctive, renderable improvement story?

The expansion is worth doing if it broadens the work decisions people recognise—not merely the company names above familiar task boards.