# Hall Booker - Venue Booking Platform

A comprehensive venue booking platform built with React, Supabase, and Tailwind CSS. This platform allows customers to discover and book venues, venue owners to manage their properties, and administrators to oversee the entire system.

## 🚀 Features

### For Customers
- **Venue Discovery**: Search and filter venues by location, type, capacity, and amenities
- **Advanced Booking**: Multi-step booking process with payment integration
- **User Dashboard**: Manage bookings, favorites, and messages
- **Reviews & Ratings**: Write and view venue reviews

### For Venue Owners
- **Property Management**: Add and manage venue listings
- **Booking Management**: Accept/reject bookings and manage calendar
- **Analytics Dashboard**: Track performance and revenue
- **Communication**: Message customers and handle inquiries

### For Administrators
- **User Management**: Manage all users and roles
- **Venue Oversight**: Approve, suspend, or manage all venues
- **Booking Monitoring**: Handle disputes and system-wide booking management
- **Analytics**: System-wide metrics and reporting

## 🛠️ Tech Stack

- **Frontend**: React 18 with Hooks, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Context API
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite

## 🏗️ Database Schema

The application uses a comprehensive PostgreSQL schema with:
- **User Management**: Role-based authentication (customer, venue_owner, admin)
- **Venue System**: Detailed venue information with status management
- **Booking System**: Complete booking lifecycle with payment tracking
- **Communication**: Built-in messaging system
- **Activity Logging**: Comprehensive audit trails

## 🔐 Admin Access

### Default Admin Credentials
- **Email**: `admin@hallbooker.com`
- **Password**: `admin123!`

### Admin Test Panel
Access the admin test panel at `/admin-test-panel` to:
- Test admin authentication
- Verify system functionality
- Run comprehensive system tests
- Monitor system health

## 📚 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- NPM or Yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hall-booker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update the Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```

4. **Database Setup**
   - Run the migrations in your Supabase dashboard:
     - `supabase/migrations/20241216120000_hallbooker_initial_schema.sql`
     - `supabase/migrations/20241217120000_add_admin_and_venue_status.sql`
     - `supabase/migrations/20241217150000_add_admin_functions.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```

### Quick Admin Setup

1. **Access the admin test panel**
   - Navigate to `/admin-test-panel` in your browser
   - Click "Quick Setup" to initialize the admin system

2. **Run system tests**
   - Use the test panel to verify all admin functions
   - Check authentication, user management, and system health

3. **Login as admin**
   - Use the default credentials to access admin features
   - Navigate to `/admin-management-panel` for full admin dashboard

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Application Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── admin/          # Admin-specific components
│   └── ui/             # Common UI components
├── pages/              # Application pages
│   ├── admin-management-panel/
│   ├── user-dashboard/
│   ├── venue-discovery-search/
│   └── ...
├── utils/              # Utility functions and services
│   ├── supabase.js     # Supabase client configuration
│   ├── authService.js  # Authentication utilities
│   ├── adminService.js # Admin management functions
│   └── ...
└── contexts/           # React context providers
    └── AuthContext.jsx # Authentication context
```

## 🌟 Key Features

### Enhanced Supabase Integration
- **Connection Monitoring**: Automatic connection health checks
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Retry Logic**: Automatic retry for failed operations
- **Row Level Security**: Database-level security policies

### Admin Management System
- **User Management**: Role-based access control and user administration
- **Venue Oversight**: Comprehensive venue status management
- **System Analytics**: Real-time system metrics and reporting
- **Activity Logging**: Complete audit trail for all system actions

### Authentication System
- **Multi-role Support**: Customer, venue owner, and admin roles
- **Session Management**: Secure session handling with refresh tokens
- **Activity Tracking**: Comprehensive user activity logging
- **Admin Privileges**: Enhanced admin authentication and authorization

## 🧪 Testing

The application includes comprehensive testing utilities:

### Admin Test Panel (`/admin-test-panel`)
- **Authentication Tests**: Verify admin login functionality
- **Dashboard Tests**: Test admin dashboard access
- **User Management Tests**: Verify user management operations
- **Venue Management Tests**: Test venue administration
- **Booking Management Tests**: Verify booking system functionality

### Test Functions
```javascript
// Test admin setup
await testAdminSetup.runAllTests();

// Test individual components
await testAdminSetup.testAdminLogin();
await testAdminSetup.testDashboard();
await testAdminSetup.testUserManagement();
```

## 🔒 Security

- **Row Level Security**: Database-level access control
- **Role-based Authentication**: Multi-tier user permissions
- **Secure Password Storage**: Encrypted password storage
- **Session Management**: Secure session handling with automatic refresh
- **API Key Protection**: Environment-based configuration

## 📊 Analytics & Monitoring

### Admin Dashboard Features
- **User Statistics**: Role-based user metrics
- **Venue Analytics**: Venue performance tracking
- **Booking Metrics**: Revenue and booking statistics
- **System Health**: Real-time system monitoring

### Available Analytics Functions
- `getUserRoleStats()` - User role distribution
- `getVenueAnalytics()` - Comprehensive venue metrics
- `getBookingRevenueStats()` - Revenue tracking
- `getSystemHealthMetrics()` - System health monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the admin test panel for system diagnostics
- Review the console logs for detailed error information
- Use the built-in error handling and retry mechanisms
- Contact the development team for additional support

## 🎯 Next Steps

1. **Test the Admin System**: Use the admin test panel to verify all functionality
2. **Customize Settings**: Adjust configuration for your specific needs
3. **Add Custom Features**: Extend the platform with additional functionality
4. **Deploy to Production**: Configure for production deployment

---

**Ready to get started?** Access the admin test panel at `/admin-test-panel` and run the comprehensive system tests to ensure everything is working correctly!