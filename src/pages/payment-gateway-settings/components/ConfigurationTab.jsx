import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ConfigurationTab = ({ config, onChange, onTest, gatewayStatus }) => {
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  const handleTestConnection = async () => {
    setTestingConnection(true);
    try {
      await onTest();
    } finally {
      setTestingConnection(false);
    }
  };

  const validateWebhookUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const isWebhookUrlValid = config?.webhookUrl ? validateWebhookUrl(config.webhookUrl) : true;

  return (
    <div className="space-y-8">
      {/* Thawani Gateway Configuration */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Thawani Gateway Configuration</h3>
            <p className="text-sm text-text-secondary mt-1">
              Configure your Thawani payment gateway credentials and settings
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Icon name="CreditCard" size={16} color="white" />
            </div>
            <span className="text-sm font-medium text-text-primary">Thawani</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Environment Selection */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Environment
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="environment"
                  value="sandbox"
                  checked={config?.environment === 'sandbox'}
                  onChange={(e) => onChange('environment', e.target.value)}
                />
                <span className="text-sm text-text-secondary">Sandbox (Testing)</span>
              </label>
              <label className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="environment"
                  value="production"
                  checked={config?.environment === 'production'}
                  onChange={(e) => onChange('environment', e.target.value)}
                />
                <span className="text-sm text-text-secondary">Production (Live)</span>
              </label>
            </div>
            {config?.environment === 'production' && (
              <div className="mt-2 p-3 bg-warning-50 border border-warning-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
                  <span className="text-sm text-warning-700">
                    Production mode will process real payments. Ensure all settings are correct.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Publishable Key */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Publishable Key *
            </label>
            <div className="relative">
              <Input
                type="text"
                value={config?.publishableKey || ''}
                onChange={(e) => onChange('publishableKey', e.target.value)}
                placeholder="pk_test_..."
                className="pr-10"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Icon name="Eye" size={16} color="var(--color-text-muted)" />
              </div>
            </div>
            <p className="text-xs text-text-muted mt-1">
              This key is used for client-side operations and is safe to expose publicly
            </p>
          </div>

          {/* Secret Key */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Secret Key *
            </label>
            <div className="relative">
              <Input
                type={showSecretKey ? 'text' : 'password'}
                value={config?.secretKey || ''}
                onChange={(e) => onChange('secretKey', e.target.value)}
                placeholder="sk_test_..."
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowSecretKey(!showSecretKey)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <Icon 
                  name={showSecretKey ? 'EyeOff' : 'Eye'} 
                  size={16} 
                  color="var(--color-text-muted)" 
                />
              </button>
            </div>
            <p className="text-xs text-text-muted mt-1">
              This key is used for server-side operations and should be kept secure
            </p>
          </div>

          {/* Webhook URL */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Webhook URL
            </label>
            <div className="relative">
              <Input
                type="url"
                value={config?.webhookUrl || ''}
                onChange={(e) => onChange('webhookUrl', e.target.value)}
                placeholder="https://your-domain.com/api/webhooks/thawani"
                className={`pr-10 ${!isWebhookUrlValid ? 'border-error' : ''}`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Icon 
                  name={isWebhookUrlValid ? 'CheckCircle' : 'AlertCircle'} 
                  size={16} 
                  color={isWebhookUrlValid ? 'var(--color-success)' : 'var(--color-error)'} 
                />
              </div>
            </div>
            {!isWebhookUrlValid && config?.webhookUrl && (
              <p className="text-xs text-error mt-1">
                Webhook URL must be a valid HTTPS URL
              </p>
            )}
            <p className="text-xs text-text-muted mt-1">
              This URL will receive real-time payment notifications from Thawani
            </p>
          </div>
        </div>

        {/* Connection Test */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-text-primary">Connection Test</h4>
              <p className="text-xs text-text-secondary">
                Test your gateway configuration to ensure it's working properly
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  gatewayStatus === 'connected' ? 'bg-success' :
                  gatewayStatus === 'disconnected'? 'bg-warning' : 'bg-error'
                }`}></div>
                <span className="text-xs text-text-muted capitalize">
                  {gatewayStatus}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="TestTube"
                iconSize={14}
                onClick={handleTestConnection}
                loading={testingConnection}
                disabled={!config?.publishableKey || !config?.secretKey}
              >
                Test Connection
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Gateway Information */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Gateway Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-surface p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Globe" size={16} color="var(--color-primary)" />
              <span className="text-sm font-medium text-text-primary">Supported Regions</span>
            </div>
            <p className="text-sm text-text-secondary">Oman, UAE, Saudi Arabia</p>
          </div>
          
          <div className="bg-surface p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="CreditCard" size={16} color="var(--color-primary)" />
              <span className="text-sm font-medium text-text-primary">Payment Methods</span>
            </div>
            <p className="text-sm text-text-secondary">Cards, Digital Wallets</p>
          </div>
          
          <div className="bg-surface p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="DollarSign" size={16} color="var(--color-primary)" />
              <span className="text-sm font-medium text-text-primary">Supported Currencies</span>
            </div>
            <p className="text-sm text-text-secondary">OMR, AED, SAR</p>
          </div>
        </div>
      </div>

      {/* Integration Guide */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Integration Guide</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium">1</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-text-primary">Obtain API Keys</h4>
              <p className="text-xs text-text-secondary">
                Get your publishable and secret keys from Thawani merchant dashboard
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium">2</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-text-primary">Configure Webhook</h4>
              <p className="text-xs text-text-secondary">
                Set up webhook endpoint to receive real-time payment notifications
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium">3</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-text-primary">Test Integration</h4>
              <p className="text-xs text-text-secondary">
                Use sandbox environment to test payment flows before going live
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationTab;