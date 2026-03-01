# Translation Style Guide (ZH)

## Goals

- Keep technical meaning equivalent to upstream English.
- Prefer clear modern Chinese over literal word-by-word rendering.
- Keep API surface (`useQuery`, `queryKey`, option names) unchanged.

## Markdown Rules

- Keep heading hierarchy unchanged.
- Preserve fenced code blocks exactly unless comments or strings are intentionally translated.
- Preserve links and relative link targets.
- Keep admonitions, lists, and tables structurally unchanged.

## Terminology Rules

- Use consistent translations from `references/terminology.md`.
- Keep ecosystem proper nouns in English:
  - TanStack Query
  - React Query (when historical naming appears)
  - Query Client

## Tone and Clarity

- Use direct instructional tone.
- Prefer short sentences in conceptual sections.
- Avoid adding new claims that do not exist in upstream docs.

## Sync Safety

- Do not manually edit files under:
  - `src/content/docs/framework/**`
  - `src/content/docs/reference/**`
  - `src/content/docs/eslint/**`
- Only edit `src/content/docs/zh/**` for translation work.
