# Current status

Updated 2026-11-10. `main` is the integration branch for the viewer, portable projects, the CLI and the MCP server. PR #14 introduced the university collection; PR #15 adds the first administration/business reference pair and shared discovery.

## Available on main

- Two administration/technical-service reference stories, ten PNGs, two additional research briefs, shared domain/collaboration filters with legacy references, and CLI/MCP discovery. See [gallery](business-review/index.html), [handoff](BUSINESS-REFERENCE-HANDOFF.md) and the [published business examples](https://blackmath88.github.io/msteams-personas/index.html#/beispiele).

- Four researched higher-education group additions, twelve scenario records and six complete portable examples (32 PNGs). Meeting notes, cross-surface Loop tables and labelled workflows are capability 6. Discovery is shared by website, CLI `catalogue` and MCP `get_catalogue`. See the [morning gallery](morning-review/index.html) and [implementation handoff](PERSONA-SCENARIO-HANDOFF.md).

- The V3 library offers fictional application scenes, principle views, trainer sequences, browser-local editing and PNG export. See the [V3 handoff](V3-BUILD-HANDOFF.md).
- Portable projects use project format v1 and accept capability versions 1–6. They support Teams posts and chat, Planner boards and task details, To Do, task principles, and linked workspace maps and scenes, and the house overview and Teams comparison. See the [task profiles](TASK-PROFILES-HANDOFF.md) and [workspace explorer](WORKSPACE-PROFILE-HANDOFF.md).
- The [local CLI and MCP server](CLI-MCP-HANDOFF.md) share rendering with the website. The [deck component export](COMPONENTS-D1-HANDOFF.md) also renders individual M365 screens and excerpts with measured anchors.
- GitHub Pages serves the static website from `main`. CLI and MCP run separately. An installed MCP process must load this revision and restart before it advertises capability version 6 and `render_components`.

## Open

- Web UI redesign research: the content is ahead of the presentation. The [Perplexity redesign brief](research/PERPLEXITY-WEB-UI-REDESIGN-SPARRING.md) and [fresh screenshot baseline](research/ui-redesign-baseline/provenance.json) request concrete design directions and a separate stack decision. Documentation branch only; no redesigned UI is implemented.

- Practitioner feedback and live acceptance remain open for the administration/business pair. Trade follows, with engineering provisionally competing with manufacturing for fourth place.

- A real Microsoft tenant acceptance test and a real assistant-host trial for capability 6 remain unverified. Forms/Lists/Power Automate remain research only. Shared-component and workflow fields currently use JSON authoring; the form preserves them and exposes the limitation.

- Deck composition and editable PowerPoint generation are planned in [D2–D6](DECK-COMPONENTS-PLAN.md).
- Hosted job rendering and the WebMCP adapter remain planned. The current HTTP MCP transport runs locally.
- The [bridge trial](BRIDGE-TRIAL-2026-10-31.md) exposed a three-list fit limit that now blocks invalid projects. Retesting its repair flow with assistants and observing trainer tasks remain open, as does a full screen-reader pass.
