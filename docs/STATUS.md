# Current status

Updated 2026-11-09 (feature branch; draft PR, not deployed). `main` is the integration branch for the viewer, portable projects, the CLI and the MCP server.

## Available on this feature branch

- Four researched higher-education group additions, twelve scenario records and six complete portable examples (32 PNGs). Meeting notes, cross-surface Loop tables and labelled workflows are capability 6. Discovery is shared by website, CLI `catalogue` and MCP `get_catalogue`. See the [morning gallery](morning-review/index.html) and [implementation handoff](PERSONA-SCENARIO-HANDOFF.md).

- The V3 library offers fictional application scenes, principle views, trainer sequences, browser-local editing and PNG export. See the [V3 handoff](V3-BUILD-HANDOFF.md).
- Portable projects use project format v1 and accept capability versions 1–6. They support Teams posts and chat, Planner boards and task details, To Do, task principles, and linked workspace maps and scenes, and the house overview and Teams comparison. See the [task profiles](TASK-PROFILES-HANDOFF.md) and [workspace explorer](WORKSPACE-PROFILE-HANDOFF.md).
- The [local CLI and MCP server](CLI-MCP-HANDOFF.md) share rendering with the website. The [deck component export](COMPONENTS-D1-HANDOFF.md) also renders individual M365 screens and excerpts with measured anchors.
- GitHub Pages serves the static website from `main`. CLI and MCP run separately. An installed MCP process must load this revision and restart before it advertises capability version 6 and `render_components`.

## Open

- A real Microsoft tenant acceptance test and a real assistant-host trial for capability 6 remain unverified. Forms/Lists/Power Automate remain research only. Shared-component and workflow fields currently use JSON authoring; the form preserves them and exposes the limitation.

- Deck composition and editable PowerPoint generation are planned in [D2–D6](DECK-COMPONENTS-PLAN.md).
- Hosted job rendering and the WebMCP adapter remain planned. The current HTTP MCP transport runs locally.
- The [bridge trial](BRIDGE-TRIAL-2026-10-31.md) exposed a three-list fit limit that now blocks invalid projects. Retesting its repair flow with assistants and observing trainer tasks remain open, as does a full screen-reader pass.
