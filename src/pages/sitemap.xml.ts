import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site ? site.href.replace(/\/$/, '') : 'https://www.motchiy.com';

  // Astroのグロブ機能を使って、src/pages以下のファイルと最終更新日を安全に取得
  // { eager: true, import: 'meta' } によりファイルのメタ情報が取得できます
  const pages = import.meta.glob('./**/*.{astro,md,mdx,html}', { eager: true });

  const urls: string[] = [];

  for (const path in pages) {
    // 隠しファイルや自分自身（sitemap.xml.ts）を除外
    if (path.includes('_') || path.includes('sitemap.xml')) continue;

    // パスをURLのルート相対パスに変換
    let route = path
      .replace('./', '/')
      .replace(/\.(astro|md|mdx|html)$/, '')
      .replace(/\/index$/, '');

    // 404などのエラーページを除外したい場合はここでチェック
    if (route === '/404' || route === '/500') continue;

    const targetUrl = `${siteUrl}${route === '' ? '/' : route + '/'}`;

    // import.meta.glob から取得できるファイルの最終更新日時（Vite依存によりモジュール側から直接取得が難しいため、現在日時またはビルド時日時をフォールバックとして設定）
    // ※厳密なファイルごとのmtimeが不要で共通の日時で問題ない場合はこれでビルドエラーが解消されます
    const lastmod = new Date().toISOString();

    urls.push(`  <url>
    <loc>${targetUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>1.0</priority>
  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.join('\n')}
</urlset>`.trim();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
