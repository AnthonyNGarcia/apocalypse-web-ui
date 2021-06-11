import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/esm/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// eslint-disable-next-line max-len
import PassiveAbilityItem from '../../../CampaignMap/AdvancedDetailsModalInfo/CityMenu/CitySupplementalInfoBox/SelectedUnitDetails/PassiveAbilityItem/PassiveAbilityItem';
import UNIT_CLASSES from '../../../../Utilities/unitClasses';
import './BattleUnitDetails.css';

/**
 *
 * BattleUnitDetails JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const BattleUnitDetails = (props) => {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [fullUnitInfo, setFullUnitInfo] = useState(null);

  useEffect(() => {
    if (props.battleData) {
      if (props.selectedBattleUnitIndex < 0) {
        setSelectedUnit(null);
        setFullUnitInfo(null);
        return;
      }
      if (props.battleData.attackingArmy.owner === props.ownPlayerNumber) {
        const freshSelectedUnit = props.battleData
            .attackingArmy.units[props.selectedBattleUnitIndex];
        setSelectedUnit(freshSelectedUnit);
        const freshFullUnitData = props.allUnits[freshSelectedUnit.unitType];
        setFullUnitInfo(freshFullUnitData);
      } else {
        const freshSelectedUnit = props.battleData
            .defendingArmy.units[props.selectedBattleUnitIndex];
        setSelectedUnit(freshSelectedUnit);
        const freshFullUnitData = props.allUnits[freshSelectedUnit.unitType];
        setFullUnitInfo(freshFullUnitData);
      }
    }
  }, [props]);

  if (props.battleData) {
    if (fullUnitInfo && selectedUnit) {
      return (
        <React.Fragment>
          {/* Unit Name and Tier */}
          <Row noGutters style={{display: 'block'}}>
            <h1>{fullUnitInfo.displayName}</h1>
            <h3>{UNIT_CLASSES[fullUnitInfo.unitClass].displayName}</h3>
          </Row>
          {/* Unit Image */}
          <Row noGutters style={{width: '100%', height: '20vh',
            display: 'block'}}>
            <img
              src={fullUnitInfo.unitType + '.svg'}
              onError={(e)=>e.target.src='shield.png'}
              alt=""
              className='unit-details-image'/>
          </Row>
          <Row noGutters style={{width: '100%', textAlign: 'center',
            fontWeight: 'bold', marginBottom: '2vh'}}>
            <Col>
              <span>
                <img
                  src={'health.svg'}
                  alt=""
                  className={'tiny-hammer-icon'}
                />
                {' ' + selectedUnit.currentHealth + '/' +
                fullUnitInfo.baseMaxHealth}
              </span>
            </Col>
            <Col>
              <span>
                <img
                  src={'armor.svg'}
                  alt=""
                  className={'tiny-hammer-icon'}
                />
                {' ' + fullUnitInfo.baseArmor}
              </span>
            </Col>
            <Col>
              <span>
                <img
                  src={'damage.svg'}
                  alt=""
                  className={'tiny-hammer-icon'}
                />
                {' ' + (fullUnitInfo.baseDamage)}
              </span>
            </Col>
          </Row>
          {/* Passive Abilities*/}
          <Row noGutters style={{'width': '90%', 'maxWidth': '90%'}}>
            <h6>Passive Abilities:
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
            </h6>
          </Row>
          {/* Active Ability */}
          <Row noGutters style={{'width': '90%', 'maxWidth': '90%'}}>
            <h6>Active Ability: {props.allActiveAbilities[
                fullUnitInfo.baseActiveAbility.activeAbilityType]
                .displayName} - {
              fullUnitInfo.baseActiveAbilityCharges} charge(s)</h6>
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
          <p>Select a unit to see more details.</p>
        </React.Fragment>
      );
    }
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
    selectedBattleUnitIndex: state.game.selectedBattleUnitIndex,
    battleData: state.game.battleData,
    ownPlayerNumber: state.game.ownPlayerNumber,
    allActiveAbilities: state.game.gameConstants.allActiveAbilities,
  };
};

BattleUnitDetails.propTypes = {
  allUnits: PropTypes.any,
  battleData: PropTypes.any,
  selectedBattleUnitIndex: PropTypes.number,
  ownPlayerNumber: PropTypes.string,
  allActiveAbilities: PropTypes.any,
};

export default connect(mapStateToProps)(BattleUnitDetails);

