import { createClient } from '@supabase/supabase-js';
import { Database } from '../types_db';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
