import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import BuildingBonusItem from './BuildingBonusItem/BuildingBonusItem';
import './SelectedBuildingDetails.css';

/**
 *
 * SelectedBuildingDetails JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const SelectedBuildingDetails = (props) => {
  const [fullBuildingInfo, setFullBuildingInfo] = useState(null);

  useEffect(() => {
    if (props.building) {
      setFullBuildingInfo(props.allBuildings[props.building.buildingType]);
    }
  }, [props]);

  if (fullBuildingInfo) {
    return (
      <React.Fragment>
        <Row style={{marginTop: '4vh'}}>
          {/* First col is the image */}
          <Col md={4} style={{width: '20vw'}}>
            <img
              src={'tower.png'}
              alt=""
              className='building-image'/>
          </Col>
          {/* Second col is the building info */}
          <Col md={8} style={{width: '20vw'}}>
            <Row>
              <h5>{fullBuildingInfo.displayName} ({
                fullBuildingInfo.productionCost} <span><img
                src={'hammer.png'}
                alt=""
                className={'tiny-hammer-icon'}
              /></span>)</h5>
            </Row>
            <Row>
              <p>{fullBuildingInfo.description}</p>
            </Row>
            {/* Building bonuses*/}
            <Row>
              <ul>
                {fullBuildingInfo.buildingBonusesProvided &&
                fullBuildingInfo.buildingBonusesProvided.length > 0 ?
                fullBuildingInfo.buildingBonusesProvided.map((bonus, index) => (
                  <li key={bonus.buildingBonusType + index}>
                    <BuildingBonusItem
                      bonus={bonus}/>
                  </li>
                )) : null}
                {fullBuildingInfo.unitsUnlockedByThis &&
                fullBuildingInfo.unitsUnlockedByThis.length > 0 ?
                fullBuildingInfo.unitsUnlockedByThis.map((unitType, index) => (
                    props.allUnits[unitType] ? (
                      <li key={unitType + index}>
                        Unlocks Training the {props
                            .allUnits[unitType].displayName}
                      </li>
                    ) : null
                )) : null}
                {fullBuildingInfo.buildingsUnlockedByThis &&
                fullBuildingInfo.buildingsUnlockedByThis.length > 0 ?
                fullBuildingInfo.buildingsUnlockedByThis
                    .map((buildingType, index) => (
                      props.allBuildings[buildingType] ? (
                        <li key={buildingType + index}>
                          Unlocks Building the {props
                              .allBuildings[buildingType].displayName}
                        </li>
                      ) : null
                    )) : null}
              </ul>
            </Row>
          </Col>
        </Row>
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
    building: state.game.cityMenuSupplementalData,
    allBuildings: state.game.gameConstants.allBuildings,
    allUnits: state.game.gameConstants.allUnits,
  };
};

SelectedBuildingDetails.propTypes = {
  building: PropTypes.any,
  allBuildings: PropTypes.any,
  allUnits: PropTypes.any,
};

export default connect(mapStateToProps)(SelectedBuildingDetails);
