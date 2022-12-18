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
import PLAYER from '../../../../../../../Utilities/playerEnums';
import './TrainableUnitItem.css';
import getHeroUnitCount from '../../../../../../../Utilities/getHeroUnitCount';

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
  const [canAddHeroUnitToQueue, setCanAddHeroUnitToQueue] = useState(false);

  useEffect( () => {
    const updateCanAddUnitToQueue = () => {
      const cityHasRoom = (props.selectedCity.unassignedUnits.length +
          props.selectedCity.currentRecruitmentQueue.length) <
          props.ownPlayerData.currentBaseArmySize;
      if (props.selectedCity.currentConcurrentUnitTrainingCount > 0 && cityHasRoom) {
        setCanAddUnitToQueue(true);
      } else {
        setCanAddUnitToQueue(false);
      }
    };

    const updateCanAddHeroUnitToQueue = () => {
      const heroUnitCount = getHeroUnitCount(
          props.selectedCity.unassignedUnits) + getHeroUnitCount(
          props.selectedCity.currentRecruitmentQueue);
      if (heroUnitCount <
        props.ownPlayerData.currentBaseTier3HeroUnitsSupported) {
        setCanAddHeroUnitToQueue(true);
      } else {
        setCanAddHeroUnitToQueue(false);
      }
    };

    if (props.unitType) {
      const freshFullUnitInfo = props.allUnits[props.unitType];
      setFullUnitInfo(freshFullUnitInfo);
      updateCanAddUnitToQueue();
      updateCanAddHeroUnitToQueue();
    }
  }, [props, props.selectedCity]);

  const viewUnitHandler = (e) => {
    e.preventDefault();
    props.updateCityMenuSupplementalView(CITY_MENU_SUPPLEMENTAL_VIEWS.UNIT);
    props.updateCityMenuSupplementalData(props.unitType);
  };

  const addUnitHandler = async (e) => {
    e.preventDefault();
    try {
      const addUnitRequest = {
        gameId: props.gameId,
        cityTilePosition: props.selectedTilePosition,
        desiredUnitType: props.unitType,
      };
      await axios.post(
          apiEndpoints.cityController +
          '/enqueue-unit', addUnitRequest);
    } catch (e) {
      console.warn('Oops! There was an error trying to recruit a unit!');
      console.warn(e);
    }
  };

  if (props.unitType && fullUnitInfo) {
    return (
      <div className='unit-option-container'>
        <Row onClick={(e) => viewUnitHandler(e)}
          className='vertically-center' noGutters>
          <Col md={2}>
            <img
              src={props.unitType + '_ICON.svg'}
              onError={(e)=>e.target.src='shield.svg'}
              alt=""
              className='unit-icon'/>
          </Col>
          <Col md={7}>
            <p>
              {fullUnitInfo.displayName} (
              {Math.ceil(fullUnitInfo.productionCost / props.selectedCity.totalProduction)} <span><img
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
            <div className='train-unit-button'>
              <Button
                variant='primary'
                onClick={addUnitHandler}
                disabled={!props.isOwnTurn || !canAddUnitToQueue ||
              (fullUnitInfo.tier === 3 && !canAddHeroUnitToQueue)}>
                Train
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
    selectedCity: {...state.gameBoardView.gameBoard[
        state.gameBoardView.selectedTilePosition].city},
    selectedTilePosition: state.gameBoardView.selectedTilePosition,
    ownPlayerData: state.gamePlayer.ownPlayerNumber === PLAYER.ONE ?
      state.gamePlayer.playerOne : state.gamePlayer.playerTwo,
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
  ownPlayerData: PropTypes.any,
};

export default connect(mapStateToProps, mapDispatchToProps)(TrainableUnitItem);
