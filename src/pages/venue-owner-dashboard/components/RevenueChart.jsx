import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const RevenueChart = ({ data, chartType = 'bar', title }) => {
  // Data validation and sanitization function
  const sanitizeData = (rawData) => {
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
      return [];
    }

    return rawData
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        
        return {
          month: item?.month || 'N/A',
          revenue: typeof item?.revenue === 'number' && !isNaN(item.revenue) ? item.revenue : 0,
          bookings: typeof item?.bookings === 'number' && !isNaN(item.bookings) ? item.bookings : 0
        };
      })
      .filter(item => item !== null);
  };

  // Sanitize the data
  const sanitizedData = sanitizeData(data);

  // If no valid data, show empty state
  if (sanitizedData.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="text-text-secondary mb-2">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-sm text-text-secondary">No data available</p>
          </div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-text-primary">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-text-secondary">
              <span className="font-medium" style={{ color: entry?.color }}>
                {entry?.name || 'Unknown'}:
              </span>
              {entry?.name === 'Revenue' 
                ? ` $${(entry?.value || 0).toLocaleString()}` 
                : ` ${entry?.value || 0} bookings`
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Safe tick formatter functions
  const formatCurrency = (value) => {
    const numValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    return `$${numValue.toLocaleString()}`;
  };

  const formatNumber = (value) => {
    const numValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    return `${numValue}`;
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-text-secondary">
            <div className="w-3 h-3 bg-primary-500 rounded"></div>
            <span>Revenue</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-text-secondary">
            <div className="w-3 h-3 bg-success-500 rounded"></div>
            <span>Bookings</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart 
              data={sanitizedData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                yAxisId="left"
                stroke="var(--color-text-secondary)"
                fontSize={12}
                tick={{ fontSize: 12 }}
                tickFormatter={formatCurrency}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="var(--color-text-secondary)"
                fontSize={12}
                tick={{ fontSize: 12 }}
                tickFormatter={formatNumber}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="revenue" 
                fill="var(--color-primary)" 
                radius={[4, 4, 0, 0]}
                name="Revenue"
                yAxisId="left"
              />
              <Bar 
                dataKey="bookings" 
                fill="var(--color-success)" 
                radius={[4, 4, 0, 0]}
                name="Bookings"
                yAxisId="right"
              />
            </BarChart>
          ) : (
            <LineChart 
              data={sanitizedData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                yAxisId="left"
                stroke="var(--color-text-secondary)"
                fontSize={12}
                tick={{ fontSize: 12 }}
                tickFormatter={formatCurrency}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="var(--color-text-secondary)"
                fontSize={12}
                tick={{ fontSize: 12 }}
                tickFormatter={formatNumber}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                name="Revenue"
                yAxisId="left"
                connectNulls={false}
              />
              <Line 
                type="monotone" 
                dataKey="bookings" 
                stroke="var(--color-success)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
                name="Bookings"
                yAxisId="right"
                connectNulls={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;