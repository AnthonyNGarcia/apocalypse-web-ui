import battleViewAT from '../actionTypes/battleViewActionTypes';

const actionCreators = {
  setBattleData: (battleData) => {
    return {
      type: battleViewAT.SET_BATTLE_DATA,
      battleData: battleData,
    };
  },
  setShowEnemyArmyInBattle: (showEnemyArmyInBattle) => {
    return {
      type: battleViewAT.SET_SHOW_ENEMY_ARMY_IN_BATTLE,
      showEnemyArmyInBattle: showEnemyArmyInBattle,
    };
  },
  setOwnArmySubmitted: (ownArmySubmitted) => {
    return {
      type: battleViewAT.SET_OWN_ARMY_SUBMITTED,
      ownArmySubmitted: ownArmySubmitted,
    };
  },
  setSelectedBattleUnitIndex: (selectedBattleUnitIndex) => {
    return {
      type: battleViewAT.SET_SELECTED_BATTLE_UNIT_INDEX,
      selectedBattleUnitIndex: selectedBattleUnitIndex,
    };
  },
  setActiveAbilityTargetSelection: (activeAbilityTargetSelection) => {
    return {
      type: battleViewAT.SET_ACTIVE_ABILITY_TARGET_SELECTION,
      activeAbilityTargetSelection: activeAbilityTargetSelection,
    };
  },
  clearBattleViewReducer: () => {
    return {
      type: battleViewAT.CLEAR_BATTLE_VIEW_REDUCER,
    };
  },
};

export default actionCreators;
