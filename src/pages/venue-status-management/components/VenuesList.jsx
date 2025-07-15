import React, { useState } from 'react';
import { Building2, MapPin, Users, DollarSign, Calendar, MoreVertical, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const VenuesList = ({ venues, selectedItems, onSelectionChange, onStatusUpdate, loading }) => {
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'suspended':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'under_review':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'suspended':
        return 'Suspended';
      case 'under_review':
        return 'Under Review';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'suspended':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'under_review':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'pending':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange?.(venues?.map(venue => venue.id) || []);
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectItem = (venueId, checked) => {
    if (checked) {
      onSelectionChange?.([...(selectedItems || []), venueId]);
    } else {
      onSelectionChange?.((selectedItems || []).filter(id => id !== venueId));
    }
  };

  const handleStatusUpdate = (venue, status) => {
    setShowActionMenu(null);
    setShowStatusModal(venue);
    setNewStatus(status);
    setReason('');
    setNotes('');
  };

  const submitStatusUpdate = () => {
    if (showStatusModal && newStatus) {
      const requiresReason = newStatus === 'suspended' || newStatus === 'under_review';
      if (requiresReason && !reason.trim()) {
        return;
      }

      onStatusUpdate?.(showStatusModal.id, newStatus, reason.trim() || null, notes.trim() || null);
      setShowStatusModal(null);
      setNewStatus('');
      setReason('');
      setNotes('');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
    return <LoadingSpinner size="medium" message="Loading venues..." />;
  }

  if (!venues || venues.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
        <p className="text-gray-500">No venues match the current filters.</p>
      </div>
    );
  }

  const isAllSelected = venues?.length > 0 && selectedItems?.length === venues.length;
  const isIndeterminate = selectedItems?.length > 0 && selectedItems.length < venues.length;

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
                Venue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {venues?.map((venue) => (
              <tr key={venue.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedItems?.includes(venue.id) || false}
                    onChange={(e) => handleSelectItem(venue.id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {venue.images?.[0] ? (
                        <img
                          src={venue.images[0]}
                          alt={venue.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {venue.name}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {venue.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(venue.status)}
                    <span className={getStatusBadge(venue.status)}>
                      {getStatusText(venue.status)}
                    </span>
                  </div>
                  {venue.suspension_reason && (
                    <p className="text-xs text-red-600 mt-1">{venue.suspension_reason}</p>
                  )}
                  {venue.review_notes && (
                    <p className="text-xs text-yellow-600 mt-1">{venue.review_notes}</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {venue.owner?.full_name}
                    </p>
                    <p className="text-sm text-gray-500">{venue.owner?.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      {venue.capacity} guests
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {formatCurrency(venue.price_per_hour)}/hour
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {venue.venue_type?.replace('_', ' ')}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(venue.last_status_change || venue.updated_at)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === venue.id ? null : venue.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {showActionMenu === venue.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <div className="py-1">
                          <button
                            onClick={() => handleStatusUpdate(venue, 'active')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                            Mark as Active
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(venue, 'under_review')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                            Send for Review
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(venue, 'suspended')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <XCircle className="w-4 h-4 mr-2 text-red-500" />
                            Suspend Venue
                          </button>
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
              Update Venue Status
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Venue:</strong> {showStatusModal.name}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>New Status:</strong> {getStatusText(newStatus)}
                </p>
              </div>

              {(newStatus === 'suspended' || newStatus === 'under_review') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {newStatus === 'suspended' ? 'Suspension Reason *' : 'Review Notes'}
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={`Please provide ${newStatus === 'suspended' ? 'a reason for suspension' : 'review notes'}...`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional additional notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
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
                  (newStatus === 'suspended' && !reason.trim()) ||
                  (newStatus === 'under_review' && !reason.trim())
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

export default VenuesList;