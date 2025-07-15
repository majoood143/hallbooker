import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AdminSidebar = ({ isCollapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    users: false,
    venues: false,
    bookings: false,
    payments: false,
    reports: false,
    settings: false
  });

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/admin-management-panel',
      isActive: location.pathname === '/admin-management-panel'
    },
    {
      id: 'users',
      label: 'Users',
      icon: 'Users',
      expandable: true,
      children: [
        { 
          label: 'All Users', 
          count: 1247, 
          path: '/all-users-management',
          isActive: location.pathname === '/all-users-management'
        },
        { 
          label: 'Venue Owners', 
          count: 89, 
          path: '/venue-owners-management',
          isActive: location.pathname === '/venue-owners-management'
        },
        { 
          label: 'Customers', 
          count: 1158, 
          path: '/customers-management',
          isActive: location.pathname === '/customers-management'
        },
        { 
          label: 'Pending Approvals', 
          count: 12, 
          alert: true, 
          path: '/pending-approvals-management',
          isActive: location.pathname === '/pending-approvals-management'
        }
      ]
    },
    {
      id: 'venues',
      label: 'Venues',
      icon: 'Building2',
      expandable: true,
      children: [
        { 
          label: 'All Venues', 
          count: 234, 
          path: '/all-venues-management',
          isActive: location.pathname === '/all-venues-management'
        },
        { 
          label: 'Pending Review', 
          count: 8, 
          alert: true, 
          path: '/pending-reviews-management',
          isActive: location.pathname === '/pending-reviews-management'
        },
        { 
          label: 'Active Venues', 
          count: 198, 
          path: '/venue-status-management',
          isActive: location.pathname === '/venue-status-management'
        },
        { 
          label: 'Suspended', 
          count: 28, 
          path: '/venue-status-management',
          isActive: location.pathname === '/venue-status-management'
        }
      ]
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: 'Calendar',
      expandable: true,
      children: [
        { 
          label: 'All Bookings', 
          count: 1456, 
          path: '/venue-status-management',
          isActive: location.pathname === '/venue-status-management'
        },
        { 
          label: 'Pending', 
          count: 23, 
          alert: true, 
          path: '/venue-status-management',
          isActive: location.pathname === '/venue-status-management'
        },
        { 
          label: 'Confirmed', 
          count: 1234, 
          path: '/venue-status-management',
          isActive: location.pathname === '/venue-status-management'
        },
        { 
          label: 'Disputes', 
          count: 5, 
          alert: true, 
          path: '/venue-status-management',
          isActive: location.pathname === '/venue-status-management'
        }
      ]
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: 'CreditCard',
      expandable: true,
      children: [
        { 
          label: 'All Transactions', 
          count: 2341, 
          path: '/booking-management-payment',
          isActive: location.pathname === '/booking-management-payment'
        },
        { 
          label: 'Pending Payouts', 
          count: 45, 
          alert: true, 
          path: '/booking-management-payment',
          isActive: location.pathname === '/booking-management-payment'
        },
        { 
          label: 'Refunds', 
          count: 67, 
          path: '/booking-management-payment',
          isActive: location.pathname === '/booking-management-payment'
        },
        { 
          label: 'Failed Payments', 
          count: 12, 
          alert: true, 
          path: '/booking-management-payment',
          isActive: location.pathname === '/booking-management-payment'
        }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: 'BarChart3',
      expandable: true,
      children: [
        { 
          label: 'Revenue Reports', 
          path: '/admin-management-panel',
          isActive: location.pathname === '/admin-management-panel'
        },
        { 
          label: 'User Analytics', 
          path: '/all-users-management',
          isActive: location.pathname === '/all-users-management'
        },
        { 
          label: 'Venue Performance', 
          path: '/all-venues-management',
          isActive: location.pathname === '/all-venues-management'
        },
        { 
          label: 'Booking Trends', 
          path: '/venue-status-management',
          isActive: location.pathname === '/venue-status-management'
        }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'Settings',
      expandable: true,
      children: [
        { 
          label: 'Platform Settings', 
          path: '/platform-settings-configuration',
          isActive: location.pathname === '/platform-settings-configuration'
        },
        { 
          label: 'Payment Gateways', 
          path: '/payment-gateway-settings',
          isActive: location.pathname === '/payment-gateway-settings'
        },
        { 
          label: 'Email Templates', 
          path: '/admin-management-panel',
          isActive: location.pathname === '/admin-management-panel'
        },
        { 
          label: 'System Configuration', 
          path: '/system-configuration-management',
          isActive: location.pathname === '/system-configuration-management'
        }
      ]
    }
  ];

  const toggleSection = (sectionId) => {
    if (!isCollapsed) {
      setExpandedSections(prev => ({
        ...prev,
        [sectionId]: !prev[sectionId]
      }));
    }
  };

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const handleChildNavigation = (childItem) => {
    if (childItem?.path) {
      navigate(childItem.path);
    }
  };

  // Check if any child is active to highlight parent
  const isParentActive = (item) => {
    if (item?.isActive) return true;
    if (item?.children) {
      return item.children.some(child => child?.isActive);
    }
    return false;
  };

  return (
    <div className={`bg-surface border-r border-border h-full flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={20} color="white" />
              </div>
              <span className="text-lg font-semibold text-text-primary">Admin Panel</span>
            </div>
          )}
          <Button
            variant="ghost"
            iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
            iconSize={16}
            onClick={onToggleCollapse}
            className="p-2"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navigationItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.expandable) {
                    toggleSection(item.id);
                  } else {
                    handleNavigation(item.path);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isParentActive(item)
                    ? 'bg-primary-50 text-primary' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon name={item.icon} size={18} />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {!isCollapsed && item.expandable && (
                  <Icon 
                    name="ChevronDown" 
                    size={14} 
                    className={`transition-transform duration-200 ${
                      expandedSections[item.id] ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>

              {/* Expanded Children */}
              {!isCollapsed && item.expandable && expandedSections[item.id] && (
                <div className="mt-1 ml-6 space-y-1">
                  {item.children.map((child, index) => (
                    <button
                      key={index}
                      onClick={() => handleChildNavigation(child)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors duration-200 ${
                        child?.isActive 
                          ? 'bg-primary-50 text-primary font-medium' :'text-text-muted hover:text-text-secondary hover:bg-secondary-50'
                      }`}
                    >
                      <span>{child.label}</span>
                      <div className="flex items-center space-x-2">
                        {child.count && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            child.alert 
                              ? 'bg-error-100 text-error-700' :'bg-secondary-100 text-secondary-700'
                          }`}>
                            {child.count}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {!isCollapsed && (
          <div className="text-xs text-text-muted">
            <p>HallBooker Admin v2.1</p>
            <p>© {new Date().getFullYear()} All rights reserved</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;