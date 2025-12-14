import type { ReactNode } from "react";

interface TabButtonProps {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
  isFirst?: boolean;
  icon?: ReactNode;
}

/**
 * TabButton - Pixel art styled tab button
 *
 * Uses different background images:
 * - First tab active: tab-border-start.png
 * - Other tabs: tab-border-middle.png
 */
export const TabButton = ({
  children,
  isActive,
  onClick,
  isFirst = false,
  icon,
}: TabButtonProps) => {
  // Determine which background image to use
  const getBackgroundImage = () => {
    if (isActive && isFirst) {
      return "/assets/tabs/tab-border-start.png";
    }
    return "/assets/tabs/tab-border-middle.png";
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative px-4 py-2 font-bold text-sm transition-all
        flex items-center justify-center gap-2
        ${isActive ? "scale-105" : "opacity-70 hover:opacity-100"}
      `}
      style={{
        borderStyle: "solid",
        borderWidth: "8px",
        borderImageSource: `url(${getBackgroundImage()})`,
        borderImageSlice: "4 4 4 4 fill",
        borderImageRepeat: "stretch",
        imageRendering: "pixelated",
        minWidth: "100px",
        minHeight: "44px",
        color: isActive ? "var(--color-text-primary)" : "rgba(62, 39, 49, 0.6)",
        background: "var(--color-card-bg)",
        borderTopLeftRadius: "var(--radius-pixel)",
        borderTopRightRadius: "var(--radius-pixel)",
      }}
    >
      {icon && <span className="text-base">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
