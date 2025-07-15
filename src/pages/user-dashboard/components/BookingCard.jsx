import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const BookingCard = ({ booking, onViewDetails, onContactVenue, onCancelModify }) => {
  // Return null if booking is undefined
  if (!booking) return null;

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
      case 'pending':
        return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'confirmed':
        return 'bg-success-100 text-success-700 border-success-200';
      case 'completed':
        return 'bg-secondary-100 text-secondary-700 border-secondary-200';
      case 'cancelled':
        return 'bg-error-100 text-error-700 border-error-200';
      default:
        return 'bg-secondary-100 text-secondary-700 border-secondary-200';
    }
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
      case 'pending':
        return 'Clock';
      case 'confirmed':
        return 'CheckCircle';
      case 'completed':
        return 'Check';
      case 'cancelled':
        return 'XCircle';
      default:
        return 'Calendar';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date not available';
    }
  };

  const canCancelOrModify = booking?.status?.toLowerCase() === 'pending' || booking?.status?.toLowerCase() === 'confirmed';

  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex space-x-4">
        {/* Venue Image */}
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <Image 
            src={booking?.venue?.image || '/assets/images/no_image.png'} 
            alt={booking?.venue?.name || 'Venue'}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Booking Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-text-primary truncate">
                {booking?.venue?.name || 'Venue Name'}
              </h3>
              <p className="text-sm text-text-secondary">
                {booking?.venue?.location || 'Location not available'}
              </p>
            </div>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking?.status)}`}>
              <Icon name={getStatusIcon(booking?.status)} size={12} className="mr-1" />
              {booking?.status || 'Unknown'}
            </span>
          </div>

          <div className="space-y-1 mb-3">
            <div className="flex items-center text-sm text-text-secondary">
              <Icon name="Calendar" size={14} className="mr-2" />
              {formatDate(booking?.date)} at {booking?.time || 'Time not available'}
            </div>
            <div className="flex items-center text-sm text-text-secondary">
              <Icon name="Users" size={14} className="mr-2" />
              {booking?.guests || 0} guests
            </div>
            <div className="flex items-center text-sm text-text-secondary">
              <Icon name="DollarSign" size={14} className="mr-2" />
              ${booking?.totalAmount || 0}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => onViewDetails?.(booking)}
              className="text-xs"
            >
              View Details
            </Button>
            <Button
              variant="ghost"
              iconName="MessageSquare"
              iconSize={14}
              onClick={() => onContactVenue?.(booking)}
              className="text-xs"
            >
              Contact
            </Button>
            {canCancelOrModify && (
              <Button
                variant="text"
                onClick={() => onCancelModify?.(booking)}
                className="text-xs text-text-muted hover:text-text-secondary"
              >
                Cancel/Modify
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;