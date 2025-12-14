import { CurrencyIcon } from "../helpers/currency";

interface InformationBannerProps {
  coins: number;
  day: number;
  level: number;
}

/**
 * InformationBanner - Displays game information at the top
 * @param coins - Player's current coin count
 * @param day - Current game day
 * @param level - Player's current level/trophy count
 */
export const InformationBanner = ({ coins, day, level }: InformationBannerProps) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center justify-between gap-3 z-[100] w-[calc(100%-2rem)] max-w-[568px] sm:top-3 sm:gap-2 sm:w-[calc(100%-1.5rem)]">
      {/* Coins Display */}
      <div className="flex items-center gap-2 bg-farm-yellow-100 border-2 border-farm-yellow-300 px-4 py-2.5 rounded-xl shadow-lg transition-transform duration-200 hover:-translate-y-0.5 sm:px-3 sm:py-2 sm:gap-1.5">
        <CurrencyIcon size={24} className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]" />
        <span className="text-lg font-bold text-farm-brown-800 leading-none sm:text-base">{coins}</span>
      </div>

      {/* Day Display */}
      <div className="flex flex-1 items-center justify-center gap-2 bg-farm-sky-100 border-2 border-farm-sky-300 px-4 py-2.5 rounded-xl shadow-lg transition-transform duration-200 hover:-translate-y-0.5 max-w-[160px] sm:px-3 sm:py-2 sm:gap-1.5 sm:max-w-[140px]">
        <span className="text-2xl leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] sm:text-xl">📅</span>
        <span className="text-lg font-bold text-farm-brown-800 leading-none whitespace-nowrap sm:text-base">Day {day}</span>
      </div>

      {/* Level/Trophy Display */}
      <div className="flex items-center gap-2 bg-farm-coral-100 border-2 border-farm-coral-300 px-4 py-2.5 rounded-xl shadow-lg transition-transform duration-200 hover:-translate-y-0.5 sm:px-3 sm:py-2 sm:gap-1.5">
        <span className="text-2xl leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] sm:text-xl">🏆</span>
        <span className="text-lg font-bold text-farm-brown-800 leading-none sm:text-base">{level}</span>
      </div>
    </div>
  );
};
