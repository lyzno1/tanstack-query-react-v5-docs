import { readFileSync } from 'node:fs'
import path from 'node:path'
import { unified } from 'unified'
import remarkParse from 'remark-parse'

const root = path.resolve('src/content/docs')
const manifest = JSON.parse(readFileSync('upstream/manifest.json', 'utf8'))
const parser = unified().use(remarkParse)
const failures = []
let checked = 0
for (const relative of manifest.files) {
  const en = readFileSync(path.join(root, relative), 'utf8')
  const zh = readFileSync(path.join(root, 'zh', relative), 'utf8')
  if (/translation-status:\s*draft/.test(zh)) failures.push(`${relative}: untranslated draft`)
  if (en === zh) failures.push(`${relative}: translation is an unchanged English copy`)
  const parse = source => parser.parse(source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, ''))
  const a = parse(en)
  const b = parse(zh)
  const outline = tree => tree.children.filter(node => node.type === 'heading').map(node => node.depth).join(',')
  if (outline(a) !== outline(b)) failures.push(`${relative}: heading structure differs`)
  const codes = tree => {
    const result = []
    function visit(node) {
      if (node.type === 'code') result.push(node.lang ?? '')
      for (const child of node.children ?? []) visit(child)
    }
    visit(tree)
    return result.join(',')
  }
  if (codes(a) !== codes(b)) failures.push(`${relative}: code block count/languages differ`)
  checked++
}
if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else console.log(`Translation structure passed for ${checked} pages (semantic review is still required).`)
