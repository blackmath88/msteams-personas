# msteams-personas

A configurable library of fictional M365 application scenes and conceptual explainers for training, adoption and consulting. Create useful PowerPoint visuals without provisioning a real tenant.

## Available now

The complete V3 trainer library is on `main` (merged at `300e006`). Open `index.html` directly; no install, Microsoft login or backend is required.

- Team-Personas, Tools and Use Cases lead into one workspace.
- Teams posts/chat, Outlook, Explorer, SharePoint, OneDrive, Planner, To Do and an AI recap simulation, with scenario-dependent availability.
- Seven teaching sequences, including business onboarding, shared documents, task ownership and absence.
- Targeted editing, browser-local saves, customisation-backup JSON import/export.
- Presentation, focus crops and individual/sequence PNG export at Full HD and 2x.

See [V3 handoff](docs/V3-BUILD-HANDOFF.md) for evidence, supported coverage and limitations. Independent model review passed 17/17; the builder reports 110/110 Chromium checks. No general new-project authoring, CLI or MCP service exists yet.

## Next direction: Slides as Code

A shared portable project format will connect manual website editing, a guided bridge to the user's own AI assistant, CLI and remote MCP/HTTP. WebMCP will add browser-agent assistance. These are planned capabilities.

- [Refined concept](docs/SLIDES-AS-CODE-CONCEPT.md)
- [Active build plan](docs/BUILD-PLAN.md)
- [Architecture and UX research prompt](docs/research/PERPLEXITY-ARCHITECTURE-UX-SPARRING.md)
- [Product brief](docs/PRODUCT.md)
- [Current status](docs/STATUS.md)

Earlier UX/fidelity briefs and the Orca V2 task are historical build references. Do not restart from their older prototype baseline.

## Run and checks

Open `index.html` for the library or `atlas.html` for the original atlas. Assets remain local and offline-capable. Existing JSON exports are customisation backups, not complete portable projects.

```sh
node check-worlds.mjs
node --test tests/model.test.mjs
```

Browser journey instructions and runtime requirements: [V3 handoff](docs/V3-BUILD-HANDOFF.md).

## Principles

Use fictional content, contextual recommendations and explicit assumptions. Preserve object identity across application views, and include personal work or systems outside M365 when appropriate. Scenes are independent illustrative mock-ups, not a live tenant or proof of real permissions.

## Attribution and licence

The imported atlas, data and tokens originate from `blackmath88/m365-toolbox` at commit `4af0e42219b346eb7676317f213e3998c5792cf8`. The source repository declares CC BY 4.0; this extracted work retains that licence and attribution. See [migration provenance](docs/MIGRATION.md).

