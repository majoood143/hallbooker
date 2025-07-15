import supabase from './supabase';
import { errorHandler } from './errorHandler';

const adminService = {
  // Create admin user
  async createAdminUser(email, password, fullName) {
    return await errorHandler.executeAuthOperation('create admin user', async () => {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName || 'Admin User',
          role: 'admin'
        }
      });

      if (authError) throw authError;

      // The user_profiles entry should be created automatically via trigger
      return { user: authData.user };
    });
  },

  // Get all users with admin privileges
  async getAllUsers(page = 1, limit = 20, filters = {}) {
    return await errorHandler.executeDbOperation('get all users', async () => {
      let query = supabase
        .from('user_profiles')
        .select(`
          *,
          venues:venues(count),
          bookings:bookings(count),
          reviews:reviews(count)
        `)
        .range((page - 1) * limit, page * limit - 1);

      // Apply filters
      if (filters.role) {
        query = query.eq('role', filters.role);
      }
      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      return await query;
    });
  },

  // Get user statistics
  async getUserStats() {
    return await errorHandler.executeDbOperation('get user statistics', async () => {
      const { data, error } = await supabase.rpc('get_user_role_stats');
      if (error) throw error;
      return { data };
    });
  },

  // Update user role (admin only)
  async updateUserRole(userId, newRole) {
    return await errorHandler.executeDbOperation('update user role', async () => {
      return await supabase
        .from('user_profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
    });
  },

  // Suspend/activate user
  async toggleUserStatus(userId, isActive) {
    return await errorHandler.executeDbOperation('toggle user status', async () => {
      // This would require adding an is_active column to user_profiles
      // For now, we'll use a metadata approach
      return await supabase
        .from('user_profiles')
        .update({ 
          preferences: supabase.raw(`preferences || '{"is_active": ${isActive}}'::jsonb`),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
    });
  },

  // Get venue statistics
  async getVenueStats() {
    return await errorHandler.executeDbOperation('get venue statistics', async () => {
      const { data, error } = await supabase.rpc('get_venue_status_stats');
      if (error) throw error;
      return { data };
    });
  },

  // Update venue status
  async updateVenueStatus(venueId, status, reason = null, notes = null) {
    return await errorHandler.executeDbOperation('update venue status', async () => {
      const updateData = {
        status,
        updated_at: new Date().toISOString(),
        last_status_change: new Date().toISOString()
      };

      if (status === 'suspended') {
        updateData.suspension_reason = reason;
        updateData.suspension_date = new Date().toISOString();
      } else {
        updateData.suspension_reason = null;
        updateData.suspension_date = null;
      }

      if (notes) {
        updateData.review_notes = notes;
      }

      return await supabase
        .from('venues')
        .update(updateData)
        .eq('id', venueId)
        .select()
        .single();
    });
  },

  // Get booking statistics
  async getBookingStats() {
    return await errorHandler.executeDbOperation('get booking statistics', async () => {
      const { data, error } = await supabase.rpc('get_booking_status_stats');
      if (error) throw error;
      return { data };
    });
  },

  // Get all bookings with filters
  async getAllBookings(page = 1, limit = 20, filters = {}) {
    return await errorHandler.executeDbOperation('get all bookings', async () => {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          customer:customer_id(full_name, email),
          venue:venue_id(name, location)
        `)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.dateFrom) {
        query = query.gte('event_date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('event_date', filters.dateTo);
      }

      return await query;
    });
  },

  // Resolve booking dispute
  async resolveBookingDispute(bookingId, resolution) {
    return await errorHandler.executeDbOperation('resolve booking dispute', async () => {
      return await supabase
        .from('bookings')
        .update({
          dispute_resolved: true,
          status: resolution.newStatus || 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .single();
    });
  },

  // Get system activity logs
  async getActivityLogs(page = 1, limit = 50, filters = {}) {
    return await errorHandler.executeDbOperation('get activity logs', async () => {
      let query = supabase
        .from('activity_logs')
        .select(`
          *,
          user:user_id(full_name, email, role)
        `)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      // Apply filters
      if (filters.activityType) {
        query = query.eq('activity_type', filters.activityType);
      }
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      return await query;
    });
  },

  // Get dashboard metrics
  async getDashboardMetrics() {
    return await errorHandler.executeDbOperation('get dashboard metrics', async () => {
      const [
        userStats,
        venueStats,
        bookingStats,
        recentActivity
      ] = await Promise.all([
        supabase.rpc('get_user_role_stats'),
        supabase.rpc('get_venue_status_stats'),
        supabase.rpc('get_booking_status_stats'),
        supabase
          .from('activity_logs')
          .select('*, user:user_id(full_name, email)')
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      return {
        data: {
          users: userStats.data,
          venues: venueStats.data,
          bookings: bookingStats.data,
          recentActivity: recentActivity.data
        }
      };
    });
  },

  // Send system notification
  async sendSystemNotification(recipientId, subject, content, priority = 'normal') {
    return await errorHandler.executeDbOperation('send system notification', async () => {
      return await supabase
        .from('messages')
        .insert({
          sender_id: null, // System message
          recipient_id: recipientId,
          subject,
          content,
          priority,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
    });
  },

  // Bulk send notifications
  async sendBulkNotifications(recipientIds, subject, content, priority = 'normal') {
    return await errorHandler.executeDbOperation('send bulk notifications', async () => {
      const notifications = recipientIds.map(recipientId => ({
        sender_id: null,
        recipient_id: recipientId,
        subject,
        content,
        priority,
        created_at: new Date().toISOString()
      }));

      return await supabase
        .from('messages')
        .insert(notifications)
        .select();
    });
  },

  // Export data
  async exportData(dataType, filters = {}) {
    return await errorHandler.executeDbOperation(`export ${dataType}`, async () => {
      let query;
      
      switch (dataType) {
        case 'users':
          query = supabase
            .from('user_profiles')
            .select('email, full_name, role, created_at');
          break;
        case 'venues':
          query = supabase
            .from('venues')
            .select('name, location, venue_type, capacity, price_per_hour, status, created_at');
          break;
        case 'bookings':
          query = supabase
            .from('bookings')
            .select(`
              booking_reference,
              event_date,
              total_amount,
              status,
              customer:customer_id(full_name, email),
              venue:venue_id(name, location),
              created_at
            `);
          break;
        default:
          throw new Error(`Unsupported export type: ${dataType}`);
      }

      // Apply filters if provided
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      return await query;
    });
  },

  // Test admin user login
  async testAdminLogin() {
    return await errorHandler.executeAuthOperation('test admin login', async () => {
      return await supabase.auth.signInWithPassword({
        email: 'superadmin@hallbooker.com',
        password: 'admin123!'
      });
    });
  }
};

export default adminService;