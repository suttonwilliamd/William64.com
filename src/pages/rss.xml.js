import rss from "@astrojs/rss";
import postsData from "../../posts.json";

export async function GET(context) {
  return rss({
    title: "William64.com",
    description:
      "Articles on software engineering, systems, and retro tech by William Sutton",
    site: context.site,
    items: postsData.map((post) => {
      const slug = post.url.replace("/blog/posts/", "").replace(".html", "");
      return {
        title: post.title,
        pubDate: new Date(post.date),
        description: post.summary,
        link: `/blog/posts/${slug}`,
      };
    }),
  });
}
