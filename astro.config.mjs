import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const isNextBranch = process.env.GITHUB_REF_NAME === 'next';

export default defineConfig({
  site: "https://william64.com",
  outDir: isNextBranch ? './dist-next' : './dist',
  integrations: [
    react(),
    tailwind(),
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: { theme: "one-dark-pro" },
      rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
    }),
    sitemap(),
  ],
  markdown: {
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  },
});
