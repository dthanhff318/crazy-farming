import { useState } from "react";
import { FarmPlot } from "./FarmPlot";

interface MainIslandProps {
  onMarketClick?: () => void;
}

const MainIsland = ({ onMarketClick }: MainIslandProps) => {
  const gridSize = 42; // Size of each grid cell
  const islandWidth = 1512;
  const islandHeight = 1512; // Assuming square island, adjust if needed
  const [showGrid] = useState(true);

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

      {/* Farm Plots - Using grid coordinates (x, y) */}
      <FarmPlot x={1} y={1} />
      <FarmPlot x={2} y={2} />
      <FarmPlot x={2} y={3} />
      <FarmPlot x={3} y={3} />
      <FarmPlot x={4} y={4} />
      <FarmPlot x={-8} y={8} />
      <FarmPlot x={-7} y={8} />
    </div>
  );
};

export default MainIsland;
