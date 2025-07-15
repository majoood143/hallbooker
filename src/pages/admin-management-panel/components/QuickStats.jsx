import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = () => {
  const stats = [
    {
      id: 'today-bookings',
      label: 'Today\'s Bookings',
      value: '23',
      icon: 'Calendar',
      color: 'primary'
    },
    {
      id: 'pending-reviews',
      label: 'Pending Reviews',
      value: '8',
      icon: 'Clock',
      color: 'warning'
    },
    {
      id: 'active-disputes',
      label: 'Active Disputes',
      value: '5',
      icon: 'AlertTriangle',
      color: 'error'
    },
    {
      id: 'new-venues',
      label: 'New Venues (Week)',
      value: '12',
      icon: 'Building2',
      color: 'success'
    },
    {
      id: 'system-uptime',
      label: 'System Uptime',
      value: '99.9%',
      icon: 'Activity',
      color: 'success'
    },
    {
      id: 'support-tickets',
      label: 'Open Tickets',
      value: '17',
      icon: 'MessageSquare',
      color: 'secondary'
    }
  ];

  const getIconColor = (color) => {
    switch (color) {
      case 'primary':
        return 'var(--color-primary)';
      case 'success':
        return 'var(--color-success)';
      case 'warning':
        return 'var(--color-warning)';
      case 'error':
        return 'var(--color-error)';
      case 'secondary':
        return 'var(--color-secondary)';
      default:
        return 'var(--color-primary)';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.id} className="card p-4 text-center hover:shadow-md transition-shadow duration-200">
          <div className={`w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center bg-${stat.color}-100`}>
            <Icon name={stat.icon} size={20} color={getIconColor(stat.color)} />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-bold text-text-primary">{stat.value}</p>
            <p className="text-xs text-text-muted">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;