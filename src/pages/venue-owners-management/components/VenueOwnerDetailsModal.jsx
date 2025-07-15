import React, { useState } from 'react';
import { X, Building2, DollarSign, Star, MapPin, Calendar, Phone, Mail, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import Icon from '../../../components/AppIcon';


const VenueOwnerDetailsModal = ({ venueOwner, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const getVerificationStatus = () => {
    const venueCount = venueOwner?.venues?.length || 0;
    if (venueCount === 0) return { status: 'pending', label: 'Pending Verification', color: 'bg-yellow-100 text-yellow-800' };
    if (venueCount > 0) return { status: 'verified', label: 'Business Verified', color: 'bg-green-100 text-green-800' };
    return { status: 'unknown', label: 'Status Unknown', color: 'bg-gray-100 text-gray-800' };
  };

  const getPerformanceRating = () => {
    const venues = venueOwner?.venues || [];
    if (!venues?.length) return { rating: 0, count: 0 };
    const totalRating = venues?.reduce((sum, venue) => sum + (venue?.rating || 0), 0);
    const totalReviews = venues?.reduce((sum, venue) => sum + (venue?.review_count || 0), 0);
    return {
      rating: venues?.length > 0 ? (totalRating / venues?.length).toFixed(1) : 0,
      count: totalReviews
    };
  };

  const verification = getVerificationStatus();
  const performance = getPerformanceRating();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'venues', label: 'Properties', icon: Building2 },
    { id: 'financials', label: 'Financials', icon: DollarSign }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {venueOwner?.avatar_url ? (
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={venueOwner?.avatar_url}
                      alt={venueOwner?.full_name || 'Venue Owner'}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-purple-300 flex items-center justify-center">
                      <span className="text-lg font-medium text-purple-700">
                        {venueOwner?.full_name?.charAt(0)?.toUpperCase() || 'O'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{venueOwner?.full_name || 'Unknown'}</h3>
                  <p className="text-sm text-gray-500">{venueOwner?.email}</p>
                  <div className="mt-1">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${verification?.color}`}>
                      {verification?.label}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="mt-4">
              <nav className="flex space-x-8">
                {tabs?.map((tab) => {
                  const Icon = tab?.icon;
                  return (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex items-center px-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab?.id
                          ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab?.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-6 max-h-96 overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-900">{venueOwner?.venues?.length || 0}</div>
                    <div className="text-sm text-blue-700">Properties</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-900">
                      {formatCurrency(venueOwner?.total_revenue?.[0]?.sum || 0)}
                    </div>
                    <div className="text-sm text-green-700">Total Revenue</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-900">
                      {performance?.rating > 0 ? `${performance.rating} ★` : 'N/A'}
                    </div>
                    <div className="text-sm text-yellow-700">Avg Rating</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-900">
                      {venueOwner?.total_bookings?.[0]?.count || 0}
                    </div>
                    <div className="text-sm text-purple-700">Total Bookings</div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Email</div>
                        <div className="text-sm text-gray-600">{venueOwner?.email || 'Not provided'}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Phone</div>
                        <div className="text-sm text-gray-600">{venueOwner?.phone || 'Not provided'}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Location</div>
                        <div className="text-sm text-gray-600">{venueOwner?.location || 'Not provided'}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Member Since</div>
                        <div className="text-sm text-gray-600">{formatDate(venueOwner?.created_at)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Summary */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Business Summary</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-2">Portfolio Performance</div>
                        <div className="text-sm text-gray-600">
                          {venueOwner?.venues?.length > 0 ? (
                            <>
                              <div>Active venues: {venueOwner?.venues?.filter(v => v?.is_active)?.length}</div>
                              <div>Average price: {formatCurrency(venueOwner?.venues?.reduce((sum, v) => sum + (v?.price_per_hour || 0), 0) / venueOwner?.venues?.length)}/hour</div>
                              <div>Total capacity: {venueOwner?.venues?.reduce((sum, v) => sum + (v?.capacity || 0), 0)} guests</div>
                            </>
                          ) : (
                            <div>No properties listed yet</div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-2">Booking Performance</div>
                        <div className="text-sm text-gray-600">
                          <div>Total bookings: {venueOwner?.total_bookings?.[0]?.count || 0}</div>
                          <div>Total revenue: {formatCurrency(venueOwner?.total_revenue?.[0]?.sum || 0)}</div>
                          <div>Reviews received: {performance?.count}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'venues' && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Property Portfolio</h4>
                {venueOwner?.venues?.length > 0 ? (
                  <div className="space-y-4">
                    {venueOwner?.venues?.map((venue) => (
                      <div key={venue?.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h5 className="text-lg font-medium text-gray-900">{venue?.name}</h5>
                              <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                venue?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {venue?.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>
                                <div className="font-medium">Type</div>
                                <div>{venue?.venue_type?.replace('_', ' ') || 'N/A'}</div>
                              </div>
                              <div>
                                <div className="font-medium">Capacity</div>
                                <div>{venue?.capacity || 0} guests</div>
                              </div>
                              <div>
                                <div className="font-medium">Price</div>
                                <div>{formatCurrency(venue?.price_per_hour)}/hour</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="text-sm font-medium">{venue?.rating || 0}</span>
                              <span className="text-xs text-gray-500 ml-1">({venue?.review_count || 0})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <div>No properties listed yet</div>
                    <div className="text-sm mt-1">This venue owner has not added any properties</div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'financials' && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Financial Overview</h4>
                <div className="space-y-6">
                  {/* Revenue Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Revenue Summary</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(venueOwner?.total_revenue?.[0]?.sum || 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {venueOwner?.total_bookings?.[0]?.count || 0}
                        </div>
                        <div className="text-sm text-gray-600">Total Bookings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {venueOwner?.total_bookings?.[0]?.count > 0 
                            ? formatCurrency((venueOwner?.total_revenue?.[0]?.sum || 0) / venueOwner?.total_bookings?.[0]?.count)
                            : formatCurrency(0)
                          }
                        </div>
                        <div className="text-sm text-gray-600">Avg Booking Value</div>
                      </div>
                    </div>
                  </div>

                  {/* Commission Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Commission Details</h5>
                    <div className="text-sm text-gray-600">
                      <div>Platform Commission Rate: 10%</div>
                      <div>Estimated Commission Paid: {formatCurrency((venueOwner?.total_revenue?.[0]?.sum || 0) * 0.1)}</div>
                      <div>Net Earnings: {formatCurrency((venueOwner?.total_revenue?.[0]?.sum || 0) * 0.9)}</div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Performance Metrics</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <div className="font-medium">Revenue per Property</div>
                        <div>
                          {venueOwner?.venues?.length > 0 
                            ? formatCurrency((venueOwner?.total_revenue?.[0]?.sum || 0) / venueOwner?.venues?.length)
                            : formatCurrency(0)
                          }
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Average Rating</div>
                        <div>{performance?.rating > 0 ? `${performance.rating} stars` : 'No rating'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 sm:flex sm:flex-row-reverse">
            <button
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueOwnerDetailsModal;