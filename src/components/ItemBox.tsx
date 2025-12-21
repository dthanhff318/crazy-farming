import { PixelCard } from "./PixelCard";

interface ItemBoxProps {
  icon: string;
  name: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
  quantity?: number;
}

/**
 * ItemBox - Selectable item box with pixel art borders
 */
export const ItemBox = ({
  icon,
  name,
  isSelected,
  onClick,
  className = "",
  quantity,
}: ItemBoxProps) => {
  return (
    <PixelCard
      className={`w-12 h-12 relative cursor-pointer ${className}`}
      onClick={onClick}
    >
      <img
        src={icon}
        alt={name}
        className="w-full h-full object-contain"
        style={{ imageRendering: "pixelated" }}
      />
      {quantity !== undefined && quantity > 0 && (
        <PixelCard
          backgroundColor="var(--color-gray-background)"
          className="absolute top-[-24px] right-[-24px] bg-white text-black px-1 rounded-tl h-7 w-[40px] flex items-center justify-center text-2xl z-1"
          borderImage="/assets/border/gray-border.png"
        >
          <span className="text-2xl w-fit">{quantity}</span>
        </PixelCard>
      )}
      {isSelected && (
        <>
          <img
            src="/assets/border/select-bl.png"
            alt="BOTTOM_LEFT_BORDER"
            className="absolute top-[18px] right-[18px] w-full h-full object-contain"
            style={{ imageRendering: "pixelated" }}
          />
          <img
            src="/assets/border/select-br.png"
            alt="BOTTOM_RIGHT_BORDER"
            className="absolute top-[18px] left-[18px] w-full h-full object-contain"
            style={{ imageRendering: "pixelated" }}
          />
          <img
            src="/assets/border/select-tl.png"
            alt="TOP_LEFT_BORDER"
            className="absolute bottom-[18px] right-[18px] w-full h-full object-contain"
            style={{ imageRendering: "pixelated" }}
          />
          <img
            src="/assets/border/select-tr.png"
            alt="TOP_RIGHT_BORDER"
            className="absolute bottom-[18px] left-[18px] w-full h-full object-contain"
            style={{ imageRendering: "pixelated" }}
          />
        </>
      )}
    </PixelCard>
  );
};
