# Renderer fleet deployment

User-approved target, 2026-11-11: NUC (linuc) primary; Mac mini (bruh) first fallback; MacBook (Blackbird) second fallback. Automatically deploy tested updates from main. This document is a deployment handoff, not evidence that any service has been installed.

## Starting evidence

ChatGPT's connected renderer returned capabilityVersion 2; repository main at 069f010e6cf4aa1ca0d9d7c69a7dc629b7bfb60b includes workspace-house support documented at capability version 5. The plugin describes its host as a Mac; the actual machine, checkout, process and tunnel have not been identified. Do not assume it is the Mini or Blackbird.

The planning chat runs in a cloud Linux workspace, not Blackbird. No fleet management tool was available; orca-ide returned command not found. SSH configuration inspection failed with Bad owner or permissions on /etc/ssh/ssh_config.d/20-systemd-ssh-proxy.conf. These are limitations of that workspace, not proof the fleet is unavailable.

Read AGENTS.md, active build/status guidance, docs/CHATGPT-CUSTOM-MCP-SETUP.md and docs/WORKSPACE-PROFILE-HANDOFF.md. Inspect current main and subsequent work before implementation; preserve local changes and existing services.

## Execution scope

Implement and deploy this renderer on the three named owned hosts using existing authorized management access and the supported private MCP connection. No new paid services, unrelated fleet changes, public unauthenticated listener or credentials committed to Git. Keep the website and CLI working.

1. Discover the actual host identities, SSH users, service definitions, checkouts, Node/Chromium paths and current tunnel/plugin connection. Verify host reachability separately from a working render. Never guess credentials or turn off host-key checks.
2. Establish a working NUC service first. Use systemd on Linux and launchd on macOS as appropriate. Preserve existing tunnel credentials securely. Verify supported tunnel-client behavior from current official documentation and CLI help. Do not assume several clients sharing one tunnel produce ordered failover.
3. Install the same tested release on Mini and Blackbird. Blackbird is eligible only while awake/reachable; do not change its sleep policy. One active render per host with bounded queue, render timeout and retention.
4. Provide NUC -> Mini -> Blackbird selection based on a working service and supported capabilities, not ping alone. A stale server missing a requested profile is ineligible. Prevent rapid switching and prefer the recovered NUC for new jobs after a stability interval.
5. Choose the smallest supported routing mechanism after verifying the actual tunnel contract. The only routing/coordinator process must not live exclusively on the NUC. If a stable single plugin connection cannot survive NUC failure without additional infrastructure, expose named private host connections as an explicitly manual fallback first and report the remaining automatic-failover gap. Do not claim three installed servers alone implement automatic failover.
6. Keep a render pinned to its originating host through artifact retrieval. Preserve host identity in routing metadata; never retry retrieval blindly on another host. If the origin is lost, explicitly report that the artifact is temporarily unavailable or rerender from retained project input under a new render ID. Do not silently duplicate a possibly-running job after a timeout; establish cancellation/settlement or return an uncertain-result status.

## Automatic release updates

Use main as the source of candidate releases; branches and untrusted PR code never run on fleet deployment workers. Reuse existing CI/deployment facilities if present. Prefer a small host-side scheduled updater over adding privileged persistent GitHub runners to the personal machines.

Fetch into isolated versioned release directories, never reset a developer checkout. Use locked dependencies and an observed Chromium executable. Before promotion, run npm test, node check-worlds.mjs and the documented workspace MCP smoke test, including a house overview and house/Teams comparison. Verify actual PNG dimensions, manifest hashes and retrieval. Check other mandatory repository gates relevant to changes.

Serialize updates, drain active renders before restart, preserve recent artifacts across release swaps and atomically promote only a passing release. Retain the previous known-good release and roll back on post-start health failure. Update standby hosts sequentially, then primary; keep at least one verified host available. Offline hosts catch up on return. Coordinate the update process so it cannot race local installation or another update.

Expose non-secret running commit, capability version and host alias through capabilities/status. New tools may require ChatGPT plugin schema refresh/reconnection; verify discovery rather than assuming a restart refreshes tools.

## Acceptance evidence

- Record actual non-secret host aliases, release SHAs, service names and start/stop/status/update/rollback commands.
- Each host independently renders and retrieves the fictional workspace-houses fixture.
- From ChatGPT, discover the updated capabilities and tools, render both house slides and retrieve their PNGs.
- In a controlled service-level test, stop only the owned renderer on NUC and demonstrate Mini selection; stop Mini's renderer and demonstrate Blackbird selection. Restore both services. If automated failover is not implemented, state clearly that selection was manual.
- Verify recovery preference, artifact-origin handling, stale-version exclusion and rollback after a deliberately rejected synthetic candidate release.
- Test no unauthorized access using only owned test accounts/connections; keep HTTP private and preserve access controls.
- Report installed, tested and live-from-ChatGPT separately. If remote credentials or account actions block deployment, provide the exact missing user/host/action without asking for secrets in chat.

The requested destination is this three-host fleet. Cloud hosting remains an alternative only if separately selected; do not purchase or provision it as an implicit fallback.
