import { useState } from "react";
import { ZoomPanContainer } from "../components/ZoomPanContainer";
import { GameLayout } from "../components/GameLayout";
import { OnboardingModal } from "../components/OnboardingModal";
import { ShopModal } from "../components/ShopModal";
import { ProfileModal } from "../components/ProfileModal";
import { LoadingScreen } from "../components/LoadingScreen";
import { useUser } from "../hooks/useUser";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import MainIsland from "../components/MainIsland";

interface GameProps {
  user: User;
}

export const Game = ({ user }: GameProps) => {
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
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
    }
  };

  // Show loading while fetching user data
  if (loading) {
    return <LoadingScreen />;
  }

  return (
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
          <MainIsland onMarketClick={() => setIsShopModalOpen(true)} user={user} />
        </div>
      </ZoomPanContainer>

      {/* UI Overlays - Positioned absolutely above the zoom/pan container */}
      <GameLayout
        coins={userData?.coin || 0}
        level={userData?.level || 1}
        onAvatarClick={() => setIsProfileModalOpen(true)}
      />

      {needsOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      {/* Shop Modal - Rendered outside GameLayout to avoid z-index issues */}
      <ShopModal
        isOpen={isShopModalOpen}
        onClose={() => setIsShopModalOpen(false)}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userData={userData}
      />
    </div>
  );
};
