import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Use direct string values instead of environment variables for now
const supabaseUrl = 'https://qjonukpmjwefyqhtimum.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqb251a3BtandlZnlxaHRpbXVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzMTgwOTUsImV4cCI6MjA1NDg5NDA5NX0.uwDWyOUHFTz6r89HsixUSx3fmagsz5awYXzuRhdbtIg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase; 