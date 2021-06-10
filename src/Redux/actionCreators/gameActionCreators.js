import gameAT from '../actionTypes/gameActionTypes';
import {store} from '../../App';

const actionCreators = {
  setGameView: (gameView) => {
    return {
      type: gameAT.SET_GAME_VIEW,
      gameView: gameView,
    };
  },
  setGameId: (gameId) => {
    return {
      type: gameAT.SET_GAME_ID,
      gameId: gameId,
    };
  },
  setPlayerOne: (player) => {
    return {
      type: gameAT.SET_PLAYER_ONE,
      player: player,
    };
  },
  setPlayerTwo: (player) => {
    return {
      type: gameAT.SET_PLAYER_TWO,
      player: player,
    };
  },
  setGameBoard: (gameBoard) => {
    return {
      type: gameAT.SET_GAME_BOARD,
      gameBoard: gameBoard,
    };
  },
  setMainPanelView: (mainPanelView) => {
    return {
      type: gameAT.SET_MAIN_PANEL_VIEW,
      mainPanelView: mainPanelView,
    };
  },
  setMainPanelData: (mainPanelData) => {
    return {
      type: gameAT.SET_MAIN_PANEL_DATA,
      mainPanelData: mainPanelData,
    };
  },
  setSupplementalPanelView: (supplementalPanelView) => {
    return {
      type: gameAT.SET_SUPPLEMENTAL_PANEL_VIEW,
      supplementalPanelView: supplementalPanelView,
    };
  },
  setSupplementalPanelData: (supplementalPanelData) => {
    return {
      type: gameAT.SET_SUPPLEMENTAL_PANEL_DATA,
      supplementalPanelData: supplementalPanelData,
    };
  },
  setActionBarView: (view) => {
    return {
      type: gameAT.SET_ACTION_BAR_VIEW,
      view: view,
    };
  },
  setActionBarData: (data) => {
    return {
      type: gameAT.SET_ACTION_BAR_DATA,
      data: data,
    };
  },
  setIsMovingArmy: (isMovingArmy) => {
    return {
      type: gameAT.SET_IS_MOVING_ARMY,
      isMovingArmy: isMovingArmy,
    };
  },
  setActionBarTooltip: (actionBarTooltip) => {
    return {
      type: gameAT.SET_ACTION_BAR_TOOLTIP,
      actionBarTooltip: actionBarTooltip,
    };
  },
  setSelectedTilePosition: (selectedTilePosition) => {
    return {
      type: gameAT.SET_SELECTED_TILE_POSITION,
      selectedTilePosition: selectedTilePosition,
    };
  },
  setAwaitingServerConfirmation: (awaitingServerConfirmation) => {
    return {
      type: gameAT.SET_AWAITING_SERVER_CONFIRMATION,
      awaitingServerConfirmation: awaitingServerConfirmation,
    };
  },
  setGameConstants: (gameConstants) => {
    return {
      type: gameAT.SET_GAME_CONSTANTS,
      gameConstants: gameConstants,
    };
  },
  setPlayerWhoseTurnItIs: (playerWhoseTurnItIs) => {
    return {
      type: gameAT.SET_PLAYER_WHOSE_TURN_IT_IS,
      playerWhoseTurnItIs: playerWhoseTurnItIs,
    };
  },
  setOwnPlayerNumber: (ownPlayerNumber) => {
    return {
      type: gameAT.SET_OWN_PLAYER_NUMBER,
      ownPlayerNumber: ownPlayerNumber,
    };
  },
  setViewingArmyInCity: (viewingArmyInCity) => {
    return {
      type: gameAT.SET_VIEWING_ARMY_IN_CITY,
      viewingArmyInCity: viewingArmyInCity,
    };
  },
  setShowCityModalInfo: (showCityModalInfo) => {
    return {
      type: gameAT.SET_SHOW_CITY_MODAL_INFO,
      showCityModalInfo: showCityModalInfo,
    };
  },
  setShowResearchModalInfo: (showResearchModalInfo) => {
    return {
      type: gameAT.SET_SHOW_RESEARCH_MODAL_INFO,
      showResearchModalInfo: showResearchModalInfo,
    };
  },
  setCityShowingProductionTab: (cityShowingProductionTab) => {
    return {
      type: gameAT.SET_CITY_SHOWING_PRODUCTION_TAB,
      cityShowingProductionTab: cityShowingProductionTab,
    };
  },
  setCurrentCityConstructionProject: (constructionProject) => {
    const state = store.getState();
    const newGameBoard = [...state.game.gameBoard];
    newGameBoard[state.game.selectedTilePosition]
        .city.currentConstructionProject = constructionProject;
    return {
      type: gameAT.SET_GAME_BOARD,
      gameBoard: newGameBoard,
    };
  },
  setCurrentCityRecruitmentQueue: (recruitmentQueue) => {
    const state = store.getState();
    const newGameBoard = [...state.game.gameBoard];
    newGameBoard[state.game.selectedTilePosition]
        .city.currentRecruitmentQueue = recruitmentQueue;
    return {
      type: gameAT.SET_GAME_BOARD,
      gameBoard: newGameBoard,
    };
  },
  setCityMenuSupplementalView: (cityMenuSupplementalView) => {
    return {
      type: gameAT.SET_CITY_MENU_SUPPLEMENTAL_VIEW,
      cityMenuSupplementalView: cityMenuSupplementalView,
    };
  },
  setCityMenuSupplementalData: (cityMenuSupplementalData) => {
    return {
      type: gameAT.SET_CITY_MENU_SUPPLEMENTAL_DATA,
      cityMenuSupplementalData: cityMenuSupplementalData,
    };
  },
  setBattleData: (battleData) => {
    return {
      type: gameAT.SET_BATTLE_DATA,
      battleData: battleData,
    };
  },
};

export default actionCreators;
