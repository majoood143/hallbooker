import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const BookingStatusIndicator = ({ userRole, onStatusClick }) => {
  const [bookingStatus, setBookingStatus] = useState({
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    total: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  // Mock real-time booking updates - in real app this would use Supabase subscriptions
  useEffect(() => {
    const mockBookingData = {
      customer: {
        pending: 1,
        confirmed: 2,
        cancelled: 0,
        total: 3
      },
      venue_owner: {
        pending: 5,
        confirmed: 12,
        cancelled: 1,
        total: 18
      },
      admin: {
        pending: 15,
        confirmed: 45,
        cancelled: 3,
        total: 63
      }
    };

    const data = mockBookingData[userRole] || mockBookingData.customer;
    setBookingStatus(data);
    setIsVisible(data.pending > 0 || data.total > 0);
  }, [userRole]);

  const getStatusColor = (type) => {
    switch (type) {
      case 'pending':
        return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'confirmed':
        return 'bg-success-100 text-success-700 border-success-200';
      case 'cancelled':
        return 'bg-error-100 text-error-700 border-error-200';
      default:
        return 'bg-secondary-100 text-secondary-700 border-secondary-200';
    }
  };

  const getStatusIcon = (type) => {
    switch (type) {
      case 'pending':
        return 'Clock';
      case 'confirmed':
        return 'CheckCircle';
      case 'cancelled':
        return 'XCircle';
      default:
        return 'Calendar';
    }
  };

  const getStatusMessage = () => {
    if (userRole === 'venue_owner') {
      if (bookingStatus.pending > 0) {
        return `${bookingStatus.pending} booking${bookingStatus.pending > 1 ? 's' : ''} need${bookingStatus.pending === 1 ? 's' : ''} your attention`;
      }
      return `${bookingStatus.total} total bookings managed`;
    } else if (userRole === 'customer') {
      if (bookingStatus.pending > 0) {
        return `${bookingStatus.pending} booking${bookingStatus.pending > 1 ? 's' : ''} pending confirmation`;
      }
      return `${bookingStatus.confirmed} active booking${bookingStatus.confirmed !== 1 ? 's' : ''}`;
    } else if (userRole === 'admin') {
      return `${bookingStatus.pending} pending, ${bookingStatus.total} total platform bookings`;
    }
    return '';
  };

  const handleClick = () => {
    if (onStatusClick) {
      onStatusClick(bookingStatus);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-200 animate-fade-in">
      <button
        onClick={handleClick}
        className="bg-surface border border-border rounded-lg shadow-lg p-4 hover:shadow-xl transition-all duration-200 ease-out hover:-translate-y-1 max-w-sm"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="Calendar" size={20} color="var(--color-primary)" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-text-primary">
                Booking Status
              </h4>
              <Icon name="ChevronRight" size={16} color="var(--color-text-muted)" />
            </div>
            
            <p className="text-xs text-text-secondary mb-3">
              {getStatusMessage()}
            </p>
            
            <div className="flex space-x-2">
              {bookingStatus.pending > 0 && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor('pending')}`}>
                  <Icon name={getStatusIcon('pending')} size={12} className="mr-1" />
                  {bookingStatus.pending}
                </span>
              )}
              
              {bookingStatus.confirmed > 0 && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor('confirmed')}`}>
                  <Icon name={getStatusIcon('confirmed')} size={12} className="mr-1" />
                  {bookingStatus.confirmed}
                </span>
              )}
              
              {bookingStatus.cancelled > 0 && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor('cancelled')}`}>
                  <Icon name={getStatusIcon('cancelled')} size={12} className="mr-1" />
                  {bookingStatus.cancelled}
                </span>
              )}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default BookingStatusIndicator;