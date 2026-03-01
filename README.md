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

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. Build command: `pnpm run build`
4. Output directory: `dist`

## Why not git submodule by default

Submodule can track upstream repository state, but this project needs filtered sync + generated example redirect pages + validation. A sync script gives stricter guarantees for what gets deployed.

If you still prefer submodule, add upstream as a submodule and adapt the sync script to read from submodule path instead of cloning.
