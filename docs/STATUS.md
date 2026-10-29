# Current status

Updated: 2026-10-29.

## Branches and evidence

- main contains the original standalone atlas plus planning documents.
- prototype/visual-library-v1 contains the built library prototype, last inspected at e9220ff8954ea9a9541c4ee87b34c206a8dd8ede.
- The latest prototype handoff reports 9/9 logic tests and 62/62 Chromium journey checks. These are reported results; not independently rerun during this planning update.
- Earlier independent review reran 7/7 logic tests and inspected selected committed screenshots. The user has also tested the prototype and requested higher UI fidelity.
- No prototype implementation is merged into main by this documentation task.

## New specification

## Prototype run (2026-10-28)

Branch `prototype/visual-library-v1` (base `759c94b`) holds a first visual-first prototype built in a direct Claude session: landing/library, configurator, Szene, three Prinzip explainers and Präsentieren, with unit and headless-browser tests. It is unreviewed and unmerged. See [PROTOTYPE-HANDOFF.md](PROTOTYPE-HANDOFF.md).

## New specification (v2)

Two plans are now active:
- UX-LIBRARY-PLAN.md: self-explanatory landing; Team-Personas, Tools, Use Cases; one shared workspace.
- M365-UI-FIDELITY-PLAN.md: application resemblance, Teams/Outlook/file renderer families, cross-application story and real PNG slide assets.

BUILD-PLAN.md indexes the implementation priorities. ORCA-NUC-BUILD-TASK.md is the ready-to-paste execution task.

PNG export and targeted content editing are now in scope. Full arbitrary authoring, editable PPTX, backend, external APIs and deployment are deferred.

## Runtime/governance

The live Weavr check in this task returned Mission msteams-visual-library-first-slice as archived and no working Sessions for the project. No Weavr mutation or dispatch was performed.

The user requested a Claude task for direct Orca execution on the NUC. Preparing this task is not a claim that the runtime has started or its deadline is enforced. Inspect live local ownership/runtime capability before launching.

## Documentation scope and checks

This change records both plans, a NUC task and aligned navigation/instructions. Relative links and document consistency are checked. Runtime code/tests are unchanged.

## V2 build (2026-10-29)

Branch `v2/library-teams-export` implements the P0 library UX, the Teams fidelity pass, PNG export, and the P1 Outlook → Explorer → Teams → SharePoint story for Leadership Forum and Kundenportal. Tests: 12/12 logic, 81/81 browser checks. It is unmerged, with no PR. See [V2-BUILD-HANDOFF.md](V2-BUILD-HANDOFF.md).

## Next action

On the NUC, use docs/ORCA-NUC-BUILD-TASK.md. Start from the current prototype and integrate the current main documentation on a new implementation branch. Deliver P0 as a complete path before broader renderer coverage. Return screenshots and actual export samples for review; no automatic merge/deployment.
