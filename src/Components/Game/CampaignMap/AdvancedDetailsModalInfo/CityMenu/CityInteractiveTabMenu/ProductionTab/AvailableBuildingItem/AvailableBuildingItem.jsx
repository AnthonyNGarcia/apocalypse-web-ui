import React, {useEffect, useState, useCallback} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import gameAC from
  '../../../../../../../../Redux/actionCreators/gameActionCreators';
import Spinner from 'react-bootstrap/esm/Spinner';
import CITY_MENU_SUPPLEMENTAL_VIEWS from
  '../../../../../../../Utilities/cityMenuSupplementalViews';
import './AvailableBuildingItem.css';

/**
 *
 * AvailableBuildingItem JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const AvailableBuildingItem = (props) => {
  const [buildingLabel, setBuildingLabel] = useState('');
  const [isBuildingThis, setIsBuildingThis] = useState(false);
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const viewBuildingHandler = (e, building) => {
    e.preventDefault();
    props.updateCityMenuSupplementalView(CITY_MENU_SUPPLEMENTAL_VIEWS.BUILDING);
    props.updateCityMenuSupplementalData(building);
  };

  const constructBuildingHandler = (e) => {
    e.preventDefault();
    if (!isBuildingThis) {
      // Outsource the logic to change the current construction project
      // We basically have to change the main panel data....
      props.updateCurrentCityConstructionProject(props.bldg);
    }
  };

  useEffect(() => {
    if (props.city) {
    // Generate the building label
      const bldgInfo = props.allBuildings[props.bldg.buildingType];
      const bldgName = bldgInfo.displayName;
      let label;
      if (bldgInfo.buildingType==='HUMAN_UNIT_PRODUCTION_FOCUS' ||
      bldgInfo.buildingType==='HUMAN_RESEARCH_FOCUS' ||
      bldgInfo.buildingType==='HUMAN_GROWTH_FOCUS' ||
      bldgInfo.buildingType==='INSECT_UNIT_PRODUCTION_FOCUS' ||
      bldgInfo.buildingType==='INSECT_RESEARCH_FOCUS' ||
      bldgInfo.buildingType==='INSECT_GROWTH_FOCUS') {
        label = bldgName + ' (∞)';
      } else {
        const turnsToComplete =
          Math.ceil((bldgInfo.productionCost -
            props.bldg.currentProductionProgress) / props.finalProduction);
        label = bldgName + ' (' + turnsToComplete + ' Turns)';
      }
      setBuildingLabel(label);

      // Determine if this building is currently being built
      const currentConstruction = props.city.currentConstructionProject;
      if (currentConstruction &&
      currentConstruction.buildingType === props.bldg.buildingType) {
        setIsBuildingThis(true);
      } else {
        setIsBuildingThis(false);
      }
      forceUpdate();
    }
  }, [props, props.city.currentConstructionProject ?
    props.city.currentConstructionProject.currentProductionProgress :
    props.city.currentConstructionProject]);
  if (props.city) {
    return (
      <div className='building-option-container'>
        <Row onClick={(e) => viewBuildingHandler(e, props.bldg)}>
          <Col md={2}>
            <img
              src={'tower.png'}
              alt=""
              className='building-icon'/>
          </Col>
          <Col md={6}>
            <p style={{padding: 0, margin: 0}}>{buildingLabel}</p>
          </Col>
          <Col md={4}>
            {isBuildingThis ?

              <img
                src={'hammer.png'}
                alt=""
                className={'animated-hammer'}
              /> :
            <Button
              variant='warning'
              onClick={constructBuildingHandler}
              disabled={!props.isOwnTurn}>
                Build
            </Button>}
          </Col>
        </Row>
      </div>
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
    isOwnTurn: state.game.isOwnTurn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCurrentCityConstructionProject: (newConstructionProject) => dispatch(
        gameAC.setCurrentCityConstructionProject(newConstructionProject)),
    updateCityMenuSupplementalData: (cityMenuSupplementalData) => dispatch(
        gameAC.setCityMenuSupplementalData(cityMenuSupplementalData)),
    updateCityMenuSupplementalView: (cityMenuSupplementalView) => dispatch(
        gameAC.setCityMenuSupplementalView(cityMenuSupplementalView)),
  };
};

AvailableBuildingItem.propTypes = {
  allBuildings: PropTypes.any,
  bldg: PropTypes.any,
  finalProduction: PropTypes.number,
  updateCurrentCityConstructionProject: PropTypes.func,
  isOwnTurn: PropTypes.bool,
  city: PropTypes.any,
  updateCityMenuSupplementalData: PropTypes.func,
  updateCityMenuSupplementalView: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(
    AvailableBuildingItem);
