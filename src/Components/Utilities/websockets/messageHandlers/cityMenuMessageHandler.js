import WEBSOCKET_MESSAGE_TYPES from '../websocketResponseMessageTypes';
import {store} from '../../../../App';
import gameBoardViewAC from
  '../../../../Redux/actionCreators/gameBoardViewActionCreators';

/**
 * This is the City Menu Message Handler.
 *
 * It handles all logic for updating the currently viewed City Menu from
 * websocket messages.
 *
 * @param {Object} message containing the actual message as well as the
 * WEBSOCKET_RESPONSE_MESSAGE_TYPE value, at websocketResponseMessageType.
 */
const messageHandler = (message) => {
  const messageType = message.websocketResponseMessageType;
  switch (messageType) {
    case WEBSOCKET_MESSAGE_TYPES.CITY_STATE_UPDATED:
      cityStateUpdated(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.UNIT_RECRUITMENT_QUEUE_UPDATED:
      unitRecruitmentQueueUpdated(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.UNASSIGNED_UNITS_UPDATED:
      unassignedUnitsUpdated(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.ARMY_AND_UNASSIGNED_UNITS_UPDATED:
      armyAndUnassignedUnitsUpdated(message);
      break;
    default:
      console.warn('Unrecognized message type for City Menu topic!');
      console.warn(messageType);
      console.warn(message);
  }
};

const cityStateUpdated = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  updatedGameBoard[message.cityTilePosition]
      .city = message.updatedCity;
  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
};

const unitRecruitmentQueueUpdated = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  updatedGameBoard[message.cityTilePosition]
      .city.currentRecruitmentQueue = message.updatedUnitRecruitmentQueue;
  updatedGameBoard[message.cityTilePosition]
      .city.unitProductionRemaining = message.updatedRemainingUnitProduction;
  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
};

const unassignedUnitsUpdated = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  updatedGameBoard[message.cityTilePosition]
      .city.unassignedUnits = message.updatedUnassignedUnits;
  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
};

const armyAndUnassignedUnitsUpdated = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  updatedGameBoard[message.tilePosition]
      .city.unassignedUnits = message.updatedUnassignedUnits;
  updatedGameBoard[message.tilePosition]
      .army.units = message.updatedArmyUnits;
  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
};

export default messageHandler;