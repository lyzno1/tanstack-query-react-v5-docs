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
const TRACK_PREFIX = 'v5.'

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

function parseSemver(tag) {
  const trimmed = tag.startsWith('v') ? tag.slice(1) : tag
  const [major, minor, patch] = trimmed.split('.').map((part) => Number(part))
  if ([major, minor, patch].some((part) => Number.isNaN(part))) {
    throw new Error(`Invalid semver tag: ${tag}`)
  }

  return { major, minor, patch }
}

function compareTagDesc(a, b) {
  const av = parseSemver(a)
  const bv = parseSemver(b)
  if (av.major !== bv.major) return bv.major - av.major
  if (av.minor !== bv.minor) return bv.minor - av.minor
  return bv.patch - av.patch
}

function latestV5Tag() {
  const output = run('git', [
    'ls-remote',
    '--tags',
    '--refs',
    UPSTREAM_REPO,
    `refs/tags/${TRACK_PREFIX}*`,
  ])

  const tags = output
    .split('\n')
    .map((line) => line.split('\t')[1]?.replace('refs/tags/', ''))
    .filter((tag) => tag && /^v5\.\d+\.\d+$/.test(tag))

  if (!tags.length) {
    throw new Error('Unable to resolve any v5 tags from upstream')
  }

  tags.sort(compareTagDesc)
  return tags[0]
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

function buildSyncStatusPage(lock) {
  return `---
title: Sync Status
description: Upstream synchronization metadata for this mirror.
---

This mirror tracks TanStack Query React docs from the v5 release line.

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
  const resolvedRef = requestedRef ?? latestV5Tag()
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
      track: 'latest-v5-tag',
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
