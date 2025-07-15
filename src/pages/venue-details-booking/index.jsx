import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RoleBasedNavigation from '../../components/ui/RoleBasedNavigation';
import BookingStatusIndicator from '../../components/ui/BookingStatusIndicator';
import SearchContextPreserver from '../../components/ui/SearchContextPreserver';
import QuickActionMenu from '../../components/ui/QuickActionMenu';
import VenueGallery from './components/VenueGallery';
import VenueInfo from './components/VenueInfo';
import AvailabilityCalendar from './components/AvailabilityCalendar';
import BookingWidget from './components/BookingWidget';
import ReviewsSection from './components/ReviewsSection';
import ContactVenueOwner from './components/ContactVenueOwner';

const VenueDetailsBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data - in real app this would come from authentication context
  const currentUser = {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    role: "customer"
  };

  // Mock venue data
  const venue = {
    id: 1,
    name: "Grand Ballroom at The Heritage Hotel",
    location: "Downtown Manhattan, New York",
    fullAddress: "123 Heritage Avenue, Manhattan, NY 10001",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    capacity: 200,
    floorArea: 2500,
    ceilingHeight: 12,
    setupStyle: "Flexible (Theater, Banquet, Cocktail)",
    basePrice: 150,
    minimumHours: 4,
    securityDeposit: 500,
    cleaningFee: 200,
    rating: 4.8,
    reviewCount: 127,
    description: `Experience elegance and sophistication at our Grand Ballroom, featuring stunning crystal chandeliers, hardwood floors, and floor-to-ceiling windows with city views. Perfect for weddings, corporate events, galas, and special celebrations. Our dedicated event team ensures every detail is perfect for your memorable occasion.`,
    amenities: [
      'WiFi', 'Parking', 'Air Conditioning', 'Sound System', 'Projector',
      'Kitchen', 'Bar', 'Dance Floor', 'Stage', 'Catering',
      'Security', 'Wheelchair Access'
    ],
    allowedActivities: [
      'Weddings', 'Corporate Events', 'Birthday Parties', 'Anniversaries',
      'Graduations', 'Holiday Parties', 'Fundraisers', 'Product Launches'
    ],
    restrictions: [
      'No smoking indoors', 'No pets allowed', 'Music must end by 11 PM',
      'No outside alcohol', 'Maximum occupancy strictly enforced'
    ],
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&h=600&fit=crop"
    ]
  };

  // Mock venue owner data
  const venueOwner = {
    id: 1,
    name: "Michael Thompson",
    title: "Event Manager",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 4.9,
    responseTime: "2 hours",
    responseRate: 98,
    totalBookings: 450,
    yearsExperience: 8,
    phone: "+1 (555) 123-4567",
    email: "michael.thompson@heritagehotel.com"
  };

  // Mock availability data
  const availability = {
    '2024-12-20': { status: 'available' },
    '2024-12-21': { status: 'booked' },
    '2024-12-22': { status: 'available' },
    '2024-12-23': { status: 'blocked' },
    '2024-12-24': { status: 'available' },
    '2024-12-25': { status: 'booked' },
    '2024-12-26': { status: 'available', partiallyBooked: true },
    '2024-12-27': { status: 'available' },
    '2024-12-28': { status: 'available' },
    '2024-12-29': { status: 'booked' },
    '2024-12-30': { status: 'available' },
    '2024-12-31': { status: 'booked' }
  };

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      userName: "Emily Rodriguez",
      userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      date: "2024-11-15",
      eventType: "Wedding",
      content: `Absolutely stunning venue! The Grand Ballroom exceeded all our expectations for our wedding reception. The crystal chandeliers created such a romantic atmosphere, and the staff was incredibly professional and attentive throughout the entire event. Michael was amazing to work with - he made sure every detail was perfect. Our guests are still talking about how beautiful the venue was. Highly recommend!`,
      photos: [
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=200&h=200&fit=crop"
      ],
      helpfulCount: 12,
      ownerResponse: {
        date: "2024-11-16",
        content: "Thank you so much for the wonderful review, Emily! It was our pleasure to be part of your special day. We're thrilled that everything exceeded your expectations and that your guests had such a memorable experience."
      }
    },
    {
      id: 2,
      userName: "David Chen",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      date: "2024-10-28",
      eventType: "Corporate Event",
      content: `Perfect venue for our company's annual gala. The space is elegant and sophisticated, exactly what we needed for our 150 guests. The sound system worked flawlessly for our presentations, and the catering options were excellent. The location is convenient with great parking. Will definitely book again for future events.`,
      photos: [],
      helpfulCount: 8
    },
    {
      id: 3,
      userName: "Lisa Park",
      userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 4,
      date: "2024-10-10",
      eventType: "Birthday Party",
      content: `Great venue with beautiful decor and excellent service. The only minor issue was that the music had to end earlier than expected due to noise restrictions, but overall it was a fantastic experience. The staff was very accommodating and helped make the party special.`,
      photos: [
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=200&h=200&fit=crop"
      ],
      helpfulCount: 5
    }
  ];

  // Mock search context from URL params
  const searchParams = new URLSearchParams(location.search);
  const searchContext = {
    query: searchParams.get('query') || 'ballroom',
    location: searchParams.get('location') || 'Manhattan',
    date: searchParams.get('date') || '',
    guests: searchParams.get('guests') || '150',
    totalResults: parseInt(searchParams.get('totalResults')) || 24
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'availability', label: 'Availability', icon: 'Calendar' },
    { id: 'reviews', label: 'Reviews', icon: 'Star' },
    { id: 'contact', label: 'Contact', icon: 'MessageSquare' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setActiveTab('overview');
  };

  const handleBookingSubmit = (bookingData) => {
    console.log('Booking submitted:', bookingData);
    setIsBookingConfirmed(true);
    
    // Simulate booking confirmation
    setTimeout(() => {
      navigate('/booking-management-payment', { 
        state: { 
          bookingData,
          confirmationNumber: 'HB' + Date.now().toString().slice(-6)
        }
      });
    }, 2000);
  };

  const handleMessageSent = (messageData) => {
    console.log('Message sent:', messageData);
    // Show success notification or handle message sent
  };

  const handleQuickAction = (action, selectedVenues) => {
    console.log('Quick action:', action, selectedVenues);
    
    switch (action.id) {
      case 'save-venue':
        // Handle save venue
        break;
      case 'share-venue':
        // Handle share venue
        if (navigator.share) {
          navigator.share({
            title: venue.name,
            text: `Check out this amazing venue: ${venue.name}`,
            url: window.location.href
          });
        }
        break;
      case 'compare-venues':
        // Handle compare venues
        break;
      default:
        break;
    }
  };

  const handleStatusClick = (status) => {
    navigate('/booking-management-payment');
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation 
        user={currentUser} 
        onNavigate={handleNavigation}
      />
      
      <SearchContextPreserver 
        searchParams={searchContext}
        onBackToSearch={() => navigate('/venue-discovery-search')}
      />

      <div className="container-padding section-spacing">
        {/* Mobile Back Button */}
        <div className="md:hidden mb-4">
          <Button
            variant="ghost"
            iconName="ArrowLeft"
            iconPosition="left"
            onClick={() => navigate('/venue-discovery-search')}
          >
            Back to Search
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Venue Gallery */}
            <div className="mb-8">
              <VenueGallery images={venue.images} venueName={venue.name} />
            </div>

            {/* Mobile Tabs */}
            <div className="lg:hidden mb-6">
              <div className="flex space-x-1 bg-surface-secondary rounded-lg p-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-surface text-primary shadow-sm'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {(activeTab === 'overview' || window.innerWidth >= 1024) && (
                <div className="lg:block">
                  <VenueInfo venue={venue} />
                </div>
              )}

              {(activeTab === 'availability' || window.innerWidth >= 1024) && (
                <div className="lg:block">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-text-primary mb-4">Availability Calendar</h2>
                    <AvailabilityCalendar
                      availability={availability}
                      selectedDate={selectedDate}
                      onDateSelect={handleDateSelect}
                    />
                  </div>
                </div>
              )}

              {(activeTab === 'reviews' || window.innerWidth >= 1024) && (
                <div className="lg:block">
                  <ReviewsSection
                    reviews={reviews}
                    overallRating={venue.rating}
                    totalReviews={venue.reviewCount}
                  />
                </div>
              )}

              {(activeTab === 'contact' || window.innerWidth >= 1024) && (
                <div className="lg:block">
                  <ContactVenueOwner
                    venueOwner={venueOwner}
                    venue={venue}
                    onMessageSent={handleMessageSent}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <BookingWidget
                venue={venue}
                selectedDate={selectedDate}
                onBookingSubmit={handleBookingSubmit}
              />

              {/* Desktop Contact Card */}
              <div className="hidden lg:block">
                <ContactVenueOwner
                  venueOwner={venueOwner}
                  venue={venue}
                  onMessageSent={handleMessageSent}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {isBookingConfirmed && (
        <div className="fixed inset-0 z-500 bg-surface/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={32} color="var(--color-success)" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Booking Request Sent!
            </h3>
            <p className="text-text-secondary mb-6">
              Your booking request has been sent to the venue owner. You'll receive a confirmation email shortly.
            </p>
            <div className="animate-pulse">
              <div className="h-2 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      <BookingStatusIndicator 
        userRole={currentUser.role}
        onStatusClick={handleStatusClick}
      />

      <QuickActionMenu
        userRole={currentUser.role}
        currentScreen="venue-details-booking"
        selectedVenues={[venue]}
        onActionClick={handleQuickAction}
      />
    </div>
  );
};

export default VenueDetailsBooking;