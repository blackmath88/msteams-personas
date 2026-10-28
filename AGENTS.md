# Repository working agreement

Read README.md, docs/PRODUCT.md, docs/STATUS.md, docs/BUILD-PLAN.md and docs/WEAVR-FIRST-TEST.md before implementation.

This repository owns a standalone persona/scenario visual tool. The Unibas / isolutions atlas is the initial example collection. Keep implemented capabilities distinct from roadmap items.

- Follow the first-test boundary: configurator and lightweight naming fields; defer the full editor and PNG export.
- Use German UI with Swiss spelling; keep the data adaptable to other locales.
- Use Szene and Prinzip as the two primary visual modes; maps/comparisons fit within them.
- Preserve offline use and locally loaded assets in the current viewer.
- Keep fictional content and source attribution.
- Run `node check-worlds.mjs` after data or scene changes.
- Check all five worlds and three views after renderer changes.
- Avoid a framework or backend migration without an actual product need.
- Treat docs/origin as historical reference, not current execution instructions.
- Do not modify m365-toolbox as part of work here unless explicitly requested.

For governed work, inspect current Weavr state and the canonical operating contract in blackmath88/weavr/docs/CHATGPT-OPERATING-CONTRACT.md. Use approved GitHub .weavr/inbox commands for Weavr writes. Plans are evidence, not dispatch or merge authority.
