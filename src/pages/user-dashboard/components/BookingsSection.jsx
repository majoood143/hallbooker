import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import BookingCard from './BookingCard';
import { ensureArray, safeMap, safeFilter } from '../../../utils/arrayUtils';

const BookingsSection = ({ bookings = [], onViewDetails, onContactVenue, onCancelModify }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Bookings' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'past', label: 'Past' },
    { value: 'this-month', label: 'This Month' }
  ];

  const filterBookings = () => {
    // Safe array initialization
    const safeBookings = ensureArray(bookings);
    let filtered = [...safeBookings];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = safeFilter(filtered, booking => 
        booking?.status?.toLowerCase() === statusFilter
      );
    }

    // Filter by date
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    if (dateFilter === 'upcoming') {
      filtered = safeFilter(filtered, booking => 
        booking?.date && new Date(booking.date) >= now
      );
    } else if (dateFilter === 'past') {
      filtered = safeFilter(filtered, booking => 
        booking?.date && new Date(booking.date) < now
      );
    } else if (dateFilter === 'this-month') {
      filtered = safeFilter(filtered, booking => 
        booking?.date && new Date(booking.date) >= startOfMonth
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => {
      const dateA = a?.date ? new Date(a.date) : new Date(0);
      const dateB = b?.date ? new Date(b.date) : new Date(0);
      return dateB - dateA;
    });

    return filtered;
  };

  const filteredBookings = filterBookings();

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Filter by Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {safeMap(statusOptions, option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Filter by Date
          </label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {safeMap(dateOptions, option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-secondary">
          {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
        </p>
        <Button
          variant="ghost"
          iconName="RefreshCw"
          iconSize={16}
          onClick={() => {
            setStatusFilter('all');
            setDateFilter('all');
          }}
          className="text-sm"
        >
          Clear Filters
        </Button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {safeMap(filteredBookings, (booking) => (
            <BookingCard
              key={booking?.id || Math.random()}
              booking={booking}
              onViewDetails={onViewDetails}
              onContactVenue={onContactVenue}
              onCancelModify={onCancelModify}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Calendar" size={32} color="var(--color-text-muted)" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No bookings found
          </h3>
          <p className="text-text-secondary mb-4">
            {statusFilter === 'all' && dateFilter === 'all' ? "You haven't made any bookings yet." : "No bookings match your current filters."}
          </p>
          <Button
            variant="primary"
            iconName="Search"
            iconSize={16}
            onClick={() => window.location.href = '/venue-discovery-search'}
          >
            Discover Venues
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingsSection;