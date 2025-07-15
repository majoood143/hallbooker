import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import userManagementService from '../../utils/userManagementService';
import ApprovalsList from './components/ApprovalsList';
import ApprovalsFilters from './components/ApprovalsFilters';
import ApprovalsStats from './components/ApprovalsStats';
import LoadingSpinner from '../customers-management/components/LoadingSpinner';
import ErrorMessage from '../customers-management/components/ErrorMessage';
import { Clock, AlertTriangle, Users } from 'lucide-react';

const PendingApprovalsManagement = () => {
  const { userProfile, loading: authLoading } = useAuth();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    venue: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  const [stats, setStats] = useState({
    totalPending: 0,
    avgProcessingTime: '2.3 days',
    urgentItems: 0,
    completedToday: 0
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
      loadApprovals();
    }
  }, [authLoading, isAdmin, filters]);

  const loadApprovals = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await userManagementService.getPendingApprovals(filters);
      
      if (result?.success) {
        const approvalsData = result.data || [];
        setApprovals(approvalsData);
        
        // Calculate stats
        const urgentItems = approvalsData.filter(approval => {
          const daysSinceCreated = Math.floor(
            (new Date() - new Date(approval.created_at)) / (1000 * 60 * 60 * 24)
          );
          return daysSinceCreated > 2;
        }).length;

        setStats({
          totalPending: approvalsData.length,
          avgProcessingTime: '2.3 days',
          urgentItems: urgentItems,
          completedToday: 0 // Placeholder
        });
      } else {
        setError(result?.error || 'Failed to load pending approvals');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.log('Error loading approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleApprovalAction = async (bookingId, action) => {
    try {
      let status;
      switch (action) {
        case 'approve':
          status = 'confirmed';
          break;
        case 'reject':
          status = 'cancelled';
          break;
        default:
          return;
      }

      const result = await userManagementService.updateBookingStatus(bookingId, status);

      if (result?.success) {
        loadApprovals(); // Reload data
        // You could show a success message here
      } else {
        setError(result?.error || `Failed to ${action} booking`);
      }
    } catch (err) {
      setError(`An error occurred while ${action}ing booking`);
      console.log(`Error ${action}ing booking:`, err);
    }
  };

  const handleBulkApproval = async (bookingIds, action) => {
    try {
      const promises = bookingIds.map(id => 
        userManagementService.updateBookingStatus(id, action === 'approve' ? 'confirmed' : 'cancelled')
      );

      await Promise.all(promises);
      loadApprovals(); // Reload data
    } catch (err) {
      setError('An error occurred during bulk operation');
      console.log('Error in bulk operation:', err);
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
          <p className="text-gray-600">Admin privileges are required to access approval management.</p>
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
                  <Clock className="w-8 h-8 text-orange-600 mr-3" />
                  Pending Approvals Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Review and manage pending booking requests, venue verifications, and policy violations
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-orange-50 px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium text-orange-700">
                    {approvals?.length || 0} Pending Items
                  </span>
                </div>
                {stats.urgentItems > 0 && (
                  <div className="bg-red-50 px-4 py-2 rounded-lg flex items-center">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-red-700">
                      {stats.urgentItems} Urgent
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <ApprovalsStats stats={stats} loading={loading} />

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <ApprovalsFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {error && (
            <div className="p-6 border-b border-gray-200">
              <ErrorMessage message={error} onRetry={loadApprovals} />
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Loading pending approvals..." />
          ) : (
            <ApprovalsList 
              approvals={approvals} 
              onApprovalAction={handleApprovalAction}
              onBulkAction={handleBulkApproval}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalsManagement;