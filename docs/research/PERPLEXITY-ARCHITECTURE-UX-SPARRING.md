# Perplexity sparring prompt — Slides as Code architecture and trainer UX

Act as a critical product architect and UX researcher. Challenge the following proposal; do not simply endorse it. Research current primary sources and separate documented mechanisms from design judgement and untested hypotheses.

## Product and current baseline

Repository: https://github.com/blackmath88/msteams-personas
Read current main and especially docs/SLIDES-AS-CODE-CONCEPT.md, docs/BUILD-PLAN.md and docs/V3-BUILD-HANDOFF.md. If inaccessible, say so and use the context below; never claim you inspected code you could not read.

We have a working static, offline-capable German-language M365 training visual library. It renders fictional Teams posts/chat, Outlook, Explorer, SharePoint, OneDrive, Planner, To Do, conceptual principle diagrams and a clearly labelled AI recap simulation. There are curated worlds, teaching sequences, targeted editing, local customisation backups and real PNG export at Full HD and 2x.

There is no portable arbitrary-project authoring contract, CLI, WebMCP adapter, remote MCP server or hosted rendering service yet. Existing JSON backups are overrides of curated scenarios, not complete projects.

The audience is nontechnical M365 trainers, adoption specialists and consultants. They need believable teaching images and coherent sequences for PowerPoint without setting up dummy tenants. “Slides as Code” is a working umbrella name, not an instruction for trainers to program.

## Proposed direction

One versioned project format, capability catalogue, validator, renderer and export engine serve:
- a complete manual website;
- a no-connector bridge to the user's normal AI assistant;
- an optional CLI for local/cloud coding agents;
- hosted HTTP and remote MCP for connected agents;
- WebMCP for browser agents assisting within the website.

Bridge:
1. Choose an example or enter audience, objective, duration and context.
2. Copy/download a compact authoring pack and guided conversation prompt.
3. The user's usual assistant asks a few useful questions and proposes a storyboard.
4. After agreement, it returns a JSON project as a file or code block.
5. Import/paste into the website; review a summary, preview and edit.
6. If invalid, receive a precise repair message to take back to the assistant.
7. Export ordered images and save the editable project.

The pasted prompt is user-level guidance, not a real system message. No provider API, login or custom MCP setup is required for this route. The pack must work when the assistant cannot browse links.

The data model separates course/project, scenario entities, scene states, slide composition and presenter notes. Stable IDs connect people/documents/tasks across applications. Explicit snapshots allow before/after differences. Curated examples are reusable templates, but agents may author genuinely new situations using supported components.

## Questions to investigate

1. Is the bridge usable, or does copy/paste, JSON and repair impose too much work on nontechnical trainers? Compare it with structured manual editing, template adaptation, an in-site assistant and connected MCP. Include relevant evidence from import/export, bring-your-own-assistant and mixed-initiative authoring workflows.

2. What should the minimal portable format contain? Compare normalized entity graphs with scene-local content, full JSON Schema with compact guided formats, and complete projects with patch-based changes. Recommend how to preserve identity and snapshots without making small courses verbose. Do not assume JSON is automatically easiest for LLMs or humans.

3. How should the authoring pack balance context size, capability discovery and fidelity? Address assistants without browsing, file-generation support or structured-output guarantees; stale packs; unsupported screens; hallucinated references and repair loops.

4. Define the correct division among CLI, ordinary HTTP, remote MCP and Chrome WebMCP. Verify current browser/client availability and exact discovery/execution limitations from primary documentation. Is WebMCP appropriate for this stateful editor? What does each route fail to solve? Avoid treating WebMCP as a hosted MCP endpoint.

5. What is the smallest credible migration from browser globals and existing renderers? Compare incremental adapters with extracting a package or rewriting the application. Identify what must be shared and what can remain browser-specific.

6. Evaluate client-side export versus controlled headless rendering. Consider fonts, SVG/foreignObject, browser differences, overflow, reproducibility, offline use, annotations and export quality. Should PNG plus manifest come before PDF/PPTX? Distinguish image-based PPTX packaging from native editable slide objects.

7. For hosted rendering, compare a modest browser service/container with managed browser rendering, including a Cloudflare-based option. Use current official limits and pricing only where available; state retrieval date and workload assumptions. Do not invent cost estimates or assume serverless functions can run Chromium directly. Is a queue required initially or premature?

8. Examine data handling and public-service abuse proportionately: data-only imports, arbitrary URL fetching, resource exhaustion, per-job access, artifact retention and confidential course content. Propose a minimal viable design, not enterprise infrastructure by default.

9. Should the same operations exist on every route? Define meaningful parity while respecting local files, asynchronous server jobs and visible browser state. Identify where forcing parity would worsen UX.

10. Design a small validation study with real trainers and multiple accessible assistants. Measure time to first useful sequence, correction cycles, unaided completion, content consistency, output readability and teaching usefulness. What evidence should change our proposed build order?

## Requested output

A. A concise verdict with strongest reasons for and against the proposal.
B. A decision matrix of realistic architectures with UX friction, maintenance, interoperability, deployment complexity and evidence strength.
C. A recommended architecture and migration sequence sized to a small builder-led project.
D. A concrete nontechnical trainer journey, including an invalid import and recovery.
E. A minimal illustrative project structure with explicit people/document/task references and one before/after transition; label it a proposal, not an existing contract.
F. The ten most consequential failure modes, each with a proportionate mitigation and test.
G. A short user-study plan and stop/change criteria.
H. “Build now / defer / reject”, with reasons.
I. Source and uncertainty register.

Use current primary sources for protocol, browser, rendering and hosting claims, and credible research for UX claims. Cite claims directly, give relevant publication/update dates, flag unavailable evidence and separate technical capability from product recommendation.

Write the analysis in English; proposed user-facing labels in German with Swiss spelling. Be candid about unsupported assumptions. Do not write application code or turn this into a generic slide-generation startup plan.
