import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'booking_confirmed':
        return { icon: 'CheckCircle', color: 'var(--color-success)' };
      case 'booking_cancelled':
        return { icon: 'XCircle', color: 'var(--color-error)' };
      case 'payment_completed':
        return { icon: 'CreditCard', color: 'var(--color-success)' };
      case 'review_requested':
        return { icon: 'Star', color: 'var(--color-warning)' };
      case 'message_received':
        return { icon: 'MessageSquare', color: 'var(--color-primary)' };
      case 'venue_favorited':
        return { icon: 'Heart', color: 'var(--color-error)' };
      default:
        return { icon: 'Bell', color: 'var(--color-secondary)' };
    }
  };

  const formatActivityTime = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInHours = (now - activityTime) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Recent Activity
        </h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="Activity" size={24} color="var(--color-text-muted)" />
          </div>
          <p className="text-text-secondary">
            No recent activity to show
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Recent Activity
      </h3>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const { icon, color } = getActivityIcon(activity.type);
          
          return (
            <div key={activity.id} className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                  <Icon name={icon} size={16} color={color} />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary">
                  {activity.description}
                </p>
                <p className="text-xs text-text-muted">
                  {formatActivityTime(activity.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivityFeed;