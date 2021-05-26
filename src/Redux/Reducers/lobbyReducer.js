/* eslint-disable max-len */
import lobbyAT from '../actionTypes/lobbyActionTypes';
import LOBBY_VIEWS from '../../Components/Utilities/lobbyViews';

const initialState = {
  lobbyView: LOBBY_VIEWS.BROWSE_LOBBIES_VIEW,
  lobbyId: null,
  playerOneUsername: null,
  playerTwoUsername: null,
};

const setLobbyView = (state, action) => {
  return {
    ...state,
    lobbyView: action.lobbyView,
  };
};

const setLobbyId = (state, action) => {
  return {
    ...state,
    lobbyId: action.lobbyId,
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
    case lobbyAT.SET_LOBBY_VIEW: return setLobbyView(state, action);
    case lobbyAT.SET_LOBBY_ID: return setLobbyId(state, action);
    case lobbyAT.SET_PLAYER_ONE_USERNAME: return setPlayerOneUsername(state, action);
    case lobbyAT.SET_PLAYER_TWO_USERNAME: return setPlayerTwoUsername(state, action);
    default: return state;
  }
};

export default reducer;
