# Prototype handoff: visual-first library v1

Written 2026-10-28, at the end of a 90-minute autonomous run. This is a first prototype for review. It has not been merged or deployed.

## Revision

| | |
| --- | --- |
| Baseline | `main` at `759c94bae7e61883b5d2634c8d801f759c8f7504` ("Revise build plan for visual-first Weavr test") |
| Branch | `prototype/visual-library-v1` (git worktree `../msteams-personas-proto`) |
| Last implementation commit | `da7250e`. The final branch commit adds this handoff and the doc updates; `git log -1 prototype/visual-library-v1` shows it |
| Execution | Direct Claude session (Opus 5.5). The Orca `orchestration` skill was loaded, but no worker was dispatched: one builder was used, so no unattended worker or deadline enforcement was needed. The archived Weavr mission `msteams-visual-library-first-slice` was not touched |

## Open / run

No build, install or server is required for use. Open `index.html` directly in a browser. All scripts and styles are local, and there is no CDN, web font or network call.

Optional static server for tests:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

The legacy atlas is now `atlas.html`. Its content and code are unchanged; it only gained a link back to the library.

## What is implemented

**Library and shared selection state**
- Landing page. The headline is "Teams-Situationen zeigen, ohne ein Team zu bauen". The hero shows the same Leadership Forum situation twice, once as a Szene and once as a Prinzip. Both previews are inert and have explicit open links.
- Three entry points:
  - **Persona wählen**: six world cards (five university worlds plus Business), each leading to its situations.
  - **Use Case wählen**: six frictions, each leading to matching situations, which open in the matching Prinzip.
  - **Eigene Situation**: the configurator.
- **Persona and use-case browsing reach the same situations.** All seven legacy scenarios are reachable as explicit situations, which is tested. Every university world also links to its detail view in the legacy atlas.
- **New business world:** *Marketing & Kommunikation, Brunner Haustechnik AG* coordinating the *Kundenportal bis März* project with IT, Vertrieb and an external agency. It has six fictional people and is labelled as a fictional synthesis that has not been validated by research.
- **Shared state:**
  - Routes have the form `#/s/<situation>/<variant>/<szene|prinzip>/<tab|principle>`, so direct links and browser Back work.
  - Custom names are stored per situation in `sessionStorage`. This is session-only, as the plan requires.
  - The annotation toggle is global.

**Prinzip (three explainers)**
- The three explainers are *Chat oder Kanal?*, *Persönlicher Entwurf oder gemeinsames Dokument?* and *Persönliche oder gemeinsame Verantwortung?*
- Each one has:
  - the situation's concrete problem
  - a before/after diagram with labelled relationships ("sieht den Entscheid nicht", "finden es später", "teilen, sobald andere mitarbeiten")
  - a contextual recommendation
  - its boundary
  - for situations with variants, the named alternative setup
- **Leadership Forum and Kundenportal:** the bindings are hand-written.
- **Other worlds:** the bindings are derived from the curated atlas texts. Frictions are matched to principles by keyword. Worlds with several scenarios (Nora) use each scenario's own decision point instead of the shared world model.

**Resolving content contradictions through explicit variants**
- **Leadership Forum:** "Eigenes Team für das Forum" (our choice) and "Kanal im bestehenden Team" (alternative) are two selectable variants. Each has its own team name, channels and members, so one scene no longer mixes the two claims.
- **Kundenportal:** "Eigenes, befristetes Projektteam" and "Projektkanal im Abteilungsteam" are handled the same way.
- **External access:** this is shown as an assumption ("Annahme, keine geprüfte Berechtigung"). There is no promise of access without an account.

**Configurator**
- Six questions with defaults, a progress bar, Back / Weiter, "Antworten ändern" and an explicit Zurücksetzen. Reset asks for confirmation and states that the draft is session-only.
- **Transparent scoring:** each template has explicit rules, and the matched rules are shown as "Warum das passt". The second-best template with a different structure is shown as the alternative. Confidentiality and external-participant answers add assumptions and limits.
- **Different answers give different structures** (tested):
  - project with several units → own project team
  - single unit, ongoing → channel
  - one person → personal storage plus link
  - committee → Sitzungszyklus
  - teaching → Semesterstart
  - research data → Heat & Health
- Name fields are shown next to a live preview. Changing answers keeps earlier name customisations.

**Szene**
- An original, simplified frame with no Microsoft logos and a quiet label "Fiktives Beispiel · vereinfachte, Teams-ähnliche Darstellung".
- It shows a team tile, a channel list, members (marked "andere Einheit" where relevant) and working tabs: **Beiträge** (posts with titles, replies and file chips), **Dateien** (file table) and **Aufgaben** (owners, due dates, done state).
- Tabs are real buttons: tab role, arrow-key navigation and deep links. Channels other than the active one are visibly muted and carry a tooltip "In diesem Beispiel nicht ausgearbeitet"; they are not fake buttons.
- Annotations add numbered markers and a "Was hier anders ist" column.
- **Coverage:**
  - Complete scenes: Leadership Forum and Kundenportal.
  - Other team worlds: adapted from the atlas `scenes.target`.
  - Nora: keeps her personal OneDrive + To Do view, and no Team is created.

**Präsentieren**
- A fixed 1600×900 canvas scaled to fit the viewport. Library and configurator chrome are hidden.
- Controls: "Beenden (Esc)", Hinweise on/off (checkbox or the H key), and a note that PNG export is not part of this version.
- Selected situation, variant and custom names are preserved.
- **Long text:** the stage shows at most 2 posts and 1 reply each, with a "+ n weitere" line. On stage, the alternative is reduced to its label. If content still overflows, the stage steps down through two density levels. If it still does not fit, it shows an explicit "Gekürzt" note.

## Tests run (all on the final implementation)

| Command | Result |
| --- | --- |
| `node check-worlds.mjs` | 5 worlds, 24 people, 45 artefacts, 7 scenarios, 25 decision points; **0 errors, 0 warnings** |
| `node --check` on all `src/*.js` | pass |
| `node --test tests/` (`tests/model.test.mjs`) | **6/6 pass**: all legacy scenarios reachable; 5+1 worlds; every person/use-case/principle reference resolves and no unresolved tokens; custom names reach scene + principle text while originals stay intact; variants change structure; configurator deterministic with different results, rationale, a differing alternative and sensitivity assumptions |
| `node tests/journey.mjs` (headless Chromium via a dependency-free CDP driver, `tests/cdp.mjs`) | **52/52 checks pass** (details below) |

What `journey.mjs` exercises in the real UI:
- **All three entry points.** Persona leads to Nora's three scenarios and her personal scene. Use case leads to situations and then to the matching principle.
- **Browser Back.**
- **Business scene:** tab clicks, arrow-key tabs, and the variant switch.
- **Principles:** all three, for both complete examples.
- **Shared naming:** a live update while typing, with focus kept in the field. The names then carry into Prinzip and the stage.
- **Stage:**
  - The stage is 16:9 and fits the viewport.
  - The chrome is hidden.
  - There is no clipping or overlap.
  - H toggles annotations.
  - Esc returns to the same view.
- **Stage-fit sweep:** 4 situations × 6 views.
- **Configurator:**
  - Back keeps answers.
  - The result shows a rationale and an alternative.
  - Customisation survives a change of answers.
  - The live preview updates.
  - A different answer set gives a personal starting point.
  - Reset works.
- **Direct links:** a direct link to a legacy-world principle works, and the legacy atlas renders.
- **Keyboard:** the Tab order reaches all three entries.
- **Responsive and errors:**
  - 375 px (5 pages): no horizontal scroll.
  - 200% zoom, emulated as a 1280×800 window (640×400 CSS px at 2×): no horizontal scroll on landing, Szene or Prinzip.
  - No JS errors.

**Manual checks**
- **Interactive pane (desktop app):** the presentation H toggle and the Escape exit work.
- **Screenshots:** reviewed by eye. Fixes made from that review:
  - stage overlap and mid-line clamping
  - hero previews that were too tall and looked interactive
  - avatar colour collisions and the "L2" team tile
  - a broken personal file table
  - a contradictory "kein Plan" panel
  - weak alternative rationale
  - legacy principles pulling a mismatched friction

## Screenshots

These are in `docs/screenshots/` and are regenerated by `node tests/journey.mjs`:
- `01` landing (desktop, full page)
- `02`, `03-*` Leadership Forum: Szene and the three Prinzip explainers
- `04`, `05`, `06-*` Kundenportal: Szene, Aufgaben tab and the three Prinzip explainers
- `07` Nora personal scene
- `08`, `09`, `10`, `11`, `15` presentation: Prinzip with/without annotations, business Szene, Nora, business Prinzip on stage
- `12`, `13`, `14` configurator: question, result for the project, result for personal work
- `20-mobile-*` 375 px: landing, Szene, Prinzip, configurator, presentation
- `30` 200% zoom Prinzip

## Limitations and open acceptance items

- **Visual quality** is checked only by screenshot review in Chromium. Firefox and Safari were not tested, and no screen reader was used.
- **Zoom** is emulated through the device scale factor, not the browser's zoom setting.
- **Szene for the four other worlds** is adapted from atlas data. Those scenes have fewer posts, no reply threads and no Aufgaben tab, and they are labelled "Szene aus Atlas". Nora's three scenarios share one personal-storage scene.
- **Derived Prinzip bindings** for those worlds rely on curated texts and keyword matching. They read correctly in the cases checked, but they are less tailored than the two complete examples. Placeholder copy-file names (`<Artefakt>_v2.docx` …) are generated.
- **Annotations off** also hides the Situation problem and the boundary/alternative boxes, leaving only the diagram and recommendation. This was a design choice for a clean slide; please review it.
- **The business case** is fictional synthesis and has not been checked against research (`docs/research/PERPLEXITY-USE-CASES-PROMPT.md`).
- **Mobile presentation** works and has no horizontal scroll. The stage scales down and becomes small on a phone, but it remains usable.
- **Out of scope as planned:** PNG/SVG export, a full editor, persistent drafts, collection import/export, and guest or private-channel explainers.
- The two complete principle sets (6 explainers) were hand-written in this run. They should get a content review by the curriculum owners.
- `docs/WEAVR-FIRST-TEST.md` still lists `index.html` as the atlas entry. Governance files and that brief were intentionally left unchanged.

## Workers

None active. No Orca or Weavr dispatch was made. The local test server (`python3 -m http.server 8765`) was started for verification only.

## Next concrete action

Review the branch in a browser: open `index.html`, then `#/s/leadership-forum/eigenes-team/prinzip/chat`, then Präsentieren. Decide on the open design question: what "Hinweise aus" should hide. Then have the six hand-written explainers and the Brunner business story reviewed for content. After that, open a PR from `prototype/visual-library-v1` to `main`.
