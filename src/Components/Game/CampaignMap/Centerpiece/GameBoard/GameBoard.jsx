import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Honeycomb, Hexagon} from 'react-honeycomb';
import PropTypes from 'prop-types';
import MAIN_PANEL_VIEWS from '../../../../Utilities/gameMainPanelViews';
import ACTION_BAR_VIEWS from '../../../../Utilities/actionBarViews';
import TILE_HIGHLIGHT_TYPES from '../../../../Utilities/tileHighlightTypes';
import gameAC from '../../../../../Redux/actionCreators/gameActionCreators';
import tileHighlightManager from '../../../../Utilities/tileHighlightManager';
import ARMY_ACTION_REQUEST_TYPE from
  '../../../../Utilities/armyActionRequestTypes';
import axios from 'axios';
import apiEndpoints from '../../../../Utilities/apiEndpoints';
import PLAYER from '../../../../Utilities/playerEnums';
import FACTIONS from '../../../../Utilities/factions';
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

      const updateToCityView = () => {
        props.updateIsMovingArmy(false);
        props.updateMainPanelView(MAIN_PANEL_VIEWS.CITY_INFO);
        props.updateActionBarView(ACTION_BAR_VIEWS.CITY_ACTIONS_VIEW);
        props.updateMainPanelData(item.city);
      };

      const updateToArmyView = () => {
        props.updateMainPanelView(MAIN_PANEL_VIEWS.ARMY_INFO);
        props.updateActionBarView(ACTION_BAR_VIEWS.ARMY_ACTIONS_VIEW);
        props.updateMainPanelData(item.army);
        if (!props.isMovingArmy &&
            item.army.owner === props.ownPlayerNumber &&
            props.isOwnTurn && item.army.remainingActions > 0) {
          props.updateIsMovingArmy(true);
          props.updateActionBarTooltip(
              'Move this army or have it camp in place.');
          tileHighlightManager.
              highlightAvailableMoveTiles(item.tilePosition);
        } else {
          props.updateIsMovingArmy(false);
        }
      };

      if (item.city && !item.army && !props.isMovingArmy) {
        updateToCityView();
      } else if (item.army && item.army.owner === props.ownPlayerNumber) {
        tileHighlightManager.unhighlightAllTiles();
        if (item.tilePosition !== props.selectedTilePosition) {
          updateToArmyView();
          props.updateViewingArmyInCity(true);
        } else {
          if (item.city) {
            if (props.viewingArmyInCity) {
              updateToCityView();
              props.updateViewingArmyInCity(false);
            } else {
              updateToArmyView();
              props.updateViewingArmyInCity(true);
            }
          } else {
            updateToArmyView();
            props.updateViewingArmyInCity(true);
          }
        }
      } else {
        if (props.isMovingArmy &&
          (item.tileHighlightType === TILE_HIGHLIGHT_TYPES.CAN_MOVE_HERE) &&
          !props.awaitingServerConfirmation) {
          props.updateActionBarTooltip(
              'Select an Army or City to get started.');
          tileHighlightManager.unhighlightAllTiles();
          const request = {
            gameId: props.gameId,
            primaryArmyActionType: ARMY_ACTION_REQUEST_TYPE.MOVE,
            primaryTilePosition: props.gameBoard[props.selectedTilePosition]
                .tilePosition,
            secondaryTilePosition: item.tilePosition,
          };
          await props.updateAwaitingServerConfirmation(true);
          axios.post(apiEndpoints.armyController + '/action/' +
        props.gameId, request);
        } else {
          tileHighlightManager.unhighlightAllTiles();
          props.updateMainPanelView(MAIN_PANEL_VIEWS.TILE_INFO);
          props.updateActionBarView(ACTION_BAR_VIEWS.NONE);
          props.updateMainPanelData(getTileData(item));
        }
        props.updateIsMovingArmy(false);
      }
      props.updateSelectedTilePosition(item.tilePosition);
    };

    const renderTile = (item) => {
      let army = null;
      let city = null;
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
        const ownerPlayerNumber = item.army.owner;
        let ownerPlayerData;
        if (ownerPlayerNumber === PLAYER.ONE) {
          ownerPlayerData = props.playerOne;
        } else if (ownerPlayerNumber === PLAYER.TWO) {
          ownerPlayerData = props.playerTwo;
        } else {
          console.warn(
              'Oops! Unidentified player number for an army to render.');
        }
        if (ownerPlayerData) {
          const armyFaction = ownerPlayerData.factionType;
          let armyStyling = 'heximage army-icon';
          if (item.army.owner === props.ownPlayerNumber) {
            armyStyling += ' own-army';
          } else {
            armyStyling += ' enemy-army';
          }
          if (armyFaction === FACTIONS.HUMANS.NAME) {
            army = (
              <img
                src={'HUMAN_ARMY.svg'}
                alt=""
                className={armyStyling +
                (item.army.remainingActions > 0 ? ' army-is-untapped' : '')}
                onClick={(e) => tileClicked(e, item)}
              />
            );
          } else if (armyFaction === FACTIONS.INSECTS.NAME) {
            army = (
              <img
                src={'INSECT_ARMY.svg'}
                alt=""
                className={armyStyling +
                (item.army.remainingActions > 0 ? ' army-is-untapped' : '')}
                onClick={(e) => tileClicked(e, item)}
              />
            );
          } else {
            console.warn(
                'Oops! Unidentified faction read when trying to render army.',
            );
          }
        }
      }
      if (item.city) {
        city = (
          <img
            src={'HUMAN_CITY_TIER_1.png'}
            alt=""
            className={'heximage city-icon'}
            onClick={(e) => tileClicked(e, item)}
          />
        );
      }
      return (
        <Hexagon>
          <img
            src={item.terrainType + '.png'}
            alt=""
            className={'heximage ' + extraStyling}
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
    ownPlayerNumber: state.game.ownPlayerNumber,
    isOwnTurn: state.game.isOwnTurn,
    viewingArmyInCity: state.game.viewingArmyInCity,
    playerOne: state.game.playerOne,
    playerTwo: state.game.playerTwo,
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
    updatePlayerWhoseTurnItIs: (playerWhoseTurnItIs) => dispatch(
        gameAC.setPlayerWhoseTurnItIs(playerWhoseTurnItIs)),
    updateActionBarTooltip: (tooltip) => dispatch(
        gameAC.setActionBarTooltip(tooltip)),
    updateViewingArmyInCity: (viewingArmyInCity) => dispatch(
        gameAC.setViewingArmyInCity(viewingArmyInCity)),
    unshowCityModal: () => dispatch(
        gameAC.setShowCityModalInfo(false)),
    updateCityMenuSupplementalView: (view) => dispatch(
        gameAC.setCityMenuSupplementalView(view)),
    updateCityMenuSupplementalData: (data) => dispatch(
        gameAC.setCityMenuSupplementalData(data)),
    updatePlayerOne: (player) => dispatch(
        gameAC.setPlayerOne(player)),
    updatePlayerTwo: (player) => dispatch(
        gameAC.setPlayerTwo(player)),
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
  updatePlayerWhoseTurnItIs: PropTypes.func,
  ownPlayerNumber: PropTypes.string,
  isOwnTurn: PropTypes.bool,
  updateActionBarTooltip: PropTypes.func,
  viewingArmyInCity: PropTypes.bool,
  updateViewingArmyInCity: PropTypes.func,
  unshowCityModal: PropTypes.func,
  updateCityMenuSupplementalView: PropTypes.func,
  updateCityMenuSupplementalData: PropTypes.func,
  updatePlayerOne: PropTypes.func,
  updatePlayerTwo: PropTypes.func,
  playerOne: PropTypes.any,
  playerTwo: PropTypes.any,
};

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard);
