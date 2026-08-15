import React from 'react';
import type { ServiceCategory } from '../types/dashboard';
import { Layers, Film, Download, Wrench, Sparkles, Star } from 'lucide-react';

interface CategoryGroupProps {
  selectedCategory: ServiceCategory;
  onSelectCategory: (category: ServiceCategory) => void;
  categoryCounts: Record<ServiceCategory | 'pinned', number>;
  showPinnedOnly: boolean;
  onTogglePinnedOnly: () => void;
}

export const CategoryGroup: React.FC<CategoryGroupProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  showPinnedOnly,
  onTogglePinnedOnly,
}) => {
  const categories: { id: ServiceCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Services', icon: <Layers size={16} /> },
    { id: 'media', label: 'Media & Streaming', icon: <Film size={16} /> },
    { id: 'downloads', label: 'Downloads & Automation', icon: <Download size={16} /> },
    { id: 'utilities', label: 'Infrastructure & Tools', icon: <Wrench size={16} /> },
    { id: 'custom', label: 'Custom Apps', icon: <Sparkles size={16} /> },
  ];

  return (
    <div className="category-bar">
      <div className="category-tabs">
        {categories.map((cat) => {
          const count = categoryCounts[cat.id] || 0;
          const isActive = selectedCategory === cat.id && !showPinnedOnly;
          return (
            <button
              key={cat.id}
              className={`category-tab ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (showPinnedOnly) onTogglePinnedOnly();
                onSelectCategory(cat.id);
              }}
            >
              {cat.icon}
              <span>{cat.label}</span>
              <span className="count-pill">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="category-pinned-toggle">
        <button
          className={`category-tab pinned-tab ${showPinnedOnly ? 'active' : ''}`}
          onClick={onTogglePinnedOnly}
        >
          <Star size={16} fill={showPinnedOnly ? "#f59e0b" : "none"} color="#f59e0b" />
          <span>Pinned Favorites</span>
          <span className="count-pill">{categoryCounts.pinned || 0}</span>
        </button>
      </div>
    </div>
  );
};
