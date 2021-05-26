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
  setPlayerOneUsername: (username) => {
    return {
      type: gameAT.SET_PLAYER_ONE_USERNAME,
      username: username,
    };
  },
  setPlayerTwoUsername: (username) => {
    return {
      type: gameAT.SET_PLAYER_TWO_USERNAME,
      username: username,
    };
  },
};

export default actionCreators;
