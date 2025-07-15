import React, { useState } from 'react';
import { UserX, UserCheck, Download, ChevronDown } from 'lucide-react';

const BulkActionsMenu = ({ selectedCount, onAction, selectedUsers }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action) => {
    onAction?.(action, selectedUsers);
    setIsOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-900">
            {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Bulk Actions
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <button
                  onClick={() => handleAction('activate')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <UserCheck className="h-4 w-4 mr-3 text-green-500" />
                  Activate Users
                </button>
                <button
                  onClick={() => handleAction('suspend')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <UserX className="h-4 w-4 mr-3 text-red-500" />
                  Suspend Users
                </button>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={() => handleAction('export')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Download className="h-4 w-4 mr-3 text-blue-500" />
                  Export Selected
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkActionsMenu;