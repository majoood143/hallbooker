import React, { useState } from 'react';

import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const AdvancedFilters = ({ isOpen, onClose, filters, onApplyFilters }) => {
  const [localFilters, setLocalFilters] = useState({
    priceRange: { min: filters?.priceRange?.min || 0, max: filters?.priceRange?.max || 5000 },
    capacity: { min: filters?.capacity?.min || 0, max: filters?.capacity?.max || 1000 },
    amenities: Array.isArray(filters?.amenities) ? filters.amenities : [],
    venueType: Array.isArray(filters?.venueType) ? filters.venueType : [],
    location: { radius: filters?.location?.radius || 25, city: filters?.location?.city || '' }
  });

  const amenitiesList = [
    'WiFi', 'Parking', 'Kitchen', 'Sound System', 'Projector', 'Air Conditioning',
    'Dance Floor', 'Stage', 'Bar', 'Catering', 'Photography', 'Decoration'
  ];

  const venueTypes = [
    'Banquet Hall', 'Wedding Venue', 'Conference Room', 'Community Center',
    'Hotel Ballroom', 'Restaurant', 'Outdoor Venue', 'Historic Building'
  ];

  const handlePriceChange = (type, value) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: parseInt(value) || 0
      }
    }));
  };

  const handleCapacityChange = (type, value) => {
    setLocalFilters(prev => ({
      ...prev,
      capacity: {
        ...prev.capacity,
        [type]: parseInt(value) || 0
      }
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setLocalFilters(prev => ({
      ...prev,
      amenities: Array.isArray(prev.amenities) && prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...(Array.isArray(prev.amenities) ? prev.amenities : []), amenity]
    }));
  };

  const handleVenueTypeToggle = (type) => {
    setLocalFilters(prev => ({
      ...prev,
      venueType: Array.isArray(prev.venueType) && prev.venueType.includes(type)
        ? prev.venueType.filter(t => t !== type)
        : [...(Array.isArray(prev.venueType) ? prev.venueType : []), type]
    }));
  };

  const handleLocationChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({
      priceRange: { min: 0, max: 5000 },
      capacity: { min: 0, max: 1000 },
      amenities: [],
      venueType: [],
      location: { radius: 25, city: '' }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">Advanced Filters</h2>
          <Button variant="ghost" iconName="X" onClick={onClose} />
        </div>

        <div className="p-6 space-y-6">
          {/* Price Range */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-3">Price Range</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Min Price ($)
                </label>
                <Input
                  type="number"
                  value={localFilters.priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  min="0"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Max Price ($)
                </label>
                <Input
                  type="number"
                  value={localFilters.priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  min="0"
                  placeholder="5000"
                />
              </div>
            </div>
          </div>

          {/* Capacity Range */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-3">Guest Capacity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Min Guests
                </label>
                <Input
                  type="number"
                  value={localFilters.capacity.min}
                  onChange={(e) => handleCapacityChange('min', e.target.value)}
                  min="0"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Max Guests
                </label>
                <Input
                  type="number"
                  value={localFilters.capacity.max}
                  onChange={(e) => handleCapacityChange('max', e.target.value)}
                  min="0"
                  placeholder="1000"
                />
              </div>
            </div>
          </div>

          {/* Location Radius */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-3">Location</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Search Radius (miles)
                </label>
                <Input
                  type="number"
                  value={localFilters.location.radius}
                  onChange={(e) => handleLocationChange('radius', e.target.value)}
                  min="1"
                  max="100"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  City
                </label>
                <Input
                  type="text"
                  value={localFilters.location.city}
                  onChange={(e) => handleLocationChange('city', e.target.value)}
                  placeholder="Enter city name"
                />
              </div>
            </div>
          </div>

          {/* Venue Types */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-3">Venue Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {(Array.isArray(venueTypes) ? venueTypes : []).map((type) => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <Input
                    type="checkbox"
                    checked={Array.isArray(localFilters.venueType) && localFilters.venueType.includes(type)}
                    onChange={() => handleVenueTypeToggle(type)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-text-primary">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-3">Amenities</h3>
            <div className="grid grid-cols-2 gap-2">
              {(Array.isArray(amenitiesList) ? amenitiesList : []).map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <Input
                    type="checkbox"
                    checked={Array.isArray(localFilters.amenities) && localFilters.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-text-primary">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button variant="ghost" onClick={handleReset}>
            Reset All
          </Button>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;