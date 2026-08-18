import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 80;
const CONFIG_FILE = process.env.CONFIG_FILE || path.join(__dirname, 'config.json');
const DIST_DIR = path.join(__dirname, 'dist');

function ensureConfigFile() {
  if (!fs.existsSync(CONFIG_FILE)) {
    console.log(`Creating initial config file at: ${CONFIG_FILE}`);
    const initialData = {
      config: {
        globalHostIp: '192.168.1.100',
        globalProtocol: 'http',
        pingInterval: 30,
        enablePing: true,
        theme: 'dark-glass',
        openInNewTab: true,
        searchEngine: 'google',
        customTitle: 'Homelab Control Center',
      },
      services: [
        {
          id: 'pihole',
          name: 'Pi-hole',
          category: 'utilities',
          description: 'Network-wide DNS ad blocking & privacy protection',
          icon: 'pihole',
          brandColor: '#ef4444',
          bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(185, 28, 28, 0.05) 100%)',
          defaultPort: 80,
          defaultPath: '/admin',
          defaultProtocol: 'http',
          enabled: true,
          pinned: true,
          order: 1,
        },
        {
          id: 'jellyfin',
          name: 'Jellyfin',
          category: 'media',
          description: 'Free software media system for movies, shows & live TV',
          icon: 'jellyfin',
          brandColor: '#a855f7',
          bgGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(126, 34, 206, 0.05) 100%)',
          defaultPort: 8096,
          defaultPath: '/',
          defaultProtocol: 'http',
          enabled: true,
          pinned: true,
          order: 2,
        },
        {
          id: 'navidrome',
          name: 'Navidrome',
          category: 'media',
          description: 'Modern, lightweight self-hosted music server & player',
          icon: 'navidrome',
          brandColor: '#10b981',
          bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(4, 120, 87, 0.05) 100%)',
          defaultPort: 4533,
          defaultPath: '/',
          defaultProtocol: 'http',
          enabled: true,
          pinned: true,
          order: 3,
        },
        {
          id: 'sonarr',
          name: 'Sonarr',
          category: 'downloads',
          description: 'Smart PVR & automated downloader for TV series',
          icon: 'sonarr',
          brandColor: '#06b6d4',
          bgGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(14, 116, 144, 0.05) 100%)',
          defaultPort: 8989,
          defaultPath: '/',
          defaultProtocol: 'http',
          enabled: true,
          pinned: true,
          order: 4,
        },
        {
          id: 'radarr',
          name: 'Radarr',
          category: 'downloads',
          description: 'Movie collection manager & automated torrent/NZB fetcher',
          icon: 'radarr',
          brandColor: '#f59e0b',
          bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(180, 83, 9, 0.05) 100%)',
          defaultPort: 7878,
          defaultPath: '/',
          defaultProtocol: 'http',
          enabled: true,
          pinned: true,
          order: 5,
        },
        {
          id: 'qbittorrent',
          name: 'qBittorrent',
          category: 'downloads',
          description: 'Fast, lightweight BitTorrent web client manager',
          icon: 'qbittorrent',
          brandColor: '#2563eb',
          bgGradient: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(29, 78, 216, 0.05) 100%)',
          defaultPort: 8080,
          defaultPath: '/',
          defaultProtocol: 'http',
          enabled: true,
          pinned: true,
          order: 6,
        },
        {
          id: 'pinchflat',
          name: 'Pinchflat',
          category: 'downloads',
          description: 'YouTube media indexing & automatic downloader',
          icon: 'pinchflat',
          brandColor: '#f97316',
          bgGradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(194, 65, 12, 0.05) 100%)',
          defaultPort: 8945,
          defaultPath: '/',
          defaultProtocol: 'http',
          enabled: true,
          pinned: false,
          order: 7,
        },
        {
          id: 'planka',
          name: 'Planka',
          category: 'utilities',
          description: 'Elegant open-source Kanban project management board',
          icon: 'planka',
          brandColor: '#6366f1',
          bgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(67, 56, 202, 0.05) 100%)',
          defaultPort: 3000,
          defaultPath: '/',
          defaultProtocol: 'http',
          enabled: true,
          pinned: false,
          order: 8,
        },
      ]
    };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

ensureConfigFile();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // API: GET /api/config
  if (req.url === '/api/config' && req.method === 'GET') {
    try {
      ensureConfigFile();
      const data = fs.readFileSync(CONFIG_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(data);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Failed to read config file' }));
    }
  }

  // API: POST /api/config
  if (req.url === '/api/config' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(parsed, null, 2), 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      }
    });
    return;
  }

  // Serve static dist folder
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  
  let filePath = path.join(DIST_DIR, reqPath);
  
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        return res.end('Server Error');
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Config file path: ${CONFIG_FILE}`);
});
