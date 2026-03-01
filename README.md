# TanStack Query React v5 Docs Mirror

A standalone docs project that mirrors TanStack Query React v5 docs into a Starlight site.

## Why this stack

- **Starlight (Astro):** markdown-first, static output, easy free hosting.
- **No platform lock-in:** deploy anywhere static hosting is supported.
- **Automated sync:** scripted pull from upstream with version lock and integrity checks.

## Project goals

- Keep a local mirror of React v5 docs with minimal manual work.
- Avoid missing pages during upstream sync.
- Keep deploy path simple (`git push` -> auto deploy on hosting platform).

## Synced sources

From `https://github.com/TanStack/query`:

- `docs/framework/react/**/*.md`
- `docs/reference/**/*.md`
- `docs/eslint/**/*.md`
- `docs/community-resources.md` (if present in the tracked ref)
- `docs/config.json` (metadata for validation and example redirects)

The sync script also generates `framework/react/examples/*` placeholder pages to avoid broken internal links.

## Commands

- `pnpm run dev`: local preview
- `pnpm run build`: production build
- `pnpm run sync:docs`: sync docs from latest upstream v5 tag
- `pnpm run sync:check`: check whether a newer upstream v5 tag exists

## First setup

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
3. Run `pnpm run build`
4. Commit and deploy

A scheduled GitHub Actions workflow is included to run sync daily and open a PR when upstream changes are detected.

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

## Why not git submodule by default

Submodule can track upstream repository state, but this project needs filtered sync + generated example redirect pages + validation. A sync script gives stricter guarantees for what gets deployed.

If you still prefer submodule, add upstream as a submodule and adapt the sync script to read from submodule path instead of cloning.
