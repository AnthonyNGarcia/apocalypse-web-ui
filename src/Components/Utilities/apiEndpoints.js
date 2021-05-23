/**
 * This file contains hard-coded URLs for this application to talk to its
 * accompanying back-end application. It exports and object with preconstructed
 * urls for components to start making calls, to reduce redundancy and the
 * associated possibilities for typos/errors.
 */
const apiBasePath = 'http://localhost:9595';

const apiEndpoints = {
  basePath: apiBasePath,
  websocketPath: apiBasePath + '/sockjs',
};

export default apiEndpoints;
