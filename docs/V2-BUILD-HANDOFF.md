# V2 build handoff: three-entry library, M365 renderers, PNG export

Date: 2026-10-29. Build window: 11:49–12:18 CET (about 30 minutes, within the 90-minute limit).

## Revision and baselines

| | |
| --- | --- |
| Planning commit (`origin/main`) | `16ac1df84dac2b65186d4f83b74c1495e915b88e` |
| Prototype baseline | `prototype/visual-library-v1` at `e9220ff8954ea9a9541c4ee87b34c206a8dd8ede`. It was still separate from main, so it was preserved unchanged. |
| Working base | `054f936`: a merge of `origin/main` planning docs into the prototype. Conflicts in README/STATUS were resolved by keeping main's newer plan text plus the prototype's evidence paragraph. |
| Implementation branch | `v2/library-teams-export`, pushed to origin (worktree `../msteams-personas-v2`) |
| Implementation commit | `7bd2049` (code, tests, screenshots, PNG samples). The final branch head is the commit that adds this handoff: run `git log -1 origin/v2/library-teams-export`. |
| Not done | No merge to main, no PR, no deployment. Weavr was not touched; the archived mission was not revived. |

## Host, runtime, supervision

- **Host:** the NUC (`linuc`), with Node 26.8.1 and Chromium 154 headless for tests.
- **Builder:** Claude (Opus 5.5) in the Claude desktop app. No other provider, Blackbird or Nebu was used.
- **Orca:**
  - Orca 1.4.230 is installed (`orca`). `ORCA_CLI_COMMAND` and `ORCA_DEV_REPO_ROOT` are unset.
  - `orca skills get orchestration` was inspected. It offers wait/check timeouts (`check --wait --timeout-ms`), but nothing that enforces a deadline on, or terminates, an unattended worker.
  - Following the task rule, **no unattended worker was dispatched**. All work was direct foreground work by one builder.
- **Active or unsettled workers:** none.

## Run

Open `index.html` in a browser. It works offline with no install, and all assets are local.

Tests (Node ≥ 22, Chromium):

```sh
node check-worlds.mjs
node --test tests/model.test.mjs
python3 -m http.server 8765 --bind 127.0.0.1   # second terminal
node tests/journey.mjs                          # rewrites docs/screenshots/
```

Note: run `node --test tests/model.test.mjs` with the file name. A bare `node --test tests/` also picks up `journey.mjs`, which waits for a server.

## Completed paths

**P0, library UX: done and browser-verified**
- **Landing.** It shows:
  - the promise «M365-Situationen sichtbar machen – ohne eine Testumgebung aufzubauen»;
  - the flow «Beispiel wählen → anpassen → als Schulungsvisual verwenden»;
  - real rendered output: a Teams scene, a Prinzip graphic and four story thumbnails.
- **Three equal entries:** Team-Personas (`#/personas`), Tools (`#/tools`, new), Use Cases (`#/usecases`).
- **Eigene Situation** is a secondary action on the landing and in the header. The configurator is unchanged.
- **Tools page** shows honest states:
  - Teams: Bereit.
  - Outlook, Explorer, SharePoint: «Bereit in der Dateigeschichte».
  - Planner/To Do: Teilweise.
  - OneDrive: Geplant, with an explanatory note.
- **Workspace** adds a compact Situation · Tool · Darstellung bar and a tool picker:
  - Teams / Outlook / Explorer / SharePoint;
  - OneDrive is marked «geplant»;
  - situations without the story show «nicht verfügbar» plus an unavailable panel. No invented screens.
- **Routes:** all old routes still work (`#/s/<sid>/<variant>/szene/posts|files|tasks`, `#/p/...`, `#/konfigurator/...`, `atlas.html`). Scene sub-routes are extended with `outlook|explorer|sharepoint`, and presentation adds a composition segment `/app|folie|vergleich`.

**P0, Teams fidelity: done and browser-verified.** It replaces the generic collaboration window and has:
- the app rail with Teams selected;
- a title bar with back/forward, search and account presence;
- the «Teams und Kanäle» list with the selected channel;
- a channel header with the team tile, the Beiträge/Dateien/Aufgaben tabs, a facepile and «Besprechen»;
- post cards with subject, attachment card, reactions, collapsed replies, «Antworten» and «Beitrag starten»;
- a Files command bar plus library table, and a task list.

The permanent member roster is gone. A members pane appears only when a guest/external is part of the teaching point (commission guest variant). Profiles and sources are in [REFERENCE-PROFILES.md](REFERENCE-PROFILES.md).

The same renderer serves all non-personal situations: Leadership Forum, the business example Kundenportal, research, commission and teaching. Personal-work situations keep the earlier «Persönliche Ablage» renderer.

**P0, PNG export: done; actual files inspected**
- A dependency-free export (`src/export.js`): DOM → SVG `foreignObject` (with all local CSS and the icon sprite) → canvas → `toBlob` → download. No CDN, API or backend.
- **Outputs at 1920 × 1080:**
  - Nur Anwendung (clean application view);
  - Folie mit Hinweisen (app + notes column + title);
  - Vorher / Nachher (Explorer copies vs SharePoint library);
  - Prinzip-Folie.
- The preview stage shows exactly the composition that gets exported.
- **Output content:**
  - No controls in the output.
  - The fictional-content label and essential assumptions sit in a quiet slide footer, outside the app shell.
- **Fit handling:**
  - Long Prinzip texts step down density.
  - Content that does not fit is reported (stage status / workspace warning). It is never silently truncated.

**P1, cross-application story: done for Leadership Forum and Kundenportal**
- **Outlook:** Mara's mail to Daniel with `Veranstaltungsplan_Mara.xlsx`, plus Sophie's v2 and Regula's HR list.
- **Explorer:** Daniel's Downloads holds those copies plus a double download «(1)».
- **Teams:** Mara's post points to the canonical `Veranstaltungsplan.xlsx`.
- **SharePoint:** the team site library contains the same file, selected, with a details pane.
- **Identity:** the copies are derived from `principles.doc.copies`, so Prinzip, Outlook and Explorer show identical names. The canonical file is the existing scene file.
- **Variants:** the alternative variant («Kanal») moves site and folder with it.
- The business example (Aylin, `Anforderungsliste Kundenportal.xlsx`) uses the same story code.

**Targeted content controls (story situations)**
- Shared file name, mail subject/body and Teams post title/text.
- Edits apply in Outlook, Teams, SharePoint and Prinzip. Explorer copies keep their names on purpose.
- Curated originals are untouched, and there is a reset button.
- All text is escaped. A test injects `<img onerror>` and checks that it renders as text.

## Tests actually run (final run on this branch)

| Check | Result |
| --- | --- |
| `node check-worlds.mjs` | 0 errors, 0 warnings |
| `node --test tests/model.test.mjs` | 12/12 (9 existing + 3 new: story identity, overrides leave originals intact, tool availability) |
| `node tests/journey.mjs` | **81/81** |

The browser journey (headless Chromium) covers:
- all earlier checks, adapted to the new markup;
- three entrances converging on `leadership-forum/eigenes-team`;
- a custom name surviving Teams → Outlook → Explorer → SharePoint → Teams;
- the renamed canonical file appearing in SharePoint, Teams and Prinzip, while Explorer copies match the Prinzip copies;
- escaped edited text;
- the unavailable state;
- old tab routes;
- 5 real PNG exports (signature, 1920×1080, size, selected kind, no controls);
- a 12 situation/variant × 6 view stage-fit + token + document-identity sweep;
- 375px mobile and 200% zoom without horizontal scroll;
- keyboard reach of the entries;
- zero JS errors.

## Screenshots and PNG samples

- `docs/screenshots/`: regenerated by the journey (landing, scenes, Prinzip, stage, configurator, mobile, zoom).
- `docs/png-samples/`: actual exported files, inspected at full size:
  - `leadership-forum-2027-teams-posts-app.png`, `…-teams-posts-folie.png`
  - `leadership-forum-2027-outlook-folie.png`, `…-explorer-folie.png`, `…-sharepoint-app.png`, `…-sharepoint-vergleich.png`
  - `leadership-forum-2027-prinzip-doc-prinzip.png`
  - `kundenportal-bis-maerz-teams-posts-folie.png`, `…-outlook-app.png`, `…-prinzip-chat-prinzip.png`

  Each is 1920 × 1080, 180–290 KB.

## Known limitations

- **Text labels:** the rail/command labels beyond the two Microsoft Support pages are from product familiarity, not a captured reference screenshot. See REFERENCE-PROFILES.md.
- **Fonts:** the font stack prefers Segoe UI. On machines without it (like this Linux NUC), PNGs render in the fallback sans-serif, so metrics differ slightly from Windows output.
- **Mobile:** at 375px the application preview is a scaled thumbnail. Editing works, but full-size viewing and export are desktop-oriented, as the plan allows.
- **Prinzip density:** the fit routine can over-compact some texts, which leaves extra bottom space on some Prinzip slides.
- **Not built:**
  - a 2× (3840 × 2160) export option (the code supports a scale argument, but there is no UI);
  - an annotated version of Vorher/Nachher;
  - editable PPTX (deferred by plan).
- **Story coverage:** Outlook/Explorer/SharePoint stories exist only for Leadership Forum and Kundenportal. The other situations show an explicit unavailable state.

## Remaining work (next step)

1. **Fidelity review:** review the Teams/Outlook/SharePoint visuals against a real screenshot from the target webinar tenant, then adjust labels and proportions in `src/m365.css`.
2. **P2, OneDrive:** a personal-files renderer for the Nora Keller situations, replacing «Persönliche Ablage» for them.
3. **More stories:** extend `LIB.stories` to further situations, and add Teams chat and Planner screens if needed.
4. **Export options:** a 2× export option and a crop choice («Fokus: Beitrag») for tighter slide framing.
