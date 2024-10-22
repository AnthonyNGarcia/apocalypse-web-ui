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
  clearGeneralReducerExceptUserData: () => {
    return {
      type: generalAT.CLEAR_GENERAL_REDUCER_EXCEPT_USER_DATA,
    };
  },
  setSavedGames: (savedGames) => {
    return {
      type: generalAT.SET_SAVED_GAMES,
      savedGames: savedGames,
    };
  },
  setGameIdBeingRestored: (gameIdBeingRestored) => {
    return {
      type: generalAT.SET_GAME_ID_BEING_RESTORED,
      gameIdBeingRestored: gameIdBeingRestored,
    };
  },
};

export default actionCreators;
