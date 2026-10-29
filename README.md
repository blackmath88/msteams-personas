# msteams-personas

Build reusable fictional working worlds and use-case scenarios, then show them as screenshot-like Teams and M365 scenes without provisioning real Teams environments.

The first example collection supports the University of Basel M365 Deep Dives with isolutions. The product should also support other organisations and training contexts.

## Available now

Latest build: branch `v3/trainer-library`. See [docs/V3-BUILD-HANDOFF.md](docs/V3-BUILD-HANDOFF.md) for the screens (Teams, chat, Outlook, Explorer, SharePoint, OneDrive, Planner, To Do and a simulated AI recap), the teaching sequences and the PNG export.


**Prototype library (branch `prototype/visual-library-v1`, not yet reviewed or merged).** Open `index.html`:
- Landing with three entries: Persona wählen, Use Case wählen, Eigene Situation.
- Five university worlds plus one fictional business department (Brunner Haustechnik AG, Kundenportal project); all seven legacy scenarios reachable.
- Six-question deterministic configurator with rationale, assumptions, an alternative and live name preview.
- Szene (Teams-inspired channel with Beiträge / Dateien / Aufgaben tabs, or a personal OneDrive/To Do view) and three Prinzip explainers, sharing people, names and setup variant.
- Präsentieren: 16:9 stage, annotations on/off (H), exit with Esc. PNG/SVG export is not implemented.
See [the prototype handoff](docs/PROTOTYPE-HANDOFF.md) for tests, screenshots and limitations.

**Seed atlas** (now `atlas.html`, unchanged apart from a link back to the library):

A working, offline-capable atlas migrated from [m365-toolbox](https://github.com/blackmath88/m365-toolbox):
- Five university working worlds: administration, research, individual academic work, a commission and teaching.
- 24 fictional people, 45 artefacts, seven scenarios and 25 decision points.
- Today / M365 comparison scenes, people and relationships, numbered changes and miniature structure previews.
- Personal OneDrive + To Do scenes where a Team is unnecessary.
- Keyboard-accessible view controls and a print briefing.

Open `atlas.html` for the seed atlas. No install, account, Microsoft tenant, backend or build is required. Edit `worlds.js` to change the existing collection, then run:

```sh
node check-worlds.mjs
```

## Next build: library UX and M365 visual fidelity

The tested prototype currently lives on `prototype/visual-library-v1` (last inspected `e9220ff`), while this branch contains the older atlas and planning documents. Use that prototype as the implementation baseline.

The next version adds Team-Personas / Tools / Use Cases as three entrances, more faithful Teams/Outlook/file interfaces, and genuine PNG export for PowerPoint.

- [Active build plan](docs/BUILD-PLAN.md)
- [Three-entry library UX](docs/UX-LIBRARY-PLAN.md)
- [M365 UI fidelity and slide output](docs/M365-UI-FIDELITY-PLAN.md)
- [Claude via Orca on NUC: build task](docs/ORCA-NUC-BUILD-TASK.md)

## Product direction

**Explore the library → choose or describe a situation → customise → understand it visually → present or export.**

A world holds people, roles, relationships and collaboration structure. Scenarios describe specific situations and learning decisions. Scenes render the selected situation as a recognisable collaboration interface.

The existing atlas is the seed viewer. That first prototype now exists on its separate branch. The next direct Orca task improves library UX and UI fidelity and moves PNG export into scope. A full editor and portable collections remain later work. Today, authoring means editing the data file; print produces a briefing.

The planned library includes Business and Higher Education. Two main modes share the same situation: Szene (screenshot-like) and Prinzip (conceptual explanations, setup maps and comparisons).

- [Revised visual-first build plan](docs/BUILD-PLAN.md)
- [Weavr first-test brief and operator steps](docs/WEAVR-FIRST-TEST.md)
- [Perplexity use-case research prompt](docs/research/PERPLEXITY-USE-CASES-PROMPT.md)
- [Product brief](docs/PRODUCT.md)
- [Roadmap and acceptance criteria](docs/ROADMAP.md)
- [Current status and bounded scope](docs/STATUS.md)
- [Migration provenance and attribution](docs/MIGRATION.md)

## Files

| Path | Purpose |
| --- | --- |
| `index.html`, `src/` | Prototype library: `library.js` (business fixture, situations, use cases), `model.js` (thin v3 adapter), `configurator.js`, `views.js` (Szene/Prinzip), `app.js` (router, state, presentation), `app.css` |
| `atlas.html`, `atlas.css`, `atlas.js` | Seed atlas and scene viewer (legacy) |
| `tests/` | `model.test.mjs` (node --test), `journey.mjs` + `cdp.mjs` (headless Chromium journey and screenshots) |
| `worlds.js` | Existing Unibas example collection; compatibility schema v2 |
| `check-worlds.mjs` | Dependency-free content and scene validation |
| `assets/tokens.css` | Locally copied visual tokens |
| `docs/origin/` | Historical content and visual briefs, not current execution instructions |

## Principles

Use fictional content. Make scenes recognisable, legible and useful for a teaching question. Keep recommendations contextual and show alternatives. Include personal work and systems outside M365 when appropriate.

This is an independent training and scenario-design project. Scenes are illustrative mock-ups, not screenshots of a live tenant or a complete Teams simulator.

## Attribution and licence

The imported atlas, data and tokens originate from `blackmath88/m365-toolbox` at commit `4af0e42219b346eb7676317f213e3998c5792cf8`. The source repository declares CC BY 4.0; this extracted work retains that licence and attribution. See [migration provenance](docs/MIGRATION.md).
