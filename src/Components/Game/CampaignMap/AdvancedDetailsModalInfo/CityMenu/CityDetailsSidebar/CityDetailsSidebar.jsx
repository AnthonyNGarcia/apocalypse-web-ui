import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Scrollbars} from 'react-custom-scrollbars-2';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import FACTIONS from '../../../../../Utilities/factions';
import PLAYER from '../../../../../Utilities/playerEnums';
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
  const [ownPlayerData, setOwnPlayerData] = useState();

  useEffect(() => {
    if (props.ownPlayerNumber === PLAYER.ONE) {
      setOwnPlayerData(props.playerOne);
    } else if (props.ownPlayerNumber === PLAYER.TWO) {
      setOwnPlayerData(props.playerTwo);
    } else {
      console.log('Oops! Couldn\'t identify own player number/data!');
    }
    if (props.mainPanelData.faction === FACTIONS.HUMANS.NAME) {
      setCityHeader('Tier ' + props.mainPanelData.tier + ' Human Settlement');
    } else if (props.mainPanelData.faction === FACTIONS.INSECTS.NAME) {
      setCityHeader('Tier ' + props.mainPanelData.tier + ' Insect Hive');
    } else {
      console.warn('Oops! Couldn\'t identify this city faction!');
    }
  }, [props]);
  if (ownPlayerData) {
    return (
      <React.Fragment>
        <Container>
          <Row>
            <h5>{cityHeader}</h5>
          </Row>
          <Row className='center-text' style={{height: '15vh', width: '20vw'}}>
            <Col xs={4}>
              <Row>
              Production:
              </Row>
              <Row>
              Research:
              </Row>
              <Row>
              Growth:
              </Row>
            </Col>
            <Col xs={8}>
              <Row>
                {(
                  props.mainPanelData.baseProduction +
                ownPlayerData.flatGlobalProductionBonus
                ) *
              (
                (
                  100 + props.mainPanelData.percentProductionBonus +
                  ownPlayerData.percentGlobalProductionBonus
                ) / 100
              )}
              </Row>
              <Row>
                {(
                  props.mainPanelData.baseResearch +
                ownPlayerData.flatGlobalResearchBonus
                ) *
              (
                (
                  100 + props.mainPanelData.percentResearchBonus +
                  ownPlayerData.percentGlobalResearchBonus
                ) / 100
              )}
              </Row>
              <Row>
                {props.mainPanelData.currentGrowthStockpile}/200 (+{(
                  props.mainPanelData.baseGrowth +
                ownPlayerData.flatGlobalGrowthBonus
                ) *
              (
                (
                  100 + props.mainPanelData.percentGrowthBonus +
                  ownPlayerData.percentGlobalGrowthBonus
                ) / 100
              )})
              </Row>
            </Col>
          </Row>
          <Row>
            <h5>Current Buildings</h5>
          </Row>
          <Row>
            {/* Map completed buildings to generate dynamic, scrollable list */}
            <Scrollbars style={{height: '20vh', width: '20vw'}}>
              {props.mainPanelData.completedBuildings &&
              props.mainPanelData.completedBuildings.length > 0 ?
              props.mainPanelData.completedBuildings.map((building, index) => (
                <div key={index} style={{overflow: 'hidden'}}>
                  <Col xs={2}>
                    <img
                      src={'shield.png'}
                      alt=""
                      className='icon-image'/>
                  </Col>
                  <Col xs={10}>
                    {props.allBuildings[building.buildingType].displayName}
                  </Col>
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
              {props.mainPanelData.cityGarrison &&
              props.mainPanelData.cityGarrison.length > 0 ?
              props.mainPanelData.cityGarrison.map((unit, index) => (
                <div key={index} style={{overflow: 'hidden'}}>
                  <Row>
                    <Col xs={2}>
                      <img
                        src={'shield.png'}
                        alt=""
                        className='icon-image'/>
                    </Col>
                    <Col xs={10}>
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
    mainPanelData: state.game.mainPanelData,
    playerOne: state.game.playerOne,
    playerTwo: state.game.playerTwo,
    ownPlayerNumber: state.game.ownPlayerNumber,
    allBuildings: state.game.gameConstants.allBuildings,
    allUnits: state.game.gameConstants.allUnits,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateShowCityModalInfo: (showCityModalInfo) => dispatch(
        gameAC.setShowCityModalInfo(showCityModalInfo)),
  };
};

CityDetailsSidebar.propTypes = {
  mainPanelData: PropTypes.any,
  playerOne: PropTypes.any,
  playerTwo: PropTypes.any,
  ownPlayerNumber: PropTypes.string,
  updateShowCityModalInfo: PropTypes.func,
  allBuildings: PropTypes.any,
};

export default connect(mapStateToProps, mapDispatchToProps)(CityDetailsSidebar);
