import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { queryClient } from '../lib/queryClient';
import type { Database } from '../lib/database.types';
import type { User } from '@supabase/supabase-js';

type UserData = Database['public']['Tables']['users']['Row'];

const fetchUserData = async (userId: string): Promise<UserData> => {
  const { data, error } = await supabase.functions.invoke('get-user-profile', {
    body: { userId },
  });

  if (error) {
    throw new Error(error.message || 'Failed to fetch user data');
  }

  return data.data;
};

export const useUser = (user: User | null) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userData', user?.id],
    queryFn: () => fetchUserData(user!.id),
    enabled: !!user, // Only run query if user exists
  });

  const updateUserNameMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('users')
        .update({ name })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['userData', user?.id] });
    },
  });

  const updateUserName = async (name: string) => {
    return updateUserNameMutation.mutateAsync(name);
  };

  return {
    userData: data || null,
    loading: isLoading,
    error: error?.message || null,
    updateUserName,
  };
};
