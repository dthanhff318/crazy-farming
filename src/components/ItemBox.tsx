import { PixelCard } from "./PixelCard";

interface ItemBoxProps {
  icon: string;
  name: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
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
