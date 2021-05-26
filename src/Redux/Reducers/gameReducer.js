/* eslint-disable max-len */
import gameAT from '../actionTypes/gameActionTypes';
import GAME_VIEWS from '../../Components/Utilities/gameViews';

const initialState = {
  gameView: GAME_VIEWS.CAMPAIGN_MAP_VIEW,
  gameId: null,
  playerOneUsername: null,
  playerTwoUsername: null,
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

const setPlayerOneUsername = (state, action) => {
  return {
    ...state,
    playerOneUsername: action.username,
  };
};

const setPlayerTwoUsername = (state, action) => {
  return {
    ...state,
    playerTwoUsername: action.username,
  };
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case gameAT.SET_GAME_VIEW: return setGameView(state, action);
    case gameAT.SET_GAME_ID: return setGameId(state, action);
    case gameAT.SET_PLAYER_ONE_USERNAME: return setPlayerOneUsername(state, action);
    case gameAT.SET_PLAYER_TWO_USERNAME: return setPlayerTwoUsername(state, action);
    default: return state;
  }
};

export default reducer;
