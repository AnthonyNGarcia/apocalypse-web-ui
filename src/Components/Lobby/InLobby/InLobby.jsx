import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import LOBBY_VIEWS from '../../Utilities/lobbyViews';
import lobbyAC from '../../../Redux/actionCreators/lobbyActionCreators';
import gameAC from '../../../Redux/actionCreators/gameActionCreators';
import generalAC from '../../../Redux/actionCreators/generalActionCreators';
import MAIN_VIEWS from '../../Utilities/mainViews';
import axios from 'axios';
import apiEndpoints from '../../Utilities/apiEndpoints';
import {useBeforeunload} from 'react-beforeunload';
import './InLobby.css';

/**
 *
 * InLobby JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const InLobby = (props) => {
  const lobbyCleanup = () => {
    if (props.lobbyId) {
      try {
        const leaveRequest = {
          lobbyId: props.lobbyId,
          inLobbyPlayer: props.ownUserId === props.lobbyPlayerOne.userId ?
          props.lobbyPlayerOne : props.lobbyPlayerTwo,
        };
        axios.patch(
            apiEndpoints.lobbyController + '/leave', leaveRequest);
      } catch (e) {
        console.warn('Oops! There was an error trying to leave the lobby!');
        console.warn(e);
      }
    }
  };

  useBeforeunload(() => {
    lobbyCleanup();
  });

  const leaveLobbyHandler = async (e) => {
    e.preventDefault();
    lobbyCleanup();
  };

  const startGameHandler = async (e) => {
    e.preventDefault();
    try {
      const startGameRequest = {
        lobbyId: props.lobbyId,
        lobbyPlayerOne: props.lobbyPlayerOne,
        lobbyPlayerTwo: props.lobbyPlayerTwo,
      };
      await axios.post(
          apiEndpoints.gameController + '/start', startGameRequest);
    } catch (e) {
      console.warn('Oops! There was an error trying to create the lobby!');
      console.warn(e);
    }
  };

  return (
    <React.Fragment>
      <h3>In Lobby Component</h3>
      <Container>
        <Row>
          <h4>Lobby Id: {props.lobbyId}</h4>
        </Row>
        <Row>
          <Col>
            <h4>Player One: {props.lobbyPlayerOne ?
            props.lobbyPlayerOne.username : ''}</h4>
          </Col>
          <Col>
            <h4>Player Two: {props.lobbyPlayerTwo ?
            props.lobbyPlayerTwo.username : ''}</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="primary" onClick={leaveLobbyHandler}>Leave</Button>
          </Col>
          <Col>
            {props.ownUserId === props.lobbyPlayerOne.userId ?
            <Button variant="primary"
              disabled={props.lobbyPlayerOne === null ||
                props.lobbyPlayerTwo === null}
              onClick={startGameHandler}>Start</Button> :
            null}
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    ownUsername: state.general.ownUsername,
    ownUserId: state.general.ownUserId,
    lobbyId: state.lobby.lobbyId,
    lobbyPlayerOne: state.lobby.lobbyPlayerOne,
    lobbyPlayerTwo: state.lobby.lobbyPlayerTwo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateLobbyViewToBrowseLobbies: () => dispatch(
        lobbyAC.setLobbyView(LOBBY_VIEWS.BROWSE_LOBBIES_VIEW)),
    saveLobbyPlayerOne: (lobbyPlayerOne) => dispatch(
        lobbyAC.setLobbyPlayerOne(lobbyPlayerOne)),
    saveLobbyPlayerTwo: (lobbyPlayerTwo) => dispatch(
        lobbyAC.setLobbyPlayerTwo(lobbyPlayerTwo)),
    saveLobbyId: (lobbyId) => dispatch(
        lobbyAC.setLobbyId(lobbyId)),
    updateMainViewToGame: () => dispatch(
        generalAC.setMainView(MAIN_VIEWS.GAME_VIEW)),
    savePlayerOne: (player) => dispatch(
        gameAC.setPlayerOne(player)),
    savePlayerTwo: (player) => dispatch(
        gameAC.setPlayerTwo(player)),
    saveGameId: (gameId) => dispatch(
        gameAC.setGameId(gameId)),
    saveGameBoard: (gameBoard) => dispatch(
        gameAC.setGameBoard(gameBoard)),
    saveActionBarData: (data) => dispatch(
        gameAC.setActionBarData(data)),
    updatePlayerWhoseTurnItIs: (playerWhoseTurnItIs) => dispatch(
        gameAC.setPlayerWhoseTurnItIs(playerWhoseTurnItIs)),
    saveGameConstants: (gameConstants) => dispatch(
        gameAC.setGameConstants(gameConstants)),
    saveOwnPlayerNumber: (ownPlayerNumber) => dispatch(
        gameAC.setOwnPlayerNumber(ownPlayerNumber)),
  };
};

InLobby.propTypes = {
  ownUsername: PropTypes.string,
  ownUserId: PropTypes.string,
  lobbyId: PropTypes.string,
  lobbyPlayerOne: PropTypes.any,
  lobbyPlayerTwo: PropTypes.any,
  updateLobbyViewToBrowseLobbies: PropTypes.func,
  saveLobbyPlayerOne: PropTypes.func,
  saveLobbyPlayerTwo: PropTypes.func,
  saveLobbyId: PropTypes.func,
  saveGameId: PropTypes.func,
  updateMainViewToGame: PropTypes.func,
  saveGameBoard: PropTypes.func,
  savePlayerOne: PropTypes.func,
  savePlayerTwo: PropTypes.func,
  saveActionBarData: PropTypes.func,
  updatePlayerWhoseTurnItIs: PropTypes.func,
  saveGameConstants: PropTypes.func,
  saveOwnPlayerNumber: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(InLobby);
