import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/esm/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/esm/Button';
// eslint-disable-next-line max-len
import PassiveAbilityItem from '../../../CampaignMap/AdvancedDetailsModalInfo/CityMenu/CitySupplementalInfoBox/SelectedUnitDetails/PassiveAbilityItem/PassiveAbilityItem';
import UNIT_CLASSES from '../../../../Utilities/unitClasses';
import apiEndpoints from '../../../../Utilities/apiEndpoints';
import axios from 'axios';
import UNIT_ACTION_TYPES from '../../../../Utilities/unitActionTypes';
import gameAC from '../../../../../Redux/actionCreators/gameActionCreators';
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
        if (freshSelectedUnit) {
          const freshFullUnitData = props.allUnits[freshSelectedUnit.unitType];
          setFullUnitInfo(freshFullUnitData);
        }
      } else {
        const freshSelectedUnit = props.battleData
            .defendingArmy.units[props.selectedBattleUnitIndex];
        setSelectedUnit(freshSelectedUnit);
        if (freshSelectedUnit) {
          const freshFullUnitData = props.allUnits[freshSelectedUnit.unitType];
          setFullUnitInfo(freshFullUnitData);
        }
      }
    }
  }, [props]);

  const skipTurnHandler = (e) => {
    e.preventDefault();
    try {
      props.updateSelectedBattleUnitIndex(-1);
      const skipTurnRequest = {
        playerSubmittingAction: props.ownPlayerNumber,
        unitActionType: UNIT_ACTION_TYPES.SKIP,
        indexOfUnitPerformingAction: props.selectedBattleUnitIndex,
        indexOfTargetUnitOfAction: -1,
      };
      axios.post(apiEndpoints.gameController + '/in-memory-battle-skip-turn/' +
        props.gameId, skipTurnRequest);
    } catch (e) {
      console.warn('There was an error trying to skip turn!');
      console.warn(e);
    }
  };

  const activeAbilityHandler = (e) => {
    e.preventDefault();
    console.log('using active ability...');
    try {
      props.updateSelectedBattleUnitIndex(-1);
      const initiateActiveAbilityRequest = {
        playerSubmittingAction: props.ownPlayerNumber,
        unitActionType: UNIT_ACTION_TYPES.ACTIVE_ABILITY,
        indexOfUnitPerformingAction: props.selectedBattleUnitIndex,
        indexOfTargetUnitOfAction: -1,
      };
      axios.post(apiEndpoints.gameController +
        '/in-memory-battle-initiate-active-ability/' +
        props.gameId, initiateActiveAbilityRequest);
    } catch (e) {
      console.warn('There was an error trying to initiate active ability!');
      console.warn(e);
    }
  };

  if (props.battleData) {
    if (fullUnitInfo && selectedUnit) {
      return (
        <React.Fragment>
          {/* Unit Name and Tier */}
          <Row noGutters style={{display: 'block'}}>
            <h2>{fullUnitInfo.displayName}</h2>
            <h4>{UNIT_CLASSES[fullUnitInfo.unitClass].displayName}</h4>
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
          {/* Action Buttons */}
          <Row style={{width: '90%', marginBottom: '2vh'}}>
            {/* Skip Button */}
            <Col md={6}>
              <Button disabled={!props.isOwnTurn ||
              !selectedUnit.eligibleForCommand || !props.showEnemyArmyInBattle}
              onClick={skipTurnHandler}>Skip Turn</Button>
            </Col>
            {/* Active Ability Button */}
            <Col md={6}>
              <Button disabled={!props.isOwnTurn ||
              !selectedUnit.eligibleForCommand ||
              !props.showEnemyArmyInBattle ||
              fullUnitInfo.currentActiveAbilityCharges <= 0}
              onClick={activeAbilityHandler}>
                {props.allActiveAbilities[
                    fullUnitInfo.baseActiveAbility.activeAbilityType]
                    .displayName}
              </Button>
            </Col>
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
    gameId: state.game.gameId,
    allUnits: state.game.gameConstants.allUnits,
    selectedBattleUnitIndex: state.game.selectedBattleUnitIndex,
    battleData: state.game.battleData,
    ownPlayerNumber: state.game.ownPlayerNumber,
    allActiveAbilities: state.game.gameConstants.allActiveAbilities,
    isOwnTurn: state.game.battleData ?
      state.game.battleData.playerWhoseTurnItIs ===
      state.game.ownPlayerNumber : false,
    showEnemyArmyInBattle: state.game.showEnemyArmyInBattle,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSelectedBattleUnitIndex: (selectedBattleUnitIndex) => dispatch(
        gameAC.setSelectedBattleUnitIndex(selectedBattleUnitIndex)),
  };
};

BattleUnitDetails.propTypes = {
  gameId: PropTypes.string,
  allUnits: PropTypes.any,
  battleData: PropTypes.any,
  selectedBattleUnitIndex: PropTypes.number,
  ownPlayerNumber: PropTypes.string,
  allActiveAbilities: PropTypes.any,
  isOwnTurn: PropTypes.bool,
  showEnemyArmyInBattle: PropTypes.bool,
  updateSelectedBattleUnitIndex: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(BattleUnitDetails);

