import WEBSOCKET_MESSAGE_TYPES from '../websocketResponseMessageTypes';
import {store} from '../../../../App';
import chatAC from '../../../../Redux/actionCreators/chatActionCreators';

/**
 * This is the Battle View Message Handler.
 *
 * It handles all logic for updating the units/view of the currently
 * active Battle during a game from websocket messages.
 *
 * @param {Object} message containing the actual message as well as the
 * WEBSOCKET_RESPONSE_MESSAGE_TYPE value, at websocketResponseMessageType.
 */
const messageHandler = (message) => {
  const messageType = message.websocketResponseMessageType;
  switch (messageType) {
    case WEBSOCKET_MESSAGE_TYPES.NEW_GLOBAL_CHAT_MESSAGE:
      saveGlobalChatMessage(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.NEW_LOBBY_CHAT_MESSAGE:
      saveLobbyChatMessage(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.NEW_GAME_CHAT_MESSAGE:
      saveGameChatMessage(message);
      break;
    default:
      console.warn('Unrecognized message type for Chat Message topic!');
      console.warn(messageType);
      console.warn(message);
  }
};

const saveGlobalChatMessage = (message) => {
  const state = store.getState();
  const updatedGlobalMessages = [...state.chat.globalMessages];
  updatedGlobalMessages.push(message);

  store.dispatch(chatAC.setGlobalMessages(updatedGlobalMessages));
};

const saveLobbyChatMessage = (message) => {
  const state = store.getState();
  const updatedLobbyMessages = [...state.chat.lobbyMessages];
  updatedLobbyMessages.push(message);

  store.dispatch(chatAC.setLobbyMessages(updatedLobbyMessages));
};

const saveGameChatMessage = (message) => {
  const state = store.getState();
  const updatedGameChatMessages = [...state.chat.gameMessages];
  updatedGameChatMessages.push(message);

  store.dispatch(chatAC.setGameMessages(updatedGameChatMessages));
};

export default messageHandler;
