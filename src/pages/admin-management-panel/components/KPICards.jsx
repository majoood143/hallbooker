import React from 'react';
import Icon from '../../../components/AppIcon';
import { ensureArray, safeMap } from '../../../utils/arrayUtils';

const KPICards = () => {
  const kpiData = [
    {
      id: 'total-users',
      title: 'Total Users',
      value: '1,247',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'Users',
      color: 'primary',
      description: 'Active platform users'
    },
    {
      id: 'active-venues',
      title: 'Active Venues',
      value: '198',
      change: '+8.2%',
      changeType: 'positive',
      icon: 'Building2',
      color: 'success',
      description: 'Listed and available venues'
    },
    {
      id: 'monthly-bookings',
      title: 'Monthly Bookings',
      value: '456',
      change: '+15.3%',
      changeType: 'positive',
      icon: 'Calendar',
      color: 'warning',
      description: 'Bookings this month'
    },
    {
      id: 'revenue',
      title: 'Monthly Revenue',
      value: '$89,234',
      change: '-2.1%',
      changeType: 'negative',
      icon: 'DollarSign',
      color: 'error',
      description: 'Platform commission revenue'
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
      default:
        return 'var(--color-primary)';
    }
  };

  const getChangeColor = (changeType) => {
    return changeType === 'positive' ? 'text-success' : 'text-error';
  };

  const getChangeIcon = (changeType) => {
    return changeType === 'positive' ? 'TrendingUp' : 'TrendingDown';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {safeMap(ensureArray(kpiData), (kpi) => (
        <div key={kpi?.id} className="card p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${kpi?.color}-100`}>
              <Icon name={kpi?.icon} size={24} color={getIconColor(kpi?.color)} />
            </div>
            <div className={`flex items-center space-x-1 ${getChangeColor(kpi?.changeType)}`}>
              <Icon name={getChangeIcon(kpi?.changeType)} size={16} />
              <span className="text-sm font-medium">{kpi?.change}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-text-primary">{kpi?.value}</h3>
            <p className="text-sm font-medium text-text-secondary">{kpi?.title}</p>
            <p className="text-xs text-text-muted">{kpi?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;