/**
 * This file contains shared utility methods for highlighting and unhighlighting
 * units during a battle.
 */
import {store} from '../../App';
import battleViewAC from '../../Redux/actionCreators/battleViewActionCreators';
import UNIT_HIGHLIGHT_TYPES from './unitHighlightTypes';

/*
export const highlightAvailableConfigurationUnitSwaps = async (
    armyToCheck, armyGrid) => {
  const state = store.getState();
  const unitIndicesToHighlight =
      calculateEligibleConfigurationUnitSwaps(armyToCheck, armyGrid);
  const battleDataCopy = await JSON.parse(
      JSON.stringify(state.game.battleData));
  if (state.game.ownPlayerNumber === battleDataCopy.attackingArmy.owner) {
    for (let i = 0; i < unitIndicesToHighlight.length; i++) {
      battleDataCopy.attackingArmy.units[
          tilesToHighlight[i]].unitHighlightType =
          UNIT_HIGHLIGHT_TYPES.CAN_SWAP_HERE;
    }
  } else {
    for (let i = 0; i < unitIndicesToHighlight.length; i++) {
      battleDataCopy.defendingArmy.units[
          tilesToHighlight[i]].unitHighlightType =
          UNIT_HIGHLIGHT_TYPES.CAN_SWAP_HERE;
    }
  }
  store.dispatch(gameAC.setBattleData(battleDataCopy));
};
*/

export const unhighlightAllUnits = async (battleData) => {
  let battleDataCopy;
  if (battleData) {
    battleDataCopy = await JSON.parse(JSON.stringify(battleData));
  } else {
    const state = store.getState();
    battleDataCopy = await JSON.parse(JSON.stringify(
        state.battleView.battleData));
  }
  for (let i = 0; i < battleDataCopy.attackingArmy.units.length; i++) {
    battleDataCopy.attackingArmy.units[
        tilesToHighlight[i]].unitHighlightType =
          UNIT_HIGHLIGHT_TYPES.NONE;
  }
  for (let i = 0; i < battleDataCopy.defendingArmy.units.length; i++) {
    battleDataCopy.defendingArmy.units[
        tilesToHighlight[i]].unitHighlightType =
          UNIT_HIGHLIGHT_TYPES.NONE;
  }
  if (battleData) {
    return battleDataCopy;
  } else {
    store.dispatch(battleViewAC.setBattleData(battleDataCopy));
  }
};

const unitHighlightManager = {
  highlightAvailableConfigurationUnitSwaps:
    highlightAvailableConfigurationUnitSwaps,
  unhighlightAllUnits: unhighlightAllUnits,
};

export default unitHighlightManager;
