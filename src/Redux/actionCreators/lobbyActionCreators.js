import lobbyAT from '../actionTypes/lobbyActionTypes';

const actionCreators = {
  setLobbyView: (lobbyView) => {
    return {
      type: lobbyAT.SET_LOBBY_VIEW,
      lobbyView: lobbyView,
    };
  },
  setLobbyList: (lobbyList) => {
    return {
      type: lobbyAT.SET_LOBBY_LIST,
      lobbyList: lobbyList,
    };
  },
  setLobbyId: (lobbyId) => {
    return {
      type: lobbyAT.SET_LOBBY_ID,
      lobbyId: lobbyId,
    };
  },
  setLobbyPlayerOne: (lobbyPlayerOne) => {
    return {
      type: lobbyAT.SET_LOBBY_PLAYER_ONE,
      lobbyPlayerOne: lobbyPlayerOne,
    };
  },
  setLobbyPlayerTwo: (lobbyPlayerTwo) => {
    return {
      type: lobbyAT.SET_LOBBY_PLAYER_TWO,
      lobbyPlayerTwo: lobbyPlayerTwo,
    };
  },
  clearLobbyReducer: () => {
    return {
      type: lobbyAT.CLEAR_LOBBY_REDUCER,
    };
  },
};

export default actionCreators;
