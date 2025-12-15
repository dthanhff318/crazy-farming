import type { ReactNode, CSSProperties, HTMLAttributes } from "react";

interface PixelCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  borderImage?: string;
  className?: string;
  style?: CSSProperties;
  backgroundColor?: string;
}

/**
 * PixelCard - Reusable wrapper with pixel art border
 *
 * Default uses light-border.png, but can be customized with borderImage prop
 */
export const PixelCard = ({
  children,
  borderImage = "/assets/border/light-border.png",
  className = "",
  style = {},
  backgroundColor = "var(--color-card-bg)",
  ...props
}: PixelCardProps) => {
  return (
    <div
      className={className}
      style={{
        borderStyle: "solid",
        borderWidth: "12px",
        borderImageSource: `url(${borderImage})`,
        borderImageSlice: "4 4 4 4",
        borderImageRepeat: "stretch",
        imageRendering: "pixelated",
        borderRadius: "var(--radius-pixel)",
        backgroundColor,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
