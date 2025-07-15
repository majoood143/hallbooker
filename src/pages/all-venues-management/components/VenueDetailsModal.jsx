import React from 'react';
import { X, MapPin, Users, Star, Calendar, DollarSign, Pause, Play } from 'lucide-react';

const VenueDetailsModal = ({ venue, onClose, onAction }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatVenueType = (type) => {
    return type?.replace(/_/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase()) || '';
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Venue Details
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div>
                {/* Venue Images */}
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    {venue?.images?.length > 0 ? (
                      venue.images.slice(0, 4).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${venue?.name} ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = '/assets/images/no_image.png';
                          }}
                        />
                      ))
                    ) : (
                      <img
                        src="/assets/images/no_image.png"
                        alt={venue?.name}
                        className="w-full h-24 object-cover rounded-lg col-span-2"
                      />
                    )}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{venue?.name}</h4>
                    <p className="text-sm text-gray-600">{formatVenueType(venue?.venue_type)}</p>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <div>
                      <div className="font-medium">{venue?.location}</div>
                      <div className="text-sm">{venue?.address}</div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Capacity: {venue?.capacity} guests</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>{formatCurrency(venue?.price_per_hour)} per hour</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                    <span>{venue?.rating?.toFixed(1) || '0.0'} ({venue?.review_count || 0} reviews)</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Created: {formatDate(venue?.created_at)}</span>
                  </div>
                </div>

                {/* Description */}
                {venue?.description && (
                  <div className="mt-6">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Description</h5>
                    <p className="text-sm text-gray-600">{venue?.description}</p>
                  </div>
                )}
              </div>

              {/* Right Column - Additional Info */}
              <div>
                {/* Owner Information */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Owner Information</h5>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Name:</span> {venue?.owner_name || 'N/A'}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Email:</span> {venue?.owner_email || 'N/A'}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Phone:</span> {venue?.owner_phone || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {venue?.amenities?.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Amenities</h5>
                    <div className="flex flex-wrap gap-2">
                      {venue.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Performance Metrics */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Performance Metrics</h5>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Bookings:</span>
                      <span className="text-sm font-medium">{venue?.total_bookings || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Revenue:</span>
                      <span className="text-sm font-medium text-green-600">
                        {formatCurrency(venue?.total_revenue || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Rating:</span>
                      <span className="text-sm font-medium">{venue?.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Review Count:</span>
                      <span className="text-sm font-medium">{venue?.review_count || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Current Status</h5>
                  <div className="flex items-center">
                    {venue?.is_active ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        Suspended
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Close
            </button>
            
            {venue?.is_active ? (
              <button
                onClick={() => {
                  onAction?.('suspend', venue?.id);
                  onClose?.();
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <Pause className="w-4 h-4 mr-2" />
                Suspend Venue
              </button>
            ) : (
              <button
                onClick={() => {
                  onAction?.('approve', venue?.id);
                  onClose?.();
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Activate Venue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetailsModal;