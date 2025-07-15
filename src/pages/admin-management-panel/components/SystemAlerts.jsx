import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemAlerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'error',
      title: 'Payment Gateway Issue',
      message: 'Stripe payment processing is experiencing delays. 15 transactions affected.',
      timestamp: '5 minutes ago',
      severity: 'high',
      isRead: false,
      actionRequired: true
    },
    {
      id: 2,
      type: 'warning',
      title: 'High Server Load',
      message: 'Server CPU usage at 85%. Consider scaling resources during peak hours.',
      timestamp: '1 hour ago',
      severity: 'medium',
      isRead: false,
      actionRequired: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'Database maintenance scheduled for tonight at 2:00 AM EST. Expected downtime: 30 minutes.',
      timestamp: '3 hours ago',
      severity: 'low',
      isRead: true,
      actionRequired: false
    },
    {
      id: 4,
      type: 'success',
      title: 'Backup Completed',
      message: 'Daily database backup completed successfully. All data secured.',
      timestamp: '6 hours ago',
      severity: 'low',
      isRead: true,
      actionRequired: false
    },
    {
      id: 5,
      type: 'warning',
      title: 'Unusual Activity Detected',
      message: 'Multiple failed login attempts from IP 192.168.1.100. Security monitoring active.',
      timestamp: '8 hours ago',
      severity: 'high',
      isRead: false,
      actionRequired: true
    }
  ]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error':
        return 'AlertCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'info':
        return 'Info';
      case 'success':
        return 'CheckCircle';
      default:
        return 'Bell';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-error-50',
          border: 'border-error-200',
          icon: 'var(--color-error)',
          text: 'text-error-700'
        };
      case 'warning':
        return {
          bg: 'bg-warning-50',
          border: 'border-warning-200',
          icon: 'var(--color-warning)',
          text: 'text-warning-700'
        };
      case 'info':
        return {
          bg: 'bg-primary-50',
          border: 'border-primary-200',
          icon: 'var(--color-primary)',
          text: 'text-primary-700'
        };
      case 'success':
        return {
          bg: 'bg-success-50',
          border: 'border-success-200',
          icon: 'var(--color-success)',
          text: 'text-success-700'
        };
      default:
        return {
          bg: 'bg-secondary-50',
          border: 'border-secondary-200',
          icon: 'var(--color-secondary)',
          text: 'text-secondary-700'
        };
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-error-100 text-error-700 border-error-200';
      case 'medium':
        return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'low':
        return 'bg-success-100 text-success-700 border-success-200';
      default:
        return 'bg-secondary-100 text-secondary-700 border-secondary-200';
    }
  };

  const handleDismiss = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const handleMarkAsRead = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const handleTakeAction = (alertId) => {
    console.log('Taking action for alert:', alertId);
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const criticalCount = alerts.filter(alert => alert.severity === 'high' && !alert.isRead).length;

  return (
    <div className="card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-text-primary">System Alerts</h3>
            {unreadCount > 0 && (
              <span className="bg-error-100 text-error-700 text-sm font-medium px-3 py-1 rounded-full">
                {unreadCount} unread
              </span>
            )}
            {criticalCount > 0 && (
              <span className="bg-error text-white text-sm font-medium px-3 py-1 rounded-full animate-pulse">
                {criticalCount} critical
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            iconName="Settings"
            iconSize={16}
            className="text-text-muted hover:text-text-secondary"
          />
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="CheckCircle" size={48} color="var(--color-success)" className="mx-auto mb-4" />
            <h4 className="text-lg font-medium text-text-primary mb-2">All Clear!</h4>
            <p className="text-text-muted">No system alerts at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {alerts.map((alert) => {
              const colors = getAlertColor(alert.type);
              return (
                <div
                  key={alert.id}
                  className={`p-4 ${!alert.isRead ? colors.bg : 'bg-surface'} ${!alert.isRead ? colors.border : 'border-transparent'} border-l-4 transition-colors duration-200`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <Icon name={getAlertIcon(alert.type)} size={20} color={colors.icon} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`text-sm font-medium ${!alert.isRead ? colors.text : 'text-text-primary'}`}>
                              {alert.title}
                            </h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityBadge(alert.severity)}`}>
                              {alert.severity}
                            </span>
                            {alert.actionRequired && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error-100 text-error-700 border border-error-200">
                                Action Required
                              </span>
                            )}
                          </div>
                          
                          <p className={`text-sm mb-2 ${!alert.isRead ? colors.text : 'text-text-secondary'}`}>
                            {alert.message}
                          </p>
                          
                          <p className="text-xs text-text-muted">{alert.timestamp}</p>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-4">
                          {!alert.isRead && (
                            <Button
                              variant="ghost"
                              iconName="Eye"
                              iconSize={14}
                              onClick={() => handleMarkAsRead(alert.id)}
                              className="p-1"
                            />
                          )}
                          <Button
                            variant="ghost"
                            iconName="X"
                            iconSize={14}
                            onClick={() => handleDismiss(alert.id)}
                            className="p-1 text-text-muted hover:text-text-secondary"
                          />
                        </div>
                      </div>
                      
                      {alert.actionRequired && (
                        <div className="mt-3">
                          <Button
                            variant="primary"
                            iconName="ArrowRight"
                            iconSize={14}
                            onClick={() => handleTakeAction(alert.id)}
                            className="text-xs px-3 py-1"
                          >
                            Take Action
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemAlerts;