# Repository working agreement

Read README.md, docs/STATUS.md, docs/BUILD-PLAN.md, docs/UX-LIBRARY-PLAN.md, docs/M365-UI-FIDELITY-PLAN.md and docs/ORCA-NUC-BUILD-TASK.md before the next build. docs/WEAVR-FIRST-TEST.md is historical.

This repository owns a standalone persona/scenario visual tool. The Unibas / isolutions atlas is the initial example collection. Keep implemented capabilities distinct from roadmap items.

- Follow the active v2 build plan: library UX and faithful M365 renderers, targeted slide-content fields and real PNG export. The full editor and editable PPTX remain deferred.
- Preserve the tested prototype branch and its content fixes; do not rebuild from the older main atlas.
- Use German UI with Swiss spelling; keep the data adaptable to other locales.
- Use Szene and Prinzip as the two primary visual modes; maps/comparisons fit within them.
- Preserve offline use and locally loaded assets in the current viewer.
- Keep fictional content and source attribution.
- Run `node check-worlds.mjs` after data or scene changes.
- Check all five worlds and three views after renderer changes.
- Avoid a framework or backend migration without an actual product need.
- Treat docs/origin as historical reference, not current execution instructions.
- Do not modify m365-toolbox as part of work here unless explicitly requested.

For governed work, inspect current Weavr state and the canonical operating contract in blackmath88/weavr/docs/CHATGPT-OPERATING-CONTRACT.md. Use connected Weavr MCP first; use GitHub .weavr/inbox only when MCP cannot perform the action. Plans are evidence, not dispatch or merge authority. The prior Mission is archived and must not be revived by this direct Orca task.
