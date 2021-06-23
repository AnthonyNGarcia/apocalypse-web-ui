/**
 * ENUM file.
 */
const subscriberPrefix = '/subscribe';
const lobbyPrefix = subscriberPrefix + '/lobby';
const gamePrefix = subscriberPrefix + '/game';

const WEBSOCKET_TOPICS = {
  BROWSE_LOBBIES: lobbyPrefix + '/browse-lobbies',
  lobbyWithId: (lobbyId) => lobbyPrefix + '/' + lobbyId,
  gameWithId: (gameId) => gamePrefix + '/' + gameId,
};

export default WEBSOCKET_TOPICS;
