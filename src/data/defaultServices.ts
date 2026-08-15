import type { ServiceItem, GlobalConfig } from '../types/dashboard';

export const INITIAL_GLOBAL_CONFIG: GlobalConfig = {
  globalHostIp: '192.168.1.100',
  globalProtocol: 'http',
  pingInterval: 30,
  enablePing: true,
  theme: 'dark-glass',
  openInNewTab: true,
  searchEngine: 'google',
  customTitle: 'Homelab Control Center',
};

export const DEFAULT_SERVICES: ServiceItem[] = [
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
];

export function getServiceUrl(service: ServiceItem, config: GlobalConfig): string {
  const protocol = service.customProtocol || service.defaultProtocol || config.globalProtocol || 'http';
  const host = service.customIp?.trim() ? service.customIp.trim() : config.globalHostIp.trim();
  
  // Check if host already contains a port (e.g. user typed 192.168.1.50:8080 in IP field)
  const hasEmbeddedPort = host.includes(':') && !host.startsWith('[') && !host.includes('://');
  
  const port = service.customPort !== undefined && service.customPort !== null 
    ? service.customPort 
    : service.defaultPort;

  let path = service.customPath !== undefined && service.customPath !== null 
    ? service.customPath 
    : service.defaultPath;
    
  if (path && !path.startsWith('/')) {
    path = '/' + path;
  }

  // Format clean URL
  let fullAddress = host;
  if (!host.startsWith('http://') && !host.startsWith('https://')) {
    if (hasEmbeddedPort) {
      fullAddress = `${protocol}://${host}`;
    } else {
      // Don't add port if standard 80 (http) or 443 (https) and not explicitly custom
      const isStandardPort = (protocol === 'http' && port === 80) || (protocol === 'https' && port === 443);
      if (isStandardPort && service.customPort === undefined) {
        fullAddress = `${protocol}://${host}`;
      } else {
        fullAddress = `${protocol}://${host}:${port}`;
      }
    }
  }

  return `${fullAddress}${path}`;
}

export function getServiceDisplayHost(service: ServiceItem, config: GlobalConfig): string {
  const host = service.customIp?.trim() ? service.customIp.trim() : config.globalHostIp.trim();
  const port = service.customPort !== undefined && service.customPort !== null 
    ? service.customPort 
    : service.defaultPort;
  const path = service.customPath || service.defaultPath || '';
  
  if (host.includes(':')) {
    return `${host}${path}`;
  }
  return `${host}:${port}${path}`;
}
