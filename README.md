# msteams-personas

Build reusable fictional working worlds and use-case scenarios, then show them as screenshot-like Teams and M365 scenes without provisioning real Teams environments.

The first example collection supports the University of Basel M365 Deep Dives with isolutions. The product should also support other organisations and training contexts.

## Available now

A working, offline-capable atlas migrated from [m365-toolbox](https://github.com/blackmath88/m365-toolbox):
- Five university working worlds: administration, research, individual academic work, a commission and teaching.
- 24 fictional people, 45 artefacts, seven scenarios and 25 decision points.
- Today / M365 comparison scenes, people and relationships, numbered changes and miniature structure previews.
- Personal OneDrive + To Do scenes where a Team is unnecessary.
- Keyboard-accessible view controls and a print briefing.

Open `index.html` in a browser. No install, account, Microsoft tenant, backend or build is required. Edit `worlds.js` to change the existing collection, then run:

```sh
node check-worlds.mjs
```

## Product direction

**Define a world → choose a scenario → compose a scene → present or export it.**

A world holds people, roles, relationships and collaboration structure. Scenarios describe specific situations and learning decisions. Scenes render the selected situation as a recognisable collaboration interface.

The existing atlas is the seed viewer. A browser-based authoring workspace, portable scenario collections and dedicated screenshot/slide export are planned; they are not implemented yet. Today, authoring means editing the data file and checking it; print produces a compact briefing rather than a screenshot export.

- [Product brief](docs/PRODUCT.md)
- [Roadmap and acceptance criteria](docs/ROADMAP.md)
- [Current status and bounded scope](docs/STATUS.md)
- [Migration provenance and attribution](docs/MIGRATION.md)

## Files

| Path | Purpose |
| --- | --- |
| `index.html`, `atlas.css`, `atlas.js` | Seed atlas and scene viewer |
| `worlds.js` | Existing Unibas example collection; compatibility schema v2 |
| `check-worlds.mjs` | Dependency-free content and scene validation |
| `assets/tokens.css` | Locally copied visual tokens |
| `docs/origin/` | Historical content and visual briefs, not current execution instructions |

## Principles

Use fictional content. Make scenes recognisable, legible and useful for a teaching question. Keep recommendations contextual and show alternatives. Include personal work and systems outside M365 when appropriate.

This is an independent training and scenario-design project. Scenes are illustrative mock-ups, not screenshots of a live tenant or a complete Teams simulator.

## Attribution and licence

The imported atlas, data and tokens originate from `blackmath88/m365-toolbox` at commit `4af0e42219b346eb7676317f213e3998c5792cf8`. The source repository declares CC BY 4.0; this extracted work retains that licence and attribution. See [migration provenance](docs/MIGRATION.md).
