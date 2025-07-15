import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FileStoragePanel = ({ config, onChange }) => {
  const handleConfigChange = (key, value) => {
    onChange(key, value);
  };

  const storageProviderOptions = [
    { value: 'local', label: 'Local Storage' },
    { value: 'aws', label: 'AWS S3' },
    { value: 'gcs', label: 'Google Cloud Storage' },
    { value: 'azure', label: 'Azure Blob Storage' }
  ];

  const awsRegionOptions = [
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
    { value: 'us-west-2', label: 'US West (Oregon)' },
    { value: 'eu-west-1', label: 'Europe (Ireland)' },
    { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
    { value: 'me-south-1', label: 'Middle East (Bahrain)' }
  ];

  const handleTestConnection = async () => {
    try {
      // Mock storage connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Storage connection test successful!');
    } catch (error) {
      alert('Storage connection test failed. Please check your configuration.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Storage Provider Configuration */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Storage Provider Configuration</h2>
          <Icon name="HardDrive" size={20} className="text-text-muted" />
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label">Storage Provider</label>
            <select
              value={config?.storageProvider || 'local'}
              onChange={(e) => handleConfigChange('storageProvider', e.target.value)}
              className="form-input"
            >
              {storageProviderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {config?.storageProvider === 'aws' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="form-label">AWS Access Key</label>
                  <Input
                    value={config?.awsAccessKey || ''}
                    onChange={(e) => handleConfigChange('awsAccessKey', e.target.value)}
                    placeholder="Enter AWS Access Key"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">AWS Secret Key</label>
                  <Input
                    type="password"
                    value={config?.awsSecretKey || ''}
                    onChange={(e) => handleConfigChange('awsSecretKey', e.target.value)}
                    placeholder="Enter AWS Secret Key"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="form-label">AWS Region</label>
                  <select
                    value={config?.awsRegion || 'us-east-1'}
                    onChange={(e) => handleConfigChange('awsRegion', e.target.value)}
                    className="form-input"
                  >
                    {awsRegionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">S3 Bucket Name</label>
                  <Input
                    value={config?.awsBucket || ''}
                    onChange={(e) => handleConfigChange('awsBucket', e.target.value)}
                    placeholder="my-bucket-name"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}

          {config?.storageProvider === 'gcs' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="form-label">GCS Project ID</label>
                  <Input
                    value={config?.gcsProjectId || ''}
                    onChange={(e) => handleConfigChange('gcsProjectId', e.target.value)}
                    placeholder="my-project-id"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Service Account Key File</label>
                  <Input
                    value={config?.gcsKeyFile || ''}
                    onChange={(e) => handleConfigChange('gcsKeyFile', e.target.value)}
                    placeholder="path/to/service-account.json"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="form-label">GCS Bucket Name</label>
                  <Input
                    value={config?.gcsBucket || ''}
                    onChange={(e) => handleConfigChange('gcsBucket', e.target.value)}
                    placeholder="my-bucket-name"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button
              variant="outline"
              iconName="TestTube"
              iconSize={16}
              onClick={handleTestConnection}
              className="text-sm"
            >
              Test Connection
            </Button>
          </div>
        </div>
      </div>

      {/* CDN Configuration */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">CDN Configuration</h2>
          <Icon name="Globe" size={20} className="text-text-muted" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Input
              type="checkbox"
              checked={config?.cdnEnabled || false}
              onChange={(e) => handleConfigChange('cdnEnabled', e.target.checked)}
            />
            <label className="text-sm">Enable CDN for static assets</label>
          </div>

          {config?.cdnEnabled && (
            <div>
              <label className="form-label">CDN URL</label>
              <Input
                value={config?.cdnUrl || ''}
                onChange={(e) => handleConfigChange('cdnUrl', e.target.value)}
                placeholder="https://cdn.example.com"
                className="form-input"
              />
            </div>
          )}
        </div>
      </div>

      {/* Upload Restrictions */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Upload Restrictions</h2>
          <Icon name="Upload" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="form-label">Max Upload Size (MB)</label>
              <Input
                type="number"
                value={config?.uploadMaxSize || 10}
                onChange={(e) => handleConfigChange('uploadMaxSize', parseInt(e.target.value))}
                min="1"
                max="100"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Allowed File Types</label>
              <div className="space-y-2">
                {['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'mp4', 'mov'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Input
                      type="checkbox"
                      checked={(config?.allowedFileTypes || []).includes(type)}
                      onChange={(e) => {
                        const currentTypes = config?.allowedFileTypes || [];
                        const updatedTypes = e.target.checked
                          ? [...currentTypes, type]
                          : currentTypes.filter(t => t !== type);
                        handleConfigChange('allowedFileTypes', updatedTypes);
                      }}
                    />
                    <label className="text-sm">.{type}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-secondary-50 p-4 rounded-lg">
              <h3 className="font-medium text-text-primary mb-2">Security Settings</h3>
              <div className="space-y-2 text-sm text-text-secondary">
                <p>• Virus scanning enabled</p>
                <p>• Malware detection active</p>
                <p>• File content verification</p>
                <p>• Automatic image optimization</p>
              </div>
            </div>

            <div className="bg-secondary-50 p-4 rounded-lg">
              <h3 className="font-medium text-text-primary mb-2">Storage Usage</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Images</span>
                  <span>2.3 GB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Documents</span>
                  <span>456 MB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Videos</span>
                  <span>1.2 GB</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span>4.0 GB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Storage Statistics */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Storage Statistics</h2>
          <Icon name="BarChart3" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-secondary-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-text-primary">12,345</div>
            <div className="text-sm text-text-secondary">Files Stored</div>
          </div>
          
          <div className="bg-secondary-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-primary">4.2 GB</div>
            <div className="text-sm text-text-secondary">Total Size</div>
          </div>
          
          <div className="bg-secondary-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-success">234</div>
            <div className="text-sm text-text-secondary">Uploads Today</div>
          </div>
          
          <div className="bg-secondary-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-warning">98.5%</div>
            <div className="text-sm text-text-secondary">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileStoragePanel;