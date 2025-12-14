import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type UserInventory = Database['public']['Tables']['user_inventory']['Row'];

const fetchUserInventory = async (userId: string): Promise<UserInventory[]> => {
  const { data, error } = await supabase.functions.invoke('get_user_inventory', {
    body: { userId },
  });

  if (error) {
    throw new Error(error.message || 'Failed to fetch user inventory');
  }

  return data.data;
};

export const useUserInventory = (userId: string | undefined) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userInventory', userId],
    queryFn: () => fetchUserInventory(userId!),
    enabled: !!userId,
  });

  return {
    inventory: data || [],
    loading: isLoading,
    error: error?.message || null,
  };
};
