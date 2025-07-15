import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProfileSection = ({ user, onUpdateProfile, onChangePassword, onDeleteAccount }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    location: user.location || '',
    preferences: user.preferences || {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: false
    }
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (preference, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value
      }
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleSavePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    onChangePassword(passwordData);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordForm(false);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
      preferences: user.preferences || {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: false
      }
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">
            Profile Information
          </h2>
          {!isEditing ? (
            <Button
              variant="outline"
              iconName="Edit"
              iconSize={16}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveProfile}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Full Name</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="form-label">Email Address</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="form-label">Phone Number</label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="form-label">Location</label>
            <Input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your city/location"
            />
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-6">
          Notification Preferences
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text-primary">Email Notifications</h3>
              <p className="text-sm text-text-secondary">
                Receive booking confirmations and updates via email
              </p>
            </div>
            <Input
              type="checkbox"
              checked={formData.preferences.emailNotifications}
              onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text-primary">SMS Notifications</h3>
              <p className="text-sm text-text-secondary">
                Receive urgent booking updates via SMS
              </p>
            </div>
            <Input
              type="checkbox"
              checked={formData.preferences.smsNotifications}
              onChange={(e) => handlePreferenceChange('smsNotifications', e.target.checked)}
              disabled={!isEditing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text-primary">Marketing Emails</h3>
              <p className="text-sm text-text-secondary">
                Receive promotional offers and venue recommendations
              </p>
            </div>
            <Input
              type="checkbox"
              checked={formData.preferences.marketingEmails}
              onChange={(e) => handlePreferenceChange('marketingEmails', e.target.checked)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-6">
          Security Settings
        </h2>

        {!showPasswordForm ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-text-primary">Password</h3>
                <p className="text-sm text-text-secondary">
                  Last changed 3 months ago
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowPasswordForm(true)}
              >
                Change Password
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="form-label">Current Password</label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="form-label">New Password</label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="form-label">Confirm New Password</label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSavePassword}
              >
                Update Password
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Account Actions */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-6">
          Account Actions
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text-primary">Download Your Data</h3>
              <p className="text-sm text-text-secondary">
                Export all your booking history and account data
              </p>
            </div>
            <Button variant="outline">
              Download Data
            </Button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <h3 className="font-medium text-error">Delete Account</h3>
              <p className="text-sm text-text-secondary">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="danger"
              onClick={onDeleteAccount}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;