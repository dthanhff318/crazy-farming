import { setup, assign } from "xstate";
import type {
  GameContext,
  GameEvent,
  GameState,
} from "./gameMachine.types";

/**
 * Game State Machine
 *
 * States:
 * - playing: Normal gameplay, no pending actions
 * - accumulating: User actions are queued, waiting for autosave interval
 * - autosaving: Sending queued actions to server
 * - error: Error occurred during autosave
 */
export const gameMachine = setup({
  types: {} as {
    context: GameContext;
    events: GameEvent;
  },
  actors: {
    autosaveService: {} as any, // Will be provided by the consumer
  },
  actions: {
    /**
     * Plant seed action
     */
    plantSeed: assign(({ context, event }) => {
      if (event.type !== "PLANT_SEED") return context;

      return {
        actionQueue: [
          ...context.actionQueue,
          {
            type: "PLANT_SEED",
            payload: {
              plotId: event.plotId,
              seedCode: event.seedCode,
            },
            timestamp: Date.now(),
            id: `plant-${event.plotId}-${Date.now()}`,
          },
        ],
      };
    }),

    /**
     * Harvest crop action
     */
    harvestCrop: assign(({ context, event }) => {
      if (event.type !== "HARVEST_CROP") return context;

      return {
        actionQueue: [
          ...context.actionQueue,
          {
            type: "HARVEST_CROP",
            payload: {
              cropId: event.cropId,
            },
            timestamp: Date.now(),
            id: `harvest-${event.cropId}-${Date.now()}`,
          },
        ],
      };
    }),

    /**
     * Buy item action
     */
    buyItem: assign(({ context, event }) => {
      if (event.type !== "BUY_ITEM") return context;

      return {
        actionQueue: [
          ...context.actionQueue,
          {
            type: "BUY_ITEM",
            payload: {
              itemCode: event.itemCode,
              itemType: event.itemType,
              quantity: event.quantity,
            },
            timestamp: Date.now(),
            id: `buy-${event.itemCode}-${Date.now()}`,
          },
        ],
      };
    }),

    /**
     * Sell item action
     */
    sellItem: assign(({ context, event }) => {
      if (event.type !== "SELL_ITEM") return context;

      return {
        actionQueue: [
          ...context.actionQueue,
          {
            type: "SELL_ITEM",
            payload: {
              itemCode: event.itemCode,
              itemType: event.itemType,
              quantity: event.quantity,
            },
            timestamp: Date.now(),
            id: `sell-${event.itemCode}-${Date.now()}`,
          },
        ],
      };
    }),

    /**
     * Unlock plot action
     */
    unlockPlot: assign(({ context, event }) => {
      if (event.type !== "UNLOCK_PLOT") return context;

      return {
        actionQueue: [
          ...context.actionQueue,
          {
            type: "UNLOCK_PLOT",
            payload: {
              plotId: event.plotId,
            },
            timestamp: Date.now(),
            id: `unlock-${event.plotId}-${Date.now()}`,
          },
        ],
      };
    }),

    /**
     * Mark syncing as started
     */
    markSyncing: assign({
      isSyncing: true,
    }),

    /**
     * Clear action queue and update state after successful autosave
     */
    reconcileState: assign(({ context, event }) => {
      if (event.type !== "AUTOSAVE_SUCCESS") return context;

      return {
        gameState: event.data.state,
        actionQueue: [],
        lastSyncedAt: event.data.syncedAt,
        isSyncing: false,
        error: null,
      };
    }),

    /**
     * Set error message
     */
    setError: assign(({ context, event }) => {
      if (event.type !== "AUTOSAVE_ERROR") return context;

      return {
        isSyncing: false,
        error: event.error,
      };
    }),

    /**
     * Clear error
     */
    clearError: assign({
      error: null,
    }),

    /**
     * Initialize game state after API fetch
     */
    initializeGameState: assign(({ context, event }) => {
      if (event.type !== "INITIALIZE_GAME_STATE") return context;

      return {
        gameState: event.gameState,
      };
    }),
  },

  guards: {
    /**
     * Check if there are actions in the queue
     */
    hasQueuedActions: ({ context }) => {
      return context.actionQueue.length > 0;
    },
  },

  delays: {
    autosaveInterval: 10000, // 10 seconds
  },
}).createMachine({
  initial: "playing",
  context: {
    gameState: null,
    userId: "",
    actionQueue: [],
    lastSyncedAt: 0,
    isSyncing: false,
    error: null,
  },
  states: {
    /**
     * Playing state: Normal gameplay with no queued actions
     */
    playing: {
      on: {
        INITIALIZE_GAME_STATE: {
          actions: "initializeGameState",
        },
        PLANT_SEED: {
          actions: "plantSeed",
          target: "accumulating",
        },
        HARVEST_CROP: {
          actions: "harvestCrop",
          target: "accumulating",
        },
        BUY_ITEM: {
          actions: "buyItem",
          target: "accumulating",
        },
        SELL_ITEM: {
          actions: "sellItem",
          target: "accumulating",
        },
        UNLOCK_PLOT: {
          actions: "unlockPlot",
          target: "accumulating",
        },
      },
    },

    /**
     * Accumulating state: Collecting user actions, waiting for autosave timer
     */
    accumulating: {
      // Start 10-second timer when entering this state
      after: {
        autosaveInterval: {
          target: "autosaving",
          guard: "hasQueuedActions",
        },
      },
      on: {
        INITIALIZE_GAME_STATE: {
          actions: "initializeGameState",
        },
        // Continue queueing actions while accumulating
        PLANT_SEED: {
          actions: "plantSeed",
        },
        HARVEST_CROP: {
          actions: "harvestCrop",
        },
        BUY_ITEM: {
          actions: "buyItem",
        },
        SELL_ITEM: {
          actions: "sellItem",
        },
        UNLOCK_PLOT: {
          actions: "unlockPlot",
        },
      },
    },

    /**
     * Autosaving state: Sending queued actions to server
     * Note: The actual autosave service will be provided by the consumer
     */
    autosaving: {
      entry: "markSyncing",
      invoke: {
        src: "autosaveService",
        onDone: {
          target: "playing",
          actions: "reconcileState",
        },
        onError: {
          target: "error",
          actions: "setError",
        },
      },
    },

    /**
     * Error state: Autosave failed
     */
    error: {
      on: {
        // Allow user to continue playing (actions will queue again)
        PLANT_SEED: {
          actions: ["clearError", "plantSeed"],
          target: "accumulating",
        },
        HARVEST_CROP: {
          actions: ["clearError", "harvestCrop"],
          target: "accumulating",
        },
        BUY_ITEM: {
          actions: ["clearError", "buyItem"],
          target: "accumulating",
        },
        SELL_ITEM: {
          actions: ["clearError", "sellItem"],
          target: "accumulating",
        },
        UNLOCK_PLOT: {
          actions: ["clearError", "unlockPlot"],
          target: "accumulating",
        },
      },
    },
  },
});

/**
 * Helper function to create initial game context
 */
export const createInitialGameContext = (
  userId: string,
  gameState: GameState | null
): GameContext => ({
  gameState,
  userId,
  actionQueue: [],
  lastSyncedAt: Date.now(),
  isSyncing: false,
  error: null,
});
