import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import GAME_VIEWS from '../Utilities/gameViews';
import flattenObject from '../Utilities/flattenObjectValuesToArray';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import CampaignMap from './CampaignMap/CampaignMap';
import BattleMap from './BattleMap/BattleMap';
import {useBeforeunload} from 'react-beforeunload';
import axios from 'axios';
import apiEndpoints from '../Utilities/apiEndpoints';
import './Game.css';

/**
 *
 * Game JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const Game = (props) => {
  const gameCleanup = () => {
    if (props.gameId) {
      const leaveGameRequest = {
        gameId: props.gameId,
        inGamePlayer: {
          userId: props.ownUserId,
        },
      };
      axios.patch(apiEndpoints.gameController + '/leave', leaveGameRequest);
    }
  };

  useBeforeunload(() => {
    gameCleanup();
  });

  return (
    <React.Fragment>
      <Container className='game-sizing' fluid>
        <Row>
          {props.gameView === GAME_VIEWS.GAME_BOARD_VIEW ?
          <CampaignMap/> : props.gameView === GAME_VIEWS.BATTLE_MAP_VIEW ?
          <BattleMap/> :
          <p>Oops! An invalid game view was rendered!</p>}
        </Row>
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    gameView: state.game.gameView,
    gameId: state.game.gameId,
    ownUserId: state.general.ownUserId,
  };
};

Game.propTypes = {
  gameView: PropTypes.oneOf(flattenObject(GAME_VIEWS)),
  gameId: PropTypes.string,
  ownUserId: PropTypes.string,
};

export default connect(mapStateToProps)(Game);
