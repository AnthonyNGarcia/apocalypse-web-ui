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
};

export default actionCreators;