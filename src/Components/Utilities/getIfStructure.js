/**
 * Utility method to abstract away the logic of checking if a unit is a flanker
 */

const getIfCityWalls = (unit) => {
  const unitType = unit.unitType;
  if (unitType === 'TIER_1_CITY_WALL' ||
      unitType === 'TIER_2_CITY_WALL') {
    return true;
  }
  return false;
};

export default getIfCityWalls;
