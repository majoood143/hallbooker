import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import userManagementService from '../../utils/userManagementService';
import CustomersList from './components/CustomersList';
import CustomersFilters from './components/CustomersFilters';
import CustomersStats from './components/CustomersStats';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { Users } from 'lucide-react';

const CustomersManagement = () => {
  const { userProfile, loading: authLoading } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeBookings: 0,
    totalRevenue: 0,
    averageRating: 0
  });

  // Check if user is admin
  const isAdmin = userProfile?.role === 'admin';

  useEffect(() => {
    if (!authLoading) {
      if (!isAdmin) {
        setError('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }
      loadCustomers();
    }
  }, [authLoading, isAdmin, filters]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await userManagementService.getCustomers(filters);
      
      if (result?.success) {
        setCustomers(result.data || []);
        
        // Calculate stats
        const customerData = result.data || [];
        const totalBookings = customerData.reduce((sum, customer) => 
          sum + (customer.bookings?.[0]?.count || 0), 0);
        
        setStats({
          totalCustomers: customerData.length,
          activeBookings: totalBookings,
          totalRevenue: totalBookings * 350, // Estimated average
          averageRating: 4.6 // Placeholder
        });
      } else {
        setError(result?.error || 'Failed to load customers');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.log('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleCustomerAction = async (customerId, action, data) => {
    try {
      let result;
      
      switch (action) {
        case 'updateRole':
          result = await userManagementService.updateUserRole(customerId, data.role);
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
            result = await userManagementService.deleteUser(customerId);
          }
          break;
        default:
          return;
      }

      if (result?.success) {
        loadCustomers(); // Reload data
      } else {
        setError(result?.error || `Failed to ${action} customer`);
      }
    } catch (err) {
      setError(`An error occurred while performing ${action}`);
      console.log(`Error performing ${action}:`, err);
    }
  };

  if (authLoading) {
    return <LoadingSpinner message="Initializing..." />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Admin privileges are required to access customer management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Users className="w-8 h-8 text-blue-600 mr-3" />
                  Customer Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage customer accounts, analyze booking patterns, and track engagement metrics
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium text-blue-700">
                    {customers?.length || 0} Total Customers
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <CustomersStats stats={stats} loading={loading} />

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <CustomersFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {error && (
            <div className="p-6 border-b border-gray-200">
              <ErrorMessage message={error} onRetry={loadCustomers} />
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Loading customers..." />
          ) : (
            <CustomersList 
              customers={customers} 
              onCustomerAction={handleCustomerAction}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersManagement;