/**
 * Utility method to abstract away the logic of getting a building bonus label.
 */
import {store} from '../../App';

const buildingBonusLabelMaker = (buildingBonus) => {
  const state = store.getState();
  const freeUnitTypeProduced = buildingBonus.freeUnitTypeProduced;
  if (freeUnitTypeProduced) {
    const fullUnitData = state.game.gameConstants.allUnits[
        freeUnitTypeProduced];
    if (freeUnitTypeProduced === 'RANDOM_TIER_1_UNIT') {
      return 'Perpetually trains ' + buildingBonus.value +
      ' free Random Tier 1 Unit(s) in the queue while there is space';
    }
    return 'Perpetually trains ' + buildingBonus.value +
    ' free ' + fullUnitData.displayName + ' unit(s) in the queue ' +
    'while there is space';
  }
  if (buildingBonus.buildingBonusType === 'ARMY_SIZE_BONUS') {
    return 'Increases max army size by ' + buildingBonus.value;
  }
  let label = '';
  if (buildingBonus.percentBonus) {
    switch (buildingBonus.buildingBonusType) {
      case 'GROWTH_BONUS':
        label = 'Provides +' + buildingBonus.value + '% Growth';
        break;
      case 'PRODUCTION_BONUS':
        label = 'Provides +' + buildingBonus.value + '% Production';
        break;
      case 'RESEARCH_BONUS':
        label = 'Provides +' + buildingBonus.value + '% Research';
        break;
    }
  } else {
    switch (buildingBonus.buildingBonusType) {
      case 'GROWTH_BONUS':
        label = 'Provides +' + buildingBonus.value + ' Growth';
        break;
      case 'PRODUCTION_BONUS':
        label = 'Provides +' + buildingBonus.value + ' Production';
        break;
      case 'RESEARCH_BONUS':
        label = 'Provides +' + buildingBonus.value + ' Research';
        break;
    }
  }
  if (label === '') {
    return 'Oops! Couldn\'t display this building bonus!';
  }
  if (buildingBonus.globalBonus) {
    label += ' in all Cities';
  }
  return label;
};

export default buildingBonusLabelMaker;
