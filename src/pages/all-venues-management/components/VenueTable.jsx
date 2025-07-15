import React from 'react';
import { Eye, X, Pause, Play, MapPin, Users, Star } from 'lucide-react';
import { ensureArray, safeMap } from '../../../utils/arrayUtils';

const VenueTable = ({
  venues = [],
  loading,
  selectedVenues = [],
  onVenueSelect,
  onSelectAll,
  onVenueAction,
  onViewDetails
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatVenueType = (type) => {
    return type?.replace(/_/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase()) || '';
  };

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></span>
          Active
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5"></span>
          Suspended
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          {safeMap(Array(5).fill(null), (_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const safeVenues = ensureArray(venues);
  const safeSelectedVenues = ensureArray(selectedVenues);

  if (safeVenues.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
          <p className="text-gray-500">No venues match your current filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                checked={safeSelectedVenues.length === safeVenues.length && safeVenues.length > 0}
                onChange={(e) => onSelectAll?.(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Venue Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Owner
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Capacity & Pricing
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Performance
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {safeMap(safeVenues, (venue) => (
            <tr key={venue?.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={safeSelectedVenues.includes(venue?.id)}
                  onChange={(e) => onVenueSelect?.(venue?.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              
              {/* Venue Details */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    <img
                      className="h-12 w-12 rounded-lg object-cover"
                      src={venue?.images?.[0] || '/assets/images/no_image.png'}
                      alt={venue?.name}
                      onError={(e) => {
                        e.target.src = '/assets/images/no_image.png';
                      }}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {venue?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatVenueType(venue?.venue_type)}
                    </div>
                  </div>
                </div>
              </td>

              {/* Owner */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{venue?.owner_name || 'N/A'}</div>
                <div className="text-sm text-gray-500">{venue?.owner_email || 'N/A'}</div>
              </td>

              {/* Location */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {venue?.location}
                </div>
                <div className="text-sm text-gray-500">{venue?.address}</div>
              </td>

              {/* Capacity & Pricing */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <Users className="w-4 h-4 mr-1 text-gray-400" />
                  {venue?.capacity} guests
                </div>
                <div className="text-sm font-medium text-green-600">
                  {formatCurrency(venue?.price_per_hour)}/hour
                </div>
              </td>

              {/* Performance */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                  {venue?.rating?.toFixed(1) || '0.0'} ({venue?.review_count || 0})
                </div>
                <div className="text-sm text-gray-500">
                  Revenue: {formatCurrency(venue?.total_revenue || 0)}
                </div>
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(venue?.is_active)}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onViewDetails?.(venue)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  {venue?.is_active ? (
                    <button
                      onClick={() => onVenueAction?.('suspend', venue?.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                      title="Suspend Venue"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onVenueAction?.('approve', venue?.id)}
                      className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                      title="Activate Venue"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => onVenueAction?.('delete', venue?.id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                    title="Delete Venue"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VenueTable;