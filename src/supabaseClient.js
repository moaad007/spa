import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jtpjdwxfrqmguggkwlmw.supabase.co';
const supabaseAnonKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0cGpkd3hmcnFtZ3VnZ2t3bG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0Mjc2NzQsImV4cCI6MjA0NjAwMzY3NH0.w97LbeuSmOPYilciB6Kt3onM5BItoJTGdeYT9r3HO5E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);