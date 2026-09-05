# Repository guidelines

This Astro/Starlight site mirrors TanStack Query React v5 documentation from upstream
`main`. `upstream/lock.json` pins the exact reviewed source commit.

## Sources and translations

- `pnpm sync:docs` copies English React, core reference, ESLint and community docs;
  never hand-edit these generated source files.
- Chinese translations live at the same paths under `src/content/docs/zh/`.
- Use `.agents/skills/tanstack-query-zh-translation/SKILL.md` for translation work.
- `upstream/i18n.zh.json` records reviewed source hashes, not automatic translation
  or semantic correctness. Record only pages actually reviewed.
- Example link pages are generated in both languages. `scripts/docs-markdown.mjs`
  resolves source-relative links, preserves upstream heading IDs in Chinese and
  renders community-resource frontmatter.

## Commands

Use the package manager pinned in `package.json` (`corepack pnpm` if necessary).

- `pnpm install --frozen-lockfile`
- `pnpm dev` / `pnpm preview`
- `pnpm sync:docs` (defaults to upstream `main`; `-- --ref=<branch-or-tag>` pins a ref)
- `pnpm sync:check` (nonzero if upstream `main` differs)
- `pnpm i18n:status` (missing/stale/orphan pages)
- Before a PR: `pnpm check`, `pnpm lint`, `pnpm i18n:check`, `pnpm test:maintenance`, `pnpm build`, `pnpm links:check`

For sync changes run `pnpm sync:docs` and inspect source files, manifest, lock and
both generated example directories. Test maintenance scripts with temporary
fixtures when changing behavior; do not mark real translations reviewed for a test.

## Changes and PRs

Use ESM `.mjs` and explicit `node:*` imports. Keep changes focused and avoid
formatting-only churn. Use Conventional Commits. PRs should explain translation
corrections, include the upstream commit, review coverage and validation results.

The scheduled sync pushes only after all checks including translation integrity
pass. Otherwise it updates one persistent translation PR. Never refresh translation
hashes automatically or force-push `main` to make a sync pass.

Set `SITE_URL` for production; its fallback is `https://example.com`.
