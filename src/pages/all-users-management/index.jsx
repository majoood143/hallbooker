import React, { useState, useEffect } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import userManagementService from '../../utils/userManagementService';
import UserFilters from './components/UserFilters';
import UserTable from './components/UserTable';
import UserDetailsModal from './components/UserDetailsModal';
import BulkActionsMenu from './components/BulkActionsMenu';
import ExportModal from './components/ExportModal';

const AllUsersManagementPage = () => {
  const { user, userProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    location: '',
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    activeCustomers: 0,
    activeVenueOwners: 0,
    adminUsers: 0
  });

  useEffect(() => {
    loadUsers();
    loadStatistics();
  }, [filters, pagination.page, pagination.limit, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const searchFilters = {
        ...filters,
        search: searchTerm
      };

      const result = await userManagementService.getAllUsers(searchFilters, {
        page: pagination.page,
        limit: pagination.limit
      });

      if (result?.success) {
        setUsers(result.data || []);
        setPagination(prev => ({
          ...prev,
          total: result.count || 0
        }));
      } else {
        setError(result?.error || 'Failed to load users');
      }
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.log('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const result = await userManagementService.getUserStatistics();
      if (result?.success) {
        setStatistics(result.data);
      }
    } catch (err) {
      console.log('Error loading statistics:', err);
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

  const handleUserSelect = (userId, isSelected) => {
    const newSelected = new Set(selectedUsers);
    if (isSelected) {
      newSelected.add(userId);
    } else {
      newSelected.delete(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedUsers(new Set(users?.map(user => user?.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleUserAction = async (action, userId) => {
    try {
      setError(null);
      
      switch (action) {
        case 'view':
          const user = users?.find(u => u?.id === userId);
          setSelectedUser(user);
          setShowUserDetails(true);
          break;
        case 'suspend':
          await userManagementService.updateUserStatus(userId, false);
          loadUsers();
          break;
        case 'activate':
          await userManagementService.updateUserStatus(userId, true);
          loadUsers();
          break;
        default:
          break;
      }
    } catch (err) {
      setError('Action failed. Please try again.');
      console.log('Error performing user action:', err);
    }
  };

  const handleBulkAction = async (action, userIds) => {
    try {
      setError(null);
      
      switch (action) {
        case 'suspend':
          await Promise.all(userIds?.map(id => userManagementService.updateUserStatus(id, false)));
          break;
        case 'activate':
          await Promise.all(userIds?.map(id => userManagementService.updateUserStatus(id, true)));
          break;
        case 'export':
          setShowExportModal(true);
          return;
        default:
          break;
      }
      
      setSelectedUsers(new Set());
      loadUsers();
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
  // if (!userProfile || userProfile?.role !== 'admin') {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
  //         <p className="text-gray-600">You need administrator privileges to access this page.</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">All Users Management</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Comprehensive oversight of all platform users
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

            {/* Statistics Cards */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">All</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="text-lg font-medium text-gray-900">{statistics?.totalUsers}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">C</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Customers</dt>
                        <dd className="text-lg font-medium text-gray-900">{statistics?.activeCustomers}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">V</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Venue Owners</dt>
                        <dd className="text-lg font-medium text-gray-900">{statistics?.activeVenueOwners}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">A</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Admins</dt>
                        <dd className="text-lg font-medium text-gray-900">{statistics?.adminUsers}</dd>
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
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <UserFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
            onClose={() => setShowFilters(false)}
          />
        )}

        {/* Bulk Actions */}
        {selectedUsers?.size > 0 && (
          <div className="mb-4">
            <BulkActionsMenu
              selectedCount={selectedUsers?.size}
              onAction={handleBulkAction}
              selectedUsers={Array.from(selectedUsers)}
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

        {/* Users Table */}
        <UserTable
          users={users}
          loading={loading}
          selectedUsers={selectedUsers}
          onUserSelect={handleUserSelect}
          onSelectAll={handleSelectAll}
          onUserAction={handleUserAction}
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>

      {/* Modals */}
      {showUserDetails && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => {
            setShowUserDetails(false);
            setSelectedUser(null);
          }}
        />
      )}

      {showExportModal && (
        <ExportModal
          users={users}
          selectedUsers={Array.from(selectedUsers)}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};

export default AllUsersManagementPage;