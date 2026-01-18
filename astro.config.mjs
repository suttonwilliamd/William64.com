import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
// Temporarily disable sitemap to fix build error
// import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export default defineConfig({
  site: "https://william64.com",
  integrations: [
    react(),
    tailwind(),
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: { theme: "one-dark-pro" },
      rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
    }),
    // sitemap(), // Temporarily disabled to fix build error
  ],
  markdown: {
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  },
});
