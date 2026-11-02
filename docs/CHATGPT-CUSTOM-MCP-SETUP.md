# Connect msteams-personas to ChatGPT through a private MCP tunnel

Prepared: 2026-11-02. Status: setup handoff only. No tunnel, runtime key, host service or ChatGPT plugin has been created or verified by this document.

## Intended result

ChatGPT invokes get_capabilities, get_example, validate_project, render_project and retrieve_artifact against the existing Node/Chromium renderer on the owner's machine. The GitHub Pages app remains the browser editor. The host must be awake and online for agent calls.

Use OpenAI Secure MCP Tunnel for the private connection. Do not expose the current unauthenticated HTTP server to the internet. Do not add a static bearer-token gate and assume ChatGPT can present that token: direct authenticated ChatGPT MCP connections use supported OAuth flows. Tunnel access and app authentication are separate.

## Authoritative instructions

Follow the current versions and actual CLI help:
- https://developers.openai.com/api/docs/guides/secure-mcp-tunnels
- https://developers.openai.com/api/docs/guides/custom-mcp-server
- https://github.com/openai/tunnel-client/blob/master/docs/onboarding.md

The documented tunnel requires a Platform tunnel ID, appropriate organization/workspace associations, and a runtime API key. Do not assume the current account has these permissions. Creating/managing needs Tunnels Read + Manage; running/selecting needs Read + Use. Do not assume service pricing or zero cost without checking the current account.

## Task for the local agent

Work on the NUC if this checkout is there. Otherwise inspect the current machine and confirm the intended host before installing a persistent service.

1. Read AGENTS.md and the current product/build/status guidance. Inspect git status and active work. Preserve changes. Fetch current main; update only with a safe fast-forward when appropriate.
2. Inspect Node, Chromium, existing dependencies, existing MCP processes, tunnel-client and any existing service definitions. Reuse suitable components. No changes to unrelated services or credentials.
3. Install locked npm dependencies using npm ci if needed. Run node --test tests/*.test.mjs and node check-worlds.mjs. Node versions differ in whether node --test tests/ accepts a directory.
4. Run node tools/cli.mjs capabilities and validate examples/lichtblick-kulissenwechsel.project.json. Render the example to a temporary directory using node tools/cli.mjs render; inspect the returned manifest and actual PNGs. Set CHROMIUM to the observed executable path if necessary. Do not claim Chromium rendering works based only on unit tests.
5. With browser access to Platform and ChatGPT, identify the intended personal organization/workspace and inspect existing tunnels/plugins. Reuse an appropriate tunnel; otherwise set one up under the user's authorized account. Follow any credential-management workflow required by the environment. Keep secrets out of chat, screenshots, command arguments, version control and logs. Use secure local entry/environment references for runtime credentials.
6. Install the supported tunnel-client from the official source. Inspect tunnel-client help quickstart and current onboarding documentation. Configure a named profile for this project's stdio server, using the actual absolute Node and repository paths. Prefer stdio so the existing server needs no public HTTP/auth changes.
7. The official guide's shape is: tunnel-client init --sample sample_mcp_stdio_local --profile <name> --tunnel-id <actual-id> --mcp-command "<actual-node> <absolute-repo>/tools/mcp-server.mjs". Verify current help before executing. This is a template, not a command containing real values.
8. Run tunnel-client doctor --profile <name> --explain, then tunnel-client run --profile <name>. Verify readiness and active polling. The inherited runtime environment must supply the securely configured control-plane credential and Chromium path.
9. In ChatGPT Plugins, choose Add custom MCP server, Connection: Tunnel, and the same tunnel. Check the workspace association and access. Configure app authentication deliberately according to the supported private-tunnel setup. Do not introduce public anonymous access. Complete user-required account/security approvals through the normal UI.
10. Install/select the custom plugin. Discover the five expected tools. Call get_capabilities, validate the fictional example, render it and retrieve one PNG from ChatGPT. Verify returned image dimensions and content. A CLI test alone is not a successful ChatGPT integration.
11. Once the foreground connection works, persist the tunnel client with the appropriate host mechanism (systemd user service on the Linux NUC, launchd on a Mac). Reuse existing configuration, use absolute paths and a deliberate working directory, restrict secret-file permissions, and provide start/stop/status instructions. Inspect whether login-independent startup is already configured; do not silently change system account settings.
12. Record actual host, commit, runtime versions, non-secret tunnel/plugin identifiers, verified calls, retention behavior, restart mechanism and remaining limitations in a separate dated evidence note. Never commit runtime keys, local tunnel config containing credentials, artifacts from real training content, or unredacted logs.

Stop at a real blocker and report the exact missing access or action. Do not claim setup is complete until a tool call from ChatGPT succeeds.

## Acceptance

- Existing website and local CLI/MCP behavior preserved.
- Renderer and tunnel remain on the intended host.
- No public unauthenticated renderer endpoint.
- Correct organization/workspace can discover the tunnel.
- ChatGPT renders a fictional project and retrieves an actual PNG.
- Host restart/reconnect behavior documented and checked where feasible.
- If credentials, account approvals or host access are missing, status explicitly remains incomplete.
