import { createClient } from '@supabase/supabase-js';

let supabaseInstance: any = null;

export function getSupabase() {
  const url = (import.meta as any).env.VITE_SUPABASE_URL;
  const anonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;
  
  if (!url || !anonKey) {
    return null;
  }
  
  if (!supabaseInstance) {
    supabaseInstance = createClient(url, anonKey);
  }
  
  return supabaseInstance;
}

// Check if credentials exist
export function isSupabaseConfigured(): boolean {
  const url = (import.meta as any).env.VITE_SUPABASE_URL;
  const anonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && anonKey);
}
