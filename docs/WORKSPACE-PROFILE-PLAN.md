# Arbeitsbereich erkunden

Status: initial implementation complete. See the [workspace handoff](WORKSPACE-PROFILE-HANDOFF.md) for what is available. First use case: Uni Basel M365 Module 1, «Teams sinnvoll nutzen».

## Adoption problem

After learning the Teams vocabulary, people still have to decide whether their work belongs in a new team, an existing channel or a shared file. A workspace profile makes that decision visible. In training, present an example and ask participants where they would look. In the browser, let them copy the example, try a structure and see how it would appear in a fictional M365 interface.

The first presentation replaces the setup exposition from Module 1 with a map and a matching scene. Keep the overview introducing the three personas so each module can stand alone. The existing task of finding or sharing a file follows the setup as a focused example.

## Visual grammar

The [house cutaway concept](WORKSPACE-HOUSE-CUTAWAY.md) develops the optional metaphor into a person-centred overview with several Teams, horizontal rooms and a filing cabinet for each room.

Keep the repository’s two visual modes. **Prinzip** explains the workspace with a labelled map. **Szene** shows a recognisable Teams or OneDrive mock for the selected location. «Arbeitsbereich erkunden» is the feature name. In the configurator, label the panes «Arbeitsbereich» and «Vorschau».

| Layer | Default label | Optional metaphor | How to draw it |
| --- | --- | --- | --- |
| 1 | Team | Haus | Name the group, its purpose and its member count when known. |
| 2 | Kanal | Zimmer | Give each channel a short purpose and show the selected one with an outline, icon and text. |
| 3 | Dateiablage | Regal | Show the selected channel’s file location with a SharePoint label and a few example folders or files. Indent folders and files within this layer. |

A channel can have **Beiträge** alongside its file area. A post may link to an existing file. Draw that relationship as a reference and retain the file’s canonical location. Distinguish containment lines from links with both styling and a label. A folder and a file are entries within the storage layer. Use the user-facing term «Team», and reserve Microsoft 365 Groups and SharePoint site topology for future technical explanations.

The default map uses Teams terms. «Haus-Metapher anzeigen» adds Haus, Zimmer and Regal as secondary labels to the map. The scene and file paths keep application terminology. Describe the channel file area as SharePoint-backed in the example and avoid implying a particular site or permission topology. Use the mock renderer’s tab labels consistently within each scene and match terminology to the app version used in the demo.

Use the same names, selected node and callout numbers in both views. Keep the map visibly diagrammatic, with quiet background surfaces, strong hierarchy and a short legend when links appear. Reuse the established M365 shell for the scene, with restrained numbered markers and a cropped content area. Label examples as fictional. Use Swiss spelling and carry the explanation outside the screenshot so it stays readable on a projector.

For the first training export, use two slides. The map teaches the setup and the focused scene shows the place where work happens. Keep a split view on desktop for editing. On narrow screens, stack the map and preview in reading order with the selection intact. A single-slide composition can follow if both halves pass the same readability check.

## Perspectives and fixtures

| Fixture | Starting point | What the example teaches |
| --- | --- | --- |
| Campus & People Development | Team view. Five people in one standing team with «Allgemein», «Leadership Forum», «Learning Programme» and «Interne Organisation». | Select «Leadership Forum». Show the decision about Termin 3 in Beiträge and `Veranstaltungsplan.xlsx` in the file area. The decision and linked file are different objects. |
| Urban Health Analytics | Team view. Seven people in one team with five channels. Expand «Heat & Health Basel» and «Publikationen». | The campaign channel is for coordination. The publication channel holds the working manuscript. The fictional research data system sits outside the M365 map and is labelled separately. |
| Dr. Nora Keller | Person view. The root is Nora’s OneDrive workspace, with no dedicated Team. | The coauthor can edit `Artikel_Grenzen.docx` under the stated assumption. Nora’s research notes are private in this example. A share is a relation to the file. |

A team perspective starts at a team and explains how the group organises work. A person perspective starts at a persona and shows accessible shared spaces and their personal storage. Use explicit, fictional access assumptions. In the first Campus prototype, a team perspective with Mara as the example viewer is sufficient. Add the general person perspective and Nora after that vertical slice. Any later view of another person must filter out personal items that the viewer cannot access. The map describes a proposed workspace, and the app does not connect to a tenant.

## Model and render contract

- Inspect current `main`, the [active build plan](BUILD-PLAN.md) and the project core before implementation. The current baseline has a shared project validator and compiler in `src/project-core.js`, existing curated application scenes, a shared stage and PNG export in `src/export.js`, and the local CLI/MCP operations. Account for the open [task profiles PR](https://github.com/blackmath88/msteams-personas/pull/7) when allocating capability versions.
- Keep one portable workspace definition with stable IDs for people, teams, channels, storage locations and file entries. Store ownership and file or post links as references. Record channel purpose and any example visibility assumptions. Reuse the curated worlds as fixture sources where their shapes allow it.
- Keep view parameters separate from the workspace data. The proposed view references are perspective, viewer where applicable, selected node, and map labelling mode. Map and scene compile from those same objects. A rename follows the ID into both views. Reparenting a file changes its location without creating a duplicate. Decide the exact field and profile names after inspecting the versioned project contract.
- Use the existing browser, CLI and MCP render path. Expose the available profiles and limits through `get_capabilities`, add the Campus fixture through the example/authoring flow, validate with `validate_project`, render through `render_project` and return PNG bytes through `retrieve_artifact`. Keep older projects renderable and advertise the new capability only when the full path works.
- Validate duplicate IDs, dangling references, invalid parent kinds or cycles, selected nodes outside the chosen perspective, and undeclared visibility when it matters to the story. Surface field-level corrections and warn when the export would overflow. Retain the current fictional content, local assets, offline editing and export, and browser-local drafts. Use the existing portable-project editor and import/export flows as the starting point.

## Delivery order

1. **Map and scene for Campus.** Use one fixture to render the four-channel overview and a Teams-style scene focused on «Leadership Forum». Include the decision and the path to the plan. Compare the two PNGs at normal slide size and in the 4:3 Module 1 deck.
2. **Configurable website preview.** Let the user copy the fixture, change team and channel names and purposes, add or move a folder or file, and toggle the metaphor. Selecting a channel or file updates the preview. Save a local draft and round-trip its project JSON. Provide keyboard access to the tree and visible focus. Keep the interaction small enough to use live in a workshop.
3. **Team and person coverage.** Add the research and Nora fixtures. Verify that the person perspective has an appropriate root and visibility. Offer these as reusable starting points for the next modules.
4. **Training handoff.** Expose the completed profiles and fixture via the existing authoring pack and MCP tools. Check actual PNGs through the browser, CLI and MCP. Document any connected-service update or restart separately from the repo implementation.

## Acceptance

- A participant can identify the team, the channel and the shared file area on the map, then point to the same place in the Teams scene. Ask «Wo würdest du den Veranstaltungsplan suchen?» before showing the scene.
- A rename or file move appears in both outputs after export and re-import. The house toggle changes map labels only. Selection is recognisable in greyscale and via keyboard.
- The example sequence validates and the full PNGs are retrievable. The map and cropped scene stay readable when projected and when placed in Nina’s 4:3 slide. Inspect screenshots at desktop and narrow widths. Cover invalid hierarchy and visibility as negative cases.
- Existing projects and curated worlds keep working. Run the repository’s model, project, browser and MCP regressions appropriate to the changed paths, including `node check-worlds.mjs` after fixture or scene changes.

This proposal covers a local planning and teaching tool. Tenant provisioning, permission administration and native PowerPoint authoring are outside this build.
