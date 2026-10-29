# Reference profiles for the M365 renderers

Observed 2026-10-29 for the v2 build and extended in the v3 build the same day. These are the visual targets the renderers in `src/m365.js`, `src/m365-more.js` and their CSS follow. They are nachgebildete (recreated) interfaces for teaching slides. They are not Microsoft products and prove nothing about tenant behaviour or permissions.

All profiles use a German, light theme and a fixed 1440 × 810 CSS-px design viewport, the same in workspace, presentation and PNG output. Each screenshot shows one profile; no screen mixes eras or platforms.

| Renderer | Profile | Screens implemented |
| --- | --- | --- |
| Teams | New Teams desktop (2024+), German, light. «Separat» view: the Teams app is selected in the rail, and the list shows «Teams und Kanäle». The channel uses the «Beiträge» layout. | Kanal: Beiträge (posts with collapsed replies), Dateien (command bar + library table), Aufgaben (tab hosting the team's Planner board) |
| Teams chat | Same Teams profile, Chat selected in the rail, 1:1 chat with «Chat / Freigegeben» tabs; own messages right-aligned in light purple | Chat with the decision message (v3) |
| Teams meeting recap | Same Teams profile, Kalender selected, meeting chat with «Zusammenfassung» tab. **AI notes and suggestions are a labelled simulation** | Recap with AI notes, suggested tasks and review states (v3) |
| Planner | Planner (web / new Planner experience), German, light: «Mein Tag / Meine Aufgaben / Meine Pläne», plan header with «Raster / Board / Diagramme / Zeitplan», Board grouped by bucket, task cards with label, due date (overdue in red), checklist count and assignee | Board (v3); also embedded in the Teams «Aufgaben» tab |
| To Do | Microsoft To Do (web), German, light, blue header: «Mein Tag, Wichtig, Geplant, Zugewiesen an mich, Aufgaben» | «Mein Tag» with own tasks and «Zugewiesen an mich» Planner tasks (v3) |
| Outlook | New Outlook / Outlook im Web, German, light: blue header, simplified ribbon, folder pane, message list (Relevant / Sonstige), reading pane on the right. Classic Outlook chrome is **not** mixed in. | Posteingang with selected message and attachment |
| Windows Explorer | Windows 11 File Explorer, German (CH: «Grösse»), light, details view, tabbed title bar | Downloads folder with downloaded copies |
| SharePoint | SharePoint Online team site, modern document library, German, light | Dokumente › channel folder, selected file with details pane |
| OneDrive | OneDrive for work or school (web), German, light: «Meine Dateien», list view, «Freigabe» column (Privat / Geteilt), details pane | Meine Dateien for Nora Keller's situations (v3). The v1 «Persönliche Ablage» renderer is no longer used in the workspace |

## Sources checked

- Microsoft Support (de-DE), *Neue Chat- und Kanalumgebung in Microsoft Teams*: https://support.microsoft.com/de-de/teams/teams-channels/explore-the-new-chat-and-channels-experience-in-microsoft-teams
  - Confirmed labels: «Kombiniert» / «Separat» views; the sections «Favoriten», «Chats», «Teams und Kanäle»; «Alle Ihre Teams und Kanäle anzeigen»; «Neue Elemente».
- Microsoft Support (de-DE), *Kanallayout auswählen*: https://support.microsoft.com/de-de/teams/teams-channels/choose-your-channel-layout-in-microsoft-teams
  - Confirmed labels: the layouts «Beiträge» and «Threads»; «Beitrag mit Antworten».
- Not confirmed from these pages, so taken from product familiarity:
  - the rail labels (Aktivität, Chat, Teams, Kalender, Anrufe, OneDrive, Apps);
  - «Beitrag starten», «Antworten», «Besprechen»;
  - the Outlook, Explorer and SharePoint command labels.

  Verify them against a real screenshot of the target webinar environment before external use.

The user's own environment takes priority. If a real reference screenshot is supplied, its layout (for example a combined chat/channel list or the Threads layout) should replace these defaults.

## Additional sources (v3, accessed 2026-10-29)

- OneDrive (de-DE), *Ansichten auf der OneDrive-Website ändern*: https://support.microsoft.com/de-de/onedrive/change-views-on-the-onedrive-website
  - Confirmed labels: «Meine Dateien», «Zuletzt verwendet», «Geteilt», «Papierkorb»; sorting by «Name», «Geändert», «Freigabe»; «Info» (details pane).
  - «Start», «Favoriten», «Dateigröße» and «Privat» are **not** on that page and were taken from product familiarity.
- Planner board: https://support.microsoft.com/en-us/planner/flag-your-tasks-with-labels and https://support.microsoft.com/en-us/planner/teams/manage-your-team-s-plans-with-planner-in-teams
  - Confirmed: labels, buckets, progress, dates, assignments, comments and attachments on the board; Board grouping by bucket, progress, due date, priority and labels.
  - German labels are from product familiarity.
- To Do: https://support.microsoft.com/en-us/office/see-planner-tasks-in-microsoft-to-do-4cac0115-4e4c-44f7-80ae-d1e25ec0527e
  - Confirmed: «Assigned to me» lists Planner assignments, and tasks can be added to «My Day».
  - The German labels «Zugewiesen an mich» and «Mein Tag» are from product familiarity.
- Teams recap: https://support.microsoft.com/en-us/teams/meetings/recap-in-microsoft-teams and https://learn.microsoft.com/en-us/microsoftteams/intelligent-recap-calls-meetings
  - Confirmed: recap contains notes and follow-up tasks; AI notes and suggested tasks need a Teams Premium or Microsoft 365 Copilot license.
  - **Not** confirmed: automatic transfer of recap tasks to Planner. The simulation therefore shows a human reviewer transferring them.
- Outlook attachments: https://support.microsoft.com/en-us/outlook/mail/open-save-and-edit-attachments-received-in-outlook. The attachment card and dropdown are consistent with this page; the preview behaviour is not shown.

No publicly available product screenshots were downloaded or bundled. All visuals are recreated with local CSS and inline icons.

## Deliberate simplifications

- Replies are collapsed («2 Antworten von …»), as in the Beiträge layout. Full threads are not rendered.
- Teaching marks are small numbered badges. Their explanations sit outside the application, in the workspace notes or the slide column.
- The member roster appears only when the teaching point is membership (guest/external). It is not a permanent panel.
- Controls are illustrative except for the channel tabs, which switch the visible screen.
- Planner shows overdue dates (Mo/Di in the fictional week) in red. Checklist counts are illustrative («0/2»).
- The AI recap is deterministic sample content. It carries a visible simulation label inside the screen and a licensing note in the slide footer.
