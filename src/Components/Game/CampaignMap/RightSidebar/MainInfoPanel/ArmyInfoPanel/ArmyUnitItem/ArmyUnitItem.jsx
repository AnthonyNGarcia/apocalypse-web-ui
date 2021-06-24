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

  const removeUnitHandler = async (e) => {
    e.preventDefault();
    try {
      const removeUnitRequest = {
        gameId: props.gameId,
        tilePosition: props.selectedTilePosition,
        unitIndex: props.discardingIndex,
      };
      console.log(await axios.patch(
          apiEndpoints.armyController +
          '/disband-army-unit', removeUnitRequest));
    } catch (e) {
      console.warn('Oops! There was an error trying to disband an Army unit!');
      console.warn(e);
    }
  };


  if (props.unit.unitType && fullUnitInfo) {
    return (
      <div className='army-unit-container sidebar-unit-text'>
        <Row>
          <Col md={1}>
            <img
              src={fullUnitInfo.unitType + '_ICON.svg'}
              onError={(e)=>e.target.src='shield.png'}
              alt=""
              className='unit-icon'/>
          </Col>
          <Col md={8}>
            {fullUnitInfo.displayName} ({
              props.unit.currentHealth}/{fullUnitInfo
                .baseMaxHealth} <span><img
              src={'health.svg'}
              alt=""
              className={'tiny-hammer-icon'}
            /></span>)
          </Col>
          <Col md={1}>
            <Button
              variant='outline-danger'
              onClick={removeUnitHandler}
              disabled={!props.isOwnTurn}>
                x
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
    isOwnTurn: state.gamePlayer.ownPlayerNumber ===
      state.gamePlayer.playerWhoseTurnItIs,
    selectedTilePosition: state.game.selectedTilePosition,
  };
};

ArmyUnitItem.propTypes = {
  unit: PropTypes.any,
  discardingIndex: PropTypes.number,
  gameId: PropTypes.string,
  allUnits: PropTypes.any,
  isOwnTurn: PropTypes.bool,
  selectedTilePosition: PropTypes.number,
};

export default connect(mapStateToProps)(ArmyUnitItem);

