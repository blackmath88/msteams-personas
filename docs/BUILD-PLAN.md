# Active build plan — M365 visual library v2

Updated: 2026-10-29. Planning update only.

The next increment combines:
1. [Library UX](UX-LIBRARY-PLAN.md): self-explanatory landing and Team-Personas / Tools / Use Cases entrances into one workspace.
2. [Application fidelity and PowerPoint output](M365-UI-FIDELITY-PLAN.md): recognisable M365 application screens, shared situation data and real PNG export.
3. [Claude / Orca NUC task](ORCA-NUC-BUILD-TASK.md): bounded implementation handoff and acceptance.

## Baselines

main still contains the earlier atlas/plans at the time of writing. The tested prototype is on prototype/visual-library-v1, last inspected at e9220ff8954ea9a9541c4ee87b34c206a8dd8ede.

The builder must carry forward that prototype rather than rebuild from main. Integrate current planning documentation into a new implementation branch. Do not merge implementation to main without authorization.

## Priorities

- P0: three-entry library UX, shared selection, faithful Teams rendering, and real 1920 x 1080 PNG output for Teams and Prinzip, demonstrated in university and business contexts.
- P1: one coherent Outlook → Explorer → Teams → SharePoint story around the same document.
- P2: OneDrive personal view and wider interface coverage.

Two primary visual modes remain Szene and Prinzip. Setup maps and comparisons fit inside these modes. Eigene Situation remains a secondary configurator action, not an equal fourth browsing category.

## Scope changes from the first prototype

PNG export is now in scope. Targeted content editing needed for useful slides is in scope. A full arbitrary editor, editable PPTX, backend, API integration and deployment remain deferred.

The old first-test plan remains in git history; docs/WEAVR-FIRST-TEST.md describes a historical attempt. The Weavr Mission is archived. The requested next build is direct Claude via Orca on the NUC, with no automatic merge/deploy.

## Verification

Preserve existing content/variant fixes and add checks for routing convergence, shared cross-app identity, text editing and real export files. Browser screenshots/reference comparison and inspection of downloaded PNGs are required for a visual acceptance claim.
