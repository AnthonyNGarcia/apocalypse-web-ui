/* eslint-disable max-len */
import battleViewAT from '../actionTypes/battleViewActionTypes';

const initialState = {
  battleData: {},
  showEnemyArmyInBattle: false,
  ownArmySubmitted: false,
  selectedBattleUnitIndex: -1,
};

const setBattleData = (state, action) => {
  return {
    ...state,
    battleData: action.battleData,
  };
};

const setShowEnemyArmyInBattle = (state, action) => {
  return {
    ...state,
    showEnemyArmyInBattle: action.showEnemyArmyInBattle,
  };
};

const setOwnArmySubmitted = (state, action) => {
  return {
    ...state,
    ownArmySubmitted: action.ownArmySubmitted,
  };
};

const setSelectedBattleUnitIndex = (state, action) => {
  return {
    ...state,
    selectedBattleUnitIndex: action.selectedBattleUnitIndex,
  };
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case battleViewAT.SET_BATTLE_DATA: return setBattleData(state, action);
    case battleViewAT.SET_SHOW_ENEMY_ARMY_IN_BATTLE: return setShowEnemyArmyInBattle(state, action);
    case battleViewAT.SET_OWN_ARMY_SUBMITTED: return setOwnArmySubmitted(state, action);
    case battleViewAT.SET_SELECTED_BATTLE_UNIT_INDEX: return setSelectedBattleUnitIndex(state, action);
    default: return state;
  }
};

export default reducer;
