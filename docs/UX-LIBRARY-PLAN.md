> Historical V2 build reference. V3 is merged into main at `300e006`. For new work use [the active build plan](BUILD-PLAN.md) and [Slides as Code concept](SLIDES-AS-CODE-CONCEPT.md). Older baseline instructions and deferrals below are not current execution instructions.

# UX plan — three entrances to one M365 visual library

Status: next-build specification, not implemented.
Date: 2026-10-29.
Companion: [M365 UI fidelity and slide-output plan](M365-UI-FIDELITY-PLAN.md).

## Product promise

A library of recognisable working situations and configurable M365 application visuals for adoption, training and consulting. Users choose a context, tool or work problem, adapt the example, then capture/export a convincing scene or a conceptual explanation for a slide.

Suggested landing promise:
**M365-Situationen sichtbar machen — ohne eine Testumgebung aufzubauen.**

Short working explanation:
**Beispiel wählen → anpassen → als Schulungsvisual verwenden.**

Show the result immediately: the same situation as a recognisable application scene and as a clear principle graphic. Use a real rendered example, not a decorative generic product illustration.

## Information architecture

Three equal entries, each explaining what the visitor can expect:

| Entry | Starting question | Browse |
| --- | --- | --- |
| Team-Personas | Which working context resembles ours? | Department, cross-functional project, research group, committee, teaching team, individual work |
| Tools | Which interface do I need a visual of? | Teams, Outlook, SharePoint, OneDrive, Windows Explorer; Planner/To Do as existing or later coverage |
| Use Cases | Which problem or principle do I want to explain? | Attachment copies, lost decisions, onboarding, shared responsibilities, handover, personal/shared work |

Keep individual work available despite the Team-Personas label. Persona here means a collaboration/working-world archetype, not a demographic profile.

**Eigene Situation** remains a visible secondary action on landing and inside the library. It opens the existing configurator with useful defaults; it is not a fourth browsing category. Existing configurator URLs must still resolve.

Business and Higher Education remain collections/facets within the library. They are not separate products or different entry flows.

## One shared workspace

All entry paths converge on the same state/model:
- collection and working world;
- scenario/use case;
- selected setup variant;
- application/profile and selected screen;
- selected moment (before/decision/after, when available);
- Szene or Prinzip;
- user content overrides;
- slide composition and annotation state.

A compact context bar exposes **Situation · Tool · Szene / Prinzip**. The selected Team-Persona remains available as context without repeating an entire profile page above every visual.

Changing a view/tool preserves the situation and overrides when compatible. Unsupported combinations have an explicit unavailable state or alternative; never invent a renderer or silently discard content. Changing to a different situation clearly explains whether overrides carry over.

## Entry details

### Team-Personas

Cards show the work pattern, central tension, people/size and a small rendered thumbnail. Users open a world, choose a concrete situation, and arrive in the visual workspace. Keep the existing six world cards and seven legacy scenarios plus the business scenario.

Do not imply that selecting a persona prescribes one universal Teams structure. Keep named alternatives and personal-work options.

### Tools

Tool tiles use recognisable labels and previews. Selecting Teams, Outlook or a file interface shows available screens/examples and supported scenarios.

Allow a visitor to start from the application they need for a training slide. Example:
Tools → Outlook → email with an attachment → Leadership Forum situation → customise → export.

Only advertise a working tool/screen as ready. Mark future families clearly. Do not route a SharePoint tile to an unrelated Teams screenshot while keeping the SharePoint label.

Distinguish:
- Teams file tab;
- SharePoint shared document library;
- OneDrive personal/work files;
- Windows Explorer local/synced files.

They may share lower-level row components but their visible location and context remain distinct.

### Use Cases

Use everyday work questions rather than product features. Examples:
- Welche Dateiversion gilt?
- Wer findet diesen Entscheid später?
- Wo sehen wir, wer was übernimmt?
- Wie findet eine neue Person den Stand?
- Was bleibt persönlich?
- Was bleibt, wenn jemand geht?

Open a matched scenario and relevant scene/principle. Offer other matching situations as alternatives. Do not treat the problem label as a separate duplicate story.

## Workspace and customisation

Make the visual canvas primary. On desktop, put controls in a collapsible side panel; mobile gets explicit Edit / Preview switching. Keep controls outside the exported application.

Minimum fields for a useful slide:
- situation/title;
- participant names;
- selected channel/folder and screen;
- message subject/body or selected post/reply;
- file names, owner and visible modified time;
- selected item and annotation focus.

Scope editing to the renderer's supported objects. Stable IDs bind the same people/files across application views; no copied display text that drifts between scenes. Preserve curated originals and add reset/undo.

The six-question configurator stays deterministic. Explain template rationale and context transfers. Business answers that use a university example must remain clearly labelled, until matching business templates exist.

## Present and export

Keep **Präsentieren / Exportieren** reachable in the workspace. Options:
- application only;
- annotated teaching slide;
- before/after composition;
- conceptual principle.

Provide thumbnail previews of the output layouts. Separate application controls from slide controls; exported assets contain no library navigation, editor fields or exit button.

Export requirements and output-size policy live in the companion plan. Keep fictional-content labelling and necessary assumptions in a quiet slide margin rather than fake application UI.

## Example convergence

All three paths should be able to select the same canonical situation and moment:
- Team-Personas → department → event planning.
- Tools → Outlook → email and attachment.
- Use Cases → Welche Dateiversion gilt? → event planning.

After entry, users can switch from Outlook to the related Teams or file view without losing the identity of the document.

## Acceptance

- Landing explains what this is, how it works and what the output looks like without requiring a long read.
- Team-Personas, Tools and Use Cases are equal, working entry points.
- Eigene Situation is retained as a secondary action, and old links continue to work.
- The same canonical scenario can be reached through all three routes; direct links and Browser Back work.
- Context survives compatible tool/mode changes, custom names remain consistent and originals stay intact.
- The tool picker lists actual supported views and explicit planned/unavailable states.
- Primary visual is not buried beneath long context text; details remain available on demand.
- Export/presentation has a predictable return to the same selection.
- Desktop, 375px mobile, keyboard focus and 200% zoom remain usable.

## Preserve

Existing situations, variants, content provenance, essential assumptions and the legacy atlas route. The previous prototype's fixes for document identity, cross-context labelling and clean-mode assumptions are baseline requirements, not optional rework.

## Out of scope

Backend, Microsoft authentication/Graph, AI generation, arbitrary M365 feature simulation, full business-template catalogue and public deployment.
