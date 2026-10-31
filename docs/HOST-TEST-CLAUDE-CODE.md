# Host test: msteams-personas MCP server in Claude Code

Date: 2026-10-31. Tester: a Claude Code agent acting as an ordinary assistant user of the server inside a Claude Code session, dispatched by an Orca coordinator (task `task_13c245992b12`).

This complements `docs/CLI-MCP-HANDOFF.md`, whose SDK-client test explicitly did not cover any real assistant host. This run connects one.

## Setup

| Item | Value |
|---|---|
| Host | Claude Code v2.1.303 (from the session's startup banner; the session itself exposes no version to the model) |
| Transport | stdio, local-scope registration for this project |
| Server command | `node /home/nuc/projects/msteams-personas/tools/mcp-server.mjs`, env `CHROMIUM=/usr/bin/chromium` |
| Protocol version | Not visible to the model. Claude Code does not surface the negotiated MCP protocol version in the tool listing or in results. |
| Branch | `feat/cli-mcp-render` (not switched) |
| Sample project | `examples/bibliothek-tannwil.project.json`, read with the Read tool and passed as a parsed JSON object |

The model had no shell access beyond the `orca orchestration` commands, so no files were copied and no sha256 was recomputed here. The coordinator verifies the PNGs afterwards against the hashes listed below.

## 1. Tool discovery

All five tools were visible through the MCP connection, under the expected names:

- `mcp__msteams-personas__get_capabilities`
- `mcp__msteams-personas__get_example`
- `mcp__msteams-personas__validate_project`
- `mcp__msteams-personas__render_project`
- `mcp__msteams-personas__retrieve_artifact`

Claude Code lists MCP tools as **deferred tools**: only the names are in context at startup, and the model has to load the schemas with its `ToolSearch` tool before the first call. That worked in one step for all five. The server's `instructions` string (the "Creates fictional Microsoft 365 training slides ... Typical flow: get_capabilities, get_example, adapt the example, validate_project until ok, render_project ..." text) was shown in the system prompt under "MCP Server Instructions", so the intended call order was known before any call.

Schemas as the host presented them:

| Tool | Input schema seen by the host |
|---|---|
| `get_capabilities` | no parameters |
| `get_example` | no parameters |
| `validate_project` | `project` (object, required) with description "The project as a JSON object (format "msteams-personas/project"). Use get_example ... get_capabilities ..." |
| `render_project` | `project` (object, required, same description), `scale` (1 or 2, "1 (default) or 2") |
| `retrieve_artifact` | `renderId` (string, pattern `^r-[0-9a-f]{16}$`, required), `file` (string, maxLength 120, required); neither parameter has a description |

Another registered server (`plugin:github`) failed to connect in this session with an authorization error. That is unrelated to msteams-personas and did not affect it.

## 2. Tool calls

Claude Code shows the model no per-call wall-clock time. Durations below come from the server's own manifest (`durationMs`, `renderedAt`) and from the timestamps the host put into the names of the saved image blobs. Calls not covered by those sources are marked "fast", meaning they returned without noticeable delay in the same turn.

### 2.1 get_capabilities

- Input: none.
- Result: one JSON text block with `format`, `projectVersion` 1, `capabilityVersion` 1, `rendererVersion` "v3", `stateIds` `["before","after"]`, three profiles (`teams-posts`, `planner`, `prinzip-tasks`) with `label`, `renderer`, `needs` and `budgets`, `limits` (people 8, tasks 12, documents 8, slides 6, presenterNotes 1200), `output` (1920x1080, image/png, scales 1 and 2), `inputLimitBytes` 204800 and a `semantics` sentence.
- Duration: fast.
- Friction from a host's point of view:
  - `budgets` mixes character limits (`postText: 220`) with counts (`posts: 4`, `tasks: 8`) under one key. A host has to guess which is which from the magnitude; a `maxChars` / `maxItems` split would remove the guess.
  - `needs` lists scene fields (`team`, `channel`, `posts`, `state`, `before`, `after`), but the `prinzip-tasks` teaching text block lives on the **slide**, not on the scene. Capabilities give no hint of that; only the example shows it. One sentence in `semantics` or a `slideFields` entry per profile would help a host that skips `get_example`.
  - The result was delivered as text only. If the server also sends `structuredContent` (the handoff says so), Claude Code did not show it separately, so nothing was lost, but nothing was gained either.

### 2.2 get_example

- Input: none.
- Result: a complete valid project, "Velotech Werkstätten (fiktiv)", 4 people, 1 document, 4 tasks, states `before` and `after`, 3 scenes and 3 slides, as one JSON text block.
- Duration: fast.
- Friction: none. The example is small enough to read whole and shows every field the three profiles need, including `teaching` on the third slide and `document` on a post. The description "Adapt it rather than writing from scratch" is the right instruction for a host.

### 2.3 validate_project, valid project

- Input: the Tannwil project from `examples/bibliothek-tannwil.project.json`, passed as a parsed object (not a string).
- Result:

```json
{"ok":true,"errors":[],"warnings":[],"summary":{"title":"Ausleihe-Rückstände gemeinsam abbauen","slides":[
 {"index":0,"id":"s-kanal","file":"01-bibliothek-tannwil-ausleihe-teams-posts.png"},
 {"index":1,"id":"s-plan","file":"02-bibliothek-tannwil-ausleihe-planner.png"},
 {"index":2,"id":"s-prinzip","file":"03-bibliothek-tannwil-ausleihe-prinzip-tasks.png"}]}}
```

- Duration: fast.
- Friction: none. The summary already names the files a render will produce, which lets a host plan the `retrieve_artifact` calls before rendering.

### 2.4 validate_project, deliberately broken copy

- Input: the same project with two changes: `meta.organisation` set to the number `42`, and the first post's `by` set to the unknown person id `p-niemand`.
- Result:

```json
{"ok":false,"errors":[
 {"code":"type","path":"meta.organisation","message":"Angaben zur Abfolge: «organisation» muss Text sein.","severity":"error","expected":"string"},
 {"code":"unknown-person","path":"scenes[0].posts[0].by","message":"Teams-Beitrag 1: Die Person «p-niemand» gibt es in diesem Projekt nicht.","severity":"error","ref":"p-niemand","where":"Teams-Beitrag 1"}
],"warnings":[]}
```

- Duration: fast.
- Observations:
  - Both errors are located with a JSON path and a machine-readable `code`; `expected` and `ref` make them repairable without reading the German message. This is what a host needs.
  - Messages are German only. A host working in English can still act on `code`, `path`, `expected` and `ref`, so this is acceptable, but worth stating in the tool description.
  - The result came back as a normal (non-error) tool result with `ok: false`, not as an MCP `isError`. That is the right choice for validation: the call succeeded, the project did not.

### 2.5 render_project

- Input: the Tannwil project as a parsed object, no `scale` (default 1).
- Result, in this order as shown by Claude Code: four resource links, then the manifest as JSON text.

| Slide | id | profile | file | bytes | sha256 |
|---|---|---|---|---|---|
| 1 | s-kanal | teams-posts | 01-bibliothek-tannwil-ausleihe-teams-posts.png | 187517 | `70c8ee3b7b07886fe43e0c170224941b61578d9e0a50bcb17cdec4ddda1e70fc` |
| 2 | s-plan | planner | 02-bibliothek-tannwil-ausleihe-planner.png | 172849 | `6f30071d4271779a24ba6ef6ff56819f90f8b53f27d1304ea9581079dd4157d1` |
| 3 | s-prinzip | prinzip-tasks | 03-bibliothek-tannwil-ausleihe-prinzip-tasks.png | 256948 | `4e2fc4b66f4a7b84254ae9410bdb56f995f0bb3cb46e6af0a172ffaa71bcf089` |

  - `renderId`: **`r-1fd2ff73fbde6e1f`**
  - `manifestUri`: `mtp://renders/r-1fd2ff73fbde6e1f/manifest.json`
  - Resource links: `mtp://renders/r-1fd2ff73fbde6e1f/<file>` for the three PNGs and `manifest.json`
  - `ok: true`, `stage: "done"`, 1920x1080, `fit: []` on every slide, `diagnostics: []`
  - `durationMs`: 2593, `renderedAt`: 2026-10-31T15:23:25.155Z
  - No inline base64 in the result; the whole result is a few KB.
- Wall-clock: the server reports 2.6 s for the render itself. The host shows no timing, but the call returned within the same turn with no perceptible wait beyond that. The retrieve calls that followed were saved by the host at 15:23:28.5Z, 15:23:29.5Z and 15:23:30.5Z, so the full render-then-fetch sequence took about 5.5 s from the end of the render to the third image.
- Friction:
  - Claude Code renders each `resource_link` as the text `[Resource link: <name>] mtp://...`. The model cannot open an `mtp://` link directly; it would have to use Claude Code's separate `ReadMcpResourceTool`, which is also a deferred tool. In practice `retrieve_artifact` is the path a host will take, and it worked. The links are still useful as stable identifiers.
  - The `scale` parameter's `anyOf` of two `const` values renders fine in the host; no confusion.

### 2.6 retrieve_artifact, three PNGs

- Input: `renderId` `r-1fd2ff73fbde6e1f` and each file name from the manifest; the three calls were issued in parallel in one turn.
- Result per call: one image content block plus one JSON text block repeating that slide's manifest entry (`index`, `id`, `profile`, `file`, `width`, `height`, `bytes`, `fit`, `sha256`). The `sha256` values matched the manifest exactly.
- **The images were shown to the model as real images.** Claude Code saved each image blob to its tool-results folder and presented it visually. What I saw:
  - **Slide 1, Teams** "Microsoft Teams · Bibliothek Tannwil / Ausleihe-Rückstände gemeinsam abbauen": a Teams window with the left rail (Aktivität, Chat, Teams, Kalender, Anrufe, OneDrive, Apps), the team "Bibliothek Tannwil" with channel "Ausleihe" and three member avatars RZ, SO, MG. Post 1 by Samuel Okafor at 17:48, "Übergabe Mittwoch", with an Excel attachment card "Mahnliste Oktober.xlsx" (path Bibliothek Tannwil › Dokumente › Ausleihe). Post 2 by Mia Gerber at 09:12 with the reply text. Orange numbered markers 1 and 2 on the posts, and a right column "WAS HIER ZU SEHEN IST" listing the two hints. Footer "Fiktives Beispiel · nachgebildete Oberfläche, kein Produkt von Microsoft".
  - **Slide 2, Planner** "Planner · Bibliothek Tannwil": Board view of plan "Bibliothek Tannwil", one bucket "Diese Woche" with three cards: "Zweite Mahnung Klasse 4b versenden" (Sa 9.11., MG), "Reservation Fernleihe abholen lassen" (Fr 8.11., MG), "Bücherkiste Altersheim zusammenstellen" (Fr 8.11., RZ). "Neue Etiketten bestellen" is correctly absent because it stays personal. One marker with the hint about person, deadline and bucket.
  - **Slide 3, Prinzip** "Was andere übernehmen, gehört in den Plan" with the question line. Left panel HEUTE "Verpflichtungen in persönlichen Listen": Samuel's list (Mahnung, Etiketten), Mia's list (Reservation), each "nur für diese Person sichtbar", and below them "Schon im gemeinsamen Plan" with Bücherkiste and Renate Zürcher, then "Wer erledigt was bis wann?". Arrow to the right panel FÜR DIESE SITUATION "Gemeinsame Verantwortung sichtbar" with "Plan Bibliothek Tannwil" holding all three plan tasks with owner and date, "für alle Beteiligten sichtbar" and "Persönliche To-dos bleiben in der eigenen Liste". Bottom: EMPFEHLUNG HIER and GRENZE boxes with the authored texts.
- Duration: about 1 s per image as seen from the host's blob timestamps (15:23:28.5Z, 15:23:29.5Z, 15:23:30.5Z), even though the three calls were sent together. Claude Code appears to run MCP calls to one stdio server sequentially.
- Friction: none in the result. See section 3 for the missing parameter descriptions.

### 2.7 retrieve_artifact, manifest.json

- Input: `renderId` `r-1fd2ff73fbde6e1f`, `file` `manifest.json`.
- Result: the manifest as pretty-printed JSON text, identical in content to the `render_project` result minus `renderId`, `manifestUri` and the per-slide `uri` fields. Same three sha256 values as above.
- Duration: fast.

### 2.8 retrieve_artifact, negative check

- Input: `renderId` `r-1fd2ff73fbde6e1f`, `file` `../manifest.json`.
- Result: an MCP tool error, shown by the host as `No artifact "../manifest.json" in render "r-1fd2ff73fbde6e1f".`
- Observation: the refusal is clear and names both inputs; no stack trace, no path leak.

## 3. Friction and suggestions

No bug was found. Everything that the handoff promised for an MCP client held up in this host. The points below are polish, ordered by value.

1. **`retrieve_artifact` parameters have no descriptions.** The host shows `renderId` (pattern) and `file` (maxLength 120) with nothing else. Add `description` to both, for example "renderId from render_project" and "a file name listed in that render's manifest, or manifest.json". The tool-level description covers this, but hosts that show parameters first will benefit.
2. **`budgets` in `get_capabilities` mixes characters and counts.** Either split into `maxChars` and `maxItems`, or add one line to `semantics` saying that `posts` and `tasks` are counts and the rest are character budgets.
3. **Say where `teaching` lives.** Capabilities describe scenes only; the teaching block sits on the slide. A `slideFields` entry for `prinzip-tasks` or a sentence in `semantics` would spare a host that skips `get_example`.
4. **State the language of diagnostics.** Add "messages are German; use code, path, expected and ref programmatically" to the `validate_project` description so an English-speaking host does not treat the messages as opaque.
5. **Resource links are passive in Claude Code.** This is a host property, not a server bug. Keeping `retrieve_artifact` as the documented primary path for images (as the server instructions already do) is right. The handoff's client configuration example for Claude Code can now be marked as tested for stdio.
6. **Host does not expose protocol version or timings.** For future host tests, the server could add `protocolVersion` (as negotiated) and a server-side `receivedAt` to `get_capabilities` or the manifest, so a report like this one does not have to infer timings from blob file names.

## What this proves / does not prove

**Proves**

- The stdio server registered at local scope is discovered by Claude Code v2.1.303, all five tools are callable, and the server `instructions` reach the model.
- `validate_project` accepts a parsed JSON object from the host and returns located, coded diagnostics for both a valid project and a broken one (`type` on `meta.organisation`, `unknown-person` on `scenes[0].posts[0].by`).
- `render_project` renders the Tannwil project in about 2.6 s to three 1920x1080 PNGs under render `r-1fd2ff73fbde6e1f`, with resource links and a manifest carrying per-slide sha256 values, and without inline base64.
- `retrieve_artifact` returns each PNG as an image the model can actually see and read, plus the manifest as JSON. The per-slide sha256 values in the retrieve results match the manifest. Path traversal is refused.
- Rendered content matches the project: the shared-before task "Bücherkiste" appears under "Schon im gemeinsamen Plan", "Etiketten" stays personal and is absent from the Planner board, the Excel card is shown on the first post.

**Does not prove**

- Streamable HTTP in this host. Only stdio was registered.
- The negotiated protocol version, or behaviour in Claude Desktop, ChatGPT, Copilot or any other host.
- Scale 2 rendering, the overflow (`fit`) failure path, the 20-render pruning or the input size limit through this host. These are covered by `tests/mcp-e2e.mjs` with the SDK client only.
- Reading artifacts via `resources/read` from Claude Code. `ReadMcpResourceTool` exists in the host but was not used in this run.

## Coordinator verification

The coordinator copied the render from `$TMPDIR/msteams-personas-artifacts/r-1fd2ff73fbde6e1f/` into [evidence-host-claude-code](evidence-host-claude-code/) and checked it:

- Each PNG's sha256 matches the manifest and the values the host reported.
- Each PNG is 1920x1080, the manifest has `ok: true` and no diagnostics.
- All three PNGs are byte-identical to the CLI render in `docs/evidence-cli-mcp/cli/`. Website, CLI, SDK-client MCP and Claude Code MCP therefore produce the same files for this project.
- The Claude Code stdio configuration example in the CLI/MCP handoff is now tested. The HTTP example is still untested in a host.

## Hashes

| renderId | file | sha256 |
|---|---|---|
| r-1fd2ff73fbde6e1f | 01-bibliothek-tannwil-ausleihe-teams-posts.png | 70c8ee3b7b07886fe43e0c170224941b61578d9e0a50bcb17cdec4ddda1e70fc |
| r-1fd2ff73fbde6e1f | 02-bibliothek-tannwil-ausleihe-planner.png | 6f30071d4271779a24ba6ef6ff56819f90f8b53f27d1304ea9581079dd4157d1 |
| r-1fd2ff73fbde6e1f | 03-bibliothek-tannwil-ausleihe-prinzip-tasks.png | 4e2fc4b66f4a7b84254ae9410bdb56f995f0bb3cb46e6af0a172ffaa71bcf089 |

Artifacts are under the server's default `MTP_ARTIFACT_DIR` (`$TMPDIR/msteams-personas-artifacts/r-1fd2ff73fbde6e1f/`) unless the environment overrides it. Renders are pruned after 20, so copy them before further renders.
