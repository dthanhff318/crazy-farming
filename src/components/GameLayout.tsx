import type { ReactNode } from "react";
import { CurrencyIcon } from "../helpers/currency";
import { PixelCard } from "./PixelCard";

interface RoundButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * RoundButton - Circular button with round-button.png background
 */
const RoundButton = ({
  children,
  onClick,
  className = "",
}: RoundButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-15 h-15 flex items-center justify-center cursor-pointer transition-transform duration-200 ${className}`}
      style={{
        backgroundImage: "url(/assets/buttons/round-button.png)",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        border: "none",
        padding: 0,
      }}
    >
      {children}
    </button>
  );
};

interface GameLayoutProps {
  children: ReactNode;
  coins: number;
  level: number;
  gems?: number;
  avatarUrl?: string;
}

/**
 * GameLayout - Complete game layout with header and navigation
 * Combines header (top) and navigation (right side) in one component
 */
export const GameLayout = ({
  children,
  coins,
  avatarUrl = "/assets/avatar/default-avatar.png",
}: GameLayoutProps) => {

  return (
    <div className="relative w-full h-full">
      {/* Header - Top */}
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
          </div>

          {/* Right Side - Stats */}
          <div className="flex flex-col gap-2 pointer-events-auto">
            <PixelCard
              className="px-3 py-2 flex items-center gap-1.5"
              backgroundColor="white"
            >
              <CurrencyIcon size={20} />
              <span className="text-lg font-bold text-farm-brown-800">
                {coins}
              </span>
            </PixelCard>

            {/* Bottom Row: Additional Stats */}
            <div className="flex items-center gap-2 justify-end"></div>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Right Side */}
      <div className="fixed right-3 bottom-3 z-[90] flex flex-col gap-3 pointer-events-auto">
        <RoundButton onClick={() => {}}>
          <img
            src="/assets/buttons/setting-icon.png"
            alt="Settings"
            className="w-9 h-9"
          />
        </RoundButton>
      </div>

      {/* Main Content */}
      {children}
    </div>
  );
};
