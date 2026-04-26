import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// If credentials are placeholders or missing, we don't initialize to avoid crashes
const isSupabaseConfigured = supabaseUrl && supabaseUrl !== 'your-project-url' && supabaseAnonKey && supabaseAnonKey !== 'your-anon-key';

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any; // Cast as any to avoid complex type checks in consumer code while syncing is inactive

