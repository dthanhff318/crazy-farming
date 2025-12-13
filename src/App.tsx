import { useState } from 'react';
import { Activity } from './components/Activity';
import { InformationBanner } from './components/InformationBanner';
import { NavigationBar } from './components/NavigationBar';
import { FarmSection } from './components/FarmSection';
import { GranarySection } from './components/GranarySection';
import { MarketplaceSection } from './components/MarketplaceSection';
import { ProfileSection } from './components/ProfileSection';
import type { NavigationOption } from './types';

function App() {
  const [activeSection, setActiveSection] = useState<NavigationOption>('farm');

  // Sample game data - will be replaced with actual game state later
  const gameData = {
    coins: 326,
    day: 10,
    level: 10,
  };

  const handleNavigate = (section: NavigationOption) => {
    setActiveSection(section);
  };

  return (
    <div className="w-full max-w-[600px] h-screen mx-auto relative overflow-hidden bg-gray-100 game-container">
      {/* Information Banner - Always visible */}
      <InformationBanner
        coins={gameData.coins}
        day={gameData.day}
        level={gameData.level}
      />

      {/* Game Sections - Controlled by Activity component */}
      <Activity mode={activeSection === 'farm'}>
        <FarmSection />
      </Activity>

      <Activity mode={activeSection === 'granary'}>
        <GranarySection />
      </Activity>

      <Activity mode={activeSection === 'marketplace'}>
        <MarketplaceSection />
      </Activity>

      <Activity mode={activeSection === 'profile'}>
        <ProfileSection />
      </Activity>

      {/* Navigation Bar - Always visible */}
      <NavigationBar activeSection={activeSection} onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
