# Roman Urban Dynamics - 1st Century Rome

This is a modified version of micropolisJS that simulates the urban dynamics of 1st century Rome instead of a modern city.

## Overview

The game has been adapted to reflect Roman urban planning, economy, infrastructure, and social dynamics of the 1st century AD (around 100 AD). While the core simulation mechanics remain the same, all user-facing elements have been themed to match the Roman era.

## Key Modifications

### Time Period
- **Starting Year**: Changed from 1900 to 100 AD (1st century Rome)
- **Currency**: Denarii (Roman currency) instead of modern dollars

### Infrastructure Changes

#### Power System → Aqueduct/Water System
The original "power" system now represents **water distribution from Roman aqueducts**:
- **Aqueduct** (was Coal Power Plant): Standard water source - 700 capacity, costs 2,500 denarii
- **Great Aqueduct** (was Nuclear Plant): Major water source (like Aqua Claudia) - 2,000 capacity, costs 4,000 denarii
- **Aqueduct Lines** (was Power Lines): Water distribution pipes - costs 5 denarii per tile

### Building Types

#### Residential Zones
- **Insula** (was Residential): Roman apartment buildings where most citizens lived
  - Cost: 100 denarii
  - 3x3 zone

#### Commercial Zones
- **Market** (was Commercial): Roman marketplaces and shops
  - Cost: 100 denarii
  - 3x3 zone

#### Industrial Zones
- **Workshop** (was Industrial): Roman workshops, smithies, pottery makers, etc.
  - Cost: 100 denarii
  - 3x3 zone

#### Service Buildings
- **Vigiles Station** (was Fire Station): Roman fire brigade
  - Cost: 400 denarii (reduced from 500)
  - Maintenance: 80 denarii per station
  - 3x3 building

- **Urban Cohort Station** (was Police Station): Roman security/police force
  - Cost: 400 denarii (reduced from 500)
  - Maintenance: 80 denarii per station
  - 3x3 building

#### Major Buildings
- **Forum** (was Airport): Major civic center and marketplace
  - Cost: 8,000 denarii (reduced from 10,000)
  - 6x6 building

- **Circus** (was Stadium): Roman entertainment venue (chariot races, games)
  - Cost: 4,000 denarii (reduced from 5,000)
  - 4x4 building

- **Harbor** (was Port): Roman harbor for trade
  - Cost: 2,500 denarii (reduced from 3,000)
  - 4x4 building

#### Transportation
- **Roads**: Famous Roman roads (Via Appia, etc.)
  - Cost: 10 denarii per tile
  - Maintenance: 1 denarius per tile

- **Paths** (was Rail): Pedestrian paths and minor roads
  - Cost: 10 denarii per tile (reduced from 20)
  - Maintenance: 1 denarius per tile (reduced from 2)

#### Parks
- **Gardens** (was Park): Roman gardens and green spaces
  - Cost: 10 denarii per tile

### Economic Adjustments

#### Starting Conditions
- **Starting Funds**: 20,000 denarii
- **Starting Population**: 1 citizen

#### Budget
- **Vigiles Maintenance**: 80 denarii per station (reduced from 100)
- **Urban Cohort Maintenance**: 80 denarii per station (reduced from 100)
- **Road Maintenance**: 1 denarius per tile
- **Path Maintenance**: 1 denarius per tile (reduced from 2)

### Messages and Events

All game messages have been updated to reflect Roman themes:

#### Disasters
- **Barbarian Horde** (was Monster): Barbarian invasion
- **Aqueduct Collapse** (was Nuclear Meltdown): Major infrastructure failure
- **Chariot Accident** (was Plane/Helicopter Crash): Transportation accident
- **Cart Crashed** (was Train Crash): Minor transportation incident

#### City Notifications
- **Water Shortages** (was Blackouts): Insufficient water from aqueducts
- **More Water Needed** (was Need Electricity): Insufficient aqueduct capacity
- **Not Enough Water** (was Not Enough Power): Buildings lack water supply

#### City Milestones
- **Village**: Small settlement
- **Town**: Growing settlement
- **City**: A great city
- **Metropolis**: Major city
- **Megalopolis**: Massive city
- **Capital of the Empire**: The highest achievement

## Historical Context

### 1st Century Rome
The simulation is set around 100 AD, during the height of the Roman Empire. This period saw:
- Extensive aqueduct systems bringing water to cities
- Multi-story apartment buildings (insulae) housing the urban poor
- Elaborate public buildings and forums
- Professional fire brigades (vigiles) and urban security forces
- Famous Roman road networks
- Massive entertainment venues (circuses, amphitheaters)

### Urban Services
- **Vigiles**: Created by Augustus, these were Roman firefighters and night watchmen
- **Urban Cohorts**: Military units stationed in Rome for security and crowd control
- **Aqueducts**: Marvels of Roman engineering, bringing fresh water from distant sources
- **Forums**: Central public spaces for commerce, politics, and social gathering

## Technical Notes

### Code Changes
The modifications preserve the original game mechanics while changing:
1. User-facing text and labels (messages.ts, index.html)
2. Building names and costs (gameTools.js)
3. Economic constants (budget.js)
4. Starting year and conditions (simulation.js)
5. Theme documentation (powerManager.js comments)

### Internal Architecture
- The internal code still uses terms like "power", "police", "fire" for consistency
- The "power" system internally manages what is thematically "water distribution"
- Building tool names have been updated but still reference the same tile values

## Future Enhancements

Potential future modifications to make the simulation more historically accurate:
1. **Grain Dole System**: Add public grain distribution (annona)
2. **Temples**: Religious buildings providing satisfaction
3. **Public Baths**: Health and social buildings (thermae)
4. **Social Classes**: Patricians vs. Plebeians
5. **Slavery**: Historical labor system representation
6. **Roman Military**: Barracks and legions
7. **Provincial Tribute**: Income from conquered territories
8. **Senate Approval**: Political satisfaction metric

## Credits

This Roman modification was created by adapting micropolisJS, which is a handmade JavaScript port of Micropolis, the open-source release of the original SimCity (1989).

- Original SimCity: Maxis/Will Wright
- Micropolis: Don Hopkins and contributors
- micropolisJS: Graeme McCutcheon
- Roman Modifications: 2025

## License

This modified version maintains the same license as micropolisJS (GNU GPL v3).
