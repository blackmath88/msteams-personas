# Weavr first test — visual-first library

This is a copy-ready proposed Mission envelope, not a claim that a Mission has been created or dispatched.

## Observed state

Checked 2026-10-28 through live Weavr overview:
- Project: msteams visuals.
- Project ID: https-github-com-blackmath88-msteams-personas.
- Repository registered as https://github.com/blackmath88/msteams-personas.
- Project intent: execute the build plan (existing UI text contains a spelling error).
- No Missions, Plans, Needs or Sessions were returned for this project at that check.
- No eligible active runner for this repository was established by the overview. Listed edge runners were stale and registered for other repositories. Cloud runners can be ephemeral; absence from the current list alone does not prove cloud execution is unavailable.

Refresh live state before creating anything. If a Mission has since appeared, inspect and reuse it rather than create a duplicate.

## Mission title

Visual-first Teams library — first usable slice

## Outcome

A German-language, offline-capable library where users choose a university/business example or describe a situation, obtain a contextual suggested setup, switch between screenshot-like Szene and conceptual Prinzip, and present either in a clean 16:9 frame.

## Inputs

- README.md
- AGENTS.md
- docs/PRODUCT.md
- docs/BUILD-PLAN.md — first-test scope and acceptance are authoritative repository planning inputs.
- docs/STATUS.md
- worlds.js, atlas.js, atlas.css, index.html, assets/tokens.css, check-worlds.mjs
- docs/origin/ as historical reference only.

Use the latest main commit containing this revision as the attempt base; record its exact SHA in the Run.

## Allowed implementation scope

Read the repository. Limit writes to:
- index.html, atlas.js, atlas.css, worlds.js, check-worlds.mjs
- assets/**, src/**, data/**, tests/**
- README.md and docs/**
- package.json/package-lock.json only if needed for a minimal local verification harness; do not add production runtime dependencies without rationale.

Keep AGENTS.md and governance/inbox files outside the implementation write scope. Do not write other repositories. Use the exact path syntax supported by the actual Mission form/schema.

## Acceptance

Copy the complete First-test acceptance and proof section of docs/BUILD-PLAN.md into the Mission acceptance field. Key results:
- Landing with Persona wählen, Use Case wählen, Eigene Situation.
- Five existing university worlds plus one generic business example.
- Six-question deterministic configurator, rationale/alternative and lightweight naming customisation.
- Shared state across Szene, three Prinzip explainers and 16:9 Präsentieren.
- Complete visual path for Leadership Forum and the business case.
- Existing content retained; browser, keyboard/mobile and content checks with genuine proof.

Do not replace this with a vague execute-the-whole-buildplan acceptance.

## Exclusions

No full authoring editor, PNG/SVG export, backend, AI/API integration, tenant provisioning, production deploy, broader collection curation or automatic implementation merge. No rewriting Weavr itself as part of the product test.

## Authority and escalation

Implementation and focused verification inside the envelope are intended once explicitly dispatched. Use isolated worktree/branch output and return proof for human review. Do not merge or deploy the implementation automatically.

Escalate changed scope, architecture/dependency needs, unavailable browser verification or inconsistent technical claims. A checkpoint is acceptable; do not waive missing proof to mark the run complete.

## Runtime and budget

Select an actually available runtime/route. Use one builder for the first test, not a multi-agent benchmark. A conservative first attempt is 30 minutes followed by an explicit checkpoint if unfinished; this is an attempt budget, not a promise the whole slice fits in that time.

Verify the selected host has repository access and browser/test capability. An online label or an old heartbeat does not establish eligibility. Check location policy, provider authentication and runner diagnostics in Weavr; do not assume subscription access means cloud API access.

## Operator sequence

1. Open the existing msteams visuals project and refresh.
2. If a Mission already exists, inspect it; otherwise use Shape Mission / Create Mission with this envelope.
3. Bind the revised docs/BUILD-PLAN.md from main as input. Check outcome, allowed paths, exclusions, runtime budget and merge authority.
4. Use Plan & Needs to inspect the concrete plan and resolve blocking Needs with evidence. If the UI asks for typed Plan import, use the documented plan-evidence schema; do not paste this Markdown as JSON.
5. Verify routing/capability/authentication. Use Dispatch only when it is enabled and execution is intended.
6. Inspect Run evidence and screenshots in Proof & Decision. Return Revise for missing acceptance or decide how to integrate accepted work.

If the route fails, preserve the failure diagnostics as test evidence. Do not change the Mission or retry on a different possibly-overlapping worker without observing settlement first.

## Dogfood observations to capture

- Did the runtime receive the exact repo revision, scope and exclusions?
- Did plan compilation create appropriate Needs?
- Did routing choose an eligible host/provider and report useful failures?
- Did checks and visual evidence correspond to the actual changed commit?
- Did the runtime stop at review/checkpoint without crossing merge authority?
- Where did the operator have to carry context manually?

The test succeeds as an orchestration experiment when these observations are honest and inspectable, even if a Run exposes a blocker.
