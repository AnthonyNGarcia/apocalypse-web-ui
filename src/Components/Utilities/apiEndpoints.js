/**
 * This file contains hard-coded URLs for this application to talk to its
 * accompanying back-end application. It exports and object with preconstructed
 * urls for components to start making calls, to reduce redundancy and the
 * associated possibilities for typos/errors.
 */
// const apiBasePath = 'https://dev-api.playapocalypse.com';
const apiBasePath = 'http://localhost:9595';

const apiEndpoints = {
  basePath: apiBasePath,
  websocketPath: apiBasePath + '/sockjs',
  userController: apiBasePath + '/user',
  lobbyController: apiBasePath + '/lobby',
  gameController: apiBasePath + '/game',
  battleController: apiBasePath + '/battle',
  armyController: apiBasePath + '/army',
  cityController: apiBasePath + '/city',
};

export default apiEndpoints;
