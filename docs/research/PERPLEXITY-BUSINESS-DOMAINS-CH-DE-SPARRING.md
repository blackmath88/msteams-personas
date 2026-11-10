# Perplexity sparring prompt for business domains in Switzerland and Germany

Review received on 2026-11-10. This preserves the original brief for revision `f937a71`; its four-domain proposal is superseded by the [revised plan](../BUSINESS-DOMAINS-CH-DE-BUILD-PLAN.md). See the [returned review](PERPLEXITY-BUSINESS-DOMAINS-CH-DE-REVIEW-2026-11-10.md) and [review decisions](BUSINESS-DOMAINS-CH-DE-REVIEW-DECISIONS.md).

Act as a critical product researcher and M365 adoption designer. Help me choose a small, useful set of business and public-administration examples for msteams-personas. Challenge our proposal; do not just confirm it.

Repository: https://github.com/blackmath88/msteams-personas
Planning branch: `docs/business-domains-ch-de`
Plan: `docs/BUSINESS-DOMAINS-CH-DE-BUILD-PLAN.md`
Implementation baseline: main after merged PR #14, `9a017f59ac7a9792f797d9195c98f6646960066a`.

Read the plan on the planning branch first, then AGENTS.md, README.md, docs/PERSONA-SCENARIO-HANDOFF.md and the relevant source files. Inspect src/research-catalogue.js, src/library.js, src/scenes-v3.js, src/project-core.js and src/collaboration-core.js to establish what exists. If main has advanced, state the revision you inspected. If a file is inaccessible, say so. Do not claim a repository review based on the README alone. Some older plans describe earlier capability states; prefer inspected code and the recent handoff for implementation facts.

The goal is broader everyday relevance in Switzerland and Germany. Higher education remains one collection. We want recognisable working groups and realistic combinations of tools, not another university-focused expansion or a generic M365 feature catalogue.

Our proposed first four domains are Gemeinde-/Stadtverwaltung, Handwerk/technischer Service, Handel/Auftragsabwicklung and Industrie/Produktion. Treuhand/Beratung/Ingenieurbüro and Gesundheit/Soziales are next candidates. These priorities are hypotheses. Compare credible alternatives such as construction/facilities, associations, finance/insurance, hospitality and IT services. Separate Branche from Teamtyp and from functions such as HR, finance or IT.

Investigate:

1. Which four domain/team combinations best balance recognisability, economic relevance, collaboration needs, trainer demand, distinctness and fit with our actual renderers? Compare Switzerland and Germany. Do not treat employment size as M365 usage or invent a percentage of people we will reach.
2. Are Branche and Teamtyp useful independent filters within our existing Team-Personas entrance? Suggest plain German labels and the smallest metadata change. Avoid a large taxonomy or a full cross-product of variants.
3. What does each proposed example add beyond the existing Marketing/Kundenportal, customer-service onboarding, workshop and university examples? Identify cosmetic renaming and duplication.
4. Which everyday stories need meetings, shared documents, tasks or Loop, and which are better served by a simpler arrangement? Preserve authoritative records in specialist systems and distinguish collaboration from a formal approval or business transaction.
5. What is the smallest coherent next build? Challenge the provisional target of four complete examples plus a second researched scenario per group. Map every illustrated step to an existing supported profile or an explicit gap. A curated renderer is not automatically an arbitrary-project capability.

Use recent primary sources: BFS/SECO and Destatis for economic structure; chambers, associations and credible studies for working practices; concrete organisational guidance where available; current Microsoft Support/Learn for product behaviour. The plan's sources are starting points, not findings you must defend. Give direct URLs, publishers, publication/data periods, access dates and a short statement of what each source supports. Distinguish documented practice, product mechanisms, vendor recommendations and our fictional synthesis. Flag indirect evidence. Country differences must be substantive, not two flags attached to the same example.

Verify only the product prerequisites that materially affect the stories. In particular, check meeting-note plan creation, Planner/To Do continuity, deliberate Mein Tag selection, shared Loop content across supported views, and manual versus automatic transitions. Do not invent external-access permissions, CRM/ERP/QMS integrations, Forms/Lists automation or unsupported screens. Avoid a generic legal/compliance checklist.

Return:

A. A concise verdict: what to keep, change and reject in the plan, with the strongest counterargument to your own recommendation.
B. A comparison matrix of 8–10 candidate domain/team combinations, separately showing Swiss/German relevance, worker/company context, practical evidence, existing-content overlap, teaching value, renderer fit and confidence. Explain any scores; avoid false precision.
C. A ranked first-four recommendation, including why plausible alternatives did not make the first wave.
D. Two concrete scenario briefs per selected group. Include roles, plausible core-group size and rhythm, trigger, friction, artefacts, personal/shared boundaries, one alternative setup, 3–6 ordered visual moments, manual handovers, one failure and a trainer question. Fully develop one brief per group with short fictional German scene copy, consistent identities and a mapping to current profiles. Mark unsupported steps explicitly; keep sequences within the current project limits unless proposing a justified change.
E. A minimal taxonomy/data proposal grounded in the repository, with one example showing the same team pattern across two sectors without duplicating the whole scenario model.
F. A revised implementation sequence and observable acceptance criteria, including what should be reused, deferred or tested with trainers.
G. A compact source and uncertainty register, plus the five most consequential questions still requiring human validation.

Write the analysis in English and suggested UI labels/fictional scene copy in German with Swiss spelling. Keep the executive recommendation short. Be specific enough for Codex to implement the next slice. Do not write application code, modify the repository, open a PR, merge or deploy anything.
