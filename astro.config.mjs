import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: "https://heiki.motchiy.com",
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true, // ローカル開発時に wrangler のバインディングを有効にする
    }
  })
});
