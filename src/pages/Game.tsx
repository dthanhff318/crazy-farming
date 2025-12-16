import { useState } from "react";
import { Activity } from "../components/Activity";
import { GameLayout } from "../components/GameLayout";
import { OnboardingModal } from "../components/OnboardingModal";
import { FarmSection } from "../components/FarmSection";
import { BuildingDetailSection } from "../components/BuildingDetailSection";
import { GranarySection } from "../components/GranarySection";
import { MarketplaceSection } from "../components/MarketplaceSection";
import { ProfileSection } from "../components/ProfileSection";
import { ShopModal } from "../components/ShopModal";
import { useUser } from "../hooks/useUser";
import { supabase } from "../lib/supabase";
import type { NavigationOption } from "../types";
import type { User } from "@supabase/supabase-js";
import type { Database } from "../lib/database.types";

type BuildingType = Database["public"]["Tables"]["building_types"]["Row"];

interface GameProps {
  user: User;
}

export const Game = ({ user }: GameProps) => {
  const [activeSection, setActiveSection] = useState<NavigationOption>("farm");
  const [selectedBuilding, setSelectedBuilding] = useState<{
    building: BuildingType;
    userBuildingId: string;
  } | null>(null);
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

  const handleNavigate = (section: NavigationOption) => {
    setActiveSection(section);
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
    <div className="w-full max-w-[600px] h-screen mx-auto relative overflow-hidden bg-gray-100 game-container">
      {/* Onboarding Modal */}
      {needsOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      {/* Game Layout - Header + Navigation + Content */}
      <GameLayout
        coins={userData?.coin || 0}
        level={userData?.level || 1}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      >
        {/* Game Sections Container - Wrapper for slide animation */}
        <div className="relative w-full h-full">
          {/* Game Sections - Controlled by Activity component */}
          <Activity mode={activeSection === "farm" && selectedBuilding === null}>
            <FarmSection
              userData={userData}
              onBuildingClick={(building, userBuildingId) =>
                setSelectedBuilding({ building, userBuildingId })
              }
              onOpenShop={() => setIsShopModalOpen(true)}
            />
          </Activity>

          <Activity mode={activeSection === "granary"}>
            <GranarySection />
          </Activity>

          <Activity mode={activeSection === "marketplace"}>
            <MarketplaceSection userData={userData} />
          </Activity>

          <Activity mode={activeSection === "profile"}>
            <ProfileSection userData={userData} />
          </Activity>

          {/* Building Detail Section */}
          <Activity mode={selectedBuilding !== null}>
            <BuildingDetailSection
              userData={userData}
              building={selectedBuilding?.building || null}
              userBuildingId={selectedBuilding?.userBuildingId}
              onBack={() => setSelectedBuilding(null)}
            />
          </Activity>
        </div>
      </GameLayout>

      {/* Shop Modal - Rendered outside GameLayout to avoid z-index issues */}
      <ShopModal
        isOpen={isShopModalOpen}
        onClose={() => setIsShopModalOpen(false)}
      />
    </div>
  );
};
