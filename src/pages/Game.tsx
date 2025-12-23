import { useState, useEffect } from "react";
import { ZoomPanContainer } from "../components/ZoomPanContainer";
import { GameLayout } from "../components/GameLayout";
import { OnboardingModal } from "../components/OnboardingModal";
import { ShopModal } from "../components/ShopModal";
import { InventoryModal } from "../components/InventoryModal";
import { ProfileModal } from "../components/ProfileModal";
import { LoadingScreen } from "../components/LoadingScreen";
import { useGameState } from "../hooks/useGameState";
import { useGameMachine } from "../hooks/useGameMachine";
import { GameMachineProvider } from "../contexts/GameMachineContext";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import MainIsland from "../components/MainIsland";

interface GameProps {
  user: User;
}

export const Game = ({ user }: GameProps) => {
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Fetch complete game state
  const { gameState, loading, error } = useGameState(user?.id);

  // Initialize game machine (starts with null)
  const gameMachine = useGameMachine(user?.id || "", null);

  // Update machine when API returns data
  useEffect(() => {
    if (gameState) {
      gameMachine.initializeGameState(gameState);
    }
  }, [gameState]);

  // Check if user needs onboarding (user not found in DB or name is null/empty)
  const needsOnboarding =
    !loading &&
    gameMachine.user &&
    (!gameMachine.user.name || gameMachine.user.name.trim() === "");

  const handleOnboardingComplete = async (farmerName: string) => {
    try {
      // Call edge function to update user name
      const { error } = await supabase.functions.invoke("update_user_data", {
        body: {
          userId: user.id,
          name: farmerName,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to update user");
      }

      // TODO: Refetch game state to update machine
      window.location.reload();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  // Show loading while fetching game state
  if (loading || !gameState) {
    return <LoadingScreen />;
  }

  // Show error if fetch failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error loading game: {error}</div>
      </div>
    );
  }

  return (
    <GameMachineProvider value={gameMachine}>
      <div className="w-full h-screen mx-auto relative overflow-hidden bg-gray-100 game-container">
        {/* Game Layout - Header + Navigation + Content */}
        <ZoomPanContainer initialScale={0.8} minScale={0.5} maxScale={3}>
          <div
            className="flex items-center justify-center"
            style={{
              backgroundImage: "url(/assets/objects/sea.png)",
              backgroundSize: "48px 48px",
              backgroundRepeat: "repeat",
              imageRendering: "pixelated",
              width: "4116px",
              height: "2940px",
            }}
          >
            <MainIsland onMarketClick={() => setIsShopModalOpen(true)} />
          </div>
        </ZoomPanContainer>

        {/* UI Overlays - Positioned absolutely above the zoom/pan container */}
        <GameLayout
          coins={gameMachine.user?.coin || 0}
          level={gameMachine.user?.level || 1}
          onAvatarClick={() => setIsProfileModalOpen(true)}
          onInventoryClick={() => setIsInventoryModalOpen(true)}
        />

        {needsOnboarding && (
          <OnboardingModal onComplete={handleOnboardingComplete} />
        )}

        {/* Shop Modal - Rendered outside GameLayout to avoid z-index issues */}
        <ShopModal
          isOpen={isShopModalOpen}
          onClose={() => setIsShopModalOpen(false)}
          user={user}
        />

        {/* Inventory Modal */}
        <InventoryModal
          isOpen={isInventoryModalOpen}
          onClose={() => setIsInventoryModalOpen(false)}
          user={user}
        />

        {/* Profile Modal */}
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          userData={gameMachine.user}
        />
      </div>
    </GameMachineProvider>
  );
};
