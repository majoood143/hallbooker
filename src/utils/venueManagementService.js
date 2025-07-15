import supabase from './supabase';
import { errorHandler } from './errorHandler';

const venueManagementService = {
  // Get all venues with owner information for admin management
  async getAllVenues() {
    return await errorHandler.executeDbOperation('get all venues', async () => {
      return await supabase
        .from('venues')
        .select(`
          *,
          owner:user_profiles!owner_id (
            id,
            full_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });
    });
  },

  // Get venues with filtering options
  async getFilteredVenues(filters = {}) {
    return await errorHandler.executeDbOperation('get filtered venues', async () => {
      let query = supabase
        .from('venues')
        .select(`
          *,
          owner:user_profiles!owner_id (
            id,
            full_name,
            email,
            phone
          )
        `);

      // Apply filters
      if (filters.venueType) {
        query = query.eq('venue_type', filters.venueType);
      }

      if (filters.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.minCapacity) {
        query = query.gte('capacity', filters.minCapacity);
      }

      if (filters.maxCapacity) {
        query = query.lte('capacity', filters.maxCapacity);
      }

      if (filters.minPrice) {
        query = query.gte('price_per_hour', filters.minPrice);
      }

      if (filters.maxPrice) {
        query = query.lte('price_per_hour', filters.maxPrice);
      }

      return await query.order('created_at', { ascending: false });
    });
  },

  // Update venue status (approve/suspend)
  async updateVenueStatus(venueId, isActive) {
    return await errorHandler.executeDbOperation('update venue status', async () => {
      return await supabase
        .from('venues')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', venueId)
        .select()
        .single();
    });
  },

  // Bulk update venue status
  async bulkUpdateVenueStatus(venueIds, isActive) {
    return await errorHandler.executeDbOperation('bulk update venue status', async () => {
      return await supabase
        .from('venues')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .in('id', venueIds)
        .select();
    });
  },

  // Delete venue
  async deleteVenue(venueId) {
    return await errorHandler.executeDbOperation('delete venue', async () => {
      // First, delete related records to avoid foreign key constraints
      await supabase.from('favorite_venues').delete().eq('venue_id', venueId);
      await supabase.from('reviews').delete().eq('venue_id', venueId);
      await supabase.from('bookings').delete().eq('venue_id', venueId);
      
      // Then delete the venue
      return await supabase
        .from('venues')
        .delete()
        .eq('id', venueId);
    });
  },

  // Bulk delete venues
  async bulkDeleteVenues(venueIds) {
    return await errorHandler.executeDbOperation('bulk delete venues', async () => {
      // Delete related records first
      await supabase.from('favorite_venues').delete().in('venue_id', venueIds);
      await supabase.from('reviews').delete().in('venue_id', venueIds);
      await supabase.from('bookings').delete().in('venue_id', venueIds);
      
      // Then delete the venues
      return await supabase
        .from('venues')
        .delete()
        .in('id', venueIds);
    });
  },

  // Get venue details with extended information
  async getVenueDetails(venueId) {
    return await errorHandler.executeDbOperation('get venue details', async () => {
      const [venueResult, bookingsResult] = await Promise.all([
        supabase
          .from('venues')
          .select(`
            *,
            owner:user_profiles!owner_id (
              id,
              full_name,
              email,
              phone
            )
          `)
          .eq('id', venueId)
          .single(),
        
        supabase
          .from('bookings')
          .select('id, total_amount, status')
          .eq('venue_id', venueId)
      ]);

      if (venueResult.error) throw venueResult.error;

      // Calculate performance metrics
      const bookings = bookingsResult.data || [];
      const totalBookings = bookings.length;
      const totalRevenue = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0);

      return {
        data: {
          ...venueResult.data,
          total_bookings: totalBookings,
          total_revenue: totalRevenue,
          owner_name: venueResult.data?.owner?.full_name,
          owner_email: venueResult.data?.owner?.email,
          owner_phone: venueResult.data?.owner?.phone
        },
        error: null
      };
    });
  },

  // Get venue statistics for dashboard
  async getVenueStatistics() {
    return await errorHandler.executeDbOperation('get venue statistics', async () => {
      const [venuesResult, bookingsResult] = await Promise.all([
        supabase.from('venues').select('id, is_active'),
        supabase.from('bookings').select('id, total_amount, status, venue_id')
      ]);

      if (venuesResult.error) throw venuesResult.error;
      
      const venues = venuesResult.data || [];
      const bookings = bookingsResult.data || [];

      const stats = {
        total: venues.length,
        active: venues.filter(v => v.is_active).length,
        suspended: venues.filter(v => !v.is_active).length,
        totalRevenue: bookings
          .filter(b => b.status === 'completed')
          .reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0)
      };

      return { data: stats, error: null };
    });
  },

  // Search venues by name, owner, or location
  async searchVenues(searchTerm) {
    return await errorHandler.executeDbOperation('search venues', async () => {
      return await supabase
        .from('venues')
        .select(`
          *,
          owner:user_profiles!owner_id (
            id,
            full_name,
            email,
            phone
          )
        `)
        .or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });
    });
  },

  // Get venue performance analytics
  async getVenueAnalytics(venueId, period = '30') {
    return await errorHandler.executeDbOperation('get venue analytics', async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(period));

      const [bookingsResult, reviewsResult] = await Promise.all([
        supabase
          .from('bookings')
          .select('id, total_amount, status, created_at')
          .eq('venue_id', venueId)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        
        supabase
          .from('reviews')
          .select('id, rating, created_at')
          .eq('venue_id', venueId)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
      ]);

      const bookings = bookingsResult.data || [];
      const reviews = reviewsResult.data || [];

      const analytics = {
        period,
        totalBookings: bookings.length,
        totalRevenue: bookings
          .filter(b => b.status === 'completed')
          .reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0),
        averageRating: reviews.length > 0 
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
          : 0,
        reviewCount: reviews.length,
        bookingsByStatus: {
          pending: bookings.filter(b => b.status === 'pending').length,
          confirmed: bookings.filter(b => b.status === 'confirmed').length,
          completed: bookings.filter(b => b.status === 'completed').length,
          cancelled: bookings.filter(b => b.status === 'cancelled').length
        }
      };

      return { data: analytics, error: null };
    });
  }
};

export default venueManagementService;