# Build plan — library, customisation and visual explanation

Status: proposed implementation plan; no runtime changes in this document.
Date: 2026-10-28.
Repository: blackmath88/msteams-personas.
Baseline: the standalone atlas from merged PR #1.

## Product outcome

A visitor understands the promise, chooses a recognisable situation or describes their own, adapts it, and produces useful Teams/M365 visuals without building a real Teams environment.

The library is the front door. Higher Education and Business are collections. The same underlying situation powers screenshot-like scenes, setup maps, principle explainers and before/after comparisons.

First-use journey:
1. Understand the vision on arrival.
2. Explore an example or describe a situation.
3. Open a world and select a specific scenario.
4. Switch visual perspectives.
5. Customise a copy with a live preview.
6. Present or export the result; save the editable situation.

## Current evidence and gaps

Implemented: five fictional university worlds, 24 people, 45 artefacts, seven scenarios, 25 decision points, comparison scenes, diagrams, three world views and print briefings. Content validation and JS syntax checks passed during extraction.

Missing: collection-neutral landing/library, business examples, browser authoring, full scenario selection, explicit alternative setups, dedicated scene presentation and image export. Much of the current renderer reads scenarios[0]; mock channel/tab labels are not interactive app controls.

Desktop/mobile interaction, visual polish and print behaviour still need browser verification. Source validation alone does not establish visual acceptance.

Content corrections to resolve during migration:
- Older webinar scripts use Forschungswerkstatt while the newer worlds use Leadership Forum and Heat & Health. Record the selected teaching context; do not silently blend the stories.
- Leadership Forum recommends a separate Team but its displayed base model remains a channel in the parent Team. Represent these as explicit alternatives, and label the selected one.
- The commission document hook says an external member reads without an account while the recommendation chooses guest access. Reconcile the example and its assumptions.
- Keep optional structures optional: the teaching world's Bewertung channel must not appear as required when its own recommendation makes it conditional.

## Product UX

### Landing and library

Lead with a visual example and a clear promise: see how your work could look in Teams without setting it up. Offer Explore examples and Describe your situation. Do not lead with an empty editor.

Show curated previews with situation, central friction, people/size, work rhythm and a small scene/map thumbnail. Offer Business and Higher Education collections plus a few useful filters: collaboration pattern, learning question, lifecycle and external participation. Search should match everyday work language.

Describe your situation asks only for useful setup facts: work goal, people, duration/rhythm, external involvement, shared artefacts and main friction. Use deterministic template suggestions; the user chooses and edits. No AI dependency.

### Example detail

Show an identity summary and scenario selector, then four labelled views:
- Scene: a clean screenshot-like fictional collaboration interface.
- Setup map: people, workspaces/channels, artefacts and relationships.
- Principle: an explanation of a specific collaboration decision.
- Before / after: aligned moments and their numbered changes.

Keep scenario, setup variant and visual view separate. A viewer must always know which situation and alternative is shown. Changing visual view preserves the selected scenario and variant.

### Customise

Create a copy; preserve the curated original. Desktop: labelled editor beside a large live preview. Mobile: explicit Edit / Preview switch with state preserved.

Group fields by situation, people, structure and scene content. Support names/roles, membership, team/channel structure, posts/replies, files and simple tasks. Provide sensible sample content and reset/undo. Avoid a long schema form on first arrival.

Show the consequences of editing shared entities consistently. If a referenced person or channel is removed, ask for reassignment or show an actionable validation error.

### Present and export

Hide authoring controls. Offer clean or annotated visuals, a fixed 16:9 frame, individual scene/map/principle exports, and separate print briefing output. Retain a quiet fictional-example label and source attribution.

## Shared domain and rendering contract

| Entity | Responsibility |
| --- | --- |
| Collection | Context, locale, theme, references and related worlds |
| Working world | Work goal, rhythm, people, relationships and boundaries |
| Person | Stable fictional identity and role, referenced across moments |
| Artefact | Stable file/task/knowledge identity, owner and location |
| Scenario | Trigger, friction, learning objective, decisions and consequences |
| Setup variant | Named structural alternative and explicit membership/storage assumptions |
| Moment | A before/decision/after state referencing people and artefacts |
| View | Scene, map, principle or comparison projection of that moment |
| Sequence | Ordered moments with facilitator notes and module links |

Use a versioned JSON-compatible document and a legacy adapter. Preserve all imported worlds/scenarios/decision content; do not flatten alternatives into a single recommended configuration. Avoid a schema that hard-codes five worlds, German copy, university identity or exactly one Team.

All views read the same document and selected IDs. Shared names, memberships and artefact locations must not be duplicated independently per renderer. View-specific layout/annotations are allowed. Editing a person or moving an artefact must update every relevant view.

## Delivery slices and acceptance

### 1. Establish the collection model and content baseline

Deliver: versioned schema, validator, adapter for HE_WORLDS/HE_ATLAS, migration report and a small business fixture. Preserve the current atlas while adapting its data access.

Acceptance:
- All five existing worlds and all seven scenarios are addressable by stable ID.
- Missing references, duplicate IDs and unsupported versions report useful errors.
- Every current content field is mapped or explicitly preserved as legacy content.
- Two collections load without changing renderer source.
- Named variants resolve the known model/recommendation contradictions.
- New format validation does not imply Microsoft technical correctness; flag assumptions separately.

### 2. Build the library-first viewer

Deliver: landing promise/visual, collection browsing, lightweight filters/search, example detail, scenario selector, direct links and return navigation. Preserve the existing viewer as a temporary fallback until parity is checked.

Acceptance:
- A new visitor can identify the purpose and open a relevant example in a short usability check.
- Both collections are discoverable.
- Every imported scenario is selectable; no implicit scenarios[0] selection drives all detail views.
- URL state restores collection, world, scenario, variant and view.
- Browser Back works predictably; keyboard focus and empty states are clear.

### 3. Complete the four visual projections

Deliver: shared render context, readable Teams-inspired scene, labelled setup map, focused principle explainer, before/after comparison.

Acceptance:
- One scene/map/principle/comparison set is complete for Leadership Forum and one business case.
- Renaming a shared person or moving an artefact updates all relevant projections.
- Connections and numbered annotations map to the same underlying objects.
- The scene supports readable posts/replies and files; personal-work examples remain supported.
- Simulated controls either work within the mock or are clearly presented as illustration.
- Maps communicate membership, work location and ownership; they do not claim to enforce permissions.
- Layouts remain legible at 375px, desktop and 200% zoom.

### 4. Add the customisation studio

Deliver: duplicate example, minimal situation questionnaire, deterministic starter suggestions, edit fields and live preview, validation, undo/reset and draft recovery.

Acceptance:
- A user creates a small business world or adapts an example without editing code.
- A supported scenario includes people, channel/file/post content and two moments.
- Invalid edits do not destroy the last valid preview or silently drop data.
- Curated source examples remain intact.
- Refresh can recover a saved local draft; denied storage falls back to explicit download/save messaging.
- Collection download/import round-trips stable IDs and supported content.
- Imported text is rendered safely as text; imported executable content is never evaluated.

### 5. Add presentation and reliable export

Deliver: presentation mode, clean/annotated toggle, 16:9 frame, PNG and SVG where appropriate, editable JSON export, separate print briefing.

Acceptance:
- A user exports a legible 1920 x 1080 scene without editor controls.
- Conceptual graphics export with text and connectors intact.
- Long names, overflowing posts and missing fonts produce a deliberate fit/error state.
- Locally loaded assets export without remote image/CORS dependency.
- Fictional-example labelling and attribution remain present.
- Exported visual matches the selected scenario, variant and moment.

### 6. Curate launch collections and webinar sequences

Deliver: initial Business and Higher Education collections, coherent sample scene content, source/assumption notes and a Unibas/isolutions teaching sequence.

Candidate business patterns: department operations, cross-functional project, employee/customer onboarding, external service delivery, recurring meeting decisions, knowledge handover. Final selection follows research; these are not accepted findings.

Acceptance:
- Research produces a candidate matrix and six recommended launch patterns across both collections.
- At least three business starter templates have distinct collaboration needs.
- Each launch example has a clear learning question, alternatives and an outside-M365 boundary.
- At least one complete sequence supports the actual Unibas/isolutions webinar material and is reviewed with the collaborators before being labelled approved.
- Recommendations distinguish Microsoft mechanisms, practitioner patterns and our synthesis.

## Sequence and first implementation envelope

Dependencies: slice 1 precedes 2; slices 2 and 3 precede the studio; a small export spike during slice 3 checks fidelity before slice 5. Curate existing content throughout; research can proceed before coding and informs business template selection.

First bounded build: slices 1–3 for the five imported worlds plus one business case. Finish one end-to-end library → scenario → four-view experience before extending authoring.

First authoring milestone: duplicate that business case, edit people and scene content, preview, save/re-import and export a visual. Avoid building a broad generic editor before this path works.

## Architecture and quality

Retain static/local-first operation and local assets. Prefer semantic HTML, CSS and vanilla JS while splitting data access, selection state, validation, renderers, editor and export into clear modules. Change frameworks only for an evidenced implementation need.

Meaningful checks:
- Schema/reference and import/export round-trip tests.
- State tests covering scenario/variant selection and shared edits.
- Browser tests for library → scenario → customise → export, including reload recovery and malformed import.
- Visual review of both a business and university case at mobile/desktop, zoom, keyboard navigation, reduced motion and print.
- Inspect exported artifacts, not just a successful export callback.

Keep internal IDs and schema details out of user flows. Use explicit mock/illustration labels for product fidelity. A scene is educational evidence, not proof of current tenant behaviour.

## Research handoff

Use docs/research/PERPLEXITY-USE-CASES-PROMPT.md. Store resulting evidence separately from accepted fictional scenario content. Record URLs, dates, claim type, uncertainty and technical dependencies before promoting research suggestions into launch templates.

## Scope and authority

This change records a plan and research prompt only. No implementation, deployment, merge, API spend or Weavr Mission dispatch is implied. Current Weavr overview has no matching project. If governed work is introduced, inspect live state and the canonical operating contract; use GitHub .weavr/inbox commands for approved Weavr writes.
