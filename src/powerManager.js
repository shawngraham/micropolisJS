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

import { BlockMap } from './blockMap.ts';
import { forEachCardinalDirection } from './direction.ts';
import { EventEmitter } from './eventEmitter.js';
import { Position } from './position.ts';
import { NOT_ENOUGH_POWER } from './messages.ts';
import { Random } from './random.ts';
import { ANIMBIT, BURNBIT, CONDBIT, POWERBIT } from "./tileFlags.ts";
import { NUCLEAR, POWERPLANT } from "./tileValues.ts";

// ROMAN WATER DISTRIBUTION (1st century AD)
// Aqueducts fed PUBLIC FOUNTAINS, not individual buildings!
// Most people walked to fountains (<5 minutes) to get water
// Only elite domus had private connections (very rare)
//
// Water capacity:
var COAL_POWER_STRENGTH = 700;      // Standard aqueduct capacity
var NUCLEAR_POWER_STRENGTH = 2000;  // Great aqueduct (Aqua Claudia scale)

// FOUNTAIN SYSTEM: Aqueducts provide water in an area
var FOUNTAIN_RADIUS = 15;           // Tiles within 15 tiles of aqueduct get water
var FOUNTAIN_RADIUS_LARGE = 25;     // Great aqueducts have larger reach
var DOMUS_NEEDS_CONNECTION = false; // Even elite domus use public fountains now


var PowerManager = EventEmitter(function(map) {
  // In Roman context: manages water distribution from aqueducts
  this._map = map;
  this._powerStack = [];
  this.powerGridMap = new BlockMap(this._map.width, this._map.height, 1);
});


PowerManager.prototype.setTilePower = function(x, y) {
  var tile = this._map.getTile(x, y);
  var tileValue = tile.getValue();

  if (tileValue === NUCLEAR || tileValue === POWERPLANT ||
      this.powerGridMap.worldGet(x, y) > 0) {
    tile.addFlags(POWERBIT);
    return;
  }

  tile.removeFlags(POWERBIT);
};


PowerManager.prototype.clearPowerStack = function() {
  this._powerStackPointer = 0;
  this._powerStack = [];
};


PowerManager.prototype.testForConductive = function(pos, testDir) {
  var movedPos = Position.move(pos, testDir);

  if (this._map.isPositionInBounds(movedPos)) {
    if (this._map.getTile(movedPos.x, movedPos.y).isConductive()) {
      if (this.powerGridMap.worldGet(movedPos.x, movedPos.y) === 0)
          return true;
    }
  }

  return false;
};


// ROMAN FOUNTAIN SYSTEM: Provide water in area around aqueducts
PowerManager.prototype.doFountainScan = function(census) {
  // Find all aqueduct locations and provide water to surrounding areas
  for (var x = 0; x < this._map.width; x++) {
    for (var y = 0; y < this._map.height; y++) {
      var tileValue = this._map.getTileValue(x, y);

      // Is this an aqueduct (power plant)?
      if (tileValue === NUCLEAR || tileValue === POWERPLANT) {
        var radius = (tileValue === NUCLEAR) ? FOUNTAIN_RADIUS_LARGE : FOUNTAIN_RADIUS;

        // Provide water to all tiles in radius (public fountain coverage)
        for (var dx = -radius; dx <= radius; dx++) {
          for (var dy = -radius; dy <= radius; dy++) {
            var targetX = x + dx;
            var targetY = y + dy;

            // Check if within map bounds
            if (targetX >= 0 && targetX < this._map.width &&
                targetY >= 0 && targetY < this._map.height) {

              // Calculate actual distance (Manhattan distance for simplicity)
              var distance = Math.abs(dx) + Math.abs(dy);

              if (distance <= radius) {
                // Within fountain walking distance - provide water
                this.powerGridMap.worldSet(targetX, targetY, 1);
              }
            }
          }
        }
      }
    }
  }
};

// Note: the algorithm is buggy: if you have two adjacent power
// plants, the second will be regarded as drawing power from the first
// rather than as a power source itself
PowerManager.prototype.doPowerScan = function(census) {
  // Clear power this._map.
  this.powerGridMap.clear();

  // Power that the combined coal and nuclear power plants can deliver.
  var maxPower = census.coalPowerPop * COAL_POWER_STRENGTH +
                 census.nuclearPowerPop * NUCLEAR_POWER_STRENGTH;

  var powerConsumption = 0; // Amount of power used.

  // ROMAN WATER SYSTEM: First, do traditional connection-based scan for aqueduct lines
  while (this._powerStack.length > 0) {
    var pos = this._powerStack.pop();
    var anyDir = undefined;
    var conNum;
    do {
      powerConsumption++;
      if (powerConsumption > maxPower) {
        this._emitEvent(NOT_ENOUGH_POWER);
        return;
      }

      if (anyDir)
        pos = Position.move(pos, anyDir);

      this.powerGridMap.worldSet(pos.x, pos.y, 1);
      conNum = 0;

      forEachCardinalDirection(dir => {
        if (conNum >= 2) {
          return;
        }

        if (this.testForConductive(pos, dir)) {
          conNum++;
          anyDir = dir;
        }
      });

      if (conNum > 1)
        this._powerStack.push(new Position(pos.x, pos.y));
    } while (conNum);
  }

  // ROMAN FOUNTAIN SYSTEM: Add area-of-effect water from aqueducts
  // This represents public fountains fed by aqueducts
  this.doFountainScan(census);
};


PowerManager.prototype.coalPowerFound = function(map, x, y, simData) {
  simData.census.coalPowerPop += 1;

  this._powerStack.push(new Position(x, y));

  // Ensure animation runs
  var dX = [-1, 2, 1, 2];
  var dY = [-1, -1, 0, 0];

  for (var i = 0; i < 4; i++)
    map.addTileFlags(x + dX[i], y + dY[i], ANIMBIT);
};


var dX = [1, 2, 1, 2];
var dY = [-1, -1, 0, 0];
var meltdownTable = [30000, 20000, 10000];

PowerManager.prototype.nuclearPowerFound = function(map, x, y, simData) {
  // TODO With the auto repair system, zone gets repaired before meltdown
  // In original Micropolis code, we bail and don't repair if melting down
  if (simData.disasterManager.disastersEnabled &&
      Random.getRandom(meltdownTable[simData.gameLevel]) === 0) {
    simData.disasterManager.doMeltdown(x, y);
    return;
  }

  simData.census.nuclearPowerPop += 1;
  this._powerStack.push(new Position(x, y));

  // Ensure animation bits set
  for (var i = 0; i < 4; i++)
    map.addTileFlags(x, y, ANIMBIT | CONDBIT | POWERBIT | BURNBIT);
};


PowerManager.prototype.registerHandlers = function(mapScanner, repairManager) {
  mapScanner.addAction(POWERPLANT, this.coalPowerFound.bind(this));
  mapScanner.addAction(NUCLEAR, this.nuclearPowerFound.bind(this));
  repairManager.addAction(POWERPLANT, 7, 4);
  repairManager.addAction(NUCLEAR, 7, 4);
};


export { PowerManager };
