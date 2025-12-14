import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type UserAnimal = Database['public']['Tables']['user_animals']['Row'];
type AnimalType = Database['public']['Tables']['animal_types']['Row'];

export type UserAnimalWithType = UserAnimal & {
  animal_type: AnimalType;
};

const fetchUserAnimals = async (userId: string): Promise<UserAnimalWithType[]> => {
  const { data, error } = await supabase.functions.invoke('get_user_animals', {
    body: { userId },
  });

  if (error) {
    throw new Error(error.message || 'Failed to fetch user animals');
  }

  return data.data;
};

export const useUserAnimals = (userId: string | undefined) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userAnimals', userId],
    queryFn: () => fetchUserAnimals(userId!),
    enabled: !!userId, // Only run query if userId exists
  });

  return {
    userAnimals: data || [],
    loading: isLoading,
    error: error?.message || null,
  };
};
