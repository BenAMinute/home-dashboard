export type ServiceCategory = 'all' | 'media' | 'downloads' | 'utilities' | 'custom';

export type Protocol = 'http' | 'https';

export type SearchEngine = 'google' | 'duckduckgo' | 'bing' | 'dashboard-only';

export type ThemeMode = 'dark-glass' | 'cyberpunk' | 'midnight' | 'emerald';

export interface ServiceItem {
  id: string;
  name: string;
  category: 'media' | 'downloads' | 'utilities' | 'custom';
  description: string;
  icon: string; // Identifier for custom SVG or Lucide icon
  brandColor: string; // Base accent color hex
  bgGradient: string; // CSS gradient for header/card highlight
  defaultPort: number;
  defaultPath: string;
  defaultProtocol: Protocol;
  
  // Custom overrides (stored in localStorage)
  customIp?: string;
  customPort?: number;
  customPath?: string;
  customProtocol?: Protocol;
  
  enabled: boolean;
  pinned: boolean;
  order: number;
}

export interface GlobalConfig {
  globalHostIp: string;
  globalProtocol: Protocol;
  pingInterval: number; // in seconds
  enablePing: boolean;
  theme: ThemeMode;
  openInNewTab: boolean;
  searchEngine: SearchEngine;
  customTitle: string;
}

export type StatusState = 'online' | 'offline' | 'checking' | 'unknown';

export interface ServiceStatusMap {
  [serviceId: string]: {
    status: StatusState;
    responseTime?: number; // ms
    lastChecked?: number; // timestamp
  };
}
