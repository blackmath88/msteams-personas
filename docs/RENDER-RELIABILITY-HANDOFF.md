# Render reliability, round 1 — handoff

Updated 2026-11-16. Branch `claude/kind-darwin-bs5cgr`, based on main at `a349c06`. Not merged, no pull request. Rendering stays in the browser (client side); hosted rendering is not part of this round.

## What changed

| Area | Change | Where |
| --- | --- | --- |
| Font | Selawik 1.01 (Regular, Semibold, Bold; SIL OFL, metric-compatible with Segoe UI) and a five-glyph symbol subset are embedded as data URIs. All slide and application font stacks start with them. | `assets/fonts/`, `assets/fonts.css`, `tools/gen-fonts-css.mjs`, `src/*.css` |
| Font check | Every export requests each face and stops with a message when one is missing, instead of measuring with a fallback. | `Export.fontsReady` in `src/export.js` |
| Fingerprint | Each slide reports how its text wraps: `layout.hash`, `lines`, `textBlocks` in the manifest. The manifest also records the browser (`environment.userAgent`) and fonts. | `Export.layout`, `src/project-render.js`, `tools/render.mjs` |
| Cross-host fixture | Renders all 11 examples (55 slides) and compares their fingerprints with a committed baseline. | `tests/render-fixture.mjs`, `tests/fixtures/layout-baseline.json` |
| Checks on push | Data check, unit tests, generated-font check, and the fixture on Linux and macOS. No deployment. | `.github/workflows/checks.yml` |
| Render page | Built from an explicit list of styles and scripts instead of parsing `index.html`. A unit test fails when the website gains a script or stylesheet that is not classified. | `tools/render.mjs`, `tests/render-page.test.mjs` |
| Headless text | Chromium starts with `--font-render-hinting=none`, so Linux positions glyphs like macOS. | `tools/cdp.mjs` |
| Slide title | Optional `slides[].title` (70 characters). The footer keeps the sequence title. | `src/project-core.js`, `src/export.js`, editor field |
| Slide assumptions | Optional `slides[].assumptions` (up to 3). Absent: all project assumptions, as before. Empty list: none. | same |
| No empty panel | A screen without teaching hints is centred at a larger size; the heading «Was hier zu sehen ist» no longer appears alone. | `src/export.js`, `src/m365.css` |
| Export from a file | Stops with an explanation instead of writing an unstyled PNG (see open points). | `allCss` in `src/export.js` |
| Tests | Four byte-identity checks compared with PNG hashes committed from another machine and failed elsewhere (also on main). They now compare with a CLI render from the same run. | `tests/business-journey.mjs`, `tests/business-mcp.mjs`, `tests/research-mcp.mjs`, `tests/project-journey.mjs` |

Why embedded: `index.html` must work from `file://`, and the PNG export draws the slide through an SVG image, which cannot load external files. A `url(…woff2)` reference would fall back to system fonts in the exported picture without any error.

Project format stays v1 and capability version stays 6. The two slide fields are optional; a renderer from before this branch ignores them and shows the sequence title and all assumptions.

## Verified on this branch

Linux container, HeadlessChrome 153, Node 22.

- `node check-worlds.mjs`: 0 errors, 0 warnings.
- `npm test`: 82 of 82.
- `node tests/render-fixture.mjs`: 11 examples, 55 slides, all fit with Selawik and match the baseline.
- A render with `assets/fonts.css` removed stops with exit code 3 and the font message.
- Browser journeys: `journey` 110 of 110, `project-journey` 51 of 51, `business-journey` 38, `research-journey` 30; `workspace-journey` and `task-profiles-browser` pass.
- MCP and CLI: `mcp-e2e` 49, `components-e2e` 25; `business-mcp`, `research-mcp`, `task-profiles-mcp` and `workspace-mcp` pass.
- From `file://` in headless Chromium the page and the font load, and the editor works.
- Visual check of rendered PNGs: Selawik appears in the exported picture on the first render of a fresh browser.

## Not verified

- **macOS and Windows.** The fixture has only run on Linux. The first GitHub Actions run on macOS is the actual cross-host test; a mismatch there is a finding, not a flaky test.
- **GitHub Actions itself.** The workflow has not been observed running.
- **Emoji** (👍 🙏 in two library scenes) still come from the system emoji font.
- **Safari and Firefox** export with embedded fonts.

## Open points

- **PNG export does not work from `file://` in Chromium.** The browser does not let a page opened as a file read its own stylesheets, so the exported picture had no styling at all while the export reported success. This is older than this branch. The export now stops with an explanation; viewing and editing still work. Over https (GitHub Pages) or a local server the export works. A real fix would embed the styles in the page.
- The published review galleries (`docs/business-review`, `docs/morning-review`) and older screenshots still show the previous font. They were not regenerated, to avoid adding about 100 PNGs to the repository.
- Only `examples/leadership-forum-six.project.json` uses the new slide titles and assumptions. The other examples render as before.
- Weights 500, 650, 750 and 800 in the CSS map to the nearest bundled weight (400, 600 or 700).
- On Windows the screens now use Selawik instead of the installed Segoe UI. This is the price of identical wrapping everywhere.

## Next

1. Read the first GitHub Actions result, in particular the macOS fixture.
2. Run `node tests/render-fixture.mjs` on the NUC and the Mac that serve the renderer.
3. Decide whether to regenerate the galleries and give the remaining examples slide titles.
