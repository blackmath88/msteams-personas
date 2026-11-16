# Praxis-Hub

Reader-facing practice hub: a team persona first, then its workspace, then situations and tools that end in team agreements. The existing website in the repository root stays as it is; this is a second front on the same engine.

Status: reads the repository's teams and stories; editorial wording is in draft. Prepared for Cloudflare, not deployed.

## Run

```sh
cd hub
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, then static files in hub/dist
npm run preview    # serve the build
```

## Deploy on Cloudflare

The build is a folder of static files (`hub/dist`). There is no Worker code and no server routing, because addresses use the `#` part of the URL.

Connect the repository in the Cloudflare dashboard with these settings:

| Setting | Value |
| --- | --- |
| Root directory | `hub` |
| Build command | `npm run build` |
| Output directory (Pages) | `dist` |
| Deploy command (Workers) | `npx wrangler deploy` |
| Node version | 22, read from `hub/.nvmrc` |

The build reads `../src`, `../assets` and `../examples`, so Cloudflare must check out the whole repository, not only `hub/`. If you limit builds by path, include `hub/`, `src/`, `assets/` and `examples/`.

Or deploy from a terminal:

```sh
cd hub
npm ci && npm run build
npx wrangler deploy
```

- `wrangler.jsonc` describes a Workers project with static assets, named `praxis-hub`. Its dry run passes; a real deploy has not been run.
- `public/_headers` sets a content security policy, basic security headers and long caching for hashed files. The pages were checked in a browser with this policy applied.
- `X-Robots-Tag: noindex` is set while the content is placeholder text. Remove that line in `public/_headers` when the hub should be found by search engines.

## Stack

- React 19, TypeScript, Vite.
- TanStack Router with hash routing. The build is a folder of static files with relative paths, so it can be served from any folder without server rules.
- Plain CSS in `src/styles/hub.css`. No component library yet.

## How it uses the existing renderers

`src/engine/index.ts` imports the scripts and styles from `../src` and `../assets/fonts.css` unchanged. `<AppScreen>` draws one application window from a scene of a portable project; `<SlideView>` draws a complete slide. Both use the same code as the PNG export, the CLI and the MCP server.

The renderer files are browser scripts that attach to `window`. A small plugin in `vite.config.ts` wraps them so they behave as they do behind a `<script>` tag.

## Content

Teams, situations and screens are read from the repository's data files; nothing is copied.

| Shown in the hub | Source |
| --- | --- |
| 12 teams, 8 of them in the switcher, business first | `worlds.js`, `src/library.js`, `src/research-catalogue.js` |
| 11 situations with 52 screens | `src/research-catalogue.js` and `examples/*.project.json` |
| 6 themes | `worlds.js` (`modules`) |
| Sector, featured teams, theme, agreement, transfer question | `src/content/teams.ts`, `src/content/editorial.ts` (editorial layer of the hub) |

What is missing, and where to add it: [CONTENT-TODO.md](CONTENT-TODO.md). In the pages, a dashed «Inhalt fehlt» box marks a gap and an «Entwurf» tag marks wording that still needs review.

## Addresses

| Address | Page |
| --- | --- |
| `#/<team>` | Landing with three doors |
| `#/<team>/team` | Team persona |
| `#/<team>/arbeitsbereich?schritt=2` | House, room, shelf |
| `#/<team>/situationen?thema=planner&q=…` | All situations by theme, with a text filter |
| `#/<team>/situation/<id>?schritt=szene&bild=2` | A situation in five beats; «Szene» has one address per screen |
| `#/<team>/werkzeug/<id>` | A tool: the agreements that involve it |
| `#/<team>/vereinbarungen` | Adopted agreements, printable |
| `#/<team>/teamskizze` | Team sketch (placeholder) |
| `#/<team>/teams` | All teams by sector |

The team is always the first part of the address. It orders the situations (own team, similar setting, other) and owns the adopted agreements; it never hides a situation, and a situation always shows its own team.

## Where things are

| Path | Content |
| --- | --- |
| `src/engine/index.ts` | Bridge to the renderers and data files |
| `src/content/teams.ts` | Teams from the data files, plus sector and featured selection |
| `src/content/stories.ts` | Situations, screens, tools, ordering by closeness |
| `src/content/editorial.ts` | Theme, agreement and transfer question per situation |
| `src/routes/` | One file per page |
| `src/components/` | Shell (sidebar), Scaled (screens), Stepper, StoryCard, Todo |
| `src/agreements.ts` | Adopted agreements per team, stored in the browser |

## Known gaps

See [CONTENT-TODO.md](CONTENT-TODO.md). In short: all agreement sentences are drafts, only one team has house views, the older library with Outlook, Explorer and SharePoint is not connected, and the team sketch, hub-wide search and tests are not built.
