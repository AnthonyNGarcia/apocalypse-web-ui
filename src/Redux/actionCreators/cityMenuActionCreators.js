import cityMenuAT from '../actionTypes/cityMenuActionTypes';
import {store} from '../../App';

const actionCreators = {
  setShowCityModalInfo: (showCityModalInfo) => {
    return {
      type: cityMenuAT.SET_SHOW_CITY_MODAL_INFO,
      showCityModalInfo: showCityModalInfo,
    };
  },
  setShowResearchModalInfo: (showResearchModalInfo) => {
    return {
      type: cityMenuAT.SET_SHOW_RESEARCH_MODAL_INFO,
      showResearchModalInfo: showResearchModalInfo,
    };
  },
  setCityShowingProductionTab: (cityShowingProductionTab) => {
    return {
      type: cityMenuAT.SET_CITY_SHOWING_PRODUCTION_TAB,
      cityShowingProductionTab: cityShowingProductionTab,
    };
  },
  setCurrentCityConstructionProject: (constructionProject) => {
    const state = store.getState();
    const newGameBoard = [...state.game.gameBoard];
    newGameBoard[state.game.selectedTilePosition]
        .city.currentConstructionProject = constructionProject;
    return {
      type: cityMenuAT.SET_GAME_BOARD,
      gameBoard: newGameBoard,
    };
  },
  setCurrentCityRecruitmentQueue: (recruitmentQueue) => {
    const state = store.getState();
    const newGameBoard = [...state.game.gameBoard];
    newGameBoard[state.game.selectedTilePosition]
        .city.currentRecruitmentQueue = recruitmentQueue;
    return {
      type: cityMenuAT.SET_GAME_BOARD,
      gameBoard: newGameBoard,
    };
  },
  setCityMenuSupplementalView: (cityMenuSupplementalView) => {
    return {
      type: cityMenuAT.SET_CITY_MENU_SUPPLEMENTAL_VIEW,
      cityMenuSupplementalView: cityMenuSupplementalView,
    };
  },
  setCityMenuSupplementalData: (cityMenuSupplementalData) => {
    return {
      type: cityMenuAT.SET_CITY_MENU_SUPPLEMENTAL_DATA,
      cityMenuSupplementalData: cityMenuSupplementalData,
    };
  },
};

export default actionCreators;
