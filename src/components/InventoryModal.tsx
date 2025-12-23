import { CommonModal } from "./CommonModal";
import { Tabs, TabList, TabButton, TabPanel } from "./Tabs";
import { PixelCard } from "./PixelCard";
import { ItemBox } from "./ItemBox";
import { useSeedTypes } from "../hooks/useSeedTypes";
import { useGameMachineContext } from "../contexts/GameMachineContext";
import { useSelectedItemStore } from "../stores/selectedItemStore";
import { getCropsAssetUrl } from "../helpers/normalizePath";
import type { Database } from "../lib/database.types";
import type { User } from "@supabase/supabase-js";

type SeedType = Database["public"]["Tables"]["seed_types"]["Row"];
type UserInventory = Database["public"]["Tables"]["user_inventory"]["Row"];

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export const InventoryModal = ({
  isOpen,
  onClose,
}: InventoryModalProps) => {
  const {
    seedTypes,
    loading: seedsLoading,
    error: seedsError,
  } = useSeedTypes();
  const { inventory } = useGameMachineContext();

  const selectedItem = useSelectedItemStore((state) => state.selectedItem);
  const setSelectedItem = useSelectedItemStore(
    (state) => state.setSelectedItem
  );

  const handleSelectClick = (itemCode: string) => {
    // Find the full seed data
    const seedData = seedTypes.find((seed: SeedType) => seed.code === itemCode);

    if (seedData) {
      setSelectedItem({
        itemType: "seed",
        itemData: seedData,
      });
    }
  };

  const formatGrowthTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
      return `${mins} minutes`;
    } else if (mins === 0) {
      return `${hours} hours`;
    } else {
      return `${hours} hours ${mins} minutes`;
    }
  };

  // Filter inventory items by type
  const seedInventory = inventory.filter(
    (item: UserInventory) => item.item_type === "seed"
  );

  return (
    <CommonModal isOpen={isOpen} onClose={onClose} maxWidth="650px">
      <Tabs defaultTab="seeds">
        <TabList>
          <TabButton tab="seeds" isFirst={true} icon="/assets/objects/bag.png">
            Bag
          </TabButton>
        </TabList>
        <div className="flex flex-col gap-3">
          {selectedItem && (
            <PixelCard className="h-fit overflow-y-auto -mt-[6px]">
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center justify-start gap-3">
                  <img
                    src={getCropsAssetUrl(selectedItem.itemData.code)}
                    className="w-6 h-6 object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                  <span className="text-3xl">
                    {selectedItem.itemData.name || ""}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <span className="text-2xl">
                    {selectedItem.itemData.description || ""}
                  </span>
                </div>
                <div className="flex items-center justify-start gap-8">
                  <div className="flex items-center justify-start gap-2">
                    <img
                      src="/assets/objects/clock.png"
                      className="w-5 h-5 object-contain"
                    />
                    <span className="text-2xl">
                      {selectedItem.itemType === "seed" &&
                        formatGrowthTime(
                          (selectedItem.itemData as SeedType).growth_time || 0
                        )}
                    </span>
                  </div>
                </div>
              </div>
            </PixelCard>
          )}
          {/* Seeds Tab */}
          <TabPanel tab="seeds">
            <PixelCard className="p-2 max-h-[400px] overflow-y-auto">
              {seedsLoading && (
                <p
                  className="text-center py-8"
                  style={{ color: "var(--color-text-primary)", opacity: 0.7 }}
                >
                  Loading seeds...
                </p>
              )}
              {seedsError && (
                <p className="text-red-600 text-center py-8">
                  {seedsError}
                </p>
              )}
              {!seedsLoading && (
                <>
                  {seedInventory.length === 0 ? (
                    <p
                      className="text-center py-8"
                      style={{
                        color: "var(--color-text-primary)",
                        opacity: 0.7,
                      }}
                    >
                      No seeds in inventory
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-4 mt-2">
                      {seedInventory.map((inventoryItem: UserInventory) => {
                        const seedData = seedTypes.find(
                          (seed: SeedType) =>
                            seed.code === inventoryItem.item_code
                        );
                        if (!seedData) return null;

                        return (
                          <ItemBox
                            key={inventoryItem.id}
                            icon={getCropsAssetUrl(seedData.code)}
                            name={seedData.name}
                            quantity={inventoryItem.quantity}
                            isSelected={
                              selectedItem?.itemType === "seed" &&
                              selectedItem.itemData.code === seedData.code
                            }
                            onClick={() => handleSelectClick(seedData.code)}
                          />
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </PixelCard>
          </TabPanel>
        </div>
      </Tabs>
    </CommonModal>
  );
};
