# Custom task profiles: implementation and verification

Date: 2026-11-02. Branch: `feat/custom-todo-task-detail`. Baseline: `e324156432791c946e1bd300d324fd1eb6624e38`. Direct foreground implementation in the managed Linux workspace. No delegated workers, framework migration, merge, deployment or service changes.

## Delivered

Capability version 3 adds `planner-task` and `todo`. Project format stays at version 1. Capability-v1/v2 fixtures still validate and render without conversion. The default bicycle example remains three slides. The authoring pack describes the optional six-slide sequence and supplies both new scene shapes.

Shared path: ProjectCore capabilities → validation → compilation → existing `plantask` / `todo` renderers in `m365-more.js` → ProjectRender → website PNG, CLI, MCP. There is no separate MCP renderer. Task IDs remain in view models and application DOM projections.

## Contract

| Profile | Scene fields | Meaning |
| --- | --- | --- |
| `planner-task` | `team, state, task` | Select one task ID that is assigned to a person and has `list:"plan"` in that snapshot. |
| `todo` | `team, state, viewer, taskIds, personalListPrivate:true, myDaySelected:true` | Select 1–6 distinct existing IDs owned by that person in this snapshot. The view is «Mein Tag», with explicit personal selection. |
| To Do with a shared assignment | additionally `plannerConnected:true` | Assumes the same work account and an enabled/available Planner connection. |

`todo.dateLabel` is optional plain text. When absent the renderer uses «Für diesen Arbeitstag ausgewählt» instead of inventing a date. Sidebar counts describe the viewer's lists within the supplied snapshot; the central list shows the selected tasks.

The task title lives only in `tasks[]`. Snapshot fields remain canonical for every view:

```json
{
  "owner": "p-daniel",
  "list": "plan",
  "bucket": "Kommunikation",
  "due": "09.11.2026",
  "progress": "in-progress",
  "notes": "Freigegebenen Text und Anmeldelink versenden.",
  "checklist": [{"text":"Anmeldelink prüfen","done":false}],
  "comment": {"by":"p-sophie","text":"Text ist freigegeben."}
}
```

Progress values are `not-started`, `in-progress`, `completed`. Older `done` fields remain valid; specifying both with conflicting completion states is an error. Checklist progress is independent. Custom board checklist counts come from these actual items, replacing the old illustrative fixed count. Optional comments are escaped and their authors participate in reference repair and deletion protection.

The visual editor supports task selection, viewer/state selection, To Do task selection and explicit assumptions; notes/progress/checklists/comments edit the canonical snapshot. Adding profiles upgrades capability version without downgrading newer projects. Deleting a task referenced by these scenes is blocked until the selection is changed. Malformed imports, invalid owners and absent snapshot tasks produce located, actionable diagnostics.

## Training example and images

[Editable project](../examples/leadership-forum-six.project.json): fictional Campus & People Development / Leadership Forum, German with Swiss spelling, audience/goal/source, assumptions and presenter notes.

All six 1920 × 1080 PNGs below were returned by `retrieve_artifact` from the branch's local MCP server, not screenshots of proposed slide content:

1. [Teams chat](evidence-task-profiles/mcp/01-unibas-leadership-forum-pendenzen-teams-chat.png)
2. [Channel posts](evidence-task-profiles/mcp/02-unibas-leadership-forum-pendenzen-teams-posts.png)
3. [Planner board](evidence-task-profiles/mcp/03-unibas-leadership-forum-pendenzen-planner.png)
4. [Task details](evidence-task-profiles/mcp/04-unibas-leadership-forum-pendenzen-planner-task.png)
5. [To Do](evidence-task-profiles/mcp/05-unibas-leadership-forum-pendenzen-todo.png)
6. [Before/after](evidence-task-profiles/mcp/06-unibas-leadership-forum-pendenzen-prinzip-tasks.png)

[MCP call evidence](evidence-task-profiles/mcp/verification.json) records catalogue/example/validation/render and six retrieval calls. PNG signatures, dimensions and SHA-256 hashes were checked. Negative ownership and deliberately overflowing task notes were refused without output resource links. [Desktop editor](evidence-task-profiles/editor-desktop.png), [mobile editor](evidence-task-profiles/editor-mobile.png), [browser checks](evidence-task-profiles/browser-checks.json).

Visual inspection: all six have intact titles/content and no clipped teaching text. Details show the same invitation, Daniel, 9 November and checklist 1/3 as the board. To Do shows that invitation separately from Daniel's personal notes. App text remains smaller than teaching annotations; use full-screen in training. The dialog's board background is intentionally obscured. Fonts depend on the host's installed system fonts.

## Reproduce

Actual completed checks:

- Unit tests: **52/52**, including eight new task-profile tests for compatibility, shared identity, complete snapshots, personal/shared selection, ownership, assumptions, malformed JSON, budgets and repair.
- Existing authoring browser journey: **51/51**.
- Existing curated browser journey: **110/110**, including all university worlds, view/variant sweeps, desktop/mobile/zoom, PNG and 2× export.
- New browser journey: **11/11**, including six-slide import, canonical edits, completion, checklist authoring, invalid-selection recovery, reload, real six-PNG website export, mobile layout, new-profile creation and offline file opening.
- Existing MCP stdio/HTTP/CLI regression: **49/49** when run without other browser tests, including byte parity, negative inputs, timeout and cleanup.
- New six-slide MCP flow: capability/example discovery, validation without warnings, rendering and all six image retrievals passed; ownership and overflow negatives passed.
- All six CLI PNGs matched the retrieved MCP PNGs byte for byte: [parity report](evidence-task-profiles/cli-comparison.json).
- Legacy atlas validator: **0 errors, 0 warnings**. `git diff --check` passed.

The first broad MCP regression overlapped the curated browser sweep and its global cleanup assertion counted that unrelated browser. A sequential rerun passed 49/49. Initial browser checks ran in separate network namespaces from the static server; rerunning server and browser together resolved that environment issue. The new-profile default-selection failure found by the browser test was fixed before its successful rerun.

Logs are preserved in [evidence-task-profiles](evidence-task-profiles/). Historical screenshot sets regenerated by the regressions were restored, avoiding unrelated image churn.

```sh
npm ci
npm test
node check-worlds.mjs
node tools/cli.mjs validate examples/leadership-forum-six.project.json
node tools/cli.mjs render examples/leadership-forum-six.project.json --out ./slides
node tests/task-profiles-mcp.mjs
node tests/mcp-e2e.mjs
# Serve the repo and run browser journeys in the same local network environment:
python3 -m http.server 8766 --bind 127.0.0.1
# In that environment:
node tests/task-profiles-browser.mjs
node tests/project-journey.mjs
node tests/journey.mjs
```

Use `CHROMIUM` for an installed executable. Verification here used Node 24.22.1 and Chromium 153.0.8010.0. The runtime browser was supplied outside the repository; no production dependency was added. Run the broad MCP cleanup regression without other browser tests active, because its pre-existing global process check counts unrelated Chromium processes.

## Live-service handoff

The connected Mac plugin returned capabilityVersion 2 when inspected. Its running process cannot load these new profiles until an operator updates its existing checkout to reviewed code and restarts that Node MCP process using the host's existing service setup. The specific launchd label/path is not recorded in this repository, so no restart command is invented.

After restart call `get_capabilities`: expect capabilityVersion 3, projectVersion 1 and six profiles, including `planner-task` and `todo`. Refresh the ChatGPT app's tool metadata if it caches discovery. Then validate/render the fixture and retrieve all six PNGs. Existing clients using v1/v2 projects need no conversion.

The successful MCP demonstration in this handoff used a fresh local stdio server from this branch. It is not a claim that the connected Mac service or GitHub Pages was updated. Nothing was merged or deployed.

## Boundaries

Fictional teaching mock-ups, not tenant integration. No real task creation, account access, permission testing or live synchronisation. To Do currently supports the curated «Mein Tag» shell, not arbitrary list layouts. Priority is illustrative «Mittel»; up to five checklist items and one optional comment. No assignment to multiple owners, Planner Premium behaviours, automatic Chat-to-Planner transfer, or task-detail editing inside the rendered image. The editor changes the project, then re-renders.

Reference: [Microsoft Support](https://support.microsoft.com/en-us/planner/see-planner-tasks-in-microsoft-to-do), checked 2026-11-02, for enabling the connection and consciously adding an assigned Planner task to My Day. Tenant licensing/settings and feature rollout still need local verification.
