import supabase from './supabase';
import { errorHandler } from './errorHandler';

const bookingService = {
  // Create new booking
  async createBooking(bookingData) {
    return await errorHandler.executeDbOperation('create booking', async () => {
      return await supabase
        .from('bookings')
        .insert([{
          ...bookingData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select(`
          *,
          venue:venues(name, location, price_per_hour),
          customer:user_profiles(full_name, email)
        `)
        .single();
    });
  },

  // Get bookings for a user
  async getUserBookings(userId) {
    return await errorHandler.executeDbOperation('fetch user bookings', async () => {
      return await supabase
        .from('bookings')
        .select(`
          *,
          venue:venues(id, name, location, images, price_per_hour),
          customer:user_profiles(full_name, email)
        `)
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });
    });
  },

  // Get bookings for venue owner
  async getVenueBookings(ownerId) {
    return await errorHandler.executeDbOperation('fetch venue bookings', async () => {
      return await supabase
        .from('bookings')
        .select(`
          *,
          venue:venues(id, name, location, owner_id),
          customer:user_profiles(full_name, email, phone)
        `)
        .eq('venue.owner_id', ownerId)
        .order('created_at', { ascending: false });
    });
  },

  // Get booking by ID
  async getBookingById(bookingId) {
    return await errorHandler.executeDbOperation('fetch booking details', async () => {
      return await supabase
        .from('bookings')
        .select(`
          *,
          venue:venues(id, name, location, images, price_per_hour, owner:user_profiles(full_name, email, phone)),
          customer:user_profiles(full_name, email, phone)
        `)
        .eq('id', bookingId)
        .single();
    });
  },

  // Update booking status
  async updateBookingStatus(bookingId, status, notes = null) {
    return await errorHandler.executeDbOperation('update booking status', async () => {
      return await supabase
        .from('bookings')
        .update({
          status,
          notes,
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

  // Update booking details
  async updateBooking(bookingId, updates) {
    return await errorHandler.executeDbOperation('update booking', async () => {
      return await supabase
        .from('bookings')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select(`
          *,
          venue:venues(name, location, price_per_hour),
          customer:user_profiles(full_name, email)
        `)
        .single();
    });
  },

  // Check venue availability
  async checkAvailability(venueId, eventDate, startTime, endTime) {
    return await errorHandler.executeDbOperation('check venue availability', async () => {
      return await supabase
        .from('bookings')
        .select('id, event_date, start_time, end_time')
        .eq('venue_id', venueId)
        .eq('event_date', eventDate)
        .in('status', ['confirmed', 'pending'])
        .or(`and(start_time.lte.${endTime},end_time.gte.${startTime})`);
    });
  },

  // Get booking statistics for admin
  async getBookingStats() {
    return await errorHandler.executeDbOperation('fetch booking statistics', async () => {
      const [totalBookings, confirmedBookings, pendingBookings, cancelledBookings] = await Promise.all([
        supabase.from('bookings').select('id', { count: 'exact' }),
        supabase.from('bookings').select('id', { count: 'exact' }).eq('status', 'confirmed'),
        supabase.from('bookings').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('bookings').select('id', { count: 'exact' }).eq('status', 'cancelled')
      ]);

      return {
        data: {
          total: totalBookings.count || 0,
          confirmed: confirmedBookings.count || 0,
          pending: pendingBookings.count || 0,
          cancelled: cancelledBookings.count || 0
        }
      };
    });
  },

  // Get recent bookings
  async getRecentBookings(limit = 10) {
    return await errorHandler.executeDbOperation('fetch recent bookings', async () => {
      return await supabase
        .from('bookings')
        .select(`
          *,
          venue:venues(name, location),
          customer:user_profiles(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);
    });
  },

  // Cancel booking
  async cancelBooking(bookingId, reason = null) {
    return await errorHandler.executeDbOperation('cancel booking', async () => {
      return await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          notes: reason,
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
  }
};

export default bookingService;