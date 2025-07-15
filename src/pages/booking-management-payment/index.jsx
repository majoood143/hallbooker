import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import BookingStatusIndicator from '../../components/ui/BookingStatusIndicator';
import SearchContextPreserver from '../../components/ui/SearchContextPreserver';
import QuickActionMenu from '../../components/ui/QuickActionMenu';
import BookingProgressIndicator from './components/BookingProgressIndicator';
import BookingSummaryCard from './components/BookingSummaryCard';
import BookingDetailsStep from './components/BookingDetailsStep';
import ServiceSelectionStep from './components/ServiceSelectionStep';
import PaymentStep from './components/PaymentStep';
import ConfirmationStep from './components/ConfirmationStep';

const BookingManagementPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mock user data - in real app this would come from authentication context
  const [user] = useState({
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'customer' // customer, venue_owner, admin
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    venue: {
      id: 1,
      name: 'Grand Ballroom at The Plaza',
      location: '768 5th Ave, New York, NY 10019',
      capacity: 200,
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400'
    },
    selectedDate: '2024-02-15',
    selectedTime: '18:00',
    duration: 6,
    guests: 150,
    eventType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    eventDescription: '',
    specialRequirements: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    services: [],
    pricing: {
      basePrice: 2500,
      taxRate: 0.1
    },
    totalAmount: 0
  });

  const [paymentData, setPaymentData] = useState({
    method: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      zipCode: ''
    },
    termsAccepted: false
  });

  const [bookingReference, setBookingReference] = useState('');

  const steps = [
    {
      id: 'summary',
      title: 'Review Booking',
      description: 'Confirm your venue selection',
      icon: 'Eye'
    },
    {
      id: 'details',
      title: 'Your Details',
      description: 'Contact and event information',
      icon: 'User'
    },
    {
      id: 'services',
      title: 'Add Services',
      description: 'Enhance your event',
      icon: 'Plus'
    },
    {
      id: 'payment',
      title: 'Payment',
      description: 'Secure payment processing',
      icon: 'CreditCard'
    },
    {
      id: 'confirmation',
      title: 'Confirmation',
      description: 'Booking complete',
      icon: 'CheckCircle'
    }
  ];

  // Calculate total amount whenever services change
  useEffect(() => {
    const basePrice = bookingData.pricing.basePrice;
    const servicesTotal = bookingData.services.reduce((sum, service) => sum + service.totalPrice, 0);
    const subtotal = basePrice + servicesTotal;
    const tax = subtotal * bookingData.pricing.taxRate;
    const total = subtotal + tax;

    setBookingData(prev => ({
      ...prev,
      totalAmount: total
    }));
  }, [bookingData.services, bookingData.pricing]);

  // Generate booking reference when reaching confirmation step
  useEffect(() => {
    if (currentStep === 4 && !bookingReference) {
      const reference = 'HB' + Date.now().toString().slice(-8).toUpperCase();
      setBookingReference(reference);
    }
  }, [currentStep, bookingReference]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormChange = (newData) => {
    setBookingData(prev => ({ ...prev, ...newData }));
  };

  const handleServicesChange = (services) => {
    setBookingData(prev => ({ ...prev, services }));
  };

  const handlePaymentChange = (newPaymentData) => {
    setPaymentData(newPaymentData);
  };

  const handleComplete = () => {
    navigate('/user-dashboard');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleStatusClick = (status) => {
    console.log('Booking status clicked:', status);
  };

  const handleQuickAction = (action, selectedItems) => {
    console.log('Quick action:', action, selectedItems);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-surface rounded-lg border border-border p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-2">
                  Review Your Booking
                </h2>
                <p className="text-text-secondary">
                  Please review your venue selection and booking details
                </p>
              </div>

              <BookingSummaryCard bookingData={bookingData} />

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Continue to Details
                </button>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <BookingDetailsStep
            formData={bookingData}
            onFormChange={handleFormChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 2:
        return (
          <ServiceSelectionStep
            selectedServices={bookingData.services}
            onServicesChange={handleServicesChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 3:
        return (
          <PaymentStep
            paymentData={paymentData}
            onPaymentChange={handlePaymentChange}
            onNext={handleNext}
            onBack={handleBack}
            totalAmount={bookingData.totalAmount}
          />
        );

      case 4:
        return (
          <ConfirmationStep
            bookingData={bookingData}
            bookingReference={bookingReference}
            onComplete={handleComplete}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation 
        user={user} 
        onNavigate={handleNavigation}
      />
      
      <SearchContextPreserver 
        searchParams={{
          query: 'ballroom',
          location: 'New York',
          totalResults: 25
        }}
      />

      <BookingProgressIndicator
        currentStep={currentStep}
        totalSteps={steps.length}
        steps={steps}
      />

      <main className="container-padding section-spacing">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {renderStepContent()}
          </div>

          {/* Sidebar - Only show summary on steps 1-3 */}
          {currentStep > 0 && currentStep < 4 && (
            <div className="lg:w-80">
              <BookingSummaryCard 
                bookingData={bookingData} 
                isSticky={true}
              />
            </div>
          )}
        </div>
      </main>

      <BookingStatusIndicator
        userRole={user.role}
        onStatusClick={handleStatusClick}
      />

      <QuickActionMenu
        userRole={user.role}
        currentScreen="booking-management-payment"
        onActionClick={handleQuickAction}
      />
    </div>
  );
};

export default BookingManagementPayment;