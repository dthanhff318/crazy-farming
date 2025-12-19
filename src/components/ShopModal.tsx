import { CommonModal } from "./CommonModal";
import { Tabs, TabList, TabButton, TabPanel } from "./Tabs";
import { PixelCard } from "./PixelCard";
import { ItemBox } from "./ItemBox";
import { useSeedTypes } from "../hooks/useSeedTypes";
import { useAnimalTypes } from "../hooks/useAnimalTypes";
import { useUser } from "../hooks/useUser";
import type { Database } from "../lib/database.types";
import { useState } from "react";
import { PixelButton } from "./PixelButton";
import { CurrencyIcon } from "../helpers/currency";
import { supabase } from "../lib/supabase";
import { queryClient } from "../lib/queryClient";
import type { User } from "@supabase/supabase-js";

type SeedType = Database["public"]["Tables"]["seed_types"]["Row"];
type AnimalType = Database["public"]["Tables"]["animal_types"]["Row"];

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export const ShopModal = ({ isOpen, onClose, user }: ShopModalProps) => {
  const {
    seedTypes,
    loading: seedsLoading,
    error: seedsError,
  } = useSeedTypes();
  const {
    animalTypes,
    loading: animalsLoading,
    error: animalsError,
  } = useAnimalTypes();
  const { userData } = useUser(user);

  const [selectedItem, setSelectedItem] = useState<{
    itemType: "seed" | "animal";
    itemCode: string;
  } | null>(null);

  const handleSelectClick = (itemType: "seed" | "animal", itemCode: string) => {
    setSelectedItem({ itemType, itemCode });
  };

  const handlePurchase = async (quantity: number) => {
    if (!selectedItem || !user) return;

    try {
      const { error } = await supabase.functions.invoke("purchase_item", {
        body: {
          userId: user.id,
          itemType: selectedItem.itemType,
          itemCode: selectedItem.itemCode,
          quantity,
        },
      });

      if (error) throw new Error(error.message || "Failed to purchase item");

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["userData", user.id] });
      queryClient.invalidateQueries({ queryKey: ["userInventory", user.id] });
    } catch (error) {
      console.error("Purchase error:", error);
      alert(error instanceof Error ? error.message : "Failed to purchase item");
    }
  };

  const getResourceData = (item: {
    itemType: "seed" | "animal";
    itemCode: string;
  }) => {
    if (item.itemType === "seed") {
      return seedTypes.find((seed: SeedType) => seed.code === item.itemCode);
    } else if (item.itemType === "animal") {
      return animalTypes.find(
        (animal: AnimalType) => animal.code === item.itemCode
      );
    }
    return null;
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

  return (
    <CommonModal isOpen={isOpen} onClose={onClose} maxWidth="650px">
      <Tabs defaultTab="seeds">
        <TabList>
          <TabButton
            tab="seeds"
            isFirst={true}
            icon="/assets/objects/resources.png"
          >
            Seeds
          </TabButton>
          {/* <TabButton tab="animals" icon="/assets/objects/resources.png">
            Animals
          </TabButton> */}
        </TabList>
        <div className="flex flex-col gap-3">
          {selectedItem && (
            <PixelCard className="h-fit overflow-y-auto -mt-[6px]">
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center justify-start gap-3">
                  <img
                    src={getResourceData(selectedItem)?.icon || ""}
                    className="w-6 h-6 object-contain"
                  />
                  <span className="text-3xl">
                    {getResourceData(selectedItem)?.name || ""}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <span className="text-2xl">
                    {getResourceData(selectedItem)?.description || ""}
                  </span>
                </div>
                <div className="flex items-center justify-start gap-8">
                  <div className="flex items-center justify-start gap-2">
                    <img
                      src="/assets/objects/clock.png"
                      className="w-5 h-5 object-contain"
                    />
                    <span className="text-2xl">
                      {formatGrowthTime(
                        (getResourceData(selectedItem) as SeedType)
                          ?.growth_time || 0
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <CurrencyIcon size={16} />
                    <span className="text-2xl">
                      {getResourceData(selectedItem)?.base_price || 0}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 w-full mt-2">
                  <PixelButton
                    className="w-full"
                    onClick={() => handlePurchase(1)}
                    disabled={
                      !userData ||
                      userData.coin <
                        (getResourceData(selectedItem)?.base_price || 0)
                    }
                  >
                    Buy 1
                  </PixelButton>
                  <PixelButton
                    className="w-full"
                    onClick={() => handlePurchase(10)}
                    disabled={
                      !userData ||
                      userData.coin <
                        (getResourceData(selectedItem)?.base_price || 0) * 10
                    }
                  >
                    Buy 10
                  </PixelButton>
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
                <p className="text-red-600 text-center py-8">{seedsError}</p>
              )}
              {!seedsLoading && !seedsError && (
                <div className="flex flex-wrap gap-3">
                  {seedTypes.map((seed: SeedType) => {
                    return (
                      <ItemBox
                        key={seed.id}
                        icon={seed.icon || ""}
                        name={seed.name}
                        isSelected={seed.code === selectedItem?.itemCode}
                        onClick={() => handleSelectClick("seed", seed.code)}
                      />
                    );
                  })}
                </div>
              )}
            </PixelCard>
          </TabPanel>

          {/* Animals Tab */}
          <TabPanel tab="animals">
            <PixelCard className="p-2 max-h-[400px] overflow-y-auto">
              {animalsLoading && (
                <p
                  className="text-center py-8"
                  style={{ color: "var(--color-text-primary)", opacity: 0.7 }}
                >
                  Loading animals...
                </p>
              )}
              {animalsError && (
                <p className="text-red-600 text-center py-8">{animalsError}</p>
              )}
              {!animalsLoading && !animalsError && (
                <div className="flex flex-wrap gap-4">
                  {animalTypes.map((animal: AnimalType) => {
                    return (
                      <ItemBox
                        key={animal.id}
                        icon={animal.icon || ""}
                        name={animal.name}
                        isSelected={animal.code === selectedItem?.itemCode}
                        onClick={() => handleSelectClick("animal", animal.code)}
                      />
                    );
                  })}
                </div>
              )}
            </PixelCard>
          </TabPanel>
        </div>
      </Tabs>
    </CommonModal>
  );
};
