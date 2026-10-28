# Build plan — visual-first library test

Status: agreed direction for the first Weavr implementation test; implementation remains to be built.
Updated: 2026-10-28.
Repository: blackmath88/msteams-personas.
Baseline: the existing atlas plus merged planning PR #2.

## Outcome

A visitor understands the vision, chooses a familiar persona or use case, or describes their own situation, and obtains readable Teams-inspired scenes and conceptual explanations without building a real Team.

Higher Education and Business are collections in one library. The first release must demonstrate both. Keep the existing university content; add one fictional small business department coordinating a cross-functional project.

The product has two primary visual modes:
- **Szene** — screenshot-like collaboration scenes.
- **Prinzip** — conceptual explanations, including setup maps and before/after comparisons.

These are projections of the same selected world/scenario/variant. Four equal top-level visual tabs are no longer the target.

## Current baseline

Available: five university worlds, 24 people, 45 artefacts, seven scenarios, 25 decision points, today/M365 comparisons, diagrams and print briefings. Much of the existing renderer uses scenarios[0]; it is not yet a configurator or general-purpose scene studio.

Content validation and syntax checks passed during extraction. Browser/mobile/visual/print checks remain outstanding; do not treat the existing viewer as visually accepted.

No business starter, configurator, scene presentation mode or PNG export is implemented yet. Research has been requested, not completed.

## First test: one bounded vertical slice

Build the landing/library, deterministic configurator, shared scene/principle rendering and presentation mode. Use only a thin v3 model and adapter needed for that path. Do not front-load a complete schema migration or a full editor.

### 1. Landing and library

German UI, Swiss spelling. State the vision in one line with an immediately visible example.

Three entry points:
- **Persona wählen** — browse working-world archetypes, not demographic profiles.
- **Use Case wählen** — enter through a practical friction/learning question.
- **Eigene Situation** — answer a short configurator.

Use the five existing university cards and one business card, with collection, people/size, friction and small visual preview. Persona and use-case entry points converge on the same underlying world/scenario data.

Make all seven existing scenarios reachable through explicit selection or a clearly linked legacy view; no data disappears because only the first scenario is shown. Broad search/filter systems are optional later, not first-test acceptance.

### 2. Configurator instead of full editor

Ask six short questions, with reasonable defaults:
1. What work are you trying to organise, and what is difficult today?
2. Who works together, and roughly how many people are involved?
3. Is the work ongoing, temporary or recurring, and at what rhythm?
4. Are external people involved?
5. Which artefacts/responsibilities need to be shared, and what stays personal?
6. Are there confidentiality or access boundaries that affect the setup?

Use transparent deterministic template matching. Show the suggested starting point and its rationale, plus at least one meaningful alternative where supported. No claim that six answers determine a uniquely correct Teams configuration.

Allow lightweight adjustment of the situation/team name and participant names beside the preview. Preserve curated originals. A full editor for arbitrary channels, posts, files and tasks is deferred.

Acceptance:
- At least two different answer sets produce meaningfully different structures/content.
- A user can go back and change answers without losing the current customisation.
- Cancel/reset is explicit; explain that the first-test customised draft is session-only and warn before discarding it.
- No backend, AI calls or Microsoft login is required.
- Confidentiality answers surface assumptions/boundaries; they do not certify real tenant permissions.

### 3. Thin shared model and adapter

Keep HE_WORLDS/HE_ATLAS source content and provenance. Add a minimal v3 view model containing only what the first test needs: collection/world/scenario IDs, people, artefacts, selected setup variant, scene state, principle bindings and configurator answers.

Adapt legacy content without a wholesale rewrite. Preserve unconsumed fields; retain a path to the legacy atlas for detailed content. Keep the model extensible, but do not build a schema platform ahead of the visible experience.

Shared entities must have stable IDs. Updating a participant or situation name updates Szene, Prinzip and Präsentieren together. Store view-specific annotations/layout separately from domain facts.

### 4. Szene

Build one clear reusable Teams-inspired renderer with readable channel posts/replies and a file view, sufficient for the selected teaching point. Reuse or adapt current scene code.

First-test complete examples:
- Campus & People Development / Leadership Forum.
- A generic small department coordinating a cross-functional project.

Keep the other existing worlds browsable using adapted or legacy visuals. Preserve Nora's personal-work alternative; do not force every world into a Team.

Use a simplified original screen grammar, no Microsoft logos, and a quiet fictional-example label. Mock controls must either work within their supported scene views or be visibly illustrative. Do not imitate the whole Teams application.

Chat, Planner and OneDrive/To Do scene families are future extensions, except where existing personal-work visuals can be retained with little change.

### 5. Prinzip: three explainers first

The first three are:
1. **Chat oder Kanal?** Who needs to find a conversation/decision later?
2. **Persönlicher Entwurf oder gemeinsames Dokument?** One working object versus attachment copies.
3. **Persönliche oder gemeinsame Verantwortung?** Personal tasks versus visible shared commitments.

For each: show a concrete problem, simple conceptual diagram, contextual recommendation, alternative/boundary and link back to the selected scene. Maps and before/after layouts live inside Prinzip; they are not extra primary modes.

Use stable people/artefact references, large text, labelled connectors and restrained annotation. Do not rely on tiny screenshot text. A user should understand the principle without knowing the product navigation.

Guest access, standard/private/shared channels, notification behaviour and detailed storage/permission diagrams are deferred until authoritative assumptions are checked. Avoid broad unsupported technical claims in the first explainers.

### 6. Präsentieren

Provide a 16:9 stage, hide library/configurator controls and allow annotations on/off for either visual mode. Include an obvious exit control and Escape behaviour. Preserve selected scenario, variant and custom names.

Acceptance: at desktop, the complete stage fits within the viewport without clipping important content; narrow screens remain navigable. Long text has a deliberate fit/overflow treatment. A manual screenshot is possible. PNG/SVG generation and download are explicitly deferred.

## Content consistency work inside the slice

- Leadership Forum's own-Team recommendation and parent-Team/channel model must be named alternatives, not contradictory claims in one scene.
- Reconcile the commission's external-member hook with its selected access assumption; do not invent a no-account guarantee.
- Keep the teaching world's Bewertung structure conditional.
- Use Leadership Forum consistently for the complete university demonstration. Do not import the older Forschungswerkstatt script into this story without an explicit mapping.
- The new business case is fictional synthesis pending research validation, not an evidence-backed industry standard.

## First-test acceptance and proof

A run is complete only when:
- Landing communicates the promise and all three entries work.
- Five university cards and one business card are available.
- Persona/use-case browsing reaches real, labelled scenario content; legacy scenarios remain reachable.
- Configurator produces an editable named starting point with rationale and a visible alternative.
- Leadership Forum and the business case demonstrate Szene and Prinzip from the same state.
- All three principle explainers are present, readable and contextual.
- Name changes remain consistent across both modes and the presentation stage.
- Präsentieren works with annotation toggle and exit; PNG is clearly absent.
- Existing content validator passes, and no university content was silently discarded.
- Desktop, 375px mobile, keyboard use and 200% zoom have browser evidence.

Required proof packet: exact branch/commit and base, changed paths, tests with commands/results, screenshots of landing/configurator/Szene/Prinzip/presentation for the two complete examples, limitations and remaining acceptance items. Missing browser capability means a checkpoint or blocked visual acceptance, not a claim of visual completion.

Use meaningful tests for adapter references, deterministic configurations, shared-name consistency and the primary browser journey. Run node check-worlds.mjs after data/scene changes and check all five legacy worlds/three views after renderer changes. Do not write prose-only mirror tests.

## Implementation route

Plain semantic HTML, local CSS and vanilla JavaScript; offline operation and no runtime CDN. Split selection state, adapter, configurator, renderers and presentation code where useful. No framework/backend migration.

Suggested order:
1. Inspect baseline and propose a short file-level plan; identify actual browser/test capability.
2. Thin adapter plus one business fixture and landing cards.
3. Build the three principle explainers early, alongside the common render state.
4. Wire the configurator and a complete Szene for the two examples.
5. Add presentation mode, run checks, capture proof and return for review.

Checkpoint partial work honestly. Do not spend the whole attempt generalising the data layer before a visible example exists.

## Later milestones — outside this test

- Full authoring studio for arbitrary people, channels, posts/files/tasks.
- Persistent draft recovery and portable collection import/export.
- PNG/SVG export and production-ready slide output.
- More business templates, wider scene families and principle library.
- Webinar sequences, facilitator notes and collaborator acceptance.
- Advanced filters/search, perspective lenses and scenario playback.

Research prompt: [PERPLEXITY-USE-CASES-PROMPT.md](research/PERPLEXITY-USE-CASES-PROMPT.md). Research is useful input, not a blocker for one clearly labelled fictional business fixture.

## Weavr boundary

Use [WEAVR-FIRST-TEST.md](WEAVR-FIRST-TEST.md) as the proposed bounded Mission brief. The build plan is evidence, not a dispatch or waiver.

The user authorised direct integration of this documentation revision into main. That authority does not grant an implementation runtime automatic merge/deployment permission. Do not change canonical Weavr scope, waive Needs or dispatch without explicit intent. Approved conversational Weavr writes use immutable GitHub .weavr/inbox commands under the canonical operating contract.
