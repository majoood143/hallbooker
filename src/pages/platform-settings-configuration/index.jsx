import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import BookingStatusIndicator from '../../components/ui/BookingStatusIndicator';
import QuickActionMenu from '../../components/ui/QuickActionMenu';
import SearchContextPreserver from '../../components/ui/SearchContextPreserver';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import GeneralSettingsTab from './components/GeneralSettingsTab';
import SecurityConfigTab from './components/SecurityConfigTab';
import EmailNotificationsTab from './components/EmailNotificationsTab';
import ApiManagementTab from './components/ApiManagementTab';

const PlatformSettingsConfiguration = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Mock admin user data
  const adminUser = {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@hallbooker.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  };

  // Platform settings state
  const [platformSettings, setPlatformSettings] = useState({
    // General Settings
    brandingLogo: '',
    platformName: 'HallBooker',
    primaryColor: '#2563EB',
    secondaryColor: '#64748B',
    defaultLanguage: 'en',
    timezone: 'Asia/Muscat',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'OMR',
    maintenanceMode: false,
    maintenanceMessage: 'Platform is under maintenance. Please try again later.',
    
    // Security Configuration
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    twoFactorRequired: false,
    ipWhitelist: [],
    allowedDomains: [],
    
    // Email & Notifications
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    smtpEncryption: 'tls',
    fromEmail: 'noreply@hallbooker.com',
    fromName: 'HallBooker',
    welcomeEmailEnabled: true,
    bookingConfirmationEnabled: true,
    reminderEmailEnabled: true,
    reminderHours: 24,
    marketingEmailsEnabled: true,
    
    // API Management
    apiRateLimit: 1000,
    apiTimeWindow: 60,
    webhookSecret: '',
    apiKeyRotationDays: 90,
    allowedOrigins: [],
    apiLoggingEnabled: true,
    apiVersioning: 'v1',
    deprecationNotice: 180
  });

  const tabs = [
    { id: 'general', label: 'General Settings', icon: 'Settings' },
    { id: 'security', label: 'Security Configuration', icon: 'Shield' },
    { id: 'email', label: 'Email & Notifications', icon: 'Mail' },
    { id: 'api', label: 'API Management', icon: 'Code' }
  ];

  useEffect(() => {
    // Load existing platform settings
    loadPlatformSettings();
    
    // Set up auto-save interval
    const autoSaveInterval = setInterval(() => {
      if (hasUnsavedChanges) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [hasUnsavedChanges]);

  const loadPlatformSettings = async () => {
    try {
      // In real app, this would fetch from Supabase
      console.log('Loading platform settings...');
      
      // Mock loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock last saved time
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to load platform settings:', error);
    }
  };

  const handleSettingsChange = (key, value) => {
    setPlatformSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleNestedSettingsChange = (section, key, value) => {
    setPlatformSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // In real app, this would save to Supabase
      console.log('Saving platform settings:', platformSettings);
      
      // Mock save delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      
      // Show success message
      alert('Platform settings saved successfully!');
    } catch (error) {
      console.error('Failed to save platform settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoSave = async () => {
    try {
      // In real app, this would auto-save to Supabase
      console.log('Auto-saving platform settings...');
      
      // Mock auto-save
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const handleRestoreDefaults = async () => {
    if (window.confirm('Are you sure you want to restore default settings? This action cannot be undone.')) {
      try {
        // Reset to default values
        setPlatformSettings({
          // ... default values would go here
          platformName: 'HallBooker',
          primaryColor: '#2563EB',
          defaultLanguage: 'en',
          timezone: 'Asia/Muscat',
          currency: 'OMR',
          maintenanceMode: false,
          passwordMinLength: 8,
          sessionTimeout: 30,
          // ... other defaults
        });
        
        setHasUnsavedChanges(true);
        alert('Default settings restored. Please save to apply changes.');
      } catch (error) {
        console.error('Failed to restore defaults:', error);
        alert('Failed to restore defaults. Please try again.');
      }
    }
  };

  const handleExportSettings = () => {
    try {
      const settingsData = JSON.stringify(platformSettings, null, 2);
      const blob = new Blob([settingsData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `platform-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export settings:', error);
      alert('Failed to export settings. Please try again.');
    }
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setPlatformSettings(importedSettings);
          setHasUnsavedChanges(true);
          alert('Settings imported successfully. Please review and save.');
        } catch (error) {
          console.error('Failed to import settings:', error);
          alert('Failed to import settings. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleStatusClick = (status) => {
    console.log('Admin viewing booking status:', status);
    navigate('/booking-management-payment');
  };

  const handleQuickAction = (action, selectedItems) => {
    console.log('Admin quick action:', action, selectedItems);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <GeneralSettingsTab
            settings={platformSettings}
            onChange={handleSettingsChange}
            onRestore={handleRestoreDefaults}
          />
        );
      case 'security':
        return (
          <SecurityConfigTab
            settings={platformSettings}
            onChange={handleSettingsChange}
          />
        );
      case 'email':
        return (
          <EmailNotificationsTab
            settings={platformSettings}
            onChange={handleSettingsChange}
          />
        );
      case 'api':
        return (
          <ApiManagementTab
            settings={platformSettings}
            onChange={handleSettingsChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <RoleBasedNavigation 
        user={adminUser} 
        onNavigate={handleNavigation}
      />

      {/* Search Context Preservation */}
      <SearchContextPreserver />

      <div className="container-padding section-spacing">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Icon name="Settings" size={20} color="white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Platform Settings Configuration</h1>
                <p className="text-text-secondary mt-1">
                  Configure platform branding, security, and operational settings
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Last Saved Indicator */}
            {lastSaved && (
              <div className="text-sm text-text-muted">
                Last saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                iconName="Upload"
                iconSize={16}
                onClick={() => document.getElementById('import-settings').click()}
                className="text-sm"
              >
                Import
              </Button>
              <input
                id="import-settings"
                type="file"
                accept=".json"
                onChange={handleImportSettings}
                className="hidden"
              />
              
              <Button
                variant="ghost"
                iconName="Download"
                iconSize={16}
                onClick={handleExportSettings}
                className="text-sm"
              >
                Export
              </Button>
              
              <Button
                variant="ghost"
                iconName="RotateCcw"
                iconSize={16}
                onClick={handleRestoreDefaults}
                className="text-sm"
              >
                Restore Defaults
              </Button>
            </div>

            {/* Save Button */}
            <Button
              variant="primary"
              iconName="Save"
              iconSize={16}
              onClick={handleSaveSettings}
              loading={isSaving}
              disabled={!hasUnsavedChanges}
              className="text-sm"
            >
              Save Settings
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-secondary'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {renderTabContent()}
        </div>

        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <div className="fixed bottom-4 right-4 bg-warning text-warning-foreground px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} />
            <span className="text-sm">You have unsaved changes</span>
          </div>
        )}
      </div>

      {/* Floating Components */}
      <BookingStatusIndicator 
        userRole="admin"
        onStatusClick={handleStatusClick}
      />

      <QuickActionMenu
        userRole="admin"
        currentScreen="platform-settings-configuration"
        onActionClick={handleQuickAction}
      />
    </div>
  );
};

export default PlatformSettingsConfiguration;