/* eslint-disable max-len */
import battleViewAT from '../actionTypes/battleViewActionTypes';

const initialState = {
  battleData: {},
  showEnemyArmyInBattle: false,
  ownArmySubmitted: false,
  selectedBattleUnitIndex: -1,
  activeAbilityTargetSelection: 'NA',
  selectedMultipleEnemyUnitIndices: [],
  multipleEnemySelectionCountRemaining: 0,
  actionMessage: 'Preparing for Battle...',
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

const setActiveAbilityTargetSelection = (state, action) => {
  return {
    ...state,
    activeAbilityTargetSelection: action.activeAbilityTargetSelection,
  };
};

const clearBattleViewReducer = (state, action) => {
  return {
    ...initialState,
  };
};

const setSelectedMultipleEnemyUnitIndices = (state, action) => {
  return {
    ...state,
    selectedMultipleEnemyUnitIndices: action.selectedMultipleEnemyUnitIndices,
  };
};

const setMultipleEnemySelectionCountRemaining = (state, action) => {
  return {
    ...state,
    multipleEnemySelectionCountRemaining: action.multipleEnemySelectionCountRemaining,
  };
};

const clearUnitActionSelection = (state, action) => {
  return {
    ...state,
    selectedBattleUnitIndex: initialState.selectedBattleUnitIndex,
    activeAbilityTargetSelection: initialState.activeAbilityTargetSelection,
    selectedMultipleEnemyUnitIndices: initialState.selectedMultipleEnemyUnitIndices,
    multipleEnemySelectionCountRemaining: initialState.multipleEnemySelectionCountRemaining,
  };
};

const setActionMessage = (state, action) => {
  return {
    ...state,
    actionMessage: action.actionMessage,
  };
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case battleViewAT.SET_BATTLE_DATA: return setBattleData(state, action);
    case battleViewAT.SET_SHOW_ENEMY_ARMY_IN_BATTLE: return setShowEnemyArmyInBattle(state, action);
    case battleViewAT.SET_OWN_ARMY_SUBMITTED: return setOwnArmySubmitted(state, action);
    case battleViewAT.SET_SELECTED_BATTLE_UNIT_INDEX: return setSelectedBattleUnitIndex(state, action);
    case battleViewAT.SET_ACTIVE_ABILITY_TARGET_SELECTION: return setActiveAbilityTargetSelection(state, action);
    case battleViewAT.CLEAR_BATTLE_VIEW_REDUCER: return clearBattleViewReducer(state, action);
    case battleViewAT.SET_SELECTED_MULTIPLE_ENEMY_UNIT_INDICES: return setSelectedMultipleEnemyUnitIndices(state, action);
    case battleViewAT.SET_MULTIPLE_ENEMY_SELECTION_COUNT_REMAINING: return setMultipleEnemySelectionCountRemaining(state, action);
    case battleViewAT.CLEAR_UNIT_ACTION_SELECTION: return clearUnitActionSelection(state, action);
    case battleViewAT.SET_ACTION_MESSAGE: return setActionMessage(state, action);
    default: return state;
  }
};

export default reducer;
