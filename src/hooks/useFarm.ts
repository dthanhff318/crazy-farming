import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { queryClient } from "../lib/queryClient";

export interface CropInfo {
  id: string;
  seedCode: string;
  seedName: string;
  seedIcon: string | null;
  plantedAt: string;
  readyAt: string;
  status: string;
  progress: number;
  remainingTime: number;
}

export interface FarmPlot {
  id: string;
  plotNumber: number;
  positionX: number | null;
  positionY: number | null;
  isUnlocked: boolean;
  unlockedAt: string | null;
  crop: CropInfo | null;
}

export interface FarmState {
  plots: FarmPlot[];
  stats: {
    totalPlots: number;
    unlockedPlots: number;
    activeCrops: number;
    readyCrops: number;
  };
}

const fetchFarmState = async (userId: string): Promise<FarmState> => {
  const { data, error } = await supabase.functions.invoke("get_farm_state", {
    body: { userId },
  });

  if (error) {
    throw new Error(error.message || "Failed to fetch farm state");
  }

  return data;
};

export const useFarm = (userId: string | undefined) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["farmState", userId],
    queryFn: () => fetchFarmState(userId!),
    enabled: !!userId,
    refetchInterval: 30000, // Auto refresh every 30 seconds to update progress
  });

  const plantSeedMutation = useMutation({
    mutationFn: async ({
      plotId,
      seedCode,
    }: {
      plotId: string;
      seedCode: string;
    }) => {
      if (!userId) throw new Error("No user");

      const { data, error } = await supabase.functions.invoke("plant_seed", {
        body: { userId, plotId, seedCode },
      });

      if (error) throw new Error(error.message || "Failed to plant seed");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmState", userId] });
      queryClient.invalidateQueries({ queryKey: ["userData", userId] });
      queryClient.invalidateQueries({ queryKey: ["userInventory", userId] });
    },
  });

  const harvestCropMutation = useMutation({
    mutationFn: async (cropId: string) => {
      if (!userId) throw new Error("No user");

      const { data, error } = await supabase.functions.invoke("harvest_crop", {
        body: { userId, cropId },
      });

      if (error) throw new Error(error.message || "Failed to harvest crop");
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["farmState", userId] });
      queryClient.invalidateQueries({ queryKey: ["userData", userId] });

      // Show level up notification if leveled up
      if (data.user.leveledUp) {
        // You can add a toast notification here
        console.log(`Level up! Now level ${data.user.level}`);
      }
    },
  });

  const unlockPlotMutation = useMutation({
    mutationFn: async (plotId: string) => {
      if (!userId) throw new Error("No user");

      const { data, error } = await supabase.functions.invoke("unlock_plot", {
        body: { userId, plotId },
      });

      if (error) throw new Error(error.message || "Failed to unlock plot");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmState", userId] });
      queryClient.invalidateQueries({ queryKey: ["userData", userId] });
    },
  });

  return {
    farmState: data || null,
    loading: isLoading,
    error: error?.message || null,
    refetch,
    plantSeed: plantSeedMutation.mutateAsync,
    plantingSeed: plantSeedMutation.isPending,
    harvestCrop: harvestCropMutation.mutateAsync,
    harvesting: harvestCropMutation.isPending,
    unlockPlot: unlockPlotMutation.mutateAsync,
    unlocking: unlockPlotMutation.isPending,
  };
};
