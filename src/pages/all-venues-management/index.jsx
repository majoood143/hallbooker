import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, MoreVertical, Check, X } from 'lucide-react';
import VenueFilters from './components/VenueFilters';
import VenueTable from './components/VenueTable';
import VenueDetailsModal from './components/VenueDetailsModal';
import BulkActionsMenu from './components/BulkActionsMenu';
import venueManagementService from '../../utils/venueManagementService';
import { useAuth } from '../../contexts/AuthContext';

const AllVenuesManagement = () => {
  const { user, userProfile } = useAuth();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedVenues, setSelectedVenues] = useState([]);
  const [filters, setFilters] = useState({
    venueType: '',
    approvalStatus: '',
    location: '',
    capacity: { min: '', max: '' },
    pricing: { min: '', max: '' }
  });

  // Load venues on component mount
  useEffect(() => {
    if (userProfile?.role === 'admin') {
      loadVenues();
    }
  }, [userProfile]);

  const loadVenues = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await venueManagementService.getAllVenues();
      
      if (result?.success) {
        setVenues(result.data || []);
      } else {
        setError(result?.error || 'Failed to load venues');
      }
    } catch (err) {
      setError('Failed to load venues. Please try again.');
      console.log('Load venues error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search venues
  const filteredVenues = useMemo(() => {
    let filtered = [...venues];

    // Search filter
    if (searchTerm?.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(venue => 
        venue?.name?.toLowerCase()?.includes(term) ||
        venue?.location?.toLowerCase()?.includes(term) ||
        venue?.owner_name?.toLowerCase()?.includes(term)
      );
    }

    // Venue type filter
    if (filters?.venueType) {
      filtered = filtered.filter(venue => venue?.venue_type === filters.venueType);
    }

    // Approval status filter
    if (filters?.approvalStatus) {
      filtered = filtered.filter(venue => {
        if (filters.approvalStatus === 'approved') return venue?.is_active === true;
        if (filters.approvalStatus === 'suspended') return venue?.is_active === false;
        return true;
      });
    }

    // Location filter
    if (filters?.location?.trim()) {
      filtered = filtered.filter(venue => 
        venue?.location?.toLowerCase()?.includes(filters.location.toLowerCase())
      );
    }

    // Capacity filter
    if (filters?.capacity?.min) {
      filtered = filtered.filter(venue => venue?.capacity >= parseInt(filters.capacity.min));
    }
    if (filters?.capacity?.max) {
      filtered = filtered.filter(venue => venue?.capacity <= parseInt(filters.capacity.max));
    }

    // Pricing filter
    if (filters?.pricing?.min) {
      filtered = filtered.filter(venue => venue?.price_per_hour >= parseFloat(filters.pricing.min));
    }
    if (filters?.pricing?.max) {
      filtered = filtered.filter(venue => venue?.price_per_hour <= parseFloat(filters.pricing.max));
    }

    return filtered;
  }, [venues, searchTerm, filters]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = venues?.length || 0;
    const active = venues?.filter(v => v?.is_active)?.length || 0;
    const suspended = venues?.filter(v => !v?.is_active)?.length || 0;
    const totalRevenue = venues?.reduce((sum, v) => sum + (v?.total_revenue || 0), 0) || 0;

    return {
      total,
      active,
      suspended,
      totalRevenue: totalRevenue.toFixed(2)
    };
  }, [venues]);

  const handleVenueAction = async (action, venueId) => {
    try {
      let result;
      
      switch (action) {
        case 'approve':
          result = await venueManagementService.updateVenueStatus(venueId, true);
          break;
        case 'suspend':
          result = await venueManagementService.updateVenueStatus(venueId, false);
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this venue? This action cannot be undone.')) {
            result = await venueManagementService.deleteVenue(venueId);
          }
          break;
        default:
          return;
      }

      if (result?.success) {
        await loadVenues();
      } else {
        setError(result?.error || `Failed to ${action} venue`);
      }
    } catch (err) {
      setError(`Failed to ${action} venue. Please try again.`);
      console.log(`${action} venue error:`, err);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedVenues?.length === 0) return;

    try {
      let result;
      
      switch (action) {
        case 'approve':
          result = await venueManagementService.bulkUpdateVenueStatus(selectedVenues, true);
          break;
        case 'suspend':
          result = await venueManagementService.bulkUpdateVenueStatus(selectedVenues, false);
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${selectedVenues.length} venues? This action cannot be undone.`)) {
            result = await venueManagementService.bulkDeleteVenues(selectedVenues);
          }
          break;
        default:
          return;
      }

      if (result?.success) {
        setSelectedVenues([]);
        setShowBulkActions(false);
        await loadVenues();
      } else {
        setError(result?.error || `Failed to ${action} venues`);
      }
    } catch (err) {
      setError(`Failed to ${action} venues. Please try again.`);
      console.log(`Bulk ${action} error:`, err);
    }
  };

  const handleVenueSelect = (venueId, isSelected) => {
    if (isSelected) {
      setSelectedVenues(prev => [...prev, venueId]);
    } else {
      setSelectedVenues(prev => prev.filter(id => id !== venueId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedVenues(filteredVenues?.map(v => v?.id) || []);
    } else {
      setSelectedVenues([]);
    }
  };

  const openVenueDetails = (venue) => {
    setSelectedVenue(venue);
    setShowDetailsModal(true);
  };

  // Check admin access
  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">All Venues Management</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Comprehensive oversight of the entire venue inventory
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-xs text-blue-500">Total Venues</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                  <div className="text-xs text-green-500">Active</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
                  <div className="text-xs text-red-500">Suspended</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">${stats.totalRevenue}</div>
                  <div className="text-xs text-purple-500">Total Revenue</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by venue name, owner, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {selectedVenues?.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Bulk Actions ({selectedVenues.length})
                    <MoreVertical className="ml-2 w-4 h-4" />
                  </button>
                  
                  {showBulkActions && (
                    <BulkActionsMenu
                      onAction={handleBulkAction}
                      onClose={() => setShowBulkActions(false)}
                    />
                  )}
                </div>
              )}
              
              <button
                onClick={() => setFilters({
                  venueType: '',
                  approvalStatus: '',
                  location: '',
                  capacity: { min: '', max: '' },
                  pricing: { min: '', max: '' }
                })}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Filter className="mr-2 w-4 h-4" />
                Clear Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <VenueFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <X className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-sm text-red-600 hover:text-red-500 underline mt-2"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Venues Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <VenueTable
            venues={filteredVenues}
            loading={loading}
            selectedVenues={selectedVenues}
            onVenueSelect={handleVenueSelect}
            onSelectAll={handleSelectAll}
            onVenueAction={handleVenueAction}
            onViewDetails={openVenueDetails}
          />
        </div>

        {/* Venue Details Modal */}
        {showDetailsModal && selectedVenue && (
          <VenueDetailsModal
            venue={selectedVenue}
            onClose={() => setShowDetailsModal(false)}
            onAction={handleVenueAction}
          />
        )}
      </div>
    </div>
  );
};

export default AllVenuesManagement;