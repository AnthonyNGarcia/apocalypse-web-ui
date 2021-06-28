import chatAT from '../actionTypes/chatActionTypes';

const actionCreators = {
  setSelectedChatTopic: (selectedChatTopic) => {
    return {
      type: chatAT.SET_SELECTED_CHAT_TOPIC,
      selectedChatTopic: selectedChatTopic,
    };
  },
  setGlobalMessages: (globalMessages) => {
    return {
      type: chatAT.SET_GLOBAL_MESSAGES,
      globalMessages: globalMessages,
    };
  },
  setLobbyMessages: (lobbyMessages) => {
    return {
      type: chatAT.SET_LOBBY_MESSAGES,
      lobbyMessages: lobbyMessages,
    };
  },
  setGameMessages: (gameMessages) => {
    return {
      type: chatAT.SET_GAME_MESSAGES,
      gameMessages: gameMessages,
    };
  },
};

export default actionCreators;
