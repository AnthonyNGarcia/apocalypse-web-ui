import WEBSOCKET_MESSAGE_TYPES from '../websocketResponseMessageTypes';
import {store} from '../../../../App';
import PLAYER from '../../playerEnums';
import gameBoardViewAC from
  '../../../../Redux/actionCreators/gameBoardViewActionCreators';
import gamePlayerAC from
  '../../../../Redux/actionCreators/gamePlayerActionCreators';
import MAIN_PANEL_VIEWS from '../../gameMainPanelViews';

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
      armyMovedUncontested(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.SETTLER_MOVED_UNCONTESTED:
      settlerMovedUncontested(message);
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
  updatedGameBoard[message.endingTilePosition] = message.updatedTile;
  console.log(updatedGameBoard[message.endingTilePosition]);
  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));

  if (message.updatedTile.army.owner === PLAYER.ONE) {
    const updatedPlayerOne = {...state.gamePlayer.playerOne};
    updatedPlayerOne.astridiumCollected = message.updatedAstridiumCollected;
    updatedPlayerOne.currentAstridium = message.updatedCurrentAstridium;
    store.dispatch(gamePlayerAC.setPlayerOne(updatedPlayerOne));
  } else {
    const updatedPlayerTwo = {...state.gamePlayer.playerTwo};
    updatedPlayerTwo.astridiumCollected = message.updatedAstridiumCollected;
    updatedPlayerTwo.currentAstridium = message.updatedCurrentAstridium;
    store.dispatch(gamePlayerAC.setPlayerTwo(updatedPlayerTwo));
  }
};

const settlerMovedUncontested = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  updatedGameBoard[message.startingTilePosition].settler = null;
  updatedGameBoard[message.endingTilePosition].settler = message.settler;
  updatedGameBoard[message.endingTilePosition].hasAsteroid = false;
  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));

  if (message.settler.owner === PLAYER.ONE) {
    const updatedPlayerOne = {...state.gamePlayer.playerOne};
    updatedPlayerOne.astridiumCollected = message.updatedAstridiumCollected;
    updatedPlayerOne.currentAstridium = message.updatedCurrentAstridium;
    store.dispatch(gamePlayerAC.setPlayerOne(updatedPlayerOne));
  } else {
    const updatedPlayerTwo = {...state.gamePlayer.playerTwo};
    updatedPlayerTwo.astridiumCollected = message.updatedAstridiumCollected;
    updatedPlayerTwo.currentAstridium = message.updatedCurrentAstridium;
    store.dispatch(gamePlayerAC.setPlayerTwo(updatedPlayerTwo));
  }
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
};

export default messageHandler;
