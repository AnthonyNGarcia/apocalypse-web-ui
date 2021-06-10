import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import gameAC from '../../../../../Redux/actionCreators/gameActionCreators';
import './ArmyUnit.css';

/**
 *
 * ArmyUnit JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const ArmyUnit = (props) => {
  const [fullUnitInfo, setFullUnitInfo] = useState(null);
  const [ownArmy, setOwnArmy] = useState(null);

  useEffect( () => {
    if (props.unit && props.unit.unitType) {
      const freshFullUnitInfo = props.allUnits[props.unit.unitType];
      setFullUnitInfo(freshFullUnitInfo);
    }
    if (props.battleData) {
      const attackingArmy = props.battleData.attackingArmy;
      const defendingArmy = props.battleData.defendingArmy;
      if (attackingArmy.owner === props.ownPlayerNumber) {
        setOwnArmy(attackingArmy);
      } else {
        setOwnArmy(defendingArmy);
      }
    }
  }, [props]);

  const selectUnitHandler = async (e, justSelectedUnitIndex) => {
    e.preventDefault();
    console.log('selected a unit at index ' + justSelectedUnitIndex);
    console.log(props.ownArmySubmitted);
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
      console.log('Functionality for unit clicking outside of ' +
        'configuring one\'s army is still pending!');
    }
  };

  if (!props.ownUnit && !props.showEnemyArmyInBattle) {
    return (
      <React.Fragment>
        <Row style={{height: '2.5vh'}} noGutters
          onClick={props.ownUnit ?
            (e) => selectUnitHandler(e, props.unitIndex) : null}
          className={props.selectedBattleUnitIndex === props.unitIndex ?
                  'own-selected-unit' : ''}>
          <p className='army-unit-image empty-unit-image'
            style={{width: '1.5vw'}}></p>
        </Row>
      </React.Fragment>
    );
  }

  if (props.unit && fullUnitInfo) {
    return (
      <React.Fragment>
        {/* First row is the unit image */}
        <Row style={{height: '4vh'}} noGutters
          onClick={props.ownUnit ?
            (e) => selectUnitHandler(e, props.unitIndex) : null}
          className={props.selectedBattleUnitIndex === props.unitIndex ?
                  'own-selected-unit' : ''}>
          <img
            src={props.unit.unitType + '_ICON.svg'}
            onError={(e)=>e.target.src='shield.png'}
            alt=""
            className={props.ownUnit ? 'army-unit-image own-unit-image' :
             'army-unit-image enemy-unit-image'}
          />
        </Row>
        {/* Second row is the unit name + health */}
        <Row style={{height: '2vh'}} noGutters>
          <p className='unit-label'>
            {
              props.unit.currentHealth}/{fullUnitInfo
                .baseMaxHealth} <span><img
              src={'health.svg'}
              alt=""
              className={'tiny-hammer-icon'}
            /></span>
          </p>
        </Row>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Row style={{height: '2.5vh'}} noGutters
          onClick={props.ownUnit ?
            (e) => selectUnitHandler(e, props.unitIndex) : null}>
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
    showEnemyArmyInBattle: state.game.showEnemyArmyInBattle,
    selectedBattleUnitIndex: state.game.selectedBattleUnitIndex,
    ownPlayerNumber: state.game.ownPlayerNumber,
    battleData: state.game.battleData,
    ownArmySubmitted: state.game.ownArmySubmitted,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSelectedBattleUnitIndex: (selectedBattleUnitIndex) => dispatch(
        gameAC.setSelectedBattleUnitIndex(selectedBattleUnitIndex)),
    updateBattleData: (battleData) => dispatch(
        gameAC.setBattleData(battleData)),
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
};

export default connect(mapStateToProps, mapDispatchToProps)(ArmyUnit);
