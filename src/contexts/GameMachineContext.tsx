import { createContext, useContext, type ReactNode } from "react";
import type { GameState } from "../lib/gameMachine.types";

interface GameMachineContextValue {
  // Current game state
  gameState: GameState | null;
  user: GameState["user"] | null;
  inventory: GameState["inventory"];
  farm: GameState["farm"] | null;

  // Machine state
  currentState: string | object;
  isSyncing: boolean;
  error: string | null;
  actionQueue: any[];
  lastSyncedAt: number;

  // Actions
  initializeGameState: (gameState: GameState) => void;
  plantSeed: (plotId: string, seedCode: string) => void;
  harvestCrop: (cropId: string) => void;
  buyItem: (itemCode: string, itemType: "seed" | "animal", quantity: number) => void;
  sellItem: (
    itemCode: string,
    itemType: "seed" | "animal" | "product",
    quantity: number
  ) => void;
  unlockPlot: (plotId: string) => void;
}

const GameMachineContext = createContext<GameMachineContextValue | null>(null);

export const GameMachineProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: GameMachineContextValue;
}) => {
  return (
    <GameMachineContext.Provider value={value}>
      {children}
    </GameMachineContext.Provider>
  );
};

/**
 * Hook to access the game machine from any component
 */
export const useGameMachineContext = () => {
  const context = useContext(GameMachineContext);
  if (!context) {
    throw new Error(
      "useGameMachineContext must be used within GameMachineProvider"
    );
  }
  return context;
};
