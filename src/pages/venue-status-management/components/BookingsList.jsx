import React, { useState } from 'react';
import { Calendar, DollarSign, Users, MoreVertical, CheckCircle, XCircle, Clock, AlertTriangle, Building2 } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const BookingsList = ({ bookings, selectedItems, onSelectionChange, onStatusUpdate, loading, activeTab }) => {
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'disputed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'cancelled':
        return 'Cancelled';
      case 'pending':
        return 'Pending';
      case 'disputed':
        return 'Disputed';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'confirmed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'disputed':
        return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
      case 'completed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange?.(bookings?.map(booking => booking.id) || []);
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectItem = (bookingId, checked) => {
    if (checked) {
      onSelectionChange?.([...(selectedItems || []), bookingId]);
    } else {
      onSelectionChange?.((selectedItems || []).filter(id => id !== bookingId));
    }
  };

  const handleStatusUpdate = (booking, status) => {
    setShowActionMenu(null);
    setShowStatusModal(booking);
    setNewStatus(status);
    setNotes('');
  };

  const submitStatusUpdate = () => {
    if (showStatusModal && newStatus) {
      const requiresNotes = newStatus === 'cancelled' || newStatus === 'disputed';
      if (requiresNotes && !notes.trim()) {
        return;
      }

      onStatusUpdate?.(showStatusModal.id, newStatus, notes.trim() || null);
      setShowStatusModal(null);
      setNewStatus('');
      setNotes('');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return <LoadingSpinner size="medium" message="Loading bookings..." />;
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
        <p className="text-gray-500">No bookings match the current filters.</p>
      </div>
    );
  }

  const isAllSelected = bookings?.length > 0 && selectedItems?.length === bookings.length;
  const isIndeterminate = selectedItems?.length > 0 && selectedItems.length < bookings.length;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Venue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings?.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedItems?.includes(booking.id) || false}
                    onChange={(e) => handleSelectItem(booking.id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {booking.booking_reference}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.event_type || 'Event'}
                    </p>
                    <p className="text-xs text-gray-400">
                      Created {formatDateTime(booking.created_at)}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(booking.status)}
                    <span className={getStatusBadge(booking.status)}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                  {booking.dispute_reason && (
                    <p className="text-xs text-red-600 mt-1 max-w-xs truncate" title={booking.dispute_reason}>
                      {booking.dispute_reason}
                    </p>
                  )}
                  {booking.dispute_date && (
                    <p className="text-xs text-gray-500 mt-1">
                      Disputed: {formatDate(booking.dispute_date)}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {booking.customer?.full_name}
                    </p>
                    <p className="text-sm text-gray-500">{booking.customer?.email}</p>
                    {booking.customer?.phone && (
                      <p className="text-xs text-gray-400">{booking.customer.phone}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-2">
                    <Building2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {booking.venue?.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{booking.venue?.location}</p>
                      {booking.venue?.owner && (
                        <p className="text-xs text-gray-400">
                          Owner: {booking.venue.owner.full_name}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(booking.event_date)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      {booking.guest_count} guests
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm font-medium text-gray-900">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {formatCurrency(booking.total_amount)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === booking.id ? null : booking.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {showActionMenu === booking.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <div className="py-1">
                          {booking.status !== 'confirmed' && (
                            <button
                              onClick={() => handleStatusUpdate(booking, 'confirmed')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                              Confirm Booking
                            </button>
                          )}
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleStatusUpdate(booking, 'cancelled')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <XCircle className="w-4 h-4 mr-2 text-red-500" />
                              Cancel Booking
                            </button>
                          )}
                          {booking.status !== 'disputed' && booking.status !== 'cancelled' && (
                            <button
                              onClick={() => handleStatusUpdate(booking, 'disputed')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                              Mark as Disputed
                            </button>
                          )}
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleStatusUpdate(booking, 'completed')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                              Mark as Completed
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Update Booking Status
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Booking:</strong> {showStatusModal.booking_reference}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Customer:</strong> {showStatusModal.customer?.full_name}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>New Status:</strong> {getStatusText(newStatus)}
                </p>
              </div>

              {(newStatus === 'cancelled' || newStatus === 'disputed') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {newStatus === 'cancelled' ? 'Cancellation Reason *' : 'Dispute Reason *'}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={`Please provide ${newStatus === 'cancelled' ? 'a reason for cancellation' : 'details about the dispute'}...`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              )}

              {newStatus !== 'cancelled' && newStatus !== 'disputed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional notes about this status change..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowStatusModal(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitStatusUpdate}
                disabled={
                  (newStatus === 'cancelled' && !notes.trim()) ||
                  (newStatus === 'disputed' && !notes.trim())
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingsList;