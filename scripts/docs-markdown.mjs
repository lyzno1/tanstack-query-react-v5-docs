import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import GithubSlugger from 'github-slugger'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import { parse as parseYaml } from 'yaml'

const docsRoot = path.resolve('src/content/docs')
const parser = unified().use(remarkParse)
const headingCache = new Map()

function text(node) {
  return node.value ?? (node.children ?? []).map(text).join('')
}

function headings(file) {
  if (!headingCache.has(file)) {
    const body = readFileSync(file, 'utf8').replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
    const slugger = new GithubSlugger()
    headingCache.set(file, parser.parse(body).children
      .filter(node => node.type === 'heading')
      .map(node => ({ depth: node.depth, id: slugger.slug(text(node)) })))
  }
  return headingCache.get(file)
}

// Used by both the rendered page and Copy Markdown so neither loses editorial content.
export function editorialMarkdown(source) {
  const relative = path.relative(docsRoot, source).split(path.sep).join('/')
  const isZh = relative.startsWith('zh/')
  const english = isZh ? path.join(docsRoot, relative.slice(3)) : source
  // Upstream's current page lists this method but accidentally omits its section.
  // Keep this explicitly editorial, and retire it automatically when upstream restores it.
  if (relative.endsWith('reference/QueryClient.md') && !headings(english).some(h => h.id === 'queryclientgetquerydata')) {
    const supplement = isZh
      ? '## `queryClient.getQueryData`\n\n> 本站补充：当前上游目录列出了此方法，但正文缺少说明。\n\n`getQueryData(queryKey)` 同步读取指定查询键的缓存数据；如果没有缓存数据，返回 `undefined`。它不会发起网络请求。\n\n```tsx\nconst data = queryClient.getQueryData([\'todos\'])\n```'
      : '## `queryClient.getQueryData`\n\n> Site note: the current upstream contents list this method but omit its description.\n\n`getQueryData(queryKey)` synchronously reads cached data for a query key, or returns `undefined` when no data is cached. It does not fetch data.\n\n```tsx\nconst data = queryClient.getQueryData([\'todos\'])\n```'
    return supplement
  }

  if (relative.endsWith('community-resources.md')) {
    const raw = readFileSync(source, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)
    const resources = parseYaml(raw[1])
    const sections = isZh
      ? { articles: '文章', media: '视频与访谈', utilities: '工具', others: '其他项目' }
      : { articles: 'Articles', media: 'Videos and interviews', utilities: 'Utilities', others: 'Other projects' }
    const rendered = []
    for (const [key, label] of Object.entries(sections)) {
      const items = resources[key] ?? []
      if (!items.length) continue
      rendered.push(`## ${label}\n\n${items.map(item =>
        `- [${item.title}](${item.url})：${item.description}`).join('\n')}`)
    }
    return rendered.join('\n\n')
  }
  return ''
}

// Resolve source-relative Markdown links before Starlight adds route trailing slashes.
// Chinese headings retain upstream IDs so incoming and cross-page anchors survive translation.
export function docsMarkdown() {
  return (tree, file) => {
    const source = path.resolve(file.path)
    if (!source.startsWith(`${docsRoot}${path.sep}`)) return
    const relative = path.relative(docsRoot, source).split(path.sep).join('/')
    const isZh = relative.startsWith('zh/')
    const english = isZh ? path.join(docsRoot, relative.slice(3)) : source
    if (isZh && existsSync(english)) {
      const original = headings(english)
      const translated = tree.children.filter(node => node.type === 'heading')
      if (original.length !== translated.length || original.some((h, i) => h.depth !== translated[i].depth)) {
        throw new Error(`Heading structure differs from upstream: ${relative}`)
      }
      translated.forEach((node, i) => {
        node.data ??= {}
        node.data.hProperties = { ...node.data.hProperties, id: original[i].id }
      })
    }

    const editorial = editorialMarkdown(source)
    if (editorial) tree.children.push(...parser.parse(editorial).children)

    function normalize(url) {
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url)) return url
      const [location, fragment] = url.split('#')
      const [pathname, query] = location.split('?')
      const target = pathname
        ? (pathname.startsWith('/') ? path.join(docsRoot, pathname) : path.resolve(path.dirname(source), pathname))
        : source
      const candidates = [target, `${target}.md`, path.join(target, 'index.md')]
      const resolved = candidates.find(candidate => candidate.endsWith('.md') && existsSync(candidate))
      if (!resolved || !resolved.startsWith(`${docsRoot}${path.sep}`)) return url
      let anchor = fragment
      if (anchor) {
        const enTarget = resolved.replace(`${docsRoot}/zh/`, `${docsRoot}/`)
        const ids = headings(existsSync(enTarget) ? enTarget : resolved).map(h => h.id)
        if (enTarget.endsWith('/reference/QueryClient.md')) ids.push('queryclientgetquerydata')
        const decoded = decodeURIComponent(anchor).toLowerCase()
        // Upstream mixes old hyphenated anchors with current TypeDoc/GitHub slugs.
        anchor = ids.find(id => id === decoded)
          ?? ids.find(id => id.replaceAll('-', '') === decoded.replaceAll('-', ''))
          ?? anchor
      }
      let route = path.relative(docsRoot, resolved).split(path.sep).join('/').replace(/\.md$/, '').replace(/\/index$/, '').toLowerCase()
      if (isZh && !route.startsWith('zh/') && existsSync(path.join(docsRoot, 'zh', path.relative(docsRoot, resolved)))) route = `zh/${route}`
      return `/${route}/${query ? `?${query}` : ''}${anchor ? `#${anchor}` : ''}`
    }
    function walk(node) {
      if ((node.type === 'link' || node.type === 'definition') && typeof node.url === 'string') node.url = normalize(node.url)
      for (const child of node.children ?? []) walk(child)
    }
    walk(tree)
  }
}
