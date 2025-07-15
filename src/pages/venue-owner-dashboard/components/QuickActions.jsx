import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      id: 'add-property',
      title: 'Add New Property',
      description: 'List a new venue for booking',
      icon: 'Plus',
      color: 'primary',
      urgent: false
    },
    {
      id: 'block-dates',
      title: 'Block Dates',
      description: 'Mark dates as unavailable',
      icon: 'CalendarX',
      color: 'warning',
      urgent: false
    },
    {
      id: 'update-pricing',
      title: 'Update Pricing',
      description: 'Modify venue rates and packages',
      icon: 'DollarSign',
      color: 'success',
      urgent: false
    },
    {
      id: 'respond-bookings',
      title: 'Respond to Bookings',
      description: 'Review and respond to requests',
      icon: 'MessageSquare',
      color: 'error',
      urgent: true,
      badge: 5
    },
    {
      id: 'view-analytics',
      title: 'View Analytics',
      description: 'Check performance metrics',
      icon: 'BarChart3',
      color: 'secondary',
      urgent: false
    },
    {
      id: 'manage-photos',
      title: 'Manage Photos',
      description: 'Update venue image galleries',
      icon: 'Camera',
      color: 'primary',
      urgent: false
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary-50 text-primary-600 hover:bg-primary-100';
      case 'success':
        return 'bg-success-50 text-success-600 hover:bg-success-100';
      case 'warning':
        return 'bg-warning-50 text-warning-600 hover:bg-warning-100';
      case 'error':
        return 'bg-error-50 text-error-600 hover:bg-error-100';
      case 'secondary':
        return 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100';
      default:
        return 'bg-primary-50 text-primary-600 hover:bg-primary-100';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Quick Actions</h3>
        <Button
          variant="ghost"
          iconName="Settings"
          iconSize={16}
        >
          Customize
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action)}
            className={`relative p-4 rounded-lg border border-border transition-all duration-200 hover:shadow-md hover:-translate-y-1 text-left ${getColorClasses(action.color)}`}
          >
            {action.badge && (
              <div className="absolute -top-2 -right-2 bg-error text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {action.badge}
              </div>
            )}
            
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                action.urgent ? 'bg-error text-white' : 'bg-white'
              }`}>
                <Icon name={action.icon} size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold mb-1">
                  {action.title}
                  {action.urgent && (
                    <span className="ml-2 text-xs bg-error text-white px-2 py-0.5 rounded-full">
                      Urgent
                    </span>
                  )}
                </h4>
                <p className="text-xs opacity-80">
                  {action.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Need help getting started?</span>
          <Button
            variant="link"
            iconName="ExternalLink"
            iconSize={14}
          >
            View Guide
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;