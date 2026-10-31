import { getCollection } from "astro:content";

// Keep existing public category/tag URLs stable.
export const slugify = (value: string) =>
  value.toLowerCase().replace(/\s+/g, "-");
export async function getPosts() {
  return (await getCollection("posts")).sort(
    (a, b) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf(),
  );
}
