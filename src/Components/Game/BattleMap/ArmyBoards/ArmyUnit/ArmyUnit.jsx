import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import battleViewAC from
  '../../../../../Redux/actionCreators/battleViewActionCreators';
import apiEndpoints from '../../../../Utilities/apiEndpoints';
import axios from 'axios';
import UNIT_ACTION_TYPES from '../../../../Utilities/unitActionTypes';
import getIfFlanker from '../../../../Utilities/getIfFlanker';
import getIfStunned from '../../../../Utilities/getIfStunned';
import getIfCityWalls from '../../../../Utilities/getIfStructure';
import getIfInvisible from '../../../../Utilities/getIfInvisible';
import getIfPermastunned from '../../../../Utilities/getIfPermastunned';
import getIfConstricted from '../../../../Utilities/getIfConstricted';
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
      if (props.unit.eligibleForCommand) {
        calculatedUnitClasses += ' unit-eligible-for-command';
      }
      if (props.ownUnit) {
        calculatedUnitClasses += ' own-unit-image';
        if (props.selectedBattleUnitIndex === props.unitIndex) {
          calculatedUnitClasses += ' own-selected-unit';
        }
        if (props.unit.isTapped) {
          calculatedUnitClasses += ' unit-is-tapped';
        }
        if (props.activeAbilityTargetSelection == 'SINGLE_ALLY') {
          calculatedUnitClasses += ' targetable-ally-unit-for-ability';
        }
      } else {
        calculatedUnitClasses += ' enemy-unit-image';
        if (!props.unit.isTargetable && getIfInvisible(props.unit)) {
        } else if (currentlySelectedOwnUnit &&
            currentlySelectedOwnUnit.eligibleForCommand &&
            !getIfStunned(currentlySelectedOwnUnit) &&
            !getIfConstricted(currentlySelectedOwnUnit) &&
            !getIfPermastunned(currentlySelectedOwnUnit) &&
            !getIfCityWalls(currentlySelectedOwnUnit) &&
            (props.unit.isTargetable ||
              getIfFlanker(currentlySelectedOwnUnit))) {
          if (props.activeAbilityTargetSelection == 'NA') {
            calculatedUnitClasses += ' targetable-enemy-unit';
          } else if (props.activeAbilityTargetSelection == 'SINGLE_ENEMY' ||
              props.activeAbilityTargetSelection == 'MULTIPLE_ENEMIES') {
            calculatedUnitClasses += ' targetable-enemy-unit-for-ability';
          }
        } else if (props.unit.isTapped) {
          calculatedUnitClasses += ' unit-is-tapped';
        }
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
      // First check if we are casting an ability on an ally
      if (props.activeAbilityTargetSelection == 'SINGLE_ALLY') {
        const singleAllyAbilityRequest = {
          gameId: props.gameId,
          playerSubmittingAction: props.ownPlayerNumber,
          unitActionType: UNIT_ACTION_TYPES.ACTIVE_ABILITY,
          indexOfUnitPerformingAction: props.selectedBattleUnitIndex,
          indexOfSingleTargetAllyUnitOfAction: props.unitIndex,
        };
        props.clearUnitActionSelection();
        axios.post(apiEndpoints.battleController +
          '/active-ability', singleAllyAbilityRequest);
      } else {
        // Update the selected unit index for giving unit details on the sidebar
        props.clearUnitActionSelection();
        if (props.selectedBattleUnitIndex === justSelectedUnitIndex) {
          props.updateSelectedBattleUnitIndex(-1);
        } else {
          props.updateSelectedBattleUnitIndex(justSelectedUnitIndex);
        }
      }
    }
  };

  const selectEnemyUnitHandler = (e, justSelectedUnitIndex) => {
    e.preventDefault();
    if (props.battleData.playerWhoseTurnItIs !== props.ownPlayerNumber) {
      return;
    }
    if (!currentlySelectedOwnUnit) {
      return;
    }
    if (getIfStunned(currentlySelectedOwnUnit)) {
      return;
    }
    if (getIfPermastunned(currentlySelectedOwnUnit)) {
      return;
    }
    if (getIfConstricted(currentlySelectedOwnUnit)) {
      return;
    }
    if (getIfCityWalls(currentlySelectedOwnUnit)) {
      return;
    }
    if (!currentlySelectedOwnUnit.eligibleForCommand) {
      return;
    }
    if (!props.unit.isTargetable && getIfInvisible(props.unit)) {
      return;
    }
    if (!props.unit.isTargetable && !getIfFlanker(currentlySelectedOwnUnit)) {
      return;
    }
    try {
      switch (props.activeAbilityTargetSelection) {
        case 'NA':
          const attackTargetRequest = {
            gameId: props.gameId,
            playerSubmittingAction: props.ownPlayerNumber,
            unitActionType: UNIT_ACTION_TYPES.ATTACK,
            indexOfUnitPerformingAction: props.selectedBattleUnitIndex,
            indexOfSingleTargetEnemyUnitOfAction: props.unitIndex,
          };
          props.clearUnitActionSelection();
          axios.post(apiEndpoints.battleController +
            '/attack', attackTargetRequest);
          break;
        case 'SINGLE_ENEMY':
          const singleEnemyAbilityRequest = {
            gameId: props.gameId,
            playerSubmittingAction: props.ownPlayerNumber,
            unitActionType: UNIT_ACTION_TYPES.ACTIVE_ABILITY,
            indexOfUnitPerformingAction: props.selectedBattleUnitIndex,
            indexOfSingleTargetEnemyUnitOfAction: props.unitIndex,
          };
          props.clearUnitActionSelection();
          axios.post(apiEndpoints.battleController +
            '/active-ability', singleEnemyAbilityRequest);
          break;
        case 'MULTIPLE_ENEMIES':
          const newSelectedMultipleEnemyUnitIndices =
            [...props.selectedMultipleEnemyUnitIndices, props.unitIndex];
          const unitSelectionsRemaining =
            props.multipleEnemySelectionCountRemaining - 1;

          if (unitSelectionsRemaining <= 0) {
            const multipleEnemiesAbilityRequest = {
              gameId: props.gameId,
              playerSubmittingAction: props.ownPlayerNumber,
              unitActionType: UNIT_ACTION_TYPES.ACTIVE_ABILITY,
              indexOfUnitPerformingAction: props.selectedBattleUnitIndex,
              indexOfSingleTargetEnemyUnitOfAction: -1,
              indexOfSingleTargetAllyUnitOfAction: -1,
              indicesOfMultipleTargetEnemyUnitsOfAction:
                newSelectedMultipleEnemyUnitIndices,
            };
            props.clearUnitActionSelection();
            axios.post(apiEndpoints.battleController +
              '/active-ability', multipleEnemiesAbilityRequest);
          } else {
            props.updateSelectedMultipleEnemyUnitIndices(
                newSelectedMultipleEnemyUnitIndices);
            props.updateMultipleEnemySelectionCountRemaining(
                unitSelectionsRemaining);
          }
          break;
        default:
          console.warn('NOT YET IMPLEMENTED - ' + props.activeAbilityTargetSelection);
      }
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
            onError={(e)=>e.target.src='shield.svg'}
            alt=""
            className={unitImageClasses}
          />
        </Row>
        <div className='unit-labels-container'>
          {/* Second row is the unit name + health */}
          <Row style={{height: '2vh'}} noGutters>
            <p className='unit-label'>
              {
                props.unit.currentHealth}<span><img
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
              {debuff.debuffType === 'POISONED' ? (
                <p className='unit-label'>
                  {debuff.value} <span><img
                    src={'poison_debuff.svg'}
                    alt=""
                    className={'tiny-hammer-icon'}
                  /></span>
                </p>
                ) : debuff.debuffType === 'BURNING' ? (
                <p className='unit-label'>
                  {debuff.value} <span><img
                    src={'burning_debuff.svg'}
                    alt=""
                    className={'tiny-hammer-icon'}
                  /></span>
                </p>
                ) : debuff.debuffType === 'STUNNED' ? (
                <p className='unit-label'>
                  {debuff.value} <span><img
                    src={'stunned_debuff.svg'}
                    alt=""
                    className={'tiny-hammer-icon'}
                  /></span>
                </p>
                ) : debuff.debuffType === 'PERMASTUNNED' ? (
                <p className='unit-label'>
                  {'∞'} <span><img
                    src={'permastunned_debuff.svg'}
                    alt=""
                    className={'tiny-hammer-icon'}
                  /></span>
                </p>
                ) : debuff.debuffType === 'CONSTRICTED' ? (
                  <p className='unit-label'>
                    {debuff.value + '%'} <span><img
                      src={'constricted_debuff.svg'}
                      alt=""
                      className={'tiny-hammer-icon'}
                    /></span>
                  </p>
                  ) : null}
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
    activeAbilityTargetSelection: state.battleView.activeAbilityTargetSelection,
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
    battleData: state.battleView.battleData,
    ownArmySubmitted: state.battleView.ownArmySubmitted,
    gameId: state.game.gameId,
    selectedMultipleEnemyUnitIndices: state.battleView.selectedMultipleEnemyUnitIndices,
    multipleEnemySelectionCountRemaining: state.battleView.multipleEnemySelectionCountRemaining,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSelectedBattleUnitIndex: (selectedBattleUnitIndex) => dispatch(
        battleViewAC.setSelectedBattleUnitIndex(selectedBattleUnitIndex)),
    updateBattleData: (battleData) => dispatch(
        battleViewAC.setBattleData(battleData)),
    clearUnitActionSelection: () => dispatch(
        battleViewAC.clearUnitActionSelection()),
    updateSelectedMultipleEnemyUnitIndices: (selectedMultipleEnemyUnitIndices) => dispatch(
        battleViewAC.setSelectedMultipleEnemyUnitIndices(selectedMultipleEnemyUnitIndices)),
    updateMultipleEnemySelectionCountRemaining: (multipleEnemySelectionCountRemaining) => dispatch(
        battleViewAC.setMultipleEnemySelectionCountRemaining(multipleEnemySelectionCountRemaining)),
  };
};

ArmyUnit.propTypes = {
  unit: PropTypes.object,
  allUnits: PropTypes.object,
  ownUnit: PropTypes.bool,
  showEnemyArmyInBattle: PropTypes.bool,
  unitIndex: PropTypes.number,
  battleData: PropTypes.object,
  ownPlayerNumber: PropTypes.string,
  updateSelectedBattleUnitIndex: PropTypes.func,
  selectedBattleUnitIndex: PropTypes.number,
  activeAbilityTargetSelection: PropTypes.string,
  updateBattleData: PropTypes.func,
  ownArmySubmitted: PropTypes.bool,
  gameId: PropTypes.string,
  selectedMultipleEnemyUnitIndices: PropTypes.arrayOf(PropTypes.number),
  clearUnitActionSelection: PropTypes.func,
  updateSelectedMultipleEnemyUnitIndices: PropTypes.func,
  updateMultipleEnemySelectionCountRemaining: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArmyUnit);
