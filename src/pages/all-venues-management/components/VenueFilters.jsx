import React from 'react';
import { MapPin, Users, DollarSign } from 'lucide-react';

const VenueFilters = ({ filters, onFiltersChange }) => {
  const venueTypes = [
    { value: '', label: 'All Types' },
    { value: 'banquet_hall', label: 'Banquet Hall' },
    { value: 'conference_room', label: 'Conference Room' },
    { value: 'outdoor_venue', label: 'Outdoor Venue' },
    { value: 'historic_building', label: 'Historic Building' },
    { value: 'rooftop_venue', label: 'Rooftop Venue' },
    { value: 'community_center', label: 'Community Center' }
  ];

  const approvalStatuses = [
    { value: '', label: 'All Statuses' },
    { value: 'approved', label: 'Approved' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const handleFilterChange = (filterKey, value) => {
    onFiltersChange?.({
      ...filters,
      [filterKey]: value
    });
  };

  const handleRangeChange = (filterKey, rangeKey, value) => {
    onFiltersChange?.({
      ...filters,
      [filterKey]: {
        ...filters[filterKey],
        [rangeKey]: value
      }
    });
  };

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Venue Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Venue Type
        </label>
        <select
          value={filters?.venueType || ''}
          onChange={(e) => handleFilterChange('venueType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {venueTypes?.map(type => (
            <option key={type?.value} value={type?.value}>
              {type?.label}
            </option>
          ))}
        </select>
      </div>

      {/* Approval Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Approval Status
        </label>
        <select
          value={filters?.approvalStatus || ''}
          onChange={(e) => handleFilterChange('approvalStatus', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {approvalStatuses?.map(status => (
            <option key={status?.value} value={status?.value}>
              {status?.label}
            </option>
          ))}
        </select>
      </div>

      {/* Location Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline w-4 h-4 mr-1" />
          Location
        </label>
        <input
          type="text"
          placeholder="Enter location..."
          value={filters?.location || ''}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Capacity Range Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Users className="inline w-4 h-4 mr-1" />
          Capacity Range
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters?.capacity?.min || ''}
            onChange={(e) => handleRangeChange('capacity', 'min', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters?.capacity?.max || ''}
            onChange={(e) => handleRangeChange('capacity', 'max', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Pricing Range Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="inline w-4 h-4 mr-1" />
          Price Range (per hour)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters?.pricing?.min || ''}
            onChange={(e) => handleRangeChange('pricing', 'min', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters?.pricing?.max || ''}
            onChange={(e) => handleRangeChange('pricing', 'max', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default VenueFilters;