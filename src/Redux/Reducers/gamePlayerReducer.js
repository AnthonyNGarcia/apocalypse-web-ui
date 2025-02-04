/* eslint-disable max-len */
import gamePlayerAT from '../actionTypes/gamePlayerActionTypes';

const initialState = {
  playerOne: null,
  playerTwo: null,
  ownPlayerNumber: null,
  playerWhoseTurnItIs: null,
  winningPlayer: null,
};

const setPlayerOne = (state, action) => {
  return {
    ...state,
    playerOne: action.player,
  };
};

const setPlayerTwo = (state, action) => {
  return {
    ...state,
    playerTwo: action.player,
  };
};

const setOwnPlayerNumber = (state, action) => {
  return {
    ...state,
    ownPlayerNumber: action.ownPlayerNumber,
  };
};

const setPlayerWhoseTurnItIs = (state, action) => {
  return {
    ...state,
    playerWhoseTurnItIs: action.playerWhoseTurnItIs,
    isOwnTurn: action.playerWhoseTurnItIs === state.ownPlayerNumber,
  };
};

const setWinningPlayer = (state, action) => {
  return {
    ...state,
    winningPlayer: action.winningPlayer,
  };
};

const clearGamePlayerReducer = (state, action) => {
  return {
    ...initialState,
  };
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case gamePlayerAT.SET_PLAYER_ONE: return setPlayerOne(state, action);
    case gamePlayerAT.SET_PLAYER_TWO: return setPlayerTwo(state, action);
    case gamePlayerAT.SET_OWN_PLAYER_NUMBER: return setOwnPlayerNumber(state, action);
    case gamePlayerAT.SET_PLAYER_WHOSE_TURN_IT_IS: return setPlayerWhoseTurnItIs(state, action);
    case gamePlayerAT.SET_WINNING_PLAYER: return setWinningPlayer(state, action);
    case gamePlayerAT.CLEAR_GAME_PLAYER_REDUCER: return clearGamePlayerReducer(state, action);
    default: return state;
  }
};

export default reducer;
