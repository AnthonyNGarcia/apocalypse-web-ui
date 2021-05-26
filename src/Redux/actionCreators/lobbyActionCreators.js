import lobbyAT from '../actionTypes/lobbyActionTypes';

const actionCreators = {
  setLobbyView: (lobbyView) => {
    return {
      type: lobbyAT.SET_LOBBY_VIEW,
      lobbyView: lobbyView,
    };
  },
  setLobbyId: (lobbyId) => {
    return {
      type: lobbyAT.SET_LOBBY_ID,
      lobbyId: lobbyId,
    };
  },
  setPlayerOneUsername: (username) => {
    return {
      type: lobbyAT.SET_PLAYER_ONE_USERNAME,
      username: username,
    };
  },
  setPlayerTwoUsername: (username) => {
    return {
      type: lobbyAT.SET_PLAYER_TWO_USERNAME,
      username: username,
    };
  },
};

export default actionCreators;
