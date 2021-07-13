import cityWallsBattleAC from '../actionTypes/cityWallsBattleActionTypes';

const actionCreators = {
  setCityTilePosition: (cityTilePosition) => {
    return {
      type: cityWallsBattleAC.SET_CITY_TILE_POSITION,
      cityTilePosition: cityTilePosition,
    };
  },
  setAttackingArmyTilePosition: (attackingArmyTilePosition) => {
    return {
      type: cityWallsBattleAC.SET_ATTACKING_ARMY_TILE_POSITION,
      attackingArmyTilePosition: attackingArmyTilePosition,
    };
  },
  clearCityWallsBattleReducer: () => {
    return {
      type: cityWallsBattleAC.CLEAR_CITY_WALLS_BATTLE_REDUCER,
    };
  },
};

export default actionCreators;
