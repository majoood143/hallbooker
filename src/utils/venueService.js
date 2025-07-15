import supabase from './supabase';
import { errorHandler } from './errorHandler';
import { ensureArray } from './arrayUtils';

const venueService = {
  // Get all venues with optional filters
  async getVenues(filters = {}) {
    return await errorHandler.executeDbOperation('fetch venues', async () => {
      let query = supabase
        .from('venues')
        .select(`
          *,
          owner:user_profiles(id, full_name, email),
          favorite_venues(id)
        `)
        .eq('is_active', true);

      // Apply filters
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.venueType && Array.isArray(filters.venueType) && filters.venueType.length > 0) {
        query = query.in('venue_type', filters.venueType);
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

      if (filters.amenities && Array.isArray(filters.amenities) && filters.amenities.length > 0) {
        query = query.contains('amenities', filters.amenities);
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price-low':
            query = query.order('price_per_hour', { ascending: true });
            break;
          case 'price-high':
            query = query.order('price_per_hour', { ascending: false });
            break;
          case 'rating':
            query = query.order('rating', { ascending: false });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }
      }

      const result = await query;
      
      // Ensure we always return an array using the utility function
      return {
        ...result,
        data: ensureArray(result?.data)
      };
    });
  },

  // Get venue by ID
  async getVenueById(venueId) {
    return await errorHandler.executeDbOperation('fetch venue details', async () => {
      const result = await supabase
        .from('venues')
        .select(`
          *,
          owner:user_profiles(id, full_name, email, phone),
          reviews(id, rating, comment, customer:user_profiles(full_name), created_at)
        `)
        .eq('id', venueId)
        .single();

      // Ensure reviews is always an array
      if (result?.data?.reviews) {
        result.data.reviews = ensureArray(result.data.reviews);
      }

      return result;
    });
  },

  // Get venues owned by current user
  async getOwnerVenues(ownerId) {
    return await errorHandler.executeDbOperation('fetch owner venues', async () => {
      const result = await supabase
        .from('venues')
        .select(`
          *,
          bookings(id, status, event_date, total_amount)
        `)
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });

      // Ensure we always return an array and nested bookings arrays
      if (result?.data) {
        result.data = ensureArray(result.data).map(venue => ({
          ...venue,
          bookings: ensureArray(venue?.bookings)
        }));
      }

      return {
        ...result,
        data: ensureArray(result?.data)
      };
    });
  },

  // Create new venue
  async createVenue(venueData) {
    return await errorHandler.executeDbOperation('create venue', async () => {
      return await supabase
        .from('venues')
        .insert([venueData])
        .select()
        .single();
    });
  },

  // Update venue
  async updateVenue(venueId, updates) {
    return await errorHandler.executeDbOperation('update venue', async () => {
      return await supabase
        .from('venues')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', venueId)
        .select()
        .single();
    });
  },

  // Toggle favorite venue
  async toggleFavorite(venueId, userId) {
    return await errorHandler.executeDbOperation('toggle favorite venue', async () => {
      // Check if already favorited
      const { data: existing } = await supabase
        .from('favorite_venues')
        .select('id')
        .eq('venue_id', venueId)
        .eq('user_id', userId)
        .single();

      if (existing) {
        // Remove from favorites
        await supabase
          .from('favorite_venues')
          .delete()
          .eq('venue_id', venueId)
          .eq('user_id', userId);

        return { data: { isFavorite: false } };
      } else {
        // Add to favorites
        await supabase
          .from('favorite_venues')
          .insert([{ venue_id: venueId, user_id: userId }]);

        return { data: { isFavorite: true } };
      }
    });
  },

  // Get user's favorite venues
  async getFavoriteVenues(userId) {
    return await errorHandler.executeDbOperation('fetch favorite venues', async () => {
      const result = await supabase
        .from('favorite_venues')
        .select(`
          venue:venues(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Safely extract venues from the result
      const venues = ensureArray(result?.data)
        .map(item => item?.venue)
        .filter(venue => venue);

      return {
        ...result,
        data: venues
      };
    });
  }
};

export default venueService;