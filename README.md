# Crazy Farming

A pixel art farming simulation game built with React, TypeScript, and Supabase.

## Overview

Crazy Farming is an idle farming game where players can build and upgrade various farm buildings, raise animals, grow crops, and manage resources. The game features a charming pixel art aesthetic inspired by games like Sunflower Land.

## Features

- **Farm Management**: Build and upgrade different types of farm buildings (chicken coops, pig pens, barns, etc.)
- **Animal Husbandry**: Raise animals in your buildings and manage their care
- **Resource Trading**: Buy and sell items in the marketplace
- **Inventory System**: Manage seeds, animals, and harvested resources
- **Level Progression**: Unlock new buildings and features as you level up
- **Shop System**: Purchase seeds and animals to expand your farm
- **Profile Management**: Track your farming progress and achievements

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom pixel art theme
- **Backend**: Supabase (Database + Edge Functions)
- **State Management**: React Query (TanStack Query)
- **Authentication**: Supabase Auth

## Project Structure

```
crazy-farming/
├── public/
│   └── assets/
│       ├── avatar/          # Player avatar images
│       ├── buttons/         # UI button assets (pixel art)
│       └── icons/           # Game icons and sprites
├── src/
│   ├── components/
│   │   ├── Activity.tsx              # Section transition animations
│   │   ├── BuildingDetailSection.tsx # Building management view
│   │   ├── CommonModal.tsx           # Reusable modal component
│   │   ├── FarmSection.tsx           # Main farm gameplay area
│   │   ├── GameLayout.tsx            # Unified layout with header + navigation
│   │   ├── GranarySection.tsx        # Inventory management
│   │   ├── MarketplaceSection.tsx    # Trading interface
│   │   ├── OnboardingModal.tsx       # New player setup
│   │   ├── PixelButton.tsx           # Pixel art styled button
│   │   ├── PixelCard.tsx             # Pixel art styled card container
│   │   ├── ProfileSection.tsx        # Player profile and stats
│   │   ├── ShopModal.tsx             # Shop purchase interface
│   │   └── ...
│   ├── hooks/
│   │   ├── useAnimalTypes.ts         # Fetch available animal types
│   │   ├── useBuildingTypes.ts       # Fetch available building types
│   │   ├── useUser.ts                # User data management
│   │   ├── useUserAnimals.ts         # User's animals data
│   │   ├── useUserBuildings.ts       # User's buildings data
│   │   └── useUserInventory.ts       # User's inventory data
│   ├── pages/
│   │   ├── Game.tsx                  # Main game page
│   │   └── Login.tsx                 # Authentication page
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client setup
│   │   ├── queryClient.ts           # React Query setup
│   │   └── database.types.ts        # TypeScript database types
│   ├── helpers/
│   │   └── currency.ts              # Currency icon helper
│   └── types/
│       └── index.ts                 # Shared TypeScript types
└── supabase/
    └── functions/              # Supabase Edge Functions
        ├── create_new_user/    # Initialize new player
        ├── purchase_building/  # Building purchase logic
        ├── purchase_item/      # Shop purchase logic
        └── upgrade_building/   # Building upgrade logic
```

## Key Components

### GameLayout
Unified layout component that combines header and navigation:
- **Header**: Displays player avatar, level, coins, gems, and quick action buttons
- **Navigation**: Vertical navigation bar with 4 main sections (Farm, Granary, Marketplace, Profile)
- **RoundButton**: Custom circular button component using pixel art assets

### Game Sections
- **FarmSection**: Main gameplay area showing all buildings and their status
- **BuildingDetailSection**: Detailed view when clicking a building, manage animals inside
- **GranarySection**: View and manage inventory items (seeds, harvested crops)
- **MarketplaceSection**: Trade resources and items
- **ProfileSection**: View player stats and achievements

### Modals
- **ShopModal**: Purchase seeds and animals (rendered at Game.tsx level for proper z-index)
- **OnboardingModal**: First-time player setup flow
- **CommonModal**: Reusable modal component with slide-down animation

## Database Schema

The game uses Supabase with the following main tables:
- `users`: Player data (coins, level, gems)
- `building_types`: Available building types and configurations
- `animal_types`: Available animal types and their properties
- `user_buildings`: Player's owned buildings
- `user_animals`: Player's owned animals
- `user_inventory`: Player's inventory items

## Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd crazy-farming
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run development server**
```bash
pnpm dev
```

5. **Build for production**
```bash
pnpm build
```

## Supabase Setup

1. Create a new Supabase project
2. Run the database migrations (schema setup)
3. Deploy the edge functions:
```bash
supabase functions deploy create_new_user
supabase functions deploy purchase_building
supabase functions deploy purchase_item
supabase functions deploy upgrade_building
```

## Game Mechanics

### Building System
- Buildings unlock at specific player levels
- Each building can be upgraded multiple times
- Higher levels increase capacity and unlock new features
- Buildings house animals and produce resources

### Economy
- Earn coins by selling resources
- Spend coins to purchase buildings, upgrades, and items
- Gems for premium features (future implementation)

### Progression
- Level up by gaining experience
- Unlock new buildings, animals, and features
- Expand farm capacity through upgrades

## Design System

The game uses a custom Tailwind CSS theme with pixel art styling:
- Custom color palette (farm-themed colors)
- Pixel art rendering (`imageRendering: "pixelated"`)
- Custom pixel art buttons and UI components
- Responsive design optimized for mobile (max-width: 600px)

## Development Notes

### React Compiler
This project uses the React Compiler for optimized performance. See [React Compiler documentation](https://react.dev/learn/react-compiler) for more information.

### State Management
- React Query handles server state caching and synchronization
- Local state managed with React hooks
- Query invalidation after mutations for real-time updates

### Modal Z-Index Architecture
- Modals are rendered at the root level to avoid z-index conflicts
- Container z-index: 9999
- Modal content z-index: 3000
- Header z-index: 100
- Navigation z-index: 90

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Your License Here]

## Credits

Inspired by Sunflower Land and other farming simulation games.
