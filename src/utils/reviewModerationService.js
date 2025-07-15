import supabase from './supabase';
import { errorHandler } from './errorHandler';

const reviewModerationService = {
  // Get all pending reviews for moderation
  async getPendingReviews() {
    return await errorHandler.executeDbOperation('get pending reviews', async () => {
      return await supabase
        .from('reviews')
        .select(`
          *,
          venue:venues!venue_id (
            id,
            name,
            owner_id
          ),
          customer:user_profiles!customer_id (
            id,
            full_name,
            email
          ),
          booking:bookings!booking_id (
            id,
            event_date,
            status,
            total_amount
          )
        `)
        .order('created_at', { ascending: true });
    });
  },

  // Get reviews with filtering options
  async getFilteredReviews(filters = {}) {
    return await errorHandler.executeDbOperation('get filtered reviews', async () => {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          venue:venues!venue_id (
            id,
            name,
            owner_id
          ),
          customer:user_profiles!customer_id (
            id,
            full_name,
            email
          ),
          booking:bookings!booking_id (
            id,
            event_date,
            status,
            total_amount
          )
        `);

      // Apply filters
      if (filters.rating) {
        if (filters.rating.includes('-')) {
          const [min, max] = filters.rating.split('-').map(Number);
          query = query.gte('rating', min).lte('rating', max || min);
        } else {
          query = query.eq('rating', parseInt(filters.rating));
        }
      }

      if (filters.venueId) {
        query = query.eq('venue_id', filters.venueId);
      }

      if (filters.customerId) {
        query = query.eq('customer_id', filters.customerId);
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      return await query.order('created_at', { ascending: false });
    });
  },

  // Approve a review
  async approveReview(reviewId, message = '') {
    return await errorHandler.executeDbOperation('approve review', async () => {
      // For now, we'll just update the review since we don't have a moderation_status field // In a real implementation, you'd add moderation fields to the reviews table
      const result = await supabase
        .from('reviews')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .select()
        .single();

      // Log the moderation action
      if (result.data) {
        await this.logModerationAction(reviewId, 'approved', message);
      }

      return result;
    });
  },

  // Reject a review
  async rejectReview(reviewId, reason, message = '') {
    return await errorHandler.executeDbOperation('reject review', async () => {
      // For this demo, we'll soft delete by setting a rejection marker
      // In production, you'd have proper moderation fields
      const result = await supabase
        .from('reviews')
        .update({
          comment: `[REJECTED: ${reason}] ${message}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .select()
        .single();

      // Log the moderation action
      if (result.data) {
        await this.logModerationAction(reviewId, 'rejected', `${reason}: ${message}`);
      }

      return result;
    });
  },

  // Flag a review for content issues
  async flagReview(reviewId, severity, reason) {
    return await errorHandler.executeDbOperation('flag review', async () => {
      // For this demo, we'll update the comment to indicate flagging
      // In production, you'd have proper flagging fields
      const result = await supabase
        .from('reviews')
        .update({
          comment: `[FLAGGED: ${severity} - ${reason}] ${await this.getOriginalComment(reviewId)}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .select()
        .single();

      // Log the moderation action
      if (result.data) {
        await this.logModerationAction(reviewId, 'flagged', `Severity: ${severity}, Reason: ${reason}`);
      }

      return result;
    });
  },

  // Request clarification from reviewer
  async requestClarification(reviewId, message) {
    return await errorHandler.executeDbOperation('request clarification', async () => {
      // Get reviewer information
      const reviewResult = await supabase
        .from('reviews').select(`customer_id,venue:venues!venue_id (name)`).eq('id', reviewId)
        .single();

      if (reviewResult.error) throw reviewResult.error;

      // Send message to reviewer (simplified - in production, use proper messaging system)
      const messageResult = await supabase
        .from('messages')
        .insert({
          sender_id: (await supabase.auth.getUser()).data.user?.id,
          recipient_id: reviewResult.data.customer_id,
          subject: `Clarification needed for your review of ${reviewResult.data.venue?.name}`,
          content: message,
          priority: 'normal'
        })
        .select()
        .single();

      // Log the moderation action
      await this.logModerationAction(reviewId, 'clarification_requested', message);

      return messageResult;
    });
  },

  // Escalate review to senior moderator
  async escalateReview(reviewId, reason) {
    return await errorHandler.executeDbOperation('escalate review', async () => {
      // For this demo, we'll mark it in the comment
      // In production, you'd have escalation workflows
      const result = await supabase
        .from('reviews')
        .update({
          comment: `[ESCALATED: ${reason}] ${await this.getOriginalComment(reviewId)}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .select()
        .single();

      // Log the moderation action
      if (result.data) {
        await this.logModerationAction(reviewId, 'escalated', reason);
      }

      return result;
    });
  },

  // Get original comment before modifications
  async getOriginalComment(reviewId) {
    const result = await supabase
      .from('reviews').select('comment').eq('id', reviewId)
      .single();
    
    return result.data?.comment || '';
  },

  // Log moderation actions for audit trail
  async logModerationAction(reviewId, action, details) {
    try {
      const currentUser = await supabase.auth.getUser();
      
      await supabase
        .from('activity_logs')
        .insert({
          user_id: currentUser.data.user?.id,
          activity_type: 'review_moderation',
          description: `Review ${action}: ${details}`,
          metadata: {
            review_id: reviewId,
            action: action,
            details: details,
            timestamp: new Date().toISOString()
          }
        });
    } catch (error) {
      console.log('Failed to log moderation action:', error);
    }
  },

  // Get review statistics for dashboard
  async getReviewStatistics() {
    return await errorHandler.executeDbOperation('get review statistics', async () => {
      const result = await supabase
        .from('reviews').select('id, rating, comment, created_at');

      if (result.error) throw result.error;

      const reviews = result.data || [];
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const stats = {
        total: reviews.length,
        pending: reviews.filter(r => !r.comment?.includes('[REJECTED')).length,
        flagged: reviews.filter(r => r.comment?.includes('[FLAGGED')).length,
        aging: reviews.filter(r => {
          const reviewDate = new Date(r.created_at);
          const daysDiff = Math.floor((now - reviewDate) / (1000 * 60 * 60 * 24));
          return daysDiff > 2 && !r.comment?.includes('[REJECTED') && !r.comment?.includes('[APPROVED');
        }).length,
        averageRating: reviews.length > 0 
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
          : 0,
        recentActivity: reviews.filter(r => new Date(r.created_at) >= weekAgo).length
      };

      return { data: stats, error: null };
    });
  },

  // Search reviews by content or venue
  async searchReviews(searchTerm) {
    return await errorHandler.executeDbOperation('search reviews', async () => {
      return await supabase
        .from('reviews')
        .select(`
          *,
          venue:venues!venue_id (
            id,
            name,
            owner_id
          ),
          customer:user_profiles!customer_id (
            id,
            full_name,
            email
          )
        `)
        .or(`comment.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });
    });
  },

  // Get review trends and analytics
  async getReviewAnalytics(period = '30') {
    return await errorHandler.executeDbOperation('get review analytics', async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(period));

      const result = await supabase
        .from('reviews')
        .select('id, rating, created_at, comment')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (result.error) throw result.error;

      const reviews = result.data || [];

      const analytics = {
        period,
        totalReviews: reviews.length,
        averageRating: reviews.length > 0 
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
          : 0,
        ratingDistribution: {
          1: reviews.filter(r => r.rating === 1).length,
          2: reviews.filter(r => r.rating === 2).length,
          3: reviews.filter(r => r.rating === 3).length,
          4: reviews.filter(r => r.rating === 4).length,
          5: reviews.filter(r => r.rating === 5).length
        },
        pendingModeration: reviews.filter(r => 
          !r.comment?.includes('[REJECTED') && 
          !r.comment?.includes('[APPROVED') &&
          !r.comment?.includes('[FLAGGED')
        ).length,
        flaggedContent: reviews.filter(r => r.comment?.includes('[FLAGGED')).length,
        rejectedReviews: reviews.filter(r => r.comment?.includes('[REJECTED')).length
      };

      return { data: analytics, error: null };
    });
  },

  // Get detailed review information for moderation
  async getReviewForModeration(reviewId) {
    return await errorHandler.executeDbOperation('get review for moderation', async () => {
      const result = await supabase
        .from('reviews')
        .select(`
          *,
          venue:venues!venue_id (
            id,
            name,
            owner_id,
            location,
            venue_type
          ),
          customer:user_profiles!customer_id (
            id,
            full_name,
            email,
            phone,
            created_at
          ),
          booking:bookings!booking_id (
            id,
            event_date,
            status,
            total_amount,
            event_type
          )
        `)
        .eq('id', reviewId)
        .single();

      if (result.error) throw result.error;

      // Add computed fields for moderation
      const review = result.data;
      const daysSinceSubmission = Math.floor(
        (new Date() - new Date(review.created_at)) / (1000 * 60 * 60 * 24)
      );

      // Get customer's review history
      const customerReviewsResult = await supabase
        .from('reviews')
        .select('id, rating')
        .eq('customer_id', review.customer_id);

      const customerReviews = customerReviewsResult.data || [];

      return {
        data: {
          ...review,
          venue_name: review.venue?.name,
          customer_name: review.customer?.full_name,
          customer_email: review.customer?.email,
          customer_review_count: customerReviews.length,
          days_since_submission: daysSinceSubmission,
          moderation_status: this.inferModerationStatus(review.comment),
          is_flagged: review.comment?.includes('[FLAGGED') || false,
          flagged_severity: this.extractFlaggedSeverity(review.comment),
          flagged_reason: this.extractFlaggedReason(review.comment),
          booking_info: review.booking
        },
        error: null
      };
    });
  },

  // Helper function to infer moderation status from comment
  inferModerationStatus(comment) {
    if (!comment) return 'pending';
    if (comment.includes('[APPROVED')) return 'approved';
    if (comment.includes('[REJECTED')) return 'rejected';
    if (comment.includes('[FLAGGED')) return 'flagged';
    if (comment.includes('[ESCALATED')) return 'escalated';
    return 'pending';
  },

  // Helper function to extract flagged severity
  extractFlaggedSeverity(comment) {
    if (!comment?.includes('[FLAGGED')) return null;
    const match = comment.match(/\[FLAGGED: (low|medium|high|critical)/i);
    return match ? match[1].toLowerCase() : null;
  },

  // Helper function to extract flagged reason
  extractFlaggedReason(comment) {
    if (!comment?.includes('[FLAGGED')) return null;
    const match = comment.match(/\[FLAGGED: \w+ - ([^\]]+)\]/i);
    return match ? match[1] : null;
  }
};

export default reviewModerationService;