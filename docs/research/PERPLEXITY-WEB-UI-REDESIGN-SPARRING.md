# Perplexity brief: a web UI that does justice to the content

Date: 2026-11-10, Europe/Zurich. Research/design brief, not a redesign implementation. Baseline: published main at `c2c823a16f62d0dea0acbd66f0e794521d0001cb` (PR #15). This brief and its fresh screenshots are on `docs/ui-redesign-sparring`. No UI or rendering behaviour has changed in this branch.

## Assignment

Act as a critical product designer, information architect and frontend architect. Propose a redesign of **msteams-personas** that makes its substantial content easier to discover, inspect and use. The owner likes the direction of the content but finds the web UI generic and recognisably AI-generated. Treat that as a design concern to investigate through concrete observations, not as a request for cosmetic novelty.

We need a distinctive, useful working library for M365 trainers and adoption consultants in Switzerland and Germany. The content is the attraction: fictional but consistent working groups, decisions, task ownership, cross-application relationships, carefully bounded product claims and ready-to-use teaching visuals. Show why a trainer would choose an example and what they can do with it.

Do not deliver only a mood board, a list of fashionable components, or advice to “make it cleaner.” Show layouts and interactions using our actual content. Challenge the existing architecture of the experience. A framework recommendation must follow a demonstrated need.

## Inspect the real product first

Repository: https://github.com/blackmath88/msteams-personas

Live routes:

- Home: https://blackmath88.github.io/msteams-personas/
- Combined discovery: https://blackmath88.github.io/msteams-personas/index.html#/personas
- Business examples: https://blackmath88.github.io/msteams-personas/index.html#/beispiele
- Administration story: https://blackmath88.github.io/msteams-personas/index.html#/beispiele/municipal-opening-hours
- Service story: https://blackmath88.github.io/msteams-personas/index.html#/beispiele/service-appointment-change
- Existing meeting story: https://blackmath88.github.io/msteams-personas/index.html#/hochschule/weekly-meeting
- Shared Loop content: https://blackmath88.github.io/msteams-personas/index.html#/hochschule/shared-loop
- Project start: https://blackmath88.github.io/msteams-personas/index.html#/projekt
- Complete business outputs: https://blackmath88.github.io/msteams-personas/docs/business-review/index.html

Read `AGENTS.md`, `README.md`, `docs/STATUS.md`, `docs/BUSINESS-REFERENCE-HANDOFF.md`, `docs/CLI-MCP-HANDOFF.md` and `docs/COMPONENTS-D1-HANDOFF.md`. Inspect `index.html`, `package.json`, `src/app.js`, `src/app.css`, `src/research-ui.js`, `src/collaboration.css`, `src/project-ui.js` and `src/project.css`. Inspect the catalogue and rendering boundaries through `src/research-catalogue.js`, `src/business-catalogue.js`, `src/project-core.js`, `src/project-render.js`, `src/export.js` and `tools/render.mjs` as needed. Prioritise inspected implementation and recent handoffs over older plans.

Fresh baseline screenshots on the briefing branch:

- [Home, desktop/full page](ui-redesign-baseline/home-desktop.png).
- [Library, desktop](ui-redesign-baseline/library-desktop.png).
- [Administration story, desktop](ui-redesign-baseline/scenario-desktop.png).
- [Project start, desktop](ui-redesign-baseline/project-desktop.png).
- [Library, mobile/full page](ui-redesign-baseline/library-mobile.png).
- [Capture provenance and viewport details](ui-redesign-baseline/provenance.json).

These are current browser captures, not redesigns. Prefer live interaction where possible. Report exactly which revision, pages, images and files you inspected. If your tooling cannot run JavaScript, inspect images, source and exported PNGs; say what remains unobserved. Do not claim to have evaluated visual quality from HTML text alone.

## What we actually run

| Layer | Current implementation | Consequence |
| --- | --- | --- |
| Web app | Plain HTML/CSS/JavaScript, browser globals and a custom hash router | No React, TanStack, frontend bundler or web backend |
| Hosting | Static GitHub Pages from main | No application server or Microsoft login |
| Content | Shared catalogue, portable project v1/capability 6, existing curated library adapters | Reuse canonical content and IDs; avoid another UI-specific catalogue |
| Preview/export | Shared DOM/SVG rendering; same-origin styles are embedded into SVG/PNG export | UI CSS can affect exports; app chrome and exported visuals need a deliberate boundary |
| Persistence | Browser-local drafts and customisations, validated JSON import/export | Preserve saved work and explicit import review |
| CLI/MCP | Node 22+, official MCP SDKs and Zod; same validation/rendering core | A frontend change must preserve these tools without requiring them to adopt a UI framework |

The web app currently loads local assets and has no install/build prerequisite. Preserve usable offline/local operation. Direct `file://` verification was blocked by the managed test browser, so do not claim it was verified. If a proposed toolchain changes the offline contract, state exactly how and why. Local testing over HTTP is not the same as direct file opening.

## Starting observations to challenge

These are coordinator observations from source and the captured UI, not representative usability-study findings:

1. Nine similarly weighted navigation links expose multiple routes, collections, authoring paths and a legacy atlas at the same level.
2. Discovery is split between existing worlds, research groups, higher-education examples, business examples and sequences. A visitor has to infer how these relate.
3. Many cards repeat the same white rounded box, heading, metadata and paragraph pattern. Person initials and badges often occupy space where a useful visual preview could establish the example's value.
4. On the administration story, substantial context and a workflow strip precede the main slide preview. The content has become stronger while the presentation remains a long document page.
5. The project start offers four text-heavy, similarly sized paths. The next best action and the result of choosing it are not visually clear.
6. Labels such as “renderbar,” capability versions and source classifications are useful implementation/research details but need an audience-appropriate place in the product.

Validate, correct or reject these observations. “AI-looking” is not a measurable diagnosis; identify the hierarchy, rhythm, typography, interaction or content decisions causing the impression. Do not substitute blanket bans on cards, gradients or particular colours for design judgement.

## User jobs and content to use in the proposal

Design for these tasks, without fabricated interviews or success metrics:

1. A trainer has a session tomorrow and needs a suitable example within a minute. They can start from a work problem, context or application without understanding our data model.
2. They inspect a complete story, understand its teaching decision, move between steps and compare states. They can read important content at a useful size.
3. They adapt people or tasks without losing identities, review the result and export actual PNGs. They can reopen a saved project without confusing it with a customisation backup.
4. They distinguish a ready example from a research-only idea. Sources, prerequisites and manual handovers are findable without dominating browsing.
5. A returning trainer reaches recent or saved work quickly, using existing local persistence where applicable. Identify genuinely new saved-work functionality separately.

Use **Abgestimmt ist noch nicht veröffentlicht**, **Termin verschoben: Wer übernimmt den Rest?**, the recurring meeting and the shared Loop table in mockups. Include individual work and existing business examples, not just the newest groups. The shared research catalogue has six groups, sixteen scenario records and eight renderable examples, plus references to seven existing worlds. Those counts describe different things; do not present sixteen as the total number of all curated situations.

## What to propose

### 1. Diagnose and simplify the experience

Give a concise, severity-ranked audit with evidence from named screens. Propose a clear content model and navigation hierarchy. What is the primary thing a trainer chooses: a situation, teaching sequence, persona or tool? Which concepts are filters, alternate entrances, utilities or supporting detail?

The old three entrances—Team-Personas, Tools and Use Cases—are useful hypotheses, not an untouchable top navigation. Preserve the ability to start from each need and preserve/alias old deep links, but challenge the labels, prominence and duplication. Explain where Business/Hochschule, own projects, the configurator and the legacy atlas belong.

Specify the initial viewport, progressive disclosure and primary action for home, library, story and authoring. Explain the transition between browsing, adapting, presenting and exporting. Do not make every page another landing page.

### 2. Research and choose a visual direction

Find 5–7 credible live references: content libraries, editorial/reference products and focused creative/professional tools. Cite direct pages, publisher, access date, which specific behaviour or visual principle transfers, and what does not. Include references beyond component-library demos and design galleries. Separate inspiration from documented usability/accessibility guidance.

Offer **two genuinely distinct directions**, then recommend one with a strong counterargument. They must differ in hierarchy and interaction, not merely colour palettes. Explore an editorial field guide or a visual workbench if useful, without treating those examples as the required answers.

Specify typography, grid, spacing, density, borders, colour roles, visual rhythm, image/crop strategy, selected/focus states and meaningful motion. Give actual values or constrained ranges and German sample copy. Local/self-hosted assets and clear font licensing matter. Explain how the product gets its own identity while the M365 mock screens retain their application identities. Keep the house metaphor and Fluent assets where they clarify the work; a repeated decorative house on every card is not a design strategy.

### 3. Show concrete screens with real content

For the recommended direction, deliver desktop layouts at approximately 1440×1000 and mobile browsing at 390×844 for:

- Home/first visit, with a convincing first useful action.
- Library, with a real preview, meaningful filters and the empty/selected states.
- Story workspace, with the actual five-slide administration or service sequence, step navigation, presenter notes, prerequisites, adapt/export actions and a readable preview.
- Adaptation workspace, including import review, saved-state feedback and an honest distinction between editable fields and currently preserved JSON metadata.

Provide visual mockups if your tools support them. Otherwise provide a **standalone HTML/CSS design specimen** in the response, using real existing PNG URLs, plus annotated layout diagrams. A small visual specimen is welcome; application implementation is not requested. State clearly whether the result is rendered/inspected or just proposed code. Do not write directly to the repository, open PRs or publish a site.

Mobile browsing should help users understand and choose; do not pretend a shrunk 1920×1080 screen has readable UI text. Specify zoom/focus behaviour and a sensible mobile adaptation/export path. Include keyboard interaction, visible focus, contrast, reduced motion and a 200% zoom plan; distinguish accessibility intent from actual testing.

### 4. Evaluate the stack separately

The owner asked whether we use “TanStack.” We currently do not. Compare:

- Improving the current UI structure/CSS and introducing clear reusable components within the existing stack.
- A bounded frontend move, such as Vite/React, if it materially reduces maintenance or interaction complexity.
- Relevant TanStack packages only where justified: Router, Query, Table and Start solve different problems. Verify current official documentation and distinguish them. TanStack is not an art direction or a visual component system.

Explain concrete gains, migration cost, bundle/build/offline implications, static Pages routing, saved-project compatibility and the shared renderer boundary. There is no current backend to justify a data-query stack by assumption. Do not propose SSR, accounts, hosted AI or a backend simply to modernise the look. Do not imply that modern tools necessarily improve the design, or that a small dependency-free app must remain unchanged forever.

### 5. Make the next slice implementable

Recommend a small first slice with visible before/after value. Identify files/layers likely to change, components to introduce, what to preserve and what to defer. Keep app-shell styles from unintentionally changing exported slides: `src/export.js` serialises document styles, and `tools/render.mjs` loads renderer assets from `index.html`. A global typography reset could alter PNGs even when a designer intended only to change navigation.

Define observable acceptance using the user jobs, including deep links, keyboard/filter history, narrow screens, local draft/import roundtrips, source/status honesty and representative PNG export checks through website/CLI/MCP. The existing check-worlds, unit, browser and MCP suites are regression evidence, not proof of good design. Propose a small formative trainer review without turning unavailable participants into a reason to withhold a reviewable prototype.

## Return format

1. Short verdict and the five most consequential design changes.
2. Evidence-based audit and proposed information architecture.
3. Reference comparison, two directions, recommendation and counterargument.
4. Worked screens and visual specimen/design specification using our real content.
5. Explicit stack decision with primary documentation and trade-offs.
6. Bounded implementation sequence, acceptance checks, risks and unresolved user questions.

Write the analysis in English and proposed UI labels/copy in German with Swiss spelling. Be candid about what you could inspect or validate. This is a design proposal for the next build, not an endorsement of the present UI and not permission to change the product.
