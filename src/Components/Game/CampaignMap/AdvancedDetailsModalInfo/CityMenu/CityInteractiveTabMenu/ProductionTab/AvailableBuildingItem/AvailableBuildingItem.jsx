import React, {useEffect, useState, useCallback} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import cityMenuAC from
  '../../../../../../../../Redux/actionCreators/cityMenuActionCreators';
import Spinner from 'react-bootstrap/esm/Spinner';
import CITY_MENU_SUPPLEMENTAL_VIEWS from
  '../../../../../../../Utilities/cityMenuSupplementalViews';
import axios from 'axios';
import apiEndpoints from '../../../../../../../Utilities/apiEndpoints';
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

  const constructBuildingHandler = async (e) => {
    e.preventDefault();

    try {
      const updateCurrentConstructionRequest = {
        gameId: props.gameId,
        cityTilePosition: props.selectedTilePosition,
        desiredConstructionProject: props.bldg.buildingType,
      };
      axios.put(apiEndpoints.cityController + '/current-construction-project',
          updateCurrentConstructionRequest);
    } catch (e) {
      console.warn('There was an error trying to update the current ' +
      'construction project!');
      console.warn(e);
    }
  };

  useEffect(() => {
    if (props.selectedCity) {
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
            props.bldg.currentProductionProgress) /
            props.selectedCity.totalBuildingProduction);
        label = bldgName + ' (' + turnsToComplete + ' Turns)';
      }
      setBuildingLabel(label);

      // Determine if this building is currently being built
      const currentConstruction = props.selectedCity.currentConstructionProject;
      if (currentConstruction &&
      currentConstruction === props.bldg.buildingType) {
        setIsBuildingThis(true);
      } else {
        setIsBuildingThis(false);
      }

      forceUpdate();
    } else {
      console.log('no selected city...');
    }
  }, [props.selectedCity.totalBuildingProduction,
    props.selectedCity.currentConstructionProject,
    props.bldg.buildingType, isBuildingThis]);
  if (props.selectedCity) {
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
    gameId: state.game.gameId,
    selectedTilePosition: state.gameBoardView.selectedTilePosition,
    allBuildings: state.game.gameConstants.allBuildings,
    isOwnTurn: state.gamePlayer.ownPlayerNumber ===
      state.gamePlayer.playerWhoseTurnItIs,
    selectedCity: {...state.gameBoardView.gameBoard[
        state.gameBoardView.selectedTilePosition].city},
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCityMenuSupplementalData: (cityMenuSupplementalData) => dispatch(
        cityMenuAC.setCityMenuSupplementalData(cityMenuSupplementalData)),
    updateCityMenuSupplementalView: (cityMenuSupplementalView) => dispatch(
        cityMenuAC.setCityMenuSupplementalView(cityMenuSupplementalView)),
  };
};

AvailableBuildingItem.propTypes = {
  allBuildings: PropTypes.any,
  gameId: PropTypes.string,
  selectedTilePosition: PropTypes.number,
  bldg: PropTypes.any,
  isOwnTurn: PropTypes.bool,
  selectedCity: PropTypes.any,
  updateCityMenuSupplementalData: PropTypes.func,
  updateCityMenuSupplementalView: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(
    AvailableBuildingItem);
