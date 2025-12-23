import { useState } from "react";
import { FarmPlot } from "./FarmPlot";
import { useGameMachineContext } from "../contexts/GameMachineContext";

interface MainIslandProps {
  onMarketClick?: () => void;
}

const MainIsland = ({ onMarketClick }: MainIslandProps) => {
  const gridSize = 42; // Size of each grid cell
  const islandWidth = 1512;
  const islandHeight = 1512; // Assuming square island, adjust if needed
  const [showGrid] = useState(true);

  // Get farm data and actions from game machine
  const { farm, plantSeed } = useGameMachineContext();

  const gridStyle = {
    backgroundImage: `
      linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
    `,
    backgroundSize: `${gridSize}px ${gridSize}px`,
    width: `${islandWidth}px`,
    height: `${islandHeight}px`,
  };

  return (
    <div className="w-fit h-fit relative">
      {/* Main Island Image */}
      <img
        src="/assets/objects/main-land.png"
        alt="Farm Land"
        className="pixelated w-[1512px]"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={showGrid ? gridStyle : { display: "none" }}
      />

      {/* Market Building */}
      <img
        src="/assets/objects/market.webp"
        alt="Market"
        className="w-[126px] h-[84px] absolute top-[50%] left-[calc(50%+80px)] cursor-pointer hover:filter-[drop-shadow(0_0_2px_rgba(255,255,255,1))_drop-shadow(0_0_2px_rgba(255,255,255,1))_drop-shadow(0_0_2px_rgba(255,255,255,1))]"
        style={{ imageRendering: "pixelated" }}
        onClick={onMarketClick}
      />

      {/* Farm Plots - Dynamically rendered from game machine */}
      {farm?.plots.map((plot) => (
        <FarmPlot
          key={plot.id}
          x={plot.position_x ?? 0}
          y={plot.position_y ?? 0}
          plot={plot}
          onPlantSeed={plantSeed}
          userId=""
        />
      ))}
    </div>
  );
};

export default MainIsland;
