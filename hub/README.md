# Praxis-Hub

Reader-facing practice hub: a team persona first, then its workspace, then situations and tools that end in team agreements. The existing website in the repository root stays as it is; this is a second front on the same engine.

Status: base to build on. Content is placeholder text from the Unibas example deck. Not deployed.

## Run

```sh
cd hub
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, then static files in hub/dist
npm run preview    # serve the build
```

## Stack

- React 19, TypeScript, Vite.
- TanStack Router with hash routing. The build is a folder of static files with relative paths, so it can be served from any folder without server rules.
- Plain CSS in `src/styles/hub.css`. No component library yet.

## How it uses the existing renderers

`src/engine/index.ts` imports the scripts and styles from `../src` and `../assets/fonts.css` unchanged. `<AppScreen>` draws one application window from a scene of a portable project; `<SlideView>` draws a complete slide. Both use the same code as the PNG export, the CLI and the MCP server.

The renderer files are browser scripts that attach to `window`. A small plugin in `vite.config.ts` wraps them so they behave as they do behind a `<script>` tag.

## Addresses

| Address | Page |
| --- | --- |
| `#/<team>` | Landing, seen from one team |
| `#/<team>/basis?schritt=3` | Team and workspace, one step at a time |
| `#/<team>/situation/<id>?schritt=vereinbarung` | A situation in five beats |
| `#/<team>/werkzeug/<id>` | A tool: the agreements that involve it |

Team and step are part of the address, so a link can point to an exact step.

## Where things are

| Path | Content |
| --- | --- |
| `src/content/teams.ts` | Team personas |
| `src/content/modules.ts` | Situations, tools, the five beats |
| `src/routes/` | Landing, Basis, Situation, ToolPage |
| `src/components/` | Shell (sidebar), Scaled (screens), Stepper |
| `src/agreements.ts` | Adopted agreements per team, stored in the browser |

## Known gaps

- Only the administration team has workspace views; only «Die Teamsitzung» has a scene.
- The house views are shown as complete slides, including the slide heading. A house component without slide chrome does not exist in the engine yet.
- Personas and situations here are separate from the portable projects; a module cannot yet reference a shared persona and setup.
- Search, the team agreement sheet and tests are not built.
- Publishing needs a decision: GitHub Pages currently serves the repository root without a build step.
