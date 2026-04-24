import express from 'express';
import os from 'os';
import process from 'process';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 4321;
const DEPLOY_TOKEN = process.env.DEPLOY_TOKEN || '';
const PROJECT_DIR = path.resolve(__dirname);

app.use(express.json());

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

  res.json({
    uptime,
    uptime_seconds: Math.round(uptimeSeconds),
    memory: {
      total: (totalMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      used: (usedMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      free: (freeMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      percent: memPercent + '%',
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
    console.log('Pulling latest changes...');
    execSync('git fetch origin main', { cwd: PROJECT_DIR, stdio: 'inherit' });
    execSync('git reset --hard origin/main', { cwd: PROJECT_DIR, stdio: 'inherit' });
    
    console.log('Building...');
    execSync('npm run build', { cwd: PROJECT_DIR, stdio: 'inherit' });
    
    res.json({ success: true, message: 'Deployed successfully', sha });
  } catch (err) {
    console.error('Deploy failed:', err.message);
    res.status(500).json({ error: 'Deploy failed', details: err.message });
  }
});

app.use('/api', (req, res, next) => {
  if (req.path === '/server-stats' || req.path === '/deploy') return next();
  next('route');
});

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});