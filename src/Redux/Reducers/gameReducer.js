/* eslint-disable max-len */
import gameAT from '../actionTypes/gameActionTypes';
import GAME_VIEWS from '../../Components/Utilities/gameViews';
import defaultHoneycombConfigs from '../../Components/Utilities/honeycombConfigs';
import MAIN_PANEL_VIEWS from '../../Components/Utilities/gameMainPanelViews';
import SUPPLEMENTAL_PANEL_VIEWS from '../../Components/Utilities/gameSupplementalPanelViews';

console.log(defaultHoneycombConfigs);

const initialState = {
  gameView: GAME_VIEWS.CAMPAIGN_MAP_VIEW,
  gameId: null,
  playerOne: null,
  playerTwo: null,
  gameBoard: [],
  honeycombConfigs: defaultHoneycombConfigs,
  mainPanelView: MAIN_PANEL_VIEWS.NONE,
  mainPanelData: {},
  supplementalPanelView: SUPPLEMENTAL_PANEL_VIEWS.NONE,
  supplementalPanelData: {},
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
    default: return state;
  }
};

export default reducer;
