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
import FACTIONS from '../../Utilities/factions';
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

  const saveFactionGameData = (playerData) => {
    switch (playerData.faction) {
      case FACTIONS.HUMANS.NAME:
        props.saveActionBarData(FACTIONS.HUMANS.ACTION_BAR_DATA);
        break;
      case FACTIONS.INSECTS.NAME:
        props.saveActionBarData(FACTIONS.INSECTS.ACTION_BAR_DATA);
        break;
      default:
        console.warn('Oops! An invalid faction was parsed!');
    }
  };

  const navigateToInGame = (gameData) => {
    props.saveGameId(gameData.gameId);
    props.saveGameBoard(gameData.gameBoard);
    props.savePlayerOne(gameData.playerOne);
    props.savePlayerTwo(gameData.playerTwo);
    if (gameData.playerOne.username === props.ownUsername) {
      saveFactionGameData(gameData.playerOne);
      props.updateIsOwnTurn(true);
    } else {
      saveFactionGameData(gameData.playerTwo);
    }
    props.updateMainViewToGame();
  };

  const navigateToBrowseLobbies = () => {
    props.savePlayerOneUsername(null);
    props.savePlayerTwoUsername(null);
    props.saveLobbyId(null);
    props.updateLobbyViewToBrowseLobbies();
  };

  const onReceiveMessage = (message) => {
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
      await axios.patch(
          apiEndpoints.lobbyController + '/in-memory-leave', leaveRequest);
    } catch (e) {
      console.warn('Oops! There was an error trying to leave the lobby!');
      console.warn(e);
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
      await axios.post(
          apiEndpoints.gameController + '/in-memory', startGameRequest);
    } catch (e) {
      console.warn('Oops! There was an error trying to create the lobby!');
      console.warn(e);
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
    saveGameId: (gameId) => dispatch(
        gameAC.setGameId(gameId)),
    saveGameBoard: (gameBoard) => dispatch(
        gameAC.setGameBoard(gameBoard)),
    saveActionBarData: (data) => dispatch(
        gameAC.setActionBarData(data)),
    updateIsOwnTurn: (isOwnTurn) => dispatch(
        gameAC.setIsOwnTurn(isOwnTurn)),
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
  saveGameId: PropTypes.func,
  updateMainViewToGame: PropTypes.func,
  saveGameBoard: PropTypes.func,
  savePlayerOne: PropTypes.func,
  savePlayerTwo: PropTypes.func,
  saveActionBarData: PropTypes.func,
  updateIsOwnTurn: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(InLobby);
