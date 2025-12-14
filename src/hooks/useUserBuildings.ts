import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";

type UserBuilding = Database["public"]["Tables"]["user_buildings"]["Row"];
type BuildingType = Database["public"]["Tables"]["building_types"]["Row"];

export type UserBuildingWithType = UserBuilding & {
  building_type: BuildingType;
  current_capacity: number;
};

const fetchUserBuildings = async (
  userId: string
): Promise<UserBuildingWithType[]> => {
  const { data, error } = await supabase.functions.invoke(
    "get_user_buildings",
    {
      body: { userId },
    }
  );

  if (error) {
    throw new Error(error.message || "Failed to fetch user buildings");
  }

  return data.data;
};

export const useUserBuildings = (userId: string | undefined) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userBuildings", userId],
    queryFn: () => fetchUserBuildings(userId!),
    enabled: !!userId, // Only run query if userId exists
  });

  return {
    userBuildings: data || [],
    loading: isLoading,
    error: error?.message || null,
  };
};
