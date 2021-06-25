import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Honeycomb, Hexagon} from 'react-honeycomb';
import PropTypes from 'prop-types';
import MAIN_PANEL_VIEWS from '../../../../Utilities/gameMainPanelViews';
import TILE_HIGHLIGHT_TYPES from '../../../../Utilities/tileHighlightTypes';
import gameBoardViewAC from
  '../../../../../Redux/actionCreators/gameBoardViewActionCreators';
import gamePlayerAC from
  '../../../../../Redux/actionCreators/gamePlayerActionCreators';
import cityMenuAC from
  '../../../../../Redux/actionCreators/cityMenuActionCreators';
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

    const tileClicked = async (e, item) => {
      e.preventDefault();

      // tileClicked Helper Methods:
      const selectArmy = () => {
        props.updateMainPanelView(MAIN_PANEL_VIEWS.ARMY_INFO);
        if (item.army.owner === props.ownPlayerNumber &&
              item.army.remainingActions > 0 && props.isOwnTurn) {
          // It is our own army and we can move it.
          tileHighlightManager.highlightAvailableMoveTiles(item.tilePosition);
          props.updateIsMovingArmy(true);
        } else {
          // It is an enemy army, but we can get some info on it.
          props.updateMainPanelView(MAIN_PANEL_VIEWS.ARMY_INFO);
        }
      };

      // Begin tileClicked logic below:
      tileHighlightManager.unhighlightAllTiles();
      // The biggest differential of logic is whether we are moving.
      if (props.isMovingArmy) {
        props.updateIsMovingArmy(false);
        // The only two options are selecting a non-self and self tile.
        if (item.tilePosition === props.selectedTilePosition && item.city) {
          // We selected self, and there's a city, so swap to that.
          props.updateMainPanelView(MAIN_PANEL_VIEWS.CITY_INFO);
        } else {
          // We did not select self, meaning we can try a move command.
          // We will simply request it and let the server decide the outcome.
          const request = {
            gameId: props.gameId,
            primaryArmyActionType: ARMY_ACTION_REQUEST_TYPE.MOVE,
            primaryTilePosition: props.gameBoard[props.selectedTilePosition]
                .tilePosition,
            secondaryTilePosition: item.tilePosition,
          };
          axios.post(apiEndpoints.armyController + '/action', request);
        }
      } else {
        // We are not moving an army, so select something.
        if (item.army && !item.city) {
          // We straight-forward select an army with no city.
          selectArmy();
        } else if (!item.army && item.city) {
          // We may select the city if there is no army.
          props.updateMainPanelView(MAIN_PANEL_VIEWS.CITY_INFO);
        } else if (item.army && item.city) {
          // For a tile having both an army and a city, we alternate.
          switch (props.mainPanelView) {
            case MAIN_PANEL_VIEWS.NONE:
            case MAIN_PANEL_VIEWS.CITY_INFO:
            case MAIN_PANEL_VIEWS.TILE_INFO:
              selectArmy();
              break;
            case MAIN_PANEL_VIEWS.ARMY_INFO:
              props.updateMainPanelView(MAIN_PANEL_VIEWS.CITY_INFO);
              break;
          }
        } else if (!item.army && !item.city) {
          // The city has neither an army nor a city, so just view tile info.
          props.updateMainPanelView(MAIN_PANEL_VIEWS.TILE_INFO);
        }
      }
      props.updateSelectedTilePosition(item.tilePosition);
    };

    const renderTile = (item) => {
      let army = null;
      let city = null;
      let asteroid = null;
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

      if (item.hasAsteroid) {
        asteroid = (
          <img
            src={'ASTEROID.svg'}
            alt=""
            className={'heximage asteroid-icon'}
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
          {asteroid ? asteroid: null}
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
    gameBoard: state.gameBoardView.gameBoard,
    baseHoneycombConfigs: state.gameBoardView.honeycombConfigs,
    isMovingArmy: state.gameBoardView.isMovingArmy,
    selectedTilePosition: state.gameBoardView.selectedTilePosition,
    gameId: state.game.gameId,
    ownUsername: state.general.ownUsername,
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
    isOwnTurn: state.gamePlayer.ownPlayerNumber ===
      state.gamePlayer.playerWhoseTurnItIs,
    playerOne: state.gamePlayer.playerOne,
    playerTwo: state.gamePlayer.playerTwo,
    mainPanelView: state.gameBoardView.mainPanelView,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMainPanelView: (view) => dispatch(
        gameBoardViewAC.setMainPanelView(view)),
    updateSupplementalPanelView: (view) => dispatch(
        gameBoardViewAC.setSupplementalPanelView(view)),
    updateSelectedTilePosition: (position) => dispatch(
        gameBoardViewAC.setSelectedTilePosition(position)),
    updateIsMovingArmy: (isMovingArmy) => dispatch(
        gameBoardViewAC.setIsMovingArmy(isMovingArmy)),
    updateGameBoard: (gameBoard) => dispatch(
        gameBoardViewAC.setGameBoard(gameBoard)),
    updatePlayerWhoseTurnItIs: (playerWhoseTurnItIs) => dispatch(
        gamePlayerAC.setPlayerWhoseTurnItIs(playerWhoseTurnItIs)),
    unshowCityModal: () => dispatch(
        cityMenuAC.setShowCityModalInfo(false)),
    updateCityMenuSupplementalView: (view) => dispatch(
        cityMenuAC.setCityMenuSupplementalView(view)),
    updatePlayerOne: (player) => dispatch(
        gamePlayerAC.setPlayerOne(player)),
    updatePlayerTwo: (player) => dispatch(
        gamePlayerAC.setPlayerTwo(player)),
  };
};

GameBoard.propTypes = {
  gameBoard: PropTypes.array,
  baseHoneycombConfigs: PropTypes.any,
  isMovingArmy: PropTypes.bool,
  selectedTilePosition: PropTypes.number,
  updateMainPanelView: PropTypes.func,
  updateSupplementalPanelView: PropTypes.func,
  updateSelectedTilePosition: PropTypes.func,
  updateIsMovingArmy: PropTypes.func,
  updateGameBoard: PropTypes.func,
  gameId: PropTypes.string,
  ownUsername: PropTypes.string,
  updatePlayerWhoseTurnItIs: PropTypes.func,
  ownPlayerNumber: PropTypes.string,
  isOwnTurn: PropTypes.bool,
  updateViewingArmyInCity: PropTypes.func,
  unshowCityModal: PropTypes.func,
  updateCityMenuSupplementalView: PropTypes.func,
  updateCityMenuSupplementalData: PropTypes.func,
  updatePlayerOne: PropTypes.func,
  updatePlayerTwo: PropTypes.func,
  playerOne: PropTypes.any,
  playerTwo: PropTypes.any,
  mainPanelView: PropTypes.any,
};

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard);
