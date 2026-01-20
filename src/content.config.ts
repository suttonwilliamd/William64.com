import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    publishedDate: z.coerce.date(),
    summary: z.string(),
    category: z.enum([
      "Technical Tutorials",
      "Industry Insights",
      "Case Studies",
      "Retro Tech",
    ]),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
  }),
});

export const collections = { posts };
