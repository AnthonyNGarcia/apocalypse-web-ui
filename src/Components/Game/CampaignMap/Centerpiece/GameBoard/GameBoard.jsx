import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {Honeycomb, Hexagon} from 'react-honeycomb';
import PropTypes from 'prop-types';
import MAIN_PANEL_VIEWS from '../../../../Utilities/gameMainPanelViews';
import ACTION_BAR_VIEWS from '../../../../Utilities/actionBarViews';
import TILE_HIGHLIGHT_TYPES from '../../../../Utilities/tileHighlightTypes';
import gameAC from '../../../../../Redux/actionCreators/gameActionCreators';
import tileHighlightManager from '../../../../Utilities/tileHighlightManager';
import AbstractedWebsocket from '../../../../Utilities/AbstractedWebsocket';
import sendWebsocketMessage from '../../../../Utilities/sendWebsocketMessage';
import './GameBoard.css';

/**
 *
 * GameBoard JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const GameBoard = (props) => {
  const [initialized, setInitialized] = useState(false);
  const [fullHoneycombConfigs, setFullHoneycombConfigs] = useState(null);
  const websocket = useRef(null);

  const onReceiveMessage = (message) => {
    if (message.body.gameBoard) {
      props.updateGameBoard(message.body.gameBoard);
    }
    if (message.body.playerEndingTurn) {
      if (message.body.playerEndingTurn !== props.ownUsername) {
        props.updateIsOwnTurn(true);
      } else {
        props.updateIsOwnTurn(false);
      }
    }

    props.updateAwaitingServerConfirmation(false);
  };

  useEffect(() => {
    // USE EFFECT SCOPED FUNCTIONS DEFINED HERE
    const getTileData = (tile) => {
      return {
        position: tile.tilePosition,
        terrainType: tile.terrainType,
        tileImprovement: tile.tileImprovement,
        hasAsteroid: tile.hasAsteroid,
      };
    };

    const tileClicked = async (e, item) => {
      e.preventDefault();
      if (item.army) {
        tileHighlightManager.unhighlightAllTiles();
        props.updateMainPanelView(MAIN_PANEL_VIEWS.ARMY_INFO);
        props.updateActionBarView(ACTION_BAR_VIEWS.ARMY_ACTIONS_VIEW);
        props.updateMainPanelData(item.army);
      } else {
        if (props.isMovingArmy &&
          (item.tileHighlightType === TILE_HIGHLIGHT_TYPES.CAN_MOVE_HERE) &&
          !props.awaitingServerConfirmation) {
          const gameBoardCopy = await JSON.parse(
              JSON.stringify(await props.gameBoard));
          const armyToMove = gameBoardCopy[props.selectedTilePosition].army;
          armyToMove.remainingActions = armyToMove.remainingActions - 1;
          gameBoardCopy[item.tilePosition].army = armyToMove;
          gameBoardCopy[props.selectedTilePosition].army = null;
          const cleanedGameBoard = await tileHighlightManager
              .unhighlightAllTiles(gameBoardCopy);
          const message = {
            primaryPlayerUsername: props.ownUsername,
            secondaryPlayerUsername: null,
            gameBoard: cleanedGameBoard,
          };
          await props.updateAwaitingServerConfirmation(true);
          sendWebsocketMessage(websocket,
              '/socket-game/board/' + props.gameId, message);
        } else {
          tileHighlightManager.unhighlightAllTiles();
          props.updateMainPanelView(MAIN_PANEL_VIEWS.TILE_INFO);
          props.updateActionBarView(ACTION_BAR_VIEWS.NONE);
          props.updateMainPanelData(getTileData(item));
        }
      }
      props.updateSelectedTilePosition(item.tilePosition);
      props.updateIsMovingArmy(false);
    };

    const renderTile = (item) => {
      let army = null;
      const city = null;
      let extraStyling = '';
      if (item.tileIsHighlighted) {
        switch (item.tileHighlightType) {
          case TILE_HIGHLIGHT_TYPES.NONE:
            console.warn('The tile is indicated as highlighted, but no ' +
                'highlight type was specified!');
            break;
          case TILE_HIGHLIGHT_TYPES.CAN_MOVE_HERE:
            extraStyling += ' highlight-tile';
            break;
          case TILE_HIGHLIGHT_TYPES.CAN_ATTACK_HERE:
            console.warn('tile highlight can attack not yet coded');
            break;
          default:
            console.warn('Oops! An invalid tile highlight type was provided!');
        }
      }
      if (item.army) {
        army = (
          <img
            src={'army.jpg'}
            alt=""
            className={'heximage army-icon'}
            onClick={(e) => tileClicked(e, item)}
          />
        );
      }
      return (
        <Hexagon>
          <img
            src={item.terrainType + '.jpg'}
            alt=""
            className={'hexagon-sizing heximage' + extraStyling}
            onClick={army === null && city === null ?
                (e) => tileClicked(e, item) : null}/>
          {army ? army : null}
          {city ? city : null}
        </Hexagon>
      );
    };
    // ACTUAL USE EFFECT LOGIC STARTS HERE
    if (!initialized) {
      setFullHoneycombConfigs({...props.baseHoneycombConfigs,
        items: props.gameBoard, renderItem: renderTile});
      setInitialized(true);
    } else {
      setFullHoneycombConfigs( (prevState) => {
        return {...prevState, items: props.gameBoard, renderItem: renderTile};
      });
    }
  }, [props]);

  return (
    <React.Fragment>
      <AbstractedWebsocket topics={['/game-board/' + props.gameId]}
        onReceiveMessage={onReceiveMessage} ref={websocket}/>
      {fullHoneycombConfigs ?
      <Honeycomb {...fullHoneycombConfigs} className='board-sizing' /> : null
      }
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    gameBoard: state.game.gameBoard,
    baseHoneycombConfigs: state.game.honeycombConfigs,
    isMovingArmy: state.game.isMovingArmy,
    selectedTilePosition: state.game.selectedTilePosition,
    gameId: state.game.gameId,
    ownUsername: state.general.ownUsername,
    awaitingServerConfirmation: state.game.awaitingServerConfirmation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMainPanelView: (view) => dispatch(
        gameAC.setMainPanelView(view)),
    updateMainPanelData: (data) => dispatch(
        gameAC.setMainPanelData(data)),
    updateSupplementalPanelView: (view) => dispatch(
        gameAC.setSupplementalPanelView(view)),
    updateSupplementalPanelData: (data) => dispatch(
        gameAC.setSupplementalPanelData(data)),
    updateActionBarView: (view) => dispatch(
        gameAC.setActionBarView(view)),
    updateSelectedTilePosition: (position) => dispatch(
        gameAC.setSelectedTilePosition(position)),
    updateIsMovingArmy: (isMovingArmy) => dispatch(
        gameAC.setIsMovingArmy(isMovingArmy)),
    updateGameBoard: (gameBoard) => dispatch(
        gameAC.setGameBoard(gameBoard)),
    updateAwaitingServerConfirmation: (awaitingServerConfirmation) => dispatch(
        gameAC.setAwaitingServerConfirmation(awaitingServerConfirmation)),
    updateIsOwnTurn: (isOwnTurn) => dispatch(
        gameAC.setIsOwnTurn(isOwnTurn)),
  };
};

GameBoard.propTypes = {
  gameBoard: PropTypes.array,
  baseHoneycombConfigs: PropTypes.any,
  isMovingArmy: PropTypes.bool,
  selectedTilePosition: PropTypes.number,
  updateMainPanelView: PropTypes.func,
  updateMainPanelData: PropTypes.func,
  updateSupplementalPanelView: PropTypes.func,
  updateSupplementalPanelData: PropTypes.func,
  updateActionBarView: PropTypes.func,
  updateSelectedTilePosition: PropTypes.func,
  updateIsMovingArmy: PropTypes.func,
  updateGameBoard: PropTypes.func,
  gameId: PropTypes.string,
  ownUsername: PropTypes.string,
  updateAwaitingServerConfirmation: PropTypes.func,
  awaitingServerConfirmation: PropTypes.bool,
  updateIsOwnTurn: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard);
