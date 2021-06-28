import WEBSOCKET_MESSAGE_TYPES from '../websocketResponseMessageTypes';
import lobbyAC from '../../../../Redux/actionCreators/lobbyActionCreators';
import generalAC from '../../../../Redux/actionCreators/generalActionCreators';
import gameAC from '../../../../Redux/actionCreators/gameActionCreators';
import gameBoardViewAC from
  '../../../../Redux/actionCreators/gameBoardViewActionCreators';
import gamePlayerAC from
  '../../../../Redux/actionCreators/gamePlayerActionCreators';
import chatAC from '../../../../Redux/actionCreators/chatActionCreators';
import {store} from '../../../../App';
import PLAYER from '../../playerEnums';
import LOBBY_VIEWS from '../../lobbyViews';
import WEBSOCKET_TOPICS from '../websocketTopics';
import GAME_VIEWS from '../../gameViews';
import MAIN_VIEWS from '../../mainViews';
import CHAT_TOPIC from '../../chatTopics';

/**
 * This is the Lobby Message Handler.
 *
 * It handles all logic for updating lobby state from websocket messages.
 *
 * @param {Object} message containing the actual message as well as the
 * WEBSOCKET_RESPONSE_MESSAGE_TYPE value, at websocketResponseMessageType.
 */
const messageHandler = (message) => {
  const messageType = message.websocketResponseMessageType;
  switch (messageType) {
    case WEBSOCKET_MESSAGE_TYPES.LOBBY_LIST_CHANGED:
      store.dispatch(lobbyAC.setLobbyList(message.updatedLobbyList));
      break;
    case WEBSOCKET_MESSAGE_TYPES.LOBBY_PLAYER_CHANGED:
      const changingPlayerNumber = message.inLobbyPlayer.playerNumber;
      if (changingPlayerNumber === PLAYER.ONE) {
        store.dispatch(lobbyAC.setLobbyPlayerOne(message.inLobbyPlayer));
      } else if (changingPlayerNumber === PLAYER.TWO) {
        store.dispatch(lobbyAC.setLobbyPlayerTwo(message.inLobbyPlayer));
      }
      break;
    case WEBSOCKET_MESSAGE_TYPES.PLAYER_LEFT_LOBBY:
      if (message.leavingPlayerNumber === PLAYER.ONE) {
        leavingLobbyCleanup();
      } else {
        leavingLobbyCleanup(PLAYER.TWO);
        store.dispatch(lobbyAC.setLobbyPlayerTwo(null));
      }
      break;
    case WEBSOCKET_MESSAGE_TYPES.GAME_STARTED:
      startGameCleanup(message);
      break;
    default:
      console.warn('Unrecognized message type for Lobby topic!');
      console.warn(messageType);
      console.warn(message);
  }
};

const leavingLobbyCleanup = (leavingPlayerNumber) => {
  const state = store.getState();
  if (leavingPlayerNumber) {
    const playerOneId = state.lobby.lobbyPlayerOne.userId;
    const playerTwoId = state.lobby.lobbyPlayerTwo.userId;
    const ownId = state.general.ownUserId;
    const ownPlayerNumber =
      ownId === playerOneId ? PLAYER.ONE :
      ownId === playerTwoId ? PLAYER.TWO :
      'UNRECOGNIZED_PLAYER_NUMBER';
    if (leavingPlayerNumber !== ownPlayerNumber) {
      return;
    }
  }
  const topicForThisLobby = WEBSOCKET_TOPICS.specificLobbyWithId(
      state.lobby.lobbyId);
  const thisLobbyChatTopic = WEBSOCKET_TOPICS.lobbyChatWithId(
      state.lobby.lobbyId);
  const oldWebsocketTopics = [...state.general.websocketTopics];
  const updatedWebsocketTopics = oldWebsocketTopics.filter((topic) =>
    topic !== topicForThisLobby && topic !== thisLobbyChatTopic);
  updatedWebsocketTopics.push(WEBSOCKET_TOPICS.BROWSE_LOBBIES);

  store.dispatch(chatAC.setSelectedChatTopic(CHAT_TOPIC.GLOBAL));
  store.dispatch(chatAC.setLobbyMessages([]));
  store.dispatch(generalAC.setWebsocketTopics(updatedWebsocketTopics));
  store.dispatch(lobbyAC.setLobbyView(LOBBY_VIEWS.BROWSE_LOBBIES_VIEW));
  store.dispatch(lobbyAC.setLobbyPlayerOne(null));
  store.dispatch(lobbyAC.setLobbyPlayerTwo(null));
  store.dispatch(lobbyAC.setLobbyId(null));
};

const startGameCleanup = async (message) => {
  const gameData = message.initialGameData;
  const state = store.getState();
  const playerOneId = gameData.playerOne.userId;
  const playerTwoId = gameData.playerTwo.userId;
  const ownId = state.general.ownUserId;
  const ownPlayerNumber =
    ownId === playerOneId ? PLAYER.ONE :
    ownId === playerTwoId ? PLAYER.TWO :
    'UNRECOGNIZED_PLAYER_NUMBER';

  const topicForThisLobby = WEBSOCKET_TOPICS.specificLobbyWithId(
      state.lobby.lobbyId);
  const thisLobbyChatTopic = WEBSOCKET_TOPICS.lobbyChatWithId(
      state.lobby.lobbyId);
  const oldWebsocketTopics = [...state.general.websocketTopics];
  const updatedWebsocketTopics = oldWebsocketTopics.filter((topic) =>
    topic !== topicForThisLobby && topic !== thisLobbyChatTopic);
  updatedWebsocketTopics.push(WEBSOCKET_TOPICS.specificGameWithId(
      gameData.gameId));
  updatedWebsocketTopics.push(WEBSOCKET_TOPICS.gameBoardWithGameId(
      gameData.gameId));
  updatedWebsocketTopics.push(WEBSOCKET_TOPICS.cityWithGameId(
      gameData.gameId));
  updatedWebsocketTopics.push(WEBSOCKET_TOPICS.battleWithGameId(
      gameData.gameId));
  updatedWebsocketTopics.push(WEBSOCKET_TOPICS.gameChatWithId(
      gameData.gameId));

  await store.dispatch(generalAC.setWebsocketTopics(updatedWebsocketTopics));
  await store.dispatch(lobbyAC.setLobbyView(LOBBY_VIEWS.BROWSE_LOBBIES_VIEW));
  await store.dispatch(lobbyAC.setLobbyPlayerOne(null));
  await store.dispatch(lobbyAC.setLobbyPlayerTwo(null));
  await store.dispatch(lobbyAC.setLobbyId(null));

  await store.dispatch(gameAC.setGameConstants(message.gameConstants));
  await store.dispatch(gameAC.setGameId(gameData.gameId));
  await store.dispatch(gameBoardViewAC.setGameBoard(gameData.gameBoard));
  await store.dispatch(gamePlayerAC.setPlayerOne(gameData.playerOne));
  await store.dispatch(gamePlayerAC.setPlayerTwo(gameData.playerTwo));
  await store.dispatch(gamePlayerAC.setPlayerWhoseTurnItIs(
      gameData.playerWhoseTurnItIs));
  await store.dispatch(gamePlayerAC.setOwnPlayerNumber(ownPlayerNumber));
  await store.dispatch(chatAC.setSelectedChatTopic(CHAT_TOPIC.GAME));
  await store.dispatch(gameAC.setGameView(GAME_VIEWS.GAME_BOARD_VIEW));

  await store.dispatch(generalAC.setMainView(MAIN_VIEWS.GAME_VIEW));
};

export default messageHandler;
