import { supabase } from './supabase';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';

export interface AuthError {
  message: string;
}

const isDevelopment = Constants.appOwnership === 'expo';
const prefix = Linking.createURL('/');

export const auth = {
  async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${prefix}/verify`,
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  },

  async resetPassword(email: string) {
    try {
      // Use the app's deep link scheme for both development and production
      // In development: exp://localhost:8081
      // In production: mywallet://
      const siteUrl = isDevelopment
        ? `${prefix.replace('://', '://')}/--`
        : 'mywallet://';

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}reset-password`
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  },

  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  },

  async updateProfile(displayName: string) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { display_name: displayName }
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      return { user: null, error: error as AuthError };
    }
  }
}; 