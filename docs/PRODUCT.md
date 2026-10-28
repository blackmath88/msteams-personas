# Product brief — msteams-personas

## Purpose

A place to set up fictional people, working worlds and use cases, then render convincing screenshot-like collaboration scenes without building the corresponding Teams tenant structures.

The value is a reusable visual environment for training, workshop discussion, consulting and adoption design. A trainer can change the story, people, channels or artefacts without recreating demo accounts, uploading dummy documents or cleaning up a tenant.

## Library-first experience

Visitors first understand the vision through a visual example. They can explore a recognisable situation or describe their own, then customise a copy. Business and Higher Education are collections within the same library.

Each situation supports screenshot-like scenes, conceptual setup maps, principle explainers and before/after comparisons. These views share people, artefacts, scenario and selected setup variant; they are projections of one model. Customisation has a live preview, followed by presentation and export.

See [the build plan](BUILD-PLAN.md) for the complete UX, delivery slices and acceptance criteria.

## First use case

University of Basel M365 training with isolutions is the first example collection.

The same people and artefacts should recur across Teams Basics, Communication in Teams, collaborative documents, Loop, Planner & To Do and Digital Balance. A course should select a relevant moment in a shared world rather than invent unrelated demo data.

The collection is fictional and uses German / Swiss spelling. Its recommendations are contextual training examples, not universal configuration rules.

## Core workflow

1. Create or duplicate a working world.
2. Define people, roles, relationships, current tools, artefacts and proposed collaboration structure.
3. Add a scenario: trigger, current friction, learning objective, alternatives, recommendation and boundary.
4. Compose one or more scenes from that scenario, with selected channel, posts, replies, files, tasks and annotations.
5. Preview what a participant should see, present it, and export a clean visual or a portable collection.

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

These are design responsibilities for the future model. The imported `HE_WORLDS` / `HE_ATLAS` globals remain unchanged for compatibility; they do not already implement this full model. Introduce a versioned collection format and adapter before changing the seed data.

## Visual output

Scenes should be recognisable as Teams-inspired collaboration screens, with readable people, channels, posts and files. Use an original, simplified visual language. Keep the teaching point visible instead of recreating every product control.

Support a clean scene view for slides, an optional annotated teaching view, and a today / proposed-model comparison. Personal work may use OneDrive and To Do. The renderer should share content with the authoring model, not maintain separate text for each output.

## Initial boundaries

- Browser-first and static/local-first; no tenant provisioning or Microsoft Graph dependency.
- No production credentials, real user accounts or real internal documents.
- Manual authoring first; AI generation is not needed for the initial product.
- No backend, multi-user collaboration or hosted publishing in the first authoring slice.
- No claim that a mock scene proves real permissions or exact current Teams behaviour.
- The existing toolbox remains available; this repository owns its independent successor.

## Product success

A trainer can create a small new fictional world, add a use case, and produce a legible training visual without editing application code or building anything in Microsoft Teams.

That outcome requires authoring and export work beyond the migrated atlas. The seed viewer provides the initial content, comparison pattern and rendering foundation.
