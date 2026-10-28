# Prototype handoff: visual-first library v1

Status as of 2026-10-28, after three passes:
1. the 90-minute first prototype
2. slice 2, which completed all worlds
3. a review correction pass

The prototype is ready for integration review. It has not been merged or deployed, and there is no PR yet.

## Revision

| | |
| --- | --- |
| Baseline | `main` at `759c94bae7e61883b5d2634c8d801f759c8f7504` ("Revise build plan for visual-first Weavr test") |
| Branch | `prototype/visual-library-v1` (git worktree `../msteams-personas-proto`) |
| Final commit | The branch head, from `git log -1 prototype/visual-library-v1`. It is the commit that adds this version of the handoff |
| Execution | Direct Claude session (Opus 5.5), one builder. The Orca orchestration skill was loaded, but no worker was dispatched. The Weavr mission `msteams-visual-library-first-slice` was not touched |

## Open / run

Open `index.html` directly in a browser. No install, server, account, CDN or network access is needed.

The legacy atlas is `atlas.html`. Its code and content are unchanged except for a link back to the library.

The tests need Node ≥ 22 and Chromium:

```sh
node check-worlds.mjs
node --test tests/
python3 -m http.server 8765 --bind 127.0.0.1   # in a second terminal
node tests/journey.mjs                          # writes docs/screenshots/
```

## Implemented

**Library and shared state**
- **Landing page:** the headline is "Teams-Situationen zeigen, ohne ein Team zu bauen". The hero shows one situation as both Szene and Prinzip; the previews are inert and have explicit open links.
- **Entry points:** Persona wählen, Use Case wählen and Eigene Situation. Persona and use-case browsing reach the same eight situations, and all seven legacy scenarios plus the business case are reachable.
- **Collections:** five university worlds and one fictional business world. The business world is *Brunner Haustechnik AG, Marketing & Kommunikation, Kundenportal bis März*, labelled as unvalidated synthesis.
- **Shared state:**
  - Routes have the form `#/s/<situation>/<variant>/<szene|prinzip>/<tab|principle>`, and `#/p/…` opens the stage. Direct links and browser Back work.
  - Custom team and participant names are stored per situation in `sessionStorage`, which is session-only by design. The curated originals are never changed.

**Content: all eight situations hand-written**
- The text lives in `src/library.js` (Leadership Forum, Kundenportal, business world) and `src/library-he.js` (the other university situations).
- An atlas-derived fallback remains in `src/model.js` as the adapter for future worlds. No current situation uses it.
- **Documented contradictions are now explicit, selectable variants:**
  - **Leadership Forum:** an own team versus a channel in the existing team.
  - **Kundenportal:** a project team versus a channel in the department team.
  - **Commission:** guest access versus a link per meeting for the external member.
  - **Teaching team:** without versus with a «Bewertung» channel restricted to lecturers.
- Every setup that depends on access or restriction carries an explicit **assumption**. Those assumptions state that the IT checks the real rules, not the scene, and they never promise access without an account.
- **Nora:** her three scenarios each have their own personal scene (files, To Do) and their own principle bindings, with no Team.

**Szene**
- **Frame:** an original simplified frame with a fictional-example label and no Microsoft logos.
- **Tabs:** Beiträge, Dateien and Aufgaben work as real tabs, with arrow keys and deep links, and are shown only where content exists.
- **Channels:** inactive channels are visibly muted and carry a tooltip; they are not fake controls.
- **Members:** marked «extern» or «andere Einheit» where that applies.
- **Annotations:** numbered markers and a «Was hier anders ist» column, both controlled by Hinweise.
- **Persistent footer:** «Bleibt ausserhalb» and «Annahme» stay visible whether Hinweise is on or off.

**Prinzip (three explainers per situation)**
- The three explainers are *Chat oder Kanal?*, *Persönlicher Entwurf oder gemeinsames Dokument?* and *Persönliche oder gemeinsame Verantwortung?*
- Each one has: the problem, a before/after diagram with labelled relationships, the recommendation, the boundary, the alternative setup and, if any, the assumption.
- **Document explainer:** the «Weg dieses Dokuments» strip follows **one** document from its originator's draft to the shared file. What stays personal is a separate, dashed «Anderes Beispiel · bleibt persönlich» box.
- **Copy holders:** each copy names its holder explicitly where file names imply one.
- **Non-person participants** (Coautorin, Vertretung, Sekretariat, Agentur) are shown as labelled placeholders.

**Configurator**
- Six questions with defaults, a progress bar, Back / Weiter, «Antworten ändern», and Zurücksetzen with confirmation.
- **Scoring:** transparent and deterministic. The matched rules are shown as the rationale, and the alternative has a different structure. Confidentiality and external answers add assumptions.
- **Context:** if the best match comes from the other collection (for example Business plus a course answer leads to the university teaching team), the result says so explicitly as «Übertragbares Beispiel aus der Hochschule». The live preview and the alternative carry the same tag.
- **Names:** the name fields next to the live preview keep earlier customisations when answers change.

**Präsentieren**
- **Stage:** a 1600×900 canvas scaled to the viewport, with library and configurator chrome hidden.
- **Controls:** «Beenden (Esc)», Hinweise on/off (checkbox or the H key), and a note that PNG export is not part of this version.
- **Hinweise off:** hides only decorative annotation, meaning markers, the note column and the Situation banner. Boundary, alternative and assumption stay.
- **Long text:** at most 2 posts with 1 reply each, plus a «+ n weitere» line. The alternative shows only its label on stage. If needed, the stage steps down through two density levels. If it still doesn't fit, an explicit «Gekürzt» note appears; no current view needs it.

## Tests (final run on the branch head)

| Command | Result |
| --- | --- |
| `node check-worlds.mjs` | 5 worlds, 24 people, 45 artefacts, 7 scenarios, 25 decision points; **0 errors, 0 warnings** |
| `node --check src/*.js` | pass |
| `node --test tests/` | **9/9 pass** |
| `node tests/journey.mjs` | **62/62 pass** |

**What `node --test tests/` covers**
- All legacy scenarios are reachable, with 5 university worlds plus 1 business world.
- Every person, use-case, principle, document-origin and copy-holder reference resolves.
- No raw name tokens remain in principles, variants, assumptions or scene notes.
- Names carry across modes while the originals stay intact.
- Variants change structure, and all situations are complete with the contradiction variants present.
- The configurator is deterministic, different answers give different results, and the alternative differs from the suggestion.
- The cross-context flag is set correctly.
- Every access-dependent setup carries an assumption.

**What `node tests/journey.mjs` covers** (headless Chromium through `tests/cdp.mjs`, a dependency-free DevTools driver)
- **Entry points:** all three, plus browser Back.
- **Scene tabs:** clicks, arrow keys and the variant switch.
- **Explainers:** all three for both original complete examples.
- **Shared naming:** typing keeps focus, and the names carry into Prinzip and the stage.
- **Stage:**
  - 16:9 that fits the viewport.
  - Chrome hidden.
  - Hinweise off keeps boundary, alternative and assumption.
  - Esc returns to the same view.
- **Sweep over all 12 situation/variant combinations × 6 views:**
  - stage fit with no overflow
  - no raw tokens on the stage or the page
  - the document explainer shows the same document in the shared box and both lifecycle stages
- **Other worlds:**
  - Commission: the guest variant marks the external member, and the link variant leaves him out.
  - Teaching: the variant adds the «Bewertung» channel.
  - Research: the scene renders.
  - Nora: the scenes are distinct.
- **Assumptions with Hinweise off:** visible in the scene, the principle and the stage.
- **Configurator:**
  - Back keeps answers.
  - The result shows a rationale and an alternative.
  - Customisation survives a change of answers.
  - The live preview updates.
  - Different answers give a personal result.
  - A Business plus course answer is labelled «aus der Hochschule».
  - Reset works.
- **Direct links and legacy atlas:** a direct link opens correctly, and the legacy atlas renders.
- **Keyboard:** the Tab order reaches the three entries.
- **Responsive and errors:**
  - 375 px (5 pages): no horizontal scroll.
  - 200% zoom, emulated as 640×400 CSS px at 2× (3 pages): no horizontal scroll.
  - No JS errors.

**Manual checks**
- **Interactive pane (desktop app):** H toggle and Esc on the stage work.
- **Screenshots reviewed by eye:** landing, all scene types, the document explainer (desktop and stage), the configurator transfer result, and the clean-stage assumption.

## Screenshots (`docs/screenshots/`, regenerated by the journey)

- `01` landing
- `02`, `03-*` Leadership Forum: Szene and the three Prinzip explainers
- `04`, `05`, `06-*` Kundenportal: Szene, Aufgaben tab and the three Prinzip explainers
- `07` Nora personal scene
- `08`–`11`, `15` stage:
  - Prinzip with and without annotations
  - business Szene
  - Nora
  - business document explainer
- `12`, `13`, `14`, `16` configurator: question, project result, personal result, cross-context result
- `20-mobile-*` 375 px
- `30` 200% zoom
- `40` commission guest scene; `41` commission tasks
- `42` teaching document explainer, showing the corrected document identity
- `43` research scene
- `44` Nora series tasks
- `45` stage with Hinweise off, keeping its assumption

## Limitations

- **Browsers:** visual checks were done in Chromium only. Firefox, Safari and screen readers were not tested, and 200% zoom was emulated.
- **Customisation depth:** the app adapts templates and names; it does not compose an arbitrary situation. That is accepted for this prototype.
- **Configurator for Business:** it has only the project templates. Other Business answers lead to clearly labelled university examples.
- **Content review:** the 24 explainers and the business story are hand-written fiction. The guest-access, restricted-channel and agency-access assumptions in particular need review by the content owners.
- **Out of scope as planned:** PNG/SVG export, a full editor, persistent drafts, collection import/export, and guest or private-channel technical explainers.
- **Out-of-date brief:** `docs/WEAVR-FIRST-TEST.md` still names `index.html` as the atlas entry. That governance file was intentionally left unchanged.

## Workers

None. No Orca or Weavr dispatch was made. A local static server was used for verification only.

## Next concrete action

Do the integration review of `prototype/visual-library-v1`:
1. Open `index.html`.
2. Try the commission and teaching variants, including Präsentieren with Hinweise off.
3. Have the explainer content reviewed.
4. Then decide on a PR to `main`.
