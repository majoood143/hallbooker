import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import BookingStatusIndicator from '../../components/ui/BookingStatusIndicator';
import QuickActionMenu from '../../components/ui/QuickActionMenu';
import SearchContextPreserver from '../../components/ui/SearchContextPreserver';
import AdminSidebar from './components/AdminSidebar';
import KPICards from './components/KPICards';
import ActivityFeed from './components/ActivityFeed';
import PendingApprovals from './components/PendingApprovals';
import SystemAlerts from './components/SystemAlerts';
import QuickStats from './components/QuickStats';
import RevenueChart from './components/RevenueChart';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AdminManagementPanel = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  // Mock admin user data
  const adminUser = {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@hallbooker.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  };

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      // In real app, this would fetch latest data from Supabase
      console.log('Refreshing admin dashboard data...');
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
    // In real app, this would trigger data refetch with new time range
    console.log('Time range changed to:', range);
  };

  const handleRefreshData = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleStatusClick = (status) => {
    console.log('Admin viewing booking status:', status);
    navigate('/booking-management-payment');
  };

  const handleQuickAction = (action, selectedItems) => {
    console.log('Admin quick action:', action, selectedItems);
    
    switch (action.id) {
      case 'review-venues':
        // Navigate to venue review section
        break;
      case 'manage-users':
        // Navigate to user management section
        break;
      case 'system-alerts':
        // Scroll to system alerts section
        document.getElementById('system-alerts')?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        console.log('Unhandled action:', action.id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <RoleBasedNavigation 
        user={adminUser} 
        onNavigate={handleNavigation}
      />

      {/* Search Context Preservation */}
      <SearchContextPreserver />

      <div className="flex h-screen">
        {/* Sidebar */}
        <AdminSidebar 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleSidebarToggle}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="container-padding section-spacing">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
                <p className="text-text-secondary mt-1">
                  Platform overview and management tools
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Time Range Selector */}
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" size={16} color="var(--color-text-muted)" />
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => handleTimeRangeChange(e.target.value)}
                    className="form-input text-sm py-1 px-2 min-w-0"
                  >
                    {timeRangeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Refresh Button */}
                <Button
                  variant="outline"
                  iconName="RefreshCw"
                  iconSize={16}
                  onClick={handleRefreshData}
                  loading={refreshing}
                  className="text-sm"
                >
                  Refresh
                </Button>

                {/* Export Button */}
                <Button
                  variant="primary"
                  iconName="Download"
                  iconSize={16}
                  className="text-sm"
                >
                  Export Report
                </Button>
              </div>
            </div>

            {/* KPI Cards */}
            <KPICards />

            {/* Quick Stats */}
            <QuickStats />

            {/* Revenue Chart */}
            <div className="mb-8">
              <RevenueChart />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Activity Feed */}
              <ActivityFeed />

              {/* Pending Approvals */}
              <PendingApprovals />
            </div>

            {/* System Alerts */}
            <div id="system-alerts" className="mb-8">
              <SystemAlerts />
            </div>

            {/* Additional Admin Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Platform Health */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">Platform Health</h3>
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">API Response Time</span>
                    <span className="text-sm font-medium text-success">142ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Database Load</span>
                    <span className="text-sm font-medium text-warning">68%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Active Sessions</span>
                    <span className="text-sm font-medium text-text-primary">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Error Rate</span>
                    <span className="text-sm font-medium text-success">0.02%</span>
                  </div>
                </div>
              </div>

              {/* Recent Registrations */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">Recent Registrations</h3>
                  <Icon name="UserPlus" size={20} color="var(--color-primary)" />
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-text-primary">23</p>
                    <p className="text-sm text-text-muted">Today</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-text-primary">18</p>
                      <p className="text-xs text-text-muted">Customers</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-text-primary">5</p>
                      <p className="text-xs text-text-muted">Venue Owners</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Metrics */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">Support Metrics</h3>
                  <Icon name="MessageSquare" size={20} color="var(--color-secondary)" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Open Tickets</span>
                    <span className="text-sm font-medium text-warning">17</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Avg Response Time</span>
                    <span className="text-sm font-medium text-success">2.3h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Resolution Rate</span>
                    <span className="text-sm font-medium text-success">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Satisfaction Score</span>
                    <span className="text-sm font-medium text-success">4.8/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Components */}
      <BookingStatusIndicator 
        userRole="admin"
        onStatusClick={handleStatusClick}
      />

      <QuickActionMenu
        userRole="admin"
        currentScreen="admin-management-panel"
        onActionClick={handleQuickAction}
      />
    </div>
  );
};

export default AdminManagementPanel;