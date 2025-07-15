import supabase from './supabase';
import adminService from './adminService';
import enhancedAuthService from './enhancedAuthService';

/**
 * Admin Setup and Testing Utility
 * This file provides functions to set up and test admin functionality
 */

const testAdminSetup = {
  // Test admin user credentials
  adminCredentials: {
    email: 'admin@hallbooker.com',
    password: 'admin123!',
    fullName: 'Hall Booker Admin'
  },

  // Test existing admin user login
  async testAdminLogin() {
    try {
      console.log('🔐 Testing admin login...');
      
      const result = await enhancedAuthService.adminLogin(
        this.adminCredentials.email,
        this.adminCredentials.password
      );

      if (result.success) {
        console.log('✅ Admin login successful!');
        console.log('Admin User ID:', result.data.user.id);
        console.log('Admin Email:', result.data.user.email);
        
        // Test admin privileges
        const privilegesResult = await enhancedAuthService.checkAdminPrivileges(result.data.user.id);
        console.log('Admin Privileges:', privilegesResult.data);
        
        return { success: true, user: result.data.user, privileges: privilegesResult.data };
      } else {
        console.error('❌ Admin login failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Admin login test failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Test admin dashboard data access
  async testAdminDashboard() {
    try {
      console.log('📊 Testing admin dashboard access...');
      
      const dashboardData = await adminService.getDashboardMetrics();
      
      if (dashboardData.success) {
        console.log('✅ Dashboard data access successful!');
        console.log('Dashboard Metrics:', dashboardData.data);
        return { success: true, data: dashboardData.data };
      } else {
        console.error('❌ Dashboard access failed:', dashboardData.error);
        return { success: false, error: dashboardData.error };
      }
    } catch (error) {
      console.error('❌ Dashboard test failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Test admin user management
  async testUserManagement() {
    try {
      console.log('👥 Testing user management...');
      
      const usersResult = await adminService.getAllUsers(1, 10);
      
      if (usersResult.success) {
        console.log('✅ User management access successful!');
        console.log('Users found:', usersResult.data?.length || 0);
        return { success: true, users: usersResult.data };
      } else {
        console.error('❌ User management failed:', usersResult.error);
        return { success: false, error: usersResult.error };
      }
    } catch (error) {
      console.error('❌ User management test failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Test venue management
  async testVenueManagement() {
    try {
      console.log('🏢 Testing venue management...');
      
      const venueStats = await adminService.getVenueStats();
      
      if (venueStats.success) {
        console.log('✅ Venue management access successful!');
        console.log('Venue Statistics:', venueStats.data);
        return { success: true, stats: venueStats.data };
      } else {
        console.error('❌ Venue management failed:', venueStats.error);
        return { success: false, error: venueStats.error };
      }
    } catch (error) {
      console.error('❌ Venue management test failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Test booking management
  async testBookingManagement() {
    try {
      console.log('📅 Testing booking management...');
      
      const bookingsResult = await adminService.getAllBookings(1, 10);
      
      if (bookingsResult.success) {
        console.log('✅ Booking management access successful!');
        console.log('Bookings found:', bookingsResult.data?.length || 0);
        return { success: true, bookings: bookingsResult.data };
      } else {
        console.error('❌ Booking management failed:', bookingsResult.error);
        return { success: false, error: bookingsResult.error };
      }
    } catch (error) {
      console.error('❌ Booking management test failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Run comprehensive admin tests
  async runAllTests() {
    console.log('🚀 Starting comprehensive admin tests...');
    
    const results = {
      login: await this.testAdminLogin(),
      dashboard: await this.testAdminDashboard(),
      users: await this.testUserManagement(),
      venues: await this.testVenueManagement(),
      bookings: await this.testBookingManagement()
    };

    const passedTests = Object.values(results).filter(r => r.success).length;
    const totalTests = Object.keys(results).length;

    console.log(`\n📋 Test Results Summary:`);
    console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);

    if (passedTests === totalTests) {
      console.log('🎉 All admin tests passed! System is ready for admin use.');
    } else {
      console.log('⚠️  Some tests failed. Please check the errors above.');
    }

    return {
      success: passedTests === totalTests,
      results,
      summary: {
        passed: passedTests,
        failed: totalTests - passedTests,
        total: totalTests
      }
    };
  },

  // Create additional admin user
  async createAdminUser(email, password, fullName) {
    try {
      console.log(`👤 Creating admin user: ${email}`);
      
      const result = await adminService.createAdminUser(email, password, fullName);
      
      if (result.success) {
        console.log('✅ Admin user created successfully!');
        console.log('User ID:', result.data.user.id);
        return { success: true, user: result.data.user };
      } else {
        console.error('❌ Admin user creation failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('❌ Admin user creation failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Get admin user info
  async getAdminInfo() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', 'admin')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('👑 Admin Users:');
      data.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.full_name} (${admin.email})`);
      });

      return { success: true, admins: data };
    } catch (error) {
      console.error('❌ Failed to get admin info:', error);
      return { success: false, error: error.message };
    }
  },

  // Quick setup for development
  async quickSetup() {
    console.log('⚡ Running quick admin setup...');
    
    // Test existing admin
    const loginTest = await this.testAdminLogin();
    
    if (loginTest.success) {
      console.log('✅ Existing admin user is working!');
      
      // Run dashboard test
      const dashboardTest = await this.testAdminDashboard();
      
      if (dashboardTest.success) {
        console.log('✅ Admin dashboard is ready!');
        console.log('\n🎯 Admin Setup Complete!');
        console.log('📧 Email: admin@hallbooker.com');
        console.log('🔐 Password: admin123!');
        console.log('🚀 You can now test the admin panel!');
        
        return { success: true, message: 'Admin setup complete' };
      }
    }
    
    console.log('❌ Admin setup has issues. Please check the database migrations.');
    return { success: false, message: 'Admin setup failed' };
  }
};

// Export for use in browser console or components
if (typeof window !== 'undefined') {
  window.testAdminSetup = testAdminSetup;
}

export default testAdminSetup;