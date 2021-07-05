/* eslint-disable max-len */
import gameAT from '../actionTypes/gameActionTypes';
import GAME_VIEWS from '../../Components/Utilities/gameViews';
import ADVANCED_DETAILS_MODAL_VIEW from '../../Components/Utilities/advancedDetailsModalViews';

const initialState = {
  gameView: GAME_VIEWS.GAME_BOARD_VIEW,
  gameId: null,
  gameConstants: {},
  gameRound: 1,
  advancedDetailsModalView: ADVANCED_DETAILS_MODAL_VIEW.NONE,
};

const setGameView = (state, action) => {
  return {
    ...state,
    gameView: action.gameView,
  };
};

const setGameId = (state, action) => {
  return {
    ...state,
    gameId: action.gameId,
  };
};

const setGameConstants = (state, action) => {
  return {
    ...state,
    gameConstants: action.gameConstants,
  };
};

const setGameRound = (state, action) => {
  return {
    ...state,
    gameRound: action.gameRound,
  };
};

const setAdvancedDetailsModalView = (state, action) => {
  return {
    ...state,
    advancedDetailsModalView: action.advancedDetailsModalView,
  };
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case gameAT.SET_GAME_VIEW: return setGameView(state, action);
    case gameAT.SET_GAME_ID: return setGameId(state, action);
    case gameAT.SET_GAME_CONSTANTS: return setGameConstants(state, action);
    case gameAT.SET_GAME_ROUND: return setGameRound(state, action);
    case gameAT.SET_ADVANCED_DETAILS_MODAL_VIEW: return setAdvancedDetailsModalView(state, action);
    default: return state;
  }
};

export default reducer;
