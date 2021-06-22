import generalAT from '../actionTypes/generalActionTypes';

const actionCreators = {
  setOwnUsername: (username) => {
    return {
      type: generalAT.SET_OWN_USERNAME,
      username: username,
    };
  },
  setMainView: (mainView) => {
    return {
      type: generalAT.SET_MAIN_VIEW,
      mainView: mainView,
    };
  },
  setOwnUserId: (userId) => {
    return {
      type: generalAT.SET_OWN_USER_ID,
      userId: userId,
    };
  },
  setWebsocketTopics: (websocketTopics) => {
    return {
      type: generalAT.SET_WEBSOCKET_TOPICS,
      websocketTopics: websocketTopics,
    };
  },
};

export default actionCreators;
