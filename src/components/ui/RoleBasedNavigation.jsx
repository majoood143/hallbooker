import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../contexts/AuthContext';
import { ensureArray, safeMap } from '../../utils/arrayUtils';

const RoleBasedNavigation = ({ user, onNavigate }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Safe role checking
  const userRole = user?.role || 'customer';

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'home', label: 'Home', path: '/', icon: 'Home' },
      { id: 'search', label: 'Search Venues', path: '/venue-discovery-search', icon: 'Search' }
    ];

    const roleSpecificItems = {
      customer: [
        { id: 'dashboard', label: 'Dashboard', path: '/user-dashboard', icon: 'User' },
        { id: 'bookings', label: 'My Bookings', path: '/user-dashboard?tab=bookings', icon: 'Calendar' },
        { id: 'favorites', label: 'Favorites', path: '/user-dashboard?tab=favorites', icon: 'Heart' }
      ],
      venue_owner: [
        { id: 'dashboard', label: 'Dashboard', path: '/venue-owner-dashboard', icon: 'Building' },
        { id: 'venues', label: 'My Venues', path: '/venue-status-management', icon: 'Home' },
        { id: 'bookings', label: 'Bookings', path: '/venue-status-management?tab=bookings', icon: 'Calendar' }
      ],
      admin: [
        { id: 'admin', label: 'Admin Panel', path: '/admin-management-panel', icon: 'Settings' },
        { id: 'users', label: 'Users', path: '/all-users-management', icon: 'Users' },
        { id: 'venues', label: 'Venues', path: '/all-venues-management', icon: 'Building' },
        { id: 'approvals', label: 'Approvals', path: '/pending-approvals-management', icon: 'CheckCircle' }
      ]
    };

    return [...baseItems, ...ensureArray(roleSpecificItems[userRole])];
  };

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    navigate(path);
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center space-x-2 text-xl font-bold text-primary"
            >
              <Icon name="Home" size={24} />
              <span>HallBooker</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {safeMap(navigationItems, (item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className="flex items-center space-x-1 text-text-secondary hover:text-primary transition-colors duration-200"
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-text-primary font-medium">
                  {user?.full_name || user?.email || 'User'}
                </span>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  iconName="LogOut"
                  iconSize={16}
                  className="text-sm"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleNavigation('/login')}
                  className="text-sm"
                >
                  Log In
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleNavigation('/signup')}
                  className="text-sm"
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-text-secondary hover:text-primary hover:bg-secondary-100"
            >
              <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-surface">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {safeMap(navigationItems, (item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center space-x-2 w-full text-left px-3 py-2 text-text-secondary hover:text-primary hover:bg-secondary-100 rounded-md"
                >
                  <Icon name={item.icon} size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default RoleBasedNavigation;