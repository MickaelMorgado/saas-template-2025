import { supabase } from '@/lib/supabasePublic';
import { HomepageSection } from '@/types';

const getHomepageSections = async (): Promise<HomepageSection[]> => {
  const { data, error } = await supabase
    .from('homepage_sections')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getHomepageSections;
