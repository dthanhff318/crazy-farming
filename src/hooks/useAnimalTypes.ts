import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type AnimalType = Database['public']['Tables']['animal_types']['Row'];

const fetchAnimalTypes = async (): Promise<AnimalType[]> => {
  const { data, error } = await supabase.functions.invoke('get_animal_types');

  if (error) {
    throw new Error(error.message || 'Failed to fetch animal types');
  }

  return data.data;
};

export const useAnimalTypes = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['animalTypes'],
    queryFn: fetchAnimalTypes,
  });

  return {
    animalTypes: data || [],
    loading: isLoading,
    error: error?.message || null,
  };
};
