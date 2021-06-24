import MAIN_VIEWS from '../../mainViews';
import GAME_VIEWS from '../../gameViews';
import WEBSOCKET_MESSAGE_TYPES from '../websocketResponseMessageTypes';
import WEBSOCKET_TOPICS from '../websocketTopics';
import {store} from '../../../../App';
import generalAC from '../../../../Redux/actionCreators/generalActionCreators';
import gameAC from '../../../../Redux/actionCreators/gameActionCreators';
import gameBoardViewAC from
  '../../../../Redux/actionCreators/gameBoardViewActionCreators';
import gamePlayerAC from
  '../../../../Redux/actionCreators/gamePlayerActionCreators';
import cityMenuAC from
  '../../../../Redux/actionCreators/cityMenuActionCreators';
import CITY_MENU_SUPPLEMENTAL_VIEWS from '../../cityMenuSupplementalViews';
import MAIN_PANEL_VIEWS from '../../gameMainPanelViews';

/**
 * This is the Game Message Handler.
 * It handles all logic for updating overall game state from websocket messages.
 *
 * @param {Object} message websocket message body
 */
const messageHandler = (message) => {
  const messageType = message.websocketResponseMessageType;
  switch (messageType) {
    case WEBSOCKET_MESSAGE_TYPES.PLAYER_LEFT_GAME:
      console.warn('A player left the game!');
      leavingGameCleanup();
      break;
    case WEBSOCKET_MESSAGE_TYPES.PLAYER_ENDED_TURN:
      nextTurnUpdate(message);
      break;
    default:
      console.warn('Unrecognized message type for Game topic!');
      console.warn(messageType);
      console.warn(message);
  }
};

const leavingGameCleanup = () => {
  const state = store.getState();

  const gameId = state.game.gameId;
  const topicForThisGame = WEBSOCKET_TOPICS.specificGameWithId(gameId);
  const topicForGameBoard = WEBSOCKET_TOPICS.gameBoardWithGameId(gameId);
  const topicForCity = WEBSOCKET_TOPICS.cityWithGameId(gameId);
  const topicForBattle = WEBSOCKET_TOPICS.battleWithGameId(gameId);

  const oldWebsocketTopics = [...state.general.websocketTopics];
  const updatedWebsocketTopics = oldWebsocketTopics
      .filter((topic) => topic !== topicForThisGame)
      .filter((topic) => topic !== topicForGameBoard)
      .filter((topic) => topic !== topicForCity)
      .filter((topic) => topic !== topicForBattle);

  updatedWebsocketTopics.push(WEBSOCKET_TOPICS.BROWSE_LOBBIES);

  store.dispatch(generalAC.setWebsocketTopics(updatedWebsocketTopics));
  store.dispatch(generalAC.setMainView(MAIN_VIEWS.LOBBY_VIEW));

  store.dispatch(gameAC.setGameConstants(null));
  store.dispatch(gameAC.setGameId(null));
  store.dispatch(gameBoardViewAC.setGameBoard(null));
  store.dispatch(gamePlayerAC.setPlayerOne(null));
  store.dispatch(gamePlayerAC.setPlayerTwo(null));
  store.dispatch(gamePlayerAC.setPlayerWhoseTurnItIs(null));
  store.dispatch(gamePlayerAC.setOwnPlayerNumber(null));
  store.dispatch(gameAC.setGameView(GAME_VIEWS.GAME_BOARD_VIEW));
};

const nextTurnUpdate = (message) => {
  store.dispatch(gameBoardViewAC.setGameBoard(
      message.updatedGameData.gameBoard));
  store.dispatch(gamePlayerAC.setPlayerOne(message.updatedGameData.playerOne));
  store.dispatch(gamePlayerAC.setPlayerTwo(message.updatedGameData.playerTwo));
  store.dispatch(gamePlayerAC.setPlayerWhoseTurnItIs(
      message.updatedGameData.playerWhoseTurnItIs));

  // Reset Game View
  store.dispatch(gameAC.setGameView(GAME_VIEWS.GAME_BOARD_VIEW));
  store.dispatch(cityMenuAC.setShowCityModalInfo(false));
  store.dispatch(gameBoardViewAC.setMainPanelView(MAIN_PANEL_VIEWS.NONE));
  store.dispatch(cityMenuAC.setCityMenuSupplementalData({}));
  store.dispatch(cityMenuAC.setCityMenuSupplementalView(
      CITY_MENU_SUPPLEMENTAL_VIEWS.NONE));
};

export default messageHandler;
