import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';


const RevenueChart = () => {
  const monthlyData = [
    { month: 'Jan', revenue: 45000, bookings: 120 },
    { month: 'Feb', revenue: 52000, bookings: 145 },
    { month: 'Mar', revenue: 48000, bookings: 132 },
    { month: 'Apr', revenue: 61000, bookings: 167 },
    { month: 'May', revenue: 55000, bookings: 156 },
    { month: 'Jun', revenue: 67000, bookings: 189 },
    { month: 'Jul', revenue: 72000, bookings: 203 },
    { month: 'Aug', revenue: 69000, bookings: 198 },
    { month: 'Sep', revenue: 58000, bookings: 167 },
    { month: 'Oct', revenue: 63000, bookings: 178 },
    { month: 'Nov', revenue: 71000, bookings: 201 },
    { month: 'Dec', revenue: 89000, bookings: 234 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-text-primary mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'revenue' ? 'Revenue: ' : 'Bookings: '}
              {entry.dataKey === 'revenue' ? `$${entry.value.toLocaleString()}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Revenue & Bookings</h3>
            <p className="text-sm text-text-muted">Monthly performance overview</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm text-text-secondary">Revenue</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm text-text-secondary">Bookings</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-text-muted)"
                fontSize={12}
              />
              <YAxis 
                yAxisId="revenue"
                orientation="left"
                stroke="var(--color-text-muted)"
                fontSize={12}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <YAxis 
                yAxisId="bookings"
                orientation="right"
                stroke="var(--color-text-muted)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                yAxisId="revenue"
                dataKey="revenue" 
                fill="var(--color-primary)" 
                radius={[4, 4, 0, 0]}
                opacity={0.8}
              />
              <Line 
                yAxisId="bookings"
                type="monotone" 
                dataKey="bookings" 
                stroke="var(--color-success)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-text-primary">$89.2k</p>
            <p className="text-sm text-text-muted">This Month</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">+15.3%</p>
            <p className="text-sm text-text-muted">Growth</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-text-primary">234</p>
            <p className="text-sm text-text-muted">Bookings</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">$381</p>
            <p className="text-sm text-text-muted">Avg. Value</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;