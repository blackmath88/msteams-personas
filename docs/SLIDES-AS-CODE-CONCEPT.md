# Slides as Code — portable M365 teaching projects

Date: 2026-10-29. Status: agreed product direction; architecture proposal awaiting external challenge. No agent interface or hosted service is implemented by this document.

## Promise and audience

Create convincing fictional M365 application scenes and conceptual explainers for training without preparing a real tenant. Nontechnical trainers use the website independently; agents can author the same material through a portable project format, CLI and connected tools.

“Slides as Code” is the umbrella concept and working name, not a repository rename or a claim of trademark availability. M365 adoption visuals are the first application. Code is an implementation idea, not something trainers must learn.

## Three equally supported routes

1. Website: browse, compose, edit, preview, save and export without AI or connector setup.
2. Agent bridge: prepare the teaching project in the user's usual AI assistant, then paste/upload its structured output into the website.
3. Direct integration: agents use a CLI or remote MCP/HTTP interface to submit the same project and retrieve outputs.

WebMCP adds browser-agent assistance within the website. It is distinct from a remotely connected MCP server. None of these routes should have a separate scenario model, renderer or reduced content vocabulary. Execution and file-delivery mechanics may differ by host.

The repo is documentation, source and a self-hosting route. A repo URL alone does not grant an agent a browser runtime, shell, network access or MCP connection.

## The bridge is a first-class product workflow

User-facing label to test: “Mit deinem KI-Assistenten vorbereiten”.

1. Start: choose an example or enter a short teaching brief on the website.
2. Prepare: generate a task-specific prompt and optional downloadable authoring pack.
3. Discuss: paste into the user's normal assistant. It asks a few useful questions and proposes a storyboard before producing project data.
4. Return: paste the output or upload a project file. Show a human-readable summary before applying it to a new local draft.
5. Review: inspect scene thumbnails, teaching objectives, assumptions and warnings; edit everything supported through the normal website.
6. Repair: show precise errors and offer a copyable repair message containing only the necessary diagnostics and user-selected project content.
7. Export/reuse: export slides and the portable project; reopen it later.

A pasted prompt is a user-level instruction, not a real system prompt. It cannot guarantee a provider's behaviour or replace validation. The workflow must still work when the assistant cannot browse the repo or generate attachments.

### Authoring pack

Generate a compact pack from the supported capabilities, not a hand-maintained schema copied into several prompts. Include:
- pack, project-format and capability versions;
- the trainer's brief, selected example and explicit constraints;
- a concise authoring guide with a minimal complete example;
- supported screen profiles, limits and composition options;
- the project schema or a compact relevant subset, with the full schema downloadable;
- fictional-content rules, contextual alternatives and source/assumption handling;
- the expected output contract and repair procedure.

Offer copy and download. A complete offline pack is the fallback for assistants unable to follow URLs. Allow a larger reference pack on demand; do not overload the default prompt with the entire catalogue.

### Conversational method

The assistant should:
- learn audience, learning goal, duration, organisational context, required applications and desired output;
- ask at most three high-value questions initially, offer useful defaults and label assumptions;
- suggest a short storyboard in ordinary language;
- obtain the trainer's agreement on the storyboard or follow an explicit “use defaults and proceed” instruction;
- create coherent fictional people, artefacts and tasks using stable IDs;
- generate a complete project using only supported capabilities;
- explain uncertainties and distinguish a product-like simulation from verified product behaviour;
- never claim rendering, validation or file creation occurred unless the relevant tool actually ran.

For chat-only use, request a downloadable JSON file when supported, otherwise one JSON code block containing only the project. The website must not depend on any provider's special writing blocks or file links.

## Shared domain contract

Separate:
- Project/course: locale, title, audience, learning objectives, format version and ordered sequences.
- Scenario: people, working context, memberships, access assumptions, relationships and entities.
- Scene: a supported application/profile, selected objects and explicit before/after state.
- Slide: scene or principle reference, title, framing, annotations, notes and output settings.

Documents and tasks have stable IDs. Copies, versions and snapshots are explicit relationships, not accidental name matching. A before/after sequence may show a task changing owner or status; stable identity does not mean every scene shows the same state. Display names may change without breaking references.

Principles and facilitator notes are editable content bound to the scenario, not hidden hardcoded prose. Include source URLs, observation dates, assumptions and simulation labels where needed; keep citations separate from fictional messages.

Curated examples are immutable starting points. Users can instantiate, adapt, combine supported patterns or author a new scenario without editing renderer code.

The current v1 customisations JSON stores overrides to curated situations. It is not the new portable project format. Import it through an explicitly identified compatibility path; never reinterpret it silently as a complete project.

## Shared engine and adapters

Core operations: catalogue/capabilities, create/instantiate, validate, compile a project to renderer view models, compose slides and inspect layout.

Existing src/model.js is a compatibility adapter; renderers rely on browser globals and legacy shapes. Introduce a new-project adapter first and preserve legacy routes. Do not perform a framework rewrite or migrate all content before the first new-project vertical slice works.

Website, CLI, WebMCP and remote MCP/HTTP call the same domain operations. Browser-specific rendering lives behind an export runner; domain validation should not require launching Chromium.

CLI is an optional local or automated interface, not a prerequisite for trainers. WebMCP is a progressive browser enhancement. Remote MCP and HTTP are thin service adapters over a shared job service, not separate rendering systems.

Hosted rendering is the target for agents without local execution. Select hosting after a deployment spike; cloud browser support, memory, duration, font installation, costs and file delivery must be measured. Existing Cloudflare use is context, not proof every rendering workload belongs there.

## Results and reliability

Return project, ordered PNGs, preview/contact sheet and manifest with slide IDs, filenames, dimensions, renderer/profile versions, warnings and job result. Presenter notes stay available even when omitted from the visual.

Distinguish structural validity, semantic consistency, visual fit and pedagogical quality. A schema-valid project is not necessarily good training material.

Pin the render environment and locally available font assets; fix dates/locale/theme. Aim for reproducible output within a documented environment, not unsupported byte-identical cross-platform promises.

Use data-only imports: no executable JS/HTML or arbitrary asset fetching. Validate structure, references, supported versions and size limits before touching the active project. Imports create a reviewable draft; they do not overwrite unsaved work. Hosted jobs need scoped access, bounded resource use and explicit storage/deletion policy before public launch.

## Boundaries

No automatic connection to Microsoft, tenant access, LLM API, public deployment or paid service provisioning. The user's external assistant authors content; our engine validates and renders. An in-site AI assistant is a separately approved capability and operating cost.

PPTX packaging is a later adapter; initial PNG outputs satisfy the existing PowerPoint workflow. Do not imply PNG-based PPTX slides have editable native application shapes.

## Evidence to challenge

- Chrome WebMCP overview: https://developer.chrome.com/docs/ai/webmcp
- Imperative API: https://developer.chrome.com/docs/ai/webmcp/imperative-api
- MCP specification: https://modelcontextprotocol.io/specification
- Browser screenshot reproducibility: https://playwright.dev/docs/test-snapshots

WebMCP pages inspected 2026-10-29; the overview describes experimental availability and site-visit discovery. Recheck current client support and protocol versions during implementation.

The bridge's usability, completion rate, format portability and naming are hypotheses requiring user tests. See the research sparring prompt.
