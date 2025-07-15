import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const IntegrationControlsPanel = ({ config, onChange }) => {
  const handleConfigChange = (key, value) => {
    onChange(key, value);
  };

  const paymentGatewayOptions = [
    { value: 'thawani', label: 'Thawani Pay' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'razorpay', label: 'Razorpay' }
  ];

  const mapsProviderOptions = [
    { value: 'google', label: 'Google Maps' },
    { value: 'mapbox', label: 'Mapbox' },
    { value: 'openstreetmap', label: 'OpenStreetMap' }
  ];

  const analyticsProviderOptions = [
    { value: 'google', label: 'Google Analytics' },
    { value: 'mixpanel', label: 'Mixpanel' },
    { value: 'segment', label: 'Segment' }
  ];

  const smsProviderOptions = [
    { value: 'twilio', label: 'Twilio' },
    { value: 'aws-sns', label: 'AWS SNS' },
    { value: 'nexmo', label: 'Vonage (Nexmo)' }
  ];

  const emailProviderOptions = [
    { value: 'smtp', label: 'SMTP' },
    { value: 'sendgrid', label: 'SendGrid' },
    { value: 'mailgun', label: 'Mailgun' },
    { value: 'aws-ses', label: 'AWS SES' }
  ];

  const notificationProviderOptions = [
    { value: 'firebase', label: 'Firebase Cloud Messaging' },
    { value: 'onesignal', label: 'OneSignal' },
    { value: 'pusher', label: 'Pusher' }
  ];

  const handleTestIntegration = async (provider) => {
    try {
      console.log(`Testing ${provider} integration...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`${provider} integration test successful!`);
    } catch (error) {
      alert(`${provider} integration test failed. Please check your configuration.`);
    }
  };

  const getIntegrationStatus = (provider) => {
    // Mock integration status
    const statuses = ['connected', 'disconnected', 'error'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-success';
      case 'disconnected':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-text-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return 'CheckCircle';
      case 'disconnected':
        return 'AlertCircle';
      case 'error':
        return 'XCircle';
      default:
        return 'HelpCircle';
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Gateway Integration */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Payment Gateway Integration</h2>
          <div className="flex items-center space-x-2">
            <Icon 
              name={getStatusIcon(getIntegrationStatus('payment'))} 
              size={16} 
              className={getStatusColor(getIntegrationStatus('payment'))}
            />
            <Icon name="CreditCard" size={20} className="text-text-muted" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label">Payment Gateway Provider</label>
            <select
              value={config?.paymentGateway || 'thawani'}
              onChange={(e) => handleConfigChange('paymentGateway', e.target.value)}
              className="form-input"
            >
              {paymentGatewayOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              iconName="TestTube"
              iconSize={16}
              onClick={() => handleTestIntegration('Payment Gateway')}
              className="text-sm"
            >
              Test Connection
            </Button>
            <Button
              variant="outline"
              iconName="Settings"
              iconSize={16}
              className="text-sm"
            >
              Configure
            </Button>
          </div>
        </div>
      </div>

      {/* Maps Integration */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Maps Integration</h2>
          <div className="flex items-center space-x-2">
            <Icon 
              name={getStatusIcon(getIntegrationStatus('maps'))} 
              size={16} 
              className={getStatusColor(getIntegrationStatus('maps'))}
            />
            <Icon name="MapPin" size={20} className="text-text-muted" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label">Maps Provider</label>
            <select
              value={config?.mapsProvider || 'google'}
              onChange={(e) => handleConfigChange('mapsProvider', e.target.value)}
              className="form-input"
            >
              {mapsProviderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              iconName="TestTube"
              iconSize={16}
              onClick={() => handleTestIntegration('Maps')}
              className="text-sm"
            >
              Test Connection
            </Button>
            <Button
              variant="outline"
              iconName="Settings"
              iconSize={16}
              className="text-sm"
            >
              Configure
            </Button>
          </div>
        </div>
      </div>

      {/* Analytics Integration */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Analytics Integration</h2>
          <div className="flex items-center space-x-2">
            <Icon 
              name={getStatusIcon(getIntegrationStatus('analytics'))} 
              size={16} 
              className={getStatusColor(getIntegrationStatus('analytics'))}
            />
            <Icon name="BarChart3" size={20} className="text-text-muted" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label">Analytics Provider</label>
            <select
              value={config?.analyticsProvider || 'google'}
              onChange={(e) => handleConfigChange('analyticsProvider', e.target.value)}
              className="form-input"
            >
              {analyticsProviderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              iconName="TestTube"
              iconSize={16}
              onClick={() => handleTestIntegration('Analytics')}
              className="text-sm"
            >
              Test Connection
            </Button>
            <Button
              variant="outline"
              iconName="Settings"
              iconSize={16}
              className="text-sm"
            >
              Configure
            </Button>
          </div>
        </div>
      </div>

      {/* Communication Services */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Communication Services</h2>
          <Icon name="MessageSquare" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="form-label">SMS Provider</label>
              <div className="flex items-center space-x-2">
                <select
                  value={config?.smsProvider || 'twilio'}
                  onChange={(e) => handleConfigChange('smsProvider', e.target.value)}
                  className="form-input flex-1"
                >
                  {smsProviderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Icon 
                  name={getStatusIcon(getIntegrationStatus('sms'))} 
                  size={16} 
                  className={getStatusColor(getIntegrationStatus('sms'))}
                />
              </div>
            </div>

            <div>
              <label className="form-label">Email Provider</label>
              <div className="flex items-center space-x-2">
                <select
                  value={config?.emailProvider || 'smtp'}
                  onChange={(e) => handleConfigChange('emailProvider', e.target.value)}
                  className="form-input flex-1"
                >
                  {emailProviderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Icon 
                  name={getStatusIcon(getIntegrationStatus('email'))} 
                  size={16} 
                  className={getStatusColor(getIntegrationStatus('email'))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="form-label">Push Notification Provider</label>
              <div className="flex items-center space-x-2">
                <select
                  value={config?.notificationProvider || 'firebase'}
                  onChange={(e) => handleConfigChange('notificationProvider', e.target.value)}
                  className="form-input flex-1"
                >
                  {notificationProviderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Icon 
                  name={getStatusIcon(getIntegrationStatus('notification'))} 
                  size={16} 
                  className={getStatusColor(getIntegrationStatus('notification'))}
                />
              </div>
            </div>

            <div className="bg-secondary-50 p-4 rounded-lg">
              <h3 className="font-medium text-text-primary mb-2">Test All Services</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  iconName="Send"
                  iconSize={16}
                  className="text-sm w-full"
                  onClick={() => handleTestIntegration('Communication Services')}
                >
                  Test All Integrations
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Health */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Integration Health</h2>
          <Icon name="Activity" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-secondary-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-text-primary">Payment Gateway</h3>
              <Icon name="CheckCircle" size={16} className="text-success" />
            </div>
            <p className="text-sm text-text-secondary">99.9% uptime</p>
            <p className="text-sm text-text-secondary">Last checked: 2 mins ago</p>
          </div>

          <div className="bg-secondary-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-text-primary">Maps Service</h3>
              <Icon name="CheckCircle" size={16} className="text-success" />
            </div>
            <p className="text-sm text-text-secondary">100% uptime</p>
            <p className="text-sm text-text-secondary">Last checked: 1 min ago</p>
          </div>

          <div className="bg-secondary-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-text-primary">Email Service</h3>
              <Icon name="AlertTriangle" size={16} className="text-warning" />
            </div>
            <p className="text-sm text-text-secondary">95.2% uptime</p>
            <p className="text-sm text-text-secondary">Last checked: 5 mins ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationControlsPanel;