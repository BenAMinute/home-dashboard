import React from 'react';
import { 
  Server, 
  Tv, 
  Music, 
  Film, 
  Download, 
  HardDrive, 
  ShieldCheck, 
  Layout, 
  Globe, 
  Cpu, 
  Terminal, 
  Video, 
  Activity,
  FolderGit2
} from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const ServiceIcon: React.FC<IconProps> = ({ name, className = '', size = 28, color }) => {
  const iconKey = name.toLowerCase().trim();

  switch (iconKey) {
    case 'pihole':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="url(#pihole-grad)" stroke={color || "#ef4444"} strokeWidth="1.5" />
          <circle cx="12" cy="11" r="3.5" fill="#ffffff" opacity="0.9" />
          <circle cx="12" cy="11" r="1.5" fill="#ef4444" />
          <defs>
            <linearGradient id="pihole-grad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="1" stopColor="#991b1b" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'jellyfin':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M12 3C8 3 4 7 4 12C4 16.5 7.5 20.5 12 21C16.5 20.5 20 16.5 20 12C20 7 16 3 12 3Z" fill="url(#jelly-grad)" />
          <path d="M12 7C9.5 7 7.5 9.5 7.5 12.5C7.5 15.5 9.5 18 12 18C14.5 18 16.5 15.5 16.5 12.5C16.5 9.5 14.5 7 12 7Z" fill="#1e1b4b" opacity="0.7" />
          <path d="M12 10.5C10.8 10.5 10 11.6 10 13C10 14.4 10.8 15.5 12 15.5C13.2 15.5 14 14.4 14 13C14 11.6 13.2 10.5 12 10.5Z" fill="#a855f7" />
          <defs>
            <linearGradient id="jelly-grad" x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#c084fc" />
              <stop offset="1" stopColor="#6b21a8" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'navidrome':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="12" r="9" fill="url(#navi-grad)" />
          <circle cx="12" cy="12" r="6" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
          <circle cx="12" cy="12" r="3" fill="#092e20" />
          <path d="M12 6V12L15 14" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id="navi-grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34d399" />
              <stop offset="1" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'sonarr':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="12" r="9" stroke="#06b6d4" strokeWidth="2" />
          <circle cx="12" cy="12" r="5" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 2" />
          <circle cx="12" cy="12" r="2" fill="#06b6d4" />
          <path d="M12 3V7M12 17V21M3 12H7M17 12H21" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'radarr':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="url(#radarr-grad)" />
          <circle cx="12" cy="12" r="4" fill="#78350f" opacity="0.8" />
          <path d="M12 4L14.5 9.5L20 10.5L16 14.5L17 20L12 17.5L7 20L8 14.5L4 10.5L9.5 9.5L12 4Z" fill="#fbbf24" opacity="0.9" />
          <defs>
            <linearGradient id="radarr-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f59e0b" />
              <stop offset="1" stopColor="#b45309" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'qbittorrent':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="3" y="3" width="18" height="18" rx="5" fill="url(#qbit-grad)" />
          <path d="M7.5 16.5C6.1 16.5 5 15.4 5 14C5 12.6 6.1 11.5 7.5 11.5C8.9 11.5 10 12.6 10 14V16.5H7.5Z" stroke="#ffffff" strokeWidth="1.8" />
          <path d="M16.5 7.5C17.9 7.5 19 8.6 19 10C19 11.4 17.9 12.5 16.5 12.5C15.1 12.5 14 11.4 14 10V7.5H16.5Z" stroke="#ffffff" strokeWidth="1.8" />
          <path d="M10 7.5V14M14 10V16.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
          <defs>
            <linearGradient id="qbit-grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3b82f6" />
              <stop offset="1" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'pinchflat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="3" y="5" width="18" height="14" rx="3" fill="url(#pinch-grad)" />
          <path d="M10 9L15 12L10 15V9Z" fill="#ffffff" />
          <path d="M5 2V5M19 2V5M5 19V22M19 19V22" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id="pinch-grad" x1="3" y1="5" x2="21" y2="19" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f97316" />
              <stop offset="1" stopColor="#c2410c" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'planka':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <rect x="3" y="3" width="18" height="18" rx="4" fill="url(#planka-grad)" />
          <rect x="6" y="6" width="3.5" height="12" rx="1.5" fill="#ffffff" opacity="0.9" />
          <rect x="11.25" y="6" width="3.5" height="8" rx="1.5" fill="#ffffff" opacity="0.75" />
          <rect x="16.5" y="6" width="3.5" height="10" rx="1.5" fill="#ffffff" opacity="0.6" />
          <defs>
            <linearGradient id="planka-grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="1" stopColor="#3730a3" />
            </linearGradient>
          </defs>
        </svg>
      );

    // Generic Icon Fallbacks
    case 'server':
      return <Server size={size} className={className} color={color} />;
    case 'tv':
      return <Tv size={size} className={className} color={color} />;
    case 'music':
      return <Music size={size} className={className} color={color} />;
    case 'film':
      return <Film size={size} className={className} color={color} />;
    case 'download':
      return <Download size={size} className={className} color={color} />;
    case 'shield':
      return <ShieldCheck size={size} className={className} color={color} />;
    case 'layout':
      return <Layout size={size} className={className} color={color} />;
    case 'video':
      return <Video size={size} className={className} color={color} />;
    case 'cpu':
      return <Cpu size={size} className={className} color={color} />;
    case 'terminal':
      return <Terminal size={size} className={className} color={color} />;
    case 'git':
      return <FolderGit2 size={size} className={className} color={color} />;
    case 'activity':
      return <Activity size={size} className={className} color={color} />;
    case 'drive':
      return <HardDrive size={size} className={className} color={color} />;
    case 'globe':
    default:
      return <Globe size={size} className={className} color={color} />;
  }
};
