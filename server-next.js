import express from 'express';
import os from 'os';
import process from 'process';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 4322;
const DEPLOY_TOKEN = process.env.DEPLOY_TOKEN || '';
const CMS_PASSWORD = process.env.CMS_PASSWORD || 'changeme';
const PROJECT_DIR = path.resolve(__dirname);

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.get('/api/server-stats', (req, res) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor((uptimeSeconds % 86400) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const uptime = `${days}d ${hours}h ${minutes}m`;

  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memPercent = ((usedMem / totalMem) * 100).toFixed(1);

  const cpus = os.cpus();
  const cpuCores = cpus.length;

  const diskStat = fs.statfsSync('/');
  const diskTotal = diskStat.bsize * diskStat.blocks;
  const diskFree = diskStat.bsize * diskStat.bfree;
  const diskUsed = diskTotal - diskFree;
  const diskPercent = ((diskUsed / diskTotal) * 100).toFixed(1);

  res.json({
    uptime,
    uptime_seconds: Math.round(uptimeSeconds),
    memory: {
      total: (totalMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      used: (usedMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      free: (freeMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      percent: memPercent + '%',
    },
    disk: {
      total: (diskTotal / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      used: (diskUsed / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      free: (diskFree / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      percent: diskPercent + '%',
    },
    cpu: {
      cores: cpuCores,
    },
    load_average: os.loadavg().map(l => l.toFixed(2)),
    platform: os.platform(),
    arch: os.arch(),
    node_version: process.version,
  });
});

app.post('/api/deploy', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  
  if (token !== DEPLOY_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const { ref, sha, repo } = req.body;
  console.log(`Deploy triggered: ${repo} ${sha} (${ref})`);

  try {
    process.chdir(PROJECT_DIR);
    
    console.log('Fetching next branch...');
    execSync('git fetch origin next', { cwd: PROJECT_DIR, stdio: 'inherit' });
    execSync('git checkout next', { cwd: PROJECT_DIR, stdio: 'inherit' });
    execSync('git reset --hard origin/next', { cwd: PROJECT_DIR, stdio: 'inherit' });
    
    console.log('Building dist-next...');
    execSync('GITHUB_REF_NAME=next npm run build', { cwd: PROJECT_DIR, stdio: 'inherit' });
    
    res.json({ success: true, message: 'Deployed next branch successfully', sha });
  } catch (err) {
    console.error('Deploy failed:', err.message);
    res.status(500).json({ error: 'Deploy failed', details: err.message });
  }
});

// CMS Authentication
function checkAuth(req) {
  const cookie = req.headers.cookie || '';
  return cookie.includes('cms_auth=true');
}

app.post('/api/cms/auth', (req, res) => {
  const { password } = req.body;
  if (password === CMS_PASSWORD) {
    res.cookie('cms_auth', 'true', { httpOnly: true, maxAge: 86400000 });
    return res.json({ success: true });
  }
  res.status(401).json({ error: 'Invalid password' });
});

app.get('/api/cms/posts', (req, res) => {
  if (!checkAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const postsDir = path.join(PROJECT_DIR, 'src', 'content', 'posts');
  let posts = [];
  
  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
    posts = files.map(filename => {
      const content = fs.readFileSync(path.join(postsDir, filename), 'utf8');
      const titleMatch = content.match(/title:\s*["']?([^"'\n]+)["']?/);
      const dateMatch = content.match(/publishedDate:\s*["']?([^"'\n]+)["']?/);
      const categoryMatch = content.match(/category:\s*["']?([^"'\n]+)["']?/);
      const summaryMatch = content.match(/summary:\s*["']?([^"'\n]+)["']?/);
      
      return {
        slug: filename.replace(/\.mdx?$/, ''),
        title: titleMatch ? titleMatch[1] : filename,
        publishedDate: dateMatch ? dateMatch[1] : '',
        category: categoryMatch ? categoryMatch[1] : '',
        summary: summaryMatch ? summaryMatch[1] : ''
      };
    });
  }
  
  res.json(posts);
});

app.post('/api/cms/posts', (req, res) => {
  if (!checkAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const { title, summary, category, tags, content } = req.body;
  
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const date = new Date().toISOString().split('T')[0];
  
  const frontmatter = `---
title: "${title}"
publishedDate: ${date}
summary: "${summary}"
category: "${category}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
featured: false
---

${content}`;
  
  const postsDir = path.join(PROJECT_DIR, 'src', 'content', 'posts');
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }
  
  const filename = path.join(postsDir, `${slug}.md`);
  fs.writeFileSync(filename, frontmatter);
  
  // Commit the new post
  try {
    execSync('git add src/content/posts/', { cwd: PROJECT_DIR, stdio: 'ignore' });
    execSync(`git commit -m "Add blog post: ${title}"`, { cwd: PROJECT_DIR, stdio: 'ignore' });
  } catch (e) {
    console.log('Git commit skipped:', e.message);
  }
  
  res.json({ success: true, slug });
});

// Serve CMS page
app.get('/cms', (req, res) => {
  const stats = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: os.cpus().length,
  };
  
  const days = Math.floor(stats.uptime / 86400);
  const hours = Math.floor((stats.uptime % 86400) / 3600);
  const minutes = Math.floor((stats.uptime % 3600) / 60);
  const uptime = `${days}d ${hours}h ${minutes}m`;
  
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memPercent = ((usedMem / totalMem) * 100).toFixed(1);

  const statsHTML = `
<aside class="server-stats-sidebar" style="position:fixed;left:0;top:80px;bottom:0;width:220px;background:var(--color-surface);border-right:1px solid var(--color-border);padding:16px;overflow-y:auto;z-index:100;">
  <div class="server-stats-widget" style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:12px;font-family:monospace;font-size:11px;">
    <div style="color:var(--color-muted);margin-bottom:8px;font-size:10px;letter-spacing:1px">SERVER STATS</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      <div><div style="color:var(--color-muted);font-size:8px">UPTIME</div><div style="color:#22c55e;font-size:12px">${uptime}</div></div>
      <div><div style="color:var(--color-muted);font-size:8px">CPU</div><div style="font-size:12px">${stats.cpu} cores</div></div>
      <div><div style="color:var(--color-muted);font-size:8px">RAM</div><div style="font-size:12px">${memPercent}%</div></div>
      <div><div style="color:var(--color-muted);font-size:8px">DISK</div><div style="font-size:12px">34%</div></div>
    </div>
  </div>
</aside>`;

  const bodyStyle = `<style>body{padding-left:220px !important;}</style>`;
  const fontStyles = fs.readFileSync(path.join(__dirname, 'dist-next', 'styles.css'), 'utf8');
  
  const cmsHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin | William64.com</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <style>${fontStyles}</style>
  <style>
    .hero-title { font-size: var(--font-size-4xl); font-weight: var(--font-weight-bold); }
    .hero-subtitle { color: var(--color-text-secondary); font-size: var(--font-size-lg); margin-bottom: var(--space-8); }
    .card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-6); margin-bottom: var(--space-6); }
    .text-muted { color: var(--color-text-secondary); }
    .btn { display: inline-flex; align-items: center; justify-content: center; padding: var(--space-3) var(--space-5); border-radius: var(--radius-md); font-weight: var(--font-weight-medium); cursor: pointer; text-decoration: none; border: none; }
    .btn-primary { background: var(--color-primary); color: var(--color-background); }
    .btn-secondary { background: var(--color-surface); color: var(--color-text); border: 1px solid var(--color-border); }
    .container { max-width: 1200px; margin: 0 auto; padding: var(--space-8); }
  </style>
</head>
<body style="padding-left: 220px;">
${statsHTML}
  <a href="#main-content" class="skip-link">Skip to main content</a>
    
  <header class="header">
    <div class="header-inner">
      <nav class="nav">
        <a href="/" class="logo-link">
          <span class="logo-gradient">William64</span><span class="logo-dot">.com</span>
        </a>
        <div class="nav-links">
          <a href="/cms" class="nav-link active">
            <span class="nav-icon">📝</span>
            <span class="nav-text">CMS</span>
          </a>
        </div>
      </nav>
    </div>
  </header>

  <main id="main-content" style="max-width: 800px; padding: var(--space-8);">
    <h1 class="hero-title">Blog Content Manager</h1>
    <p class="hero-subtitle">Create and manage blog posts</p>

    <div id="login-section">
      <div class="card">
        <h2 class="card-title">Authentication Required</h2>
        <p class="text-muted">Enter your admin password to continue</p>
        <form id="login-form" style="margin-top: var(--space-4);">
          <div style="margin-bottom: var(--space-4);">
            <label for="password" style="display: block; margin-bottom: var(--space-2);">Password</label>
            <input type="password" id="password" name="password" required 
              style="width: 100%; padding: var(--space-3); background: var(--color-background); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text);" />
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <p id="login-error" style="color: #ef4444; margin-top: var(--space-3); display: none;">Invalid password</p>
      </div>
    </div>

    <div id="admin-section" style="display: none;">
      <div class="card">
        <h2 class="card-title">Create New Post</h2>
        <form id="post-form">
          <div style="margin-bottom: var(--space-4);">
            <label for="title" style="display: block; margin-bottom: var(--space-2);">Title</label>
            <input type="text" id="title" name="title" required 
              style="width: 100%; padding: var(--space-3); background: var(--color-background); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text);" />
          </div>

          <div style="margin-bottom: var(--space-4);">
            <label for="summary" style="display: block; margin-bottom: var(--space-2);">Summary</label>
            <input type="text" id="summary" name="summary" required 
              style="width: 100%; padding: var(--space-3); background: var(--color-background); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text);" />
          </div>

          <div style="margin-bottom: var(--space-4);">
            <label for="category" style="display: block; margin-bottom: var(--space-2);">Category</label>
            <select id="category" name="category" 
              style="width: 100%; padding: var(--space-3); background: var(--color-background); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text);">
              <option value="Technical Tutorials">Technical Tutorials</option>
              <option value="Industry Insights">Industry Insights</option>
              <option value="Case Studies">Case Studies</option>
              <option value="Retro Tech">Retro Tech</option>
            </select>
          </div>

          <div style="margin-bottom: var(--space-4);">
            <label for="tags" style="display: block; margin-bottom: var(--space-2);">Tags (comma separated)</label>
            <input type="text" id="tags" name="tags" placeholder="javascript, tutorial, webdev"
              style="width: 100%; padding: var(--space-3); background: var(--color-background); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text);" />
          </div>

          <div style="margin-bottom: var(--space-4);">
            <label for="content" style="display: block; margin-bottom: var(--space-2);">Content (Markdown)</label>
            <textarea id="content" name="content" rows="15" required 
              style="width: 100%; padding: var(--space-3); background: var(--color-background); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text); font-family: monospace;"></textarea>
          </div>

          <button type="submit" class="btn btn-primary">Create Post</button>
        </form>
        <p id="post-success" style="color: #22c55e; margin-top: var(--space-3); display: none;">Post created successfully!</p>
        <p id="post-error" style="color: #ef4444; margin-top: var(--space-3); display: none;">Error creating post</p>
      </div>

      <div class="card" style="margin-top: var(--space-6);">
        <h2 class="card-title">Recent Posts</h2>
        <div id="posts-list">
          <p class="text-muted">Loading posts...</p>
        </div>
      </div>

      <button id="logout-btn" class="btn btn-secondary" style="margin-top: var(--space-6);">Logout</button>
    </div>
  </main>

  <script>
    const SESSION_KEY = 'cms_auth';

    if (localStorage.getItem(SESSION_KEY)) {
      showAdmin();
      loadPosts();
    }

    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = document.getElementById('password').value;
      
      const res = await fetch('/api/cms/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        localStorage.setItem(SESSION_KEY, 'true');
        showAdmin();
        loadPosts();
      } else {
        document.getElementById('login-error').style.display = 'block';
      }
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem(SESSION_KEY);
      document.getElementById('login-section').style.display = 'block';
      document.getElementById('admin-section').style.display = 'none';
    });

    document.getElementById('post-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = {
        title: document.getElementById('title').value,
        summary: document.getElementById('summary').value,
        category: document.getElementById('category').value,
        tags: document.getElementById('tags').value.split(',').map(t => t.trim()).filter(t => t),
        content: document.getElementById('content').value
      };

      const res = await fetch('/api/cms/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        document.getElementById('post-success').style.display = 'block';
        document.getElementById('post-error').style.display = 'none';
        document.getElementById('post-form').reset();
        loadPosts();
      } else {
        document.getElementById('post-error').style.display = 'block';
        document.getElementById('post-success').style.display = 'none';
      }
    });

    function showAdmin() {
      document.getElementById('login-section').style.display = 'none';
      document.getElementById('admin-section').style.display = 'block';
    }

    async function loadPosts() {
      try {
        const res = await fetch('/api/cms/posts');
        if (!res.ok) return;
        const posts = await res.json();
        
        const container = document.getElementById('posts-list');
        if (!posts || posts.length === 0) {
          container.innerHTML = '<p class="text-muted">No posts yet</p>';
        } else {
          container.innerHTML = posts.map(post => '<div style="padding: var(--space-4); border-bottom: 1px solid var(--color-border);"><h3 style="margin: 0 0 var(--space-2) 0;">' + post.title + '</h3><p class="text-muted" style="margin: 0; font-size: var(--font-size-sm);">' + (post.publishedDate || '') + ' - ' + (post.category || '') + '</p></div>').join('');
        }
      } catch (err) {
        document.getElementById('posts-list').innerHTML = '<p class="text-muted">Error loading posts</p>';
      }
    }
  </script>
</body>
</html>`;

  res.send(bodyStyle + cmsHTML);
});

app.use((req, res, next) => {
  console.log('Route:', req.url);
  if (req.url.startsWith('/api/') || req.url.startsWith('/_astro') || req.url.includes('.')) {
    const filePath = path.join(__dirname, 'dist-next', req.url.split('?')[0]);
    return res.sendFile(filePath, (err) => {
      if (err) next();
    });
  }

  const stats = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: os.cpus().length,
  };
  
  const days = Math.floor(stats.uptime / 86400);
  const hours = Math.floor((stats.uptime % 86400) / 3600);
  const minutes = Math.floor((stats.uptime % 3600) / 60);
  const uptime = `${days}d ${hours}h ${minutes}m`;
  
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memPercent = ((usedMem / totalMem) * 100).toFixed(1);

  const statsHTML = `
<aside class="server-stats-sidebar" style="position:fixed;left:0;top:80px;bottom:0;width:220px;background:var(--color-surface);border-right:1px solid var(--color-border);padding:16px;overflow-y:auto;z-index:100;">
  <div class="server-stats-widget" style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:12px;font-family:monospace;font-size:11px;">
    <div style="color:var(--color-muted);margin-bottom:8px;font-size:10px;letter-spacing:1px">SERVER STATS</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      <div><div style="color:var(--color-muted);font-size:8px">UPTIME</div><div style="color:#22c55e;font-size:12px">${uptime}</div></div>
      <div><div style="color:var(--color-muted);font-size:8px">CPU</div><div style="font-size:12px">${stats.cpu} cores</div></div>
      <div><div style="color:var(--color-muted);font-size:8px">RAM</div><div style="font-size:12px">${memPercent}%</div></div>
      <div><div style="color:var(--color-muted);font-size:8px">DISK</div><div style="font-size:12px">34%</div></div>
    </div>
  </div>
</aside>`;

  const bodyStyle = `<style>body{padding-left:220px !important;}</style>`;
  
  const filePath = req.url === '/' ? 'index.html' : req.url.replace(/^\//, '') + '/index.html';
  const fullPath = path.join(__dirname, 'dist-next', filePath);
  console.log('Reading:', fullPath);
  
  fs.readFile(fullPath, 'utf8', (err, content) => {
    if (err) {
      console.log('Error reading file:', err.message);
      return res.sendFile(path.join(__dirname, 'dist-next', 'index.html'));
    }
    console.log('File read, content length:', content.length);
    let modified = content.replace(/(<body[^>]*>)/, '$1' + statsHTML + bodyStyle);
    console.log('Modified length:', modified.length);
    res.send(modified);
  });
});

app.listen(PORT, () => {
  console.log(`WIP Server running on http://localhost:${PORT}`);
});