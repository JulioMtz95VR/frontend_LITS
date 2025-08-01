import { createClient } from '@supabase/supabase-js';

const supabaseUrl =  'https://gikdrornmgfmcmhdeisz.supabase.co';
const supabaseAnonKey =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpa2Ryb3JubWdmbWNtaGRlaXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMDE2MzAsImV4cCI6MjA2OTU3NzYzMH0._eIt6V192RVRt6wdoEYpLeZMZ7wAnWy8nviVFUBPwlE';

if(!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


