import React from 'react';
import { Building2, Calendar, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const StatusStatsCards = ({ venueStats, bookingStats, activeTab }) => {
  const venueStatsCards = [
    {
      title: 'Total Venues',
      value: venueStats?.total_venues || 0,
      icon: Building2,
      color: 'blue',
      active: activeTab === 'all-venues'
    },
    {
      title: 'Active Venues',
      value: venueStats?.active_venues || 0,
      icon: CheckCircle,
      color: 'green',
      active: activeTab === 'active-venues'
    },
    {
      title: 'Pending Reviews',
      value: venueStats?.under_review_venues || 0,
      icon: Clock,
      color: 'yellow',
      active: activeTab === 'pending-reviews'
    },
    {
      title: 'Suspended',
      value: venueStats?.suspended_venues || 0,
      icon: XCircle,
      color: 'red',
      active: activeTab === 'suspended-venues'
    }
  ];

  const bookingStatsCards = [
    {
      title: 'Total Bookings',
      value: bookingStats?.total_bookings || 0,
      icon: Calendar,
      color: 'blue',
      active: activeTab === 'all-bookings'
    },
    {
      title: 'Confirmed',
      value: bookingStats?.confirmed_bookings || 0,
      icon: CheckCircle,
      color: 'green',
      active: activeTab === 'confirmed-bookings'
    },
    {
      title: 'Pending',
      value: bookingStats?.pending_bookings || 0,
      icon: Clock,
      color: 'yellow',
      active: activeTab === 'pending-bookings'
    },
    {
      title: 'Disputes',
      value: bookingStats?.disputed_bookings || 0,
      icon: AlertTriangle,
      color: 'red',
      active: activeTab === 'disputes'
    }
  ];

  const getColorClasses = (color, active) => {
    const colors = {
      blue: active 
        ? 'bg-blue-500 text-white' :'bg-blue-50 text-blue-700 border-blue-200',
      green: active 
        ? 'bg-green-500 text-white' :'bg-green-50 text-green-700 border-green-200',
      yellow: active 
        ? 'bg-yellow-500 text-white' :'bg-yellow-50 text-yellow-700 border-yellow-200',
      red: active 
        ? 'bg-red-500 text-white' :'bg-red-50 text-red-700 border-red-200'
    };
    return colors[color] || colors.blue;
  };

  const renderStatsCards = (cards) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards?.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`
              p-6 rounded-lg border transition-all duration-200
              ${getColorClasses(card.color, card.active)}
              ${card.active ? 'shadow-lg scale-105' : 'shadow hover:shadow-md'}
            `}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Icon className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${card.active ? 'text-white' : 'text-gray-600'}`}>
                  {card.title}
                </p>
                <p className={`text-2xl font-bold ${card.active ? 'text-white' : 'text-gray-900'}`}>
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Venue Statistics</h2>
        {renderStatsCards(venueStatsCards)}
      </div>
      
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Statistics</h2>
        {renderStatsCards(bookingStatsCards)}
      </div>
    </div>
  );
};

export default StatusStatsCards;