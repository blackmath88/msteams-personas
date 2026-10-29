# M365 UI fidelity and PowerPoint visual-output plan

Status: next-build specification; code is not implemented by this planning update.
Date: 2026-10-29.
Companion: [Library UX plan](UX-LIBRARY-PLAN.md).

## Objective

Build a dynamic M365 adoption UI library that produces believable application screenshots and conceptual graphics for PowerPoint. Existing personas/use cases supply coherent fictional content.

The previous prototype established the story, library, configurator and conceptual explainers. Its scene renderer is still a simplified collaboration illustration. The next increment improves application resemblance and adds genuine visual export.

Acceptance question:
**Can this visual sit beside a real product screenshot in a webinar without its visual grammar breaking?**

That is an explicit review question, not a claim that the mock is the product or proves tenant behaviour.

## Evidence and baseline

Implementation baseline: prototype/visual-library-v1, last inspected at e9220ff8954ea9a9541c4ee87b34c206a8dd8ede. It is separate from main at the time this plan was written.

The prototype handoff reports 9/9 logic tests and 62/62 browser checks after corrections. Those figures are reported evidence, not an independent rerun in this planning task. Earlier independent checks covered 7/7 logic tests and selected committed screenshots.

User review identified insufficient Teams resemblance and asked for mail and file interfaces too. The attached older atlas and presentation screenshots establish context; they are not exact current Microsoft reference screenshots.

Main currently contains the legacy atlas and plans. Do not rebuild from main while accidentally dropping the prototype.

## Architecture: three separate responsibilities

| Layer | Owns |
| --- | --- |
| Situation/content | People, messages, posts, artefacts, tasks, locations, ownership, access assumptions and scenario moments |
| Application renderer | Product/profile shell and visible state for Teams, Outlook or a file interface |
| Slide composition | Canvas size, application viewport/crop, title/caption, annotations, comparison layout and export |

Keep stable IDs for shared people and artefacts. A document may have multiple deliberate copies/versions/locations, but every relationship must be explicit. A personal-to-shared transition follows the same artefact; unrelated drafts must not appear to transform into another document.

Keep conceptual Prinzip renderers as a separate projection of the shared situation. Higher application fidelity must not turn the whole site or the conceptual diagrams into a Teams clone.

## Reference profiles

Before styling, record a small reference sheet with source URL, observation date, platform, locale, theme, navigation layout and supported screen. Use current official screenshots/documentation where available; the user's intended webinar environment takes priority if an actual reference is supplied.

Working targets:
- Teams desktop light, German, one coherent navigation configuration and posts/replies channel layout.
- Outlook work/school web or new Outlook light: choose and document one, do not mix classic and new chrome.
- SharePoint work/school document-library view.
- OneDrive work/school personal files view.
- Windows 11 Explorer list/details view for local/downloaded or synced copies.

Do not pretend these are one universal M365 UI. Support profile boundaries in data/configuration rather than mixing eras or platforms within one screenshot. Do not claim the EDU staff tenant's layout based only on a general account-type note.

Starting primary references (verify the actual view before implementation):
- https://support.microsoft.com/en-us/teams/teams-channels/explore-the-new-chat-and-channels-experience-in-microsoft-teams
- https://support.microsoft.com/en-au/teams/teams-channels/choose-your-channel-layout-in-microsoft-teams
- https://support.microsoft.com/en-us/teams/teams-channels/send-or-reply-to-a-channel-message-in-microsoft-teams
- https://support.microsoft.com/en-us/outlook/mail/change-how-the-message-list-is-displayed-in-outlook
- https://support.microsoft.com/en-us/onedrive/change-views-on-the-onedrive-website

Use references for rendering accuracy. These links alone do not establish every technical/access claim in an example.

## Teams fidelity pass

Replace the generic collaboration-window treatment with recognisable application structure:
- application rail;
- global search/title/account area;
- appropriate chat/team/channel navigation and selected states;
- channel header, screen tabs and actions;
- convincing post/thread hierarchy, subject, author, time, reply controls, reactions where useful, attachment cards and composer;
- proper file-tab command bar/table when selected.

Remove the permanently expanded member roster as the default navigation composition. Member detail can be a selected panel when the teaching point needs it.

Match proportions, density, typography, spacing, separators, selected states and icon language from the selected reference. Avoid arbitrary oversized cards and fake Mac window dots in a Windows/web reference profile.

The existing yellow teaching-note column is a slide overlay, not part of Teams. Keep it outside the application shell. Clean app-only output must contain no explainer/editor chrome.

Implement only interactions needed to select a visual state. Visible controls are functional within the supported mock or clearly illustrative. Do not attempt full messaging/search/permissions behaviour.

## Other renderer families

| Renderer | Minimum useful screen |
| --- | --- |
| Outlook | Folder navigation, message list, selected-message reading pane, sender/recipients, subject, date and attachment card |
| SharePoint | Site/library identity, location/breadcrumb, command bar, shared file rows, selected item and relevant metadata |
| OneDrive | Work/school personal-file context, navigation, command bar and sharing/file state |
| Windows Explorer | Navigation tree, breadcrumb/path, details columns and local or synced file state |

Reuse components where appropriate while keeping the visible application identity accurate. Do not label a generic file table SharePoint or Explorer without its surrounding interface.

Planner/To Do remain supported through existing visuals; a higher-fidelity redesign is later unless time remains after the primary acceptance path.

## One complete cross-application teaching story

Use Leadership Forum as the complete next example and reuse the business case to demonstrate template portability.

Story:
1. Outlook: a participant receives an event-planning file as an attachment.
2. Explorer: downloaded copies/version names create uncertainty.
3. Teams: a channel post points participants to one shared working document.
4. SharePoint: the shared library contains that same canonical document.
5. Prinzip: a before/after explanation connects the shift from travelling copies to a shared object.

Keep participants, filenames, titles and version relationships consistent across all screens. Clearly distinguish deliberately duplicated files from the canonical object. Do not use unrelated documents as before/after stages.

The individual-work case provides the natural OneDrive renderer acceptance example. It can follow the first four-screen story; show an honest unavailable state until implemented.

## Dynamic composition

For the complete story, users can adjust names, post/message subject/body, file name and selected state; edits update relevant views. Add only targeted fields needed to produce an actual useful slide. Retain the configurator; a full arbitrary application editor is not required.

A compact visual selector chooses tool/profile/screen/moment. Shared view state is passed to a renderer; the renderer must not own independent fictional content.

## Export: now in scope

Deliver a real downloadable PNG, not just a button saying to take a screenshot.

Required first outputs:
- application-only image;
- annotated 16:9 teaching slide;
- before/after composition;
- existing principle graphic in a slide frame.

Support 1920 x 1080 for slide compositions. For an app-only image, permit the selected application viewport; do not stretch it to fit. A 3840 x 2160 slide option is desirable after the basic path works. PPTX generation/editable PowerPoint shapes are later: PNGs inserted in PowerPoint satisfy the first milestone.

Retain a quiet fictional-example label/attribution and essential assumptions in the slide margin or accompanying caption. Do not insert pedagogical disclaimers into simulated application controls.

Keep export deterministic: await fonts/layout, use local icons/assets, exclude UI controls, handle long content explicitly and preserve current selection. Inspect the downloaded bytes at their real dimensions. Do not use a screenshot-generation shortcut that requires an unavailable external service or secret.

Use an established minimal local export dependency only if materially useful; justify and lock it. Keep production assets bundled locally and offline. Avoid runtime CDN dependencies.

## Composition and overflow

Separate full application view, focused crop and explainer slide. Users choose the crop; a half-visible post must not be the accidental default output.

Define output safe areas and text budgets. Show fit warnings before export. Do not silently truncate content to make an overflow test pass. If a focused crop intentionally excludes content, make its framing understandable.

Move annotations to overlays or an external column so clean and annotated output share the same app geometry. Essential access assumptions remain available in both.

## Delivery sequence

1. Reference sheet and one high-fidelity Teams example; verify it visually before replicating across scenarios.
2. Landing and three-entry UX wired to the same workspace/state.
3. Real PNG export of Teams and Prinzip at 1920 x 1080.
4. Outlook + Explorer + SharePoint screens for the complete attachment-to-shared-document story.
5. OneDrive personal case, wider scenario migration and optional higher-resolution output.
6. Additional renderer families and editable PPTX only after the above is accepted.

The first implementation attempt should finish a coherent path instead of starting five shallow shells. A handoff must identify which renderer/screens are complete and which are planned.

## Acceptance and proof

- Teams silhouette and detailed structure are recognisable at full-screen and slide scale against the documented reference.
- No generic permanent member list or unrelated window chrome remains in the selected profile.
- Annotation/editor controls stay outside the application shell.
- Three library entry paths can reach the same canonical situation.
- Application/profile changes preserve shared names and document identity.
- At least the complete Teams + Prinzip + PNG path works for university and business contexts.
- The cross-application story is either complete with coherent content or explicitly reported as incomplete; unavailable tools are not advertised as working.
- Actual PNG downloads have correct dimensions, legible text, intact icons and no accidental clipping/controls.
- Browser checks cover existing routes, mobile browsing, keyboard, 200% zoom and export. Export viewport sizing may remain desktop-oriented while editor navigation is responsive.
- The existing content validator and focused tests remain green.
- Proof contains reference observations, exact base/output commit, screenshots, exported PNG samples and known limitations.

## Exclusions and authority

No real tenant, Microsoft login, backend, AI API, unrelated repositories, automatic merge/deployment or Weavr revival. The previous Mission is archived; this is a new direct Orca task, not an unnoticed expansion of its contract.

Preserve licence/provenance and necessary content assumptions. Do not treat a visually convincing mock as a test of real permissions.
