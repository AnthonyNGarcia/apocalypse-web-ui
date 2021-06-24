/* eslint-disable max-len */
import lobbyAT from '../actionTypes/lobbyActionTypes';
import LOBBY_VIEWS from '../../Components/Utilities/lobbyViews';

const initialState = {
  lobbyView: LOBBY_VIEWS.BROWSE_LOBBIES_VIEW,
  lobbyList: [],
  lobbyId: null,
  lobbyPlayerOne: null,
  lobbyPlayerTwo: null,
};

const setLobbyView = (state, action) => {
  return {
    ...state,
    lobbyView: action.lobbyView,
  };
};

const setLobbyList = (state, action) => {
  return {
    ...state,
    lobbyList: action.lobbyList,
  };
};

const setLobbyId = (state, action) => {
  return {
    ...state,
    lobbyId: action.lobbyId,
  };
};

const setLobbyPlayerOne = (state, action) => {
  return {
    ...state,
    lobbyPlayerOne: action.lobbyPlayerOne,
  };
};

const setLobbyPlayerTwo = (state, action) => {
  return {
    ...state,
    lobbyPlayerTwo: action.lobbyPlayerTwo,
  };
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case lobbyAT.SET_LOBBY_VIEW: return setLobbyView(state, action);
    case lobbyAT.SET_LOBBY_LIST: return setLobbyList(state, action);
    case lobbyAT.SET_LOBBY_ID: return setLobbyId(state, action);
    case lobbyAT.SET_LOBBY_PLAYER_ONE: return setLobbyPlayerOne(state, action);
    case lobbyAT.SET_LOBBY_PLAYER_TWO: return setLobbyPlayerTwo(state, action);
    default: return state;
  }
};

export default reducer;
