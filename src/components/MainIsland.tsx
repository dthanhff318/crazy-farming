interface MainIslandProps {
  onMarketClick?: () => void;
}

const MainIsland = ({ onMarketClick }: MainIslandProps) => {
  return (
    <div className="w-fit h-fit relative">
      <img
        src="/assets/objects/main-land.png"
        alt="Farm Land"
        className="pixelated w-[1512px]"
        style={{ imageRendering: "pixelated" }}
      />
      <img
        src="/assets/objects/market.webp"
        alt="Market"
        className="w-[126px] h-[84px] absolute top-[50%] left-[calc(50%+80px)] cursor-pointer hover:filter-[drop-shadow(0_0_2px_rgba(255,255,255,1))_drop-shadow(0_0_2px_rgba(255,255,255,1))_drop-shadow(0_0_2px_rgba(255,255,255,1))]"
        style={{ imageRendering: "pixelated" }}
        onClick={onMarketClick}
      />
    </div>
  );
};

export default MainIsland;
