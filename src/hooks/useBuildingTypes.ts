import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";

type BuildingType = Database["public"]["Tables"]["building_types"]["Row"];

const fetchBuildingTypes = async (): Promise<BuildingType[]> => {
  const { data, error } = await supabase.functions.invoke("get_building_types");

  if (error) {
    throw new Error(error.message || "Failed to fetch building types");
  }

  return data.data;
};

export const useBuildingTypes = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["buildingTypes"],
    queryFn: fetchBuildingTypes,
  });

  return {
    buildingTypes: data || [],
    loading: isLoading,
    error: error?.message || null,
  };
};
