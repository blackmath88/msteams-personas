# Higher-education personas, connected workflows and visual language

Status: implemented on the isolated feature branch, 2026-11-09; draft review, not merged or deployed. See [handoff](PERSONA-SCENARIO-HANDOFF.md) and [morning gallery](morning-review/index.html). Live tenant acceptance, a real assistant-host trial and component-field form authoring remain open.
This is the next build priority. The immediate outcome is a richer scenario library and reviewable visual examples. Deck composition remains a later milestone.

## Purpose

Help trainers and their assistants choose a recognisable higher-education group, understand its work, and illustrate a realistic combination of Microsoft 365 tools. Extend the existing website, portable project format, CLI and MCP together. Build on Campus & People Development, Urban Health Analytics and Dr. Nora Keller.

Group archetypes describe working arrangements and recurring needs. Names, organisations, conversations and data are fictional. Do not imply that invented groups represent interviews or actual university deployments.

## Research before implementation

Read AGENTS.md and its required current plans. Inspect existing worlds, persona definitions, shared core, component registry, icons and scenario examples before selecting storage locations.

Research 8–10 candidate group archetypes. Select 4 distinct additions for implementation after comparing them with existing personas. Aim for 10–12 specific cross-tool scenarios in the catalogue, with at least 6 fully rendered examples. Fully implement two Loop/meeting scenarios and their shared visual primitives before expanding further.

Use university IT/training guidance for actual organisational needs, current Microsoft Support/Learn for product behaviour, Microsoft Adoption for suggested patterns, and GitHub for reusable code, icon assets and example data. GitHub popularity is not evidence that a workflow is university best practice. Inspect licences before reusing assets or code.

For every selected archetype record purpose, roles, approximate group size, duration, work rhythm, collaboration boundaries, typical artefacts, recurring friction, tool choices and a concrete teaching question. Give every scenario an evidence record with source URL, publisher, access date, supported claim, limitations, and whether it is documented practice, a vendor recommendation or our fictional synthesis. Target two relevant sources per archetype and primary product documentation for each integration claim. If evidence is weak, mark the candidate provisional.

Research candidates:
- Departmental committee or programme board, recurring decisions and follow-up.
- Teaching coordination team, semester planning and shared preparation.
- Research consortium, milestones and cross-institution collaboration.
- Research support / grant application team, deadlines and document contributions.
- Conference or university event team, temporary coordination and handover.
- Laboratory or service operations team, recurring work and shared resources.
- Community of practice, peer exchange and reusable knowledge.
- Student support or onboarding team, repeated requests and structured handovers.

Choose by distinctness, evidence, teaching value and achievable renderer coverage. Preserve the existing personal-work contrast represented by Nora.

## Connected workflow candidates

1. Weekly team meeting: agenda in collaborative notes, decisions during the meeting, assigned follow-up tasks visible through supported Planner/To Do views, review at the next meeting.
2. Committee preparation: Teams channel communication plus linked SharePoint documents, collaborative agenda, decisions and accountable actions.
3. Loop co-authoring: one supported component shared across supported surfaces, show the same underlying content and a change reflected in another view.
4. Semester preparation: shared course planning documents, Planner responsibilities, Teams updates and individual follow-up.
5. Grant submission: shared proposal, contribution deadlines, review discussion and task ownership.
6. Event preparation: task board, meeting follow-up, shared running order and day-of communication.
7. Research fieldwork: shared plan, document location, fieldwork responsibilities and personal task view.
8. Staff onboarding: shared reference material, team responsibilities and personal next actions.
9. Community of practice: discussion, collaboratively maintained notes and a published reusable resource.
10. Personal draft to group work: OneDrive draft, deliberate sharing or moving, SharePoint team ownership and discussion.
11. Structured requests: investigate Forms → Lists → optional Power Automate → Teams notifications, including what needs explicit automation.
12. Recurring operations: compare when a task belongs in Planner and when a structured record belongs in Lists.

Validate these combinations before presenting them as supported. In particular, distinguish Loop components, Loop pages/workspaces and Teams collaborative notes. Verify plan creation and task synchronisation semantics rather than depicting an existing arbitrary Planner board as automatically receiving every meeting task. Document tenant settings, licences, external participant limitations and automatic versus manual transitions. University policy examples are local examples, not Basel policy.

## Initial source leads

The following were found in the initial discovery on 2026-11-09. Read the full sources and extend this list during the build.
- https://icts.uct.ac.za/services-collaboration-and-communication-services-teams/microsoft-teams-use-case-groups-and-committees
- https://icts.uct.ac.za/services-collaboration-and-communication-services-teams/microsoft-teams-use-case-research
- https://icts.uct.ac.za/services-collaboration-and-communication-services-teams/microsoft-teams-use-case-teaching-and-learning
- https://information-services.ed.ac.uk/computing/comms-and-collab/office365/teams/teams-use-cases
- https://it.cornell.edu/teams/teams-notes
- https://support.microsoft.com/en-gb/loop/manage-your-tasks-from-loop-task-lists-and-collaborative-notes-in-planner
- https://support.microsoft.com/en-us/teams/chat/use-collaborative-notes-in-microsoft-teams-chats
- https://adoption.microsoft.com/en-us/scenario-library/
- https://www.adoption.microsoft.com/en-us/microsoft-loop/

Search GitHub directly for Microsoft adoption samples, Loop/Teams examples and Fluent UI System Icons. Record useful finds and rejected candidates with reasons. Reuse the repository's existing Fluent assets first.

## Scenario contract

Reuse existing representations. Add only fields needed for a teaching scenario, using stable IDs. Each scenario needs:
- Group/persona, audience and learning objective.
- Trigger, friction and desired outcome.
- Ordered steps with actor, tool, action and artefact.
- Explicit manual handovers and verified synchronisation relationships.
- Persistent identities for people, tasks, documents and shared components.
- Before/during/after or a short ordered sequence where the current renderer supports it.
- Trainer explanation, one discussion question and one realistic failure or boundary.
- Evidence references and declared feature prerequisites.
- Capability status that distinguishes renderable examples from research candidates.

A catalogue entry must not advertise a screen that cannot render. Retain readable input validation and compatibility with existing projects. Let assistants adapt these examples and author their own valid combinations using the same public capabilities.

## Pictograms and visual language

Extend the existing house/room/cabinet language and Szene/Prinzip modes.
Create a small coherent semantic vocabulary for group, meeting, agenda, contribution, decision, task, owner, due date, document, shared component, review and handover. Use existing Fluent icons where appropriate and authored SVG for missing concepts.

Give the same artefact a recognisable identity across screens. Distinguish person, tool, artefact and action through shape and labels. Use labelled arrows to distinguish manual movement, links and verified synchronisation. Colour supplements labels and shape.

Build a visual specimen page showing icons at small and presentation sizes, light/dark treatment, workflow strips, a group intro card and two complete scenario comparisons. Check text density at 1920×1080 and website usability at 390 px. Use Swiss German spelling. Keep pictograms readable without hover and provide accessible names for meaningful controls.

For Loop, implement the smallest accurately sourced scene needed for the chosen workflows, such as a collaborative agenda/notes/action-items panel. Show shared content consistently between views. Label fictional mock UI honestly and capture dated UI references in the evidence record. Avoid inventing product features to fill visual gaps.

## Implementation sequence

1. Inventory current code and research candidates. Commit evidence and a selection matrix.
2. Add four evidence-backed group personas and the scenario catalogue using existing data conventions.
3. Implement the weekly meeting and Loop co-authoring examples end to end, including any minimal new shared renderer profile, validation and icons.
4. Add four more complete examples using available profiles. Keep additional researched scenarios clearly marked.
5. Expose discovery and examples through website, CLI and MCP from shared definitions. Ensure authoring packs describe new capabilities and required fields.
6. Produce a morning review gallery with persona cards, scenario strips and rendered PNGs. Include the Loop pair and a Planner/To Do continuity example.
7. Run required checks, inspect rendered results, fix observed failures and write a concise handoff.

## Acceptance and evidence

- Four additional distinct fictional group personas with traceable rationale.
- 10–12 researched scenarios with honest implementation status and at least six complete renderable examples.
- Two working Loop/meeting scenarios with verified integration semantics.
- Scenario/persona selection usable on the website and discoverable through CLI/MCP.
- Valid example projects that export through shared rendering.
- Existing examples remain valid. Run npm test, node check-worlds.mjs and applicable browser/CLI/MCP journeys.
- Add targeted regression coverage for new profiles, broken references and cross-view identity.
- Inspect actual exported PNGs for legibility and misleading relationships.
- Record screenshots and output paths in a morning review document with commit, checks, sources, unresolved questions and three recommended visual decisions for Achim.
- Report a real assistant-host trial separately from SDK/stdio tests. A disconnected private tunnel should not block local verification.

The existing workspace model supports ordinary channels. Illustrations of guest/private/shared access need explicit model support or a clearly bounded conceptual explanation. Fictional membership diagrams are not proof of actual Microsoft permissions.

## Overnight execution

Work on an isolated feature branch from current main, preserve unrelated work, and use the session's available budget. Prioritise the two complete Loop/meeting examples and a coherent review gallery over catalogue counts if time runs short. Checkpoint completed slices. Open a draft PR when ready, with a handoff that states completed and deferred acceptance items. Merge and deployment remain subsequent review steps.

Keep implementation within this standalone tool. Reuse its architecture, shared core and local assets. Add dependencies only for a demonstrated gap. The morning deliverable should let Achim inspect the new groups, choose scenarios and judge their visual explanations.
