import { createClient } from '@supabase/supabase-js';
import { Lead } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or anonymous key is not defined');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const addLead = async (lead: Omit<Lead, 'id' | 'created_at'>): Promise<Lead> => {
  const { data, error } = await supabase
    .from('leads')
    .insert([lead])
    .select()
    .single();

  if (error) {
    console.error('Error adding lead:', error);
    throw error;
  }

  return data;
};
