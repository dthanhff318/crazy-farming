import type { ReactNode } from "react";
import { CurrencyIcon } from "../helpers/currency";
import { PixelCard } from "./PixelCard";

interface MarketItemCardProps {
  icon: string | null;
  name: string;
  description?: string | null;
  isLocked?: boolean;
  lockLevel?: number;
  stats?: ReactNode;
  price?: number;
  action?: ReactNode;
  isImageIcon?: boolean; // true if icon is a URL, false if emoji
}

/**
 * MarketItemCard - Reusable card component for marketplace items
 */
export const MarketItemCard = ({
  icon,
  name,
  description,
  isLocked = false,
  lockLevel,
  stats,
  price,
  action,
  isImageIcon = false,
}: MarketItemCardProps) => {
  return (
    <PixelCard className={`p-4 shadow-md ${isLocked ? "opacity-60" : ""}`}>
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="text-5xl">
          {isImageIcon ? (
            <img
              src={icon || ""}
              alt={name}
              width={48}
              height={48}
              style={{ imageRendering: "pixelated" }}
            />
          ) : (
            icon || ""
          )}
        </div>

        {/* Details */}
        <div className="flex-1">
          <h4 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>{name}</h4>
          {description && (
            <p className="text-sm italic" style={{ color: "var(--color-text-primary)", opacity: 0.7 }}>{description}</p>
          )}
          {stats && <div className="flex gap-2 mt-2">{stats}</div>}
        </div>

        {/* Action */}
        <div className="flex flex-col items-end gap-2">
          {isLocked && lockLevel ? (
            <div className="text-xs bg-gray-200 px-3 py-2 rounded-lg border-2 border-gray-400" style={{ color: "var(--color-text-primary)", opacity: 0.6 }}>
              Lv {lockLevel}
            </div>
          ) : (
            <>
              {price !== undefined && (
                <div className="text-sm font-bold flex items-center gap-1" style={{ color: "var(--color-text-primary)" }}>
                  <CurrencyIcon size={14} /> {price}
                </div>
              )}
              {action}
            </>
          )}
        </div>
      </div>
    </PixelCard>
  );
};
