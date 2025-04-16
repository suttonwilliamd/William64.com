import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://william64.com',
  integrations: [
    react(),
    tailwind(),
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: { theme: 'one-dark-pro' }
    }),
    sitemap()
  ],
  markdown: {
    rehypePlugins: ['rehype-slug', 'rehype-autolink-headings']
  }
});
