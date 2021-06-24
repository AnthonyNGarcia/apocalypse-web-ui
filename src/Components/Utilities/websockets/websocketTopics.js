/**
 * ENUM file.
 */
const subscriberPrefix = '/subscribe';
const lobbyPrefix = subscriberPrefix + '/lobby';
const gamePrefix = subscriberPrefix + '/game';
const gameBoardPrefix = subscriberPrefix + '/gameboard';
const cityPrefix = subscriberPrefix + '/city';
const battlePrefix = subscriberPrefix + '/battle';

const WEBSOCKET_TOPICS = {
  BROWSE_LOBBIES: lobbyPrefix + '/browse-lobbies',
  specificLobbyWithId: (lobbyId) => lobbyPrefix + '/' + lobbyId,
  specificGameWithId: (gameId) => gamePrefix + '/' + gameId,
  gameBoardWithGameId: (gameId) => gameBoardPrefix + '/' + gameId,
  cityWithGameId: (gameId) => cityPrefix + '/' + gameId,
  battleWithGameId: (gameId) => battlePrefix + '/' + gameId,
};

export default WEBSOCKET_TOPICS;
