# Teams chat capability profile handoff

Built on 2026-10-31 in the Orca worker worktree `profile-teams-chat`, from `main` at `5a6ece61947b43d7dd54c2063c16faa29734d94f`. Changes are uncommitted for coordinator review. No other repository, backend, framework, dependencies or deployment changed.

## Contract

`projectVersion` stays 1. The catalogue, template, authoring pack and CLI/MCP capability reports now advertise `capabilityVersion: 2`; validation accepts both 1 and 2. A version 1 project using `teams-chat` gets `profile-version` at `scenes[i].profile`. The default sequence remains three slides; chat is optional.

The fourth profile is `teams-chat`, labelled «Teams: Chat zu zweit», using the existing `chat` renderer in an annotated slide:

```json
{
  "id": "sc-chat", "profile": "teams-chat", "team": "Crew Lichtblick",
  "viewer": "p-nela", "partner": "p-luca",
  "messages": [
    { "id": "m1", "by": "p-luca", "time": "13:47", "text": "Ich übernehme die Rampe.", "hint": "Samira sieht die Zusage nicht.", "decision": true }
  ],
  "notSeenBy": ["p-samira"]
}
```

Viewer and partner must exist and differ. Message authors must exist and belong to those two participants; `notSeenBy` references must exist. Messages need a nonempty list, IDs and text; optional time/hint fields accept text and decision accepts a boolean. Wrong JSON types produce located diagnostics rather than exceptions. Team names over 40 characters and message texts over 220 characters produce `long` warnings; more than 6 messages is an error.

Compilation produces `vm.chat` with viewer, partner, `generated:false`, empty others, `later` from `notSeenBy`, `laterLabel:null`, and messages containing by/time/text/mark/decision. Hints get consecutive marks and `vm.scene.notes`, just like post hints. Project chat notes use those hints; with no hints and some unseen people, the existing default sentence is retained. Curated chat rendering and notes stay on their previous path. Filenames remain `NN-<meta.id>-teams-chat.png`.

The editor adds chat slides, upgrades a version 1 draft to capability version 2 when adding chat, and edits team, viewer, partner, message text/time/author/hint/decision and unseen people. Participant changes update message authors and author choices; messages can be added or removed, with one retained and at most six added through the form. Person removal and explicit import repair account for every chat reference. Import review lists the new label automatically.

## Files changed

- `src/project-core.js`: registry, version compatibility, diagnostics (including safe JSON diagnostic text and own-property person lookup), compiler, compact authoring-pack guidance/snippet and person-reference replacement.
- `src/project-ui.js`: chat fields/actions, participant/author updates, boolean and unseen-person controls, reference protection, version upgrade and supported-profile copy.
- `src/m365-more.js`: project-only hint notes, preserving the curated default.
- `src/export.js`: chat message overflow detection by actual list/child bounds and scroll height.
- `tests/project.test.mjs`, `tests/teams-chat.test.mjs`, `tests/mcp-e2e.mjs`, `tests/project-journey.mjs`: version/profile expectations and new profile coverage.
- `examples/lichtblick-kulissenwechsel.project.json`: new fictional four-slide scenario.
- `docs/evidence-teams-chat/`: four PNGs, manifest and verification logs.
- `docs/screenshots/bridge/08-teams-chat-editor.png`: editor evidence.
- This handoff.

`src/project-render.js`, the CLI and MCP adapters need no alternate chat implementation: their existing shared compile/compose/export operation picks up the profile from the catalogue.

## Verification

Runtime: Node on the NUC, `/usr/bin/chromium`, `CHROMIUM=/usr/bin/chromium`; dependencies installed with `npm ci` (no lockfile change). Browser journeys use `python3 -m http.server 8766 --bind 127.0.0.1` from this worktree.

| Check | Final result |
|---|---|
| `node --test tests/` | **43/43**, including 11 chat tests covering valid scenes, v1 rejection, authors, participants, unknown references, budgets, JSON types, compiler output, notes and explicit repair |
| `node check-worlds.mjs` | **0 errors, 0 warnings** |
| `CHROMIUM=/usr/bin/chromium node tests/mcp-e2e.mjs` | **49/49**, stdio, HTTP, CLI, timeout and cleanup |
| `CHROMIUM=/usr/bin/chromium node tests/project-journey.mjs` | **51/51**, including 8 new chat checks for editing, message actions, export, overflow and import review |
| `CHROMIUM=/usr/bin/chromium node tests/journey.mjs` | **110/110**, including the existing curated screen/fit sweep |
| `CHROMIUM=/usr/bin/chromium node docs/evidence-teams-chat/atlas-smoke.mjs` | **15/15**, all five atlas worlds in heute, m365 and vergleich, no script errors |
| New example CLI render | **4/4 PNGs**, 1920×1080, no diagnostics |
| Tannwil regression guard | **3/3 `cmp` exit 0**, each regenerated CLI PNG also compared directly with the HEAD Git blob |
| `git diff --check` | Clean |

Logs live in `docs/evidence-teams-chat/{unit-tests,check-worlds,mcp-e2e,project-journey,library-journey,atlas-smoke,tannwil-regression}.txt`. The original evidence manifests/log and all regenerated tracked screenshots/bridge PNGs were restored; only the new chat screenshot remains. The static server was stopped after verification.

Initial verification attempts caught an overbroad test-expectation edit and an escaped-newline error in the new journey code, both corrected. Overlapping local Chromium checks also collided on the harness's default DevTools port and affected MCP cleanup assertions; the atlas smoke now requests port 0, and the final library and MCP runs were serial and passed. These final counts do not include the failed attempts.

## Export evidence and visual inspection

Command: `CHROMIUM=/usr/bin/chromium node tools/cli.mjs render examples/lichtblick-kulissenwechsel.project.json --out docs/evidence-teams-chat/`.

Result: 4/4 PNGs at 1920×1080, no diagnostics and empty fit lists. I opened and inspected every actual PNG:

1. `01-lichtblick-kulissenwechsel-teams-posts.png` (178387 bytes): Samira asks who will secure the ramp before the evening rehearsal; Nela says she will speak with Luca. Two numbered notes explain the missing owner and move into a private chat.
2. `02-lichtblick-kulissenwechsel-teams-chat.png` (180290 bytes): Nela's Teams view with Luca as partner, three alternating messages, Luca's promise to secure the ramp by 17:00 and Nela's promise to record it in the shared plan. Numbered hints explain that Samira cannot see the decision and that it needs a visible home.
3. `03-lichtblick-kulissenwechsel-planner.png` (160525 bytes): the shared «Abendprobe» bucket contains the ramp task assigned to Luca and the lighting task assigned to Samira, both with dates. The personal tool note is absent.
4. `04-lichtblick-kulissenwechsel-prinzip-tasks.png` (234668 bytes): three personal lists before, two shared tasks with owners/dates after, and the recommendation/boundary. The tool note remains personal.

Text, icons and numbered hints are visible; no message, note or principle text is clipped. The existing Teams silhouette and slide layout are reused without a CSS change.

## Limitations

This is a fictional two-person chat mock, without sending messages, attachments, reactions, group chats or permission simulation. `notSeenBy` supplies teaching context, not real access enforcement. Text budgets are character warnings; actual fit is checked during PNG export, so short text with many line breaks can still fail fit. Very long person names and unsupported layouts retain existing renderer limits. The full editor, editable PPTX, hosted MCP and deployment remain deferred; no assistant-host or screen-reader compatibility claim is added. Short chats leave an empty band above the first message on the slide; the focus-crop tightening used for curated chats does not remove it here. This is cosmetic and was noticed in coordinator review.
