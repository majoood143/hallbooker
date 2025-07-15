import React, { useRef, useEffect } from 'react';
import { Check, Pause, X } from 'lucide-react';

const BulkActionsMenu = ({ onAction, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleAction = (action) => {
    onAction?.(action);
    onClose?.();
  };

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10"
    >
      <button
        onClick={() => handleAction('approve')}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
      >
        <Check className="w-4 h-4 mr-3 text-green-500" />
        Approve Selected
      </button>
      
      <button
        onClick={() => handleAction('suspend')}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
      >
        <Pause className="w-4 h-4 mr-3 text-orange-500" />
        Suspend Selected
      </button>
      
      <div className="border-t border-gray-100 my-1"></div>
      
      <button
        onClick={() => handleAction('delete')}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
      >
        <X className="w-4 h-4 mr-3" />
        Delete Selected
      </button>
    </div>
  );
};

export default BulkActionsMenu;