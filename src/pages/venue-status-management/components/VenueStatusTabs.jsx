import React from 'react';

const VenueStatusTabs = ({ tabs, activeTab, onTabChange }) => {
  const getStatusColor = (tabId) => {
    switch (tabId) {
      case 'active-venues': case'confirmed-bookings':
        return 'text-green-600 bg-green-50';
      case 'pending-reviews': case'pending-bookings':
        return 'text-yellow-600 bg-yellow-50';
      case 'suspended-venues': case'disputes':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="border-b border-gray-200">
      <nav className="flex overflow-x-auto">
        {tabs?.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className={`
              flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors
              ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600 bg-blue-50' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-center space-x-2">
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`
                  px-2 py-1 text-xs font-semibold rounded-full
                  ${activeTab === tab.id ? getStatusColor(tab.id) : 'text-gray-500 bg-gray-100'}
                `}>
                  {tab.count}
                </span>
              )}
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default VenueStatusTabs;