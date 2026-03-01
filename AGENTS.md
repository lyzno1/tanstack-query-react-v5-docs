# Repository Guidelines

## Project Structure & Module Organization
- `src/content/docs/` contains the mirrored TanStack Query docs used by Starlight.
- `src/styles/theme.css` stores site-level theme overrides.
- `public/` holds static assets (for example `favicon.svg`).
- `scripts/` contains sync automation:
  - `sync-tanstack-query-react-v5.mjs` pulls upstream docs, regenerates example redirect pages, and updates sync metadata.
  - `check-upstream-update.mjs` compares the tracked ref to the latest upstream v5 tag.
- `upstream/` stores sync state (`lock.json`, `manifest.json`, `docs.config.json`).
- `.github/workflows/` includes CI build checks and scheduled sync PR automation.

## Build, Test, and Development Commands
- `pnpm install --frozen-lockfile`: install dependencies exactly as locked.
- `pnpm run dev`: run local Astro/Starlight dev server.
- `pnpm run build`: build static output into `dist/`.
- `pnpm run preview`: preview the production build locally.
- `pnpm run check`: run Astro content/type checks.
- `pnpm run sync:check`: fail when a newer upstream v5 tag is available.
- `pnpm run sync:docs -- --ref=v5.x.y`: sync docs from latest (or pinned) upstream v5 tag.

## Coding Style & Naming Conventions
- Use ESM Node scripts (`.mjs`) and explicit `node:*` imports where appropriate.
- Follow the style already present in each file; do not introduce broad formatting-only changes.
- Keep local project-authored docs in kebab-case filenames (example: `sync-status.md`).
- Preserve upstream filenames and document paths for mirrored content.
- For project-authored Markdown pages, include clear frontmatter (`title`, `description`).

## Testing Guidelines
- There is no dedicated unit test suite; validation is build and content-check based.
- Before opening a PR, run:
  - `pnpm run check`
  - `pnpm run build`
- For sync-related changes, also run `pnpm run sync:docs` and verify updates in:
  - `upstream/lock.json`
  - `upstream/manifest.json`
  - `src/content/docs/sync-status.md`

## Commit & Pull Request Guidelines
- Prefer Conventional Commit style (`feat:`, `fix:`, `chore:`).
- For upstream refreshes, follow the existing pattern: `chore: sync TanStack Query React v5 docs`.
- PRs should include:
  - concise change summary (manual edits vs sync output),
  - upstream ref being tracked (from `upstream/lock.json`),
  - confirmation that `check` and `build` pass.
- Include screenshots only when UI/theme changes are introduced.

## Configuration Tips
- Set `SITE_URL` for production builds; otherwise Astro defaults to `https://example.com`.
