import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { parse } from 'parse5'

const root = path.resolve('dist')
function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name)
    return entry.isDirectory() ? htmlFiles(file) : entry.name.endsWith('.html') ? [file] : []
  })
}
function tags(node, name) {
  const own = node.tagName === name ? [Object.fromEntries(node.attrs.map(({ name, value }) => [name, value]))] : []
  return [...own, ...(node.childNodes ?? []).flatMap(child => tags(child, name))]
}
let docs = 0
const origins = new Set()
for (const file of htmlFiles(root)) {
  const html = readFileSync(file, 'utf8')
  const document = parse(html)
  if (!tags(document, 'h1').some(tag => tag.id === '_top')) continue
  docs++
  const meta = tags(document, 'meta')
  const links = tags(document, 'link')
  const canonical = links.filter(tag => tag.rel === 'canonical')
  assert.equal(canonical.length, 1, `${file}: expected one canonical`)
  const url = new URL(canonical[0].href)
  assert.notEqual(url.hostname, 'example.com', `${file}: placeholder canonical`)
  origins.add(url.origin)
  assert.equal(meta.filter(tag => tag.name === 'description').length, 1, `${file}: expected one description`)
  const description = meta.find(tag => tag.name === 'description').content
  assert.ok(description, `${file}: empty description`)
  assert.equal(meta.find(tag => tag.property === 'og:description')?.content, description)
  assert.equal(meta.find(tag => tag.property === 'og:url')?.content, url.href)
  assert.equal(tags(document, 'h1').length, 1, `${file}: expected one h1`)
  assert.match(html, /<main\b/, `${file}: missing main landmark`)
  assert.ok(links.some(tag => tag.href === '/favicon.svg'), `${file}: missing site favicon`)
  if (url.pathname.startsWith('/zh/')) {
    assert.equal(tags(document, 'html')[0].lang, 'zh-CN')
    assert.equal(meta.find(tag => tag.property === 'og:locale')?.content, 'zh_CN')
    assert.ok(links.some(tag => tag.hreflang === 'en'), `${file}: missing English alternative`)
  }
  if (url.hostname === 'localhost' || process.env.VERCEL_ENV === 'preview') {
    assert.ok(meta.some(tag => tag.name === 'robots' && tag.content.includes('noindex')), `${file}: missing noindex`)
  }
}
assert.ok(docs > 0, 'No Starlight pages were built')
assert.equal(origins.size, 1, 'Mixed canonical origins')
for (const file of ['index.html', 'zh/index.html']) {
  const html = readFileSync(path.join(root, file), 'utf8')
  assert.match(html, /<main\b/)
  assert.ok(tags(parse(html), 'a').some(tag => /^\/(?:zh\/)?framework\/react\/overview\/$/.test(tag.href)))
}
const robots = readFileSync(path.join(root, 'robots.txt'), 'utf8')
assert.match(robots, /^User-agent: \*/)
const [origin] = origins
if (new URL(origin).hostname === 'localhost') assert.match(robots, /Disallow: \//)
else if (process.env.VERCEL_ENV === 'preview') {
  assert.match(robots, /Allow: \//)
  assert.ok(!robots.includes('Disallow: /'))
  assert.ok(!robots.includes('Sitemap:'))
}
else assert.ok(robots.includes(`Sitemap: ${origin}/sitemap-index.xml`))
console.log(`Checked metadata and landmarks on ${docs} documentation pages, redirect links and robots.txt.`)
