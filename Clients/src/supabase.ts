import { createClient } from '@supabase/supabase-js';

// These browser values are intentionally public. Database access is governed by
// Supabase Auth and row-level security; never put a service-role key here.
const url = (import.meta.env.VITE_SUPABASE_URL || 'https://jsrskcoarlkxxtfbozpg.supabase.co') as string | undefined;
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_3SRT1TdcQCz1bI_8Vo6pDA_xEj5jfCN') as string | undefined;

export const supabaseConfigured = Boolean(url && anonKey);
export const supabase = supabaseConfigured ? createClient(url!, anonKey!, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
}) : null;
