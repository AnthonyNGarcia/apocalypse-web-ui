/* eslint-disable max-len */
import gameAT from '../actionTypes/gameActionTypes';
import GAME_VIEWS from '../../Components/Utilities/gameViews';
import defaultHoneycombConfigs from '../../Components/Utilities/honeycombConfigs';
import MAIN_PANEL_VIEWS from '../../Components/Utilities/gameMainPanelViews';
import SUPPLEMENTAL_PANEL_VIEWS from '../../Components/Utilities/gameSupplementalPanelViews';
import ACTION_BAR_VIEWS from '../../Components/Utilities/actionBarViews';
import CITY_MENU_SUPPLEMENTAL_VIEWS from '../../Components/Utilities/cityMenuSupplementalViews';

const initialState = {
  gameView: GAME_VIEWS.CAMPAIGN_MAP_VIEW,
  gameId: null,
  playerOne: null,
  playerTwo: null,
  playerWhoseTurnItIs: null,
  ownPlayerNumber: null,
  gameBoard: [],
  honeycombConfigs: defaultHoneycombConfigs,
  mainPanelView: MAIN_PANEL_VIEWS.NONE,
  mainPanelData: {},
  supplementalPanelView: SUPPLEMENTAL_PANEL_VIEWS.NONE,
  supplementalPanelData: {},
  actionBarView: ACTION_BAR_VIEWS.NONE,
  actionBarData: {},
  actionBarTooltip: 'Select an Army or City to get started.',
  isMovingArmy: false,
  selectedTilePosition: -1,
  isOwnTurn: false,
  awaitingServerConfirmation: false,
  gameConstants: {},
  viewingArmyInCity: true,
  showCityModalInfo: false,
  showResearchModalInfo: false,
  cityShowingProductionTab: true,
  cityMenuSupplementalView: CITY_MENU_SUPPLEMENTAL_VIEWS.NONE,
  cityMenuSupplementalData: {},
};

const setGameView = (state, action) => {
  return {
    ...state,
    gameView: action.gameView,
  };
};

const setGameId = (state, action) => {
  return {
    ...state,
    gameId: action.gameId,
  };
};

const setPlayerOne = (state, action) => {
  return {
    ...state,
    playerOne: action.player,
  };
};

const setPlayerTwo = (state, action) => {
  return {
    ...state,
    playerTwo: action.player,
  };
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

const setMainPanelData = (state, action) => {
  return {
    ...state,
    mainPanelData: action.mainPanelData,
  };
};

const setSupplementalPanelView = (state, action) => {
  return {
    ...state,
    supplementalPanelView: action.supplementalPanelView,
  };
};

const setSupplementalPanelData = (state, action) => {
  return {
    ...state,
    supplementalPanelView: action.supplementalPanelData,
  };
};

const setActionBarView = (state, action) => {
  return {
    ...state,
    actionBarView: action.view,
  };
};

const setActionBarData = (state, action) => {
  return {
    ...state,
    actionBarData: action.data,
  };
};

const setIsMovingArmy = (state, action) => {
  return {
    ...state,
    isMovingArmy: action.isMovingArmy,
  };
};

const setActionBarTooltip = (state, action) => {
  return {
    ...state,
    actionBarTooltip: action.actionBarTooltip,
  };
};

const setSelectedTilePosition = (state, action) => {
  return {
    ...state,
    selectedTilePosition: action.selectedTilePosition,
  };
};

const setAwaitingServerConfirmation = (state, action) => {
  return {
    ...state,
    awaitingServerConfirmation: action.awaitingServerConfirmation,
  };
};

const setGameConstants = (state, action) => {
  return {
    ...state,
    gameConstants: action.gameConstants,
  };
};

const setPlayerWhoseTurnItIs = (state, action) => {
  return {
    ...state,
    playerWhoseTurnItIs: action.playerWhoseTurnItIs,
    isOwnTurn: action.playerWhoseTurnItIs === state.ownPlayerNumber,
  };
};

const setOwnPlayerNumber = (state, action) => {
  return {
    ...state,
    ownPlayerNumber: action.ownPlayerNumber,
  };
};

const setViewingArmyInCity = (state, action) => {
  return {
    ...state,
    viewingArmyInCity: action.viewingArmyInCity,
  };
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

const setCityShowingProductionTab = (state, action) => {
  return {
    ...state,
    cityShowingProductionTab: action.cityShowingProductionTab,
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
    case gameAT.SET_GAME_VIEW: return setGameView(state, action);
    case gameAT.SET_GAME_ID: return setGameId(state, action);
    case gameAT.SET_PLAYER_ONE: return setPlayerOne(state, action);
    case gameAT.SET_PLAYER_TWO: return setPlayerTwo(state, action);
    case gameAT.SET_GAME_BOARD: return setGameBoard(state, action);
    case gameAT.SET_MAIN_PANEL_VIEW: return setMainPanelView(state, action);
    case gameAT.SET_MAIN_PANEL_DATA: return setMainPanelData(state, action);
    case gameAT.SET_SUPPLEMENTAL_PANEL_VIEW: return setSupplementalPanelView(state, action);
    case gameAT.SET_SUPPLEMENTAL_PANEL_DATA: return setSupplementalPanelData(state, action);
    case gameAT.SET_ACTION_BAR_VIEW: return setActionBarView(state, action);
    case gameAT.SET_ACTION_BAR_DATA: return setActionBarData(state, action);
    case gameAT.SET_IS_MOVING_ARMY: return setIsMovingArmy(state, action);
    case gameAT.SET_ACTION_BAR_TOOLTIP: return setActionBarTooltip(state, action);
    case gameAT.SET_SELECTED_TILE_POSITION: return setSelectedTilePosition(state, action);
    case gameAT.SET_AWAITING_SERVER_CONFIRMATION: return setAwaitingServerConfirmation(state, action);
    case gameAT.SET_GAME_CONSTANTS: return setGameConstants(state, action);
    case gameAT.SET_PLAYER_WHOSE_TURN_IT_IS: return setPlayerWhoseTurnItIs(state, action);
    case gameAT.SET_OWN_PLAYER_NUMBER: return setOwnPlayerNumber(state, action);
    case gameAT.SET_VIEWING_ARMY_IN_CITY: return setViewingArmyInCity(state, action);
    case gameAT.SET_SHOW_CITY_MODAL_INFO: return setShowCityModalInfo(state, action);
    case gameAT.SET_SHOW_RESEARCH_MODAL_INFO: return setShowResearchModalInfo(state, action);
    case gameAT.SET_CITY_SHOWING_PRODUCTION_TAB: return setCityShowingProductionTab(state, action);
    case gameAT.SET_CITY_MENU_SUPPLEMENTAL_VIEW: return setCityMenuSupplementalView(state, action);
    case gameAT.SET_CITY_MENU_SUPPLEMENTAL_DATA: return setCityMenuSupplementalData(state, action);
    default: return state;
  }
};

export default reducer;
