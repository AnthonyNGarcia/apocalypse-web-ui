import React, {useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import apiEndpoints from '../../Utilities/apiEndpoints';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PropTypes from 'prop-types';
import LOBBY_VIEWS from '../../Utilities/lobbyViews';
import lobbyAC from '../../../Redux/actionCreators/lobbyActionCreators';
import generalAC from '../../../Redux/actionCreators/generalActionCreators';
import chatAC from '../../../Redux/actionCreators/chatActionCreators';
import WEBSOCKET_TOPICS from '../../Utilities/websockets/websocketTopics';
import CHAT_TOPIC from '../../Utilities/chatTopics';
import IconAttributions from '../IconAttributions/IconAttributions';
import flattenObject from '../../Utilities/flattenObjectValuesToArray';
import './BrowseLobbies.css';

/**
 *
 * BrowseLobbies JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const BrowseLobbies = (props) => {
  const isMounted = useRef(null);

  const navigateToInLobby = async (lobbyData) => {
    if (isMounted.current) {
      const oldWebsocketTopics = [...props.websocketTopics];
      const updatedWebsocketTopics = oldWebsocketTopics.filter(
          (topic) => topic !== WEBSOCKET_TOPICS.BROWSE_LOBBIES,
      );
      updatedWebsocketTopics.push(
          WEBSOCKET_TOPICS.specificLobbyWithId(lobbyData.lobbyId));
      updatedWebsocketTopics.push(
          WEBSOCKET_TOPICS.lobbyChatWithId(lobbyData.lobbyId),
      );
      await props.saveWebsocketTopics(updatedWebsocketTopics);
    }
    if (isMounted.current) {
      await props.saveLobbyPlayerOne(lobbyData.lobbyPlayerOne);
    }
    if (isMounted.current) {
      await props.saveLobbyPlayerTwo(lobbyData.lobbyPlayerTwo);
    }
    if (isMounted.current) {
      await props.saveLobbyId(lobbyData.lobbyId);
    }
    if (isMounted.current) {
      await props.updateSelectedChatTopic(CHAT_TOPIC.LOBBY);
    }
    if (isMounted.current) {
      props.updateLobbyViewToInLobby();
    }
  };

  const createLobbyHandler = async (e, gameId) => {
    e.preventDefault();
    props.updateGameIdBeingRestored(gameId);
    if (props.ownUsername === 'Default Username') {
      return;
    }

    try {
      const createLobbyRequest = {
        creator: {
          username: props.ownUsername,
          userId: props.ownUserId,
        },
      };
      const serverResponse = await axios.post(
          apiEndpoints.lobbyController + '/create', createLobbyRequest);
      await navigateToInLobby(serverResponse.data);
    } catch (error) {
      console.warn('Failed to create a new lobby!');
      console.warn(error);
    }
  };

  const deleteSavedGame = async (e, gameId) => {
    e.preventDefault();
    const newSavedGames = JSON.parse(localStorage.getItem('SAVED_GAMES'));
    delete newSavedGames[gameId];
    localStorage.setItem('SAVED_GAMES', JSON.stringify(newSavedGames));
    props.updateSavedGames(newSavedGames);
  };

  const joinLobbyHandler = async (e, lobbyId) => {
    e.preventDefault();
    try {
      const joinLobbyRequest = {
        lobbyId: lobbyId,
        inLobbyPlayer: {
          username: props.ownUsername,
          userId: props.ownUserId,
        },
      };
      const response = await axios.patch(
          apiEndpoints.lobbyController + '/join', joinLobbyRequest);
      await navigateToInLobby(response.data);
    } catch (error) {
      console.warn('Failed to join Lobby ' + lobbyId + '!');
      console.warn(error);
    }
  };

  const refreshLobbiesHandler = async (e) => {
    e.preventDefault();
    const serverResponse = await
    axios.get(apiEndpoints.lobbyController + '/all');
    if (isMounted.current) {
      props.saveLobbyList(serverResponse.data);
    }
  };

  useEffect(async () => {
    isMounted.current = true;
    const savedGamesFromLocalStorage = localStorage.getItem('SAVED_GAMES');
    const parsedSavedGames = JSON.parse(savedGamesFromLocalStorage);
    if (parsedSavedGames) {
      props.updateSavedGames(parsedSavedGames);
    } else {
      props.updateSavedGames({});
    }
    const fetchCurrentLobbies = async () => {
      const serverResponse = await
      axios.get(apiEndpoints.lobbyController + '/all');
      if (isMounted.current) {
        props.saveLobbyList(serverResponse.data);
      }
    };
    fetchCurrentLobbies();
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <React.Fragment>
      <Container>
        <Row>
          <Col xs={8}>
            <h3>Open Lobbies</h3>
          </Col>
          <Col xs={4}>
            <Button variant="primary"
              onClick={(e) => refreshLobbiesHandler(e)}>Refresh</Button>
          </Col>
        </Row>
        {props.lobbyList && props.lobbyList.length > 0 ?
          props.lobbyList.map((lobby) =>
            <Row key={lobby.lobbyId}>
              <Col>
                <p>{lobby.lobbyPlayerOne.username + '\'s Lobby' +
                (lobby.lobbyPlayerTwo ? ' (2/2)' : ' (1/2)')}</p>
              </Col>
              <Col>
                <Button variant="primary"
                  disabled={lobby.lobbyPlayerOne && lobby.lobbyPlayerTwo}
                  onClick={(e) => joinLobbyHandler(e, lobby.lobbyId)}>
                  Join</Button>
              </Col>
            </Row>) : <p>No lobbies available to join. Try creating one!</p>}
        <Row>
          <Col xs={12}>
            <h3>Saved Games</h3>
          </Col>
        </Row>
        {props.savedGames && flattenObject(props.savedGames).length > 0 ?
          flattenObject(props.savedGames).reverse().map((game) =>
            <Row key={game.gameId}>
              <Col cx={8}>
                <p>{game.gameLastInteractionTimestamp + ' (Turn ' +
                game.round + ')'}</p>
              </Col>
              <Col cx={2}>
                <Button variant="primary"
                  onClick={(e) => createLobbyHandler(e, game.gameId)}>
                  Load</Button>
              </Col>
              <Col cx={2}>
                <Button variant="danger"
                  onClick={(e) => deleteSavedGame(e, game.gameId)}>
                  Delete</Button>
              </Col>
            </Row>) : <p>No saved games to load.</p>}
        <Row>
          <Button variant="primary"
            onClick={(e) => createLobbyHandler(e, 'NONE')}>
              Create Lobby
          </Button>
        </Row>
      </Container>
      <IconAttributions/>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    ownUsername: state.general.ownUsername,
    ownUserId: state.general.ownUserId,
    savedGames: state.general.savedGames,
    lobbyList: state.lobby.lobbyList,
    websocketTopics: state.general.websocketTopics,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateLobbyViewToInLobby: () => dispatch(
        lobbyAC.setLobbyView(LOBBY_VIEWS.IN_LOBBY_VIEW)),
    saveLobbyId: (lobbyId) => dispatch(
        lobbyAC.setLobbyId(lobbyId)),
    saveLobbyList: (lobbyList) => dispatch(
        lobbyAC.setLobbyList(lobbyList)),
    saveLobbyPlayerOne: (lobbyPlayerOne) => dispatch(
        lobbyAC.setLobbyPlayerOne(lobbyPlayerOne)),
    saveLobbyPlayerTwo: (lobbyPlayerTwo) => dispatch(
        lobbyAC.setLobbyPlayerTwo(lobbyPlayerTwo)),
    saveWebsocketTopics: (websocketTopics) => dispatch(
        generalAC.setWebsocketTopics(websocketTopics)),
    updateSelectedChatTopic: (selectedChatTopic) => dispatch(
        chatAC.setSelectedChatTopic(selectedChatTopic)),
    updateGameIdBeingRestored: (gameIdBeingRestored) => dispatch(
        generalAC.setGameIdBeingRestored(gameIdBeingRestored)),
    updateSavedGames: (savedGames) => dispatch(
        generalAC.setSavedGames(savedGames)),
  };
};

BrowseLobbies.propTypes = {
  ownUsername: PropTypes.string,
  ownUserId: PropTypes.string,
  savedGames: PropTypes.object,
  lobbyList: PropTypes.array,
  websocketTopics: PropTypes.array,
  saveLobbyId: PropTypes.func,
  saveLobbyList: PropTypes.func,
  saveLobbyPlayerOne: PropTypes.func,
  saveLobbyPlayerTwo: PropTypes.func,
  saveWebsocketTopics: PropTypes.func,
  updateLobbyViewToInLobby: PropTypes.func,
  updateSelectedChatTopic: PropTypes.func,
  updateGameIdBeingRestored: PropTypes.func,
  updateSavedGames: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(BrowseLobbies);
