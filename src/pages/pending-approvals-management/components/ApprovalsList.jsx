import React, { useState } from 'react';
import { Clock, Building, User, Calendar, Users as UsersIcon, DollarSign, AlertTriangle, Check, X, Mail, Phone, MapPin } from 'lucide-react';

const ApprovalsList = ({ approvals, onApprovalAction, onBulkAction, loading }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDetails, setShowDetails] = useState(null);

  const formatDate = (dateString) => {
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
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getPriorityBadge = (createdAt) => {
    const daysSinceCreated = Math.floor(
      (new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceCreated > 3) {
      return { label: 'Urgent', color: 'bg-red-100 text-red-800 border-red-200' };
    } else if (daysSinceCreated > 1) {
      return { label: 'High', color: 'bg-orange-100 text-orange-800 border-orange-200' };
    }
    return { label: 'Normal', color: 'bg-green-100 text-green-800 border-green-200' };
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === approvals?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(approvals?.map(approval => approval.id) || []);
    }
  };

  const handleBulkAction = (action) => {
    if (selectedItems.length > 0) {
      if (window.confirm(`Are you sure you want to ${action} ${selectedItems.length} selected items?`)) {
        onBulkAction(selectedItems, action);
        setSelectedItems([]);
      }
    }
  };

  if (!approvals?.length) {
    return (
      <div className="p-12 text-center">
        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Approvals</h3>
        <p className="text-gray-500">
          All booking requests have been processed. Great work!
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Bulk Actions Header */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedItems.length} items selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="flex items-center px-3 py-1 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md transition-colors"
              >
                <Check className="w-4 h-4 mr-1" />
                Approve All
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="flex items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                Reject All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedItems.length === approvals?.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {approvals?.map((approval) => {
              const priority = getPriorityBadge(approval.created_at);
              
              return (
                <tr 
                  key={approval.id} 
                  className={`hover:bg-gray-50 ${selectedItems.includes(approval.id) ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(approval.id)}
                      onChange={() => handleSelectItem(approval.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {approval.booking_reference}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Building className="w-4 h-4 text-gray-400 mr-1" />
                        {approval.venue?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        {approval.venue?.location || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        {approval.customer?.full_name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Mail className="w-4 h-4 text-gray-400 mr-1" />
                        {approval.customer?.email || 'N/A'}
                      </div>
                      {approval.customer?.phone && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-1" />
                          {approval.customer.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {new Date(approval.event_date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(approval.start_time)} - {formatTime(approval.end_time)}
                      </div>
                      <div className="flex items-center mt-1">
                        <UsersIcon className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{approval.guest_count} guests</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">${approval.total_amount}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${priority.color}`}>
                      {priority.label === 'Urgent' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {priority.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(approval.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onApprovalAction(approval.id, 'approve')}
                        className="flex items-center px-3 py-1 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md transition-colors"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => onApprovalAction(approval.id, 'reject')}
                        className="flex items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 p-4">
        {approvals?.map((approval) => {
          const priority = getPriorityBadge(approval.created_at);
          
          return (
            <div 
              key={approval.id} 
              className={`bg-white border border-gray-200 rounded-lg p-4 ${
                selectedItems.includes(approval.id) ? 'ring-2 ring-blue-500 border-blue-300' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(approval.id)}
                    onChange={() => handleSelectItem(approval.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {approval.booking_reference}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${priority.color} mt-1`}>
                      {priority.label === 'Urgent' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {priority.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Building className="w-4 h-4 text-gray-400 mr-2" />
                  {approval.venue?.name || 'N/A'}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  {approval.customer?.full_name || 'N/A'}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  {new Date(approval.event_date).toLocaleDateString()} • {approval.guest_count} guests
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                  ${approval.total_amount}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Submitted {formatDate(approval.created_at)}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onApprovalAction(approval.id, 'approve')}
                    className="flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded transition-colors"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => onApprovalAction(approval.id, 'reject')}
                    className="flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded transition-colors"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApprovalsList;