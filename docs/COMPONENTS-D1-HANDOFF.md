# Deck components D1 — component export, handoff

Built 2026-11-02 on branch `feat/deck-components-d1`, based on `plan/deck-components` (main `e324156` plus the [plan](DECK-COMPONENTS-PLAN.md)). Pending PR and review.

## What is built

A component is one M365 screen, or an excerpt of it, as a PNG without slide heading, side explanation or footer, for placing on the trainer's own slide. It works on existing v1 projects; the project format is unchanged.

| Type | Scene profile | Views | Selection |
| --- | --- | --- | --- |
| `teams.channel` | `teams-posts` | `window`, `posts` | `postIds` |
| `teams.chat` | `teams-chat` | `window`, `messages` | `messageIds` |
| `planner.board` | `planner` | `board`, `bucket` | `bucket` (required) |

Per component the result returns:
- the PNG (default scale 2), its size and the crop in app pixels;
- `anchors`: `{entity, kind, box: [x, y, w, h]}` normalised to the picture, for posts, messages, tasks and buckets, measured after layout;
- `markers`: positions of numbered hint badges when `marks: true`;
- `text`: smallest essential text in px and `minPlacedWidthIn`, the smallest picture width at which that text is still 12 pt on the slide (text px × 72 × placed width ÷ picture width);
- `context` (for example «Microsoft Teams · Team › Kanal»), `attribution` («Fiktives Beispiel · nachgebildete Oberfläche, kein Produkt von Microsoft») and `excerpt`.

`posts` and `messages` are reflowed excerpts: the list is narrowed (`width`, 420–1080 app px, default 640), so text wraps as in a narrow Teams window and the picture can be placed smaller. In the example, the post excerpt needs 8 in at 12 pt, the full window 17 in.

## Routes

| Route | Entry |
| --- | --- |
| Core | `ProjectCore.components()`, `validateComponents()`, `compileScene()`, `componentFile()` in `src/project-core.js` |
| Browser | `ProjectComponents.render(project, specs, {scale})` in `src/component-render.js` |
| Node | `renderComponents()` in `tools/render.mjs` (shares the page and browser lifecycle with `renderProject`) |
| CLI | `node tools/cli.mjs component <project> --out <dir> (--spec specs.json \| --scene <id> [--view] [--select a,b \| --bucket <name>] [--width] [--marks true])` |
| MCP | `render_components` (up to 8 per call); `get_capabilities` now includes the component catalogue; `retrieve_artifact` and the `mtp://renders/...` resources serve component files too |

Supporting changes: posts, chat messages and Planner cards carry `data-entity`, buckets `data-bucket`; the compiler keeps message and task IDs; `Export.toPNG` takes an optional width and height.

## Tests run

- `node --test tests/*.test.mjs`: 44/44 (one chat compile assertion updated for the kept message IDs).
- `node check-worlds.mjs`: 0 errors, 0 warnings.
- `node tests/components-e2e.mjs` (new): 25/25. MCP over stdio with the SDK client, five components from `examples/lichtblick-kulissenwechsel.project.json`, PNG sizes and hashes, anchors inside the picture, selections, located errors, `retrieve_artifact`, CLI byte-identical to MCP, and a longer post moving the next post's anchor down (332 → 372 px). Evidence: [docs/evidence-components](evidence-components/).
- `node tests/mcp-e2e.mjs`: 49/49. Full-slide PNG hashes are identical to the stored evidence, so the markup change did not alter slides.
- `node tests/journey.mjs`: 110/110; `node tests/project-journey.mjs`: 51/51.

## Known limits

- Excerpts drop the channel or chat header; orientation is only the `context` label for the slide text.
- `principle.tasks` and `persona` are not components yet; curated library worlds are not component sources (D6).
- Post IDs remain optional in project validation; posts without an ID render but get no anchor (warning `no-entity-id`).
- Hint badges keep their project numbering; slide-local callout numbering moves to D3, where callouts belong to the slide.
- No website UI for components yet.
- `minPlacedWidthIn` is an engineering proxy for readability, not a room test.
- No `task` view (single card) yet.

## Next

D2: catalogue guidance for agents (teaching uses are in place, examples and authoring-pack text are not) and a host test: a planned training chat in Claude becomes a deck built from components without manual cropping.
