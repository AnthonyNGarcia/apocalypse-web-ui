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
import battleViewAC from
  '../../../../../Redux/actionCreators/battleViewActionCreators';
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
        gameId: props.gameId,
        playerSubmittingAction: props.ownPlayerNumber,
        unitActionType: UNIT_ACTION_TYPES.SKIP,
        indexOfUnitPerformingAction: props.selectedBattleUnitIndex,
        indexOfTargetUnitOfAction: -1,
      };
      axios.post(apiEndpoints.battleController + '/skip', skipTurnRequest);
    } catch (e) {
      console.warn('There was an error trying to skip turn!');
      console.warn(e);
    }
  };

  const activeAbilityHandler = (e) => {
    e.preventDefault();
    try {
      props.updateSelectedBattleUnitIndex(-1);
      const initiateActiveAbilityRequest = {
        gameId: props.gameId,
        playerSubmittingAction: props.ownPlayerNumber,
        unitActionType: UNIT_ACTION_TYPES.ACTIVE_ABILITY,
        indexOfUnitPerformingAction: props.selectedBattleUnitIndex,
        indexOfTargetUnitOfAction: -1,
      };
      axios.post(apiEndpoints.battleController +
        '/active-ability', initiateActiveAbilityRequest);
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
          <Row noGutters style={{display: 'block', textAlign: 'center',
            margin: 'auto'}}>
            <h2>{fullUnitInfo.displayName}</h2>
            <h4>{UNIT_CLASSES[selectedUnit.unitClass].displayName}</h4>
          </Row>
          {/* Unit Image */}
          <Row noGutters style={{width: '100%', height: '20vh',
            display: 'block'}}>
            <img
              src={selectedUnit.unitType + '.svg'}
              onError={(e)=>e.target.src='shield.svg'}
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
                selectedUnit.maxHealth}
              </span>
            </Col>
            <Col>
              <span>
                <img
                  src={'armor.svg'}
                  alt=""
                  className={'tiny-hammer-icon'}
                />
                {' ' + selectedUnit.armor}
              </span>
            </Col>
            <Col>
              <span>
                <img
                  src={'damage.svg'}
                  alt=""
                  className={'tiny-hammer-icon'}
                />
                {' ' + (selectedUnit.damage)}
              </span>
            </Col>
          </Row>
          {/* Passive Abilities*/}
          <Row noGutters style={{margin: 'auto', textAlign: 'center'}}>
            <h6>Passive Abilities:
              {selectedUnit.passiveAbilities &&
                    selectedUnit.passiveAbilities.length > 0 ?
                    selectedUnit.passiveAbilities.map((passive, index) => (
                      <span key={passive.passiveAbilityType + index}>
                        {index === 0 ? ' ' :
                        index < selectedUnit.passiveAbilities.length ?
                          ', ' : null}
                        <PassiveAbilityItem
                          passiveAbility={passive}/>
                      </span>
                    )) : ' None'}
            </h6>
          </Row>
          {/* Active Ability */}
          <Row noGutters style={{margin: 'auto'}}>
            {selectedUnit.activeAbility ? (
              <React.Fragment>
                <h6 style={{margin: 'auto', textAlign: 'center'}}>
              Active Ability: {props.allActiveAbilities[
                      selectedUnit.activeAbility.activeAbilityType]
                      .displayName} - {
                    selectedUnit.currentActiveAbilityCharges} charge(s)</h6>
                <p>{props.allActiveAbilities[
                    selectedUnit.activeAbility.activeAbilityType]
                    .descriptionFragments.map((fragment, index) => (
                      <span key={fragment + index}>
                        {fragment +
                      (selectedUnit.activeAbility.abilityValues[index] ?
                        selectedUnit.activeAbility.abilityValues[index] :
                        '')}
                      </span>
                    ))}</p>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <h6 style={{margin: 'auto', textAlign: 'center'}}>
                  This unit has no active ability.
                </h6>
              </React.Fragment>
            )}
          </Row>
          {/* Action Buttons */}
          <Row style={{width: '90%', marginBottom: '2vh'}}>
            {/* Skip Button */}
            <Col md={6}>
              <Button disabled={!props.isOwnTurn ||
              !selectedUnit.eligibleForCommand ||
              !props.showEnemyArmyInBattle}
              onClick={skipTurnHandler}>Skip Turn</Button>
            </Col>
            {/* Active Ability Button */}
            {selectedUnit.activeAbility ? (
              <React.Fragment>
                <Col md={6}>
                  <Button disabled={!props.isOwnTurn ||
              !selectedUnit.eligibleForCommand ||
              !props.showEnemyArmyInBattle ||
              selectedUnit.currentActiveAbilityCharges <= 0 ||
              true}
                  onClick={activeAbilityHandler}>
                    {props.allActiveAbilities[
                        selectedUnit.activeAbility.activeAbilityType]
                        .displayName}
                  </Button>
                </Col>
              </React.Fragment>
            ) : null }
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
    selectedBattleUnitIndex: state.battleView.selectedBattleUnitIndex,
    battleData: state.battleView.battleData,
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
    allActiveAbilities: state.game.gameConstants.allActiveAbilities,
    isOwnTurn: state.battleView.battleData ?
      state.battleView.battleData.playerWhoseTurnItIs ===
      state.gamePlayer.ownPlayerNumber : false,
    showEnemyArmyInBattle: state.battleView.showEnemyArmyInBattle,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSelectedBattleUnitIndex: (selectedBattleUnitIndex) => dispatch(
        battleViewAC.setSelectedBattleUnitIndex(selectedBattleUnitIndex)),
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

