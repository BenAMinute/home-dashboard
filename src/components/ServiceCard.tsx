import React, { useState } from 'react';
import { 
  ExternalLink, 
  Edit3, 
  Copy, 
  Check, 
  Star, 
  Trash2, 
  Globe
} from 'lucide-react';
import type { ServiceItem, GlobalConfig, StatusState } from '../types/dashboard';
import { ServiceIcon } from './ServiceIcons';
import { getServiceUrl, getServiceDisplayHost } from '../data/defaultServices';

interface ServiceCardProps {
  service: ServiceItem;
  config: GlobalConfig;
  statusInfo?: { status: StatusState; responseTime?: number };
  onEditService: (service: ServiceItem) => void;
  onTogglePin: (serviceId: string) => void;
  onDeleteService?: (serviceId: string) => void;
  onPingSingle: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  config,
  statusInfo = { status: 'unknown' },
  onEditService,
  onTogglePin,
  onDeleteService,
  onPingSingle,
}) => {
  const [copied, setCopied] = useState(false);
  const targetUrl = getServiceUrl(service, config);
  const displayHost = getServiceDisplayHost(service, config);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCustomIp = Boolean(service.customIp && service.customIp.trim() !== config.globalHostIp.trim());

  return (
    <div 
      className="service-card"
      style={{
        '--brand-color': service.brandColor,
        '--bg-gradient': service.bgGradient,
      } as React.CSSProperties}
    >
      {/* Glow highlight backdrop */}
      <div className="card-glow-bg"></div>

      <div className="card-header">
        <div className="card-icon-container" style={{ borderColor: service.brandColor }}>
          <ServiceIcon name={service.icon} size={32} color={service.brandColor} />
        </div>

        <div className="card-title-group">
          <div className="card-title-row">
            <h3 className="card-title">{service.name}</h3>
            {service.pinned && <Star size={14} className="pinned-star" fill="#f59e0b" color="#f59e0b" />}
          </div>
          <span className="card-category-badge">{service.category}</span>
        </div>

        <div className="card-top-actions">
          <button 
            className="icon-subtle-btn" 
            onClick={() => onTogglePin(service.id)}
            title={service.pinned ? "Unpin from top" : "Pin to top"}
          >
            <Star size={16} fill={service.pinned ? "#f59e0b" : "none"} color={service.pinned ? "#f59e0b" : "currentColor"} />
          </button>
          <button 
            className="icon-subtle-btn" 
            onClick={() => onEditService(service)}
            title="Edit IP & Port"
          >
            <Edit3 size={16} />
          </button>
          {onDeleteService && (
            <button 
              className="icon-subtle-btn delete-btn" 
              onClick={() => onDeleteService(service.id)}
              title="Delete service"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      <p className="card-description">{service.description}</p>

      <div className="card-meta-row">
        {/* Host IP & Port Badge */}
        <div className="card-ip-pill" title={isCustomIp ? "Static IP custom override" : "Uses Global Host IP"}>
          <Globe size={13} className="pill-icon" />
          <span className="ip-text">{displayHost}</span>
          {isCustomIp && <span className="custom-ip-tag">STATIC</span>}
          <button className="copy-icon-btn" onClick={handleCopy} title="Copy full URL">
            {copied ? <Check size={13} className="text-green" /> : <Copy size={13} />}
          </button>
        </div>

        {/* Live Status Badge */}
        <div 
          className={`status-badge status-${statusInfo.status}`}
          onClick={() => onPingSingle(service)}
          title="Click to re-ping service"
        >
          <span className="status-dot"></span>
          <span className="status-label">
            {statusInfo.status === 'online' && (
              <>Online {statusInfo.responseTime ? `(${statusInfo.responseTime}ms)` : ''}</>
            )}
            {statusInfo.status === 'offline' && 'Offline'}
            {statusInfo.status === 'checking' && 'Checking...'}
            {statusInfo.status === 'unknown' && 'Check Status'}
          </span>
        </div>
      </div>

      {/* Primary Action Button */}
      <a
        href={targetUrl}
        target={config.openInNewTab ? "_blank" : "_self"}
        rel="noopener noreferrer"
        className="card-launch-btn"
      >
        <span>Launch {service.name}</span>
        <ExternalLink size={16} className="launch-icon" />
      </a>
    </div>
  );
};
