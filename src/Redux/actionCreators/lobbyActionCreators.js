import lobbyAT from '../actionTypes/lobbyActionTypes';

const actionCreators = {
  setLobbyView: (lobbyView) => {
    return {
      type: lobbyAT.SET_LOBBY_VIEW,
      lobbyView: lobbyView,
    };
  },
};

export default actionCreators;
