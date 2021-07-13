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
  setIsMovingSettler: (isMovingSettler) => {
    return {
      type: gameBoardViewAT.SET_IS_MOVING_SETTLER,
      isMovingSettler: isMovingSettler,
    };
  },
  setSelectedTilePosition: (selectedTilePosition) => {
    return {
      type: gameBoardViewAT.SET_SELECTED_TILE_POSITION,
      selectedTilePosition: selectedTilePosition,
    };
  },
  setUncloseableModalView: (uncloseableModalView) => {
    return {
      type: gameBoardViewAT.SET_UNCLOSEABLE_MODAL_VIEW,
      uncloseableModalView: uncloseableModalView,
    };
  },
  clearGameBoardViewReducer: () => {
    return {
      type: gameBoardViewAT.CLEAR_GAME_BOARD_VIEW_REDUCER,
    };
  },
};

export default actionCreators;
