# Farm System Implementation

## 🎯 Overview
Complete farm plot system với trồng cây, thu hoạch, và mở khóa ô đất. Tất cả logic được xử lý qua Edge Functions.

## 📊 Database Structure

### Tables Created:
1. **`farm_plots`** - Lưu các ô đất
   - 6 plots mặc định (3 unlocked, 3 locked)
   - Auto-created khi user đăng ký

2. **`user_crops`** - Lưu cây đang trồng
   - Unique constraint: 1 plot = 1 cây
   - Auto-calculate ready time
   - Status tracking: growing, ready, withered

## 🔧 Edge Functions

### 1. `get_farm_state`
Lấy toàn bộ farm state với crop progress real-time

**Request:**
```typescript
{ userId: string }
```

**Response:**
```typescript
{
  plots: FarmPlot[],
  stats: {
    totalPlots: number,
    unlockedPlots: number,
    activeCrops: number,
    readyCrops: number
  }
}
```

### 2. `plant_seed`
Trồng seed vào plot

**Request:**
```typescript
{
  userId: string,
  plotId: string,
  seedCode: string
}
```

**Logic:**
- Check coins
- Check plot unlocked
- Check plot empty
- Deduct coins
- Create crop
- Calculate ready_at time

### 3. `harvest_crop`
Thu hoạch cây chín

**Request:**
```typescript
{
  userId: string,
  cropId: string
}
```

**Logic:**
- Check crop ready
- Add coins + exp
- Check level up
- Delete crop

### 4. `unlock_plot`
Mở khóa ô đất mới

**Request:**
```typescript
{
  userId: string,
  plotId: string
}
```

**Pricing:**
- Plot 4: 100 coins
- Plot 5: 200 coins
- Plot 6: 300 coins

## 🎨 Frontend Components

### 1. `useFarm` Hook
```typescript
const {
  farmState,      // Complete farm state
  loading,        // Loading state
  plantSeed,      // Plant seed function
  harvestCrop,    // Harvest function
  unlockPlot,     // Unlock plot function
} = useFarm(userId);
```

Auto-refresh every 30s để update crop progress.

### 2. `FarmPlot` Component
Individual plot component với 4 states:
- **Locked** - 🔒 Click to unlock
- **Empty** - 🌱 Click to plant
- **Growing** - 🌾 Progress bar + timer
- **Ready** - ✨ Click to harvest

### 3. `FarmGrid` Component
Grid 3x2 của tất cả plots với:
- Stats display (active, ready, unlocked)
- Plant seed modal
- Auto-refresh progress

## 📱 Usage Example

```typescript
import { FarmGrid } from "./components/FarmGrid";

function App({ user }: { user: User }) {
  return (
    <div>
      <FarmGrid user={user} />
    </div>
  );
}
```

## 🚀 Deployment Steps

### 1. Run Migration
```bash
# Apply migration to create tables
supabase db push
```

### 2. Deploy Edge Functions
```bash
# Deploy all farm-related edge functions
supabase functions deploy get_farm_state
supabase functions deploy plant_seed
supabase functions deploy harvest_crop
supabase functions deploy unlock_plot
```

### 3. Test
1. Login as user
2. 3 plots should be unlocked by default
3. Click plot to plant seed
4. Wait for growth (or test với growth_time = 0.01 hours)
5. Harvest when ready

## 🎮 Game Flow

```
User Login
    ↓
Auto-create 6 plots (3 unlocked)
    ↓
Click empty plot → Select seed → Plant
    ↓
Seed growing (progress bar updates every 30s)
    ↓
Ready! → Click to harvest
    ↓
Get coins + exp (check level up)
    ↓
Plot empty → Can plant again
```

## 📈 Progress Calculation

Progress được calculate real-time:
```typescript
const progress = Math.min(
  (now - plantedAt) / (readyAt - plantedAt) * 100,
  100
);
```

Auto-refresh mỗi 30s nên user thấy progress bar tăng dần.

## 🔐 Security

- RLS policies enabled
- Edge functions dùng service role key
- Frontend chỉ gọi functions, không direct query
- Validation tất cả inputs ở edge function

## 💡 Future Enhancements

1. **Withering System** - Cây héo nếu không thu hoạch trong X giờ
2. **Fertilizer** - Tăng tốc độ phát triển
3. **Crop Rotation** - Bonus khi trồng different crops
4. **Plot Upgrades** - Larger plots, faster growth
5. **Auto-harvest** - Premium feature

## 🐛 Troubleshooting

**Plots không tự động tạo:**
- Check trigger `trigger_create_initial_farm_plots`
- Manually run: `SELECT public.create_initial_farm_plots()`

**Edge function lỗi:**
- Check Supabase logs
- Verify SUPABASE_SERVICE_ROLE_KEY set
- Test với Postman/curl

**Progress không update:**
- Check auto-refresh interval (30s)
- Manually call `refetch()`
