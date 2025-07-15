import React, { useState } from 'react';

import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const BookingDetailsStep = ({ formData, onFormChange, onNext, onBack }) => {
  const [errors, setErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.eventType?.trim()) {
      newErrors.eventType = 'Event type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    onFormChange({
      ...formData,
      [field]: value
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const handleNext = () => {
    setIsValidating(true);
    if (validateForm()) {
      onNext();
    }
    setIsValidating(false);
  };

  const eventTypes = [
    'Wedding',
    'Corporate Event',
    'Birthday Party',
    'Anniversary',
    'Conference',
    'Workshop',
    'Social Gathering',
    'Other'
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            Booking Details
          </h2>
          <p className="text-text-secondary">
            Please provide your contact information and event details
          </p>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  First Name *
                </label>
                <Input
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={errors.firstName ? 'border-error' : ''}
                />
                {errors.firstName && (
                  <p className="text-error text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="form-label">
                  Last Name *
                </label>
                <Input
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={errors.lastName ? 'border-error' : ''}
                />
                {errors.lastName && (
                  <p className="text-error text-sm mt-1">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="form-label">
                  Email Address *
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-error' : ''}
                />
                {errors.email && (
                  <p className="text-error text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="form-label">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? 'border-error' : ''}
                />
                {errors.phone && (
                  <p className="text-error text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Event Information */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-4">
              Event Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="form-label">
                  Event Type *
                </label>
                <select
                  value={formData.eventType || ''}
                  onChange={(e) => handleInputChange('eventType', e.target.value)}
                  className={`form-input ${errors.eventType ? 'border-error' : ''}`}
                >
                  <option value="">Select event type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.eventType && (
                  <p className="text-error text-sm mt-1">{errors.eventType}</p>
                )}
              </div>

              <div>
                <label className="form-label">
                  Event Description
                </label>
                <textarea
                  placeholder="Tell us more about your event (optional)"
                  value={formData.eventDescription || ''}
                  onChange={(e) => handleInputChange('eventDescription', e.target.value)}
                  rows={4}
                  className="form-input resize-none"
                />
              </div>

              <div>
                <label className="form-label">
                  Special Requirements
                </label>
                <textarea
                  placeholder="Any special requirements or requests (optional)"
                  value={formData.specialRequirements || ''}
                  onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                  rows={3}
                  className="form-input resize-none"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-4">
              Emergency Contact (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Contact Name
                </label>
                <Input
                  type="text"
                  placeholder="Emergency contact name"
                  value={formData.emergencyContactName || ''}
                  onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">
                  Contact Phone
                </label>
                <Input
                  type="tel"
                  placeholder="Emergency contact phone"
                  value={formData.emergencyContactPhone || ''}
                  onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 space-y-3 sm:space-y-0">
          <Button
            variant="outline"
            iconName="ArrowLeft"
            iconPosition="left"
            onClick={onBack}
          >
            Back to Summary
          </Button>

          <Button
            variant="primary"
            iconName="ArrowRight"
            iconPosition="right"
            onClick={handleNext}
            disabled={isValidating}
          >
            Continue to Services
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsStep;