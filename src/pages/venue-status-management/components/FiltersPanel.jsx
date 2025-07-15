import React from 'react';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';

const FiltersPanel = ({ filters, onFiltersChange, activeTab }) => {
  const isVenueTab = activeTab?.includes('venues');

  const handleFilterChange = (key, value) => {
    onFiltersChange?.({ [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange?.({
      search: '',
      location: '',
      venueType: '',
      sortBy: isVenueTab ? 'last_status_change' : 'created_at',
      sortOrder: 'desc'
    });
  };

  const venueTypes = [
    { value: 'banquet_hall', label: 'Banquet Hall' },
    { value: 'conference_room', label: 'Conference Room' },
    { value: 'outdoor_venue', label: 'Outdoor Venue' },
    { value: 'historic_building', label: 'Historic Building' },
    { value: 'rooftop_venue', label: 'Rooftop Venue' },
    { value: 'community_center', label: 'Community Center' }
  ];

  const venueSortOptions = [
    { value: 'last_status_change', label: 'Last Status Change' },
    { value: 'name', label: 'Name' },
    { value: 'created_at', label: 'Date Created' },
    { value: 'location', label: 'Location' },
    { value: 'capacity', label: 'Capacity' },
    { value: 'price_per_hour', label: 'Price' }
  ];

  const bookingSortOptions = [
    { value: 'created_at', label: 'Date Created' },
    { value: 'event_date', label: 'Event Date' },
    { value: 'total_amount', label: 'Amount' },
    { value: 'booking_reference', label: 'Reference' }
  ];

  const sortOptions = isVenueTab ? venueSortOptions : bookingSortOptions;

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={`Search ${isVenueTab ? 'venues' : 'bookings'}...`}
            value={filters?.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Location Filter (Venues only) */}
        {isVenueTab && (
          <div className="min-w-48">
            <select
              value={filters?.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Locations</option>
              <option value="Manhattan">Manhattan, NY</option>
              <option value="Brooklyn">Brooklyn, NY</option>
              <option value="Queens">Queens, NY</option>
              <option value="Chicago">Chicago, IL</option>
              <option value="Boston">Boston, MA</option>
            </select>
          </div>
        )}

        {/* Venue Type Filter (Venues only) */}
        {isVenueTab && (
          <div className="min-w-48">
            <select
              value={filters?.venueType || ''}
              onChange={(e) => handleFilterChange('venueType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              {venueTypes?.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sort By */}
        <div className="min-w-48">
          <select
            value={filters?.sortBy || ''}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                Sort by {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <button
          onClick={() => handleFilterChange('sortOrder', filters?.sortOrder === 'asc' ? 'desc' : 'asc')}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          title={`Sort ${filters?.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
        >
          {filters?.sortOrder === 'asc' ? (
            <SortAsc className="w-4 h-4 text-gray-600" />
          ) : (
            <SortDesc className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Clear Filters
        </button>
      </div>

      {/* Active Filters Display */}
      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {filters?.search && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              Search: "{filters.search}"
              <button
                onClick={() => handleFilterChange('search', '')}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {filters?.location && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              Location: {filters.location}
              <button
                onClick={() => handleFilterChange('location', '')}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {filters?.venueType && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              Type: {venueTypes?.find(t => t.value === filters.venueType)?.label}
              <button
                onClick={() => handleFilterChange('venueType', '')}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;