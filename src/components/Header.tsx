import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Settings, 
  Plus, 
  Download, 
  Upload, 
  Server, 
  Activity
} from 'lucide-react';
import type { GlobalConfig } from '../types/dashboard';

interface HeaderProps {
  config: GlobalConfig;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSettings: () => void;
  onOpenAddService: () => void;
  onExportConfig: () => void;
  onImportConfig: (file: File) => void;
  onRefreshAllPings: () => void;
  totalServices: number;
  onlineCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  searchQuery,
  onSearchChange,
  onOpenSettings,
  onOpenAddService,
  onExportConfig,
  onImportConfig,
  onRefreshAllPings,
  totalServices,
  onlineCount,
}) => {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      if (config.searchEngine === 'google') {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
      } else if (config.searchEngine === 'duckduckgo') {
        window.open(`https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`, '_blank');
      } else if (config.searchEngine === 'bing') {
        window.open(`https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
      }
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportConfig(e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <header className="header-container">
      <div className="header-top">
        {/* Brand & Live Clock */}
        <div className="brand-section">
          <div className="brand-icon-wrapper">
            <Server className="brand-logo-icon" />
          </div>
          <div>
            <h1 className="brand-title">
              {config.customTitle || 'Homelab Dashboard'}
              <span className="brand-badge">PRO</span>
            </h1>
            <div className="brand-subtext">
              <span className="live-clock">{date} • {time}</span>
              <span className="divider">•</span>
              <span className="server-ip-pill" onClick={onOpenSettings} title="Click to change server IP">
                <span className="pulse-dot"></span>
                IP: {config.globalHostIp}
              </span>
            </div>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="header-actions">
          {/* Status summary pill */}
          <div className="status-summary-pill" onClick={onRefreshAllPings} title="Click to refresh service status">
            <Activity className="status-pulse-icon" size={16} />
            <span>
              <strong className="online-text">{onlineCount}</strong> / {totalServices} Online
            </span>
          </div>

          <button className="btn btn-secondary btn-icon-text" onClick={onOpenAddService}>
            <Plus size={18} />
            <span>Add Service</span>
          </button>

          <button className="btn btn-secondary btn-icon" onClick={onOpenSettings} title="Settings & IP Configuration">
            <Settings size={18} />
          </button>

          <button className="btn btn-secondary btn-icon" onClick={onExportConfig} title="Export Configuration JSON">
            <Download size={18} />
          </button>

          <label className="btn btn-secondary btn-icon" title="Import Configuration JSON" style={{ cursor: 'pointer', margin: 0 }}>
            <Upload size={18} />
            <input type="file" accept=".json" onChange={handleFileImport} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* Header Bottom: Search Bar & Quick Filters */}
      <div className="header-search-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={
              config.searchEngine !== 'dashboard-only'
                ? `Filter homelab services or press Enter to search ${config.searchEngine}...`
                : 'Search services by name, IP, port or category...'
            }
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => onSearchChange('')}>
              ×
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
