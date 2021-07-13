import gameAT from '../actionTypes/gameActionTypes';

const actionCreators = {
  setGameView: (gameView) => {
    return {
      type: gameAT.SET_GAME_VIEW,
      gameView: gameView,
    };
  },
  setGameId: (gameId) => {
    return {
      type: gameAT.SET_GAME_ID,
      gameId: gameId,
    };
  },
  setGameConstants: (gameConstants) => {
    return {
      type: gameAT.SET_GAME_CONSTANTS,
      gameConstants: gameConstants,
    };
  },
  setGameRound: (gameRound) => {
    return {
      type: gameAT.SET_GAME_ROUND,
      gameRound: gameRound,
    };
  },
  setAdvancedDetailsModalView: (advancedDetailsModalView) => {
    return {
      type: gameAT.SET_ADVANCED_DETAILS_MODAL_VIEW,
      advancedDetailsModalView: advancedDetailsModalView,
    };
  },
  clearGameReducer: () => {
    return {
      type: gameAT.CLEAR_GAME_REDUCER,
    };
  },
};

export default actionCreators;
