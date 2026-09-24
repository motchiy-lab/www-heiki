import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // .html を拡張子なしにリライト
  if (pathname.endsWith('.html') && pathname !== '/google3ae1042631ef6d6e.html') {
    url.pathname = pathname.slice(0, -5);
    return context.rewrite(url);
  }

  // 通常どおりAstroでページを生成
  const response = await next();

  // /teapot だけHTTPステータスを418に変更
  if (pathname === '/teapot') {
    return new Response(response.body, {
      status: 418,
      statusText: "I'm a teapot",
      headers: response.headers,
    });
  }

  return response;
});
