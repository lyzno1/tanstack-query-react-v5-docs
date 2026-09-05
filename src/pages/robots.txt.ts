import type { APIRoute } from 'astro';
import { isNonIndexable } from '../../scripts/site-settings.mjs';

export const GET: APIRoute = ({ site }) => {
  const body = !site || isNonIndexable(site.href)
    ? 'User-agent: *\nDisallow: /\n'
    : import.meta.env.VERCEL_ENV === 'preview'
      ? 'User-agent: *\nAllow: /\n'
      : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
