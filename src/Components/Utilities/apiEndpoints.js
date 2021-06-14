/**
 * This file contains hard-coded URLs for this application to talk to its
 * accompanying back-end application. It exports and object with preconstructed
 * urls for components to start making calls, to reduce redundancy and the
 * associated possibilities for typos/errors.
 */
const apiBasePath = 'https://apocalypse-testing-nlb-d7c60e558daeb02d.elb.us-west-1.amazonaws.com:9595';

const apiEndpoints = {
  basePath: apiBasePath,
  websocketPath: apiBasePath + '/sockjs',
  userController: apiBasePath + '/user',
  lobbyController: apiBasePath + '/lobby',
  gameController: apiBasePath + '/game',
};

export default apiEndpoints;
