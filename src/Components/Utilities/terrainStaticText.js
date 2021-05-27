/* eslint-disable max-len */
/**
 * Static text source file, enum-compatible with TERRAIN_TYPES for easy collection.
 */
const HILL_NAME = 'Hill';
const HILL_DESC = 'These hilly mountainsides are a useful source of ores and raw materials, boosting the production of adjacent cities. Not only that, but this rugged terrain makes for a great defensive advantage in combat for armies in this tile.';
const FOREST_NAME = 'Forest';
const FOREST_DESC = 'The thickets and oaks that fill this area are ripe for leverage, boosting the production of adjacent cities. Plus, the extra cover makes for a great defensive advantage in combat for armies in this tile.';
const DESERT_NAME = 'Desert';
const DESERT_DESC = 'This cracked, dying wasteland provides useful insights into evolution and material sciences, boosting the science of adjacent cities. Due to these harsh conditions, armies that end their turn in this tile will suffer attrition.';
const GRASSLAND_NAME = 'Grassland';
const GRASSLAND_DESC = 'The windy waves of grass and frequent rainfall here make for bountiful pasturage and farming outputs, boosting the growth of adjacent cities.';

const TERRAIN_STATIC_TEXT = {
  HILL: {
    name: HILL_NAME,
    description: HILL_DESC,
  },
  FOREST: {
    name: FOREST_NAME,
    description: FOREST_DESC,
  },
  DESERT: {
    name: DESERT_NAME,
    description: DESERT_DESC,
  },
  GRASSLAND: {
    name: GRASSLAND_NAME,
    description: GRASSLAND_DESC,
  },
};

export default TERRAIN_STATIC_TEXT;
