import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StatusIndicator = ({ status, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'connected':
        return {
          color: 'text-success',
          bgColor: 'bg-success-50',
          borderColor: 'border-success-200',
          icon: 'CheckCircle',
          label: 'Connected',
          message: 'Gateway is online and operational'
        };
      case 'disconnected':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning-50',
          borderColor: 'border-warning-200',
          icon: 'AlertCircle',
          label: 'Disconnected',
          message: 'Gateway connection lost'
        };
      case 'error':
        return {
          color: 'text-error',
          bgColor: 'bg-error-50',
          borderColor: 'border-error-200',
          icon: 'XCircle',
          label: 'Error',
          message: 'Gateway configuration error'
        };
      case 'testing':
        return {
          color: 'text-primary',
          bgColor: 'bg-primary-50',
          borderColor: 'border-primary-200',
          icon: 'TestTube',
          label: 'Testing',
          message: 'Running connection tests'
        };
      default:
        return {
          color: 'text-text-muted',
          bgColor: 'bg-surface',
          borderColor: 'border-border',
          icon: 'HelpCircle',
          label: 'Unknown',
          message: 'Status unknown'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-center space-x-2">
        <Icon 
          name={config.icon} 
          size={18} 
          color={config.color}
          className={status === 'testing' ? 'animate-pulse' : ''}
        />
        <div>
          <p className={`text-sm font-medium ${config.color}`}>
            {config.label}
          </p>
          <p className="text-xs text-text-muted">
            {config.message}
          </p>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        iconName="RefreshCw"
        iconSize={14}
        onClick={handleRefresh}
        loading={isRefreshing}
        className="text-xs"
      >
        Refresh
      </Button>
    </div>
  );
};

export default StatusIndicator;