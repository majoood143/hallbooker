import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const PaymentStep = ({ paymentData, onPaymentChange, onNext, onBack, totalAmount }) => {
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const paymentMethods = [
    {
      id: 'credit-card',
      name: 'Credit/Debit Card',
      icon: 'CreditCard',
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'Wallet',
      description: 'Pay with your PayPal account'
    },
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      icon: 'Building2',
      description: 'Direct bank transfer'
    }
  ];

  const validatePayment = () => {
    const newErrors = {};

    if (!paymentData.method) {
      newErrors.method = 'Please select a payment method';
    }

    if (paymentData.method === 'credit-card') {
      if (!paymentData.cardNumber?.replace(/\s/g, '')) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(paymentData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }

      if (!paymentData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentData.expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }

      if (!paymentData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV';
      }

      if (!paymentData.cardholderName?.trim()) {
        newErrors.cardholderName = 'Cardholder name is required';
      }
    }

    if (!paymentData.billingAddress?.street?.trim()) {
      newErrors.billingStreet = 'Street address is required';
    }

    if (!paymentData.billingAddress?.city?.trim()) {
      newErrors.billingCity = 'City is required';
    }

    if (!paymentData.billingAddress?.zipCode?.trim()) {
      newErrors.billingZipCode = 'ZIP code is required';
    }

    if (!paymentData.termsAccepted) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      onPaymentChange({
        ...paymentData,
        [parent]: {
          ...paymentData[parent],
          [child]: value
        }
      });
    } else {
      onPaymentChange({
        ...paymentData,
        [field]: value
      });
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    if (!validatePayment()) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onNext();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          Payment Information
        </h2>
        <p className="text-text-secondary">
          Complete your booking with secure payment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-surface border border-border rounded-lg p-6">
            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">
                Payment Method
              </h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      paymentData.method === method.id
                        ? 'border-primary bg-primary-50' :'border-border hover:border-secondary-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentData.method === method.id}
                      onChange={(e) => handleInputChange('method', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        paymentData.method === method.id
                          ? 'bg-primary text-white' :'bg-secondary-100 text-secondary-600'
                      }`}>
                        <Icon name={method.icon} size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">
                          {method.name}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {method.description}
                        </div>
                      </div>
                    </div>
                    {paymentData.method === method.id && (
                      <Icon name="CheckCircle" size={20} color="var(--color-primary)" />
                    )}
                  </label>
                ))}
              </div>
              {errors.method && (
                <p className="text-error text-sm mt-2">{errors.method}</p>
              )}
            </div>

            {/* Credit Card Details */}
            {paymentData.method === 'credit-card' && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-text-primary mb-4">
                  Card Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Card Number *</label>
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber || ''}
                      onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                      maxLength={19}
                      className={errors.cardNumber ? 'border-error' : ''}
                    />
                    {errors.cardNumber && (
                      <p className="text-error text-sm mt-1">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Expiry Date *</label>
                      <Input
                        type="text"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate || ''}
                        onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                        maxLength={5}
                        className={errors.expiryDate ? 'border-error' : ''}
                      />
                      {errors.expiryDate && (
                        <p className="text-error text-sm mt-1">{errors.expiryDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="form-label">CVV *</label>
                      <Input
                        type="text"
                        placeholder="123"
                        value={paymentData.cvv || ''}
                        onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                        maxLength={4}
                        className={errors.cvv ? 'border-error' : ''}
                      />
                      {errors.cvv && (
                        <p className="text-error text-sm mt-1">{errors.cvv}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Cardholder Name *</label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={paymentData.cardholderName || ''}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                      className={errors.cardholderName ? 'border-error' : ''}
                    />
                    {errors.cardholderName && (
                      <p className="text-error text-sm mt-1">{errors.cardholderName}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Billing Address */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">
                Billing Address
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Street Address *</label>
                  <Input
                    type="text"
                    placeholder="123 Main Street"
                    value={paymentData.billingAddress?.street || ''}
                    onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
                    className={errors.billingStreet ? 'border-error' : ''}
                  />
                  {errors.billingStreet && (
                    <p className="text-error text-sm mt-1">{errors.billingStreet}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">City *</label>
                    <Input
                      type="text"
                      placeholder="New York"
                      value={paymentData.billingAddress?.city || ''}
                      onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                      className={errors.billingCity ? 'border-error' : ''}
                    />
                    {errors.billingCity && (
                      <p className="text-error text-sm mt-1">{errors.billingCity}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">ZIP Code *</label>
                    <Input
                      type="text"
                      placeholder="10001"
                      value={paymentData.billingAddress?.zipCode || ''}
                      onChange={(e) => handleInputChange('billingAddress.zipCode', e.target.value)}
                      className={errors.billingZipCode ? 'border-error' : ''}
                    />
                    {errors.billingZipCode && (
                      <p className="text-error text-sm mt-1">{errors.billingZipCode}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-6">
              <label className="flex items-start space-x-3">
                <Input
                  type="checkbox"
                  checked={paymentData.termsAccepted || false}
                  onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                  className="mt-1"
                />
                <div className="text-sm">
                  <span className="text-text-secondary">
                    I agree to the{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-primary hover:text-primary-700 underline"
                  >
                    Terms and Conditions
                  </button>
                  <span className="text-text-secondary">
                    {' '}and{' '}
                  </span>
                  <button
                    type="button"
                    className="text-primary hover:text-primary-700 underline"
                  >
                    Privacy Policy
                  </button>
                </div>
              </label>
              {errors.terms && (
                <p className="text-error text-sm mt-2">{errors.terms}</p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface border border-border rounded-lg p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Payment Summary
            </h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Subtotal</span>
                <span className="text-text-primary">${(totalAmount * 0.9).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Tax</span>
                <span className="text-text-primary">${(totalAmount * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-text-primary">Total</span>
                  <span className="text-xl font-bold text-primary">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-success-50 border border-success-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <Icon name="Shield" size={16} color="var(--color-success)" />
                <span className="text-sm text-success-700 ml-2">
                  Secure payment protected by SSL encryption
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={handlePayment}
              disabled={isProcessing}
              loading={isProcessing}
              iconName="CreditCard"
            >
              {isProcessing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
            </Button>
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
          disabled={isProcessing}
        >
          Back to Services
        </Button>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300 p-4">
          <div className="bg-surface rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-text-primary">
                  Terms and Conditions
                </h3>
                <Button
                  variant="ghost"
                  iconName="X"
                  onClick={() => setShowTermsModal(false)}
                />
              </div>
              <div className="text-sm text-text-secondary space-y-4">
                <p>
                  By booking this venue, you agree to the following terms and conditions:
                </p>
                <p>
                  1. Payment is required in full at the time of booking confirmation.
                </p>
                <p>
                  2. Cancellations made more than 30 days before the event date will receive a full refund minus a 10% processing fee.
                </p>
                <p>
                  3. Cancellations made 15-30 days before the event will receive a 50% refund.
                </p>
                <p>
                  4. No refunds will be provided for cancellations made less than 15 days before the event.
                </p>
                <p>
                  5. The venue must be left in the same condition as received. Additional cleaning fees may apply.
                </p>
                <p>
                  6. The client is responsible for any damages to the venue or equipment during the event.
                </p>
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  variant="primary"
                  onClick={() => setShowTermsModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStep;