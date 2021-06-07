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
import './ProductionTab.css';
/**
 *
 * ProductionTab JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const ProductionTab = (props) => {
  const [unitPopLabel, setUnitPopLabel] = useState('');

  useEffect(() => {
    const currentPopCount = props.selectedCity.unassignedUnits.length +
      props.selectedCity.currentRecruitmentQueue.length;
    setUnitPopLabel('' + currentPopCount + '/' +
      props.ownPlayerData.currentBaseArmySize);
  }, [props]);

  return (
    <React.Fragment>
      {/* First col is for building*/}
      <Col>
        {/* First row is the header */}
        <Row>
          <h5 style={{'margin': 'auto'}}>Available Buildings to Construct</h5>
        </Row>
        {/* Second row is the scrollbar */}
        <Row>
          <Scrollbars style={{height: '30vh'}}>
            {props.selectedCity.constructibleBuildings &&
              props.selectedCity.constructibleBuildings.length > 0 ?
              props.selectedCity.constructibleBuildings
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
          </Scrollbars>
        </Row>
      </Col>
      {/* Second col is for training */}
      <Col>
        {/* First row is the header for recruitment queue */}
        <Row>
          <h5 style={{'margin': 'auto'}}>Recruitment Queue (
            {props.selectedCity.unitProductionRemaining}/{
              props.selectedCity.totalUnitProduction}<span><img
              src={'hammer.png'}
              alt=""
              className={'tiny-hammer-icon'}
            /></span>, {unitPopLabel} <span><img
              src={'unit_count.svg'}
              alt=""
              className={'tiny-hammer-icon'}
            /></span>)
          </h5>
        </Row>
        {/* Second row is recruitment queue */}
        <Row>
          <Scrollbars style={{height: '15vh', width: '95%'}}>
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
        {/* Third row is header for trainable units */}
        <Row>
          <h5 style={{'margin': 'auto'}}>Available Units to Train</h5>
        </Row>
        {/* Fourth row is trainable units scrollbar */}
        <Row>
          <Scrollbars style={{height: '15vh', width: '95%'}}>
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
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedCity: state.game.gameBoard[state.game.selectedTilePosition].city,
    ownPlayerData: state.game.ownPlayerNumber === PLAYER.ONE ?
      state.game.playerOne : state.game.playerTwo,
  };
};

ProductionTab.propTypes = {
  selectedCity: PropTypes.any,
  ownPlayerData: PropTypes.any,
};

export default connect(mapStateToProps)(ProductionTab);
