import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import BookingStatusIndicator from '../../components/ui/BookingStatusIndicator';
import QuickActionMenu from '../../components/ui/QuickActionMenu';
import SearchContextPreserver from '../../components/ui/SearchContextPreserver';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ConfigurationTab from './components/ConfigurationTab';
import TransactionTab from './components/TransactionTab';
import SecurityTab from './components/SecurityTab';
import TestingPanel from './components/TestingPanel';
import TransactionLogs from './components/TransactionLogs';
import StatusIndicator from './components/StatusIndicator';

const PaymentGatewaySettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('configuration');
  const [gatewayStatus, setGatewayStatus] = useState('connected');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mock admin user data
  const adminUser = {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@hallbooker.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  };

  // Gateway configuration state
  const [gatewayConfig, setGatewayConfig] = useState({
    // Configuration
    publishableKey: '',
    secretKey: '',
    webhookUrl: '',
    environment: 'sandbox',
    
    // Transaction Settings
    currency: 'OMR',
    minAmount: 1,
    maxAmount: 10000,
    paymentMethods: ['card', 'wallet'],
    autoRefund: true,
    refundPeriod: 30,
    transactionFee: 2.5,
    
    // Security Settings
    sslVerification: true,
    pciCompliance: true,
    fraudDetection: true,
    ipWhitelist: [],
    webhookSecret: '',
    
    // Advanced Settings
    retryAttempts: 3,
    timeout: 30,
    errorMessages: {
      declined: 'Payment declined. Please try another card.',
      expired: 'Your card has expired. Please use a different card.',
      insufficient: 'Insufficient funds. Please check your account balance.'
    }
  });

  const tabs = [
    { id: 'configuration', label: 'Gateway Configuration', icon: 'Settings' },
    { id: 'transactions', label: 'Transaction Settings', icon: 'CreditCard' },
    { id: 'security', label: 'Security Controls', icon: 'Shield' },
    { id: 'testing', label: 'Testing & Logs', icon: 'TestTube' }
  ];

  useEffect(() => {
    // Load existing configuration
    loadGatewayConfiguration();
    
    // Check gateway status
    checkGatewayStatus();
  }, []);

  const loadGatewayConfiguration = async () => {
    try {
      // In real app, this would fetch from Supabase or API
      console.log('Loading gateway configuration...');
      
      // Mock loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update status based on configuration
      if (gatewayConfig.publishableKey && gatewayConfig.secretKey) {
        setGatewayStatus('connected');
      } else {
        setGatewayStatus('disconnected');
      }
    } catch (error) {
      console.error('Failed to load gateway configuration:', error);
      setGatewayStatus('error');
    }
  };

  const checkGatewayStatus = async () => {
    try {
      // In real app, this would test connection to Thawani API
      console.log('Checking gateway status...');
      
      // Mock status check
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Random status for demo
      const statuses = ['connected', 'disconnected', 'error'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setGatewayStatus(randomStatus);
    } catch (error) {
      console.error('Failed to check gateway status:', error);
      setGatewayStatus('error');
    }
  };

  const handleConfigurationChange = (key, value) => {
    setGatewayConfig(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleNestedConfigChange = (section, key, value) => {
    setGatewayConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveConfiguration = async () => {
    setIsSaving(true);
    
    try {
      // In real app, this would save to Supabase or API
      console.log('Saving gateway configuration:', gatewayConfig);
      
      // Mock save delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setHasUnsavedChanges(false);
      
      // Show success message
      alert('Gateway configuration saved successfully!');
      
      // Recheck status after save
      await checkGatewayStatus();
    } catch (error) {
      console.error('Failed to save gateway configuration:', error);
      alert('Failed to save configuration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      console.log('Testing gateway connection...');
      
      // Mock test connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGatewayStatus('connected');
      alert('Gateway connection test successful!');
    } catch (error) {
      console.error('Connection test failed:', error);
      setGatewayStatus('error');
      alert('Connection test failed. Please check your credentials.');
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'configuration':
        return (
          <ConfigurationTab
            config={gatewayConfig}
            onChange={handleConfigurationChange}
            onTest={handleTestConnection}
            gatewayStatus={gatewayStatus}
          />
        );
      case 'transactions':
        return (
          <TransactionTab
            config={gatewayConfig}
            onChange={handleConfigurationChange}
            onNestedChange={handleNestedConfigChange}
          />
        );
      case 'security':
        return (
          <SecurityTab
            config={gatewayConfig}
            onChange={handleConfigurationChange}
            onNestedChange={handleNestedConfigChange}
          />
        );
      case 'testing':
        return (
          <div className="space-y-6">
            <TestingPanel
              config={gatewayConfig}
              onTest={handleTestConnection}
              gatewayStatus={gatewayStatus}
            />
            <TransactionLogs />
          </div>
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
                <Icon name="CreditCard" size={20} color="white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Payment Gateway Settings</h1>
                <p className="text-text-secondary mt-1">
                  Configure Thawani payment gateway integration
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Gateway Status */}
            <StatusIndicator 
              status={gatewayStatus}
              onRefresh={checkGatewayStatus}
            />

            {/* Save Button */}
            <Button
              variant="primary"
              iconName="Save"
              iconSize={16}
              onClick={handleSaveConfiguration}
              loading={isSaving}
              disabled={!hasUnsavedChanges}
              className="text-sm"
            >
              Save Configuration
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
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
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
        currentScreen="payment-gateway-settings"
        onActionClick={handleQuickAction}
      />
    </div>
  );
};

export default PaymentGatewaySettings;