import React, { useState } from 'react';
import { X, Plus, Server, Globe, Hash, Tag, Sparkles } from 'lucide-react';
import type { ServiceItem, GlobalConfig, Protocol } from '../types/dashboard';

interface AddServiceModalProps {
  isOpen: boolean;
  config: GlobalConfig;
  onClose: () => void;
  onAddService: (newService: ServiceItem) => void;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  config,
  onClose,
  onAddService,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'media' | 'downloads' | 'utilities' | 'custom'>('custom');
  const [customIp, setCustomIp] = useState('');
  const [customPort, setCustomPort] = useState<number>(80);
  const [customPath, setCustomPath] = useState('/');
  const [customProtocol, setCustomProtocol] = useState<Protocol>('http');
  const [icon, setIcon] = useState('globe');
  const [brandColor, setBrandColor] = useState('#3b82f6');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = `custom-${Date.now()}`;
    const newService: ServiceItem = {
      id,
      name: name.trim(),
      category,
      description: description.trim() || 'Custom Homelab Container Service',
      icon,
      brandColor,
      bgGradient: `linear-gradient(135deg, ${brandColor}33 0%, ${brandColor}0d 100%)`,
      defaultPort: customPort,
      defaultPath: customPath.trim() || '/',
      defaultProtocol: customProtocol,
      customIp: customIp.trim() || undefined,
      customPort,
      customPath: customPath.trim() || '/',
      customProtocol,
      enabled: true,
      pinned: false,
      order: Date.now(),
    };

    onAddService(newService);
    onClose();

    // Reset form
    setName('');
    setDescription('');
    setCustomIp('');
    setCustomPort(80);
    setCustomPath('/');
  };

  const availableIcons = [
    { id: 'server', label: 'Server' },
    { id: 'tv', label: 'TV' },
    { id: 'music', label: 'Music' },
    { id: 'film', label: 'Film' },
    { id: 'download', label: 'Download' },
    { id: 'shield', label: 'Security / Shield' },
    { id: 'drive', label: 'Hard Drive' },
    { id: 'terminal', label: 'Terminal' },
    { id: 'cpu', label: 'CPU' },
    { id: 'git', label: 'Git' },
    { id: 'globe', label: 'Globe Web' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Sparkles className="text-accent" size={22} />
            <h2>Add Custom Service</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Service Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Home Assistant, Portainer, Nginx"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Smart home automation controller"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Container IP Override */}
          <div className="form-group">
            <label className="form-label">
              <Server size={16} />
              <span>Container Static IP (Optional)</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder={`Leave blank to use Global Host IP (${config.globalHostIp})`}
              value={customIp}
              onChange={(e) => setCustomIp(e.target.value)}
            />
          </div>

          {/* Port and Category */}
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">
                <Globe size={16} />
                <span>Protocol</span>
              </label>
              <select
                className="form-select"
                value={customProtocol}
                onChange={(e) => setCustomProtocol(e.target.value as Protocol)}
              >
                <option value="http">http://</option>
                <option value="https">https://</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Hash size={16} />
                <span>Port Number *</span>
              </label>
              <input
                type="number"
                className="form-input"
                value={customPort}
                onChange={(e) => setCustomPort(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Tag size={16} />
                <span>Category</span>
              </label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
              >
                <option value="media">Media</option>
                <option value="downloads">Downloads</option>
                <option value="utilities">Utilities</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          {/* Path */}
          <div className="form-group">
            <label className="form-label">URL Path</label>
            <input
              type="text"
              className="form-input"
              placeholder="/"
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value)}
            />
          </div>

          {/* Icon Selection */}
          <div className="form-group">
            <label className="form-label">Service Icon</label>
            <div className="icon-selector-grid">
              {availableIcons.map((ic) => (
                <button
                  key={ic.id}
                  type="button"
                  className={`icon-select-btn ${icon === ic.id ? 'selected' : ''}`}
                  onClick={() => setIcon(ic.id)}
                >
                  <span>{ic.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="form-group">
            <label className="form-label">Card Accent Color</label>
            <div className="color-picker-row">
              <input
                type="color"
                className="color-input"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
              />
              <span className="color-code">{brandColor}</span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Plus size={16} />
              <span>Add to Dashboard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
