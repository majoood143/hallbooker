import React from 'react';
import { Users, Calendar, DollarSign, Star, TrendingUp, TrendingDown } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const CustomersStats = ({ stats, loading }) => {
  const statCards = [
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'blue',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Active Bookings',
      value: stats?.activeBookings || 0,
      icon: Calendar,
      color: 'green',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Total Revenue',
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'purple',
      change: '+15%',
      changeType: 'increase'
    },
    {
      title: 'Avg. Rating',
      value: (stats?.averageRating || 0).toFixed(1),
      icon: Star,
      color: 'yellow',
      change: '+0.2',
      changeType: 'increase'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        border: 'border-blue-200'
      },
      green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        border: 'border-green-200'
      },
      purple: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        border: 'border-purple-200'
      },
      yellow: {
        bg: 'bg-yellow-50',
        icon: 'text-yellow-600',
        border: 'border-yellow-200'
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
        const ChangeIcon = stat.changeType === 'increase' ? TrendingUp : TrendingDown;

        return (
          <div key={index} className={`bg-white rounded-lg shadow-sm border ${colors.border} p-6 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${colors.bg}`}>
                <Icon className={`w-6 h-6 ${colors.icon}`} />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                <ChangeIcon className="w-4 h-4 mr-1" />
                {stat.change}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-gray-600">
                {stat.title}
              </p>
            </div>

            {/* Additional context based on stat type */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {stat.title === 'Total Customers' && 'All registered customers'}
                {stat.title === 'Active Bookings' && 'Current month bookings'}
                {stat.title === 'Total Revenue' && 'Lifetime customer value'}
                {stat.title === 'Avg. Rating' && 'Customer satisfaction score'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomersStats;