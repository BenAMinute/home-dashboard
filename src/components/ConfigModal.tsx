import React, { useState } from 'react';
import { X, Server, Globe, Search, Save, RotateCcw, Sliders } from 'lucide-react';
import type { GlobalConfig, Protocol, SearchEngine } from '../types/dashboard';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GlobalConfig;
  onSaveConfig: (newConfig: GlobalConfig) => void;
  onResetDefaults: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetDefaults,
}) => {
  const [formData, setFormData] = useState<GlobalConfig>({ ...config });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    onClose();
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all IP settings and services to factory defaults?")) {
      onResetDefaults();
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Sliders className="text-accent" size={22} />
            <h2>Dashboard & IP Settings</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Global Host IP */}
          <div className="form-group">
            <label className="form-label">
              <Server size={16} />
              <span>Global Server Host / IP Address</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 192.168.1.100 or homelab.local"
              value={formData.globalHostIp}
              onChange={(e) => setFormData({ ...formData, globalHostIp: e.target.value })}
              required
            />
            <p className="form-help">
              This IP address will be used by default for all services unless a static IP override is specified for a specific container.
            </p>
          </div>

          {/* Global Protocol */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">
                <Globe size={16} />
                <span>Default Protocol</span>
              </label>
              <select
                className="form-select"
                value={formData.globalProtocol}
                onChange={(e) => setFormData({ ...formData, globalProtocol: e.target.value as Protocol })}
              >
                <option value="http">HTTP (http://)</option>
                <option value="https">HTTPS (https://)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Search size={16} />
                <span>Header Search Engine</span>
              </label>
              <select
                className="form-select"
                value={formData.searchEngine}
                onChange={(e) => setFormData({ ...formData, searchEngine: e.target.value as SearchEngine })}
              >
                <option value="google">Google</option>
                <option value="duckduckgo">DuckDuckGo</option>
                <option value="bing">Bing</option>
                <option value="dashboard-only">Dashboard Filter Only</option>
              </select>
            </div>
          </div>

          {/* Custom Dashboard Title */}
          <div className="form-group">
            <label className="form-label">Dashboard Header Title</label>
            <input
              type="text"
              className="form-input"
              value={formData.customTitle}
              onChange={(e) => setFormData({ ...formData, customTitle: e.target.value })}
            />
          </div>

          {/* Ping Settings */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Automatic Status Ping</label>
              <select
                className="form-select"
                value={formData.enablePing ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, enablePing: e.target.value === 'true' })}
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ping Check Interval</label>
              <select
                className="form-select"
                value={formData.pingInterval}
                onChange={(e) => setFormData({ ...formData, pingInterval: Number(e.target.value) })}
                disabled={!formData.enablePing}
              >
                <option value={15}>Every 15 Seconds</option>
                <option value={30}>Every 30 Seconds</option>
                <option value={60}>Every 1 Minute</option>
                <option value={300}>Every 5 Minutes</option>
              </select>
            </div>
          </div>

          {/* Open Link Option */}
          <div className="form-checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.openInNewTab}
                onChange={(e) => setFormData({ ...formData, openInNewTab: e.target.checked })}
              />
              <span>Open services in a new browser tab (`target="_blank"`)</span>
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-danger-outline" onClick={handleReset}>
              <RotateCcw size={16} />
              <span>Reset Defaults</span>
            </button>
            <div className="footer-right">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Save size={16} />
                <span>Save Settings</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
