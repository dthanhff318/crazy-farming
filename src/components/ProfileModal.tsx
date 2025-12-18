import { CommonModal } from "./CommonModal";
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
      <CommonModal isOpen={isOpen} onClose={onClose} maxWidth="500px">
        <div className="p-6">
          <p className="text-center text-farm-brown-600">Loading profile...</p>
        </div>
      </CommonModal>
    );
  }

  return (
    <CommonModal isOpen={isOpen} onClose={onClose} maxWidth="500px">
      <div className="p-6">
        {/* Profile Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-1">
            {userData.name || "Farmer"}
          </h3>
          <p className="text-sm text-white opacity-80">
            Level {userData.level} Farmer
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Level */}
          <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl mb-1">⭐</div>
              <p className="text-sm text-white opacity-80 mb-1">Level</p>
              <p className="text-2xl font-bold text-white">{userData.level}</p>
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl mb-1">🎯</div>
              <p className="text-sm text-white opacity-80 mb-1">Experience</p>
              <p className="text-2xl font-bold text-white">{userData.exp}</p>
            </div>
          </div>

          {/* Coins */}
          <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-center">
              <div className="mb-1 flex justify-center">
                <CurrencyIcon size={24} />
              </div>
              <p className="text-sm text-white opacity-80 mb-1">Coins</p>
              <p className="text-2xl font-bold text-white">{userData.coin}</p>
            </div>
          </div>

          {/* Joined */}
          <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl mb-1">📅</div>
              <p className="text-sm text-white opacity-80 mb-1">Joined</p>
              <p className="text-xs font-semibold text-white">
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
          style={{ minHeight: "56px" }}
        >
          Logout
        </PixelButton>
      </div>
    </CommonModal>
  );
};
