# Migration provenance

## Source

- Repository: https://github.com/blackmath88/m365-toolbox
- Source commit: `4af0e42219b346eb7676317f213e3998c5792cf8`
- Atlas path: `team-personas/higher-education/`
- Tokens: `assets/tokens.css`
- Source licence statement: CC BY 4.0, in the source repository README.
- Licence: https://creativecommons.org/licenses/by/4.0/

The source is Achim Imboden / blackmath88's M365 training toolbox for the University of Basel. Attribution and the source commit are retained here. The CC BY 4.0 licence applies to the extracted work and its adaptations.

## Imported files

The root HTML, CSS, renderer, data and validator are copied from the pinned source. Tokens are copied locally so the extracted app has no dependency on the old repository.

The HTML stylesheet and navigation paths and the document titles are adapted to the standalone repository. The historical schema identifier `m365-toolbox.higher-education-worlds/v2` and `HE_WORLDS` / `HE_ATLAS` globals are intentionally retained to preserve compatibility.

Historical BRIEF, CONTENT-DIRECTION and UI-GUIDANCE files are retained under `docs/origin/`. Their old paths, branch assumptions and instructions describe past work; current product direction is in `docs/PRODUCT.md`.

## Relationship to the old project

The generic `team-personas/` tool and Higher Education Atlas remain in m365-toolbox. This extraction does not modify or remove them.

The new repository starts an independent product: reusable fictional working worlds, scenario authoring and screenshot-like training visuals. The Unibas / isolutions material is its initial example collection, not a limit on future organisational contexts.

The separate `teams-mock-styles-review.html` is a historical review artifact, not an implemented editor or part of this extracted runtime.
