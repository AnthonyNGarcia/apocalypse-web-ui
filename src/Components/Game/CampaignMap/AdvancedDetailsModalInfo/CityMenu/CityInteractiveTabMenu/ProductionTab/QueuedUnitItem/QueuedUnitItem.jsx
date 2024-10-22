import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/esm/Spinner';
import CITY_MENU_SUPPLEMENTAL_VIEWS from
  '../../../../../../../Utilities/cityMenuSupplementalViews';
import cityMenuAC from
  '../../../../../../../../Redux/actionCreators/cityMenuActionCreators';
import axios from 'axios';
import apiEndpoints from '../../../../../../../Utilities/apiEndpoints';
import './QueuedUnitItem.css';

/**
 *
 * QueuedUnitItem JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const QueuedUnitItem = (props) => {
  const [fullUnitInfo, setFullUnitInfo] = useState(null);
  const [unitLabel, setUnitLabel] = useState('');

  useEffect( () => {
    if (props.queuedUnit && props.queuedUnit.actualUnitTypeToBeProduced) {
      const freshFullUnitInfo = props.allUnits[
          props.queuedUnit.actualUnitTypeToBeProduced];
      setFullUnitInfo(freshFullUnitInfo);
      let newUnitLabel = freshFullUnitInfo.displayName + ' (';
      /**
       * {
                !props.queuedUnit.free ?
                 '' : <span
                   style={{'fontWeight': 'bold'}}>FREE, </span>}{
                Math.ceil(props.queuedUnit.productionCostRemaining/props.selectedCity.totalProduction)}
       */
      if (props.queuedUnit.free) {
        newUnitLabel += 'FREE ';
      }
      if (!props.queuedUnit.currentlyTraining) {
        newUnitLabel += 'PAUSED ';
      }
      const turnsRemaining = Math.ceil(props.queuedUnit.productionCostRemaining/props.selectedCity.totalProduction);
      newUnitLabel += turnsRemaining;
      setUnitLabel(newUnitLabel);
    }
  }, [props]);

  const viewUnitHandler = (e) => {
    e.preventDefault();
    props.updateCityMenuSupplementalView(CITY_MENU_SUPPLEMENTAL_VIEWS.UNIT);
    props.updateCityMenuSupplementalData(
        props.queuedUnit.actualUnitTypeToBeProduced);
  };

  const removeUnitHandler = (e) => {
    e.preventDefault();
    try {
      const removeUnitRequest = {
        gameId: props.gameId,
        tilePosition: props.selectedTilePosition,
        unitIndex: props.discardingIndex,
      };
      axios.patch(
          apiEndpoints.cityController +
          '/dequeue-unit/', removeUnitRequest);
    } catch (e) {
      console.warn('Oops! There was an error trying to cancel ' +
        'unit recruitment!');
      console.warn(e);
    }
  };

  if (props.queuedUnit.actualUnitTypeToBeProduced && fullUnitInfo) {
    return (
      <div className='unit-option-container'>
        <Row onClick={(e) => viewUnitHandler(e)}
          className='vertically-center' noGutters>
          <Col md={2}>
            <img
              src={props.queuedUnit.actualUnitTypeToBeProduced + '_ICON.svg'}
              onError={(e)=>e.target.src='shield.svg'}
              alt=""
              className='unit-icon'/>
          </Col>
          <Col md={7}>
            <p>
              {unitLabel}<span><img
                src={'timer.svg'}
                alt=""
                className={'really-tiny-timer-icon'}
              /></span>) {
            fullUnitInfo.tier === 3 ? (
              <span><img
                src={'hero_unit_icon.svg'}
                alt=""
                className={'black-hero-unit-icon'}
              /></span>
            ) : null}
            </p>
          </Col>
          <Col md={3}>
            <div className='cancel-unit-training-button'>
              <Button
                variant='danger'
                onClick={removeUnitHandler}
                disabled={!props.isOwnTurn}>
                X
              </Button>
            </div>
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
    allUnits: state.game.gameConstants.allUnits,
    isOwnTurn: state.gamePlayer.ownPlayerNumber ===
      state.gamePlayer.playerWhoseTurnItIs,
    selectedCity: state.gameBoardView.gameBoard[
        state.gameBoardView.selectedTilePosition].city,
    selectedTilePosition: state.gameBoardView.selectedTilePosition,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCityMenuSupplementalData: (cityMenuSupplementalData) => dispatch(
        cityMenuAC.setCityMenuSupplementalData(cityMenuSupplementalData)),
    updateCityMenuSupplementalView: (cityMenuSupplementalView) => dispatch(
        cityMenuAC.setCityMenuSupplementalView(cityMenuSupplementalView)),
    updateCurrentCityRecruitmentQueue: (recruitmentQueue) => dispatch(
        cityMenuAC.setCurrentCityRecruitmentQueue(recruitmentQueue)),
  };
};

QueuedUnitItem.propTypes = {
  queuedUnit: PropTypes.any,
  discardingIndex: PropTypes.number,
  gameId: PropTypes.string,
  allUnits: PropTypes.any,
  isOwnTurn: PropTypes.bool,
  selectedCity: PropTypes.any,
  updateCityMenuSupplementalData: PropTypes.func,
  updateCityMenuSupplementalView: PropTypes.func,
  updateCurrentCityRecruitmentQueue: PropTypes.func,
  selectedTilePosition: PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(QueuedUnitItem);

