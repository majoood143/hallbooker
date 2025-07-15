import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import venueStatusService from '../../utils/venueStatusService';
import bookingStatusService from '../../utils/bookingStatusService';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import VenueStatusTabs from './components/VenueStatusTabs';
import VenuesList from './components/VenuesList';
import BookingsList from './components/BookingsList';
import StatusStatsCards from './components/StatusStatsCards';
import BulkActionsMenu from './components/BulkActionsMenu';
import FiltersPanel from './components/FiltersPanel';

const VenueStatusManagement = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('all-venues');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [venueStats, setVenueStats] = useState({});
  const [bookingStats, setBookingStats] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    venueType: '',
    sortBy: 'last_status_change',
    sortOrder: 'desc'
  });

  // Check if user is admin
  const isAdmin = userProfile?.role === 'admin';

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }

    if (!authLoading && isAdmin) {
      loadInitialData();
    }
  }, [authLoading, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      loadTabData();
    }
  }, [activeTab, filters, isAdmin]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [venueStatsResult, bookingStatsResult] = await Promise.all([
        venueStatusService.getVenueStatusStats(),
        bookingStatusService.getBookingStatusStats()
      ]);

      if (venueStatsResult?.success) {
        setVenueStats(venueStatsResult.data?.[0] || {});
      }

      if (bookingStatsResult?.success) {
        setBookingStats(bookingStatsResult.data?.[0] || {});
      }

    } catch (err) {
      setError('Failed to load initial data. Please try again.');
      console.log('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTabData = async () => {
    try {
      setError(null);
      setSelectedItems([]);

      if (activeTab.includes('venues')) {
        let status = null;
        if (activeTab === 'pending-reviews') status = 'under_review';
        else if (activeTab === 'active-venues') status = 'active';
        else if (activeTab === 'suspended-venues') status = 'suspended';

        const result = await venueStatusService.getVenuesByStatus(status, filters);
        
        if (result?.success) {
          setVenues(result.data || []);
        } else {
          setError(result?.error || 'Failed to load venues');
        }
      } else if (activeTab.includes('bookings')) {
        let status = null;
        if (activeTab === 'pending-bookings') status = 'pending';
        else if (activeTab === 'confirmed-bookings') status = 'confirmed';
        else if (activeTab === 'disputes') status = 'disputed';

        const result = await bookingStatusService.getBookingsByStatus(status, filters);
        
        if (result?.success) {
          setBookings(result.data || []);
        } else {
          setError(result?.error || 'Failed to load bookings');
        }
      }
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.log('Error loading tab data:', err);
    }
  };

  const handleStatusUpdate = async (itemId, newStatus, reason = null, notes = null) => {
    try {
      setError(null);
      
      let result;
      if (activeTab.includes('venues')) {
        result = await venueStatusService.updateVenueStatus(itemId, newStatus, reason, notes);
      } else {
        result = await bookingStatusService.updateBookingStatus(itemId, newStatus, notes);
      }

      if (result?.success) {
        await loadTabData();
        await loadInitialData(); // Refresh stats
      } else {
        setError(result?.error || 'Failed to update status');
      }
    } catch (err) {
      setError('Failed to update status. Please try again.');
      console.log('Error updating status:', err);
    }
  };

  const handleBulkAction = async (action, selectedIds, reason = null, notes = null) => {
    try {
      setError(null);

      let result;
      if (activeTab.includes('venues')) {
        result = await venueStatusService.bulkUpdateVenueStatus(selectedIds, action, reason, notes);
      } else {
        result = await bookingStatusService.bulkUpdateBookingStatus(selectedIds, action, notes);
      }

      if (result?.success) {
        setSelectedItems([]);
        await loadTabData();
        await loadInitialData(); // Refresh stats
      } else {
        setError(result?.error || 'Failed to perform bulk action');
      }
    } catch (err) {
      setError('Failed to perform bulk action. Please try again.');
      console.log('Error in bulk action:', err);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const tabs = [
    { id: 'all-venues', label: 'All Venues', count: venueStats?.total_venues || 0 },
    { id: 'pending-reviews', label: 'Pending Reviews', count: venueStats?.under_review_venues || 0 },
    { id: 'active-venues', label: 'Active Venues', count: venueStats?.active_venues || 0 },
    { id: 'suspended-venues', label: 'Suspended Venues', count: venueStats?.suspended_venues || 0 },
    { id: 'all-bookings', label: 'All Bookings', count: bookingStats?.total_bookings || 0 },
    { id: 'pending-bookings', label: 'Pending Bookings', count: bookingStats?.pending_bookings || 0 },
    { id: 'confirmed-bookings', label: 'Confirmed Bookings', count: bookingStats?.confirmed_bookings || 0 },
    { id: 'disputes', label: 'Disputes', count: bookingStats?.disputed_bookings || 0 }
  ];

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need administrator privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Venue Status Management</h1>
            <p className="mt-2 text-gray-600">
              Monitor and manage venue operational states and booking statuses
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <StatusStatsCards 
          venueStats={venueStats} 
          bookingStats={bookingStats}
          activeTab={activeTab}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-lg shadow">
          {/* Tab Navigation */}
          <VenueStatusTabs 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Filters Panel */}
          <FiltersPanel 
            filters={filters}
            onFiltersChange={handleFiltersChange}
            activeTab={activeTab}
          />

          {/* Error Message */}
          {error && (
            <div className="p-6">
              <ErrorMessage message={error} onRetry={loadTabData} />
            </div>
          )}

          {/* Bulk Actions */}
          {selectedItems?.length > 0 && (
            <div className="px-6 py-4 border-b">
              <BulkActionsMenu 
                selectedCount={selectedItems.length}
                onBulkAction={handleBulkAction}
                selectedItems={selectedItems}
                activeTab={activeTab}
              />
            </div>
          )}

          {/* Content Lists */}
          <div className="p-6">
            {activeTab.includes('venues') ? (
              <VenuesList 
                venues={venues}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                onStatusUpdate={handleStatusUpdate}
                loading={loading}
              />
            ) : (
              <BookingsList 
                bookings={bookings}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                onStatusUpdate={handleStatusUpdate}
                loading={loading}
                activeTab={activeTab}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueStatusManagement;