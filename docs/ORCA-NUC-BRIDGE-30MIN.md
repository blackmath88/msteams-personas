# Claude / Orca on NUC — 30-minute Slides as Code build

Status: ready-to-run implementation task. Preparing this file does not start a worker.
Date: 2026-10-29.

## Outcome

Take a substantial product bite in blackmath88/msteams-personas: build manual project authoring AND the AI-assistant bridge in the same 30-minute attempt. Deliver usable code, not another architecture proposal.

A trainer can create/adapt a three-slide sequence manually, or copy a guided brief to their usual AI assistant and import the returned project. Both routes converge on the same preview/editor/export and preserve stable entity identities.

## Start and authority

- On the NUC, inspect current local changes, worktrees, active workers and current origin/main. Preserve others' work.
- Start an isolated branch/worktree from current main. V3 was merged at 300e006; the planning baseline is 9468455. This task's commit is newer. Do not use the older prototype or V2 task as your baseline.
- Read AGENTS.md, docs/BUILD-PLAN.md, docs/SLIDES-AS-CODE-CONCEPT.md, docs/STATUS.md and the V3 handoff. The present task is the active implementation scope.
- This is direct Claude/Orca work. Do not dispatch or revive the archived Weavr Mission.
- 30 minutes TOTAL from start, including setup, coordination, tests and handoff. No new paid API services or model-provider integrations.
- Commit and push your implementation branch. No automatic merge, PR or deployment. Prior merge authorization concerned V3, not this new code.

## Work in parallel where it actually helps

Use the installed Orca orchestration contract; discover supported commands. The user authorizes at most TWO implementation workers, plus a coordinating Claude, only if supported and useful.

Before unattended dispatch, verify enforcement of the common absolute deadline, credential isolation and stop/settlement. No recursive delegation. If unsupported, build directly in the foreground; do not lose the attempt to runtime setup or claim a foreground prompt has an enforced timeout.

Suggested ownership after a quick coordinator-defined contract:
- Core lane: project contract, capabilities, validator, compiler adapter, fixtures and unit tests; new files only.
- UX lane: project workspace, guided brief, generated authoring pack, import review and repair UI; new files only.
- Coordinator owns existing index/app/model/export wiring, integration and final browser/export checks.
Use separate worktrees. Agree exact module signatures and fixture shape before lanes diverge. No worker edits another lane's files or generated screenshots. If coordination costs more than it saves, one builder delivers both paths.

## Required coherent capability set

Keep scope deep enough for real teaching material:
- Teams channel posts (chat if straightforward).
- Planner board using shared tasks.
- Principle slide with EDITABLE recommendation, boundary and facilitator notes.

Reuse existing renderers, slide composition, focus handling and PNG export. Start with Teams + Planner + Prinzip for one new business situation. Wider renderer support is optional after this path works. Do not try to support every catalogue screen in the new contract immediately.

## Deliverable 1 — complete portable projects

Implement a compact versioned, self-contained JSON project and capability registry:
- people, documents and tasks get stable IDs;
- modest normalization: scene-specific messages stay local;
- explicit before/after snapshots, complete for their included objects, without inheritance/patch chains;
- scenes select supported profile/state/objects;
- slides contain ordered presentation and editable teaching content;
- notes, source metadata and assumptions survive save/reopen.

Separate project version, capability version and renderer version. Define absence semantics; missing state is not implicitly deletion.

Provide a pure validator with structured diagnostics and a new-project compiler adapter to existing renderer view models. Do NOT insert imported data into curated global catalogues or infer identity from names/file titles.

Existing customisation-backup JSON remains a separate supported format. Preserve curated originals and old routes.

## Deliverable 2 — manual website route

Add clearly discoverable actions such as:
- “Beispiel anpassen”
- “Neue Abfolge”
- “Projekt öffnen”
- “Projekt sichern”

A normal trainer must create/adapt a small supported sequence through labelled controls without writing JSON. Start with useful templates/defaults, allow adding/reordering/removing supported slides and editing the core people, message/task and teaching text. Prefer existing UI patterns over a comprehensive editor.

The same project can be saved, reopened, changed and exported. Make unsupported operations explicit. Keep editing controls outside exported content.

## Deliverable 3 — AI-assistant bridge

Add “Mit deinem KI-Assistenten vorbereiten” beside the manual route.

One short form: audience, goal, context, optional duration. Default to a three-slide sequence. Retain the preparation session locally.

Show:
“Auftrag kopieren → Im KI-Assistenten vorbereiten → Ergebnis einfügen”.

Generate a compact versioned authoring pack from actual capabilities and the same schema/constraints used in validation:
- useful defaults and brief;
- a minimal complete example;
- only relevant supported profiles and text budgets;
- optional storyboard discussion, with permission to proceed using defaults;
- instruction to return one complete JSON project as a file or code block;
- fictional content and explicit product-behaviour assumptions;
- no claims of rendering/validation unless tools actually ran.

Must work without browsing, special attachment support, API keys or MCP setup. A pasted prompt is user-level guidance. Do not integrate an LLM backend.

## Deliverable 4 — safe import and usable recovery

Accept a JSON file, pasted raw JSON, or one unambiguous JSON code fence. Do not evaluate code or guess how to merge multiple blocks.

Validate before changing active state. Show a summary and open as a NEW draft; preserve unsaved work.

For unknown person references:
- explain the affected slide/task in ordinary language;
- offer an explicit person selector, not an automatic guess;
- offer a repair prompt with a preview of the content being copied;
- allow cancel/manual continuation.

A repair prompt asks for the whole corrected small project, preserving unrelated content. Rerun validation. Keep errors separate from nonblocking assumptions.

Reject unknown versions/screens, oversized inputs and imported HTML/JS/CSS execution. Source URLs are inert metadata; do not fetch arbitrary assets.

## Deliverable 5 — shared operations and export proof

Expose reusable operations for capabilities, validation, project compilation and slide preparation. Website and bridge must already use these same functions.

Add a small headless render proof or minimal validate/render script if achievable with the current harness. Do not spend this attempt polishing CLI packaging.

Stretch only after the full core path works:
- a feature-detected WebMCP adapter for capabilities/current-project/validate/load-draft using the shared operations;
- one additional supported application profile.
A browser-callable function is not a remote MCP server. Record actual integration status accurately.

Remote HTTP/MCP hosting and public infrastructure are OUT OF SCOPE for this attempt. Keep them in the architecture and document the adapter boundary.

## Build rhythm

0–4 min: inspect, define narrow contract and ownership.
4–19 min: build manual and assistant routes against the common core.
19–27 min: integrate, run focused checks, inspect browser and actual PNGs, repair.
27–30 min: commit, push and handoff.

Adapt timings to evidence. Prefer an end-to-end path early; do not spend the window polishing the schema. At the deadline checkpoint honestly. Do not run overlapping fallback work while a previous worker may still be active.

## Acceptance and verification

Demonstrate a NEW fictional organisation, not a renamed curated fixture:
1. Create/adapt the sequence manually.
2. Save and reopen the whole project.
3. Import an equivalent unseen project and inspect summary.
4. Change one person's name; all relevant views update.
5. Change only the after-state task owner; before stays unchanged.
6. Edit the recommendation, boundary and presenter notes.
7. Break a person reference, repair it via UI, and verify current work was preserved.
8. Export ordered Teams, Planner and principle PNGs; inspect actual files.
9. Confirm original library routes and backup imports still work.

Run repository content/model checks and meaningful tests for new imports/state/references. Use Chromium journey checks and keyboard/mobile smoke tests. Render malicious-looking text inertly; test unknown profile and truncated JSON. Await fonts/layout and share crop/density preparation between export paths.

Do not claim external-assistant interoperability from hand-authored fixtures. If real assistant access is unavailable, test the generated pack contract locally and leave an exact reproducible manual test.

## Handoff

Leave docs/BRIDGE-BUILD-HANDOFF.md:
- baseline/final commits and actual route/host;
- manual and assistant paths implemented;
- project/capability versions and supported profiles;
- tests actually run, screenshots and real sample exports;
- unfinished items and format limitations;
- whether actual cross-assistant testing occurred;
- any active/unsettled workers and next concrete action.

Update current status, but preserve historical evidence and mark claims precisely. End with a short product report. Begin implementation now.
