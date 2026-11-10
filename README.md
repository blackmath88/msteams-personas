# msteams-personas

A configurable library of fictional M365 application scenes and conceptual explainers for training, adoption and consulting. Create useful PowerPoint visuals without provisioning a real tenant.

## Web app

Open [msteams-personas](https://blackmath88.github.io/msteams-personas/) in your browser, or go directly to [Eigene Abfolge](https://blackmath88.github.io/msteams-personas/#/projekt). GitHub Pages publishes `main` from the repository root; changes on main redeploy automatically. No build step, backend or Microsoft login is required. Drafts remain in the current browser; download project JSON to move work between devices. CLI and MCP remain local tools.

## Available now

The complete V3 trainer library is on `main` (merged at `300e006`). Open `index.html` directly; no install, Microsoft login or backend is required.

- Team-Personas, Tools and Use Cases lead into one workspace.
- Teams posts/chat, Outlook, Explorer, SharePoint, OneDrive, Planner, To Do and an AI recap simulation, with scenario-dependent availability.
- Seven teaching sequences, including business onboarding, shared documents, task ownership and absence.
- Targeted editing, browser-local saves, customisation-backup JSON import/export.
- Presentation, focus crops and individual/sequence PNG export at Full HD and 2x.

See [V3 handoff](docs/V3-BUILD-HANDOFF.md) for evidence, supported coverage and limitations. Independent model review passed 17/17; the builder reports 110/110 Chromium checks. New-project authoring, CLI and MCP are described below.

## Recherchierte Hochschul-Szenarien

[Hochschul-Szenarien](index.html#/hochschule) ergänzt vier fiktive Gruppen: Campus-Service, Forschungsförderung, Konferenzorganisation und ein Lehrpraxis-Netzwerk. Zwölf Rechercheeinträge unterscheiden fertige Beispiele von offenen Kandidaten. Sechs vollständige Projekte liefern 32 PNG-Folien.

Der [Morgenreview](docs/morning-review/index.html) zeigt die Gruppen, Arbeitsflüsse und alle Exporte. Beginnt mit dem Wochenmeeting (gemeinsame Agenda → Notizenplan → To Do → nächster Review) und derselben Loop-Tabelle in Teams-Chat und Outlook. Voraussetzungen, manuelle Übergaben und Quellen sind sichtbar. Das sind nachgebildete Oberflächen und fiktive Geschichten, keine Live-Integrationen.

Projektformat bleibt v1; Fähigkeit 6 ergänzt `meeting-notes`, `loop-component` und `workflow`. Website, CLI und MCP verwenden dieselben Definitionen. Komponenten und Arbeitsflussschritte bleiben im Formular erhaltene Metadaten; sie lassen sich über Projekt-JSON und erneuten Import anpassen. [Vertrag, Quellen und Prüfresultate](docs/PERSONA-SCENARIO-HANDOFF.md).

```sh
node tools/cli.mjs catalogue
node tools/cli.mjs example --kind weekly-meeting --out meeting.json
node tools/cli.mjs render meeting.json --out slides
# MCP: get_catalogue → get_example(kind: "shared-loop") → validate_project → render_project
```

## Arbeitsbereich erkunden

Plan a fictional team workspace as a map and Teams or OneDrive preview. Open «Arbeitsbereich erkunden» from the library and adapt the example as a local draft. Choose «Häuser und Teams öffnen» for a person’s Teams houses and a side-by-side comparison with Teams channel navigation and files. See the [workspace profile handoff](docs/WORKSPACE-PROFILE-HANDOFF.md) for model limits and CLI/MCP usage.

## Portable projects, CLI and MCP

Capability version 3 adds custom `planner-task` (individual task details) and `todo` (a person's explicitly selected «Mein Tag» tasks). Project format remains version 1; capability versions 1 and 2 still load. Website, CLI and MCP use the same validator, compiler, curated renderers and PNG operation.

The fictional [Leadership Forum example](examples/leadership-forum-six.project.json) contains the complete six-slide training story: Teams chat → channel posts → Planner board → task details → To Do → before/after. Import it at `#/projekt`, or render it with `node tools/cli.mjs render examples/leadership-forum-six.project.json --out ./slides`. Presenter notes and visibility assumptions are included.

Task details live in the shared state snapshot. To Do references existing task IDs owned by its viewer; shared tasks retain their identity and require an explicit Planner-connection assumption. See [profile contract, verification and restart handoff](docs/TASK-PROFILES-HANDOFF.md).

Portable-project authoring (`7d5f330`) and the shared render operation, CLI and local MCP server (`5a6ece6`) are merged on `main`. The MCP server passed a real Claude Code host test over stdio.

For your own slides, export [M365 screen components](docs/COMPONENTS-D1-HANDOFF.md) with measured callout anchors through the CLI or MCP. The [deck components plan](docs/DECK-COMPONENTS-PLAN.md) covers further composition work.

`#/projekt` («Eigene Abfolge») authors a new Teams → Planner → Prinzip sequence by hand or with the user's own chat assistant. The same project JSON can be validated and rendered without the website:

```sh
npm install                                    # only for CLI/MCP; the website needs no install
node tools/cli.mjs example --out project.json
node tools/cli.mjs validate project.json
node tools/cli.mjs render project.json --out ./slides   # needs Chromium
node tools/cli.mjs component project.json --scene sc-kanal --view posts --out ./parts   # M365 excerpt + anchors
node tools/mcp-server.mjs                      # MCP over stdio
node tools/mcp-server.mjs --http               # MCP over Streamable HTTP, http://127.0.0.1:8787/mcp
```

Website, CLI and MCP share one validator (`src/project-core.js`) and one render operation (`src/project-render.js`). Commands, client configuration, evidence and limits: [CLI/MCP handoff](docs/CLI-MCP-HANDOFF.md). Concept: [Slides as Code](docs/SLIDES-AS-CODE-CONCEPT.md). WebMCP and a hosted rendering/MCP service are not built. The browser app is hosted on GitHub Pages.

- [Active build plan](docs/BUILD-PLAN.md)
- [Product brief](docs/PRODUCT.md)
- [Current status](docs/STATUS.md)

## Run and checks

Open `index.html` for the library or `atlas.html` for the original atlas. Assets remain local and offline-capable. Customisation-backup JSON exports are a separate format from portable projects.

```sh
node check-worlds.mjs
npm test
python3 -m http.server 8766 --bind 127.0.0.1 &   # for the browser journeys
node tests/journey.mjs && node tests/project-journey.mjs
node tests/mcp-e2e.mjs                           # MCP SDK client over stdio + HTTP, and CLI
```

Browser journey instructions and runtime requirements: [V3 handoff](docs/V3-BUILD-HANDOFF.md).

## Principles

Use fictional content, contextual recommendations and explicit assumptions. Preserve object identity across application views, and include personal work or systems outside M365 when appropriate. Scenes are independent illustrative mock-ups, not a live tenant or proof of real permissions.

## Attribution and licence

The imported atlas, data and tokens originate from `blackmath88/m365-toolbox` at commit `4af0e42219b346eb7676317f213e3998c5792cf8`. The source repository declares CC BY 4.0; this extracted work retains that licence and attribution. See [migration provenance](docs/MIGRATION.md).

