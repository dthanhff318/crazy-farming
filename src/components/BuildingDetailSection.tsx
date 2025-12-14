import { useUserAnimals } from "../hooks/useUserAnimals";
import type { Database } from "../lib/database.types";

type UserData = Database["public"]["Tables"]["users"]["Row"];
type BuildingType = Database["public"]["Tables"]["building_types"]["Row"];

interface BuildingDetailSectionProps {
  userData: UserData | null;
  building: BuildingType | null;
  userBuildingId: string | undefined;
  onBack: () => void;
}

export const BuildingDetailSection = ({
  userData,
  building,
  userBuildingId,
  onBack,
}: BuildingDetailSectionProps) => {
  const { userAnimals, loading, error } = useUserAnimals(userData?.id);

  // Filter animals in this building
  const animalsInBuilding = userAnimals.filter(
    (animal) => animal.user_building_id === userBuildingId
  );

  if (!building) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-farm-brown-600">No building selected</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-farm-sky-100 to-farm-green-100">
      <div className="px-4 py-20 pb-24 max-w-[600px] mx-auto sm:px-3 sm:pt-[70px] sm:pb-[90px]">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-farm-brown-800 font-semibold hover:text-farm-brown-600 transition-colors"
          >
            <span className="text-xl">←</span>
            <span>Back to Farm</span>
          </button>

          <div className="bg-white rounded-2xl border-4 border-farm-brown-400 p-4 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{building.icon}</div>
              <div>
                <h2 className="text-2xl font-bold text-farm-brown-800">
                  {building.name}
                </h2>
                <p className="text-farm-brown-600 italic">
                  {building.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Animals List */}
        <div>
          <h3 className="text-xl font-bold text-farm-brown-800 mb-4">
            Animals in this building ({animalsInBuilding.length})
          </h3>

          {loading && (
            <p className="text-farm-brown-600 text-center">Loading animals...</p>
          )}

          {error && <p className="text-red-600 text-center">{error}</p>}

          {!loading && !error && animalsInBuilding.length === 0 && (
            <div className="bg-white rounded-2xl border-4 border-farm-brown-400 p-8 text-center">
              <p className="text-farm-brown-600 text-lg">No animals yet</p>
              <p className="text-farm-brown-500 text-sm mt-2">
                Purchase animals to add them to this building
              </p>
            </div>
          )}

          {!loading && !error && animalsInBuilding.length > 0 && (
            <div className="flex flex-col gap-3">
              {animalsInBuilding.map((animal) => (
                <div
                  key={animal.id}
                  className="bg-white rounded-xl border-3 border-farm-brown-400 p-4 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{animal.animal_type.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-farm-brown-800">
                        {animal.name || animal.animal_type.name}
                      </h4>
                      <div className="flex gap-2 mt-1">
                        <span className="text-sm text-farm-brown-600">
                          ❤️ Health: {animal.health}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
