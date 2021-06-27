/* eslint-disable max-len */
import cityMenuAT from '../actionTypes/cityMenuActionTypes';
import CITY_MENU_SUPPLEMENTAL_VIEWS from '../../Components/Utilities/cityMenuSupplementalViews';
import CITY_MENU_TAB from '../../Components/Utilities/cityMenuTabs';

const initialState = {
  showCityModalInfo: false,
  showResearchModalInfo: false,
  cityMenuTab: CITY_MENU_TAB.PRODUCTION,
  cityMenuSupplementalView: CITY_MENU_SUPPLEMENTAL_VIEWS.NONE,
  cityMenuSupplementalData: {},
};

const setShowCityModalInfo = (state, action) => {
  return {
    ...state,
    showCityModalInfo: action.showCityModalInfo,
  };
};

const setShowResearchModalInfo = (state, action) => {
  return {
    ...state,
    showResearchModalInfo: action.showResearchModalInfo,
  };
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
    case cityMenuAT.SET_SHOW_CITY_MODAL_INFO: return setShowCityModalInfo(state, action);
    case cityMenuAT.SET_SHOW_RESEARCH_MODAL_INFO: return setShowResearchModalInfo(state, action);
    case cityMenuAT.SET_CITY_MENU_TAB: return setCityMenuTab(state, action);
    case cityMenuAT.SET_CITY_MENU_SUPPLEMENTAL_VIEW: return setCityMenuSupplementalView(state, action);
    case cityMenuAT.SET_CITY_MENU_SUPPLEMENTAL_DATA: return setCityMenuSupplementalData(state, action);
    default: return state;
  }
};

export default reducer;
