import { useBuildingTypes } from "../hooks/useBuildingTypes";
import { useUserBuildings } from "../hooks/useUserBuildings";
import { useUserAnimals } from "../hooks/useUserAnimals";
import { supabase } from "../lib/supabase";
import { queryClient } from "../lib/queryClient";
import type { Database } from "../lib/database.types";

type UserData = Database["public"]["Tables"]["users"]["Row"];

interface FarmSectionProps {
  userData: UserData | null;
  onBuildingClick?: (building: BuildingType, userBuildingId: string) => void;
}

type BuildingType = Database["public"]["Tables"]["building_types"]["Row"];

/**
 * FarmSection - Main farm gameplay area
 */
export const FarmSection = ({ userData, onBuildingClick }: FarmSectionProps) => {
  const {
    buildingTypes,
    loading: buildingsLoading,
    error: buildingsError,
  } = useBuildingTypes();

  const {
    userBuildings,
    loading: userBuildingsLoading,
    error: userBuildingsError,
  } = useUserBuildings(userData?.id);

  const {
    userAnimals,
    loading: userAnimalsLoading,
    error: userAnimalsError,
  } = useUserAnimals(userData?.id);

  const userLevel = userData?.level || 1;

  // Check if user owns a building
  const isOwned = (buildingCode: string) => {
    return userBuildings.some((ub) => ub.building_code === buildingCode);
  };

  // Get user building info
  const getUserBuilding = (buildingCode: string) => {
    return userBuildings.find((ub) => ub.building_code === buildingCode);
  };

  // Count animals in a building
  const getAnimalCount = (buildingId: string | undefined) => {
    if (!buildingId) return 0;
    return userAnimals.filter(
      (animal) => animal.user_building_id === buildingId
    ).length;
  };

  // Handle building purchase
  const handleBuyBuilding = async (buildingCode: string) => {
    if (!userData?.id) return;

    try {
      const { data, error } = await supabase.functions.invoke(
        "purchase_building",
        {
          body: {
            userId: userData.id,
            buildingCode,
          },
        }
      );

      if (error) {
        throw new Error(error.message || "Failed to purchase building");
      }

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({
        queryKey: ["userBuildings", userData.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["userData", userData.id],
      });
      alert(`Successfully purchased building! Coins left: ${data.coins_left}`);
    } catch (error) {
      console.error("Failed to purchase building:", error);
      alert(
        error instanceof Error ? error.message : "Failed to purchase building"
      );
    }
  };

  // Handle building upgrade
  const handleUpgradeBuilding = async (buildingCode: string) => {
    if (!userData?.id) return;

    try {
      const { data, error } = await supabase.functions.invoke(
        "upgrade_building",
        {
          body: {
            userId: userData.id,
            buildingCode,
          },
        }
      );

      if (error) {
        throw new Error(error.message || "Failed to upgrade building");
      }

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({
        queryKey: ["userBuildings", userData.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["userData", userData.id],
      });
      alert(
        `Successfully upgraded to level ${data.new_level}! New capacity: ${data.new_capacity}. Coins left: ${data.coins_left}`
      );
    } catch (error) {
      console.error("Failed to upgrade building:", error);
      alert(
        error instanceof Error ? error.message : "Failed to upgrade building"
      );
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-farm-sky-100 to-farm-green-100">
      <div className="px-4 py-20 pb-24 max-w-[600px] mx-auto sm:px-3 sm:pt-[70px] sm:pb-[90px]">
        <div>
          {(buildingsLoading || userBuildingsLoading || userAnimalsLoading) && (
            <p className="text-farm-brown-600 text-center">
              Loading buildings...
            </p>
          )}
          {(buildingsError || userBuildingsError || userAnimalsError) && (
            <p className="text-red-600 text-center">
              {buildingsError || userBuildingsError || userAnimalsError}
            </p>
          )}
          {!buildingsLoading &&
            !userBuildingsLoading &&
            !userAnimalsLoading &&
            !buildingsError &&
            !userBuildingsError &&
            !userAnimalsError && (
              <div className="flex flex-col gap-4">
                {buildingTypes.map((building) => {
                  const isLocked = userLevel < building.unlock_level;
                  const owned = isOwned(building.code);
                  const userBuilding = getUserBuilding(building.code);
                  const currentLevel = userBuilding?.current_level || 1;
                  const currentCapacity =
                    userBuilding?.current_capacity ||
                    building.level_config["1"]?.capacity ||
                    0;
                  const currentAnimalCount = getAnimalCount(userBuilding?.id);
                  const nextLevel = currentLevel + 1;
                  const nextLevelConfig =
                    building.level_config[nextLevel.toString()];
                  const canUpgrade = owned && nextLevelConfig;

                  return (
                    <div
                      key={building.id}
                      onClick={() => {
                        if (owned && userBuilding && onBuildingClick) {
                          onBuildingClick(building, userBuilding.id);
                        }
                      }}
                      className={`relative rounded-2xl border-4 p-5 shadow-lg transition-shadow duration-200 ${
                        isLocked
                          ? "bg-gradient-to-br from-gray-200 to-gray-300 border-gray-500 cursor-not-allowed opacity-70"
                          : owned
                          ? "bg-gradient-to-br from-farm-green-50 to-farm-sky-50 border-farm-green-400 hover:shadow-xl cursor-pointer"
                          : "bg-gradient-to-br from-farm-yellow-50 to-farm-green-50 border-farm-brown-400 cursor-pointer hover:shadow-xl"
                      }`}
                      style={{
                        boxShadow: isLocked
                          ? "0 8px 0 0 rgba(128, 128, 128, 0.3), 0 12px 20px rgba(0,0,0,0.1)"
                          : "0 8px 0 0 rgba(92, 64, 51, 0.3), 0 12px 20px rgba(0,0,0,0.15)",
                      }}
                    >
                      {/* Level Badge */}
                      {owned ? (
                        <div className="absolute -top-3 -right-3 bg-farm-sky-500 border-3 border-farm-sky-700 rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                          <div className="text-center">
                            <div className="text-xs font-bold text-white leading-none">
                              Lv
                            </div>
                            <div className="text-lg font-bold text-white leading-none">
                              {currentLevel}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`absolute -top-3 -right-3 border-3 rounded-full w-12 h-12 flex items-center justify-center shadow-md ${
                            isLocked
                              ? "bg-gray-500 border-gray-700"
                              : "bg-farm-coral-400 border-farm-brown-600"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-xs font-bold text-white leading-none">
                              Lv
                            </div>
                            <div className="text-lg font-bold text-white leading-none">
                              {building.unlock_level}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex items-center justify-between gap-4">
                        {/* Left Block: Icon + Name + Description */}
                        <div className="flex items-center gap-4 flex-1">
                          {/* Icon */}
                          <div
                            className={`rounded-xl border-3 p-3 shadow-md ${
                              isLocked
                                ? "bg-gray-300 border-gray-500"
                                : owned
                                ? "bg-farm-green-100 border-farm-green-500"
                                : "bg-white border-farm-brown-400"
                            }`}
                          >
                            <div
                              className={`text-5xl ${
                                isLocked ? "grayscale" : ""
                              }`}
                            >
                              {building.icon}
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex-1">
                            <h4
                              className={`text-xl font-bold mb-1 drop-shadow-sm ${
                                isLocked
                                  ? "text-gray-600"
                                  : "text-farm-brown-800"
                              }`}
                            >
                              {building.name}
                            </h4>

                            {/* Only show description if not owned */}
                            {!owned && (
                              <p
                                className={`text-sm mb-3 italic wrap-normal ${
                                  isLocked
                                    ? "text-gray-500"
                                    : "text-farm-brown-600"
                                }`}
                              >
                                {building.description}
                              </p>
                            )}

                            {/* Stats Row */}
                            <div className="flex gap-3 items-center flex-wrap">
                              {/* Current quantity / Capacity */}
                              {owned && (
                                <div className="bg-farm-green-300 border-2 border-farm-green-600 rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
                                  <span className="font-bold text-farm-brown-800">
                                    {currentAnimalCount} / {currentCapacity}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Block: Action Buttons */}
                        <div className="flex shrink-0">
                          {isLocked ? (
                            <div className="text-gray-700 text-sm font-semibold bg-gray-400 px-4 py-2 rounded-lg border-2 border-gray-600">
                              Unlock at Lv {building.unlock_level}
                            </div>
                          ) : owned ? (
                            canUpgrade ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpgradeBuilding(building.code);
                                }}
                                className="bg-farm-sky-500 hover:bg-farm-sky-600 text-white font-bold px-4 py-2 rounded-lg border-2 border-farm-sky-700 shadow-md transition-colors flex items-center gap-2"
                              >
                                <span>Upgrade</span>
                                <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                                  💰 {nextLevelConfig.upgrade_price}
                                </span>
                              </button>
                            ) : (
                              <div className="text-farm-brown-600 text-sm font-semibold bg-farm-brown-100 px-4 py-2 rounded-lg border-2 border-farm-brown-300">
                                Max Level
                              </div>
                            )
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBuyBuilding(building.code);
                              }}
                              className="bg-farm-green-400 hover:bg-farm-green-500 text-white font-bold px-4 py-2 rounded-lg border-2 border-farm-green-600 shadow-md transition-colors"
                            >
                              <span>Buy 💰 {building.base_price}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
