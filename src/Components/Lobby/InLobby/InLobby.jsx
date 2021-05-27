import React, {useRef} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import AbstractedWebsocket from '../../Utilities/AbstractedWebsocket';
import LOBBY_VIEWS from '../../Utilities/lobbyViews';
import lobbyAC from '../../../Redux/actionCreators/lobbyActionCreators';
import gameAC from '../../../Redux/actionCreators/gameActionCreators';
import generalAC from '../../../Redux/actionCreators/generalActionCreators';
import MAIN_VIEWS from '../../Utilities/mainViews';
import axios from 'axios';
import apiEndpoints from '../../Utilities/apiEndpoints';
import './InLobby.css';

/**
 *
 * InLobby JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const InLobby = (props) => {
  const websocket = useRef(null);

  const navigateToInGame = (gameData) => {
    props.updateGameId(gameData.gameId);
    props.updateGameBoard(gameData.gameBoard);
    props.savePlayerOne(gameData.playerOne);
    props.savePlayerTwo(gameData.playerTwo);
    props.updateMainViewToGame();
  };

  const navigateToBrowseLobbies = () => {
    props.savePlayerOneUsername(null);
    props.savePlayerTwoUsername(null);
    props.saveLobbyId(null);
    props.updateLobbyViewToBrowseLobbies();
  };

  const onReceiveMessage = (message) => {
    console.log(message);
    const playerOneUsername = message.body.playerOneUsername;
    if (!playerOneUsername) {
      navigateToBrowseLobbies();
    }
    const playerTwoUsername = message.body.playerTwoUsername;
    if (playerTwoUsername !== props.playerTwoUsername) {
      if (props.ownUsername === props.playerTwoUsername) {
        navigateToBrowseLobbies();
      } else {
        props.savePlayerTwoUsername(playerTwoUsername);
      }
    }

    if (message.body.gameId) {
      console.log('Game starting!');
      console.log(message.body);
      navigateToInGame(message.body);
    }
  };

  const leaveLobbyHandler = async (e) => {
    e.preventDefault();
    try {
      const leaveRequest = {
        lobbyId: props.lobbyId,
        playerUsername: props.ownUsername,
      };
      const serverResponse = await axios.patch(
          apiEndpoints.lobbyController + '/in-memory-leave', leaveRequest);
      console.log(serverResponse);
    } catch (e) {
      console.log('Oops! There was an error trying to leave the lobby!');
      console.log(e);
    }
  };

  const startGameHandler = async (e) => {
    e.preventDefault();
    try {
      const startGameRequest = {
        lobbyId: props.lobbyId,
        playerOneUsername: props.playerOneUsername,
        playerTwoUsername: props.playerTwoUsername,
      };
      const serverResponse = await axios.post(
          apiEndpoints.gameController + '/in-memory', startGameRequest);
      console.log(serverResponse);
    } catch (e) {
      console.log('Oops! There was an error trying to create the lobby!');
      console.log(e);
    }
  };

  return (
    <React.Fragment>
      <AbstractedWebsocket topics={['/lobby/' + props.lobbyId]}
        onReceiveMessage={onReceiveMessage} ref={websocket}/>
      <h3>In Lobby Component</h3>
      <Container>
        <Row>
          <h4>Lobby Id: {props.lobbyId}</h4>
        </Row>
        <Row>
          <Col>
            <h4>Player One: {props.playerOneUsername}</h4>
          </Col>
          <Col>
            <h4>Player Two: {props.playerTwoUsername}</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="primary" onClick={leaveLobbyHandler}>Leave</Button>
          </Col>
          <Col>
            {props.ownUsername === props.playerOneUsername ?
            <Button variant="primary"
              disabled={props.playerOneUsername === null ||
                props.playerTwoUsername === null}
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
    lobbyId: state.lobby.lobbyId,
    playerOneUsername: state.lobby.playerOneUsername,
    playerTwoUsername: state.lobby.playerTwoUsername,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateLobbyViewToBrowseLobbies: () => dispatch(
        lobbyAC.setLobbyView(LOBBY_VIEWS.BROWSE_LOBBIES_VIEW)),
    savePlayerOneUsername: (username) => dispatch(
        lobbyAC.setPlayerOneUsername(username)),
    savePlayerTwoUsername: (username) => dispatch(
        lobbyAC.setPlayerTwoUsername(username)),
    saveLobbyId: (lobbyId) => dispatch(
        lobbyAC.setLobbyId(lobbyId)),
    updateMainViewToGame: () => dispatch(
        generalAC.setMainView(MAIN_VIEWS.GAME_VIEW)),
    savePlayerOne: (player) => dispatch(
        gameAC.setPlayerOne(player)),
    savePlayerTwo: (player) => dispatch(
        gameAC.setPlayerTwo(player)),
    updateGameId: (gameId) => dispatch(
        gameAC.setGameId(gameId)),
    updateGameBoard: (gameBoard) => dispatch(
        gameAC.setGameBoard(gameBoard)),
  };
};

InLobby.propTypes = {
  ownUsername: PropTypes.string,
  lobbyId: PropTypes.string,
  playerOneUsername: PropTypes.string,
  playerTwoUsername: PropTypes.string,
  updateLobbyViewToBrowseLobbies: PropTypes.func,
  savePlayerOneUsername: PropTypes.func,
  savePlayerTwoUsername: PropTypes.func,
  saveLobbyId: PropTypes.func,
  updateGameId: PropTypes.func,
  updateMainViewToGame: PropTypes.func,
  updateGameBoard: PropTypes.func,
  savePlayerOne: PropTypes.func,
  savePlayerTwo: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(InLobby);
