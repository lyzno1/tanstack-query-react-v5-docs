---
name: tanstack-query-zh-translation
description: Review and update Chinese translations of the synchronized TanStack Query documentation in this repository, including missing pages and source hash tracking.
---

# TanStack Query Chinese translation

English sources under `src/content/docs/` are synchronized from upstream `main`;
`upstream/lock.json` records the exact commit. Do not hand-edit synchronized English
files: the next sync overwrites them. Translate into the corresponding `zh/` path.
Historical migration guides describe their target versions; preserve historical APIs.

Read [terminology](references/terminology.md) and [translation style](references/translation-style.md)
when reviewing prose. Keep signatures, option names, code behavior and Markdown
heading depth/order aligned with English. The site uses English heading IDs for
Chinese pages so upstream anchors continue working.

## Workflow

- Run `pnpm sync:docs` when refreshing upstream, then `pnpm i18n:status`.
- Review missing/stale pages against the complete English source, including code,
  tables, links, defaults, exceptions and explanatory comments. For a full audit,
  review every page even if its source hash is unchanged.
- `node scripts/i18n-init.mjs --path=<source-path>` creates an English draft; it does
  not translate or approve it. Remove its draft marker only after translating it.
- Record only completed reviews:
  `node scripts/i18n-verify.mjs --write --path=<source-path>` (repeatable).
  Use `--all-reviewed` only after an actual review of every tracked page.
- Run `pnpm check`, `pnpm lint`, `pnpm i18n:check`, `pnpm test:maintenance`, `pnpm build` and
  `pnpm links:check` before opening a PR.

`upstream/i18n.zh.json` is the sole source of review metadata. A matching hash only
means the source has not changed since the recorded review; it does not prove
translation quality. Never refresh hashes merely to silence CI. Scripts live in
`scripts/` because CI needs them independently of skill installation.

Community resources are tracked and rendered from translated frontmatter.
Example link pages are generated in both languages by the sync script; do not
manually translate generated links or add them to the review metadata.
