import { useState } from "react";
import { useSeedTypes } from "../hooks/useSeedTypes";
import { useAnimalTypes } from "../hooks/useAnimalTypes";
import { useUserInventory } from "../hooks/useUserInventory";
import { supabase } from "../lib/supabase";
import { queryClient } from "../lib/queryClient";
import type { Database } from "../lib/database.types";

type UserData = Database["public"]["Tables"]["users"]["Row"];

type Category = "seeds" | "animals" | "inventory";

interface MarketplaceSectionProps {
  userData: UserData | null;
}

/**
 * MarketplaceSection - Buy and sell items
 */
export const MarketplaceSection = ({ userData }: MarketplaceSectionProps) => {
  const [activeCategory, setActiveCategory] = useState<Category>("seeds");
  const [purchasingItem, setPurchasingItem] = useState<string | null>(null);
  const [sellingItem, setSellingItem] = useState<string | null>(null);

  const { seedTypes, loading: seedsLoading, error: seedsError } = useSeedTypes();
  const { animalTypes, loading: animalsLoading, error: animalsError } = useAnimalTypes();
  const { inventory, loading: inventoryLoading, error: inventoryError } = useUserInventory(userData?.id);

  const userLevel = userData?.level || 1;

  // Handle purchase
  const handlePurchase = async (itemType: "seed" | "animal", itemCode: string) => {
    if (!userData?.id) return;

    try {
      setPurchasingItem(itemCode);

      const { data, error } = await supabase.functions.invoke("purchase_item", {
        body: {
          userId: userData.id,
          itemType,
          itemCode,
          quantity: 1,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to purchase item");
      }

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["userData", userData.id] });
      queryClient.invalidateQueries({ queryKey: ["userInventory", userData.id] });

      alert(`Successfully purchased! Coins left: ${data.coins_left}`);
    } catch (error) {
      console.error("Failed to purchase item:", error);
      alert(error instanceof Error ? error.message : "Failed to purchase item");
    } finally {
      setPurchasingItem(null);
    }
  };

  // Handle sell
  const handleSell = async (itemType: string, itemCode: string) => {
    if (!userData?.id) return;

    try {
      setSellingItem(`${itemType}_${itemCode}`);

      const { data, error } = await supabase.functions.invoke("sell_item", {
        body: {
          userId: userData.id,
          itemType,
          itemCode,
          quantity: 1,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to sell item");
      }

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["userData", userData.id] });
      queryClient.invalidateQueries({ queryKey: ["userInventory", userData.id] });

      alert(`Successfully sold! Earned: ${data.coins_earned} coins`);
    } catch (error) {
      console.error("Failed to sell item:", error);
      alert(error instanceof Error ? error.message : "Failed to sell item");
    } finally {
      setSellingItem(null);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-farm-peach-100 to-farm-coral-100">
      <div className="px-4 py-20 pb-24 max-w-[600px] mx-auto sm:px-3 sm:pt-[70px] sm:pb-[90px]">
        {/* Header */}
        <h2 className="text-2xl font-bold text-farm-brown-800 mb-6 text-center">
          🏪 Marketplace
        </h2>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveCategory("seeds")}
            className={`flex-1 py-3 px-4 rounded-lg font-bold transition-colors ${
              activeCategory === "seeds"
                ? "bg-farm-green-400 text-white border-2 border-farm-green-600"
                : "bg-white text-farm-brown-800 border-2 border-farm-brown-300"
            }`}
          >
            🌾 Seeds
          </button>
          <button
            onClick={() => setActiveCategory("animals")}
            className={`flex-1 py-3 px-4 rounded-lg font-bold transition-colors ${
              activeCategory === "animals"
                ? "bg-farm-green-400 text-white border-2 border-farm-green-600"
                : "bg-white text-farm-brown-800 border-2 border-farm-brown-300"
            }`}
          >
            🐔 Animals
          </button>
          <button
            onClick={() => setActiveCategory("inventory")}
            className={`flex-1 py-3 px-4 rounded-lg font-bold transition-colors ${
              activeCategory === "inventory"
                ? "bg-farm-green-400 text-white border-2 border-farm-green-600"
                : "bg-white text-farm-brown-800 border-2 border-farm-brown-300"
            }`}
          >
            🎒 Inventory
          </button>
        </div>

        {/* Seeds Category */}
        {activeCategory === "seeds" && (
          <div>
            {seedsLoading && (
              <p className="text-farm-brown-600 text-center">Loading seeds...</p>
            )}
            {seedsError && <p className="text-red-600 text-center">{seedsError}</p>}
            {!seedsLoading && !seedsError && (
              <div className="flex flex-col gap-3">
                {seedTypes.map((seed) => {
                  const isLocked = userLevel < seed.unlock_level;
                  const canAfford = (userData?.coin || 0) >= seed.base_price;
                  const isPurchasing = purchasingItem === seed.code;

                  return (
                    <div
                      key={seed.id}
                      className={`bg-white rounded-xl border-3 border-farm-brown-400 p-4 shadow-md ${
                        isLocked ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{seed.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-farm-brown-800">
                            {seed.name}
                          </h4>
                          <p className="text-sm text-farm-brown-600 italic">
                            {seed.description}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs bg-farm-green-200 text-farm-brown-800 px-2 py-1 rounded">
                              ⏱️ {seed.growth_time}h
                            </span>
                            <span className="text-xs bg-farm-yellow-200 text-farm-brown-800 px-2 py-1 rounded">
                              💰 {seed.harvest_value} coins
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {isLocked ? (
                            <div className="text-xs text-farm-brown-600 bg-gray-200 px-3 py-2 rounded-lg border-2 border-gray-400">
                              Lv {seed.unlock_level}
                            </div>
                          ) : (
                            <>
                              <div className="text-sm font-bold text-farm-brown-800">
                                💰 {seed.base_price}
                              </div>
                              <button
                                onClick={() => handlePurchase("seed", seed.code)}
                                disabled={!canAfford || isPurchasing}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                                  canAfford && !isPurchasing
                                    ? "bg-farm-green-400 hover:bg-farm-green-500 text-white border-2 border-farm-green-600"
                                    : "bg-gray-300 text-gray-600 border-2 border-gray-400 cursor-not-allowed"
                                }`}
                              >
                                {isPurchasing ? "Buying..." : "Buy"}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Animals Category */}
        {activeCategory === "animals" && (
          <div>
            {animalsLoading && (
              <p className="text-farm-brown-600 text-center">Loading animals...</p>
            )}
            {animalsError && <p className="text-red-600 text-center">{animalsError}</p>}
            {!animalsLoading && !animalsError && (
              <div className="flex flex-col gap-3">
                {animalTypes.map((animal) => {
                  const isLocked = userLevel < animal.unlock_level;
                  const canAfford = (userData?.coin || 0) >= animal.base_price;
                  const isPurchasing = purchasingItem === animal.code;

                  return (
                    <div
                      key={animal.id}
                      className={`bg-white rounded-xl border-3 border-farm-brown-400 p-4 shadow-md ${
                        isLocked ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{animal.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-farm-brown-800">
                            {animal.name}
                          </h4>
                          <p className="text-sm text-farm-brown-600 italic">
                            {animal.description}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs bg-farm-sky-200 text-farm-brown-800 px-2 py-1 rounded">
                              ⏱️ {animal.production_time}h
                            </span>
                            <span className="text-xs bg-farm-yellow-200 text-farm-brown-800 px-2 py-1 rounded">
                              💰 {animal.production_value} coins
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {isLocked ? (
                            <div className="text-xs text-farm-brown-600 bg-gray-200 px-3 py-2 rounded-lg border-2 border-gray-400">
                              Lv {animal.unlock_level}
                            </div>
                          ) : (
                            <>
                              <div className="text-sm font-bold text-farm-brown-800">
                                💰 {animal.base_price}
                              </div>
                              <button
                                onClick={() => handlePurchase("animal", animal.code)}
                                disabled={!canAfford || isPurchasing}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                                  canAfford && !isPurchasing
                                    ? "bg-farm-green-400 hover:bg-farm-green-500 text-white border-2 border-farm-green-600"
                                    : "bg-gray-300 text-gray-600 border-2 border-gray-400 cursor-not-allowed"
                                }`}
                              >
                                {isPurchasing ? "Buying..." : "Buy"}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Inventory Category */}
        {activeCategory === "inventory" && (
          <div>
            {inventoryLoading && (
              <p className="text-farm-brown-600 text-center">Loading inventory...</p>
            )}
            {inventoryError && <p className="text-red-600 text-center">{inventoryError}</p>}
            {!inventoryLoading && !inventoryError && inventory.length === 0 && (
              <div className="bg-white rounded-2xl border-4 border-farm-brown-400 p-8 text-center">
                <p className="text-farm-brown-600 text-lg">Your inventory is empty</p>
                <p className="text-farm-brown-500 text-sm mt-2">
                  Purchase seeds or animals to get started!
                </p>
              </div>
            )}
            {!inventoryLoading && !inventoryError && inventory.length > 0 && (
              <div className="flex flex-col gap-3">
                {inventory.map((item) => {
                  const isSelling = sellingItem === `${item.item_type}_${item.item_code}`;

                  // Get item details based on type
                  let itemDetails: { name: string; icon: string; sell_price: number } | null = null;

                  if (item.item_type === "seed") {
                    const seed = seedTypes.find(s => s.code === item.item_code);
                    if (seed) {
                      itemDetails = {
                        name: seed.name,
                        icon: seed.icon || "🌾",
                        sell_price: seed.sell_price,
                      };
                    }
                  } else if (item.item_type === "animal") {
                    const animal = animalTypes.find(a => a.code === item.item_code);
                    if (animal) {
                      itemDetails = {
                        name: animal.name,
                        icon: animal.icon || "🐔",
                        sell_price: animal.sell_price,
                      };
                    }
                  }

                  if (!itemDetails) return null;

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border-3 border-farm-brown-400 p-4 shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{itemDetails.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-farm-brown-800">
                            {itemDetails.name}
                          </h4>
                          <div className="flex gap-2 mt-1">
                            <span className="text-sm bg-farm-green-200 text-farm-brown-800 px-2 py-1 rounded font-bold">
                              Quantity: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-sm font-bold text-farm-brown-800">
                            💰 {itemDetails.sell_price} each
                          </div>
                          <button
                            onClick={() => handleSell(item.item_type, item.item_code)}
                            disabled={isSelling}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                              !isSelling
                                ? "bg-farm-coral-400 hover:bg-farm-coral-500 text-white border-2 border-farm-coral-600"
                                : "bg-gray-300 text-gray-600 border-2 border-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {isSelling ? "Selling..." : "Sell 1"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
