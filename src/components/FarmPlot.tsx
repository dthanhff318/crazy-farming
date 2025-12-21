import { useSelectedItemStore } from "../stores/selectedItemStore";
import type { FarmPlot as FarmPlotType } from "../hooks/useFarm";
import { getCropsAssetUrl } from "../helpers/normalizePath";

interface FarmPlotProps {
  x: number; // Grid x position
  y: number; // Grid y position
  plot: FarmPlotType;
  onPlantSeed: (plotId: string, seedCode: string) => Promise<void>;
}

/**
 * FarmPlot - Individual farm plot component
 * Shows locked/unlocked state, crop status, and actions
 */
export const FarmPlot = ({ x, y, plot, onPlantSeed }: FarmPlotProps) => {
  const gridSize = 42;
  const { selectedItem, clearSelectedItem } = useSelectedItemStore();

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

    try {
      // Plant the seed
      await onPlantSeed(plot.id, selectedItem.itemData.code);
      // Clear selection after successful planting
      clearSelectedItem();
    } catch (error) {
      console.error("Failed to plant seed:", error);
    }
  };

  console.log(plot.user_crops);
  return (
    <div
      className="w-12 h-12 flex absolute cursor-pointer"
      style={{
        backgroundImage: "url('/assets/objects/plot.png')",
        backgroundSize: "contain",
        imageRendering: "pixelated",
        top: `calc(50% - 2.5px - ${y * gridSize}px)`,
        left: `calc(50% - 2.5px - ${x * gridSize}px)`,
        // opacity: plot.is_unlocked ? 1 : 0.5,
        // zIndex: -y + 10,
      }}
      onClick={handlePlotClick}
    >
      {plot.user_crops && (
        <img
          src={getCropsAssetUrl(plot.user_crops.seed_code, "plant")}
          alt="Crop"
          style={{
            imageRendering: "pixelated",
            backgroundPosition: "bottom",
            // zIndex: -y + 10,
          }}
          className="object-cover absolute -top-9 w-full h-auto"
        />
      )}
    </div>
  );
};
