import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DatabaseConfigPanel = ({ config, onChange, onBackup }) => {
  const handleConfigChange = (key, value) => {
    onChange(key, value);
  };

  const backupScheduleOptions = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'disabled', label: 'Disabled' }
  ];

  return (
    <div className="space-y-6">
      {/* Connection Pool Settings */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Connection Pool Management</h2>
          <Icon name="Database" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="form-label">Connection Pool Size</label>
              <Input
                type="number"
                value={config?.dbConnectionPoolSize || 20}
                onChange={(e) => handleConfigChange('dbConnectionPoolSize', parseInt(e.target.value))}
                min="1"
                max="100"
                className="form-input"
              />
              <p className="text-xs text-text-muted mt-1">
                Number of connections to maintain in the pool
              </p>
            </div>

            <div>
              <label className="form-label">Maximum Connections</label>
              <Input
                type="number"
                value={config?.dbMaxConnections || 100}
                onChange={(e) => handleConfigChange('dbMaxConnections', parseInt(e.target.value))}
                min="10"
                max="1000"
                className="form-input"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="form-label">Connection Timeout (seconds)</label>
              <Input
                type="number"
                value={config?.dbConnectionTimeout || 30}
                onChange={(e) => handleConfigChange('dbConnectionTimeout', parseInt(e.target.value))}
                min="5"
                max="300"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Query Timeout (seconds)</label>
              <Input
                type="number"
                value={config?.dbQueryTimeout || 60}
                onChange={(e) => handleConfigChange('dbQueryTimeout', parseInt(e.target.value))}
                min="10"
                max="600"
                className="form-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Query Optimization */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Query Optimization</h2>
          <Icon name="Zap" size={20} className="text-text-muted" />
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label">Slow Query Threshold (ms)</label>
            <Input
              type="number"
              value={config?.dbSlowQueryThreshold || 1000}
              onChange={(e) => handleConfigChange('dbSlowQueryThreshold', parseInt(e.target.value))}
              min="100"
              max="10000"
              className="form-input"
            />
            <p className="text-xs text-text-muted mt-1">
              Log queries that take longer than this threshold
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Input
              type="checkbox"
              checked={config?.dbQueryOptimization || false}
              onChange={(e) => handleConfigChange('dbQueryOptimization', e.target.checked)}
            />
            <label className="text-sm">Enable automatic query optimization</label>
          </div>
        </div>
      </div>

      {/* Backup Configuration */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Backup Automation</h2>
          <Icon name="Archive" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="form-label">Backup Schedule</label>
              <select
                value={config?.dbBackupSchedule || 'daily'}
                onChange={(e) => handleConfigChange('dbBackupSchedule', e.target.value)}
                className="form-input"
              >
                {backupScheduleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Backup Retention (days)</label>
              <Input
                type="number"
                value={config?.dbBackupRetention || 30}
                onChange={(e) => handleConfigChange('dbBackupRetention', parseInt(e.target.value))}
                min="1"
                max="365"
                className="form-input"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-secondary-50 p-4 rounded-lg">
              <h3 className="font-medium text-text-primary mb-2">Manual Backup</h3>
              <p className="text-sm text-text-secondary mb-3">
                Create an immediate backup of the database
              </p>
              <Button
                variant="outline"
                iconName="Download"
                iconSize={16}
                onClick={onBackup}
                className="text-sm"
              >
                Backup Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Database Statistics */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Database Statistics</h2>
          <Icon name="BarChart3" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-secondary-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-text-primary">42</div>
            <div className="text-sm text-text-secondary">Active Connections</div>
          </div>
          
          <div className="bg-secondary-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-primary">1,234</div>
            <div className="text-sm text-text-secondary">Queries/min</div>
          </div>
          
          <div className="bg-secondary-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-warning">156ms</div>
            <div className="text-sm text-text-secondary">Avg Query Time</div>
          </div>
          
          <div className="bg-secondary-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-success">2.3GB</div>
            <div className="text-sm text-text-secondary">Database Size</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseConfigPanel;