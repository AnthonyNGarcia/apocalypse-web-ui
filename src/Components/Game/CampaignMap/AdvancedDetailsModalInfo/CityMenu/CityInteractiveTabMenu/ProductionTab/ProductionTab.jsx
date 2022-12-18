import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Scrollbars} from 'react-custom-scrollbars-2';
import AvailableBuildingItem from
  './AvailableBuildingItem/AvailableBuildingItem';
import QueuedUnitItem from './QueuedUnitItem/QueuedUnitItem';
import TrainableUnitItem from './TrainableUnitItem/TrainableUnitItem';
import PLAYER from '../../../../../../Utilities/playerEnums';
import getHeroUnitCount from '../../../../../../Utilities/getHeroUnitCount';
import './ProductionTab.css';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import apiEndpoints from '../../../../../../Utilities/apiEndpoints';

/**
 *
 * ProductionTab JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const ProductionTab = (props) => {
  const [unitPopLabel, setUnitPopLabel] = useState('');
  const [heroPopLabel, setHeroPopLabel] = useState('');
  const [manualTrainingIsPaused, setManualTrainingIsPaused] = useState(false);

  useEffect(() => {
    const currentPopCount = props.selectedCity.unassignedUnits.length +
      props.selectedCity.currentRecruitmentQueue.length;
    const currentHeroPopCount = getHeroUnitCount(
        props.selectedCity.unassignedUnits) + getHeroUnitCount(
        props.selectedCity.currentRecruitmentQueue);
    setUnitPopLabel('' + currentPopCount + '/' +
      props.ownPlayerData.currentBaseArmySize);
    setHeroPopLabel('' + currentHeroPopCount + '/' +
      props.ownPlayerData.currentBaseTier3HeroUnitsSupported);
    if (props.selectedCity.currentConstructionProject) {
      const recruitmentQueue = props.selectedCity.currentRecruitmentQueue;
      let manuallyTrainedUnitIsPaused = false;
      recruitmentQueue.forEach((queuedUnit, _) => {
        if (!queuedUnit.free && !queuedUnit.currentlyTraining) {
          manuallyTrainedUnitIsPaused = true;
        }
      });
      if (manuallyTrainedUnitIsPaused) {
        setManualTrainingIsPaused(true);
      } else {
        setManualTrainingIsPaused(false);
      }
    } else {
      setManualTrainingIsPaused(false);
    }
  }, [props, props.selectedCity.currentRecruitmentQueue,
    props.selectedCity.unassignedUnits]);

  const returnReversed = (array) => {
    const reversedArray = [...array];
    reversedArray.reverse();
    return reversedArray;
  };

  const resumeManualUnitTrainingHandler = async (e) => {
    e.preventDefault();
    try {
      const resumeManualUnitTrainingRequest = {
        gameId: props.gameId,
        cityTilePosition: props.selectedTilePosition,
      };
      await axios.post(
          apiEndpoints.cityController +
          '/resume-unit-training', resumeManualUnitTrainingRequest);
    } catch (e) {
      console.warn('Oops! There was an error trying to resume manual unit training!');
      console.warn(e);
    }
  };

  return (
    <React.Fragment>
      {/* First col is for building*/}
      <Col>
        {/* First row is the header */}
        <Row>
          <h5 style={{'margin': 'auto'}}>Select City Production</h5>
        </Row>
        {/* Second row is the scrollbar */}
        <Row>
          <Scrollbars style={{height: '30vh'}}>
            {props.selectedCity.constructibleBuildings &&
              props.selectedCity.constructibleBuildings.length > 0 ?
              returnReversed(props.selectedCity.constructibleBuildings)
                  .map((bldg, index) => (
                    <React.Fragment key={index}>
                      <AvailableBuildingItem
                        key={index +
                          props.selectedCity.currentConstructionProject}
                        bldg={{...bldg}}/>
                    </React.Fragment>
                  )) : (
                <React.Fragment>
                  There are no construction projects available.
                </React.Fragment>
              )}
            {props.selectedCity.trainableUnits &&
              props.selectedCity.trainableUnits.length > 0 ?
              props.selectedCity.trainableUnits
                  .map((unitType, index) => (
                    <React.Fragment key={index}>
                      <TrainableUnitItem
                        key={index}
                        unitType={unitType}
                      />
                    </React.Fragment>
                  )) : (
                <React.Fragment>
                  No Unit Types are available to train.
                </React.Fragment>
              )}
          </Scrollbars>
        </Row>
      </Col>
      {/* Second col is for training */}
      <Col>
        {/* First row is the header for recruitment queue */}
        <Row>
          <h5 style={{'margin': 'auto'}}>Recruitment Queue (
            {unitPopLabel} <span><img
              src={'unit_count.svg'}
              alt=""
              className={'tiny-hammer-icon'}
            /></span>, {heroPopLabel} <span><img
              src={'hero_unit_icon.svg'}
              alt=""
              className={'tiny-hero-unit-icon'}
            /></span>)
          </h5>
        </Row>
        {/* Second row is the button to resume training if building a structure */}
        <Row>
          {manualTrainingIsPaused ? (
          <Button
            onClick={resumeManualUnitTrainingHandler}
            className='resume-training-button'
          >
            Resume Training
          </Button>) : null}
        </Row>
        {/* Third row is recruitment queue */}
        <Row>
          <Scrollbars style={{height: '30vh', width: '95%'}}>
            {props.selectedCity.currentRecruitmentQueue &&
              props.selectedCity.currentRecruitmentQueue.length > 0 ?
              props.selectedCity.currentRecruitmentQueue
                  .map((queuedUnit, index) => (
                    <React.Fragment key={index +
                    props.selectedCity.currentRecruitmentQueue.length}>
                      <QueuedUnitItem
                        key={index}
                        queuedUnit={{...queuedUnit}}
                        discardingIndex={index}/>
                    </React.Fragment>
                  )) : (
                <React.Fragment>
                  No Units are currently queued for recruitment.
                </React.Fragment>
              )}
          </Scrollbars>
        </Row>
      </Col>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    gameId: state.game.gameId,
    selectedCity: {...state.gameBoardView.gameBoard[
        state.gameBoardView.selectedTilePosition].city},
    selectedTilePosition: state.gameBoardView.selectedTilePosition,
    ownPlayerData: state.gamePlayer.ownPlayerNumber === PLAYER.ONE ?
      state.gamePlayer.playerOne : state.gamePlayer.playerTwo,
  };
};

ProductionTab.propTypes = {
  gameId: PropTypes.string,
  selectedCity: PropTypes.any,
  selectedTilePosition: PropTypes.number,
  ownPlayerData: PropTypes.any,
};

export default connect(mapStateToProps)(ProductionTab);
