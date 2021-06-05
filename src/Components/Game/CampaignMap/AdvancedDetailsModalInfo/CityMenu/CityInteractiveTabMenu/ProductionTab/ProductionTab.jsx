import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Scrollbars} from 'react-custom-scrollbars-2';
import AvailableBuildingItem from
  './AvailableBuildingItem/AvailableBuildingItem';
import QueuedUnitItem from './QueuedUnitItem/QueuedUnitItem';
import TrainableUnitItem from './TrainableUnitItem/TrainableUnitItem';
import './ProductionTab.css';
/**
 *
 * ProductionTab JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const ProductionTab = (props) => {
  return (
    <React.Fragment>
      {/* First col is for building*/}
      <Col>
        {/* First row is the header */}
        <Row>
          <h5>Available Buildings to Construct</h5>
        </Row>
        {/* Second row is the scrollbar */}
        <Row>
          <Scrollbars style={{height: '30vh', width: '95%'}}>
            {props.mainPanelData.constructibleBuildings &&
              props.mainPanelData.constructibleBuildings.length > 0 ?
              props.mainPanelData.constructibleBuildings
                  .map((bldg, index) => (
                    <React.Fragment key={index}>
                      <AvailableBuildingItem
                        key={index}
                        bldg={{...bldg}}
                        finalProduction={props.finalProduction}
                        city={{...props.city}}/>
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
      <Col >
        {/* First row is the header for recruitment queue */}
        <Row>
          <h5>Recruitment Queue</h5>
        </Row>
        {/* Second row is recruitment queue */}
        <Row>
          <Scrollbars style={{height: '15vh', width: '95%'}}>
            {props.mainPanelData.currentRecruitmentQueue &&
              props.mainPanelData.currentRecruitmentQueue.length > 0 ?
              props.mainPanelData.currentRecruitmentQueue
                  .map((queuedUnit, index) => (
                    <React.Fragment key={index}>
                      <QueuedUnitItem
                        key={index}
                        unit={{...queuedUnit}}
                        finalProduction={props.finalProduction}
                        city={{...props.city}}/>
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
          <h5>Available Units to Train</h5>
        </Row>
        {/* Fourth row is trainable units scrollbar */}
        <Row>
          <Scrollbars style={{height: '15vh', width: '95%'}}>
            {props.mainPanelData.trainableUnits &&
              props.mainPanelData.trainableUnits.length > 0 ?
              props.mainPanelData.trainableUnits
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
    mainPanelData: state.game.mainPanelData,
  };
};

ProductionTab.propTypes = {
  mainPanelData: PropTypes.any,
  finalProduction: PropTypes.number,
  city: PropTypes.any,
};

export default connect(mapStateToProps)(ProductionTab);
