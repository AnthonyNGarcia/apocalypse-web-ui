import gamePlayerAT from '../actionTypes/gamePlayerActionTypes';

const actionCreators = {
  setPlayerOne: (player) => {
    return {
      type: gamePlayerAT.SET_PLAYER_ONE,
      player: player,
    };
  },
  setPlayerTwo: (player) => {
    return {
      type: gamePlayerAT.SET_PLAYER_TWO,
      player: player,
    };
  },
  setOwnPlayerNumber: (ownPlayerNumber) => {
    return {
      type: gamePlayerAT.SET_OWN_PLAYER_NUMBER,
      ownPlayerNumber: ownPlayerNumber,
    };
  },
  setPlayerWhoseTurnItIs: (playerWhoseTurnItIs) => {
    return {
      type: gamePlayerAT.SET_PLAYER_WHOSE_TURN_IT_IS,
      playerWhoseTurnItIs: playerWhoseTurnItIs,
    };
  },
  setWinningPlayer: (winningPlayer) => {
    return {
      type: gamePlayerAT.SET_WINNING_PLAYER,
      winningPlayer: winningPlayer,
    };
  },
  clearGamePlayerReducer: () => {
    return {
      type: gamePlayerAT.CLEAR_GAME_PLAYER_REDUCER,
    };
  },
};

export default actionCreators;
