# Roman Urban Dynamics - Historical Mechanics Implementation

## Overview
This document describes the historical accuracy improvements made to transform micropolisJS from a modern city simulator into an authentic 1st century Roman urban dynamics simulation.

## Phase 1 Changes Implemented

### 1. Roman Labor & Demographics (`src/valves.js`)

**What Changed:**
- Replaced modern employment-based growth with Roman slavery/manumission system
- Added demographic tracking for slaves vs. free population
- Implemented high mortality rates matching Roman life expectancy
- Made immigration the primary population growth mechanism

**Historical Context:**
- **Slavery**: ~35% of Rome's population were enslaved
- **Manumission**: ~2% of slaves freed annually, becoming freedmen
- **High Mortality**: ~30% infant mortality, ~3.5% adult annual mortality
- **Immigration**: Main source of population growth (compensating for deaths)
- **Grain Dole**: Free grain attracted migrants to Rome

**Technical Details:**
```javascript
// New constants
SLAVE_PERCENTAGE = 0.35          // 35% of population enslaved
MANUMISSION_RATE = 0.02          // 2% of slaves freed annually
INFANT_MORTALITY = 0.30          // 30% die before age 1
ADULT_DEATH_RATE = 0.035         // 3.5% annual adult mortality
IMMIGRATION_FACTOR = 1.4         // Immigration multiplier
GRAIN_DOLE_FACTOR = 0.6         // Grain dole attracts migrants
```

**Gameplay Impact:**
- Population growth now depends on:
  - Workshop/market activity (attracts migrants)
  - Grain dole (free food attracts citizens)
  - Low taxation (economic opportunity)
  - Slave acquisition (through workshops)
- Natural birth rate is low (often negative due to high mortality)
- Immigration is the primary growth driver (historically accurate!)

### 2. Roman Taxation System (`src/budget.js`)

**What Changed:**
- Removed heavy property/income tax (Romans didn't tax citizens this way)
- Added provincial tribute as main revenue source
- Implemented sales tax on commercial activity
- Added customs duties from harbors
- Added grain dole as major recurring expense

**Historical Context:**
- **Provincial Tribute**: Wealth flowed from conquered provinces (main income)
- **Sales Tax**: *Centesima rerum venalium* (1% sales tax)
- **Customs Duties**: *Portorium* (harbor fees, import/export taxes)
- **Inheritance Tax**: 5% for non-direct heirs
- **No Income Tax**: Roman citizens were NOT taxed on property/income (until late Empire crises)
- **Grain Dole**: *Annona* - free grain for ~40% of free citizens (major expense!)

**Technical Details:**
```javascript
// Revenue sources
Provincial Tribute:  3000 * difficulty_multiplier (base income)
Sales Tax:           comPop * 10 (1% on commercial activity)
Customs Duties:      seaPortPop * 200 (harbor taxes)
Direct Tax:          Reduced 70% from original (emergency measure only)

// New expense
Grain Dole:          freeCitizens * 0.4 * 50 (40% of free pop gets grain)
```

**Gameplay Impact:**
- Provincial tribute provides steady base income (encourages "empire" theme)
- Sales tax rewards commercial development (markets, shops)
- Harbors become more valuable (customs revenue)
- Grain dole is expensive but necessary (keeps citizens happy)
- Direct taxation less punitive (historically accurate)

### 3. Pre-Industrial Pollution (`src/blockMapUtils.js`)

**What Changed:**
- Reduced pollution from workshops (small-scale, not industrial factories)
- Changed aqueducts from polluters to NON-polluters (they provide clean water!)
- Added small pollution from residential areas (urban waste)
- Adjusted traffic pollution (animal waste, congestion, noise)
- Changed "radiation" to "contaminated water" (aqueduct collapse)

**Historical Context:**
- **Workshop Pollution**: Fullers (urine stench), metalworking, pottery kilns - localized, not industrial-scale
- **Aqueducts**: Provided CLEAN water, major public health benefit
- **Urban Waste**: Streets used for waste disposal, limited sewerage
- **Traffic**: Carts, wagons, animals = noise, congestion, animal waste (not vehicle emissions!)
- **Fires**: Major hazard in wooden *insulae*, produced smoke

**Technical Details:**
```javascript
// Pollution values (0-255 scale)
Heavy Traffic:      60 (was 75) - animal waste, noise
Light Traffic:      35 (was 50)
Workshops:          25 (was 50) - pre-industrial scale
Residential:        5 (was 0) - urban waste
Aqueducts:          0 (was 100) - provide CLEAN water!
Fires:              90 (same) - smoke, destruction
Contaminated Water: 200 (was 255 "radiation") - health hazard
```

**Gameplay Impact:**
- Aqueducts are now purely beneficial (no pollution!)
- Workshops pollute less (encourages economic development)
- Residential areas produce minor pollution (realistic urban waste)
- Overall pollution levels lower (pre-industrial society)

### 4. Roman Economic Model (`src/valves.js`)

**What Changed:**
- Reduced external market importance (Rome was import-driven, not export-driven)
- Adjusted tax impact to be less punitive (Romans had lower direct taxation)
- Labor pool includes entire population (slaves + free)
- Commercial zones serve local population (not global markets)

**Historical Context:**
- **Trade Deficit**: Rome imported more than it exported (grain, luxury goods)
- **Slave Labor**: Workshops relied on enslaved workers (capital investment, not wages)
- **Local Markets**: *Macella*, *fora* served local population
- **Limited Exports**: Rome's economy was consumption-driven, not production-driven

**Technical Details:**
```javascript
// External market reduced
extMarketParamTable: [0.9, 0.85, 0.8] (was [1.2, 1.1, 0.98])

// Tax table less punitive
taxTable: [150, 120, 100...] (was [200, 150, 120...])

// Total labor pool (everyone works)
totalLaborPool = normalizedResPop (includes slaves + free)
```

**Gameplay Impact:**
- Workshops less dependent on global competition
- Focus shifts to serving local population
- Taxation less destructive to growth
- Reflects import-driven Roman economy

## Comparison: Before vs. After

### Population Growth
**Before (Modern):**
- Employment → Migration
- Birth rate: 2%
- Low mortality
- Job availability drives growth

**After (Roman):**
- Immigration → Growth
- Natural increase often negative
- High mortality (infant + adult)
- Economic opportunity + grain dole drives growth

### Revenue
**Before (Modern):**
- Property/income tax (main source)
- Scales with population & land value
- Progressive taxation

**After (Roman):**
- Provincial tribute (main source)
- Sales tax on commerce
- Customs duties from harbors
- Minimal direct citizen taxation

### Expenses
**Before (Modern):**
- Roads, Police, Fire
- No subsidies

**After (Roman):**
- Roads, Urban Cohorts, Vigiles
- **Grain Dole** (major expense!)
- Reflects Roman welfare state

### Pollution
**Before (Modern):**
- Industrial factories: heavy
- Power plants: extreme
- Traffic: vehicle emissions

**After (Roman):**
- Workshops: light (pre-industrial)
- Aqueducts: none (beneficial!)
- Traffic: animal waste, noise

## Historical Accuracy Gains

### Demographics ✓
- Slavery system (35% of population)
- Manumission (social mobility)
- High mortality rates
- Immigration-driven growth

### Economics ✓
- Import-driven economy
- Provincial tribute system
- Limited citizen taxation
- Grain dole welfare

### Urban Environment ✓
- Pre-industrial pollution
- Aqueducts as public health benefit
- Realistic workshop scale
- Urban waste management

## Remaining Anachronisms

Some modern mechanics remain unchanged (for gameplay balance or due to complexity):

1. **Strict Zoning**: Residential/Commercial/Industrial zones still separate (Phase 2 would add mixed-use)
2. **Water Distribution**: Still works like electricity (Phase 3 would make fountains area-based)
3. **Fire Mechanics**: Frequency should be higher for wooden *insulae*
4. **Elite vs. Common Housing**: *Domus* vs. *Insulae* not differentiated
5. **Patron-Client Networks**: Not modeled
6. **Citizenship Tiers**: Citizens/Freedmen/Slaves not tracked separately in UI

## Gameplay Experience

### What Players Will Notice:
1. **Slower natural growth**: Immigration matters more than births
2. **Grain dole is expensive**: Feeding citizens costs money!
3. **Provincial tribute**: Steady base income (feels like an empire)
4. **Lower pollution**: Workshops don't choke the city
5. **Aqueducts help**: No longer pollute, purely beneficial
6. **Markets generate revenue**: Sales tax from commerce
7. **Harbors more valuable**: Customs duties boost income

### Strategic Changes:
- **Build markets/workshops** to attract immigrants
- **Manage grain dole costs** (scales with free population)
- **Develop harbors** for customs revenue
- **Build aqueducts** without pollution worry
- **Keep taxes moderate** to encourage immigration

## Technical Notes

### Files Modified:
- `src/valves.js` - Roman demographics & labor system
- `src/budget.js` - Roman taxation & grain dole
- `src/blockMapUtils.js` - Pre-industrial pollution model

### Backward Compatibility:
- Save games from previous versions should still load
- All changes are in economic calculations, not data structures
- Balance adjustments may be needed based on playtesting

### Testing Recommendations:
1. Start new game, verify population grows via immigration
2. Check budget window shows grain dole expense
3. Verify aqueducts don't create pollution
4. Confirm workshops create less pollution than before
5. Test that markets generate sales tax revenue
6. Verify harbors provide customs duties

## Future Enhancements (Not Yet Implemented)

### Phase 2: Urban Form
- Mixed-use buildings (*tabernae* + *insulae*)
- *Domus* vs. *Insulae* distinction
- Higher fire risk for wooden buildings
- Patron estates

### Phase 3: Infrastructure
- Fountain-based water distribution
- Aqueduct area effects (not connections)
- Roman road network benefits
- Public baths

### Phase 4: Social Systems
- Citizenship tiers (UI tracking)
- Patron-client networks
- Gladiator games (circus mechanics)
- Religious festivals

## Conclusion

These Phase 1 changes transform the core economic and demographic engine from modern to Roman. The game now simulates:
- Slavery-based labor economy
- Immigration-driven population growth
- Provincial tribute tax system
- Grain dole welfare
- Pre-industrial urban environment

Players will experience a fundamentally different economic model that reflects 1st century Rome's unique urban dynamics!

---

**Implementation Date**: December 2025
**Game Version**: micropolisJS (Roman Edition)
**Historical Period**: 1st Century AD (100-200 AD)
