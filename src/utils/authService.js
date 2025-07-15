import supabase from './supabase';
import { errorHandler } from './errorHandler';

const authService = {
  // Sign up new user
  async signUp(email, password, userData = {}) {
    return await errorHandler.executeAuthOperation('user signup', async () => {
      return await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName || userData.full_name || '',
            role: userData.role || 'customer'
          }
        }
      });
    });
  },

  // Sign in user
  async signIn(email, password) {
    return await errorHandler.executeAuthOperation('user login', async () => {
      return await supabase.auth.signInWithPassword({
        email,
        password
      });
    });
  },

  // Sign out user
  async signOut() {
    return await errorHandler.executeAuthOperation('user logout', async () => {
      return await supabase.auth.signOut();
    });
  },

  // Get current session
  async getSession() {
    return await errorHandler.executeAuthOperation('get session', async () => {
      return await supabase.auth.getSession();
    });
  },

  // Get user profile
  async getUserProfile(userId) {
    return await errorHandler.executeDbOperation('get user profile', async () => {
      return await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
    });
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    return await errorHandler.executeDbOperation('update user profile', async () => {
      return await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
    });
  },

  // Reset password
  async resetPassword(email) {
    return await errorHandler.executeAuthOperation('password reset', async () => {
      return await supabase.auth.resetPasswordForEmail(email);
    });
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

export default authService;