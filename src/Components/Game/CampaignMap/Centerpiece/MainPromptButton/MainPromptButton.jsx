import React from 'react';
import Button from 'react-bootstrap/Button';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import apiEndpoints from '../../../../Utilities/apiEndpoints';
import './MainPromptButton.css';

/**
 *
 * MainPromptButton JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const MainPromptButton = (props) => {
  const endTurnHandler = async (e) => {
    e.preventDefault();
    try {
      const endTurnRequest = {
        gameId: props.gameId,
        playerEndingTurn: props.ownPlayerNumber,
      };
      await axios.post(apiEndpoints.gameController + '/end-turn',
          endTurnRequest);
    } catch (e) {
      console.warn('Oops! There was an error trying to end your turn!');
      console.warn(e);
    }
  };

  return (
    <React.Fragment>
      <Button variant='warning' size='lg' onClick={endTurnHandler}
        disabled={!props.isOwnTurn}
        className='center-button'>End Turn</Button>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    isOwnTurn: state.gamePlayer.ownPlayerNumber ===
      state.gamePlayer.playerWhoseTurnItIs,
    gameId: state.game.gameId,
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
  };
};

MainPromptButton.propTypes = {
  isOwnTurn: PropTypes.bool,
  gameId: PropTypes.string,
  ownPlayerNumber: PropTypes.string,
};

export default connect(mapStateToProps)(MainPromptButton);
