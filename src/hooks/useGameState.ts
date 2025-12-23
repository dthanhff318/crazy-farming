import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type { GameState } from "../lib/gameMachine.types";

const fetchGameState = async (userId: string): Promise<GameState> => {
  const { data, error } = await supabase.functions.invoke("get_game_state", {
    body: { userId },
  });

  if (error) {
    throw new Error(error.message || "Failed to fetch game state");
  }

  return data.data;
};

/**
 * Hook to fetch complete game state (user, inventory, farm)
 */
export const useGameState = (userId: string | undefined) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["gameState", userId],
    queryFn: () => fetchGameState(userId!),
    enabled: !!userId,
    staleTime: 0, // Always fetch fresh data on mount
    refetchOnMount: true,
  });

  return {
    gameState: data || null,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
};
