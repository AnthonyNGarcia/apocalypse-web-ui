import generalAT from '../actionTypes/generalActionTypes';
import MAIN_VIEWS from '../../Components/Utilities/mainViews';

const initialState = {
  ownUsername: 'Default Username',
  ownUserId: 'Default User Id',
  mainView: MAIN_VIEWS.LOBBY_VIEW,
};

const setOwnUsername = (state, action) => {
  return {
    ...state,
    ownUsername: action.username,
  };
};

const setOwnUserId = (state, action) => {
  return {
    ...state,
    ownUserId: action.userId,
  };
};

const setMainView = (state, action) => {
  return {
    ...state,
    mainView: action.mainView,
  };
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case generalAT.SET_OWN_USERNAME: return setOwnUsername(state, action);
    case generalAT.SET_OWN_USER_ID: return setOwnUserId(state, action);
    case generalAT.SET_MAIN_VIEW: return setMainView(state, action);
    default: return state;
  }
};

export default reducer;
