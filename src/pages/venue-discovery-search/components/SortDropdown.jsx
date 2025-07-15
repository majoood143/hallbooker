import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SortDropdown = ({ currentSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: 'relevance', label: 'Best Match', icon: 'Target' },
    { value: 'price-low', label: 'Price: Low to High', icon: 'TrendingUp' },
    { value: 'price-high', label: 'Price: High to Low', icon: 'TrendingDown' },
    { value: 'rating', label: 'Highest Rated', icon: 'Star' },
    { value: 'distance', label: 'Distance', icon: 'MapPin' },
    { value: 'newest', label: 'Newest First', icon: 'Clock' }
  ];

  const handleSortSelect = (sortValue) => {
    onSortChange(sortValue);
    setIsOpen(false);
  };

  const getCurrentSortLabel = () => {
    const current = sortOptions.find(option => option.value === currentSort);
    return current ? current.label : 'Sort by';
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        iconName="ChevronDown"
        iconPosition="right"
        className="min-w-40"
      >
        {getCurrentSortLabel()}
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-56 bg-surface border border-border rounded-md shadow-lg z-50 animate-slide-down">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option.value)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-secondary-50 transition-colors duration-200 ${
                  currentSort === option.value 
                    ? 'bg-primary-50 text-primary-700' :'text-text-primary'
                }`}
              >
                <Icon 
                  name={option.icon} 
                  size={16} 
                  className={currentSort === option.value ? 'text-primary' : 'text-text-muted'} 
                />
                <span className="text-sm">{option.label}</span>
                {currentSort === option.value && (
                  <Icon name="Check" size={14} className="text-primary ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SortDropdown;