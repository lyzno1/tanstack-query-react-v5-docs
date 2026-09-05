#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DOCS_ROOT = path.join(ROOT, 'src', 'content', 'docs')
const UPSTREAM_ROOT = path.join(ROOT, 'upstream')
const UPSTREAM_REPO = 'https://github.com/TanStack/query.git'
const DEFAULT_REF = 'main'

const args = process.argv.slice(2)
const refArg = args.find((arg) => arg.startsWith('--ref='))
const requestedRef = refArg ? refArg.slice('--ref='.length) : undefined

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: options.cwd,
    encoding: 'utf8',
    stdio: options.stdio ?? 'pipe',
  })

  if (result.status !== 0) {
    const errorText = [
      `Command failed: ${command} ${commandArgs.join(' ')}`,
      result.stdout?.trim(),
      result.stderr?.trim(),
    ]
      .filter(Boolean)
      .join('\n')
    throw new Error(errorText)
  }

  return result.stdout?.trim() ?? ''
}

function collectDocEntries(value, entries = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectDocEntries(item, entries)
    return entries
  }

  if (!value || typeof value !== 'object') {
    return entries
  }

  if (typeof value.to === 'string') {
    entries.push({
      to: value.to,
      label: typeof value.label === 'string' ? value.label : null,
    })
  }

  for (const nested of Object.values(value)) {
    collectDocEntries(nested, entries)
  }

  return entries
}

async function ensureCleanSyncPaths() {
  await rm(path.join(DOCS_ROOT, 'framework'), { recursive: true, force: true })
  await rm(path.join(DOCS_ROOT, 'reference'), { recursive: true, force: true })
  await rm(path.join(DOCS_ROOT, 'eslint'), { recursive: true, force: true })
  await rm(path.join(DOCS_ROOT, 'community-resources.md'), { force: true })
}

async function copyFromUpstream(repoDir, sourcePath) {
  const relative = sourcePath.replace(/^docs\//, '')
  const sourceFullPath = path.join(repoDir, sourcePath)

  if (sourcePath === 'docs/config.json') {
    const destination = path.join(UPSTREAM_ROOT, 'docs.config.json')
    await mkdir(path.dirname(destination), { recursive: true })
    await copyFile(sourceFullPath, destination)
    return
  }

  const destination = path.join(DOCS_ROOT, relative)
  await mkdir(path.dirname(destination), { recursive: true })
  await copyFile(sourceFullPath, destination)
}

function isTrackedDocPath(docPath) {
  return (
    docPath.startsWith('framework/react/') ||
    docPath.startsWith('reference/') ||
    docPath.startsWith('eslint/')
  )
}

async function ensureFilesExist(filePaths) {
  const missing = []

  for (const filePath of filePaths) {
    if (!existsSync(filePath)) {
      missing.push(filePath)
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing expected files after sync:\n${missing
        .map((filePath) => ` - ${path.relative(ROOT, filePath)}`)
        .join('\n')}`,
    )
  }
}

function buildExampleRedirect({ slug, label, ref }) {
  const title = label ?? slug
  const officialPath = `https://tanstack.com/query/latest/docs/framework/react/examples/${slug}`
  const githubPath = `https://github.com/TanStack/query/tree/${ref}/examples/react/${slug}`

  return `---
title: ${title}
description: Official TanStack Query React example link.
---

This example is maintained upstream in TanStack Query.

- Official docs page: [${slug}](${officialPath})
- Upstream source: [examples/react/${slug}](${githubPath})
`
}

const zhExampleTitles = {
  'simple': '简单示例',
  'basic': '基础示例',
  'basic-graphql-request': 'GraphQL-Request 基础示例',
  'auto-refetching': '自动重新获取、轮询与实时更新',
  'nextjs-app-optimistic-updates': '乐观更新',
  'pagination': '分页',
  'load-more-infinite-scroll': '加载更多与无限滚动',
  'infinite-query-with-max-pages': '限制最大页数的无限查询',
  'suspense': 'Suspense',
  'default-query-function': '默认查询函数',
  'playground': '交互演示',
  'prefetching': '预取',
  'star-wars': '星球大战',
  'rick-morty': '瑞克和莫蒂',
  'nextjs': 'Next.js Pages Router',
  'nextjs-app-prefetching': 'Next.js App Router 预取',
  'nextjs-suspense-streaming': 'Next.js App Router 流式渲染',
  'react-native': 'React Native',
  'react-router': 'React Router',
  'offline': '离线查询与变更',
  'algolia': 'Algolia',
  'shadow-dom': 'Shadow DOM',
  'devtools-panel': '嵌入式开发工具面板',
  'chat': '聊天示例（流式响应）',
  'batching': '批处理',
}

function buildSyncStatusPage(lock) {
  return `---
title: Sync Status
description: Upstream synchronization metadata for this docs site.
---

This site tracks TanStack Query React docs from the v5 release line.

- Upstream repo: [${lock.upstreamRepo}](${lock.upstreamRepo})
- Tracking strategy: \`${lock.track}\`
- Current synced ref: \`${lock.ref}\`
- Upstream commit: \`${lock.commit}\`
- Synced at (UTC): \`${lock.syncedAt}\`

## Synced counts

- Markdown files: ${lock.counts.syncedMarkdown}
- React docs pages: ${lock.counts.reactMarkdown}
- Core reference pages: ${lock.counts.referenceMarkdown}
- ESLint docs pages: ${lock.counts.eslintMarkdown}
- Generated example redirect pages: ${lock.counts.generatedExampleRedirects}
`
}

async function main() {
  const resolvedRef = requestedRef ?? DEFAULT_REF
  const tmpRoot = await mkdtemp(path.join(os.tmpdir(), 'tanstack-query-sync-'))
  const repoDir = path.join(tmpRoot, 'query')

  try {
    console.log(`Syncing TanStack Query docs from ${resolvedRef}...`)

    run(
      'git',
      [
        'clone',
        '--depth',
        '1',
        '--filter=blob:none',
        '--sparse',
        '--branch',
        resolvedRef,
        UPSTREAM_REPO,
        repoDir,
      ],
      { stdio: 'inherit' },
    )
    run('git', ['-C', repoDir, 'sparse-checkout', 'set', 'docs'], {
      stdio: 'inherit',
    })

    const upstreamCommit = run('git', ['-C', repoDir, 'rev-parse', 'HEAD'])

    const upstreamFiles = run('git', [
      '-C',
      repoDir,
      'ls-files',
      'docs/framework/react',
      'docs/reference',
      'docs/eslint',
      'docs/community-resources.md',
      'docs/config.json',
    ])
      .split('\n')
      .filter(Boolean)

    const markdownFiles = upstreamFiles.filter((filePath) =>
      filePath.endsWith('.md'),
    )

    await ensureCleanSyncPaths()

    for (const filePath of upstreamFiles) {
      await copyFromUpstream(repoDir, filePath)
    }

    const configPath = path.join(UPSTREAM_ROOT, 'docs.config.json')
    const config = JSON.parse(await readFile(configPath, 'utf8'))
    const entries = collectDocEntries(config)

    const exampleEntries = entries.filter((entry) =>
      entry.to.startsWith('framework/react/examples/'),
    )

    for (const entry of exampleEntries) {
      const slug = entry.to.replace('framework/react/examples/', '')
      const outputPath = path.join(DOCS_ROOT, `${entry.to}.md`)
      await mkdir(path.dirname(outputPath), { recursive: true })
      await writeFile(
        outputPath,
        buildExampleRedirect({ slug, label: entry.label, ref: resolvedRef }),
        'utf8',
      )
    }

    // These pages contain deterministic links, not prose requiring a translation review.
    const zhExamples = path.join(DOCS_ROOT, 'zh', 'framework', 'react', 'examples')
    await rm(zhExamples, { recursive: true, force: true })
    await mkdir(zhExamples, { recursive: true })
    for (const entry of exampleEntries) {
      const slug = entry.to.replace('framework/react/examples/', '')
      const content = buildExampleRedirect({ slug, label: zhExampleTitles[slug] ?? entry.label, ref: resolvedRef })
        .replace('Official TanStack Query React example link.', 'TanStack Query React 官方示例链接。')
        .replace('This example is maintained upstream in TanStack Query.', '此示例由 TanStack Query 上游维护。')
        .replace('Official docs page:', '官方文档页面：')
        .replace('Upstream source:', '上游源码：')
      await writeFile(path.join(zhExamples, `${slug}.md`), content, 'utf8')
    }

    const expectedByManifest = markdownFiles.map((filePath) =>
      path.join(DOCS_ROOT, filePath.replace(/^docs\//, '')),
    )
    await ensureFilesExist(expectedByManifest)

    const expectedByConfig = new Set(
      entries
        .map((entry) => entry.to)
        .filter((docPath) => isTrackedDocPath(docPath)),
    )

    const missingConfigTargets = []
    for (const docPath of expectedByConfig) {
      const expectedFilePath = path.join(DOCS_ROOT, `${docPath}.md`)
      if (!existsSync(expectedFilePath)) {
        missingConfigTargets.push(expectedFilePath)
      }
    }

    if (missingConfigTargets.length > 0) {
      throw new Error(
        `Config references missing pages:\n${missingConfigTargets
          .map((filePath) => ` - ${path.relative(ROOT, filePath)}`)
          .join('\n')}`,
      )
    }

    const manifest = {
      syncedAt: new Date().toISOString(),
      ref: resolvedRef,
      files: markdownFiles.map((filePath) => filePath.replace(/^docs\//, '')),
      generatedExampleRedirects: exampleEntries
        .map((entry) => entry.to.replace(/^framework\/react\/examples\//, ''))
        .sort(),
    }

    await mkdir(UPSTREAM_ROOT, { recursive: true })
    await writeFile(
      path.join(UPSTREAM_ROOT, 'manifest.json'),
      `${JSON.stringify(manifest, null, 2)}\n`,
      'utf8',
    )

    const lock = {
      upstreamRepo: UPSTREAM_REPO,
      track: resolvedRef === DEFAULT_REF ? 'upstream-main' : 'pinned-ref',
      ref: resolvedRef,
      commit: upstreamCommit,
      syncedAt: new Date().toISOString(),
      counts: {
        syncedMarkdown: markdownFiles.length,
        reactMarkdown: markdownFiles.filter((filePath) =>
          filePath.startsWith('docs/framework/react/'),
        ).length,
        referenceMarkdown: markdownFiles.filter((filePath) =>
          filePath.startsWith('docs/reference/'),
        ).length,
        eslintMarkdown: markdownFiles.filter((filePath) =>
          filePath.startsWith('docs/eslint/'),
        ).length,
        generatedExampleRedirects: exampleEntries.length,
      },
    }

    await writeFile(
      path.join(UPSTREAM_ROOT, 'lock.json'),
      `${JSON.stringify(lock, null, 2)}\n`,
      'utf8',
    )

    await writeFile(
      path.join(DOCS_ROOT, 'sync-status.md'),
      buildSyncStatusPage(lock),
      'utf8',
    )
    const zhStatus = buildSyncStatusPage(lock)
      .replace('title: Sync Status', 'title: 同步状态')
      .replace('Upstream synchronization metadata for this docs site.', '本文档站的上游同步信息。')
      .replace('This site tracks TanStack Query React docs from the v5 release line.', '本站同步 TanStack Query React v5 文档；具体跟踪策略和提交见下方。')
      .replace('Upstream repo:', '上游仓库：')
      .replace('Tracking strategy:', '跟踪策略：')
      .replace('Current synced ref:', '当前同步引用：')
      .replace('Upstream commit:', '上游提交：')
      .replace('Synced at (UTC):', '同步时间（UTC）：')
      .replace('## Synced counts', '## 同步数量')
      .replace('Markdown files:', 'Markdown 文件：')
      .replace('React docs pages:', 'React 文档页面：')
      .replace('Core reference pages:', '核心 API 参考页面：')
      .replace('ESLint docs pages:', 'ESLint 文档页面：')
      .replace('Generated example redirect pages:', '自动生成的示例链接页面：')
    await writeFile(path.join(DOCS_ROOT, 'zh', 'sync-status.md'), zhStatus, 'utf8')

    console.log('Sync complete')
    console.log(` - Upstream ref: ${resolvedRef}`)
    console.log(` - Upstream commit: ${upstreamCommit}`)
    console.log(` - Synced markdown files: ${markdownFiles.length}`)
    console.log(` - Generated example redirects: ${exampleEntries.length}`)
  } finally {
    await rm(tmpRoot, { recursive: true, force: true })
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
