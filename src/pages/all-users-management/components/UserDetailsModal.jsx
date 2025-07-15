import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, Activity, Settings } from 'lucide-react';
import { format } from 'date-fns';
import userManagementService from '../../../utils/userManagementService';
import Icon from '../../../components/AppIcon';


const UserDetailsModal = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [activityLogs, setActivityLogs] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  useEffect(() => {
    if (activeTab === 'activity') {
      loadActivityLogs();
    }
  }, [activeTab, user?.id]);

  const loadActivityLogs = async () => {
    try {
      setLoadingActivity(true);
      const result = await userManagementService.getUserActivityLogs(user?.id, 20);
      if (result?.success) {
        setActivityLogs(result.data || []);
      }
    } catch (err) {
      console.log('Error loading activity logs:', err);
    } finally {
      setLoadingActivity(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'N/A';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'venue_owner':
        return 'bg-purple-100 text-purple-800';
      case 'customer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRole = (role) => {
    switch (role) {
      case 'venue_owner':
        return 'Venue Owner';
      case 'customer':
        return 'Customer';
      case 'admin':
        return 'Admin';
      default:
        return role || 'Unknown';
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {user?.avatar_url ? (
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={user?.avatar_url}
                      alt={user?.full_name || 'User'}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-700">
                        {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{user?.full_name || 'Unknown'}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <div className="ml-4">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRoleBadgeColor(user?.role)}`}>
                    {formatRole(user?.role)}
                  </span>
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
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Email</div>
                        <div className="text-sm text-gray-600">{user?.email || 'Not provided'}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Phone</div>
                        <div className="text-sm text-gray-600">{user?.phone || 'Not provided'}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Location</div>
                        <div className="text-sm text-gray-600">{user?.location || 'Not provided'}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Registered</div>
                        <div className="text-sm text-gray-600">{formatDate(user?.created_at)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role-specific Information */}
                {user?.role === 'venue_owner' && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Venue Owner Details</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{user?.venues?.length || 0}</div>
                          <div className="text-sm text-gray-600">Active Venues</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{user?.total_bookings?.[0]?.count || 0}</div>
                          <div className="text-sm text-gray-600">Total Bookings</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            ${user?.total_revenue?.[0]?.sum || 0}
                          </div>
                          <div className="text-sm text-gray-600">Total Revenue</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {user?.role === 'customer' && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Customer Details</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{user?.bookings_as_customer?.[0]?.count || 0}</div>
                          <div className="text-sm text-gray-600">Total Bookings</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">0</div>
                          <div className="text-sm text-gray-600">Favorite Venues</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h4>
                {loadingActivity ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading activity...</span>
                  </div>
                ) : activityLogs?.length > 0 ? (
                  <div className="space-y-3">
                    {activityLogs?.map((log) => (
                      <div key={log?.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{log?.description}</div>
                            <div className="text-xs text-gray-500 mt-1">{log?.activity_type}</div>
                          </div>
                          <div className="text-xs text-gray-500">{formatDate(log?.created_at)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <div>No activity logs found</div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h4>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Preferences</h5>
                    <div className="text-sm text-gray-600">
                      <pre className="whitespace-pre-wrap bg-white p-3 rounded border">
                        {JSON.stringify(user?.preferences || {}, null, 2)}
                      </pre>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Account Status</h5>
                    <div className="text-sm text-gray-600">
                      <div>Last Updated: {formatDate(user?.updated_at)}</div>
                      <div>Account Type: {formatRole(user?.role)}</div>
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

export default UserDetailsModal;