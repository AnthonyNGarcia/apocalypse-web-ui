import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Scrollbars} from 'react-custom-scrollbars-2';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FACTIONS from '../../../../../Utilities/factions';
import Spinner from 'react-bootstrap/esm/Spinner';
import gameAC from '../../../../../../Redux/actionCreators/gameActionCreators';
import './CityDetailsSidebar.css';
import CITY_MENU_SUPPLEMENTAL_VIEWS from
  '../../../../../Utilities/cityMenuSupplementalViews';

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

  useEffect(() => {
    if (props.city) {
      if (props.city.faction === FACTIONS.HUMANS.NAME) {
        setCityHeader('Tier ' + props.city.tier + ' Human Settlement');
      } else if (props.city.faction === FACTIONS.INSECTS.NAME) {
        setCityHeader('Tier ' + props.city.tier + ' Insect Hive');
      } else {
        console.warn('Oops! Couldn\'t identify this city faction!');
      }
    }
  }, [props]);

  if (props.city) {
    return (
      <React.Fragment>
        <Container>
          <Row>
            <h5>{cityHeader}</h5>
          </Row>
          <Row className='center-text' style={{height: '15vh', width: '20vw'}}>
            <Col md={6}>
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
            <Col md={6}>
              <Row>
                {props.finalProduction}
              </Row>
              <Row>
                {props.finalResearch}
              </Row>
              <Row>
                {props.city.currentGrowthStockpile}/200 (+
                {props.finalGrowth})
              </Row>
            </Col>
          </Row>
          <Row>
            <h5>Current Buildings</h5>
          </Row>
          <Row>
            {/* Map completed buildings to generate dynamic, scrollable list */}
            <Scrollbars style={{height: '20vh', width: '20vw'}}>
              {props.city.completedBuildings &&
              props.city.completedBuildings.length > 0 ?
              props.city.completedBuildings.map((building, index) => (
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
              {props.city.cityGarrison &&
              props.city.cityGarrison.length > 0 ?
              props.city.cityGarrison.map((unit, index) => (
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
    allBuildings: state.game.gameConstants.allBuildings,
    allUnits: state.game.gameConstants.allUnits,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCityMenuSupplementalData: (cityMenuSupplementalData) => dispatch(
        gameAC.setCityMenuSupplementalData(cityMenuSupplementalData)),
    updateCityMenuSupplementalView: (cityMenuSupplementalView) => dispatch(
        gameAC.setCityMenuSupplementalView(cityMenuSupplementalView)),
  };
};

CityDetailsSidebar.propTypes = {
  allBuildings: PropTypes.any,
  allUnits: PropTypes.any,
  finalProduction: PropTypes.number,
  finalGrowth: PropTypes.number,
  finalResearch: PropTypes.number,
  city: PropTypes.any,
  updateCityMenuSupplementalData: PropTypes.func,
  updateCityMenuSupplementalView: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(CityDetailsSidebar);
