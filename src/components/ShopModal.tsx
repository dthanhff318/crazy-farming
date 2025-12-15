import { CommonModal } from "./CommonModal";
import { Tabs, TabList, TabButton, TabPanel } from "./Tabs";
import { PixelCard } from "./PixelCard";
import { ItemBox } from "./ItemBox";
import { useSeedTypes } from "../hooks/useSeedTypes";
import { useAnimalTypes } from "../hooks/useAnimalTypes";
import type { Database } from "../lib/database.types";
import { useState } from "react";

type SeedType = Database["public"]["Tables"]["seed_types"]["Row"];
type AnimalType = Database["public"]["Tables"]["animal_types"]["Row"];

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShopModal = ({ isOpen, onClose }: ShopModalProps) => {
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

  const [selectedItem, setSelectedItem] = useState<{
    itemType: "seed" | "animal";
    itemCode: string;
  } | null>(null);

  const handleSelectClick = (itemType: "seed" | "animal", itemCode: string) => {
    setSelectedItem({ itemType, itemCode });
  };

  return (
    <CommonModal isOpen={isOpen} onClose={onClose} maxWidth="650px">
      <Tabs defaultTab="seeds">
        <TabList>
          <TabButton tab="seeds" isFirst={true} icon="🌾">
            Seeds
          </TabButton>
          <TabButton tab="animals" icon="🐔">
            Animals
          </TabButton>
        </TabList>

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
      </Tabs>
    </CommonModal>
  );
};
