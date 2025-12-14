import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { PixelCard } from "./PixelCard";

interface CommonModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  maxWidth?: string;
}

/**
 * CommonModal - Reusable modal with slide-down animation
 *
 * Animation behavior:
 * - On open: Modal appears when close to final position (slide from -20% to 0)
 * - On close: Modal disappears immediately (no fade out animation)
 */
export const CommonModal = ({
  isOpen,
  onClose,
  children,
  title,
  maxWidth = "500px",
}: CommonModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Show modal immediately but start animation
      setShouldRender(true);
      // Small delay to trigger animation after render
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      // Close immediately without animation
      setIsAnimating(false);
      setShouldRender(false);
    }
  }, [isOpen]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-200 flex items-start justify-center px-4"
      onClick={onClose}
    >
      {/* Backdrop - fades in/out */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-200 ${
          isAnimating ? "opacity-20" : "opacity-0"
        }`}
      />

      {/* Modal */}
      <PixelCard
        onClick={(e) => e.stopPropagation()}
        className="absolute w-[95%] p-4 shadow-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          maxWidth,
          transform: isAnimating ? "translateY(0)" : "translateY(-20%)",
          opacity: isAnimating ? 1 : 0,
          transition:
            "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-1 right-1 w-7 h-7 flex items-center justify-center transition-transform hover:scale-110 z-10 bg-transparent border-none p-0 cursor-pointer"
          style={{ imageRendering: "pixelated" }}
        >
          <img
            src="/assets/buttons/close-button.png"
            alt="Close"
            width={28}
            height={28}
            style={{ imageRendering: "pixelated" }}
          />
        </button>

        {/* Title */}
        {title && (
          <h2
            className="text-2xl font-bold mb-4 text-center"
            style={{ color: "var(--color-text-primary)" }}
          >
            {title}
          </h2>
        )}

        {/* Content */}
        <div>{children}</div>
      </PixelCard>
    </div>
  );
};
