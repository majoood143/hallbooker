import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const CalendarView = ({ bookings, onDateClick, onBookingClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getBookingsForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return bookings.filter(booking => booking.eventDate === dateString);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getBookingStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-success-500';
      case 'pending':
        return 'bg-warning-500';
      case 'declined':
        return 'bg-error-500';
      default:
        return 'bg-secondary-500';
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-semibold text-text-primary">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              iconName="ChevronLeft"
              iconSize={16}
              onClick={() => navigateMonth(-1)}
            />
            <Button
              variant="ghost"
              iconName="ChevronRight"
              iconSize={16}
              onClick={() => navigateMonth(1)}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'month' ? 'primary' : 'ghost'}
            onClick={() => setViewMode('month')}
          >
            Month
          </Button>
          <Button
            variant={viewMode === 'week' ? 'primary' : 'ghost'}
            onClick={() => setViewMode('week')}
          >
            Week
          </Button>
          <Button
            variant="outline"
            iconName="Plus"
            iconSize={14}
            onClick={() => onDateClick(new Date())}
          >
            Block Date
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-text-secondary">
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {days.map((day, index) => {
          const dayBookings = day ? getBookingsForDate(day) : [];
          const isToday = day && day.toDateString() === today.toDateString();
          const isPastDate = day && day < today;
          
          return (
            <div
              key={index}
              className={`min-h-24 p-1 border border-border cursor-pointer hover:bg-secondary-50 transition-colors duration-200 ${
                isToday ? 'bg-primary-50 border-primary-200' : ''
              } ${isPastDate ? 'opacity-50' : ''}`}
              onClick={() => day && onDateClick(day)}
            >
              {day && (
                <>
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-primary-600' : 'text-text-primary'
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayBookings.slice(0, 2).map((booking, bookingIndex) => (
                      <div
                        key={bookingIndex}
                        className={`text-xs px-1 py-0.5 rounded text-white truncate cursor-pointer ${getBookingStatusColor(booking.status)}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookingClick(booking);
                        }}
                        title={`${booking.customerName} - ${booking.venueName}`}
                      >
                        {booking.customerName}
                      </div>
                    ))}
                    
                    {dayBookings.length > 2 && (
                      <div className="text-xs text-text-muted">
                        +{dayBookings.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success-500 rounded"></div>
          <span className="text-sm text-text-secondary">Approved</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-warning-500 rounded"></div>
          <span className="text-sm text-text-secondary">Pending</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-error-500 rounded"></div>
          <span className="text-sm text-text-secondary">Declined</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-secondary-500 rounded"></div>
          <span className="text-sm text-text-secondary">Blocked</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;