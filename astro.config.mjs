import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export default defineConfig({
  site: "https://william64.com",
  integrations: [
    react(),
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: { theme: "one-dark-pro" },
      rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
    }),
    sitemap({
      filter: (page) =>
        !/\/(admin|work-in-progress|404)(\/|\.html|$)/.test(
          new URL(page).pathname,
        ),
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  },
});
