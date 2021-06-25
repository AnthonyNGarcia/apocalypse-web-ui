/* eslint-disable max-len */
import gameAT from '../actionTypes/gameActionTypes';
import GAME_VIEWS from '../../Components/Utilities/gameViews';

const initialState = {
  gameView: GAME_VIEWS.GAME_BOARD_VIEW,
  gameId: null,
  gameConstants: {},
  gameRound: 1,
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

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case gameAT.SET_GAME_VIEW: return setGameView(state, action);
    case gameAT.SET_GAME_ID: return setGameId(state, action);
    case gameAT.SET_GAME_CONSTANTS: return setGameConstants(state, action);
    case gameAT.SET_GAME_ROUND: return setGameRound(state, action);
    default: return state;
  }
};

export default reducer;
