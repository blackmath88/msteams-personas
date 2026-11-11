# Renderer fleet operations

Implementation for the deployment scope in PR #17. Runtime installation and acceptance evidence
are recorded separately; the existence of these scripts does not establish that a host is live.

## Routing contract

The [official tunnel deployment guidance](https://github.com/openai/tunnel-client/blob/master/docs/deployment/kubernetes-dedicated.md)
and [enterprise onboarding](https://github.com/openai/tunnel-client/blob/master/docs/enterprise-customer-onboarding.md#operations--best-practices)
were inspected at `555aedafa847863721a779877283f0cf67590f48` (2026-11-11).
The shared tunnel queue sends a request to whichever client polls first. It supplies no host order.
Multiple active stdio bindings on one tunnel are unsupported. Equivalent stateless HTTP targets
are supported. Fleet gateways therefore use HTTP, with the SDK's explicitly stateless legacy and
modern handling, and no MCP session IDs. No gateway-local job/session state is needed.

Each gateway selects `linuc`, then `bruh`, then `blackbird`, checking authenticated service health,
verified-release status, capability version and all requested profiles. Recovery needs 30 seconds
of stability. Gateways run on all three machines, so the sole coordinator does not reside on NUC.
Blackbird is available only while awake; installation does not alter sleep settings.

The gateway never retries a submitted render on another host. A lost response is explicitly
`render_result_uncertain`. IDs such as `r-bruh-<random>` pin both `retrieve_artifact` and resource
reads to their origin, including after another host becomes primary. Missing origins produce an
explicit unavailable result. Legacy unprefixed IDs route to Blackbird. Retained artifacts and
project inputs live outside releases; the latest 100 renders per host are retained. Loss of an
origin does not magically replicate its files. Resource listing is local to the selected backend;
use the returned IDs/URIs to retrieve other hosts' retained output.

Workers accept one active render and one waiter, with a ten-second queue deadline and the existing
90-second browser render timeout. Gateways use a 110-second response budget inside the tunnel's
[120-second absolute deadline](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels#limits).

## Network and services

`fleet-host.mjs config.json` supervises the release's worker on `127.0.0.1:8792`, a stateless tunnel
gateway on `127.0.0.1:8790`, and an authenticated host adapter on the configured Tailscale IP:8791.
The private adapter requires a mode-0600 fleet token on every request, rejects browser origins,
and never binds a wildcard address. This credential is internal between owned hosts, not a claim
that ChatGPT supports arbitrary static bearer authentication. ChatGPT retains its existing tunnel
access controls and tunnel ID. The runtime key remains in a local mode-0600 file reference.

The tunnel service uses `fleet-tunnel.mjs` to stop its poller if its local gateway disappears.
Otherwise an unhealthy replica could consume calls from the shared queue. Health is checked every
two seconds (2.5-second probe deadline); a failing/in-flight call can return an error during this
bounded detection interval. Submitted renders are still never automatically replayed.

The configuration includes observed absolute `node`, `npm`, `python`, `chromium`, `root`, `artifacts`,
`tokenFile`, `address`, `id` and ordered `hosts: [{id,url}]`. `fleet-services.py` generates systemd
user units on Linux or launchd agents on macOS. It refuses to overwrite existing definitions.
Provision `root/control` from the tested tools, `root/bin/tunnel-client` from a checksum-verified
official release, and `root/tunnel.yaml` with the existing tunnel ID, key file reference and
`mcp.server_urls: [{url: "http://127.0.0.1:8790/mcp", channel: "main"}]` (validate with `doctor`).

Stop the previous stdio tunnel before starting any of the HTTP replicas. Back up its profile,
wrapper and service definition. Do not reset a developer checkout or remove existing artifacts.
Mac agents start in their user's GUI login domain; they do not establish pre-login availability.
Linux uses existing user lingering where already enabled.

## Updates and rollback

Run `python3 control/fleet-update.py host /absolute/config.json` for initial installation from main.
The Mini's scheduled coordinator runs `fleet` every 15 minutes, visiting Blackbird, Mini, then NUC.
Offline hosts are skipped and catch up on the next pass. A failed/unsettled update stops the pass.
The coordinator refuses to update the last available verified renderer. Its outage pauses updates,
not rendering. Per-host OS locks serialize manual installation, update and rollback too.

Candidates are fetched only from `refs/heads/main` of this repository into an isolated bare source
store. There is no remote URL/ref argument on the update API. Locked npm installation, `npm test`,
`check-worlds` and the documented workspace MCP smoke gate run before promotion. The worker drains
before browser smoke tests and release swaps; new jobs use another host. Symlinks are replaced
atomically. Post-start health and a real HTTP house render/retrieval check must pass; failure restores
the prior current release and restarts it. The failed SHA is quarantined in `rejected.json`.

`current`, `previous`, `.release-sha`, `.verified.json`, `rejected.json`, `logs/update.log` and
`evidence/<sha>/evidence.json` provide non-secret evidence. Releases are retained (no automatic
deletion of rollback targets); monitor disk usage. Control-plane scripts are installed separately
and are not silently self-updated. Automatic updates change the renderer release only.

Commands, on the intended host with its root/config paths:

```sh
python3 control/fleet-update.py fleet /absolute/config.json       # coordinated pass (Mini)
python3 control/fleet-update.py rollback /absolute/config.json    # previous known-good
python3 control/fleet-update.py rollback-test /absolute/config.json # broken synthetic candidate
node control/fleet-smoke.mjs /absolute/config.json /path/to/evidence
node control/fleet-smoke.mjs /absolute/config.json /path/to/evidence gateway
node control/fleet-smoke.mjs /absolute/config.json /path/to/evidence gateway modern
```

Before retrying a quarantined SHA, diagnose its log and remove only its `rejected.json` after the
cause has been fixed. Do not use a synthetic candidate or branch as an automatic update source.
The explicit rollback test creates only a local worker that exits with code 42; it must restore
the exact previous current release after the post-start check rejects it.

## Verification

`npm test` includes ordered selection, stability, stale profile/version exclusion, artifact origin,
bounded queue, drain and queue expiry tests. `python3 tests/fleet-update-test.py` checks failed
promotion, previous-release preservation and concurrent lock exclusion. `fleet-smoke.mjs` verifies
stateless HTTP discovery, both house PNGs, actual dimensions and SHA-256, resource reads, manifest
origin and path-traversal refusal. Run these checks on each host and through the connected plugin.
The `modern` variant exercises MCP 2026-07-28 and its required method/name headers through both
proxy hops; the default exercises legacy stateless MCP. Forward protocol metadata without copying
caller authentication, Host or session IDs.

Controlled service tests stop only owned renderer services and restore them in `finally`/operator
cleanup. Demonstrate Mini and Blackbird selection, NUC recovery, old-origin retrieval, missing-origin
errors, unauthenticated denial and synthetic rollback. Do not confuse CLI/HTTP proof with a
successful ChatGPT tool call. Cached plugin schemas may need a refresh to discover the newer tools.
