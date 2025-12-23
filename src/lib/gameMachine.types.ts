import type { Database } from "./database.types";
import type { FarmState } from "../hooks/useFarm";

/**
 * User data type
 */
export type UserData = Database["public"]["Tables"]["users"]["Row"];

/**
 * User inventory type
 */
export type UserInventory = Database["public"]["Tables"]["user_inventory"]["Row"];

/**
 * Complete game state containing all game data
 */
export interface GameState {
  user: UserData;
  inventory: UserInventory[];
  farm: FarmState;
}

/**
 * Serialized game action for server synchronization
 */
export interface GameAction {
  type: string;
  payload: unknown;
  timestamp: number;
  id: string; // Unique ID for deduplication
}

/**
 * Individual game event types
 */
export type PlantSeedEvent = {
  type: "PLANT_SEED";
  plotId: string;
  seedCode: string;
};

export type HarvestCropEvent = {
  type: "HARVEST_CROP";
  cropId: string;
};

export type BuyItemEvent = {
  type: "BUY_ITEM";
  itemCode: string;
  itemType: "seed" | "animal";
  quantity: number;
};

export type SellItemEvent = {
  type: "SELL_ITEM";
  itemCode: string;
  itemType: "seed" | "animal" | "product";
  quantity: number;
};

export type UnlockPlotEvent = {
  type: "UNLOCK_PLOT";
  plotId: string;
};

// Autosave events
export type AutosaveEvent = {
  type: "AUTOSAVE";
};

export type AutosaveSuccessEvent = {
  type: "AUTOSAVE_SUCCESS";
  data: AutosaveResponse;
};

export type AutosaveErrorEvent = {
  type: "AUTOSAVE_ERROR";
  error: string;
};

export type InitializeGameStateEvent = {
  type: "INITIALIZE_GAME_STATE";
  gameState: GameState;
};

/**
 * Union of all game events
 */
export type GameEvent =
  | PlantSeedEvent
  | HarvestCropEvent
  | BuyItemEvent
  | SellItemEvent
  | UnlockPlotEvent
  | AutosaveEvent
  | AutosaveSuccessEvent
  | AutosaveErrorEvent
  | InitializeGameStateEvent;

/**
 * Server response after autosave
 */
export interface AutosaveResponse {
  success: boolean;
  state: GameState;
  syncedAt: number;
  conflictResolutions?: ConflictResolution[];
}

/**
 * Conflict resolution info
 */
export interface ConflictResolution {
  actionId: string;
  reason: string;
  serverValue: unknown;
  clientValue: unknown;
}

/**
 * Game machine context - the complete game state
 */
export interface GameContext {
  // Core game state (user, inventory, farm)
  gameState: GameState | null;
  userId: string;

  // Action queue for batching
  actionQueue: GameAction[];

  // Sync state
  lastSyncedAt: number;
  isSyncing: boolean;

  // Error handling
  error: string | null;
}

/**
 * Type guards
 */
export const isPlantSeedEvent = (event: GameEvent): event is PlantSeedEvent =>
  event.type === "PLANT_SEED";

export const isHarvestCropEvent = (
  event: GameEvent
): event is HarvestCropEvent => event.type === "HARVEST_CROP";

export const isBuyItemEvent = (event: GameEvent): event is BuyItemEvent =>
  event.type === "BUY_ITEM";

export const isSellItemEvent = (event: GameEvent): event is SellItemEvent =>
  event.type === "SELL_ITEM";

export const isUnlockPlotEvent = (
  event: GameEvent
): event is UnlockPlotEvent => event.type === "UNLOCK_PLOT";
