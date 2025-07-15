import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EmailNotificationsTab = ({ settings, onChange }) => {
  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const handleSMTPChange = (key, value) => {
    onChange(key, value);
  };

  const handleTestEmail = async () => {
    setIsTesting(true);
    try {
      // Mock email test
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Test email sent successfully!');
    } catch (error) {
      alert('Failed to send test email. Please check your SMTP settings.');
    } finally {
      setIsTesting(false);
    }
  };

  const encryptionOptions = [
    { value: 'tls', label: 'TLS' },
    { value: 'ssl', label: 'SSL' },
    { value: 'none', label: 'None' }
  ];

  return (
    <div className="space-y-8">
      {/* SMTP Configuration */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">SMTP Configuration</h2>
          <Icon name="Mail" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="form-label">SMTP Host</label>
              <Input
                value={settings?.smtpHost || ''}
                onChange={(e) => handleSMTPChange('smtpHost', e.target.value)}
                placeholder="smtp.gmail.com"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">SMTP Port</label>
              <Input
                type="number"
                value={settings?.smtpPort || 587}
                onChange={(e) => handleSMTPChange('smtpPort', parseInt(e.target.value))}
                placeholder="587"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Username</label>
              <Input
                value={settings?.smtpUsername || ''}
                onChange={(e) => handleSMTPChange('smtpUsername', e.target.value)}
                placeholder="your-email@gmail.com"
                className="form-input"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="form-label">Password</label>
              <Input
                type="password"
                value={settings?.smtpPassword || ''}
                onChange={(e) => handleSMTPChange('smtpPassword', e.target.value)}
                placeholder="Enter SMTP password"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Encryption</label>
              <select
                value={settings?.smtpEncryption || 'tls'}
                onChange={(e) => handleSMTPChange('smtpEncryption', e.target.value)}
                className="form-input"
              >
                {encryptionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">From Email</label>
              <Input
                value={settings?.fromEmail || ''}
                onChange={(e) => handleSMTPChange('fromEmail', e.target.value)}
                placeholder="noreply@hallbooker.com"
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center space-x-4">
            <Input
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter test email address"
              className="form-input flex-1"
            />
            <Button
              variant="outline"
              iconName="Send"
              iconSize={16}
              onClick={handleTestEmail}
              loading={isTesting}
              disabled={!testEmail.trim()}
            >
              Test Email
            </Button>
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Email Settings</h2>
          <Icon name="Settings" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="form-label">From Name</label>
              <Input
                value={settings?.fromName || ''}
                onChange={(e) => handleSMTPChange('fromName', e.target.value)}
                placeholder="HallBooker"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Reminder Hours Before Event</label>
              <Input
                type="number"
                value={settings?.reminderHours || 24}
                onChange={(e) => handleSMTPChange('reminderHours', parseInt(e.target.value))}
                min="1"
                max="168"
                className="form-input"
              />
              <p className="text-xs text-text-muted mt-1">
                Hours before event to send reminder emails
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <label className="form-label">Email Notifications</label>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Input
                    type="checkbox"
                    checked={settings?.welcomeEmailEnabled || false}
                    onChange={(e) => handleSMTPChange('welcomeEmailEnabled', e.target.checked)}
                  />
                  <label className="text-sm">Send welcome email to new users</label>
                </div>

                <div className="flex items-center space-x-3">
                  <Input
                    type="checkbox"
                    checked={settings?.bookingConfirmationEnabled || false}
                    onChange={(e) => handleSMTPChange('bookingConfirmationEnabled', e.target.checked)}
                  />
                  <label className="text-sm">Send booking confirmation emails</label>
                </div>

                <div className="flex items-center space-x-3">
                  <Input
                    type="checkbox"
                    checked={settings?.reminderEmailEnabled || false}
                    onChange={(e) => handleSMTPChange('reminderEmailEnabled', e.target.checked)}
                  />
                  <label className="text-sm">Send reminder emails</label>
                </div>

                <div className="flex items-center space-x-3">
                  <Input
                    type="checkbox"
                    checked={settings?.marketingEmailsEnabled || false}
                    onChange={(e) => handleSMTPChange('marketingEmailsEnabled', e.target.checked)}
                  />
                  <label className="text-sm">Send marketing emails</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Templates */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Email Templates</h2>
          <Icon name="FileText" size={20} className="text-text-muted" />
        </div>

        <div className="space-y-4">
          <div className="bg-secondary-50 p-4 rounded-lg">
            <h3 className="font-medium text-text-primary mb-2">Welcome Email Template</h3>
            <p className="text-sm text-text-secondary mb-3">
              Customize the welcome email sent to new users
            </p>
            <Button variant="outline" iconName="Edit" iconSize={16} className="text-sm">
              Edit Template
            </Button>
          </div>

          <div className="bg-secondary-50 p-4 rounded-lg">
            <h3 className="font-medium text-text-primary mb-2">Booking Confirmation Template</h3>
            <p className="text-sm text-text-secondary mb-3">
              Customize the booking confirmation email template
            </p>
            <Button variant="outline" iconName="Edit" iconSize={16} className="text-sm">
              Edit Template
            </Button>
          </div>

          <div className="bg-secondary-50 p-4 rounded-lg">
            <h3 className="font-medium text-text-primary mb-2">Reminder Email Template</h3>
            <p className="text-sm text-text-secondary mb-3">
              Customize the reminder email sent before events
            </p>
            <Button variant="outline" iconName="Edit" iconSize={16} className="text-sm">
              Edit Template
            </Button>
          </div>

          <div className="bg-secondary-50 p-4 rounded-lg">
            <h3 className="font-medium text-text-primary mb-2">Password Reset Template</h3>
            <p className="text-sm text-text-secondary mb-3">
              Customize the password reset email template
            </p>
            <Button variant="outline" iconName="Edit" iconSize={16} className="text-sm">
              Edit Template
            </Button>
          </div>
        </div>
      </div>

      {/* Email Statistics */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Email Statistics</h2>
          <Icon name="BarChart3" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-secondary-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-text-primary">1,234</div>
            <div className="text-sm text-text-secondary">Emails Sent Today</div>
          </div>
          
          <div className="bg-secondary-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-success">98.5%</div>
            <div className="text-sm text-text-secondary">Delivery Rate</div>
          </div>
          
          <div className="bg-secondary-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-primary">24.3%</div>
            <div className="text-sm text-text-secondary">Open Rate</div>
          </div>
          
          <div className="bg-secondary-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-error">1.2%</div>
            <div className="text-sm text-text-secondary">Bounce Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailNotificationsTab;