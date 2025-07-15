import React, { useState } from 'react';
import { ChevronDown, Check, X, Clock, AlertTriangle } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const BulkActionsMenu = ({ selectedCount, onBulkAction, selectedItems, activeTab }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const isVenueTab = activeTab?.includes('venues');

  const venueActions = [
    { id: 'active', label: 'Mark as Active', icon: Check, color: 'green' },
    { id: 'under_review', label: 'Send for Review', icon: Clock, color: 'yellow' },
    { id: 'suspended', label: 'Suspend', icon: X, color: 'red', requiresReason: true },
    { id: 'pending', label: 'Mark as Pending', icon: AlertTriangle, color: 'orange' }
  ];

  const bookingActions = [
    { id: 'confirmed', label: 'Confirm', icon: Check, color: 'green' },
    { id: 'cancelled', label: 'Cancel', icon: X, color: 'red', requiresReason: true },
    { id: 'pending', label: 'Mark as Pending', icon: Clock, color: 'yellow' }
  ];

  const actions = isVenueTab ? venueActions : bookingActions;

  const handleActionClick = (action) => {
    setSelectedAction(action);
    setShowMenu(false);
    
    if (action.requiresReason) {
      setShowReasonModal(true);
    } else {
      performBulkAction(action.id);
    }
  };

  const performBulkAction = (actionId, actionReason = null, actionNotes = null) => {
    onBulkAction?.(actionId, selectedItems, actionReason, actionNotes);
    setShowReasonModal(false);
    setReason('');
    setNotes('');
    setSelectedAction(null);
  };

  const handleSubmitWithReason = () => {
    if (selectedAction && reason.trim()) {
      performBulkAction(selectedAction.id, reason.trim(), notes.trim() || null);
    }
  };

  const getIconColor = (color) => {
    const colors = {
      green: 'text-green-600',
      yellow: 'text-yellow-600',
      red: 'text-red-600',
      orange: 'text-orange-600'
    };
    return colors[color] || 'text-gray-600';
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700">
          {selectedCount} {isVenueTab ? 'venues' : 'bookings'} selected
        </p>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Bulk Actions
            <ChevronDown className="ml-2 w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="py-1">
                {actions?.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(action)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <Icon className={`w-4 h-4 mr-3 ${getIconColor(action.color)}`} />
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reason Modal */}
      {showReasonModal && selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedAction.label} - Reason Required
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={`Please provide a reason for ${selectedAction.label.toLowerCase()}...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

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
                onClick={() => setShowReasonModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitWithReason}
                disabled={!reason.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Apply Action
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionsMenu;