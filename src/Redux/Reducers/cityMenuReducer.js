/* eslint-disable max-len */
import cityMenuAT from '../actionTypes/cityMenuActionTypes';
import CITY_MENU_SUPPLEMENTAL_VIEWS from '../../Components/Utilities/cityMenuSupplementalViews';
import CITY_MENU_TAB from '../../Components/Utilities/cityMenuTabs';

const initialState = {
  cityMenuTab: CITY_MENU_TAB.PRODUCTION,
  cityMenuSupplementalView: CITY_MENU_SUPPLEMENTAL_VIEWS.NONE,
  cityMenuSupplementalData: {},
};

const setCityMenuTab= (state, action) => {
  return {
    ...state,
    cityMenuTab: action.cityMenuTab,
  };
};

const setCityMenuSupplementalView = (state, action) => {
  return {
    ...state,
    cityMenuSupplementalView: action.cityMenuSupplementalView,
  };
};

const setCityMenuSupplementalData = (state, action) => {
  return {
    ...state,
    cityMenuSupplementalData: action.cityMenuSupplementalData,
  };
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case cityMenuAT.SET_CITY_MENU_TAB: return setCityMenuTab(state, action);
    case cityMenuAT.SET_CITY_MENU_SUPPLEMENTAL_VIEW: return setCityMenuSupplementalView(state, action);
    case cityMenuAT.SET_CITY_MENU_SUPPLEMENTAL_DATA: return setCityMenuSupplementalData(state, action);
    default: return state;
  }
};

export default reducer;
