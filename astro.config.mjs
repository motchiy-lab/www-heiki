import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // 1. 本番のドメインを必ず設定する（未設定だと正しいURLにならない）
  site: 'https://heiki.motchiy.com',

  // 2. 出力モード（'server' / 'hybrid' / 'static' のいずれでも動作します）
  output: 'static',

  // 3. インテグレーションに sitemap を追加
  integrations: [sitemap()],

  // 4. Cloudflare用アダプター
  adapter: cloudflare()
});
