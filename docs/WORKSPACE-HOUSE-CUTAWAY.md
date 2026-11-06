# Haus, Zimmer und Regal

The approved overview is the visual reference for the scenario-driven JavaScript renderer. The standalone mockup captures the art direction. The production views use workspace data and the shared render path.

![Overview slide with three Teams houses, team names inside the houses, channel purposes and an aligned file cabinet](mockups/three-houses.png)

[HTML and JavaScript source](mockups/three-houses.html)

## Teaching objective

Someone working across several groups can choose a place for shared work by answering three questions.

| Layer | Metaphor | Decision |
| --- | --- | --- |
| Team | Haus | Who works together and needs access to the material? |
| Kanal | Zimmer | Which topic or workstream does it belong to? |
| Dateiablage | Regal or Dateischrank | Where in this channel’s shared files should the material live? |

A cabinet sits to the right of its room. Folders and subfolders are nested within the cabinet and belong to the same file layer. Posts and decisions belong in the room, and a post can link to the file’s canonical location.

## Slide 1 · The person’s houses

Start from Mara’s fictional perspective. Show three houses side by side. Draw each channel as a named room in a horizontal row and align a filing cabinet to its right. Put the team name and a small team tile inside the house header beneath its roof. Add a team-type label and a short description of who works there. Give each channel one short purpose line and use a restrained Teams-inspired palette with a labelled file column. Use an architectural cutaway with a tiled roof, attic window, wall edges and a shared ground line. The team header borrows the initials tile and expand chevron from the Teams renderer; the rooms reuse its Fluent icons as visual cues for their purpose. The roof, room-purpose icons and cabinets are teaching devices. Keep the cabinets at icon level in the overview. Reveal file and folder names in the comparison with Teams.

| House | Teamtyp | Zusammenarbeit |
| --- | --- | --- |
| Campus & People Development | Stammteam | bereichsintern |
| Onboarding 2027 | Projektteam | bereichsübergreifend |
| Weiterbildungskooperation | Arbeitsgruppe | mit Externen |

## Slide 2 · One house beside Teams

Use **Onboarding 2027** for the worked example. The left column keeps the roof, team tile, the three rooms and their cabinets. The right column shows the existing Teams renderer with the channel navigation, tabs and file list. Mark the same **① team**, **② channel** and **③ file location** on both sides. The initial path is **Onboarding 2027 → Pilotphase → Dateien → Checkliste_Pilot.docx**. Opening «Unterlagen» exposes «Rückmeldungen» inside the same file layer.

Ask «Wo legt Mara die Checkliste ab, damit die ganze Pilotgruppe damit arbeiten kann?» Then follow the path in both views. Selecting a room or its Teams sidebar entry selects the same channel. Selecting a cabinet opens «Dateien». Clicking a folder or file in the mockup, or choosing it in the editor tree, updates the shared selection. Choose the team in the perspective selector. Other cabinets remain at icon level.

## Rebuild in JavaScript

- [workspace-core.js](../src/workspace-core.js) projects the ordered team roots and their channels for the overview. Membership determines visibility. Optional `teamType` and `collaboration` labels describe how the team works. They represent teaching metadata.
- [workspace-view.js](../src/workspace-view.js) builds the cutaway from each team and its channel array. Inline SVG draws the tiled roof, chimney and attic window; HTML and CSS grid draw the team header, horizontal floors and the right-hand cabinet column. Sizes are the mockup's container units at 1920 px. The team header reuses the Teams initials and expand chevron; the team name sits inside the outer walls; the foundations align across the overview.
- Room icons are visual cues, not data: the view reads the channel name and purpose for a few keywords (terms for dates and events, tasks and coordination, learning and people, material and files, pilots and projects) and otherwise shows the discussion icon. «Allgemein» always shows the discussion icon. A channel purpose shows on up to two lines; the overview clamps it to one line when a house has more than four rooms.
- The overview title is derived from the viewer («Mara arbeitet in drei Teams»), with a fixed deck line and a footer legend. The comparison slide takes the project title and shows the selected path in the footer as ① team › ② channel › ③ Dateien › folders › file; long crumbs shrink with an ellipsis, the «Dateien» crumb and the file keep their width.
- The side-by-side view uses one selection from `workspace.nodes` for both sides. Resolve the selection to its team, channel, folder and file using stable IDs. Keep the Teams rail, channel list, tabs, breadcrumb and file table in the [existing Teams renderer](../src/m365.js), scaled to 0.957 so the window fills the right column. Keep the house, team labels and cabinets outside the Teams mockup.
- Shared cues: the house borrows the Teams marks (yellow ①②③), the selected-row blue for the open cabinet and its selected entry, the tab underline for the active column label, and the team tile colour, which the Teams mockup takes from the house tone in this view. The selected room shows ② in its icon slot, so long names never reflow around the badge.
- The open cabinet of the selected room lists the same entries as the Teams file list: breadcrumb «Dateien › Ordner», file type glyphs, a tick on the selected file, a chevron on folders, and an empty-folder line. In the editor the entries are buttons that select the same node. Other cabinets stay at icon level.
- Both profiles use the same compiler, browser preview and PNG export. Interactions belong to the editor preview. PNGs capture the selected state. The neutral workspace map and Nora's OneDrive example remain available via the original workspace profiles.
- Long channel names truncate with an ellipsis in the Teams channel header, as Teams does, so they no longer run into the tabs. The channel list and the team name still wrap.

The approved reference covers three houses. The renderer supports one to four houses within the existing workspace budget: one or two houses are centred at up to 640 px, four houses use compact type. Houses with more than four rooms use compact rows in the overview; the comparison house does so with more than three rooms. Names that wrap to several lines in a four-house overview or a six-room comparison can still exceed the slide; the export then reports «Häuser passen nicht auf die Folie» instead of cutting content. Evidence for the three-house example, a one-house example with an empty folder and the long-label stress cases is in [evidence-workspace-houses](evidence-workspace-houses/). The Teams mockup on the comparison slide is scoped to the selected team. See the [workspace handoff](WORKSPACE-PROFILE-HANDOFF.md) for the portable fields and the CLI and MCP commands.
