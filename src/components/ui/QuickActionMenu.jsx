import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionMenu = ({ userRole, currentScreen, selectedVenues, onActionClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quickActions, setQuickActions] = useState([]);

  // Define actions based on user role and current screen
  useEffect(() => {
    const actionsByRole = {
      venue_owner: {
        'venue-owner-dashboard': [
          {
            id: 'block-dates',
            label: 'Block Dates',
            icon: 'CalendarX',
            color: 'warning',
            description: 'Block unavailable dates'
          },
          {
            id: 'update-pricing',
            label: 'Update Pricing',
            icon: 'DollarSign',
            color: 'primary',
            description: 'Modify venue pricing'
          },
          {
            id: 'respond-booking',
            label: 'Respond to Bookings',
            icon: 'MessageSquare',
            color: 'success',
            description: 'Reply to booking requests',
            badge: 3
          },
          {
            id: 'update-availability',
            label: 'Update Availability',
            icon: 'Clock',
            color: 'secondary',
            description: 'Modify available time slots'
          }
        ],
        'booking-management-payment': [
          {
            id: 'approve-booking',
            label: 'Approve Booking',
            icon: 'CheckCircle',
            color: 'success',
            description: 'Approve pending requests'
          },
          {
            id: 'decline-booking',
            label: 'Decline Booking',
            icon: 'XCircle',
            color: 'error',
            description: 'Decline booking requests'
          },
          {
            id: 'send-message',
            label: 'Send Message',
            icon: 'Send',
            color: 'primary',
            description: 'Contact customer'
          }
        ]
      },
      customer: {
        'venue-discovery-search': [
          {
            id: 'save-search',
            label: 'Save Search',
            icon: 'Bookmark',
            color: 'primary',
            description: 'Save current search criteria'
          },
          {
            id: 'set-alert',
            label: 'Set Price Alert',
            icon: 'Bell',
            color: 'warning',
            description: 'Get notified of price changes'
          }
        ],
        'venue-details-booking': [
          {
            id: 'save-venue',
            label: 'Save Venue',
            icon: 'Heart',
            color: 'error',
            description: 'Add to favorites'
          },
          {
            id: 'share-venue',
            label: 'Share Venue',
            icon: 'Share2',
            color: 'secondary',
            description: 'Share with others'
          },
          {
            id: 'compare-venues',
            label: 'Compare',
            icon: 'GitCompare',
            color: 'primary',
            description: 'Add to comparison'
          }
        ]
      },
      admin: {
        'admin-management-panel': [
          {
            id: 'review-venues',
            label: 'Review Venues',
            icon: 'Eye',
            color: 'primary',
            description: 'Review pending venues',
            badge: 5
          },
          {
            id: 'manage-users',
            label: 'Manage Users',
            icon: 'Users',
            color: 'secondary',
            description: 'User account management'
          },
          {
            id: 'system-alerts',
            label: 'System Alerts',
            icon: 'AlertTriangle',
            color: 'warning',
            description: 'View system notifications',
            badge: 2
          }
        ]
      }
    };

    const roleActions = actionsByRole[userRole] || {};
    const screenActions = roleActions[currentScreen] || [];
    setQuickActions(screenActions);
  }, [userRole, currentScreen, selectedVenues]);

  const handleActionClick = (action) => {
    if (onActionClick) {
      onActionClick(action, selectedVenues);
    }
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getActionButtonColor = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary hover:bg-primary-700 text-white';
      case 'success':
        return 'bg-success hover:bg-success-700 text-white';
      case 'warning':
        return 'bg-warning hover:bg-warning-700 text-white';
      case 'error':
        return 'bg-error hover:bg-error-700 text-white';
      case 'secondary':
        return 'bg-secondary hover:bg-secondary-700 text-white';
      default:
        return 'bg-primary hover:bg-primary-700 text-white';
    }
  };

  // Don't show if no actions available
  if (quickActions.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-300">
      {/* Expanded Action Menu */}
      {isExpanded && (
        <div className="mb-4 animate-slide-up">
          <div className="bg-surface border border-border rounded-lg shadow-lg p-2 min-w-64">
            <div className="space-y-1">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-secondary-50 transition-colors duration-200 text-left"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActionButtonColor(action.color)}`}>
                    <Icon name={action.icon} size={16} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text-primary">
                        {action.label}
                      </span>
                      {action.badge && (
                        <span className="bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {action.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted">
                      {action.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main FAB Button */}
      <button
        onClick={toggleExpanded}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
          isExpanded 
            ? 'bg-secondary-600 hover:bg-secondary-700 rotate-45' :'bg-primary hover:bg-primary-700 hover:scale-105'
        } text-white`}
      >
        <Icon 
          name={isExpanded ? "X" : "Plus"} 
          size={24} 
        />
      </button>

      {/* Action Count Badge */}
      {!isExpanded && quickActions.some(action => action.badge) && (
        <div className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
          {quickActions.reduce((total, action) => total + (action.badge || 0), 0)}
        </div>
      )}
    </div>
  );
};

export default QuickActionMenu;