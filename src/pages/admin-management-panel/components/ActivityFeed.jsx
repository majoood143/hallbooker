import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { ensureArray, safeMap } from '../../../utils/arrayUtils';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'user_registration',
      user: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      action: 'registered as a new venue owner',
      timestamp: '2 minutes ago',
      icon: 'UserPlus',
      color: 'success'
    },
    {
      id: 2,
      type: 'venue_submission',
      user: {
        name: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      action: 'submitted "Grand Ballroom" for review',
      timestamp: '15 minutes ago',
      icon: 'Building2',
      color: 'primary'
    },
    {
      id: 3,
      type: 'booking_dispute',
      user: {
        name: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      action: 'raised a dispute for booking #BK-2024-001',
      timestamp: '1 hour ago',
      icon: 'AlertTriangle',
      color: 'warning'
    },
    {
      id: 4,
      type: 'payment_failed',
      user: {
        name: 'David Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      action: 'payment failed for booking #BK-2024-002',
      timestamp: '2 hours ago',
      icon: 'CreditCard',
      color: 'error'
    },
    {
      id: 5,
      type: 'venue_approved',
      user: {
        name: 'Lisa Thompson',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
      },
      action: 'venue "Elegant Gardens" was approved',
      timestamp: '3 hours ago',
      icon: 'CheckCircle',
      color: 'success'
    },
    {
      id: 6,
      type: 'user_suspended',
      user: {
        name: 'Admin System',
        avatar: null
      },
      action: 'suspended user account for policy violation',
      timestamp: '4 hours ago',
      icon: 'UserX',
      color: 'error'
    }
  ];

  const getIconColor = (color) => {
    switch (color) {
      case 'success':
        return 'var(--color-success)';
      case 'warning':
        return 'var(--color-warning)';
      case 'error':
        return 'var(--color-error)';
      case 'primary':
        return 'var(--color-primary)';
      default:
        return 'var(--color-secondary)';
    }
  };

  return (
    <div className="card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
          <button className="text-sm text-primary hover:text-primary-700 font-medium">
            View All
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {safeMap(ensureArray(activities), (activity) => (
            <div key={activity?.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {activity?.user?.avatar ? (
                  <div className="relative">
                    <Image
                      src={activity.user.avatar}
                      alt={activity.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center bg-${activity?.color}-100`}>
                      <Icon name={activity?.icon} size={12} color={getIconColor(activity?.color)} />
                    </div>
                  </div>
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${activity?.color}-100`}>
                    <Icon name={activity?.icon} size={16} color={getIconColor(activity?.color)} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary">
                  <span className="font-medium">{activity?.user?.name}</span>
                  {' '}
                  <span className="text-text-secondary">{activity?.action}</span>
                </p>
                <p className="text-xs text-text-muted mt-1">{activity?.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;