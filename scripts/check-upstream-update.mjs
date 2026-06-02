#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { appendFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const LOCK_PATH = path.join(ROOT, 'upstream', 'lock.json')
const UPSTREAM_REPO = 'https://github.com/TanStack/query.git'
const writeGithubOutput = process.argv.includes('--github-output')

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8', stdio: 'pipe' })
  if (result.status !== 0) {
    throw new Error(result.stderr?.trim() || `Failed: ${command} ${args.join(' ')}`)
  }
  return result.stdout.trim()
}

function parseSemver(tag) {
  const [major, minor, patch] = tag.replace(/^v/, '').split('.').map(Number)
  return { major, minor, patch }
}

function compareDesc(a, b) {
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
    'refs/tags/v5.*',
  ])
  const tags = output
    .split('\n')
    .map((line) => line.split('\t')[1]?.replace('refs/tags/', ''))
    .filter((tag) => tag && /^v5\.\d+\.\d+$/.test(tag))
    .sort(compareDesc)

  if (!tags.length) {
    throw new Error('No v5 tags found from upstream')
  }

  return tags[0]
}

async function writeOutputs(outputs) {
  if (!writeGithubOutput) return

  const outputPath = process.env.GITHUB_OUTPUT
  if (!outputPath) {
    throw new Error('--github-output requires GITHUB_OUTPUT')
  }

  await appendFile(
    outputPath,
    `${Object.entries(outputs)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')}\n`,
  )
}

async function main() {
  const lock = JSON.parse(await readFile(LOCK_PATH, 'utf8'))
  const latest = latestV5Tag()
  const current = lock.ref ?? 'unknown'
  const hasUpdate = current !== latest

  await writeOutputs({
    current_ref: current,
    latest_ref: latest,
    has_update: String(hasUpdate),
  })

  if (!hasUpdate) {
    console.log(`No update. Current ref is already latest: ${latest}`)
    return
  }

  console.log(`Update available: current=${current}, latest=${latest}`)
  if (writeGithubOutput) return

  process.exit(1)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
