import { useState } from "react";
import type { ButtonHTMLAttributes } from "react";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger";
  buttonImage?: string;
  pressedImage?: string;
}

/**
 * PixelButton - Pixel art style button with background image
 */
export const PixelButton = ({
  children,
  variant = "primary",
  className = "",
  disabled,
  buttonImage = "/assets/buttons/main-button.png",
  pressedImage = "/assets/buttons/main-button-pressed.png",
  ...props
}: PixelButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseStyles = `
    relative
    px-6 py-3
    font-bold
    text-white
    transition-none
    disabled:opacity-50
    disabled:cursor-not-allowed
    select-none
  `;

  // Different color overlays for variants
  const variantStyles = {
    primary: "hover:brightness-110",
    secondary: "hover:brightness-110 grayscale-[0.3]",
    success: "hover:brightness-110 hue-rotate-[80deg]",
    danger: "hover:brightness-110 hue-rotate-[-20deg]",
  };

  // Use pressed image when clicking
  const currentImage = isPressed && !disabled ? pressedImage : buttonImage;

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => !disabled && setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      {...props}
      style={{
        borderStyle: "solid",
        borderWidth: "8px 8px 10px 8px",
        borderImageSource: `url(${currentImage})`,
        borderImageSlice: "2 2 3 2 fill",
        borderImageRepeat: "stretch",
        imageRendering: "pixelated",
        minWidth: "120px",
        minHeight: "48px",
        transform: isPressed ? "scale(0.98)" : "scale(1)",
        transition: "transform 0.05s ease-out",
        borderRadius: "13.125px",
        ...props.style,
      }}
    >
      <span className="relative z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        {children}
      </span>
    </button>
  );
};
