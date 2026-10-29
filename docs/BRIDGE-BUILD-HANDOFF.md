# Handoff: manual project authoring and AI-assistant bridge (first increment)

Date: 2026-10-29. Builder: Claude (Opus 5.5) in Claude Code on the NUC, working directly in the foreground.
Branch: `feat/bridge-authoring`, baseline `21120a129082081d804ccb7aa91d7bc685a5759c` (task commit on main). Final commit: see `git log` on the branch; pushed, not merged, no PR, not deployed.

## Workers

None. I built directly, with no Orca workers. With one shared contract, three new files and about 30 minutes, coordinating two lanes would have cost more than it saved. No active or unsettled workers remain. The local static test server (`python3 -m http.server 8766`) was stopped at the end.

## Route and host

Static, local: `index.html#/projekt` (served with `python3 -m http.server 8766 --bind 127.0.0.1`). Entry points:
- the header link «Eigene Abfolge»;
- a landing-page action «Eigene Abfolge erstellen».

| Route | Page |
|---|---|
| `#/projekt` | start: «Beispiel anpassen», «Neue Abfolge», «Mit deinem KI-Assistenten vorbereiten», «Projekt öffnen» (file) and «Ergebnis einfügen» (paste), plus drafts in this browser |
| `#/projekt/bearbeiten` | editor with live previews, «Projekt sichern» (JSON download) and «Alle Folien als PNG» |
| `#/projekt/ki` | brief (audience, goal, context, optional duration) → «Auftrag kopieren → Im KI-Assistenten vorbereiten → Ergebnis einfügen» |
| `#/projekt/import` | import review: summary, errors, warnings, person replacement, repair prompt, open as a new draft or cancel |

## What is implemented

**Shared core**: `src/project-core.js`. It is pure and has no DOM, network or storage. The same file loads in the browser (`window.ProjectCore`) and in Node (`require`).
- **Format and versions.** The format is `msteams-personas/project`, with `projectVersion` 1, `capabilityVersion` 1 and a separate `RENDERER_VERSION` `v3` that is informational only.
- **Capability registry.** Three profiles, each with text budgets:
  - `teams-posts` (Teams channel posts);
  - `planner` (board of the shared plan);
  - `prinzip-tasks` (principle «Aufgaben», before/after).
  - Limits: 8 people, 12 tasks, 8 documents, 6 slides.
- **Model.**
  - People, documents and tasks have stable IDs.
  - Posts stay local to their scene.
  - `states` are complete before/after snapshots that hold each task's owner, list (`personal` or `plan`), bucket and due date.
  - Scenes select a profile and a state.
  - Slides are ordered and carry `presenterNotes`. A Prinzip slide carries `teaching`: title, question, problem, recommendation and boundary.
  - `meta` holds the source, assumptions and notes.
- **Absence semantics.** A task missing from a snapshot is not shown in that state. It is neither deleted nor inherited. There are no patch chains.
- **Operations.**
  - `validate` returns structured diagnostics (`code`, `path`, German `message`, `ref`), with errors kept separate from non-blocking warnings.
  - `parseInput` accepts a file's text, raw JSON or exactly one JSON code fence. It rejects several blocks, a truncated block and input over 200 KB.
  - `compile` turns a project into the existing V3 view model.
  - `slidePlan` and `fileName` support export.
  - `authoringPack` builds the assistant brief and `repairPrompt` the correction request.
  - `replacePersonRef`, `template` and `blank` support editing and new projects.
- **Template.** A new fictional organisation, «Velotech Werkstätten», for a workshop shift handover. It is not a renamed curated fixture.

**Website**: `src/project-ui.js` and `src/project.css`. The only edits to existing files are the router line and links in `src/app.js` and `index.html`.
- **Manual editing through labelled fields, with no JSON.**
  - Sequence title, organisation, audience, goal, assumptions and notes.
  - People: add, rename, remove. Removal is refused while the person is still referenced.
  - Tasks with before and after placement, as «Persönliche Liste», «Gemeinsamer Plan» or «Nicht gezeigt», plus person, bucket and due date.
  - Slides: add from the capability list, move up or down, remove.
  - Post author, time, subject, text and on-slide hint; principle teaching text; presenter notes.
- **Validation and preview.** Validation runs live above the form, and every slide preview updates as you type.
- **Unsupported operations** are named in the editor: other screens, replies, images and custom layouts.
- **Drafts.** They are kept in `localStorage` under `mtp.projects`, which is separate from the existing customisation-backup keys. An import always opens as a new draft and never overwrites existing work.
- **Export.** It uses the library's own path, `Export.compose` → `densify`/`tighten` → `toPNG` after `document.fonts.ready`. Editing controls are never part of a slide.
- **Assistant bridge.** The pack is generated from the live capability registry and the same rules the validator uses. It contains:
  - the brief;
  - the default three-slide order;
  - permission to propose a storyboard or continue with the defaults;
  - «GENAU EIN» JSON project, as a file or a single block;
  - fictional content and Swiss spelling;
  - ID and reference rules, absence semantics and per-profile budgets;
  - M365 assumptions to go in `meta.assumptions`;
  - a ban on claiming that rendering or validation happened;
  - no HTML, CSS, scripts or URLs;
  - a complete example that itself validates.

  The brief is kept locally, and the pack needs no browsing, attachments, API keys or MCP.
- **Repair.**
  - An unknown person is explained by location, for example «Teams-Beitrag 2: Die Person «p-elena-k» gibt es in diesem Projekt nicht.».
  - An explicit selector, starting at «Bitte wählen …», replaces the reference. There is no automatic guess.
  - The copyable repair prompt is shown in full before copying. It asks for the whole corrected project and for unrelated content to be preserved.
  - After a replacement the project is validated again.
  - «Trotzdem öffnen und von Hand korrigieren» and «Abbrechen» are offered.
- **Inert content.** All imported text is escaped. Source fields are inert metadata, and nothing is fetched.

**One renderer change** in `src/views.js`, opt-in. The curated Prinzip «Aufgaben» diagram copies the first shared task into its owner's personal list on the before side. For a project that misstated the before snapshot: Aylin appeared to hold a task that the before state assigns to Marco. Compiled projects now set `exactBefore: true`, which skips that copy. Curated situations render exactly as before.

## Tests actually run (on this branch)

| Command | Result |
|---|---|
| `node --test tests/` | **27/27**: 17 existing model tests plus 10 new `tests/project.test.mjs` |
| `node check-worlds.mjs` | 0 errors, 0 warnings |
| `node tests/project-journey.mjs` (Chromium, new) | **34/34**; covers all nine acceptance steps; see below |
| `node tests/journey.mjs` (Chromium, existing library) | see the final line of this section |

The project journey checks:
- **Step 1.** Adapt the example: the editor opens with three previews (Teams, Planner, Prinzip), and a title edit reaches the heading and the slide.
- **Step 2.** Save and reopen through the real file input: the import review shows no errors, the project opens as a new draft, and its JSON is byte-identical.
- **Step 3.** Import the unseen assistant-style reply `tests/fixtures/pflege-uebergabe.reply.md` (Spital Seeblick, nursing handover) with prose around one fence. The summary shows title, organisation, slides and assumptions, and earlier drafts are kept.
- **Step 4.** Rename Aylin: the Teams post author, the Planner avatar initials (AD → AY) and the Prinzip lists all follow.
- **Step 5.** Change only the after-state owner: Prinzip shows Lina in the plan and Marco still holding the task in his before list.
- **Step 6.** Edit the recommendation, boundary and presenter notes: all three reach the preview.
- **Step 7.** Break `by` in a post: the error is located, there is no guess, opening is blocked, and the repair prompt is previewed. Repair through the selector revalidates cleanly, and existing drafts are byte-identical before and after.
- **Step 8.** Export: three ordered PNGs at 1920×1080, 160–240 KB each.
- **Step 9.** `#/abfolgen` and a curated Prinzip presentation still render.
- **Other checks:**
  - reordering slides;
  - no editing controls inside slides;
  - markup (`<img onerror>`, `<script>`) renders as text, with no element created and no script run;
  - truncated JSON gives a clear error;
  - an unknown profile is blocked;
  - 390 px editor and assistant pages without horizontal scroll;
  - no script errors.

Keyboard: the routes use native buttons, inputs and selects. The journey confirms that «Beispiel anpassen» takes focus. The CDP helper sends no character events, so activation is tested by click; a full Tab walk was not done.

Existing library journey (`node tests/journey.mjs`), rerun on this branch: **110/110**. It regenerates `docs/screenshots/`; I kept only the two landing screenshots, which show the new link, and restored the rest.

## Evidence files

- **Real PNG exports** (inspected visually): `docs/png-samples-bridge/01-velotech-werkstatt-uebergabe-teams-posts.png`, `02-…-planner.png`, `03-…-prinzip-tasks.png`.
- **Screenshots**: `docs/screenshots/bridge/` — 01 start, 02 editor at 1440 px, 03 assistant, 04 import summary, 05 repair, 06 editor at 390 px.
- `docs/screenshots/01-landing-desktop.png` was regenerated by the existing journey and shows the new landing action.

## Cross-assistant testing

**None occurred.** The fixture reply was written by hand to look like an assistant answer, so it does not show that any real assistant produces valid projects. Reproducible manual test:

1. Open `#/projekt/ki`, fill in the four fields and press «Auftrag kopieren».
2. Paste the text into ChatGPT, Copilot, Claude or Gemini as one message, without attachments. Answer any questions, or say «weiter mit Standard».
3. Copy the whole answer, including surrounding prose, into «Ergebnis einfügen» and press «Prüfen».
4. Record the assistant and model, whether one block came back, the errors and warnings, how many repair rounds were needed, and the exported PNGs.

## Not done and format limitations

- **Profiles.** Only three: no chat, Outlook, files, To Do or Planner task detail. There are no post replies, images, documents beyond attachment names, or custom layouts.
- **States.** Fixed to the IDs `before` and `after` in the editor. The format allows up to four, but the editor shows only these two.
- **Teaching text.** Prinzip text sits on the slide, not in a scene, so two Prinzip slides cannot share it.
- **Validation.** Budgets are character counts and produce warnings only. Fit is still checked by the existing `fitIssues` and density logic at render time.
- **IDs and replacement.** The editor creates IDs (`p-3`, `t-5`) and never derives them from names. A person replacement rewrites every reference to that ID; there is no per-occurrence choice.
- **Not built (stretch).** No WebMCP adapter, CLI, headless validate/render script outside the browser, hosted HTTP or remote MCP. `ProjectCore` is a browser- and Node-callable module, not an MCP server.
- **Coverage.** Mobile was checked only for overflow at 390 px. No screen-reader pass was done.
- **Backup format.** The customisation-backup JSON format is untouched and still separate. Its import was covered only by the existing library journey.

## Next concrete action

Run the manual cross-assistant test above with two different assistants, and adjust the pack wording based on what actually fails.
