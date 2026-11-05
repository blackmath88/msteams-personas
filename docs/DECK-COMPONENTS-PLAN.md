# Deck components plan — M365 screens as parts of training slides

Updated: 2026-11-02. State: D0 done; D1 built on `feat/deck-components-d1`, pending review ([handoff](COMPONENTS-D1-HANDOFF.md)); D2–D6 planned. Baseline: main at `e324156` (CLI and local MCP, Teams chat profile, bridge trial and ChatGPT tunnel setup notes merged).

This plan extends the [active build plan](BUILD-PLAN.md). It follows from a demo on 2026-11-02 and a Perplexity architecture review of the same day (disposition below). It does not authorise a release, hosting or a Mission.

## Why

Today every render is a finished slide: heading, side callouts and footer are baked in. In the demo, an agent rendered the example through the MCP, cropped the Teams window out of the PNG by hand and built a PowerPoint around it with editable text. The result was useful; the crop was fragile, and the shrunken full window was hard to read.

Trainers already plan their training with ChatGPT or Claude. The engine should supply what those assistants cannot draw: faithful, fictional M365 screens that fit into the trainer's own slides.

## Use cases

| ID | Trainer story | Needs |
| --- | --- | --- |
| U1 | "My chat already planned the training. Build the deck in our company design and add the Teams and M365 parts where they fit." | Components, a catalogue the agent can choose from, deck output on a company template |
| U2 | "Here is my existing PowerPoint. Add the M365 screens where they help, and bring it into our design." | Reading an existing deck, inserting components into chosen slides, later re-mapping onto the company template |
| U3 | "Show this persona scenario: who works where, and what changes." | Curated library worlds and personas as component sources, persona components, a scenario walkthrough |
| U0 | "I only need the Teams excerpt for my own slide." | Component PNG plus metadata, no deck at all (serves all of the above) |

Trainer answers recorded on 2026-11-02: both a generated deck and excerpts for existing decks are wanted; the company design (CI) is required, not optional.

## Principles

- **Screens are pictures, explanations are text.** M365 interfaces are exported as images; titles, callouts, questions and notes are native, editable PowerPoint text. Never present a picture as editable M365 UI.
- **The engine renders, the assistant authors.** Extracting a scenario from a chat, fictionalising it and choosing the teaching flow stay with the trainer's assistant and the trainer. The engine validates, renders, measures and packages.
- **Semantic targets, not pixels.** Projects reference posts, tasks and buckets by ID. Anchor positions are measured by the renderer after layout and returned, never authored.
- **One composition plan.** PNG preview and PPTX export read the same resolved geometry, so they cannot drift apart.
- **Readability is checked where it matters:** as effective text size after placement on the slide, not as a property of the source image.
- Existing constraints hold: offline-capable, German UI with Swiss spelling, fictional content with visible attribution, no framework or backend migration, legacy projects keep rendering unchanged.

## Architecture

```text
project (v1 today, v2 for composed slides)
  → validate, adapt v1 or compile v2
  → resolve component selections against scenes
  → render components, measure anchors          (D1)
  → catalogue guides the agent's choice          (D2)
  → resolve slide composition, check fit/readability (D3)
  → export: component PNGs | composed PNGs | PPTX on a company template (D4)
  → existing decks: inspect and insert           (D5)
```

### Components

A component instance is `type + scene + selection + view`:

| Type | Views | Selection |
| --- | --- | --- |
| `teams.channel` | `window`, `posts`, `post` | `postIds` |
| `teams.chat` | `window`, `messages` | `messageIds` |
| `planner.board` | `board`, `bucket`, `task` | `bucket` or `taskIds` |
| `principle.tasks` | `complete`, `before`, `after` | none |
| `persona` (D6) | `card`, `avatars` | `personIds` |

Each render returns the PNG, its real dimensions, a provenance/attribution record, the measured essential text size and the anchors: `{id, entity, part, box: [x, y, w, h] normalised}`. A view declares whether it is a true crop of the window or a reflowed excerpt; both are labelled as excerpts where context is removed.

### Slide patterns

Named, constrained arrangements: `title`, `section`, `screen-with-callouts`, `before-after`, `principle`, `question`, `steps`. Each declares when to use it, its slots, which component views fit each slot, text budgets and the minimum essential text size. Patterns own geometry; components own their inner layout. No general constraint solver: one or two fixed arrangements per pattern.

The agent proposes a pattern per slide from the catalogue; the engine checks feasibility and returns repair options (fewer posts, closer view, other pattern, split slide); the saved project records the explicit choice. A suggestion tool is added only if catalogue-only authoring performs poorly.

### Slide schema sketch (project v2)

```json
{
  "id": "s-uebergabe",
  "purpose": "notice",
  "pattern": "screen-with-callouts",
  "title": "Was fehlt bei dieser Übergabe?",
  "slots": {
    "visual": { "id": "c-uebergabe", "type": "teams.channel", "scene": "sc-kanal", "view": "posts", "selection": { "postIds": ["q1", "q2"] } }
  },
  "callouts": [
    { "target": { "component": "c-uebergabe", "entity": "q1" }, "text": "Niemand ist verantwortlich." },
    { "target": { "component": "c-uebergabe", "entity": "q2" }, "text": "Die Übergabe verweist auf Datei und Plan." }
  ],
  "presenterNotes": "Zuerst beobachten lassen, dann fragen: Wer übernimmt was bis wann?"
}
```

Callout numbers follow array order. `purpose` starts with `orient`, `notice`, `explain`, `practise`, `reflect`, `transfer`. A separate `strategy` field is deferred until trainers miss it.

### Company template (CI)

The deck is built on the trainer's own `.potx`/`.pptx` template, not on a design invented by the engine. Template contract:

- the template provides masters, layouts, fonts and colours;
- a small mapping names which template layout serves each pattern (`title` → «Titelfolie», `screen-with-callouts` → «Titel und Inhalt», …) and which placeholder receives the picture and the text;
- the mapping is stored with the trainer's settings, validated against the actual template, and reported when a layout or placeholder is missing;
- a built-in neutral template exists for trainers without CI.

Library choice is a D4 spike, not decided: pptxgenjs generates decks but cannot open a template; template-based Node libraries (e.g. pptx-automizer, to be verified) and python-pptx (adds a Python runtime) can. Decide on evidence: opens in PowerPoint without repair, placeholders filled, notes kept, offline.

### Who builds the PPTX

Two routes, in this order:

1. **Host-composed (D2).** The trainer's assistant renders components through the MCP and builds the deck with its own PowerPoint ability, guided by the catalogue. Works in Claude today (proved by the demo, with a manual crop). Fast to reach, not deterministic.
2. **Engine-composed (D4).** `build_deck` takes the slide list and the template and returns a validated PPTX. Deterministic, the same for website, CLI and MCP.

ChatGPT needs to reach the MCP server for either route. The private tunnel in [CHATGPT-CUSTOM-MCP-SETUP.md](CHATGPT-CUSTOM-MCP-SETUP.md) is the planned path; it is not verified yet. Hosting stays [slice 5](BUILD-PLAN.md).

## Slices

### D0 — housekeeping and decision record

- Link this plan from README, STATUS, ROADMAP, BUILD-PLAN and AGENTS (done with this plan).
- This document is the decision record.

### D1 — component export

State: built, pending review. See the [D1 handoff](COMPONENTS-D1-HANDOFF.md). Deviations: the MCP tool is `render_components` (batch of up to 8); slide-local badge numbering moved to D3; excerpts are reflowed lists (`width`) rather than a reuse of the library's focus crop, because the crop keeps the full window width and stays unreadable when placed.

- Require unique IDs for anchorable entities in the component path: posts (today optional, `src/project-core.js` validation) and Planner tasks (today dropped during compilation, `planTasks` → board mapping).
- Badge numbers become slide-local and derived, not counted from `hint` presence.
- Render `teams.channel` (`window`, `posts`), `teams.chat` (`window`, `messages`) and `planner.board` (`board`, `bucket`) without slide heading, side explanation or footer. Reuse the library's content-aware focus crop in `src/export.js` before writing new crop logic.
- Measure anchors after the existing tightening steps; fail on an unresolved selection.
- Expose through the shared render operation: CLI `component`, MCP `render_component`. Works on v1 projects; no schema version change.

Acceptance: a component PNG with anchors and provenance, identical bytes across CLI and MCP in the pinned environment; a longer author name or post moves the anchor correctly; unknown or duplicate IDs give located errors; existing v1 fixtures and full-slide renders are unchanged; `node check-worlds.mjs` and existing tests pass.

### D2 — catalogue for agents, host-composed decks

- Extend capabilities with components, views, `teachingUses`, `avoidWhen`, selection fields, minimum placement width at the default readability policy and one example per entry. Keep `get_capabilities` compact; details on demand.
- Generate the authoring pack and the MCP server instructions from the same definitions.
- Fix the host-test friction points (budget units, `teaching` placement, artifact parameter descriptions).
- Host test: paste a planned training chat into Claude, receive a deck that uses components without manual cropping.

Acceptance: the host test is recorded like [HOST-TEST-CLAUDE-CODE.md](HOST-TEST-CLAUDE-CODE.md), with the deck and the agent's component choices.

### D3 — patterns, composition plan, project v2

- `projectVersion: 2` with composed slides; v1 projects keep the legacy full-slide path.
- Composition plan: pictures, text boxes, badges, connectors, notes. Patterns `screen-with-callouts` and `question` first, then `before-after`, `steps`, `title`, `section`.
- Diagnostics in three classes: structure, layout fit (overflow, collisions, unresolved anchors), readability (effective essential text size = source px × 72 × placed width ÷ source width, against the policy). Repairs, never silent shrinking.
- Composed PNG output and a website preview.

### D4 — PPTX on a company template

- Spike the library choice (above) with one real CI template.
- `build_deck` in the shared operation; CLI and MCP.
- Template mapping, missing-layout diagnostics, neutral built-in template.
- Visible attribution line per slide via the template footer or a text box.

Acceptance: opens in PowerPoint without repair; title, callouts and notes editable; screens are single pictures at the planned aspect ratio; anchors line up; package checks on slide order, text, notes and image references; a human checks slideshow mode. PPTX byte-identity is not promised.

### D5 — existing decks

- `inspect_deck`: slides, layouts, text, notes, existing pictures.
- `insert_components`: the agent proposes slide and placement, the trainer confirms, the engine inserts pictures into the existing deck without touching other content.
- Later and limited: re-map an existing deck's content onto the company template. Full automatic restyling of arbitrary decks is out of scope.

### D6 — persona scenarios from the library

- Adapter so curated library worlds and scenes can serve as component sources, not only portable projects.
- `persona` component and a `scenario` pattern: persona, where they work, what changes.

## Deferred and out of scope

Editable native M365 shapes; automatic restyling of arbitrary decks; a layout suggestion service before catalogue-only authoring is tested; a `strategy` field; storing raw pasted chats in projects; hosting (stays slice 5).

## Review disposition (Perplexity, 2026-11-02)

User-supplied review of the first version of this plan. Repo claims spot-checked at `5a6ece6`: documentation drift (since fixed on main), optional post IDs, hint-derived badge numbers, before/after-only states and existing library focus crops are confirmed; Planner dropping task IDs confirmed at the board mapping in `src/project-core.js`.

- **Adopted:** component export as a product of its own; selection separated from view; semantic anchors measured after layout; one composition plan for PNG and PPTX; readability after placement; project v2 with an explicit v1 adapter; catalogue before suggestion tool; reuse existing focus crops; repairs instead of shrinking.
- **Changed:** the review deferred templates; the trainer requires company CI, so the template contract moves into D4. The review's `purpose`/`strategy`/`pattern` split is reduced to `purpose` and `pattern`.
- **Not adopted:** its 1–2 day estimate including PPTX; D1 and D3 are separate steps and PPTX is its own slice.

## Handoff

Each slice reports baseline and final commits, routes touched, format and capability versions, tests actually run, sample outputs and known limits, and updates STATUS and ROADMAP.
