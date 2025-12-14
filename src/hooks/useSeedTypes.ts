import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type SeedType = Database['public']['Tables']['seed_types']['Row'];

const fetchSeedTypes = async (): Promise<SeedType[]> => {
  const { data, error } = await supabase.functions.invoke('get_seed_types');

  if (error) {
    throw new Error(error.message || 'Failed to fetch seed types');
  }

  return data.data;
};

export const useSeedTypes = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['seedTypes'],
    queryFn: fetchSeedTypes,
  });

  return {
    seedTypes: data || [],
    loading: isLoading,
    error: error?.message || null,
  };
};
