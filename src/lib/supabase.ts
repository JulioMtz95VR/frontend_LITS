import { createClient } from '@supabase/supabase-js';

const supabaseUrl =  'https://kbjyrjdoxkuonlawtnfy.supabase.co';
const supabaseAnonKey =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtianlyamRveGt1b25sYXd0bmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjQ4MjgsImV4cCI6MjA2OTA0MDgyOH0.OsWqUFw8ty-PMGAs2AknfR7iLRAks8mfY_9zr2BiFjs';

if(supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase or Aon Key environment varibales');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

