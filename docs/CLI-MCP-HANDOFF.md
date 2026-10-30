# Handoff: shared render operation, CLI and MCP (first increment)

Date: 2026-10-30. Builder: Claude (Opus 5.5) in Claude Code on the NUC, working directly with no Orca workers.

## Branch and commits

- **Branch:** `feat/cli-mcp-render`, pushed and not merged. No PR, nothing deployed.
- **Baseline:** `origin/main` at `7d5f330041c423b3b2e8ae9dc7ed027f81f32597`, the merged authoring branch.
- **Commits:** see the "Commits" section at the end of this file.

## What a trainer and an agent can do now

| Route | Entry | Uses |
|---|---|---|
| Website, by hand or with the user's chat assistant | `index.html#/projekt` | `ProjectCore` + `ProjectRender` in the page |
| CLI | `node tools/cli.mjs …` | `tools/ops.mjs` → `tools/render.mjs` → the same `ProjectRender` in headless Chromium |
| MCP, stdio or Streamable HTTP | `node tools/mcp-server.mjs [--http]` | the same `tools/ops.mjs` functions as the CLI |

All routes share one design:
- **One project format and one validator:** `src/project-core.js`.
- **One render operation:** `src/project-render.js` runs compile → `Export.compose` → `densify`/`tighten` → `fitIssues` → `toPNG`.
- **No second renderer.** The Node side serves a controlled internal page, which is `index.html`'s stylesheets, icon sprite and renderer scripts without the authoring UI and router. It calls `ProjectRender.renderAll()` in that page.
- **Verified.** The PNGs are byte-identical whether they come from the website export, the CLI, MCP over stdio or MCP over HTTP (see Tests).

## 1. Blockers fixed (with regressions)

| Baseline problem | Now | Regression |
|---|---|---|
| `people: [null]`, null posts, scenes, slides or state entries crashed `validate`/`summary` | Non-object entries are a located `bad-entry` error. `validate` and `summary` never throw for any JSON value. | `tests/project.test.mjs`: "null and non-object entries…" |
| Wrongly typed metadata passed (organisation 42, `assumptions: "x"`, `fictional: "ja"`) | Typed checks (`code: "type"`, `expected`) on meta, people, posts, states, slides and teaching | "incorrectly typed metadata…" |
| Custom state IDs validated but broke the editor's before/after assumptions | Exactly the states `before` and `after` are accepted (`state-ids`). Prinzip must use before→after (`prinzip-states`). The Planner may use either. The editor refuses structurally broken drafts instead of crashing. | "only the before/after states…" |
| A before-state task in the shared plan was drawn in the owner's personal list | Only `list: "personal"` fills personal lists. Shared tasks from before appear as «Schon im gemeinsamen Plan». Applies to compiled projects only (`exactBefore`); curated slides are unchanged. | "a task already in the shared plan before…", plus the browser journey on the Tannwil project |
| More than three personal lists were silently cut | Warning `prinzip-lists` | "more personal lists…" |
| The export could skip a slide (`if (!el) return`) and still announce success | **All-or-nothing.** Validation errors, a compose failure, a fit issue (`Export.fitIssues`) or a PNG failure give `ok: false` with diagnostics per slide. No download happens, and the status reads «Export abgebrochen, keine Datei erzeugt». | Journey: "export: invalid project refused…", e2e: fit failure |
| «Funktioniert mit jedem Chat-Assistenten» | Replaced with: intended for chat assistants that accept a longer brief; no guarantee; the website checks every result | — |
| A failed `localStorage` write was swallowed, and the 9th draft silently deleted the oldest | Storage failures show a visible alert with «Projekt sichern» advice. Unreadable stored data is kept under `mtp.projects.unlesbar`. At 8 drafts nothing is added until the user removes one with the new «entfernen» button. | Journey: "storage failure…", "draft limit…" |
| «Trotzdem öffnen» was offered for errors the editor cannot show | Offered only for field-level errors (unknown person, missing text and similar) | — |

## 2. Render operation

`tools/render.mjs` → `renderProject(project, { outDir, scale, timeoutMs })` runs these steps:
1. `ProjectCore.validate`. An invalid project returns `stage: "validate"`, and no browser is started.
2. A static server starts on `127.0.0.1:<random>`. It answers GET only, for `src/`, `assets/` and `worlds.js`, plus the generated `/render.html`.
3. Chromium is launched through `tools/cdp.mjs`, the existing journey harness, which moved from `tests/` and is re-exported there. It runs `--headless=new` at a fixed 1920×1080, with its own profile and DevTools port 0.
4. `ProjectRender.renderAll(project, { dataUrl: true, scale })` runs in the page and awaits `document.fonts.ready`.
5. Only when every slide succeeded are the ordered PNGs and `manifest.json` written. A failed write removes any partial files.
6. **Cleanup, in `finally`:** `Browser.close`, then SIGTERM, then SIGKILL; then the profile and Chromium's scratch directories are removed; then the page server closes. This also happens on a timeout that fires while Chromium is still starting.

**Manifest** (`format: msteams-personas/render-manifest`, `manifestVersion` 1):
- `ok` and `stage`;
- `rendererVersion`, `projectVersion`, `capabilityVersion`;
- `project {id, title}`, `width`, `height`, `durationMs`;
- `slides[] {index, id, profile, file, width, height, bytes, fit, sha256}`;
- `diagnostics[] {code, path, message, severity, slide?}`;
- `renderedAt`.

**Diagnostic codes added for rendering:**
- `fit`;
- `compose`;
- `render`;
- `page-error`;
- `timeout`;
- `write`;
- `scale`.

## 3. CLI

```sh
npm install            # once; the website itself needs no install
node tools/cli.mjs capabilities
node tools/cli.mjs example --out project.json
node tools/cli.mjs validate project.json        # or "-" for stdin; accepts one ```json fence too
node tools/cli.mjs render project.json --out ./slides [--scale 2] [--timeout 60000]
```

- **stdout** carries only JSON: capabilities, the example, `{ok, errors, warnings, summary}`, or the manifest.
- **stderr** carries human messages.
- **Exit codes:**

| Code | Meaning |
|---|---|
| 0 | ok |
| 1 | project invalid |
| 2 | usage error or unreadable input (no JSON, truncated, several blocks, over 200 KB) |
| 3 | render failed (fit, browser, timeout, write) |

- **Chromium:** use `CHROMIUM=/path/to/chrome` if it is not on PATH as `chromium`.
- **`npm run`:** `package.json` has no `"type"` field (so `src/*.js` stay CommonJS/UMD), and a `bin` entry `mtp` points to `tools/cli.mjs`.

## 4. MCP server

- **SDK:** the official TypeScript SDK v2, `@modelcontextprotocol/server` 2.4.0, `@modelcontextprotocol/node` 2.1.2 and `zod` 4. It was checked against https://ts.sdk.modelcontextprotocol.io/ (v2 is the current stable line and implements the 2026-07-28 spec; `serveStdio` and `createMcpHandler` replace the v1 transport wiring).
- **Transports:** one file, `tools/mcp-server.mjs`.
  - **stdio** is the default (`serveStdio`).
  - **Streamable HTTP** runs with `--http [--port 8787] [--host 127.0.0.1]`: `createMcpHandler` plus `toNodeHandler` on `node:http`, at path `/mcp`, bound to 127.0.0.1. The `localhostHostValidation`/`localhostOriginValidation` guards answer 403 to foreign Host or Origin headers (DNS rebinding).
  - The HTTP handler is stateless: a fresh server instance per request, with artifacts on disk.

| Tool | Input | Result |
|---|---|---|
| `get_capabilities` | — | profiles, budgets, limits, `stateIds`, output size, versions (`structuredContent`) |
| `get_example` | — | a complete valid project |
| `validate_project` | `{ project }` (JSON object) | `{ok, errors, warnings, summary}` |
| `render_project` | `{ project, scale? }` | manifest plus `renderId`, one `resource_link` per PNG plus one for `manifest.json`; `isError` with diagnostics on failure |
| `retrieve_artifact` | `{ renderId, file }` | one PNG as `image` content, or the manifest text |

**Resources:**
- **Template:** `mtp://renders/{renderId}/{file}`.
- **Listable:** `resources/list` shows all kept renders.
- **Reading:** `resources/read` returns a PNG as a base64 `blob` or the manifest as text.

**Safety limits:**
- Projects are accepted only as JSON objects, never as paths.
- Render IDs are generated by the server (`r-` + 16 hex). Directories are created under `MTP_ARTIFACT_DIR`, by default `$TMPDIR/msteams-personas-artifacts`.
- A file name resolves only if it is listed in that render's `manifest.json`. Traversal strings and unknown IDs are refused (tested).
- **Limits:**
  - input 200 KB;
  - 6 slides and the other capability limits;
  - 1920×1080 at scale 1 or 2 only;
  - one render at a time;
  - a 90 s timeout;
  - at most 20 kept renders, oldest removed first.
- Failed renders keep nothing.
- Render results stay small (about 3 KB); images are fetched one at a time.

### Client configuration examples (not tested with these hosts)

Claude Code (stdio, or HTTP while the server runs):

```sh
claude mcp add msteams-personas -- node /home/nuc/projects/msteams-personas/tools/mcp-server.mjs
claude mcp add --transport http msteams-personas http://127.0.0.1:8787/mcp
```

Desktop clients that use an `mcpServers` JSON block:

```json
{ "mcpServers": { "msteams-personas": { "command": "node", "args": ["/home/nuc/projects/msteams-personas/tools/mcp-server.mjs"], "env": { "CHROMIUM": "chromium" } } } }
```

## 5. Workflow proof

- **Sample project:** `examples/bibliothek-tannwil.project.json`.
  - It is new and fictional: «Gemeindebibliothek Tannwil», a lending backlog across part-time shifts.
  - It has three slides: Teams posts with an attachment → Planner → Prinzip.
  - One task, «Bücherkiste», is in the shared plan **before**, and one, «Etiketten», stays personal **after**.
- **Render-failure fixture:** `tests/fixtures/overflow.project.json` has 8 long posts.
- **Evidence** in `docs/evidence-cli-mcp/`:
  - `mcp-stdio/`: the three PNGs and manifest, read via MCP `resources/read` over stdio;
  - `mcp-http/`: the same over Streamable HTTP;
  - `cli/`: written by `node tools/cli.mjs render`;
  - `mcp-e2e-result.txt`: the exact client, SDK versions and every check.
- **Website reopen:** `docs/screenshots/bridge/07-cli-mcp-project-editor.png` shows the same file reopened in `#/projekt`.

I inspected the PNGs myself:
- **Slide 1, Teams** «Ausleihe»: Samuel's handover with the «Mahnliste Oktober.xlsx» card, Mia's reply, and two numbered notes.
- **Slide 2, Planner** «Diese Woche»: Mahnung with Mia, Sa 9.11.; Reservation with Mia, Fr 8.11.; Bücherkiste with Renate, Fr 8.11. «Etiketten» is correctly absent because it is personal.
- **Slide 3, Prinzip:**
  - Samuel's list holds Mahnung and Etiketten, and Mia's holds Reservation.
  - «Schon im gemeinsamen Plan» holds Bücherkiste with Renate. It is not shown as Renate's personal list.
  - The right side holds all three plan tasks.
  - The recommendation and boundary texts are as authored.

## Tests actually run (on this branch)

| Command | Result |
|---|---|
| `node --test tests/` | **32/32**: 17 model, 10 earlier project, 5 new regressions |
| `node check-worlds.mjs` | 0 errors, 0 warnings |
| `node tests/mcp-e2e.mjs` | **49/49** (log: `docs/evidence-cli-mcp/mcp-e2e-result.txt`) |
| `node tests/project-journey.mjs` (Chromium) | **43/43**: the earlier 34 checks plus export refusal, storage failure, draft limit, and reopening and exporting the CLI/MCP project |
| `node tests/journey.mjs` (Chromium, existing library) | **110/110**; I restored the library screenshots it regenerates |

### What `tests/mcp-e2e.mjs` covers

- **MCP client:** `@modelcontextprotocol/client` 2.4.0 (`Client`, `StdioClientTransport`, `StreamableHTTPClientTransport`) with default client options. Both transports negotiated protocol **2025-11-25** through the legacy initialize handshake, which is the SDK client's default. The 2026-07-28 "modern" discovery era was **not** exercised.
- **Transports:**
  - stdio, with the server spawned as a child process;
  - Streamable HTTP against `http://127.0.0.1:<port>/mcp`.
- **Checks on each transport:**
  1. initialize and discover the five tools;
  2. capabilities and example;
  3. validate the new project;
  4. a malformed project (null person, numeric organisation, custom state ID) gives located `bad-entry`, `type` and `state-ids` errors, and render is refused;
  5. render: three slides in order, manifest fields, resource links and no inline base64;
  6. list resources;
  7. read every PNG and check its PNG signature, 1920×1080 size and SHA-256 against the manifest;
  8. `retrieve_artifact` returns one image;
  9. traversal attempts and unknown IDs are refused;
  10. overflow gives `isError` with a `fit` diagnostic on `s-kanal`, and no artifact directory is left;
  11. input over 200 KB is refused.
- **HTTP only:** a foreign Host header gets 403.
- **Across routes:** the CLI renders the same file with exit 0 and JSON-only stdout. stdio, HTTP and CLI produce the **same files, in the same order, with byte-identical PNGs**. The CLI on the overflow fixture exits 3 and writes nothing.
- **Timeout and cleanup:** a 300 ms timeout is reported and nothing is written. Afterwards there are no Chromium processes and no profile or scratch directories.
- **Website** (project journey): reopening the same project file shows the import review without errors, the editor lists Teams → Planner → Prinzip, the preview shows the before-plan task as shared, and **the website export is byte-identical to the CLI PNGs**.

**What this proves and what it does not.** The SDK-client test proves the protocol path (initialize, tools, resources) for this SDK client over both transports. It does **not** establish compatibility with Claude Desktop, Claude Code, ChatGPT, Copilot or any other assistant host. None of them was connected in this run.

## Limitations

- **Coverage.** Three profiles only, as before. States are fixed to `before`/`after`. The `prinzip-lists` limit is 3.
- **Host compatibility.** No assistant host was connected. The configuration examples above are untested.
- **Chromium.** Rendering needs Chromium (or Chrome via `CHROMIUM`). Renders run one at a time. A render takes about 2–3 s.
- **HTTP mode.**
  - There is no authentication.
  - The localhost guards reject non-local Host headers, so `--host 0.0.0.0` alone does not make it reachable remotely, by design.
  - Artifacts are local files with count-based pruning; there is no TTL.
- **Chromium's url_fetcher scratch directories.** Cleanup removes the ones that appeared during a render. A Chromium started by another program at the same moment could lose that cache, which Chromium recreates.
- **Fit diagnostics.** They are only as good as `Export.fitIssues`, which checks post overflow, board width and principle height. Long Planner titles that wrap are not flagged.
- **Website checks.** Keyboard Tab walk and screen-reader pass: still not done.
- **Not built.** WebMCP, public hosting and PPTX.

## Smallest next step toward remote hosting

1. Run `tools/mcp-server.mjs --http` behind a reverse proxy with TLS.
2. Add bearer-token auth in front of the handler; the SDK has `bearerAuth` middleware.
3. Replace `localhostHostValidation` with an allow-list for the public host name.
4. Move `MTP_ARTIFACT_DIR` to a per-deployment volume with a time-based cleanup.

The handler is already stateless per request, so nothing else in the protocol layer changes. Rendering still needs Chromium in the container.

## Commits

(filled in at the end of the run)
