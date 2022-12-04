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
import chatAC from '../../../../Redux/actionCreators/chatActionCreators';
import CITY_MENU_SUPPLEMENTAL_VIEWS from '../../cityMenuSupplementalViews';
import MAIN_PANEL_VIEWS from '../../gameMainPanelViews';
import CHAT_TOPIC from '../../chatTopics';
import ADVANCED_DETAILS_MODAL_VIEW from '../../advancedDetailsModalViews';
import UNCLOSEABLE_MODAL_VIEW from '../../uncloseableModalView';

/**
 * This is the Game Message Handler.
 *
 * It handles all logic for updating overall game state from websocket messages.
 *
 * @param {Object} message containing the actual message as well as the
 * WEBSOCKET_RESPONSE_MESSAGE_TYPE value, at websocketResponseMessageType.
 */
const messageHandler = (message) => {
  const messageType = message.websocketResponseMessageType;
  switch (messageType) {
    case WEBSOCKET_MESSAGE_TYPES.PLAYER_LEFT_GAME:
      console.warn('A player left the game!');
      leavingGameCleanup(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.PLAYER_ENDED_TURN:
      nextTurnUpdate(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.PLAYER_WON_GAME:
      playerWonGame(message);
      break;
    default:
      console.warn('Unrecognized message type for Game topic!');
      console.warn(messageType);
      console.warn(message);
  }
};

const leavingGameCleanup = (message) => {
  const state = store.getState();
  const gameDataToSave = message.gameData;

  const gameId = state.game.gameId;
  const topicForThisGame = WEBSOCKET_TOPICS.specificGameWithId(gameId);
  const topicForGameBoard = WEBSOCKET_TOPICS.gameBoardWithGameId(gameId);
  const topicForCity = WEBSOCKET_TOPICS.cityWithGameId(gameId);
  const topicForBattle = WEBSOCKET_TOPICS.battleWithGameId(gameId);
  const topicForChat = WEBSOCKET_TOPICS.gameChatWithId(gameId);

  const oldWebsocketTopics = [...state.general.websocketTopics];
  const updatedWebsocketTopics = oldWebsocketTopics
      .filter((topic) => topic !== topicForThisGame)
      .filter((topic) => topic !== topicForGameBoard)
      .filter((topic) => topic !== topicForCity)
      .filter((topic) => topic !== topicForBattle)
      .filter((topic) => topic !== topicForChat);

  updatedWebsocketTopics.push(WEBSOCKET_TOPICS.BROWSE_LOBBIES);

  store.dispatch(generalAC.setWebsocketTopics(updatedWebsocketTopics));
  store.dispatch(generalAC.setMainView(MAIN_VIEWS.LOBBY_VIEW));
  if (!gameDataToSave.gameIsOver) {
    console.log('Game Is Not Over - saving to local storage!');
    const newSavedGames = {...state.general.savedGames};
    newSavedGames[gameId] = gameDataToSave;
    localStorage.setItem('SAVED_GAMES', JSON.stringify(newSavedGames));
  }

  store.dispatch(chatAC.setGameMessages([]));
  store.dispatch(chatAC.setSelectedChatTopic(CHAT_TOPIC.GLOBAL));
  store.dispatch(gameAC.setGameConstants(null));
  store.dispatch(gameAC.setGameId(null));
  store.dispatch(gameBoardViewAC.setGameBoard(null));
  store.dispatch(gamePlayerAC.setPlayerOne(null));
  store.dispatch(gamePlayerAC.setPlayerTwo(null));
  store.dispatch(gamePlayerAC.setPlayerWhoseTurnItIs(null));
  store.dispatch(gamePlayerAC.setOwnPlayerNumber(null));
  store.dispatch(gamePlayerAC.setWinningPlayer(null));
  store.dispatch(gameAC.setGameView(GAME_VIEWS.GAME_BOARD_VIEW));
};

const playerWonGame = (message) => {
  store.dispatch(gamePlayerAC.setWinningPlayer(message.winningPlayer));
  store.dispatch(gamePlayerAC.setPlayerOne(message.updatedGameData.playerOne));
  store.dispatch(gamePlayerAC.setPlayerTwo(message.updatedGameData.playerTwo));
  store.dispatch(gameAC.setGameRound(message.updatedGameData.round));
  store.dispatch(gameBoardViewAC.setGameBoard(
      message.updatedGameData.gameBoard));
  store.dispatch(gameAC.setGameView(GAME_VIEWS.GAME_BOARD_VIEW));
  store.dispatch(gameBoardViewAC.setUncloseableModalView(
      UNCLOSEABLE_MODAL_VIEW.PLAYER_WON_GAME));
};

const nextTurnUpdate = (message) => {
  store.dispatch(gameBoardViewAC.setGameBoard(
      message.updatedGameData.gameBoard));
  store.dispatch(gamePlayerAC.setPlayerOne(message.updatedGameData.playerOne));
  store.dispatch(gamePlayerAC.setPlayerTwo(message.updatedGameData.playerTwo));
  store.dispatch(gamePlayerAC.setPlayerWhoseTurnItIs(
      message.updatedGameData.playerWhoseTurnItIs));
  store.dispatch(gameAC.setGameRound(message.updatedGameData.round));
  // Reset Game View
  store.dispatch(gameAC.setGameView(GAME_VIEWS.GAME_BOARD_VIEW));
  store.dispatch(gameAC.setAdvancedDetailsModalView(
      ADVANCED_DETAILS_MODAL_VIEW.NONE));
  store.dispatch(gameBoardViewAC.setMainPanelView(MAIN_PANEL_VIEWS.NONE));
  store.dispatch(cityMenuAC.setCityMenuSupplementalData({}));
  store.dispatch(cityMenuAC.setCityMenuSupplementalView(
      CITY_MENU_SUPPLEMENTAL_VIEWS.NONE));
};

export default messageHandler;
