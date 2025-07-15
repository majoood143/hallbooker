import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SecurityTab = ({ config, onChange, onNestedChange }) => {
  const [newIpAddress, setNewIpAddress] = useState('');
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  const handleAddIpAddress = () => {
    if (newIpAddress && isValidIpAddress(newIpAddress)) {
      const currentList = config?.ipWhitelist || [];
      if (!currentList.includes(newIpAddress)) {
        onChange('ipWhitelist', [...currentList, newIpAddress]);
        setNewIpAddress('');
      }
    }
  };

  const handleRemoveIpAddress = (ipToRemove) => {
    const currentList = config?.ipWhitelist || [];
    onChange('ipWhitelist', currentList.filter(ip => ip !== ipToRemove));
  };

  const isValidIpAddress = (ip) => {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

  const generateWebhookSecret = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    onChange('webhookSecret', result);
  };

  return (
    <div className="space-y-8">
      {/* SSL & Encryption */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">SSL & Encryption</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-text-primary">SSL Certificate Verification</h4>
              <p className="text-xs text-text-secondary">
                Verify SSL certificates for all API requests
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                checked={config?.sslVerification || false}
                onChange={(e) => onChange('sslVerification', e.target.checked)}
              />
              <span className="text-sm text-text-secondary">
                {config?.sslVerification ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-text-primary">PCI DSS Compliance</h4>
              <p className="text-xs text-text-secondary">
                Ensure all payment data handling meets PCI DSS standards
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                checked={config?.pciCompliance || false}
                onChange={(e) => onChange('pciCompliance', e.target.checked)}
              />
              <span className="text-sm text-text-secondary">
                {config?.pciCompliance ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fraud Detection */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Fraud Detection</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-text-primary">Real-time Fraud Detection</h4>
              <p className="text-xs text-text-secondary">
                Monitor transactions for suspicious patterns and behaviors
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                checked={config?.fraudDetection || false}
                onChange={(e) => onChange('fraudDetection', e.target.checked)}
              />
              <span className="text-sm text-text-secondary">
                {config?.fraudDetection ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
          
          {config?.fraudDetection && (
            <div className="bg-surface p-4 rounded-lg">
              <h5 className="text-sm font-medium text-text-primary mb-3">Fraud Detection Rules</h5>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input type="checkbox" defaultChecked />
                  <span className="text-sm text-text-secondary">Multiple failed attempts from same IP</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Input type="checkbox" defaultChecked />
                  <span className="text-sm text-text-secondary">Unusual spending patterns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Input type="checkbox" defaultChecked />
                  <span className="text-sm text-text-secondary">Geolocation anomalies</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Input type="checkbox" />
                  <span className="text-sm text-text-secondary">High-risk merchant categories</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* IP Whitelist */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">IP Whitelist</h3>
        <p className="text-sm text-text-secondary mb-4">
          Restrict API access to specific IP addresses for enhanced security
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={newIpAddress}
              onChange={(e) => setNewIpAddress(e.target.value)}
              placeholder="192.168.1.100"
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              iconSize={14}
              onClick={handleAddIpAddress}
              disabled={!newIpAddress || !isValidIpAddress(newIpAddress)}
            >
              Add IP
            </Button>
          </div>
          
          {config?.ipWhitelist && config.ipWhitelist.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-text-primary">Whitelisted IPs</h5>
              {config.ipWhitelist.map((ip, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-surface rounded-md">
                  <span className="text-sm text-text-secondary">{ip}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="X"
                    iconSize={12}
                    onClick={() => handleRemoveIpAddress(ip)}
                    className="text-error hover:text-error"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Webhook Security */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Webhook Security</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Webhook Secret Key
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Input
                  type={showWebhookSecret ? 'text' : 'password'}
                  value={config?.webhookSecret || ''}
                  onChange={(e) => onChange('webhookSecret', e.target.value)}
                  placeholder="Enter webhook secret key"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <Icon 
                    name={showWebhookSecret ? 'EyeOff' : 'Eye'} 
                    size={16} 
                    color="var(--color-text-muted)" 
                  />
                </button>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                iconSize={14}
                onClick={generateWebhookSecret}
              >
                Generate
              </Button>
            </div>
            <p className="text-xs text-text-muted mt-1">
              Used to verify webhook payload authenticity
            </p>
          </div>
          
          <div className="bg-surface p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Shield" size={16} color="var(--color-primary)" />
              <h5 className="text-sm font-medium text-text-primary">Security Best Practices</h5>
            </div>
            <ul className="text-xs text-text-secondary space-y-1">
              <li>• Always verify webhook signatures</li>
              <li>• Use HTTPS for all webhook endpoints</li>
              <li>• Implement proper authentication</li>
              <li>• Log all webhook activities</li>
              <li>• Handle duplicate webhook events</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security Monitoring */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Security Monitoring</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-text-primary">Activity Monitoring</h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Failed Login Attempts</span>
                <span className="text-success">0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Suspicious Transactions</span>
                <span className="text-warning">2</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Blocked IP Addresses</span>
                <span className="text-error">5</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-text-primary">Security Alerts</h5>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-xs text-text-secondary">SSL Certificate Valid</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-xs text-text-secondary">PCI Compliance Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-xs text-text-secondary">Fraud Detection Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;