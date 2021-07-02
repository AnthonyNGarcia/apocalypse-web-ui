import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import battleViewAC from
  '../../../../../Redux/actionCreators/battleViewActionCreators';
import apiEndpoints from '../../../../Utilities/apiEndpoints';
import axios from 'axios';
import UNIT_ACTION_TYPES from '../../../../Utilities/unitActionTypes';
import './ArmyUnit.css';

/**
 *
 * ArmyUnit JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const ArmyUnit = (props) => {
  const [ownArmy, setOwnArmy] = useState(null);
  const [unitImageClasses, setUnitImageClasses] = useState('');
  const [currentlySelectedOwnUnit, setCurrentlySelectedOwnUnit] =
    useState(null);

  useEffect( () => {
    if (props.unit && props.unit.unitType) {
      let calculatedUnitClasses = 'army-unit-image';
      if (props.ownUnit) {
        calculatedUnitClasses += ' own-unit-image';
        if (props.selectedBattleUnitIndex === props.unitIndex) {
          calculatedUnitClasses += ' own-selected-unit';
        }
      } else {
        calculatedUnitClasses += ' enemy-unit-image';
        if (currentlySelectedOwnUnit &&
            currentlySelectedOwnUnit.eligibleForCommand &&
            props.unit.isTargetable) {
          calculatedUnitClasses += ' targetable-enemy-unit';
        }
      }
      if (props.unit.isTapped) {
        calculatedUnitClasses += ' unit-is-tapped';
      }
      if (props.unit.eligibleForCommand) {
        calculatedUnitClasses += ' unit-eligible-for-command';
      }
      setUnitImageClasses(calculatedUnitClasses);
    }
    if (props.battleData) {
      const attackingArmy = props.battleData.attackingArmy;
      const defendingArmy = props.battleData.defendingArmy;
      let freshOwnArmy;
      if (attackingArmy.owner === props.ownPlayerNumber) {
        freshOwnArmy = attackingArmy;
        setOwnArmy(freshOwnArmy);
      } else {
        freshOwnArmy = defendingArmy;
        setOwnArmy(freshOwnArmy);
      }
      if (props.selectedBattleUnitIndex >= 0) {
        const freshCurrentlySelectedOwnUnit =
          freshOwnArmy.units[props.selectedBattleUnitIndex];
        setCurrentlySelectedOwnUnit(freshCurrentlySelectedOwnUnit);
      } else {
        setCurrentlySelectedOwnUnit(null);
      }
    }
  }, [props, currentlySelectedOwnUnit]);

  const selectOwnUnitHandler = async (e, justSelectedUnitIndex) => {
    e.preventDefault();
    if (!props.ownArmySubmitted) {
      // Assuming we are still configuring
      const unitAtJustSelectedUnitIndex = ownArmy.units[justSelectedUnitIndex];
      if (props.selectedBattleUnitIndex >= 0) {
        // We had a unit selected previously, so swap with them
        const unitPreviouslySelected = ownArmy.units[
            props.selectedBattleUnitIndex];
        const battleDataWithUnitsSwapped = await JSON.parse(
            JSON.stringify(props.battleData));
        if (battleDataWithUnitsSwapped.attackingArmy.owner ===
          props.ownPlayerNumber) {
          battleDataWithUnitsSwapped.attackingArmy.units[
              justSelectedUnitIndex] = unitPreviouslySelected;
          battleDataWithUnitsSwapped.attackingArmy.units[
              props.selectedBattleUnitIndex] = unitAtJustSelectedUnitIndex;
        } else {
          battleDataWithUnitsSwapped.defendingArmy.units[
              justSelectedUnitIndex] = unitPreviouslySelected;
          battleDataWithUnitsSwapped.defendingArmy.units[
              props.selectedBattleUnitIndex] = unitAtJustSelectedUnitIndex;
        }
        // Now unselect, so we don't accidentally swap again
        props.updateSelectedBattleUnitIndex(-1);
        props.updateBattleData(battleDataWithUnitsSwapped);
      } else {
        // We just selected a unit for the first time, so do nothing special
        props.updateSelectedBattleUnitIndex(justSelectedUnitIndex);
      }
    } else {
      // Update the selected unit index for giving unit details on the sidebar
      if (props.selectedBattleUnitIndex === justSelectedUnitIndex) {
        props.updateSelectedBattleUnitIndex(-1);
      } else {
        props.updateSelectedBattleUnitIndex(justSelectedUnitIndex);
      }
    }
  };

  const selectEnemyUnitHandler = (e, justSelectedUnitIndex) => {
    e.preventDefault();
    console.log('Just selected an enemy unit at index ' +
      justSelectedUnitIndex);
    if (props.battleData.playerWhoseTurnItIs !== props.ownPlayerNumber) {
      console.log('Cannot do anything, not this player\'s turn!');
      return;
    }
    if (!currentlySelectedOwnUnit) {
      console.log('Cannot do anything, currently selected ' +
        'own unit doesn\'t exist!');
      return;
    }
    if (!currentlySelectedOwnUnit.eligibleForCommand) {
      console.log('Cannot do anything, currently selected ' +
        'own unit is not eligible for commands!');
      return;
    }
    if (!props.unit.isTargetable) {
      console.log('Cannot do anything, enemy is not targetable!');
      return;
    }
    try {
      props.updateSelectedBattleUnitIndex(-1);
      const attackTargetRequest = {
        gameId: props.gameId,
        playerSubmittingAction: props.ownPlayerNumber,
        unitActionType: UNIT_ACTION_TYPES.ATTACK,
        indexOfUnitPerformingAction: props.selectedBattleUnitIndex,
        indexOfTargetUnitOfAction: props.unitIndex,
      };
      axios.post(apiEndpoints.battleController +
        '/attack', attackTargetRequest);
    } catch (e) {
      console.warn('There was an error trying to attack a target!');
      console.warn(e);
    }
  };

  if (!props.ownUnit && !props.showEnemyArmyInBattle) {
    return (
      <React.Fragment>
        <Row style={{height: '2.5vh'}} noGutters>
          <p className='army-unit-image empty-unit-image'
            style={{width: '1.5vw'}}></p>
        </Row>
      </React.Fragment>
    );
  }

  if (props.unit) {
    return (
      <React.Fragment>
        {/* First row is the unit image */}
        <Row style={{height: '5vh'}} noGutters
          onClick={props.ownUnit ?
            (e) => selectOwnUnitHandler(e, props.unitIndex) :
            (e) => selectEnemyUnitHandler(e, props.unitIndex)}
        >
          <img
            src={props.unit.unitType + '_ICON.svg'}
            onError={(e)=>e.target.src='shield.png'}
            alt=""
            className={unitImageClasses}
          />
        </Row>
        <div className='unit-labels-container'>
          {/* Second row is the unit name + health */}
          <Row style={{height: '2vh'}} noGutters>
            <p className='unit-label'>
              {
                props.unit.currentHealth}/{props.unit
                  .maxHealth} <span><img
                src={'health.svg'}
                alt=""
                className={'tiny-hammer-icon'}
              /></span>
            </p>
          </Row>
          {/* Third row is the unit Block, if they have any */}
          {props.unit.activeBlock > 0 ? (
          <Row>
            <p className='unit-label'>
              {props.unit.activeBlock} <span><img
                src={'active_block.svg'}
                alt=""
                className={'tiny-hammer-icon'}
              /></span>
            </p>
          </Row>
          ) : null}
          {/* Third row is the unit debuff, if they have any */}
          {props.unit.currentDebuffs && props.unit.currentDebuffs.length > 0 ?
          props.unit.currentDebuffs.map((debuff, index) => (
            <Row key={debuff.debuffType + '-' + index}>
              <p className='unit-label'>
                {debuff.value} <span><img
                  src={'poison_debuff.svg'}
                  alt=""
                  className={'tiny-hammer-icon'}
                /></span>
              </p>
            </Row>
          )) : null}
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Row style={{height: '2.5vh'}} noGutters
          onClick={props.ownUnit ?
            (e) => selectOwnUnitHandler(e, props.unitIndex) : null}>
          <p className='army-unit-image empty-unit-image'
            style={{width: '1.5vw'}}></p>
        </Row>
      </React.Fragment>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    allUnits: state.game.gameConstants.allUnits,
    showEnemyArmyInBattle: state.battleView.showEnemyArmyInBattle,
    selectedBattleUnitIndex: state.battleView.selectedBattleUnitIndex,
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
    battleData: state.battleView.battleData,
    ownArmySubmitted: state.battleView.ownArmySubmitted,
    gameId: state.game.gameId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSelectedBattleUnitIndex: (selectedBattleUnitIndex) => dispatch(
        battleViewAC.setSelectedBattleUnitIndex(selectedBattleUnitIndex)),
    updateBattleData: (battleData) => dispatch(
        battleViewAC.setBattleData(battleData)),
  };
};

ArmyUnit.propTypes = {
  unit: PropTypes.any,
  allUnits: PropTypes.any,
  ownUnit: PropTypes.bool,
  showEnemyArmyInBattle: PropTypes.bool,
  unitIndex: PropTypes.number,
  battleData: PropTypes.any,
  ownPlayerNumber: PropTypes.string,
  updateSelectedBattleUnitIndex: PropTypes.func,
  selectedBattleUnitIndex: PropTypes.number,
  updateBattleData: PropTypes.func,
  ownArmySubmitted: PropTypes.bool,
  gameId: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArmyUnit);
