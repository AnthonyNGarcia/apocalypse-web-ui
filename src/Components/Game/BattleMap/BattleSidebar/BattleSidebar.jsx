import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import BattleUnitDetails from './BattleUnitDetails/BattleUnitDetails';
import axios from 'axios';
import apiEndpoints from '../../../Utilities/apiEndpoints';
import battleViewAC from
  '../../../../Redux/actionCreators/battleViewActionCreators';
import './BattleSidebar.css';
import ASTRIDIUM_ABILITY_TYPE from '../../../Utilities/astridiumAbilityTypes';
import PLAYER from '../../../Utilities/playerEnums';

/**
 *
 * BattleSidebar JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const BattleSidebar = (props) => {
  const fullRetreatHandler = (e) => {
    e.preventDefault();
    try {
      const retreatRequest = {
        gameId: props.gameId,
        retreatingPlayer: props.ownPlayerNumber,
      };
      axios.post(
          apiEndpoints.battleController +
          '/retreat',
          retreatRequest);
    } catch (e) {
      console.warn('Oops! There was an error trying to submit a ' +
        'full retreat request to the server!');
      console.warn(e);
    }
  };

  const submitConfigurationHandler = (e) => {
    e.preventDefault();
    try {
      const ownArmy = props.battleData.attackingArmy.owner ===
        props.ownPlayerNumber ? props.battleData.attackingArmy :
        props.battleData.defendingArmy;
      const configurationSubmission = {
        gameId: props.gameId,
        playerDoneConfiguring: props.ownPlayerNumber,
        configuredArmyUnits: ownArmy.units,
      };
      axios.post(
          apiEndpoints.battleController +
          '/configuration',
          configurationSubmission);
      props.updateOwnArmySubmitted(true);
    } catch (e) {
      console.warn('Oops! There was an error trying to submit the ' +
        'army configuration to the server!');
      console.warn(e);
    }
  };

  const orbitalFractureHandler = (e) => {
    e.preventDefault();
    try {
      const request = {
        gameId: props.gameId,
        playerPerformingAction: props.ownPlayerNumber,
      };
      axios.post(apiEndpoints.battleController + '/orbital-fracture', request);
    } catch (error) {
      console.warn('Error trying to perform Orbital Fracture!');
      console.warn(error);
    }
  };

  return (
    <div className='battle-sidebar-container'>
      {/* First Row contains the unit details */}
      <Row noGutters>
        <BattleUnitDetails/>
      </Row>
      {/* Second Row contains a couple battle-wide buttons */}
      <Row noGutters>
        <Col md={4}>
          {props.showEnemyArmyInBattle ? (
            <OverlayTrigger
              key='full-retreat-overlay'
              placement='bottom'
              trigger={['hover', 'focus']}
              overlay={
                <Tooltip id='full-retreat-tooltip'>
                  <strong>{
                  (!props.battleData.tilePositionsThatDefenderCanRetreatTo ||
              props.battleData.tilePositionsThatDefenderCanRetreatTo
                  .length <= 0 && props.battleData.defendingArmy.owner ===
                  props.ownPlayerNumber) ? 'Can\'t Retreat!' : 'Full Retreat'
                  }</strong> - {
                    (!props.battleData.tilePositionsThatDefenderCanRetreatTo ||
              props.battleData.tilePositionsThatDefenderCanRetreatTo
                  .length <= 0 && props.battleData.defendingArmy.owner ===
                  props.ownPlayerNumber) ? 'You have nowhere to run. ' +
                        'You must make your stand here!' : !props.isOwnTurn ?
                      'You must wait for your turn to retreat.' :
                      'Sometimes it is better to live to fight another day. ' +
                      'Retreating will save your soldiers and Commander.'}
                </Tooltip >
              }>
              <span>
                <Button variant="danger"
                  disabled={!props.isOwnTurn || (
                    (!props.battleData.tilePositionsThatDefenderCanRetreatTo ||
              props.battleData.tilePositionsThatDefenderCanRetreatTo
                  .length <= 0) && props.battleData.defendingArmy.owner ===
                  props.ownPlayerNumber)}
                  onClick={fullRetreatHandler}
                  style={!props.isOwnTurn || (
                    (!props.battleData.tilePositionsThatDefenderCanRetreatTo ||
              props.battleData.tilePositionsThatDefenderCanRetreatTo
                  .length <= 0) && props.battleData.defendingArmy.owner ===
                  props.ownPlayerNumber) ?
                    {pointerEvents: 'none'} : {}}>
                  {(!props.battleData.tilePositionsThatDefenderCanRetreatTo ||
              props.battleData.tilePositionsThatDefenderCanRetreatTo
                  .length <= 0 && props.battleData.defendingArmy.owner ===
                  props.ownPlayerNumber) ? 'Can\'t Retreat!' : 'Full Retreat'}
                </Button>
              </span>
            </OverlayTrigger>
        ) : (
          <Button variant="primary" disabled={props.ownArmySubmitted}
            onClick={submitConfigurationHandler}>Ready</Button>
        )}
        </Col>
        <Col md={8}>
          <OverlayTrigger
            key='orbital-fracture-overlay'
            placement='bottom'
            trigger={['hover', 'focus']}
            overlay={
              <Tooltip id='orbital-fracture-tooltip'>
                <strong>{props.orbitalFracture.displayName}</strong> - {
                  props.orbitalFracture.description}
              </Tooltip >
            }>
            <span>
              <Button variant="primary"
                disabled={!props.isOwnTurn || !props.showEnemyArmyInBattle ||
                  (props.ownPlayerData.currentAstridium <
                    props.orbitalFracture.astridiumCost)}
                onClick={orbitalFractureHandler}
                style={!props.isOwnTurn || !props.showEnemyArmyInBattle ||
                  (props.ownPlayerData.currentAstridium <
                    props.orbitalFracture.astridiumCost) ?
                    {pointerEvents: 'none'} : {}}>
                <span>
                  {props.orbitalFracture.displayName} ({
                    props.orbitalFracture.astridiumCost} <img
                    src={'ASTEROID.svg'}
                    alt=""
                    className={'tiny-asteroid-icon-battle'}/>)
                </span>
              </Button>
            </span>
          </OverlayTrigger>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    gameId: state.game.gameId,
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
    showEnemyArmyInBattle: state.battleView.showEnemyArmyInBattle,
    battleData: state.battleView.battleData,
    ownArmySubmitted: state.battleView.ownArmySubmitted,
    isOwnTurn: state.battleView.battleData ?
      state.battleView.battleData.playerWhoseTurnItIs ===
      state.gamePlayer.ownPlayerNumber : false,
    orbitalFracture: state.game.gameConstants.allAstridiumAbilities[
        ASTRIDIUM_ABILITY_TYPE.ORBITAL_FRACTURE],
    ownPlayerData: state.gamePlayer.ownPlayerNumber ===
    PLAYER.ONE ? state.gamePlayer.playerOne : state.gamePlayer.playerTwo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateOwnArmySubmitted: (ownArmySubmitted) => dispatch(
        battleViewAC.setOwnArmySubmitted(ownArmySubmitted)),
  };
};

BattleSidebar.propTypes = {
  gameId: PropTypes.string,
  ownPlayerNumber: PropTypes.string,
  showEnemyArmyInBattle: PropTypes.bool,
  battleData: PropTypes.any,
  ownArmySubmitted: PropTypes.bool,
  updateOwnArmySubmitted: PropTypes.func,
  isOwnTurn: PropTypes.bool,
  orbitalFracture: PropTypes.any,
  ownPlayerData: PropTypes.any,
};

export default connect(mapStateToProps, mapDispatchToProps)(BattleSidebar);
