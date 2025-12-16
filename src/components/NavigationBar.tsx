import type { NavigationOption } from "../types";
import { PixelCard } from "./PixelCard";

interface NavigationBarProps {
  activeSection: NavigationOption;
  onNavigate: (section: NavigationOption) => void;
}

/**
 * NavigationBar - Vertical navigation on right side
 * Matches Sunflowerland layout
 */
export const NavigationBar = ({
  activeSection,
  onNavigate,
}: NavigationBarProps) => {
  const navItems = [
    { id: "farm" as NavigationOption, icon: "⏰", label: "Farm" },
    { id: "granary" as NavigationOption, icon: "💼", label: "Granary" },
    { id: "marketplace" as NavigationOption, icon: "📦", label: "Marketplace" },
    { id: "profile" as NavigationOption, icon: "🌽", label: "Profile" },
  ];

  return (
    <nav className="fixed right-3 bottom-20 z-[90] flex flex-col gap-3 pointer-events-auto">
      {navItems.map((item) => (
        <PixelCard
          key={item.id}
          className={`w-16 h-16 flex items-center justify-center cursor-pointer transition-all ${
            activeSection === item.id
              ? "scale-110 shadow-xl"
              : "hover:scale-105 hover:shadow-lg"
          }`}
          backgroundColor="white"
          onClick={() => onNavigate(item.id)}
        >
          <span className="text-2xl">{item.icon}</span>
        </PixelCard>
      ))}
    </nav>
  );
};
