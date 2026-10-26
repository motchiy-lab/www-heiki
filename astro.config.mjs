import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://www.motchiy.com',
  output: 'static',
  adapter: cloudflare(),
});
