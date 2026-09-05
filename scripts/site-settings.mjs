/** Resolve one canonical origin, never the branch-specific preview hostname. */
export function resolveSite(env = {}) {
  const configured = env.SITE_URL?.trim()
  const productionHost = env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  const value = configured || (productionHost ? `https://${productionHost}` : '')
  if (!value) {
    if (env.VERCEL_ENV === 'production') throw new Error('Set SITE_URL or expose VERCEL_PROJECT_PRODUCTION_URL before deploying.')
    return 'http://localhost:4321'
  }
  const url = new URL(value)
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/' || url.hostname === 'example.com') {
    throw new Error('SITE_URL must be a real HTTP(S) origin without a path, credentials, query or fragment.')
  }
  return url.origin
}

export function isNonIndexable(site, deployment = '') {
  return deployment === 'preview' || ['localhost', '127.0.0.1', '[::1]'].includes(new URL(site).hostname)
}
