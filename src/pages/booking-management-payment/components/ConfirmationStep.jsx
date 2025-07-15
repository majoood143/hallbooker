import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ConfirmationStep = ({ bookingData, bookingReference, onComplete }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);

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

  const handleDownloadReceipt = async () => {
    setIsDownloading(true);
    // Simulate download process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would generate and download a PDF receipt
    const receiptData = {
      bookingReference,
      venue: bookingData.venue.name,
      date: bookingData.selectedDate,
      time: bookingData.selectedTime,
      total: bookingData.totalAmount
    };
    
    console.log('Downloading receipt:', receiptData);
    setIsDownloading(false);
  };

  const handleAddToCalendar = async () => {
    setIsAddingToCalendar(true);
    
    // Create calendar event data
    const eventData = {
      title: `Event at ${bookingData.venue.name}`,
      start: new Date(`${bookingData.selectedDate}T${bookingData.selectedTime}`),
      end: new Date(`${bookingData.selectedDate}T${bookingData.selectedTime}`),
      location: bookingData.venue.location,
      description: `Booking Reference: ${bookingReference}\nVenue: ${bookingData.venue.name}\nGuests: ${bookingData.guests}`
    };

    // Simulate calendar integration
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Adding to calendar:', eventData);
    setIsAddingToCalendar(false);
  };

  const nextSteps = [
    {
      icon: 'Mail',
      title: 'Check Your Email',
      description: 'Confirmation details have been sent to your email address'
    },
    {
      icon: 'Phone',
      title: 'Venue Contact',
      description: 'The venue owner will contact you within 24 hours to confirm details'
    },
    {
      icon: 'Calendar',
      title: 'Event Preparation',
      description: 'Review your booking details and prepare for your event'
    },
    {
      icon: 'MessageSquare',
      title: 'Support Available',
      description: 'Contact our support team if you have any questions'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={40} color="var(--color-success)" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-lg text-text-secondary">
          Your event booking has been successfully processed
        </p>
      </div>

      {/* Booking Reference */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Booking Reference
          </h2>
          <div className="text-3xl font-mono font-bold text-primary mb-4">
            {bookingReference}
          </div>
          <p className="text-text-secondary">
            Please save this reference number for your records
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Booking Summary */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-4">
            Booking Summary
          </h3>
          
          {/* Venue Info */}
          <div className="flex space-x-4 mb-6">
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={bookingData.venue.image}
                alt={bookingData.venue.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-text-primary">
                {bookingData.venue.name}
              </h4>
              <div className="flex items-center mt-1">
                <Icon name="MapPin" size={14} color="var(--color-text-muted)" />
                <span className="text-sm text-text-muted ml-1">
                  {bookingData.venue.location}
                </span>
              </div>
              <div className="flex items-center mt-1">
                <Icon name="Users" size={14} color="var(--color-text-muted)" />
                <span className="text-sm text-text-muted ml-1">
                  {bookingData.guests} guests
                </span>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon name="Calendar" size={16} color="var(--color-text-secondary)" />
                <span className="text-sm text-text-secondary ml-2">Date</span>
              </div>
              <span className="text-sm font-medium text-text-primary">
                {formatDate(bookingData.selectedDate)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon name="Clock" size={16} color="var(--color-text-secondary)" />
                <span className="text-sm text-text-secondary ml-2">Time</span>
              </div>
              <span className="text-sm font-medium text-text-primary">
                {formatTime(bookingData.selectedTime)} ({bookingData.duration}h)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon name="Tag" size={16} color="var(--color-text-secondary)" />
                <span className="text-sm text-text-secondary ml-2">Event Type</span>
              </div>
              <span className="text-sm font-medium text-text-primary">
                {bookingData.eventType}
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t border-border pt-4">
            <h5 className="font-medium text-text-primary mb-2">Contact Information</h5>
            <div className="space-y-1 text-sm text-text-secondary">
              <div>{bookingData.firstName} {bookingData.lastName}</div>
              <div>{bookingData.email}</div>
              <div>{bookingData.phone}</div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-4">
            Payment Summary
          </h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Base Price</span>
              <span className="text-text-primary">${bookingData.pricing.basePrice}</span>
            </div>

            {bookingData.services.length > 0 && (
              <>
                <div className="text-sm font-medium text-text-primary">Additional Services:</div>
                {bookingData.services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between pl-4">
                    <span className="text-text-secondary text-sm">
                      {service.name} {service.quantity > 1 && `× ${service.quantity}`}
                    </span>
                    <span className="text-text-primary text-sm">
                      ${service.totalPrice}
                    </span>
                  </div>
                ))}
              </>
            )}

            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Tax</span>
              <span className="text-text-primary">
                ${(bookingData.totalAmount * 0.1).toFixed(2)}
              </span>
            </div>

            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-text-primary">Total Paid</span>
                <span className="text-xl font-bold text-success">
                  ${bookingData.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-success-50 border border-success-200 rounded-lg p-3">
            <div className="flex items-center">
              <Icon name="CheckCircle" size={16} color="var(--color-success)" />
              <span className="text-sm text-success-700 ml-2">
                Payment processed successfully
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Button
          variant="outline"
          iconName="Download"
          onClick={handleDownloadReceipt}
          loading={isDownloading}
          fullWidth
        >
          Download Receipt
        </Button>

        <Button
          variant="outline"
          iconName="Calendar"
          onClick={handleAddToCalendar}
          loading={isAddingToCalendar}
          fullWidth
        >
          Add to Calendar
        </Button>

        <Button
          variant="outline"
          iconName="Share2"
          fullWidth
        >
          Share Booking
        </Button>

        <Button
          variant="outline"
          iconName="MessageSquare"
          fullWidth
        >
          Contact Venue
        </Button>
      </div>

      {/* Next Steps */}
      <div className="bg-surface border border-border rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-text-primary mb-6">
          What Happens Next?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nextSteps.map((step, index) => (
            <div key={index} className="flex space-x-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name={step.icon} size={20} color="var(--color-primary)" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">
                  {step.title}
                </h4>
                <p className="text-sm text-text-secondary">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Actions */}
      <div className="text-center">
        <Button
          variant="primary"
          iconName="Home"
          onClick={onComplete}
          className="mr-4"
        >
          Go to Dashboard
        </Button>
        
        <Button
          variant="outline"
          iconName="Search"
          onClick={() => window.location.href = '/venue-discovery-search'}
        >
          Book Another Venue
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;