/* eslint-disable max-len */
import cityWallsBattleAT from '../actionTypes/cityWallsBattleActionTypes';

const initialState = {
  cityTilePosition: -1,
  attackingArmyTilePosition: -1,
};

const setCityTilePosition = (state, action) => {
  return {
    ...state,
    cityTilePosition: action.cityTilePosition,
  };
};

const setAttackingArmyTilePosition = (state, action) => {
  return {
    ...state,
    attackingArmyTilePosition: action.attackingArmyTilePosition,
  };
};

const clearCityWallsBattleReducer = () => {
  return {
    ...initialState,
  };
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case cityWallsBattleAT.SET_CITY_TILE_POSITION: return setCityTilePosition(state, action);
    case cityWallsBattleAT.SET_ATTACKING_ARMY_TILE_POSITION: return setAttackingArmyTilePosition(state, action);
    case cityWallsBattleAT.CLEAR_CITY_WALLS_BATTLE_REDUCER: return clearCityWallsBattleReducer();
    default: return state;
  }
};

export default reducer;
