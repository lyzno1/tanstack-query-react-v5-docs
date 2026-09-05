import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { pageDescription } from '../../scripts/page-description.mjs';
import { isNonIndexable } from '../../scripts/site-settings.mjs';

export const onRequest = defineRouteMiddleware(async (context, next) => {
  const { entry, head } = context.locals.starlightRoute;
  const isZh = entry.id.startsWith('zh/');
  const description = pageDescription(entry.body, entry.data.title, isZh, entry.data.description);
  const hasSocialImage = head.some(({ tag, attrs }) => tag === 'meta' && attrs?.property === 'og:image');
  for (const item of head) {
    if (item.tag !== 'meta' || !item.attrs) continue;
    if (item.attrs.name === 'description' || item.attrs.property === 'og:description') item.attrs.content = description;
    if (item.attrs.property === 'og:locale') item.attrs.content = isZh ? 'zh_CN' : 'en_US';
    if (item.attrs.name === 'twitter:card' && !hasSocialImage) item.attrs.content = 'summary';
  }
  if (entry.id === '404' || isNonIndexable(context.site?.href ?? context.url.origin, import.meta.env.VERCEL_ENV)) {
    context.locals.starlightRoute.head = head.filter(({ tag, attrs }) => !(tag === 'meta' && attrs?.name === 'robots'));
    context.locals.starlightRoute.head.push({ tag: 'meta', attrs: { name: 'robots', content: 'noindex, follow' } });
  }
  await next();
});
