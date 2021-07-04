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
};

export default actionCreators;
