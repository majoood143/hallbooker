import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const GeneralSettingsTab = ({ settings, onChange, onRestore }) => {
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
        onChange('brandingLogo', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (colorType, value) => {
    onChange(colorType, value);
  };

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'Arabic' },
    { value: 'fr', label: 'French' },
    { value: 'es', label: 'Spanish' }
  ];

  const timezoneOptions = [
    { value: 'Asia/Muscat', label: 'Asia/Muscat (GMT+4)' },
    { value: 'Asia/Dubai', label: 'Asia/Dubai (GMT+4)' },
    { value: 'Asia/Riyadh', label: 'Asia/Riyadh (GMT+3)' },
    { value: 'Europe/London', label: 'Europe/London (GMT+0)' },
    { value: 'America/New_York', label: 'America/New_York (GMT-5)' }
  ];

  const currencyOptions = [
    { value: 'OMR', label: 'OMR - Omani Rial' },
    { value: 'AED', label: 'AED - UAE Dirham' },
    { value: 'SAR', label: 'SAR - Saudi Riyal' },
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' }
  ];

  return (
    <div className="space-y-8">
      {/* Branding Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Platform Branding</h2>
          <Icon name="Palette" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div className="space-y-4">
            <div>
              <label className="form-label">Platform Logo</label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-secondary-100 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain rounded" />
                  ) : (
                    <Icon name="Image" size={24} className="text-text-muted" />
                  )}
                </div>
                <div>
                  <Button
                    variant="outline"
                    iconName="Upload"
                    iconSize={16}
                    onClick={() => document.getElementById('logo-upload').click()}
                    className="text-sm"
                  >
                    Upload Logo
                  </Button>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-text-muted mt-1">
                    PNG, JPG up to 2MB. Recommended: 200x200px
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">Platform Name</label>
              <Input
                value={settings?.platformName || ''}
                onChange={(e) => onChange('platformName', e.target.value)}
                placeholder="Enter platform name"
                className="form-input"
              />
            </div>
          </div>

          {/* Color Scheme */}
          <div className="space-y-4">
            <div>
              <label className="form-label">Primary Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings?.primaryColor || '#2563EB'}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="w-12 h-10 border border-border rounded cursor-pointer"
                />
                <Input
                  value={settings?.primaryColor || '#2563EB'}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  placeholder="#2563EB"
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Secondary Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings?.secondaryColor || '#64748B'}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  className="w-12 h-10 border border-border rounded cursor-pointer"
                />
                <Input
                  value={settings?.secondaryColor || '#64748B'}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  placeholder="#64748B"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Configuration */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">System Configuration</h2>
          <Icon name="Globe" size={20} className="text-text-muted" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="form-label">Default Language</label>
              <select
                value={settings?.defaultLanguage || 'en'}
                onChange={(e) => onChange('defaultLanguage', e.target.value)}
                className="form-input"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Timezone</label>
              <select
                value={settings?.timezone || 'Asia/Muscat'}
                onChange={(e) => onChange('timezone', e.target.value)}
                className="form-input"
              >
                {timezoneOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Date Format</label>
              <select
                value={settings?.dateFormat || 'DD/MM/YYYY'}
                onChange={(e) => onChange('dateFormat', e.target.value)}
                className="form-input"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="form-label">Time Format</label>
              <select
                value={settings?.timeFormat || '24h'}
                onChange={(e) => onChange('timeFormat', e.target.value)}
                className="form-input"
              >
                <option value="24h">24 Hour</option>
                <option value="12h">12 Hour</option>
              </select>
            </div>

            <div>
              <label className="form-label">Currency</label>
              <select
                value={settings?.currency || 'OMR'}
                onChange={(e) => onChange('currency', e.target.value)}
                className="form-input"
              >
                {currencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Maintenance Mode</h2>
          <Icon name="Wrench" size={20} className="text-text-muted" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Input
              type="checkbox"
              checked={settings?.maintenanceMode || false}
              onChange={(e) => onChange('maintenanceMode', e.target.checked)}
              className="form-checkbox"
            />
            <label className="text-sm font-medium text-text-primary">
              Enable Maintenance Mode
            </label>
          </div>

          <div>
            <label className="form-label">Maintenance Message</label>
            <textarea
              value={settings?.maintenanceMessage || ''}
              onChange={(e) => onChange('maintenanceMessage', e.target.value)}
              placeholder="Enter maintenance message for users"
              rows={3}
              className="form-input resize-none"
            />
          </div>

          {settings?.maintenanceMode && (
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <span className="text-sm font-medium text-warning">
                  Maintenance mode is enabled. Users will see the maintenance message.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Preview</h2>
          <Icon name="Eye" size={20} className="text-text-muted" />
        </div>

        <div className="bg-secondary-50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: settings?.primaryColor || '#2563EB' }}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain rounded" />
              ) : (
                <Icon name="Building2" size={16} color="white" />
              )}
            </div>
            <span className="text-lg font-semibold" style={{ color: settings?.primaryColor || '#2563EB' }}>
              {settings?.platformName || 'HallBooker'}
            </span>
          </div>
          
          <div className="text-sm text-text-muted space-y-1">
            <p>Language: {languageOptions.find(l => l.value === settings?.defaultLanguage)?.label || 'English'}</p>
            <p>Timezone: {timezoneOptions.find(t => t.value === settings?.timezone)?.label || 'Asia/Muscat'}</p>
            <p>Currency: {currencyOptions.find(c => c.value === settings?.currency)?.label || 'OMR'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettingsTab;