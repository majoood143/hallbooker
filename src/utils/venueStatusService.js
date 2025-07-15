import supabase from './supabase';
import { errorHandler } from './errorHandler';

const venueStatusService = {
  // Get venues by status with filters
  async getVenuesByStatus(status = null, filters = {}) {
    return await errorHandler.executeDbOperation('fetch venues by status', async () => {
      let query = supabase
        .from('venues')
        .select(`
          *,
          owner:user_profiles(id, full_name, email, phone),
          bookings(id, status, event_date, total_amount),
          venue_status_history(
            id, 
            previous_status, 
            new_status, 
            reason, 
            notes, 
            created_at,
            changed_by:user_profiles(full_name)
          )
        `);

      // Filter by status if provided
      if (status) {
        query = query.eq('status', status);
      }

      // Apply additional filters
      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters?.venueType) {
        query = query.eq('venue_type', filters.venueType);
      }

      if (filters?.ownerId) {
        query = query.eq('owner_id', filters.ownerId);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Apply sorting
      const sortBy = filters?.sortBy || 'last_status_change';
      const sortOrder = filters?.sortOrder === 'asc' ? { ascending: true } : { ascending: false };
      
      query = query.order(sortBy, sortOrder);

      return await query;
    });
  },

  // Update venue status
  async updateVenueStatus(venueId, newStatus, reason = null, notes = null) {
    return await errorHandler.executeDbOperation('update venue status', async () => {
      const updates = {
        status: newStatus,
        last_status_change: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add status-specific fields
      if (newStatus === 'suspended') {
        updates.suspension_reason = reason;
        updates.suspension_date = new Date().toISOString();
      } else {
        updates.suspension_reason = null;
        updates.suspension_date = null;
      }

      if (newStatus === 'under_review') {
        updates.review_notes = notes;
      } else if (newStatus !== 'suspended') {
        updates.review_notes = null;
      }

      return await supabase
        .from('venues')
        .update(updates)
        .eq('id', venueId)
        .select(`
          *,
          owner:user_profiles(id, full_name, email, phone)
        `)
        .single();
    });
  },

  // Get venue status history
  async getVenueStatusHistory(venueId) {
    return await errorHandler.executeDbOperation('fetch venue status history', async () => {
      return await supabase
        .from('venue_status_history')
        .select(`
          *,
          changed_by:user_profiles(full_name, email)
        `)
        .eq('venue_id', venueId)
        .order('created_at', { ascending: false });
    });
  },

  // Get venue status statistics
  async getVenueStatusStats() {
    return await errorHandler.executeDbOperation('get venue statistics', async () => {
      return await supabase.rpc('get_venue_status_stats');
    });
  },

  // Bulk update venue statuses
  async bulkUpdateVenueStatus(venueIds, newStatus, reason = null, notes = null) {
    return await errorHandler.executeDbOperation('bulk update venue status', async () => {
      const updates = {
        status: newStatus,
        last_status_change: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (newStatus === 'suspended') {
        updates.suspension_reason = reason;
        updates.suspension_date = new Date().toISOString();
      }

      if (newStatus === 'under_review') {
        updates.review_notes = notes;
      }

      return await supabase
        .from('venues')
        .update(updates)
        .in('id', venueIds)
        .select(`
          id,
          name,
          status,
          owner:user_profiles(full_name, email)
        `);
    });
  },

  // Get venues requiring attention (admin dashboard)
  async getVenuesRequiringAttention() {
    return await errorHandler.executeDbOperation('fetch venues requiring attention', async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      return await supabase
        .from('venues')
        .select(`
          *,
          owner:user_profiles(full_name, email),
          bookings(id, status, event_date)
        `)
        .or(`status.eq.pending,status.eq.under_review,and(status.eq.suspended,suspension_date.lt.${thirtyDaysAgo.toISOString()})`)
        .order('created_at', { ascending: true });
    });
  }
};

export default venueStatusService;