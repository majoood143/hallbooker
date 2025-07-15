import React from 'react';
import { X, Calendar } from 'lucide-react';

const VenueOwnerFilters = ({ filters, onFiltersChange, onClose }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      verification: 'all',
      performance: 'all',
      region: '',
      propertyCount: 'all',
      revenueRange: 'all',
      dateFrom: '',
      dateTo: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Advanced Filters</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Business Verification Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Status
          </label>
          <select
            value={filters?.verification || 'all'}
            onChange={(e) => handleFilterChange('verification', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending Verification</option>
            <option value="rejected">Verification Rejected</option>
          </select>
        </div>

        {/* Property Count Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Count
          </label>
          <select
            value={filters?.propertyCount || 'all'}
            onChange={(e) => handleFilterChange('propertyCount', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Counts</option>
            <option value="0">No Properties (0)</option>
            <option value="1-2">1-2 Properties</option>
            <option value="3-5">3-5 Properties</option>
            <option value="6-10">6-10 Properties</option>
            <option value="10+">10+ Properties</option>
          </select>
        </div>

        {/* Revenue Performance Tier */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Revenue Range
          </label>
          <select
            value={filters?.revenueRange || 'all'}
            onChange={(e) => handleFilterChange('revenueRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Ranges</option>
            <option value="0-1000">$0 - $1,000</option>
            <option value="1000-5000">$1,000 - $5,000</option>
            <option value="5000-10000">$5,000 - $10,000</option>
            <option value="10000-25000">$10,000 - $25,000</option>
            <option value="25000+">$25,000+</option>
          </select>
        </div>

        {/* Performance Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Performance
          </label>
          <select
            value={filters?.performance || 'all'}
            onChange={(e) => handleFilterChange('performance', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Ratings</option>
            <option value="excellent">Excellent (4.5+)</option>
            <option value="good">Good (4.0-4.4)</option>
            <option value="average">Average (3.0-3.9)</option>
            <option value="poor">Poor (&lt;3.0)</option>
            <option value="no-rating">No Rating</option>
          </select>
        </div>
      </div>

      {/* Additional Filters Row */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Geographic Region */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Geographic Region
          </label>
          <input
            type="text"
            placeholder="Enter region or city..."
            value={filters?.region || ''}
            onChange={(e) => handleFilterChange('region', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <div className="flex space-x-2">
            <select
              value={filters?.sortBy || 'created_at'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="created_at">Registration Date</option>
              <option value="full_name">Name</option>
              <option value="total_bookings">Total Bookings</option>
              <option value="total_revenue">Revenue</option>
              <option value="venue_count">Property Count</option>
              <option value="average_rating">Rating</option>
            </select>
            <select
              value={filters?.sortOrder || 'desc'}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Sort Direction Helper */}
        <div className="flex items-end">
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <strong>Tip:</strong> Use descending to see highest values first, ascending for lowest values first
          </div>
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registration Date From
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="date"
              value={filters?.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registration Date To
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="date"
              value={filters?.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Filter Actions */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={clearFilters}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear All
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default VenueOwnerFilters;