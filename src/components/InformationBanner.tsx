import { CurrencyIcon } from "../helpers/currency";
import { PixelCard } from "./PixelCard";

interface InformationBannerProps {
  coins: number;
  level: number;
  gems?: number;
  avatarUrl?: string;
}

/**
 * InformationBanner - Displays game information at the top
 * Layout matches Sunflowerland style with circular avatar and stats
 */
export const InformationBanner = ({
  coins,
  level,
  gems = 0,
  avatarUrl = "/assets/avatar/default-avatar.png",
}: InformationBannerProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
      <div className="flex items-start justify-between px-3 pt-3">
        {/* Left Side - Avatar and circular buttons */}
        <div className="flex flex-col gap-3 pointer-events-auto">
          {/* Avatar */}
          <div className="relative">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-20 h-20 rounded-full border-4 border-white shadow-xl"
              style={{ imageRendering: "pixelated" }}
            />
          </div>

          {/* Circular Buttons */}
          <PixelCard
            className="w-16 h-16 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            backgroundColor="white"
          >
            <span className="text-2xl">🏠</span>
          </PixelCard>

          <PixelCard
            className="w-16 h-16 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            backgroundColor="white"
          >
            <CurrencyIcon size={24} />
          </PixelCard>
        </div>

        {/* Right Side - Stats */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          {/* Top Row: Level, Coins, Gems */}
          <div className="flex items-center gap-2">
            {/* Level */}
            <PixelCard
              className="px-3 py-2 flex items-center justify-center"
              backgroundColor="white"
            >
              <span className="text-lg font-bold text-farm-brown-800">
                {level}
              </span>
            </PixelCard>

            {/* Coins */}
            <PixelCard
              className="px-3 py-2 flex items-center gap-1.5"
              backgroundColor="white"
            >
              <CurrencyIcon size={20} />
              <span className="text-lg font-bold text-farm-brown-800">
                {coins}
              </span>
            </PixelCard>

            {/* Gems */}
            <PixelCard
              className="px-3 py-2 flex items-center gap-1.5"
              backgroundColor="white"
            >
              <span className="text-lg">💎</span>
              <span className="text-lg font-bold text-farm-brown-800">
                {gems}
              </span>
            </PixelCard>
          </div>

          {/* Bottom Row: Additional Stats */}
          <div className="flex items-center gap-2 justify-end">
            <PixelCard
              className="px-3 py-2 flex items-center justify-center"
              backgroundColor="white"
            >
              <span className="text-lg font-bold text-farm-brown-800">0</span>
            </PixelCard>

            <PixelCard
              className="w-10 h-10 flex items-center justify-center"
              backgroundColor="white"
            >
              <span className="text-lg">🌸</span>
            </PixelCard>
          </div>
        </div>
      </div>
    </div>
  );
};
