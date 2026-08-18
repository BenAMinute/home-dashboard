import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-config-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const configFile = path.resolve(import.meta.dirname, 'config.json');

          const ensureFile = () => {
            if (!fs.existsSync(configFile)) {
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
                services: []
              };
              fs.writeFileSync(configFile, JSON.stringify(initialData, null, 2), 'utf-8');
            }
          };

          if (req.url === '/api/config') {
            if (req.method === 'GET') {
              ensureFile();
              const content = fs.readFileSync(configFile, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              return res.end(content);
            } else if (req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => (body += chunk));
              req.on('end', () => {
                try {
                  const parsed = JSON.parse(body);
                  fs.writeFileSync(configFile, JSON.stringify(parsed, null, 2), 'utf-8');
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ success: true }));
                } catch (e) {
                  res.statusCode = 400;
                  return res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
              });
              return;
            }
          }
          next();
        });
      },
    },
  ],
});
