import { useMachine } from "@xstate/react";
import { gameMachine, createInitialGameContext } from "../lib/gameMachine";
import type { GameState } from "../lib/gameMachine.types";

/**
 * Autosave service - sends queued actions to server
 */
const autosaveService = async ({ context }: { context: any }) => {
  if (context.actionQueue.length === 0) {
    // No actions to sync, return current state
    return {
      success: true,
      state: context.gameState,
      syncedAt: Date.now(),
    };
  }

  // TODO: Implement actual autosave API call
  // For now, just simulate success
  console.log("Autosaving actions:", context.actionQueue);

  // Simulate server response
  return {
    success: true,
    state: context.gameState, // Server would return reconciled state
    syncedAt: Date.now(),
  };
};

/**
 * Hook to interact with the game state machine
 */
export const useGameMachine = (
  userId: string,
  initialGameState: GameState | null
) => {
  const [state, send] = useMachine(
    gameMachine.provide({
      actors: {
        autosaveService,
      },
    }),
    {
      input: createInitialGameContext(userId, initialGameState),
    }
  );

  return {
    // Current game state
    gameState: state.context.gameState,
    user: state.context.gameState?.user || null,
    inventory: state.context.gameState?.inventory || [],
    farm: state.context.gameState?.farm || null,

    // Machine state
    currentState: state.value,
    isSyncing: state.context.isSyncing,
    error: state.context.error,
    actionQueue: state.context.actionQueue,
    lastSyncedAt: state.context.lastSyncedAt,

    // Actions
    initializeGameState: (gameState: GameState) =>
      send({ type: "INITIALIZE_GAME_STATE", gameState }),
    plantSeed: (plotId: string, seedCode: string) =>
      send({ type: "PLANT_SEED", plotId, seedCode }),
    harvestCrop: (cropId: string) => send({ type: "HARVEST_CROP", cropId }),
    buyItem: (
      itemCode: string,
      itemType: "seed" | "animal",
      quantity: number
    ) => send({ type: "BUY_ITEM", itemCode, itemType, quantity }),
    sellItem: (
      itemCode: string,
      itemType: "seed" | "animal" | "product",
      quantity: number
    ) => send({ type: "SELL_ITEM", itemCode, itemType, quantity }),
    unlockPlot: (plotId: string) => send({ type: "UNLOCK_PLOT", plotId }),
  };
};
