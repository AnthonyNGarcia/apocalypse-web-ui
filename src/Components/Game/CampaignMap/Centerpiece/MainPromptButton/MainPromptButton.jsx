import React from 'react';
import Button from 'react-bootstrap/Button';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import gameAC from '../../../../../Redux/actionCreators/gameActionCreators';
import axios from 'axios';
import apiEndpoints from '../../../../Utilities/apiEndpoints';
import PLAYER from '../../../../Utilities/playerEnums';
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
    await props.updateAwaitingServerConfirmation(true);
    const ownCityTiles = props.gameBoard.filter((tile) =>
      tile.city && (tile.city.owner === props.ownPlayerNumber));
    try {
      const endTurnRequest = {
        playerEndingTurn: props.ownPlayerNumber,
        playerWhoseTurnItIs: props.ownPlayerNumber === PLAYER.ONE ?
        PLAYER.TWO : PLAYER.ONE,
        cityTiles: ownCityTiles,
      };
      await axios.post(
          apiEndpoints.gameController +
          '/in-memory-end-turn/' + props.gameId, endTurnRequest);
    } catch (e) {
      props.updateAwaitingServerConfirmation(false);
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
    isOwnTurn: state.game.isOwnTurn,
    awaitingServerConfirmation: state.game.awaitingServerConfirmation,
    gameId: state.game.gameId,
    ownPlayerNumber: state.game.ownPlayerNumber,
    gameBoard: state.game.gameBoard,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAwaitingServerConfirmation: (awaitingServerConfirmation) => dispatch(
        gameAC.setAwaitingServerConfirmation(awaitingServerConfirmation)),
  };
};

MainPromptButton.propTypes = {
  isOwnTurn: PropTypes.bool,
  awaitingServerConfirmation: PropTypes.bool,
  gameId: PropTypes.string,
  ownPlayerNumber: PropTypes.string,
  updateAwaitingServerConfirmation: PropTypes.func,
  gameBoard: PropTypes.any,
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPromptButton);
