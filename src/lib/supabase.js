import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ebgcnavbybyppkieafed.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZ2NuYXZieWJ5cHBraWVhZmVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MTAzMzUsImV4cCI6MjA2Nzk4NjMzNX0.om_kOoUfOYCqvif6PlJAQ31am8bxSwO_oY_bxvQyBmE';

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export default supabase;