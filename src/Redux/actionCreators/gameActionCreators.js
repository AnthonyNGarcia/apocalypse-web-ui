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
};

export default actionCreators;
