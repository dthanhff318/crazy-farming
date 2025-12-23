import { useState } from "react";
import { useSeedTypes } from "../hooks/useSeedTypes";
import { useAnimalTypes } from "../hooks/useAnimalTypes";
import { useGameMachineContext } from "../contexts/GameMachineContext";
import { supabase } from "../lib/supabase";
import { queryClient } from "../lib/queryClient";
import { PixelButton } from "./PixelButton";
import { MarketItemCard } from "./MarketItemCard";
import { CurrencyIcon } from "../helpers/currency";
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

  const {
    seedTypes,
    loading: seedsLoading,
    error: seedsError,
  } = useSeedTypes();
  const {
    animalTypes,
    loading: animalsLoading,
    error: animalsError,
  } = useAnimalTypes();
  const { inventory } = useGameMachineContext();

  const userLevel = userData?.level || 1;

  // Handle purchase
  const handlePurchase = async (
    itemType: "seed" | "animal",
    itemCode: string
  ) => {
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
      queryClient.invalidateQueries({
        queryKey: ["userInventory", userData.id],
      });

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
      queryClient.invalidateQueries({
        queryKey: ["userInventory", userData.id],
      });

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
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--color-text-primary)" }}>
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
              <p className="text-center" style={{ color: "var(--color-text-primary)", opacity: 0.7 }}>
                Loading seeds...
              </p>
            )}
            {seedsError && (
              <p className="text-red-600 text-center">{seedsError}</p>
            )}
            {!seedsLoading && !seedsError && (
              <div className="flex flex-col gap-3">
                {seedTypes.map((seed) => {
                  const isLocked = userLevel < seed.unlock_level;
                  const canAfford = (userData?.coin || 0) >= seed.base_price;
                  const isPurchasing = purchasingItem === seed.code;

                  return (
                    <MarketItemCard
                      key={seed.id}
                      icon={seed.icon}
                      name={seed.name}
                      description={seed.description}
                      isLocked={isLocked}
                      lockLevel={seed.unlock_level}
                      isImageIcon={true}
                      stats={
                        <>
                          <span className="text-xs bg-farm-green-200 px-2 py-1 rounded" style={{ color: "var(--color-text-primary)" }}>
                            ⏱️ {seed.growth_time}h
                          </span>
                          <span className="text-xs bg-farm-yellow-200 px-2 py-1 rounded flex items-center gap-1" style={{ color: "var(--color-text-primary)" }}>
                            <CurrencyIcon size={12} /> {seed.harvest_value} coins
                          </span>
                        </>
                      }
                      price={seed.base_price}
                      action={
                        <PixelButton
                          onClick={() => handlePurchase("seed", seed.code)}
                          disabled={!canAfford || isPurchasing}
                          variant="success"
                          className="text-sm"
                          style={{ minWidth: "80px", minHeight: "40px" }}
                        >
                          {isPurchasing ? "Buying..." : "Buy"}
                        </PixelButton>
                      }
                    />
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
              <p className="text-center" style={{ color: "var(--color-text-primary)", opacity: 0.7 }}>
                Loading animals...
              </p>
            )}
            {animalsError && (
              <p className="text-red-600 text-center">{animalsError}</p>
            )}
            {!animalsLoading && !animalsError && (
              <div className="flex flex-col gap-3">
                {animalTypes.map((animal) => {
                  const isLocked = userLevel < animal.unlock_level;
                  const canAfford = (userData?.coin || 0) >= animal.base_price;
                  const isPurchasing = purchasingItem === animal.code;

                  return (
                    <MarketItemCard
                      key={animal.id}
                      icon={animal.icon}
                      name={animal.name}
                      description={animal.description}
                      isLocked={isLocked}
                      lockLevel={animal.unlock_level}
                      isImageIcon={true}
                      stats={
                        <>
                          <span className="text-xs bg-farm-sky-200 px-2 py-1 rounded" style={{ color: "var(--color-text-primary)" }}>
                            ⏱️ {animal.production_time}h
                          </span>
                          <span className="text-xs bg-farm-yellow-200 px-2 py-1 rounded flex items-center gap-1" style={{ color: "var(--color-text-primary)" }}>
                            <CurrencyIcon size={12} /> {animal.production_value} coins
                          </span>
                        </>
                      }
                      price={animal.base_price}
                      action={
                        <PixelButton
                          onClick={() => handlePurchase("animal", animal.code)}
                          disabled={!canAfford || isPurchasing}
                          variant="success"
                          className="text-sm"
                          style={{ minWidth: "80px", minHeight: "40px" }}
                        >
                          {isPurchasing ? "Buying..." : "Buy"}
                        </PixelButton>
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Inventory Category */}
        {activeCategory === "inventory" && (
          <div>
            {inventory.length === 0 && (
              <div className="bg-white rounded-2xl border-4 border-farm-brown-400 p-8 text-center">
                <p className="text-lg" style={{ color: "var(--color-text-primary)" }}>
                  Your inventory is empty
                </p>
                <p className="text-sm mt-2" style={{ color: "var(--color-text-primary)", opacity: 0.7 }}>
                  Purchase seeds or animals to get started!
                </p>
              </div>
            )}
            {inventory.length > 0 && (
              <div className="flex flex-col gap-3">
                {inventory.map((item) => {
                  const isSelling =
                    sellingItem === `${item.item_type}_${item.item_code}`;

                  // Get item details based on type
                  let itemDetails: {
                    name: string;
                    icon: string;
                    sell_price: number;
                  } | null = null;

                  if (item.item_type === "seed") {
                    const seed = seedTypes.find(
                      (s) => s.code === item.item_code
                    );
                    if (seed) {
                      itemDetails = {
                        name: seed.name,
                        icon: seed.icon || "🌾",
                        sell_price: seed.sell_price,
                      };
                    }
                  } else if (item.item_type === "animal") {
                    const animal = animalTypes.find(
                      (a) => a.code === item.item_code
                    );
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
                    <MarketItemCard
                      key={item.id}
                      icon={itemDetails.icon}
                      name={itemDetails.name}
                      isImageIcon={true}
                      stats={
                        <span className="text-sm bg-farm-green-200 px-2 py-1 rounded font-bold" style={{ color: "var(--color-text-primary)" }}>
                          Quantity: {item.quantity}
                        </span>
                      }
                      price={itemDetails.sell_price}
                      action={
                        <PixelButton
                          onClick={() =>
                            handleSell(item.item_type, item.item_code)
                          }
                          disabled={isSelling}
                          variant="danger"
                          className="text-sm"
                          style={{ minWidth: "80px", minHeight: "40px" }}
                        >
                          {isSelling ? "Selling..." : "Sell 1"}
                        </PixelButton>
                      }
                    />
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
