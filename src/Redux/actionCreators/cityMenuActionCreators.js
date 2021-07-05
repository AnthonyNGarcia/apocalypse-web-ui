import cityMenuAT from '../actionTypes/cityMenuActionTypes';
import gameBoardViewAT from '../actionTypes/gameBoardViewActionTypes';
import {store} from '../../App';

const actionCreators = {
  setCityMenuTab: (cityMenuTab) => {
    return {
      type: cityMenuAT.SET_CITY_MENU_TAB,
      cityMenuTab: cityMenuTab,
    };
  },
  setCurrentCityConstructionProject: (constructionProject) => {
    const state = store.getState();
    const newGameBoard = [...state.gameBoardView.gameBoard];
    newGameBoard[state.gameBoardView.selectedTilePosition]
        .city.currentConstructionProject = constructionProject;
    return {
      type: gameBoardViewAT.SET_GAME_BOARD,
      gameBoard: newGameBoard,
    };
  },
  setCurrentCityRecruitmentQueue: (recruitmentQueue) => {
    const state = store.getState();
    const newGameBoard = [...state.gameBoardView.gameBoard];
    newGameBoard[state.gameBoardView.selectedTilePosition]
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
