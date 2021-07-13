/* eslint-disable max-len */
import CHAT_TOPIC from '../../Components/Utilities/chatTopics';
import chatAT from '../actionTypes/chatActionTypes';

const initialState = {
  selectedChatTopic: CHAT_TOPIC.GLOBAL,
  globalMessages: [],
  lobbyMessages: [],
  gameMessages: [],
};

const setSelectedChatTopic = (state, action) => {
  return {
    ...state,
    selectedChatTopic: action.selectedChatTopic,
  };
};

const setGlobalMessages = (state, action) => {
  return {
    ...state,
    globalMessages: action.globalMessages,
  };
};

const setLobbyMessages = (state, action) => {
  return {
    ...state,
    lobbyMessages: action.lobbyMessages,
  };
};

const setGameMessages = (state, action) => {
  return {
    ...state,
    gameMessages: action.gameMessages,
  };
};

const clearChatReducerExceptGlobalMessages = (state, action) => {
  return {
    ...initialState,
    globalMessages: state.globalMessages,
  };
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case chatAT.SET_SELECTED_CHAT_TOPIC: return setSelectedChatTopic(state, action);
    case chatAT.SET_GLOBAL_MESSAGES: return setGlobalMessages(state, action);
    case chatAT.SET_LOBBY_MESSAGES: return setLobbyMessages(state, action);
    case chatAT.SET_GAME_MESSAGES: return setGameMessages(state, action);
    case chatAT.CLEAR_CHAT_REDUCER_EXCEPT_GLOBAL_MESSAGES: return clearChatReducerExceptGlobalMessages(state, action);
    default: return state;
  }
};

export default reducer;
