import outsideCityWallsBattleAT from
  '../actionTypes/outsideCityWallsBattleActionTypes';

const actionCreators = {
  setAttackingArmy: (attackingArmy) => {
    return {
      type: outsideCityWallsBattleAT.SET_ATTACKING_ARMY,
      attackingArmy: attackingArmy,
    };
  },
  setCityUnderAttack: (cityUnderAttack) => {
    return {
      type: outsideCityWallsBattleAT.SET_CITY_UNDER_ATTACK,
      cityUnderAttack: cityUnderAttack,
    };
  },
  setSallyOutForces: (sallyOutForces) => {
    return {
      type: outsideCityWallsBattleAT.SET_SALLY_OUT_FORCES,
      sallyOutForces: sallyOutForces,
    };
  },
  setOccupyingArmy: (occupyingArmy) => {
    return {
      type: outsideCityWallsBattleAT.SET_OCCUPYING_ARMY,
      occupyingArmy: occupyingArmy,
    };
  },
  setIncludeOccupyingCommander: (includeOccupyingCommander) => {
    return {
      type: outsideCityWallsBattleAT.SET_INCLUDE_OCCUPYING_COMMANDER,
      includeOccupyingCommander: includeOccupyingCommander,
    };
  },
  setExcessDefenders: (excessDefenders) => {
    return {
      type: outsideCityWallsBattleAT.SET_EXCESS_DEFENDERS,
      excessDefenders: excessDefenders,
    };
  },
  setCityTilePosition: (cityTilePosition) => {
    return {
      type: outsideCityWallsBattleAT.SET_CITY_TILE_POSITION,
      cityTilePosition: cityTilePosition,
    };
  },
  setAttackingArmyTilePosition: (attackingArmyTilePosition) => {
    return {
      type: outsideCityWallsBattleAT.SET_ATTACKING_ARMY_TILE_POSITION,
      attackingArmyTilePosition: attackingArmyTilePosition,
    };
  },
  clearOutsideCityWallsBattleReducer: () => {
    return {
      type: outsideCityWallsBattleAT.CLEAR_OUTSIDE_CITY_WALLS_BATTLE_REDUCER,
    };
  },
};

export default actionCreators;
