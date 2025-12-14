import type { ReactNode } from "react";

interface ActivityProps {
  mode: boolean;
  children: ReactNode;
}

/**
 * Activity component - Controls visibility of child components with slide animation
 * @param mode - Boolean to show/hide the component
 * @param children - Child components to render
 */
export const Activity = ({ mode, children }: ActivityProps) => {
  return (
    <div
      className={`absolute top-0 left-0 h-full w-full transition-transform duration-300 ease-in-out ${
        mode ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {children}
    </div>
  );
};
