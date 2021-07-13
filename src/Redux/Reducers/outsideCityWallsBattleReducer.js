/* eslint-disable max-len */
import outsideCityWallsBattleAT from '../actionTypes/outsideCityWallsBattleActionTypes';

const initialState = {
  attackingArmy: {
    commander: null,
    units: [],
  },
  cityUnderAttack: {
    name: '',
    unassignedUnits: [],
  },
  sallyOutForces: {
    commander: null,
    units: [],
  },
  occupyingArmy: {
    commander: null,
    units: [],
  },
  includeOccupyingCommander: false,
  excessDefenders: 0,
  cityTilePosition: -1,
  attackingArmyTilePosition: -1,
};

const setAttackingArmy = (state, action) => {
  return {
    ...state,
    attackingArmy: action.attackingArmy,
  };
};

const setCityUnderAttack = (state, action) => {
  return {
    ...state,
    cityUnderAttack: action.cityUnderAttack,
  };
};

const setSallyOutForces = (state, action) => {
  return {
    ...state,
    sallyOutForces: action.sallyOutForces,
  };
};

const setOccupyingArmy = (state, action) => {
  return {
    ...state,
    occupyingArmy: action.occupyingArmy,
  };
};

const setIncludeOccupyingCommander = (state, action) => {
  return {
    ...state,
    includeOccupyingCommander: action.includeOccupyingCommander,
  };
};

const setExcessDefenders = (state, action) => {
  return {
    ...state,
    excessDefenders: action.excessDefenders,
  };
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

const clearOutsideCityWallsBattleReducer = () => {
  return {
    ...initialState,
  };
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case outsideCityWallsBattleAT.SET_ATTACKING_ARMY: return setAttackingArmy(state, action);
    case outsideCityWallsBattleAT.SET_CITY_UNDER_ATTACK: return setCityUnderAttack(state, action);
    case outsideCityWallsBattleAT.SET_SALLY_OUT_FORCES: return setSallyOutForces(state, action);
    case outsideCityWallsBattleAT.SET_OCCUPYING_ARMY: return setOccupyingArmy(state, action);
    case outsideCityWallsBattleAT.SET_INCLUDE_OCCUPYING_COMMANDER: return setIncludeOccupyingCommander(state, action);
    case outsideCityWallsBattleAT.SET_EXCESS_DEFENDERS: return setExcessDefenders(state, action);
    case outsideCityWallsBattleAT.SET_CITY_TILE_POSITION: return setCityTilePosition(state, action);
    case outsideCityWallsBattleAT.SET_ATTACKING_ARMY_TILE_POSITION: return setAttackingArmyTilePosition(state, action);
    case outsideCityWallsBattleAT.CLEAR_OUTSIDE_CITY_WALLS_BATTLE_REDUCER: return clearOutsideCityWallsBattleReducer();
    default: return state;
  }
};

export default reducer;
