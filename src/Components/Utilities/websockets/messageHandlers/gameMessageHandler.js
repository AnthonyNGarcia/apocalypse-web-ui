import WEBSOCKET_MESSAGE_TYPES from '../websocketResponseMessageTypes';

/**
 * This is the Game Message Handler.
 * It handles all logic for updating overall game state from websocket messages.
 *
 * @param {Object} message websocket message body
 */
const messageHandler = (message) => {
  const messageType = message.websocketResponseMessageType;
  console.log(message);
  console.log(messageType);
  switch (messageType) {
    case WEBSOCKET_MESSAGE_TYPES.PLAYER_LEFT_GAME:
      console.log('A player left the game!');
      break;
    case WEBSOCKET_MESSAGE_TYPES.PLAYER_ENDED_TURN:
      console.logo('A player ended their turn!');
    default:
      console.warn('Unrecognized message type for Game topic!');
      console.warn(messageType);
      console.warn(message);
  }
};

export default messageHandler;
