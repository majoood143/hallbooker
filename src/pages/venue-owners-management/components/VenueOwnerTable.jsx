import React from 'react';
import { Eye, Building2, DollarSign, Star, UserX, UserCheck, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const VenueOwnerTable = ({
  venueOwners,
  loading,
  selectedVenueOwners,
  onVenueOwnerSelect,
  onSelectAll,
  onVenueOwnerAction,
  pagination,
  onPageChange,
  onLimitChange
}) => {
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

  const getVerificationStatus = (owner) => {
    const venueCount = owner?.venues?.length || 0;
    if (venueCount === 0) return { status: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
    if (venueCount > 0) return { status: 'verified', label: 'Verified', color: 'bg-green-100 text-green-800' };
    return { status: 'unknown', label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
  };

  const getPerformanceRating = (venues) => {
    if (!venues?.length) return { rating: 0, count: 0 };
    const totalRating = venues?.reduce((sum, venue) => sum + (venue?.rating || 0), 0);
    const totalReviews = venues?.reduce((sum, venue) => sum + (venue?.review_count || 0), 0);
    return {
      rating: venues?.length > 0 ? (totalRating / venues?.length).toFixed(1) : 0,
      count: totalReviews
    };
  };

  const totalPages = Math.ceil((pagination?.total || 0) / (pagination?.limit || 20));
  const startItem = ((pagination?.page || 1) - 1) * (pagination?.limit || 20) + 1;
  const endItem = Math.min(startItem + (pagination?.limit || 20) - 1, pagination?.total || 0);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading venue owners...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">
                <input
                  type="checkbox"
                  checked={venueOwners?.length > 0 && selectedVenueOwners?.size === venueOwners?.length}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Portfolio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verification
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {venueOwners?.length > 0 ? (
              venueOwners?.map((owner) => {
                const verification = getVerificationStatus(owner);
                const performance = getPerformanceRating(owner?.venues);
                
                return (
                  <tr key={owner?.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedVenueOwners?.has(owner?.id)}
                        onChange={(e) => onVenueOwnerSelect?.(owner?.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {owner?.avatar_url ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={owner?.avatar_url}
                              alt={owner?.full_name || 'Owner'}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-purple-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-purple-700">
                                {owner?.full_name?.charAt(0)?.toUpperCase() || 'O'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {owner?.full_name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">{owner?.email}</div>
                          {owner?.phone && (
                            <div className="text-xs text-gray-400">{owner?.phone}</div>
                          )}
                          <div className="text-xs text-gray-400">
                            Member since {formatDate(owner?.created_at)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {owner?.venues?.length || 0} Properties
                          </div>
                          <div className="text-xs text-gray-500">
                            {owner?.total_bookings?.[0]?.count || 0} total bookings
                          </div>
                          {owner?.venues?.length > 0 && (
                            <div className="text-xs text-gray-400">
                              {owner?.venues?.filter(v => v?.is_active)?.length} active venues
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-500 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {performance?.rating > 0 ? `${performance.rating} ★` : 'No rating'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {performance?.count} reviews
                          </div>
                          {owner?.venues?.length > 0 && (
                            <div className="text-xs text-gray-400">
                              Avg across {owner?.venues?.length} venues
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(owner?.total_revenue?.[0]?.sum || 0)}
                          </div>
                          <div className="text-xs text-gray-500">Total earnings</div>
                          {owner?.venues?.length > 0 && (
                            <div className="text-xs text-gray-400">
                              Avg: {formatCurrency((owner?.total_revenue?.[0]?.sum || 0) / owner?.venues?.length)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${verification?.color}`}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {verification?.label}
                      </span>
                      {verification?.status === 'pending' && (
                        <div className="text-xs text-gray-500 mt-1">Awaiting first venue</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onVenueOwnerAction?.('view', owner?.id)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {verification?.status === 'pending' && (
                          <button
                            onClick={() => onVenueOwnerAction?.('verify', owner?.id)}
                            className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50"
                            title="Verify Business"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onVenueOwnerAction?.('suspend', owner?.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                          title="Suspend Account"
                        >
                          <UserX className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onVenueOwnerAction?.('activate', owner?.id)}
                          className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50"
                          title="Activate Account"
                        >
                          <UserCheck className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <div className="text-lg font-medium">No venue owners found</div>
                    <div className="text-sm mt-1">Try adjusting your search or filters</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {venueOwners?.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange?.(Math.max(1, (pagination?.page || 1) - 1))}
              disabled={(pagination?.page || 1) === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange?.(Math.min(totalPages, (pagination?.page || 1) + 1))}
              disabled={(pagination?.page || 1) === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startItem}</span> to{' '}
                <span className="font-medium">{endItem}</span> of{' '}
                <span className="font-medium">{pagination?.total || 0}</span> results
              </p>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700">Show:</label>
                <select
                  value={pagination?.limit || 20}
                  onChange={(e) => onLimitChange?.(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => onPageChange?.(Math.max(1, (pagination?.page || 1) - 1))}
                  disabled={(pagination?.page || 1) === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, (pagination?.page || 1) - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange?.(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === (pagination?.page || 1)
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' :'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => onPageChange?.(Math.min(totalPages, (pagination?.page || 1) + 1))}
                  disabled={(pagination?.page || 1) === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueOwnerTable;