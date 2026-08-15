import React, { useState, useEffect } from 'react';
import { X, Save, Globe, Server, Hash, Tag } from 'lucide-react';
import type { ServiceItem, GlobalConfig, Protocol } from '../types/dashboard';

interface EditServiceModalProps {
  isOpen: boolean;
  service: ServiceItem | null;
  config: GlobalConfig;
  onClose: () => void;
  onSaveService: (updatedService: ServiceItem) => void;
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({
  isOpen,
  service,
  config,
  onClose,
  onSaveService,
}) => {
  const [formData, setFormData] = useState<Partial<ServiceItem>>({});

  useEffect(() => {
    if (service) {
      setFormData({
        ...service,
        customIp: service.customIp || '',
        customPort: service.customPort !== undefined ? service.customPort : service.defaultPort,
        customPath: service.customPath || service.defaultPath || '/',
        customProtocol: service.customProtocol || service.defaultProtocol || 'http',
      });
    }
  }, [service]);

  if (!isOpen || !service) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveService({
      ...service,
      ...formData,
      name: formData.name || service.name,
      description: formData.description || service.description,
      customIp: formData.customIp?.trim() ? formData.customIp.trim() : undefined,
      customPort: formData.customPort !== undefined ? Number(formData.customPort) : service.defaultPort,
      customPath: formData.customPath?.trim() ? formData.customPath.trim() : undefined,
      customProtocol: formData.customProtocol as Protocol,
    } as ServiceItem);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Server className="text-accent" size={22} />
            <h2>Edit {service.name} Connection</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Service Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-input"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* IP Override */}
          <div className="form-group">
            <label className="form-label">
              <Server size={16} />
              <span>Container Static IP Override (Optional)</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder={`Leave blank to use Global Host IP (${config.globalHostIp})`}
              value={formData.customIp || ''}
              onChange={(e) => setFormData({ ...formData, customIp: e.target.value })}
            />
            <p className="form-help">
              If this container has its own dedicated static IP on your network, type it here. Otherwise, leave empty.
            </p>
          </div>

          {/* Port and Protocol */}
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">
                <Globe size={16} />
                <span>Protocol</span>
              </label>
              <select
                className="form-select"
                value={formData.customProtocol || 'http'}
                onChange={(e) => setFormData({ ...formData, customProtocol: e.target.value as Protocol })}
              >
                <option value="http">http://</option>
                <option value="https">https://</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Hash size={16} />
                <span>Port Number</span>
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.customPort !== undefined ? formData.customPort : service.defaultPort}
                onChange={(e) => setFormData({ ...formData, customPort: Number(e.target.value) })}
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
                value={formData.category || 'custom'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              >
                <option value="media">Media</option>
                <option value="downloads">Downloads</option>
                <option value="utilities">Utilities</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          {/* Subpath */}
          <div className="form-group">
            <label className="form-label">URL Path / Subfolder</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. /admin or /"
              value={formData.customPath || ''}
              onChange={(e) => setFormData({ ...formData, customPath: e.target.value })}
            />
          </div>

          {/* Brand Color */}
          <div className="form-group">
            <label className="form-label">Accent Brand Color</label>
            <div className="color-picker-row">
              <input
                type="color"
                className="color-input"
                value={formData.brandColor || service.brandColor}
                onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
              />
              <span className="color-code">{formData.brandColor || service.brandColor}</span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>Save Service</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
