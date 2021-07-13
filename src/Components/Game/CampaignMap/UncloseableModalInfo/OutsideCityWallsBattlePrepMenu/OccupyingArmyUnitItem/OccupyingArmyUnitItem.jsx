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
import './OccupyingArmyUnitItem.css';

/**
 *
 * OccupyingArmyUnitItem
 * JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const OccupyingArmyUnitItem = (props) => {
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

    const updatedOccupyingArmy = {...props.occupyingArmy};
    const updatedOccupyingArmyUnits = [...updatedOccupyingArmy.units];
    updatedOccupyingArmyUnits.splice(props.unitIndex, 1);
    updatedOccupyingArmy.units = updatedOccupyingArmyUnits;

    props.updateSallyOutForces(updatedSallyOutForces);
    props.updateOccupyingArmy(updatedOccupyingArmy);
    props.updateExcessDefenders(props.excessDefenders - 1);
  };

  const moveToUnassignedUnits = (e) => {
    e.preventDefault();
    const updatedCityUnderAttack = {...props.cityUnderAttack};
    updatedCityUnderAttack.unassignedUnits.push(props.unit);

    const updatedOccupyingArmy = {...props.occupyingArmy};
    const updatedOccupyingArmyUnits = [...updatedOccupyingArmy.units];
    updatedOccupyingArmyUnits.splice(props.unitIndex, 1);
    updatedOccupyingArmy.units = updatedOccupyingArmyUnits;

    props.updateCityUnderAttack(updatedCityUnderAttack);
    props.updateOccupyingArmy(updatedOccupyingArmy);
  };

  if (fullUnitInfo) {
    return (
      <div className='outside-city-walls-occupying-unit-container'>
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
              onError={(e)=>e.target.src='shield.svg'}
              alt=""
              className='occupying-unit-icon'/>
          </Col>
          <Col md={6}>
            {fullUnitInfo.displayName} ({
              props.unit.currentHealth}/{props.unit
                .maxHealth} <span><img
              src={'health.svg'}
              alt=""
              className={'occupying-unit-tiny-health-icon'}
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
            <Button
              variant='secondary'
              onClick={moveToUnassignedUnits}
              disabled={props.cityUnderAttack.unassignedUnits.length >=
              props.maxArmySize}>
                            Ʌ
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

OccupyingArmyUnitItem.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(
    OccupyingArmyUnitItem);

