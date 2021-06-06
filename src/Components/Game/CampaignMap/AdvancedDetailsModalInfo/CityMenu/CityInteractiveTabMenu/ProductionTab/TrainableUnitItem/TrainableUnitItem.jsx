import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/esm/Spinner';
import CITY_MENU_SUPPLEMENTAL_VIEWS from
  '../../../../../../../Utilities/cityMenuSupplementalViews';
import gameAC from
  '../../../../../../../../Redux/actionCreators/gameActionCreators';
import axios from 'axios';
import apiEndpoints from '../../../../../../../Utilities/apiEndpoints';
import './TrainableUnitItem.css';

/**
 *
 * TrainableUnitItem JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const TrainableUnitItem = (props) => {
  const [fullUnitInfo, setFullUnitInfo] = useState(null);
  const [canAddUnitToQueue, setCanAddUnitToQueue] = useState(false);

  useEffect( () => {
    const updateCanAddUnitToQueue = (freshFullUnitInfo) => {
      const usableFullUnitInfo = freshFullUnitInfo ?
        freshFullUnitInfo : fullUnitInfo;
      if (props.selectedCity.unitProductionRemaining >=
        usableFullUnitInfo.productionCost) {
        setCanAddUnitToQueue(true);
      } else {
        setCanAddUnitToQueue(false);
      }
    };
    if (props.unitType) {
      const freshFullUnitInfo = props.allUnits[props.unitType];
      setFullUnitInfo(freshFullUnitInfo);
      updateCanAddUnitToQueue(freshFullUnitInfo);
    }
  }, [props]);

  const viewUnitHandler = (e) => {
    e.preventDefault();
    props.updateCityMenuSupplementalView(CITY_MENU_SUPPLEMENTAL_VIEWS.UNIT);
    props.updateCityMenuSupplementalData(props.unitType);
  };

  const addUnitHandler = async (e) => {
    e.preventDefault();
    try {
      const addUnitRequest = {
        cityTilePosition: props.selectedTilePosition,
        desiredUnitType: props.unitType,
      };
      await axios.post(
          apiEndpoints.gameController +
          '/in-memory-recruitment-queue/' + props.gameId, addUnitRequest);
    } catch (e) {
      console.warn('Oops! There was an error trying to recruit a unit!');
      console.warn(e);
    }
  };

  if (props.unitType && fullUnitInfo) {
    return (
      <div className='unit-option-container'>
        <Row onClick={(e) => viewUnitHandler(e)} className='vertically-center'>
          <Col md={2}>
            <img
              src={fullUnitInfo.unitType + '_ICON.svg'}
              onError={(e)=>{
                if (errorflag) {
                  errorflag=false; e.target.src='shield.png';
                }
              }}
              alt=""
              className='unit-icon'/>
          </Col>
          <Col md={7}>
            <p>
              {fullUnitInfo.displayName} ({
                fullUnitInfo.productionCost} <span><img
                src={'hammer.png'}
                alt=""
                className={'really-tiny-hammer-icon'}
              /></span>, {fullUnitInfo.turnsToTrain} <span><img
                src={'timer.png'}
                alt=""
                className={'really-tiny-timer-icon'}
              /></span>)
            </p>
          </Col>
          <Col md={3}>
            <Button
              variant='primary'
              onClick={addUnitHandler}
              disabled={!props.isOwnTurn || !canAddUnitToQueue}>
                +
            </Button>
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
    isOwnTurn: state.game.isOwnTurn,
    selectedCity: state.game.gameBoard[state.game.selectedTilePosition].city,
    selectedTilePosition: state.game.selectedTilePosition,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCityMenuSupplementalData: (cityMenuSupplementalData) => dispatch(
        gameAC.setCityMenuSupplementalData(cityMenuSupplementalData)),
    updateCityMenuSupplementalView: (cityMenuSupplementalView) => dispatch(
        gameAC.setCityMenuSupplementalView(cityMenuSupplementalView)),
    updateCurrentCityRecruitmentQueue: (recruitmentQueue) => dispatch(
        gameAC.setCurrentCityRecruitmentQueue(recruitmentQueue)),
  };
};

TrainableUnitItem.propTypes = {
  gameId: PropTypes.string,
  allUnits: PropTypes.any,
  isOwnTurn: PropTypes.bool,
  unitType: PropTypes.string,
  selectedCity: PropTypes.any,
  updateCityMenuSupplementalData: PropTypes.func,
  updateCityMenuSupplementalView: PropTypes.func,
  updateCurrentCityRecruitmentQueue: PropTypes.func,
  selectedTilePosition: PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(TrainableUnitItem);
