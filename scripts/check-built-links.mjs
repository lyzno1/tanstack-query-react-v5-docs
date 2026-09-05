import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve('dist')
if (!existsSync(root)) throw new Error('Run pnpm build before checking links.')
const files = []
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(file)
    else if (file.endsWith('.html')) files.push(file)
  }
}
walk(root)
const pages = new Map(files.map(file => {
  const html = readFileSync(file, 'utf8')
  return [file, { html, ids: new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])) }]
}))
const failures = new Set()
let checked = 0
for (const [file, { html }] of pages) {
  const route = `/${path.relative(root, file).replace(/index\.html$/, '')}`
  // Inspect real HTML links, not source Markdown embedded in the copy button's JSON.
  const clean = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
  for (const [, href] of clean.matchAll(/<a\s[^>]*\bhref="([^"]+)"/g)) {
    const url = new URL(href.replaceAll('&amp;', '&'), `https://docs.invalid${route}`)
    if (url.origin !== 'https://docs.invalid') continue
    checked++
    let target = path.join(root, decodeURIComponent(url.pathname))
    if (!path.extname(target)) target = path.join(target, 'index.html')
    if (!existsSync(target)) failures.add(`${route} -> ${href} (missing page)`)
    else if (url.hash && pages.has(target) && !pages.get(target).ids.has(decodeURIComponent(url.hash.slice(1)))) {
      failures.add(`${route} -> ${href} (missing anchor)`)
    }
  }
}
if (failures.size) {
  console.error([...failures].join('\n'))
  console.error(`${failures.size} broken internal links`)
  process.exitCode = 1
} else console.log(`Checked ${checked} internal links across ${pages.size} pages; no broken pages or anchors.`)
