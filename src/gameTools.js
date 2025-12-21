/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */

import { BuildingTool } from './buildingTool.js';
import { BulldozerTool } from './bulldozerTool.js';
import { EventEmitter } from './eventEmitter.js';
import { QUERY_WINDOW_NEEDED } from './messages.ts';
import { MiscUtils } from './miscUtils.js';
import { ParkTool } from './parkTool.js';
import { RailTool } from './railTool.js';
import { RoadTool } from './roadTool.js';
import { QueryTool } from './queryTool.js';
import * as TileValues from "./tileValues.ts";
import { WireTool } from './wireTool.js';

function GameTools(map) {
  // Roman-themed building tools (1st century Rome)
  var tools = EventEmitter({
    forum: new BuildingTool(8000, TileValues.AIRPORT, map, 6, false), // Major civic center (was airport)
    bulldozer: new BulldozerTool(map),
    aqueduct: new BuildingTool(2500, TileValues.POWERPLANT, map, 4, false), // Water source (was coal)
    market: new BuildingTool(100, TileValues.COMCLR, map, 3, false), // Commercial zone (was commercial)
    vigiles: new BuildingTool(400, TileValues.FIRESTATION, map, 3, false), // Fire brigade (was fire)
    workshop: new BuildingTool(100, TileValues.INDCLR, map, 3, false), // Production zone (was industrial)
    great_aqueduct: new BuildingTool(4000, TileValues.NUCLEAR, map, 4, true), // Major water source (was nuclear)
    park: new ParkTool(map), // Gardens remain
    urban_cohort: new BuildingTool(400, TileValues.POLICESTATION, map, 3, false), // Security force (was police)
    harbor: new BuildingTool(2500, TileValues.PORT, map, 4, false), // Port/harbor
    road: new RoadTool(map), // Roman roads
    insula: new BuildingTool(100, TileValues.FREEZ, map, 3, false), // Residential (was residential)
    path: new RailTool(map), // Pedestrian paths (was rail)
    query: new QueryTool(map),
    circus: new BuildingTool(4000, TileValues.STADIUM, map, 4, false), // Entertainment (was stadium)
    aqueduct_line: new WireTool(map), // Water distribution lines (was wire)
  });

  tools.query.addEventListener(QUERY_WINDOW_NEEDED, MiscUtils.reflectEvent.bind(tools, QUERY_WINDOW_NEEDED));

  return tools;
}


export { GameTools };
