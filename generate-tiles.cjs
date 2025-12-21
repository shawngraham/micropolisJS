#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the tiles.png file
const tilesPath = path.join(__dirname, 'images', 'tiles.png');
const tilesSnowPath = path.join(__dirname, 'images', 'tilessnow.png');

// Read and convert tiles.png to base64
console.log('Reading tiles.png...');
const tilesBuffer = fs.readFileSync(tilesPath);
const tilesBase64 = tilesBuffer.toString('base64');
const tilesDataUri = `data:image/png;base64,${tilesBase64}`;

console.log('Reading tilessnow.png...');
const tilesSnowBuffer = fs.readFileSync(tilesSnowPath);
const tilesSnowBase64 = tilesSnowBuffer.toString('base64');
const tilesSnowDataUri = `data:image/png;base64,${tilesSnowBase64}`;

// Generate the TypeScript files
const header = `/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
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

`;

const tilesContent = header + `export const TileSetURI = '${tilesDataUri}';\n`;
const tilesSnowContent = header + `export const TileSetSnowURI = '${tilesSnowDataUri}';\n`;

// Write the files
console.log('Writing tileSetURI.ts...');
fs.writeFileSync(path.join(__dirname, 'src', 'tileSetURI.ts'), tilesContent);

console.log('Writing tileSetSnowURI.ts...');
fs.writeFileSync(path.join(__dirname, 'src', 'tileSetSnowURI.ts'), tilesSnowContent);

console.log('Done! Tile URI files regenerated.');
