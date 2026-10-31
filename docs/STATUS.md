# Current status

Updated: 2026-10-31.

## Implemented and merged

main includes V3 at 300e00601606d295c6b0dd23933dc70452db654c, incorporating the earlier prototype and V2. There is no need to rebuild from a separate prototype branch.

Implemented: three-entry library, curated worlds/sequences, M365 interface families, targeted editing, presentation, focus crops, PNG sequence export, 2x output, browser-local persistence and customisation-backup JSON.

Independent review reran 17/17 model tests and the original atlas validator (0 errors, 0 warnings), and inspected selected actual exported images. The V3 builder reports 110/110 Chromium checks; this planning update did not independently repeat them. The legacy validator does not establish validity of a future portable-project contract.

See [V3 handoff](V3-BUILD-HANDOFF.md) for screen availability, evidence and known limitations. Readable imports and interface fidelity remain important product work.

## Planned, not implemented

[Slides as Code concept](SLIDES-AS-CODE-CONCEPT.md) and [active build plan](BUILD-PLAN.md) retain hosting, authentication, a job service and remote deployment, plus a WebMCP browser adapter. Editable PPTX remains deferred. Local Streamable HTTP is built on the branch below; it is not a hosted service.

Customisation-backup JSON and portable-project JSON are separate formats with separate import paths.

## Built on branch feat/cli-mcp-render (not merged)

Built 2026-10-30 on main `7d5f330`, pushed as `0280a8c`, `7fbd75f` and `952640f`, pending PR and review: validator hardening (null entries, typed fields, before/after-only states, shared-before meaning), all-or-nothing export with fit/render diagnostics, honest storage and draft-limit handling, one render operation for website/CLI/MCP, `tools/cli.mjs`, and an MCP server (official SDK v2, stdio + Streamable HTTP on `127.0.0.1`). This implements slice 4 and only the local HTTP transport part of slice 5. Proved with the SDK client; assistant-host compatibility was not established by that run. Evidence: [CLI/MCP handoff](CLI-MCP-HANDOFF.md).

## Merged to main: portable project authoring (`7d5f330`)

First increment of portable projects, built 2026-10-29: shared core `src/project-core.js` (format v1, capabilities v1: teams-posts, planner, prinzip-tasks), manual editor, assistant bridge with authoring pack, import review with person repair, save/reopen and PNG export at `#/projekt`. Evidence and limits: [bridge handoff](BRIDGE-BUILD-HANDOFF.md). No real cross-assistant test has been run yet.

## Open verification and limits

- The real [Claude Code host test](HOST-TEST-CLAUDE-CODE.md) is in progress.
- The bridge trial with two real assistants and five observed trainer tasks remain open.
- A full keyboard and screen-reader pass on `#/projekt` remains open.
- Portable-project capabilities remain limited to `teams-posts`, `planner` and `prinzip-tasks`.
- Fit checks do not flag long Planner titles that wrap.

## Next actions

1. Review the pending CLI/MCP PR and merge after review.
2. Complete and review the [Claude Code host test](HOST-TEST-CLAUDE-CODE.md), in progress.
3. Run the cross-assistant bridge trial with two real assistants.
4. Add the next capability profile, Teams chat or Outlook, through the existing project contract.

The former V2 Orca task is historical. The previous Weavr Mission remains archived; no Weavr action is requested here.
