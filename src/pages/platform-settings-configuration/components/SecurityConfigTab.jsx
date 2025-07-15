import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SecurityConfigTab = ({ settings, onChange }) => {
  const [newIpAddress, setNewIpAddress] = useState('');
  const [newDomain, setNewDomain] = useState('');

  const handlePasswordPolicyChange = (key, value) => {
    onChange(key, value);
  };

  const handleAddIpAddress = () => {
    if (newIpAddress.trim()) {
      const currentList = settings?.ipWhitelist || [];
      const updatedList = [...currentList, newIpAddress.trim()];
      onChange('ipWhitelist', updatedList);
      setNewIpAddress('');
    }
  };

  const handleRemoveIpAddress = (index) => {
    const currentList = settings?.ipWhitelist || [];
    const updatedList = currentList.filter((_, i) => i !== index);
    onChange('ipWhitelist', updatedList);
  };

  const handleAddDomain = () => {
    if (newDomain.trim()) {
      const currentList = settings?.allowedDomains || [];
      const updatedList = [...currentList, newDomain.trim()];
      onChange('allowedDomains', updatedList);
      setNewDomain('');
    }
  };

  const handleRemoveDomain = (index) => {
    const currentList = settings?.allowedDomains || [];
    const updatedList = currentList.filter((_, i) => i !== index);
    onChange('allowedDomains', updatedList);
  };

  return (
    <div className="space-y-8">
      {/* Password Policy */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Password Policy</h2>
          <Icon name="Lock" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="form-label">Minimum Password Length</label>
              <Input
                type="number"
                value={settings?.passwordMinLength || 8}
                onChange={(e) => handlePasswordPolicyChange('passwordMinLength', parseInt(e.target.value))}
                min="6"
                max="32"
                className="form-input"
              />
            </div>

            <div className="space-y-3">
              <label className="form-label">Password Requirements</label>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Input
                    type="checkbox"
                    checked={settings?.passwordRequireUppercase || false}
                    onChange={(e) => handlePasswordPolicyChange('passwordRequireUppercase', e.target.checked)}
                  />
                  <label className="text-sm">Require uppercase letters (A-Z)</label>
                </div>

                <div className="flex items-center space-x-3">
                  <Input
                    type="checkbox"
                    checked={settings?.passwordRequireLowercase || false}
                    onChange={(e) => handlePasswordPolicyChange('passwordRequireLowercase', e.target.checked)}
                  />
                  <label className="text-sm">Require lowercase letters (a-z)</label>
                </div>

                <div className="flex items-center space-x-3">
                  <Input
                    type="checkbox"
                    checked={settings?.passwordRequireNumbers || false}
                    onChange={(e) => handlePasswordPolicyChange('passwordRequireNumbers', e.target.checked)}
                  />
                  <label className="text-sm">Require numbers (0-9)</label>
                </div>

                <div className="flex items-center space-x-3">
                  <Input
                    type="checkbox"
                    checked={settings?.passwordRequireSymbols || false}
                    onChange={(e) => handlePasswordPolicyChange('passwordRequireSymbols', e.target.checked)}
                  />
                  <label className="text-sm">Require symbols (!@#$%^&*)</label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="form-label">Session Timeout (minutes)</label>
              <Input
                type="number"
                value={settings?.sessionTimeout || 30}
                onChange={(e) => handlePasswordPolicyChange('sessionTimeout', parseInt(e.target.value))}
                min="5"
                max="480"
                className="form-input"
              />
              <p className="text-xs text-text-muted mt-1">
                User sessions will expire after this period of inactivity
              </p>
            </div>

            <div>
              <label className="form-label">Max Login Attempts</label>
              <Input
                type="number"
                value={settings?.maxLoginAttempts || 5}
                onChange={(e) => handlePasswordPolicyChange('maxLoginAttempts', parseInt(e.target.value))}
                min="1"
                max="10"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Lockout Duration (minutes)</label>
              <Input
                type="number"
                value={settings?.lockoutDuration || 15}
                onChange={(e) => handlePasswordPolicyChange('lockoutDuration', parseInt(e.target.value))}
                min="1"
                max="60"
                className="form-input"
              />
              <p className="text-xs text-text-muted mt-1">
                Account lockout time after exceeding max attempts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Two-Factor Authentication</h2>
          <Icon name="Shield" size={20} className="text-text-muted" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Input
              type="checkbox"
              checked={settings?.twoFactorRequired || false}
              onChange={(e) => onChange('twoFactorRequired', e.target.checked)}
            />
            <label className="text-sm font-medium">Require 2FA for all admin accounts</label>
          </div>

          {settings?.twoFactorRequired && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Info" size={16} className="text-primary" />
                <span className="text-sm text-primary">
                  Two-factor authentication will be required for all admin users. Existing users will be prompted to set up 2FA on next login.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* IP Whitelist */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">IP Address Whitelist</h2>
          <Icon name="Globe" size={20} className="text-text-muted" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Input
              value={newIpAddress}
              onChange={(e) => setNewIpAddress(e.target.value)}
              placeholder="Enter IP address (e.g., 192.168.1.100)"
              className="form-input flex-1"
            />
            <Button
              variant="outline"
              iconName="Plus"
              iconSize={16}
              onClick={handleAddIpAddress}
              disabled={!newIpAddress.trim()}
            >
              Add IP
            </Button>
          </div>

          <div className="space-y-2">
            {(settings?.ipWhitelist || []).map((ip, index) => (
              <div key={index} className="flex items-center justify-between bg-secondary-50 p-3 rounded-lg">
                <span className="text-sm font-mono">{ip}</span>
                <Button
                  variant="ghost"
                  iconName="X"
                  iconSize={14}
                  onClick={() => handleRemoveIpAddress(index)}
                  className="text-error hover:text-error-600"
                />
              </div>
            ))}
          </div>

          {(!settings?.ipWhitelist || settings.ipWhitelist.length === 0) && (
            <div className="text-sm text-text-muted text-center py-4">
              No IP addresses configured. Add IP addresses to restrict admin access.
            </div>
          )}
        </div>
      </div>

      {/* Domain Restrictions */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Email Domain Restrictions</h2>
          <Icon name="Mail" size={20} className="text-text-muted" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Input
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="Enter domain (e.g., company.com)"
              className="form-input flex-1"
            />
            <Button
              variant="outline"
              iconName="Plus"
              iconSize={16}
              onClick={handleAddDomain}
              disabled={!newDomain.trim()}
            >
              Add Domain
            </Button>
          </div>

          <div className="space-y-2">
            {(settings?.allowedDomains || []).map((domain, index) => (
              <div key={index} className="flex items-center justify-between bg-secondary-50 p-3 rounded-lg">
                <span className="text-sm font-mono">{domain}</span>
                <Button
                  variant="ghost"
                  iconName="X"
                  iconSize={14}
                  onClick={() => handleRemoveDomain(index)}
                  className="text-error hover:text-error-600"
                />
              </div>
            ))}
          </div>

          {(!settings?.allowedDomains || settings.allowedDomains.length === 0) && (
            <div className="text-sm text-text-muted text-center py-4">
              No domain restrictions configured. Users can register with any email domain.
            </div>
          )}
        </div>
      </div>

      {/* Security Summary */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Security Summary</h2>
          <Icon name="CheckCircle" size={20} className="text-success" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-secondary-50 p-4 rounded-lg">
            <h3 className="font-medium text-text-primary mb-2">Password Policy</h3>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Minimum {settings?.passwordMinLength || 8} characters</li>
              <li>• {settings?.passwordRequireUppercase ? '✓' : '✗'} Uppercase required</li>
              <li>• {settings?.passwordRequireLowercase ? '✓' : '✗'} Lowercase required</li>
              <li>• {settings?.passwordRequireNumbers ? '✓' : '✗'} Numbers required</li>
              <li>• {settings?.passwordRequireSymbols ? '✓' : '✗'} Symbols required</li>
            </ul>
          </div>

          <div className="bg-secondary-50 p-4 rounded-lg">
            <h3 className="font-medium text-text-primary mb-2">Access Controls</h3>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Session timeout: {settings?.sessionTimeout || 30} minutes</li>
              <li>• Max login attempts: {settings?.maxLoginAttempts || 5}</li>
              <li>• Lockout duration: {settings?.lockoutDuration || 15} minutes</li>
              <li>• 2FA required: {settings?.twoFactorRequired ? 'Yes' : 'No'}</li>
              <li>• IP whitelist: {(settings?.ipWhitelist || []).length} addresses</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityConfigTab;