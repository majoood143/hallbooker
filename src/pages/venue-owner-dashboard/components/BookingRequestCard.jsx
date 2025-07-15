import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingRequestCard = ({ booking, onApprove, onDecline, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'approved':
        return 'bg-success-100 text-success-700 border-success-200';
      case 'declined':
        return 'bg-error-100 text-error-700 border-error-200';
      case 'cancelled':
        return 'bg-secondary-100 text-secondary-700 border-secondary-200';
      default:
        return 'bg-secondary-100 text-secondary-700 border-secondary-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getUrgencyIndicator = () => {
    const eventDate = new Date(booking.eventDate);
    const today = new Date();
    const daysUntilEvent = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilEvent <= 7) {
      return { color: 'text-error-600', label: 'Urgent' };
    } else if (daysUntilEvent <= 14) {
      return { color: 'text-warning-600', label: 'Soon' };
    }
    return null;
  };

  const urgency = getUrgencyIndicator();

  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="text-lg font-semibold text-text-primary">{booking.customerName}</h4>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            {urgency && (
              <span className={`text-xs font-medium ${urgency.color}`}>
                {urgency.label}
              </span>
            )}
          </div>
          
          <div className="space-y-1 text-sm text-text-secondary">
            <div className="flex items-center">
              <Icon name="Building2" size={14} className="mr-2" />
              <span>{booking.venueName}</span>
            </div>
            <div className="flex items-center">
              <Icon name="Calendar" size={14} className="mr-2" />
              <span>{formatDate(booking.eventDate)}</span>
            </div>
            <div className="flex items-center">
              <Icon name="Clock" size={14} className="mr-2" />
              <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
            </div>
            <div className="flex items-center">
              <Icon name="Users" size={14} className="mr-2" />
              <span>{booking.guestCount} guests</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-lg font-semibold text-text-primary">${booking.totalAmount}</p>
          <p className="text-xs text-text-muted">Total</p>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm text-text-secondary">
          <span className="font-medium">Event Type:</span> {booking.eventType}
        </p>
        {booking.specialRequests && (
          <p className="text-sm text-text-secondary mt-1">
            <span className="font-medium">Special Requests:</span> {booking.specialRequests}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-text-muted">
          <Icon name="Clock" size={12} />
          <span>Requested {new Date(booking.requestedAt).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            iconName="Eye"
            iconSize={14}
            onClick={() => onViewDetails(booking)}
          >
            Details
          </Button>
          
          {booking.status === 'pending' && (
            <>
              <Button
                variant="success"
                iconName="Check"
                iconSize={14}
                onClick={() => onApprove(booking)}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                iconName="X"
                iconSize={14}
                onClick={() => onDecline(booking)}
              >
                Decline
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingRequestCard;