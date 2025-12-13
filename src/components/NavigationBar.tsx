import type { NavigationOption } from '../types';

interface NavigationBarProps {
  activeSection: NavigationOption;
  onNavigate: (section: NavigationOption) => void;
}

/**
 * NavigationBar - Fixed bottom navigation with 4 options
 * @param activeSection - Currently active section
 * @param onNavigate - Callback when navigation item is clicked
 */
export const NavigationBar = ({ activeSection, onNavigate }: NavigationBarProps) => {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-[568px] sm:bottom-3 sm:w-[calc(100%-1.5rem)]">
      <div className="flex justify-between items-center bg-farm-brown-100 border-2 border-farm-brown-300 p-2 rounded-2xl shadow-xl sm:p-1.5">
        <button
          className={`flex flex-col items-center justify-center gap-1 bg-transparent border-none px-1.5 py-2 cursor-pointer transition-all duration-300 rounded-xl flex-1 min-w-0 relative sm:px-1 sm:py-1.5 sm:gap-0.5 ${
            activeSection === 'farm' ? 'bg-farm-green-200 shadow-md' : 'hover:bg-farm-brown-200'
          }`}
          onClick={() => onNavigate('farm')}
        >
          <span className="text-[28px] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] sm:text-[24px]">🚜</span>
          <span className="text-[11px] font-semibold text-farm-brown-800 leading-tight text-center whitespace-nowrap overflow-hidden text-ellipsis w-full sm:text-[10px]">
            My farm
          </span>
        </button>

        <button
          className={`flex flex-col items-center justify-center gap-1 bg-transparent border-none px-1.5 py-2 cursor-pointer transition-all duration-300 rounded-xl flex-1 min-w-0 relative sm:px-1 sm:py-1.5 sm:gap-0.5 ${
            activeSection === 'granary' ? 'bg-farm-coral-200 shadow-md' : 'hover:bg-farm-brown-200'
          }`}
          onClick={() => onNavigate('granary')}
        >
          <span className="text-[28px] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] sm:text-[24px]">👩‍🌾</span>
          <span className="text-[11px] font-semibold text-farm-brown-800 leading-tight text-center whitespace-nowrap overflow-hidden text-ellipsis w-full sm:text-[10px]">
            Granary
          </span>
        </button>

        <button
          className={`flex flex-col items-center justify-center gap-1 bg-transparent border-none px-1.5 py-2 cursor-pointer transition-all duration-300 rounded-xl flex-1 min-w-0 relative sm:px-1 sm:py-1.5 sm:gap-0.5 ${
            activeSection === 'marketplace' ? 'bg-farm-peach-200 shadow-md' : 'hover:bg-farm-brown-200'
          }`}
          onClick={() => onNavigate('marketplace')}
        >
          <span className="text-[28px] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] sm:text-[24px]">🏪</span>
          <span className="text-[11px] font-semibold text-farm-brown-800 leading-tight text-center whitespace-nowrap overflow-hidden text-ellipsis w-full sm:text-[10px]">
            Marketplace
          </span>
        </button>

        <button
          className={`flex flex-col items-center justify-center gap-1 bg-transparent border-none px-1.5 py-2 cursor-pointer transition-all duration-300 rounded-xl flex-1 min-w-0 relative sm:px-1 sm:py-1.5 sm:gap-0.5 ${
            activeSection === 'profile' ? 'bg-farm-lavender-200 shadow-md' : 'hover:bg-farm-brown-200'
          }`}
          onClick={() => onNavigate('profile')}
        >
          <span className="text-[28px] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] sm:text-[24px]">👨‍🌾</span>
          <span className="text-[11px] font-semibold text-farm-brown-800 leading-tight text-center whitespace-nowrap overflow-hidden text-ellipsis w-full sm:text-[10px]">
            Profile
          </span>
        </button>
      </div>
    </nav>
  );
};
