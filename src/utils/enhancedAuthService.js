import supabase from './supabase';
import { errorHandler } from './errorHandler';
import adminService from './adminService';

const enhancedAuthService = {
  // Enhanced sign up with role-based logic
  async signUp(email, password, userData = {}) {
    return await errorHandler.executeAuthOperation('user signup', async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName || userData.full_name || '',
            role: userData.role || 'customer',
            phone: userData.phone || null,
            location: userData.location || null
          }
        }
      });

      if (error) throw error;

      // Log user registration activity
      if (data.user) {
        await this.logActivity(data.user.id, 'user_registered', 'User account created', {
          email,
          role: userData.role || 'customer',
          registration_method: 'email'
        });
      }

      return { data, error: null };
    });
  },

  // Enhanced sign in with activity logging
  async signIn(email, password) {
    return await errorHandler.executeAuthOperation('user login', async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Log successful login
      if (data.user) {
        await this.logActivity(data.user.id, 'user_login', 'User logged in', {
          email,
          login_method: 'email',
          timestamp: new Date().toISOString()
        });
      }

      return { data, error: null };
    });
  },

  // Enhanced sign out with activity logging
  async signOut() {
    return await errorHandler.executeAuthOperation('user logout', async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;

      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      // Log logout activity
      if (userId) {
        await this.logActivity(userId, 'user_logout', 'User logged out', {
          logout_method: 'manual',
          timestamp: new Date().toISOString()
        });
      }

      return { error: null };
    });
  },

  // Get current session with enhanced error handling
  async getSession() {
    return await errorHandler.executeAuthOperation('get session', async () => {
      return await supabase.auth.getSession();
    });
  },

  // Get user profile with additional data
  async getUserProfile(userId) {
    return await errorHandler.executeDbOperation('get user profile', async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          venues_count:venues(count),
          bookings_count:bookings(count),
          reviews_count:reviews(count),
          messages_count:messages(count)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;

      return { data, error: null };
    });
  },

  // Enhanced profile update with validation
  async updateUserProfile(userId, updates) {
    return await errorHandler.executeDbOperation('update user profile', async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // Log profile update
      await this.logActivity(userId, 'profile_updated', 'User profile updated', {
        updated_fields: Object.keys(updates)
      });

      return { data, error: null };
    });
  },

  // Reset password with enhanced tracking
  async resetPassword(email) {
    return await errorHandler.executeAuthOperation('password reset', async () => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      // Log password reset request
      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (profile) {
          await this.logActivity(profile.id, 'password_reset_requested', 'Password reset requested', {
            email,
            timestamp: new Date().toISOString()
          });
        }
      } catch (logError) {
        // Don't fail the main operation if logging fails
        console.warn('Failed to log password reset activity:', logError);
      }

      return { data, error: null };
    });
  },

  // Admin login with enhanced security
  async adminLogin(email, password) {
    return await errorHandler.executeAuthOperation('admin login', async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Verify admin role
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile?.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Access denied: Admin privileges required');
      }

      // Log admin login
      await this.logActivity(data.user.id, 'admin_login', 'Admin user logged in', {
        email,
        login_method: 'admin_panel',
        timestamp: new Date().toISOString()
      });

      return { data, error: null };
    });
  },

  // Check if user has admin privileges
  async checkAdminPrivileges(userId) {
    return await errorHandler.executeDbOperation('check admin privileges', async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return { 
        data: { 
          isAdmin: data.role === 'admin',
          role: data.role
        }, 
        error: null 
      };
    });
  },

  // Get user permissions based on role
  async getUserPermissions(userId) {
    return await errorHandler.executeDbOperation('get user permissions', async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;

      const permissions = {
        customer: [
          'view_venues',
          'create_bookings',
          'view_own_bookings',
          'send_messages',
          'write_reviews'
        ],
        venue_owner: [
          'view_venues',
          'create_venues',
          'manage_own_venues',
          'view_bookings',
          'manage_bookings',
          'send_messages',
          'view_analytics'
        ],
        admin: [
          'view_all_users',
          'manage_users',
          'view_all_venues',
          'manage_venues',
          'view_all_bookings',
          'manage_bookings',
          'view_system_analytics',
          'manage_system_settings',
          'send_system_notifications'
        ]
      };

      return { 
        data: { 
          role: data.role,
          permissions: permissions[data.role] || []
        }, 
        error: null 
      };
    });
  },

  // Log user activity
  async logActivity(userId, activityType, description, metadata = {}) {
    try {
      await supabase
        .from('activity_logs')
        .insert({
          user_id: userId,
          activity_type: activityType,
          description,
          metadata: metadata,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.warn('Failed to log activity:', error);
    }
  },

  // Enhanced session management
  async refreshSession() {
    return await errorHandler.executeAuthOperation('refresh session', async () => {
      return await supabase.auth.refreshSession();
    });
  },

  // Listen to auth state changes with enhanced handling
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      // Enhanced logging for auth state changes
      if (session?.user) {
        await this.logActivity(session.user.id, `auth_${event.toLowerCase()}`, `Auth event: ${event}`, {
          event,
          timestamp: new Date().toISOString()
        });
      }
      
      callback(event, session);
    });
  },

  // Quick admin test function
  async testAdminAccess() {
    try {
      const result = await adminService.testAdminLogin();
      return result;
    } catch (error) {
      console.error('Admin test failed:', error);
      return { success: false, error: error.message };
    }
  }
};

export default enhancedAuthService;