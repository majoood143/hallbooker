import supabase from './supabase';
import { errorHandler } from './errorHandler';

const bookingStatusService = {
  // Get bookings by status with filters
  async getBookingsByStatus(status = null, filters = {}) {
    return await errorHandler.executeDbOperation('fetch bookings by status', async () => {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          venue:venues(id, name, location, owner_id, owner:user_profiles(full_name, email)),
          customer:user_profiles(id, full_name, email, phone)
        `);

      // Filter by status if provided
      if (status) {
        query = query.eq('status', status);
      }

      // Apply additional filters
      if (filters?.venueId) {
        query = query.eq('venue_id', filters.venueId);
      }

      if (filters?.customerId) {
        query = query.eq('customer_id', filters.customerId);
      }

      if (filters?.dateFrom) {
        query = query.gte('event_date', filters.dateFrom);
      }

      if (filters?.dateTo) {
        query = query.lte('event_date', filters.dateTo);
      }

      if (filters?.search) {
        query = query.or(`booking_reference.ilike.%${filters.search}%,event_type.ilike.%${filters.search}%`);
      }

      // Apply sorting
      const sortBy = filters?.sortBy || 'created_at';
      const sortOrder = filters?.sortOrder === 'asc' ? { ascending: true } : { ascending: false };
      
      query = query.order(sortBy, sortOrder);

      return await query;
    });
  },

  // Get booking status statistics
  async getBookingStatusStats() {
    return await errorHandler.executeDbOperation('fetch booking status statistics', async () => {
      return await supabase.rpc('get_booking_status_stats');
    });
  },

  // Update booking status
  async updateBookingStatus(bookingId, newStatus, notes = null) {
    return await errorHandler.executeDbOperation('update booking status', async () => {
      const updates = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      // Add dispute-specific fields
      if (newStatus === 'disputed') {
        updates.dispute_reason = notes;
        updates.dispute_date = new Date().toISOString();
        updates.dispute_resolved = false;
      }

      if (newStatus !== 'disputed') {
        updates.dispute_reason = null;
        updates.dispute_date = null;
        updates.dispute_resolved = null;
      }

      return await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId)
        .select(`
          *,
          venue:venues(id, name, location, owner:user_profiles(full_name, email)),
          customer:user_profiles(full_name, email, phone)
        `)
        .single();
    });
  },

  // Resolve dispute
  async resolveDispute(bookingId, resolution = 'resolved') {
    return await errorHandler.executeDbOperation('resolve booking dispute', async () => {
      return await supabase
        .from('bookings')
        .update({
          dispute_resolved: true,
          status: resolution === 'cancelled' ? 'cancelled' : 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select(`
          *,
          venue:venues(name, location),
          customer:user_profiles(full_name, email)
        `)
        .single();
    });
  },

  // Get disputed bookings
  async getDisputedBookings(filters = {}) {
    return await errorHandler.executeDbOperation('fetch disputed bookings', async () => {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          venue:venues(id, name, location, owner:user_profiles(full_name, email, phone)),
          customer:user_profiles(id, full_name, email, phone)
        `)
        .eq('status', 'disputed');

      if (filters?.resolved !== undefined) {
        query = query.eq('dispute_resolved', filters.resolved);
      }

      if (filters?.dateFrom) {
        query = query.gte('dispute_date', filters.dateFrom);
      }

      if (filters?.dateTo) {
        query = query.lte('dispute_date', filters.dateTo);
      }

      return await query.order('dispute_date', { ascending: false });
    });
  },

  // Get bookings requiring attention
  async getBookingsRequiringAttention() {
    return await errorHandler.executeDbOperation('fetch bookings requiring attention', async () => {
      const today = new Date().toISOString().split('T')[0];
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      return await supabase
        .from('bookings')
        .select(`
          *,
          venue:venues(name, location, owner:user_profiles(full_name, email)),
          customer:user_profiles(full_name, email)
        `)
        .or(`and(status.eq.pending,created_at.lt.${sevenDaysAgo.toISOString()}),status.eq.disputed`)
        .order('created_at', { ascending: true });
    });
  },

  // Bulk update booking statuses
  async bulkUpdateBookingStatus(bookingIds, newStatus, notes = null) {
    return await errorHandler.executeDbOperation('bulk update booking status', async () => {
      const updates = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (notes) {
        updates.notes = notes;
      }

      return await supabase
        .from('bookings')
        .update(updates)
        .in('id', bookingIds)
        .select(`
          id,
          booking_reference,
          status,
          venue:venues(name),
          customer:user_profiles(full_name, email)
        `);
    });
  }
};

export default bookingStatusService;