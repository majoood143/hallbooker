import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CacheManagementPanel = ({ config, onChange, onClearCache }) => {
  const handleConfigChange = (key, value) => {
    onChange(key, value);
  };

  const cacheProviderOptions = [
    { value: 'redis', label: 'Redis' },
    { value: 'memcached', label: 'Memcached' },
    { value: 'memory', label: 'In-Memory' }
  ];

  const evictionPolicyOptions = [
    { value: 'allkeys-lru', label: 'All Keys LRU' },
    { value: 'volatile-lru', label: 'Volatile LRU' },
    { value: 'allkeys-lfu', label: 'All Keys LFU' },
    { value: 'volatile-lfu', label: 'Volatile LFU' },
    { value: 'allkeys-random', label: 'All Keys Random' },
    { value: 'volatile-random', label: 'Volatile Random' }
  ];

  return (
    <div className="space-y-6">
      {/* Cache Provider Configuration */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Cache Provider Configuration</h2>
          <Icon name="Zap" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="form-label">Cache Provider</label>
              <select
                value={config?.cacheProvider || 'redis'}
                onChange={(e) => handleConfigChange('cacheProvider', e.target.value)}
                className="form-input"
              >
                {cacheProviderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Host</label>
              <Input
                value={config?.cacheHost || ''}
                onChange={(e) => handleConfigChange('cacheHost', e.target.value)}
                placeholder="localhost"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Port</label>
              <Input
                type="number"
                value={config?.cachePort || 6379}
                onChange={(e) => handleConfigChange('cachePort', parseInt(e.target.value))}
                min="1"
                max="65535"
                className="form-input"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="form-label">Database (Redis)</label>
              <Input
                type="number"
                value={config?.cacheDatabase || 0}
                onChange={(e) => handleConfigChange('cacheDatabase', parseInt(e.target.value))}
                min="0"
                max="15"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <Input
                type="password"
                value={config?.cachePassword || ''}
                onChange={(e) => handleConfigChange('cachePassword', e.target.value)}
                placeholder="Enter password (optional)"
                className="form-input"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Input
                type="checkbox"
                checked={config?.cacheClusterEnabled || false}
                onChange={(e) => handleConfigChange('cacheClusterEnabled', e.target.checked)}
              />
              <label className="text-sm">Enable cluster mode</label>
            </div>
          </div>
        </div>
      </div>

      {/* Cache Settings */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Cache Settings</h2>
          <Icon name="Settings" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="form-label">Default TTL (seconds)</label>
              <Input
                type="number"
                value={config?.cacheTtl || 3600}
                onChange={(e) => handleConfigChange('cacheTtl', parseInt(e.target.value))}
                min="60"
                max="86400"
                className="form-input"
              />
              <p className="text-xs text-text-muted mt-1">
                Default time-to-live for cached items
              </p>
            </div>

            <div>
              <label className="form-label">Max Memory</label>
              <Input
                value={config?.cacheMaxMemory || '512mb'}
                onChange={(e) => handleConfigChange('cacheMaxMemory', e.target.value)}
                placeholder="512mb"
                className="form-input"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="form-label">Eviction Policy</label>
              <select
                value={config?.cacheEvictionPolicy || 'allkeys-lru'}
                onChange={(e) => handleConfigChange('cacheEvictionPolicy', e.target.value)}
                className="form-input"
              >
                {evictionPolicyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-secondary-50 p-4 rounded-lg">
              <h3 className="font-medium text-text-primary mb-2">Cache Operations</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  iconName="Trash2"
                  iconSize={16}
                  onClick={onClearCache}
                  className="text-sm w-full"
                >
                  Clear All Cache
                </Button>
                <Button
                  variant="outline"
                  iconName="RefreshCw"
                  iconSize={16}
                  className="text-sm w-full"
                >
                  Restart Cache Service
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cache Performance */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Cache Performance</h2>
          <Icon name="TrendingUp" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-secondary-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-success">89.2%</div>
            <div className="text-sm text-text-secondary">Hit Rate</div>
          </div>
          
          <div className="bg-secondary-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-primary">2.3ms</div>
            <div className="text-sm text-text-secondary">Avg Response</div>
          </div>
          
          <div className="bg-secondary-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-text-primary">45,678</div>
            <div className="text-sm text-text-secondary">Keys Stored</div>
          </div>
          
          <div className="bg-secondary-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-warning">312MB</div>
            <div className="text-sm text-text-secondary">Memory Used</div>
          </div>
        </div>
      </div>

      {/* Cache Invalidation Rules */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Cache Invalidation Rules</h2>
          <Icon name="RefreshCw" size={20} className="text-text-muted" />
        </div>

        <div className="space-y-4">
          <div className="bg-secondary-50 p-4 rounded-lg">
            <h3 className="font-medium text-text-primary mb-2">Automatic Invalidation</h3>
            <div className="space-y-2 text-sm text-text-secondary">
              <p>• User data cache: Invalidated on profile updates</p>
              <p>• Venue data cache: Invalidated on venue modifications</p>
              <p>• Booking cache: Invalidated on booking status changes</p>
              <p>• Search results: Invalidated every 5 minutes</p>
            </div>
          </div>

          <div className="bg-secondary-50 p-4 rounded-lg">
            <h3 className="font-medium text-text-primary mb-2">Manual Invalidation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Button variant="outline" className="text-sm">Clear User Cache</Button>
              <Button variant="outline" className="text-sm">Clear Venue Cache</Button>
              <Button variant="outline" className="text-sm">Clear Search Cache</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CacheManagementPanel;