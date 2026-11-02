# Active build plan — Slides as Code and the AI-assistant bridge

Updated: 2026-10-31. Slices 1–4 are built and merged on main (`5a6ece6`); slice 5 is partial and slice 6 is not built. A fourth profile (`teams-chat`) and the first bridge trial are on branches pending review.

## Completed attempt: manual authoring and assistant bridge

The [30-minute Claude/Orca task](ORCA-NUC-BRIDGE-30MIN.md) delivered portable-project authoring and the assistant bridge, merged at `7d5f330`. See the [bridge handoff](BRIDGE-BUILD-HANDOFF.md) for implementation, evidence and limits. The follow-up shared render operation, CLI and local MCP server are merged at `5a6ece6`; see the [CLI/MCP handoff](CLI-MCP-HANDOFF.md).

Completion of these builds does not establish every acceptance claim below. Consumer chat UI tests, five observed trainer tasks and full keyboard/screen-reader pass remain open. The MCP server passed a [Claude Code host test](HOST-TEST-CLAUDE-CODE.md) over stdio; other hosts are untested. Portable projects support only `teams-posts`, `planner` and `prinzip-tasks`; fit checks do not flag wrapping Planner titles.

Research disposition: see the [decision note](research/BRIDGE-RESEARCH-DECISIONS.md). The numbered slices below retain their intended scope and acceptance criteria; their state lines distinguish delivered implementation from remaining work.

## Baseline and precedence

main includes the complete V3 trainer library, merged at `300e006`, and portable-project authoring plus the assistant bridge at `7d5f330`. Fetch and inspect current main before implementing; do not restart from the earlier atlas or prototype branches.

Read [concept and architecture](SLIDES-AS-CODE-CONCEPT.md), [current status](STATUS.md), [V3 evidence](V3-BUILD-HANDOFF.md), the existing UX/fidelity references and repository instructions.

This plan supersedes the old instruction to build V2 from a separate prototype. The archived Weavr attempt and docs/ORCA-NUC-BUILD-TASK.md are historical. No build, Mission, dispatch, merge or deployment is authorized merely by this plan.

## Outcome

A nontechnical trainer discusses a course with their usual AI assistant, imports a new project into the website, edits it visually and exports a coherent slide sequence. The same portable project is usable through the website, CLI and local MCP interfaces, with hosted MCP deferred.

Preserve V3's library, all existing routes/content/variants, local saves, JSON customisation backups, scenarios and exports.

## Slice 0 — challenge and choose

Use [the research prompt](research/PERPLEXITY-ARCHITECTURE-UX-SPARRING.md) to challenge the bridge, contract size, browser/server split, hosting and integration order.

Deliver a short decision record: chosen first vertical slice, alternatives rejected, unresolved questions and measurable user-test tasks. Research must not block a small reversible proof indefinitely.

Gate: architecture decisions identify evidence versus hypotheses. No unnecessary backend, framework migration or schema platform.

## Slice 1 — portable projects and a new-scenario proof

State: Built and merged on main (`e660d44`, `7d5f330`), with three profiles. The `teams-chat` profile (capabilityVersion 2) is on a branch pending review.

- Define a versioned JSON schema, supported-capability catalogue and structured diagnostics.
- Separate entity IDs, state snapshots, scene projections and slide composition.
- Add a pure validator for structure, references, enum/profile availability and limits.
- Add an adapter from an entirely new project into current renderer view models.
- Provide three hand-authored valid examples and negative fixtures: an SME onboarding sequence, a research collaboration sequence and personal/shared tasks.
- Keep current curated content through the existing adapter. Legacy customisation files retain their own import path and identity.
- Start with a coherent capability subset (Teams posts/chat, Planner and principle slides); accurately advertise what new-project mode can render. Expand through the same contract.

Acceptance:
A new fictional organisation, people and artefacts render at least three connected scenes without changing source fixtures or renderer code. Unknown references, future versions and unsupported screens produce actionable errors. Display-name changes preserve identity; before/after states remain distinct.

## Slice 2 — website project lifecycle and import UX

State: Built and merged on main (`7d5f330`); full keyboard/screen-reader verification remains open.

- New draft, open/paste/import, summary/preview, edit, save project and reopen.
- Keep curated originals immutable; never replace active unsaved work without an explicit user choice.
- Human-readable diagnostics linked to scene/slide and field, not raw schema traces alone.
- Reject executable data; use escaped text and bounded input. Never evaluate imported scripts.
- All fields required for the accepted authoring subset must be editable or explicitly marked as preserved read-only metadata; no silently discarded content.
- Continue supporting the old override backup files with clear labelling.

Acceptance:
A trainer imports an unseen example, reviews its scope, changes a person and a task, exports it and reopens the saved project with order, notes and identities intact. Invalid import leaves existing work intact. Keyboard, narrow screens and 200% zoom remain usable.

## Slice 3 — assistant bridge, first public-facing milestone

State: Built and merged on main (`7d5f330`). A first two-assistant CLI trial passed technically 4/4 (PR #4); consumer chat UIs, the repair path and the five observed trainer tasks remain open.

- Add “Mit deinem KI-Assistenten vorbereiten” as a secondary action beside manual authoring.
- A short brief captures audience, goal, duration, context and applications using useful defaults.
- Generate a compact versioned authoring pack from the actual capability catalogue.
- Provide copy prompt and downloadable pack; no connector, account or API key required.
- Include storyboard-first guidance, fictional examples, declared assumptions and output instructions.
- Support JSON attachment or pasted JSON in one code fence, with an explicit supported parsing path. Never silently reinterpret ambiguous prose as a valid course.
- Offer an error-specific repair prompt with a preview of what data will be copied.
- Distinguish prompt generation, external discussion, import validation and actual rendering.

Acceptance:
Trial with at least two accessible assistant environments, including one without browsing/tools. Record exact prompt/pack version, failures, manual interventions, time and output quality. If access is unavailable, provide a reproducible test protocol and label the cross-provider result unverified.

Conduct at least five observed trainer tasks before claiming low friction. Initial target to test: three of five trainers reach an exported three-slide sequence without developer help. Treat this as an experiment threshold, not a statistical product claim.

## Slice 4 — headless render runner and CLI

State: Built and merged on main via PR #3 (`5a6ece6`); see the [CLI/MCP handoff](CLI-MCP-HANDOFF.md) for delivered commands, outputs and proof.

- Expose shared domain operations independently of UI events.
- Add catalogue, validate, preview and render commands with structured output and documented exit codes.
- Headless Chromium uses a controlled internal render entry point, not click automation of the authoring UI.
- Await fonts/layout and return PNGs, editable project, preview/contact sheet and manifest.
- Report structural errors, visual-fit errors and intentionally cropped content distinctly.
- Document runtime prerequisites and allow the browser executable to be selected explicitly.
- Use the same renderer/profile versions and composition path as the website.

Acceptance:
A clean checkout can validate and render a new-project fixture noninteractively. Compare website and CLI outputs in the same environment. Verify downloaded image bytes/dimensions and inspect exports. Test malformed content, long names, missing assets and timeout cleanup.

## Slice 5 — hosted job service, HTTP and remote MCP

State: Partial: local Streamable HTTP on `127.0.0.1` exists on main; hosting, authentication and a job service are not built.

This is a planned integration, not approval to buy services or publish infrastructure.

- Run a small hosting spike with the real browser, fonts and representative sequences.
- Measure job duration, memory, concurrency, artifact sizes and cost assumptions.
- Define create job, status, cancel and result delivery; support retries without duplicate jobs.
- Store only what is necessary and set explicit retention and access rules.
- Keep discovery/validation lightweight; bound render work and isolate job data.
- Expose capabilities, catalogue, validate, preview/export and job status via HTTP and remote MCP over the same handlers.
- Choose and document the current MCP protocol/SDK and client compatibility; do not invent a custom MCP-shaped API.
- Include artifact retrieval appropriate to target clients; avoid returning entire decks as huge inline base64 payloads.
- Keep local/offline website rendering available.

Acceptance:
An external test client submits a custom project, retrieves previews and ordered assets, receives useful failure diagnostics and cannot access another job's artifacts. An MCP client and an HTTP client produce equivalent results. Production exposure waits for explicit deployment authorization.

## Slice 6 — WebMCP browser adapter

State: Not built.

Can proceed after shared domain operations stabilize; it does not depend on hosted rendering.

- Feature-detect the current browser API and use the same input schemas and operations.
- Expose catalogue, current project, create/load draft, update scene, validate, preview and export.
- Keep agent changes visible and reviewable in the workspace.
- Respect cancellation, page lifecycle and deliberate save/download semantics.
- No support means the normal website still works.

Acceptance:
A compatible browser agent modifies a scene and exports it through registered tools without brittle DOM selectors. Test a browser without WebMCP and record the tested experimental/browser configuration. Do not advertise universal assistant support.

## Cross-cutting verification

Preserve existing model, content and browser checks. The legacy validator covers the original atlas; extend validation to new projects rather than assuming its green result covers the new contract.

Test schema evolution, unsafe text, broken identity links, before/after snapshots, unsupported profiles, long text, import round trips and cancellation. Inspect actual PNGs, notes/assumptions and slide order. A fit check is not proof of UI fidelity or teaching quality.

## Deferred

In-site generative AI, tenant integration, general arbitrary HTML generation, editable native PPTX shapes, public deployment and a broad framework migration. Additional catalogue screens remain useful but must not obscure the bridge's end-to-end acceptance.

## Handoff

Each implementation slice reports exact baseline/final commits, completed routes, format/capability versions, tests actually run, screenshots/export samples, known limitations and next action. Keep this plan and STATUS aligned with the actual state.
