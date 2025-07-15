import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const BookingSummaryCard = ({ bookingData, isSticky = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    venue,
    selectedDate,
    selectedTime,
    duration,
    guests,
    services,
    pricing
  } = bookingData;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  const calculateTotal = () => {
    const basePrice = pricing.basePrice || 0;
    const serviceTotal = services.reduce((sum, service) => sum + (service.price || 0), 0);
    const subtotal = basePrice + serviceTotal;
    const tax = subtotal * (pricing.taxRate || 0.1);
    return subtotal + tax;
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`bg-surface border border-border rounded-lg shadow-sm ${
      isSticky ? 'sticky top-20' : ''
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            Booking Summary
          </h3>
          <button
            onClick={toggleExpanded}
            className="md:hidden p-1 hover:bg-secondary-50 rounded-md transition-colors duration-200"
          >
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={20} 
              color="var(--color-text-secondary)" 
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block`}>
        {/* Venue Info */}
        <div className="p-4 border-b border-border">
          <div className="flex space-x-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={venue.image}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-text-primary truncate">
                {venue.name}
              </h4>
              <div className="flex items-center mt-1">
                <Icon name="MapPin" size={14} color="var(--color-text-muted)" />
                <span className="text-sm text-text-muted ml-1 truncate">
                  {venue.location}
                </span>
              </div>
              <div className="flex items-center mt-1">
                <Icon name="Users" size={14} color="var(--color-text-muted)" />
                <span className="text-sm text-text-muted ml-1">
                  Capacity: {venue.capacity} guests
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="p-4 border-b border-border">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon name="Calendar" size={16} color="var(--color-text-secondary)" />
                <span className="text-sm text-text-secondary ml-2">Date</span>
              </div>
              <span className="text-sm font-medium text-text-primary">
                {formatDate(selectedDate)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon name="Clock" size={16} color="var(--color-text-secondary)" />
                <span className="text-sm text-text-secondary ml-2">Time</span>
              </div>
              <span className="text-sm font-medium text-text-primary">
                {formatTime(selectedTime)} ({duration}h)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon name="Users" size={16} color="var(--color-text-secondary)" />
                <span className="text-sm text-text-secondary ml-2">Guests</span>
              </div>
              <span className="text-sm font-medium text-text-primary">
                {guests} people
              </span>
            </div>
          </div>
        </div>

        {/* Services */}
        {services.length > 0 && (
          <div className="p-4 border-b border-border">
            <h5 className="text-sm font-medium text-text-primary mb-3">
              Additional Services
            </h5>
            <div className="space-y-2">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">
                    {service.name}
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    ${service.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Breakdown */}
        <div className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Base Price</span>
              <span className="text-sm text-text-primary">
                ${pricing.basePrice}
              </span>
            </div>

            {services.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Services</span>
                <span className="text-sm text-text-primary">
                  ${services.reduce((sum, service) => sum + service.price, 0)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Tax</span>
              <span className="text-sm text-text-primary">
                ${((pricing.basePrice + services.reduce((sum, service) => sum + service.price, 0)) * pricing.taxRate).toFixed(2)}
              </span>
            </div>

            <div className="border-t border-border pt-2 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-text-primary">
                  Total
                </span>
                <span className="text-lg font-bold text-primary">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummaryCard;