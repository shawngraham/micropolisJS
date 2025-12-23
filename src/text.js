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

import { Evaluation } from './evaluation.js';
import * as Messages from './messages.ts';
import { Simulation } from './simulation.js';

// TODO Some kind of rudimentary L20N based on navigator.language?

// Query tool strings
var densityStrings = ['Low', 'Medium', 'High', 'Very High'];
var landValueStrings = ['Slum', 'Lower Class', 'Middle Class', 'High'];
var crimeStrings = ['Safe', 'Light', 'Moderate', 'Dangerous'];
var pollutionStrings = ['None', 'Moderate', 'Heavy', 'Very Heavy'];
var rateStrings = ['Declining', 'Stable', 'Slow Growth', 'Fast Growth'];
// ROMAN ZONE TYPES (1st century AD)
var zoneTypes = ['Clear', 'Water', 'Trees', 'Rubble', 'Flood', 'Contaminated Water',
                 'Fire', 'Roman Road', 'Aqueduct', 'Path', 'Insula', 'Market',
                 'Workshop', 'Harbor', 'Forum', 'Aqueduct', 'Vigiles Station',
                 'Urban Cohort Station', 'Circus', 'Great Aqueduct', 'Bridge',
                 'Fountain', 'Garden', 'Workshop', 'Circus Maximus',
                 'Bridge', 'Aqua Claudia'];

// Evaluation window
var gameLevel = {};
gameLevel['' + Simulation.LEVEL_EASY] = 'Easy';
gameLevel['' + Simulation.LEVEL_MED] = 'Medium';
gameLevel['' + Simulation.LEVEL_HARD] = 'Hard';

var cityClass = {};
cityClass[Evaluation.CC_VILLAGE] = 'VILLAGE';
cityClass[Evaluation.CC_TOWN] = 'TOWN';
cityClass[Evaluation.CC_CITY] = 'CITY';
cityClass[Evaluation.CC_CAPITAL] = 'CAPITAL';
cityClass[Evaluation.CC_METROPOLIS] = 'METROPOLIS';
cityClass[Evaluation.CC_MEGALOPOLIS] = 'MEGALOPOLIS';

// ROMAN URBAN PROBLEMS (1st century perspective)
var problems = {};
problems[Evaluation.CRIME] = 'Banditry & Crime';
problems[Evaluation.POLLUTION] = 'Urban Squalor';
problems[Evaluation.HOUSING] = 'Overcrowded Insulae';
problems[Evaluation.TAXES] = 'Excessive Taxation';
problems[Evaluation.TRAFFIC] = 'Cart Congestion';
problems[Evaluation.UNEMPLOYMENT] = 'Lack of Work';
problems[Evaluation.FIRE] = 'Fire in Wooden Buildings';

// months
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Tool strings
var toolMessages = {
  noMoney: 'Insufficient funds to build that',
  needsDoze: 'Area must be bulldozed first'
};

// Message strings
var neutralMessages = {};
neutralMessages[Messages.FIRE_STATION_NEEDS_FUNDING] = true;
neutralMessages[Messages.NEED_AIRPORT] = true;
neutralMessages[Messages.NEED_FIRE_STATION] = true;
neutralMessages[Messages.NEED_ELECTRICITY] = true;
neutralMessages[Messages.NEED_MORE_INDUSTRIAL] = true;
neutralMessages[Messages.NEED_MORE_COMMERCIAL] = true;
neutralMessages[Messages.NEED_MORE_RESIDENTIAL] = true;
neutralMessages[Messages.NEED_MORE_RAILS] = true;
neutralMessages[Messages.NEED_MORE_ROADS] = true;
neutralMessages[Messages.NEED_POLICE_STATION] = true;
neutralMessages[Messages.NEED_SEAPORT] = true;
neutralMessages[Messages.NEED_STADIUM] = true;
neutralMessages[Messages.ROAD_NEEDS_FUNDING] = true;
neutralMessages[Messages.POLICE_NEEDS_FUNDING] = true;
neutralMessages[Messages.WELCOME] = true;

var badMessages = {};
badMessages[Messages.BLACKOUTS_REPORTED] = true;
badMessages[Messages.EARTHQUAKE] = true;
badMessages[Messages.EXPLOSION_REPORTED] = true;
badMessages[Messages.FLOODING_REPORTED] = true;
badMessages[Messages.FIRE_REPORTED] = true;
badMessages[Messages.HEAVY_TRAFFIC] = true;
badMessages[Messages.HELICOPTER_CRASHED] = true;
badMessages[Messages.HIGH_CRIME] = true;
badMessages[Messages.HIGH_POLLUTION] = true;
badMessages[Messages.MONSTER_SIGHTED] = true;
badMessages[Messages.NO_MONEY] = true;
badMessages[Messages.NOT_ENOUGH_POWER] = true;
badMessages[Messages.NUCLEAR_MELTDOWN] = true;
badMessages[Messages.PLANE_CRASHED] = true;
badMessages[Messages.SHIP_CRASHED] = true;
badMessages[Messages.TAX_TOO_HIGH] = true;
badMessages[Messages.TORNADO_SIGHTED] = true;
badMessages[Messages.TRAFFIC_JAMS] = true;
badMessages[Messages.TRAIN_CRASHED] = true;

var goodMessages = {};
goodMessages[Messages.REACHED_CAPITAL] = true;
goodMessages[Messages.REACHED_CITY] = true;
goodMessages[Messages.REACHED_MEGALOPOLIS] = true;
goodMessages[Messages.REACHED_METROPOLIS] = true;
goodMessages[Messages.REACHED_TOWN] = true;

// ROMAN-THEMED MESSAGES (1st century AD)
var messageText = {};
messageText[Messages.FIRE_STATION_NEEDS_FUNDING] = 'Vigiles need funding';
messageText[Messages.NEED_AIRPORT] = 'Commerce requires a Forum';
messageText[Messages.NEED_FIRE_STATION] = 'Citizens demand Vigiles (fire brigade)';
messageText[Messages.NEED_ELECTRICITY] = 'Build an Aqueduct';
messageText[Messages.NEED_MORE_INDUSTRIAL] = 'More workshops (officinae) needed';
messageText[Messages.NEED_MORE_COMMERCIAL] = 'More markets needed';
messageText[Messages.NEED_MORE_RESIDENTIAL] = 'More insulae needed';
messageText[Messages.NEED_MORE_RAILS] = 'Inadequate path system';
messageText[Messages.NEED_MORE_ROADS] = 'More Roman roads required';
messageText[Messages.NEED_POLICE_STATION] = 'Citizens demand Urban Cohorts';
messageText[Messages.NEED_SEAPORT] = 'Trade requires a Harbor';
messageText[Messages.NEED_STADIUM] = 'The people demand a Circus!';
messageText[Messages.ROAD_NEEDS_FUNDING] = 'Roads deteriorating, due to lack of funds';
messageText[Messages.POLICE_NEEDS_FUNDING] = 'Urban Cohorts need funding';
messageText[Messages.WELCOME] = 'Welcome to Rome - 1st Century AD';
messageText[Messages.BLACKOUTS_REPORTED] = 'Water shortages, build another Aqueduct';
messageText[Messages.EARTHQUAKE] = 'Major earthquake reported!';
messageText[Messages.EXPLOSION_REPORTED] = 'Explosion detected';
messageText[Messages.FLOODING_REPORTED] = 'Flooding from the Tiber!';
messageText[Messages.FIRE_REPORTED] = 'Fire in the insulae!';
messageText[Messages.HEAVY_TRAFFIC] = 'Heavy cart and wagon traffic';
messageText[Messages.HELICOPTER_CRASHED] = 'A cart overturned';
messageText[Messages.HIGH_CRIME] = 'Crime very high - bandits active';
messageText[Messages.HIGH_POLLUTION] = 'Pollution very high - air quality poor';
messageText[Messages.MONSTER_SIGHTED] = 'Barbarian horde sighted!';
messageText[Messages.NO_MONEY] = 'THE TREASURY IS EMPTY!';
messageText[Messages.NOT_ENOUGH_POWER] = 'Water shortages: insufficient aqueduct capacity';
messageText[Messages.NUCLEAR_MELTDOWN] = 'Aqueduct collapse!';
messageText[Messages.PLANE_CRASHED] = 'A chariot crashed';
messageText[Messages.SHIP_CRASHED] = 'Shipwreck in the harbor!';
messageText[Messages.TAX_TOO_HIGH] = 'Citizens protest: taxation too high!';
messageText[Messages.TORNADO_SIGHTED] = 'Tornado sighted!';
messageText[Messages.TRAFFIC_JAMS] = 'Streets congested with carts';
messageText[Messages.TRAIN_CRASHED] = 'A wagon overturned';
messageText[Messages.REACHED_CAPITAL] = 'Rome now rivals Alexandria! (50,000 inhabitants)';
messageText[Messages.REACHED_CITY] = 'Your settlement is now a proper city (10,000)';
messageText[Messages.REACHED_MEGALOPOLIS] = 'Largest city in the Empire! (500,000)';
messageText[Messages.REACHED_METROPOLIS] = 'A great metropolis of the Roman world (100,000)';
messageText[Messages.REACHED_TOWN] = 'Your village is now a town (2,000)';

var Text = {
  badMessages: badMessages,
  cityClass: cityClass,
  crimeStrings: crimeStrings,
  densityStrings: densityStrings,
  gameLevel: gameLevel,
  goodMessages: goodMessages,
  landValueStrings: landValueStrings,
  messageText: messageText,
  months: months,
  neutralMessages: neutralMessages,
  problems: problems,
  pollutionStrings: pollutionStrings,
  rateStrings: rateStrings,
  toolMessages: toolMessages,
  zoneTypes: zoneTypes
};

export { Text };
