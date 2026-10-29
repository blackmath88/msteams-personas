# V3 build handoff: trainer library with Planner, OneDrive, chat, To Do, sequences and AI simulation

Date: 2026-10-29. Build window: 12:42–about 13:50 CET. The limit was 150 minutes; the work finished well inside it.

## Revision

| | |
| --- | --- |
| Baseline | `v2/library-teams-export` at `5081206cdde007bdb85e85370bf98aae4e504271` (reviewed v2 head) |
| Branch | `v3/trainer-library`, an isolated worktree `../msteams-personas-v3` cut from the baseline and pushed to origin |
| Final commit | The branch head, which is the commit that adds this handoff. Run `git log -1 origin/v3/trainer-library`. The implementation commits are `b506e67` → `f49c833`, plus the handoff commit. |
| Not done | No merge, no PR, no deployment. Weavr was not touched; the archived mission was not revived. |

## Runtime and supervision

- **Host and builder:** the NUC (`linuc`), with Node 26.8.1 and Chromium 154 headless. The builder was Claude (Opus 5.5) in the Claude desktop app, one builder working directly in the foreground.
- **Orca:**
  - Orca 1.4.230 is installed and its runtime is reachable (`orca status`: ready).
  - `orca orchestration` offers `worker-start` (its `--timeout-ms` is a wait timeout), `worker-stop` and `check --wait --timeout-ms`.
  - Nothing enforces a runtime deadline on an unattended worker by itself; only a supervising coordinator could stop one. Following the task rule, **no unattended worker was started**, and the work did not need delegation.
- **Active or unsettled workers:** none. The only process this run left was the local static test server, which it stopped.

## Run

Open `index.html` in a browser. It works offline: all assets are local, with no CDN, API or backend.

```sh
node check-worlds.mjs
node --test tests/model.test.mjs
python3 -m http.server 8766 --bind 127.0.0.1   # second terminal
node tests/journey.mjs                          # default base http://127.0.0.1:8766/index.html; rewrites docs/screenshots/
```

## How a trainer creates a first slide sequence

1. **Choose:**
   - landing → «Abfolgen für eure Schulung», or
   - one of the entrances: Team-Personas, Tools or Use Cases.

   Every route opens the same workspace.
2. **Adapt (step 2 of the flow bar):**
   - pick the application and screen in the grouped picker (Teams, Outlook, Dateien, Aufgaben); unavailable combinations are shown as «nicht verfügbar», with the reason on hover;
   - edit the fields for this screen on the right: post subjects/text, mail subject/body, shared file name, chat messages, task titles, plus names;
   - the preview updates live, and the context bar shows «angepasst: …».
3. **Check the framing:** click «Bildausschnitt prüfen und exportieren». Choose «Nur Anwendung», «Folie mit Hinweisen», «Fokus-Ausschnitt» or «Vorher / Nachher» (file story only); Prinzip slides have their own layout. Fit problems are reported in the status line instead of being cut silently.
4. **Export:**
   - «PNG herunterladen» saves 1920 × 1080; the «2×» option saves 3840 × 2160;
   - in a sequence, «Ganze Abfolge» saves every step as `01-…png`, `02-…png` in story order;
   - ← / → move through the steps.
5. **Save:**
   - customisations stay in this browser (localStorage);
   - «Anpassungen sichern» downloads or imports a versioned JSON file (`msteams-personas.customisations`, version 1), or resets everything.

## Implemented and browser-verified

**Priority 1: fidelity fixes**
- The Outlook attachment name is never truncated: the card grows, and the name wraps if needed. Teams attachment names likewise.
- Annotation badges are fixed 24 px circles, never stretched. The test checks width = height for every badge on the stage.
- SharePoint row badges no longer leak an unmatched number.
- Planner buckets size to the available width, and the fit check now also detects **horizontal** clipping. That check found a real bug: the reviewed-AI bucket was off-screen. It is fixed.
- Lighter slide-frame shadow.
- The Teams «Aufgaben» tab now hosts the team's Planner board, so the same tasks appear as on the Planner screen.

**Priority 2: new screens**

Each one has editable content, PNG export and honest availability.

| Screen | Profile | Where | Learning purpose |
| --- | --- | --- | --- |
| Teams chat | New Teams, Chat in the rail | All team situations: curated for Leadership Forum, Kundenportal and Onboarding; derived from the «Chat oder Kanal?» binding elsewhere (labelled) | The decision is made in a 1:1 chat: the «before» of the chat principle |
| Planner board | New Planner web, Board by bucket | Situations with shared tasks | Ownership, due dates and buckets visible to the team |
| Planner task details | Dialog over the board | Leadership Forum, Kundenportal, Onboarding | One owner, a checklist for sub-steps, a comment in context |
| To Do | To Do web, «Mein Tag» | Team situations with tasks, and Nora | Personal tasks next to «Zugewiesen an mich» tasks from the plan (same identity) |
| OneDrive | OneDrive for work or school, «Meine Dateien» | Nora Keller (3 situations) | Private files vs specifically shared files |
| Meeting recap (AI simulation) | Teams meeting, «Zusammenfassung» | Kundenportal | AI notes and suggested tasks with visible human review: accept, edit or reject |

**Priority 3: trainer UX**
- A 4-step flow bar («Situation wählen → Szene anpassen → Bildausschnitt prüfen → Exportieren»).
- A grouped screen picker, focused content fields for each screen, a customisation state in the context bar and a compact variant switcher.
- Sequences with a step bar, objective and boundary, Zurück/Weiter, arrow keys on the stage and whole-sequence export.
- A focus crop per tool, and 2× export.
- localStorage persistence, plus a validated JSON export/import (schema, version, known situations, string-only values, size limits) and a global reset.
- Assumptions (access, licensing) stay in the workspace and in the slide footer.

**Priority 4: scenarios.** See [SCENARIO-BACKLOG.md](SCENARIO-BACKLOG.md) for 10 sourced patterns. There are **7 sequences** (six new or expanded beyond v2's single file story):
- `dateiversion`: Leadership Forum; Outlook → Explorer → Teams → SharePoint → Prinzip.
- `entscheid-chat` (business): chat → To Do → channel post → Prinzip.
- `planner-todo`: Planner → task details → To Do → posts → Prinzip.
- `einarbeitung` (business, **new world**: Kundendienst, Brunner Haustechnik AG, with 6 new fictional people): posts → chat → Planner → To Do → Prinzip.
- `abwesenheit`: OneDrive → To Do → Prinzip.
- `sitzungszyklus`: committee posts → files → chat → Prinzip chat → Prinzip tasks. It deliberately shows **no plan**, as a contextual alternative.
- `ki-besprechung`: see Priority 5.

Each sequence has an objective, a boundary, 3–5 moments, a principle, and consistent people, file and task identities.

**Priority 5: AI example**
- `ki-besprechung`: meeting recap with AI notes and four suggestions (accepted, edited, rejected with reason, accepted) → Planner showing only the reviewed tasks (the edited text; the rejected one absent) → Prinzip.
- The screen carries a «Simulation für Schulungszwecke» banner. The slide footer states the licensing and configuration assumption (Teams Premium or Microsoft 365 Copilot, transcription).
- It does not claim that recap tasks go into Planner automatically: the docs searched did not confirm that.

## Tests actually run (final run on this branch)

| Check | Result |
| --- | --- |
| `node check-worlds.mjs` | 0 errors, 0 warnings |
| `node --test tests/model.test.mjs` | **17/17**: 12 earlier tests (adapted to the new availability) plus sequences resolve, chat bindings, task identity, AI rejection/licensing and onboarding-world independence |
| `node tests/journey.mjs` | **109/109** |

The browser journey (headless Chromium) covers:
- all v1/v2 checks;
- a screen sweep of 10 situation/variant combinations × 12 screens: each renders or explains unavailability, and the annotated slide fits;
- sequences: navigation, the stage, arrow keys and a whole-sequence export of 5 PNGs;
- task edit → Planner, To Do and Prinzip;
- long names and filenames in an exported Outlook slide (no ellipsis, fits);
- circular badges;
- a 2× export at 3840 × 2160;
- localStorage persistence after reload, and JSON export, invalid imports rejected, valid import restoring;
- AI review states and the Planner result;
- a long post triggering a visible fit warning in the workspace and on the stage;
- Planner task details;
- offline (no external resources loaded);
- 375 px for 9 routes, including the sequence workspace, the tools page and the sequence stage; 200% zoom for 5 routes; keyboard reach of the entries;
- zero JS errors.

## Screenshots and exported samples

- `docs/screenshots/`: regenerated by the journey, including the new mobile shots `20-mobile-abfolgen.png`, `20-mobile-abfolge-schritt.png`, `20-mobile-tools.png` and `20-mobile-abfolge-praesentation.png`.
- `docs/png-samples-v3/`: actual downloaded PNG files, inspected at full size:
  - `einarbeitung/01–05`: the complete onboarding sequence;
  - `ki-besprechung/01–03`: the AI review sequence;
  - `entscheid-chat/01–04`;
  - `planner-todo/01–05` (step 4 as a focus crop);
  - `abwesenheit/01` (OneDrive);
  - `einzeln/leadership-forum-2027-outlook-fokus.png` and `einzeln/kundenportal-bis-maerz-planner-app@2x.png` (3840 × 2160).

  All 1× files are 1920 × 1080, 170–290 KB.
- `docs/png-samples/`: the v2 samples, unchanged.

## Reference profiles and research

[REFERENCE-PROFILES.md](REFERENCE-PROFILES.md) has been extended with:
- the Teams chat, recap, Planner, To Do and OneDrive profiles;
- the sources and access date;
- which labels are confirmed by Microsoft pages and which come from product familiarity.

No Microsoft screenshots were downloaded or bundled.

## Incomplete and known limitations

- **Labels from familiarity:** several German labels (Planner views, To Do lists, OneDrive «Start/Favoriten», Outlook commands) come from product familiarity, not a captured reference. A real tenant screenshot should be the final reference.
- **Fonts:** Segoe UI is not installed on the NUC, so the PNGs use the fallback sans-serif.
- **Teams posts whitespace:** like the real product, Teams posts are bottom-aligned, which leaves space above short channels. In the focus crop this shows as a band at the top. A content-aware crop would be tighter.
- **Generated chats:** for sitzungszyklus, semesterstart and heat-health the chats are generated from the Prinzip binding. They are labelled as such and are plainer than the curated ones.
- **Limited coverage:**
  - OneDrive exists only for Nora's situations;
  - the Outlook/Explorer/SharePoint story only for Leadership Forum and Kundenportal;
  - task details only for three situations.
- **Saved data is not shared:** customisations are per browser. JSON is the only way to share them; there are no accounts by design.
- **Editing scope:** the Prinzip text fields (recommendation, boundary) are not editable on the slide. File names other than the canonical shared file are curated.
- **Mobile:** at 375 px the app is a scaled thumbnail. Export remains desktop-oriented.
- **Not done:** editable PPTX (deferred by plan) and a Teams mobile renderer (in the backlog).

## Next steps

1. Review against a real screenshot from the target webinar tenant (Teams, Planner, To Do) and adjust labels and density.
2. Content-aware focus crop for Teams posts and chats.
3. Write curated chats for the remaining team situations; add OneDrive and Outlook stories for one more business situation.
4. Recurring-meeting sequence with a non-AI meeting recap (backlog #7) and an external-sharing scene (backlog #9).
