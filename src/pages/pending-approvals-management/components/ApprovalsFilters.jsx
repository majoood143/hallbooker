import React from 'react';
import { Search, Filter, Building, Calendar, SortAsc, SortDesc, Clock } from 'lucide-react';

const ApprovalsFilters = ({ filters, onFilterChange }) => {
  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const handleSortChange = (sortBy) => {
    const newOrder = filters.sortBy === sortBy && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    onFilterChange({ sortBy, sortOrder: newOrder });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by booking reference..."
              value={filters.search || ''}
              onChange={(e) => handleInputChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Venue Filter */}
        <div className="flex-1 max-w-xs">
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Filter by venue..."
              value={filters.venue || ''}
              onChange={(e) => handleInputChange('venue', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 mr-2">Sort by:</span>
          
          <button
            onClick={() => handleSortChange('created_at')}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.sortBy === 'created_at' ?'bg-blue-100 text-blue-700 border border-blue-200' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Clock className="w-4 h-4 mr-1" />
            Submission Time
            {filters.sortBy === 'created_at' && (
              filters.sortOrder === 'desc' ? 
                <SortDesc className="w-4 h-4 ml-1" /> : 
                <SortAsc className="w-4 h-4 ml-1" />
            )}
          </button>

          <button
            onClick={() => handleSortChange('event_date')}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.sortBy === 'event_date' ?'bg-blue-100 text-blue-700 border border-blue-200' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Event Date
            {filters.sortBy === 'event_date' && (
              filters.sortOrder === 'desc' ? 
                <SortDesc className="w-4 h-4 ml-1" /> : 
                <SortAsc className="w-4 h-4 ml-1" />
            )}
          </button>

          <button
            onClick={() => handleSortChange('total_amount')}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.sortBy === 'total_amount' ?'bg-blue-100 text-blue-700 border border-blue-200' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Amount
            {filters.sortBy === 'total_amount' && (
              filters.sortOrder === 'desc' ? 
                <SortDesc className="w-4 h-4 ml-1" /> : 
                <SortAsc className="w-4 h-4 ml-1" />
            )}
          </button>
        </div>

        {/* Clear Filters */}
        {(filters.search || filters.venue) && (
          <button
            onClick={() => onFilterChange({ search: '', venue: '' })}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {(filters.search || filters.venue) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              <Search className="w-3 h-3 mr-1" />
              Search: "{filters.search}"
            </span>
          )}
          {filters.venue && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              <Building className="w-3 h-3 mr-1" />
              Venue: "{filters.venue}"
            </span>
          )}
        </div>
      )}

      {/* Quick Filter Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => handleSortChange('created_at')}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors"
        >
          <Clock className="w-3 h-3 mr-1" />
          Show Oldest First
        </button>
        <button
          onClick={() => onFilterChange({ sortBy: 'total_amount', sortOrder: 'desc' })}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
        >
          💰 High Value First
        </button>
        <button
          onClick={() => onFilterChange({ sortBy: 'event_date', sortOrder: 'asc' })}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
        >
          <Calendar className="w-3 h-3 mr-1" />
          Upcoming Events
        </button>
      </div>
    </div>
  );
};

export default ApprovalsFilters;