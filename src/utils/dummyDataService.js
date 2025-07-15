// Dummy Data Service for Hall Booking Web App Testing
// This service provides comprehensive test data for venue owners and admin flows

export const dummyDataService = {
  // Admin Users
  adminUsers: [
    {
      id: 'admin-001',
      email: 'admin@hallbooker.com',
      full_name: 'Sarah Thompson',
      phone: '+1-555-0101',
      location: 'New York, NY',
      role: 'admin',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=faces',
      preferences: {
        emailNotifications: true,
        smsNotifications: true,
        marketingEmails: false
      },
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'admin-002',
      email: 'superadmin@hallbooker.com',
      full_name: 'Michael Rodriguez',
      phone: '+1-555-0102',
      location: 'Los Angeles, CA',
      role: 'admin',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
      preferences: {
        emailNotifications: true,
        smsNotifications: true,
        marketingEmails: true
      },
      created_at: '2024-01-01T00:00:00Z'
    }
  ],

  // Venue Owner Users
  venueOwners: [
    {
      id: 'owner-001',
      email: 'owner.chen@example.com',
      full_name: 'David Chen',
      phone: '+1-555-0201',
      location: 'Manhattan, NY',
      role: 'venue_owner',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
      preferences: {
        emailNotifications: true,
        smsNotifications: true,
        marketingEmails: true
      },
      created_at: '2024-01-15T00:00:00Z'
    },
    {
      id: 'owner-002',
      email: 'owner.williams@example.com',
      full_name: 'Emily Williams',
      phone: '+1-555-0202',
      location: 'Brooklyn, NY',
      role: 'venue_owner',
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: true
      },
      created_at: '2024-01-20T00:00:00Z'
    },
    {
      id: 'owner-003',
      email: 'owner.johnson@example.com',
      full_name: 'Robert Johnson',
      phone: '+1-555-0203',
      location: 'Queens, NY',
      role: 'venue_owner',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
      preferences: {
        emailNotifications: true,
        smsNotifications: true,
        marketingEmails: false
      },
      created_at: '2024-02-01T00:00:00Z'
    }
  ],

  // Customer Users
  customers: [
    {
      id: 'customer-001',
      email: 'sarah.jones@example.com',
      full_name: 'Sarah Jones',
      phone: '+1-555-0301',
      location: 'Manhattan, NY',
      role: 'customer',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=faces',
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: true
      },
      created_at: '2024-02-10T00:00:00Z'
    },
    {
      id: 'customer-002',
      email: 'james.brown@example.com',
      full_name: 'James Brown',
      phone: '+1-555-0302',
      location: 'Brooklyn, NY',
      role: 'customer',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
      preferences: {
        emailNotifications: true,
        smsNotifications: true,
        marketingEmails: false
      },
      created_at: '2024-02-15T00:00:00Z'
    }
  ],

  // Venues Data
  venues: [
    {
      id: 'venue-001',
      owner_id: 'owner-001',
      name: 'Grand Crystal Ballroom',
      description: 'Luxurious ballroom with crystal chandeliers, marble floors, and stunning city views. Perfect for weddings, galas, and corporate events. Features state-of-the-art lighting and sound systems.',
      venue_type: 'banquet_hall',
      location: 'Manhattan, NY',
      address: '123 Park Avenue, New York, NY 10016',
      capacity: 400,
      price_per_hour: 850.00,
      original_price: 950.00,
      amenities: ['WiFi', 'Parking', 'Kitchen', 'Sound System', 'Air Conditioning', 'Lighting', 'Security', 'Catering'],
      images: [
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=800&h=600&fit=crop'
      ],
      rating: 4.8,
      review_count: 156,
      is_active: true,
      created_at: '2024-01-15T00:00:00Z'
    },
    {
      id: 'venue-002',
      owner_id: 'owner-001',
      name: 'Executive Conference Center',
      description: 'Modern conference facility with panoramic windows, advanced AV equipment, and flexible seating arrangements. Ideal for corporate meetings, seminars, and business presentations.',
      venue_type: 'conference_room',
      location: 'Manhattan, NY',
      address: '456 Madison Avenue, New York, NY 10022',
      capacity: 120,
      price_per_hour: 320.00,
      original_price: null,
      amenities: ['WiFi', 'Projector', 'Catering', 'Parking', 'Video Conferencing', 'Whiteboard'],
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop'
      ],
      rating: 4.6,
      review_count: 89,
      is_active: true,
      created_at: '2024-01-20T00:00:00Z'
    },
    {
      id: 'venue-003',
      owner_id: 'owner-002',
      name: 'Riverside Pavilion',
      description: 'Elegant outdoor pavilion with breathtaking river views and lush garden surroundings. Perfect for weddings, garden parties, and outdoor celebrations with natural beauty.',
      venue_type: 'outdoor_venue',
      location: 'Brooklyn, NY',
      address: '789 Riverside Drive, Brooklyn, NY 11201',
      capacity: 250,
      price_per_hour: 450.00,
      original_price: null,
      amenities: ['Outdoor Space', 'Garden', 'Catering', 'Photography', 'Tent Option', 'Parking'],
      images: [
        'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop'
      ],
      rating: 4.7,
      review_count: 124,
      is_active: true,
      created_at: '2024-01-25T00:00:00Z'
    },
    {
      id: 'venue-004',
      owner_id: 'owner-002',
      name: 'Historic Brownstone Hall',
      description: 'Charming historic brownstone with original architecture, hardwood floors, and vintage fixtures. Offers an intimate setting for small gatherings, receptions, and private events.',
      venue_type: 'historic_building',
      location: 'Brooklyn, NY',
      address: '321 Heritage Street, Brooklyn, NY 11215',
      capacity: 80,
      price_per_hour: 275.00,
      original_price: 325.00,
      amenities: ['WiFi', 'Kitchen', 'Fireplace', 'Piano', 'Parking'],
      images: [
        'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
      ],
      rating: 4.5,
      review_count: 67,
      is_active: true,
      created_at: '2024-02-01T00:00:00Z'
    },
    {
      id: 'venue-005',
      owner_id: 'owner-003',
      name: 'Skyline Rooftop Venue',
      description: 'Stunning rooftop venue with 360-degree city skyline views. Features modern amenities, retractable roof, and sophisticated ambiance perfect for upscale events and celebrations.',
      venue_type: 'rooftop_venue',
      location: 'Queens, NY',
      address: '654 Skyline Boulevard, Queens, NY 11101',
      capacity: 180,
      price_per_hour: 520.00,
      original_price: null,
      amenities: ['WiFi', 'Bar', 'City Views', 'Heating', 'Catering', 'Photography', 'Parking'],
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800&h=600&fit=crop'
      ],
      rating: 4.9,
      review_count: 93,
      is_active: true,
      created_at: '2024-02-05T00:00:00Z'
    },
    {
      id: 'venue-006',
      owner_id: 'owner-003',
      name: 'Community Arts Center',
      description: 'Versatile community center with multiple rooms, stage area, and flexible layout options. Great for workshops, performances, meetings, and community events.',
      venue_type: 'community_center',
      location: 'Queens, NY',
      address: '987 Community Way, Queens, NY 11368',
      capacity: 150,
      price_per_hour: 180.00,
      original_price: 220.00,
      amenities: ['WiFi', 'Stage', 'Sound System', 'Kitchen', 'Parking', 'Accessibility'],
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
      ],
      rating: 4.4,
      review_count: 45,
      is_active: true,
      created_at: '2024-02-10T00:00:00Z'
    }
  ],

  // Bookings Data
  bookings: [
    {
      id: 'booking-001',
      booking_reference: 'HB240001',
      customer_id: 'customer-001',
      venue_id: 'venue-001',
      event_date: '2024-03-15',
      start_time: '18:00',
      end_time: '23:00',
      guest_count: 200,
      event_type: 'Wedding Reception',
      total_amount: 4250.00,
      status: 'confirmed',
      special_requests: 'Need special lighting for photography, vegetarian menu options, and late checkout',
      created_at: '2024-02-01T10:30:00Z'
    },
    {
      id: 'booking-002',
      booking_reference: 'HB240002',
      customer_id: 'customer-002',
      venue_id: 'venue-002',
      event_date: '2024-02-28',
      start_time: '09:00',
      end_time: '17:00',
      guest_count: 85,
      event_type: 'Corporate Training',
      total_amount: 2560.00,
      status: 'pending',
      special_requests: 'Require video conferencing setup and catered lunch for 85 people',
      created_at: '2024-02-15T14:20:00Z'
    },
    {
      id: 'booking-003',
      booking_reference: 'HB240003',
      customer_id: 'customer-001',
      venue_id: 'venue-003',
      event_date: '2024-04-20',
      start_time: '15:00',
      end_time: '20:00',
      guest_count: 150,
      event_type: 'Birthday Party',
      total_amount: 2250.00,
      status: 'confirmed',
      special_requests: 'Outdoor setup with tent in case of weather, DJ equipment needed',
      created_at: '2024-02-10T09:15:00Z'
    },
    {
      id: 'booking-004',
      booking_reference: 'HB240004',
      customer_id: 'customer-002',
      venue_id: 'venue-005',
      event_date: '2024-01-25',
      start_time: '19:00',
      end_time: '23:00',
      guest_count: 120,
      event_type: 'Company Holiday Party',
      total_amount: 2080.00,
      status: 'completed',
      special_requests: 'Bar service and city view setup for photos',
      created_at: '2024-01-05T16:45:00Z'
    },
    {
      id: 'booking-005',
      booking_reference: 'HB240005',
      customer_id: 'customer-001',
      venue_id: 'venue-004',
      event_date: '2024-02-10',
      start_time: '14:00',
      end_time: '18:00',
      guest_count: 50,
      event_type: 'Anniversary Celebration',
      total_amount: 1100.00,
      status: 'cancelled',
      special_requests: 'Intimate setting with piano music',
      created_at: '2024-01-20T11:30:00Z'
    }
  ],

  // Messages Data
  messages: [
    {
      id: 'message-001',
      sender_id: 'customer-001',
      recipient_id: 'owner-001',
      booking_id: 'booking-001',
      subject: 'Wedding lighting requirements',
      content: 'Hi David! I wanted to discuss the lighting setup for our wedding reception. We need special romantic lighting for the ceremony area and brighter lighting for the dinner area. Can you arrange this?',
      priority: 'normal',
      is_read: false,
      created_at: '2024-02-16T10:30:00Z'
    },
    {
      id: 'message-002',
      sender_id: 'owner-001',
      recipient_id: 'customer-001',
      booking_id: 'booking-001',
      subject: 'Re: Wedding lighting requirements',
      content: 'Hello Sarah! Absolutely, we can arrange the lighting exactly as you need. Our lighting technician will contact you this week to discuss the specific setup. Congratulations on your upcoming wedding!',
      priority: 'normal',
      is_read: true,
      created_at: '2024-02-16T14:15:00Z'
    },
    {
      id: 'message-003',
      sender_id: 'customer-002',
      recipient_id: 'owner-002',
      booking_id: 'booking-002',
      subject: 'Corporate training catering options',
      content: 'Hi Emily, for our upcoming corporate training event, we need catering for 85 people. Do you have partnerships with catering companies that offer healthy lunch options?',
      priority: 'high',
      is_read: false,
      created_at: '2024-02-17T09:20:00Z'
    },
    {
      id: 'message-004',
      sender_id: 'admin-001',
      recipient_id: 'owner-001',
      booking_id: null,
      subject: 'Venue compliance check',
      content: 'Hello David, this is a routine check to ensure all your venues meet our safety and quality standards. Please provide updated insurance certificates and safety inspection reports.',
      priority: 'urgent',
      is_read: true,
      created_at: '2024-02-15T08:00:00Z'
    },
    {
      id: 'message-005',
      sender_id: 'owner-003',
      recipient_id: 'admin-001',
      booking_id: null,
      subject: 'New venue approval request',
      content: 'Hi Sarah, I would like to add a new rooftop venue to my portfolio. I have completed all the documentation and safety inspections. Please review for approval.',
      priority: 'normal',
      is_read: false,
      created_at: '2024-02-18T13:45:00Z'
    }
  ],

  // Reviews Data
  reviews: [
    {
      id: 'review-001',
      booking_id: 'booking-004',
      venue_id: 'venue-005',
      customer_id: 'customer-002',
      rating: 5,
      comment: 'Absolutely stunning venue! The city views were breathtaking and the staff was incredibly professional. Our company event was a huge success thanks to the perfect ambiance.',
      created_at: '2024-01-27T20:30:00Z'
    },
    {
      id: 'review-002',
      booking_id: 'booking-003',
      venue_id: 'venue-003',
      customer_id: 'customer-001',
      rating: 5,
      comment: 'The riverside pavilion exceeded our expectations! The garden setting was magical for our birthday celebration. Emily, the owner, was so helpful throughout the planning process.',
      created_at: '2024-04-22T16:15:00Z'
    }
  ],

  // Activity Logs Data
  activityLogs: [
    {
      id: 'activity-001',
      user_id: 'customer-001',
      activity_type: 'booking_created',
      description: 'New booking created for Grand Crystal Ballroom',
      metadata: { booking_id: 'booking-001', venue_name: 'Grand Crystal Ballroom' },
      created_at: '2024-02-01T10:30:00Z'
    },
    {
      id: 'activity-002',
      user_id: 'owner-001',
      activity_type: 'booking_confirmed',
      description: 'Booking confirmed for Grand Crystal Ballroom',
      metadata: { booking_id: 'booking-001', customer_name: 'Sarah Jones' },
      created_at: '2024-02-01T11:45:00Z'
    },
    {
      id: 'activity-003',
      user_id: 'admin-001',
      activity_type: 'venue_approved',
      description: 'New venue approved for owner David Chen',
      metadata: { venue_id: 'venue-002', venue_name: 'Executive Conference Center' },
      created_at: '2024-01-20T14:30:00Z'
    },
    {
      id: 'activity-004',
      user_id: 'customer-002',
      activity_type: 'review_submitted',
      description: 'Review submitted for Skyline Rooftop Venue',
      metadata: { venue_id: 'venue-005', rating: 5 },
      created_at: '2024-01-27T20:30:00Z'
    }
  ],

  // Dashboard Statistics for Admin
  adminStats: {
    totalUsers: 247,
    totalVenues: 156,
    totalBookings: 1847,
    totalRevenue: 284750.00,
    monthlyGrowth: 12.5,
    pendingApprovals: 8,
    activeVenueOwners: 89,
    averageRating: 4.6,
    topPerformingVenues: [
      { id: 'venue-001', name: 'Grand Crystal Ballroom', bookings: 34, revenue: 45280.00 },
      { id: 'venue-005', name: 'Skyline Rooftop Venue', bookings: 28, revenue: 38760.00 },
      { id: 'venue-003', name: 'Riverside Pavilion', bookings: 31, revenue: 36450.00 }
    ],
    recentActivity: [
      { type: 'booking', description: 'New booking at Grand Crystal Ballroom', timestamp: '2 hours ago' },
      { type: 'venue', description: 'New venue added by Emily Williams', timestamp: '4 hours ago' },
      { type: 'review', description: '5-star review for Riverside Pavilion', timestamp: '6 hours ago' }
    ]
  },

  // Dashboard Statistics for Venue Owners
  venueOwnerStats: {
    'owner-001': {
      totalVenues: 2,
      totalBookings: 45,
      totalRevenue: 67340.00,
      averageRating: 4.7,
      monthlyRevenue: 12450.00,
      pendingBookings: 3,
      confirmedBookings: 8,
      upcomingEvents: [
        { date: '2024-03-15', venue: 'Grand Crystal Ballroom', event: 'Wedding Reception' },
        { date: '2024-02-28', venue: 'Executive Conference Center', event: 'Corporate Training' }
      ]
    },
    'owner-002': {
      totalVenues: 2,
      totalBookings: 28,
      totalRevenue: 43280.00,
      averageRating: 4.6,
      monthlyRevenue: 8750.00,
      pendingBookings: 1,
      confirmedBookings: 5,
      upcomingEvents: [
        { date: '2024-04-20', venue: 'Riverside Pavilion', event: 'Birthday Party' }
      ]
    },
    'owner-003': {
      totalVenues: 2,
      totalBookings: 18,
      totalRevenue: 28950.00,
      averageRating: 4.65,
      monthlyRevenue: 6200.00,
      pendingBookings: 0,
      confirmedBookings: 3,
      upcomingEvents: []
    }
  },

  // Utility functions for testing different scenarios
  getVenuesByOwner(ownerId) {
    return this.venues.filter(venue => venue.owner_id === ownerId);
  },

  getBookingsByVenue(venueId) {
    return this.bookings.filter(booking => booking.venue_id === venueId);
  },

  getBookingsByCustomer(customerId) {
    return this.bookings.filter(booking => booking.customer_id === customerId);
  },

  getMessagesByUser(userId) {
    return this.messages.filter(message => 
      message.sender_id === userId || message.recipient_id === userId
    );
  },

  getReviewsByVenue(venueId) {
    return this.reviews.filter(review => review.venue_id === venueId);
  },

  getActivityLogsByUser(userId) {
    return this.activityLogs.filter(log => log.user_id === userId);
  },

  // Generate test scenario data
  generateTestScenarios() {
    return {
      // Venue Owner Flow Test Data
      venueOwnerFlow: {
        user: this.venueOwners[0], // David Chen
        venues: this.getVenuesByOwner('owner-001'),
        bookings: this.bookings.filter(b => 
          this.getVenuesByOwner('owner-001').some(v => v.id === b.venue_id)
        ),
        messages: this.getMessagesByUser('owner-001'),
        stats: this.venueOwnerStats['owner-001']
      },

      // Admin Flow Test Data
      adminFlow: {
        user: this.adminUsers[0], // Sarah Thompson
        allVenues: this.venues,
        allBookings: this.bookings,
        allUsers: [...this.adminUsers, ...this.venueOwners, ...this.customers],
        pendingApprovals: this.venues.filter(v => v.is_active === false),
        systemMessages: this.messages.filter(m => 
          m.sender_id.startsWith('admin-') || m.recipient_id.startsWith('admin-')
        ),
        stats: this.adminStats
      },

      // Multi-venue Owner Test Data
      multiVenueOwnerFlow: {
        user: this.venueOwners[1], // Emily Williams
        venues: this.getVenuesByOwner('owner-002'),
        bookings: this.bookings.filter(b => 
          this.getVenuesByOwner('owner-002').some(v => v.id === b.venue_id)
        ),
        messages: this.getMessagesByUser('owner-002'),
        stats: this.venueOwnerStats['owner-002']
      }
    };
  },

  // Login credentials for testing
  testCredentials: {
    admin: {
      email: 'admin@hallbooker.com',
      password: 'admin123',
      role: 'admin'
    },
    venueOwner: {
      email: 'owner.chen@example.com',
      password: 'owner123',
      role: 'venue_owner'
    },
    customer: {
      email: 'sarah.jones@example.com',
      password: 'customer123',
      role: 'customer'
    }
  }
};

export default dummyDataService;