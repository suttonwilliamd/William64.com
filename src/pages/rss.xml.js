import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  
  const posts = await fetch(new URL('/posts.json', context.site)).then(res => res.json());
  
  return rss({
    title: 'William64.com',
    description: 'Articles on software engineering, systems, and retro tech by William Sutton',
    site: context.site,
    items: posts.map(post => ({
      title: post.title,
      pubDate: new Date(post.date),
      description: post.summary,
      link: post.url,
    })),
  });
}
