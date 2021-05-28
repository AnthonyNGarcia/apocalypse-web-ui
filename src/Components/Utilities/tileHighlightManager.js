/**
 * This file contains shared utility methods for highlighting and unhighlighting
 * tiles on the map.
 */
import {store} from '../../App';
import gameAC from '../../Redux/actionCreators/gameActionCreators';
import calculateAdjacentHexagons from './calculateAdjacentHexagons';
import TILE_HIGHLIGHT_TYPES from './tileHighlightTypes';

export const highlightAvailableMoveTiles = async (tilePosition) => {
  const state = store.getState();
  const tilesToHighlight =
      calculateAdjacentHexagons(5, 6, tilePosition);
  const gameBoardCopy = await JSON.parse(JSON.stringify(state.game.gameBoard));
  for (let i = 0; i < tilesToHighlight.length; i++) {
    gameBoardCopy[tilesToHighlight[i]].tileIsHighlighted = true;
    gameBoardCopy[tilesToHighlight[i]].tileHighlightType =
        TILE_HIGHLIGHT_TYPES.CAN_MOVE_HERE;
  }
  store.dispatch(gameAC.setGameBoard(gameBoardCopy));
};

export const unhighlightAllTiles = async (gameBoard) => {
  let gameBoardCopy;
  if (gameBoard) {
    gameBoardCopy = await JSON.parse(JSON.stringify(gameBoard));
  } else {
    const state = store.getState();
    gameBoardCopy = await JSON.parse(JSON.stringify(state.game.gameBoard));
  }
  for (let i = 0; i < gameBoardCopy.length; i++) {
    gameBoardCopy[i].tileIsHighlighted = false;
    gameBoardCopy[i].tileHighlightType = TILE_HIGHLIGHT_TYPES.NONE;
  }
  if (gameBoard) {
    return gameBoardCopy;
  } else {
    store.dispatch(gameAC.setGameBoard(gameBoardCopy));
  }
};

const tileHighlightManager = {
  highlightAvailableMoveTiles: highlightAvailableMoveTiles,
  unhighlightAllTiles: unhighlightAllTiles,
};

export default tileHighlightManager;
