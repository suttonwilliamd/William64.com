import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const POSTS_DIR = path.join(process.cwd(), 'src/pages/posts');
const JSON_OUTPUT_PATH = path.join(process.cwd(), 'posts.json');

// Verify JWT token
function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Load all posts from MDX files
async function loadPosts() {
  try {
    const files = await fs.readdir(POSTS_DIR);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));
    
    const posts = [];
    
    for (const file of mdxFiles) {
      const filePath = path.join(POSTS_DIR, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      
      const slug = file.replace(/\.mdx$/, '');
      
      posts.push({
        id: slug,
        title: data.title || '',
        summary: data.summary || '',
        date: data.date || new Date().toISOString().split('T')[0],
        content: content || '',
        slug: slug
      });
    }
    
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error loading posts:', error);
    return [];
  }
}

// Generate posts.json
async function generatePostsJson(posts) {
  const postsData = posts.map(post => ({
    title: post.title,
    summary: post.summary,
    date: post.date,
    url: `/posts/${post.slug}.html`
  }));
  
  await fs.writeFile(JSON_OUTPUT_PATH, JSON.stringify(postsData, null, 2));
}

// GET /api/admin/posts
export async function GET({ request }) {
  const authHeader = request.headers.get('authorization');
  const user = verifyToken(authHeader);
  
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const posts = await loadPosts();
    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error loading posts:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST /api/admin/posts
export async function POST({ request }) {
  const authHeader = request.headers.get('authorization');
  const user = verifyToken(authHeader);
  
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const { title, summary, date, content } = await request.json();
    
    if (!title || !summary || !date || !content) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Check if file already exists
    const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
    try {
      await fs.access(filePath);
      return new Response(JSON.stringify({ error: 'Post with this title already exists' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      // File doesn't exist, continue
    }
    
    // Create MDX file
    const frontmatter = `---
layout: ../../layouts/PostLayout.astro
title: "${title}"
date: ${date}
summary: "${summary}"
---

${content}`;
    
    await fs.writeFile(filePath, frontmatter);
    
    // Regenerate posts.json
    const posts = await loadPosts();
    await generatePostsJson(posts);
    
    return new Response(JSON.stringify({ 
      id: slug,
      message: 'Post created successfully' 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}