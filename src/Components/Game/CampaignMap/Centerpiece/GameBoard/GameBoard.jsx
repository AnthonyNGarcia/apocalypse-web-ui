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
import gameAC from
  '../../../../../Redux/actionCreators/gameActionCreators';
import tileHighlightManager from '../../../../Utilities/tileHighlightManager';
import ARMY_ACTION_REQUEST_TYPE from
  '../../../../Utilities/armyActionRequestTypes';
import axios from 'axios';
import apiEndpoints from '../../../../Utilities/apiEndpoints';
import PLAYER from '../../../../Utilities/playerEnums';
import FACTIONS from '../../../../Utilities/factions';
import './GameBoard.css';
import ADVANCED_DETAILS_MODAL_VIEW from
  '../../../../Utilities/advancedDetailsModalViews';

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
        if (item.army.owner !== props.ownPlayerNumber &&
          item.army.isHidden) {
          // We cannot select an army which is hidden to us!
          return false;
        }
        props.updateMainPanelView(MAIN_PANEL_VIEWS.ARMY_INFO);
        if (item.army.owner === props.ownPlayerNumber &&
              item.army.remainingActions > 0 && props.isOwnTurn) {
          // It is our own army and we can move it.
          tileHighlightManager.highlightAvailableMoveTiles(item.tilePosition);
          props.updateIsMovingArmy(true);
        }
        return true;
      };

      const selectSettler = () => {
        props.updateMainPanelView(MAIN_PANEL_VIEWS.SETTLER_INFO);
        if (item.settler.owner === props.ownPlayerNumber &&
              item.settler.remainingActions > 0 && props.isOwnTurn) {
          // It is our own settler and we can move it.
          tileHighlightManager.highlightAvailableMoveTiles(item.tilePosition);
          props.updateIsMovingSettler(true);
        }
      };

      const selectTile = () => {
        if (item.army && !item.city && !item.settler) {
          // We straight-forward select an army with no city or settler.
          const wasAbleToSelectArmy = selectArmy();
          if (!wasAbleToSelectArmy) {
            props.updateMainPanelView(MAIN_PANEL_VIEWS.TILE_INFO);
          }
        } else if (!item.army && item.city && !item.settler) {
          // We may select the city if there is no army or settler.
          props.updateMainPanelView(MAIN_PANEL_VIEWS.CITY_INFO);
        } else if (!item.army && !item.city && item.settler) {
          // We may select the settler if there is no army or city.
          selectSettler();
        } else if (!item.army && !item.city && item.settler) {
          // The tile has neither an army, city, nor settler -> tile info!
          props.updateMainPanelView(MAIN_PANEL_VIEWS.TILE_INFO);
        } else {
          // We must be having 2 more or of settler/army/city -> alternate!
          switch (props.mainPanelView) {
            case MAIN_PANEL_VIEWS.NONE:
            case MAIN_PANEL_VIEWS.CITY_INFO:
            case MAIN_PANEL_VIEWS.TILE_INFO:
              if (item.army) {
                const wasAbleToSelectArmyFromNoneCityTileInfo = selectArmy();
                if (!wasAbleToSelectArmyFromNoneCityTileInfo) {
                  // Has army, but can't select it, so skip to other units.
                  if (item.settler) {
                    selectSettler();
                  } else if (item.city) {
                    // Has army, but no settler, so stick on city if one exists.
                    props.updateMainPanelView(MAIN_PANEL_VIEWS.CITY_INFO);
                  } else {
                    // Has army, but no settler or city, so stay on tile info
                  }
                }
              } else if (item.settler) {
                selectSettler();
              } else {
                // The tile has neither an army, city, nor settler -> tile info!
                props.updateMainPanelView(MAIN_PANEL_VIEWS.TILE_INFO);
              }
              break;
            case MAIN_PANEL_VIEWS.ARMY_INFO:
              if (item.settler) {
                selectSettler();
              } else if (item.city) {
                props.updateMainPanelView(MAIN_PANEL_VIEWS.CITY_INFO);
              } else {
                // The tile has neither an army, city, nor settler -> tile info!
                props.updateMainPanelView(MAIN_PANEL_VIEWS.TILE_INFO);
              }
              break;
            case MAIN_PANEL_VIEWS.SETTLER_INFO:
              if (item.city) {
                props.updateMainPanelView(MAIN_PANEL_VIEWS.CITY_INFO);
              } else if (item.army) {
                const wasAbleToSelectArmyFromSettlerInfo = selectArmy();
                if (!wasAbleToSelectArmyFromSettlerInfo) {
                  // No city, but can't see army, so stay on settler
                }
              } else {
                // The tile has neither an army, city, nor settler -> tile info!
                props.updateMainPanelView(MAIN_PANEL_VIEWS.TILE_INFO);
              }
          }
        }
      };

      // Begin tileClicked logic below:
      tileHighlightManager.unhighlightAllTiles();
      // The biggest differential of logic is whether we are moving.
      if (props.isMovingArmy) {
        props.updateIsMovingArmy(false);
        // The only two options are selecting a non-self and self tile.
        if (item.tilePosition === props.selectedTilePosition) {
          // We selected self
          if (item.settler) {
            // And there is a settler, so select it instead.
            selectSettler();
          } else if (item.city) {
            // There wasn't a settler, but there was a city, so select it.
            props.updateMainPanelView(MAIN_PANEL_VIEWS.CITY_INFO);
          }
        } else {
          // We did not select self, meaning we can try a move command.
          if (item.tileHighlightType === TILE_HIGHLIGHT_TYPES.CAN_MOVE_HERE) {
            // We will simply request it and let the server decide the outcome.
            const request = {
              gameId: props.gameId,
              primaryArmyActionType: ARMY_ACTION_REQUEST_TYPE.MOVE,
              primaryTilePosition: props.gameBoard[props.selectedTilePosition]
                  .tilePosition,
              secondaryTilePosition: item.tilePosition,
            };
            axios.post(apiEndpoints.armyController + '/action', request);
          } else {
            // An invalid tile to move to was selected. Just select new tile.
            selectTile();
          }
        }
      } else if (props.isMovingSettler) {
        props.updateIsMovingSettler(false);
        // The only two options are selecting a non-self and self tile.
        if (item.tilePosition === props.selectedTilePosition) {
          // We selected self
          if (item.city) {
            // And there is a city, so select it instead.
            props.updateMainPanelView(MAIN_PANEL_VIEWS.CITY_INFO);
          } else if (item.army) {
            // There wasn't a city, but there was an army, so select it.
            selectArmy();
          }
        } else {
          // We did not select self, meaning we can try a move command.
          if (item.tileHighlightType === TILE_HIGHLIGHT_TYPES.CAN_MOVE_HERE) {
            // We will simply request it and let the server decide the outcome.
            const request = {
              gameId: props.gameId,
              primaryTilePosition: props.gameBoard[props.selectedTilePosition]
                  .tilePosition,
              secondaryTilePosition: item.tilePosition,
            };
            axios.post(apiEndpoints.settlerController + '/move', request);
          } else {
            // An invalid tile to move to was selected. Just select new tile.
            selectTile();
          }
        }
      } else {
        // We are not moving an army or settler, so select something.
        selectTile();
      }
      props.updateSelectedTilePosition(item.tilePosition);
    };

    const renderTile = (item) => {
      let army = null;
      let city = null;
      let asteroid = null;
      let settler = null;
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
          const fullTerrainData = props.allTerrains[item.terrainType];
          const gettingBonusBlockFromTerrain =
          fullTerrainData.defensiveBlockBonusAsPercentOfUnitMaxHealth > 0;
          const sufferingAttritionFromTerrain =
          fullTerrainData.attritionDamageCausedAsPercentOfUnitMaxHealth > 0;
          if (item.army.owner === props.ownPlayerNumber) {
            armyStyling += ' own-army';
            if (item.army.isHidden) {
              armyStyling += ' own-army-hidden';
            }
          } else {
            armyStyling += ' enemy-army';
            if (item.army.isHidden) {
              armyStyling += ' enemy-army-hidden';
            }
          }
          if (armyFaction === FACTIONS.HUMANS.enum) {
            army = (
              <React.Fragment>
                <img
                  src={'HUMAN_ARMY.svg'}
                  alt=""
                  className={armyStyling +
                  (item.army.remainingActions > 0 ? ' army-is-untapped' : '')}
                  onClick={(e) => tileClicked(e, item)}
                />
                {(!item.army.isHidden ||
                  item.army.owner === props.ownPlayerNumber) &&
                 ((item.army.armyStance === 'FORTIFIED' &&
                !gettingBonusBlockFromTerrain) || (
                   item.army.armyStance === 'NONE' &&
                  gettingBonusBlockFromTerrain)) ?
                (<img
                  src={'shield.svg'}
                  alt=""
                  className='small-army-fortified-icon'
                  onClick={(e) => tileClicked(e, item)}
                />) : (!item.army.isHidden ||
                item.army.owner === props.ownPlayerNumber) &&
                ((item.army.armyStance === 'FORTIFIED' &&
                gettingBonusBlockFromTerrain) || (
                  item.army.armyStance === 'ENTRENCHED' &&
                  !gettingBonusBlockFromTerrain)) ?
                (<img
                  src={'shield.svg'}
                  alt=""
                  className='medium-army-fortified-icon'
                  onClick={(e) => tileClicked(e, item)}
                />) : (!item.army.isHidden ||
                item.army.owner === props.ownPlayerNumber) &&
                (item.army.armyStance === 'ENTRENCHED' &&
                gettingBonusBlockFromTerrain) ?
                (<img
                  src={'shield.svg'}
                  alt=""
                  className='large-army-fortified-icon'
                  onClick={(e) => tileClicked(e, item)}
                />) : null}
                {(!item.army.isHidden ||
                item.army.owner === props.ownPlayerNumber) &&
                sufferingAttritionFromTerrain && !item.city?
                (<img
                  src={'poison_debuff.svg'}
                  alt=""
                  className='small-army-attrition-icon'
                  onClick={(e) => tileClicked(e, item)}
                />) : null}
              </React.Fragment>
            );
          } else if (armyFaction === FACTIONS.INSECTS.enum) {
            army = (
              <React.Fragment>
                <img
                  src={'INSECT_ARMY.svg'}
                  alt=""
                  className={armyStyling +
                  (item.army.remainingActions > 0 ? ' army-is-untapped' : '')}
                  onClick={(e) => tileClicked(e, item)}
                />
                {(!item.army.isHidden ||
                  item.army.owner === props.ownPlayerNumber) &&
                 ((item.army.armyStance === 'FORTIFIED' &&
                !gettingBonusBlockFromTerrain) || (
                   item.army.armyStance === 'NONE' &&
                  gettingBonusBlockFromTerrain)) ?
                (<img
                  src={'shield.svg'}
                  alt=""
                  className='small-army-fortified-icon'
                  onClick={(e) => tileClicked(e, item)}
                />) : (!item.army.isHidden ||
                item.army.owner === props.ownPlayerNumber) &&
                ((item.army.armyStance === 'FORTIFIED' &&
                gettingBonusBlockFromTerrain) || (
                  item.army.armyStance === 'ENTRENCHED' &&
                  !gettingBonusBlockFromTerrain)) ?
                (<img
                  src={'shield.svg'}
                  alt=""
                  className='medium-army-fortified-icon'
                  onClick={(e) => tileClicked(e, item)}
                />) : (!item.army.isHidden ||
                item.army.owner === props.ownPlayerNumber) &&
                (item.army.armyStance === 'ENTRENCHED' &&
                gettingBonusBlockFromTerrain) ?
                (<img
                  src={'shield.svg'}
                  alt=""
                  className='large-army-fortified-icon'
                  onClick={(e) => tileClicked(e, item)}
                />) : null}
                {(!item.army.isHidden ||
                item.army.owner === props.ownPlayerNumber) &&
                sufferingAttritionFromTerrain && !item.city?
                (<img
                  src={'poison_debuff.svg'}
                  alt=""
                  className='small-army-attrition-icon'
                  onClick={(e) => tileClicked(e, item)}
                />) : null}
              </React.Fragment>
            );
          } else {
            console.warn(
                'Oops! Unidentified faction read when trying to render army.',
            );
          }
        }
      }

      if (item.city) {
        const cityFaction = item.city.factionType;
        let cityStyling = 'heximage city-icon';
        if (item.city.scorchedEarth) {
          cityStyling += ' city-is-scorched';
        }
        if (item.city.wallsDestroyed) {
          cityStyling += ' city-walls-destroyed';
        }
        if (cityFaction === FACTIONS.HUMANS.enum) {
          city = (
            <img
              src={'HUMAN_CITY_TIER_1.png'}
              alt=""
              className={cityStyling}
              onClick={(e) => tileClicked(e, item)}
            />
          );
        } else if (cityFaction === FACTIONS.INSECTS.enum) {
          city = (
            <img
              src={'INSECT_CITY_TIER_1.png'}
              alt=""
              className={cityStyling}
              onClick={(e) => tileClicked(e, item)}
            />
          );
        } else {
          console.warn(
              'Oops! Unidentified faction read when trying to render city.',
          );
        }
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

      if (item.settler) {
        const ownerPlayerNumber = item.settler.owner;
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
          let settlerStyling = 'heximage settler-icon';
          if (item.settler.owner === props.ownPlayerNumber) {
            settlerStyling += ' own-settler';
          } else {
            settlerStyling += ' enemy-settler';
          }
          settler = (
            <img
              src={'SETTLER.svg'}
              alt=""
              className={settlerStyling +
                (item.settler.remainingActions > 0 ?
                  ' settler-is-untapped' : '')}
              onClick={(e) => tileClicked(e, item)}
            />
          );
        }
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
          {asteroid ? asteroid : null}
          {settler ? settler: null}
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
    isMovingSettler: state.gameBoardView.isMovingSettler,
    selectedTilePosition: state.gameBoardView.selectedTilePosition,
    gameId: state.game.gameId,
    ownUsername: state.general.ownUsername,
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
    isOwnTurn: state.gamePlayer.ownPlayerNumber ===
      state.gamePlayer.playerWhoseTurnItIs,
    playerOne: state.gamePlayer.playerOne,
    playerTwo: state.gamePlayer.playerTwo,
    mainPanelView: state.gameBoardView.mainPanelView,
    allTerrains: state.game.gameConstants.allTerrains,
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
    updateIsMovingSettler: (isMovingSettler) => dispatch(
        gameBoardViewAC.setIsMovingSettler(isMovingSettler)),
    updateGameBoard: (gameBoard) => dispatch(
        gameBoardViewAC.setGameBoard(gameBoard)),
    updatePlayerWhoseTurnItIs: (playerWhoseTurnItIs) => dispatch(
        gamePlayerAC.setPlayerWhoseTurnItIs(playerWhoseTurnItIs)),
    unshowCityModal: () => dispatch(
        gameAC.setAdvancedDetailsModalView(ADVANCED_DETAILS_MODAL_VIEW.NONE)),
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
  isMovingSettler: PropTypes.bool,
  selectedTilePosition: PropTypes.number,
  updateMainPanelView: PropTypes.func,
  updateSupplementalPanelView: PropTypes.func,
  updateSelectedTilePosition: PropTypes.func,
  updateIsMovingArmy: PropTypes.func,
  updateIsMovingSettler: PropTypes.func,
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
  allTerrains: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard);
