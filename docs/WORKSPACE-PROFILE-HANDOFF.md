# Arbeitsbereich erkunden

Implements the workspace profile experiment proposed in [PR #11](https://github.com/blackmath88/msteams-personas/pull/11). The first example follows Uni Basel Module 1. Campus & People Development is the default, with Urban Health Analytics and Dr. Nora Keller in the same fictional starter.

## Website

Open «Arbeitsbereich erkunden» in the library or go to `#/projekt/arbeitsbereich`. The example opens as a local draft under «Eigene Abfolge». Select a node in the map to change the preview. Edit the name and purpose, add a channel, folder or file, or move a folder or file within its workspace. The perspective selector switches between a team overview, a team member and Nora’s personal OneDrive. «Haus-Metapher anzeigen» changes map labels only.

The preview uses the existing stage and Teams/OneDrive renderers. Save the project as JSON or export the map and scene as PNG. Editing works when opened from disk. Use a local static HTTP server for offline browser PNG export so Chromium can read the stylesheet rules, or use the CLI. No Microsoft sign-in is involved.

## CLI and MCP

```sh
node tools/cli.mjs example --kind workspace --out workspace.json
node tools/cli.mjs validate workspace.json
node tools/cli.mjs render workspace.json --out workspace-png
```

Use `get_capabilities`, `get_example({kind: "workspace"})`, `validate_project`, `render_project` and `retrieve_artifact` in an MCP client. Omitting the example kind still returns the three-slide tasks project. The workspace authoring example is also included in the assistant pack. A running MCP service needs this revision and a restart before it advertises the new capability.

## Portable model

Project format remains at version 1. Capability version 4 adds `workspace-map` and `workspace-scene`. Capability versions 1–3 remain accepted. Each workspace scene selects a root and a node by ID. The scene tab is `posts` or `files`. Personal roots require the owner's viewer ID and use OneDrive. A team viewer is optional and, when present, belongs to that team. Stable IDs keep the map, file list, folder path and post references consistent across renames and moves. Paths, links, membership, and depth are validated before rendering.

This version models a small fictional team where channels are visible to its members. Private and shared channel permissions, tenant/site topology, share-recipient browsing and management of a live tenant are outside the model. Nora’s `sharedWith` is an illustrative file annotation. It does not expose her workspace to the recipient. The editor works on the first workspace map and linked scenes with the same root, viewer and selection. Other authored scenes remain in the project and can be changed in JSON. The preview represents one channel and one storage location at a time.

## Verification commands

```sh
npm test
node check-worlds.mjs
node tests/workspace-journey.mjs
node tests/workspace-mcp.mjs /tmp/workspace-png
```

Set `CHROMIUM` when the browser is not on PATH. Pass a local HTTP index URL to the browser journey to include a browser PNG export. The MCP check starts an isolated stdio process, renders all three fixture pairs, retrieves every PNG and checks dimensions and SHA-256 against the manifest. It also verifies that an out-of-scope selection is rejected.
