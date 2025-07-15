import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Star, 
  Heart, 
  CreditCard,
  MoreVertical,
  Trash2,
  UserCog,
  Eye
} from 'lucide-react';

const CustomersList = ({ customers, onCustomerAction, loading }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (customer) => {
    const totalBookings = customer.bookings?.[0]?.count || 0;
    if (totalBookings >= 10) {
      return { label: 'VIP', color: 'bg-purple-100 text-purple-800' };
    } else if (totalBookings >= 5) {
      return { label: 'Regular', color: 'bg-green-100 text-green-800' };
    } else if (totalBookings >= 1) {
      return { label: 'Active', color: 'bg-blue-100 text-blue-800' };
    }
    return { label: 'New', color: 'bg-gray-100 text-gray-800' };
  };

  const handleActionClick = (e, customerId, action, data = {}) => {
    e.stopPropagation();
    setShowActionMenu(null);
    onCustomerAction(customerId, action, data);
  };

  const toggleActionMenu = (e, customerId) => {
    e.stopPropagation();
    setShowActionMenu(showActionMenu === customerId ? null : customerId);
  };

  if (!customers?.length) {
    return (
      <div className="p-12 text-center">
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Customers Found</h3>
        <p className="text-gray-500">
          No customers match your current filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers?.map((customer) => {
              const status = getStatusBadge(customer);
              const totalBookings = customer.bookings?.[0]?.count || 0;
              const totalFavorites = customer.favorite_venues?.[0]?.count || 0;
              const totalReviews = customer.reviews?.[0]?.count || 0;

              return (
                <tr 
                  key={customer.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {customer.avatar_url ? (
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={customer.avatar_url} 
                            alt={customer.full_name || 'Customer'}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.full_name || 'Unnamed Customer'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Customer ID: {customer.id?.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center mb-1">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      {customer.email}
                    </div>
                    {customer.phone && (
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        {customer.phone}
                      </div>
                    )}
                    {customer.location && (
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        {customer.location}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 text-blue-500 mr-1" />
                        <span>{totalBookings} bookings</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 text-red-500 mr-1" />
                        <span>{totalFavorites} favorites</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span>{totalReviews} reviews</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      {formatDate(customer.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={(e) => toggleActionMenu(e, customer.id)}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {showActionMenu === customer.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={(e) => handleActionClick(e, customer.id, 'view')}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                            <button
                              onClick={(e) => handleActionClick(e, customer.id, 'updateRole', { role: 'venue_owner' })}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              <UserCog className="w-4 h-4 mr-2" />
                              Promote to Venue Owner
                            </button>
                            <button
                              onClick={(e) => handleActionClick(e, customer.id, 'delete')}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Customer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 p-4">
        {customers?.map((customer) => {
          const status = getStatusBadge(customer);
          const totalBookings = customer.bookings?.[0]?.count || 0;
          const totalFavorites = customer.favorite_venues?.[0]?.count || 0;
          const totalReviews = customer.reviews?.[0]?.count || 0;

          return (
            <div 
              key={customer.id} 
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              onClick={() => setSelectedCustomer(customer)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    {customer.avatar_url ? (
                      <img 
                        className="h-12 w-12 rounded-full object-cover" 
                        src={customer.avatar_url} 
                        alt={customer.full_name || 'Customer'}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      {customer.full_name || 'Unnamed Customer'}
                    </h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color} mt-1`}>
                      {status.label}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => toggleActionMenu(e, customer.id)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  {customer.email}
                </div>
                {customer.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    {customer.phone}
                  </div>
                )}
                {customer.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    {customer.location}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <CreditCard className="w-3 h-3 mr-1" />
                    {totalBookings}
                  </span>
                  <span className="flex items-center">
                    <Heart className="w-3 h-3 mr-1" />
                    {totalFavorites}
                  </span>
                  <span className="flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    {totalReviews}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Joined {formatDate(customer.created_at)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Click outside to close action menu */}
      {showActionMenu && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowActionMenu(null)}
        />
      )}
    </div>
  );
};

export default CustomersList;