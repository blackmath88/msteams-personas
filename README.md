# msteams-personas

A configurable library of fictional M365 application scenes and conceptual explainers for training, adoption and consulting. Create useful PowerPoint visuals without provisioning a real tenant.

## Available now

The complete V3 trainer library is on `main` (merged at `300e006`). Open `index.html` directly; no install, Microsoft login or backend is required.

- Team-Personas, Tools and Use Cases lead into one workspace.
- Teams posts/chat, Outlook, Explorer, SharePoint, OneDrive, Planner, To Do and an AI recap simulation, with scenario-dependent availability.
- Seven teaching sequences, including business onboarding, shared documents, task ownership and absence.
- Targeted editing, browser-local saves, customisation-backup JSON import/export.
- Presentation, focus crops and individual/sequence PNG export at Full HD and 2x.

See [V3 handoff](docs/V3-BUILD-HANDOFF.md) for evidence, supported coverage and limitations. Independent model review passed 17/17; the builder reports 110/110 Chromium checks. New-project authoring, CLI and MCP are described below.

## Portable projects, CLI and MCP

Portable-project authoring (`7d5f330`) and the shared render operation, CLI and local MCP server (`5a6ece6`) are merged on `main`. The MCP server passed a real Claude Code host test over stdio.

`#/projekt` («Eigene Abfolge») authors a new Teams → Planner → Prinzip sequence by hand or with the user's own chat assistant. The same project JSON can be validated and rendered without the website:

```sh
npm install                                    # only for CLI/MCP; the website needs no install
node tools/cli.mjs example --out project.json
node tools/cli.mjs validate project.json
node tools/cli.mjs render project.json --out ./slides   # needs Chromium
node tools/mcp-server.mjs                      # MCP over stdio
node tools/mcp-server.mjs --http               # MCP over Streamable HTTP, http://127.0.0.1:8787/mcp
```

Website, CLI and MCP share one validator (`src/project-core.js`) and one render operation (`src/project-render.js`). Commands, client configuration, evidence and limits: [CLI/MCP handoff](docs/CLI-MCP-HANDOFF.md). Concept: [Slides as Code](docs/SLIDES-AS-CODE-CONCEPT.md). WebMCP and hosting are not built.

- [Active build plan](docs/BUILD-PLAN.md)
- [Product brief](docs/PRODUCT.md)
- [Current status](docs/STATUS.md)

## Run and checks

Open `index.html` for the library or `atlas.html` for the original atlas. Assets remain local and offline-capable. Customisation-backup JSON exports are a separate format from portable projects.

```sh
node check-worlds.mjs
node --test tests/
python3 -m http.server 8766 --bind 127.0.0.1 &   # for the browser journeys
node tests/journey.mjs && node tests/project-journey.mjs
node tests/mcp-e2e.mjs                           # MCP SDK client over stdio + HTTP, and CLI
```

Browser journey instructions and runtime requirements: [V3 handoff](docs/V3-BUILD-HANDOFF.md).

## Principles

Use fictional content, contextual recommendations and explicit assumptions. Preserve object identity across application views, and include personal work or systems outside M365 when appropriate. Scenes are independent illustrative mock-ups, not a live tenant or proof of real permissions.

## Attribution and licence

The imported atlas, data and tokens originate from `blackmath88/m365-toolbox` at commit `4af0e42219b346eb7676317f213e3998c5792cf8`. The source repository declares CC BY 4.0; this extracted work retains that licence and attribution. See [migration provenance](docs/MIGRATION.md).

