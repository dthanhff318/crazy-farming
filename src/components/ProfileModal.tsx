import { CommonModal } from "./CommonModal";
import { Tabs, TabList, TabButton, TabPanel } from "./Tabs";
import { PixelCard } from "./PixelCard";
import { PixelButton } from "./PixelButton";
import { CurrencyIcon } from "../helpers/currency";
import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";

type UserData = Database["public"]["Tables"]["users"]["Row"];

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData | null;
}

/**
 * ProfileModal - Displays user profile information in a modal
 * Opens when user clicks on avatar
 */
export const ProfileModal = ({
  isOpen,
  onClose,
  userData,
}: ProfileModalProps) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!userData) {
    return (
      <CommonModal isOpen={isOpen} onClose={onClose} maxWidth="650px">
        <div className="p-6">
          <p className="text-center text-farm-brown-600">Loading profile...</p>
        </div>
      </CommonModal>
    );
  }

  return (
    <CommonModal isOpen={isOpen} onClose={onClose} maxWidth="650px">
      <Tabs defaultTab="profile">
        <TabList>
          <TabButton
            tab="profile"
            isFirst={true}
            icon="/assets/objects/player.png"
          >
            Info
          </TabButton>
          {/* <TabButton tab="achievements" icon="/assets/objects/resources.png">
            Achievements
          </TabButton>
          <TabButton tab="settings" icon="/assets/objects/resources.png">
            Settings
          </TabButton> */}
        </TabList>

        <div className="flex flex-col gap-3">
          {/* Profile Tab */}
          <TabPanel tab="profile">
            <PixelCard className="p-4 max-h-[400px] overflow-y-auto">
              {/* Profile Header */}
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🌾</div>
                <h3 className="text-2xl font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>
                  {userData.name || "Farmer"}
                </h3>
                <p className="text-lg opacity-80" style={{ color: "var(--color-text-primary)" }}>
                  Level {userData.level} Farmer
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Level */}
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-2xl mb-1">⭐</div>
                    <p className="text-sm opacity-80 mb-1" style={{ color: "var(--color-text-primary)" }}>
                      Level
                    </p>
                    <p className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                      {userData.level}
                    </p>
                  </div>
                </div>

                {/* Experience */}
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🎯</div>
                    <p className="text-sm opacity-80 mb-1" style={{ color: "var(--color-text-primary)" }}>
                      Experience
                    </p>
                    <p className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                      {userData.exp}
                    </p>
                  </div>
                </div>

                {/* Coins */}
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="mb-1 flex justify-center">
                      <CurrencyIcon size={20} />
                    </div>
                    <p className="text-sm opacity-80 mb-1" style={{ color: "var(--color-text-primary)" }}>
                      Coins
                    </p>
                    <p className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                      {userData.coin}
                    </p>
                  </div>
                </div>

                {/* Joined */}
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-2xl mb-1">📅</div>
                    <p className="text-sm opacity-80 mb-1" style={{ color: "var(--color-text-primary)" }}>
                      Joined
                    </p>
                    <p className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>
                      {new Date(userData.created_at || "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <PixelButton
                onClick={handleLogout}
                variant="danger"
                className="w-full"
              >
                Logout
              </PixelButton>
            </PixelCard>
          </TabPanel>

          {/* Achievements Tab */}
          {/* <TabPanel tab="achievements">
            <PixelCard className="p-2 max-h-[400px] overflow-y-auto">
              Coming soon...
            </PixelCard>
          </TabPanel> */}

          {/* Settings Tab */}
          {/* <TabPanel tab="settings">
            <PixelCard className="p-2 max-h-[400px] overflow-y-auto">
              Coming soon...
            </PixelCard>
          </TabPanel> */}
        </div>
      </Tabs>
    </CommonModal>
  );
};
