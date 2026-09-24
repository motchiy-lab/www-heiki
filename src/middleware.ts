import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;
  if (pathname.endsWith('.html') && pathname !== '/google3ae1042631ef6d6e.html') {
    url.pathname = pathname.slice(0, -5);
    return context.rewrite(url);
  }
  return next();
});
