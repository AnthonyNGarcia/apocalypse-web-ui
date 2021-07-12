import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/esm/Spinner';
import apiEndpoints from '../../../../../../Utilities/apiEndpoints';
import axios from 'axios';
import './ArmyUnitItem.css';

/**
 *
 * ArmyUnitItem JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const ArmyUnitItem = (props) => {
  const [fullUnitInfo, setFullUnitInfo] = useState(null);

  useEffect( () => {
    if (props.unit && props.unit.unitType) {
      const freshFullUnitInfo = props.allUnits[props.unit.unitType];
      setFullUnitInfo(freshFullUnitInfo);
    }
  }, [props]);

  const removeUnitHandler = (e) => {
    e.preventDefault();
    try {
      const removeUnitRequest = {
        gameId: props.gameId,
        tilePosition: props.selectedTilePosition,
        unitIndex: props.discardingIndex,
      };
      axios.patch(apiEndpoints.armyController +
          '/disband-army-unit', removeUnitRequest);
    } catch (e) {
      console.warn('Oops! There was an error trying to disband an Army unit!');
      console.warn(e);
    }
  };


  if (props.unit.unitType && fullUnitInfo) {
    return (
      <div className='army-unit-container sidebar-unit-text'>
        <Row noGutters>
          <Col md={2}>
            <img
              src={props.unit.unitType + '_ICON.svg'}
              onError={(e)=>e.target.src='shield.svg'}
              alt=""
              className='unit-icon'/>
          </Col>
          <Col md={8}>
            {fullUnitInfo.displayName} ({
              props.unit.currentHealth}/{props.unit
                .maxHealth} <span><img
              src={'health.svg'}
              alt=""
              className={'black-health-icon'}
            /></span>) {
            fullUnitInfo.tier === 3 ? (
              <span><img
                src={'hero_unit_icon.svg'}
                alt=""
                className={'black-hero-unit-icon'}
              /></span>
            ) : null}
          </Col>
          <Col md={2}>
            {props.showRemoveUnit ? (
            <Button
              variant='outline-danger'
              onClick={removeUnitHandler}
              disabled={!props.isOwnTurn}>
                            x
            </Button>
            ) : null}

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
    selectedTilePosition: state.gameBoardView.selectedTilePosition,
  };
};

ArmyUnitItem.propTypes = {
  unit: PropTypes.any,
  discardingIndex: PropTypes.number,
  gameId: PropTypes.string,
  allUnits: PropTypes.any,
  isOwnTurn: PropTypes.bool,
  selectedTilePosition: PropTypes.number,
  showRemoveUnit: PropTypes.bool,
};

export default connect(mapStateToProps)(ArmyUnitItem);

