# Global Stats Dashboard Plan

## Overview
Create a new `/stats` page (collection-wide statistics) with monthly/yearly toggle, featuring polished visualizations using shadcn chart components (Recharts).

## User Preferences
- **Charts**: Bar charts preferred over pie charts (easier to compare accurately)
- **URL**: `/stats` for global stats, move per-fragrance to `/stats/fragrance/[id]`
- **Time periods**: Rolling (last 30 days, last 365 days)
- **Priority stats**: Usage patterns, Streaks, Financial insights (top of page)

---

## Stats to Implement

### Hero Section (Above the Fold)
Priority stats shown prominently:

**Usage Stats Row:**
- Wears in period (big number)
- Most used fragrance (with count)
- Average enjoyment rating

**Streaks Row:**
- Current streak (consecutive days)
- Max streak (all time)
- Total wears (all time)

**Financial Row:**
- Cost per wear (total spent / total wears)
- Best value fragrance (lowest cost/wear with 5+ wears)
- Total ML finished

---

### Main Dashboard Sections

#### 1. Most Used Fragrances
- Horizontal bar chart, top 10 by wear count in period
- Shows fragrance name + house, wear count

#### 2. Use Case Distribution
- Horizontal bar chart showing casual/formal/date/etc counts
- Filter out "testing" and "guess_game" from display

#### 3. Context Patterns
- **Weather**: Bar chart (hot/cold/mild)
- **Time of Day**: Bar chart (day/night)
- **Day of Week**: Bar chart (Mon-Sun)

#### 4. Collection Overview (Secondary)
- Total fragrances (bottles vs decants)
- Total ML in collection
- Collection value

#### 5. Shelf Queens & Hidden Gems
- **Shelf Queens**: Table of fragrances owned longest with lowest wear count
- **Hidden Gems**: High avg rating (8+) but fewer than 5 wears

---

## File Structure

```
/src/app/stats/
  ├── page.tsx                          # Global stats dashboard (NEW)
  ├── _components/
  │   ├── StatsPageContent.tsx          # Client wrapper with period toggle
  │   ├── HeroStats.tsx                 # Usage, Streaks, Financial cards
  │   ├── MostUsedChart.tsx             # Horizontal bar chart
  │   ├── UseCaseChart.tsx              # Use case bar chart
  │   ├── ContextCharts.tsx             # Weather, time, day of week
  │   ├── CollectionOverview.tsx        # Summary cards
  │   └── DiscoveryTables.tsx           # Shelf queens, hidden gems
  └── fragrance/
      └── [fragranceId]/
          └── page.tsx                  # MOVED from /stats/[fragranceId]
```

---

## tRPC Router: `globalStats.router.ts`

```typescript
// All procedures take: { period: "monthly" | "yearly" }
// "monthly" = last 30 days, "yearly" = last 365 days

getHeroStats(period)
// Returns: {
//   wearsInPeriod, mostUsedFragrance, avgEnjoyment,
//   currentStreak, maxStreak, totalWears,
//   costPerWear, bestValueFragrance, totalMlFinished
// }

getMostUsedFragrances(period)
// Returns: Array<{ name, house, wearCount }>

getUseCaseDistribution(period)
// Returns: Array<{ useCase, count }>

getContextStats(period)
// Returns: {
//   weather: Array<{ weather, count }>,
//   timeOfDay: Array<{ timeOfDay, count }>,
//   dayOfWeek: Array<{ day, count }>
// }

getCollectionOverview()
// Returns: { totalFragrances, bottles, decants, totalMl, totalValue }

getDiscoveryStats(period)
// Returns: {
//   shelfQueens: Array<{ name, house, daysOwned, wearCount }>,
//   hiddenGems: Array<{ name, house, avgRating, wearCount }>
// }
```

---

## Implementation Steps

### Phase 1: Backend Setup
1. Create `globalStats.router.ts` with all procedures
2. Add to `root.ts` router
3. Implement streak calculation logic (consecutive days)

### Phase 2: Route Restructure
1. Move `/stats/[fragranceId]` to `/stats/fragrance/[fragranceId]`
2. Create new `/stats/page.tsx`

### Phase 3: Core Components
1. `StatsPageContent.tsx` - client component with period toggle state
2. `HeroStats.tsx` - 3 rows of stat cards
3. `MostUsedChart.tsx` - horizontal bar chart

### Phase 4: Charts
1. `UseCaseChart.tsx` - bar chart
2. `ContextCharts.tsx` - 3 small bar charts (weather, time, day)

### Phase 5: Secondary Sections
1. `CollectionOverview.tsx` - summary cards
2. `DiscoveryTables.tsx` - shelf queens, hidden gems tables

### Phase 6: Polish
1. Loading skeletons
2. Empty states
3. Mobile responsiveness

---

## Verification Plan

1. `yarn dev` - navigate to `/stats`
2. Verify hero stats show real data
3. Toggle monthly/yearly - data should change
4. All charts render correctly
5. `/stats/fragrance/[id]` works (moved route)
6. `yarn build` - no type errors
7. Mobile layout looks good
