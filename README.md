# TanStack Query React v5 Docs

A standalone docs project that syncs TanStack Query React v5 docs into a Starlight site.

## Why this stack

- **Starlight (Astro):** markdown-first, static output, easy free hosting.
- **No platform lock-in:** deploy anywhere static hosting is supported.
- **Automated sync:** scripted pull from upstream with version lock and integrity checks.

## Project goals

- Keep a local synchronized copy of React v5 docs with minimal manual work.
- Avoid missing pages during upstream sync.
- Keep deploy path simple (`git push` -> auto deploy on hosting platform).

## Synced sources

From `https://github.com/TanStack/query`:

- `docs/framework/react/**/*.md`
- `docs/reference/**/*.md`
- `docs/eslint/**/*.md`
- `docs/community-resources.md` (if present in the tracked ref)
- `docs/config.json` (metadata for validation and example redirects)

The sync script also generates example link pages and synchronization status pages in both languages.

## Commands

- `pnpm run dev`: local preview
- `pnpm run build`: production build
- `pnpm run sync:docs`: sync docs from upstream `main`
- `pnpm run sync:check`: check whether upstream `main` has changed

## Design

The site design specification, theme tokens and review checklist
are in [DESIGN.md](DESIGN.md). Keep presentation changes in the Starlight theme and
component overrides so upstream Markdown remains independently synchronized.

## First setup

Use Node.js 24 (see `.node-version`) and the pinned pnpm 10.30.1 via Corepack.
Astro 7 requires Node.js 22.12 or newer; this project standardizes on Node.js 24.


```bash
pnpm install
cp .env.example .env
# set SITE_URL in .env before production build checks
pnpm run sync:docs
pnpm run build
```

## Pin a specific ref

```bash
pnpm run sync:docs -- --ref=v5.90.3
```

## Maintenance workflow

1. `pnpm run sync:check`
2. If update is available, run `pnpm run sync:docs`
3. Review changed Chinese translations and record only the reviewed source hashes.
4. Run the validation commands below, then commit and deploy.

The daily sync runs validation before publishing. When translations remain current,
it commits directly to `main`. When translations are missing or stale, it updates
one persistent PR (`chore/sync-query-react-v5-docs`) for translation work instead of
creating daily PRs. It never marks untranslated content as reviewed. Branch protection
is respected: a rejected direct push falls back to that PR.

Chinese pages preserve upstream heading anchors. Community resources are rendered
from translated frontmatter; example links are generated in both languages.

### Translation maintenance

- `pnpm i18n:status`: list missing, stale and orphan translations (including community resources).
- Translate/review the complete source, then record each reviewed page with
  `node scripts/i18n-verify.mjs --write --path=framework/react/guides/queries.md`.
- `--all-reviewed` is only for a completed full audit, never for bypassing stale checks.
- Validate with `pnpm check`, `pnpm lint`, `pnpm i18n:check`, `pnpm test:maintenance`, `pnpm build`, and `pnpm links:check`.

See the repository translation skill for terminology and review conventions.

## Environment variables

- `SITE_URL`: production site origin, used to generate canonical URLs and sitemap entries.
- Local development and build checks:

```bash
cp .env.example .env
# edit .env and set your real deploy URL
```

- Vercel: set `SITE_URL` in Project Settings -> Environment Variables for at least `Production` (recommended: also `Preview`).

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. Build command: `pnpm run build`
4. Output directory: `dist`
5. Add environment variable `SITE_URL` (for example `https://<your-project>.vercel.app` or your custom domain).

### Automatic deploys from `main`

- This project is connected to Vercel Git Integration.
- Every push to `main` triggers a Production Deployment automatically.
- Pushes to non-`main` branches create Preview Deployments.
- `vercel.json` is included to keep build/install/output behavior explicit and stable across environments.
- Keep GitHub Actions focused on checks (build/lint) to avoid duplicate deployments from CI.
