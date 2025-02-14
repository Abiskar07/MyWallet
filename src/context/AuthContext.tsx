import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { useRouter } from 'expo-router';

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for persisted session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error.message);
          setSession(null);
        } else if (session) {
          console.log('Found persisted session for:', session.user.email);
          setSession(session);
        } else {
          console.log('No persisted session found');
          setSession(null);
        }
      } catch (err) {
        console.error('Session check error:', err);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error.message);
        return { error };
      }

      console.log('Sign in successful:', data.user?.email);
      return { error: null };
    } catch (err) {
      console.error('Unexpected sign in error:', err);
      return { error: err as AuthError };
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) {
        console.error('Sign up error:', error.message);
        return { error };
      }

      console.log('Signed up successfully:', data.user?.email);
      return { error: null };
    } catch (err) {
      console.error('Unexpected sign up error:', err);
      return { error: err as AuthError };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error.message);
        return { error };
      }
      
      // Explicitly clear session
      setSession(null);
      console.log('Signed out successfully, session cleared');
      
      // Force navigation to login
      router.replace('/(auth)/login');
      
      return { error: null };
    } catch (err) {
      console.error('Unexpected sign out error:', err);
      return { error: err as AuthError };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 