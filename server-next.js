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

app.use(express.static(path.join(__dirname, 'dist-next')));

app.use('/', (req, res, next) => {
  const stats = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: require('os').cpus().length,
  };
  
  const days = Math.floor(stats.uptime / 86400);
  const hours = Math.floor((stats.uptime % 86400) / 3600);
  const minutes = Math.floor((stats.uptime % 3600) / 60);
  const uptime = `${days}d ${hours}h ${minutes}m`;
  
  const totalMem = require('os').totalmem();
  const freeMem = require('os').freemem();
  const usedMem = totalMem - freeMem;
  const memPercent = ((usedMem / totalMem) * 100).toFixed(1);
  
  const statsHTML = `<div class="server-stats-widget" style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:12px;font-family:monospace;font-size:11px">
<div style="color:var(--color-muted);margin-bottom:8px;font-size:10px;letter-spacing:1px">SERVER</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
<div><div style="color:var(--color-muted);font-size:8px">UP</div><div style="color:#22c55e;font-size:11px">${uptime}</div></div>
<div><div style="color:var(--color-muted);font-size:8px">CPU</div><div style="font-size:11px">${stats.cpu}</div></div>
<div><div style="color:var(--color-muted);font-size:8px">RAM</div><div style="font-size:11px">${memPercent}%</div></div>
<div><div style="color:var(--color-muted);font-size:8px">DISK</div><div style="font-size:11px">34%</div></div>
</div></div>`;
  
  const filePath = req.url === '/' ? 'index.html' : req.url.replace(/^\//, '') + '/index.html';
  const fullPath = path.join(__dirname, 'dist-next', filePath);
  
  fs.readFile(fullPath, 'utf8', (err, content) => {
    if (err) {
      return res.sendFile(path.join(__dirname, 'dist-next', 'index.html'));
    }
    const modified = content.replace(/<aside class="server-stats-sidebar">[\s\S]*?<\/aside>/, '<aside class="server-stats-sidebar">' + statsHTML + '</aside>');
    res.send(modified);
  });
});

app.listen(PORT, () => {
  console.log(`WIP Server running on http://localhost:${PORT}`);
});