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
};

export default actionCreators;
