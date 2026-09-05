import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import { docsMarkdown, editorialMarkdown } from './docs-markdown.mjs'

test('recording a review requires explicit scope and preserves unreviewed hashes', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'translation-review-'))
  mkdirSync(path.join(root, 'upstream'))
  mkdirSync(path.join(root, 'src/content/docs/zh/reference'), { recursive: true })
  mkdirSync(path.join(root, 'src/content/docs/reference'), { recursive: true })
  const files = ['reference/a.md', 'reference/b.md']
  writeFileSync(path.join(root, 'upstream/manifest.json'), JSON.stringify({ ref: 'main', files }))
  const translations = Object.fromEntries(files.map(file => [file, { hash: 'old', sourceRef: 'main', translatedAt: 'old' }]))
  writeFileSync(path.join(root, 'upstream/i18n.zh.json'), JSON.stringify({ translations }))
  for (const file of files) {
    writeFileSync(path.join(root, 'src/content/docs', file), '# English\n')
    writeFileSync(path.join(root, 'src/content/docs/zh', file), '# 中文\n')
  }
  const run = (...args) => spawnSync(process.execPath, ['scripts/i18n-verify.mjs', `--root=${root}`, '--write', ...args], { encoding: 'utf8' })
  assert.notEqual(run().status, 0)
  assert.equal(run('--path=reference/a.md').status, 0)
  const metadata = JSON.parse(readFileSync(path.join(root, 'upstream/i18n.zh.json'), 'utf8'))
  assert.notEqual(metadata.translations[files[0]].hash, 'old')
  assert.deepEqual(metadata.translations[files[1]], translations[files[1]])
  assert.notEqual(run('--path=reference/missing.md').status, 0)
  writeFileSync(path.join(root, 'src/content/docs/zh/reference/b.md'), '<!-- translation-status: draft -->\n# English\n')
  assert.notEqual(run('--all-reviewed').status, 0)
})

test('Chinese links resolve from source paths and retain upstream anchors', () => {
  const file = path.resolve('src/content/docs/zh/framework/react/guides/prefetching.md')
  const source = readFileSync(file, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '')
  const tree = unified().use(remarkParse).parse(source)
  docsMarkdown()(tree, { path: file })
  assert.ok(tree.children.some(node => node.data?.hProperties?.id === 'manually-priming-a-query'))
  const links = []
  function visit(node) {
    if (node.type === 'link') links.push(node.url)
    for (const child of node.children ?? []) visit(child)
  }
  visit(tree)
  assert.ok(links.includes('/zh/reference/queryclient/#queryclientsetquerydata'))
  assert.ok(links.includes('/zh/framework/react/guides/ssr/'))
})

test('community frontmatter becomes visible content', () => {
  const file = path.resolve('src/content/docs/zh/community-resources.md')
  const tree = { type: 'root', children: [] }
  docsMarkdown()(tree, { path: file })
  assert.equal(tree.children.filter(node => node.type === 'heading').length, 4)
  assert.match(JSON.stringify(tree), /TkDodo/)
  assert.match(editorialMarkdown(file), /TkDodo/)
})


test('site origins use the production domain and reject placeholder or malformed settings', async () => {
  const { resolveSite, isNonIndexable } = await import('./site-settings.mjs')
  assert.equal(resolveSite({ SITE_URL: 'https://docs.test/', VERCEL_PROJECT_PRODUCTION_URL: 'other.test' }), 'https://docs.test')
  assert.equal(resolveSite({ VERCEL_PROJECT_PRODUCTION_URL: 'docs.test', VERCEL_URL: 'branch.test' }), 'https://docs.test')
  assert.throws(() => resolveSite({ VERCEL_ENV: 'production' }))
  for (const SITE_URL of ['https://example.com', 'https://docs.test/path', 'https://user:pass@docs.test', 'javascript:alert(1)']) {
    assert.throws(() => resolveSite({ SITE_URL }))
  }
  assert.equal(isNonIndexable(resolveSite({})), true)
  assert.equal(isNonIndexable('https://docs.test', 'preview'), true)
  assert.equal(isNonIndexable('https://docs.test', 'production'), false)
})

test('page descriptions preserve authored summaries and extract readable bilingual prose', async () => {
  const { pageDescription } = await import('./page-description.mjs')
  assert.equal(pageDescription('# Heading\n\nUse **queries** with `useQuery` and [caching](/cache).', 'Queries', false), 'Use queries with useQuery and caching.')
  assert.equal(pageDescription('正文', '标题', true, '作者摘要'), '作者摘要')
  assert.equal(pageDescription('<!-- hidden -->\n\n![image](a.png)\n\n中文 **正文**。', '标题', true), '中文 正文。')
  assert.ok(pageDescription('```js\nsecret()\n```', '安装', true).startsWith('安装：'))
  assert.equal(Array.from(pageDescription('中'.repeat(120), '标题', true)).length, 101)
})
