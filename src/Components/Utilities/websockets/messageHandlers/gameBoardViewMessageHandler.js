import WEBSOCKET_MESSAGE_TYPES from '../websocketResponseMessageTypes';
import {store} from '../../../../App';
import gameBoardViewAC from
  '../../../../Redux/actionCreators/gameBoardViewActionCreators';
import gamePlayerAC from
  '../../../../Redux/actionCreators/gamePlayerActionCreators';
import MAIN_PANEL_VIEWS from '../../gameMainPanelViews';
import PLAYER from '../../playerEnums';

/**
 * This is the Game Board Message Handler.
 *
 * It handles all logic for updating the game board from websocket messages.
 *
 * @param {Object} message containing the actual message as well as the
 * WEBSOCKET_RESPONSE_MESSAGE_TYPE value, at websocketResponseMessageType.
 */
const messageHandler = (message) => {
  const messageType = message.websocketResponseMessageType;
  switch (messageType) {
    case WEBSOCKET_MESSAGE_TYPES.ARMY_MOVED_UNCONTESTED:
      armyMoved(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.SETTLER_MOVED_UNCONTESTED:
      settlerMoved(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.ARMY_STANCE_CHANGED:
      armyStanceChanged(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.ARMY_UNITS_UPDATED:
      armyUnitsChanged(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.SETTLER_CREATED_CITY:
      settlerCreatedCity(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.SUPERCHARGE_PERFORMED:
      superchargePerformed(message);
      break;
    default:
      console.warn('Unrecognized message type for Game Board topic!');
      console.warn(messageType);
      console.warn(message);
  }
};

const armyMoved = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  const updatedEndingTile = message.updatedEndingTile;
  const updatedStartingTile = message.updatedStartingTile;

  if (updatedEndingTile) {
    updatedGameBoard[message.updatedEndingTile.tilePosition] =
      message.updatedEndingTile;
  }
  if (updatedStartingTile) {
    updatedGameBoard[message.updatedStartingTile.tilePosition] =
      message.updatedStartingTile;
  }

  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
  store.dispatch(gamePlayerAC.setPlayerOne(message.updatedPlayerOne));
  store.dispatch(gamePlayerAC.setPlayerTwo(message.updatedPlayerTwo));
};

const settlerMoved = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  updatedGameBoard[message.startingTilePosition].settler = null;
  updatedGameBoard[message.endingTilePosition].settler = message.settler;
  updatedGameBoard[message.endingTilePosition].hasAsteroid = false;

  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
  store.dispatch(gamePlayerAC.setPlayerOne(message.updatedPlayerOne));
  store.dispatch(gamePlayerAC.setPlayerTwo(message.updatedPlayerTwo));
};

const armyStanceChanged = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  updatedGameBoard[message.tilePosition].army = message.army;
  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
};

const armyUnitsChanged = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  updatedGameBoard[message.armyTilePosition].army.units =
    message.updatedArmyUnits;
  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
};

const settlerCreatedCity = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  const updatedSettlerTilePosition = message.updatedSettlerTile.tilePosition;
  updatedGameBoard[updatedSettlerTilePosition] = message.updatedSettlerTile;
  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
  const selectedTilePosition = state.gameBoardView.selectedTilePosition;
  if (updatedSettlerTilePosition === selectedTilePosition) {
    store.dispatch(gameBoardViewAC
        .setMainPanelView(MAIN_PANEL_VIEWS.CITY_INFO));
  }
  const updatedPlayer = message.updatedPlayer;
  if (updatedPlayer.playerNumber === PLAYER.ONE) {
    store.dispatch(gamePlayerAC.setPlayerOne(updatedPlayer));
  } else if (updatedPlayer.playerNumber === PLAYER.TWO) {
    store.dispatch(gamePlayerAC.setPlayerTwo(updatedPlayer));
  }
};

const superchargePerformed = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  updatedGameBoard[message.updatedArmyTile.tilePosition] =
    message.updatedArmyTile;
  if (message.updatedPlayer.playerNumber === PLAYER.ONE) {
    store.dispatch(gamePlayerAC.setPlayerOne(message.updatedPlayer));
  } else if (message.updatedPlayer.playerNumber === PLAYER.TWO) {
    store.dispatch(gamePlayerAC.setPlayerTwo(message.updatedPlayer));
  }
  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
};

export default messageHandler;
