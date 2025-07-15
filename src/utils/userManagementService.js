import supabase from './supabase';
import { errorHandler } from './errorHandler';

const userManagementService = {
  // Get all users with filtering
  async getAllUsers(filters = {}) {
    return await errorHandler.executeDbOperation('get all users', async () => {
      let query = supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.role) {
        query = query.eq('role', filters.role);
      }

      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      return await query;
    });
  },

  // Get customers only
  async getCustomers(filters = {}) {
    return await errorHandler.executeDbOperation('get customers', async () => {
      let query = supabase
        .from('user_profiles')
        .select(`
          *,
          bookings:bookings(count),
          favorite_venues:favorite_venues(count),
          reviews:reviews(count)
        `)
        .eq('role', 'customer')
        .order('created_at', { ascending: false });

      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      return await query;
    });
  },

  // Get venue owners only
  async getVenueOwners(filters = {}) {
    return await errorHandler.executeDbOperation('get venue owners', async () => {
      let query = supabase
        .from('user_profiles')
        .select(`
          *,
          venues:venues(count),
          total_bookings:venues(bookings(count))
        `)
        .eq('role', 'venue_owner')
        .order('created_at', { ascending: false });

      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      return await query;
    });
  },

  // Update user role
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

  // Delete user
  async deleteUser(userId) {
    return await errorHandler.executeDbOperation('delete user', async () => {
      // First delete from user_profiles, cascade will handle auth.users
      const result = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      return result;
    });
  },

  // Get user statistics
  async getUserStatistics() {
    return await errorHandler.executeDbOperation('get user statistics', async () => {
      const [customers, venueOwners, admins, totalBookings] = await Promise.all([
        supabase.from('user_profiles').select('id', { count: 'exact' }).eq('role', 'customer'),
        supabase.from('user_profiles').select('id', { count: 'exact' }).eq('role', 'venue_owner'),
        supabase.from('user_profiles').select('id', { count: 'exact' }).eq('role', 'admin'),
        supabase.from('bookings').select('id', { count: 'exact' })
      ]);

      return {
        data: {
          totalCustomers: customers.count || 0,
          totalVenueOwners: venueOwners.count || 0,
          totalAdmins: admins.count || 0,
          totalBookings: totalBookings.count || 0
        },
        success: true
      };
    });
  },

  // Get pending approvals (bookings with pending status)
  async getPendingApprovals(filters = {}) {
    return await errorHandler.executeDbOperation('get pending approvals', async () => {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          customer:user_profiles!customer_id(full_name, email, phone),
          venue:venues(name, location, owner_id)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (filters.search) {
        query = query.or(`booking_reference.ilike.%${filters.search}%`);
      }

      if (filters.venue) {
        query = query.ilike('venues.name', `%${filters.venue}%`);
      }

      return await query;
    });
  },

  // Update booking status
  async updateBookingStatus(bookingId, status) {
    return await errorHandler.executeDbOperation('update booking status', async () => {
      return await supabase
        .from('bookings')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .single();
    });
  },

  // Get user activity logs
  async getUserActivityLogs(userId, limit = 10) {
    return await errorHandler.executeDbOperation('get user activity logs', async () => {
      return await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
    });
  }
};

export default userManagementService;