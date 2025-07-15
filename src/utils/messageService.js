import supabase from './supabase';

const messageService = {
  // Send message
  async sendMessage(messageData) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select(`
          *,
          sender:user_profiles!sender_id(id, full_name, email),
          recipient:user_profiles!recipient_id(id, full_name, email),
          booking:bookings(id, booking_reference, venue:venues(name))
        `)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to send message' };
    }
  },

  // Get user's messages (conversations)
  async getUserMessages(userId) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:user_profiles!sender_id(id, full_name, email),
          recipient:user_profiles!recipient_id(id, full_name, email),
          booking:bookings(id, booking_reference, venue:venues(name, location, images))
        `)
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      // Group messages by conversation (booking or sender/recipient pair)
      const conversations = {};
      
      data?.forEach(message => {
        let conversationKey;
        
        if (message.booking) {
          conversationKey = `booking_${message.booking.id}`;
        } else {
          // For non-booking messages, create conversation between sender and recipient
          const otherUserId = message.sender_id === userId ? message.recipient_id : message.sender_id;
          conversationKey = `user_${otherUserId}`;
        }

        if (!conversations[conversationKey]) {
          conversations[conversationKey] = {
            id: conversationKey,
            booking: message.booking,
            otherUser: message.sender_id === userId ? message.recipient : message.sender,
            messages: [],
            lastMessage: message,
            unreadCount: 0
          };
        }

        conversations[conversationKey].messages.push(message);
        
        // Count unread messages for current user
        if (message.recipient_id === userId && !message.is_read) {
          conversations[conversationKey].unreadCount++;
        }

        // Update last message if this one is newer
        if (new Date(message.created_at) > new Date(conversations[conversationKey].lastMessage.created_at)) {
          conversations[conversationKey].lastMessage = message;
        }
      });

      // Convert to array and sort by last message time
      const conversationList = Object.values(conversations).sort((a, b) => 
        new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at)
      );

      return { success: true, data: conversationList };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load messages' };
    }
  },

  // Get messages for a specific conversation
  async getConversationMessages(conversationId, userId) {
    try {
      let query = supabase
        .from('messages')
        .select(`
          *,
          sender:user_profiles!sender_id(id, full_name, email),
          recipient:user_profiles!recipient_id(id, full_name, email),
          booking:bookings(id, booking_reference, venue:venues(name))
        `);

      if (conversationId.startsWith('booking_')) {
        const bookingId = conversationId.replace('booking_', '');
        query = query.eq('booking_id', bookingId);
      } else if (conversationId.startsWith('user_')) {
        const otherUserId = conversationId.replace('user_', '');
        query = query.or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`);
      }

      const { data, error } = await query.order('created_at', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to load conversation messages' };
    }
  },

  // Mark message as read
  async markAsRead(messageId) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to mark message as read' };
    }
  },

  // Mark all messages in conversation as read
  async markConversationAsRead(conversationId, userId) {
    try {
      let query = supabase
        .from('messages')
        .update({ is_read: true })
        .eq('recipient_id', userId);

      if (conversationId.startsWith('booking_')) {
        const bookingId = conversationId.replace('booking_', '');
        query = query.eq('booking_id', bookingId);
      } else if (conversationId.startsWith('user_')) {
        const otherUserId = conversationId.replace('user_', '');
        query = query.eq('sender_id', otherUserId);
      }

      const { data, error } = await query.select();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to mark conversation as read' };
    }
  },

  // Get unread message count
  async getUnreadCount(userId) {
    try {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', userId)
        .eq('is_read', false);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: count || 0 };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { success: false, error: 'Failed to get unread count' };
    }
  }
};

export default messageService;