import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import BattleUnitDetails from './BattleUnitDetails/BattleUnitDetails';
import BattleChatDialog from './BattleChatDialog/BattleChatDialog';
import axios from 'axios';
import apiEndpoints from '../../../Utilities/apiEndpoints';
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
        retreatingPlayer: props.ownPlayerNumber,
      };
      axios.post(
          apiEndpoints.gameController +
          '/in-memory-battle-full-retreat/' + props.gameId,
          retreatRequest);
    } catch (e) {
      console.warn('Oops! There was an error trying to submit a ' +
        'full retreat request to the server!');
      console.warn(e);
    }
  };

  return (
    <React.Fragment>
      {/* First Row contains the unit details */}
      <Row>
        <BattleUnitDetails/>
      </Row>
      {/* Second Row contains the Full Retreat Button */}
      <Row>
        <Button variant="danger"
          onClick={fullRetreatHandler}>Full Retreat</Button>
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
  };
};

BattleSidebar.propTypes = {
  gameId: PropTypes.string,
  ownPlayerNumber: PropTypes.string,
};

export default connect(mapStateToProps)(BattleSidebar);
