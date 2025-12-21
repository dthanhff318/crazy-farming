import { create } from 'zustand';
import type { Database } from '../lib/database.types';

type SeedType = Database['public']['Tables']['seed_types']['Row'];
type AnimalType = Database['public']['Tables']['animal_types']['Row'];

export type SelectedItem = {
  itemType: 'seed';
  itemData: SeedType;
} | {
  itemType: 'animal';
  itemData: AnimalType;
};

interface SelectedItemState {
  selectedItem: SelectedItem | null;
  setSelectedItem: (item: SelectedItem | null) => void;
  clearSelectedItem: () => void;
}

export const useSelectedItemStore = create<SelectedItemState>((set) => ({
  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item }),
  clearSelectedItem: () => set({ selectedItem: null }),
}));
