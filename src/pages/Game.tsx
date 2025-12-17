import { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { GameLayout } from "../components/GameLayout";
import { OnboardingModal } from "../components/OnboardingModal";
import { ShopModal } from "../components/ShopModal";
import { useUser } from "../hooks/useUser";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

interface GameProps {
  user: User;
}

export const Game = ({ user }: GameProps) => {
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const { userData, loading, updateUserName } = useUser(user);

  // Check if user needs onboarding (user not found in DB or name is null/empty)
  const needsOnboarding =
    !loading && (!userData || !userData.name || userData.name.trim() === "");

  const handleOnboardingComplete = async (farmerName: string) => {
    try {
      // Call edge function to create/update user
      const { error } = await supabase.functions.invoke("create_new_user", {
        body: {
          userId: user.id,
          name: farmerName,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to create user");
      }

      // Refresh user data by calling updateUserName (which refetches from DB)
      await updateUserName(farmerName);
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("Failed to create user. Please try again.");
    }
  };

  // Show loading while fetching user data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-farm-sky-100 to-farm-green-100">
        <div className="text-center">
          <div className="text-6xl mb-4">🌾</div>
          <p className="text-xl font-semibold text-farm-brown-800">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen mx-auto relative overflow-hidden bg-gray-100 game-container">
      {/* Game Layout - Header + Navigation + Content */}
      <TransformWrapper
        initialScale={2.2}
        minScale={1}
        maxScale={3}
        centerOnInit={true}
        wheel={{ step: 0.4 }}
        pinch={{ step: 30 }}
        centerZoomedOut={true}
      >
        {() => (
          <>
            {/* Farm Land - Zoomable and Pannable */}
            <TransformComponent
              wrapperClass="!w-full !h-full"
              contentClass="flex items-center justify-center"
              contentStyle={{
                backgroundImage: "url(/assets/objects/sea.png)",
                backgroundSize: "48px 48px",
                backgroundRepeat: "repeat",
                imageRendering: "pixelated",
                width: "100%",
                height: "100%",
              }}
            >
              <div className="flex justify-center items-center p-8" style={{}}>
                <img
                  src="/assets/objects/main-land.png"
                  alt="Farm Land"
                  className="pixelated"
                  style={{ imageRendering: "pixelated", maxWidth: "800px" }}
                />
              </div>
            </TransformComponent>
            <GameLayout
              coins={userData?.coin || 0}
              level={userData?.level || 1}
            />
            {needsOnboarding && (
              <OnboardingModal onComplete={handleOnboardingComplete} />
            )}
          </>
        )}
      </TransformWrapper>

      {/* Shop Modal - Rendered outside GameLayout to avoid z-index issues */}
      <ShopModal
        isOpen={isShopModalOpen}
        onClose={() => setIsShopModalOpen(false)}
      />
    </div>
  );
};
