# Roadmap

## 0. Standalone foundation — prepared in this migration

Extract the current atlas, example data, validator and tokens. Preserve source attribution, offline operation and all five worlds. Correct paths and repository identity. Document current capability separately from the future tool.

Acceptance: open the root page without the old repository; all five worlds and three views render; validator reports no errors or warnings. Do not delete the old toolbox surface.

## 1. Portable collections

Define a versioned collection schema for worlds, people, artefacts, scenarios and scenes. Add an adapter for the existing Unibas example. Decouple collection identity, language and theme from renderer code.

Acceptance:
- The Unibas collection loads through the adapter with equivalent visible content.
- A second minimal collection can be loaded without changing renderer source.
- Invalid references and unsupported versions produce useful errors.
- Decide the supported schema subset before building the editor; do not silently discard existing scenario content.

## 2. Authoring workspace — first new product slice

Create and duplicate a world; edit fictional people, team/channel structure, one scenario and its scene content. Preview changes alongside the editor. Use the schema and validation from slice 1.

Acceptance:
- Starting with an empty or duplicated world, a trainer creates people, channels and a posts/files scene through labelled fields.
- Edits update the preview without editing JavaScript.
- Download and re-import a collection without losing supported content or stable IDs.
- Invalid data keeps the last valid preview and explains the problem.
- Keep unsaved work recoverable or clearly warn before it is discarded.
- Keyboard navigation works and narrow screens remain usable.

## 3. Training visual output

Add a clean scene view, annotation toggle and fixed presentation frame. Export an image or self-contained scene with explicit output dimensions; retain a separate print briefing.

Acceptance: a trainer can produce a readable 16:9 visual without editor controls and reuse the same scene in an annotated variant. Export must preserve fictional-content labelling and handle text overflow.

## 4. Unibas / isolutions teaching sequences

Map selected scenarios to the six Deep Dives. Add ordered scene sequences, learning questions and facilitator notes. Validate the sequences with the training collaborators before describing them as accepted training material.

Acceptance: at least one complete course segment reuses stable people, artefacts and context across its scenes. Alternatives and boundaries remain visible in the facilitator material.

## Later candidates

Perspective lenses, structure alternatives, scenario playback, Planner scenes and a message-placement exercise. Prioritise these against actual training needs after the authoring/export workflow is usable.

## Delivery boundaries

This roadmap is planning evidence, not permission to dispatch work, merge, deploy, spend on APIs or widen a Weavr Mission. No Weavr Mission is created by this repository extraction.
