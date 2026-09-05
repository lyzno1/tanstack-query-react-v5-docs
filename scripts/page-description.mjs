import { unified } from 'unified'
import remarkParse from 'remark-parse'

const parser = unified().use(remarkParse)

function textContent(node) {
  if (node.type === 'text' || node.type === 'inlineCode') return node.value
  if (node.type === 'break') return ' '
  return (node.children ?? []).map(textContent).join('')
}

/** Summarize real prose without serializing Markdown syntax or raw HTML. */
export function pageDescription(body, title, isZh, authored) {
  if (authored?.trim()) return authored.trim()
  const paragraph = parser.parse(body ?? '').children.find(node => node.type === 'paragraph' && textContent(node).trim())
  const text = paragraph ? textContent(paragraph).replace(/\s+/g, ' ').trim() : ''
  if (!text) return isZh
    ? `${title}：TanStack Query React v5 中文文档，介绍相关概念、用法与示例。`
    : `${title} — TanStack Query React v5 documentation, covering concepts, usage and examples.`
  const chars = Array.from(text)
  const limit = isZh ? 100 : 180
  if (chars.length <= limit) return text
  const excerpt = chars.slice(0, limit).join('')
  return `${isZh ? excerpt : excerpt.replace(/\s+\S*$/, '')}…`
}
