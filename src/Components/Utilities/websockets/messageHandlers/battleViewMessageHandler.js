import WEBSOCKET_MESSAGE_TYPES from '../websocketResponseMessageTypes';
import {store} from '../../../../App';
import battleViewAC from
  '../../../../Redux/actionCreators/battleViewActionCreators';
import gameBoardViewAC from
  '../../../../Redux/actionCreators/gameBoardViewActionCreators';
import gamePlayerAC from
  '../../../../Redux/actionCreators/gamePlayerActionCreators';
import gameAC from '../../../../Redux/actionCreators/gameActionCreators';
import GAME_VIEWS from '../../gameViews';

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
    case WEBSOCKET_MESSAGE_TYPES.BATTLE_INITIATED:
      battleInitiated(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.BATTLE_STARTED:
      battleStarted(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.BATTLE_DATA_UPDATED:
      battleDataUpdated(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.BATTLE_ENDED:
      battleEnded(message);
      break;
    default:
      console.warn('Unrecognized message type for Battle View topic!');
      console.warn(messageType);
      console.warn(message);
  }
};

const battleInitiated = async (message) => {
  await store.dispatch(battleViewAC.setBattleData(message.battleData));
  await store.dispatch(battleViewAC.setOwnArmySubmitted(false));
  await store.dispatch(battleViewAC.setSelectedBattleUnitIndex(-1));
  await store.dispatch(battleViewAC.setShowEnemyArmyInBattle(false));
  await store.dispatch(gameAC.setGameView(GAME_VIEWS.BATTLE_MAP_VIEW));
};

const battleStarted = async (message) => {
  await store.dispatch(battleViewAC.setOwnArmySubmitted(true));
  await store.dispatch(battleViewAC.setSelectedBattleUnitIndex(-1));
  await store.dispatch(battleViewAC.setBattleData(message.battleData));
  await store.dispatch(battleViewAC.setShowEnemyArmyInBattle(true));
};

const battleDataUpdated = (message) => {
  store.dispatch(battleViewAC.setBattleData(message.battleData));
};

const battleEnded = async (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];

  updatedGameBoard[message.attackingArmyStartingTilePosition]
      .army = null;
  updatedGameBoard[message.defendingArmyStartingTilePosition]
      .army = null;
  if (message.attackingArmyEndingTilePosition >= 0) {
    updatedGameBoard[message.attackingArmyEndingTilePosition]
        .army = message.attackingArmy;
  }
  if (message.defendingArmyEndingTilePosition >= 0) {
    updatedGameBoard[message.defendingArmyEndingTilePosition]
        .army = message.defendingArmy;
  }
  updatedGameBoard[message.defendingArmyStartingTilePosition] =
     message.updatedDefenderTile;

  const updatedPlayerOne = {...state.gamePlayer.playerOne};
  updatedPlayerOne.currentAstridium =
    message.updatedPlayerOneCurrentAstridium;
  updatedPlayerOne.astridiumCollected =
    message.updatedPlayerOneAstridiumCollected;

  const updatedPlayerTwo = {...state.gamePlayer.playerTwo};
  updatedPlayerTwo.currentAstridium =
    message.updatedPlayerTwoCurrentAstridium;
  updatedPlayerTwo.astridiumCollected =
    message.updatedPlayerTwoAstridiumCollected;

  await store.dispatch(gamePlayerAC.setPlayerOne(updatedPlayerOne));
  await store.dispatch(gamePlayerAC.setPlayerTwo(updatedPlayerTwo));
  await store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
  await store.dispatch(gameAC.setGameView(GAME_VIEWS.GAME_BOARD_VIEW));
  await store.dispatch(battleViewAC.setBattleData(null));
  await store.dispatch(battleViewAC.setOwnArmySubmitted(false));
  await store.dispatch(battleViewAC.setSelectedBattleUnitIndex(-1));
  await store.dispatch(battleViewAC.setShowEnemyArmyInBattle(false));
};

export default messageHandler;
