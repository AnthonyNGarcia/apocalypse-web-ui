import lobbyAT from '../actionTypes/lobbyActionTypes';
import LOBBY_VIEWS from '../../Components/Utilities/lobbyViews';

const initialState = {
  lobbyView: LOBBY_VIEWS.BROWSE_LOBBIES_VIEW,
};

const setLobbyView = (state, action) => {
  return {
    ...state,
    lobbyView: action.lobbyView,
  };
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case lobbyAT.SET_LOBBY_VIEW: return setLobbyView(state, action);
    default: return state;
  }
};

export default reducer;
