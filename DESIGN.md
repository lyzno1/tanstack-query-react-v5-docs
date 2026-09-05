# Documentation design

## Goal

A quiet, monochrome documentation workspace inspired by **nuqs**, with a compact
navigation column, generous article space, restrained controls and readable Chinese
prose. The site keeps Astro/Starlight, static HTML, Pagefind, its locale routing and
upstream Markdown synchronization. Fumadocs is a design reference, not a runtime
dependency. Do not copy nuqs branding or add a React application to restyle the docs.

## Verified reference sources

Reviewed on 2026-09-05. nuqs source is pinned to commit
[`9bf77646b74f1492fc58a9f289e41bf386ef9ae2`](https://github.com/47ng/nuqs/tree/9bf77646b74f1492fc58a9f289e41bf386ef9ae2).

- [nuqs Design System](https://github.com/47ng/nuqs/blob/9bf77646b74f1492fc58a9f289e41bf386ef9ae2/packages/docs/content/docs/internal/design-system.mdx):
  the actual internal design document. It is a component specimen covering heading
  hierarchy, Fumadocs callouts with local tweaks, code and feature matrices; it is
  not a prose brand manual. This is the reference for component consistency.
- [Global theme](https://github.com/47ng/nuqs/blob/9bf77646b74f1492fc58a9f289e41bf386ef9ae2/packages/docs/src/app/globals.css):
  application HSL tokens, 8px radius, Fumadocs `black.css` and `preset.css` imports.
- [Local design adjustments](https://github.com/47ng/nuqs/blob/9bf77646b74f1492fc58a9f289e41bf386ef9ae2/packages/docs/src/app/styles/tweaks.css):
  64px desktop header, 56px mobile header, compact sidebar rows, zinc-tinted code
  blocks, 1.5px inline-code vertical padding and aligned callout borders.
- [Documentation layout](https://github.com/47ng/nuqs/blob/9bf77646b74f1492fc58a9f289e41bf386ef9ae2/packages/docs/src/app/docs/layout.tsx):
  Fumadocs **Notebook** layout, top navigation and a non-collapsible desktop sidebar.
- [Root layout](https://github.com/47ng/nuqs/blob/9bf77646b74f1492fc58a9f289e41bf386ef9ae2/packages/docs/src/app/layout.tsx):
  Inter typography. [Live installation page](https://nuqs.dev/docs/installation)
  was inspected in both themes for the article, navigation and code treatment.
- [Fumadocs theme guide](https://www.fumadocs.dev/docs/ui/theme) and the published
  [`fumadocs-ui@16.14.5/css/black.css`](https://unpkg.com/fumadocs-ui@16.14.5/css/black.css):
  the exact package version used by the reviewed nuqs source.

### Application colors from nuqs

Hex values below are rounded from the original HSL values, rather than sampled
from a screenshot. The source tokens remain authoritative.

| Role | nuqs light HSL | Light hex | nuqs dark HSL | Dark hex |
| --- | --- | --- | --- | --- |
| Background | `0 0% 100%` | `#FFFFFF` | `240 10% 3.9%` | `#09090B` |
| Foreground | `240 10% 3.9%` | `#09090B` | `0 0% 98%` | `#FAFAFA` |
| Primary | `240 5.9% 10%` | `#18181B` | `0 0% 98%` | `#FAFAFA` |
| Secondary / muted surface | `240 4.8% 95.9%` | `#F4F4F5` | `240 3.7% 15.9%` | `#27272A` |
| Muted foreground | `240 3.8% 46.1%` | `#71717A` | `240 5% 64.9%` | `#A1A1AA` |
| Border / input | `240 5.9% 90%` | `#E4E4E7` | `240 3.7% 15.9%` | `#27272A` |
| Focus ring | `240 5.9% 10%` | `#18181B` | `240 4.9% 83.9%` | `#D4D4D8` |

These are **application** tokens. Fumadocs black.css has its own neutral tokens:
light background `hsl(0 0% 98%)`, dark background `hsl(0 0% 2%)`, light border
`hsla(0 0% 60% / 0.2)`, dark border `hsla(0 0% 50% / 0.2)`, light accent
`hsl(0 0% 94.1%)`, dark accent `hsl(0 0% 15%)`. They are not interchangeable with
the application's zinc palette. Our adaptation deliberately uses the application
palette consistently across the Starlight shell instead of mixing two token systems.

### Local token mapping

`src/styles/theme.css` is the single source of truth for site surfaces and text.
Starlight's `--sl-color-*` tokens reference these local tokens in both themes.

| Local token | Light | Dark | Purpose |
| --- | --- | --- | --- |
| `--doc-bg` | `#FFFFFF` | `#09090B` | Article, sidebar, toolbar |
| `--doc-fg` | `#09090B` | `#FAFAFA` | Headings, links, focus indicators |
| `--doc-text` | `#3F3F46` | `#D4D4D8` | Body text, adapted for long reading |
| `--doc-muted` | `#71717A` | `#A1A1AA` | Navigation, metadata |
| `--doc-surface` | `#FAFAFA` | `#18181B` | Search, inline code, hover |
| `--doc-active` | `#F4F4F5` | `#27272A` | Selected navigation |
| `--doc-border` | `#E4E4E7` | `#27272A` | Dividers, cards, controls |
| `--doc-code-bg` | `#FDFDFD` | `#101013` | Rounded approximation of nuqs' 50% zinc code surface |

Semantic Starlight note/tip/caution/danger colors remain distinct. Normal links are
underlined, selected navigation uses fill and weight, and keyboard focus uses a
2px foreground outline: meaning must not depend on a subtle border alone.

## Layout and typography decisions

- Header: 64px at Starlight's desktop breakpoint, 56px on mobile. A compact TanStack
  Query wordmark and v5 badge leave room for search, theme and locale controls.
- Navigation: 256px desktop sidebar, flat compact rows, rounded selected state.
  Keep native accessible disclosure controls for the much larger TanStack hierarchy.
- Article: at most 864px, responsive Starlight gutters, 208px desktop TOC. The TOC
  uses a vertical rule and an active line, rather than separate filled buttons.
- Title: 28–34px, semibold, with a small React v5 label and a separate Copy Markdown
  row. No decorative title rule or artificial large introductory paragraph.
- Body: 15px / 1.8 line height, a deliberate Chinese reading adaptation. Headings
  use whitespace for hierarchy. Inter Latin is self-hosted with `font-display: swap`;
  system CJK fallbacks avoid downloading a large Chinese font. Code uses system mono.
- Code: GitHub light/dark syntax themes through Expressive Code's public options,
  an 8px radius, quiet surface, thin border and built-in copy control. Inline code
  uses 1.5px vertical padding so neighboring lines never collide.
- Cards and pagination: outlined surfaces, small radii, minimal hover changes.
  Content has no entrance animation. Only brief control transitions run when the
  user has not requested reduced motion.

## Astro and Starlight implementation

Follow the official [Starlight CSS guide](https://starlight.astro.build/guides/css-and-tailwind/)
and [component override API](https://starlight.astro.build/guides/overriding-components/).
Use public theme variables and `customCss`; unlayered local CSS intentionally takes
precedence over Starlight's named layers. Limit component overrides to `SiteTitle`
and `PageTitle`. Keep built-in search, theme persistence, language selection, mobile
navigation, anchor tracking and pagination. No Tailwind or Fumadocs runtime is needed.

Astro was upgraded to **7.3.1** and Starlight to **0.42.0**, the npm stable releases
verified during this change. Node.js **24** is consistent in `package.json`,
`.node-version`, validation CI and scheduled synchronization.

The [Astro 6 migration](https://docs.astro.build/en/guides/upgrade-to/v6/) raises the
Node requirement; the [Astro 7 migration](https://docs.astro.build/en/guides/upgrade-to/v7/)
changes the default Markdown processor and whitespace handling. Explicitly use
`@astrojs/markdown-remark`'s `unified({ remarkPlugins: [docsMarkdown] })` and
`compressHTML: true` to preserve the reviewed Markdown transformations and spacing.
Starlight's removed autogenerated-group syntax is migrated to an `items` array
containing an autogenerate entry, including the metadata-missing fallback paths.

The copy toolbar uses a small Astro-processed script and a custom element. It copies
the same source Markdown and editorial notes as before, reports actual clipboard
success or failure through a live region, and does not hydrate a framework.

## Review checklist

Before merging any future visual or framework update:

- Run `pnpm check`, `pnpm lint`, `pnpm i18n:check`, `pnpm test:maintenance`,
  `pnpm build` and `pnpm links:check`.
- Inspect light and dark Chinese installation, a long guide/API page and an English
  page; check code, tables, headings, notes and navigation at narrow and wide widths.
- Check mobile menu, mobile TOC, search, locale/theme selection and copy feedback.
- Check keyboard focus visibility, reduced motion and horizontal overflow. Code and
  wide tables may scroll inside their own containers; the page itself must not.
- Verify fonts are served locally and copied Markdown retains the editorial content.
- Do not modify synchronized Markdown or refresh translation hashes for style work.

## Validation recorded for this change

All six repository gates passed locally, and GitHub CI and the Vercel preview build
passed. The output contains 333 pages and 62,233 valid internal links. All 139
translation records remain current and untouched.

Browser inspection of the reference nuqs site covered both themes. Browser inspection
of this project's changed pages remains **unverified**: the cloud browser cannot
reach the local server, and the Vercel preview requires account authentication.
Desktop/mobile screenshots, interaction checks and measured rendered contrast must
not be represented as passing until someone with preview access performs them.
The checklist above records the outstanding visual acceptance work.
