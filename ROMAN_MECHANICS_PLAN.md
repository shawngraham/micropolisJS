# Roman Urban Dynamics - Historical Accuracy Implementation Plan

## Overview
Transform micropolisJS from modern city mechanics to authentic 1st century Rome simulation.

## Key Historical Changes

### 1. Labor & Population System
**Current (Modern):**
- Free labor market with employment/unemployment
- Migration based on job availability
- Birth rate: 2% annually

**New (Roman):**
- **Slavery system**: 30-40% of population are enslaved
- **Manumission**: Slaves freed over time, becoming freedmen
- **Citizen tiers**: Citizens > Freedmen > Slaves > Peregrini
- **High mortality**: ~30% infant mortality, life expectancy ~25-50 years
- **Immigration**: Conquest, citizenship grants, economic opportunity
- **Population growth**: Requires constant immigration due to high mortality

### 2. Economic System
**Current (Modern):**
- Progressive income tax (0-20%)
- Tax affects all zones equally
- Employment drives growth

**New (Roman):**
- **No income tax for citizens**
- **Sales tax** (1% *centesima rerum venalium*)
- **Inheritance tax** (5% for non-direct heirs)
- **Tribute from provinces** (main revenue source)
- **Indirect taxes**: customs duties, harbor fees
- **Tax farming** system (*publicani*)
- **Patron-client obligations** affect development

### 3. Zone Development
**Current (Modern):**
- Strict separation: Residential / Commercial / Industrial
- Each zone develops independently

**New (Roman):**
- **Mixed-use buildings**: *Tabernae* (workshops/shops) on ground floor, *insulae* (apartments) above
- **Integrated development**: Commerce naturally occurs in residential areas
- **Elite vs. Common**: *Domus* (rich townhouses) vs. *Insulae* (tenement blocks)
- **Fire hazard**: Wooden *insulae* highly flammable (constant risk)

### 4. Water Distribution
**Current (Modern):**
- Water works like electricity - direct connections needed
- No water = no growth

**New (Roman):**
- **Aqueducts** supply **public fountains**
- Most people fetch water from fountains (walk <5 min)
- **Rich homes** may have private connections
- **Public baths** are major water consumers
- Water is a **public amenity**, not household necessity

### 5. Urban Services
**Current (Modern):**
- Police stations reduce crime
- Fire stations prevent/fight fires
- Power plants generate electricity

**New (Roman):**
- **Urban Cohorts**: Keep order, mostly in city center
- **Vigiles**: Night watchmen, primarily fight fires
- **Limited coverage**: Services don't reach all areas equally
- **Patron protection**: Rich neighborhoods get better services
- **Aqueducts**: Provide prestige and public health

### 6. Commerce & Industry
**Current (Modern):**
- Industrial zones create pollution
- Commercial zones serve residential areas
- Demand-based growth

**New (Roman):**
- **Workshops** (*officinae*): Small-scale production, slave labor
- **Markets** (*macella*, *fora*): Daily trading, food distribution
- **Grain dole** (*annona*): Free grain for citizens (major expense)
- **Import-driven**: Wealth from trade, not production
- **Slave economy**: Labor costs are capital investment, not wages

### 7. Building Prestige
**Current (Modern):**
- Players build what's needed
- Budget-driven development

**New (Roman):**
- **Munificence** (*munificentia*): Elite fund public buildings for prestige
- **Forum**: Political and commercial center
- **Circus**: Entertain masses ("bread and circuses")
- **Baths**: Social/political gathering places
- **Temples**: Religious and civic functions

## Implementation Priority

### Phase 1: Core Economic Changes (High Impact)
1. **Replace employment system with slavery mechanics**
   - Add slave population tracking
   - Implement manumission rates
   - Adjust labor calculations

2. **Overhaul tax system**
   - Remove progressive income tax
   - Add sales tax (1%)
   - Add tribute income (provincial wealth)
   - Reduce reliance on local taxation

3. **Adjust population growth**
   - Increase mortality rate
   - Add immigration as primary growth mechanism
   - Separate free vs. enslaved population growth

### Phase 2: Urban Development (Medium Impact)
4. **Enable mixed-use zones**
   - Allow commercial development in residential areas
   - Create "tabernae + insula" combined buildings

5. **Differentiate elite vs. common housing**
   - Domus (low density, high value)
   - Insulae (high density, fire risk)

6. **Adjust fire mechanics**
   - Increase fire frequency in wooden insulae
   - Make vigiles less effective (limited equipment)

### Phase 3: Infrastructure (Lower Impact)
7. **Revise water distribution**
   - Aqueducts supply fountains, not buildings
   - Water becomes area effect, not connection-based
   - Private connections only for elite buildings

8. **Add grain dole system**
   - Regular expense based on citizen population
   - Affects population satisfaction
   - Political necessity

## Technical Implementation Notes

### Files to Modify
- `src/valves.js` - Core economic calculations
- `src/budget.js` - Tax system
- `src/residential.js` - Population growth, housing types
- `src/commercial.js` - Market mechanics
- `src/industrial.js` - Workshop mechanics (slave labor)
- `src/powerManager.js` - Water distribution (rename to waterManager)
- `src/census.js` - Track slave vs. free population
- `src/evaluation.js` - Adjust success metrics

### New Constants Needed
```javascript
// Population
const SLAVE_PERCENTAGE = 0.35; // 35% of population
const MANUMISSION_RATE = 0.02; // 2% of slaves freed annually
const INFANT_MORTALITY = 0.30; // 30% die before age 1
const BASE_DEATH_RATE = 0.04; // 4% annual mortality (adults)
const IMMIGRATION_FACTOR = 1.5; // Immigration compensates for deaths

// Economy
const SALES_TAX_RATE = 0.01; // 1% sales tax
const INHERITANCE_TAX_RATE = 0.05; // 5% inheritance tax
const PROVINCIAL_TRIBUTE_BASE = 5000; // Base tribute from provinces
const GRAIN_DOLE_COST_PER_CITIZEN = 50; // Annual cost per citizen

// Urban
const INSULA_FIRE_RISK = 0.15; // 15% annual fire risk
const DOMUS_FIRE_RISK = 0.03; // 3% annual fire risk (stone)
const TABERNAE_INTEGRATION = 0.7; // 70% of residences have ground-floor shops
```

### Backward Compatibility
- Keep original mechanics as optional "modern mode"
- Add setting to toggle "Historical Rome" vs "Modern" simulation
- Maintain save game format compatibility

## Expected Gameplay Changes

### Player Strategy Shifts
1. **Immigration management** becomes more important than employment
2. **Fire prevention** is critical (wooden buildings)
3. **Grain dole** is major recurring expense
4. **Water fountains** serve areas, not individual buildings
5. **Mixed-use development** is natural, not planned
6. **Provincial tribute** provides base income (encourages expansion theme)

### Historical Authenticity Gains
1. Population dynamics match Roman demographic patterns
2. Economy reflects import/tribute-based wealth
3. Urban form matches archaeological evidence
4. Fire risk matches historical accounts
5. Water distribution matches aqueduct system
6. Social stratification (slaves, freedmen, citizens) is visible

## Next Steps
1. Implement Phase 1 changes first (core economics)
2. Test gameplay balance
3. Adjust constants based on playtesting
4. Add Phase 2 & 3 incrementally
5. Document all changes for players
