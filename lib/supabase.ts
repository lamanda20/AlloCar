
import { createClient } from '@supabase/supabase-js';

// Use hardcoded fallbacks from the provided .env as process.env might not expose custom keys in this environment
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://acbbewyvfxocwbisftxu.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYmJld3l2ZnhvY3diaXNmdHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMDA3NzAsImV4cCI6MjA4NDY3Njc3MH0.0PL4H7A8DHryc8KAJbZA17C2zWeEltJJI3wv5n3rCFI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
