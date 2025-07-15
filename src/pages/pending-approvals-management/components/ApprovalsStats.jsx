import React from 'react';
import { Clock, AlertTriangle, CheckCircle, TrendingUp, Timer } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const ApprovalsStats = ({ stats, loading }) => {
  const statCards = [
    {
      title: 'Total Pending',
      value: stats?.totalPending || 0,
      icon: Clock,
      color: 'orange',
      description: 'Awaiting review'
    },
    {
      title: 'Urgent Items',
      value: stats?.urgentItems || 0,
      icon: AlertTriangle,
      color: 'red',
      description: 'Over 3 days old'
    },
    {
      title: 'Avg. Processing',
      value: stats?.avgProcessingTime || '0 days',
      icon: Timer,
      color: 'blue',
      description: 'Response time'
    },
    {
      title: 'Completed Today',
      value: stats?.completedToday || 0,
      icon: CheckCircle,
      color: 'green',
      description: 'Processed today'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      orange: {
        bg: 'bg-orange-50',
        icon: 'text-orange-600',
        border: 'border-orange-200'
      },
      red: {
        bg: 'bg-red-50',
        icon: 'text-red-600',
        border: 'border-red-200'
      },
      blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        border: 'border-blue-200'
      },
      green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        border: 'border-green-200'
      }
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded mb-2"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const colors = getColorClasses(stat.color);
        const Icon = stat.icon;

        return (
          <div key={index} className={`bg-white rounded-lg shadow-sm border ${colors.border} p-6 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${colors.bg}`}>
                <Icon className={`w-6 h-6 ${colors.icon}`} />
              </div>
              {stat.title === 'Urgent Items' && stat.value > 0 && (
                <div className="flex items-center text-sm font-medium text-red-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Action needed
                </div>
              )}
              {stat.title === 'Total Pending' && stat.value === 0 && (
                <div className="flex items-center text-sm font-medium text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  All clear
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-gray-600">
                {stat.title}
              </p>
              <p className="text-xs text-gray-500">
                {stat.description}
              </p>
            </div>

            {/* Progress indicator for urgent items */}
            {stat.title === 'Urgent Items' && stats?.totalPending > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Urgency level</span>
                  <span>{Math.round((stat.value / stats.totalPending) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      stat.value / stats.totalPending > 0.5 ? 'bg-red-500' : 
                      stat.value / stats.totalPending > 0.2 ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((stat.value / stats.totalPending) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Target indicators */}
            {stat.title === 'Avg. Processing' && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Target: Under 2 days
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ApprovalsStats;