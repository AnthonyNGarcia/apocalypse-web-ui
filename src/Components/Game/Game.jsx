import React, {useRef} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import GAME_VIEWS from '../Utilities/gameViews';
import flattenObject from '../Utilities/flattenObjectValuesToArray';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import AbstractedWebsocket from '../Utilities/AbstractedWebsocket';
import CampaignMap from './CampaignMap/CampaignMap';
import MAIN_VIEWS from '../Utilities/mainViews';
import LOBBY_VIEWS from '../Utilities/lobbyViews';
import generalAC from '../../Redux/actionCreators/generalActionCreators';
import gameAC from '../../Redux/actionCreators/gameActionCreators';
import lobbyAC from '../../Redux/actionCreators/lobbyActionCreators';
import apiEndpoints from '../Utilities/apiEndpoints';
import axios from 'axios';
import {useBeforeunload} from 'react-beforeunload';
import PLAYER from '../Utilities/playerEnums';
import './Game.css';

/**
 *
 * Game JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const Game = (props) => {
  const websocket = useRef(null);

  const gameCleanup = () => {
    try {
      const leaveRequest = {
        gameId: props.gameId,
        playerUsername: props.ownUsername,
      };
      axios.patch(
          apiEndpoints.gameController + '/in-memory-leave', leaveRequest);
    } catch (e) {
      console.warn('Oops! There was an error trying to leave the game!');
      console.warn(e);
    }
  };

  useBeforeunload(() => {
    gameCleanup();
  });

  const leaveGameHandler = (e) => {
    e.preventDefault();
    gameCleanup();
    navigateToBrowseLobbies();
  };

  const navigateToBrowseLobbies = () => {
    props.saveGameId(null);
    props.clearLobbyId();
    props.clearLobbyPlayerOneUsername();
    props.clearLobbyPlayerTwoUsername();
    props.updateLobbyViewToBrowseLobbies();
    props.updateMainViewToLobby();
  };

  const onReceiveMessage = (message) => {
    console.log(message);
    const playerOneUsername = message.body.playerOneUsername;
    const playerTwoUsername = message.body.playerTwoUsername;
    if (!playerOneUsername || !playerTwoUsername) {
      console.log('A player has left! Closing game...');
      gameCleanup();
      navigateToBrowseLobbies();
    }
  };

  const onDisconnect = () => {
    console.log('Disconnected from game websocket!');
    gameCleanup();
    navigateToBrowseLobbies();
  };

  return (
    <React.Fragment>
      <AbstractedWebsocket topics={['/game/' + props.gameId]}
        onReceiveMessage={onReceiveMessage} ref={websocket}
        onDisconnect={onDisconnect}/>
      <Container className='game-sizing'>
        <Row>
          <Col className={(props.playerWhoseTurnItIs === PLAYER.ONE ?
              'active-turn center-text player-label' :
              'inactive-turn center-text player-label') + (
                props.ownPlayerNumber === PLAYER.ONE ? ' own-player-label' :
                ' other-player-label')}>
            <h3>{props.playerOneUsername}</h3>
          </Col>
          <Col className={(props.playerWhoseTurnItIs === PLAYER.TWO ?
              'active-turn center-text player-label' :
              'inactive-turn center-text player-label') + (
                props.ownPlayerNumber === PLAYER.TWO ? ' own-player-label' :
                ' other-player-label')}>
            <h3>{props.playerTwoUsername}</h3>
          </Col>
        </Row>
        <Row>
          {props.gameView === GAME_VIEWS.CAMPAIGN_MAP_VIEW ?
          <CampaignMap/> : props.gameView === GAME_VIEWS.BATTLE_MAP_VIEW ?
          <p>Battle Map Pending...</p> :
          <p>Oops! An invalid game view was rendered!</p>}
        </Row>
        <Row>
          <Button variant="primary" onClick={leaveGameHandler}>Leave</Button>
        </Row>
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    gameView: state.game.gameView,
    gameId: state.game.gameId,
    ownUsername: state.general.ownUsername,
    playerOneUsername: state.game.playerOne ?
      state.game.playerOne.username : 'error',
    playerTwoUsername: state.game.playerTwo ?
      state.game.playerTwo.username : 'error',
    playerWhoseTurnItIs: state.game.playerWhoseTurnItIs,
    ownPlayerNumber: state.game.ownPlayerNumber,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMainViewToLobby: () => dispatch(
        generalAC.setMainView(MAIN_VIEWS.LOBBY_VIEW)),
    updateLobbyViewToBrowseLobbies: () => dispatch(
        lobbyAC.setLobbyView(LOBBY_VIEWS.BROWSE_LOBBIES_VIEW)),
    clearPlayerOne: () => dispatch(
        gameAC.setPlayerOne(null)),
    clearPlayerTwo: () => dispatch(
        gameAC.setPlayerTwo(null)),
    saveGameId: (gameId) => dispatch(
        gameAC.setGameId(gameId)),
    clearLobbyPlayerOneUsername: () => dispatch(
        lobbyAC.setPlayerOneUsername(null)),
    clearLobbyPlayerTwoUsername: () => dispatch(
        lobbyAC.setPlayerTwoUsername(null)),
    clearLobbyId: () => dispatch(
        lobbyAC.setLobbyId(null)),
  };
};

Game.propTypes = {
  gameView: PropTypes.oneOf(flattenObject(GAME_VIEWS)),
  gameId: PropTypes.string,
  ownUsername: PropTypes.string,
  playerOneUsername: PropTypes.string,
  playerTwoUsername: PropTypes.string,
  updateMainViewToLobby: PropTypes.func,
  updateLobbyViewToBrowseLobbies: PropTypes.func,
  clearPlayerOne: PropTypes.func,
  clearPlayerTwo: PropTypes.func,
  clearLobbyPlayerOneUsername: PropTypes.func,
  clearLobbyPlayerTwoUsername: PropTypes.func,
  clearLobbyId: PropTypes.func,
  saveGameId: PropTypes.func,
  playerWhoseTurnItIs: PropTypes.oneOf(flattenObject(PLAYER)),
  ownPlayerNumber: PropTypes.oneOf(flattenObject(PLAYER)),
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
