import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import BookingStatusIndicator from '../../components/ui/BookingStatusIndicator';
import QuickActionMenu from '../../components/ui/QuickActionMenu';
import SearchContextPreserver from '../../components/ui/SearchContextPreserver';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import DatabaseConfigPanel from './components/DatabaseConfigPanel';
import CacheManagementPanel from './components/CacheManagementPanel';
import FileStoragePanel from './components/FileStoragePanel';
import IntegrationControlsPanel from './components/IntegrationControlsPanel';
import SystemMonitoringPanel from './components/SystemMonitoringPanel';

const SystemConfigurationManagement = () => {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState('database');
  const [systemStatus, setSystemStatus] = useState('healthy');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastConfigUpdate, setLastConfigUpdate] = useState(null);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  // Mock admin user data
  const adminUser = {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@hallbooker.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  };

  // System configuration state
  const [systemConfig, setSystemConfig] = useState({
    // Database Settings
    dbConnectionPoolSize: 20,
    dbMaxConnections: 100,
    dbConnectionTimeout: 30,
    dbQueryTimeout: 60,
    dbBackupSchedule: 'daily',
    dbBackupRetention: 30,
    dbSlowQueryThreshold: 1000,
    dbQueryOptimization: true,
    
    // Cache Management
    cacheProvider: 'redis',
    cacheHost: 'localhost',
    cachePort: 6379,
    cacheDatabase: 0,
    cachePassword: '',
    cacheTtl: 3600,
    cacheMaxMemory: '512mb',
    cacheEvictionPolicy: 'allkeys-lru',
    cacheClusterEnabled: false,
    
    // File Storage
    storageProvider: 'local',
    awsAccessKey: '',
    awsSecretKey: '',
    awsRegion: 'us-east-1',
    awsBucket: '',
    gcsProjectId: '',
    gcsKeyFile: '',
    gcsBucket: '',
    cdnEnabled: false,
    cdnUrl: '',
    uploadMaxSize: 10,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    
    // Integration Controls
    paymentGateway: 'thawani',
    mapsProvider: 'google',
    analyticsProvider: 'google',
    smsProvider: 'twilio',
    emailProvider: 'smtp',
    notificationProvider: 'firebase',
    
    // System Monitoring
    loggingLevel: 'info',
    logRetentionDays: 30,
    metricsCollection: true,
    errorTracking: true,
    performanceMonitoring: true,
    alertingEnabled: true,
    healthCheckInterval: 30,
    
    // Emergency Controls
    maintenanceMode: false,
    emergencyShutdown: false,
    trafficThrottling: false,
    throttleLimit: 1000,
    serviceIsolation: false
  });

  const navigationPanels = [
    { id: 'database', label: 'Database Settings', icon: 'Database' },
    { id: 'cache', label: 'Cache Management', icon: 'Zap' },
    { id: 'storage', label: 'File Storage', icon: 'HardDrive' },
    { id: 'integrations', label: 'Integration Controls', icon: 'Link' },
    { id: 'monitoring', label: 'System Monitoring', icon: 'Activity' }
  ];

  useEffect(() => {
    // Load existing system configuration
    loadSystemConfiguration();
    
    // Start system health monitoring
    const healthCheckInterval = setInterval(() => {
      checkSystemHealth();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(healthCheckInterval);
  }, []);

  const loadSystemConfiguration = async () => {
    try {
      // In real app, this would fetch from Supabase or system config files
      console.log('Loading system configuration...');
      
      // Mock loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock last config update
      setLastConfigUpdate(new Date());
    } catch (error) {
      console.error('Failed to load system configuration:', error);
    }
  };

  const checkSystemHealth = async () => {
    try {
      // Mock system health check
      const healthStatuses = ['healthy', 'warning', 'critical'];
      const randomStatus = healthStatuses[Math.floor(Math.random() * healthStatuses.length)];
      setSystemStatus(randomStatus);
    } catch (error) {
      console.error('Failed to check system health:', error);
      setSystemStatus('critical');
    }
  };

  const handleConfigChange = (key, value) => {
    setSystemConfig(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleNestedConfigChange = (section, key, value) => {
    setSystemConfig(prev => ({
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
      // In real app, this would save to system config files or database
      console.log('Saving system configuration:', systemConfig);
      
      // Mock save delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setHasUnsavedChanges(false);
      setLastConfigUpdate(new Date());
      
      // Show success message
      alert('System configuration saved successfully!');
    } catch (error) {
      console.error('Failed to save system configuration:', error);
      alert('Failed to save configuration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmergencyShutdown = async () => {
    if (window.confirm('Are you sure you want to enable emergency shutdown? This will make the system unavailable.')) {
      setIsEmergencyMode(true);
      handleConfigChange('emergencyShutdown', true);
      alert('Emergency shutdown activated. System is now in maintenance mode.');
    }
  };

  const handleTrafficThrottling = () => {
    const throttleEnabled = !systemConfig.trafficThrottling;
    handleConfigChange('trafficThrottling', throttleEnabled);
    alert(`Traffic throttling ${throttleEnabled ? 'enabled' : 'disabled'}.`);
  };

  const handleServiceIsolation = () => {
    const isolationEnabled = !systemConfig.serviceIsolation;
    handleConfigChange('serviceIsolation', isolationEnabled);
    alert(`Service isolation ${isolationEnabled ? 'enabled' : 'disabled'}.`);
  };

  const handleBackupNow = async () => {
    try {
      console.log('Initiating system backup...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      alert('System backup completed successfully!');
    } catch (error) {
      console.error('Backup failed:', error);
      alert('Backup failed. Please try again.');
    }
  };

  const handleClearCache = async () => {
    try {
      console.log('Clearing system cache...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('System cache cleared successfully!');
    } catch (error) {
      console.error('Cache clear failed:', error);
      alert('Failed to clear cache. Please try again.');
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
      case 'healthy':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'critical':
        return 'text-error';
      default:
        return 'text-text-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'critical':
        return 'XCircle';
      default:
        return 'HelpCircle';
    }
  };

  const renderPanelContent = () => {
    switch (activePanel) {
      case 'database':
        return (
          <DatabaseConfigPanel
            config={systemConfig}
            onChange={handleConfigChange}
            onBackup={handleBackupNow}
          />
        );
      case 'cache':
        return (
          <CacheManagementPanel
            config={systemConfig}
            onChange={handleConfigChange}
            onClearCache={handleClearCache}
          />
        );
      case 'storage':
        return (
          <FileStoragePanel
            config={systemConfig}
            onChange={handleConfigChange}
          />
        );
      case 'integrations':
        return (
          <IntegrationControlsPanel
            config={systemConfig}
            onChange={handleConfigChange}
          />
        );
      case 'monitoring':
        return (
          <SystemMonitoringPanel
            config={systemConfig}
            onChange={handleConfigChange}
            systemStatus={systemStatus}
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
                <Icon name="Server" size={20} color="white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">System Configuration Management</h1>
                <p className="text-text-secondary mt-1">
                  Advanced technical controls for platform infrastructure
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* System Status */}
            <div className="flex items-center space-x-2">
              <Icon 
                name={getStatusIcon(systemStatus)} 
                size={16} 
                className={getStatusColor(systemStatus)}
              />
              <span className={`text-sm font-medium ${getStatusColor(systemStatus)}`}>
                {systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}
              </span>
            </div>

            {/* Last Update */}
            {lastConfigUpdate && (
              <div className="text-sm text-text-muted">
                Last updated: {lastConfigUpdate.toLocaleTimeString()}
              </div>
            )}

            {/* Emergency Controls */}
            {isEmergencyMode && (
              <div className="flex space-x-2">
                <Button
                  variant="warning"
                  iconName="Zap"
                  iconSize={16}
                  onClick={handleTrafficThrottling}
                  className="text-sm"
                >
                  {systemConfig.trafficThrottling ? 'Disable' : 'Enable'} Throttling
                </Button>
                <Button
                  variant="error"
                  iconName="Shield"
                  iconSize={16}
                  onClick={handleServiceIsolation}
                  className="text-sm"
                >
                  {systemConfig.serviceIsolation ? 'Disable' : 'Enable'} Isolation
                </Button>
              </div>
            )}

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

        {/* Emergency Alert */}
        {isEmergencyMode && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={20} className="text-error" />
              <div>
                <h3 className="font-semibold text-error">Emergency Mode Active</h3>
                <p className="text-sm text-error-600">
                  System is in emergency mode. Some services may be unavailable.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {navigationPanels.map((panel) => (
                <button
                  key={panel.id}
                  onClick={() => setActivePanel(panel.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activePanel === panel.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                  }`}
                >
                  <Icon name={panel.icon} size={18} />
                  <span className="text-sm font-medium">{panel.label}</span>
                </button>
              ))}
            </nav>

            {/* Emergency Controls */}
            <div className="mt-8 p-4 bg-error-50 border border-error-200 rounded-lg">
              <h3 className="font-semibold text-error mb-3">Emergency Controls</h3>
              <div className="space-y-2">
                <Button
                  variant="error"
                  iconName="Power"
                  iconSize={14}
                  onClick={handleEmergencyShutdown}
                  fullWidth
                  className="text-xs"
                >
                  Emergency Shutdown
                </Button>
                <Button
                  variant="outline"
                  iconName="Database"
                  iconSize={14}
                  onClick={handleBackupNow}
                  fullWidth
                  className="text-xs"
                >
                  Backup Now
                </Button>
              </div>
            </div>
          </div>

          {/* Panel Content */}
          <div className="flex-1">
            {renderPanelContent()}
          </div>
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
        currentScreen="system-configuration-management"
        onActionClick={handleQuickAction}
      />
    </div>
  );
};

export default SystemConfigurationManagement;