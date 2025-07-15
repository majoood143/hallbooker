import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SystemMonitoringPanel = ({ config, onChange, systemStatus }) => {
  const handleConfigChange = (key, value) => {
    onChange(key, value);
  };

  const loggingLevelOptions = [
    { value: 'debug', label: 'Debug' },
    { value: 'info', label: 'Info' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' },
    { value: 'critical', label: 'Critical' }
  ];

  const handleDownloadLogs = () => {
    // Mock log download
    alert('Downloading system logs...');
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      alert('System logs cleared successfully!');
    }
  };

  const getSystemMetrics = () => {
    // Mock system metrics
    return {
      cpu: 45,
      memory: 62,
      disk: 78,
      network: 34
    };
  };

  const metrics = getSystemMetrics();

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">System Health Overview</h2>
          <Icon name="Activity" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-secondary-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-text-primary">CPU Usage</h3>
              <Icon name="Cpu" size={16} className="text-text-muted" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{metrics.cpu}%</div>
            <div className="w-full bg-secondary-200 rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.cpu}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-secondary-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-text-primary">Memory Usage</h3>
              <Icon name="MemoryStick" size={16} className="text-text-muted" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{metrics.memory}%</div>
            <div className="w-full bg-secondary-200 rounded-full h-2 mt-2">
              <div 
                className="bg-warning h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.memory}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-secondary-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-text-primary">Disk Usage</h3>
              <Icon name="HardDrive" size={16} className="text-text-muted" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{metrics.disk}%</div>
            <div className="w-full bg-secondary-200 rounded-full h-2 mt-2">
              <div 
                className="bg-error h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.disk}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-secondary-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-text-primary">Network I/O</h3>
              <Icon name="Network" size={16} className="text-text-muted" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{metrics.network}%</div>
            <div className="w-full bg-secondary-200 rounded-full h-2 mt-2">
              <div 
                className="bg-success h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.network}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Logging Configuration */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Logging Configuration</h2>
          <Icon name="FileText" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="form-label">Logging Level</label>
              <select
                value={config?.loggingLevel || 'info'}
                onChange={(e) => handleConfigChange('loggingLevel', e.target.value)}
                className="form-input"
              >
                {loggingLevelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Log Retention Period (days)</label>
              <Input
                type="number"
                value={config?.logRetentionDays || 30}
                onChange={(e) => handleConfigChange('logRetentionDays', parseInt(e.target.value))}
                min="1"
                max="365"
                className="form-input"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-secondary-50 p-4 rounded-lg">
              <h3 className="font-medium text-text-primary mb-2">Log Management</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  iconName="Download"
                  iconSize={16}
                  onClick={handleDownloadLogs}
                  className="text-sm w-full"
                >
                  Download Logs
                </Button>
                <Button
                  variant="outline"
                  iconName="Trash2"
                  iconSize={16}
                  onClick={handleClearLogs}
                  className="text-sm w-full"
                >
                  Clear Logs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monitoring Settings */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Monitoring Settings</h2>
          <Icon name="Settings" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Input
                type="checkbox"
                checked={config?.metricsCollection || false}
                onChange={(e) => handleConfigChange('metricsCollection', e.target.checked)}
              />
              <label className="text-sm">Enable metrics collection</label>
            </div>

            <div className="flex items-center space-x-3">
              <Input
                type="checkbox"
                checked={config?.errorTracking || false}
                onChange={(e) => handleConfigChange('errorTracking', e.target.checked)}
              />
              <label className="text-sm">Enable error tracking</label>
            </div>

            <div className="flex items-center space-x-3">
              <Input
                type="checkbox"
                checked={config?.performanceMonitoring || false}
                onChange={(e) => handleConfigChange('performanceMonitoring', e.target.checked)}
              />
              <label className="text-sm">Enable performance monitoring</label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Input
                type="checkbox"
                checked={config?.alertingEnabled || false}
                onChange={(e) => handleConfigChange('alertingEnabled', e.target.checked)}
              />
              <label className="text-sm">Enable alerting</label>
            </div>

            <div>
              <label className="form-label">Health Check Interval (seconds)</label>
              <Input
                type="number"
                value={config?.healthCheckInterval || 30}
                onChange={(e) => handleConfigChange('healthCheckInterval', parseInt(e.target.value))}
                min="10"
                max="300"
                className="form-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">System Alerts</h2>
          <Icon name="AlertTriangle" size={20} className="text-text-muted" />
        </div>

        <div className="space-y-4">
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="XCircle" size={16} className="text-error" />
              <div>
                <h3 className="font-semibold text-error">Critical Alert</h3>
                <p className="text-sm text-error-600">High disk usage detected (78%)</p>
                <p className="text-xs text-error-500">2 minutes ago</p>
              </div>
            </div>
          </div>

          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <div>
                <h3 className="font-semibold text-warning">Warning Alert</h3>
                <p className="text-sm text-warning-600">Memory usage above 60%</p>
                <p className="text-xs text-warning-500">5 minutes ago</p>
              </div>
            </div>
          </div>

          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-primary" />
              <div>
                <h3 className="font-semibold text-primary">Info Alert</h3>
                <p className="text-sm text-primary-600">System backup completed successfully</p>
                <p className="text-xs text-primary-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitoringPanel;