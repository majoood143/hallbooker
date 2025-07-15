import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TransactionLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    dateRange: '24h',
    search: ''
  });
  const [loading, setLoading] = useState(false);

  // Mock transaction logs data
  const mockLogs = [
    {
      id: 'txn_001',
      timestamp: new Date(Date.now() - 3600000),
      type: 'payment',
      status: 'success',
      amount: 25.50,
      currency: 'OMR',
      method: 'card',
      customer: 'john.doe@example.com',
      venue: 'Grand Hall',
      reference: 'REF001',
      gatewayResponse: 'Payment processed successfully'
    },
    {
      id: 'txn_002',
      timestamp: new Date(Date.now() - 7200000),
      type: 'refund',
      status: 'success',
      amount: 15.00,
      currency: 'OMR',
      method: 'card',
      customer: 'jane.smith@example.com',
      venue: 'Business Center',
      reference: 'REF002',
      gatewayResponse: 'Refund processed successfully'
    },
    {
      id: 'txn_003',
      timestamp: new Date(Date.now() - 10800000),
      type: 'payment',
      status: 'failed',
      amount: 50.00,
      currency: 'OMR',
      method: 'card',
      customer: 'bob.wilson@example.com',
      venue: 'Conference Room A',
      reference: 'REF003',
      gatewayResponse: 'Card declined by issuer'
    },
    {
      id: 'txn_004',
      timestamp: new Date(Date.now() - 14400000),
      type: 'payment',
      status: 'pending',
      amount: 75.25,
      currency: 'OMR',
      method: 'wallet',
      customer: 'alice.brown@example.com',
      venue: 'Event Hall',
      reference: 'REF004',
      gatewayResponse: 'Payment authorization pending'
    },
    {
      id: 'txn_005',
      timestamp: new Date(Date.now() - 18000000),
      type: 'webhook',
      status: 'success',
      amount: 0,
      currency: 'OMR',
      method: 'webhook',
      customer: 'system',
      venue: 'N/A',
      reference: 'WHK001',
      gatewayResponse: 'Webhook delivered successfully'
    }
  ];

  useEffect(() => {
    loadTransactionLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, filters]);

  const loadTransactionLogs = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLogs(mockLogs);
    } catch (error) {
      console.error('Failed to load transaction logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...logs];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(log => log.status === filters.status);
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(log => log.type === filters.type);
    }

    // Date range filter
    const now = new Date();
    let cutoffDate;
    switch (filters.dateRange) {
      case '1h':
        cutoffDate = new Date(now.getTime() - 3600000);
        break;
      case '24h':
        cutoffDate = new Date(now.getTime() - 86400000);
        break;
      case '7d':
        cutoffDate = new Date(now.getTime() - 604800000);
        break;
      case '30d':
        cutoffDate = new Date(now.getTime() - 2592000000);
        break;
      default:
        cutoffDate = new Date(0);
    }
    filtered = filtered.filter(log => log.timestamp >= cutoffDate);

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.id.toLowerCase().includes(searchTerm) ||
        log.customer.toLowerCase().includes(searchTerm) ||
        log.venue.toLowerCase().includes(searchTerm) ||
        log.reference.toLowerCase().includes(searchTerm)
      );
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    setFilteredLogs(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'failed':
        return 'text-error';
      case 'pending':
        return 'text-warning';
      default:
        return 'text-text-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return 'CheckCircle';
      case 'failed':
        return 'XCircle';
      case 'pending':
        return 'Clock';
      default:
        return 'HelpCircle';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'payment':
        return 'CreditCard';
      case 'refund':
        return 'RotateCcw';
      case 'webhook':
        return 'Webhook';
      default:
        return 'Activity';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(timestamp);
  };

  const formatAmount = (amount, currency) => {
    if (amount === 0) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const exportLogs = () => {
    const csvContent = [
      ['ID', 'Timestamp', 'Type', 'Status', 'Amount', 'Currency', 'Method', 'Customer', 'Venue', 'Reference', 'Response'],
      ...filteredLogs.map(log => [
        log.id,
        formatTimestamp(log.timestamp),
        log.type,
        log.status,
        log.amount,
        log.currency,
        log.method,
        log.customer,
        log.venue,
        log.reference,
        log.gatewayResponse
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaction_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Transaction Logs</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconSize={14}
            onClick={loadTransactionLogs}
            loading={loading}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconSize={14}
            onClick={exportLogs}
            disabled={filteredLogs.length === 0}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="form-input w-full text-sm"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Type</label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="form-input w-full text-sm"
          >
            <option value="all">All Types</option>
            <option value="payment">Payment</option>
            <option value="refund">Refund</option>
            <option value="webhook">Webhook</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="form-input w-full text-sm"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Search</label>
          <Input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search logs..."
            className="text-sm"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Icon name="Loader" size={24} className="animate-spin" color="var(--color-primary)" />
            <span className="ml-2 text-text-secondary">Loading logs...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="FileText" size={48} color="var(--color-text-muted)" className="mx-auto mb-4" />
            <p className="text-text-muted">No transaction logs found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-text-primary">Transaction</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-primary">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-primary">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-primary">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-primary">Venue</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-primary">Timestamp</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-primary">Response</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-border hover:bg-surface">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Icon name={getTypeIcon(log.type)} size={16} color="var(--color-primary)" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">{log.id}</p>
                        <p className="text-xs text-text-muted capitalize">{log.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Icon name={getStatusIcon(log.status)} size={14} color={getStatusColor(log.status)} />
                      <span className={`text-sm font-medium capitalize ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-text-primary">
                      {formatAmount(log.amount, log.currency)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-text-secondary">{log.customer}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-text-secondary">{log.venue}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-text-muted">{formatTimestamp(log.timestamp)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-text-secondary">{log.gatewayResponse}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {filteredLogs.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-text-muted">
            Showing {filteredLogs.length} of {logs.length} transactions
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionLogs;