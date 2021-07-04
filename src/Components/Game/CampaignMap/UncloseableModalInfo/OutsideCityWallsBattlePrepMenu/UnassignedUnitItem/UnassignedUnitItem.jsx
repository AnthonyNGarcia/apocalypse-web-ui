import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/esm/Spinner';
import outsideCityWallsBattleAC from
  '../../../../../../Redux/actionCreators/outsideCityWallsBattleActionCreators';
import PLAYER from '../../../../../Utilities/playerEnums';
import './UnassignedUnitItem.css';

/**
 *
 * UnassignedUnitItem
 * JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const UnassignedUnitItem = (props) => {
  const [fullUnitInfo, setFullUnitInfo] = useState(null);

  useEffect( () => {
    if (props.unit && props.unit.unitType) {
      const freshFullUnitInfo = props.allUnits[props.unit.unitType];
      setFullUnitInfo(freshFullUnitInfo);
    }
  }, [props]);

  const moveToSallyOutForces = (e) => {
    e.preventDefault();
    const updatedSallyOutForces = {...props.sallyOutForces};
    updatedSallyOutForces.units.push(props.unit);

    const updatedCityUnderAttack = {...props.cityUnderAttack};
    const updatedUnassignedUnits = [...updatedCityUnderAttack.unassignedUnits];
    updatedUnassignedUnits.splice(props.unitIndex, 1);
    updatedCityUnderAttack.unassignedUnits = updatedUnassignedUnits;

    props.updateSallyOutForces(updatedSallyOutForces);
    props.updateCityUnderAttack(updatedCityUnderAttack);
    props.updateExcessDefenders(props.excessDefenders - 1);
  };

  const moveToOccupyingArmy = (e) => {
    e.preventDefault();
    const updatedOccupyingArmy = {...props.occupyingArmy};
    updatedOccupyingArmy.units.push(props.unit);

    const updatedCityUnderAttack = {...props.cityUnderAttack};
    const updatedUnassignedUnits = [...updatedCityUnderAttack.unassignedUnits];
    updatedUnassignedUnits.splice(props.unitIndex, 1);
    updatedCityUnderAttack.unassignedUnits = updatedUnassignedUnits;

    props.updateOccupyingArmy(updatedOccupyingArmy);
    props.updateCityUnderAttack(updatedCityUnderAttack);
  };

  if (fullUnitInfo) {
    return (
      <div className='outside-city-walls-unassigned-unit-container'>
        <Row noGutters>
          <Col md={2}>
            <Button
              variant='secondary'
              onClick={moveToSallyOutForces}
              disabled={props.sallyOutForces.units.length >=
                props.maxArmySize}>
              {'<'}
            </Button>
          </Col>
          <Col md={2}>
            <img
              src={props.unit.unitType + '_ICON.svg'}
              onError={(e)=>e.target.src='shield.png'}
              alt=""
              className='outsite-city-walls-unassigned-unit-icon'/>
          </Col>
          <Col md={6}>
            {fullUnitInfo.displayName} ({
              props.unit.currentHealth}/{props.unit
                .maxHealth} <span><img
              src={'health.svg'}
              alt=""
              className={'outside-city-walls-unassigned-unit-tiny-health-icon'}
            /></span>)
          </Col>
          <Col md={2}>
            <Button
              variant='secondary'
              onClick={moveToOccupyingArmy}
              disabled={!props.occupyingArmy ||
              !props.occupyingArmy.commander ||
              props.occupyingArmy.units.length >=
              props.maxArmySize}>
                            V
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
    allUnits: state.game.gameConstants.allUnits,
    cityUnderAttack: state.outsideCityWallsBattle.cityUnderAttack,
    sallyOutForces: state.outsideCityWallsBattle.sallyOutForces,
    excessDefenders: state.outsideCityWallsBattle.excessDefenders,
    occupyingArmy: state.outsideCityWallsBattle.occupyingArmy,
    maxArmySize: state.gamePlayer.ownPlayerNumber === PLAYER.ONE ?
      state.gamePlayer.playerOne.currentBaseArmySize :
      state.gamePlayer.playerTwo.currentBaseArmySize,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCityUnderAttack: (cityUnderAttack) => dispatch(
        outsideCityWallsBattleAC.setCityUnderAttack(cityUnderAttack)),
    updateSallyOutForces: (sallyOutForces) => dispatch(
        outsideCityWallsBattleAC.setSallyOutForces(sallyOutForces)),
    updateExcessDefenders: (excessDefenders) => dispatch(
        outsideCityWallsBattleAC.setExcessDefenders(excessDefenders)),
    updateOccupyingArmy: (occupyingArmy) => dispatch(
        outsideCityWallsBattleAC.setOccupyingArmy(occupyingArmy)),
  };
};

UnassignedUnitItem.propTypes = {
  unit: PropTypes.any,
  unitIndex: PropTypes.number,
  allUnits: PropTypes.any,
  cityUnderAttack: PropTypes.any,
  sallyOutForces: PropTypes.any,
  excessDefenders: PropTypes.number,
  occupyingArmy: PropTypes.any,
  updateCityUnderAttack: PropTypes.func,
  updateSallyOutForces: PropTypes.func,
  updateExcessDefenders: PropTypes.func,
  updateOccupyingArmy: PropTypes.func,
  maxArmySize: PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(UnassignedUnitItem);

