import WEBSOCKET_MESSAGE_TYPES from '../websocketResponseMessageTypes';
import {store} from '../../../../App';
import gameBoardViewAC from
  '../../../../Redux/actionCreators/gameBoardViewActionCreators';

/**
 * This is the Game Board Message Handler.
 * It handles all logic for updating the game board from websocket messages.
 *
 * @param {Object} message containing the actual message as well as the
 * WEBSOCKET_RESPONSE_MESSAGE_TYPE value, at websocketResponseMessageType.
 */
const messageHandler = (message) => {
  const messageType = message.websocketResponseMessageType;
  switch (messageType) {
    case WEBSOCKET_MESSAGE_TYPES.ARMY_MOVED_UNCONTESTED:
      armyMovedUncontested(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.ARMY_STANCE_CHANGED:
      armyStanceChanged(message);
      break;
    default:
      console.warn('Unrecognized message type for Game Board topic!');
      console.warn(messageType);
      console.warn(message);
  }
};

const armyMovedUncontested = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  updatedGameBoard[message.startingTilePosition].army = null;
  updatedGameBoard[message.endingTilePosition].army = message.army;
  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
};

const armyStanceChanged = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  updatedGameBoard[message.tilePosition].army = message.army;
  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
};

export default messageHandler;
