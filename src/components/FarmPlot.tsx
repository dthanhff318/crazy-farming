import { useMemo } from "react";
import { useSelectedItemStore } from "../stores/selectedItemStore";
import { useGameMachineContext } from "../contexts/GameMachineContext";
import type { FarmPlot as FarmPlotType } from "../hooks/useFarm";
import { getPlantGrowthStageUrl } from "../helpers/normalizePath";
import { useNow } from "../hooks/useNow";

interface FarmPlotProps {
  x: number; // Grid x position
  y: number; // Grid y position
  plot: FarmPlotType;
  onPlantSeed: (plotId: string, seedCode: string) => void;
  userId: string;
}

/**
 * FarmPlot - Individual farm plot component
 * Shows locked/unlocked state, crop status, and actions
 */
export const FarmPlot = ({
  x,
  y,
  plot,
  onPlantSeed,
}: FarmPlotProps) => {
  const gridSize = 42;
  const { selectedItem, clearSelectedItem } = useSelectedItemStore();
  const { inventory } = useGameMachineContext();

  // Use live time updates if there's a crop planted
  // Auto-stop updates when crop is ready
  useNow({
    live: !!plot.user_crops,
    autoEndAt: plot.user_crops
      ? new Date(plot.user_crops.ready_at).getTime()
      : undefined,
    intervalMs: 1000,
  });

  const handlePlotClick = async () => {
    // Check if plot is unlocked
    if (!plot.is_unlocked) {
      console.log("Plot is locked");
      return;
    }

    // Check if a seed is selected
    if (!selectedItem) {
      console.log("No item selected");
      return;
    }

    // Check if selected item is a seed
    if (selectedItem.itemType !== "seed") {
      console.log("Selected item is not a seed");
      return;
    }

    // Find current inventory item for the selected seed
    const inventoryItem = inventory.find(
      (item) =>
        item.item_code === selectedItem.itemData.code &&
        item.item_type === "seed"
    );

    try {
      // Plant the seed
      await onPlantSeed(plot.id, selectedItem.itemData.code);

      // Only clear selection if this was the last item (quantity will become 0)
      if (inventoryItem && inventoryItem.quantity <= 1) {
        clearSelectedItem();
      }
    } catch (error) {
      console.error("Failed to plant seed:", error);
    }
  };

  // Calculate plant image URL with real-time stage updates
  const plantImageUrl = useMemo(() => {
    if (!plot.user_crops) return "";

    // Re-calculate when 'now' changes (triggers on every interval)
    return getPlantGrowthStageUrl(
      plot.user_crops.seed_code,
      plot.user_crops.planted_at,
      plot.user_crops.ready_at
    );
  }, [plot.user_crops]);

  return (
    <div
      className="w-12 h-12 flex absolute cursor-pointer"
      style={{
        backgroundImage: "url('/assets/objects/plot.png')",
        backgroundSize: "contain",
        imageRendering: "pixelated",
        top: `calc(50% - 2.5px - ${y * gridSize}px)`,
        left: `calc(50% - 2.5px - ${x * gridSize}px)`,
      }}
      onClick={handlePlotClick}
    >
      {plot.user_crops && (
        <img
          src={plantImageUrl}
          alt="Crop"
          style={{
            imageRendering: "pixelated",
            backgroundPosition: "bottom",
          }}
          className="object-cover absolute -top-9 w-full h-auto"
        />
      )}
    </div>
  );
};
