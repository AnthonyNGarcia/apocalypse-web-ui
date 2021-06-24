import gameBoardViewAT from '../actionTypes/gameBoardViewActionTypes';

const actionCreators = {
  setGameBoard: (gameBoard) => {
    return {
      type: gameBoardViewAT.SET_GAME_BOARD,
      gameBoard: gameBoard,
    };
  },
  setMainPanelView: (mainPanelView) => {
    return {
      type: gameBoardViewAT.SET_MAIN_PANEL_VIEW,
      mainPanelView: mainPanelView,
    };
  },
  setSupplementalPanelView: (supplementalPanelView) => {
    return {
      type: gameBoardViewAT.SET_SUPPLEMENTAL_PANEL_VIEW,
      supplementalPanelView: supplementalPanelView,
    };
  },
  setIsMovingArmy: (isMovingArmy) => {
    return {
      type: gameBoardViewAT.SET_IS_MOVING_ARMY,
      isMovingArmy: isMovingArmy,
    };
  },
  setSelectedTilePosition: (selectedTilePosition) => {
    return {
      type: gameBoardViewAT.SET_SELECTED_TILE_POSITION,
      selectedTilePosition: selectedTilePosition,
    };
  },
};

export default actionCreators;
