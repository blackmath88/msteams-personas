# Current status

Updated: 2026-10-29.

## Implemented and merged

main includes V3 at 300e00601606d295c6b0dd23933dc70452db654c, incorporating the earlier prototype and V2. There is no need to rebuild from a separate prototype branch.

Implemented: three-entry library, curated worlds/sequences, M365 interface families, targeted editing, presentation, focus crops, PNG sequence export, 2x output, browser-local persistence and customisation-backup JSON.

Independent review reran 17/17 model tests and the original atlas validator (0 errors, 0 warnings), and inspected selected actual exported images. The V3 builder reports 110/110 Chromium checks; this planning update did not independently repeat them. The legacy validator does not establish validity of a future portable-project contract.

See [V3 handoff](V3-BUILD-HANDOFF.md) for screen availability, evidence and known limitations. Readable imports and interface fidelity remain important product work.

## Planned, not implemented

[Slides as Code concept](SLIDES-AS-CODE-CONCEPT.md) and [active build plan](BUILD-PLAN.md) define:
- a portable, complete project format and shared domain operations;
- manual website authoring/import/review;
- a guided prompt/authoring-pack bridge to the user's existing AI assistant;
- optional CLI and hosted HTTP/remote MCP;
- progressive WebMCP browser assistance.

Existing JSON files are curated-situation override backups. They must not be advertised as arbitrary portable projects.

## Built on branch feat/cli-mcp-render (not merged)

Built 2026-10-30 on main `7d5f330`: validator hardening (null entries, typed fields, before/after-only states, shared-before meaning), all-or-nothing export with fit/render diagnostics, honest storage and draft-limit handling, one render operation for website/CLI/MCP, `tools/cli.mjs`, and an MCP server (official SDK v2, stdio + Streamable HTTP on localhost). Proved with the SDK client; no assistant host was tested. Evidence: [CLI/MCP handoff](CLI-MCP-HANDOFF.md).

## Merged to main: portable project authoring (`7d5f330`)

First increment of portable projects, built 2026-10-29: shared core `src/project-core.js` (format v1, capabilities v1: teams-posts, planner, prinzip-tasks), manual editor, assistant bridge with authoring pack, import review with person repair, save/reopen and PNG export at `#/projekt`. Evidence and limits: [bridge handoff](BRIDGE-BUILD-HANDOFF.md). No real cross-assistant test has been run yet.

## Earlier planning note: active next attempt

The user requests a larger 30-minute Claude/Orca build combining manual website project authoring and the external-assistant bridge on one shared project contract. See [executable task](ORCA-NUC-BRIDGE-30MIN.md). Core target: new-project Teams + Planner + Prinzip, editable teaching text, safe import/save/reopen, local reference repair and real exports. No runtime has been launched from this planning session.

## Next action

Use the supplied research disposition and start the 30-minute task from current main. Build manual and assistant routes together; prove one genuinely new scenario and preserve the existing library. Return the implementation branch and evidence for review.

The former V2 Orca task is historical. No builder was launched, runtime code changed or service deployed by this documentation update. The previous Weavr Mission remains archived; no Weavr action is requested here.
