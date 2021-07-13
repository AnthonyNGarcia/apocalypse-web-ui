/* eslint-disable max-len */
import cityCourtyardBattleAT from '../actionTypes/cityCourtyardBattleActionTypes';

const initialState = {
  cityTile: {},
  attackingArmyTilePosition: -1,
};

const setCityTile = (state, action) => {
  return {
    ...state,
    cityTile: action.cityTile,
  };
};

const setAttackingArmyTilePosition = (state, action) => {
  return {
    ...state,
    attackingArmyTilePosition: action.attackingArmyTilePosition,
  };
};

const clearCityCourtyardBattleReducer = () => {
  return {
    ...initialState,
  };
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case cityCourtyardBattleAT.SET_CITY_TILE: return setCityTile(state, action);
    case cityCourtyardBattleAT.SET_ATTACKING_ARMY_TILE_POSITION: return setAttackingArmyTilePosition(state, action);
    case cityCourtyardBattleAT.CLEAR_CITY_COURTYARD_BATTLE_REDUCER: return clearCityCourtyardBattleReducer();
    default: return state;
  }
};

export default reducer;
