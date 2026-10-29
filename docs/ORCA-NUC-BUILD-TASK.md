> Historical V2 build reference. V3 is merged into main at `300e006`. For new work use [the active build plan](BUILD-PLAN.md) and [Slides as Code concept](SLIDES-AS-CODE-CONCEPT.md). Older baseline instructions and deferrals below are not current execution instructions.

# Claude via Orca on NUC — next M365 visual-library build

Use this as a direct implementation task, not a request to prepare another plan.

## Goal

Deliver the next usable increment of blackmath88/msteams-personas:
1. The self-explanatory landing and three-entry library UX: Team-Personas, Tools, Use Cases.
2. A much more faithful Teams renderer and actual PowerPoint-ready PNG output.
3. Then extend one coherent scenario across Outlook, Explorer and SharePoint, with OneDrive as the personal-work follow-up.

Aim for finished, browser-tested vertical paths, not a collection of unfinished mock shells.

## Host, runtime and time

Execute on the NUC with Claude through the installed Orca environment. Do not silently use Blackbird or Nebu, or switch providers. No new paid API services.

Use a first build window of up to 90 minutes, including orientation, retries, verification and handoff. Stop early if the deliverable is complete. At the deadline, checkpoint unfinished work honestly.

Before dispatching an unattended worker, verify Orca can enforce a deadline and observe settlement. A prompt saying 90 minutes is not enforcement. If there is no qualified supervisor, continue direct foreground work where possible and report the limitation; do not launch unbounded unattended workers.

Resolve the Orca executable once:
- ORCA_CLI_COMMAND if set;
- otherwise orca-dev when ORCA_DEV_REPO_ROOT identifies this dev session;
- otherwise orca-ide on Linux outside an Orca-managed terminal;
- otherwise orca.

Use the resolved executable's skills get orchestration before coordination. Inspect --help for actual supported flags; do not invent runtime commands. Prefer one builder; at most two concurrent workers when a separate read-only review genuinely helps. Use disjoint worktrees/ownership, and do not recursively delegate.

## Baseline: do not lose the prototype

1. Inspect git status, worktrees and active work. Preserve dirty files and other people's changes.
2. Fetch main and prototype/visual-library-v1.
3. The last inspected prototype was e9220ff8954ea9a9541c4ee87b34c206a8dd8ede, while main still held the older atlas. Check whether main now includes it; do not assume.
4. If it is still separate, create your new implementation branch/worktree from the latest prototype head, then integrate current origin/main's planning changes into that branch. Resolve documentation conflicts by retaining the prototype's truthful implementation evidence and the newer product plans. Do not merge your work into main.
5. Record exact prototype, planning and working-base SHAs.
6. Read AGENTS.md, docs/BUILD-PLAN.md, docs/UX-LIBRARY-PLAN.md, docs/M365-UI-FIDELITY-PLAN.md, docs/PROTOTYPE-HANDOFF.md and docs/STATUS.md.

The new plans supersede earlier deferrals of PNG export and the old three-entry Persona / Use Case / Eigene Situation hierarchy. Full authoring and editable PPTX remain deferred.

## Governance

The previous Weavr Mission msteams-visual-library-first-slice is archived. This is direct Orca work, not Weavr execution. Check for competing active work before writing; do not revive or dispatch Weavr, edit Mission authority or waive Needs.

Do not let historical WEAVR-FIRST-TEST or origin briefs override the current direct task. Do not change other repositories, host infrastructure, account credentials, CI secrets or governance controls.

## Product targets

### UX

Landing shows what this is, how it works and real rendered output.

Three equal entries:
- Team-Personas — collaboration context.
- Tools — interface/application.
- Use Cases — work problem/learning point.

All reach the same canonical scenario/workspace. Eigene Situation remains a visible secondary configurator action, and old routes remain valid.

Keep a compact Situation · Tool · Szene / Prinzip context bar. Preserve compatible selections/custom names when changing views. Supported and unavailable tool states must be honest.

### Fidelity

Inspect/document actual reference screenshots and the selected profile before styling. Choose coherent German light-theme profiles; do not mix Teams layouts or classic/new Outlook.

Teams must visibly gain the appropriate application rail, global header/search, navigation, channel header, posts/replies/composer and file-view details. Replace the generic collaboration window and default permanent member roster. Match proportions, spacing and density, not just colours.

Keep the application UI distinct from the website/editor and from teaching annotations. Preserve the conceptual Prinzip views.

### Shared content

Use stable people/document identities across renderers. Keep the prototype fixes for document lifecycle identity, explicit access variants, cross-context configurator labels and essential assumptions in clean mode.

Targeted controls should support an actually useful slide: names, selected tool/screen, message/post text and selected file. Avoid a general-purpose form/schema editor.

### Export

Move beyond screenshot instructions: implement downloadable PNG.
- 1920 x 1080 teaching compositions.
- Clean application view and annotated version.
- Principle and before/after compositions.
- No editor/library/exit controls in output.
- Quiet fictional-content attribution and essential assumptions outside the app shell.
- Inspect actual downloaded files for size, legibility and clipping.

Keep assets local/offline. A justified small bundled export dependency is acceptable; no CDN, API or backend requirement.

## Priorities inside the attempt

P0 — finish these together:
- Preserve the existing prototype and routes.
- Three-entry landing/library and shared workspace selection.
- One convincingly faithful Teams scene.
- Functional PNG output for Teams and Prinzip.
- Show that the same renderer works with Leadership Forum and the business example.

P1 — then complete one cross-application story:
- Outlook attachment.
- Explorer downloaded copies.
- Teams conversation around the canonical shared document.
- SharePoint library containing that document.
Use consistent people, file/version identities and moments.

P2 — OneDrive personal scene and wider renderer coverage.

Do not mark P1/P2 complete if only navigation placeholders exist. A polished P0 is better than five inconsistent application shells.

## Verification

Use the existing check-worlds validator, logic suite and browser journey as baseline. Inspect the actual commands/harness rather than assuming a package setup.

Add meaningful checks for:
- Three entrances converging on the same scenario.
- Tool/screen selection preserving shared state.
- Old routes and variants.
- Cross-app document identity.
- Safe rendering of edited text.
- Real PNG bytes/dimensions and selected output state.

Browser-test desktop, 375px mobile browsing, keyboard and 200% zoom. Inspect screenshots against the reference, then fix visible issues. Review exported PNGs at their actual dimensions. Fitting a frame alone is not visual acceptance.

Do not silently truncate half a post to pass overflow checks. Use explicit viewport/crop choices or fit feedback.

## Autonomy and authority

Make routine decisions yourself; do not stop for cosmetic preferences. If blocked, preserve the working path, report the precise limitation and continue independent useful work.

Write only application code/assets/data, focused tests, necessary local dependency manifests and product/handoff documentation within this repository. Do not edit .weavr, CI/deployment/secret configuration or unrelated repositories.

Commit your own work and push the implementation branch using existing access. No force push, automatic PR, merge to main or deployment.

## Handoff

Update docs/PROTOTYPE-HANDOFF.md and add docs/V2-BUILD-HANDOFF.md with:
- Exact baselines, branch and final commit.
- Actual host/runtime; whether work was direct or supervised through Orca.
- How to run/open the result.
- Finished UX, renderer and export paths.
- References/profile choices.
- Tests actually run.
- Screenshots and actual PNG samples.
- Incomplete priorities, known limitations and the next step.
- Active/unsettled workers, if any.

Return a concise report distinguishing implemented, browser-verified and unfinished work. Begin implementation after a brief orientation; do not end with another proposed plan.
