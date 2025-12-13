import type { ReactNode } from "react";

interface ActivityProps {
  mode: boolean;
  children: ReactNode;
}

/**
 * Activity component - Controls visibility of child components
 * @param mode - Boolean to show/hide the component
 * @param children - Child components to render
 */
export const Activity = ({ mode, children }: ActivityProps) => {
  return (
    <div
      className={`transition-opacity duration-300 ease-in-out h-full w-full ${
        mode ? "opacity-100 visible block" : "opacity-0 invisible hidden"
      }`}
    >
      {children}
    </div>
  );
};
