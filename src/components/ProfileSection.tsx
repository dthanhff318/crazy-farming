/**
 * ProfileSection - Player profile and achievements
 */
export const ProfileSection = () => {
  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-farm-lavender-100 to-farm-peach-100">
      <div className="px-4 py-20 pb-24 max-w-[600px] mx-auto sm:px-3 sm:pt-[70px] sm:pb-[90px]">
        <h2 className="text-2xl font-bold text-farm-brown-800 mb-6 text-center sm:text-xl sm:mb-5">👨‍🌾 Profile</h2>
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-farm-lavender-300 min-h-[400px] sm:px-4 sm:py-8 sm:min-h-[300px]">
          <p className="m-0 text-farm-brown-700 text-base text-center sm:text-sm">Profile will be implemented here</p>
          <p className="m-0 text-farm-brown-700 text-base text-center sm:text-sm">View your achievements and stats</p>
        </div>
      </div>
    </div>
  );
};
