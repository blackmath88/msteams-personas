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

## Merged to main: render operation, CLI and local MCP (`5a6ece6`)

Built 2026-10-30 on main `7d5f330` and merged on 2026-10-31 via PR #3: validator hardening (null entries, typed fields, before/after-only states, shared-before meaning), all-or-nothing export with fit/render diagnostics, honest storage and draft-limit handling, one render operation for website/CLI/MCP, `tools/cli.mjs`, and an MCP server (official SDK v2, stdio + Streamable HTTP on `127.0.0.1`). This implements slice 4 and only the local HTTP transport part of slice 5. Proved with the SDK client, then in Claude Code over stdio ([host test](HOST-TEST-CLAUDE-CODE.md)). Evidence: [CLI/MCP handoff](CLI-MCP-HANDOFF.md).

## Merged to main: portable project authoring (`7d5f330`)

First increment of portable projects, built 2026-10-29: shared core `src/project-core.js` (format v1, capabilities v1: teams-posts, planner, prinzip-tasks), manual editor, assistant bridge with authoring pack, import review with person repair, save/reopen and PNG export at `#/projekt`. Evidence and limits: [bridge handoff](BRIDGE-BUILD-HANDOFF.md). No real cross-assistant test has been run yet.

## Built on branches, pending review (2026-10-31)

- **Teams chat profile** (this branch): `teams-chat` is the fourth portable-project profile, with capabilityVersion 2. Version 1 projects stay valid. Validator, compiler, notes, fit check, editor and authoring pack are covered. Evidence: [handoff](TEAMS-CHAT-PROFILE-HANDOFF.md).
- **Bridge trial** (PR #4): Claude Code without tools and Codex CLI each answered two fictional briefs from the unchanged pack. All 4 answers validated and rendered without repair or manual edits. In 2 of 4, a fourth personal list silently disappeared from the Prinzip slide while its task still appeared in the plan. Report: `docs/BRIDGE-TRIAL-2026-10-31.md` on that branch.

## Open verification and limits

- The MCP server passed a real [Claude Code host test](HOST-TEST-CLAUDE-CODE.md) over stdio on 2026-10-31. Other hosts and HTTP in a host remain untested.
- Five observed trainer tasks and a test in consumer chat UIs remain open. The repair path was not triggered in the bridge trial.
- A full keyboard and screen-reader pass on `#/projekt` remains open.
- Portable-project capabilities are `teams-posts`, `planner` and `prinzip-tasks` on main, plus `teams-chat` on the pending branch. No Outlook or files profile yet.
- More than three personal lists before only produce a warning, and the Prinzip slide drops the extra lists.
- Fit checks do not flag long Planner titles that wrap.

## Next actions

1. Review and merge the bridge-trial PR and the Teams chat PR.
2. Close the Prinzip gap the trial found: refuse or visibly handle more than three personal lists, and add the trial's pack wording fixes.
3. Run the five observed trainer tasks.
4. Optionally apply the small MCP polish points from the [host test](HOST-TEST-CLAUDE-CODE.md).

The former V2 Orca task is historical. The previous Weavr Mission remains archived; no Weavr action is requested here.
