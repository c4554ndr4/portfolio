/**
 * Cute Fantasy Dungeons Asset Mapping
 * Objects are defined by exact pixel coordinates since spritesheets are NOT uniform grids
 */

export type SpriteDef = {
	name: string;
	x: number;
	y: number;
	width: number;
	height: number;
};

export type SpritesheetDef = {
	file: string;
	imageWidth: number;
	imageHeight: number;
	sprites: SpriteDef[];
};

export type SingleSpriteDef = {
	name: string;
	file: string;
	width: number;
	height: number;
};

// Single image sprites (not spritesheets)
export const singleSprites: SingleSpriteDef[] = [
	{ name: 'door-closed', file: 'cute-fantasy/door-closed.png', width: 32, height: 32 },
	{ name: 'door-open', file: 'cute-fantasy/door-open.png', width: 32, height: 32 },
	{ name: 'arch', file: 'cute-fantasy/arch.png', width: 32, height: 32 },
	{ name: 'arch-open', file: 'cute-fantasy/arch-open.png', width: 32, height: 32 },
	{ name: 'gate-closed', file: 'cute-fantasy/gate-closed.png', width: 32, height: 32 },
	{ name: 'gate-open', file: 'cute-fantasy/gate-open.png', width: 32, height: 32 },
	{ name: 'stairs-down', file: 'cute-fantasy/stairs-down.png', width: 16, height: 16 },
	{ name: 'ladder-down', file: 'cute-fantasy/ladder-down.png', width: 16, height: 16 },
];

// Dungeon Objects spritesheet (144x96 pixels)
// Objects are irregularly packed, not a uniform grid
export const dungeonObjects: SpritesheetDef = {
	file: 'cute-fantasy/dungeon-objects.png',
	imageWidth: 144,
	imageHeight: 96,
	sprites: [
		// Row 1 - top items
		{ name: 'bookshelf-1', x: 0, y: 0, width: 16, height: 24 },
		{ name: 'bookshelf-2', x: 16, y: 0, width: 16, height: 24 },
		{ name: 'crate', x: 32, y: 8, width: 16, height: 16 },
		{ name: 'bones-small-1', x: 48, y: 8, width: 8, height: 8 },
		{ name: 'bones-small-2', x: 56, y: 8, width: 8, height: 8 },
		{ name: 'bones-small-3', x: 48, y: 16, width: 16, height: 8 },
		{ name: 'candelabra-tall', x: 64, y: 0, width: 16, height: 24 },
		{ name: 'pot-brown-1', x: 80, y: 8, width: 16, height: 16 },
		{ name: 'pot-brown-2', x: 96, y: 8, width: 16, height: 16 },
		{ name: 'stone-tile-1', x: 112, y: 0, width: 16, height: 16 },
		{ name: 'stone-tile-2', x: 128, y: 0, width: 16, height: 16 },
		{ name: 'skeleton', x: 112, y: 16, width: 32, height: 24 },

		// Row 2
		{ name: 'chest-wood', x: 0, y: 24, width: 16, height: 16 },
		{ name: 'bookshelf-3', x: 16, y: 24, width: 16, height: 24 },
		{ name: 'bookshelf-4', x: 32, y: 24, width: 16, height: 24 },
		{ name: 'debris-1', x: 48, y: 32, width: 16, height: 8 },
		{ name: 'pot-orange-1', x: 64, y: 32, width: 16, height: 16 },
		{ name: 'pot-orange-2', x: 80, y: 24, width: 16, height: 24 },
		{ name: 'stone-rubble-1', x: 96, y: 32, width: 16, height: 16 },
		{ name: 'stone-rubble-2', x: 112, y: 40, width: 16, height: 16 },
		{ name: 'cursor-1', x: 128, y: 32, width: 16, height: 16 },

		// Row 3
		{ name: 'candle-small', x: 0, y: 48, width: 8, height: 16 },
		{ name: 'candle-tall', x: 8, y: 40, width: 8, height: 24 },
		{ name: 'candelabra-3arm', x: 16, y: 40, width: 24, height: 24 },
		{ name: 'stone-rubble-3', x: 40, y: 48, width: 24, height: 16 },
		{ name: 'pot-grey-1', x: 64, y: 48, width: 16, height: 16 },
		{ name: 'pot-grey-2', x: 80, y: 48, width: 16, height: 16 },
		{ name: 'vase-grey', x: 96, y: 48, width: 16, height: 16 },
		{ name: 'cursor-2', x: 112, y: 56, width: 16, height: 16 },

		// Row 4
		{ name: 'coffin-stone', x: 0, y: 64, width: 32, height: 16 },
		{ name: 'stone-block-1', x: 32, y: 64, width: 16, height: 16 },
		{ name: 'stone-block-2', x: 48, y: 64, width: 16, height: 16 },
		{ name: 'vase-brown-tall', x: 64, y: 56, width: 16, height: 24 },
		{ name: 'pot-grey-tall', x: 80, y: 56, width: 16, height: 24 },
		{ name: 'cursor-3', x: 96, y: 72, width: 16, height: 16 },

		// Row 5 - Angel and gravestones
		{ name: 'angel-statue', x: 0, y: 64, width: 48, height: 32 },
		{ name: 'vase-ornate', x: 48, y: 80, width: 16, height: 16 },
		{ name: 'gravestone-cross', x: 64, y: 80, width: 16, height: 16 },
		{ name: 'gravestone-tall', x: 80, y: 72, width: 16, height: 24 },
		{ name: 'pot-brown-tall', x: 96, y: 72, width: 16, height: 24 },
	],
};

// Gold Piles spritesheet (64x48 pixels)
export const goldPiles: SpritesheetDef = {
	file: 'cute-fantasy/gold-piles.png',
	imageWidth: 64,
	imageHeight: 48,
	sprites: [
		{ name: 'gold-pile-large', x: 0, y: 0, width: 32, height: 32 },
		{ name: 'gold-pile-medium', x: 32, y: 0, width: 32, height: 32 },
		{ name: 'gold-coins-1', x: 0, y: 32, width: 16, height: 16 },
		{ name: 'gold-coins-2', x: 16, y: 32, width: 16, height: 16 },
		{ name: 'gold-coins-3', x: 32, y: 32, width: 16, height: 16 },
		{ name: 'gold-coins-4', x: 48, y: 32, width: 16, height: 16 },
	],
};

// Pillars spritesheet (48x48 pixels)
// 3 pillars, each 16 wide x 48 tall
export const pillars: SpritesheetDef = {
	file: 'cute-fantasy/pillars.png',
	imageWidth: 48,
	imageHeight: 48,
	sprites: [
		{ name: 'pillar-intact', x: 0, y: 0, width: 16, height: 48 },
		{ name: 'pillar-cracked', x: 16, y: 0, width: 16, height: 48 },
		{ name: 'pillar-broken', x: 32, y: 0, width: 16, height: 48 },
	],
};

// Stairs spritesheet (48x48 pixels) - single 3x3 staircase
export const stairs: SpritesheetDef = {
	file: 'cute-fantasy/stairs.png',
	imageWidth: 48,
	imageHeight: 48,
	sprites: [{ name: 'stairs-up', x: 0, y: 0, width: 48, height: 48 }],
};

// Wooden Bridge (80x16 pixels) - single sprite
export const woodenBridge: SpritesheetDef = {
	file: 'cute-fantasy/wooden-bridge.png',
	imageWidth: 80,
	imageHeight: 16,
	sprites: [{ name: 'wooden-bridge', x: 0, y: 0, width: 80, height: 16 }],
};

// Pressure Plates (48x32 pixels)
export const pressurePlates: SpritesheetDef = {
	file: 'cute-fantasy/pressure-plate.png',
	imageWidth: 48,
	imageHeight: 32,
	sprites: [
		{ name: 'plate-up', x: 0, y: 0, width: 16, height: 32 },
		{ name: 'plate-mid', x: 16, y: 0, width: 16, height: 32 },
		{ name: 'plate-down', x: 32, y: 0, width: 16, height: 32 },
	],
};

// Metal Grills (96x64 pixels)
export const metalGrills: SpritesheetDef = {
	file: 'cute-fantasy/metal-grills.png',
	imageWidth: 96,
	imageHeight: 64,
	sprites: [
		{ name: 'grill-large', x: 0, y: 0, width: 48, height: 48 },
		{ name: 'grill-medium', x: 48, y: 0, width: 32, height: 32 },
		{ name: 'grill-small-1', x: 80, y: 0, width: 16, height: 16 },
		{ name: 'grill-small-2', x: 80, y: 16, width: 16, height: 16 },
		{ name: 'grill-vert', x: 48, y: 32, width: 16, height: 32 },
		{ name: 'grill-horiz', x: 64, y: 32, width: 32, height: 16 },
		{ name: 'grill-single-1', x: 0, y: 48, width: 16, height: 16 },
		{ name: 'grill-single-2', x: 16, y: 48, width: 16, height: 16 },
		{ name: 'grill-single-3', x: 32, y: 48, width: 16, height: 16 },
	],
};

// All spritesheets for easy iteration
export const allSpritesheets = [
	dungeonObjects,
	goldPiles,
	pillars,
	stairs,
	woodenBridge,
	pressurePlates,
	metalGrills,
];
