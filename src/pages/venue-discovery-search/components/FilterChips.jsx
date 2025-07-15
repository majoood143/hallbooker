import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterChips = ({ activeFilters, onRemoveFilter, onClearAll }) => {
  const formatFilterValue = (key, value) => {
    switch (key) {
      case 'priceRange':
        return `$${value.min} - $${value.max}`;
      case 'capacity':
        return `${value.min} - ${value.max} guests`;
      case 'amenities':
        return Array.isArray(value) ? value.join(', ') : (value || '');
      case 'venueType':
        return Array.isArray(value) ? value.join(', ') : (value || '');
      case 'location':
        return `Within ${value.radius}mi of ${value.city}`;
      default:
        return value || '';
    }
  };

  const getFilterLabel = (key) => {
    switch (key) {
      case 'priceRange':
        return 'Price';
      case 'capacity':
        return 'Capacity';
      case 'amenities':
        return 'Amenities';
      case 'venueType':
        return 'Type';
      case 'location':
        return 'Location';
      default:
        return key;
    }
  };

  const filterEntries = Object.entries(activeFilters || {}).filter(([key, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== '' && v !== null && v !== undefined);
    }
    return value !== '' && value !== null && value !== undefined;
  });

  if (filterEntries.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm font-medium text-text-primary">Active filters:</span>
      
      {filterEntries.map(([key, value]) => (
        <div
          key={key}
          className="inline-flex items-center bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
        >
          <span className="font-medium mr-1">{getFilterLabel(key)}:</span>
          <span className="mr-2">{formatFilterValue(key, value)}</span>
          <button
            onClick={() => onRemoveFilter(key)}
            className="hover:bg-primary-200 rounded-full p-0.5 transition-colors duration-200"
          >
            <Icon name="X" size={12} />
          </button>
        </div>
      ))}

      {filterEntries.length > 1 && (
        <Button
          variant="ghost"
          onClick={onClearAll}
          iconName="X"
          iconSize={14}
          className="text-text-muted hover:text-text-primary text-sm"
        >
          Clear all
        </Button>
      )}
    </div>
  );
};

export default FilterChips;