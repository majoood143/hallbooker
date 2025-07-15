import React from 'react';
import Icon from '../../../components/AppIcon';

const TabNavigation = ({ activeTab, onTabChange, unreadMessages }) => {
  const tabs = [
    {
      id: 'bookings',
      label: 'Bookings',
      icon: 'Calendar',
      count: null
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: 'Heart',
      count: null
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: 'MessageSquare',
      count: unreadMessages
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'User',
      count: null
    }
  ];

  return (
    <div className="bg-surface border-b border-border mb-6">
      {/* Mobile Horizontal Scrolling Tabs */}
      <div className="lg:hidden">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide px-4 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span className="text-sm font-medium">{tab.label}</span>
              {tab.count && tab.count > 0 && (
                <span className="bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Vertical Sidebar */}
      <div className="hidden lg:block">
        <div className="flex">
          <div className="w-64 bg-surface-secondary border-r border-border min-h-screen">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                Dashboard
              </h2>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name={tab.icon} size={18} />
                      <span className="font-medium">{tab.label}</span>
                    </div>
                    {tab.count && tab.count > 0 && (
                      <span className="bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;