# Product brief — msteams-personas

## Purpose

A place to set up fictional people, working worlds and use cases, then render convincing screenshot-like collaboration scenes without building the corresponding Teams tenant structures.

The value is a reusable visual environment for training, workshop discussion, consulting and adoption design. A trainer can change the story, people, channels or artefacts without recreating demo accounts, uploading dummy documents or cleaning up a tenant.

## Library-first experience

Visitors first understand the vision through a visual example. They can explore a recognisable situation or describe their own, then customise a copy. Business and Higher Education are collections within the same library.

The first test has three entry points: Persona wählen, Use Case wählen and Eigene Situation. A six-question configurator suggests a contextual template and alternative, with lightweight naming customisation and live preview.

Two primary visual modes share people, artefacts, scenario and setup variant: Szene (screenshot-like scenes) and Prinzip (conceptual explainers, including setup maps and before/after). Präsentieren provides a clean 16:9 stage with annotations on/off. A full authoring editor and PNG export follow later.

See [the build plan](BUILD-PLAN.md) for the complete UX, delivery slices and acceptance criteria.

## First use case

University of Basel M365 training with isolutions is the first example collection.

The same people and artefacts should recur across Teams Basics, Communication in Teams, collaborative documents, Loop, Planner & To Do and Digital Balance. A course should select a relevant moment in a shared world rather than invent unrelated demo data.

The collection is fictional and uses German / Swiss spelling. Its recommendations are contextual training examples, not universal configuration rules.

## Core workflow

1. Understand the vision and choose a persona, use case or own situation.
2. Select a scenario or answer six work-oriented questions.
3. Review the suggested starting point, its rationale and an alternative.
4. Adjust situation/participant names and explore Szene or Prinzip.
5. Present the selected visual in 16:9. Dedicated file export is a later milestone.

## Domain model

| Concept | Owns |
| --- | --- |
| Collection | Organisation/context, language, theme, module mapping and related worlds |
| Working world | Stable work context, lifecycle, people, relationships and personal/shared boundaries |
| Person | Fictional identity and role; scenario-specific participation references the same identity |
| Collaboration structure | Teams, channels, membership and tools appropriate to that context |
| Artefact | File, task or knowledge object, with a stable identity and location |
| Scenario | A specific trigger, friction, learning objective, decision and consequences |
| Scene | A renderable moment: visible structure, selected view, content, perspective and annotations |
| Training sequence | Ordered scenes and facilitator notes linked to a course/module |

These are design responsibilities for the future model. The imported `HE_WORLDS` / `HE_ATLAS` globals remain unchanged for compatibility; they do not already implement this full model. Use only a thin v3 model and legacy adapter for the first configurator/rendering path. Preserve unconsumed content and defer a complete schema migration.

## Visual output

Scenes should be recognisable as Teams-inspired collaboration screens, with readable people, channels, posts and files. Use an original, simplified visual language. Keep the teaching point visible instead of recreating every product control.

Support a clean scene view for slides, an optional annotated teaching view, and a today / proposed-model comparison. Personal work may use OneDrive and To Do. The renderer should share content with the authoring model, not maintain separate text for each output.

## Initial boundaries

- Browser-first and static/local-first; no tenant provisioning or Microsoft Graph dependency.
- No production credentials, real user accounts or real internal documents.
- Deterministic configuration and lightweight customisation first; no AI dependency.
- No backend, multi-user collaboration or hosted publishing in the first authoring slice.
- No claim that a mock scene proves real permissions or exact current Teams behaviour.
- The existing toolbox remains available; this repository owns its independent successor.

## Product success

For the first test, a trainer can choose an example or configure a situation, understand a suggested setup through Szene and Prinzip, change names, and present a legible visual without code or a real Team.

The full product later adds arbitrary authoring and visual file export. The current implementation remains the seed atlas; planned capabilities must not be described as already delivered.
