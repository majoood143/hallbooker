import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const WelcomeSection = ({ user, upcomingBookings, stats }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const nextBooking = upcomingBookings[0];

  return (
    <div className="bg-gradient-primary text-white rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">
            {getGreeting()}, {user.name}!
          </h1>
          <p className="text-primary-100">
            Welcome back to your dashboard
          </p>
        </div>
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
          <Icon name="User" size={32} color="white" />
        </div>
      </div>

      {nextBooking && (
        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <Image 
                src={nextBooking.venue.image} 
                alt={nextBooking.venue.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white truncate">
                {nextBooking.venue.name}
              </h3>
              <p className="text-primary-100 text-sm">
                {new Date(nextBooking.date).toLocaleDateString()} at {nextBooking.time}
              </p>
            </div>
            <Icon name="ChevronRight" size={20} color="white" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {stats.totalBookings}
          </div>
          <div className="text-primary-100 text-sm">
            Total Bookings
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {stats.upcomingBookings}
          </div>
          <div className="text-primary-100 text-sm">
            Upcoming
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {stats.favoriteVenues}
          </div>
          <div className="text-primary-100 text-sm">
            Favorites
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;