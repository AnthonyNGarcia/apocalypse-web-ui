import cityCourtyardBattleAC from
  '../actionTypes/cityCourtyardBattleActionTypes';

const actionCreators = {
  setCityTile: (cityTile) => {
    return {
      type: cityCourtyardBattleAC.SET_CITY_TILE,
      cityTile: cityTile,
    };
  },
  setAttackingArmyTilePosition: (attackingArmyTilePosition) => {
    return {
      type: cityCourtyardBattleAC.SET_ATTACKING_ARMY_TILE_POSITION,
      attackingArmyTilePosition: attackingArmyTilePosition,
    };
  },
  clearCityCourtyardBattleReducer: () => {
    return {
      type: cityCourtyardBattleAC.CLEAR_CITY_COURTYARD_BATTLE_REDUCER,
    };
  },
};

export default actionCreators;
