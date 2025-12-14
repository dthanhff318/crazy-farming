import { useState, createContext, useContext } from "react";
import type { ReactNode } from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProps {
  defaultTab: string;
  children: ReactNode;
}

/**
 * Tabs - Complete tab system with buttons and panels
 */
export const Tabs = ({ defaultTab, children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  );
};

interface TabListProps {
  children: ReactNode;
}

/**
 * TabList - Container for tab buttons
 */
export const TabList = ({ children }: TabListProps) => {
  return <div className="flex justify-start">{children}</div>;
};

interface TabButtonProps {
  children: ReactNode;
  tab: string;
  isFirst?: boolean;
  icon?: ReactNode;
}

/**
 * TabButton - Individual tab button
 */
export const TabButton = ({
  children,
  tab,
  isFirst = false,
  icon,
}: TabButtonProps) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabButton must be used within Tabs");
  }

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === tab;

  // Determine which background image to use
  const getBackgroundImage = () => {
    if (isActive && isFirst) {
      return "/assets/tabs/tab-border-start.png";
    }
    return "/assets/tabs/tab-border-middle.png";
  };

  return (
    <button
      onClick={() => setActiveTab(tab)}
      className={`
        relative px-4 py-2 font-bold text-sm transition-all
        flex items-center justify-center gap-2
      `}
      style={{
        ...(isActive
          ? {
              borderImageSource: `url(${getBackgroundImage()})`,
              borderStyle: "solid",
              borderWidth: "12px",
              borderImageSlice: "4 4 4 4 fill",
              borderImageRepeat: "stretch",
              imageRendering: "pixelated",
              minWidth: "100px",
              minHeight: "44px",
              color: "var(--color-text-primary)",
              background: "var(--color-card-bg)",
              borderTopLeftRadius: "var(--radius-pixel)",
              borderTopRightRadius: "var(--radius-pixel)",
            }
          : {}),
      }}
    >
      {icon && <span className="text-base">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

interface TabPanelProps {
  children: ReactNode;
  tab: string;
}

/**
 * TabPanel - Content panel for each tab
 */
export const TabPanel = ({ children, tab }: TabPanelProps) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabPanel must be used within Tabs");
  }

  const { activeTab } = context;

  if (activeTab !== tab) {
    return null;
  }

  return <div className="w-full -mt-[6px]">{children}</div>;
};
