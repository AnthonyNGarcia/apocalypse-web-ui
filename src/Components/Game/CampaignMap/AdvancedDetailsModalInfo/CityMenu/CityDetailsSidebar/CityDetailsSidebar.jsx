import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Scrollbars} from 'react-custom-scrollbars-2';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import FACTIONS from '../../../../../Utilities/factions';
import Spinner from 'react-bootstrap/esm/Spinner';
import cityMenuAC from
  '../../../../../../Redux/actionCreators/cityMenuActionCreators';
import CITY_MENU_SUPPLEMENTAL_VIEWS from
  '../../../../../Utilities/cityMenuSupplementalViews';
import PLAYER from '../../../../../Utilities/playerEnums';
import axios from 'axios';
import apiEndpoints from '../../../../../Utilities/apiEndpoints';
import CITY_MENU_TAB from '../../../../../Utilities/cityMenuTabs';
import ASTRIDIUM_ABILITY_TYPE from
  '../../../../../Utilities/astridiumAbilityTypes';
import './CityDetailsSidebar.css';

/**
 *
 * CityDetailsSidebar JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const CityDetailsSidebar = (props) => {
  const [cityHeader, setCityHeader] = useState('');

  const viewBuildingHandler = (e, building) => {
    e.preventDefault();
    props.updateCityMenuSupplementalView(CITY_MENU_SUPPLEMENTAL_VIEWS.BUILDING);
    props.updateCityMenuSupplementalData(building);
  };

  const viewUnitHandler = (e, unitType) => {
    e.preventDefault();
    props.updateCityMenuSupplementalView(CITY_MENU_SUPPLEMENTAL_VIEWS.UNIT);
    props.updateCityMenuSupplementalData(unitType);
  };

  const trainSettlerHandler = (e) => {
    e.preventDefault();
    try {
      const request = {
        gameId: props.gameId,
        cityTilePosition: props.selectedTilePosition,
        isTrainingSettler: true,
      };
      axios.put(apiEndpoints.cityController + '/settler-training', request);
    } catch (error) {
      console.warn('Error trying to train settler!');
      console.warn(error);
    }
  };

  const showCommanderTabHandler = (e) => {
    e.preventDefault();
    props.updateCityMenuTab(CITY_MENU_TAB.COMMANDER);
  };

  const timeWarpHandler = (e) => {
    e.preventDefault();
    try {
      const request = {
        gameId: props.gameId,
        playerPerformingAction: props.ownPlayerNumber,
        cityTilePosition: props.selectedTilePosition,
      };
      axios.post(apiEndpoints.cityController + '/time-warp', request);
    } catch (error) {
      console.warn('Error trying to time warp!');
      console.warn(error);
    }
  };

  const commanderIsAlive = (commanderType) => {
    for (let i = 0; i < props.ownPlayerData.fallenCommanders.length; i++) {
      const commander = props.ownPlayerData.fallenCommanders[i];
      if (commander.commanderType === commanderType) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (props.selectedCity) {
      if (props.selectedCity.factionType === FACTIONS.HUMANS.enum) {
        setCityHeader('Tier ' + props.selectedCity.tier + ' Human Settlement');
      } else if (props.selectedCity.factionType === FACTIONS.INSECTS.enum) {
        setCityHeader('Tier ' + props.selectedCity.tier + ' Insect Hive');
      } else {
        console.warn('Oops! Couldn\'t identify this city faction!');
      }
    }
  }, [props]);

  if (props.selectedCity) {
    return (
      <React.Fragment>
        <Container>
          <Row noGutters>
            <div>
              <h5>{cityHeader}</h5>
              <h5>{props.selectedCity.scorchedEarth ? (
                    <span> - Scorched ({props.selectedCity
                        .turnsRemainingForScorchedEarth} <span><img
                      src={'timer.svg'}
                      alt=""
                      className={'tiny-white-timer-icon'}
                    /></span>)</span>
                  ) : null}</h5>
              <h5>{props.selectedCity.wallsDestroyed ? (
                    <span> - Walls Destroyed ({props.selectedCity
                        .turnsRemainingForDestroyedWalls} <span><img
                      src={'timer.svg'}
                      alt=""
                      className={'tiny-white-timer-icon'}
                    /></span>)</span>
                  ) : null}</h5>
            </div>
          </Row>
          <Row className='center-text'
            style={{height: '15vh', width: '20vw'}} noGutters>
            <Col md={6}>
              <Row noGutters>
                <span><img
                  src={'hammer.svg'}
                  alt=""
                  className={'kinda-tiny-hammer-icon'}
                /></span><span className='bold-title'>Production:</span>
              </Row>
              <Row noGutters>
                <span><img
                  src={'research.svg'}
                  alt=""
                  className={'kinda-tiny-hammer-icon'}
                /></span><span className='bold-title'>Research:</span>
              </Row>
              <Row noGutters>
                <span><img
                  src={'growth.svg'}
                  alt=""
                  className={'kinda-tiny-hammer-icon'}
                /></span><span className='bold-title'>Growth:</span>
              </Row>
            </Col>
            <Col md={6}>
              <Row noGutters>
                {props.selectedCity.totalBuildingProduction}
              </Row>
              <Row noGutters>
                {props.selectedCity.totalResearch}
              </Row>
              <Row noGutters>
                {props.selectedCity.currentGrowthStockpile}/{
                  props.selectedCity.growthToNextTier} (+
                {props.selectedCity.totalGrowth})
              </Row>
            </Col>
          </Row>
          <Row noGutters>
            <Button
              variant='primary'
              disabled={!props.isOwnTurn ||
                props.selectedCity.isTrainingSettler ||
                props.selectedTile.settler ||
                props.ownPlayerData
                    .astridiumCollectionRequirementToNextSettler >
                props.ownPlayerData
                    .astridiumCollected}
              onClick={trainSettlerHandler}
              style={{width: '100%', fontSize: 'small', margin: 'auto'}}
            >{
                props.selectedCity.isTrainingSettler ?
                ( 'Training Settler (' +
                  (props.selectedCity.turnsRemainingToTrainSettler !== 1 ?
                  props.selectedCity.turnsRemainingToTrainSettler + ' Turns ' :
                  props.selectedCity.turnsRemainingToTrainSettler + ' Turn'
                  ) + ')'
                ) : (props.ownPlayerData
                    .astridiumCollectionRequirementToNextSettler >
                props.ownPlayerData
                    .astridiumCollected ?
                    'Collect ' + (props.ownPlayerData
                        .astridiumCollectionRequirementToNextSettler -
                        props.ownPlayerData
                            .astridiumCollected) +
                            ' More Astridium to Unlock the Next Settler!':
                    'Ready To Train New Settler!')} {
                      props.selectedTile.settler ?
                      ' (Cannot Train While Another Settler is in this City)' :
                      ''
              }</Button>
          </Row>
          <Row noGutters>
            <Button
              variant='primary'
              disabled={!props.isOwnTurn ||
                (props.selectedCity.assignedCommanderType &&
                  commanderIsAlive(props.selectedCity.assignedCommanderType))}
              onClick={showCommanderTabHandler}
              style={{width: '100%', fontSize: 'small',
                margin: 'auto', marginTop: '1vh'}}
            >
              {props.selectedCity.assignedCommanderType ?
              (
                <React.Fragment>
                  <p style={{margin: '0px', padding: '0px'}}>
                    {
                    // eslint-disable-next-line max-len
                      props.allCommanders[props.selectedCity.assignedCommanderType]
                          .displayName + ' calls this City home.'}
                  </p>
                  <p style={{margin: '0px', padding: '0px'}}>
                    {'They can respawn here if they fall in battle.'}
                  </p>
                </React.Fragment>
              ) :
                'Choose a Commander for this City!'}
            </Button>
          </Row>
          <Row noGutters>
            <OverlayTrigger
              key='time-warp-overlay'
              placement='bottom'
              trigger={['hover', 'focus']}
              overlay={
                <Tooltip id='time-warp-tooltip'>
                  <strong>{props.timeWarp.displayName}</strong> - {
                    props.timeWarp.description}
                </Tooltip>
              }>
              <Button variant="primary"
                disabled={!props.isOwnTurn ||
                (props.ownPlayerData.currentAstridium <
                  props.timeWarp.astridiumCost)}
                style={{width: '100%',
                  margin: 'auto', marginTop: '1vh'}}
                onClick={timeWarpHandler}>
                <span>
                  {props.timeWarp.displayName} ({props.timeWarp.astridiumCost
                  } <img
                    src={'ASTEROID.svg'}
                    alt=""
                    className={'tiny-asteroid-icon'}/>)
                </span>
              </Button>
            </OverlayTrigger>
          </Row>
          <Row noGutters>
            <h5>Current Buildings</h5>
          </Row>
          <Row noGutters>
            {/* Map completed buildings to generate dynamic, scrollable list */}
            <Scrollbars style={{height: '20vh', width: '20vw'}}>
              {props.selectedCity.completedBuildings &&
              props.selectedCity.completedBuildings.length > 0 ?
              props.selectedCity.completedBuildings.map((building, index) => (
                <div key={index} style={{overflow: 'hidden'}}
                  onClick={(e) =>
                    viewBuildingHandler(e, building)}>
                  <Row noGutters>
                    <Col xs={2}>
                      <img
                        src={'tower.svg'}
                        alt=""
                        className='icon-image'/>
                    </Col>
                    <Col xs={10}>
                      {props.allBuildings[building.buildingType].displayName}
                    </Col>
                  </Row>
                </div>
              )) : (
                <React.Fragment>
                  This city has no constructed buildings
                </React.Fragment>
              )}
            </Scrollbars>
          </Row>
          <Row noGutters>
            <h5>City Garrison</h5>
          </Row>
          <Row noGutters>
            {/* Map garrison units to generate dynamic, scrollable list */}
            <Scrollbars style={{height: '20vh', width: '20vw'}}>
              {props.selectedCity.cityGarrison &&
              props.selectedCity.cityGarrison.length > 0 ?
              props.selectedCity.cityGarrison.map((unit, index) => (
                <Row noGutters key={index} className='garrison-unit-container'
                  onClick={(e) => viewUnitHandler(e, unit.unitType)}>
                  <Col md={2}>
                    <img
                      src={unit.unitType + '_ICON.svg'}
                      onError={(e)=>e.target.src='shield.svg'}
                      alt=""
                      className='unit-icon'/>
                  </Col>
                  <Col md={10}>
                    {props.allUnits[unit.unitType].displayName} (
                    {unit.currentHealth}/{unit.maxHealth} <span><img
                      src={'health.svg'}
                      alt=""
                      className={'black-health-icon'}
                    /></span>
                    )
                  </Col>
                </Row>
              )) : (
                <React.Fragment>
                  {'This city has no garrison'}
                </React.Fragment>
              )}
            </Scrollbars>
          </Row>
        </Container>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </React.Fragment>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    gameId: state.game.gameId,
    allBuildings: state.game.gameConstants.allBuildings,
    allUnits: state.game.gameConstants.allUnits,
    selectedCity: state.gameBoardView.gameBoard[
        state.gameBoardView.selectedTilePosition].city,
    isOwnTurn: state.gamePlayer.ownPlayerNumber ===
      state.gamePlayer.playerWhoseTurnItIs,
    ownPlayerData: state.gamePlayer.ownPlayerNumber ===
    PLAYER.ONE ? state.gamePlayer.playerOne : state.gamePlayer.playerTwo,
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
    selectedTilePosition: state.gameBoardView.selectedTilePosition,
    selectedTile: state.gameBoardView.gameBoard[
        state.gameBoardView.selectedTilePosition],
    timeWarp: state.game.gameConstants.allAstridiumAbilities[
        ASTRIDIUM_ABILITY_TYPE.TIME_WARP],
    allCommanders: state.game.gameConstants.allCommanders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCityMenuSupplementalData: (cityMenuSupplementalData) => dispatch(
        cityMenuAC.setCityMenuSupplementalData(cityMenuSupplementalData)),
    updateCityMenuSupplementalView: (cityMenuSupplementalView) => dispatch(
        cityMenuAC.setCityMenuSupplementalView(cityMenuSupplementalView)),
    updateCityMenuTab: (cityMenuTab) => dispatch(
        cityMenuAC.setCityMenuTab(cityMenuTab)),
  };
};

CityDetailsSidebar.propTypes = {
  gameId: PropTypes.string,
  allBuildings: PropTypes.any,
  allUnits: PropTypes.any,
  selectedCity: PropTypes.any,
  updateCityMenuSupplementalData: PropTypes.func,
  updateCityMenuSupplementalView: PropTypes.func,
  isOwnTurn: PropTypes.bool,
  ownPlayerData: PropTypes.any,
  selectedTilePosition: PropTypes.number,
  selectedTile: PropTypes.any,
  updateCityMenuTab: PropTypes.func,
  ownPlayerNumber: PropTypes.any,
  timeWarp: PropTypes.any,
  allCommanders: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(CityDetailsSidebar);
