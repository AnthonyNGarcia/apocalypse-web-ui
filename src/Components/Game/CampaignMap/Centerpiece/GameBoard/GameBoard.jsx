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

      const updateToCityView = () => {
        props.updateIsMovingArmy(false);
        props.updateMainPanelView(MAIN_PANEL_VIEWS.CITY_INFO);
      };

      const updateToArmyView = () => {
        props.updateMainPanelView(MAIN_PANEL_VIEWS.ARMY_INFO);
        if (!props.isMovingArmy &&
            item.army.owner === props.ownPlayerNumber &&
            props.isOwnTurn && item.army.remainingActions > 0) {
          props.updateIsMovingArmy(true);
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
          (item.tileHighlightType === TILE_HIGHLIGHT_TYPES.CAN_MOVE_HERE)) {
          tileHighlightManager.unhighlightAllTiles();
          const request = {
            gameId: props.gameId,
            primaryArmyActionType: ARMY_ACTION_REQUEST_TYPE.MOVE,
            primaryTilePosition: props.gameBoard[props.selectedTilePosition]
                .tilePosition,
            secondaryTilePosition: item.tilePosition,
          };
          console.log(request);
          axios.post(apiEndpoints.armyController + '/action', request);
        } else {
          tileHighlightManager.unhighlightAllTiles();
          props.updateMainPanelView(MAIN_PANEL_VIEWS.TILE_INFO);
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
    gameBoard: state.gameBoardView.gameBoard,
    baseHoneycombConfigs: state.gameBoardView.honeycombConfigs,
    isMovingArmy: state.gameBoardView.isMovingArmy,
    selectedTilePosition: state.gameBoardView.selectedTilePosition,
    gameId: state.game.gameId,
    ownUsername: state.general.ownUsername,
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
    isOwnTurn: state.gamePlayer.ownPlayerNumber ===
      state.gamePlayer.playerWhoseTurnItIs,
    viewingArmyInCity: state.gameBoardView.viewingArmyInCity,
    playerOne: state.gamePlayer.playerOne,
    playerTwo: state.gamePlayer.playerTwo,
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
    updateViewingArmyInCity: (viewingArmyInCity) => dispatch(
        gameBoardViewAC.setViewingArmyInCity(viewingArmyInCity)),
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
