import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import BookingStatusIndicator from '../../components/ui/BookingStatusIndicator';
import QuickActionMenu from '../../components/ui/QuickActionMenu';

// Import dashboard components
import MetricsCard from './components/MetricsCard';
import PropertyCard from './components/PropertyCard';
import BookingRequestCard from './components/BookingRequestCard';
import CalendarView from './components/CalendarView';
import RevenueChart from './components/RevenueChart';
import MessageCenter from './components/MessageCenter';
import QuickActions from './components/QuickActions';

const VenueOwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Mock user data
  const user = {
    id: 'owner_001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    role: 'venue_owner',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  };

  // Mock metrics data
  const metricsData = [
    {
      title: 'Monthly Revenue',
      value: '$12,450',
      change: '+15.3%',
      changeType: 'positive',
      icon: 'DollarSign',
      color: 'success'
    },
    {
      title: 'Booking Requests',
      value: '23',
      change: '+8 new',
      changeType: 'positive',
      icon: 'Calendar',
      color: 'primary'
    },
    {
      title: 'Occupancy Rate',
      value: '78%',
      change: '+5.2%',
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'warning'
    },
    {
      title: 'Average Rating',
      value: '4.8',
      change: '+0.2',
      changeType: 'positive',
      icon: 'Star',
      color: 'error'
    }
  ];

  // Mock properties data
  const propertiesData = [
    {
      id: 'prop_001',
      name: 'Grand Ballroom',
      location: 'Downtown Manhattan, NY',
      capacity: 200,
      pricePerHour: 150,
      status: 'active',
      monthlyBookings: 12,
      monthlyRevenue: 4800,
      rating: 4.9,
      reviewCount: 45,
      images: [
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop'
      ],
      amenities: ['WiFi', 'Sound System', 'Catering', 'Parking', 'AC', 'Stage']
    },
    {
      id: 'prop_002',
      name: 'Garden Pavilion',
      location: 'Central Park Area, NY',
      capacity: 80,
      pricePerHour: 120,
      status: 'active',
      monthlyBookings: 8,
      monthlyRevenue: 2400,
      rating: 4.7,
      reviewCount: 32,
      images: [
        'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop'
      ],
      amenities: ['Garden View', 'Natural Light', 'Catering', 'Parking']
    },
    {
      id: 'prop_003',
      name: 'Conference Center',
      location: 'Midtown Manhattan, NY',
      capacity: 150,
      pricePerHour: 200,
      status: 'maintenance',
      monthlyBookings: 0,
      monthlyRevenue: 0,
      rating: 4.6,
      reviewCount: 28,
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'
      ],
      amenities: ['AV Equipment', 'WiFi', 'Catering', 'Business Center']
    }
  ];

  // Mock booking requests data
  const bookingRequestsData = [
    {
      id: 'booking_001',
      customerName: 'Michael Chen',
      customerEmail: 'michael.chen@email.com',
      venueName: 'Grand Ballroom',
      eventDate: '2024-02-15',
      startTime: '18:00',
      endTime: '23:00',
      guestCount: 150,
      eventType: 'Wedding Reception',
      totalAmount: 1200,
      status: 'pending',
      specialRequests: 'Need additional lighting setup and floral arrangements',
      requestedAt: '2024-01-20T10:30:00Z'
    },
    {
      id: 'booking_002',
      customerName: 'Emily Rodriguez',
      customerEmail: 'emily.rodriguez@email.com',
      venueName: 'Garden Pavilion',
      eventDate: '2024-02-10',
      startTime: '14:00',
      endTime: '18:00',
      guestCount: 60,
      eventType: 'Corporate Event',
      totalAmount: 800,
      status: 'approved',
      specialRequests: 'Require vegetarian catering options',
      requestedAt: '2024-01-18T14:15:00Z'
    },
    {
      id: 'booking_003',
      customerName: 'David Thompson',
      customerEmail: 'david.thompson@email.com',
      venueName: 'Grand Ballroom',
      eventDate: '2024-02-08',
      startTime: '19:00',
      endTime: '22:00',
      guestCount: 120,
      eventType: 'Birthday Party',
      totalAmount: 900,
      status: 'pending',
      specialRequests: 'Birthday decorations and DJ setup needed',
      requestedAt: '2024-01-19T16:45:00Z'
    }
  ];

  // Mock calendar bookings data
  const calendarBookings = [
    {
      id: 'cal_001',
      customerName: 'Michael Chen',
      venueName: 'Grand Ballroom',
      eventDate: '2024-02-15',
      status: 'pending'
    },
    {
      id: 'cal_002',
      customerName: 'Emily Rodriguez',
      venueName: 'Garden Pavilion',
      eventDate: '2024-02-10',
      status: 'approved'
    },
    {
      id: 'cal_003',
      customerName: 'David Thompson',
      venueName: 'Grand Ballroom',
      eventDate: '2024-02-08',
      status: 'pending'
    }
  ];

  // Mock revenue chart data
  const revenueChartData = [
    { month: 'Jan', revenue: 8500, bookings: 15 },
    { month: 'Feb', revenue: 12450, bookings: 23 },
    { month: 'Mar', revenue: 9800, bookings: 18 },
    { month: 'Apr', revenue: 15200, bookings: 28 },
    { month: 'May', revenue: 11300, bookings: 21 },
    { month: 'Jun', revenue: 13800, bookings: 25 }
  ];

  // Mock messages data
  const messagesData = [
    {
      id: 'msg_001',
      customerName: 'Michael Chen',
      customerEmail: 'michael.chen@email.com',
      subject: 'Question about Grand Ballroom booking',
      preview: 'Hi, I have some questions about the lighting setup...',
      content: `Hi Sarah,\n\nI hope this message finds you well. I have a few questions about my upcoming booking for the Grand Ballroom:\n\n1. Can we arrange for additional lighting setup?\n2. What are the options for floral arrangements?\n3. Is there flexibility with the catering menu?\n\nI'm looking forward to hearing from you.\n\nBest regards,\nMichael Chen`,
      timestamp: '2024-01-20T10:30:00Z',isRead: false,priority: 'urgent',bookingId: 'booking_001',
      hasAttachment: false
    },
    {
      id: 'msg_002',customerName: 'Emily Rodriguez',customerEmail: 'emily.rodriguez@email.com',subject: 'Thank you for the confirmation',preview: 'Thank you for confirming our corporate event booking...',
      content: `Dear Sarah,\n\nThank you for confirming our corporate event booking for the Garden Pavilion. We're excited about the event and appreciate your professionalism.\n\nJust to confirm, we'll need the vegetarian catering options as discussed.\n\nLooking forward to a successful event!\n\nBest regards,\nEmily Rodriguez`,
      timestamp: '2024-01-19T14:15:00Z',isRead: true,priority: 'normal',bookingId: 'booking_002',
      hasAttachment: false
    },
    {
      id: 'msg_003',customerName: 'David Thompson',customerEmail: 'david.thompson@email.com',subject: 'Birthday party setup requirements',preview: 'I wanted to discuss the setup requirements for the birthday party...',
      content: `Hi Sarah,\n\nI wanted to discuss the setup requirements for my daughter's birthday party at the Grand Ballroom.\n\nWe'll need:\n- Birthday decorations (balloons, banners)\n- DJ setup with sound system\n- Special lighting for photos\n\nCould you please let me know if these arrangements are possible?\n\nThanks!\nDavid Thompson`,
      timestamp: '2024-01-18T16:45:00Z',isRead: false,priority: 'high',bookingId: 'booking_003',
      hasAttachment: true
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'properties', label: 'Properties', icon: 'Building2' },
    { id: 'bookings', label: 'Bookings', icon: 'Calendar' },
    { id: 'calendar', label: 'Calendar', icon: 'CalendarDays' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'messages', label: 'Messages', icon: 'MessageSquare' }
  ];

  // Event handlers
  const handlePropertyEdit = (property) => {
    console.log('Edit property:', property);
    // Navigate to property edit page or open modal
  };

  const handlePropertyToggleStatus = (property) => {
    console.log('Toggle property status:', property);
    // Update property status
  };

  const handleViewBookings = (property) => {
    navigate('/booking-management-payment', { 
      state: { propertyId: property.id, propertyName: property.name }
    });
  };

  const handleBookingApprove = (booking) => {
    console.log('Approve booking:', booking);
    // Update booking status to approved
  };

  const handleBookingDecline = (booking) => {
    console.log('Decline booking:', booking);
    // Update booking status to declined
  };

  const handleBookingViewDetails = (booking) => {
    navigate('/booking-management-payment', { 
      state: { bookingId: booking.id }
    });
  };

  const handleCalendarDateClick = (date) => {
    console.log('Calendar date clicked:', date);
    // Open date blocking modal or navigate to booking form
  };

  const handleCalendarBookingClick = (booking) => {
    console.log('Calendar booking clicked:', booking);
    handleBookingViewDetails(booking);
  };

  const handleSendMessage = (messageData) => {
    console.log('Send message:', messageData);
    // Send message via API
  };

  const handleMarkAsRead = (messageId) => {
    console.log('Mark message as read:', messageId);
    // Update message read status
  };

  const handleQuickAction = (action) => {
    console.log('Quick action:', action);
    switch (action.id) {
      case 'add-property':
        // Navigate to add property page
        break;
      case 'block-dates': setActiveTab('calendar');
        break;
      case 'update-pricing': setActiveTab('properties');
        break;
      case 'respond-bookings': setActiveTab('bookings');
        break;
      case 'view-analytics': setActiveTab('analytics');
        break;
      case 'manage-photos': setActiveTab('properties');
        break;
      default:
        break;
    }
  };

  const handleStatusClick = (status) => {
    console.log('Status clicked:', status);
    setActiveTab('bookings');
  };

  const handleQuickActionMenuClick = (action, selectedVenues) => {
    console.log('Quick action menu:', action, selectedVenues);
    handleQuickAction(action);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metricsData.map((metric, index) => (
                <MetricsCard
                  key={index}
                  title={metric.title}
                  value={metric.value}
                  change={metric.change}
                  changeType={metric.changeType}
                  icon={metric.icon}
                  color={metric.color}
                />
              ))}
            </div>

            {/* Recent Activity and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-surface border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">Recent Bookings</h3>
                    <Button
                      variant="ghost"
                      iconName="ArrowRight"
                      iconSize={14}
                      onClick={() => setActiveTab('bookings')}
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {bookingRequestsData.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-text-primary">{booking.customerName}</p>
                          <p className="text-xs text-text-secondary">{booking.venueName} • {new Date(booking.eventDate).toLocaleDateString()}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                          booking.status === 'pending' ? 'bg-warning-100 text-warning-700 border-warning-200' :
                          booking.status === 'approved'? 'bg-success-100 text-success-700 border-success-200' : 'bg-error-100 text-error-700 border-error-200'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <RevenueChart 
                  data={revenueChartData} 
                  chartType="bar" 
                  title="Monthly Performance" 
                />
              </div>

              <QuickActions onAction={handleQuickAction} />
            </div>
          </div>
        );

      case 'properties':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-text-primary">Properties</h2>
                <p className="text-text-secondary">Manage your venue listings</p>
              </div>
              <Button
                variant="primary"
                iconName="Plus"
                iconSize={16}
                onClick={() => handleQuickAction({ id: 'add-property' })}
              >
                Add Property
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertiesData.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onEdit={handlePropertyEdit}
                  onToggleStatus={handlePropertyToggleStatus}
                  onViewBookings={handleViewBookings}
                />
              ))}
            </div>
          </div>
        );

      case 'bookings':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-text-primary">Booking Requests</h2>
                <p className="text-text-secondary">Review and manage booking requests</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" iconName="Filter" iconSize={16}>
                  Filter
                </Button>
                <Button variant="outline" iconName="Download" iconSize={16}>
                  Export
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {bookingRequestsData.map((booking) => (
                <BookingRequestCard
                  key={booking.id}
                  booking={booking}
                  onApprove={handleBookingApprove}
                  onDecline={handleBookingDecline}
                  onViewDetails={handleBookingViewDetails}
                />
              ))}
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-text-primary">Calendar</h2>
                <p className="text-text-secondary">View and manage bookings calendar</p>
              </div>
            </div>

            <CalendarView
              bookings={calendarBookings}
              onDateClick={handleCalendarDateClick}
              onBookingClick={handleCalendarBookingClick}
            />
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-text-primary">Analytics</h2>
                <p className="text-text-secondary">Track your business performance</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" iconName="Calendar" iconSize={16}>
                  Date Range
                </Button>
                <Button variant="outline" iconName="Download" iconSize={16}>
                  Export Report
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart 
                data={revenueChartData} 
                chartType="line" 
                title="Revenue Trend" 
              />
              <RevenueChart 
                data={revenueChartData} 
                chartType="bar" 
                title="Booking Volume" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metricsData.map((metric, index) => (
                <MetricsCard
                  key={index}
                  title={metric.title}
                  value={metric.value}
                  change={metric.change}
                  changeType={metric.changeType}
                  icon={metric.icon}
                  color={metric.color}
                />
              ))}
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-text-primary">Messages</h2>
                <p className="text-text-secondary">Communicate with your customers</p>
              </div>
            </div>

            <MessageCenter
              messages={messagesData}
              onSendMessage={handleSendMessage}
              onMarkAsRead={handleMarkAsRead}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation 
        user={user} 
        onNavigate={(path) => navigate(path)}
      />

      <div className="container-padding section-spacing">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-text-primary mb-2">
                Welcome back, {user.name}
              </h1>
              <p className="text-text-secondary">
                Manage your venues and track your business performance
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Bell"
                iconSize={16}
                className="relative"
              >
                <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button
                variant="primary"
                iconName="Plus"
                iconSize={16}
                onClick={() => handleQuickAction({ id: 'add-property' })}
              >
                Add Property
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-border">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-secondary-300'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                  {tab.id === 'messages' && messagesData.filter(m => !m.isRead).length > 0 && (
                    <span className="bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {messagesData.filter(m => !m.isRead).length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Floating Components */}
      <BookingStatusIndicator 
        userRole={user.role}
        onStatusClick={handleStatusClick}
      />
      
      <QuickActionMenu
        userRole={user.role}
        currentScreen="venue-owner-dashboard"
        selectedVenues={selectedProperties}
        onActionClick={handleQuickActionMenuClick}
      />
    </div>
  );
};

export default VenueOwnerDashboard;