/* eslint-disable max-len */
import gameBoardViewAT from '../actionTypes/gameBoardViewActionTypes';
import defaultHoneycombConfigs from '../../Components/Utilities/honeycombConfigs';
import MAIN_PANEL_VIEWS from '../../Components/Utilities/gameMainPanelViews';
import SUPPLEMENTAL_PANEL_VIEWS from '../../Components/Utilities/gameSupplementalPanelViews';

const initialState = {
  gameBoard: [],
  honeycombConfigs: defaultHoneycombConfigs,
  mainPanelView: MAIN_PANEL_VIEWS.NONE,
  supplementalPanelView: SUPPLEMENTAL_PANEL_VIEWS.NONE,
  isMovingArmy: false,
  isMovingSettler: false,
  selectedTilePosition: -1,
};

const setGameBoard = (state, action) => {
  return {
    ...state,
    gameBoard: action.gameBoard,
  };
};

const setMainPanelView = (state, action) => {
  return {
    ...state,
    mainPanelView: action.mainPanelView,
  };
};

const setSupplementalPanelView = (state, action) => {
  return {
    ...state,
    supplementalPanelView: action.supplementalPanelView,
  };
};

const setIsMovingArmy = (state, action) => {
  return {
    ...state,
    isMovingArmy: action.isMovingArmy,
  };
};

const setIsMovingSettler = (state, action) => {
  return {
    ...state,
    isMovingSettler: action.isMovingSettler,
  };
};

const setSelectedTilePosition = (state, action) => {
  return {
    ...state,
    selectedTilePosition: action.selectedTilePosition,
  };
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case gameBoardViewAT.SET_GAME_BOARD: return setGameBoard(state, action);
    case gameBoardViewAT.SET_MAIN_PANEL_VIEW: return setMainPanelView(state, action);
    case gameBoardViewAT.SET_SUPPLEMENTAL_PANEL_VIEW: return setSupplementalPanelView(state, action);
    case gameBoardViewAT.SET_IS_MOVING_ARMY: return setIsMovingArmy(state, action);
    case gameBoardViewAT.SET_IS_MOVING_SETTLER: return setIsMovingSettler(state, action);
    case gameBoardViewAT.SET_SELECTED_TILE_POSITION: return setSelectedTilePosition(state, action);
    default: return state;
  }
};

export default reducer;
