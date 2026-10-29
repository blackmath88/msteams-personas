# Reference profiles for the M365 renderers

Observed 2026-10-29 for the v2 build. These are the visual targets the renderers in `src/m365.js` / `src/m365.css` follow. They are nachgebildete (recreated) interfaces for teaching slides. They are not Microsoft products and prove nothing about tenant behaviour or permissions.

All profiles use a German, light theme and a fixed 1440 × 810 CSS-px design viewport, the same in workspace, presentation and PNG output. Each screenshot shows one profile; no screen mixes eras or platforms.

| Renderer | Profile | Screens implemented |
| --- | --- | --- |
| Teams | New Teams desktop (2024+), German, light. «Separat» view: the Teams app is selected in the rail, and the list shows «Teams und Kanäle». The channel uses the «Beiträge» layout. | Kanal: Beiträge (posts with collapsed replies), Dateien (command bar + library table), Aufgaben (task list) |
| Outlook | New Outlook / Outlook im Web, German, light: blue header, simplified ribbon, folder pane, message list (Relevant / Sonstige), reading pane on the right. Classic Outlook chrome is **not** mixed in. | Posteingang with selected message and attachment |
| Windows Explorer | Windows 11 File Explorer, German (CH: «Grösse»), light, details view, tabbed title bar | Downloads folder with downloaded copies |
| SharePoint | SharePoint Online team site, modern document library, German, light | Dokumente › channel folder, selected file with details pane |
| OneDrive | Not implemented. Personal-work situations keep the simplified «Persönliche Ablage» view and are labelled as such. | – |

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

## Deliberate simplifications

- Replies are collapsed («2 Antworten von …»), as in the Beiträge layout. Full threads are not rendered.
- Teaching marks are small numbered badges. Their explanations sit outside the application, in the workspace notes or the slide column.
- The member roster appears only when the teaching point is membership (guest/external). It is not a permanent panel.
- Controls are illustrative except for the channel tabs, which switch the visible screen.
