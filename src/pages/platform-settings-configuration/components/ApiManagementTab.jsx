import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ApiManagementTab = ({ settings, onChange }) => {
  const [newOrigin, setNewOrigin] = useState('');
  const [regenerateSecret, setRegenerateSecret] = useState(false);

  const handleApiChange = (key, value) => {
    onChange(key, value);
  };

  const handleAddOrigin = () => {
    if (newOrigin.trim()) {
      const currentList = settings?.allowedOrigins || [];
      const updatedList = [...currentList, newOrigin.trim()];
      onChange('allowedOrigins', updatedList);
      setNewOrigin('');
    }
  };

  const handleRemoveOrigin = (index) => {
    const currentList = settings?.allowedOrigins || [];
    const updatedList = currentList.filter((_, i) => i !== index);
    onChange('allowedOrigins', updatedList);
  };

  const handleRegenerateSecret = () => {
    if (window.confirm('Are you sure you want to regenerate the webhook secret? This will invalidate the current secret.')) {
      const newSecret = generateRandomSecret();
      onChange('webhookSecret', newSecret);
      setRegenerateSecret(true);
      setTimeout(() => setRegenerateSecret(false), 3000);
    }
  };

  const generateRandomSecret = () => {
    return 'whsec_' + Math.random().toString(36).substr(2, 32);
  };

  const handleTestWebhook = async () => {
    try {
      // Mock webhook test
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Webhook test successful!');
    } catch (error) {
      alert('Webhook test failed. Please check your configuration.');
    }
  };

  return (
    <div className="space-y-8">
      {/* API Rate Limiting */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">API Rate Limiting</h2>
          <Icon name="Zap" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="form-label">Rate Limit (requests per window)</label>
              <Input
                type="number"
                value={settings?.apiRateLimit || 1000}
                onChange={(e) => handleApiChange('apiRateLimit', parseInt(e.target.value))}
                min="10"
                max="10000"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Time Window (seconds)</label>
              <Input
                type="number"
                value={settings?.apiTimeWindow || 60}
                onChange={(e) => handleApiChange('apiTimeWindow', parseInt(e.target.value))}
                min="1"
                max="3600"
                className="form-input"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="form-label">API Version</label>
              <select
                value={settings?.apiVersioning || 'v1'}
                onChange={(e) => handleApiChange('apiVersioning', e.target.value)}
                className="form-input"
              >
                <option value="v1">v1</option>
                <option value="v2">v2 (Beta)</option>
              </select>
            </div>

            <div>
              <label className="form-label">Deprecation Notice Period (days)</label>
              <Input
                type="number"
                value={settings?.deprecationNotice || 180}
                onChange={(e) => handleApiChange('deprecationNotice', parseInt(e.target.value))}
                min="30"
                max="365"
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-secondary-50 rounded-lg">
          <p className="text-sm text-text-secondary">
            Current configuration allows {settings?.apiRateLimit || 1000} requests per {settings?.apiTimeWindow || 60} seconds per API key.
          </p>
        </div>
      </div>

      {/* Webhook Configuration */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Webhook Configuration</h2>
          <Icon name="Webhook" size={20} className="text-text-muted" />
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label">Webhook Secret</label>
            <div className="flex items-center space-x-3">
              <Input
                type="password"
                value={settings?.webhookSecret || ''}
                onChange={(e) => handleApiChange('webhookSecret', e.target.value)}
                placeholder="Enter webhook secret"
                className="form-input flex-1"
                readOnly
              />
              <Button
                variant="outline"
                iconName="RefreshCw"
                iconSize={16}
                onClick={handleRegenerateSecret}
                className="text-sm"
              >
                Regenerate
              </Button>
            </div>
            {regenerateSecret && (
              <p className="text-xs text-success mt-1">
                Webhook secret regenerated successfully!
              </p>
            )}
          </div>

          <div>
            <label className="form-label">API Key Rotation Period (days)</label>
            <Input
              type="number"
              value={settings?.apiKeyRotationDays || 90}
              onChange={(e) => handleApiChange('apiKeyRotationDays', parseInt(e.target.value))}
              min="30"
              max="365"
              className="form-input"
            />
            <p className="text-xs text-text-muted mt-1">
              API keys will be automatically rotated after this period
            </p>
          </div>

          <div className="pt-4">
            <Button
              variant="outline"
              iconName="Send"
              iconSize={16}
              onClick={handleTestWebhook}
              className="text-sm"
            >
              Test Webhook
            </Button>
          </div>
        </div>
      </div>

      {/* CORS Configuration */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">CORS Configuration</h2>
          <Icon name="Globe" size={20} className="text-text-muted" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Input
              value={newOrigin}
              onChange={(e) => setNewOrigin(e.target.value)}
              placeholder="Enter allowed origin (e.g., https://app.example.com)"
              className="form-input flex-1"
            />
            <Button
              variant="outline"
              iconName="Plus"
              iconSize={16}
              onClick={handleAddOrigin}
              disabled={!newOrigin.trim()}
            >
              Add Origin
            </Button>
          </div>

          <div className="space-y-2">
            {(settings?.allowedOrigins || []).map((origin, index) => (
              <div key={index} className="flex items-center justify-between bg-secondary-50 p-3 rounded-lg">
                <span className="text-sm font-mono">{origin}</span>
                <Button
                  variant="ghost"
                  iconName="X"
                  iconSize={14}
                  onClick={() => handleRemoveOrigin(index)}
                  className="text-error hover:text-error-600"
                />
              </div>
            ))}
          </div>

          {(!settings?.allowedOrigins || settings.allowedOrigins.length === 0) && (
            <div className="text-sm text-text-muted text-center py-4">
              No origins configured. API will accept requests from any origin.
            </div>
          )}
        </div>
      </div>

      {/* API Settings */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">API Settings</h2>
          <Icon name="Settings" size={20} className="text-text-muted" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Input
              type="checkbox"
              checked={settings?.apiLoggingEnabled || false}
              onChange={(e) => handleApiChange('apiLoggingEnabled', e.target.checked)}
            />
            <label className="text-sm">Enable API request logging</label>
          </div>

          <div className="bg-secondary-50 p-4 rounded-lg">
            <h3 className="font-medium text-text-primary mb-2">API Documentation</h3>
            <p className="text-sm text-text-secondary mb-3">
              View comprehensive API documentation and examples
            </p>
            <Button variant="outline" iconName="ExternalLink" iconSize={16} className="text-sm">
              View Documentation
            </Button>
          </div>
        </div>
      </div>

      {/* API Statistics */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">API Statistics</h2>
          <Icon name="BarChart3" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-secondary-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-text-primary">12,345</div>
            <div className="text-sm text-text-secondary">Requests Today</div>
          </div>
          
          <div className="bg-secondary-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-success">99.8%</div>
            <div className="text-sm text-text-secondary">Uptime</div>
          </div>
          
          <div className="bg-secondary-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-primary">145ms</div>
            <div className="text-sm text-text-secondary">Avg Response Time</div>
          </div>
          
          <div className="bg-secondary-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-error">23</div>
            <div className="text-sm text-text-secondary">Rate Limited</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiManagementTab;