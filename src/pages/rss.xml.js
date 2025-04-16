import rss from '@astrojs/rss';
import postsData from '../../posts.json'; // Import the JSON file directly

export async function GET(context) {
  return rss({
    title: 'William64.com',
    description: 'Articles on software engineering, systems, and retro tech by William Sutton',
    site: context.site,
    items: postsData.map(post => ({
      title: post.title,
      pubDate: new Date(post.date),
      description: post.summary,
      link: post.url,
    })),
  });
}
