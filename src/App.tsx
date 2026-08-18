import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { 
  ServiceItem, 
  GlobalConfig, 
  ServiceCategory, 
  ServiceStatusMap 
} from './types/dashboard';
import { 
  DEFAULT_SERVICES, 
  INITIAL_GLOBAL_CONFIG, 
  getServiceUrl 
} from './data/defaultServices';
import { checkServicePing } from './utils/statusChecker';

import { Header } from './components/Header';
import { CategoryGroup } from './components/CategoryGroup';
import { ServiceCard } from './components/ServiceCard';
import { ConfigModal } from './components/ConfigModal';
import { EditServiceModal } from './components/EditServiceModal';
import { AddServiceModal } from './components/AddServiceModal';

import { AlertCircle } from 'lucide-react';

const STORAGE_KEY_CONFIG = 'homelab_dashboard_config_v1';
const STORAGE_KEY_SERVICES = 'homelab_dashboard_services_v1';

export const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load initial global config
  const [config, setConfig] = useState<GlobalConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      return saved ? JSON.parse(saved) : INITIAL_GLOBAL_CONFIG;
    } catch (e) {
      return INITIAL_GLOBAL_CONFIG;
    }
  });

  // Load initial services list
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SERVICES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return DEFAULT_SERVICES;
    } catch (e) {
      return DEFAULT_SERVICES;
    }
  });

  // Fetch config.json from server on mount so all devices (phones, laptops) stay in sync
  useEffect(() => {
    fetch('/api/config')
      .then((res) => {
        if (!res.ok) throw new Error('Config API response not OK');
        return res.json();
      })
      .then((data) => {
        if (data && data.config) {
          setConfig(data.config);
        }
        if (data && Array.isArray(data.services) && data.services.length > 0) {
          setServices(data.services);
        }
      })
      .catch((err) => {
        console.warn('Using local fallback state, server config fetch failed:', err);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [showPinnedOnly, setShowPinnedOnly] = useState<boolean>(false);

  // Status map
  const [statusMap, setStatusMap] = useState<ServiceStatusMap>({});

  // Modal controls
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Save config & services to server & localStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(services));

    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config, services }),
    }).catch((err) => console.error('Failed to sync configuration to server:', err));
  }, [config, services, isLoaded]);

  // Ping check implementation
  const pingSingleService = useCallback(async (service: ServiceItem) => {
    setStatusMap((prev) => ({
      ...prev,
      [service.id]: { status: 'checking', responseTime: prev[service.id]?.responseTime },
    }));

    const targetUrl = getServiceUrl(service, config);
    const result = await checkServicePing(targetUrl);

    setStatusMap((prev) => ({
      ...prev,
      [service.id]: {
        status: result.status,
        responseTime: result.responseTime,
        lastChecked: Date.now(),
      },
    }));
  }, [config]);

  const pingAllServices = useCallback(async () => {
    services.forEach((service) => {
      if (service.enabled) {
        pingSingleService(service);
      }
    });
  }, [services, pingSingleService]);

  // Initial and periodic ping timer
  useEffect(() => {
    if (!config.enablePing) return;

    pingAllServices();
    const intervalMs = (config.pingInterval || 30) * 1000;
    const interval = setInterval(pingAllServices, intervalMs);

    return () => clearInterval(interval);
  }, [config.enablePing, config.pingInterval, pingAllServices]);

  // Category & search filtering
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      if (!service.enabled) return false;

      // Filter by pinned
      if (showPinnedOnly && !service.pinned) return false;

      // Filter by category
      if (!showPinnedOnly && selectedCategory !== 'all' && service.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const displayHost = (service.customIp || config.globalHostIp) + ':' + (service.customPort || service.defaultPort);
        const matchName = service.name.toLowerCase().includes(q);
        const matchDesc = service.description.toLowerCase().includes(q);
        const matchCategory = service.category.toLowerCase().includes(q);
        const matchHost = displayHost.toLowerCase().includes(q);

        return matchName || matchDesc || matchCategory || matchHost;
      }

      return true;
    }).sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return a.order - b.order;
    });
  }, [services, selectedCategory, searchQuery, showPinnedOnly, config.globalHostIp]);

  // Counts
  const categoryCounts = useMemo(() => {
    const counts: Record<ServiceCategory | 'pinned', number> = {
      all: services.filter((s) => s.enabled).length,
      media: services.filter((s) => s.enabled && s.category === 'media').length,
      downloads: services.filter((s) => s.enabled && s.category === 'downloads').length,
      utilities: services.filter((s) => s.enabled && s.category === 'utilities').length,
      custom: services.filter((s) => s.enabled && s.category === 'custom').length,
      pinned: services.filter((s) => s.enabled && s.pinned).length,
    };
    return counts;
  }, [services]);

  const onlineCount = useMemo(() => {
    return Object.values(statusMap).filter((st) => st.status === 'online').length;
  }, [statusMap]);

  // Service mutation handlers
  const handleTogglePin = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, pinned: !s.pinned } : s))
    );
  };

  const handleSaveEditedService = (updated: ServiceItem) => {
    setServices((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
    // Re-ping updated service
    pingSingleService(updated);
  };

  const handleAddService = (newService: ServiceItem) => {
    setServices((prev) => [...prev, newService]);
    pingSingleService(newService);
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm("Are you sure you want to remove this service from your dashboard?")) {
      setServices((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleResetDefaults = () => {
    setConfig(INITIAL_GLOBAL_CONFIG);
    setServices(DEFAULT_SERVICES);
    localStorage.removeItem(STORAGE_KEY_CONFIG);
    localStorage.removeItem(STORAGE_KEY_SERVICES);
  };

  // Export / Import Config
  const handleExportConfig = () => {
    const exportData = {
      version: 1,
      timestamp: new Date().toISOString(),
      config,
      services,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `homelab-dashboard-config-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportConfig = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.config && Array.isArray(parsed.services)) {
          setConfig(parsed.config);
          setServices(parsed.services);
          alert("Homelab configuration successfully imported!");
        } else {
          alert("Invalid configuration file format.");
        }
      } catch (err) {
        alert("Failed to parse configuration JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="app-container">
      {/* Top Header Controls */}
      <Header
        config={config}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSettings={() => setIsConfigOpen(true)}
        onOpenAddService={() => setIsAddServiceOpen(true)}
        onExportConfig={handleExportConfig}
        onImportConfig={handleImportConfig}
        onRefreshAllPings={pingAllServices}
        totalServices={categoryCounts.all}
        onlineCount={onlineCount}
      />

      {/* Category Tabs */}
      <CategoryGroup
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
        showPinnedOnly={showPinnedOnly}
        onTogglePinnedOnly={() => setShowPinnedOnly(!showPinnedOnly)}
      />

      {/* Service Cards Grid */}
      {filteredServices.length > 0 ? (
        <div className="services-grid">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              config={config}
              statusInfo={statusMap[service.id]}
              onEditService={(s) => setEditingService(s)}
              onTogglePin={handleTogglePin}
              onDeleteService={service.id.startsWith('custom-') ? handleDeleteService : undefined}
              onPingSingle={pingSingleService}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <AlertCircle size={48} className="text-accent" />
          <h3>No Homelab Services Found</h3>
          <p>
            {searchQuery 
              ? `No services match "${searchQuery}". Try clearing your search.`
              : 'No services match the selected category filter.'
            }
          </p>
          <button className="btn btn-primary" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setShowPinnedOnly(false); }}>
            Reset Filters
          </button>
        </div>
      )}

      {/* Config Settings Modal */}
      <ConfigModal
        isOpen={isConfigOpen}
        config={config}
        onClose={() => setIsConfigOpen(false)}
        onSaveConfig={(newConfig) => setConfig(newConfig)}
        onResetDefaults={handleResetDefaults}
      />

      {/* Edit Service Modal */}
      <EditServiceModal
        isOpen={Boolean(editingService)}
        service={editingService}
        config={config}
        onClose={() => setEditingService(null)}
        onSaveService={handleSaveEditedService}
      />

      {/* Add Custom Service Modal */}
      <AddServiceModal
        isOpen={isAddServiceOpen}
        config={config}
        onClose={() => setIsAddServiceOpen(false)}
        onAddService={handleAddService}
      />
    </div>
  );
};

export default App;
