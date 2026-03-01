---
id: home
slug: /
title: TanStack Query React v5 Mirror
description: React v5 docs mirror with automated upstream synchronization and deploy-ready output.
template: splash
hero:
  tagline: Reliable mirror. Fast updates. Zero lock-in.
  actions:
    - text: Open React Guides
      link: /framework/react/guides/queries/
      icon: right-arrow
    - text: View Sync Status
      link: /sync-status/
      variant: minimal
---

import { Card, CardGrid, Steps } from '@astrojs/starlight/components';

## Why this mirror

<CardGrid stagger>
  <Card title="Track v5 only" icon="setting">
    Sync script resolves latest upstream `v5.x.y` tag and locks commit metadata.
  </Card>
  <Card title="No missing pages" icon="open-book">
    Sync validates against upstream `docs/config.json` and generates example redirects.
  </Card>
  <Card title="Deploy anywhere" icon="rocket">
    Static build output works with Vercel, Netlify, Cloudflare Pages, or GitHub Pages.
  </Card>
  <Card title="Automated maintenance" icon="pencil">
    GitHub Actions runs scheduled sync and can open PRs when upstream docs change.
  </Card>
</CardGrid>

## Included content

- `docs/framework/react/**/*.md`
- `docs/reference/**/*.md`
- `docs/eslint/**/*.md`
- `docs/config.json` for validation and redirect generation
- Generated pages for `framework/react/examples/*`

## Daily workflow

<Steps>
1. Run `pnpm run sync:check` to detect new upstream v5 tags.
2. Run `pnpm run sync:docs` to pull and validate content.
3. Run `pnpm run build` and deploy `dist/`.
</Steps>
