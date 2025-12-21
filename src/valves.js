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

import { EventEmitter } from './eventEmitter.js';
import { VALVES_UPDATED } from './messages.ts';
import { MiscUtils } from './miscUtils.js';

var Valves = EventEmitter(function () {
  this.resValve = 0;
  this.comValve = 0;
  this.indValve = 0;
  this.resCap = false;
  this.comCap = false;
  this.indCap = false;
});


var RES_VALVE_RANGE = 2000;
var COM_VALVE_RANGE = 1500;
var IND_VALVE_RANGE = 1500;

// Roman demographic constants (1st century AD)
var SLAVE_PERCENTAGE = 0.35; // ~35% of Rome's population were enslaved
var MANUMISSION_RATE = 0.02; // ~2% of slaves freed annually (becoming freedmen)
var INFANT_MORTALITY = 0.30; // ~30% mortality before age 1
var ADULT_DEATH_RATE = 0.035; // ~3.5% annual adult mortality
var IMMIGRATION_FACTOR = 1.4; // Immigration compensates for high mortality
var GRAIN_DOLE_FACTOR = 0.6; // Free grain attracts citizens (affects migration)

// Roman taxation was indirect (sales, inheritance, customs), not progressive income tax
// Lower values = less growth suppression (Rome had lower direct taxation)
var taxTable = [
  150, 120, 100, 80, 60, 40, 20, 0, -10, -30, -60,
  -100, -140, -180, -220, -260, -300, -340, -380, -420, -460];

// External market less important (Rome was import-driven, not export-driven)
var extMarketParamTable = [0.9, 0.85, 0.8];

Valves.prototype.save = function(saveData) {
  saveData.resValve = this.resValve;
  saveData.comValve = this.comValve;
  saveData.indValve = this.indValve;
};


Valves.prototype.load = function(saveData) {
  this.resValve = saveData.resValve;
  this.comValve = saveData.comValve;
  this.indValve = saveData.indValve;

  this._emitEvent(VALVES_UPDATED);
};


Valves.prototype.setValves = function(gameLevel, census, budget) {
  var resPopDenom = 8;
  var labourBaseMax = 1.3;
  var internalMarketDenom = 3.7;
  var projectedIndPopMin = 5.0;
  var resRatioDefault = 1.3;
  var resRatioMax = 2;
  var comRatioMax = 2;
  var indRatioMax = 2;
  var taxMax = 20;
  var taxTableScale = 600;
  var labourBase;

  // Residential zones scale their population index when reporting it to the census
  var normalizedResPop = census.resPop / resPopDenom;
  census.totalPop = Math.round(normalizedResPop + census.comPop + census.indPop);

  // ROMAN DEMOGRAPHICS: Population growth model for 1st century Rome
  // Unlike modern employment-based migration, Rome's population was driven by:
  // 1. Slavery (captured in wars, born to slaves)
  // 2. Manumission (freeing of slaves -> freedmen)
  // 3. Immigration (attracted by opportunity, grain dole, citizenship)
  // 4. High mortality (infant mortality ~30%, adult mortality ~3.5%)

  // Calculate slave vs. free population
  var slavePop = normalizedResPop * SLAVE_PERCENTAGE;
  var freePop = normalizedResPop * (1 - SLAVE_PERCENTAGE);

  // Natural population change (births - deaths)
  var births = normalizedResPop * (1 - INFANT_MORTALITY) * 0.03; // Reduced effective birth rate due to infant mortality
  var deaths = normalizedResPop * ADULT_DEATH_RATE;
  var naturalChange = births - deaths; // Usually negative or barely positive

  // Manumission: slaves freed, becoming freedmen (increases free pop, decreases slave pop)
  var manumittedSlaves = slavePop * MANUMISSION_RATE;

  // Immigration: Primary growth mechanism for Rome
  // Attracted by: economic opportunity (workshops/markets), grain dole, low taxation
  var workshopAttraction = (census.indPop + census.comPop) / 100; // More economic activity = more migrants
  var grainDoleAttraction = freePop * GRAIN_DOLE_FACTOR / 100; // Free grain attracts migrants
  var lowTaxBonus = (20 - budget.cityTax) / 20; // Lower taxes attract migrants
  var immigration = (workshopAttraction + grainDoleAttraction) * IMMIGRATION_FACTOR * lowTaxBonus;

  // New slaves acquired (from conquest, trade - abstracted)
  var newSlaves = census.indPop * 0.015; // Workshops need slave labor

  // Total population projection
  var projectedResPop = normalizedResPop + naturalChange + immigration + manumittedSlaves + newSlaves;

  // ROMAN LABOR: Calculate labor availability (free + slave)
  // Roman workshops (officinae) relied heavily on slave labor
  // Markets needed both slaves and freedmen
  labourBase = census.comHist10[1] + census.indHist10[1];
  if (labourBase > 0.0) {
    // Total labor pool includes both free and enslaved population
    var totalLaborPool = normalizedResPop; // Everyone can work (slaves, freedmen, citizens)
    labourBase = totalLaborPool / labourBase;
  } else {
    labourBase = 1;
  }
  labourBase = MiscUtils.clamp(labourBase, 0.0, labourBaseMax);

  // Project future industry and commercial needs
  // ROMAN ECONOMY: Import-driven, not production-driven
  // Commerce (markets, tabernae) serves local population
  var internalMarket = (normalizedResPop + census.comPop + census.indPop) / internalMarketDenom;
  var projectedComPop = internalMarket * labourBase;

  // Industry (workshops with slave labor) less dependent on external markets
  // Rome imported more than it exported (trade deficit)
  var projectedIndPop = census.indPop * labourBase * extMarketParamTable[gameLevel];
  projectedIndPop = Math.max(projectedIndPop, projectedIndPopMin);

  // Calculate the expected percentage changes in each population type
  var resRatio;
  if (normalizedResPop > 0)
    resRatio = projectedResPop / normalizedResPop;
  else
    resRatio = resRatioDefault;

  var comRatio;
  if (census.comPop > 0)
    comRatio = projectedComPop / census.comPop;
  else
    comRatio = projectedComPop;

  var indRatio;
  if (census.indPop > 0)
    indRatio = projectedIndPop / census.indPop;
  else
    indRatio = projectedIndPop;

  resRatio = Math.min(resRatio, resRatioMax);
  comRatio = Math.min(comRatio, comRatioMax);
  indRatio = Math.min(indRatio, indRatioMax);

  // Constrain growth according to the tax level.
  var z = Math.min((budget.cityTax + gameLevel), taxMax);
  resRatio = (resRatio - 1) * taxTableScale + taxTable[z];
  comRatio = (comRatio - 1) * taxTableScale + taxTable[z];
  indRatio = (indRatio - 1) * taxTableScale + taxTable[z];

  this.resValve = MiscUtils.clamp(this.resValve + Math.round(resRatio), -RES_VALVE_RANGE, RES_VALVE_RANGE);
  this.comValve = MiscUtils.clamp(this.comValve + Math.round(comRatio), -COM_VALVE_RANGE, COM_VALVE_RANGE);
  this.indValve = MiscUtils.clamp(this.indValve + Math.round(indRatio), -IND_VALVE_RANGE, IND_VALVE_RANGE);

  if (this.resCap && this.resValve > 0)
    this.resValve = 0;

  if (this.comCap && this.comValve > 0)
      this.comValve = 0;

  if (this.indCap && this.indValve > 0)
      this.indValve = 0;

  this._emitEvent(VALVES_UPDATED);
};


export { Valves };
