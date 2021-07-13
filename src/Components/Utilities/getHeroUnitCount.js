/**
 * Utility method to abstract away the logic of counting the number of hero
 * units in a given list of units.
 */
import {store} from '../../App';

const getHeroUnitCount = (units) => {
  const state = store.getState();
  const allUnits = state.game.gameConstants.allUnits;
  let count = 0;
  if (units && units.length > 0) {
    for (const unit of units) {
      if (!unit) {
        continue;
      }
      if (unit.unitType) {
        if (allUnits[unit.unitType].tier === 3) {
          count++;
        }
      } else if (unit.actualUnitTypeToBeProduced) {
        if (allUnits[unit.actualUnitTypeToBeProduced].tier === 3) {
          count++;
        }
      }
    }
  }
  return count;
};

export default getHeroUnitCount;
