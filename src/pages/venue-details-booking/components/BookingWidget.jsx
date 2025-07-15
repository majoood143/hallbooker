import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const BookingWidget = ({ venue, selectedDate, onBookingSubmit }) => {
  const [bookingDetails, setBookingDetails] = useState({
    date: selectedDate || '',
    startTime: '',
    endTime: '',
    guestCount: '',
    selectedServices: [],
    specialRequests: ''
  });
  const [pricingBreakdown, setPricingBreakdown] = useState({
    basePrice: 0,
    servicesTotal: 0,
    taxes: 0,
    total: 0
  });
  const [currentStep, setCurrentStep] = useState(1);

  const availableServices = [
    { id: 'catering', name: 'Catering Service', price: 25, unit: 'per person', icon: 'UtensilsCrossed' },
    { id: 'decoration', name: 'Event Decoration', price: 500, unit: 'flat rate', icon: 'Sparkles' },
    { id: 'photography', name: 'Photography', price: 800, unit: 'per event', icon: 'Camera' },
    { id: 'music', name: 'DJ & Sound System', price: 300, unit: 'per event', icon: 'Music' },
    { id: 'security', name: 'Security Service', price: 150, unit: 'per event', icon: 'Shield' },
    { id: 'cleaning', name: 'Post-Event Cleaning', price: 200, unit: 'per event', icon: 'Sparkles' }
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  useEffect(() => {
    if (selectedDate) {
      setBookingDetails(prev => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate]);

  useEffect(() => {
    calculatePricing();
  }, [bookingDetails]);

  const calculatePricing = () => {
    const { startTime, endTime, guestCount, selectedServices } = bookingDetails;
    
    if (!startTime || !endTime) {
      setPricingBreakdown({ basePrice: 0, servicesTotal: 0, taxes: 0, total: 0 });
      return;
    }

    const start = parseInt(startTime.split(':')[0]);
    const end = parseInt(endTime.split(':')[0]);
    const hours = Math.max(end - start, venue.minimumHours);
    
    const basePrice = hours * venue.basePrice;
    
    const servicesTotal = selectedServices.reduce((total, serviceId) => {
      const service = availableServices.find(s => s.id === serviceId);
      if (!service) return total;
      
      if (service.unit === 'per person' && guestCount) {
        return total + (service.price * parseInt(guestCount));
      }
      return total + service.price;
    }, 0);

    const subtotal = basePrice + servicesTotal;
    const taxes = subtotal * 0.1; // 10% tax
    const total = subtotal + taxes + venue.cleaningFee + venue.securityDeposit;

    setPricingBreakdown({
      basePrice,
      servicesTotal,
      taxes,
      total
    });
  };

  const handleInputChange = (field, value) => {
    setBookingDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (serviceId) => {
    setBookingDetails(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitBooking = () => {
    const bookingData = {
      ...bookingDetails,
      venue: venue,
      pricing: pricingBreakdown,
      timestamp: new Date().toISOString()
    };
    onBookingSubmit(bookingData);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return bookingDetails.date && bookingDetails.startTime && bookingDetails.endTime && bookingDetails.guestCount;
      case 2:
        return true; // Services are optional
      case 3:
        return true; // Final review
      default:
        return false;
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 sticky top-4">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-text-primary">Book this venue</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{formatPrice(venue.basePrice)}</div>
            <div className="text-sm text-text-muted">per hour</div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center space-x-2 mb-6">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep 
                  ? 'bg-primary text-white' :'bg-secondary-200 text-secondary-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`flex-1 h-1 rounded ${
                  step < currentStep ? 'bg-primary' : 'bg-secondary-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Date & Time */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h4 className="font-medium text-text-primary">Select Date & Time</h4>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Event Date</label>
            <Input
              type="date"
              value={bookingDetails.date ? bookingDetails.date.toISOString().split('T')[0] : ''}
              onChange={(e) => handleInputChange('date', new Date(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Start Time</label>
              <select
                value={bookingDetails.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">End Time</label>
              <select
                value={bookingDetails.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Number of Guests</label>
            <Input
              type="number"
              placeholder="Enter guest count"
              value={bookingDetails.guestCount}
              onChange={(e) => handleInputChange('guestCount', e.target.value)}
              min="1"
              max={venue.capacity}
              className="w-full"
            />
            <p className="text-xs text-text-muted mt-1">Maximum capacity: {venue.capacity} guests</p>
          </div>
        </div>
      )}

      {/* Step 2: Services */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <h4 className="font-medium text-text-primary">Additional Services</h4>
          <p className="text-sm text-text-secondary">Select optional services to enhance your event</p>
          
          <div className="space-y-3">
            {availableServices.map((service) => (
              <div
                key={service.id}
                className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                  bookingDetails.selectedServices.includes(service.id)
                    ? 'border-primary bg-primary-50' :'border-border hover:border-secondary-300'
                }`}
                onClick={() => handleServiceToggle(service.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      bookingDetails.selectedServices.includes(service.id)
                        ? 'bg-primary text-white' :'bg-secondary-100 text-secondary-600'
                    }`}>
                      <Icon name={service.icon} size={16} />
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">{service.name}</div>
                      <div className="text-sm text-text-secondary">{formatPrice(service.price)} {service.unit}</div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    bookingDetails.selectedServices.includes(service.id)
                      ? 'border-primary bg-primary' :'border-secondary-300'
                  }`}>
                    {bookingDetails.selectedServices.includes(service.id) && (
                      <Icon name="Check" size={12} color="white" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Special Requests</label>
            <textarea
              placeholder="Any special requirements or requests..."
              value={bookingDetails.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
        </div>
      )}

      {/* Step 3: Review & Confirm */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <h4 className="font-medium text-text-primary">Booking Summary</h4>
          
          {/* Booking Details */}
          <div className="bg-surface-secondary rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-text-secondary">Date</span>
              <span className="font-medium text-text-primary">
                {bookingDetails.date ? bookingDetails.date.toLocaleDateString() : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Time</span>
              <span className="font-medium text-text-primary">
                {bookingDetails.startTime} - {bookingDetails.endTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Guests</span>
              <span className="font-medium text-text-primary">{bookingDetails.guestCount}</span>
            </div>
          </div>

          {/* Selected Services */}
          {bookingDetails.selectedServices.length > 0 && (
            <div className="bg-surface-secondary rounded-lg p-4">
              <h5 className="font-medium text-text-primary mb-2">Selected Services</h5>
              <div className="space-y-1">
                {bookingDetails.selectedServices.map(serviceId => {
                  const service = availableServices.find(s => s.id === serviceId);
                  return (
                    <div key={serviceId} className="flex justify-between text-sm">
                      <span className="text-text-secondary">{service.name}</span>
                      <span className="text-text-primary">
                        {formatPrice(service.unit === 'per person' && bookingDetails.guestCount 
                          ? service.price * parseInt(bookingDetails.guestCount)
                          : service.price
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pricing Breakdown */}
          <div className="bg-surface-secondary rounded-lg p-4">
            <h5 className="font-medium text-text-primary mb-3">Price Breakdown</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Base rate</span>
                <span className="text-text-primary">{formatPrice(pricingBreakdown.basePrice)}</span>
              </div>
              {pricingBreakdown.servicesTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Services</span>
                  <span className="text-text-primary">{formatPrice(pricingBreakdown.servicesTotal)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-text-secondary">Cleaning fee</span>
                <span className="text-text-primary">{formatPrice(venue.cleaningFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Security deposit</span>
                <span className="text-text-primary">{formatPrice(venue.securityDeposit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Taxes</span>
                <span className="text-text-primary">{formatPrice(pricingBreakdown.taxes)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-medium">
                <span className="text-text-primary">Total</span>
                <span className="text-primary text-lg">{formatPrice(pricingBreakdown.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex space-x-3 mt-6">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={handlePrevStep}
            iconName="ChevronLeft"
            iconPosition="left"
            className="flex-1"
          >
            Previous
          </Button>
        )}
        
        {currentStep < 3 ? (
          <Button
            variant="primary"
            onClick={handleNextStep}
            disabled={!isStepValid()}
            iconName="ChevronRight"
            iconPosition="right"
            className="flex-1"
          >
            Next
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSubmitBooking}
            disabled={!isStepValid()}
            iconName="CreditCard"
            iconPosition="left"
            className="flex-1"
          >
            Book Now
          </Button>
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-4 p-3 bg-success-50 border border-success-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Shield" size={16} color="var(--color-success)" className="mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-success-700">Secure Booking</p>
            <p className="text-success-600">Your payment information is encrypted and secure. You won't be charged until your booking is confirmed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;