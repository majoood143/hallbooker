import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import BookingStatusIndicator from '../../components/ui/BookingStatusIndicator';
import SearchContextPreserver from '../../components/ui/SearchContextPreserver';
import QuickActionMenu from '../../components/ui/QuickActionMenu';
import WelcomeSection from './components/WelcomeSection';
import TabNavigation from './components/TabNavigation';
import BookingsSection from './components/BookingsSection';
import FavoritesSection from './components/FavoritesSection';
import MessagesSection from './components/MessagesSection';
import ProfileSection from './components/ProfileSection';
import RecentActivityFeed from './components/RecentActivityFeed';

// Import services
import bookingService from '../../utils/bookingService';
import venueService from '../../utils/venueService';
import messageService from '../../utils/messageService';
import { ensureArray, safeMap } from '../../utils/arrayUtils';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [favoriteVenues, setFavoriteVenues] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from Supabase
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        // Load bookings
        const bookingsResult = await bookingService.getUserBookings(user.id);
        if (bookingsResult?.success) {
          const bookingsData = ensureArray(bookingsResult.data);
          setBookings(safeMap(bookingsData, booking => ({
            ...booking,
            // Map to expected format
            venue: {
              id: booking.venue?.id,
              name: booking.venue?.name,
              location: booking.venue?.location,
              image: booking.venue?.images?.[0] || '/assets/images/no_image.png'
            },
            bookingId: booking.booking_reference,
            date: booking.event_date,
            time: `${booking.start_time}`,
            guests: booking.guest_count,
            totalAmount: booking.total_amount
          })));
        }

        // Load favorite venues
        const favoritesResult = await venueService.getFavoriteVenues(user.id);
        if (favoritesResult?.success) {
          const favoritesData = ensureArray(favoritesResult.data);
          setFavoriteVenues(safeMap(favoritesData, venue => ({
            ...venue,
            // Map to expected format
            image: venue?.images?.[0] || '/assets/images/no_image.png',
            pricePerHour: venue?.price_per_hour,
            reviewCount: venue?.review_count,
            isAvailable: venue?.is_active,
            addedToFavorites: new Date().toISOString()
          })));
        }

        // Load messages/conversations
        const messagesResult = await messageService.getUserMessages(user.id);
        if (messagesResult?.success) {
          const messagesData = ensureArray(messagesResult.data);
          setConversations(safeMap(messagesData, conv => ({
            ...conv,
            venue: conv.booking?.venue || conv.otherUser,
            bookingId: conv.booking?.booking_reference,
            lastMessage: {
              content: conv.lastMessage?.content || '',
              timestamp: conv.lastMessage?.created_at || new Date().toISOString(),
              isFromUser: conv.lastMessage?.sender_id === user.id
            }
          })));
        }

        // Set default activities
        setRecentActivities([
          {
            id: "activity_001",
            type: "booking_confirmed",
            description: "Your booking has been confirmed",
            timestamp: new Date().toISOString()
          }
        ]);

      } catch (error) {
        console.log('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id && !authLoading) {
      loadUserData();
    }
  }, [user, authLoading]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleViewBookingDetails = (booking) => {
    navigate(`/booking-management-payment?bookingId=${booking?.id}`);
  };

  const handleContactVenue = (booking) => {
    setActiveTab('messages');
  };

  const handleCancelModifyBooking = (booking) => {
    navigate(`/booking-management-payment?bookingId=${booking?.id}&action=modify`);
  };

  const handleQuickBook = (venue) => {
    navigate(`/venue-details-booking?venueId=${venue?.id}&quickBook=true`);
  };

  const handleRemoveFavorite = async (venue) => {
    if (!user?.id) return;

    try {
      const result = await venueService.toggleFavorite(venue?.id, user.id);
      if (result?.success) {
        setFavoriteVenues(prev => ensureArray(prev).filter(v => v?.id !== venue?.id));
      }
    } catch (error) {
      console.log('Error removing favorite:', error);
    }
  };

  const handleViewVenueDetails = (venue) => {
    navigate(`/venue-details-booking?venueId=${venue?.id}`);
  };

  const handleOpenConversation = (conversation) => {
    console.log('Opening conversation:', conversation);
  };

  const handleMarkAsRead = async (conversation) => {
    try {
      const result = await messageService.markConversationAsRead(conversation?.id, user.id);
      if (result?.success) {
        setConversations(prev => 
          safeMap(prev, conv => 
            conv?.id === conversation?.id 
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );
      }
    } catch (error) {
      console.log('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    console.log('Mark all as read');
  };

  const handleUpdateProfile = async (profileData) => {
    console.log('Profile updated:', profileData);
  };

  const handleChangePassword = (passwordData) => {
    console.log('Password change requested:', passwordData);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deletion requested');
    }
  };

  const handleQuickAction = (action, selectedItems) => {
    console.log('Quick action:', action, selectedItems);
  };

  const handleStatusClick = (status) => {
    setActiveTab('bookings');
  };

  const getStats = () => {
    const bookingsArray = ensureArray(bookings);
    const favoritesArray = ensureArray(favoriteVenues);
    
    return {
      totalBookings: bookingsArray.length,
      upcomingBookings: bookingsArray.filter(b => 
        new Date(b?.date) > new Date() && 
        (b?.status === 'confirmed' || b?.status === 'pending')
      ).length,
      favoriteVenues: favoritesArray.length
    };
  };

  const getUpcomingBookings = () => {
    const bookingsArray = ensureArray(bookings);
    return bookingsArray
      .filter(b => new Date(b?.date) > new Date())
      .sort((a, b) => new Date(a?.date) - new Date(b?.date));
  };

  const getUnreadMessageCount = () => {
    const conversationsArray = ensureArray(conversations);
    return conversationsArray.reduce((sum, conv) => sum + (conv?.unreadCount || 0), 0);
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedNavigation user={userProfile} />
        <div className="container-padding section-spacing">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedNavigation user={userProfile} />
        <div className="container-padding section-spacing">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation user={userProfile} />
      <SearchContextPreserver />
      
      <div className="container-padding section-spacing">
        {/* Welcome Section */}
        <WelcomeSection 
          user={userProfile}
          upcomingBookings={getUpcomingBookings()}
          stats={getStats()}
        />

        {/* Main Content */}
        <div className="lg:flex lg:space-x-8">
          {/* Desktop Sidebar Navigation */}
          <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <TabNavigation 
              activeTab={activeTab}
              onTabChange={handleTabChange}
              unreadMessages={getUnreadMessageCount()}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 lg:min-w-0">
            {/* Mobile Tab Navigation */}
            <div className="lg:hidden">
              <TabNavigation 
                activeTab={activeTab}
                onTabChange={handleTabChange}
                unreadMessages={getUnreadMessageCount()}
              />
            </div>

            {/* Tab Content */}
            <div className="lg:pl-8">
              {activeTab === 'bookings' && (
                <BookingsSection
                  bookings={bookings}
                  onViewDetails={handleViewBookingDetails}
                  onContactVenue={handleContactVenue}
                  onCancelModify={handleCancelModifyBooking}
                />
              )}

              {activeTab === 'favorites' && (
                <FavoritesSection
                  favoriteVenues={favoriteVenues}
                  onQuickBook={handleQuickBook}
                  onRemoveFavorite={handleRemoveFavorite}
                  onViewDetails={handleViewVenueDetails}
                />
              )}

              {activeTab === 'messages' && (
                <MessagesSection
                  conversations={conversations}
                  onOpenConversation={handleOpenConversation}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileSection
                  user={userProfile}
                  onUpdateProfile={handleUpdateProfile}
                  onChangePassword={handleChangePassword}
                  onDeleteAccount={handleDeleteAccount}
                />
              )}
            </div>
          </div>

          {/* Desktop Recent Activity Sidebar */}
          <div className="hidden xl:block xl:w-80 xl:flex-shrink-0">
            <RecentActivityFeed activities={recentActivities} />
          </div>
        </div>

        {/* Mobile Recent Activity */}
        <div className="xl:hidden mt-8">
          <RecentActivityFeed activities={recentActivities} />
        </div>
      </div>

      {/* Global Components */}
      <BookingStatusIndicator 
        userRole={userProfile?.role}
        onStatusClick={handleStatusClick}
      />
      
      <QuickActionMenu
        userRole={userProfile?.role}
        currentScreen="user-dashboard"
        onActionClick={handleQuickAction}
      />
    </div>
  );
};

export default UserDashboard;