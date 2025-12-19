interface FarmPlotProps {
  x: number; // Grid x position
  y: number; // Grid y position
}

/**
 * FarmPlot - Individual farm plot component
 * Shows locked/unlocked state, crop status, and actions
 */
export const FarmPlot = ({ x, y }: FarmPlotProps) => {
  const gridSize = 42;

  return (
    <div
      className="w-12 h-12 flex absolute"
      style={{
        backgroundImage: "url('/assets/objects/plot.png')",
        backgroundSize: "contain",
        imageRendering: "pixelated",
        top: `calc(50% - 2.5px - ${y * gridSize}px)`,
        left: `calc(50% - 2.5px - ${x * gridSize}px)`,
      }}
    >
      {
        <img
          src="/assets/objects/plot-seed.png"
          alt="Crop"
          style={{
            imageRendering: "pixelated",
            backgroundPosition: "bottom",
          }}
          className="object-cover absolute -top-9 w-full h-auto"
        />
      }
    </div>
  );
};
