import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Scrollbars} from 'react-custom-scrollbars-2';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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

  const commanderIsAlive = (commanderInfo) => {
    for (let i = 0; i < props.ownPlayerData
        .fallenCommanders.length; i++) {
      const commander = props.ownPlayerData.fallenCommanders[i];
      if (commander.commanderInfo.displayName ===
              commanderInfo.displayName) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (props.selectedCity) {
      if (props.selectedCity.factionType === FACTIONS.HUMANS.NAME) {
        setCityHeader('Tier ' + props.selectedCity.tier + ' Human Settlement');
      } else if (props.selectedCity.factionType === FACTIONS.INSECTS.NAME) {
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
          <Row>
            <h5>{cityHeader}</h5>
          </Row>
          <Row className='center-text' style={{height: '15vh', width: '20vw'}}>
            <Col md={6}>
              <Row>
                <span><img
                  src={'hammer.png'}
                  alt=""
                  className={'kinda-tiny-hammer-icon'}
                /></span><span className='bold-title'>Production:</span>
              </Row>
              <Row>
                <span><img
                  src={'research.svg'}
                  alt=""
                  className={'kinda-tiny-hammer-icon'}
                /></span><span className='bold-title'>Research:</span>
              </Row>
              <Row>
                <span><img
                  src={'growth.svg'}
                  alt=""
                  className={'kinda-tiny-hammer-icon'}
                /></span><span className='bold-title'>Growth:</span>
              </Row>
            </Col>
            <Col md={6}>
              <Row>
                {props.selectedCity.totalBuildingProduction}
              </Row>
              <Row>
                {props.selectedCity.totalResearch}
              </Row>
              <Row>
                {props.selectedCity.currentGrowthStockpile}/200 (+
                {props.selectedCity.totalGrowth})
              </Row>
            </Col>
          </Row>
          <Row>
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
          <Row>
            <Button
              variant='primary'
              disabled={!props.isOwnTurn ||
                (props.selectedCity.assignedCommander &&
                  commanderIsAlive(props.selectedCity.assignedCommander))}
              onClick={showCommanderTabHandler}
              style={{width: '100%', fontSize: 'small',
                margin: 'auto', marginTop: '1vh'}}
            >
              {props.selectedCity.assignedCommander ?
              (
                <React.Fragment>
                  <p style={{margin: '0px', padding: '0px'}}>
                    {props.selectedCity.assignedCommander
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
          <Row>
            <h5>Current Buildings</h5>
          </Row>
          <Row>
            {/* Map completed buildings to generate dynamic, scrollable list */}
            <Scrollbars style={{height: '20vh', width: '20vw'}}>
              {props.selectedCity.completedBuildings &&
              props.selectedCity.completedBuildings.length > 0 ?
              props.selectedCity.completedBuildings.map((building, index) => (
                <div key={index} style={{overflow: 'hidden'}}
                  onClick={(e) =>
                    viewBuildingHandler(e, building)}>
                  <Row>
                    <Col xs={2}>
                      <img
                        src={'tower.png'}
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
          <Row>
            <h5>City Garrison</h5>
          </Row>
          <Row>
            {/* Map garrison units to generate dynamic, scrollable list */}
            <Scrollbars style={{height: '20vh', width: '20vw'}}>
              {props.selectedCity.cityGarrison &&
              props.selectedCity.cityGarrison.length > 0 ?
              props.selectedCity.cityGarrison.map((unit, index) => (
                <div key={index} className='garrison-unit-container'
                  onClick={(e) => viewUnitHandler(e, unit.unitType)}>
                  <Row noGutters>
                    <Col md={2}>
                      <img
                        src={'shield.png'}
                        alt=""
                        className='unit-icon'/>
                    </Col>
                    <Col md={10}>
                      {props.allUnits[unit.unitType].displayName}
                    </Col>
                  </Row>
                </div>
              )) : (
                <React.Fragment>
                  ---
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
    selectedTilePosition: state.gameBoardView.selectedTilePosition,
    selectedTile: state.gameBoardView.gameBoard[
        state.gameBoardView.selectedTilePosition],
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
};

export default connect(mapStateToProps, mapDispatchToProps)(CityDetailsSidebar);
