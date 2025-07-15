import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Building2, DollarSign, Star, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import userManagementService from '../../utils/userManagementService';
import VenueOwnerFilters from './components/VenueOwnerFilters';
import VenueOwnerTable from './components/VenueOwnerTable';
import VenueOwnerDetailsModal from './components/VenueOwnerDetailsModal';
import BulkActionsMenu from './components/BulkActionsMenu';
import ExportModal from './components/ExportModal';

const VenueOwnersManagementPage = () => {
  const { user, userProfile } = useAuth();
  const [venueOwners, setVenueOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVenueOwners, setSelectedVenueOwners] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    verification: 'all',
    performance: 'all',
    region: '',
    propertyCount: 'all',
    revenueRange: 'all',
    dateFrom: '',
    dateTo: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVenueOwner, setSelectedVenueOwner] = useState(null);
  const [showVenueOwnerDetails, setShowVenueOwnerDetails] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [metrics, setMetrics] = useState({
    totalVenueOwners: 0,
    activeProperties: 0,
    pendingVerifications: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    loadVenueOwners();
    loadMetrics();
  }, [filters, pagination.page, pagination.limit, searchTerm]);

  const loadVenueOwners = async () => {
    try {
      setLoading(true);
      setError(null);

      const searchFilters = {
        ...filters,
        search: searchTerm
      };

      const result = await userManagementService.getVenueOwners(searchFilters, {
        page: pagination.page,
        limit: pagination.limit
      });

      if (result?.success) {
        setVenueOwners(result.data || []);
        setPagination(prev => ({
          ...prev,
          total: result.count || 0
        }));
      } else {
        setError(result?.error || 'Failed to load venue owners');
      }
    } catch (err) {
      setError('Failed to load venue owners. Please try again.');
      console.log('Error loading venue owners:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async () => {
    try {
      // Calculate metrics from venue owners data
      const result = await userManagementService.getVenueOwners({}, { page: 1, limit: 1000 });
      if (result?.success) {
        const owners = result.data || [];
        const totalVenueOwners = owners?.length;
        const activeProperties = owners?.reduce((sum, owner) => sum + (owner?.venues?.length || 0), 0);
        const pendingVerifications = owners?.filter(owner => !owner?.venues?.length)?.length;
        const totalRevenue = owners?.reduce((sum, owner) => sum + (owner?.total_revenue?.[0]?.sum || 0), 0);

        setMetrics({
          totalVenueOwners,
          activeProperties,
          pendingVerifications,
          totalRevenue
        });
      }
    } catch (err) {
      console.log('Error loading metrics:', err);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleVenueOwnerSelect = (ownerId, isSelected) => {
    const newSelected = new Set(selectedVenueOwners);
    if (isSelected) {
      newSelected.add(ownerId);
    } else {
      newSelected.delete(ownerId);
    }
    setSelectedVenueOwners(newSelected);
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedVenueOwners(new Set(venueOwners?.map(owner => owner?.id)));
    } else {
      setSelectedVenueOwners(new Set());
    }
  };

  const handleVenueOwnerAction = async (action, ownerId) => {
    try {
      setError(null);
      
      switch (action) {
        case 'view':
          const owner = venueOwners?.find(o => o?.id === ownerId);
          setSelectedVenueOwner(owner);
          setShowVenueOwnerDetails(true);
          break;
        case 'verify':
          // Implement verification logic
          console.log('Verify venue owner:', ownerId);
          break;
        case 'suspend':
          await userManagementService.updateUserStatus(ownerId, false);
          loadVenueOwners();
          break;
        case 'activate':
          await userManagementService.updateUserStatus(ownerId, true);
          loadVenueOwners();
          break;
        default:
          break;
      }
    } catch (err) {
      setError('Action failed. Please try again.');
      console.log('Error performing venue owner action:', err);
    }
  };

  const handleBulkAction = async (action, ownerIds) => {
    try {
      setError(null);
      
      switch (action) {
        case 'verify':
          // Implement bulk verification logic
          console.log('Bulk verify venue owners:', ownerIds);
          break;
        case 'suspend':
          await Promise.all(ownerIds?.map(id => userManagementService.updateUserStatus(id, false)));
          break;
        case 'activate':
          await Promise.all(ownerIds?.map(id => userManagementService.updateUserStatus(id, true)));
          break;
        case 'export':
          setShowExportModal(true);
          return;
        default:
          break;
      }
      
      setSelectedVenueOwners(new Set());
      loadVenueOwners();
    } catch (err) {
      setError('Bulk action failed. Please try again.');
      console.log('Error performing bulk action:', err);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  // Check if user has admin privileges
  if (!userProfile || userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You need administrator privileges to access this page.</p>
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Venue Owners Management</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Specialized oversight for property managers and venue operators
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowExportModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </button>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Venue Owners</dt>
                        <dd className="text-lg font-medium text-gray-900">{metrics?.totalVenueOwners}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Building2 className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Properties</dt>
                        <dd className="text-lg font-medium text-gray-900">{metrics?.activeProperties}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Star className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Pending Verifications</dt>
                        <dd className="text-lg font-medium text-gray-900">{metrics?.pendingVerifications}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          ${metrics?.totalRevenue?.toLocaleString() || '0'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <VenueOwnerFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
            onClose={() => setShowFilters(false)}
          />
        )}

        {/* Bulk Actions */}
        {selectedVenueOwners?.size > 0 && (
          <div className="mb-4">
            <BulkActionsMenu
              selectedCount={selectedVenueOwners?.size}
              onAction={handleBulkAction}
              selectedVenueOwners={Array.from(selectedVenueOwners)}
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Venue Owners Table */}
        <VenueOwnerTable
          venueOwners={venueOwners}
          loading={loading}
          selectedVenueOwners={selectedVenueOwners}
          onVenueOwnerSelect={handleVenueOwnerSelect}
          onSelectAll={handleSelectAll}
          onVenueOwnerAction={handleVenueOwnerAction}
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>

      {/* Modals */}
      {showVenueOwnerDetails && selectedVenueOwner && (
        <VenueOwnerDetailsModal
          venueOwner={selectedVenueOwner}
          onClose={() => {
            setShowVenueOwnerDetails(false);
            setSelectedVenueOwner(null);
          }}
        />
      )}

      {showExportModal && (
        <ExportModal
          venueOwners={venueOwners}
          selectedVenueOwners={Array.from(selectedVenueOwners)}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};

export default VenueOwnersManagementPage;