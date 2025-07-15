import React from 'react';
import Icon from '../../../components/AppIcon';

import Input from '../../../components/ui/Input';

const TransactionTab = ({ config, onChange, onNestedChange }) => {
  const currencies = [
    { code: 'OMR', name: 'Omani Rial', symbol: 'OMR' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR' }
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Cards', icon: 'CreditCard' },
    { id: 'wallet', name: 'Digital Wallets', icon: 'Wallet' },
    { id: 'bank', name: 'Bank Transfer', icon: 'Building2' }
  ];

  const handlePaymentMethodChange = (methodId, enabled) => {
    const currentMethods = config?.paymentMethods || [];
    let newMethods;
    
    if (enabled) {
      newMethods = [...currentMethods, methodId];
    } else {
      newMethods = currentMethods.filter(method => method !== methodId);
    }
    
    onChange('paymentMethods', newMethods);
  };

  const isPaymentMethodEnabled = (methodId) => {
    return config?.paymentMethods?.includes(methodId) || false;
  };

  return (
    <div className="space-y-8">
      {/* Currency Settings */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Currency Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Default Currency
            </label>
            <select
              value={config?.currency || 'OMR'}
              onChange={(e) => onChange('currency', e.target.value)}
              className="form-input w-full"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
            <p className="text-xs text-text-muted mt-1">
              Primary currency for all transactions
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Transaction Fee (%)
            </label>
            <div className="relative">
              <Input
                type="number"
                value={config?.transactionFee || ''}
                onChange={(e) => onChange('transactionFee', parseFloat(e.target.value))}
                placeholder="2.5"
                min="0"
                max="10"
                step="0.1"
                className="pr-8"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-sm text-text-muted">%</span>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-1">
              Platform fee charged per transaction
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Limits */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Transaction Limits</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Minimum Amount ({config?.currency || 'OMR'})
            </label>
            <Input
              type="number"
              value={config?.minAmount || ''}
              onChange={(e) => onChange('minAmount', parseFloat(e.target.value))}
              placeholder="1.00"
              min="0"
              step="0.01"
            />
            <p className="text-xs text-text-muted mt-1">
              Minimum transaction amount allowed
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Maximum Amount ({config?.currency || 'OMR'})
            </label>
            <Input
              type="number"
              value={config?.maxAmount || ''}
              onChange={(e) => onChange('maxAmount', parseFloat(e.target.value))}
              placeholder="10000.00"
              min="1"
              step="0.01"
            />
            <p className="text-xs text-text-muted mt-1">
              Maximum transaction amount allowed
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Payment Methods</h3>
        
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name={method.icon} size={20} color="var(--color-primary)" />
                <div>
                  <h4 className="text-sm font-medium text-text-primary">{method.name}</h4>
                  <p className="text-xs text-text-secondary">
                    {method.id === 'card' && 'Visa, Mastercard, and local cards'}
                    {method.id === 'wallet' && 'Apple Pay, Google Pay, and local wallets'}
                    {method.id === 'bank' && 'Direct bank transfers and online banking'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  checked={isPaymentMethodEnabled(method.id)}
                  onChange={(e) => handlePaymentMethodChange(method.id, e.target.checked)}
                />
                <span className="text-sm text-text-secondary">
                  {isPaymentMethodEnabled(method.id) ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refund Settings */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Refund Configuration</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-text-primary">Automatic Refunds</h4>
              <p className="text-xs text-text-secondary">
                Enable automatic refund processing for eligible transactions
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                checked={config?.autoRefund || false}
                onChange={(e) => onChange('autoRefund', e.target.checked)}
              />
              <span className="text-sm text-text-secondary">
                {config?.autoRefund ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
          
          {config?.autoRefund && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Refund Period (days)
              </label>
              <Input
                type="number"
                value={config?.refundPeriod || ''}
                onChange={(e) => onChange('refundPeriod', parseInt(e.target.value))}
                placeholder="30"
                min="1"
                max="365"
                className="w-32"
              />
              <p className="text-xs text-text-muted mt-1">
                Number of days customers can request refunds
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Transaction Settings */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Advanced Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Retry Attempts
            </label>
            <Input
              type="number"
              value={config?.retryAttempts || ''}
              onChange={(e) => onChange('retryAttempts', parseInt(e.target.value))}
              placeholder="3"
              min="1"
              max="10"
            />
            <p className="text-xs text-text-muted mt-1">
              Number of retry attempts for failed payments
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Timeout (seconds)
            </label>
            <Input
              type="number"
              value={config?.timeout || ''}
              onChange={(e) => onChange('timeout', parseInt(e.target.value))}
              placeholder="30"
              min="10"
              max="300"
            />
            <p className="text-xs text-text-muted mt-1">
              Payment session timeout duration
            </p>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Custom Error Messages</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Payment Declined
            </label>
            <Input
              type="text"
              value={config?.errorMessages?.declined || ''}
              onChange={(e) => onNestedChange('errorMessages', 'declined', e.target.value)}
              placeholder="Payment declined. Please try another card."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Card Expired
            </label>
            <Input
              type="text"
              value={config?.errorMessages?.expired || ''}
              onChange={(e) => onNestedChange('errorMessages', 'expired', e.target.value)}
              placeholder="Your card has expired. Please use a different card."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Insufficient Funds
            </label>
            <Input
              type="text"
              value={config?.errorMessages?.insufficient || ''}
              onChange={(e) => onNestedChange('errorMessages', 'insufficient', e.target.value)}
              placeholder="Insufficient funds. Please check your account balance."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTab;