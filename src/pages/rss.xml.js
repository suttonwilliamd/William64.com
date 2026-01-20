import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("posts");

  return rss({
    title: "William64.com",
    description:
      "Articles on software engineering, systems, and retro tech by William Sutton",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.publishedDate),
      description: post.data.summary,
      link: `/blog/posts/${post.id}`,
    })),
  });
}
