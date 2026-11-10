# Business-domain review: decisions and verification

Date: 2026-11-10. Documentation-only reconciliation of the user-supplied Perplexity review. No new business examples, taxonomy, renderer changes or tenant checks were implemented in this revision.

## Inputs and authority

- [Returned Perplexity review](PERPLEXITY-BUSINESS-DOMAINS-CH-DE-REVIEW-2026-11-10.md), preserved verbatim from the supplied text.
- Original planning revision `f937a71055c85cb3d3fb7033c8fd8ba6222365d2`, on branch `docs/business-domains-ch-de`.
- Implementation baseline `9a017f59ac7a9792f797d9195c98f6646960066a`, merged PR #14. `origin/main` was fetched and remained at that revision during this reconciliation.
- [Revised build plan](../BUSINESS-DOMAINS-CH-DE-BUILD-PLAN.md).

The external review read selected repository files, with some truncated responses. It did not run the app, inspect actual PNGs, execute tests, enter a tenant or complete the repository's pre-build reading. Its market judgement and source claims are useful research inputs, not independent implementation acceptance or permission to merge. This reconciliation checked consequential source-code claims and a small set of primary pages; it is also not a visual or live-product review.

## Adopt, qualify and leave open

| Recommendation | Disposition | Consequence |
| --- | --- | --- |
| Broaden beyond higher education, retain the existing collection | Adopt | General business and public-service contexts remain the next content priority |
| Build administration and technical-service reference stories first | Adopt | First delivery targets two complete examples, not four immediate builds |
| Each example needs a different decision | Adopt | Administration: agreement versus publication; service: assignment versus accepted visit; trade: uncertainty versus customer promise; engineering: review versus release |
| Engineering replaces manufacturing as the fourth context | Provisional | Engineering is the next fourth-place candidate, but must beat a concrete manufacturing story on distinctness and relevance. Easy office rendering alone is insufficient |
| Bundle Treuhand, Beratung and engineering | Reject the bundle | Research these separately; an engineering review cannot represent all professional services |
| Validate with trainers and practitioners before broadening | Adopt as formative research | Seek domain recognition across CH/DE; complete reviewable artefacts if participants are unavailable and label feedback pending. No invented interviews or representative-demand claim |
| Add Branche and Zusammenarbeit discovery | Adopt with a correction | Use minimal optional catalogue metadata and test labels. Preserve individual work; the review's four initial collaboration labels omitted it |
| Generalise the catalogue factory and source dates | Adopt | Do this before integrating the first business fixture; preserve old output and actual historical access dates |
| Introduce a new project version or renderer suite | Defer | Current profiles fit the first pair; discovery metadata does not require a portable-project version change |
| Treat all sourced figures as independently verified | Reject | Retain source provenance; distinguish reviewer retrieval from local verification and statistical scale from training demand |

## Code claims checked locally

Inspection was against the unchanged implementation baseline, not a new build.

| File / construct | Finding | Planning effect |
| --- | --- | --- |
| [Project core](../../src/project-core.js), `CAPABILITIES.limits`, `STATE_IDS`, validation | Six slides; normally eight people, twelve tasks, eight documents; workspace people limit sixteen; exactly `before` and `after` snapshots | Select a single illustrated transition; the five-slide reference stories do not need a schema extension |
| [Collaboration core](../../src/collaboration-core.js), workflow/component validation | Two–five workflow steps; table components and supported Teams-chat/Outlook surfaces | No arbitrary Loop workspace, third snapshot or full process simulator |
| Project core, chat validation | Two distinct participants | Service clarification uses a two-person exchange; the wider request belongs in posts |
| [Research catalogue](../../src/research-catalogue.js), `project()` | Organisation, audience and source note are university-specific | Parameterise defaults before business integration; preserve university example metadata |
| Research catalogue, `source()` | All sources inherit `2026-11-09` | New records need their own access date and publication/data period, without rewriting old dates |
| [Existing Brunner scene](../../src/scenes-v3.js), `brunner-kundendienst` | Company is Brunner Haustechnik AG; Reto leads customer service, Elif is customer service/buddy, Samuel is service dispatch | Reuse these identities and company. The review's shorthand “Brunner Servicetechnik” must not silently rename or fork them; Nina is a proposed addition |

These checks establish current authoring limits, not that future fixtures render correctly. Any data/scene implementation still requires `node check-worlds.mjs`; renderer changes require all five worlds and three views, plus the applicable existing checks.

## Primary pages rechecked on 10 November 2026

| Source | Confirmed claim | Scope and limit |
| --- | --- | --- |
| [Microsoft Support: Loop task lists and collaborative notes in Planner](https://support.microsoft.com/en-us/loop/manage-your-tasks-from-loop-task-lists-and-collaborative-notes-in-planner) | The first task creates a linked plan. Generated lightweight plans have no plan owner; any member can delete the plan. Advanced task features are accessed in Planner | Product documentation, not live-tenant evidence. Do not label the fictional follow-up coordinator as a product-level plan owner or imply arbitrary-board synchronisation |
| [Microsoft Learn: Loop requirements](https://learn.microsoft.com/en-us/microsoft-365/loop/loop-requirements?view=o365-worldwide) | Creation and workspaces have licence/service requirements and application-specific availability | Check the actual surface and operation; do not apply workspace prerequisites indiscriminately to every component action |
| [DIHK: Digitalisierung 2026](https://www.dihk.de/de/newsroom/digitalisierung-2026-unternehmen-halten-kurs-163290) | Efficiency/quality motives and the time, money and organisational complexity of transformation | Survey context supports simpler stories; it does not establish demand for these personas or sector-wide M365 use |
| [Stadt Köln: Ratsinformationssystem](https://www.stadt-koeln.de/artikel/65600/index.html) | This city provides council meeting material and public results/minutes through its council-information service | A concrete separate-record example. It does not establish our fictional municipality's approval path or that opening hours require a council decision |

The review's newer Bitkom publication/method details and exact Destatis figures remain reviewer-reported leads for the next research slice. This reconciliation does not repeat their numbers as locally verified findings. The plan's earlier BFS/SECO/EFK research retains its original attribution; it was not all re-fetched here. Likewise, existing Planner/To Do and cross-surface Loop evidence is retained from the prior work rather than relabelled as a new tenant test.

## Concrete next build and unresolved evidence

Build the two five-slide reference stories in the revised plan: proposed opening-hours change, and changed technical-service appointment. Preserve one task identity across detail, board and meeting-note views, keep authoritative systems outside the renderer, and show unresolved work explicitly. Keep simpler document/list or dispatch-system alternatives beside each story.

The review contributes eight fictional briefs. Six are backlog hypotheses until implemented; the first two are also proposals today. Direct workplace recognition remains weak, especially for Swiss service operations and municipal internal practice. Manufacturing versus engineering, meaningful CH/DE variants, field/mobile access, actual practitioner feedback, assistant-host behaviour, live-tenant prerequisites and full accessibility review remain open. None is resolved by this documentation commit.
