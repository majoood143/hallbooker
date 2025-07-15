import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AvailabilityCalendar = ({ availability, selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const getDateStatus = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return 'past';
    
    const dayAvailability = availability[dateStr];
    if (!dayAvailability) return 'available';
    
    if (dayAvailability.status === 'booked') return 'booked';
    if (dayAvailability.status === 'blocked') return 'blocked';
    if (dayAvailability.partiallyBooked) return 'partial';
    
    return 'available';
  };

  const getDateClasses = (date, status) => {
    const baseClasses = 'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 cursor-pointer';
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
    
    if (isSelected) {
      return `${baseClasses} bg-primary text-white ring-2 ring-primary ring-offset-2`;
    }
    
    switch (status) {
      case 'past':
        return `${baseClasses} text-text-muted cursor-not-allowed`;
      case 'booked':
        return `${baseClasses} bg-error-100 text-error-700 cursor-not-allowed`;
      case 'blocked':
        return `${baseClasses} bg-secondary-200 text-secondary-600 cursor-not-allowed`;
      case 'partial':
        return `${baseClasses} bg-warning-100 text-warning-700 hover:bg-warning-200`;
      case 'available':
        return `${baseClasses} hover:bg-primary-50 hover:text-primary`;
      default:
        return baseClasses;
    }
  };

  const handleDateClick = (date, status) => {
    if (status === 'past' || status === 'booked' || status === 'blocked') return;
    onDateSelect(date);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const status = getDateStatus(date);
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date, status)}
          className={getDateClasses(date, status)}
          disabled={status === 'past' || status === 'booked' || status === 'blocked'}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-text-primary">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-secondary-100 transition-colors duration-200"
          >
            <Icon name="ChevronLeft" size={16} color="var(--color-text-secondary)" />
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-secondary-100 transition-colors duration-200"
          >
            <Icon name="ChevronRight" size={16} color="var(--color-text-secondary)" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="w-10 h-8 flex items-center justify-center text-xs font-medium text-text-muted">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {renderCalendar()}
      </div>

      {/* Legend */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-text-primary">Legend</h4>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span className="text-text-secondary">Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success-100 border border-success-200 rounded"></div>
            <span className="text-text-secondary">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning-100 border border-warning-200 rounded"></div>
            <span className="text-text-secondary">Partially Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error-100 border border-error-200 rounded"></div>
            <span className="text-text-secondary">Fully Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary-200 rounded"></div>
            <span className="text-text-secondary">Blocked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;