#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { appendFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const LOCK_PATH = path.join(ROOT, 'upstream', 'lock.json')
const UPSTREAM_REPO = 'https://github.com/TanStack/query.git'
const UPSTREAM_REF = 'main'
const writeGithubOutput = process.argv.includes('--github-output')

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8', stdio: 'pipe' })
  if (result.status !== 0) {
    throw new Error(result.stderr?.trim() || `Failed: ${command} ${args.join(' ')}`)
  }
  return result.stdout.trim()
}

function latestUpstreamCommit() {
  const output = run('git', [
    'ls-remote',
    '--heads',
    UPSTREAM_REPO,
    `refs/heads/${UPSTREAM_REF}`,
  ])
  const commit = output.split('\t')[0]

  if (!/^[0-9a-f]{40}$/.test(commit)) {
    throw new Error(`Unable to resolve upstream ${UPSTREAM_REF} commit`)
  }

  return commit
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
  const latestCommit = latestUpstreamCommit()
  const currentCommit = lock.commit ?? 'unknown'
  const hasUpdate = currentCommit !== latestCommit

  await writeOutputs({
    current_ref: lock.ref ?? 'unknown',
    latest_ref: UPSTREAM_REF,
    current_commit: currentCommit,
    latest_commit: latestCommit,
    has_update: String(hasUpdate),
  })

  if (!hasUpdate) {
    console.log(
      `No update. Current commit is already upstream ${UPSTREAM_REF}: ${latestCommit}`,
    )
    return
  }

  console.log(
    `Update available: current=${currentCommit}, latest=${latestCommit} (${UPSTREAM_REF})`,
  )
  if (writeGithubOutput) return

  process.exit(1)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
