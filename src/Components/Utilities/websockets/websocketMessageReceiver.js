import WEBSOCKET_TOPICS from './websocketTopics';
import lobbyMessageHandler from './messageHandlers/lobbyMessageHandler.js';
import gameMessageHandler from './messageHandlers/gameMessageHandler';
import {store} from '../../../App';

/**
 * This all-purpose websocket message handler will sort incoming websocket
 * messages from the server and redirect them to more specific logic handlers
 * as necessary for functionality.
 *
 * @param {Object} message containing the actual message as well as the
 * WEBSOCKET_RESPONSE_MESSAGE_TYPE value, at websocketResponseMessageType.
 * @param {String} topic that this message came through.
 */
const websocketMessageReceiver = (message, topic) => {
  console.log(message);
  console.log(topic);
  const state = store.getState();
  const lobbyId = state.lobby.lobbyId ? state.lobby.lobbyId : 'NOT-IN-LOBBY';
  const gameId = state.game.gameId ? state.game.gameId : 'NOT-IN-GAME';
  const specificLobby = WEBSOCKET_TOPICS.specificLobbyWithId(lobbyId);
  const specificGame = WEBSOCKET_TOPICS.specificGameWithId(gameId);
  const gameBoard = WEBSOCKET_TOPICS.gameBoardWithGameId(gameId);
  const city = WEBSOCKET_TOPICS.cityWithGameId(gameId);
  const battle = WEBSOCKET_TOPICS.battleWithGameId(gameId);
  switch (topic) {
    case WEBSOCKET_TOPICS.BROWSE_LOBBIES:
    case specificLobby:
      lobbyMessageHandler(message);
      break;
    case specificGame:
      gameMessageHandler(message);
      break;
    case gameBoard:
      console.log('Received game board message!');
      console.log(message);
      break;
    case city:
      console.log('Received city message!');
      console.log(message);
      break;
    case battle:
      console.log('Received battle message!');
      console.log(message);
      break;
    default:
      console.warn('Unidentified websocket topic for incoming message: ' +
        topic);
      console.warn(message);
  }
};

export default websocketMessageReceiver;
