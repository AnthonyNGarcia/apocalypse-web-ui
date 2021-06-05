import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PassiveAbilityItem from './PassiveAbilityItem/PassiveAbilityItem';
import UNIT_CLASSES from '../../../../../../Utilities/unitClasses';
import './SelectedUnitDetails.css';

/**
 *
 * SelectedUnitDetails JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const SelectedUnitDetails = (props) => {
  const [fullUnitInfo, setFullUnitInfo] = useState(null);

  useEffect(() => {
    if (props.unitType) {
      setFullUnitInfo(props.allUnits[props.unitType]);
    }
  }, [props]);

  if (fullUnitInfo) {
    return (
      <React.Fragment>
        <Row>
          <h5>{fullUnitInfo.displayName} ({
            fullUnitInfo.productionCost} <span><img
            src={'hammer.png'}
            alt=""
            className={'tiny-hammer-icon'}
          /></span>, {fullUnitInfo.turnsToTrain} <span><img
            src={'timer.png'}
            alt=""
            className={'tiny-timer-icon'}
          /></span>) - Tier {fullUnitInfo.tier}</h5>
        </Row>
        {/* Second row is the unit description and stats */}
        <Row>
          {/* First col is the image */}
          <Col md={2}>
            <img
              src={fullUnitInfo.unitType + '.svg'}
              onError={(e)=>e.target.src='shield.png'}
              alt=""
              className='unit-image'/>
          </Col>
          {/*  Second col is all the text */}
          <Col md={10}>
            <Row noGutters>
              <p>{fullUnitInfo.description}</p>
            </Row>
            {/* Unit Stats */}
            <Row>
              <ul>
                <li>
                  <span className='unit-stat-title'>Class:</span> {
                    UNIT_CLASSES[fullUnitInfo.unitClass].displayName}
                </li>
                <li>
                  <span className='unit-stat-title'>Health:</span> {
                    fullUnitInfo.baseMaxHealth}
                </li>
                <li>
                  <span className='unit-stat-title'>Armor:</span> {
                    fullUnitInfo.baseArmor}
                </li>
                <li>
                  <span className='unit-stat-title'>Damage:</span> {
                    fullUnitInfo.baseDamage}
                </li>
              </ul>
            </Row>
          </Col>
        </Row>
        {/* Passive Abilities*/}
        <Row>
          <h5>Passive Abilities:
            {fullUnitInfo.basePassiveAbilities &&
                    fullUnitInfo.basePassiveAbilities.length > 0 ?
                    fullUnitInfo.basePassiveAbilities.map((passive, index) => (
                      <span key={passive.passiveAbilityType + index}>
                        {index === 0 ? ' ' :
                        index < fullUnitInfo.basePassiveAbilities.length ?
                          ', ' : null}
                        <PassiveAbilityItem
                          passiveAbility={passive}/>
                      </span>
                    )) : ' None'}
          </h5>
        </Row>
        {/* Active Ability */}
        <Row>
          <h5>Active Ability: {props.allActiveAbilities[
              fullUnitInfo.baseActiveAbility.activeAbilityType]
              .displayName} - {
            fullUnitInfo.baseActiveAbilityCharges} charge(s)</h5>
          <p>{props.allActiveAbilities[
              fullUnitInfo.baseActiveAbility.activeAbilityType]
              .descriptionFragments.map((fragment, index) => (
                <span key={fragment + index}>
                  {fragment +
                      (fullUnitInfo.baseActiveAbility.abilityValues[index] ?
                        fullUnitInfo.baseActiveAbility.abilityValues[index] :
                        '')}
                </span>
              ))}</p>
        </Row>
      </React.Fragment>
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
    unitType: state.game.cityMenuSupplementalData,
    allUnits: state.game.gameConstants.allUnits,
    allActiveAbilities: state.game.gameConstants.allActiveAbilities,
  };
};

SelectedUnitDetails.propTypes = {
  unitType: PropTypes.string,
  allUnits: PropTypes.any,
  allActiveAbilities: PropTypes.any,
};

export default connect(mapStateToProps)(SelectedUnitDetails);

