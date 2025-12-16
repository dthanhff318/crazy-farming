import type { ReactNode } from "react";
import type { NavigationOption } from "../types";
import { CurrencyIcon } from "../helpers/currency";
import { PixelCard } from "./PixelCard";

interface RoundButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
}

/**
 * RoundButton - Circular button with round-button.png background
 */
const RoundButton = ({
  children,
  onClick,
  className = "",
  isActive = false,
}: RoundButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-16 h-16 flex items-center justify-center cursor-pointer transition-transform duration-200 ${className}`}
      style={{
        backgroundImage: "url(/assets/buttons/round-button.png)",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        border: "none",
        padding: 0,
        transform: isActive ? "scale(1.1)" : "scale(1)",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.transform = "scale(1.05)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.transform = "scale(1)";
        }
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
  activeSection: NavigationOption;
  onNavigate: (section: NavigationOption) => void;
}

/**
 * GameLayout - Complete game layout with header and navigation
 * Combines header (top) and navigation (right side) in one component
 */
export const GameLayout = ({
  children,
  coins,
  level,
  gems = 0,
  avatarUrl = "/assets/avatar/default-avatar.png",
  activeSection,
  onNavigate,
}: GameLayoutProps) => {
  const navItems = [
    { id: "farm" as NavigationOption, icon: "⏰", label: "Farm" },
    { id: "granary" as NavigationOption, icon: "💼", label: "Granary" },
    { id: "marketplace" as NavigationOption, icon: "📦", label: "Marketplace" },
    { id: "profile" as NavigationOption, icon: "🌽", label: "Profile" },
  ];

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

            <RoundButton>
              <CurrencyIcon size={24} />
            </RoundButton>
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
      <nav className="fixed right-3 bottom-20 z-[90] flex flex-col gap-3 pointer-events-auto">
        {navItems.map((item) => (
          <RoundButton
            key={item.id}
            isActive={activeSection === item.id}
            onClick={() => onNavigate(item.id)}
          >
            <span className="text-2xl">{item.icon}</span>
          </RoundButton>
        ))}
      </nav>

      {/* Main Content */}
      {children}
    </div>
  );
};
