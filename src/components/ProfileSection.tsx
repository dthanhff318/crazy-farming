import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type UserData = Database['public']['Tables']['users']['Row'];

interface ProfileSectionProps {
  userData: UserData | null;
}

/**
 * ProfileSection - Player profile and achievements
 */
export const ProfileSection = ({ userData }: ProfileSectionProps) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!userData) {
    return (
      <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-farm-lavender-100 to-farm-peach-100">
        <div className="px-4 py-20 pb-24 max-w-[600px] mx-auto sm:px-3 sm:pt-[70px] sm:pb-[90px]">
          <p className="text-center text-farm-brown-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-farm-lavender-100 to-farm-peach-100">
      <div className="px-4 py-20 pb-24 max-w-[600px] mx-auto sm:px-3 sm:pt-[70px] sm:pb-[90px]">
        <h2 className="text-2xl font-bold text-farm-brown-800 mb-6 text-center sm:text-xl sm:mb-5">👨‍🌾 Profile</h2>

        {/* Profile Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-farm-lavender-300 p-6 mb-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🌾</div>
            <h3 className="text-2xl font-bold text-farm-brown-800 mb-1">{userData.name || 'Farmer'}</h3>
            <p className="text-sm text-farm-brown-600">Level {userData.level} Farmer</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Level */}
            <div className="bg-farm-sky-50 rounded-xl p-4 border-2 border-farm-sky-200">
              <div className="text-center">
                <div className="text-2xl mb-1">⭐</div>
                <p className="text-sm text-farm-brown-600 mb-1">Level</p>
                <p className="text-2xl font-bold text-farm-brown-800">{userData.level}</p>
              </div>
            </div>

            {/* Experience */}
            <div className="bg-farm-green-50 rounded-xl p-4 border-2 border-farm-green-200">
              <div className="text-center">
                <div className="text-2xl mb-1">🎯</div>
                <p className="text-sm text-farm-brown-600 mb-1">Experience</p>
                <p className="text-2xl font-bold text-farm-brown-800">{userData.exp}</p>
              </div>
            </div>

            {/* Coins */}
            <div className="bg-farm-yellow-50 rounded-xl p-4 border-2 border-farm-yellow-200">
              <div className="text-center">
                <div className="text-2xl mb-1">💰</div>
                <p className="text-sm text-farm-brown-600 mb-1">Coins</p>
                <p className="text-2xl font-bold text-farm-brown-800">{userData.coin}</p>
              </div>
            </div>

            {/* Joined */}
            <div className="bg-farm-coral-50 rounded-xl p-4 border-2 border-farm-coral-200">
              <div className="text-center">
                <div className="text-2xl mb-1">📅</div>
                <p className="text-sm text-farm-brown-600 mb-1">Joined</p>
                <p className="text-xs font-semibold text-farm-brown-800">
                  {new Date(userData.created_at || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
