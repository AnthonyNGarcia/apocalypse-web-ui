import gameAT from '../actionTypes/gameActionTypes';

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
  setIsOwnTurn: (isOwnTurn) => {
    return {
      type: gameAT.SET_IS_OWN_TURN,
      isOwnTurn: isOwnTurn,
    };
  },
  setAwaitingServerConfirmation: (awaitingServerConfirmation) => {
    return {
      type: gameAT.SET_AWAITING_SERVER_CONFIRMATION,
      awaitingServerConfirmation: awaitingServerConfirmation,
    };
  },
  setQueuedActionCost: (queuedActionCost) => {
    return {
      type: gameAT.SET_QUEUED_ACTION_COST,
      queuedActionCost: queuedActionCost,
    };
  },
};

export default actionCreators;
