import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import BattleUnitDetails from './BattleUnitDetails/BattleUnitDetails';
import BattleChatDialog from './BattleChatDialog/BattleChatDialog';
import axios from 'axios';
import apiEndpoints from '../../../Utilities/apiEndpoints';
import gameAC from '../../../../Redux/actionCreators/gameActionCreators';
import './BattleSidebar.css';

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
    console.log('Full Retreat Request initiated...');
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
    console.log('Configuration submission initiated...');
    try {
      const ownArmy = props.battleData.attackingArmy.owner ===
        props.ownPlayerNumber ? props.battleData.attackingArmy :
        props.battleData.defendingArmy;
      const configurationSubmission = {
        gameId: props.gameId,
        playerDoneConfiguring: props.ownPlayerNumber,
        configuredArmy: ownArmy,
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

  return (
    <React.Fragment>
      {/* First Row contains the unit details */}
      <Row>
        <BattleUnitDetails/>
      </Row>
      {/* Second Row contains a couple battle-wide buttons */}
      <Row>
        {props.showEnemyArmyInBattle ? (
          <Button variant="danger"
            disabled={!props.isOwnTurn}
            onClick={fullRetreatHandler}>Full Retreat</Button>
        ) : (
          <Button variant="primary" disabled={props.ownArmySubmitted}
            onClick={submitConfigurationHandler}>Ready</Button>
        )}
      </Row>
      {/* Third Row contains the Battle Chat Dialog */}
      <Row>
        <BattleChatDialog/>
      </Row>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    gameId: state.game.gameId,
    ownPlayerNumber: state.game.ownPlayerNumber,
    showEnemyArmyInBattle: state.game.showEnemyArmyInBattle,
    battleData: state.game.battleData,
    ownArmySubmitted: state.game.ownArmySubmitted,
    isOwnTurn: state.game.battleData ?
      state.game.battleData.playerWhoseTurnItIs ===
      state.game.ownPlayerNumber : false,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateOwnArmySubmitted: (ownArmySubmitted) => dispatch(
        gameAC.setOwnArmySubmitted(ownArmySubmitted)),
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
};

export default connect(mapStateToProps, mapDispatchToProps)(BattleSidebar);
